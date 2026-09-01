/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, Unit } from '../types';
import { formatINR } from '../services/calculatorEngine';
import {
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Smartphone,
  Mail,
  ArrowRight,
  FileText,
  Calendar,
  Building,
  Key,
  HelpCircle,
  Eye,
  DollarSign,
  Download,
} from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/seedData';

interface ProgressiveInformationUnlockProps {
  onOpenProjectExperience?: (projectId: string) => void;
  onScheduleVisit?: (project: Project) => void;
}

export const ProgressiveInformationUnlock: React.FC<ProgressiveInformationUnlockProps> = ({
  onOpenProjectExperience,
  onScheduleVisit,
}) => {
  // Tier 1 (Public / Free), Tier 2 (Verified OTP / Mobile), Tier 3 (VIP Pre-Approved / KYC)
  const [currentTier, setCurrentTier] = useState<'PUBLIC' | 'VERIFIED_LEAD' | 'VIP_ESCROW'>('PUBLIC');
  const [mobileInput, setMobileInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [selectedProject, setSelectedProject] = useState(INITIAL_PROJECTS[0]);

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length >= 4) {
      setCurrentTier('VERIFIED_LEAD');
      setIsOtpSent(false);
    }
  };

  const handleSendOtp = () => {
    if (mobileInput.length >= 10) {
      setIsOtpSent(true);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="progressive-unlock-suite">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B1525] via-[#080E1A] to-[#04070D] border border-amber-500/20 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Progressive Information Unlock & Value-First Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Tiered Intelligence & Statutory Document Access
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Zero friction discovery: explore public 3D elevations and price bands instantly. Unlock exact unit-level pricing breakdowns, MahaRERA title deeds, and developer payment milestones with 1-click mobile verification.
          </p>
        </div>

        {/* Tier State Indicator */}
        <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-white/10 relative z-10">
          <span className="text-xs text-white/40 uppercase font-bold">Your Clearance Level:</span>
          {[
            { id: 'PUBLIC', label: '1. Public Explorer', desc: 'Photos, Maps, Floor Plans' },
            { id: 'VERIFIED_LEAD', label: '2. Verified VIP', desc: 'Exact Unit Pricing, Escrow Deeds' },
            { id: 'VIP_ESCROW', label: '3. Digital Token / Allotted', desc: 'E-Sign, 15-Min Unit Lock' },
          ].map((t) => {
            const isActive = currentTier === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setCurrentTier(t.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {isActive ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progressive Capture Flow Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Public Intelligence (Always Unlocked) */}
        <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Publicly Available</span>
            </span>
            <span className="text-[10px] text-white/40 font-mono">Tier 1</span>
          </div>

          <h3 className="text-base font-bold text-white">Spatial Discovery & Indicative Pricing</h3>
          <ul className="space-y-2.5 text-xs text-white/70">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>High-resolution 3D Architectural Renders & Tours</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Indicative headline price ranges by configuration</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Public MahaRERA Registration ID & Official Authority link</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Neighborhood commute & school connectivity metrics</span>
            </li>
          </ul>

          <div className="pt-4 border-t border-white/5">
            <span className="text-xs text-emerald-400 font-semibold">100% Free & Open Access — No Login Required</span>
          </div>
        </div>

        {/* Step 2: Verified VIP Tier (Unlocked via 1-Click Mobile OTP) */}
        <div className={`rounded-3xl border p-6 space-y-4 shadow-xl transition-all ${
          currentTier === 'PUBLIC'
            ? 'bg-[#0A0F1D]/80 border-white/10 opacity-90'
            : 'bg-[#0D1525]/90 border-amber-500/40 shadow-amber-500/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 ${
              currentTier !== 'PUBLIC'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-white/5 text-white/50 border border-white/10'
            }`}>
              {currentTier !== 'PUBLIC' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{currentTier !== 'PUBLIC' ? 'Unlocked & Active' : 'Requires Mobile OTP'}</span>
            </span>
            <span className="text-[10px] text-white/40 font-mono">Tier 2</span>
          </div>

          <h3 className="text-base font-bold text-white">Unit Matrix & Statutory Legal Vault</h3>

          {currentTier === 'PUBLIC' ? (
            <div className="space-y-4">
              <p className="text-xs text-white/60 leading-relaxed">
                Unlock exact unit-by-unit agreement values, stamp duty itemization, certified encumbrance certificates, and downloadable MahaRERA sanctioned layouts.
              </p>

              {/* Progressive Value-First Lead Form */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-amber-400 block">Instant 10-Second OTP Unlock:</span>
                {!isOtpSent ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-xl px-3 py-2">
                      <Smartphone className="w-4 h-4 text-white/40 shrink-0" />
                      <span className="text-xs text-white/60">+91</span>
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={mobileInput}
                        onChange={(e) => setMobileInput(e.target.value)}
                        className="w-full bg-transparent text-xs text-white focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleSendOtp}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all cursor-pointer"
                    >
                      Send VIP Access OTP
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter 4-digit OTP (e.g. 5291)"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full bg-black/40 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white text-center tracking-widest font-mono"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all cursor-pointer"
                    >
                      Verify & Unlock Intelligence Vault
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Verified VIP Lead status active. All legal documents unlocked.</span>
              </div>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                  <span>MahaRERA Sanctioned Layout Plan</span>
                  <button className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer">
                    <Download className="w-3 h-3" />
                    <span>PDF</span>
                  </button>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                  <span>Title Search & Non-Encumbrance Report (30-Yr)</span>
                  <button className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer">
                    <Download className="w-3 h-3" />
                    <span>PDF</span>
                  </button>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                  <span>Statutory MahaRERA Escrow Account Details</span>
                  <span className="text-emerald-400 font-mono font-bold">SBI Escrow Verified</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Step 3: Digital Token & Allotment Tier */}
        <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold uppercase flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>Transact & Allocate</span>
              </span>
              <span className="text-[10px] text-white/40 font-mono">Tier 3</span>
            </div>

            <h3 className="text-base font-bold text-white">15-Minute Unit Hold & Tokenized E-Sign</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Legally binding digital unit reservation with instant ₹51,000 token escrow lock, Aadhaar e-Sign agreement, and dedicated Senior Relationship Partner assignment.
            </p>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5 text-xs text-white/70">
              <div className="flex justify-between">
                <span>Direct Site Visit Chauffeured Pickup:</span>
                <span className="text-white font-bold">Complimentary</span>
              </div>
              <div className="flex justify-between">
                <span>Bespoke Financial Structuring:</span>
                <span className="text-amber-400 font-bold">Dedicated CA</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onScheduleVisit && onScheduleVisit(selectedProject)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Private Chauffeur Site Experience</span>
          </button>
        </div>
      </div>
    </div>
  );
};
