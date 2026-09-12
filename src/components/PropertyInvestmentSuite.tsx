/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Percent,
  Calendar,
  Building2,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart3,
  Clock,
  Layers,
  Sparkles,
  HelpCircle,
  ChevronRight,
  RefreshCw,
  Award,
  Wallet,
  Landmark,
  Scale,
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';
import {
  calculateComprehensivePropertyInvestment,
  calculateGrossRentalYield,
  calculateNetRentalYield,
  calculateCapitalAppreciation,
  calculatePropertyCAGR,
  calculatePropertyIRR,
  calculateLeveragedIRR,
  calculateCashOnCashReturn,
  calculateInvestmentPayback,
  calculateMultiHorizonReturns,
  calculateFuturePropertyValue,
  calculatePropertyInvestmentProfit,
  calculateRentalIncomeEscalation,
  calculateVacancyImpact,
  calculateRentVsAppreciationSplit,
  formatINR,
  PropertyInvestmentMasterInput
} from '../services/calculatorEngine';

export type CalculatorSubView =
  | 'ALL_IN_ONE_MASTER'
  | 'ROI_CALCULATOR'
  | 'RENTAL_YIELD'
  | 'GROSS_RENTAL_YIELD'
  | 'NET_RENTAL_YIELD'
  | 'CAPITAL_APPRECIATION'
  | 'CAGR_CALCULATOR'
  | 'IRR_UNLEVERAGED'
  | 'LEVERAGED_IRR'
  | 'CASH_ON_CASH'
  | 'INVESTMENT_PAYBACK'
  | 'MULTI_HORIZON_RETURNS'
  | 'FUTURE_PROPERTY_VALUE'
  | 'PROFIT_CALCULATOR'
  | 'RENTAL_INCOME'
  | 'VACANCY_IMPACT'
  | 'RENT_VS_APPRECIATION';

interface PropertyInvestmentSuiteProps {
  initialPrice?: number;
  initialRent?: number;
  theme?: 'dark' | 'light';
  onConsultKiaan?: (prompt: string) => void;
}

