/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileCheck,
  Scale,
  Building,
  Landmark,
  ExternalLink,
  QrCode,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
  DollarSign,
} from 'lucide-react';
import { TrustCenterData } from '../types';
import { SEED_TRUST_CENTER_DATA } from '../data/experienceData';

interface TrustCenterSectionProps {
  theme?: 'dark' | 'light';
  data?: TrustCenterData;
  onOpenDocCenter?: () => void;
}

export const TrustCenterSection: React.FC<TrustCenterSectionProps> = ({
  theme = 'dark',
  data = SEED_TRUST_CENTER_DATA,
  onOpenDocCenter,
}) => {
  const isDark = theme === 'dark';
  const [showFullAuditLog, setShowFullAuditLog] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  return (
    <div
      className={`p-6 sm:p-10 rounded-3xl border space-y-8 animate-fade-in ${
        isDark ? 'bg-[#0B101C] border-amber-500/25 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
      }`}
    >
      {/* 1. HEADER & REAL-TIME TIMESTAMPS (ITEM 117) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b pb-6 border-current/10">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>LEGAL TITLE & MahaRERA GOVERNMENT VERIFIED</span>
            </div>
            <span className="text-xs opacity-60 font-mono">
              Completeness: <strong className="text-emerald-400">{data.informationCompletenessPercent}%</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">Kiaan Trust Center™</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Agency MahaRERA No: A031262603640
            </span>
          </div>

          {/* ITEM 117: Real Timestamps */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono opacity-80 pt-1">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Property Info Last Audited: <strong>{data.propertyInfoLastUpdatedDate}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Inventory Updated: <strong>{data.inventoryLastUpdatedRelative}</strong></span>
            </div>
          </div>
        </div>

        {/* MahaRERA QR & Official Link */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQrModal(true)}
            className="p-3 rounded-2xl bg-current/5 border border-current/10 hover:border-amber-500/40 text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors"
          >
            <QrCode className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Official MahaRERA QR</span>
          </button>

          <a
            href={data.reraOfficialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
          >
            <span>Verify on MahaRERA</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. THREE-PILLAR VERIFICATION STAMP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {/* Physical On-Site Audit */}
        <div className="p-5 rounded-2xl bg-current/5 border border-current/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase opacity-60 block">Physical Site Audit</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-bold text-sm text-emerald-400 block">Ground Truth Audited</span>
          <p className="opacity-75 text-[11px] font-sans">
            Conducted by {data.verificationStamp.physicalAuditorName} on {data.verificationStamp.physicalAuditDate}.
          </p>
        </div>

        {/* Legal Title Search */}
        <div className="p-5 rounded-2xl bg-current/5 border border-current/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase opacity-60 block">30-Year Title Search</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-bold text-sm text-emerald-400 block">Clear Freehold Title</span>
          <p className="opacity-75 text-[11px] font-sans">
            Audited by {data.verificationStamp.legalTitleAdvocateFirm} on {data.verificationStamp.legalTitleReportDate}.
          </p>
        </div>

        {/* Escrow Compliance */}
        <div className="p-5 rounded-2xl bg-current/5 border border-current/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase opacity-60 block">Sec 4(2)(l)(D) Escrow</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-bold text-sm text-emerald-400 block">70% Escrow Active</span>
          <p className="opacity-75 text-[11px] font-sans truncate">
            {data.verificationStamp.escrowBankVerified}
          </p>
        </div>
      </div>

      {/* 3. INFORMATION COMPLETENESS CHECKLIST (12 VERIFIED POINTS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base">Verified Information Completeness Audit</h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">12 / 12 Verified</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
          {data.completenessChecklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-current/5 border border-current/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="opacity-80 truncate">{item.field}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. PRICING & DOCUMENT AVAILABILITY */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase font-bold text-amber-500 block">
            Pricing Transparency Guarantee
          </span>
          <p className="text-xs opacity-80">
            Verified Developer Direct Pricing: ₹{data.pricePerSqFtCarpetAudit.toLocaleString('en-IN')}/sq.ft carpet. Zero brokerage, zero hidden floor-rise surcharges.
          </p>
        </div>

        <button
          onClick={onOpenDocCenter}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs cursor-pointer shadow-md hover:scale-105 transition-all whitespace-nowrap flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Access Verified Doc Center</span>
        </button>
      </div>

      {/* QR MODAL */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className={`w-full max-w-sm p-6 rounded-3xl border text-center space-y-4 relative ${
              isDark ? 'bg-[#0B101C] border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif font-bold text-lg">Official MahaRERA QR Code</h3>
            <p className="text-xs opacity-70">
              Scan with your smartphone camera to access the government project dossier on the official MahaRERA portal.
            </p>
            <div className="p-4 bg-white rounded-2xl inline-block shadow-lg mx-auto">
              <img src={data.reraQrCodeUrl} alt="MahaRERA QR" className="w-48 h-48 mx-auto" />
            </div>
            <div className="font-mono text-xs text-amber-500 font-bold">
              Reg No: {data.reraRegistrationNumber}
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-current/10 text-xs font-bold hover:bg-current/20 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
