import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  Scale,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FileText,
  BadgeAlert,
} from 'lucide-react';
import {
  calculateResaleProceedsAndTax,
  calculateHoldVsSell,
  ResaleProceedsInput,
  ResaleProceedsResult,
  formatINR,
} from '../services/calculatorEngine';

export const ResaleTaxationSuite: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState(12000000); // ₹1.2 Cr bought in 2021
  const [purchaseYear, setPurchaseYear] = useState(2021);
  const [salePrice, setSalePrice] = useState(19500000); // ₹1.95 Cr in 2026
  const [taxRegime, setTaxRegime] = useState<'NEW_12_5_NO_INDEX' | 'OLD_20_WITH_INDEX'>('NEW_12_5_NO_INDEX');
  const [currentMonthlyRent, setCurrentMonthlyRent] = useState(60000);

  const resaleResult: ResaleProceedsResult = calculateResaleProceedsAndTax({
    originalPurchasePrice: purchasePrice,
    purchaseYear,
    currentSaleAgreementPrice: salePrice,
    taxRegime,
  });

  const holdVsSell = calculateHoldVsSell({
    currentMarketValue: salePrice,
    originalPurchaseCost: purchasePrice,
    currentMonthlyRent,
    holdPeriodYears: 5,
  });

  return (
    <div id="resale-taxation-suite" className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <DollarSign className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Resale Profit, Capital Gains Tax & Net In-Hand Realization
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                  Budget 2024 LTCG Compliance
                </span>
              </h2>
              <p className="text-sm text-slate-600">
                Compute net in-hand seller proceeds, Section 112 capital gains taxes, transfer fees, and evaluate Hold vs Sell strategy.
              </p>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Original Purchase Price</span>
              <span className="text-slate-900 font-bold">{formatINR(purchasePrice)}</span>
            </div>
            <input
              type="range"
              min="3000000"
              max="50000000"
              step="250000"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Current Sale Price</span>
              <span className="text-slate-900 font-bold">{formatINR(salePrice)}</span>
            </div>
            <input
              type="range"
              min="4000000"
              max="100000000"
              step="500000"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Purchase Year</span>
              <span className="text-slate-900 font-bold">{purchaseYear}</span>
            </div>
            <input
              type="range"
              min="2010"
              max="2025"
              step="1"
              value={purchaseYear}
              onChange={(e) => setPurchaseYear(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700">LTCG Tax Regime Selection</div>
            <div className="flex rounded-lg border border-slate-200 p-1 bg-slate-50 text-xs font-semibold">
              <button
                onClick={() => setTaxRegime('NEW_12_5_NO_INDEX')}
                className={`flex-1 py-1.5 rounded-md transition-all ${
                  taxRegime === 'NEW_12_5_NO_INDEX' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                12.5% (No Index)
              </button>
              <button
                onClick={() => setTaxRegime('OLD_20_WITH_INDEX')}
                className={`flex-1 py-1.5 rounded-md transition-all ${
                  taxRegime === 'OLD_20_WITH_INDEX' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                20% (With Index)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Gross Capital Gain</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{formatINR(resaleResult.grossCapitalGain)}</div>
          <div className="text-xs text-slate-500 mt-1">Growth: +{resaleResult.netAppreciationPercent}%</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Capital Gains Tax ({resaleResult.capitalGainsTaxRatePercent}%)</div>
          <div className="mt-1 text-2xl font-bold text-rose-600">{formatINR(resaleResult.capitalGainsTaxINR)}</div>
          <div className="text-xs text-slate-500 mt-1">Selling Fees: {formatINR(resaleResult.totalSellingExpenses)}</div>
        </div>

        <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/20 p-5 shadow-sm">
          <div className="text-xs font-bold text-emerald-800">Net In-Hand Bank Realization</div>
          <div className="mt-1 text-2xl font-black text-emerald-700">{formatINR(resaleResult.netInHandRealizationINR)}</div>
          <div className="text-xs font-bold text-emerald-900 mt-1">Net CAGR: {resaleResult.cagrNetPercent}% p.a.</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Hold vs Sell Verdict (5 Yrs)</div>
          <div className="mt-1 text-lg font-bold text-slate-900">
            {holdVsSell.recommendation === 'HOLD_PROPERTY' ? 'HOLD PROPERTY' : 'SELL & REINVEST'}
          </div>
          <div className="text-xs text-slate-500 mt-1">Advantage: {formatINR(holdVsSell.wealthDifferenceINR)}</div>
        </div>
      </div>
    </div>
  );
};
