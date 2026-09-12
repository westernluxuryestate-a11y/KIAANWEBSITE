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
  Image as ImageIcon,
  Check,
  Layers,
  MapPin,
  Tag,
} from 'lucide-react';
import { seoEngine, SeoMetadataPayload, StructuredImageMetadata } from '../services/seoAndMetadataEngine';
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
  const [activeTab, setActiveTab] = useState<'METADATA' | 'MEDIA_SEO' | 'SOCIAL_PREVIEW' | 'JSON_LD' | 'SITEMAP' | 'ROBOTS'>('METADATA');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  // Compute active payload based on what's currently active
  let payload: SeoMetadataPayload;
  let activeMediaList: { url: string; title: string; category?: string; caption?: string; isCover?: boolean }[] = [];
  let entityContext: any = { entityType: 'GENERAL', locality: 'Pune', city: 'Pune' };

  if (activeProject) {
    payload = seoEngine.getProjectSeo(activeProject);
    activeMediaList = (activeProject.media || []).map((m) => ({
      url: m.url,
      title: m.title,
      category: m.category,
      caption: m.caption,
      isCover: m.isCover,
    }));
    entityContext = {
      entityType: 'PROJECT',
      entityTitle: activeProject.name,
      locality: activeProject.location?.microMarket || 'Pune',
      city: activeProject.location?.city || 'Pune',
      reraNumber: activeProject.reraRecord?.registrationNumber,
    };
  } else if (activeProperty) {
    payload = seoEngine.getPropertySeo(activeProperty);
    activeMediaList = (activeProperty.media || []).map((m) => ({
      url: m.url,
      title: m.title,
      category: m.category,
      caption: m.caption,
      isCover: m.isCover,
    }));
    entityContext = {
      entityType: 'PROPERTY',
      entityTitle: activeProperty.title,
      locality: activeProperty.location?.microMarket || 'Pune',
      city: activeProperty.location?.city || 'Pune',
      configuration: activeProperty.configuration,
      carpetAreaSqFt: activeProperty.carpetAreaSqFt,
    };
  } else {
    payload = seoEngine.getHomepageSeo();
    activeMediaList = [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
        title: 'Kiaan Luxury Architecture Elevation',
        category: 'EXTERIOR',
        isCover: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
        title: 'Italian Marble Living Suite',
        category: 'INTERIOR',
      },
      {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
        title: 'Pune Western Corridor Skylines',
        category: 'VIEWS',
      },
    ];
  }

  // Generate image schemas for inspection
  const mediaSchemas: { media: typeof activeMediaList[0]; altText: string; schema: StructuredImageMetadata }[] =
    activeMediaList.map((m, i) => {
      const itemContext = {
        ...entityContext,
        mediaCategory: m.category,
        customCaption: m.caption,
      };
      const altText = seoEngine.generateMediaAltText(itemContext);
      const schema = seoEngine.generateImageObjectSchema(m.url, itemContext, !!m.isCover || i === 0);
      return { media: m, altText, schema };
    });

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
        className={`w-full max-w-5xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
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
                <h3 className="font-serif font-bold text-lg">SEO & Structured Image Data Inspector</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Schema.org ImageObject Ready</span>
                </span>
              </div>
              <p className="text-xs opacity-60">
                Automated ALT tag injection, OpenGraph image dimensions, ImageObject JSON-LD & Google Images indexing.
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
            { id: 'MEDIA_SEO', label: `Image SEO & ALT Tags (${mediaSchemas.length})`, icon: ImageIcon },
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
                className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
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
          {/* TAB 1: METADATA & CANONICAL */}
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
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Robots Directives</span>
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
                  {(payload?.breadcrumbs || []).map((bc, idx) => (
                    <React.Fragment key={idx}>
                      <span className="font-semibold text-current opacity-90">{bc.name}</span>
                      {idx < (payload?.breadcrumbs?.length || 0) - 1 && <span className="opacity-40">/</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA ASSETS & ALT TAGS */}
          {activeTab === 'MEDIA_SEO' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Automated Media SEO & Structured Image Injection Active</span>
                  </div>
                  <p className="text-[11px] opacity-75">
                    Every media asset is automatically paired with contextual keyword-rich ALT tags, micro-market locality tags, MahaRERA clearance badges, and Schema.org <code className="font-mono text-amber-300">ImageObject</code> JSON-LD.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(JSON.stringify(mediaSchemas.map((m) => m.schema), null, 2), 'all_images')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow whitespace-nowrap self-start sm:self-auto"
                >
                  {copiedKey === 'all_images' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'all_images' ? 'Copied All Schemas' : 'Copy All Image Schemas'}</span>
                </button>
              </div>

              {/* Media Asset List */}
              <div className="space-y-4">
                {mediaSchemas.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-start ${
                      isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {/* Image Thumbnail with Google Images Badge */}
                    <div className="relative w-full md:w-48 aspect-video md:aspect-[4/3] rounded-xl overflow-hidden shrink-0 border border-white/10">
                      <img
                        src={item.media.url}
                        alt={item.altText}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                        {item.media.category || 'MEDIA'}
                      </span>
                      {item.media.isCover && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-black text-[9px] font-bold uppercase tracking-wider">
                          Cover Hero
                        </span>
                      )}
                    </div>

                    {/* Metadata & ALT Details */}
                    <div className="flex-1 space-y-2.5 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-current">{item.media.title || `Media Asset #${idx + 1}`}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                            1920x1080
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(item.altText, `alt_${idx}`)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold flex items-center gap-1 border border-white/10 cursor-pointer"
                        >
                          {copiedKey === `alt_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === `alt_${idx}` ? 'Copied' : 'Copy ALT'}</span>
                        </button>
                      </div>

                      {/* Injected ALT Tag Box */}
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <div className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                          Injected ALT Tag (HTML &lt;img alt="..."&gt;)
                        </div>
                        <div className="text-xs font-mono text-slate-200 select-all leading-relaxed">
                          {item.altText}
                        </div>
                      </div>

                      {/* Google Image SERP Snippet Preview */}
                      <div className="p-3 rounded-xl border border-dashed border-white/15 bg-white/[0.01] space-y-1">
                        <div className="text-[9px] uppercase font-bold opacity-50 tracking-wider flex items-center gap-1">
                          <Search className="w-3 h-3 text-amber-400" />
                          <span>Google Images SERP Rich Snippet Preview</span>
                        </div>
                        <div className="text-xs font-semibold text-blue-400 hover:underline truncate cursor-pointer">
                          {item.altText}
                        </div>
                        <div className="text-[10px] opacity-70 truncate font-mono">
                          kiaanproperties.com › {entityContext.locality?.toLowerCase() || 'pune'} › {entityContext.entityTitle?.toLowerCase().replace(/\s+/g, '-') || 'luxury'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL & WHATSAPP SHARING PREVIEW */}
          {activeTab === 'SOCIAL_PREVIEW' && (
            <div className="space-y-4">
              <span className="text-xs font-bold opacity-60 uppercase tracking-wider">
                WhatsApp, iMessage & Twitter Large Card Preview
              </span>
              <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                <img
                  src={payload.ogImage}
                  alt={payload.ogImageAlt || payload.ogTitle}
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

          {/* TAB 4: JSON-LD STRUCTURED DATA */}
          {activeTab === 'JSON_LD' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Schema.org Structured Data ({payload?.jsonLd?.length || 0} Entities)
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(payload.jsonLd, null, 2), 'json_ld')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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

          {/* TAB 5: SITEMAP.XML */}
          {activeTab === 'SITEMAP' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Live Generated XML Sitemap ({(projects?.length || 0) + (properties?.length || 0) + 1} URLs)
                </span>
                <button
                  onClick={() => handleCopy(sitemapXml, 'sitemap')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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

          {/* TAB 6: ROBOTS.TXT */}
          {activeTab === 'ROBOTS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Robots.txt Crawl Directives
                </span>
                <button
                  onClick={() => handleCopy(robotsTxt, 'robots')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
