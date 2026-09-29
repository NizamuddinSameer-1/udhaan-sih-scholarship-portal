import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  QrCode, 
  ExternalLink,
  Layers,
  Eye,
  Stamp,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

export function DocumentViewer({ applicant, selectedDocType = 'caste', onDocTypeChange }) {
  const [zoom, setZoom] = useState(1);
  const [activeBoxId, setActiveBoxId] = useState(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [viewMode, setViewMode] = useState('scanned'); // 'scanned' | 'synthetic'

  const isCaste = selectedDocType === 'caste';
  const boxes = isCaste
    ? applicant.simulatedBoundingBoxes?.caste || []
    : applicant.simulatedBoundingBoxes?.income || [];

  const certUrl = isCaste 
    ? (applicant.documents?.casteCertUrl || '/certificates/caste_cert_ramesh_soren.png')
    : (applicant.documents?.incomeCertUrl || '/certificates/income_cert_ramesh_soren.png');

  const certNumber = isCaste
    ? (applicant.documents?.casteCertNo || applicant.extractedData?.casteCertNo)
    : (applicant.documents?.incomeCertNo || applicant.extractedData?.incomeCertNo);

  const activeBox = boxes.find(b => b.id === activeBoxId);

  return (
    <div className="document-viewer flex flex-col h-full bg-white rounded-xl border border-slate-200/90 shadow-card overflow-hidden">
      {/* Top Document Header Controls */}
      <div className="document-control-header bg-white px-4 py-2.5 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-2.5">
        <div className="document-type-controls flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Document:</span>
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200/80">
            <button
              type="button"
              onClick={() => { onDocTypeChange('caste'); setActiveBoxId(null); }}
              aria-pressed={isCaste}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                isCaste 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Caste Certificate
            </button>
            <button
              type="button"
              onClick={() => { onDocTypeChange('income'); setActiveBoxId(null); }}
              aria-pressed={!isCaste}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                !isCaste 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Income Certificate
            </button>
          </div>
        </div>

        {/* View Mode & Overlay Toggles */}
        <div className="document-action-controls flex items-center space-x-2">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200/80 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('scanned')}
              aria-pressed={viewMode === 'scanned'}
              className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 font-medium transition-all ${
                viewMode === 'scanned' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="View the sample certificate scan"
            >
              <Eye size={12} />
              <span>Sample scan</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('synthetic')}
              aria-pressed={viewMode === 'synthetic'}
              className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 font-medium transition-all ${
                viewMode === 'synthetic' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="View digital text extraction layout"
            >
              <FileText size={12} />
              <span>Recreated view</span>
            </button>
          </div>

          {/* Toggle Bounding Boxes */}
          <button
            type="button"
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            aria-pressed={showBoundingBoxes}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border flex items-center space-x-1.5 transition-all shadow-2xs ${
              showBoundingBoxes 
                ? 'bg-blue-50/80 border-blue-200 text-blue-800' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Show or hide simulated OCR boxes"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${showBoundingBoxes ? 'bg-blue-600' : 'bg-slate-400'}`}></span>
            <span>Simulated OCR boxes: {showBoundingBoxes ? 'On' : 'Off'}</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-slate-100 border border-slate-200/80 rounded-lg px-1.5 py-0.5">
            <button
              type="button"
              onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.8))}
              title="Zoom In"
              aria-label="Zoom in on certificate"
              className="p-1 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition"
            >
              <ZoomIn size={13} />
            </button>
            <span className="text-[11px] font-mono font-medium text-slate-600 px-1 tabular-nums">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.65))}
              title="Zoom Out"
              aria-label="Zoom out on certificate"
              className="p-1 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition"
            >
              <ZoomOut size={13} />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              title="Reset Zoom"
              aria-label="Reset certificate zoom"
              className="p-1 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition ml-0.5"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Link to Open Raw High-Res File */}
          <a
            href={certUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open the sample certificate image in a new tab"
            aria-label="Open sample certificate image in a new tab"
            className="p-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg text-xs inline-flex items-center space-x-1 transition shadow-2xs"
          >
            <ExternalLink size={12} />
            <span className="hidden sm:inline text-[11px] font-medium">Original</span>
          </a>
        </div>
      </div>

      {/* Active Field Inspector Callout if Box is Selected */}
      {activeBox && (
        <div className={`px-4 py-2 text-xs flex items-center justify-between border-b transition-colors ${
          activeBox.alert 
            ? 'bg-rose-50/80 border-rose-200 text-rose-950' 
            : 'bg-blue-50/80 border-blue-200 text-blue-950'
        }`}>
          <div className="flex items-center space-x-2.5">
            {activeBox.alert ? (
              <AlertTriangle size={15} className="text-rose-600 flex-shrink-0" />
            ) : (
              <ShieldCheck size={15} className="text-blue-600 flex-shrink-0" />
            )}
            <span>
              <strong>Field:</strong> {activeBox.label} — <strong>Sample value:</strong> "{activeBox.text}"
              <span className="ml-2 font-mono text-[11px] px-1.5 py-0.5 rounded bg-white/90 border border-slate-200 shadow-2xs">
                Simulated confidence: {(activeBox.conf * 100).toFixed(0)}%
              </span>
              <span className="field-verification">Source: sample image · Officer verification pending</span>
            </span>
          </div>
          <button 
            type="button"
            onClick={() => setActiveBoxId(null)}
            aria-label="Clear selected certificate field"
            className="text-slate-500 hover:text-slate-800 text-xs font-semibold px-2 hover:underline"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Main Canvas / Optical Desk Inspection Mat */}
      <div className="document-canvas flex-1 overflow-auto p-4 md:p-6 desk-canvas flex items-center justify-center min-h-[300px]">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 ease-out"
        >
          {viewMode === 'scanned' ? (
            /* Sample certificate image view */
            <div className="scan-image-wrap relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1)] rounded-sm bg-white select-none">
              <img 
                src={certUrl} 
                alt={`Sample ${isCaste ? 'caste' : 'income'} certificate scan for ${applicant.studentName}`}
                className="w-full h-auto block rounded-sm"
              />

              {/* Overlay: simulated OCR field regions */}
              {showBoundingBoxes && boxes.map((box) => {
                const isSelected = activeBoxId === box.id;
                const isAlert = box.alert;

                return (
                  <button
                    type="button"
                    key={box.id}
                    onClick={() => setActiveBoxId(isSelected ? null : box.id)}
                    aria-pressed={isSelected}
                    aria-label={`Inspect simulated field ${box.label}, sample value ${box.text}, simulated confidence ${(box.conf * 100).toFixed(0)} percent`}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.w}%`,
                      height: `${box.h}%`
                    }}
                    className={`absolute cursor-pointer transition-all duration-150 flex items-center justify-between px-1 ${
                      isAlert
                        ? 'border-2 border-rose-500 bg-rose-500/20 ring-2 ring-rose-400/50 shadow-sm'
                        : isSelected
                        ? 'border-2 border-blue-600 bg-blue-500/25 ring-2 ring-blue-400/50 shadow-sm'
                        : 'border border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/25 hover:border-emerald-600'
                    }`}
                    title={`${box.label}: ${box.text} · simulated OCR confidence ${(box.conf * 100).toFixed(0)}%`}
                  >
                    {/* Bounding Box Floating Label */}
                    <span
                      className={`absolute -top-4 left-0 text-[9px] font-sans font-bold px-1.5 py-0.2 rounded shadow-xs whitespace-nowrap z-10 ${
                        isAlert
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-blue-700 text-white'
                          : 'bg-emerald-700 text-white'
                      }`}
                    >
                      {box.label} • {(box.conf * 100).toFixed(0)}%
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* SYNTHETIC / RECONSTRUCTED DIGITAL CERTIFICATE CANVAS */
            <div className="synthetic-certificate relative bg-white border border-slate-300 shadow-2xl p-6 text-slate-800 select-none rounded-sm">
              {/* Watermark Pattern */}
              <div className="absolute inset-0 opacity-[0.035] pointer-events-none flex items-center justify-center">
                <div className="text-center font-bold text-5xl rotate-[-35deg] tracking-widest text-slate-900 leading-relaxed font-sans">
                  SAMPLE RECREATION<br />NOT A VALID CERTIFICATE
                </div>
              </div>

              {/* Certificate Header */}
              <div className="text-center border-b border-slate-300 pb-3 mb-4">
                <div className="text-[12px] font-semibold tracking-wider text-slate-700">
                  SAMPLE CERTIFICATE VIEW / नमूना प्रमाणपत्र दृश्य
                </div>
                <div className="text-[14px] font-bold text-slate-900 mt-0.5">
                  Reconstructed interface for review demonstration
                </div>
                <div className="text-[11px] font-medium text-slate-600">
                  Synthetic fields · no registry verification
                </div>
                <div className="mt-2 inline-block px-3 py-0.5 border border-slate-800 text-[13px] font-bold tracking-wide uppercase bg-slate-50 font-sans">
                  {isCaste ? 'SCHEDULED TRIBE CERTIFICATE' : 'ANNUAL INCOME CERTIFICATE'}
                </div>
              </div>

              {/* Top Certificate Metadata */}
              <div className="flex justify-between items-start text-[11px] font-mono mb-4 text-slate-700">
                <div>
                  <div><span className="font-semibold">Application Ref:</span> {applicant.id}</div>
                  <div><span className="font-semibold">Cert No:</span> {certNumber}</div>
                </div>
                <div className="text-right">
                  <div><span className="font-semibold">Issue Date:</span> {isCaste ? applicant.extractedData.casteCertIssueDate : applicant.extractedData.incomeCertIssueDate}</div>
                  <div><span className="font-semibold">State:</span> Jharkhand (LGD: 20)</div>
                </div>
              </div>

              {/* Certificate Body Text */}
              <div className="text-[12px] leading-relaxed text-slate-800 space-y-3 font-sans">
                {isCaste ? (
                  <>
                    <p>
                      This is to certify that <span className="font-bold underline text-slate-900">{applicant.formData.studentName}</span>, 
                      son/daughter of <span className="font-bold underline text-slate-900">{applicant.extractedData.certParentName}</span>, 
                      resident of Village/Mohalla, District <span className="font-semibold">{applicant.formData.district}</span> in the State of 
                      <span className="font-semibold"> Jharkhand</span>, belongs to the 
                      <span className="font-bold text-blue-900 bg-blue-50 px-1"> {applicant.extractedData.casteCommunity}</span> Community, 
                      which is recognized as a <strong>Scheduled Tribe</strong> under the Constitution (Scheduled Tribes) Order, 1950 as amended.
                    </p>
                    <p className="text-[11px] text-slate-600 italic">
                      This recreated view is for interface demonstration; it is not an issued certificate.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      This is to certify that from the official revenue enquiries conducted by the Halka Karamchari and Revenue Inspector, 
                      the total gross annual family income of <span className="font-bold underline text-slate-900">{applicant.formData.studentName}</span>, 
                      guardian <span className="font-bold underline text-slate-900">{applicant.extractedData.certParentName}</span>, 
                      resident of Block/Tehsil, District <span className="font-semibold">{applicant.formData.district}</span>, 
                      from all agricultural, business, and statutory sources is assessed as:
                    </p>
                    <div className="my-2 p-2.5 bg-amber-50/50 border border-amber-200 text-center font-bold text-sm text-slate-900">
                      Gross Annual Income: <span className="text-emerald-800 text-base">₹ {Number(applicant.extractedData.income).toLocaleString('en-IN')}/-</span>
                      <div className="text-[10px] font-normal text-slate-600 mt-0.5">
                        (Assessed according to State Revenue Department norms)
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Sample validity text shown for interface demonstration only.
                    </p>
                  </>
                )}
              </div>

              {/* Official Stamps, QR Code, and Digital Signature Footer */}
              <div className="absolute bottom-6 left-6 right-6 pt-3 border-t border-slate-300 flex items-end justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-14 h-14 bg-slate-100 border border-slate-400 p-1 flex flex-col items-center justify-center">
                    <QrCode size={40} className="text-slate-800" />
                    <span className="text-[7px] text-slate-500 font-mono mt-0.5">e-District</span>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-tight">
                    <div className="font-semibold text-slate-700">Sample signature field</div>
                    <div className="font-mono text-[9px]">Hash display simulated</div>
                    <div className="text-[9px] text-slate-500">No live registry check</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block border border-slate-300 px-3 py-1 bg-slate-50 text-[10px] text-slate-700 mb-1 rounded">
                    Sample authority field:
                    <div className="font-bold text-slate-900">
                      {isCaste ? applicant.extractedData.casteIssuingAuthority : applicant.extractedData.incomeIssuingAuthority}
                    </div>
                    <div className="text-[9px] text-slate-500">Not digitally verified</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Viewer Guidance Bar */}
      <div className="bg-slate-50 px-4 py-2 border-t border-slate-200/90 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span className="font-medium text-[11px]">
            {viewMode === 'scanned' 
              ? 'Sample certificate image · OCR field regions are simulated and require officer verification.' 
              : 'Recreated sample view · values and verification marks are simulated.'}
          </span>
        </span>
        <span className="text-[11px] text-slate-500 flex items-center space-x-2">
          <span>Certificate Ref: <strong className="font-mono text-slate-700">{certNumber}</strong></span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-950 font-semibold text-[10px] border border-amber-300">
              SIGNATURE NOT VERIFIED HERE
          </span>
        </span>
      </div>
    </div>
  );
}
