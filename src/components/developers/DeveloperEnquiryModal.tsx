/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Send, Phone, Mail, CheckCircle2, Building, ShieldCheck, Sparkles } from 'lucide-react';
import { Developer } from '../../types';
import { globalKiaanStore } from '../../services/store';

interface DeveloperEnquiryModalProps {
  developer: Developer;
  mode?: 'ENQUIRY' | 'CALLBACK' | 'BROCHURE' | 'UPDATES';
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const DeveloperEnquiryModal: React.FC<DeveloperEnquiryModalProps> = ({
  developer,
  mode = 'ENQUIRY',
  onClose,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredBudget, setPreferredBudget] = useState('1.5_TO_3_CR');
  const [interestedSegment, setInterestedSegment] = useState(
    developer.propertySegments?.[0] || 'Ultra-Luxury Residences'
  );
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTitle = () => {
    switch (mode) {
      case 'CALLBACK':
        return `Request Instant Callback — ${developer.name}`;
      case 'BROCHURE':
        return `Download Corporate Portfolio — ${developer.name}`;
      case 'UPDATES':
        return `Get Launch Updates & First Look — ${developer.name}`;
      default:
        return `Enquire Directly with ${developer.name}`;
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'CALLBACK':
        return 'Our senior developer relationship officer will connect with you in under 15 minutes.';
      case 'BROCHURE':
        return 'Receive certified project masterplans, architectural specifications, and audited price sheets.';
      case 'UPDATES':
        return 'Be the first to receive pre-launch pricing and private penthouse invitations before public release.';
      default:
        return `Direct relationship channel to ${developer.name} official advisory desk.`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Track engagement in store
      if (mode === 'CALLBACK') {
        globalKiaanStore.trackDeveloperEngagement(developer.id, 'phoneClicks');
      } else if (mode === 'BROCHURE') {
        globalKiaanStore.trackDeveloperEngagement(developer.id, 'brochureDownloads');
      } else {
        globalKiaanStore.trackDeveloperEngagement(developer.id, 'enquiriesCount');
      }

      globalKiaanStore.submitLead({
        name: fullName,
        phone,
        email,
        source: `DEVELOPER_PAGE_${developer.slug}_${mode}`,
        notes: `Budget: ${preferredBudget} | Segment: ${interestedSegment} | Msg: ${message}`,
      });

      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
          isDark
            ? 'bg-[#0B101B] border-white/10 text-white shadow-black/80'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-full transition-all cursor-pointer ${
            isDark ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif">
                {mode === 'BROCHURE' ? 'Portfolio Dossier Dispatched' : 'Request Confirmed'}
              </h3>
              <p className={`text-sm max-w-sm mx-auto ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                Thank you, <span className="font-semibold text-amber-400">{fullName}</span>. Your enquiry has been routed directly to <span className="font-semibold">{developer.name}</span>’s private client desk.
              </p>
            </div>
            {mode === 'BROCHURE' && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center justify-center gap-2 border ${
                  isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Download link also sent to WhatsApp & email</span>
              </div>
            )}
            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header with Developer mini-pill */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <img
                src={developer.logo}
                alt={developer.name}
                className="w-10 h-10 rounded-xl object-cover border border-white/20 bg-white/5"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {developer.name}
                </span>
                <h2 className="text-lg font-bold font-serif leading-tight">{getTitle()}</h2>
              </div>
            </div>

            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>{getSubtitle()}</p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-80">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/15 text-white focus:border-amber-400'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/15 text-white focus:border-amber-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">Email Address</label>
                  <input
                    type="email"
                    placeholder="vikram@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/15 text-white focus:border-amber-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">Target Investment Range</label>
                  <select
                    value={preferredBudget}
                    onChange={(e) => setPreferredBudget(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs border outline-none cursor-pointer ${
                      isDark ? 'bg-[#121826] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="UNDER_1.5_CR">Under ₹1.5 Cr</option>
                    <option value="1.5_TO_3_CR">₹1.5 Cr – ₹3.0 Cr</option>
                    <option value="3_TO_5_CR">₹3.0 Cr – ₹5.0 Cr</option>
                    <option value="5_TO_10_CR">₹5.0 Cr – ₹10.0 Cr</option>
                    <option value="ABOVE_10_CR">₹10.0 Cr+ (Ultra HNI)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">Property Segment</label>
                  <select
                    value={interestedSegment}
                    onChange={(e) => setInterestedSegment(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs border outline-none cursor-pointer ${
                      isDark ? 'bg-[#121826] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {developer.propertySegments?.map((seg, i) => (
                      <option key={i} value={seg}>
                        {seg}
                      </option>
                    ))}
                    <option value="OTHER">General Consultation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-80">Specific Requirements or Message</label>
                <textarea
                  rows={2}
                  placeholder="Looking for 4 BHK with river/forest view or commercial pre-lease yield details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border outline-none resize-none transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/15 text-white focus:border-amber-400'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                  }`}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {mode === 'CALLBACK'
                        ? 'Request Call Now'
                        : mode === 'BROCHURE'
                        ? 'Download Corporate Dossier'
                        : 'Submit Direct Enquiry'}
                    </span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] opacity-60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero spam guarantee • 100% confidential client protocol</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
