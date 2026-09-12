/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  FileCheck,
  CheckCircle2,
  Lock,
  Eye,
  FileText,
  AlertTriangle,
  Plus,
  Trash2,
} from 'lucide-react';
import { UniversalListingFormData } from '../../services/universalListingSchemaService';

interface StageLegalDocsProps {
  formData: UniversalListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<UniversalListingFormData>>;
}

export const StageLegalDocs: React.FC<StageLegalDocsProps> = ({
  formData,
  setFormData,
}) => {
  const docs = formData.legalDocumentation || ({} as any);
  const [newInternalDocName, setNewInternalDocName] = useState('');
  const [newInternalDocCategory, setNewInternalDocCategory] = useState('TITLE_DEED');

  const toggleDoc = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      legalDocumentation: {
        ...(prev.legalDocumentation || {}),
        [field]: !(prev.legalDocumentation as any)?.[field],
      } as any,
    }));
  };

  const addInternalDoc = () => {
    if (!newInternalDocName.trim()) return;
    const newDoc = {
      docId: `DOC-${Date.now().toString(36).toUpperCase()}`,
      docName: newInternalDocName.trim(),
      category: newInternalDocCategory,
      fileNumber: `REG-${Math.floor(10000 + Math.random() * 90000)}`,
      verificationNotes: 'Archived for internal legal counsel audit',
      isConfidential: true,
      uploadedAt: new Date().toISOString(),
    };

    setFormData((prev) => ({
      ...prev,
      legalDocumentation: {
        ...(prev.legalDocumentation || {}),
        privateInternalDocCount: ((prev.legalDocumentation?.privateInternalDocCount) || 0) + 1,
        privateInternalDocuments: [
          ...(prev.legalDocumentation?.privateInternalDocuments || []),
          newDoc,
        ],
      } as any,
    }));
    setNewInternalDocName('');
  };

  const removeInternalDoc = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      legalDocumentation: {
        ...(prev.legalDocumentation || {}),
        privateInternalDocCount: Math.max(0, ((prev.legalDocumentation?.privateInternalDocCount) || 1) - 1),
        privateInternalDocuments: (prev.legalDocumentation?.privateInternalDocuments || []).filter(
          (d) => d.docId !== docId
        ),
      } as any,
    }));
  };

  const legalItems = [
    { key: 'ownershipVerification', label: 'Ownership Verification', badge: 'Ownership' },
    { key: 'titleClearAndMarketable', label: 'Clear & Marketable Title Deed', badge: 'Critical' },
    { key: 'saleDeedAvailable', label: 'Registered Sale Deed Available', badge: 'Ownership' },
    { key: 'motherDeedAvailable', label: 'Mother Deed / Chain of Title', badge: 'History' },
    { key: 'encumbranceCertificateAvailable', label: 'Encumbrance Certificate (Nil EC)', badge: 'Clean' },
    { key: 'propertyTaxReceiptsUpdated', label: 'Updated Property Tax Paid Receipts', badge: 'Tax' },
    { key: 'mutationCertificateAvailable', label: 'Mutation Certificate / Extract', badge: 'Revenue' },
    { key: 'sevenTwelveExtractAvailable', label: '7/12 Extract (Land / Plots)', badge: 'Land' },
    { key: 'propertyCardAvailable', label: 'City Survey Property Card', badge: 'Urban Land' },
    { key: 'naOrderAvailable', label: 'Non-Agricultural (NA) Order Sanctioned', badge: 'Land' },
    { key: 'conversionCertificateAvailable', label: 'Land Conversion Certificate', badge: 'Zoning' },
    { key: 'buildingApprovalAvailable', label: 'Sanctioned Building Plan Approval', badge: 'Municipal' },
    { key: 'layoutApprovalAvailable', label: 'Sanctioned Layout / Sub-Division Approval', badge: 'Layout' },
    { key: 'commencementCertificateAvailable', label: 'Commencement Certificate (CC)', badge: 'Approval' },
    { key: 'occupancyCertificateAvailable', label: 'Occupancy Certificate (OC)', badge: 'Ready' },
    { key: 'completionCertificateAvailable', label: 'Building Completion Certificate', badge: 'Sanction' },
    { key: 'fireNocAvailable', label: 'Fire Department NOC Sanctioned', badge: 'Safety' },
    { key: 'environmentalClearanceAvailable', label: 'Environmental Clearance (MOEF)', badge: 'Green' },
    { key: 'societyNocAvailable', label: 'Society NOC / Transfer Consent', badge: 'Transfer' },
    { key: 'bankNocAvailable', label: 'Bank NOC / No Dues Certificate', badge: 'Financial' },
    { key: 'legalVerificationReportAvailable', label: 'Independent Legal Search & Audit Report', badge: 'Advocate' },
  ];

  return (
    <div className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-6">
      <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            20. Legal Title, Sanctions & Comprehensive Documentation Audit
          </h3>
          <p className="text-xs opacity-70">
            25 verification parameters: Title clarity, Khata, statutory sanctions, litigation disclosures, and separated private archival.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
            Public Status: {docs.publicVerificationStatus || 'SELF_ATTESTED'}
          </span>
        </div>
      </div>

      {/* MahaRERA Number & Direct Verification Link */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-400" />
            MahaRERA Project / Agent Registration Number
          </label>
          <a
            href="https://maharera.mahaonline.gov.in"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-2"
          >
            <span>Verify on Official MahaRERA Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="e.g. P52100039201"
              value={formData.building?.reraNumber || (formData as any).projectOverview?.reraNumber || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  building: { ...(prev.building || {}), reraNumber: e.target.value } as any,
                  ...((prev as any).projectOverview
                    ? { projectOverview: { ...(prev as any).projectOverview, reraNumber: e.target.value } }
                    : {}),
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-400"
            />
          </div>
          <label className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer text-xs text-white/90">
            <input
              type="checkbox"
              checked={docs.reraApproved || false}
              onChange={() => toggleDoc('reraApproved')}
              className="rounded text-amber-500"
            />
            <span className="font-semibold">RERA Registered Project</span>
          </label>
        </div>
      </div>

      {/* Revenue & Loan Classification Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
        <div className="space-y-1">
          <label className="text-white/80 block">Khata / Revenue Record Type</label>
          <select
            value={docs.khataCertificateType || 'NOT_APPLICABLE'}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                legalDocumentation: {
                  ...(prev.legalDocumentation || {}),
                  khataCertificateType: e.target.value as any,
                } as any,
              }))
            }
            className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
          >
            <option value="A_KHATA">A-Khata (Clear Municipal Title)</option>
            <option value="B_KHATA">B-Khata (Revenue Jurisdiction)</option>
            <option value="E_KHATA">E-Khata (Electronic Municipal)</option>
            <option value="NOT_APPLICABLE">Not Applicable (PMC / PCMC / 7-12)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-white/80 block">Existing Loan / Mortgages</label>
          <select
            value={docs.loanStatus || 'CLEAR_NO_LOAN'}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                legalDocumentation: {
                  ...(prev.legalDocumentation || {}),
                  loanStatus: e.target.value as any,
                } as any,
              }))
            }
            className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
          >
            <option value="CLEAR_NO_LOAN">Clear Title (Zero Bank Loans)</option>
            <option value="ACTIVE_LOAN_WITH_NOC">Active Loan with Bank NOC Ready</option>
            <option value="LOAN_IN_PROCESS">Loan Closure in Progress</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-white/80 block">Public Verification Badge</label>
          <select
            value={docs.publicVerificationStatus || 'SELF_ATTESTED'}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                legalDocumentation: {
                  ...(prev.legalDocumentation || {}),
                  publicVerificationStatus: e.target.value as any,
                } as any,
              }))
            }
            className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
          >
            <option value="FULLY_VERIFIED">Fully Verified by Legal Team</option>
            <option value="SELF_ATTESTED">Self-Attested by Owner/Broker</option>
            <option value="UNDER_AUDIT">Under Audit / Verification</option>
          </select>
        </div>
      </div>

      {/* Statutory Documentation Checklist (25 parameters) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-white/90 block">
            Statutory Deeds & Clearances Verification Checklist
          </label>
          <span className="text-[10px] text-white/50">
            {legalItems.filter((i) => !!(docs as any)[i.key]).length} of {legalItems.length} verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {legalItems.map((item) => {
            const isChecked = !!(docs as any)[item.key];
            return (
              <label
                key={item.key}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleDoc(item.key as any)}
                    className="rounded text-emerald-500 shrink-0"
                  />
                  <span className="font-medium text-white/90 truncate">{item.label}</span>
                </div>
                <span className="text-[9px] uppercase font-bold text-white/40 shrink-0 ml-1">
                  {item.badge}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Litigation Free Guarantee & Disclosures */}
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-300">
                Litigation-Free Warranty & Clear Dispute Clearance
              </div>
              <div className="text-[11px] text-white/70">
                Owner/Seller warrants asset is free from injunctions, partition claims, or title disputes.
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
            <input
              type="checkbox"
              checked={docs.isLitigationFree}
              onChange={() => toggleDoc('isLitigationFree')}
              className="rounded text-emerald-500"
            />
            <span>Confirmed Litigation Free</span>
          </label>
        </div>

        {!docs.isLitigationFree && (
          <div className="pt-2">
            <label className="text-[11px] text-amber-300 font-semibold block mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Litigation / Dispute Disclosures (Required for complete transparency)
            </label>
            <textarea
              rows={2}
              value={docs.litigationDisclosures || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  legalDocumentation: {
                    ...(prev.legalDocumentation || {}),
                    litigationDisclosures: e.target.value,
                  } as any,
                }))
              }
              placeholder="Disclose any pending tribunal, court case, or pending society NOC requirements..."
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-400/30 text-xs text-white"
            />
          </div>
        )}
      </div>

      {/* ================= PRIVATE INTERNAL DOCUMENTS (STRICTLY SEPARATED) ================= */}
      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            <div>
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                Private Internal Document Vault (Staff & Advocate Audit Only)
              </h4>
              <p className="text-[11px] text-white/60">
                These documents are strictly confidential and NEVER rendered publicly to buyers or tenants.
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono flex items-center gap-1">
            <Eye className="w-3 h-3 text-blue-400" />
            Internal Only ({docs.privateInternalDocuments?.length || docs.privateInternalDocCount || 0})
          </span>
        </div>

        {/* Existing internal docs */}
        {docs.privateInternalDocuments && docs.privateInternalDocuments.length > 0 && (
          <div className="space-y-2">
            {docs.privateInternalDocuments.map((doc) => (
              <div
                key={doc.docId}
                className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs text-white"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold text-white/90 mr-2">{doc.docName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono">
                      {doc.category}
                    </span>
                    {doc.fileNumber && (
                      <span className="text-[10px] text-white/40 ml-2">#{doc.fileNumber}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Confidential
                  </span>
                  <button
                    type="button"
                    onClick={() => removeInternalDoc(doc.docId)}
                    className="text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add internal document */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Document Name (e.g., Original Deed Vol 42, Power of Attorney Scan)"
            value={newInternalDocName}
            onChange={(e) => setNewInternalDocName(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
          />
          <select
            value={newInternalDocCategory}
            onChange={(e) => setNewInternalDocCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
          >
            <option value="TITLE_DEED">Title Deed</option>
            <option value="IDENTITY_KYC">Owner KYC / PAN</option>
            <option value="TAX_CHALLAN">Tax Paid Challan</option>
            <option value="BANK_SANCTION">Bank Sanction Letter</option>
            <option value="POWER_OF_ATTORNEY">Power of Attorney (PoA)</option>
            <option value="ADVOCATE_OPINION">Title Search Certificate</option>
          </select>
          <button
            type="button"
            onClick={addInternalDoc}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Archive Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};

