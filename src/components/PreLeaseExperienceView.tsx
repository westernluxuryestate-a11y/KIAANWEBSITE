/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  Building,
  ShieldCheck,
  Calendar,
  Lock,
  ArrowUpRight,
  Calculator,
  Percent,
  CheckCircle2,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Clock,
  Sparkles,
  MapPin,
  ChevronRight,
  BarChart3,
  Layers,
} from 'lucide-react';
import { CurrencyCode, PreLeaseAsset, ScenarioReturnModel } from '../types';
import { SEED_PRE_LEASE_ASSETS } from '../data/experienceData';
import { convertCurrency, formatINR } from '../services/currencyEngine';
import { analyticsEngine } from '../services/analyticsStore';

interface PreLeaseExperienceViewProps {
  currency?: CurrencyCode;
  theme?: 'dark' | 'light';
  onOpenDocCenter?: (asset: PreLeaseAsset) => void;
  onOpenMakeOffer?: (asset: PreLeaseAsset) => void;
  onScheduleVisit?: (asset: PreLeaseAsset) => void;
}

export const PreLeaseExperienceView: React.FC<PreLeaseExperienceViewProps> = ({
  currency = 'INR',
  theme = 'dark',
  onOpenDocCenter,
  onOpenMakeOffer,
  onScheduleVisit,
}) => {
  const isDark = theme === 'dark';
  const [selectedAssetId, setSelectedAssetId] = useState<string>(SEED_PRE_LEASE_ASSETS[0].id);
  const [activeScenario, setActiveScenario] = useState<'BASE_CASE' | 'BULL_CASE' | 'BEAR_CASE'>('BASE_CASE');
  const [investmentHoldingYears, setInvestmentHoldingYears] = useState<number>(5);

  const activeAsset = SEED_PRE_LEASE_ASSETS.find((a) => a.id === selectedAssetId) || SEED_PRE_LEASE_ASSETS[0];
  const scenarioModel: ScenarioReturnModel =
    activeScenario === 'BASE_CASE'
      ? activeAsset.scenarioReturns.baseCase
      : activeScenario === 'BULL_CASE'
      ? activeAsset.scenarioReturns.bullCase
      : activeAsset.scenarioReturns.bearCase;

  // Converted prices
  const purchasePriceConv = convertCurrency(activeAsset.purchasePriceINR, currency as CurrencyCode);
  const monthlyRentConv = convertCurrency(activeAsset.currentMonthlyRentINR, currency as CurrencyCode);

  return (
    <div className={`space-y-12 animate-fade-in ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* 1. HEADER & VALUE PROPOSITION */}
      <div
        className={`p-8 sm:p-12 rounded-3xl border relative overflow-hidden shadow-2xl transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#0F172A] via-[#0A101D] to-[#060911] border-amber-500/25'
            : 'bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200'
        }`}
      >
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL PRE-LEASE & CO-TENANCY SUITE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Pre-Leased Commercial & Logistics Assets
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed max-w-3xl ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
            Acquire fully tenanted Grade-A institutional real estate with established Fortune 500 & MNC anchors. Receive day-one rental credit with 5 to 7 year non-cancellable lock-in periods and structured annual escalations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>8.64% - 9.47% Gross Yield</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% MahaRERA Audited Title</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>Direct Bank Escrow Payouts</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ASSET SELECTOR CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-current/10">
          <h2 className="text-xl sm:text-2xl font-serif font-bold">Selected Pre-Lease Portfolio</h2>
          <span className="text-xs opacity-60 font-mono">3 Verified Institutional Assets</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEED_PRE_LEASE_ASSETS.map((asset) => {
            const isSelected = asset.id === selectedAssetId;
            const price = convertCurrency(asset.purchasePriceINR, currency as CurrencyCode);
            return (
              <div
                key={asset.id}
                onClick={() => {
                  setSelectedAssetId(asset.id);
                  analyticsEngine.trackEvent('property_viewed', {
                    type: 'PROPERTY',
                    id: asset.id,
                    name: asset.assetTitle,
                    valueINR: asset.purchasePriceINR,
                  });
                }}
                className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? isDark
                      ? 'bg-[#111A2E] border-amber-500 ring-2 ring-amber-500/30 shadow-2xl scale-[1.02]'
                      : 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/30 shadow-xl scale-[1.02]'
                    : isDark
                    ? 'bg-[#0B101C] border-white/10 hover:border-amber-500/40'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                      {asset.grossRentalYieldPercent}% GROSS YIELD
                    </span>
                    <span className="text-[11px] opacity-60 font-mono">{asset.lockInPeriodYears}Y Lock-in</span>
                  </div>

                  <h3 className="font-serif font-bold text-base line-clamp-2">{asset.assetTitle}</h3>

                  <div className="flex items-center gap-1.5 text-xs opacity-70">
                    <Building className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-medium text-amber-400">{asset.tenantName}</span>
                  </div>

                  <p className="text-xs opacity-60 line-clamp-1">{asset.location.microMarket}</p>
                </div>

                <div className="pt-4 border-t border-current/10 flex items-center justify-between font-mono text-xs mt-4">
                  <div>
                    <span className="text-[10px] opacity-50 block uppercase">Price</span>
                    <span className="font-bold text-amber-500">{price.formatted}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] opacity-50 block uppercase">Monthly Rent</span>
                    <span className="font-bold text-emerald-400">₹{(asset.currentMonthlyRentINR / 100000).toFixed(2)}L/mo</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DEEP DIVE PRE-LEASE AUDIT PANEL */}
      <div
        className={`p-6 sm:p-10 rounded-3xl border space-y-8 ${
          isDark ? 'bg-[#0B101C] border-amber-500/20' : 'bg-white border-slate-200 shadow-lg'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b pb-6 border-current/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 font-bold text-xs font-mono">
                MahaRERA: {activeAsset.reraRegNumber}
              </span>
              <span className="text-xs opacity-60">Verified Active Lease</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">{activeAsset.assetTitle}</h2>
            <p className="text-xs opacity-75 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{activeAsset.location.address}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onScheduleVisit && onScheduleVisit(activeAsset)}
              className="px-5 py-2.5 rounded-xl border border-current/15 text-xs font-semibold hover:bg-current/5 cursor-pointer transition-colors"
            >
              Schedule Asset Audit
            </button>
            <button
              onClick={() => onOpenMakeOffer && onOpenMakeOffer(activeAsset)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              Submit Digital Acquisition Offer
            </button>
          </div>
        </div>

        {/* 8-POINT MANDATORY SPECIFICATION GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
            <span className="text-[10px] uppercase opacity-60 font-mono block">Tenant & Rating</span>
            <span className="font-bold text-sm block truncate">{activeAsset.tenantName}</span>
            <span className="text-[11px] text-emerald-400 font-mono">{activeAsset.tenantCreditRating}</span>
          </div>

          <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
            <span className="text-[10px] uppercase opacity-60 font-mono block">Monthly Rent</span>
            <span className="font-bold text-sm text-emerald-400 block font-mono">
              ₹{(activeAsset.currentMonthlyRentINR / 100000).toFixed(2)} Lakhs
            </span>
            <span className="text-[11px] opacity-60 font-mono">₹{activeAsset.rentPerSqFtINR} / sq.ft carpet</span>
          </div>

          <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
            <span className="text-[10px] uppercase opacity-60 font-mono block">Annual Escalation</span>
            <span className="font-bold text-sm text-amber-500 block font-mono">
              {activeAsset.annualEscalationPercent}% p.a.
            </span>
            <span className="text-[11px] opacity-60">Compounding every 12 months</span>
          </div>

          <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
            <span className="text-[10px] uppercase opacity-60 font-mono block">Lock-In Period</span>
            <span className="font-bold text-sm text-blue-400 block font-mono">
              {activeAsset.lockInPeriodYears} Years Locked
            </span>
            <span className="text-[11px] opacity-60">Expires: {activeAsset.lockInExpiresDate}</span>
          </div>

          <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
            <span className="text-[10px] uppercase opacity-60 font-mono block">Total Lease Expiry</span>
            <span className="font-bold text-sm block font-mono">{activeAsset.overallLeaseExpiryDate}</span>
            <span className="text-[11px] opacity-60">{activeAsset.securityDepositMonths} Mos Security Deposit</span>
          </div>

          <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
            <span className="text-[10px] uppercase opacity-60 font-mono block">Rental Yield (Gross / Net)</span>
            <span className="font-bold text-sm text-emerald-400 block font-mono">
              {activeAsset.grossRentalYieldPercent}% / {activeAsset.netRentalYieldPercent}%
            </span>
            <span className="text-[11px] opacity-60">Triple Net Structure</span>
          </div>

          <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
            <span className="text-[10px] uppercase opacity-60 font-mono block">Purchase Price</span>
            <span className="font-bold text-sm text-amber-500 block font-mono">{purchasePriceConv.formatted}</span>
            <span className="text-[11px] opacity-60 font-mono">₹{activeAsset.pricePerSqFtINR.toLocaleString('en-IN')}/sq.ft</span>
          </div>

          <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
            <span className="text-[10px] uppercase opacity-60 font-mono block">Carpet Area & Fitout</span>
            <span className="font-bold text-sm block font-mono">{activeAsset.carpetAreaSqFt.toLocaleString()} sq.ft</span>
            <span className="text-[11px] text-amber-400">₹{(activeAsset.fitoutInvestmentByTenantINR / 10000000).toFixed(1)} Cr Tenant Fitout</span>
          </div>
        </div>

        {/* 4. SCENARIO RETURNS & SENSITIVITY ENGINE */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
            isDark ? 'bg-[#070A11] border-white/10' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-current/10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif font-bold text-lg">Scenario Return Simulation Engine</h3>
              </div>
              <p className="text-xs opacity-70">
                Stress-test yield, escalation, capital growth CAGR, and tenant vacancy buffers over 5 & 10 year horizons.
              </p>
            </div>

            {/* Scenario Switcher */}
            <div
              className={`inline-flex p-1 rounded-xl border ${
                isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-300'
              }`}
            >
              {(
                [
                  { id: 'BASE_CASE', label: 'Base Case' },
                  { id: 'BULL_CASE', label: 'Bull Case (+10% CAGR)' },
                  { id: 'BEAR_CASE', label: 'Conservative' },
                ] as const
              ).map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenario(sc.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeScenario === sc.id
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
              <span className="opacity-60 text-[10px] uppercase block">Assumed Rent Escalation</span>
              <span className="text-base font-bold text-amber-500">{scenarioModel.assumedAnnualRentEscalationPercent}% p.a.</span>
              <span className="opacity-50 text-[11px] block">Contractual compounding</span>
            </div>

            <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
              <span className="opacity-60 text-[10px] uppercase block">Capital Growth CAGR</span>
              <span className="text-base font-bold text-blue-400">{scenarioModel.assumedCapitalAppreciationCagrPercent}% p.a.</span>
              <span className="opacity-50 text-[11px] block">Micro-market benchmark</span>
            </div>

            <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
              <span className="opacity-60 text-[10px] uppercase block">5-Year Cumulative Rental Cash Flow</span>
              <span className="text-base font-bold text-emerald-400">
                ₹{(scenarioModel.fiveYearGrossRentalIncomeINR / 10000000).toFixed(2)} Cr
              </span>
              <span className="opacity-50 text-[11px] block">Net of CAM & Property Tax</span>
            </div>

            <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
              <span className="opacity-60 text-[10px] uppercase block">5-Year Projected IRR</span>
              <span className="text-xl font-bold text-emerald-400">{scenarioModel.fiveYearIrrPercent}% IRR</span>
              <span className="opacity-50 text-[11px] block">10-Yr IRR: {scenarioModel.tenYearIrrPercent}%</span>
            </div>
          </div>

          {/* 10-Year Cumulative Wealth Creation Bar */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-amber-500 font-mono">
                10-Year Total Net Wealth Created (Rental + Capital Appreciation)
              </span>
              <p className="text-xs opacity-75">
                Includes all escalations, reinvested cash flow, and terminal asset disposition value.
              </p>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-amber-400 flex-shrink-0">
              ₹{(scenarioModel.tenYearTotalNetWealthCreatedINR / 10000000).toFixed(2)} Crores
            </div>
          </div>
        </div>

        {/* KEY HIGHLIGHTS */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-amber-500">Asset Architectural & Tenancy Highlights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {activeAsset.keyFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-current/5 border border-current/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="opacity-80 leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
