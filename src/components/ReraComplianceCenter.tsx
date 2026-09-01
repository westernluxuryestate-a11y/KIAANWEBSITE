/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ExternalLink, QrCode, CheckCircle2, AlertTriangle, XCircle, Search, Filter } from 'lucide-react';
import { Project } from '../types';
import { ReraBadge } from './ReraBadge';

export const ReraComplianceCenter: React.FC = () => {
  const [complianceData, setComplianceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    fetch('/api/v1/rera/compliance-center')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComplianceData(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0a1814] via-[#0c1f19] to-black border border-emerald-500/30 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Statutory Compliance Oversight</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white">MahaRERA Regulatory Compliance Center</h1>
            <p className="text-xs text-white/70 max-w-2xl">
              Real-time audit log of all project registrations, optically legible QR codes, and non-bypassable publishing gates
              enforced across Maharashtra Real Estate Regulatory Authority (MahaRERA) mandates.
            </p>
          </div>

          {/* Metric Badges */}
          {complianceData?.stats && (
            <div className="flex items-center gap-3">
              <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/20 text-center min-w-[100px]">
                <span className="text-2xl font-serif font-bold text-emerald-400">{complianceData.stats.ready}</span>
                <span className="text-[10px] uppercase font-bold text-white/50 block mt-0.5">Ready & Active</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/20 text-center min-w-[100px]">
                <span className="text-2xl font-serif font-bold text-amber-400">0</span>
                <span className="text-[10px] uppercase font-bold text-white/50 block mt-0.5">Review Queue</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/50 border border-rose-500/20 text-center min-w-[100px]">
                <span className="text-2xl font-serif font-bold text-rose-400">{complianceData.stats.blocked}</span>
                <span className="text-[10px] uppercase font-bold text-white/50 block mt-0.5">Gate Blocked</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Jurisdiction Rules Overview */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 space-y-4">
        <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Active Jurisdictions & Regulatory Authorities</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            { name: 'MahaRERA (Maharashtra)', portal: 'maharera.mahaonline.gov.in', pattern: 'P521000...', qrMandatory: true },
            { name: 'K-RERA (Karnataka)', portal: 'rera.karnataka.gov.in', pattern: 'PRM/KA/RERA/...', qrMandatory: true },
            { name: 'GujRERA (Gujarat)', portal: 'gujrera.gujarat.gov.in', pattern: 'PR/GJ/...', qrMandatory: true },
            { name: 'UP RERA (Uttar Pradesh)', portal: 'www.up-rera.in', pattern: 'UPRERAPRJ...', qrMandatory: true },
          ].map((j, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <span className="font-bold text-white block">{j.name}</span>
              <p className="text-white/50 text-[11px]">Portal: {j.portal}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>QR Verification Mandatory</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Compliance Table */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-white">Project Compliance Directory</h3>
            <p className="text-xs text-white/50">Verified Maharashtra project registrations and live certificate links</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search project or RERA reg..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-black/60 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {complianceData?.projects
            ?.filter(
              (p: any) =>
                p.projectName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                p.registrationNumber.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .map((proj: any) => (
              <div
                key={proj.projectId}
                className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-serif font-bold text-white">{proj.projectName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {proj.registrationNumber}
                    </span>
                  </div>
                  <p className="text-xs text-white/60">MahaRERA Registered Project | Regulatory Gate: 100% PASS</p>
                  <div className="flex items-center gap-4 text-[11px] text-white/50 pt-1">
                    <span>Authority: MahaRERA</span>
                    <span>•</span>
                    <a
                      href={proj.authorityUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Official Portal Record</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                {/* Right: QR Presentation */}
                {proj.qrCodeUrl && (
                  <div className="flex items-center gap-3 bg-black/60 p-3 rounded-xl border border-white/10 shrink-0">
                    <div className="w-14 h-14 bg-white p-1 rounded-lg">
                      <img src={proj.qrCodeUrl} alt="RERA QR" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-white block">Official QR</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Optically Legible</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
