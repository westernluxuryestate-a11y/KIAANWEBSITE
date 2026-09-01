/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  X,
  FileText,
  DollarSign,
  Calendar,
  Layers,
  HelpCircle,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { BeforeYouBookChecklist, Unit, Project } from '../types';
import { analyticsEngine } from '../services/analyticsStore';

interface BeforeYouBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAndProceed: () => void;
  unit?: Unit;
  project?: Project;
  theme?: 'dark' | 'light';
}

export const BeforeYouBookModal: React.FC<BeforeYouBookModalProps> = ({
  isOpen,
  onClose,
  onConfirmAndProceed,
  unit,
  project,
  theme = 'dark',
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  const [checklist, setChecklist] = useState<BeforeYouBookChecklist>({
    totalCostUnderstood: false,
    financingUnderstood: false,
    documentsReviewed: false,
    possessionUnderstood: false,
    maintenanceUnderstood: false,
    cancellationTermsReviewed: false,
    unitDetailsConfirmed: false,
    applicableReraReviewed: false,
  });

  const toggleCheck = (key: keyof BeforeYouBookChecklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = () => {
    setChecklist({
      totalCostUnderstood: true,
      financingUnderstood: true,
      documentsReviewed: true,
      possessionUnderstood: true,
      maintenanceUnderstood: true,
      cancellationTermsReviewed: true,
      unitDetailsConfirmed: true,
      applicableReraReviewed: true,
    });
  };

  const isAllChecked = Object.values(checklist).every(Boolean);

  const checklistItems: {
    key: keyof BeforeYouBookChecklist;
    title: string;
    description: string;
    badge: string;
  }[] = [
    {
      key: 'totalCostUnderstood',
      title: 'Total All-Inclusive Acquisition Cost Understood',
      description:
        'Confirmed understanding of base agreement value, 5% GST (or 0% ready OC), 6% Maharashtra stamp duty, ₹30,000 registration, and advance maintenance.',
      badge: 'COST AUDIT',
    },
    {
      key: 'financingUnderstood',
      title: 'Financing & Loan Pre-approval Structure Understood',
      description:
        'Down payment requirements, statutory EMI schedules, and institutional bank approvals from SBI/HDFC/ICICI confirmed.',
      badge: 'BANKING',
    },
    {
      key: 'documentsReviewed',
      title: 'Statutory Legal Documents Reviewed in Doc Center',
      description:
        'Title search certificate, sanctioned building layout, non-encumbrance report, and model agreement for sale reviewed.',
      badge: 'LEGAL TITLE',
    },
    {
      key: 'possessionUnderstood',
      title: 'MahaRERA Possession Date & Delay Penalty Understood',
      description:
        'RERA committed possession timeline and statutory interest protection under Section 18 of RERA Act, 2016 reviewed.',
      badge: 'POSSESSION',
    },
    {
      key: 'maintenanceUnderstood',
      title: 'Recurring Maintenance & Society CAM Understood',
      description:
        'Monthly CAM rate per sq.ft of carpet area and 1-year advance deposit into society escrow account confirmed.',
      badge: 'MAINTENANCE',
    },
    {
      key: 'cancellationTermsReviewed',
      title: 'Statutory Cancellation & Refund Terms Reviewed',
      description:
        'MahaRERA compliant refund guidelines, timeline, and standard administrative deduction rules acknowledged.',
      badge: 'CANCELLATION',
    },
    {
      key: 'unitDetailsConfirmed',
      title: 'Unit Layout, Floor, Facing & Allocated Parking Confirmed',
      description:
        'Specific floor number, cardinal orientation, carpet area in sq.m / sq.ft, and covered parking slot assignment verified.',
      badge: 'UNIT SPEC',
    },
    {
      key: 'applicableReraReviewed',
      title: 'Applicable MahaRERA Registration & QR Code Scanned',
      description:
        'Project registration number verified on the official MahaRERA governmental portal with zero active stay orders.',
      badge: 'MahaRERA',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-10 rounded-3xl border shadow-2xl space-y-6 relative scrollbar-thin ${
          isDark ? 'bg-[#0B101C] border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4 border-current/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>MANDATORY CONSUMER PROTECTION STEP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">“Before You Book” Checklist</h2>
            <p className="text-xs opacity-70">
              Kiaan enforces complete consumer transparency. Please review and confirm each statutory item before proceeding to the 15-minute concurrency lock.
            </p>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-current/10 cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Select All */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="opacity-60">
            {Object.values(checklist).filter(Boolean).length} of 8 items verified
          </span>
          <button
            onClick={selectAll}
            className="text-amber-500 font-bold hover:underline cursor-pointer"
          >
            Mark All as Understood
          </button>
        </div>

        {/* 8-Item Checklist */}
        <div className="space-y-3">
          {checklistItems.map((item) => {
            const isChecked = checklist[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleCheck(item.key)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isChecked
                    ? isDark
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                      : 'bg-emerald-50 border-emerald-500/40 text-slate-900'
                    : 'bg-current/5 border-current/10 hover:border-amber-500/30'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isChecked ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-current/30'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-4 h-4 text-black font-bold" />}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold font-serif">{item.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-current/10 opacity-70">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-75 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-current/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono opacity-70">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>MahaRERA Escrow & Concurrency Protected</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-current/15 text-xs font-semibold hover:bg-current/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={!isAllChecked}
              onClick={() => {
                analyticsEngine.trackEvent('booking_started', {
                  type: 'UNIT',
                  id: unit?.id || 'unit_general',
                  name: unit ? `Unit ${unit.unitNumber}` : 'General Booking',
                  valueINR: unit?.priceBreakdown?.allInclusiveINR,
                });
                onConfirmAndProceed();
              }}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                isAllChecked
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:scale-105 cursor-pointer shadow-amber-500/20'
                  : 'bg-current/10 text-current/40 cursor-not-allowed'
              }`}
            >
              <span>I Confirm & Proceed to Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
