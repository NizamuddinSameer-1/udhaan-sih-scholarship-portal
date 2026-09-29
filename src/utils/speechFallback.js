/**
 * Web Speech Synthesis Utility with Hindi & English Voice Fallback
 */

export function speakDeficiencyText({ text, lang = 'hi-IN', onStart, onEnd, onError }) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onError) onError(new Error('Web Speech API is not supported in this browser.'));
    return { supported: false, voiceUsed: null };
  }

  // Cancel any existing utterance
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // Slightly slower for clarity
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = null;

  if (lang.startsWith('hi')) {
    // Look for Hindi voice
    selectedVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'));
  }

  // Fallback to Indian English or default
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang === 'en-IN' || v.lang.startsWith('en'));
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  } else {
    utterance.lang = lang;
  }

  utterance.onstart = () => {
    if (onStart) onStart({ voice: selectedVoice?.name || 'Default System Voice', lang: utterance.lang });
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    if (onError) onError(e);
  };

  window.speechSynthesis.speak(utterance);

  return {
    supported: true,
    voiceUsed: selectedVoice ? `${selectedVoice.name} (${selectedVoice.lang})` : 'Default System Voice'
  };
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
