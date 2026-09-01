/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, ExternalLink, QrCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { RERARecord } from '../types';

interface ReraBadgeProps {
  reraRecord?: RERARecord;
  compact?: boolean;
}

export const ReraBadge: React.FC<ReraBadgeProps> = ({ reraRecord, compact = false }) => {
  if (!reraRecord) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>RERA Documentation Under Review</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">MAHARERA REGISTERED</span>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-xs font-mono font-bold text-white tracking-wide">{reraRecord.registrationNumber}</p>
          </div>
        </div>
        <a
          href={reraRecord.officialAuthorityUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>Verify</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div
      id="rera-statutory-card"
      className="rounded-2xl bg-gradient-to-br from-[#0c1915] to-[#091210] border border-emerald-500/30 p-5 shadow-xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left info */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>STATUTORY COMPLIANCE</span>
            </div>
            <span className="text-xs text-white/50">Jurisdiction: {reraRecord.jurisdiction}</span>
          </div>

          <h4 className="text-base font-serif font-bold text-white tracking-wide">
            Maharashtra Real Estate Regulatory Authority (MahaRERA)
          </h4>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 font-mono text-sm font-bold text-emerald-300">
              Reg. No: <span className="text-white">{reraRecord.registrationNumber}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified & Audited</span>
            </div>
          </div>
        </div>

        {/* Right: QR code display */}
        <div className="flex items-center gap-3 bg-black/50 p-3 rounded-xl border border-emerald-500/20">
          <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
            <img
              src={reraRecord.qrCodeUrl}
              alt={`MahaRERA QR for ${reraRecord.registrationNumber}`}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-white">
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Legible MahaRERA QR</span>
            </div>
            <p className="text-[10px] text-white/60 leading-tight max-w-[130px]">
              Scan to view official statutory certificate on government portal.
            </p>
            <a
              href={reraRecord.officialAuthorityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 underline"
            >
              <span>Authority Portal</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
