/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Share2,
  Copy,
  CheckCircle2,
  Mail,
  Send,
  Sparkles,
  QrCode,
  X,
  ExternalLink,
  Smartphone,
  Globe,
} from 'lucide-react';
import { ShareEntityType, SharePackage, ShareablePropertyCardData } from '../types';
import { createSharePackage, executeShare } from '../services/shareEngineService';

interface ShareEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: ShareEntityType;
  entityId: string;
  title: string;
  subtitle: string;
  priceINR: number;
  locationName: string;
  configuration: string;
  matchScorePercent?: number;
  heroImageUrl: string;
  deepLinkPath: string;
  theme?: 'dark' | 'light';
}

export const ShareEngineModal: React.FC<ShareEngineModalProps> = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  title,
  subtitle,
  priceINR,
  locationName,
  configuration,
  matchScorePercent = 94,
  heroImageUrl,
  deepLinkPath,
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'CARD' | 'WHATSAPP' | 'EMAIL' | 'LINK'>('CARD');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const { sharePackage, cardData } = createSharePackage({
    entityType,
    entityId,
    title,
    subtitle,
    priceINR,
    locationName,
    configuration,
    matchScorePercent,
    heroImageUrl,
    deepLinkPath,
  });

  const handleShareAction = async (
    channel: 'WHATSAPP' | 'EMAIL' | 'NATIVE_OR_CLIPBOARD' | 'TWITTER' | 'LINKEDIN'
  ) => {
    const result = await executeShare(sharePackage, channel);
    if (result.message) {
      setToastMessage(result.message);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        className={`w-full max-w-xl rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-[#080D1A] border-amber-500/30 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* HEADER */}
        <div className="p-5 border-b border-current/10 flex items-center justify-between flex-shrink-0 bg-current/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">Share Luxury Asset</h2>
              <p className="text-xs opacity-60">Generate shareable card, WhatsApp preview, or copy direct link</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-current/10 opacity-60 hover:opacity-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOAST ALERT */}
        {toastMessage && (
          <div className="bg-amber-500 text-black text-xs font-bold py-1.5 px-4 text-center animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TABS */}
        <div className="flex border-b border-current/10 p-2 gap-1 bg-current/[0.02]">
          {[
            { key: 'CARD', label: 'Shareable Card (Item 100)', icon: Sparkles },
            { key: 'WHATSAPP', label: 'WhatsApp', icon: Smartphone },
            { key: 'EMAIL', label: 'Email Brief', icon: Mail },
            { key: 'LINK', label: 'Direct Link', icon: Globe },
          ].map((tab) => {
            const isSelected = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-md'
                    : isDark
                    ? 'hover:bg-white/5 text-white/70'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB BODY */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
          {/* TAB 1: ITEM 100 SHAREABLE PROPERTY CARD */}
          {activeTab === 'CARD' && (
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block">
                Visual Shareable Card Preview:
              </span>

              {/* BRANDED SHAREABLE PROPERTY CARD */}
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl bg-[#090E1B] text-white p-5 group">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-black flex items-center justify-center font-serif font-black text-xs">
                      K
                    </div>
                    <span className="text-xs font-serif font-bold tracking-wider text-amber-400">
                      {cardData.appName} Estates
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    ⭐ {cardData.matchScore}% Match
                  </span>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-white/10">
                  <img
                    src={cardData.imageUrl}
                    alt={cardData.configuration}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <div>
                      <span className="text-xs uppercase font-medium text-amber-300 tracking-wider">
                        {cardData.headline}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                        {cardData.configuration}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">
                      Acquisition Value
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-xl font-bold text-amber-400">
                        {cardData.priceDisplay}
                      </span>
                      {cardData.convertedPriceDisplay && (
                        <span className="text-xs opacity-60">
                          (~{cardData.convertedPriceDisplay})
                        </span>
                      )}
                    </div>
                  </div>

                  <a
                    href={cardData.exploreLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/25 transition-all"
                  >
                    <span>Explore</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleShareAction('WHATSAPP')}
                  className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Share to WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShareAction('NATIVE_OR_CLIPBOARD')}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Card Link</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP PREVIEW */}
          {activeTab === 'WHATSAPP' && (
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 block">
                Formatted WhatsApp Message Preview:
              </span>
              <div
                className={`p-4 rounded-2xl border text-xs font-mono whitespace-pre-line leading-relaxed ${
                  isDark ? 'bg-black/50 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                {sharePackage.whatsappMessageText}
              </div>

              <button
                onClick={() => handleShareAction('WHATSAPP')}
                className="w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Launch WhatsApp with Pre-filled Text</span>
              </button>
            </div>
          )}

          {/* TAB 3: EMAIL PREVIEW */}
          {activeTab === 'EMAIL' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold opacity-60">Subject:</span>
                <div className={`p-2.5 rounded-xl border text-xs font-bold ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300'}`}>
                  {sharePackage.emailSubject}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold opacity-60">Body Preview:</span>
                <div className={`p-4 rounded-2xl border text-xs whitespace-pre-line leading-relaxed ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300'}`}>
                  {sharePackage.emailBodyHtml}
                </div>
              </div>

              <button
                onClick={() => handleShareAction('EMAIL')}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Open in Email Client</span>
              </button>
            </div>
          )}

          {/* TAB 4: DIRECT LINK */}
          {activeTab === 'LINK' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold opacity-60">Direct Permlink:</span>
                <div className={`p-3 rounded-xl border text-xs font-mono break-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300'}`}>
                  {sharePackage.shareableUrl}
                </div>
              </div>

              <button
                onClick={() => handleShareAction('NATIVE_OR_CLIPBOARD')}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link to Clipboard</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
