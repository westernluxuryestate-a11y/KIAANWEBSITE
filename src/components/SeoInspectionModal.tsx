import React, { useState } from 'react';
import {
  X,
  Globe,
  Share2,
  Code2,
  FileCode,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
} from 'lucide-react';
import { seoEngine, SeoMetadataPayload } from '../services/seoAndMetadataEngine';
import { Project, Property } from '../types';

interface SeoInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  properties: Property[];
  activeProject?: Project | null;
  activeProperty?: Property | null;
  theme?: 'dark' | 'light';
}

export const SeoInspectionModal: React.FC<SeoInspectionModalProps> = ({
  isOpen,
  onClose,
  projects,
  properties,
  activeProject,
  activeProperty,
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'METADATA' | 'SOCIAL_PREVIEW' | 'JSON_LD' | 'SITEMAP' | 'ROBOTS'>('METADATA');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  // Compute active payload based on what's currently active
  let payload: SeoMetadataPayload;
  if (activeProject) {
    payload = seoEngine.getProjectSeo(activeProject);
  } else if (activeProperty) {
    payload = seoEngine.getPropertySeo(activeProperty);
  } else {
    payload = seoEngine.getHomepageSeo();
  }

  const sitemapXml = seoEngine.generateXmlSitemap(projects, properties);
  const robotsTxt = seoEngine.generateRobotsTxt();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-[#0B101B] border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-current/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg">SEO & Structured Data Inspector</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Valid Schema.org</span>
                </span>
              </div>
              <p className="text-xs opacity-60">
                Live document metadata, Open Graph social cards, JSON-LD schemas & statutory indexing rules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-current/10 opacity-70 hover:opacity-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-current/10 overflow-x-auto">
          {[
            { id: 'METADATA', label: 'Meta & Canonical Tags', icon: Globe },
            { id: 'SOCIAL_PREVIEW', label: 'Social & WhatsApp Cards', icon: Share2 },
            { id: 'JSON_LD', label: 'JSON-LD Structured Data', icon: Code2 },
            { id: 'SITEMAP', label: 'Sitemap.xml', icon: FileCode },
            { id: 'ROBOTS', label: 'Robots.txt', icon: Search },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: METADATA & CANONICAL (Items 143-145) */}
          {activeTab === 'METADATA' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-3`}>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">Document Title (&lt;title&gt;)</span>
                  <div className="text-sm font-semibold font-serif mt-1 select-all">{payload.title}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">Meta Description (&lt;meta name="description"&gt;)</span>
                  <p className="text-xs opacity-80 mt-1 leading-relaxed select-all">{payload.metaDescription}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Canonical URL</span>
                    <p className="text-xs font-mono opacity-90 truncate">{payload.canonicalUrl}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Robots Directives (Item 149)</span>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                      {payload.robots}
                    </span>
                  </div>
                </div>
              </div>

              {/* Breadcrumb Hierarchy */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-2`}>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">Active Breadcrumb Hierarchy</span>
                <div className="flex items-center flex-wrap gap-2 text-xs">
                  {payload.breadcrumbs.map((bc, idx) => (
                    <React.Fragment key={idx}>
                      <span className="font-semibold text-current opacity-90">{bc.name}</span>
                      {idx < payload.breadcrumbs.length - 1 && <span className="opacity-40">/</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOCIAL & WHATSAPP SHARING PREVIEW (Item 147) */}
          {activeTab === 'SOCIAL_PREVIEW' && (
            <div className="space-y-4">
              <span className="text-xs font-bold opacity-60 uppercase tracking-wider">
                WhatsApp & iMessage High-Converting Rich Card Preview
              </span>
              <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                <img
                  src={payload.ogImage}
                  alt={payload.ogTitle}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-[#111B21] text-white space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">kiaanproperties.com</div>
                  <h4 className="font-serif font-bold text-sm leading-tight text-white">{payload.ogTitle}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{payload.ogDescription}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JSON-LD STRUCTURED DATA (Item 146) */}
          {activeTab === 'JSON_LD' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Schema.org Structured Data ({payload.jsonLd.length} Entities)
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(payload.jsonLd, null, 2), 'json_ld')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'json_ld' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'json_ld' ? 'Copied' : 'Copy JSON-LD'}</span>
                </button>
              </div>
              <pre className={`p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-96 ${isDark ? 'bg-black/60 text-amber-300' : 'bg-slate-900 text-amber-300'}`}>
                {JSON.stringify(payload.jsonLd, null, 2)}
              </pre>
            </div>
          )}

          {/* TAB 4: SITEMAP.XML */}
          {activeTab === 'SITEMAP' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Live Generated XML Sitemap ({projects.length + properties.length + 1} URLs)
                </span>
                <button
                  onClick={() => handleCopy(sitemapXml, 'sitemap')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'sitemap' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'sitemap' ? 'Copied' : 'Copy Sitemap'}</span>
                </button>
              </div>
              <pre className={`p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-96 ${isDark ? 'bg-black/60 text-emerald-300' : 'bg-slate-900 text-emerald-300'}`}>
                {sitemapXml}
              </pre>
            </div>
          )}

          {/* TAB 5: ROBOTS.TXT */}
          {activeTab === 'ROBOTS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Robots.txt Crawl Directives
                </span>
                <button
                  onClick={() => handleCopy(robotsTxt, 'robots')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'robots' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'robots' ? 'Copied' : 'Copy Robots.txt'}</span>
                </button>
              </div>
              <pre className={`p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-96 ${isDark ? 'bg-black/60 text-cyan-300' : 'bg-slate-900 text-cyan-300'}`}>
                {robotsTxt}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
