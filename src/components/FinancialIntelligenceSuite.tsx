/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BankLoanOffer, TaxOptimizationResult, AppreciationForecastReport } from '../types';
import { formatINR } from '../services/calculatorEngine';
import {
  TrendingUp,
  Percent,
  Landmark,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  PieChart,
  DollarSign,
  Building,
  Calculator,
  CheckCircle2,
  Info,
} from 'lucide-react';

export function FinancialIntelligenceSuite() {
  const [activeSubTab, setActiveSubTab] = useState<'BANK_COMPARATOR' | 'TAX_SHIELD' | 'APPRECIATION' | 'LEVERAGE'>('TAX_SHIELD');

  // Input states
  const [propertyPrice, setPropertyPrice] = useState<number>(18500000); // ₹1.85 Cr
  const [downpaymentPercent, setDownpaymentPercent] = useState<number>(20);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [selectedMicroMarket, setSelectedMicroMarket] = useState<string>('Wakad');
  const [selectedTaxBracket, setSelectedTaxBracket] = useState<number>(31.2); // 30% + 4% cess

  // Calculated API responses
  const [bankOffers, setBankOffers] = useState<BankLoanOffer[]>([]);
  const [taxResult, setTaxResult] = useState<TaxOptimizationResult | null>(null);
  const [appreciationReport, setAppreciationReport] = useState<AppreciationForecastReport | null>(null);
  const [leverageData, setLeverageData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loanPrincipal = propertyPrice * (1 - downpaymentPercent / 100);

  // Fetch Bank Offers on mount
  useEffect(() => {
    fetch('/api/v1/finance/bank-offers')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setBankOffers(data.data);
      });
  }, []);

  // Recalculate Tax Optimization
  useEffect(() => {
    fetch('/api/v1/finance/tax-optimization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        loanPrincipal,
        annualInterestRatePercent: 8.45,
        tenureYears: loanTenureYears,
        taxBracketPercent: selectedTaxBracket,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTaxResult(data.data);
      });
  }, [loanPrincipal, loanTenureYears, selectedTaxBracket]);

  // Recalculate Appreciation Forecast
  useEffect(() => {
    fetch('/api/v1/finance/appreciation-forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyPriceINR: propertyPrice,
        microMarket: selectedMicroMarket,
        forecastYears: 5,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAppreciationReport(data.data);
      });
  }, [propertyPrice, selectedMicroMarket]);

  // Recalculate Leverage
  useEffect(() => {
    fetch('/api/v1/finance/leverage-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyPriceINR: propertyPrice,
        loanInterestRate: 8.45,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setLeverageData(data.data);
      });
  }, [propertyPrice]);

  return (
    <div className="space-y-8 animate-fade-in" id="financial-intelligence-suite">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0C1427] via-[#080E1B] to-[#04060A] border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Kiaan Financial Intelligence™</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Institutional Acquisition Modeling, Tax Shield & Wealth Forecasts
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Institutional-grade analysis featuring Section 80C & 24(b) statutory income tax optimization, live bank benchmark comparisons, and 5-year micro-market capital compounding.
          </p>
        </div>

        {/* Global Property Configuration Bar */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 relative z-10">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/60 uppercase">Asset Acquisition Value</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={10000000}
                max={50000000}
                step={1000000}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="flex-1 accent-amber-500 cursor-pointer"
              />
              <span className="text-sm font-bold text-amber-400 min-w-[75px] text-right">{formatINR(propertyPrice)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/60 uppercase">Downpayment ({downpaymentPercent}%)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={downpaymentPercent}
                onChange={(e) => setDownpaymentPercent(Number(e.target.value))}
                className="flex-1 accent-amber-500 cursor-pointer"
              />
              <span className="text-sm font-bold text-white min-w-[75px] text-right">{formatINR(propertyPrice * (downpaymentPercent / 100))}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/60 uppercase">Micro-Market Corridor</label>
            <select
              value={selectedMicroMarket}
              onChange={(e) => setSelectedMicroMarket(e.target.value)}
              className="w-full rounded-xl bg-white/[0.06] border border-white/15 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50 font-medium"
            >
              <option value="Wakad" className="bg-[#0D1527]">Wakad (IT & High Street Corridor)</option>
              <option value="Baner" className="bg-[#0D1527]">Baner (A-Grade Commercial Hub)</option>
              <option value="Hinjewadi" className="bg-[#0D1527]">Hinjewadi (Tech Catchment Phase 1-3)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'TAX_SHIELD', label: 'Statutory Tax Shield (80C & 24b)', icon: ShieldCheck },
          { id: 'BANK_COMPARATOR', label: 'Bank Benchmark Rates', icon: Landmark },
          { id: 'APPRECIATION', label: '5-Year Wealth & Rental Forecast', icon: TrendingUp },
          { id: 'LEVERAGE', label: 'Downpayment & Leverage Optimizer', icon: Percent },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-white/[0.04] text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STATUTORY TAX SHIELD (SECTION 80C & 24B) */}
      {activeSubTab === 'TAX_SHIELD' && taxResult && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric Card 1 */}
            <div className="rounded-3xl bg-[#0E1626]/90 border border-white/10 p-6 space-y-2 relative overflow-hidden">
              <div className="text-[11px] uppercase tracking-wider text-white/50 font-bold">Gross Monthly EMI</div>
              <div className="text-3xl font-bold text-white">{formatINR(taxResult.annualGrossEmi / 12)}</div>
              <p className="text-xs text-white/40">Standard loan payment before statutory deductions</p>
            </div>

            {/* Metric Card 2 */}
            <div className="rounded-3xl bg-emerald-950/40 border border-emerald-500/30 p-6 space-y-2 relative overflow-hidden">
              <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Monthly Tax Shield Benefit</span>
              </div>
              <div className="text-3xl font-bold text-emerald-300">-{formatINR(taxResult.monthlyTaxShieldINR)}</div>
              <p className="text-xs text-emerald-200/60">Effective government tax credit via 80C + 24(b)</p>
            </div>

            {/* Metric Card 3 */}
            <div className="rounded-3xl bg-amber-500/10 border border-amber-500/30 p-6 space-y-2 relative overflow-hidden">
              <div className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Net Effective Monthly EMI</div>
              <div className="text-3xl font-bold text-amber-300">{formatINR(taxResult.monthlyNetEffectiveEmiINR)}</div>
              <p className="text-xs text-amber-200/60">Actual out-of-pocket monthly commitment</p>
            </div>
          </div>

          {/* Detailed Tax Breakdown Box */}
          <div className="rounded-3xl bg-[#0C1220]/90 border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Indian Income Tax Act Statutory Optimization Engine</h3>
                <p className="text-xs text-white/50">Modeling eligible principal and interest tax deductions under the Old Tax Regime</p>
              </div>

              {/* Tax Bracket Selector */}
              <div className="flex items-center gap-2 bg-white/[0.05] p-1.5 rounded-xl border border-white/10">
                <span className="text-xs text-white/60 px-2 font-medium">Your Tax Bracket:</span>
                {[
                  { label: '30% (+4% cess)', val: 31.2 },
                  { label: '20% slab', val: 20 },
                  { label: '15% slab', val: 15 },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => setSelectedTaxBracket(s.val)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTaxBracket === s.val ? 'bg-amber-500 text-black' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section 80C */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                    <h4 className="text-sm font-bold text-white">Section 80C: Principal Repayment</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 text-[10px] font-bold">Max ₹1.50 L/yr</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Eligible Year 1 Principal Paid:</span>
                    <span className="text-white font-medium">{formatINR(taxResult.annualPrincipalEligible80C)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Actual Allowable Deduction Claim:</span>
                    <span className="text-emerald-400 font-bold">{formatINR(taxResult.actualDeduction80C)}</span>
                  </div>
                  <div className="flex justify-between text-white/60 pt-2 border-t border-white/5">
                    <span>Annual Tax Saved (@ {taxResult.taxBracketPercent}%):</span>
                    <span className="text-white font-bold">{formatINR(taxResult.actualDeduction80C * (taxResult.taxBracketPercent / 100))}</span>
                  </div>
                </div>
              </div>

              {/* Section 24(b) */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <h4 className="text-sm font-bold text-white">Section 24(b): Self-Occupied Interest</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] font-bold">Max ₹2.00 L/yr</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Eligible Year 1 Interest Paid:</span>
                    <span className="text-white font-medium">{formatINR(taxResult.annualInterestEligible24b)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Actual Allowable Deduction Claim:</span>
                    <span className="text-emerald-400 font-bold">{formatINR(taxResult.actualDeduction24b)}</span>
                  </div>
                  <div className="flex justify-between text-white/60 pt-2 border-t border-white/5">
                    <span>Annual Tax Saved (@ {taxResult.taxBracketPercent}%):</span>
                    <span className="text-white font-bold">{formatINR(taxResult.actualDeduction24b * (taxResult.taxBracketPercent / 100))}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 10-Year Wealth Shield Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">10-Year Cumulative Tax Shield Wealth Retained</h4>
                  <p className="text-xs text-white/60">
                    Total direct tax liability reduction returned to your wealth corpus over first decade of loan amortization.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-amber-400 block">{formatINR(taxResult.tenYearCumulativeTaxSavingsINR)}</span>
                <span className="text-[10px] text-white/40 uppercase font-bold">10-Year Direct Net Tax Savings</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BANK BENCHMARK COMPARATOR */}
      {activeSubTab === 'BANK_COMPARATOR' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bankOffers.map((bank) => {
              const monthlyRate = bank.benchmarkRoiPercent / (12 * 100);
              const months = loanTenureYears * 12;
              const emi = Math.round(
                (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
              );
              const totalPayment = emi * months;
              const totalInterest = totalPayment - loanPrincipal;

              return (
                <div
                  key={bank.bankId}
                  className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-5 hover:border-amber-500/40 hover:shadow-2xl transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white leading-tight">{bank.bankName}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                        {bank.logoBadge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-white/40 uppercase">Benchmark Home Loan ROI</span>
                      <div className="text-2xl font-bold text-white">{bank.benchmarkRoiPercent.toFixed(2)}%</div>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-3 space-y-1.5 text-xs">
                      <div className="flex justify-between text-white/70">
                        <span>Calculated Monthly EMI:</span>
                        <span className="font-bold text-amber-400">{formatINR(emi)}</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>Total 20-Yr Interest:</span>
                        <span>{formatINR(totalInterest)}</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>Processing Fee:</span>
                        <span>{formatINR(bank.processingFeeCapINR)}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-white/60 leading-relaxed italic">{bank.specialFeature}</p>
                  </div>

                  <button
                    onClick={() => alert(`Pre-approval request initiated with ${bank.bankName}. Dedicated mortgage advisor will connect in ${bank.preApprovalTimeHours} hours.`)}
                    className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-amber-500 hover:text-black text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Instant Digital Sanction ({bank.preApprovalTimeHours}h)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: 5-YEAR WEALTH & APPRECIATION FORECAST */}
      {activeSubTab === 'APPRECIATION' && appreciationReport && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-2">
              <span className="text-[11px] text-white/40 uppercase font-bold">5-Year Capital Value (2031)</span>
              <div className="text-3xl font-bold text-white">
                {formatINR(appreciationReport.forecastTimeline[4]?.estimatedCapitalValueINR || 0)}
              </div>
              <p className="text-xs text-emerald-400 font-semibold">
                +{formatINR(appreciationReport.fiveYearSummary.totalAppreciationINR)} capital appreciation (@ {appreciationReport.assumedCagrPercent}% CAGR)
              </p>
            </div>

            <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-2">
              <span className="text-[11px] text-white/40 uppercase font-bold">5-Year Cumulative Rental Income</span>
              <div className="text-3xl font-bold text-white">
                {formatINR(appreciationReport.fiveYearSummary.totalRentalIncomeINR)}
              </div>
              <p className="text-xs text-white/50">Assuming 5.5% annual lease inflation</p>
            </div>

            <div className="rounded-3xl bg-amber-500/10 border border-amber-500/30 p-6 space-y-2">
              <span className="text-[11px] text-amber-400 uppercase font-bold">Total Net Wealth Created</span>
              <div className="text-3xl font-bold text-amber-300">
                {formatINR(appreciationReport.fiveYearSummary.totalNetWealthCreatedINR)}
              </div>
              <p className="text-xs text-amber-200/60">Combined capital gain + cashflow return</p>
            </div>
          </div>

          {/* Infrastructure Catalyst Box */}
          <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-white">Micro-Market Infrastructure Catalyst — {selectedMicroMarket}:</span>
              <p className="text-white/70 leading-relaxed">{appreciationReport.infrastructureCatalystDescription}</p>
            </div>
          </div>

          {/* Year by Year Table */}
          <div className="rounded-3xl bg-[#0C1220]/90 border border-white/10 p-6 overflow-x-auto">
            <h4 className="text-sm font-bold text-white mb-4">5-Year Compound Growth & Cashflow Timeline</h4>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Horizon</th>
                  <th className="pb-3 font-semibold">Estimated Capital Value</th>
                  <th className="pb-3 font-semibold">Monthly Rental Outflow</th>
                  <th className="pb-3 font-semibold">Gross Rental Yield</th>
                  <th className="pb-3 font-semibold">Cumulative Return</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {appreciationReport.forecastTimeline.map((row) => (
                  <tr key={row.year} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 font-bold text-white">{row.yearLabel}</td>
                    <td className="py-3.5 font-semibold text-amber-300">{formatINR(row.estimatedCapitalValueINR)}</td>
                    <td className="py-3.5">{formatINR(row.monthlyRentalINR)}/mo</td>
                    <td className="py-3.5 text-emerald-400 font-medium">{row.grossRentalYieldPercent}%</td>
                    <td className="py-3.5 font-bold text-white">+{formatINR(row.cumulativeTotalReturnINR)} ({row.returnOnEquityPercent}%)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LEVERAGE & DOWNPAYMENT OPTIMIZER */}
      {activeSubTab === 'LEVERAGE' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leverageData.map((scenario) => (
              <div
                key={scenario.downpaymentPercent}
                className={`rounded-3xl bg-[#0D1525]/90 border p-6 space-y-4 transition-all ${
                  scenario.downpaymentPercent === downpaymentPercent
                    ? 'border-amber-500 shadow-xl shadow-amber-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">{scenario.downpaymentPercent}% Downpayment</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      scenario.safetyBufferRating === 'HIGH_CONSERVATIVE'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : scenario.safetyBufferRating === 'BALANCED_OPTIMAL'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {scenario.safetyBufferRating.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-white/40 uppercase">Initial Capital Outlay</span>
                  <div className="text-xl font-bold text-white">{formatINR(scenario.downpaymentAmountINR)}</div>
                </div>

                <div className="rounded-2xl bg-white/[0.03] p-3 space-y-2 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Loan Debt Principal:</span>
                    <span className="font-semibold text-white">{formatINR(scenario.loanAmountINR)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Gross Monthly EMI:</span>
                    <span className="font-semibold text-white">{formatINR(scenario.monthlyGrossEMI)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Post-Tax Effective EMI:</span>
                    <span className="font-bold">{formatINR(scenario.monthlyNetEffectiveEMI)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setDownpaymentPercent(scenario.downpaymentPercent)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    scenario.downpaymentPercent === downpaymentPercent
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/[0.05] text-white hover:bg-white/10'
                  }`}
                >
                  {scenario.downpaymentPercent === downpaymentPercent ? 'Currently Selected' : 'Apply Scenario'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
