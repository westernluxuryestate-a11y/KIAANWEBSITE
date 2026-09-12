/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Sparkles,
  Building2,
  Home,
  FileSpreadsheet,
  Mic,
  ChevronRight,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  theme?: 'dark' | 'light';
  onOpenWhatsAppOnboarding: (mode: 'PROPERTY' | 'PROJECT') => void;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  theme = 'dark',
  onOpenWhatsAppOnboarding,
}) => {
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissedCallout, setHasDismissedCallout] = useState(false);

  const getWhatsAppDeepLink = (textMsg: string) => {
    const encoded = encodeURIComponent(textMsg);
    return `https://wa.me/917796655556?text=${encoded}`;
  };

  return (
    <div
      id="floating-whatsapp-trigger"
      className="fixed bottom-6 left-20 sm:left-24 z-40 flex flex-col items-start gap-2.5 select-none pointer-events-auto"
    >
      {/* Expanded Quick Action Popover */}
      {isOpen && (
        <div
          className={`w-80 sm:w-88 rounded-3xl p-4.5 border shadow-2xl backdrop-blur-2xl mb-1 transition-all duration-300 transform scale-100 opacity-100 ${
            isDark
              ? 'bg-[#060D17]/95 border-emerald-500/30 text-white shadow-black/60'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] dark:border-white/[0.08] border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                <Phone className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif font-bold text-sm tracking-wide">Kiaan WhatsApp Listing</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-emerald-400 font-medium">+91 77966 55556 • 24/7 Listing Desk</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl opacity-60 hover:opacity-100 hover:bg-current/10 transition-all cursor-pointer"
              aria-label="Close WhatsApp menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Value Prop Badge */}
          <div className="mt-3 px-3 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-[11px] text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Zero tedious forms — send text, voice notes, photos, or RERA PDFs directly.</span>
          </div>

          {/* Quick Onboarding Paths */}
          <div className="mt-3 space-y-1.5">
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400/80 px-1">
              Start Onboarding
            </p>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenWhatsAppOnboarding('PROPERTY');
              }}
              className={`w-full text-left p-2.5 rounded-2xl border text-xs flex items-center justify-between transition-all group cursor-pointer ${
                isDark
                  ? 'bg-white/[0.03] border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-white/90'
                  : 'bg-slate-50 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/70 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Home className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11.5px] font-bold block truncate group-hover:text-emerald-400">
                    List Resale / Rental Asset
                  </span>
                  <span className="text-[10px] opacity-60 block truncate">
                    Natural text, Hindi/English voice note, photos
                  </span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-400 shrink-0" />
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenWhatsAppOnboarding('PROJECT');
              }}
              className={`w-full text-left p-2.5 rounded-2xl border text-xs flex items-center justify-between transition-all group cursor-pointer ${
                isDark
                  ? 'bg-white/[0.03] border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-white/90'
                  : 'bg-slate-50 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/70 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11.5px] font-bold block truncate group-hover:text-emerald-400">
                    Developer Master Project
                  </span>
                  <span className="text-[10px] opacity-60 block truncate">
                    MahaRERA sanction PDF & bulk CSV inventory
                  </span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-400 shrink-0" />
            </button>
          </div>

          {/* External WhatsApp Trigger Button */}
          <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center gap-2">
            <a
              href={getWhatsAppDeepLink('Hi Kiaan, I want to onboard my property / project.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Open in WhatsApp App</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenWhatsAppOnboarding('PROPERTY');
              }}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-current transition-all cursor-pointer"
            >
              In-App Simulator
            </button>
          </div>
        </div>
      )}

      {/* Floating Teaser Tag (When Collapsed) */}
      {!isOpen && !hasDismissedCallout && (
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-xl animate-fade-in ${
            isDark
              ? 'bg-[#060D17]/90 border-emerald-500/30 text-white'
              : 'bg-white/95 border-slate-200 text-slate-800'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <button
            onClick={() => setIsOpen(true)}
            className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Connect on WhatsApp</span>
            <span className="text-[10px] opacity-60 text-current">• List Inventory</span>
          </button>
          <button
            onClick={() => setHasDismissedCallout(true)}
            className="opacity-50 hover:opacity-100 p-0.5 ml-1 cursor-pointer"
            title="Dismiss hint"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/40"
        aria-label="Connect on WhatsApp"
      >
        <div className="relative">
          <Phone className="w-5 h-5 fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-emerald-600"></span>
        </div>
        <span className="text-xs tracking-wide hidden sm:inline-block font-sans">
          Connect on WhatsApp
        </span>
      </button>
    </div>
  );
};
