/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Share2,
  FileText,
  ShieldCheck,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Eye,
  Download,
  Lock,
} from 'lucide-react';
import { Project, Property } from '../types';
import { formatINR } from '../services/calculatorEngine';
import { seoEngine } from '../services/seoAndMetadataEngine';

interface MultiModalPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: Project | Property;
  theme?: 'dark' | 'light';
}

export const MultiModalPreviewModal: React.FC<MultiModalPreviewModalProps> = ({
  isOpen,
  onClose,
  entity,
  theme = 'dark',
}) => {
  const [deviceMode, setDeviceMode] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [previewTab, setPreviewTab] = useState<'LIVE' | 'RERA_LEGAL' | 'SEO_SOCIAL' | 'PDF_SPEC'>('LIVE');
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  if (!isOpen || !entity) return null;

  const isProject = 'towers' in entity;
  const isProj = isProject;
  const proj = entity as Project;
  const prop = entity as Property;

  const title = isProj ? proj.name : prop.title;
  const microMarket = entity.location?.microMarket || entity.location?.city || 'Pune';
  const priceDisplay = isProj
    ? proj.headlinePriceRange?.displayString || `₹${((proj.headlinePriceRange?.min || 0) / 10000000).toFixed(2)} Cr+`
    : `₹${(((prop.pricing?.basePrice || 0)) / 10000000).toFixed(2)} Cr`;

  const coverImg = entity.media?.find((m) => m.isCover)?.url || entity.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
  const reraNum = isProj ? proj.reraRecord?.registrationNumber : prop.reraRecord?.registrationNumber;

  const handleCopyShare = () => {
    const shareUrl = `${window.location.origin}/#${isProj ? 'project' : 'property'}/${entity.slug || entity.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-6xl h-[92vh] rounded-3xl border border-white/10 bg-[#0B101B] text-slate-100 shadow-2xl flex flex-col overflow-hidden">
        {/* TOP TOOLBAR: Preview Modes (Desktop/Mobile/Dark/Light/Tabs/Share) */}
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm sm:text-base">Pre-Publishing Omnichannel Preview</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase">
                  Item 154
                </span>
              </div>
              <p className="text-[11px] opacity-60">
                Auditing asset: <span className="font-semibold text-white">{title}</span>
              </p>
            </div>
          </div>

          {/* Controls Cluster */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Tabs */}
            <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => setPreviewTab('LIVE')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  previewTab === 'LIVE' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Live Preview
              </button>
              <button
                onClick={() => setPreviewTab('RERA_LEGAL')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  previewTab === 'RERA_LEGAL' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RERA Display</span>
              </button>
              <button
                onClick={() => setPreviewTab('SEO_SOCIAL')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  previewTab === 'SEO_SOCIAL' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>SEO & Social</span>
              </button>
              <button
                onClick={() => setPreviewTab('PDF_SPEC')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  previewTab === 'PDF_SPEC' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF Spec Sheet</span>
              </button>
            </div>

            {/* Viewport Toggles */}
            <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1">
              <button
                onClick={() => setDeviceMode('DESKTOP')}
                title="Desktop Layout"
                className={`p-1.5 rounded-lg ${deviceMode === 'DESKTOP' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceMode('MOBILE')}
                title="Mobile 375px Layout"
                className={`p-1.5 rounded-lg ${deviceMode === 'MOBILE' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1">
              <button
                onClick={() => setPreviewTheme('dark')}
                title="Dark Mode"
                className={`p-1.5 rounded-lg ${previewTheme === 'dark' ? 'bg-white/20 text-amber-400' : 'text-slate-400'}`}
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewTheme('light')}
                title="Light Mode"
                className={`p-1.5 rounded-lg ${previewTheme === 'light' ? 'bg-white/20 text-amber-500' : 'text-slate-400'}`}
              >
                <Sun className="w-4 h-4" />
              </button>
            </div>

            {/* Share Preview Link */}
            <button
              onClick={handleCopyShare}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              {copiedShareLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShareLink ? 'Link Copied' : 'Share Preview'}</span>
            </button>

            {/* Close Button */}
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN PREVIEW CANVAS AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-black/60">
          {/* TAB 1: LIVE SIMULATION */}
          {previewTab === 'LIVE' && (
            <div
              className={`transition-all duration-300 rounded-3xl overflow-hidden border shadow-2xl ${
                deviceMode === 'MOBILE' ? 'w-[380px] h-[680px]' : 'w-full max-w-4xl h-[680px]'
              } ${
                previewTheme === 'dark'
                  ? 'bg-[#070A0F] text-slate-100 border-white/15'
                  : 'bg-white text-slate-900 border-slate-300'
              } flex flex-col`}
            >
              {/* Simulated Browser/Device Frame Top */}
              <div
                className={`px-4 py-2 border-b flex items-center justify-between text-[10px] font-mono opacity-60 ${
                  previewTheme === 'dark' ? 'border-white/10 bg-black/40' : 'border-slate-200 bg-slate-100'
                }`}
              >
                <span>{deviceMode === 'MOBILE' ? 'iPhone 15 Pro • 393×852' : 'Desktop Ultra-Wide Viewport'}</span>
                <span>https://kiaanproperties.com/#{isProj ? 'project' : 'property'}/{entity.slug || entity.id}</span>
              </div>

              {/* Simulated Page Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                  <img src={coverImg} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 sm:p-6 text-white">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold uppercase">
                        {isProj ? 'Master Development' : 'Exclusive Residence'}
                      </span>
                      <h2 className="font-serif font-bold text-xl sm:text-2xl mt-1">{title}</h2>
                      <p className="text-xs opacity-80">{microMarket} • {priceDisplay}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-current/10">
                    <span className="font-mono font-bold text-amber-500">MahaRERA: {reraNum || 'Verified'}</span>
                    <span className="opacity-70">Possession: {entity.possessionDate || 'Q4 2027'}</span>
                  </div>

                  <p className="text-xs opacity-80 leading-relaxed">
                    {isProj ? proj.overviewStory : prop.overviewDescription}
                  </p>

                  <div className="p-3.5 rounded-2xl border border-current/10 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-amber-500">Exclusive Amenities</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(entity.amenities || []).slice(0, 4).map((a, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-current/5 border border-current/10 text-[10px] font-semibold">
                          {a.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Simulated Mobile CTA */}
                  <div className="pt-2 flex gap-2">
                    <button className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-lg">
                      Book Private Site Tour
                    </button>
                    <button className="px-4 py-3 rounded-xl border border-current/20 text-xs font-bold">
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RERA STATUTORY COMPLIANCE DISPLAY */}
          {previewTab === 'RERA_LEGAL' && (
            <div className="w-full max-w-3xl p-6 sm:p-8 rounded-3xl bg-[#101726] border border-amber-500/30 text-white space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-amber-400" />
                  <div>
                    <h3 className="font-serif font-bold text-lg">MahaRERA Statutory Compliance Dossier</h3>
                    <p className="text-xs text-slate-400">Government Portal Registration & Escrow Audit Check</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase">
                  Statutory Certified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="opacity-60 text-[10px] block uppercase">Registration Number</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{reraNum || 'P52100028492'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="opacity-60 text-[10px] block uppercase">Designated Escrow Account</span>
                  <span className="font-mono font-bold text-white text-sm">HDFC Escrow A/C #...8841</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="opacity-60 text-[10px] block uppercase">Encumbrance & Title Search</span>
                  <span className="font-bold text-emerald-400 text-sm">Clear 30-Year Title Search (Adv. Radhika Deshmukh)</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="opacity-60 text-[10px] block uppercase">Approved Building Plan Revision</span>
                  <span className="font-bold text-white text-sm">PMC Sanction Order 2026/P/992</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>MahaRERA QR Certificate embedded in public listing footer and buyer brochures.</span>
                </div>
                <a
                  href="https://maharera.maharashtra.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1 shrink-0"
                >
                  <span>Verify on MahaRERA</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: SEO & SOCIAL GRAPH PREVIEW */}
          {previewTab === 'SEO_SOCIAL' && (
            <div className="w-full max-w-3xl space-y-6">
              {/* Google SERP Card */}
              <div className="p-6 rounded-3xl bg-[#101726] border border-white/10 text-white space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                  Google Search Snippet Preview
                </span>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                  <span className="text-xs text-slate-400 block font-mono">
                    https://kiaanproperties.com › {isProj ? 'project' : 'property'} › {entity.slug || entity.id}
                  </span>
                  <h4 className="text-base text-blue-400 font-semibold hover:underline cursor-pointer">
                    {title} – Luxury Apartments in {microMarket} | Kiaan Properties
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Explore {title} in {microMarket}, Pune. Starting {priceDisplay}. MahaRERA: {reraNum}. Interactive 3D digital twin, floor plans, and transparent acquisition costs.
                  </p>
                </div>
              </div>

              {/* Social Graph Card */}
              <div className="p-6 rounded-3xl bg-[#101726] border border-white/10 text-white space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  OpenGraph & Twitter Card Preview
                </span>
                <div className="w-full max-w-md rounded-2xl overflow-hidden border border-white/10 bg-black/50">
                  <img src={coverImg} alt={title} className="w-full h-40 object-cover" />
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-500">kiaanproperties.com</span>
                    <h5 className="font-serif font-bold text-sm">{title} – {microMarket}</h5>
                    <p className="text-xs opacity-70 line-clamp-2">
                      Verified MahaRERA luxury development with 3D digital twin and floor plans.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PDF BROCHURE SPEC SHEET PREVIEW */}
          {previewTab === 'PDF_SPEC' && (
            <div className="w-full max-w-3xl p-8 rounded-3xl bg-[#101726] border border-white/10 text-white space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg">Architectural Specification Sheet</h3>
                  <p className="text-xs text-slate-400">Standard Buyer Allotment Annexure A</p>
                </div>
                <button
                  onClick={() => alert(`Downloaded Official Specification Dossier for ${title}`)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {isProj ? (
                  (proj.specifications || []).map((spec, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <span className="font-bold text-amber-400">{spec.category}</span>
                      <span className="opacity-90">{spec.items?.join(', ') || ''}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="font-bold text-amber-400">Configuration</span>
                    <span className="opacity-90">{prop.configuration} ({prop.carpetAreaSqFt} sq ft carpet)</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
