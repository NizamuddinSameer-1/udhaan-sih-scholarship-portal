import React, { useEffect, useRef, useState } from 'react';
import { Database, Search, CheckCircle2, Building2, MapPin, Landmark, Award, X, ExternalLink, RefreshCw } from 'lucide-react';
import { 
  OFFICIAL_JHARKHAND_ST_REGISTRY, 
  OFFICIAL_AISHE_INSTITUTIONS, 
  OFFICIAL_LGD_DATA, 
  OFFICIAL_MOTA_SCHEME_METRICS,
  lookupRealIfscOpenApi 
} from '../data/openGovData';

export function OpenGovDataExplorer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('tribes');
  const [searchTerm, setSearchTerm] = useState('');
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  
  // Live IFSC lookup state
  const [testIfscInput, setTestIfscInput] = useState('SBIN0000073');
  const [liveIfscResult, setLiveIfscResult] = useState(null);
  const [isQueryingIfsc, setIsQueryingIfsc] = useState(false);
  const [ifscError, setIfscError] = useState('');
  const registryTabs = ['tribes', 'ifsc', 'aishe', 'scheme'];

  const handleTabKeyDown = (event) => {
    const currentIndex = registryTabs.indexOf(activeTab);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % registryTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + registryTabs.length) % registryTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = registryTabs.length - 1;
    if (nextIndex !== currentIndex) {
      event.preventDefault();
      setActiveTab(registryTabs[nextIndex]);
      requestAnimationFrame(() => document.getElementById(`registry-tab-${registryTabs[nextIndex]}`)?.focus());
    }
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();
    const keepFocusInDialog = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleQueryIfsc = async (codeToQuery) => {
    const target = (codeToQuery || testIfscInput).trim().toUpperCase();
    if (!target) {
      setIfscError('Enter an IFSC code to look up a branch.');
      setLiveIfscResult(null);
      return;
    }
    setIsQueryingIfsc(true);
    setIfscError('');
    setLiveIfscResult(null);
    try {
      const res = await lookupRealIfscOpenApi(target);
      if (res) {
        setLiveIfscResult(res);
      } else {
        setIfscError('No branch record was returned. Check the code and try again.');
      }
    } catch {
      setIfscError('The live lookup could not be reached. Check the connection and try again.');
    } finally {
      setIsQueryingIfsc(false);
    }
  };

  const filteredTribes = OFFICIAL_JHARKHAND_ST_REGISTRY.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="registry-backdrop fixed inset-0 bg-slate-900/60 flex items-center justify-center p-3 sm:p-4 z-50" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="registry-title" className="registry-dialog bg-white border border-slate-400 max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-100 px-5 py-3 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-gov-navy text-white flex items-center justify-center font-bold">
              <Database size={18} />
            </div>
            <div>
              <h2 id="registry-title" className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Registry index</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
                  Bundled + live query
                </span>
              </h2>
              <p className="text-[11px] text-slate-600">
                Reference data is bundled with this prototype; IFSC details are fetched live when requested.
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close registry index"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100"
          >
            <X size={15} aria-hidden="true" /> Close
          </button>
        </div>

        {/* Tab Selection */}
        <div className="registry-tabs bg-slate-50 px-5 py-2 border-b border-slate-200 flex flex-wrap gap-1.5 text-xs" role="tablist" aria-label="Registry data sources" onKeyDown={handleTabKeyDown}>
          <button
            type="button"
            role="tab"
            id="registry-tab-tribes"
            aria-controls="registry-panel"
            aria-selected={activeTab === 'tribes'}
            tabIndex={activeTab === 'tribes' ? 0 : -1}
            onClick={() => setActiveTab('tribes')}
            className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'tribes' ? 'bg-gov-navy text-white' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award size={14} />
            <span>Bundled ST list</span>
          </button>

          <button
            type="button"
            role="tab"
            id="registry-tab-ifsc"
            aria-controls="registry-panel"
            aria-selected={activeTab === 'ifsc'}
            tabIndex={activeTab === 'ifsc' ? 0 : -1}
            onClick={() => setActiveTab('ifsc')}
            className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'ifsc' ? 'bg-gov-navy text-white' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Landmark size={14} />
            <span>Live IFSC lookup</span>
          </button>

          <button
            type="button"
            role="tab"
            id="registry-tab-aishe"
            aria-controls="registry-panel"
            aria-selected={activeTab === 'aishe'}
            tabIndex={activeTab === 'aishe' ? 0 : -1}
            onClick={() => setActiveTab('aishe')}
            className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'aishe' ? 'bg-gov-navy text-white' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 size={14} />
            <span>AISHE reference</span>
          </button>

          <button
            type="button"
            role="tab"
            id="registry-tab-scheme"
            aria-controls="registry-panel"
            aria-selected={activeTab === 'scheme'}
            tabIndex={activeTab === 'scheme' ? 0 : -1}
            onClick={() => setActiveTab('scheme')}
            className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'scheme' ? 'bg-gov-navy text-white' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Database size={14} />
            <span>Scheme reference</span>
          </button>
        </div>

        {/* Tab Body */}
        <div id="registry-panel" role="tabpanel" aria-labelledby={`registry-tab-${activeTab}`} tabIndex="0" className="registry-panel p-5 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: 32 Official Scheduled Tribes */}
          {activeTab === 'tribes' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Scheduled Tribes · Jharkhand (Part XXI reference)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Bundled reference list based on the Constitution Order. Confirm against the current authoritative schedule before use.
                  </p>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
                  <input
                    aria-label="Search Scheduled Tribe entries"
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search tribe name or PVTG..."
                    className="pl-8 pr-3 py-1 text-xs border border-slate-300 rounded bg-slate-50 focus:bg-white focus:outline-none w-56"
                  />
                </div>
              </div>

              {filteredTribes.length === 0 && (
                <p className="registry-empty" role="status">No matching entries. Try a tribe name or PVTG.</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filteredTribes.map(t => (
                  <div 
                    key={t.id} 
                    className={`p-2.5 rounded border text-xs space-y-1 ${
                      t.pvtg ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-[10px] text-slate-400">#{t.id}</span>
                        <strong className="text-slate-900 text-xs font-bold">{t.name}</strong>
                      </div>
                      {t.pvtg && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900 border border-amber-400">
                          PVTG
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-600 leading-snug">{t.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Live IFSC lookup */}
          {activeTab === 'ifsc' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs space-y-1">
                <span className="font-bold text-blue-900 block">
                  Live IFSC branch lookup
                </span>
                <p className="text-[11px] text-blue-800">
                  This live lookup returns branch metadata from a public IFSC service. It does not verify account ownership, NPCI mapping, or scholarship payment readiness.
                </p>
              </div>

              {/* Input Form */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  aria-label="IFSC code for live branch lookup"
                  aria-describedby={ifscError ? 'ifsc-error' : 'ifsc-help'}
                  maxLength={11}
                  type="text"
                  value={testIfscInput}
                  onChange={e => {
                    setTestIfscInput(e.target.value.toUpperCase());
                    setLiveIfscResult(null);
                    setIfscError('');
                  }}
                  placeholder="Enter any Indian IFSC (e.g. SBIN0000073)"
                  className="px-3 py-2 border border-slate-300 rounded font-mono font-bold text-xs uppercase w-64 focus:outline-none focus:ring-1 focus:ring-gov-navy"
                />
                <button
                  onClick={() => handleQueryIfsc()}
                  type="button"
                  disabled={isQueryingIfsc || !testIfscInput.trim()}
                  className="px-4 py-2 bg-gov-navy hover:bg-slate-800 text-white rounded text-xs font-bold transition flex items-center space-x-1.5"
                >
                  {isQueryingIfsc ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                  <span aria-live="polite">{isQueryingIfsc ? 'Querying live source…' : 'Fetch live bank details'}</span>
                </button>

                {/* Quick Test Links */}
                <div className="flex items-center space-x-1 text-xs">
                  <span className="text-slate-500 text-[11px]">Quick Tests:</span>
                  <button 
                    onClick={() => { setTestIfscInput('SBIN0000073'); handleQueryIfsc('SBIN0000073'); }} 
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border rounded font-mono text-[10px]"
                  >
                    Dumka SBI (SBIN0000073)
                  </button>
                  <button 
                    onClick={() => { setTestIfscInput('BKID0004915'); handleQueryIfsc('BKID0004915'); }} 
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border rounded font-mono text-[10px]"
                  >
                    Khunti BOI (BKID0004915)
                  </button>
                  <button 
                    onClick={() => { setTestIfscInput('PUNB0760900'); handleQueryIfsc('PUNB0760900'); }} 
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border rounded font-mono text-[10px]"
                  >
                    Ranchi PNB (PUNB0760900)
                  </button>
                </div>
              </div>

              <p id={ifscError ? 'ifsc-error' : 'ifsc-help'} className={ifscError ? 'ifsc-error' : 'registry-help'} role={ifscError ? 'alert' : undefined}>
                {ifscError || 'The response appears here only after a live lookup; no sample result is preloaded.'}
              </p>

              {/* Live Result Display */}
              {liveIfscResult && (
                <div className="bg-white border-2 border-slate-300 rounded p-4 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-800 text-sm">
                      {liveIfscResult.bank} — {liveIfscResult.branch}
                    </span>
                    <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {liveIfscResult.ifsc}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Branch Address:</span>
                      <strong className="text-slate-800">{liveIfscResult.address}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">District & State:</span>
                      <strong className="text-slate-800">{liveIfscResult.district}, {liveIfscResult.state}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Result source:</span>
                      <strong className="text-emerald-700">Live IFSC service response</strong>
                    </div>
                  </div>
                </div>
              )}
              {!liveIfscResult && !ifscError && !isQueryingIfsc && (
                <p className="registry-empty">Run a live IFSC lookup to see the returned branch details.</p>
              )}
            </div>
          )}

          {/* TAB 3: AISHE College Registry */}
          {activeTab === 'aishe' && (
            <div className="space-y-3">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  All India Survey on Higher Education (AISHE) Institutional Codes
                </h3>
                <p className="text-[11px] text-slate-500">
                  Bundled sample institution entries. Confirm institution details against current AISHE records before use.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">AISHE Code</th>
                      <th className="py-2 px-3">Institution Name</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">District</th>
                      <th className="py-2 px-3">PIN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {OFFICIAL_AISHE_INSTITUTIONS.map((inst, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-blue-900">{inst.aisheCode}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{inst.name}</td>
                        <td className="py-2 px-3 text-slate-600">{inst.type}</td>
                        <td className="py-2 px-3 text-slate-800">{inst.district}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">{inst.pin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Scheme Benchmarks (data.gov.in) */}
          {activeTab === 'scheme' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Scheme reference values for this prototype
                </h3>
                <p className="text-[11px] text-slate-500">
                  Illustrative values only. Check current official scheme guidance before use in a review.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold block">Configured demo limit:</span>
                  <div className="text-base font-bold text-emerald-800">{OFFICIAL_MOTA_SCHEME_METRICS.incomeCeilingFormatted}</div>
                  <p className="text-[10px] text-slate-500">{OFFICIAL_MOTA_SCHEME_METRICS.statutoryOrder}</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold block">Illustrative national count:</span>
                  <div className="text-base font-bold text-gov-navy">{OFFICIAL_MOTA_SCHEME_METRICS.nationalBeneficiariesFY2425}</div>
                  <p className="text-[10px] text-slate-500">Annual coverage under DBT Tribal Portal</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold block">Illustrative state count:</span>
                  <div className="text-base font-bold text-purple-900">{OFFICIAL_MOTA_SCHEME_METRICS.jharkhandBeneficiariesFY2425}</div>
                  <p className="text-[10px] text-slate-500">75% Central Share : 25% State Share funding ratio</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Illustrative allowance values · confirm current scheme guidance:
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Course Group</th>
                        <th className="py-2 px-3">Eligible Course Streams</th>
                        <th className="py-2 px-3">Hosteller Allowance</th>
                        <th className="py-2 px-3">Day Scholar Allowance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {OFFICIAL_MOTA_SCHEME_METRICS.allowanceStructure.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-bold text-slate-900">{row.group}</td>
                          <td className="py-2 px-3 text-slate-700">{row.courses}</td>
                          <td className="py-2 px-3 font-mono font-bold text-emerald-800">{row.hosteller}</td>
                          <td className="py-2 px-3 font-mono font-bold text-blue-900">{row.dayScholar}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
