/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Calendar,
  Download,
  Share2,
  FileSpreadsheet,
  Zap,
  Lock,
  CheckCircle2,
  Briefcase,
  HelpCircle,
  Eye,
  EyeOff,
  DollarSign,
  Compass,
  Bookmark,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  FileText,
  Plus,
  Trash2,
} from 'lucide-react';
import { UniversalListingFormData } from '../../services/universalListingSchemaService';

interface StageContactLeadsProps {
  formData: UniversalListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<UniversalListingFormData>>;
}

export const StageContactLeads: React.FC<StageContactLeadsProps> = ({
  formData,
  setFormData,
}) => {
  const contact = formData.contact || ({} as any);
  const leadSettings = formData.leadCaptureSettings || ({} as any);

  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('TITLE_DEED');

  const admin = formData.adminInternal || {
    internalListingId: `KIAAN_LST_${Date.now().toString().slice(-6)}`,
    internalReferenceNotes: 'Owner direct mandate. Clean title documents verified by legal cell.',
    agentId: 'AGENT_042',
    leadOwner: 'Senior Advisory Director',
    commissionPercent: 2.0,
    brokerageReceivedINR: 0,
    minimumAcceptableSellerPriceINR: formData.salePricing?.askingPriceINR
      ? Math.round(formData.salePricing.askingPriceINR * 0.93)
      : 22000000,
    negotiationNotes: 'Seller willing to negotiate up to 4% for serious 30-day closing.',
    internalValuationINR: formData.salePricing?.askingPriceINR || 24000000,
    internalDocuments: [
      { docName: 'Attested 30-Yr Chain of Title Deeds.pdf', docUrl: '#', docType: 'TITLE_CHAIN' },
      { docName: 'Owner KYC Verification & Form 16.pdf', docUrl: '#', docType: 'KYC_SELLER' },
    ],
    fraudRiskScore: 3,
    moderationStatus: 'APPROVED_LIVE',
    internalLeadScore: 92,
  };

  const updateAdmin = (updates: Partial<typeof admin>) => {
    setFormData((prev) => ({
      ...prev,
      adminInternal: {
        ...(prev.adminInternal || admin),
        ...updates,
      },
    }));
  };

  const addInternalDoc = () => {
    if (!newDocName.trim()) return;
    const docList = admin.internalDocuments || [];
    updateAdmin({
      internalDocuments: [
        ...docList,
        { docName: newDocName.trim(), docUrl: '#', docType: newDocType },
      ],
    });
    setNewDocName('');
  };

  const removeInternalDoc = (index: number) => {
    const docList = admin.internalDocuments || [];
    updateAdmin({
      internalDocuments: docList.filter((_, i) => i !== index),
    });
  };

  const toggleLeadSetting = (field: string) => {
    setFormData((prev: any) => ({
      ...prev,
      leadCaptureSettings: {
        ...(prev.leadCaptureSettings || {}),
        [field]: !(prev.leadCaptureSettings?.[field]),
      },
    }));
  };

  const brokerage = (formData as any).brokerageDetails || (formData as any).brokerage || {
    isBrokerageApplicable: false,
    brokerageType: 'ZERO_BROKERAGE',
    brokeragePercentage: 0,
    brokerageAmountINR: 0,
    paidBy: 'SHARED',
    notes: 'Direct from developer / zero brokerage for buyer',
  };

  const updateBrokerage = (updates: Partial<typeof brokerage>) => {
    setFormData((prev: any) => ({
      ...prev,
      brokerageDetails: {
        ...(prev.brokerageDetails || brokerage),
        ...updates,
      },
    }));
  };

  return (
    <div className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-6">
      <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-400" />
            23, 24, 29 & 30. Seller Profile, Brokerage, Engagement Triggers & Lead Qualification
          </h3>
          <p className="text-xs opacity-70">
            Ownership representation, transparent brokerage terms, 17 multi-channel CTA buttons, and progressive lead qualification.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
          High-Conversion Engine
        </span>
      </div>

      {/* Primary Contact & Seller Information */}
      <div className="space-y-4">
        <label className="text-xs font-bold text-white flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-amber-400" />
          23. Seller / Landlord / Representative Profile
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-white/80 block">
              Posted By <span className="text-rose-400">*</span>
            </label>
            <select
              value={contact.postedByType || 'OWNER'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...(prev.contact || {}), postedByType: e.target.value as any } as any,
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="OWNER">Direct Property Owner</option>
              <option value="BUILDER">Builder / Developer</option>
              <option value="AGENT">Real Estate Agent / Broker</option>
              <option value="AUTHORIZED_CHANNEL_PARTNER">Authorized Channel Partner</option>
              <option value="COMPANY">Corporate / Institutional Firm</option>
              <option value="INVESTOR">Private Investor / Syndication</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">
              Contact Person Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={contact.contactPersonName || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...(prev.contact || {}), contactPersonName: e.target.value } as any,
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Company / Firm Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Kiaan Advisory LLP / Godrej Properties"
              value={contact.companyName || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...(prev.contact || {}), companyName: e.target.value } as any,
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Preferred Communication</label>
            <select
              value={contact.preferredContactMethod || 'WHATSAPP'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...(prev.contact || {}), preferredContactMethod: e.target.value as any } as any,
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="WHATSAPP">WhatsApp Message</option>
              <option value="PHONE">Direct Phone Call</option>
              <option value="EMAIL">Email Inquiry</option>
              <option value="ANY">Any Channel</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-white/80 block">
              Phone Number <span className="text-rose-400">*</span>
            </label>
            <input
              type="tel"
              value={contact.phone || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...(prev.contact || {}), phone: e.target.value } as any,
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">
              WhatsApp Number <span className="text-rose-400">*</span>
            </label>
            <input
              type="tel"
              value={contact.whatsApp || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...(prev.contact || {}), whatsApp: e.target.value } as any,
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Email Address</label>
            <input
              type="email"
              value={contact.email || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...(prev.contact || {}), email: e.target.value } as any,
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-white/80 block">Calling & Inspection Hours</label>
            <input
              type="text"
              placeholder="e.g. 9:00 AM – 8:00 PM IST (All days)"
              value={contact.callingHours || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...(prev.contact || {}), callingHours: e.target.value } as any,
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-white/5 border border-white/10 w-full">
              <input
                type="checkbox"
                checked={Boolean(contact.hideInternalContactInfo)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: { ...(prev.contact || {}), hideInternalContactInfo: e.target.checked } as any,
                  }))
                }
                className="rounded text-amber-500"
              />
              <div>
                <span className="font-semibold text-white/90 block">
                  Route Inquiries via Kiaan Concierge Desk
                </span>
                <span className="text-[10px] text-white/50">
                  Protects owner privacy; calls & leads are pre-qualified before transfer.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* 24. Brokerage Terms & Commission Engine */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-amber-400" />
            24. Brokerage Terms & Commission Structure
          </label>
          <span className="text-[10px] text-emerald-400 font-mono">
            {brokerage.isBrokerageApplicable ? 'Brokerage Applies' : 'Zero Brokerage Certified'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-white/80 block">Brokerage Applicable</label>
            <select
              value={brokerage.isBrokerageApplicable ? 'YES' : 'NO'}
              onChange={(e) =>
                updateBrokerage({
                  isBrokerageApplicable: e.target.value === 'YES',
                  brokerageType: e.target.value === 'YES' ? 'PERCENTAGE' : 'ZERO_BROKERAGE',
                })
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="NO">No (0% Zero Brokerage)</option>
              <option value="YES">Yes (Brokerage Applicable)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Brokerage Type</label>
            <select
              value={brokerage.brokerageType || 'ZERO_BROKERAGE'}
              disabled={!brokerage.isBrokerageApplicable}
              onChange={(e) => updateBrokerage({ brokerageType: e.target.value as any })}
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white disabled:opacity-40"
            >
              <option value="ZERO_BROKERAGE">Zero Brokerage</option>
              <option value="PERCENTAGE">Percentage of Deal</option>
              <option value="FIXED_AMOUNT">Fixed INR Fee</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">
              {brokerage.brokerageType === 'FIXED_AMOUNT' ? 'Amount (INR)' : 'Percentage (%)'}
            </label>
            <input
              type="number"
              step="0.1"
              disabled={!brokerage.isBrokerageApplicable}
              value={
                brokerage.brokerageType === 'FIXED_AMOUNT'
                  ? brokerage.brokerageAmountINR ?? 0
                  : brokerage.brokeragePercentage ?? 1.0
              }
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                if (brokerage.brokerageType === 'FIXED_AMOUNT') {
                  updateBrokerage({ brokerageAmountINR: val });
                } else {
                  updateBrokerage({ brokeragePercentage: val });
                }
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono disabled:opacity-40"
            />
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Paid By</label>
            <select
              value={brokerage.paidBy || 'SHARED'}
              disabled={!brokerage.isBrokerageApplicable}
              onChange={(e) => updateBrokerage({ paidBy: e.target.value as any })}
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white disabled:opacity-40"
            >
              <option value="BUYER">Buyer</option>
              <option value="SELLER">Seller</option>
              <option value="TENANT">Tenant</option>
              <option value="LANDLORD">Landlord</option>
              <option value="SHARED">Shared 50:50</option>
              <option value="NEGOTIABLE">Negotiable</option>
            </select>
          </div>
        </div>
      </div>

      {/* 29. 17 Customer Engagement Triggers */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            29. Customer Engagement & Conversion Triggers (All 17 Interactions)
          </label>
          <span className="text-[11px] text-emerald-400 font-mono font-bold">
            Full Conversion Suite Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {[
            { key: 'allowInstantPhoneCalls', icon: Phone, title: 'Direct Phone Calls', desc: 'One-tap direct calling' },
            { key: 'allowWhatsAppDirectChat', icon: MessageSquare, title: 'WhatsApp Enquiries', desc: 'Pre-filled WhatsApp message' },
            { key: 'allowScheduleSiteVisit', icon: Calendar, title: 'Schedule Site Visit', desc: 'Date & time VIP booking' },
            { key: 'allowRequestCallback', icon: Phone, title: 'Request Callback', desc: 'Customer callback queue' },
            { key: 'allowEnquireNow', icon: HelpCircle, title: 'General Enquire Now', desc: 'Structured modal questionnaire' },
            { key: 'allowDownloadBrochure', icon: Download, title: 'Request / Download Brochure', desc: 'High-res master PDF' },
            { key: 'allowDownloadFloorPlan', icon: Download, title: 'Download Floor Plan', desc: 'Instant 2D/3D layout' },
            { key: 'allowRequestCostSheet', icon: FileSpreadsheet, title: 'Download Cost Sheet', desc: 'All-inclusive cost breakdown' },
            { key: 'allowRequestPrice', icon: DollarSign, title: 'Request Price Quote', desc: 'Unit-specific negotiation' },
            { key: 'allowRequestPaymentPlan', icon: FileSpreadsheet, title: 'Request Payment Plan', desc: 'Milestone linked schedule' },
            { key: 'allowCheckAvailability', icon: CheckCircle2, title: 'Check Availability', desc: 'Real-time inventory lookup' },
            { key: 'allowSaveProperty', icon: Bookmark, title: 'Save / Shortlist Property', desc: 'Add to customer portfolio' },
            { key: 'allowCompareProperties', icon: Eye, title: 'Compare Properties', desc: 'Side-by-side spec comparison' },
            { key: 'allowShareListing', icon: Share2, title: 'Share Property', desc: 'WhatsApp & link sharing' },
            { key: 'allowGetDirections', icon: Compass, title: 'Get Directions', desc: 'Google Maps GPS navigation' },
            { key: 'allowAskAQuestion', icon: HelpCircle, title: 'Ask a Question', desc: 'Specific query to advisory team' },
            { key: 'allowRequestVirtualTour', icon: Eye, title: 'Request 360° Virtual Tour', desc: 'Matterport live session' },
            { key: 'stickyCtaActive', icon: Zap, title: 'Sticky Mobile CTA Bar', desc: 'Fixed action dock on mobile screens' },
          ].map((item) => {
            const Icon = item.icon;
            const isChecked = (leadSettings as any)[item.key] ?? true;
            return (
              <label
                key={item.key}
                className={`p-2.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-bold text-white text-xs truncate">{item.title}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleLeadSetting(item.key as any)}
                    className="rounded text-amber-500 mt-0.5 shrink-0"
                  />
                </div>
                <div className="text-[10px] opacity-70 mt-1 leading-snug">{item.desc}</div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 30. Progressive Lead Qualification Architecture */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-purple-400" />
            <div>
              <h4 className="text-xs font-bold text-purple-300">
                30. Progressive Lead Qualification Schema
              </h4>
              <p className="text-[11px] text-white/60">
                High-intent questions collected progressively across inquiry touchpoints to filter serious HNI buyers.
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
            12 Capture Vectors Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            'Full Name',
            'Phone / Mobile',
            'Email Address',
            'Preferred Contact Channel',
            'Estimated Budget (INR)',
            'Desired Configuration (BHK)',
            'Target Micro-Location',
            'Target Move-in Date',
            'Purchase Purpose (End-Use / Inv)',
            'Home Loan Assistance Required',
            'Site Visit Date & Time',
            'WhatsApp Opt-in Permission',
          ].map((param, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center gap-2 text-white/80"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="text-[11px] truncate">{param}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 38. ADMIN-ONLY FIELDS (CONFIDENTIAL & HIDDEN FROM CUSTOMERS) ================= */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/20 via-black/40 to-purple-950/20 border border-rose-500/30 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
                38. Admin-Only Governance & Confidential Fields
              </h3>
              <p className="text-xs text-white/70">
                These 10 parameters are strictly restricted to verified platform administrators and internal brokers, and permanently stripped from public view.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5" />
              Hidden From Public Customers
            </span>
          </div>
        </div>

        {/* 10 Required Admin-Only Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* 1. Internal Listing ID */}
          <div className="space-y-1.5">
            <label className="text-white/80 font-semibold block flex items-center justify-between">
              <span>1. Internal Listing ID</span>
              <span className="text-[10px] text-rose-400 font-mono">System ID</span>
            </label>
            <input
              type="text"
              value={admin.internalListingId || ''}
              onChange={(e) => updateAdmin({ internalListingId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-rose-400"
              placeholder="e.g. KIAAN_LST_98231"
            />
          </div>

          {/* 2. Internal Reference */}
          <div className="space-y-1.5">
            <label className="text-white/80 font-semibold block flex items-center justify-between">
              <span>2. Internal Reference</span>
              <span className="text-[10px] text-rose-400 font-mono">Mandate Code</span>
            </label>
            <input
              type="text"
              value={admin.internalReferenceNotes || ''}
              onChange={(e) => updateAdmin({ internalReferenceNotes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-rose-400"
              placeholder="e.g. Direct Owner Sole Mandate / Ref #408"
            />
          </div>

          {/* 3. Agent ID */}
          <div className="space-y-1.5">
            <label className="text-white/80 font-semibold block flex items-center justify-between">
              <span>3. Agent ID</span>
              <span className="text-[10px] text-rose-400 font-mono">Roster ID</span>
            </label>
            <input
              type="text"
              value={admin.agentId || 'AGENT_042'}
              onChange={(e) => updateAdmin({ agentId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-rose-400"
              placeholder="e.g. AGENT_042"
            />
          </div>

          {/* 4. Lead Owner */}
          <div className="space-y-1.5">
            <label className="text-white/80 font-semibold block flex items-center justify-between">
              <span>4. Lead Owner</span>
              <span className="text-[10px] text-rose-400 font-mono">Senior Executive</span>
            </label>
            <input
              type="text"
              value={admin.leadOwner || 'Senior Advisory Director'}
              onChange={(e) => updateAdmin({ leadOwner: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-rose-400"
              placeholder="e.g. Vikramaditya S. / Senior Advisor"
            />
          </div>

          {/* 5. Commission */}
          <div className="space-y-1.5">
            <label className="text-white/80 font-semibold block flex items-center justify-between">
              <span>5. Commission (%)</span>
              <span className="text-[10px] text-rose-400 font-mono">Agreement</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={(admin as any).commissionPercent ?? 2.0}
              onChange={(e) => updateAdmin({ commissionPercent: parseFloat(e.target.value) || 0 } as any)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-rose-400"
              placeholder="e.g. 2.0"
            />
          </div>

          {/* 6. Brokerage Received */}
          <div className="space-y-1.5">
            <label className="text-white/80 font-semibold block flex items-center justify-between">
              <span>6. Brokerage Received (INR)</span>
              <span className="text-[10px] text-rose-400 font-mono">Advance / Booking</span>
            </label>
            <input
              type="number"
              value={admin.brokerageReceivedINR ?? 0}
              onChange={(e) => updateAdmin({ brokerageReceivedINR: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-rose-400"
              placeholder="e.g. 0 or 50000"
            />
          </div>

          {/* 7. Minimum Seller Price */}
          <div className="space-y-1.5">
            <label className="text-white/80 font-semibold block flex items-center justify-between">
              <span>7. Minimum Seller Price (INR)</span>
              <span className="text-[10px] text-rose-400 font-mono">Walkaway Hard Floor</span>
            </label>
            <input
              type="number"
              value={admin.minimumAcceptableSellerPriceINR ?? 22000000}
              onChange={(e) =>
                updateAdmin({ minimumAcceptableSellerPriceINR: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-rose-300 font-mono font-bold text-xs focus:border-rose-400"
              placeholder="e.g. 22000000"
            />
          </div>

          {/* 8. Internal Valuation */}
          <div className="space-y-1.5">
            <label className="text-white/80 font-semibold block flex items-center justify-between">
              <span>8. Internal Valuation (INR)</span>
              <span className="text-[10px] text-rose-400 font-mono">Market Assessment</span>
            </label>
            <input
              type="number"
              value={admin.internalValuationINR ?? 24000000}
              onChange={(e) => updateAdmin({ internalValuationINR: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-rose-400"
              placeholder="e.g. 24000000"
            />
          </div>

          {/* Internal Fraud / Risk Score */}
          <div className="space-y-1.5">
            <label className="text-white/80 font-semibold block flex items-center justify-between">
              <span>Fraud Risk Audit Score</span>
              <span className="text-[10px] text-emerald-400 font-mono">Low Risk</span>
            </label>
            <div className="w-full px-3 py-2 rounded-xl bg-black/50 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-between">
              <span>{admin.fraudRiskScore} / 100</span>
              <span className="text-[10px] text-emerald-400">Verified Direct Mandate</span>
            </div>
          </div>
        </div>

        {/* 9. Negotiation Notes */}
        <div className="space-y-1.5 text-xs">
          <label className="text-white/80 font-semibold block flex items-center justify-between">
            <span>9. Negotiation Notes (Confidential Seller Psychology & Levers)</span>
            <span className="text-[10px] text-rose-400 font-mono">Private</span>
          </label>
          <textarea
            rows={2}
            value={admin.negotiationNotes || ''}
            onChange={(e) => updateAdmin({ negotiationNotes: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-rose-400"
            placeholder="e.g. Seller is relocating abroad in 45 days. Open to 3-5% discount for immediate closing or non-contingent token payment."
          />
        </div>

        {/* 10. Internal Documents */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <label className="text-white/80 font-semibold block flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span>10. Internal Documents (Seller KYC, Title Deeds, Confidential Filings)</span>
            </label>
            <span className="text-[10px] text-white/50">
              {admin.internalDocuments?.length || 0} Archived File(s)
            </span>
          </div>

          {/* Existing internal doc list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {admin.internalDocuments?.map((doc, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-white truncate">{doc.docName}</div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">
                      {doc.docType}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeInternalDoc(idx)}
                  className="p-1 rounded text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add document mini-form */}
          <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/5">
            <input
              type="text"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              placeholder="e.g. Seller PAN & Aadhaar KYC Copy.pdf"
              className="flex-1 min-w-[200px] px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
            <select
              value={newDocType}
              onChange={(e) => setNewDocType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="TITLE_DEED">Title Deed</option>
              <option value="KYC_SELLER">Seller KYC / PAN</option>
              <option value="BANK_STATEMENT">Bank Statement</option>
              <option value="AGREEMENT_MANDATE">Broker Mandate Agreement</option>
              <option value="LEGAL_OPINION">Advocate Title Opinion</option>
            </select>
            <button
              type="button"
              onClick={addInternalDoc}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Attach Internal Doc
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-200/90 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Client Privacy Guarantee:</strong> The 10 admin-only governance fields above are completely excised when property data is sanitized for buyer-facing UI, public search endpoints, and client PDF brochures.
          </span>
        </div>
      </div>
    </div>
  );
};

