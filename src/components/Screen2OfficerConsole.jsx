import React, { useEffect, useRef, useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowRight,
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Send, 
  Users, 
  FileCheck, 
  HelpCircle, 
  History, 
  Sparkles, 
  AlertCircle, 
  FileText,
  UserCheck,
  ShieldCheck,
  Building2,
  MapPin,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Radio,
  FileQuestion,
  CornerDownRight,
  X
} from 'lucide-react';
import { DocumentViewer } from './DocumentViewer';
import { speakDeficiencyText, stopSpeaking } from '../utils/speechFallback';

export function Screen2OfficerConsole({
  activeCase,
  casesList,
  onSelectCase,
  ruleEvaluation,
  auditLog,
  onRecordAuditAction,
  lang = 'en'
}) {
  const [selectedDocType, setSelectedDocType] = useState('income');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVoiceNotice, setAudioVoiceNotice] = useState(null);
  const [showAuditDrawer, setShowAuditDrawer] = useState(false);
  const [officerNote, setOfficerNote] = useState('');
  const auditDialogRef = useRef(null);
  const auditCloseRef = useRef(null);

  const traces = ruleEvaluation?.ruleTraces || [];
  const isCaseC = activeCase.fraudMetadata?.sharedBankCount >= 3;
  const isCaseB = activeCase.deficiencyPacket != null;

  useEffect(() => {
    if (!showAuditDrawer) return undefined;
    const previouslyFocused = document.activeElement;
    auditCloseRef.current?.focus();
    const keepFocusInDialog = (event) => {
      if (event.key === 'Escape') {
        setShowAuditDrawer(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = auditDialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), a[href]'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', keepFocusInDialog);
    return () => {
      document.removeEventListener('keydown', keepFocusInDialog);
      previouslyFocused?.focus?.();
    };
  }, [showAuditDrawer]);

  // Handle Web Speech audio playback
  const handlePlayVoice = (text, language = 'hi-IN') => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    setAudioVoiceNotice('Starting synthesized speech...');

    speakDeficiencyText({
      text,
      lang: language,
      onStart: ({ voice }) => {
        setAudioVoiceNotice(`Synthesizing speech with voice: ${voice}`);
      },
      onEnd: () => {
        setIsPlayingAudio(false);
        setAudioVoiceNotice(null);
      },
      onError: (err) => {
        console.warn('Speech synthesis notice:', err);
        setIsPlayingAudio(false);
        setAudioVoiceNotice('Speech completed or audio voice unavailable. Text guidance visible below.');
      }
    });
  };

  const handleAction = (actionType, summary) => {
    onRecordAuditAction({
      actionType,
      applicantId: activeCase.id,
      applicantName: activeCase.studentName,
      ruleVersion: ruleEvaluation.ruleVersion || 'v1.4.2',
      summary: [summary || 'Officer action recorded in the prototype.', officerNote.trim() && `Officer note: ${officerNote.trim()}`]
        .filter(Boolean)
        .join(' '),
      lane: activeCase.lane
    });
    setOfficerNote('');
  };

  const movementLane = (lane) => lane === 'FAST_LANE'
    ? 'Fast lane'
    : lane === 'STANDARD_LANE'
      ? 'Standard lane'
      : 'Review lane';

  const ruleStatusLabel = (status) => ({
    PASS: 'Within rule',
    REVIEW_ALERT: 'Review cue',
    DEFICIENT: 'Outside rule',
    MINOR_TYPO: 'Text differs',
    DISCREPANCY: 'Check details',
    FLAGGED: 'Officer check',
    INELIGIBLE: 'Officer check'
  }[status] || status);

  return (
    <div className="register-console mx-auto p-4 md:p-6 space-y-5 font-sans">
      <section className="movement-register register-sheet" aria-labelledby="movement-register-title">
        <div className="register-heading">
          <div>
            <h2 id="movement-register-title">DWO movement register</h2>
            <p>Ranchi district · demonstration docket · lane totals are sample figures</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAuditDrawer(true)}
            className="register-tool"
            aria-haspopup="dialog"
          >
            <History size={16} aria-hidden="true" />
            <span>Open activity ledger</span>
            <span className="ledger-count" aria-label={`${auditLog.length} records`}>{auditLog.length}</span>
          </button>
        </div>

        <div className="lane-ledger" aria-label="Sample lane totals">
          <div className="lane-total lane-fast"><span>Fast lane</span><strong>32</strong><small>sample cases</small></div>
          <div className="lane-total lane-standard"><span>Standard lane</span><strong>14</strong><small>sample cases</small></div>
          <div className="lane-total lane-review"><span>Review lane</span><strong>4</strong><small>sample cases</small></div>
        </div>
      </section>

      <div className="movement-workspace">
        <section className="movement-queue register-sheet" aria-labelledby="movement-entries-title">
          <div className="queue-heading">
            <h3 id="movement-entries-title">Movement entries</h3>
            <span>{Object.keys(casesList).length} demonstration files</span>
          </div>
          <div className="movement-columns" aria-hidden="true">
            <span>Folio</span><span>Applicant and reason</span><span>Held by · due</span>
          </div>
          <div className="movement-rows">
            {Object.entries(casesList).map(([key, c], index) => {
              const isSelected = activeCase.id === c.id;
              const laneName = movementLane(c.lane);
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => {
                    onSelectCase(key);
                    setSelectedDocType(c.lane === 'STANDARD_LANE' ? 'income' : 'caste');
                  }}
                  className={`movement-entry${isSelected ? ' is-selected' : ''}`}
                  aria-pressed={isSelected}
                >
                  <span className="entry-folio">
                    <small>Entry</small>
                    <strong>{String(index + 1).padStart(2, '0')}</strong>
                    <small>{c.id.slice(-5)}</small>
                  </span>
                  <span className="entry-applicant">
                    <strong>{c.studentName}</strong>
                    <span className={`lane-label lane-label-${c.lane.toLowerCase()}`}>{laneName}</span>
                    <small>{c.currentDesk?.statusText || 'Awaiting officer review'}</small>
                  </span>
                  <span className="entry-owner">
                    <strong>{c.currentDesk?.officerTitle || 'District Welfare Officer'}</strong>
                    <small>Due {c.currentDesk?.dueDate || 'Date not listed'}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="active-folio-column">
          <section className="active-folio register-sheet" aria-labelledby="active-folio-title" aria-live="polite">
            <div className="active-folio-topline">
              <span>Selected working folio</span>
              <span className="folio-reference">{activeCase.id}</span>
            </div>
            <h3 id="active-folio-title">{activeCase.studentName}</h3>
            <dl className="folio-facts">
              <div><dt>Current desk</dt><dd>{activeCase.currentDesk?.officerTitle || 'District Welfare Officer'}</dd></div>
              <div><dt>Resolution due</dt><dd>{activeCase.currentDesk?.dueDate || 'Date not listed'} <span>· 15-day allowance</span></dd></div>
            </dl>
            <p className="folio-reason">{activeCase.currentDesk?.statusText || 'Routine scrutiny and cross-verification'}</p>
            <a className="decision-shortcut" href="#officer-determination">Review officer actions <ArrowUpRight size={15} aria-hidden="true" /></a>
          </section>

          <div className="document-pane register-sheet">
            <DocumentViewer
              applicant={activeCase}
              selectedDocType={selectedDocType}
              onDocTypeChange={setSelectedDocType}
            />
          </div>
        </div>
      </div>

      <div className="case-analysis">
        <div className="space-y-4">
          {/* Top Panel: Form vs Extracted Comparison Table */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-card overflow-hidden">
            <div className="bg-white px-4 py-2.5 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <FileCheck size={15} className="text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Application and sample document
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                Token: {activeCase.id}
              </span>
            </div>

            <p className="source-note">Extracted values and confidence are simulated from sample files. The officer checks each value against the source document before recording a determination.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3.5">Field Name</th>
                    <th className="py-2.5 px-3.5">Form Data (Student)</th>
                    <th className="py-2.5 px-3.5">Extracted (Document)</th>
                    <th className="py-2.5 px-3.5">Comparison cue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {/* Name Match Row */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3.5 font-semibold text-slate-700">Applicant Name</td>
                    <td className="py-2.5 px-3.5 text-slate-900">{activeCase.formData.studentName}</td>
                    <td className="py-2.5 px-3.5 text-slate-900 font-medium">
                      {activeCase.extractedData.certStudentName}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className="inline-flex items-center space-x-1.5 text-emerald-700 font-semibold text-[11px] bg-emerald-50/80 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        <span>Exact text match · simulated</span>
                      </span>
                    </td>
                  </tr>

                  {/* Father/Guardian Name Row (shows typo if Case B) */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3.5 font-semibold text-slate-700">Father's Name</td>
                    <td className="py-2.5 px-3.5 text-slate-900">{activeCase.formData.parentName}</td>
                    <td className="py-2.5 px-3.5">
                      <span className={activeCase.formData.parentName !== activeCase.extractedData.certParentName ? 'bg-amber-100/80 border border-amber-300 px-1.5 py-0.5 rounded font-bold text-amber-950 font-mono' : 'text-slate-900 font-medium'}>
                        {activeCase.extractedData.certParentName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      {activeCase.formData.parentName === activeCase.extractedData.certParentName ? (
                        <span className="inline-flex items-center space-x-1.5 text-emerald-700 font-semibold text-[11px] bg-emerald-50/80 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          <span>Exact text match · simulated</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 text-amber-800 font-semibold text-[11px] bg-amber-50/80 border border-amber-200 px-2 py-0.5 rounded-full">
                          <AlertTriangle size={12} className="text-amber-600" />
                          <span>Text differs · simulated</span>
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* ST Community Row */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3.5 font-semibold text-slate-700">Category / Tribe</td>
                    <td className="py-2.5 px-3.5 text-slate-900">{activeCase.category}</td>
                    <td className="py-2.5 px-3.5 font-bold text-blue-900">
                      {activeCase.extractedData.casteCommunity}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className="inline-flex items-center space-x-1.5 text-emerald-700 font-semibold text-[11px] bg-emerald-50/80 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        <span>Bundled list match · simulated</span>
                      </span>
                    </td>
                  </tr>

                  {/* Income Row */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3.5 font-semibold text-slate-700">Annual Income</td>
                    <td className="py-2.5 px-3.5 text-slate-900 font-mono tabular-nums">₹{Number(activeCase.formData.income).toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900 font-mono tabular-nums">₹{Number(activeCase.extractedData.income).toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3.5">
                      <span className="inline-flex items-center space-x-1.5 text-emerald-700 font-semibold text-[11px] bg-emerald-50/80 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        <span>Within configured cap</span>
                      </span>
                    </td>
                  </tr>

                  {/* Certificate Validity / Freshness Row */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3.5 font-semibold text-slate-700">Income Cert Issue Date</td>
                    <td className="py-2.5 px-3.5 text-slate-500 font-mono">N/A (Derived)</td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-900">
                      {activeCase.extractedData.incomeCertIssueDate}
                    </td>
                    <td className="py-2.5 px-3.5">
                      {activeCase.extractedData.incomeCertIssueDate === '2025-03-10' ? (
                        <span className="inline-flex items-center space-x-1.5 text-rose-800 font-bold text-[11px] bg-rose-50/80 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertTriangle size={12} className="text-rose-600" />
                          <span>Outside configured 12-month window</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 text-emerald-700 font-semibold text-[11px] bg-emerald-50/80 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          <span>Within configured 12-month window</span>
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Middle Panel: Versioned Rule Engine Trace */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-card space-y-3">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2.5 gap-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                <FileCheck size={15} className="text-blue-600" />
                <span>Deterministic rule trace</span>
              </h3>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                  Rule Version: {ruleEvaluation.ruleVersion || 'v1.4.2'}
                </span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                  Local demo rules
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {traces.map((trace) => {
                let badgeStyle = 'bg-emerald-50/60 text-emerald-950 border-emerald-200/90';
                let icon = <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />;

                if (trace.status === 'REVIEW_ALERT' || trace.status === 'INELIGIBLE') {
                  badgeStyle = 'bg-rose-50/60 text-rose-950 border-rose-200/90';
                  icon = <ShieldAlert size={15} className="text-rose-600 flex-shrink-0" />;
                } else if (trace.status === 'DEFICIENT' || trace.status === 'MINOR_TYPO' || trace.status === 'DISCREPANCY') {
                  badgeStyle = 'bg-amber-50/60 text-amber-950 border-amber-200/90';
                  icon = <AlertTriangle size={15} className="text-amber-600 flex-shrink-0" />;
                }

                return (
                  <div key={trace.ruleId} className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-3 ${badgeStyle} shadow-2xs`}>
                    <div className="flex items-start space-x-2.5">
                      <div className="mt-0.5">{icon}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-slate-900">{trace.ruleId}:</span>
                          <span className="font-bold text-slate-900">{trace.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold">
                            {ruleStatusLabel(trace.status)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">{trace.reason}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{trace.evidence}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap text-right font-medium">
                      Configured reference · {trace.statutoryRef}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Panel for Case C: Shared Bank Account Cluster & Legitimate Hypotheses */}
          {isCaseC && (
            <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4 shadow-card space-y-3.5">
              <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                <div className="flex items-center space-x-2">
                  <ShieldAlert size={16} className="text-purple-700" />
                  <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                    Shared account review cue
                  </h4>
                </div>
                <span className="text-[10px] font-bold bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded-full border border-purple-300">
                  Synthetic scenario · 15 sample files
                </span>
              </div>

              {/* Explicit Non-Accusation Principle Note */}
              <div className="bg-white p-3 rounded-lg border border-purple-200/80 text-xs text-slate-700 space-y-1 shadow-2xs">
                <p className="font-bold text-purple-900 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 inline-block"></span>
                  <span>Shared use alone is not evidence of wrongdoing.</span>
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  In this demonstration, account suffix 4821 appears in 15 sample files. Confirm account ownership and the reason for the shared details with students or their institution before taking any action.
                </p>
              </div>

              {/* Legitimate Explanation Hypotheses */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 block">
                  Possible context to check with applicants:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                  {activeCase.fraudMetadata.legitimateHypotheses.map(hyp => (
                    <div key={hyp.id} className="bg-white p-3 rounded-lg border border-purple-200/80 shadow-2xs space-y-1">
                      <span className="font-bold text-slate-900 block text-[11px] leading-snug">{hyp.title}</span>
                      <p className="text-[10px] text-slate-600 leading-relaxed">{hyp.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Mini Graph of the 15 Linked Applications */}
              <div className="bg-white p-3 rounded-lg border border-purple-200/80">
                <span className="text-[11px] font-bold text-slate-700 block mb-2">
                  Sample links · masked bank account ending 4821:
                </span>
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="px-2.5 py-1 rounded bg-purple-900 text-white font-mono font-bold text-[11px] shadow-xs">
                    BANK A/C ...4821
                  </span>
                  <ArrowRight size={14} className="text-slate-400" aria-hidden="true" />
                  {activeCase.fraudMetadata.clusterApplicants.slice(0, 10).map((app, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-800"
                      title={`${app.name} (${app.inst})`}
                    >
                      {app.name}
                    </span>
                  ))}
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                    +5 more
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Consolidated Deficiency Packet & Audio Modal / Panel (for Case B) */}
          {isCaseB && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 shadow-card space-y-3.5">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle size={16} className="text-amber-800" />
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    Consolidated Actionable Deficiency Packet (Single Unified Notice)
                  </h4>
                </div>
                <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full">
                  15-Day Cure Window: {activeCase.deficiencyPacket.deadlineDate}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* English Notification Text */}
                <div className="bg-white p-3 rounded-lg border border-amber-200/80 space-y-1 shadow-2xs">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Notice in English</span>
                    <span className="text-[10px] text-slate-500 font-mono">SMS / Portal Draft</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {activeCase.deficiencyPacket.fixRequiredEn}
                  </p>
                  <p className="text-[10px] text-slate-500 italic mt-1">
                    {activeCase.deficiencyPacket.minorDiscrepancyNoteEn}
                  </p>
                </div>

                {/* Hindi Notification Text */}
                <div className="bg-white p-3 rounded-lg border border-amber-200/80 space-y-1 shadow-2xs">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>हिन्दी सूचना (क्षेत्रीय संदेश)</span>
                    <span className="text-[10px] text-slate-500 font-mono">WhatsApp Draft</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
                    {activeCase.deficiencyPacket.fixRequiredHi}
                  </p>
                  <p className="text-[10px] text-slate-500 italic mt-1 font-sans">
                    {activeCase.deficiencyPacket.minorDiscrepancyNoteHi}
                  </p>
                </div>
              </div>

              {/* Web Speech Audio Player Controls with Text Fallback */}
              <div className="bg-white p-3 rounded-lg border border-amber-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <Volume2 size={15} className="text-amber-700" />
                    <span>Verbal Audio Guidance (Web Speech API)</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Reads actionable fix out loud for rural applicants with limited text literacy.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePlayVoice(activeCase.deficiencyPacket.fixRequiredHi, 'hi-IN')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition shadow-xs ${
                      isPlayingAudio
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isPlayingAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{isPlayingAudio ? 'Stop Speech' : 'Play Hindi Audio'}</span>
                  </button>

                  <button
                    onClick={() => handlePlayVoice(activeCase.deficiencyPacket.fixRequiredEn, 'en-IN')}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200/90 rounded-lg"
                  >
                    English Audio
                  </button>
                </div>
              </div>

              {/* Audio Status Notice / Fallback Text */}
              {audioVoiceNotice && (
                <div className="text-[10px] text-slate-600 bg-slate-100 p-2 rounded-lg border border-slate-200 font-mono">
                  {audioVoiceNotice}
                </div>
              )}
            </div>
          )}

          {/* Officer Decision & Action Center (Non-negotiable: Human officer decides every case) */}
          <div id="officer-determination" className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck size={15} className="text-blue-600" />
                <span>Officer Scrutiny & Determination Center (Human Authority)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Local demo log only · nothing is sent to NSP or to a student
              </span>
            </div>

            {/* Note input */}
            <div className="space-y-1">
              <label htmlFor="officer-note" className="text-[11px] font-semibold text-slate-700 block">
                Officer note (included in this session's demo log):
              </label>
              <input
                id="officer-note"
                type="text"
                value={officerNote}
                onChange={e => setOfficerNote(e.target.value)}
                placeholder="Record the evidence reviewed, decision, and the student's next step."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Action Buttons based on Case Context */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {activeCase.lane === 'FAST_LANE' && (
                <button
                  onClick={() => handleAction('OFFICER_APPROVED', 'Officer approval recorded in the prototype activity list; NSP callback is not connected.')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center space-x-1.5"
                >
                  <CheckCircle size={14} />
                  <span>Record officer approval</span>
                </button>
              )}

              {activeCase.lane === 'STANDARD_LANE' && (
                <>
                  <button
                    onClick={() => handleAction('DEFICIENCY_PACKET_PREPARED', 'Officer prepared a consolidated deficiency notice with a 15-day cure window; no message was sent.')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center space-x-1.5"
                  >
                    <Send size={14} />
                    <span>Record deficiency notice prepared · 15-day window</span>
                  </button>
                  <button
                onClick={() => handleAction('OFFICER_WAIVER_APPROVED', 'Officer recorded a discretionary waiver for the minor parent-name typo in the prototype activity list.')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg border border-slate-300 transition"
                  >
                    Record approval with typo waiver
                  </button>
                </>
              )}

              {activeCase.lane === 'REVIEW_LANE' && (
                <>
                  <button
                    onClick={() => handleAction('EXPLANATION_REQUEST_PREPARED', 'Officer prepared a non-punitive inquiry for the service centre or college hostel; no message was sent.')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center space-x-1.5"
                  >
                    <Send size={14} />
                    <span>Prepare a non-punitive inquiry</span>
                  </button>
                  <button
                    onClick={() => handleAction('FIELD_INQUIRY_REFERRAL_PREPARED', 'Officer recorded a field inquiry referral in the prototype activity list; no external referral was sent.')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg border border-slate-300 transition"
                  >
                    Prepare field inquiry referral
                  </button>
                </>
              )}

              {/* Secondary Flag Button */}
              <button
                onClick={() => handleAction('ESCALATION_RECORDED', 'Officer recorded a referral to the State Nodal Officer in the prototype activity list; no external escalation was sent.')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg border border-slate-200/90 transition ml-auto"
              >
                Record SNO referral in demo log
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Modal Dialog */}
      {showAuditDrawer && (
        <div className="ledger-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onMouseDown={(event) => event.target === event.currentTarget && setShowAuditDrawer(false)}>
          <div ref={auditDialogRef} role="dialog" aria-modal="true" aria-labelledby="activity-ledger-title" className="activity-dialog bg-white border border-slate-300 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History size={16} className="text-emerald-400" />
                <h3 id="activity-ledger-title" className="text-sm font-bold tracking-tight">Prototype activity ledger</h3>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded">
                  {auditLog.length} Records
                </span>
              </div>
              <button
                ref={auditCloseRef}
                type="button"
                onClick={() => setShowAuditDrawer(false)}
                aria-label="Close activity ledger"
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Timeline */}
            <div className="p-5 overflow-y-auto space-y-3 text-xs divide-y divide-slate-100">
              {auditLog.map((log, index) => (
                <div key={index} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
                    <span>{log.timestamp}</span>
                    <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-700 font-bold">
                      {log.actionType}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800">
                    {log.officerId}
                  </div>
                  <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 font-sans">
                    {log.summary}
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                    <span>Applicant: {log.applicantId}</span>
                    <span>•</span>
                    <span>Rule Engine: {log.ruleVersion}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                In-memory demonstration history · not a tamper-evident record
              </span>
              <button
                onClick={() => setShowAuditDrawer(false)}
                className="px-4 py-1.5 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
