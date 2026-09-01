/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe,
  Coins,
  ShieldCheck,
  FileCheck2,
  Building,
  CheckCircle2,
  AlertTriangle,
  Plane,
  Clock,
  Video,
  X,
  Sparkles,
  DollarSign,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import { CurrencyCode, CurrencyConfig } from '../types';
import {
  CURRENCY_REGISTRY,
  STATUTORY_CURRENCY_DISCLAIMER,
  convertCurrency,
  formatINR,
} from '../services/currencyEngine';

interface NriExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  theme?: 'dark' | 'light';
}

export const NriExperienceModal: React.FC<NriExperienceModalProps> = ({
  isOpen,
  onClose,
  selectedCurrency,
  onCurrencyChange,
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'CURRENCY' | 'TAX_FEMA' | 'POA' | 'LOANS' | 'REMOTE_BUYING'>('CURRENCY');
  const [sampleINR, setSampleINR] = useState<number>(14800000); // 1.48 Cr standard luxury unit

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const converted = convertCurrency(sampleINR, selectedCurrency);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        className={`w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-[#080D1A] border-amber-500/30 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-current/10 flex items-center justify-between flex-shrink-0 bg-current/5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold tracking-wide">
                  NRI Global Client Experience & Multi-Currency Suite
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  FEMA & RBI Compliant
                </span>
              </div>
              <p className="text-xs opacity-60">
                Cross-border multi-currency estimation, FEMA NRE/NRO frameworks, PoA facilitation & 100% remote digital buying
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-current/10 opacity-60 hover:opacity-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUB-TABS */}
        <div className="flex border-b border-current/10 p-2 gap-1 bg-current/[0.02] flex-shrink-0 overflow-x-auto no-scrollbar">
          {[
            { key: 'CURRENCY', label: 'Multi-Currency Engine', icon: Coins },
            { key: 'TAX_FEMA', label: 'FEMA & Tax (TDS / NRE / NRO)', icon: ShieldCheck },
            { key: 'POA', label: 'Power of Attorney (PoA)', icon: FileCheck2 },
            { key: 'LOANS', label: 'NRI Home Financing', icon: DollarSign },
            { key: 'REMOTE_BUYING', label: '100% Remote Digital Buying', icon: Video },
          ].map((tab) => {
            const isSelected = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-md'
                    : isDark
                    ? 'hover:bg-white/5 text-white/70'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: MULTI-CURRENCY ENGINE */}
          {activeTab === 'CURRENCY' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* CURRENCY SELECTOR PILLS */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500 block">
                  Select Your Preferred Global Currency:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(Object.keys(CURRENCY_REGISTRY) as CurrencyCode[]).map((code) => {
                    const cfg = CURRENCY_REGISTRY[code];
                    const isSelected = selectedCurrency === code;
                    return (
                      <button
                        key={code}
                        onClick={() => onCurrencyChange(code)}
                        className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/25'
                            : isDark
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                            : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-900'
                        }`}
                      >
                        <span className="font-mono text-lg font-bold block">{cfg.symbol}</span>
                        <strong className="text-xs block mt-1">{cfg.code}</strong>
                        <span className="text-[10px] opacity-70 block">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LIVE CONVERSION CALCULATOR */}
              <div
                className={`p-6 rounded-3xl border ${
                  isDark ? 'bg-amber-500/10 border-amber-500/40 text-white' : 'bg-amber-50 border-amber-400 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block">
                      Live Dual-Currency Conversion Matrix
                    </span>
                    <h3 className="font-serif text-lg font-bold">Standard 3.5 BHK Sky Residence</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs opacity-60">Benchmark Rate:</span>
                    <div className="font-mono text-xs font-bold">
                      1 {selectedCurrency} ≈ ₹{CURRENCY_REGISTRY[selectedCurrency].inrPerUnit} INR
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold opacity-60 block">Official Indian Statutory Price</span>
                    <div className="font-serif text-2xl font-bold text-amber-400 mt-1">
                      {converted.inrFormatted}
                    </div>
                    <span className="text-[10px] opacity-60 block mt-0.5">MahaRERA Agreement Value</span>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold opacity-60 block">
                      Estimated Global Equivalent ({selectedCurrency})
                    </span>
                    <div className="font-serif text-2xl font-bold text-emerald-400 mt-1">
                      {converted.formatted}
                    </div>
                    <span className="text-[10px] opacity-60 block mt-0.5">Indicative Estimate (Excludes Wire Fees)</span>
                  </div>
                </div>

                {/* STATUTORY MANDATORY DISCLAIMER AS REQUIRED */}
                <div className="mt-4 pt-4 border-t border-current/10 flex items-start gap-2.5 text-[11px] opacity-80 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-500">Statutory Currency Notice: </strong>
                    {STATUTORY_CURRENCY_DISCLAIMER}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEMA & TAXATION (TDS / NRE / NRO) */}
          {activeTab === 'TAX_FEMA' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div
                className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-500 uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>FEMA (Foreign Exchange Management Act) Compliance</span>
                </div>
                <p className="text-xs leading-relaxed opacity-85">
                  Under general permission granted by the Reserve Bank of India (RBI), Non-Resident Indians (NRIs) and Overseas Citizens of India (OCIs) can purchase unlimited residential or commercial properties in India without requiring prior approval.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500 mb-2">
                    NRE vs. NRO Account Usage
                  </h4>
                  <ul className="text-xs space-y-2 opacity-80 leading-relaxed list-disc pl-4">
                    <li><strong>NRE (Non-Resident External)</strong>: Funded via foreign inward remittances. 100% principal and capital gains are freely repatriable back to your home country.</li>
                    <li><strong>NRO (Non-Resident Ordinary)</strong>: Used for income originating in India (rents, dividends). Repatriable up to USD 1,000,000 per financial year under Form 15CA/15CB.</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500 mb-2">
                    TDS & Capital Gains Advisory
                  </h4>
                  <ul className="text-xs space-y-2 opacity-80 leading-relaxed list-disc pl-4">
                    <li><strong>Purchase from Developer</strong>: Standard 1% TDS applies if property value exceeds ₹50 Lakhs.</li>
                    <li><strong>Re-sale by NRI</strong>: Section 195 TDS applies at 20% on Long Term Capital Gains. Kiaan Tax Cell assists in acquiring Nil/Lower TDS Certificate (Form 13).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POWER OF ATTORNEY (PoA) */}
          {activeTab === 'POA' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-amber-500 uppercase tracking-wider">
                  <FileCheck2 className="w-4 h-4" />
                  <span>PoA Execution Workflow for Overseas Clients</span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed">
                  If you cannot travel to India for physical agreement registration at the Sub-Registrar Office, you can execute a Specific Power of Attorney (PoA) in favor of a trusted family member or our legal concierge.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white border-slate-200'}`}>
                    <span className="font-bold text-xs block text-amber-400">Step 1: Drafting</span>
                    <p className="text-[11px] opacity-70 mt-1">We prepare the standardized MahaRERA Specific PoA draft.</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white border-slate-200'}`}>
                    <span className="font-bold text-xs block text-amber-400">Step 2: Attestation</span>
                    <p className="text-[11px] opacity-70 mt-1">Get it notarized or attested at your nearest Indian Embassy / Consulate.</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white border-slate-200'}`}>
                    <span className="font-bold text-xs block text-amber-400">Step 3: Adjudication</span>
                    <p className="text-[11px] opacity-70 mt-1">Adjudicated and stamped in Pune within 90 days of receipt.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NRI HOME LOANS */}
          {activeTab === 'LOANS' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Loan Eligibility', val: 'Up to 80% LTV', desc: 'Pre-approved tie-ups with HDFC, ICICI, SBI & Axis Bank' },
                  { title: 'Tenure Options', val: 'Up to 20 Years', desc: 'Flexible repayment via NRE/NRO automatic direct debit' },
                  { title: 'Processing Time', val: '7 to 10 Working Days', desc: 'Fast-track digital KYC for US, UK, UAE & Singapore NRIs' },
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold opacity-60 block">{item.title}</span>
                    <strong className="font-serif text-lg font-bold text-amber-400 block mt-1">{item.val}</strong>
                    <p className="text-xs opacity-70 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: 100% REMOTE DIGITAL BUYING */}
          {activeTab === 'REMOTE_BUYING' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div
                className={`p-6 rounded-3xl border text-center space-y-4 ${
                  isDark ? 'bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/30' : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <Video className="w-10 h-10 mx-auto text-amber-500" />
                <h3 className="font-serif text-xl font-bold">VIP Virtual Walkthrough & Digital Escrow Desk</h3>
                <p className="text-xs opacity-75 max-w-md mx-auto leading-relaxed">
                  Experience full 360-degree real-time drone aerial views from the exact floor height (e.g. 24th floor), live sun-path simulations, and complete digital agreement signing from the comfort of your home.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      alert('Connecting you to Kiaan NRI Private Wealth Concierge on WhatsApp...');
                      window.open('https://api.whatsapp.com/send?text=Hello%20Kiaan%20Estates,%20I%20would%20like%20to%20schedule%20a%20VIP%20NRI%20Virtual%20Tour.', '_blank');
                    }}
                    className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                  >
                    Schedule 1-on-1 Virtual Walkthrough
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
