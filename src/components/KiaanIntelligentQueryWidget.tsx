import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  PieChart,
  HelpCircle,
  Building2,
  Percent,
  Wallet,
  Scale,
  DollarSign,
  Zap,
} from 'lucide-react';
import {
  calculateKiaanAIIntelligentQuery,
  KiaanAIQueryOutput,
  formatINR,
} from '../services/calculatorEngine';

interface KiaanIntelligentQueryWidgetProps {
  contextualProperty?: {
    price?: number;
    areaSqFt?: number;
    configuration?: string;
    location?: string;
    rent?: number;
  };
  onSelectCalculatorTab?: (tabKey: string) => void;
}

const PRESET_QUERIES = [
  {
    query: 'Can I afford this ₹1.8 crore flat?',
    tag: 'Affordability & EMI',
    icon: Wallet,
    accent: 'border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-emerald-900',
  },
  {
    query: 'Is this ₹2 Cr property a good investment?',
    tag: 'Yield, IRR & ROI',
    icon: TrendingUp,
    accent: 'border-blue-200 hover:border-blue-500 hover:bg-blue-50/40 text-blue-900',
  },
  {
    query: 'Should I buy for ₹1.5 Cr or rent for ₹45,000/mo?',
    tag: 'Buy vs Rent',
    icon: Scale,
    accent: 'border-amber-200 hover:border-amber-500 hover:bg-amber-50/40 text-amber-900',
  },
  {
    query: 'I have ₹50 lakh. Which properties can I afford?',
    tag: 'Purchasing Power',
    icon: DollarSign,
    accent: 'border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-indigo-900',
  },
  {
    query: 'What will this ₹2 Cr property be worth after 10 years?',
    tag: 'Compounding & Future Value',
    icon: Building2,
    accent: 'border-purple-200 hover:border-purple-500 hover:bg-purple-50/40 text-purple-900',
  },
];

export const KiaanIntelligentQueryWidget: React.FC<KiaanIntelligentQueryWidgetProps> = ({
  contextualProperty,
}) => {
  const defaultInitialQuery = contextualProperty?.price
    ? `Can I afford this ₹${(contextualProperty.price / 10000000).toFixed(2)} Cr flat in ${contextualProperty.location || 'Pune'}?`
    : 'Can I afford this ₹1.8 crore flat?';

  const [inputQuery, setInputQuery] = useState(defaultInitialQuery);
  const [result, setResult] = useState<KiaanAIQueryOutput>(() =>
    calculateKiaanAIIntelligentQuery(defaultInitialQuery, contextualProperty)
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunQuery = (q: string) => {
    setIsProcessing(true);
    setInputQuery(q);
    setTimeout(() => {
      const output = calculateKiaanAIIntelligentQuery(q, contextualProperty);
      setResult(output);
      setIsProcessing(false);
    }, 150);
  };

  return (
    <div id="kiaan-intelligent-query-widget" className="space-y-6">
      {/* Search Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Kiaan AI Intelligent Financial Query
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                  <Zap className="h-3 w-3" /> Multi-Model Aggregator
                </span>
              </h2>
              <p className="text-sm text-slate-600">
                Ask any financial question in plain language. Kiaan automatically executes, synthesizes, and cross-analyzes multiple actuarial models simultaneously.
              </p>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-5 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunQuery(inputQuery);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask e.g. 'Is this 2 Cr flat a good investment?' or 'Can I afford 1.5 Cr on 2.5L salary?'"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Calculating...' : 'Ask Kiaan AI'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Suggested Intelligent Prompts:
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((preset, idx) => {
              const Icon = preset.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleRunQuery(preset.query)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${preset.accent}`}
                >
                  <Icon className="h-3.5 w-3.5 text-slate-500" />
                  <span>{preset.query}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Synthesis Output Display */}
      {result && (
        <div className="space-y-6">
          {/* Main Intent Title & Synthesis Banner */}
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                    Intent Detected
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Query: &quot;{result.query}&quot;
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {result.intentTitle}
                </h3>
              </div>

              {/* Combined Engines Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-slate-400 mr-1">Engines Combined:</span>
                {result.combinedEngines.map((engine, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700 shadow-2xs"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {engine}
                  </span>
                ))}
              </div>
            </div>

            {/* Executive Synthesis Summary */}
            <div className="mt-4 rounded-xl bg-white/80 border border-amber-100 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                  {result.executiveSummary}
                </p>
              </div>
            </div>

            {/* Primary KPI Metrics Grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {result.primaryMetrics.map((metric, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs"
                >
                  <div className="text-xs font-medium text-slate-500">{metric.label}</div>
                  <div className="mt-1 text-xl font-bold text-slate-900 tracking-tight">
                    {metric.value}
                  </div>
                  {metric.sublabel && (
                    <div className="mt-1 text-xs text-slate-500 font-medium">
                      {metric.sublabel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Insights & Statutory Notes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Kiaan AI Actionable Advisory Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.actionableInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm text-slate-700"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                    {idx + 1}
                  </div>
                  <p className="leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
