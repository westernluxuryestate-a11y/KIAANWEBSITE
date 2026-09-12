import React, { useState } from 'react';
import {
  Building2,
  HardHat,
  Ruler,
  TrendingUp,
  Percent,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Layers,
  DollarSign,
} from 'lucide-react';
import {
  calculateDevelopmentFeasibility,
  DevelopmentFeasibilityInput,
  DevelopmentFeasibilityResult,
  formatINR,
} from '../services/calculatorEngine';

export const DevelopmentFeasibilitySuite: React.FC = () => {
  const [params, setParams] = useState<DevelopmentFeasibilityInput>({
    plotAreaSqFt: 43560, // 1 Acre
    baseFSI: 1.5,
    premiumFSIPercent: 35,
    tdrPercent: 20,
    loadingFactorPercent: 35,
    constructionCostPerSqFt: 3400,
    approvalAndArchitectCostPerSqFt: 650,
    expectedSalePricePerSqFt: 8500,
    projectDurationMonths: 36,
  });

  const result: DevelopmentFeasibilityResult = calculateDevelopmentFeasibility(params);

  return (
    <div id="development-feasibility-suite" className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <HardHat className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                FSI, Construction & Development Feasibility Engine
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                  Real Estate Project Modeling
                </span>
              </h2>
              <p className="text-sm text-slate-600">
                Model permissible Built-Up Area (BUA), loading factors, construction costs, revenue realization, and project IRR.
              </p>
            </div>
          </div>
        </div>

        {/* Input Parameters */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Plot Area */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Plot Land Area (Sq.Ft.)</span>
              <span className="text-slate-900 font-bold">{params.plotAreaSqFt.toLocaleString()} sq.ft.</span>
            </div>
            <input
              type="range"
              min="5000"
              max="200000"
              step="2500"
              value={params.plotAreaSqFt}
              onChange={(e) => setParams({ ...params, plotAreaSqFt: Number(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>5,000 sq.ft.</span>
              <span>2,00,000 sq.ft.</span>
            </div>
          </div>

          {/* Base FSI */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Base Permissible FSI</span>
              <span className="text-slate-900 font-bold">{params.baseFSI}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.1"
              value={params.baseFSI}
              onChange={(e) => setParams({ ...params, baseFSI: Number(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1.0</span>
              <span>3.0</span>
            </div>
          </div>

          {/* Premium FSI & TDR % */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Premium FSI + TDR</span>
              <span className="text-slate-900 font-bold">{(params.premiumFSIPercent || 0) + (params.tdrPercent || 0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={(params.premiumFSIPercent || 0) + (params.tdrPercent || 0)}
              onChange={(e) => {
                const total = Number(e.target.value);
                setParams({ ...params, premiumFSIPercent: Math.round(total * 0.6), tdrPercent: Math.round(total * 0.4) });
              }}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Expected Realization Per Sq.Ft. */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Sale Realization (₹/sq.ft.)</span>
              <span className="text-slate-900 font-bold">₹{params.expectedSalePricePerSqFt.toLocaleString()}/sq.ft.</span>
            </div>
            <input
              type="range"
              min="4000"
              max="25000"
              step="250"
              value={params.expectedSalePricePerSqFt}
              onChange={(e) => setParams({ ...params, expectedSalePricePerSqFt: Number(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>₹4,000</span>
              <span>₹25,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Effective FSI & Permissible BUA</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{result.permissibleBUASqFt.toLocaleString()} sq.ft.</div>
          <div className="text-xs text-slate-500 mt-1">Effective FSI: {result.effectiveFSI}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Total Saleable Area (35% Loading)</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{result.saleableAreaSqFt.toLocaleString()} sq.ft.</div>
          <div className="text-xs text-slate-500 mt-1">Break-even: ₹{result.breakEvenRealizationPerSqFt.toLocaleString()}/sq.ft.</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Gross Sales Revenue</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{formatINR(result.grossRevenueRealization)}</div>
          <div className="text-xs text-slate-500 mt-1">Total Cost: {formatINR(result.totalProjectDevelopmentCost)}</div>
        </div>

        <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/20 p-5 shadow-sm">
          <div className="text-xs font-bold text-emerald-800">Project Gross Profit & IRR</div>
          <div className="mt-1 text-2xl font-black text-emerald-700">{formatINR(result.grossProfitINR)}</div>
          <div className="text-xs font-bold text-emerald-900 mt-1">{result.profitMarginPercent}% Margin · {result.projectIRREstimatePercent}% Annual IRR</div>
        </div>
      </div>
    </div>
  );
};