export const PropertyInvestmentSuite: React.FC<PropertyInvestmentSuiteProps> = ({
  initialPrice = 20000000, // ₹2 Crore default (matching prompt example)
  initialRent = 80000,     // ₹80,000/mo default
  theme = 'dark',
  onConsultKiaan,
}) => {
  // Primary inputs matching the exact example: Buy ₹2 Cr -> ₹80k/mo -> 5% rent increase -> 6% appreciation
  const [propertyPrice, setPropertyPrice] = useState<number>(initialPrice);
  const [monthlyRent, setMonthlyRent] = useState<number>(initialRent);
  const [annualRentIncreasePercent, setAnnualRentIncreasePercent] = useState<number>(5.0);
  const [annualAppreciationPercent, setAnnualAppreciationPercent] = useState<number>(6.0);
  const [holdingPeriodYears, setHoldingPeriodYears] = useState<number>(10);
  const [loanToValuePercent, setLoanToValuePercent] = useState<number>(75.0);
  const [loanInterestRatePercent, setLoanInterestRatePercent] = useState<number>(8.45);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [stampDutyAndAcquisitionPercent, setStampDutyAndAcquisitionPercent] = useState<number>(7.0);
  const [annualMaintenanceAndTaxPercent, setAnnualMaintenanceAndTaxPercent] = useState<number>(0.6);
  const [vacancyMonthsAnnual, setVacancyMonthsAnnual] = useState<number>(0.5);

  // Active view
  const [activeCalculator, setActiveCalculator] = useState<CalculatorSubView>('ALL_IN_ONE_MASTER');
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);

  // Load the prompt's canonical example
  const loadCanonicalExample = () => {
    setPropertyPrice(20000000); // ₹2 Cr
    setMonthlyRent(80000);      // ₹80,000/mo
    setAnnualRentIncreasePercent(5.0); // 5% rent increase
    setAnnualAppreciationPercent(6.0); // 6% appreciation
    setHoldingPeriodYears(10);
    setLoanToValuePercent(75.0);
    setLoanInterestRatePercent(8.45);
    setLoanTenureYears(20);
    setStampDutyAndAcquisitionPercent(7.0);
    setAnnualMaintenanceAndTaxPercent(0.6);
    setVacancyMonthsAnnual(0.5);
  };

  // Compute master calculation
  const masterInput: PropertyInvestmentMasterInput = useMemo(() => ({
    propertyPrice,
    monthlyRent,
    annualRentIncreasePercent,
    annualAppreciationPercent,
    holdingPeriodYears,
    loanToValuePercent,
    loanInterestRatePercent,
    loanTenureYears,
    stampDutyAndAcquisitionPercent,
    annualMaintenanceAndTaxPercent,
    vacancyMonthsAnnual,
  }), [
    propertyPrice,
    monthlyRent,
    annualRentIncreasePercent,
    annualAppreciationPercent,
    holdingPeriodYears,
    loanToValuePercent,
    loanInterestRatePercent,
    loanTenureYears,
    stampDutyAndAcquisitionPercent,
    annualMaintenanceAndTaxPercent,
    vacancyMonthsAnnual,
  ]);

  const masterResult = useMemo(() => {
    return calculateComprehensivePropertyInvestment(masterInput);
  }, [masterInput]);

  // Specific calculation sub-results
  const grossYieldResult = useMemo(() => calculateGrossRentalYield(propertyPrice, monthlyRent), [propertyPrice, monthlyRent]);
  const netYieldResult = useMemo(() => calculateNetRentalYield({
    propertyPrice,
    monthlyRent,
    vacancyMonthsPerYear: vacancyMonthsAnnual,
  }), [propertyPrice, monthlyRent, vacancyMonthsAnnual]);
  
  const appreciationResult = useMemo(() => calculateCapitalAppreciation(propertyPrice, annualAppreciationPercent, holdingPeriodYears), [propertyPrice, annualAppreciationPercent, holdingPeriodYears]);
  const cagrResult = useMemo(() => calculatePropertyCAGR(propertyPrice, appreciationResult.finalValue, holdingPeriodYears), [propertyPrice, appreciationResult.finalValue, holdingPeriodYears]);
  const unleveragedIrrResult = useMemo(() => calculatePropertyIRR({
    purchasePrice: propertyPrice,
    monthlyRent,
    annualRentIncreasePercent,
    annualAppreciationPercent,
    holdingYears: holdingPeriodYears,
  }), [propertyPrice, monthlyRent, annualRentIncreasePercent, annualAppreciationPercent, holdingPeriodYears]);
  
  const leveragedIrrResult = useMemo(() => calculateLeveragedIRR({
    purchasePrice: propertyPrice,
    monthlyRent,
    annualRentIncreasePercent,
    annualAppreciationPercent,
    holdingYears: holdingPeriodYears,
    loanToValuePercent,
    loanInterestRatePercent,
    loanTenureYears,
  }), [propertyPrice, monthlyRent, annualRentIncreasePercent, annualAppreciationPercent, holdingPeriodYears, loanToValuePercent, loanInterestRatePercent, loanTenureYears]);

  const multiHorizonReturns = useMemo(() => calculateMultiHorizonReturns({
    purchasePrice: propertyPrice,
    monthlyRent,
    annualRentIncreasePercent,
    annualAppreciationPercent,
    loanToValuePercent,
    loanInterestRatePercent,
    loanTenureYears,
    horizons: [10, 15, 20],
  }), [propertyPrice, monthlyRent, annualRentIncreasePercent, annualAppreciationPercent, loanToValuePercent, loanInterestRatePercent, loanTenureYears]);

  const futureValueResult = useMemo(() => calculateFuturePropertyValue(propertyPrice, annualAppreciationPercent, 4.5, holdingPeriodYears), [propertyPrice, annualAppreciationPercent, holdingPeriodYears]);
  const profitResult = useMemo(() => calculatePropertyInvestmentProfit({
    purchasePrice: propertyPrice,
    monthlyRent,
    annualRentIncreasePercent,
    annualAppreciationPercent,
    holdingYears: holdingPeriodYears,
    loanToValuePercent,
    loanInterestRatePercent,
    loanTenureYears,
  }), [propertyPrice, monthlyRent, annualRentIncreasePercent, annualAppreciationPercent, holdingPeriodYears, loanToValuePercent, loanInterestRatePercent, loanTenureYears]);

  const rentalSchedule = useMemo(() => calculateRentalIncomeEscalation(monthlyRent, annualRentIncreasePercent, Math.max(20, holdingPeriodYears), propertyPrice), [monthlyRent, annualRentIncreasePercent, holdingPeriodYears, propertyPrice]);
  const vacancyImpactResult = useMemo(() => calculateVacancyImpact({ monthlyRent, propertyPrice }), [monthlyRent, propertyPrice]);
  const rentVsApprecResult = useMemo(() => calculateRentVsAppreciationSplit({
    purchasePrice: propertyPrice,
    monthlyRent,
    annualRentIncreasePercent,
    annualAppreciationPercent,
    years: holdingPeriodYears,
  }), [propertyPrice, monthlyRent, annualRentIncreasePercent, annualAppreciationPercent, holdingPeriodYears]);

  const isCanonicalActive =
    propertyPrice === 20000000 &&
    monthlyRent === 80000 &&
    annualRentIncreasePercent === 5 &&
    annualAppreciationPercent === 6;

  return (
    <div id="property-investment-suite" className="w-full space-y-8 text-white">
      {/* 1. HERO & CANONICAL PRESET BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#0F1B38] to-[#0A1024] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase font-bold tracking-widest text-amber-400">
                  Institutional Grade Financial Suite
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  Property Investment Analytics & Return Modeling
                </h1>
              </div>
            </div>

            {/* Canonical Example Quick Trigger Button */}
            <button
              id="load-canonical-example-btn"
              onClick={loadCanonicalExample}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all duration-300 cursor-pointer shadow-lg ${
                isCanonicalActive
                  ? 'bg-amber-400 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-400/50'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-amber-400/50'
              }`}
            >
              <Zap className={`w-4 h-4 ${isCanonicalActive ? 'text-slate-950 fill-slate-950' : 'text-amber-400'}`} />
              <span>Load Example: ₹2 Cr • ₹80k/mo • +5% Rent • +6% Appreciation</span>
            </button>
          </div>

          {/* KIAAN'S 5-POINT EXECUTIVE SYNTHESIS SUMMARY */}
          <div className="rounded-2xl bg-[#080D1A]/90 border border-amber-500/20 p-5 sm:p-6 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Kiaan AI Executive Property Valuation Synthesis</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                10-Year Horizon Analysis
              </span>
            </div>

            {/* 5 Core Deliverables requested: Yield + Annual Cash Flow + Appreciation + IRR + Projected Exit Value */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* 1. Yield */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[11px] text-white/50 uppercase font-semibold block">1. Rental Yield</span>
                <div className="text-lg sm:text-xl font-mono font-bold text-emerald-400">
                  {masterResult.grossRentalYieldPercent}% <span className="text-xs font-normal text-white/50">Gross</span>
                </div>
                <div className="text-xs font-mono text-cyan-300">
                  {masterResult.netRentalYieldPercent}% Net Yield
                </div>
              </div>

              {/* 2. Annual Cash Flow */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[11px] text-white/50 uppercase font-semibold block">2. Annual Cash Flow</span>
                <div className="text-lg sm:text-xl font-mono font-bold text-white">
                  {formatINR(masterResult.annualGrossRentYear1)} <span className="text-xs font-normal text-white/50">(Yr 1)</span>
                </div>
                <div className="text-xs font-mono text-amber-300">
                  {formatINR(masterResult.rentalSchedule[9]?.annualRent || 0)} (Yr 10)
                </div>
              </div>

              {/* 3. Appreciation */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[11px] text-white/50 uppercase font-semibold block">3. Capital Appreciation</span>
                <div className="text-lg sm:text-xl font-mono font-bold text-amber-400">
                  +{formatINR(masterResult.totalCapitalAppreciation)}
                </div>
                <div className="text-xs font-mono text-white/60">
                  {masterResult.inputs.annualAppreciationPercent}% Compounding p.a.
                </div>
              </div>

              {/* 4. IRR */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[11px] text-white/50 uppercase font-semibold block">4. Internal Rate (IRR)</span>
                <div className="text-lg sm:text-xl font-mono font-bold text-emerald-400">
                  {masterResult.unleveragedIRRPercent}% <span className="text-xs font-normal text-white/50">Unlev.</span>
                </div>
                <div className="text-xs font-mono text-purple-300">
                  {masterResult.leveragedIRRPercent}% Leveraged IRR
                </div>
              </div>

              {/* 5. Projected Exit Value */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-amber-300 uppercase font-bold block">5. Projected Exit Value</span>
                <div className="text-lg sm:text-xl font-mono font-bold text-amber-300">
                  {formatINR(masterResult.projectedExitValue)}
                </div>
                <div className="text-xs font-mono text-white/70">
                  {((masterResult.projectedExitValue / propertyPrice)).toFixed(2)}x Value Multiple
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-CALCULATOR SELECTOR TABS (17 DISTINCT CALCULATORS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Interactive Calculators Directory ({17} Specialized Models)
          </span>
          <button
            onClick={() => setShowScheduleModal(!showScheduleModal)}
            className="text-xs text-amber-400 hover:text-amber-300 underline font-mono flex items-center gap-1 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{showScheduleModal ? 'Hide 20-Yr Table' : 'View 20-Yr Master Amortization Table'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[
            { id: 'ALL_IN_ONE_MASTER', label: '★ Master Suite', desc: 'All 17 Metrics in 1 View' },
            { id: 'ROI_CALCULATOR', label: 'Property ROI', desc: 'Net Gain & Equity Multiple' },
            { id: 'RENTAL_YIELD', label: 'Rental Yield', desc: 'Yield Comparison & Net Cap' },
            { id: 'GROSS_RENTAL_YIELD', label: 'Gross Yield', desc: 'Annual Gross / Purchase' },
            { id: 'NET_RENTAL_YIELD', label: 'Net Rental Yield', desc: 'After Tax & Maintenance' },
            { id: 'CAPITAL_APPRECIATION', label: 'Capital Appreciation', desc: 'Compounding Asset Gain' },
            { id: 'CAGR_CALCULATOR', label: 'Property CAGR', desc: 'Compound Annual Growth' },
            { id: 'IRR_UNLEVERAGED', label: 'Property IRR', desc: 'Unleveraged Cash Flow DCF' },
            { id: 'LEVERAGED_IRR', label: 'Leveraged IRR', desc: 'Debt & Equity Multiplier' },
            { id: 'CASH_ON_CASH', label: 'Cash-on-Cash', desc: 'Pre-tax CF / Invested Cash' },
            { id: 'INVESTMENT_PAYBACK', label: 'Payback Horizon', desc: 'Breakeven Timeline' },
            { id: 'MULTI_HORIZON_RETURNS', label: '10/15/20-Yr Return', desc: 'Multi-Decade Milestones' },
            { id: 'FUTURE_PROPERTY_VALUE', label: 'Future Value', desc: 'Inflation Adjusted Value' },
            { id: 'PROFIT_CALCULATOR', label: 'Total Net Profit', desc: 'Full Financial P&L' },
            { id: 'RENTAL_INCOME', label: 'Rental Escalation', desc: '+5% Annual Rent Curve' },
            { id: 'VACANCY_IMPACT', label: 'Vacancy Impact', desc: '0 to 3 Month Stress Test' },
            { id: 'RENT_VS_APPRECIATION', label: 'Rent vs Appreciation', desc: 'Wealth Split Ratio' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCalculator(tab.id as CalculatorSubView)}
              className={`p-2.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                activeCalculator === tab.id
                  ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-[#0D1525]/70 border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xs font-bold block truncate">{tab.label}</span>
              <span className="text-[10px] opacity-60 block truncate">{tab.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. INPUT CONFIGURATION CONTROLS */}
      <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>Investment Parameters & Scenario Controls</span>
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              Modify purchase price, monthly rent, escalation, and leverage to recalculate all 17 models live.
            </p>
          </div>
          <button
            onClick={loadCanonicalExample}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to ₹2 Cr Benchmark</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Input 1: Property Purchase Price */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-white/80">Property Price</label>
              <span className="font-mono text-amber-400 font-bold">{formatINR(propertyPrice)}</span>
            </div>
            <input
              type="range"
              min="2500000"
              max="150000000"
              step="500000"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex gap-2">
              {[10000000, 20000000, 35000000, 50000000].map((val) => (
                <button
                  key={val}
                  onClick={() => setPropertyPrice(val)}
                  className={`px-2 py-1 rounded text-[10px] font-mono border ${
                    propertyPrice === val ? 'bg-amber-400 text-slate-950 font-bold border-amber-400' : 'bg-white/5 text-white/60 border-white/10'
                  }`}
                >
                  ₹{(val / 10000000).toFixed(val % 10000000 === 0 ? 0 : 1)} Cr
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Monthly Rent */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-white/80">Monthly Rental Income</label>
              <span className="font-mono text-emerald-400 font-bold">{formatINR(monthlyRent)} / mo</span>
            </div>
            <input
              type="range"
              min="15000"
              max="500000"
              step="5000"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex gap-2">
              {[45000, 80000, 120000, 180000].map((val) => (
                <button
                  key={val}
                  onClick={() => setMonthlyRent(val)}
                  className={`px-2 py-1 rounded text-[10px] font-mono border ${
                    monthlyRent === val ? 'bg-emerald-400 text-slate-950 font-bold border-emerald-400' : 'bg-white/5 text-white/60 border-white/10'
                  }`}
                >
                  ₹{(val / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Input 3: Annual Rent Increase */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-white/80">Annual Rent Escalation</label>
              <span className="font-mono text-cyan-400 font-bold">{annualRentIncreasePercent}% p.a.</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={annualRentIncreasePercent}
              onChange={(e) => setAnnualRentIncreasePercent(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex gap-2">
              {[3, 5, 7, 10].map((val) => (
                <button
                  key={val}
                  onClick={() => setAnnualRentIncreasePercent(val)}
                  className={`px-2 py-1 rounded text-[10px] font-mono border ${
                    annualRentIncreasePercent === val ? 'bg-cyan-400 text-slate-950 font-bold border-cyan-400' : 'bg-white/5 text-white/60 border-white/10'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* Input 4: Annual Capital Appreciation */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-white/80">Annual Appreciation Rate</label>
              <span className="font-mono text-amber-400 font-bold">{annualAppreciationPercent}% p.a.</span>
            </div>
            <input
              type="range"
              min="2"
              max="18"
              step="0.5"
              value={annualAppreciationPercent}
              onChange={(e) => setAnnualAppreciationPercent(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex gap-2">
              {[4, 6, 8, 12].map((val) => (
                <button
                  key={val}
                  onClick={() => setAnnualAppreciationPercent(val)}
                  className={`px-2 py-1 rounded text-[10px] font-mono border ${
                    annualAppreciationPercent === val ? 'bg-amber-400 text-slate-950 font-bold border-amber-400' : 'bg-white/5 text-white/60 border-white/10'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Advance Slider Bar: Holding Period & Leverage */}
        <div className="pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-white/70">Holding Horizon:</span>
              <span className="font-mono text-amber-400 font-bold">{holdingPeriodYears} Years</span>
            </div>
            <input
              type="range"
              min="3"
              max="25"
              step="1"
              value={holdingPeriodYears}
              onChange={(e) => setHoldingPeriodYears(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-white/70">Home Loan LTV (Leverage):</span>
              <span className="font-mono text-purple-400 font-bold">{loanToValuePercent}% ({formatINR(propertyPrice * (loanToValuePercent / 100))})</span>
            </div>
            <input
              type="range"
              min="0"
              max="85"
              step="5"
              value={loanToValuePercent}
              onChange={(e) => setLoanToValuePercent(Number(e.target.value))}
              className="w-full accent-purple-400"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-white/70">Loan Interest Rate:</span>
              <span className="font-mono text-emerald-400 font-bold">{loanInterestRatePercent}% p.a.</span>
            </div>
            <input
              type="range"
              min="7.5"
              max="12.0"
              step="0.05"
              value={loanInterestRatePercent}
              onChange={(e) => setLoanInterestRatePercent(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* 4. ACTIVE CALCULATOR DETAIL PANEL */}
      <div className="space-y-6 animate-fade-in">
        {/* VIEW 1: ALL-IN-ONE MASTER SUITE */}
        {activeCalculator === 'ALL_IN_ONE_MASTER' && (
          <div className="space-y-6">
            {/* Multi-Horizon 10, 15, 20-Year Side-by-Side Milestone Table */}
            <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase font-bold text-amber-400">10 / 15 / 20-Year Milestone Return Matrix</span>
                  <h3 className="text-xl font-bold text-white mt-1">Multi-Decade Compounding & Exit Projections</h3>
                </div>
                <div className="text-xs text-white/50">
                  Compounding @ {annualAppreciationPercent}% appreciation + {annualRentIncreasePercent}% rent escalation
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {multiHorizonReturns.map((h, idx) => (
                  <div
                    key={h.horizonYears}
                    className={`p-5 rounded-2xl border space-y-4 ${
                      idx === 0
                        ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30'
                        : idx === 1
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-emerald-500/10 border-emerald-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-sm font-bold uppercase tracking-wider text-white font-mono">{h.horizonLabel}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300">
                        {h.equityMultiple}x Equity
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/60">Projected Exit Value:</span>
                        <span className="font-bold text-white font-mono">{formatINR(h.exitPropertyValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Capital Appreciation:</span>
                        <span className="font-bold text-amber-400 font-mono">+{formatINR(h.capitalGain)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Cumulative Net Rent:</span>
                        <span className="font-bold text-emerald-400 font-mono">+{formatINR(h.cumulativeNetCashFlow)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Monthly Rent at Exit:</span>
                        <span className="font-bold text-cyan-300 font-mono">{formatINR(h.monthlyRentAtExitYear)}/mo</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-white/10">
                        <span className="text-white/80 font-bold">Unleveraged IRR:</span>
                        <span className="font-bold text-emerald-400 font-mono text-sm">{h.unleveragedIRR}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300 font-bold">Leveraged IRR (75% LTV):</span>
                        <span className="font-bold text-purple-300 font-mono text-sm">{h.leveragedIRR}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Breakdown: Cashflow vs Appreciation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rent vs Capital Appreciation Split */}
              <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-4">
                <span className="text-xs font-mono uppercase font-bold text-amber-400">Wealth Generation Breakdown ({holdingPeriodYears}-Yr)</span>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs text-white/50 block">Total Net Wealth Created</span>
                    <span className="text-2xl font-mono font-bold text-white">{formatINR(rentVsApprecResult.totalWealthCreated)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-white/50 block">Rent / Appreciation Ratio</span>
                    <span className="text-sm font-mono font-bold text-amber-300">1 : {(1 / (rentVsApprecResult.rentToAppreciationRatio || 1)).toFixed(2)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden flex">
                    <div
                      style={{ width: `${rentVsApprecResult.appreciationSharePercent}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
                      title={`Appreciation: ${rentVsApprecResult.appreciationSharePercent}%`}
                    ></div>
                    <div
                      style={{ width: `${rentVsApprecResult.rentalYieldSharePercent}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                      title={`Rental Yield: ${rentVsApprecResult.rentalYieldSharePercent}%`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-amber-400">■ Capital Appreciation: {rentVsApprecResult.appreciationSharePercent}% ({formatINR(rentVsApprecResult.capitalAppreciationAmount)})</span>
                    <span className="text-emerald-400">■ Net Rental Cashflow: {rentVsApprecResult.rentalYieldSharePercent}% ({formatINR(rentVsApprecResult.cumulativeNetRentAmount)})</span>
                  </div>
                </div>
              </div>

              {/* Vacancy Sensitivity Matrix */}
              <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-4">
                <span className="text-xs font-mono uppercase font-bold text-cyan-400">Vacancy Friction Stress Test</span>
                <div className="space-y-2">
                  {vacancyImpactResult.slice(0, 3).map((v) => (
                    <div key={v.vacantMonths} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                      <div>
                        <span className="font-bold text-white">{v.vacantMonths === 0 ? 'Zero Vacancy (12 Mo)' : `${v.vacantMonths} Mo Vacancy / Yr`}</span>
                        <span className="text-[10px] text-white/50 block">Realized Rent: {formatINR(v.realizedAnnualRent)}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-400">{v.effectiveNetYieldPercent}% Net Yield</span>
                        <span className="text-[10px] text-amber-300 block font-mono">{formatINR(v.annualNetCashFlow)} Net CF</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PROPERTY ROI CALCULATOR */}
        {activeCalculator === 'ROI_CALCULATOR' && (
          <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono uppercase font-bold text-amber-400">1. Property ROI & Equity Multiplier</span>
              <h3 className="text-2xl font-bold text-white mt-1">Total Return on Investment ({holdingPeriodYears}-Year Horizon)</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-xs text-white/50">Initial Equity Outlay</span>
                <div className="text-xl font-bold font-mono text-white">{formatINR(leveragedIrrResult.initialEquityInvested)}</div>
                <span className="text-[10px] text-white/40">25% Down Payment + Stamp Duty</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <span className="text-xs text-amber-300">Total Net Wealth Created</span>
                <div className="text-xl font-bold font-mono text-amber-300">+{formatINR(profitResult.totalNetProfit)}</div>
                <span className="text-[10px] text-white/60">Gains + Net Rent - Interest & Closing</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <span className="text-xs text-emerald-300">Equity Multiplier</span>
                <div className="text-xl font-bold font-mono text-emerald-400">{leveragedIrrResult.equityMultiple}x</div>
                <span className="text-[10px] text-white/60">{profitResult.netRoiOnInvestedEquity}% ROI on Cash Invested</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: RENTAL YIELD & NET RENTAL YIELD */}
        {(activeCalculator === 'RENTAL_YIELD' || activeCalculator === 'GROSS_RENTAL_YIELD' || activeCalculator === 'NET_RENTAL_YIELD') && (
          <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono uppercase font-bold text-emerald-400">Rental Yield Architecture</span>
              <h3 className="text-2xl font-bold text-white mt-1">Gross vs. Net Operating Rental Yield</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <span className="text-xs uppercase font-bold text-emerald-400">Gross Rental Yield</span>
                <div className="text-3xl font-mono font-bold text-emerald-400">{grossYieldResult.grossYieldPercent}% p.a.</div>
                <p className="text-xs text-white/60">
                  Calculated as ({formatINR(grossYieldResult.annualGrossRent)} Annual Gross Rent / {formatINR(propertyPrice)} Property Price) * 100.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
                <span className="text-xs uppercase font-bold text-cyan-300">Net Rental Yield (Post-Operating Costs)</span>
                <div className="text-3xl font-mono font-bold text-cyan-300">{netYieldResult.netYieldOnTotalCostPercent}% p.a.</div>
                <p className="text-xs text-white/60">
                  Net Operating Income: {formatINR(netYieldResult.netAnnualOperatingIncome)} / yr (deducting property tax, society maintenance, and 2-week vacancy buffer).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: CAPITAL APPRECIATION & CAGR */}
        {(activeCalculator === 'CAPITAL_APPRECIATION' || activeCalculator === 'CAGR_CALCULATOR' || activeCalculator === 'FUTURE_PROPERTY_VALUE') && (
          <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono uppercase font-bold text-amber-400">Capital Appreciation & CAGR Engine</span>
              <h3 className="text-2xl font-bold text-white mt-1">
                {holdingPeriodYears}-Year Compounding @ {annualAppreciationPercent}% Appreciation
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-xs text-white/50">Purchase Price Today</span>
                <div className="text-xl font-bold font-mono text-white">{formatINR(propertyPrice)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <span className="text-xs text-amber-300">Future Asset Valuation</span>
                <div className="text-xl font-bold font-mono text-amber-300">{formatINR(appreciationResult.finalValue)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <span className="text-xs text-emerald-300">CAGR & Net Gain</span>
                <div className="text-xl font-bold font-mono text-emerald-400">{cagrResult.cagrPercent}% CAGR</div>
                <span className="text-[10px] text-white/60">+{formatINR(appreciationResult.totalGain)}</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: UNLEVERAGED & LEVERAGED IRR */}
        {(activeCalculator === 'IRR_UNLEVERAGED' || activeCalculator === 'LEVERAGED_IRR') && (
          <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono uppercase font-bold text-purple-400">Internal Rate of Return (IRR) Modeling</span>
              <h3 className="text-2xl font-bold text-white mt-1">Unleveraged vs. Positive Financial Leverage IRR</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <span className="text-xs uppercase font-bold text-emerald-400">Unleveraged Property IRR (100% Cash)</span>
                <div className="text-3xl font-mono font-bold text-emerald-400">{unleveragedIrrResult.irrPercent}%</div>
                <p className="text-xs text-white/60">
                  Comprehensive Discounted Cash Flow including 5% rent escalation and 6% capital appreciation terminal sale.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
                <span className="text-xs uppercase font-bold text-purple-300">Leveraged IRR (75% Home Loan @ {loanInterestRatePercent}%)</span>
                <div className="text-3xl font-mono font-bold text-purple-300">{leveragedIrrResult.leveragedIrrPercent}%</div>
                <p className="text-xs text-white/60">
                  Calculated on ₹50L down payment + ₹14L stamp duty. Monthly EMI of {formatINR(leveragedIrrResult.monthlyEMI)} amortizes principal balance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: CASH-ON-CASH & PAYBACK */}
        {(activeCalculator === 'CASH_ON_CASH' || activeCalculator === 'INVESTMENT_PAYBACK') && (
          <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono uppercase font-bold text-cyan-400">Cash Flow Velocity & Payback Period</span>
              <h3 className="text-2xl font-bold text-white mt-1">Capital Recovery & Breakeven Horizon</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-xs uppercase font-bold text-white/70">Cash-on-Cash Return (Year 1)</span>
                <div className="text-3xl font-mono font-bold text-cyan-400">{masterResult.cashOnCashReturnPercent}%</div>
                <p className="text-xs text-white/60">
                  Pre-tax net cash flow divided by total initial cash invested ({formatINR(leveragedIrrResult.initialEquityInvested)}).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <span className="text-xs uppercase font-bold text-amber-300">Breakeven Payback Horizon</span>
                <div className="text-3xl font-mono font-bold text-amber-300">
                  {masterResult.paybackAnalysis.undiscountedPaybackYears} Years
                </div>
                <p className="text-xs text-white/60">
                  Discounted Payback (@ 8% cost of capital): {masterResult.paybackAnalysis.discountedPaybackYears} Years.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: RENTAL INCOME ESCALATION SCHEDULE */}
        {(activeCalculator === 'RENTAL_INCOME' || showScheduleModal) && (
          <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase font-bold text-emerald-400">Rental Income Timeline</span>
                <h3 className="text-xl font-bold text-white mt-1">Year-by-Year Escalation Schedule (+{annualRentIncreasePercent}% / Year)</h3>
              </div>
              <span className="text-xs font-mono text-amber-400">20-Year Timeline</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 font-mono">
                    <th className="pb-2">Year</th>
                    <th className="pb-2">Monthly Rent</th>
                    <th className="pb-2">Annual Gross Rent</th>
                    <th className="pb-2">Cumulative Rent</th>
                    <th className="pb-2">Yield on Initial Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {rentalSchedule.slice(0, 10).map((r) => (
                    <tr key={r.year} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 text-white/80 font-bold">Yr {r.year} ({r.calendarYear})</td>
                      <td className="py-2.5 text-emerald-400 font-bold">{formatINR(r.monthlyRent)}</td>
                      <td className="py-2.5 text-white">{formatINR(r.annualRent)}</td>
                      <td className="py-2.5 text-amber-300">{formatINR(r.cumulativeRent)}</td>
                      <td className="py-2.5 text-cyan-300">{r.effectiveYieldOnInitialPricePercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. CONSULT KIAAN ACTION FOOTER */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0E1726] to-purple-500/10 border border-amber-500/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            K
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Ask Kiaan AI to Analyze Any Custom Unit or Deal</h4>
            <p className="text-xs text-white/60">
              Query tax shields, micro-market yield comps, or mortgage arbitrage instantly.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const prompt = `Can you provide a detailed investment breakdown for a ₹${(propertyPrice / 10000000).toFixed(2)} Cr property generating ₹${monthlyRent.toLocaleString('en-IN')}/month with ${annualRentIncreasePercent}% rent increase and ${annualAppreciationPercent}% appreciation?`;
            if (onConsultKiaan) {
              onConsultKiaan(prompt);
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold font-mono flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span>Query Kiaan AI with this Scenario</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
