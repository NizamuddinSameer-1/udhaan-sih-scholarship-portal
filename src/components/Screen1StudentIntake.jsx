import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  FileText, 
  Camera, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Sliders,
  ExternalLink,
  Eye,
  FileCheck,
  CheckCircle2,
  Building,
  User,
  CreditCard,
  Hash
} from 'lucide-react';
import { analyzeImageQuality } from '../utils/canvasQuality';
import { lookupRealIfscOpenApi } from '../data/openGovData';

export function Screen1StudentIntake({ 
  formData, 
  setFormData, 
  onLoadCase, 
  onSubmitApplication, 
  lang = 'en',
  activeCase
}) {
  const [casteFile, setCasteFile] = useState(null);
  const [incomeFile, setIncomeFile] = useState(null);
  const [casteQuality, setCasteQuality] = useState(null);
  const [incomeQuality, setIncomeQuality] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resolvedBranch, setResolvedBranch] = useState(null);

  // Helper to create synthetic visual certificate canvas for real pixel analysis
  const createSampleCanvasImage = (isBlurry = false, isDark = false) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = isDark ? '#2b2b2b' : '#fcfbf8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = isDark ? '#444' : '#1e3a5f';
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Text content
    ctx.fillStyle = isDark ? '#888' : '#0f2942';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GOVERNMENT OF JHARKHAND / झारखण्ड सरकार', canvas.width / 2, 160);
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('REVENUE AND LAND REFORMS DEPARTMENT', canvas.width / 2, 230);
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('SCHEDULED TRIBE CERTIFICATE', canvas.width / 2, 360);

    ctx.textAlign = 'left';
    ctx.font = '30px serif';
    for (let y = 500; y < 1300; y += 70) {
      ctx.fillText('This is to certify that the applicant belongs to Scheduled Tribe Community recognized by Constitution.', 100, y);
    }

    if (isBlurry) {
      ctx.filter = 'blur(16px)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
    }

    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const qualityResult = await analyzeImageQuality(file, file.name);
      const fileUrl = URL.createObjectURL(file);
      if (type === 'caste') {
        setCasteFile({ name: file.name, url: fileUrl });
        setCasteQuality(qualityResult);
      } else {
        setIncomeFile({ name: file.name, url: fileUrl });
        setIncomeQuality(qualityResult);
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadBundledSampleDoc = async (type, certPath, fileName) => {
    setIsAnalyzing(true);
    try {
      const qualityResult = await analyzeImageQuality(certPath, fileName);
      if (type === 'caste') {
        setCasteFile({ name: fileName, url: certPath });
        setCasteQuality(qualityResult);
      } else {
        setIncomeFile({ name: fileName, url: certPath });
        setIncomeQuality(qualityResult);
      }
    } catch (err) {
      console.error('Bundled sample image analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSyntheticSampleDoc = async (type, isBlurry = false, isDark = false) => {
    setIsAnalyzing(true);
    try {
      const dataUrl = createSampleCanvasImage(isBlurry, isDark);
      const fileName = isBlurry ? 'blurry_camera_sample.jpg' : isDark ? 'dark_room_sample.jpg' : 'clear_hd_scan.jpg';
      const qualityResult = await analyzeImageQuality(dataUrl, fileName);
      if (type === 'caste') {
        setCasteFile({ name: fileName, url: dataUrl });
        setCasteQuality(qualityResult);
      } else {
        setIncomeFile({ name: fileName, url: dataUrl });
        setIncomeQuality(qualityResult);
      }
    } catch (err) {
      console.error('Sample quality check failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze activeCase's certificates on first load or case switch
  useEffect(() => {
    if (activeCase?.documents?.casteCertUrl) {
      loadBundledSampleDoc(
        'caste', 
        activeCase.documents.casteCertUrl, 
        `${activeCase.studentName}_ST_Certificate.png`
      );
    }
    if (activeCase?.documents?.incomeCertUrl) {
      loadBundledSampleDoc(
        'income', 
        activeCase.documents.incomeCertUrl, 
        `${activeCase.studentName}_Income_Certificate.png`
      );
    }
  }, [activeCase?.id]);

  return (
    <div className="intake-page max-w-6xl mx-auto p-4 md:p-6 space-y-5 font-sans">
      {/* Top Banner with Quick Case Pickers */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="sample-mark">
              Sample casebook
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-600 font-medium">Preloaded demonstration scenarios</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1 tracking-tight">
            {lang === 'en' ? 'Load a sample review file' : 'नमूना समीक्षा फ़ाइल खोलें'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'en' 
              ? 'Load a sample file to explore document checks and the DWO review flow.' 
              : 'दस्तावेज़ जाँच और जिला समीक्षा का तरीका देखने के लिए नमूना फ़ाइल खोलें।'}
          </p>
          <p className="sample-boundary">Prefilled details and certificate images are synthetic. Checks run in this browser; nothing is submitted to NSP.</p>
        </div>

        {/* 3 Seeded Case Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onLoadCase('CASE_A')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 transition-all flex items-center space-x-1.5 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Case A (Fast Lane • Clean)</span>
          </button>
          <button
            onClick={() => onLoadCase('CASE_B')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50/80 hover:bg-amber-100 text-amber-950 border border-amber-200 transition-all flex items-center space-x-1.5 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            <span>Case B (Standard • Typo / Expiry)</span>
          </button>
          <button
            onClick={() => onLoadCase('CASE_C')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-50/80 hover:bg-purple-100 text-purple-950 border border-purple-200 transition-all flex items-center space-x-1.5 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            <span>Case C (Review • Bank Cluster)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Student Intake Form (7 Cols) */}
        <div className="intake-sheet lg:col-span-7 bg-white border border-slate-200/90 rounded-xl p-5 shadow-card space-y-4">
          <div className="border-b border-slate-200 pb-2.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {lang === 'en' ? 'Student Registration & Scheme Application' : 'छात्र पंजीकरण व योजना आवेदन'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'en' ? 'Post-Matric Scholarship Scheme for Scheduled Tribes (MoTA PS SIH26239)' : 'अनुसूचित जनजाति छात्रवृत्ति योजना'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label htmlFor="student-name" className="block font-semibold text-slate-700 mb-1">
                {lang === 'en' ? 'Applicant Full Name *' : 'आवेदक का पूरा नाम *'}
              </label>
              <input
                id="student-name"
                type="text"
                value={formData.studentName || ''}
                onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium transition-all"
                placeholder="e.g. Ramesh Soren"
              />
            </div>

            <div>
              <label htmlFor="parent-name" className="block font-semibold text-slate-700 mb-1">
                {lang === 'en' ? "Father's / Guardian's Name *" : 'पिता/अभिभावक का नाम *'}
              </label>
              <input
                id="parent-name"
                type="text"
                value={formData.parentName || ''}
                onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium transition-all"
                placeholder="e.g. Sohan Soren"
              />
            </div>

            <div>
              <label htmlFor="domicile-state" className="block font-semibold text-slate-700 mb-1">
                {lang === 'en' ? 'State of Domicile *' : 'मूल निवास राज्य *'}
              </label>
              <select
                id="domicile-state"
                value={formData.state || 'Jharkhand'}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium transition-all"
              >
                <option value="Jharkhand">Jharkhand (झारखण्ड)</option>
                <option value="Odisha">Odisha (ओडिशा)</option>
                <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
              </select>
            </div>

            <div>
              <label htmlFor="domicile-district" className="block font-semibold text-slate-700 mb-1">
                {lang === 'en' ? 'District *' : 'जिला *'}
              </label>
              <input
                id="domicile-district"
                type="text"
                value={formData.district || ''}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium transition-all"
                placeholder="e.g. Dumka / Khunti / Ranchi"
              />
            </div>

            <div>
              <label htmlFor="annual-income" className="block font-semibold text-slate-700 mb-1">
                {lang === 'en' ? 'Annual Family Income (INR) *' : 'वार्षिक पारिवारिक आय (रु) *'}
              </label>
              <input
                id="annual-income"
                type="number"
                value={formData.income || ''}
                onChange={e => setFormData({ ...formData, income: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono tabular-nums transition-all"
                placeholder="e.g. 180000"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Configured demo limit: ₹2,50,000</span>
            </div>

            <div>
              <label htmlFor="scheme-selection" className="block font-semibold text-slate-700 mb-1">
                {lang === 'en' ? 'Scheme Selection' : 'योजना चयन'}
              </label>
              <input
                id="scheme-selection"
                type="text"
                disabled
                value="Post-Matric Scholarship for ST Students"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-medium cursor-not-allowed text-xs"
              />
            </div>

            <div>
              <label htmlFor="bank-account" className="block font-semibold text-slate-700 mb-1">
                {lang === 'en' ? 'Bank Account Number *' : 'बैंक खाता संख्या *'}
              </label>
              <input
                id="bank-account"
                type="text"
                value={formData.bankAccount || ''}
                onChange={e => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono transition-all"
                placeholder="e.g. XXXX-XXXX-6192"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="bank-ifsc" className="font-semibold text-slate-700">
                  {lang === 'en' ? 'Bank IFSC Code *' : 'बैंक IFSC कोड *'}
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    if (formData.ifsc) {
                      const res = await lookupRealIfscOpenApi(formData.ifsc);
                      setResolvedBranch(res);
                    }
                  }}
                  className="text-[10px] text-blue-600 font-bold hover:underline"
                >
                  Look up IFSC
                </button>
              </div>
              <input
                id="bank-ifsc"
                type="text"
                value={formData.ifsc || ''}
                onChange={async (e) => {
                  const val = e.target.value.toUpperCase();
                  setFormData({ ...formData, ifsc: val });
                  if (val.length === 11) {
                    const res = await lookupRealIfscOpenApi(val);
                    setResolvedBranch(res);
                  } else {
                    setResolvedBranch(null);
                  }
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono uppercase transition-all"
                placeholder="e.g. SBIN0000073"
              />
              {resolvedBranch && resolvedBranch.found && (
                <div className="mt-1.5 text-[10px] bg-emerald-50/80 text-emerald-900 border border-emerald-200 p-2 rounded-lg space-y-0.5 shadow-2xs">
                  <div className="font-bold flex items-center space-x-1">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>{resolvedBranch.bank} — {resolvedBranch.branch}</span>
                  </div>
                  <div className="text-slate-600 truncate">{resolvedBranch.address}</div>
                </div>
              )}
              <p className="registry-help">Live IFSC lookup returns branch metadata only; it does not check account ownership or NPCI mapping.</p>
            </div>
          </div>

          {/* DUAL DOCUMENT UPLOAD BOXES */}
          <div className="border-t border-slate-200 pt-4 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {lang === 'en' ? 'Required Certificates Upload (Two Separate Documents)' : 'आवश्यक प्रमाण पत्र अपलोड'}
            </h4>

            {/* 1. ST / Caste Certificate */}
            <div className="p-3.5 bg-slate-50/60 border border-slate-200/90 rounded-lg space-y-2.5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <FileText size={14} className="text-blue-600" />
                  <span>1. ST / Caste Certificate (जाति प्रमाण पत्र)</span>
                </span>
                <div className="flex flex-wrap items-center gap-1 text-[10px]">
                  <button
                    onClick={() => loadBundledSampleDoc('caste', '/certificates/caste_cert_ramesh_soren.png', 'Ramesh_Soren_ST_Santhal.png')}
                    className="px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-medium"
                    title="Load bundled synthetic sample certificate image"
                  >
                    Dumka ST sample
                  </button>
                  <button
                    onClick={() => loadBundledSampleDoc('caste', '/certificates/caste_cert_sunita_munda.png', 'Sunita_Munda_ST_Khunti.png')}
                    className="px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-medium"
                    title="Load bundled synthetic sample certificate image"
                  >
                    Khunti ST sample
                  </button>
                  <button
                    onClick={() => loadSyntheticSampleDoc('caste', true, false)}
                    className="px-2 py-0.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded text-amber-900"
                    title="Test blurry mobile camera photo"
                  >
                    Test Blurry Photo
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <label className="cursor-pointer px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition shadow-2xs">
                  <Upload size={13} />
                  <span>{lang === 'en' ? 'Browse Certificate Image' : 'प्रमाण पत्र चुनें'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={e => handleFileUpload(e, 'caste')}
                  />
                </label>
                <div className="flex items-center space-x-2 text-xs truncate max-w-xs">
                  <span className="text-slate-700 font-medium truncate">
                    {casteFile ? casteFile.name : casteQuality ? casteQuality.fileName : 'No file selected yet'}
                  </span>
                  {casteFile?.url && (
                    <a 
                      href={casteFile.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-0.5 text-[11px] underline"
                    >
                      <Eye size={11} />
                      <span>View</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Real Thumbnail Preview if loaded */}
              {casteFile?.url && (
                <div className="mt-2 flex items-center space-x-3 bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-2xs">
                  <img 
                    src={casteFile.url} 
                    alt="Caste Preview" 
                    className="w-12 h-16 object-cover border border-slate-300 rounded shadow-xs" 
                  />
                  <div className="text-[11px] text-slate-600">
                    <div className="font-bold text-slate-800 flex items-center space-x-1">
                      <FileCheck size={13} className="text-emerald-600" />
                      <span>Sample certificate scan loaded</span>
                    </div>
                    <div>Bundled synthetic image · no registry lookup</div>
                    <div className="text-[10px] text-slate-400">Evaluated on client canvas for blur and focus</div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Income Certificate */}
            <div className="p-3.5 bg-slate-50/60 border border-slate-200/90 rounded-lg space-y-2.5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <FileText size={14} className="text-blue-600" />
                  <span>2. Income Certificate (आय प्रमाण पत्र)</span>
                </span>
                <div className="flex flex-wrap items-center gap-1 text-[10px]">
                  <button
                    onClick={() => loadBundledSampleDoc('income', '/certificates/income_cert_ramesh_soren.png', 'Ramesh_Soren_Income_Dumka.png')}
                    className="px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-medium"
                    title="Load bundled synthetic sample certificate image"
                  >
                    Dumka income sample
                  </button>
                  <button
                    onClick={() => loadBundledSampleDoc('income', '/certificates/income_cert_sunita_munda.png', 'Sunita_Munda_Income_Expired.png')}
                    className="px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-rose-800 font-medium"
                    title="Load bundled synthetic sample image with an older issue date"
                  >
                    Older-date sample
                  </button>
                  <button
                    onClick={() => loadSyntheticSampleDoc('income', false, true)}
                    className="px-2 py-0.5 bg-slate-200 border border-slate-300 hover:bg-slate-300 rounded text-slate-800"
                    title="Test dark photo"
                  >
                    Test Dark Photo
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <label className="cursor-pointer px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition shadow-2xs">
                  <Upload size={13} />
                  <span>{lang === 'en' ? 'Browse Income Certificate' : 'आय प्रमाण पत्र चुनें'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={e => handleFileUpload(e, 'income')}
                  />
                </label>
                <div className="flex items-center space-x-2 text-xs truncate max-w-xs">
                  <span className="text-slate-700 font-medium truncate">
                    {incomeFile ? incomeFile.name : incomeQuality ? incomeQuality.fileName : 'No file selected yet'}
                  </span>
                  {incomeFile?.url && (
                    <a 
                      href={incomeFile.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-0.5 text-[11px] underline"
                    >
                      <Eye size={11} />
                      <span>View</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Real Thumbnail Preview if loaded */}
              {incomeFile?.url && (
                <div className="mt-2 flex items-center space-x-3 bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-2xs">
                  <img 
                    src={incomeFile.url} 
                    alt="Income Preview" 
                    className="w-12 h-16 object-cover border border-slate-300 rounded shadow-xs" 
                  />
                  <div className="text-[11px] text-slate-600">
                    <div className="font-bold text-slate-800 flex items-center space-x-1">
                      <FileCheck size={13} className="text-emerald-600" />
                      <span>Sample certificate scan loaded</span>
                    </div>
                    <div>Source: Revenue Department Assessment Register</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Canvas Quality Diagnostics (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-card space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Camera size={15} className="text-blue-600" />
                  <span>Image quality check</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-800 font-semibold block mt-0.5">
                  Runs locally in this browser · pixel-based
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Scores are calculated from the selected image in this browser. The image is not sent to a government service.
            </p>

            {isAnalyzing ? (
              <div className="p-8 text-center space-y-2">
                <RefreshCw size={24} className="animate-spin text-blue-600 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">Computing Laplacian variance & luminance histogram...</p>
              </div>
            ) : casteQuality || incomeQuality ? (
              <div className="space-y-3.5">
                {/* Caste Cert Quality Card */}
                {casteQuality && (
                  <div className={`p-3.5 rounded-xl border text-xs space-y-2.5 shadow-2xs ${
                    casteQuality.status === 'RETAKE_RECOMMENDED'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-emerald-50/60 border-emerald-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 truncate max-w-[200px]">
                        {casteQuality.fileName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        casteQuality.status === 'RETAKE_RECOMMENDED'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}>
                        {casteQuality.status === 'RETAKE_RECOMMENDED' ? 'RETAKE RECOMMENDED' : 'ACCEPTABLE QUALITY'}
                      </span>
                    </div>

                    {/* Measured Numerical Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs tabular-nums">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Laplacian Variance:</span>
                        <strong className={casteQuality.metrics.laplacianVariance < 85 ? 'text-rose-700 font-bold' : 'text-emerald-700'}>
                          {casteQuality.metrics.laplacianVariance}
                        </strong>
                        <span className="text-[9px] text-slate-400 block">(min 85 needed)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Mean Luminance:</span>
                        <strong>{casteQuality.metrics.meanLuminance} / 255</strong>
                        <span className="text-[9px] text-slate-400 block">(target 40–250)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Pixel Resolution:</span>
                        <strong>{casteQuality.resolution.display}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Contrast StdDev:</span>
                        <strong>{casteQuality.metrics.contrastStdDev}</strong>
                      </div>
                    </div>

                    {/* Retake Reasons if Substandard */}
                    {casteQuality.retakeReasons && casteQuality.retakeReasons.length > 0 && (
                      <div className="bg-amber-100/70 p-2.5 rounded-lg text-amber-950 text-[11px] space-y-1">
                        <strong className="block font-bold">Action Needed Before Submission:</strong>
                        {casteQuality.retakeReasons.map((reason, idx) => (
                          <div key={idx} className="flex items-start space-x-1">
                            <span>•</span>
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Income Cert Quality Card */}
                {incomeQuality && (
                  <div className={`p-3.5 rounded-xl border text-xs space-y-2.5 shadow-2xs ${
                    incomeQuality.status === 'RETAKE_RECOMMENDED'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-emerald-50/60 border-emerald-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 truncate max-w-[200px]">
                        {incomeQuality.fileName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        incomeQuality.status === 'RETAKE_RECOMMENDED'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}>
                        {incomeQuality.status === 'RETAKE_RECOMMENDED' ? 'RETAKE RECOMMENDED' : 'ACCEPTABLE QUALITY'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs tabular-nums">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Laplacian Variance:</span>
                        <strong className={incomeQuality.metrics.laplacianVariance < 85 ? 'text-rose-700 font-bold' : 'text-emerald-700'}>
                          {incomeQuality.metrics.laplacianVariance}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Mean Luminance:</span>
                        <strong>{incomeQuality.metrics.meanLuminance} / 255</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Pixel Resolution:</span>
                        <strong>{incomeQuality.resolution.display}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Contrast StdDev:</span>
                        <strong>{incomeQuality.metrics.contrastStdDev}</strong>
                      </div>
                    </div>

                    {incomeQuality.retakeReasons && incomeQuality.retakeReasons.length > 0 && (
                      <div className="bg-amber-100/70 p-2.5 rounded-lg text-amber-950 text-[11px] space-y-1">
                        <strong className="block font-bold">Action Needed:</strong>
                        {incomeQuality.retakeReasons.map((reason, idx) => (
                          <div key={idx} className="flex items-start space-x-1">
                            <span>•</span>
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500 text-xs">
                <FileText size={28} className="mx-auto text-slate-400 mb-2" />
                <p>Upload a certificate or choose a sample scan above to run browser-side image quality checks.</p>
              </div>
            )}
          </div>

          {/* Big Action Button to Submit to Officer Console */}
          <button
            onClick={onSubmitApplication}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-card transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <span>Run pre-check & create a demo file</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
