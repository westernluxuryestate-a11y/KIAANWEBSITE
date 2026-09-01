/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, Unit } from '../types';
import { formatINR } from '../services/calculatorEngine';
import {
  Share2,
  Copy,
  Check,
  Send,
  Mail,
  Smartphone,
  Lock,
  Globe,
  Users,
  Sparkles,
  ShieldCheck,
  Eye,
  ArrowRight,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/seedData';

interface ShareableCollectionSuiteProps {
  onOpenProjectExperience?: (projectId: string) => void;
}

export const ShareableCollectionSuite: React.FC<ShareableCollectionSuiteProps> = ({
  onOpenProjectExperience,
}) => {
  const [collectionTitle, setCollectionTitle] = useState('My Wakad & Baner Executive Shortlist');
  const [includePricing, setIncludePricing] = useState(true);
  const [includeCompliancePdfs, setIncludeCompliancePdfs] = useState(true);
  const [includePrivateNotes, setIncludePrivateNotes] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareDestination, setShareDestination] = useState<'WHATSAPP' | 'EMAIL' | 'LINK'>('WHATSAPP');
  const [targetRecipient, setTargetRecipient] = useState('+91 98230 45678');

  const shareableUrl = `https://kiaanintelligence.luxury/share/col_${Date.now().toString(36)}`;

  const shortlistedProjects = INITIAL_PROJECTS.slice(0, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareTrigger = () => {
    if (shareDestination === 'WHATSAPP') {
      const text = `Take a look at my curated luxury real estate shortlist on Kiaan Intelligence: ${collectionTitle} - ${shareableUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    } else if (shareDestination === 'EMAIL') {
      const subject = `Curated Property Shortlist: ${collectionTitle}`;
      const body = `Hi,\n\nI have created a private property comparison collection on Kiaan Intelligence™ for our family review:\n\n${shareableUrl}\n\nAll properties include verified MahaRERA compliance records.`;
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="shareable-collection-suite">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0C1628] via-[#080E1B] to-[#04060C] border border-blue-500/25 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Share2 className="w-3.5 h-3.5" />
            <span>Curated Shareable Collections & Privacy Gate</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Export & Share Tailored Shortlists via WhatsApp, Link & Email
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Create branded, password-protected or public digital brochures for family co-buyers, wealth managers, and legal advisors. Only expose authorized compliance and pricing data.
          </p>
        </div>

        {/* Collection Name Input */}
        <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
          <div className="max-w-xl space-y-1.5">
            <label className="text-[11px] font-bold text-white/60 uppercase">Collection Name</label>
            <input
              type="text"
              value={collectionTitle}
              onChange={(e) => setCollectionTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/15 text-sm font-bold text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Share Configuration Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Shortlisted Items Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-white">Included Luxury Developments ({(shortlistedProjects || []).length})</h3>
            <span className="text-xs text-white/40 font-mono">Live Interactive Brochure</span>
          </div>

          <div className="space-y-3">
            {(shortlistedProjects || []).map((project) => (
              <div
                key={project.id}
                className="p-5 rounded-3xl bg-[#0D1525]/90 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/30 transition-all shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                    <img src={project.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'} alt={project.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-amber-400">{project.location.microMarket}</span>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">MahaRERA Verified</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{project.name}</h4>
                    <p className="text-xs text-white/60">{project.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-white/40 uppercase block">Starting Price</span>
                    <span className="text-sm font-bold text-white">{formatINR(project.headlinePriceRange.min)}</span>
                  </div>
                  <button
                    onClick={() => onOpenProjectExperience && onOpenProjectExperience(project.id)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
                    title="View Experience"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Privacy Gate & Dispatch Controls */}
        <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Data Exposure Permissions</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer">
                <div>
                  <span className="text-white font-medium block">All-In Indicative Pricing</span>
                  <span className="text-[10px] text-white/40">Include statutory stamp duty breakdowns</span>
                </div>
                <input
                  type="checkbox"
                  checked={includePricing}
                  onChange={(e) => setIncludePricing(e.target.checked)}
                  className="rounded text-amber-500 accent-amber-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer">
                <div>
                  <span className="text-white font-medium block">MahaRERA Sanctioned PDFs</span>
                  <span className="text-[10px] text-white/40">Official title deed & clearance certificates</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeCompliancePdfs}
                  onChange={(e) => setIncludeCompliancePdfs(e.target.checked)}
                  className="rounded text-amber-500 accent-amber-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer">
                <div>
                  <span className="text-white font-medium block">Family Voting & Private Notes</span>
                  <span className="text-[10px] text-white/40">Require passcode to inspect internal comments</span>
                </div>
                <input
                  type="checkbox"
                  checked={includePrivateNotes}
                  onChange={(e) => setIncludePrivateNotes(e.target.checked)}
                  className="rounded text-amber-500 accent-amber-500 w-4 h-4"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            {/* Share Buttons */}
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                onClick={() => setShareDestination('WHATSAPP')}
                className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  shareDestination === 'WHATSAPP'
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => setShareDestination('EMAIL')}
                className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  shareDestination === 'EMAIL'
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>

              <button
                onClick={handleCopy}
                className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  copiedLink
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>

            <button
              onClick={handleShareTrigger}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Collection Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
