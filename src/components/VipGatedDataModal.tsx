/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sparkles,
  Phone,
  Mail,
  User,
  Building,
  ArrowRight,
} from 'lucide-react';
import { globalKiaanStore } from '../services/store';

interface VipGatedDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: (leadInfo: { name: string; phone: string; email: string }) => void;
  projectName?: string;
  targetDataName?: string;
  theme?: 'dark' | 'light';
}

export const VipGatedDataModal: React.FC<VipGatedDataModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  projectName = 'The Balmoral Riverside',
  targetDataName = 'Itemized Cost Sheet & Architectural Floor Plans',
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('Luxury Home Buyer');
  const [consentWhatsapp, setConsentWhatsapp] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Please enter a valid phone number (min 8 digits).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Save lead to store
    globalKiaanStore.submitLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      source: 'VIP_GATED_PROJECT_DATA',
      notes: `Requested confidential access to ${targetDataName} for ${projectName}. Buyer type: ${purpose}`,
    });

    // Save in localStorage for persistent session unlock
    try {
      localStorage.setItem('kiaan_contact_verified', 'true');
      localStorage.setItem('kiaan_verified_user_name', name.trim());
      localStorage.setItem('kiaan_verified_user_phone', phone.trim());
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onUnlockSuccess({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#0A101C] text-white border-amber-500/30' : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isDark ? 'bg-[#080D17] border-white/10' : 'bg-amber-50/60 border-amber-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold">
                  CONFIDENTIAL DOSSIER
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-current">
                Unlock Complete Project Data
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-current/15 hover:bg-current/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
            isDark ? 'bg-white/5 border-white/10 text-white/80' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <p className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Restricted Access: {targetDataName}</span>
            </p>
            <p className="text-[11px] opacity-75 leading-relaxed">
              To inspect statutory itemized cost breakdowns, high-resolution architectural floor plans, and certified MahaRERA Form 4 quarterly filings for <strong>{projectName}</strong>, please share your contact details.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs border ${
                    isDark ? 'bg-black/50 border-white/15 text-white' : 'bg-white border-slate-300'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                  Phone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs border ${
                      isDark ? 'bg-black/50 border-white/15 text-white' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vikram@example.com"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs border ${
                      isDark ? 'bg-black/50 border-white/15 text-white' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                Interest Profile
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs border ${
                  isDark ? 'bg-[#0d1527] border-white/15 text-white' : 'bg-white border-slate-300'
                }`}
              >
                <option value="Luxury Home Buyer">Primary Residence / Luxury End-User</option>
                <option value="NRI Investor">NRI / Global Real Estate Investor</option>
                <option value="Portfolio Allocation">Wealth Office / Portfolio Allocation</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-[11px] opacity-80 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={consentWhatsapp}
              onChange={(e) => setConsentWhatsapp(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-400"
            />
            <span>Receive verified PDF cost sheet & floor plan CAD renders via WhatsApp</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer transition-all disabled:opacity-50"
          >
            <Unlock className="w-4 h-4" />
            <span>{isSubmitting ? 'Verifying...' : 'Instant Unlock & View Confidential Data'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] opacity-60 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Privacy Guaranteed • No Unsolicited Telemarketing • Direct Sales Node</span>
          </div>
        </form>
      </div>
    </div>
  );
};
