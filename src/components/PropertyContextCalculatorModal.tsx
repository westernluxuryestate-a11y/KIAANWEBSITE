import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Wallet,
  TrendingUp,
  Scale,
  Building2,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  HelpCircle,
  FileText,
  Calculator,
  Layers,
} from 'lucide-react';
import {
  calculateEMI,
  calculateAcquisitionCostBreakdown,
  calculateStatutoryTaxShield,
  calculateBuyVsRent,
  calculateComprehensivePropertyInvestment,
  calculateKiaanAIIntelligentQuery,
  formatINR,
} from '../services/calculatorEngine';

export interface PropertyContextData {
  title: string;
  unitNumber?: string;
  price: number;
  carpetAreaSqFt: number;
  configuration: string;
  location: string;
  floorBand?: string;
  estimatedMonthlyRent?: number;
}

interface PropertyContextCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyContextData;
  initialTab?: 'AFFORDABILITY' | 'INVESTMENT' | 'BUY_VS_RENT' | 'AI_QUERY';
}

export const PropertyContextCalculatorModal: React.FC<PropertyContextCalculatorModalProps> = ({
  isOpen,
  onClose,
  property,
  initialTab = 'AFFORDABILITY',
}) => {
  const [activeTab, setActiveTab] = useState<'AFFORDABILITY' | 'INVESTMENT' | 'BUY_VS_RENT' | 'AI_QUERY'>(initialTab);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTenureYears, setLoanTenureYears] = useState(20);
  const [interestRate, setInterestRate] = useState(8.45);
  const [holdingYears, setHoldingYears] = useState(10);
  const [appreciationRate, setAppreciationRate] = useState(6.5);

  if (!isOpen || !property) return null;

  const propPrice = property.price || 15000000;
  const propArea = property.carpetAreaSqFt || 1800;
  const estimatedRent = property.estimatedMonthlyRent || Math.round((propPrice * 0.042) / 12);
  const loanPrincipal = Math.round(propPrice * (1 - downPaymentPercent / 100));
  const emiData = calculateEMI(loanPrincipal, interestRate, loanTenureYears);
  const acqCost = calculateAcquisitionCostBreakdown({
    basePrice: propPrice,
    carpetAreaSqFt: propArea,
  });
  const taxShield = calculateStatutoryTaxShield({
    loanPrincipal,
    annualInterestRatePercent: interestRate,
    tenureYears: loanTenureYears,
  });
  const minRequiredIncome = Math.round(emiData.monthlyEMI / 0.45);

  const investmentData = calculateComprehensivePropertyInvestment({
    propertyPrice: propPrice,
    monthlyRent: estimatedRent,
    annualRentIncreasePercent: 5.0,
    annualAppreciationPercent: appreciationRate,
    holdingPeriodYears: holdingYears,
    loanToValuePercent: 100 - downPaymentPercent,
    loanInterestRatePercent: interestRate,
    loanTenureYears,
  });

  const bvrData = calculateBuyVsRent({
    propertyPrice: propPrice,
    monthlyRent: estimatedRent,
    downPayment: Math.round(propPrice * (downPaymentPercent / 100)),
    loanInterestRate: interestRate,
    annualAppreciationRate: appreciationRate,
    annualRentEscalationRate: 6.0,
    investmentYieldRate: 11.5,
    years: holdingYears,
  });

  const aiQueryData = calculateKiaanAIIntelligentQuery(
    `Can I afford this ${property.configuration || 'residence'} flat priced at ${formatINR(propPrice)} in ${property.location || 'Pune'}?`,
    {
      price: propPrice,
      areaSqFt: property.carpetAreaSqFt,
      configuration: property.configuration,
      location: property.location,
      rent: estimatedRent,
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-bold">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Property Intelligence & Contextual Financials
                </h3>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-amber-300 font-medium">
                  {property.unitNumber ? `Unit ${property.unitNumber}` : property.title}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {formatINR(property.price)} · {property.configuration} · {property.carpetAreaSqFt.toLocaleString()} sq.ft. Carpet · {property.location}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          <button
            onClick={() => setActiveTab('AFFORDABILITY')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-semibold transition-colors ${
              activeTab === 'AFFORDABILITY'
                ? 'border-amber-500 text-slate-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wallet className="h-4 w-4" />
            Can I Afford This?
          </button>
          <button
            onClick={() => setActiveTab('INVESTMENT')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-semibold transition-colors ${
              activeTab === 'INVESTMENT'
                ? 'border-amber-500 text-slate-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Investment Return & Yield
          </button>
          <button
            onClick={() => setActiveTab('BUY_VS_RENT')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-semibold transition-colors ${
              activeTab === 'BUY_VS_RENT'
                ? 'border-amber-500 text-slate-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="h-4 w-4" />
            Buy vs Rent
          </button>
          <button
            onClick={() => setActiveTab('AI_QUERY')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-semibold transition-colors ${
              activeTab === 'AI_QUERY'
                ? 'border-amber-500 text-slate-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            Ask Kiaan AI
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* 1. CAN I AFFORD THIS? */}
          {activeTab === 'AFFORDABILITY' && (
            <div className="space-y-6">
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="text-xs font-semibold text-slate-500">Monthly Home Loan EMI</div>
                  <div className="mt-1 text-xl font-bold text-slate-900">{formatINR(emiData.monthlyEMI)} / mo</div>
                  <div className="text-xs text-slate-500 mt-1">@ {interestRate}% p.a. over {loanTenureYears} Yrs</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="text-xs font-semibold text-slate-500">Min. Monthly Income Needed</div>
                  <div className="mt-1 text-xl font-bold text-emerald-700">{formatINR(minRequiredIncome)} / mo</div>
                  <div className="text-xs text-slate-500 mt-1">Based on 45% standard bank FOIR</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="text-xs font-semibold text-slate-500">Down Payment Required</div>
                  <div className="mt-1 text-xl font-bold text-slate-900">{formatINR(property.price * (downPaymentPercent / 100))}</div>
                  <div className="text-xs text-slate-500 mt-1">{downPaymentPercent}% of Agreement Value</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="text-xs font-semibold text-slate-500">All-Inclusive Outlay</div>
                  <div className="mt-1 text-xl font-bold text-slate-900">{formatINR(acqCost.totalAcquisitionCost)}</div>
                  <div className="text-xs text-slate-500 mt-1">Includes Stamp Duty, GST & Fees</div>
                </div>
              </div>

              {/* Acquisition Cost Breakdown */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-600" />
                  Statutory & All-Inclusive Acquisition Cost Breakdown
                </h4>
                <div className="divide-y divide-slate-100 text-sm">
                  {acqCost.breakdownSummary.map((item, i) => (
                    <div key={i} className="flex justify-between py-2.5">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-semibold text-slate-900">{formatINR(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-3 font-bold text-base text-slate-900 bg-slate-50 px-3 rounded-lg mt-2">
                    <span>Total Net Outlay</span>
                    <span className="text-amber-600">{formatINR(acqCost.totalAcquisitionCost)}</span>
                  </div>
                </div>
              </div>

              {/* Tax Savings Blueprint */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  Tax Shield Benefit (Sections 80C & 24b)
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  By availing Section 24(b) interest deduction (up to ₹2 Lakh) and Section 80C principal deduction (up to ₹1.5 Lakh), you save approx <strong>{formatINR(taxShield.totalAnnualTaxSavedINR)}/year</strong> in taxes, reducing your effective monthly EMI to <strong>{formatINR(emiData.monthlyEMI - taxShield.monthlyTaxShieldINR)}/mo</strong>.
                </p>
              </div>
            </div>
          )}

          {/* 2. INVESTMENT RETURN & YIELD */}
          {activeTab === 'INVESTMENT' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="text-xs font-semibold text-slate-500">Gross Rental Yield</div>
                  <div className="mt-1 text-xl font-bold text-slate-900">{investmentData.grossRentalYieldPercent}% p.a.</div>
                  <div className="text-xs text-slate-500 mt-1">Starting Rent: {formatINR(estimatedRent)}/mo</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="text-xs font-semibold text-slate-500">{holdingYears}-Year Leveraged IRR</div>
                  <div className="mt-1 text-xl font-bold text-emerald-700">{investmentData.leveragedIRRPercent}%</div>
                  <div className="text-xs text-slate-500 mt-1">Unleveraged: {investmentData.unleveragedIRRPercent}%</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="text-xs font-semibold text-slate-500">{holdingYears}-Year Exit Valuation</div>
                  <div className="mt-1 text-xl font-bold text-slate-900">{formatINR(investmentData.projectedExitValue)}</div>
                  <div className="text-xs text-slate-500 mt-1">@ {appreciationRate}% p.a. appreciation</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="text-xs font-semibold text-slate-500">Total Net Profit</div>
                  <div className="mt-1 text-xl font-bold text-slate-900">{formatINR(investmentData.totalNetProfit)}</div>
                  <div className="text-xs text-slate-500 mt-1">{investmentData.equityMultiple}x Equity Multiple</div>
                </div>
              </div>

              {/* 10/15/20 Year Multi-Horizon Summary Table */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Multi-Horizon Milestone Forecast</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3">Horizon</th>
                        <th className="py-2.5 px-3">Projected Asset Value</th>
                        <th className="py-2.5 px-3">Monthly Rent (5% Escalation)</th>
                        <th className="py-2.5 px-3">Cumulative Rental Collected</th>
                        <th className="py-2.5 px-3">Leveraged IRR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {investmentData.multiHorizonSummary.map((h, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{h.horizonYears} Years</td>
                          <td className="py-2.5 px-3">{formatINR(h.exitPropertyValue)}</td>
                          <td className="py-2.5 px-3">{formatINR(h.monthlyRentAtExitYear)}/mo</td>
                          <td className="py-2.5 px-3">{formatINR(h.cumulativeRentalIncome)}</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-700">{h.leveragedIRR}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. BUY VS RENT */}
          {activeTab === 'BUY_VS_RENT' && (
            <div className="space-y-6">
              <div className="rounded-xl border-2 border-amber-500 bg-amber-50/20 p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      Strategic Verdict
                    </span>
                    <h4 className="text-lg font-bold text-slate-900">
                      {bvrData.verdict === 'BUYING_WINS' ? 'Buying Builds Higher Wealth' : 'Renting + SIP Outperforms'}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium">Net Advantage</div>
                    <div className="text-xl font-black text-amber-700">{formatINR(bvrData.netAdvantageAmount)}</div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-amber-200/60 pt-3">
                  {bvrData.reasoning}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-500">BUYING SCENARIO ({holdingYears} Yrs)</div>
                  <div className="text-lg font-bold text-slate-900">{formatINR(bvrData.netEquityBuiltBuying)}</div>
                  <div className="text-xs text-slate-500">Net debt-free property equity built through asset appreciation.</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-500">RENTING SCENARIO ({holdingYears} Yrs)</div>
                  <div className="text-lg font-bold text-slate-900">{formatINR(bvrData.sipCorpusWithRenting)}</div>
                  <div className="text-xs text-slate-500">Total rent paid: {formatINR(bvrData.totalRentPaid10Yrs)} (unrecoverable expense).</div>
                </div>
              </div>
            </div>
          )}

          {/* 4. ASK KIAAN AI */}
          {activeTab === 'AI_QUERY' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Kiaan Multi-Model Autonomous Assessment
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {aiQueryData.executiveSummary}
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {aiQueryData.primaryMetrics.slice(0, 3).map((m, idx) => (
                    <div key={idx} className="rounded-lg bg-white p-3 border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">{m.label}</div>
                      <div className="text-base font-bold text-slate-900">{m.value}</div>
                      {m.sublabel && <div className="text-[10px] text-slate-400 mt-0.5">{m.sublabel}</div>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Actionable Insights for this specific unit:
                </div>
                {aiQueryData.actionableInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-xs text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
          <span className="text-xs text-slate-500">
            Automated calculations modeled on MahaRERA guidelines & banking standards.
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
