/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Download,
  Smartphone,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface ShareAssetModalProps {
  assetId: string;
  assetTitle: string;
  location: string;
  priceDisplay: string;
  qrCodeUrl?: string;
  theme?: 'dark' | 'light';
  onClose: () => void;
}

export const ShareAssetModal: React.FC<ShareAssetModalProps> = ({
  assetId,
  assetTitle,
  location,
  priceDisplay,
  qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://kiaanproperties.com/assets/' + assetId,
  theme = 'dark',
  onClose,
}) => {
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);

  const directUrl = `${window.location.origin}${window.location.pathname}#experience/${assetId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `✨ Explore *${assetTitle}* on Kiaan Properties\n📍 ${location}\n💰 Starting at ${priceDisplay}\n🏛️ 100% MahaRERA Audited with 3D Spatial Digital Twin & Solar Ray Simulator\n\nExperience the asset here: ${directUrl}`
  );

  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 transition-all ${
          isDark ? 'bg-[#0B101B] border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-4 border-current/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Share2 className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-500">
                Direct Digital Product Handoff
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold">Share Asset: {assetTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-current/10 transition-colors text-current/70 hover:text-current cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code & Mobile Scan Box */}
        <div
          className={`p-6 rounded-3xl border text-center space-y-4 ${
            isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="w-44 h-44 mx-auto p-2 bg-white rounded-2xl shadow-xl flex items-center justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=4&data=${encodeURIComponent(
                directUrl
              )}`}
              alt="Asset Digital Twin QR Code"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 text-amber-500">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Instant Mobile Handoff</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Scan with your iPhone or Android camera to instantly launch this asset's 3D Digital Twin, sunlight simulator, and legal dossier.
            </p>
          </div>
        </div>

        {/* Direct Link Share & WhatsApp */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={directUrl}
              className={`flex-1 px-4 py-2.5 rounded-2xl text-xs font-mono border ${
                isDark ? 'bg-white/5 border-white/10 text-white/80' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-black'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share via WhatsApp with Pre-Formatted Dossier</span>
          </a>
        </div>
      </div>
    </div>
  );
};
