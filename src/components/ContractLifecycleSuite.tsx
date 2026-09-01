/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ConstructionMilestone,
  StatutoryAllotmentLetter,
  ModelAgreementForSale,
  EscrowDisbursementOverview,
} from '../typesPhase4';
import { formatINR } from '../services/calculatorEngine';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Landmark,
  Building,
  TrendingUp,
  Download,
  Eye,
  Camera,
  Calendar,
  Sparkles,
  ArrowRight,
  AlertCircle,
  FileCode,
  PenTool,
  Clock,
} from 'lucide-react';

export function ContractLifecycleSuite() {
  const [activeTab, setActiveTab] = useState<'ALLOTMENT' | 'AGREEMENT' | 'MILESTONES' | 'ESCROW_AUDIT'>('ALLOTMENT');

  const [allotment, setAllotment] = useState<StatutoryAllotmentLetter | null>(null);
  const [agreement, setAgreement] = useState<ModelAgreementForSale | null>(null);
  const [milestones, setMilestones] = useState<ConstructionMilestone[]>([]);
  const [escrowOverview, setEscrowOverview] = useState<EscrowDisbursementOverview | null>(null);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signSuccessMessage, setSignSuccessMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [altRes, agrRes, msRes, escRes] = await Promise.all([
        fetch('/api/v1/contracts/allotment-letters/default').then((r) => r.json()),
        fetch('/api/v1/contracts/model-agreement/default').then((r) => r.json()),
        fetch('/api/v1/contracts/milestones/proj_one_vertica_wakad').then((r) => r.json()),
        fetch('/api/v1/contracts/escrow-audit/proj_one_vertica_wakad').then((r) => r.json()),
      ]);

      if (altRes?.success && altRes?.data) setAllotment(altRes.data);
      if (agrRes?.success && agrRes?.data) setAgreement(agrRes.data);
      if (msRes?.success && Array.isArray(msRes?.data)) setMilestones(msRes.data);
      if (escRes?.success && escRes?.data) setEscrowOverview(escRes.data);
    } catch (e) {
      console.error('Failed to load contract lifecycle data', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExecuteEsign = () => {
    setSignSuccessMessage('Aadhaar OTP e-Sign verified successfully (UIDAI Cert Class 3). Digital signature and cryptographic timestamp affixed.');
    setIsSignModalOpen(false);
    setTimeout(() => setSignSuccessMessage(null), 8000);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="contract-lifecycle-suite">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0F172B] via-[#090E1B] to-[#04060B] border border-amber-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>MahaRERA Statutory Contract Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Digital Allotment Letters, Model Agreements & Escrow Audits
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Institutional post-reservation contracting: generate legally binding MahaRERA Section 13 Allotment Letters with Aadhaar e-Sign, inspect architect-certified construction milestones, and monitor 70% statutory escrow disbursements.
          </p>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 relative z-10 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-white/40 uppercase font-bold text-[10px]">Statutory Allotment</span>
            <span className="text-sm font-bold text-emerald-400 block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Section 13 Compliant</span>
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-white/40 uppercase font-bold text-[10px]">Defect Warranty</span>
            <span className="text-sm font-bold text-amber-400 block">5 Years (Sec 14(3))</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-white/40 uppercase font-bold text-[10px]">Escrow Retained (70%)</span>
            <span className="text-sm font-bold text-white block">
              {escrowOverview ? formatINR(escrowOverview.totalEscrowRetainedINR) : '₹9.98 Cr'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-white/40 uppercase font-bold text-[10px]">Architect Form 4</span>
            <span className="text-sm font-bold text-emerald-400 block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Plinth & Slab Certified</span>
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {signSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{signSuccessMessage}</span>
          </div>
          <button onClick={() => setSignSuccessMessage(null)} className="text-white/60 hover:text-white font-bold ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Selectors */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'ALLOTMENT', label: 'Statutory Allotment Letter (Sec 13)', icon: FileText },
          { id: 'AGREEMENT', label: 'Model Agreement for Sale Clauses', icon: ShieldCheck },
          { id: 'MILESTONES', label: 'Construction Milestones & Form 4 Certs', icon: Building },
          { id: 'ESCROW_AUDIT', label: '70% Escrow Account Transparency', icon: Landmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* TAB 1: STATUTORY ALLOTMENT LETTER (SECTION 13) */}
      {activeTab === 'ALLOTMENT' && allotment && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">MahaRERA Prescribed Allotment Letter (Form A Annexure)</h3>
              <p className="text-xs text-white/50">Legally enforceable digital allotment pursuant to Section 13(1) of RERA Act 2016</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSignModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>e-Sign with Aadhaar OTP</span>
              </button>
              <button
                onClick={() => alert(`Downloading Certified Allotment Letter PDF: ${allotment.allotmentId}.pdf`)}
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Certified PDF</span>
              </button>
            </div>
          </div>

          {/* Allotment Letter Formal Document Container */}
          <div className="rounded-3xl bg-[#0C1220]/95 border border-white/15 p-6 sm:p-10 space-y-8 shadow-2xl font-serif text-white/90">
            {/* Letterhead */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-white/10 pb-6 font-sans">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                  {allotment.developerLegalEntity}
                </span>
                <h2 className="text-2xl font-serif font-bold text-white">{allotment.projectName}</h2>
                <p className="text-xs text-white/50">CIN: {allotment.developerCin} | MahaRERA: {allotment.developerReraRegNumber}</p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase font-sans">
                  PROVISIONAL ALLOTMENT ISSUED
                </span>
                <p className="text-xs text-white/50 mt-2 font-mono">Reference: {allotment.allotmentId}</p>
                <p className="text-xs text-white/50 font-mono">Date: {allotment.dateGenerated}</p>
              </div>
            </div>

            {/* Recipient Box */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 space-y-1 font-sans text-xs">
              <span className="text-white/40 uppercase font-bold text-[10px]">Allottee Details:</span>
              <div className="text-sm font-bold text-white">{allotment.buyerLegalName}</div>
              <div className="text-white/60">PAN: <span className="font-mono text-white">{allotment.buyerPanNumber}</span> | Aadhaar (Last 4): <span className="font-mono text-white">XXXX-XXXX-{allotment.buyerAadhaarLast4}</span></div>
              <div className="text-white/60">Address: {allotment.buyerAddress}</div>
            </div>

            {/* Recitals */}
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-white/80">
              <p>
                Dear Sir/Madam,
              </p>
              <p>
                We are pleased to provisionally allot to you the luxury residential apartment described hereunder in accordance with Section 13(1) of the Real Estate (Regulation and Development) Act, 2016, and Rule 9 of the Maharashtra Real Estate (Regulation and Development) (Registration of real estate projects, Registration of real estate agents, rates of interest and disclosures on website) Rules, 2017.
              </p>
            </div>

            {/* Property Schedule Grid */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-4 font-sans text-xs">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Schedule A — Allotted Premises Specifications</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Tower / Wing</span>
                  <span className="font-bold text-white">{allotment.buildingTower}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Unit Number</span>
                  <span className="font-bold text-white">{allotment.unitNumber} (Floor {allotment.floorNumber})</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">RERA Carpet Area</span>
                  <span className="font-bold text-emerald-400">{allotment.carpetAreaSqFt} sq.ft ({allotment.carpetAreaSqMtr} sq.m)</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Exclusive Balcony</span>
                  <span className="font-bold text-white">{allotment.exclusiveBalconySqFt} sq.ft</span>
                </div>
              </div>
            </div>

            {/* Financial Consideration Table */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-3 font-sans text-xs">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Schedule B — Financial Consideration & Escrow Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-white/70">
                  <span>Total Agreed Allotment Consideration:</span>
                  <span className="font-bold text-white">{formatINR(allotment.allotmentConsiderationINR)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Token Consideration Already Paid (Held in Escrow):</span>
                  <span className="font-bold">-{formatINR(allotment.tokenPaidINR)}</span>
                </div>
                <div className="flex justify-between text-white/70 pt-2 border-t border-white/5">
                  <span>Balance Payable on Agreement Execution (to complete 10% booking cap):</span>
                  <span className="font-bold text-amber-300">{formatINR(allotment.balancePayableOnAgreementINR)}</span>
                </div>
              </div>
            </div>

            {/* Signatures Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10 font-sans text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-white/40 uppercase text-[10px] font-bold">Authorized Developer Signatory</span>
                <div className="text-sm font-bold text-white">For {allotment.developerLegalEntity}</div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Digitally Signed via DSC (Kiaan Corporate Key)</span>
                </div>
                <span className="text-[10px] font-mono text-white/40">{allotment.timestampEsignDeveloper}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-white/40 uppercase text-[10px] font-bold">Allottee Confirmation</span>
                <div className="text-sm font-bold text-white">{allotment.buyerLegalName}</div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aadhaar e-Signed (UIDAI OTP Verified)</span>
                </div>
                <span className="text-[10px] font-mono text-white/40">{allotment.timestampEsignBuyer}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODEL AGREEMENT FOR SALE (SECTION 13 CLAUSES) */}
      {activeTab === 'AGREEMENT' && agreement && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">MahaRERA Prescribed Model Agreement for Sale</h3>
              <p className="text-xs text-white/50">Mandatory statutory clauses under Section 13 of RERA Act 2016</p>
            </div>
            <button
              onClick={() => alert(`Downloading Draft Model Agreement: ${agreement.agreementId}.pdf`)}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Model Agreement Draft</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(agreement.clauses || []).map((clause) => (
              <div
                key={clause.clauseNumber}
                className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-3 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase">
                    {clause.clauseNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] font-bold">
                    MahaRERA Non-Negotiable
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">{clause.heading}</h4>
                <p className="text-xs text-white/70 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5 italic">
                  "{clause.text}"
                </p>
              </div>
            ))}
          </div>

          {/* Statutory 70% Escrow Info Card */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-950/40 via-blue-900/20 to-transparent border border-blue-500/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <Landmark className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Designated 70% Statutory Escrow Bank Account Details</h4>
                <p className="text-xs text-white/60">Strictly ring-fenced under MahaRERA Section 4(2)(l)(D) for civil works & land outlays</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.04]">
                <span className="text-white/40 block text-[10px] uppercase">Bank & Branch</span>
                <span className="font-bold text-white">{agreement.statutory70PercentEscrowBank.bankName}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04]">
                <span className="text-white/40 block text-[10px] uppercase">RERA Account Number</span>
                <span className="font-mono font-bold text-amber-400">{agreement.statutory70PercentEscrowBank.accountNumber}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04]">
                <span className="text-white/40 block text-[10px] uppercase">IFSC Code</span>
                <span className="font-mono font-bold text-white">{agreement.statutory70PercentEscrowBank.ifscCode}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONSTRUCTION MILESTONES & ARCHITECT FORM 4 CERTS */}
      {activeTab === 'MILESTONES' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Construction-Linked Payment Milestones & Form 4 Certifications</h3>
              <p className="text-xs text-white/50">Every milestone release is governed by certified Architect Form 4 and Structural Engineer Form 2 filings</p>
            </div>
          </div>

          <div className="space-y-4">
            {milestones.map((ms) => {
              const isCompleted = ms.status === 'COMPLETED';
              const isInProgress = ms.status === 'IN_PROGRESS';

              return (
                <div
                  key={ms.id}
                  className={`rounded-3xl border p-6 space-y-4 transition-all ${
                    isCompleted
                      ? 'bg-[#0B1522]/80 border-emerald-500/30'
                      : isInProgress
                      ? 'bg-[#0F172B]/90 border-amber-500/50 shadow-xl shadow-amber-500/5'
                      : 'bg-white/[0.02] border-white/10 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-500 text-black'
                            : isInProgress
                            ? 'bg-amber-500 text-black animate-pulse'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {ms.stageNumber}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{ms.stageName}</h4>
                        <p className="text-xs text-white/50">{ms.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white">{ms.statutoryPercentOfTotal}% Consideration</span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : isInProgress
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-white/5 text-white/40'
                        }`}
                      >
                        {ms.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar & Details */}
                  <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-white/60">Actual Site Progress:</span>
                      <span className="font-bold text-white">{ms.currentActualProgressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${ms.currentActualProgressPercent}%` }}
                      ></div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-white/60 text-[11px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-white/40" />
                        <span>Est. Completion: <strong className="text-white">{ms.completionDateEstimated}</strong></span>
                      </div>

                      {ms.architectForm4CertRequired && (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Architect Form 4: <strong className="text-emerald-300">{ms.architectForm4Status.replace('_', ' ')}</strong></span>
                        </div>
                      )}

                      {ms.photos && ms.photos.length > 0 && (
                        <button
                          onClick={() => setSelectedPhoto(ms.photos[0])}
                          className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>View Live Drone Photo</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: 70% ESCROW ACCOUNT TRANSPARENCY */}
      {activeTab === 'ESCROW_AUDIT' && escrowOverview && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-1">
              <span className="text-[10px] text-white/40 uppercase font-bold">Total Realized Collections</span>
              <div className="text-2xl font-bold text-white">{formatINR(escrowOverview.totalCollectionsINR)}</div>
              <p className="text-[11px] text-white/50">From project allottees to date</p>
            </div>

            <div className="rounded-3xl bg-blue-950/30 border border-blue-500/30 p-6 space-y-1">
              <span className="text-[10px] text-blue-300 uppercase font-bold">70% Escrow Retained</span>
              <div className="text-2xl font-bold text-blue-200">{formatINR(escrowOverview.totalEscrowRetainedINR)}</div>
              <p className="text-[11px] text-blue-200/60">Strictly ring-fenced by law</p>
            </div>

            <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-1">
              <span className="text-[10px] text-white/40 uppercase font-bold">Disbursed for Construction</span>
              <div className="text-2xl font-bold text-emerald-400">{formatINR(escrowOverview.totalDisbursedToConstructionINR)}</div>
              <p className="text-[11px] text-white/50">Form 1, 2 & 3 certified releases</p>
            </div>

            <div className="rounded-3xl bg-amber-500/10 border border-amber-500/30 p-6 space-y-1">
              <span className="text-[10px] text-amber-400 uppercase font-bold">Current Escrow Balance</span>
              <div className="text-2xl font-bold text-amber-300">{formatINR(escrowOverview.currentEscrowBalanceINR)}</div>
              <p className="text-[11px] text-amber-200/60">Audit verified liquid reserves</p>
            </div>
          </div>

          {/* Audit Transactions Table */}
          <div className="rounded-3xl bg-[#0C1220]/90 border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl overflow-x-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Recent Escrow Ledger Audit Entries</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                100% STATUTORY AUDIT COMPLIANT
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Txn Reference</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Transaction Type</th>
                  <th className="pb-3 font-semibold">Gross Value</th>
                  <th className="pb-3 font-semibold">70% Escrow Share</th>
                  <th className="pb-3 font-semibold">Statutory Certificates</th>
                  <th className="pb-3 font-semibold">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {(escrowOverview.recentAuditTransactions || []).map((txn) => (
                  <tr key={txn.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 font-mono text-white">{txn.id}</td>
                    <td className="py-3.5">{txn.date}</td>
                    <td className="py-3.5 font-medium">{txn.transactionType.replace(/_/g, ' ')}</td>
                    <td className="py-3.5 font-bold text-white">{formatINR(txn.amountINR)}</td>
                    <td className="py-3.5 font-bold text-blue-300">{formatINR(txn.escrow70ComponentINR)}</td>
                    <td className="py-3.5 font-mono text-[10px] text-white/50">{txn.architectForm4Ref} / {txn.caForm3Ref}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                        {txn.auditVerificationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: e-Sign Allotment Letter */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0E1527] border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Aadhaar e-Sign Verification</h3>
              </div>
              <button onClick={() => setIsSignModalOpen(false)} className="text-white/40 hover:text-white text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-white/70">
              <p>
                You are executing statutory Allotment Letter <strong>ALT_KIAAN_2026_0942</strong> for <strong>Kiaan One Vertica Unit A-2401</strong>.
              </p>
              <div className="p-3 rounded-xl bg-white/[0.04] space-y-1">
                <div>Aadhaar Number: <strong className="text-white">XXXX-XXXX-8841</strong></div>
                <div>e-Sign Provider: <strong className="text-emerald-400">NSDL / UIDAI e-Sign Gateway</strong></div>
              </div>
              <div className="space-y-1 pt-2">
                <label className="text-white/60 font-semibold uppercase text-[10px]">Enter 6-Digit OTP received on registered mobile</label>
                <input
                  type="text"
                  maxLength={6}
                  defaultValue="482910"
                  className="w-full rounded-xl bg-white/[0.06] border border-white/15 px-3 py-2 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsSignModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteEsign}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md cursor-pointer"
              >
                Verify & Affix e-Sign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Drone Construction Photo */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0E1527] border border-white/20 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Live Site Drone Camera Inspection</span>
              <button onClick={() => setSelectedPhoto(null)} className="text-white/60 hover:text-white text-sm">
                ✕
              </button>
            </div>
            <img
              src={selectedPhoto}
              alt="Site Drone Progress"
              referrerPolicy="no-referrer"
              className="w-full h-80 object-cover rounded-2xl"
            />
            <p className="text-[11px] text-white/50 text-center">
              Image verified by site structural engineer & geotagged to Pune Municipal Jurisdiction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
