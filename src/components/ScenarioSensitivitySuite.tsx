import React, { useState } from 'react';
import {
  Sliders,
  TrendingUp,
  Percent,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
  Info,
  Scale,
} from 'lucide-react';
import {
  calculateComprehensiveScenarioSensitivity,
  SensitivityScenarioParam,
  ComprehensiveSensitivityResult,
  formatINR,
} from '../services/calculatorEngine';

interface ScenarioSensitivitySuiteProps {
  initialPrice?: number;
  initialRent?: number;
}

export const ScenarioSensitivitySuite: React.FC<ScenarioSensitivitySuiteProps> = ({
  initialPrice = 20000000,
  initialRent = 75000,
}) => {
  const [params, setParams] = useState<SensitivityScenarioParam>({
    propertyPrice: initialPrice,
    downPaymentPercent: 25,
    interestRatePercent: 8.45,
    loanTenureYears: 20,
    monthlyRent: initialRent,
    rentEscalationPercent: 5.0,
    appreciationPercent: 6.5,
    holdingPeriodYears: 10,
    vacancyMonthsAnnual: 0.5,
    alternativeReturnPercent: 11.5,
  });

  const sensitivityData: ComprehensiveSensitivityResult = calculateComprehensiveScenarioSensitivity(params);
  const { conservative, base, optimistic } = sensitivityData.scenarios;

  return (
    <div id="scenario-sensitivity-suite" className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <Sliders className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Scenario Sensitivity & &quot;What-If&quot; Stress Tester
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                  Conservative · Base · Optimistic
                </span>
              </h2>
              <p className="text-sm text-slate-600">
                Stress-test capital appreciation, rental occupancy, interest rate shifts, and cash flows across 3 macro cycles.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Sliders Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Property Price */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Property Purchase Price</span>
              <span className="text-slate-900 font-bold">{formatINR(params.propertyPrice)}</span>
            </div>
            <input
              type="range"
              min="5000000"
              max="100000000"
              step="500000"
              value={params.propertyPrice}
              onChange={(e) => setParams({ ...params, propertyPrice: Number(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>₹50 L</span>
              <span>₹10 Cr</span>
            </div>
          </div>

          {/* Monthly Rent */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Starting Monthly Rent</span>
              <span className="text-slate-900 font-bold">{formatINR(params.monthlyRent)}/mo</span>
            </div>
            <input
              type="range"
              min="15000"
              max="400000"
              step="2500"
              value={params.monthlyRent}
              onChange={(e) => setParams({ ...params, monthlyRent: Number(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>₹15K</span>
              <span>₹4L</span>
            </div>
          </div>

          {/* Base Appreciation Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Base Annual Appreciation</span>
              <span className="text-slate-900 font-bold">{params.appreciationPercent}% p.a.</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="14.0"
              step="0.5"
              value={params.appreciationPercent}
              onChange={(e) => setParams({ ...params, appreciationPercent: Number(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>3%</span>
              <span>14%</span>
            </div>
          </div>

          {/* Holding Horizon */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Investment Holding Horizon</span>
              <span className="text-slate-900 font-bold">{params.holdingPeriodYears} Years</span>
            </div>
            <input
              type="range"
              min="3"
              max="25"
              step="1"
              value={params.holdingPeriodYears}
              onChange={(e) => setParams({ ...params, holdingPeriodYears: Number(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>3 Yrs</span>
              <span>25 Yrs</span>
            </div>
          </div>

          {/* Down Payment % */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Down Payment Ratio</span>
              <span className="text-slate-900 font-bold">{params.downPaymentPercent}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={params.downPaymentPercent}
              onChange={(e) => setParams({ ...params, downPaymentPercent: Number(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>10%</span>
              <span>80%</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Mortgage Interest Rate</span>
              <span className="text-slate-900 font-bold">{params.interestRatePercent}%</span>
            </div>
            <input
              type="range"
              min="7.0"
              max="12.0"
              step="0.1"
              value={params.interestRatePercent}
              onChange={(e) => setParams({ ...params, interestRatePercent: Number(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>7.0%</span>
              <span>12.0%</span>
            </div>
          </div>

          {/* Rent Escalation */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Annual Rent Escalation</span>
              <span className="text-slate-900 font-bold">{params.rentEscalationPercent}% p.a.</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              step="0.5"
              value={params.rentEscalationPercent}
              onChange={(e) => setParams({ ...params, rentEscalationPercent: Number(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>2%</span>
              <span>10%</span>
            </div>
          </div>

          {/* Annual Vacancy (Months) */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Annual Vacancy Reserve</span>
              <span className="text-slate-900 font-bold">{params.vacancyMonthsAnnual} Months</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.5"
              value={params.vacancyMonthsAnnual}
              onChange={(e) => setParams({ ...params, vacancyMonthsAnnual: Number(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0 (100% Occupied)</span>
              <span>3 Mo Vacancy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side 3-Scenario Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conservative */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                Conservative
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {conservative.appreciationRatePercent}% Apprec.
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              {conservative.description}
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Leveraged IRR</span>
                <span className="font-bold text-slate-900">{conservative.irrPercent}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Total Net Profit</span>
                <span className="font-bold text-slate-900">{formatINR(conservative.totalNetProfit)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Terminal Exit Value</span>
                <span className="font-bold text-slate-900">{formatINR(conservative.projectedExitValue)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Monthly Cash Flow</span>
                <span className={`font-bold ${conservative.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatINR(conservative.monthlyCashFlow)}/mo
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Rental Yield</span>
                <span className="font-bold text-slate-900">{conservative.rentalYieldPercent}%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Total Invested Equity: <span className="font-semibold text-slate-800">{formatINR(conservative.totalInvestmentEquity)}</span>
          </div>
        </div>

        {/* Base Case (Highlighted) */}
        <div className="rounded-2xl border-2 border-amber-500 bg-amber-50/20 p-6 shadow-md flex flex-col justify-between relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold text-white shadow-xs">
            Most Probable / Base Case
          </div>

          <div>
            <div className="flex items-center justify-between border-b border-amber-200 pb-3 mt-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                Base Case
              </span>
              <span className="text-xs font-semibold text-amber-900">
                {base.appreciationRatePercent}% Apprec.
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {base.description}
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-700 font-medium">Leveraged IRR</span>
                <span className="font-extrabold text-amber-700 text-base">{base.irrPercent}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-700 font-medium">Total Net Profit</span>
                <span className="font-bold text-slate-900">{formatINR(base.totalNetProfit)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-700 font-medium">Terminal Exit Value</span>
                <span className="font-bold text-slate-900">{formatINR(base.projectedExitValue)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-700 font-medium">Monthly Cash Flow</span>
                <span className={`font-bold ${base.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatINR(base.monthlyCashFlow)}/mo
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-700 font-medium">Rental Yield</span>
                <span className="font-bold text-slate-900">{base.rentalYieldPercent}%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-200 text-xs text-slate-600">
            Total Invested Equity: <span className="font-semibold text-slate-900">{formatINR(base.totalInvestmentEquity)}</span>
          </div>
        </div>

        {/* Optimistic */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                Optimistic
              </span>
              <span className="text-xs font-semibold text-emerald-800">
                {optimistic.appreciationRatePercent}% Apprec.
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              {optimistic.description}
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Leveraged IRR</span>
                <span className="font-bold text-emerald-600">{optimistic.irrPercent}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Total Net Profit</span>
                <span className="font-bold text-slate-900">{formatINR(optimistic.totalNetProfit)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Terminal Exit Value</span>
                <span className="font-bold text-slate-900">{formatINR(optimistic.projectedExitValue)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Monthly Cash Flow</span>
                <span className={`font-bold ${optimistic.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatINR(optimistic.monthlyCashFlow)}/mo
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Rental Yield</span>
                <span className="font-bold text-slate-900">{optimistic.rentalYieldPercent}%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Total Invested Equity: <span className="font-semibold text-slate-800">{formatINR(optimistic.totalInvestmentEquity)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
