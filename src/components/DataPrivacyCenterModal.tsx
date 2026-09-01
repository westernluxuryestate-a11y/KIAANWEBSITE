/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  X,
  FileText,
  AlertTriangle,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Eye,
  Sparkles,
} from 'lucide-react';
import { UserConsentPreferences, DataAccessExport, DataDeletionRequest } from '../types';
import { securityAndPrivacyEngine } from '../services/securityAndPrivacyEngine';

interface DataPrivacyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession?: any;
  theme?: 'dark' | 'light';
}

export const DataPrivacyCenterModal: React.FC<DataPrivacyCenterModalProps> = ({
  isOpen,
  onClose,
  userSession,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'CONSENT' | 'ACCESS' | 'DELETION' | 'POLICY'>('CONSENT');
  const [prefs, setPrefs] = useState<UserConsentPreferences>(securityAndPrivacyEngine.getConsentPreferences());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Deletion workflow state
  const [deletionEmail, setDeletionEmail] = useState(userSession?.userEmail || '');
  const [deletionSubmitted, setDeletionSubmitted] = useState<DataDeletionRequest | null>(null);

  // Data access export state
  const [exportedData, setExportedData] = useState<DataAccessExport | null>(null);

  if (!isOpen) return null;

  const handleSaveConsent = () => {
    securityAndPrivacyEngine.updateConsentPreferences(prefs);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDownloadData = () => {
    const data = securityAndPrivacyEngine.generateDataAccessExport(userSession);
    setExportedData(data);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kiaan_Data_Access_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletionEmail.trim()) return;
    const req = securityAndPrivacyEngine.submitDataDeletionRequest(deletionEmail, userSession?.userId || 'USER_CURRENT');
    setDeletionSubmitted(req);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#0B101C] text-white border-white/15' : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-current/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold">Privacy & Data Governance Center</h2>
              <p className="text-xs opacity-70">
                Digital Personal Data Protection Act (DPDPA 2023) Compliance & Consent Controls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-current/15 hover:bg-current/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-current/10 px-6 gap-2 pt-2 bg-current/5 overflow-x-auto">
          {[
            { id: 'CONSENT', label: 'Consent Preferences', icon: Lock },
            { id: 'ACCESS', label: 'Download My Data', icon: Download },
            { id: 'DELETION', label: 'Right to Be Forgotten', icon: Trash2 },
            { id: 'POLICY', label: 'DPDPA & Privacy Terms', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-4 text-xs font-bold font-mono flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6 text-xs leading-relaxed">
          {/* TAB 1: CONSENT PREFERENCES (ITEM 127) */}
          {activeTab === 'CONSENT' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold block">DPDPA 2023 Statutory Consent Framework</span>
                  <span className="text-[11px] opacity-80 block">
                    Kiaan provides granular opt-ins. Essential security cookies remain strictly enabled for tokenized transactions.
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-400">
                  {prefs.consentVersion}
                </span>
              </div>

              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="p-4 rounded-2xl border border-current/10 flex items-center justify-between">
                  <div className="space-y-1 max-w-xl">
                    <div className="font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Essential RERA & Security State (Mandatory)</span>
                    </div>
                    <p className="opacity-70 text-[11px]">
                      Required for 15-minute token reservation holds, escrow security, and authenticated session management.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                    ALWAYS ACTIVE
                  </span>
                </div>

                {/* WhatsApp Consent */}
                <div className="p-4 rounded-2xl border border-current/10 flex items-center justify-between">
                  <div className="space-y-1 max-w-xl">
                    <div className="font-bold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      <span>WhatsApp Direct Concierge & Dossier Shares</span>
                    </div>
                    <p className="opacity-70 text-[11px]">
                      Receive one-click RERA title reports, Maybach site visit chauffeur dispatch alerts, and digital offer updates.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.whatsAppConsent}
                      onChange={(e) => setPrefs({ ...prefs, whatsAppConsent: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-current/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {/* Email Consent */}
                <div className="p-4 rounded-2xl border border-current/10 flex items-center justify-between">
                  <div className="space-y-1 max-w-xl">
                    <div className="font-bold flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>Email Dossiers & Market Intelligence</span>
                    </div>
                    <p className="opacity-70 text-[11px]">
                      Quarterly price index movements, micro-market yield reports, and advocate title opinion PDFs.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.emailConsent}
                      onChange={(e) => setPrefs({ ...prefs, emailConsent: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-current/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {/* SMS Transactional */}
                <div className="p-4 rounded-2xl border border-current/10 flex items-center justify-between">
                  <div className="space-y-1 max-w-xl">
                    <div className="font-bold flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-500" />
                      <span>SMS OTP & Reservation Alerts</span>
                    </div>
                    <p className="opacity-70 text-[11px]">
                      Instant delivery of OTP tokens for digital signature and escrow allocation receipts.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.smsTransactionalConsent}
                      onChange={(e) => setPrefs({ ...prefs, smsTransactionalConsent: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-current/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {/* Marketing & First Look */}
                <div className="p-4 rounded-2xl border border-current/10 flex items-center justify-between">
                  <div className="space-y-1 max-w-xl">
                    <div className="font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Kiaan First Look™ Early-Access Marketing</span>
                    </div>
                    <p className="opacity-70 text-[11px]">
                      Priority allocation alerts for off-market developer tranches before public release.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.marketingConsent}
                      onChange={(e) => setPrefs({ ...prefs, marketingConsent: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-current/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-current/10">
                <span className="text-[11px] opacity-60 font-mono">
                  Last Updated: {new Date(prefs.lastUpdatedTimestamp).toLocaleString()}
                </span>
                <button
                  onClick={handleSaveConsent}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  {savedSuccess ? 'Consent Saved ✓' : 'Save Consent Preferences'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DATA ACCESS EXPORT (ITEM 127) */}
          {activeTab === 'ACCESS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base">Right of Access to Personal Data</h3>
                <p className="opacity-75">
                  Under Section 11 of the Digital Personal Data Protection Act 2023, you have the right to obtain a complete, machine-readable export of all personal data, saved items, submitted bids/offers, and consent logs held by Kiaan Properties.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-current/10 bg-current/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-sm block">Generate Machine-Readable JSON Dossier</span>
                    <span className="opacity-70 text-[11px] block">
                      Includes: Profile metadata, verified phone/email, scheduled Maybach visits, price offers, and audit records.
                    </span>
                  </div>
                  <button
                    onClick={handleDownloadData}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Dossier</span>
                  </button>
                </div>

                {exportedData && (
                  <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/10 text-white font-mono text-[11px] max-h-60 overflow-y-auto">
                    <pre>{JSON.stringify(exportedData, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: RIGHT TO BE FORGOTTEN / DATA DELETION (ITEM 127) */}
          {activeTab === 'DELETION' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base">Right of Correction & Erasure</h3>
                <p className="opacity-75">
                  Under Section 12 of the DPDPA 2023, you may request the deletion of your personal contact details, saved portfolio items, and direct marketing communications.
                </p>
              </div>

              {/* Statutory Retention Disclosure */}
              <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Statutory Legal & RERA Retention Requirement</span>
                </div>
                <p className="text-[11px] opacity-85 leading-relaxed">
                  In compliance with Section 14 of the Real Estate (Regulation and Development) Act 2016 and Indian Income Tax statutory rules, transaction records, escrow token hashes, and official reservation deeds must be retained in encrypted immutable cold storage for a statutory period of 7 years. All marketing, communication, and browsing data will be permanently purged immediately.
                </p>
              </div>

              {deletionSubmitted ? (
                <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Erasure Request Initiated ({deletionSubmitted.requestId})</span>
                  </div>
                  <p className="text-xs opacity-90">{deletionSubmitted.statutoryRetentionPeriodNote}</p>
                </div>
              ) : (
                <form onSubmit={handleDeleteRequest} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase opacity-70 mb-1">
                      Confirm Registered Email
                    </label>
                    <input
                      type="email"
                      required
                      value={deletionEmail}
                      onChange={(e) => setDeletionEmail(e.target.value)}
                      placeholder="client@kiaanproperties.com"
                      className={`w-full p-3 rounded-xl border text-xs outline-none ${
                        isDark ? 'bg-black/40 border-white/20 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Submit Formal Erasure Request</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: PRIVACY POLICY & STATUTORY DISCLOSURES */}
          {activeTab === 'POLICY' && (
            <div className="space-y-4 animate-fade-in opacity-85 leading-relaxed">
              <h3 className="font-serif font-bold text-base">Kiaan Properties Privacy Policy & Statutory Charter</h3>
              <p>
                Kiaan Luxury Properties Private Limited ("Kiaan", "we", "us") operates as an AI-first luxury advisory platform. We are committed to the highest standards of data security, confidentiality, and statutory compliance under the Digital Personal Data Protection Act 2023, the Information Technology Act 2000, and MahaRERA regulations.
              </p>
              <h4 className="font-bold text-xs uppercase font-mono pt-2">1. Data Minimization & Decoupled Architecture</h4>
              <p>
                In strict accordance with our security architecture (Item 122 & 124), website browsing analytics are decoupled from our internal sales CRM. Only explicit, consent-backed lead and offer submissions are transmitted through idempotent, rate-limited APIs.
              </p>
              <h4 className="font-bold text-xs uppercase font-mono pt-2">2. Tokenized Financial Information</h4>
              <p>
                Kiaan never stores raw credit card numbers, CVVs, net-banking credentials, or UPI MPINs. All reservation tokens are processed through RBI-regulated escrow gateways with AES-256 bank-grade encryption.
              </p>
              <h4 className="font-bold text-xs uppercase font-mono pt-2">3. Grievance Redressal Officer</h4>
              <p className="font-mono text-[11px]">
                Advocate Vishal Patil, Legal & Data Protection Officer<br />
                Kiaan Executive Tower, Level 14, Senapati Bapat Road, Pune 411016<br />
                Email: privacy@kiaanproperties.com • Phone: +91 20 6799 4400
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
