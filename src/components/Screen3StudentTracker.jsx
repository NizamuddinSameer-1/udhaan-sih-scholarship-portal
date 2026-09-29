import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  Landmark, 
  AlertCircle, 
  FastForward, 
  RotateCcw, 
  UserCheck,
  Building2,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export function Screen3StudentTracker({ activeCase, lang = 'en' }) {
  const [simulatedDaysForward, setSimulatedDaysForward] = useState(0);

  const baseSlaAllowed = activeCase.currentDesk?.slaDaysAllowed || 5;
  const baseDaysElapsed = activeCase.currentDesk?.daysElapsed || 2;
  const currentElapsed = baseDaysElapsed + simulatedDaysForward;
  const daysRemaining = baseSlaAllowed - currentElapsed;
  const isOverdue = daysRemaining < 0;

  const pipeline = [
    {
      role: "INO",
      name: "Institutional Nodal Officer",
      location: activeCase.institute || "SKM University, Dumka",
      status: activeCase.lane === 'FAST_LANE' ? 'IN_PROGRESS' : 'COMPLETED',
      clearedDate: activeCase.lane === 'FAST_LANE' ? null : '21-Sep-2026',
      note: "College admission, attendance, and bona-fide student verification."
    },
    {
      role: "DNO",
      name: "District Nodal Officer",
      location: `District Welfare Office, ${activeCase.district || 'Dumka'}`,
      status: activeCase.lane === 'FAST_LANE' 
        ? 'PENDING' 
        : isOverdue ? 'ESCALATED' : 'IN_PROGRESS',
      clearedDate: null,
      note: activeCase.currentDesk?.statusText || "Revenue certificate cross-verification."
    },
    {
      role: "SNO",
      name: "State Nodal Officer",
      location: "Department of Scheduled Tribe Welfare, Ranchi",
      status: isOverdue ? 'URGENT_ACTION' : 'PENDING',
      clearedDate: null,
      note: "State budget allocation and quota reconciliation."
    },
    {
      role: "PFMS / MoTA",
      name: "Central Ministry & DBT",
      location: "Ministry of Tribal Affairs, New Delhi / PFMS",
      status: 'PENDING',
      clearedDate: null,
      note: "Central Treasury release via Aadhaar Payment Bridge (APB)."
    }
  ];

  return (
    <div className="tracker-page max-w-5xl mx-auto p-4 md:p-6 space-y-5 font-sans">
      {/* Top Banner: The Core Accountability Promise */}
      <div className="tracker-intro relative overflow-hidden text-white shadow-elevated">
        <div className="relative z-10 space-y-2">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-white leading-snug">
            "From 'Pending at District Level' to 'Waiting on this desk, for this reason, until this date.'"
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Demo tracker · this sample journey is not connected to NSP. Desk ownership and dates are scenario data.
          </p>
        </div>
      </div>

      {/* Hero Active Desk Card */}
      <div className={`p-5 rounded-xl border transition-all shadow-card space-y-4 ${
        isOverdue 
          ? 'bg-amber-50/70 border-amber-300 shadow-amber-900/5' 
          : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <span className={`status-mark ${isOverdue ? 'is-overdue' : 'is-within-time'}`} aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sample file:
            </span>
            <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
              {activeCase.id}
            </span>
          </div>

          {/* Simulated Fast-Forward SLA Controls */}
          <div className="flex items-center space-x-2 bg-slate-100/90 p-1 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-700 px-1">Demo clock:</span>
            <button
              onClick={() => setSimulatedDaysForward(prev => prev + 5)}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[11px] font-bold flex items-center space-x-1.5 transition shadow-2xs"
              title="Advance the demonstration clock by five days"
            >
              <FastForward size={12} />
              <span>Advance demo by 5 days</span>
            </button>
            {simulatedDaysForward > 0 && (
              <button
                onClick={() => setSimulatedDaysForward(0)}
                aria-label="Reset demo clock"
                className="p-1 hover:bg-slate-200 rounded-md text-slate-600 transition"
                title="Reset simulation time"
              >
                <RotateCcw size={12} />
              </button>
            )}
            <span className="simulator-note">Simulation only</span>
          </div>
        </div>

        {/* 3 Core Fields: Desk, Reason, Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {/* 1. Exact Desk */}
          <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/90 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              1. Waiting on Desk / अधिकारी:
            </span>
            <div className="font-bold text-slate-900 text-sm">
              {activeCase.currentDesk?.officerTitle || 'District Welfare Officer'}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {activeCase.currentDesk?.deskName || 'District Nodal Desk, Dumka'}
            </div>
          </div>

          {/* 2. Concrete Reason */}
          <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/90 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              2. Specific Reason / वर्तमान स्थिति:
            </span>
            <div className="font-bold text-slate-900 text-xs leading-relaxed">
              {activeCase.currentDesk?.statusText || 'Routine Scrutiny & Cross-Verification'}
            </div>
            <div className="text-[11px] text-slate-500">
              Student remedy window: 15 days when a deficiency notice is issued.
            </div>
          </div>

          {/* 3. SLA Due Date */}
          <div className={`p-3.5 rounded-lg border space-y-1 shadow-2xs ${
            isOverdue 
              ? 'bg-rose-100/70 border-rose-300 text-rose-950' 
              : 'bg-emerald-50/70 border-emerald-200/90 text-slate-900'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-600">
              3. Resolution Deadline / अंतिम तिथि:
            </span>
            <div className="font-bold text-sm font-mono flex items-center space-x-1.5 tabular-nums">
              <Clock size={15} className={isOverdue ? 'text-rose-700' : 'text-emerald-700'} />
              <span>{activeCase.currentDesk?.dueDate || '02 Oct 2026'}</span>
            </div>
            <div className="text-xs font-semibold">
              {isOverdue ? (
                <span className="text-rose-700 font-bold">
                  Demo deadline passed by {Math.abs(daysRemaining)} days · escalation preview only.
                </span>
              ) : (
                <span className="text-emerald-700">
                  {daysRemaining} Days Remaining in Desk SLA window.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Automatic Escalation Alert if Overdue */}
        {isOverdue && (
          <div className="bg-amber-900 text-white p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2.5">
              <ShieldAlert size={18} className="flex-shrink-0" />
                <span>
                Preview only: the demo clock has advanced. No referral was sent and no NSP record changed; the next sample stage is shown for illustration.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 4-Tier Sequential Approval Pipeline Visualization */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-card space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Approval path · sample scenario
        </h3>
        <p className="text-xs text-slate-600">Stage labels and dates are illustrative; this prototype does not read live NSP status.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {pipeline.map((stage, idx) => {
            const isCurrent = stage.status === 'IN_PROGRESS' || stage.status === 'ESCALATED';
            const isPreview = stage.status === 'URGENT_ACTION';
            const isDone = stage.status === 'COMPLETED';

            return (
              <div
                key={idx}
                aria-current={isCurrent ? 'step' : undefined}
                className={`p-3.5 rounded-xl border text-xs space-y-2 relative transition-all ${
                  isCurrent || isPreview
                    ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/20'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200/90 bg-slate-50/60 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    Tier {idx + 1}: {stage.role}
                  </span>
                  <span className={`tier-state ${isCurrent ? 'is-current' : isDone ? 'is-complete' : ''}`}>
                    {isCurrent ? (stage.status === 'ESCALATED' ? 'Escalation preview' : 'Active desk') : isPreview ? 'Next-stage preview' : isDone ? 'Completed in sample' : 'Waiting in sample'}
                  </span>
                  {isDone && <CheckCircle2 size={16} className="text-emerald-600" />}
                  {isCurrent && <Clock size={16} className="text-blue-600" />}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{stage.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{stage.location}</p>
                </div>

                <p className="text-[10px] text-slate-600 border-t border-slate-200/80 pt-1.5 leading-relaxed">
                  {stage.note}
                </p>

                {stage.clearedDate && (
                  <span className="text-[9px] text-emerald-800 font-mono block">
                    Scenario date: {stage.clearedDate}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment-Readiness & NPCI Aadhaar Seeding Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center space-x-2">
            <CreditCard size={17} className="text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Bank routing · sample data
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
            PFMS / NPCI · mock data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          {/* Bank Account Info */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200/90 rounded-lg space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Disbursement Account:</span>
            <div className="font-bold text-slate-900 font-mono text-sm">{activeCase.bankDetails.accountNumber}</div>
            <div className="text-[11px] text-slate-600 font-mono font-semibold">{activeCase.bankDetails.ifsc}</div>
            <div className="text-[11px] text-slate-500">{activeCase.bankDetails.bankName}</div>
          </div>

          {/* NPCI Mapper Status */}
          <div className={`p-3.5 border rounded-lg space-y-1 shadow-2xs ${
            activeCase.bankDetails.npciSeeded 
              ? 'bg-emerald-50/70 border-emerald-200/90' 
              : 'bg-rose-50/70 border-rose-200/90'
          }`}>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">NPCI mapping · sample status</span>
            <div className="flex items-center space-x-1.5 font-bold">
              {activeCase.bankDetails.npciSeeded ? (
                <>
                  <CheckCircle2 size={15} className="text-emerald-700" />
                  <span className="text-emerald-900">Sample record: mapping active</span>
                </>
              ) : (
                <>
                  <AlertCircle size={15} className="text-rose-700" />
                  <span className="text-rose-900">Sample record: mapping not active</span>
                </>
              )}
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              {activeCase.bankDetails.npciSeeded
                ? `The bundled scenario marks this as mapped on ${activeCase.bankDetails.seedingDate}. No NPCI lookup is made here.`
                : 'This bundled scenario marks mapping as inactive. Confirm the account details through official bank or NSP channels; this screen does not query NPCI.'}
            </p>
          </div>

          {/* Simulated Bounce Reason / Fix Steps */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200/90 rounded-lg space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sample payment checks:</span>
            {activeCase.bankDetails.npciSeeded ? (
              <div className="text-emerald-800 font-semibold text-[11px] pt-1 leading-relaxed">
                Sample readiness only. Confirm with a live PFMS/NPCI adapter before release.
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="text-rose-700 font-mono font-bold text-[10px]">
                  {activeCase.bankDetails.bounceReason}
                </div>
                <div className="text-[10px] text-slate-600 leading-tight">
                  <strong>Suggested next step:</strong> Confirm the account and mapping status through official bank or NSP channels.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
