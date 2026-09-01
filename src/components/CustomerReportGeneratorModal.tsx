/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Share2,
  CheckSquare,
  Square,
  Sparkles,
  QrCode,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  X,
  Download,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { CurrencyCode, GeneratedPropertyReport, Project, Property, ReportSectionKey, Unit } from '../types';
import {
  AVAILABLE_REPORT_SECTIONS,
  generatePropertyReport,
} from '../services/reportGeneratorService';
import { convertCurrency, formatINR } from '../services/currencyEngine';

interface CustomerReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  property?: Property;
  unit?: Unit;
  theme?: 'dark' | 'light';
}

export const CustomerReportGeneratorModal: React.FC<CustomerReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  project,
  property,
  unit,
  theme = 'dark',
}) => {
  const [selectedSections, setSelectedSections] = useState<ReportSectionKey[]>([
    'photos',
    'floorPlan',
    'price',
    'amenities',
    'location',
    'commute',
    'emi',
    'totalCost',
    'investment',
    'rera',
  ]);
  const [customerName, setCustomerName] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [generatedReport, setGeneratedReport] = useState<GeneratedPropertyReport | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const toggleSection = (key: ReportSectionKey) => {
    setSelectedSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleGenerate = () => {
    const report = generatePropertyReport(
      {
        targetId: project?.id || property?.id || 'kiaan_asset',
        targetType: project ? 'PROJECT' : property ? 'PROPERTY' : 'UNIT',
        unitId: unit?.id,
        customerName: customerName.trim() || undefined,
        selectedSections,
        currency,
        includeQrCode: true,
        includeDisclaimers: true,
      },
      project,
      property,
      unit
    );
    setGeneratedReport(report);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (generatedReport) {
      navigator.clipboard.writeText(generatedReport.livePagePermalink);
      setToastMessage('Live asset permalink copied to clipboard!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div
        className={`w-full max-w-5xl rounded-3xl border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-[#080D1A] border-amber-500/30 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-current/10 flex items-center justify-between flex-shrink-0 bg-current/5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold tracking-wide">
                  {generatedReport ? 'Branded Property Dossier' : 'Create My Property Report'}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  Kiaan Financial Intelligence™
                </span>
              </div>
              <p className="text-xs opacity-60">
                Generate a publication-grade, MahaRERA stamped analytical report with personalized modules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {generatedReport && (
              <>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDark ? 'border-white/10 hover:bg-white/10' : 'border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Copy Live Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-current/10 opacity-60 hover:opacity-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOAST ALERT */}
        {toastMessage && (
          <div className="bg-emerald-500 text-black text-xs font-bold py-1.5 px-4 text-center animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!generatedReport ? (
            /* REPORT BUILDER WIZARD */
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* TARGET RESIDENCE SUMMARY */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">
                      {project?.name || property?.title || 'Kiaan Luxury Residence'}
                    </h3>
                    <p className="text-xs opacity-60">
                      {project?.location?.microMarket || property?.location?.microMarket || 'Wakad'}, Pune •{' '}
                      {project?.reraRecord?.registrationNumber || property?.reraRecord?.registrationNumber || 'P52100028492'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs uppercase font-bold text-amber-500">Base Price</span>
                  <div className="font-serif font-bold text-base">
                    {formatINR(
                      unit?.pricing?.basePrice ||
                        property?.pricing?.basePrice ||
                        project?.headlinePriceRange?.min ||
                        14800000
                    )}
                  </div>
                </div>
              </div>

              {/* CLIENT NAME & CURRENCY PREFERENCE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                    Client Name for Dossier (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className={`w-full px-4 py-2.5 rounded-xl text-xs border focus:outline-none transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 focus:border-amber-500 text-white'
                        : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                    Display Currency Equivalent
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs border focus:outline-none transition-all ${
                      isDark
                        ? 'bg-slate-900 border-white/10 focus:border-amber-500 text-white'
                        : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                    }`}
                  >
                    <option value="INR">INR (₹) — Official Indian Property Standard</option>
                    <option value="USD">USD ($) — United States Dollar (Estimate)</option>
                    <option value="GBP">GBP (£) — British Pound (Estimate)</option>
                    <option value="EUR">EUR (€) — Euro (Estimate)</option>
                    <option value="AED">AED (AED) — UAE Dirham (Estimate)</option>
                  </select>
                </div>
              </div>

              {/* CHOOSE SECTIONS TO INCLUDE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    Select Dossier Modules (Choose What to Include)
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setSelectedSections(AVAILABLE_REPORT_SECTIONS.map((s) => s.key))
                      }
                      className="text-[11px] font-bold text-amber-500 hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setSelectedSections(['price', 'totalCost', 'rera'])}
                      className="text-[11px] opacity-60 hover:opacity-100 cursor-pointer"
                    >
                      Minimal
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_REPORT_SECTIONS.map((sec) => {
                    const isChecked = selectedSections.includes(sec.key);
                    return (
                      <div
                        key={sec.key}
                        onClick={() => toggleSection(sec.key)}
                        className={`p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                          isChecked
                            ? isDark
                              ? 'bg-amber-500/10 border-amber-500/50 text-white'
                              : 'bg-amber-50 border-amber-400 text-slate-900'
                            : isDark
                            ? 'bg-white/[0.02] border-white/5 opacity-50 hover:opacity-80'
                            : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-90'
                        }`}
                      >
                        <div className="mt-0.5 text-amber-500">
                          {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-xs">{sec.label}</h4>
                          <p className="text-[11px] opacity-60 mt-0.5 leading-snug">{sec.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GENERATE CTA */}
              <div className="pt-4 border-t border-current/10 flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={selectedSections.length === 0}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 disabled:opacity-40 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Publication-Grade Report</span>
                </button>
              </div>
            </div>
          ) : (
            /* GENERATED REPORT LIVE PREVIEW DOSSIER */
            <div className="space-y-8 max-w-4xl mx-auto printable-dossier">
              {/* BACK TO EDIT */}
              <div className="flex items-center justify-between no-print border-b border-current/10 pb-4">
                <button
                  onClick={() => setGeneratedReport(null)}
                  className="text-xs font-bold text-amber-500 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>← Reconfigure Report Modules</span>
                </button>

                <span className="text-[11px] font-mono opacity-60">
                  Dossier ID: {generatedReport.reportId}
                </span>
              </div>

              {/* DOSSIER BRAND HEADER */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-black to-slate-950 border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center font-serif font-black text-sm">
                      K
                    </div>
                    <span className="font-serif font-bold text-lg tracking-widest text-amber-400">
                      KIAAN ESTATES
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                    {generatedReport.targetTitle}
                  </h1>
                  <p className="text-xs text-amber-200/80 font-medium">
                    {generatedReport.targetTagline}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-white/60 pt-2">
                    <span>Client: <strong className="text-white">{generatedReport.dossierData.buyerName}</strong></span>
                    <span>•</span>
                    <span>Date: {generatedReport.generationDate}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2 bg-black/50 p-3.5 rounded-2xl border border-amber-500/30">
                  <img
                    src={generatedReport.reraQrCodeUrl}
                    alt="Live Page QR"
                    className="w-20 h-20 rounded-xl bg-white p-1"
                  />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400">
                    Scan for 3D Twin & Live Info
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    MahaRERA: {generatedReport.reraRegistrationNumber}
                  </span>
                </div>
              </div>

              {/* MODULE 1: PHOTOS */}
              {generatedReport.includedSections.includes('photos') && generatedReport.dossierData.photos && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <span>1. Architectural Visuals & Elevations</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {generatedReport.dossierData.photos.map((ph: any, i: number) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden border border-current/10">
                        <img src={ph.url} alt={ph.title} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODULE 2: TOTAL COST & PRICING */}
              {generatedReport.includedSections.includes('totalCost') && generatedReport.dossierData.totalCost && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    <span>2. Transparent Total Acquisition Cost (Statutory Breakup)</span>
                  </h3>
                  <div
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="opacity-60 block">Base Agreement</span>
                        <strong className="text-sm font-serif">
                          {formatINR(generatedReport.dossierData.totalCost.basePriceINR)}
                        </strong>
                      </div>
                      <div>
                        <span className="opacity-60 block">Maharashtra Stamp Duty (6%)</span>
                        <strong className="text-sm font-serif">
                          {formatINR(generatedReport.dossierData.totalCost.stampDutyINR)}
                        </strong>
                      </div>
                      <div>
                        <span className="opacity-60 block">Statutory GST (5%)</span>
                        <strong className="text-sm font-serif">
                          {formatINR(generatedReport.dossierData.totalCost.gstINR)}
                        </strong>
                      </div>
                      <div>
                        <span className="opacity-60 block">Estimated Total Cost</span>
                        <strong className="text-sm font-serif text-amber-500">
                          {generatedReport.dossierData.totalCost.totalAcquisitionCostFormatted}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 3: LOAN & EMI */}
              {generatedReport.includedSections.includes('emi') && generatedReport.dossierData.emi && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    <span>3. Home Loan & Monthly EMI Projection</span>
                  </h3>
                  <div
                    className={`p-4 rounded-2xl border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <span className="opacity-60 block">Loan Principal (80%)</span>
                      <strong className="text-sm font-serif">
                        {generatedReport.dossierData.emi.loanAmountFormatted}
                      </strong>
                    </div>
                    <div>
                      <span className="opacity-60 block">Estimated Interest Rate</span>
                      <strong className="text-sm font-serif">
                        {generatedReport.dossierData.emi.assumedInterestRatePercent}% p.a.
                      </strong>
                    </div>
                    <div>
                      <span className="opacity-60 block">Tenure</span>
                      <strong className="text-sm font-serif">
                        {generatedReport.dossierData.emi.assumedTenureYears} Years (240 Mos)
                      </strong>
                    </div>
                    <div>
                      <span className="opacity-60 block">Estimated Monthly EMI</span>
                      <strong className="text-sm font-serif text-amber-500">
                        {generatedReport.dossierData.emi.monthlyEmiFormatted} / mo
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 4: INVESTMENT FORECAST */}
              {generatedReport.includedSections.includes('investment') && generatedReport.dossierData.investment && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    <span>4. Investment Potential & Rental Yield Rationale</span>
                  </h3>
                  <div
                    className={`p-4 rounded-2xl border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <span className="opacity-60 block">Gross Rental Yield</span>
                      <strong className="text-sm font-serif text-emerald-400">
                        {generatedReport.dossierData.investment.grossRentalYieldPercent}%
                      </strong>
                    </div>
                    <div>
                      <span className="opacity-60 block">Annual Rental Income</span>
                      <strong className="text-sm font-serif">
                        {formatINR(generatedReport.dossierData.investment.annualRentalIncomeEstINR)}
                      </strong>
                    </div>
                    <div>
                      <span className="opacity-60 block">5-Yr Appreciation Pace</span>
                      <strong className="text-sm font-serif text-emerald-400">
                        +{generatedReport.dossierData.investment.appreciationForecast5YrPercent}%
                      </strong>
                    </div>
                    <div>
                      <span className="opacity-60 block">Projected 5-Yr IRR</span>
                      <strong className="text-sm font-serif text-amber-500">
                        {generatedReport.dossierData.investment.projectedIrrPercent}%
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 5: MAHARERA REGULATORY & ESCROW STAMP */}
              {generatedReport.includedSections.includes('rera') && generatedReport.dossierData.rera && (
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                    isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs text-emerald-500 uppercase tracking-wider">
                        MahaRERA Statutory Compliance
                      </h4>
                      <p className="text-xs opacity-80 mt-0.5">
                        Registration No: <strong>{generatedReport.dossierData.rera.registrationNumber}</strong> •{' '}
                        {generatedReport.dossierData.rera.escrowRingFencePercent}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500 text-black font-bold">
                    VERIFIED CLEAR
                  </span>
                </div>
              )}

              {/* MANDATORY DISCLAIMERS & PERMALINK */}
              <div className="pt-4 border-t border-current/10 space-y-2 text-[10px] opacity-60 leading-relaxed">
                <p>
                  <strong>Statutory Disclaimer: </strong>
                  {generatedReport.mandatoryDisclaimer}
                </p>
                <p>
                  Live Verification URL: {generatedReport.livePagePermalink} • Generated by Kiaan Financial Intelligence Engine.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
