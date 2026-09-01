/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { DiscoveryHomepage } from './components/DiscoveryHomepage';
import { Project, Property, Unit, UserSession } from './types';
import { Layers, X, ShieldCheck } from 'lucide-react';

// ============================================================
// PERFORMANCE PHILOSOPHY: LAZY-LOAD HEAVY EXPERIENCES & SUITES
// Keeps initial bundle lightweight, fast, and responsive.
// ============================================================
const AssetExperienceView = lazy(() =>
  import('./components/AssetExperienceView').then((m) => ({ default: m.AssetExperienceView }))
);
const ProjectExperiencePage = lazy(() =>
  import('./components/ProjectExperiencePage').then((m) => ({ default: m.ProjectExperiencePage }))
);
const PropertyExperiencePage = lazy(() =>
  import('./components/PropertyExperiencePage').then((m) => ({ default: m.PropertyExperiencePage }))
);
const AuthModal = lazy(() =>
  import('./components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const AdminCmsConsole = lazy(() =>
  import('./components/AdminCmsConsole').then((m) => ({ default: m.AdminCmsConsole }))
);
const UnifiedSearchView = lazy(() =>
  import('./components/UnifiedSearchView').then((m) => ({ default: m.UnifiedSearchView }))
);
const ContractLifecycleSuite = lazy(() =>
  import('./components/ContractLifecycleSuite').then((m) => ({ default: m.ContractLifecycleSuite }))
);
const FinancialIntelligenceSuite = lazy(() =>
  import('./components/FinancialIntelligenceSuite').then((m) => ({ default: m.FinancialIntelligenceSuite }))
);
const VipClientPortal = lazy(() =>
  import('./components/VipClientPortal').then((m) => ({ default: m.VipClientPortal }))
);
const KiaanAIChat = lazy(() =>
  import('./components/KiaanAIChat').then((m) => ({ default: m.KiaanAIChat }))
);
const CalculatorWidget = lazy(() =>
  import('./components/CalculatorWidget').then((m) => ({ default: m.CalculatorWidget }))
);
const ReraComplianceCenter = lazy(() =>
  import('./components/ReraComplianceCenter').then((m) => ({ default: m.ReraComplianceCenter }))
);
const Phase01Report = lazy(() =>
  import('./components/Phase01Report').then((m) => ({ default: m.Phase01Report }))
);
const Phase02Report = lazy(() =>
  import('./components/Phase02Report').then((m) => ({ default: m.Phase02Report }))
);
const Phase03Report = lazy(() =>
  import('./components/Phase03Report').then((m) => ({ default: m.Phase03Report }))
);
const Phase04Report = lazy(() =>
  import('./components/Phase04Report').then((m) => ({ default: m.Phase04Report }))
);
const ComparisonMatrixModal = lazy(() =>
  import('./components/ComparisonMatrixModal').then((m) => ({ default: m.ComparisonMatrixModal }))
);
const UnitSelectionModal = lazy(() =>
  import('./components/UnitSelectionModal').then((m) => ({ default: m.UnitSelectionModal }))
);
const SiteVisitModal = lazy(() =>
  import('./components/SiteVisitModal').then((m) => ({ default: m.SiteVisitModal }))
);
const DigitalTwinViewer = lazy(() =>
  import('./components/DigitalTwinViewer').then((m) => ({ default: m.DigitalTwinViewer }))
);
const SellPropertyModal = lazy(() =>
  import('./components/SellPropertyModal').then((m) => ({ default: m.SellPropertyModal }))
);
const VipLoginModal = lazy(() =>
  import('./components/VipLoginModal').then((m) => ({ default: m.VipLoginModal }))
);
const InteractiveMapExplorer = lazy(() =>
  import('./components/InteractiveMapExplorer').then((m) => ({ default: m.InteractiveMapExplorer }))
);
const FamilyDiscussionRoom = lazy(() =>
  import('./components/FamilyDiscussionRoom').then((m) => ({ default: m.FamilyDiscussionRoom }))
);
const ShareableCollectionSuite = lazy(() =>
  import('./components/ShareableCollectionSuite').then((m) => ({ default: m.ShareableCollectionSuite }))
);
const ProgressiveInformationUnlock = lazy(() =>
  import('./components/ProgressiveInformationUnlock').then((m) => ({ default: m.ProgressiveInformationUnlock }))
);
const DocumentCenterModal = lazy(() =>
  import('./components/DocumentCenterModal').then((m) => ({ default: m.DocumentCenterModal }))
);
const CustomerReportGeneratorModal = lazy(() =>
  import('./components/CustomerReportGeneratorModal').then((m) => ({ default: m.CustomerReportGeneratorModal }))
);
const ShareEngineModal = lazy(() =>
  import('./components/ShareEngineModal').then((m) => ({ default: m.ShareEngineModal }))
);
const CustomerJourneyPassportModal = lazy(() =>
  import('./components/CustomerJourneyPassportModal').then((m) => ({ default: m.CustomerJourneyPassportModal }))
);
const NriExperienceModal = lazy(() =>
  import('./components/NriExperienceModal').then((m) => ({ default: m.NriExperienceModal }))
);
const CommercialExperienceView = lazy(() =>
  import('./components/CommercialExperienceView').then((m) => ({ default: m.CommercialExperienceView }))
);
const DataPrivacyCenterModal = lazy(() =>
  import('./components/DataPrivacyCenterModal').then((m) => ({ default: m.DataPrivacyCenterModal }))
);
const PaymentSecurityModal = lazy(() =>
  import('./components/PaymentSecurityModal').then((m) => ({ default: m.PaymentSecurityModal }))
);
const SeoInspectionModal = lazy(() =>
  import('./components/SeoInspectionModal').then((m) => ({ default: m.SeoInspectionModal }))
);
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { NetworkStatusBanner } from './components/NetworkStatusBanner';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { seoEngine } from './services/seoAndMetadataEngine';
import { offlineAndPwaService } from './services/offlineAndPwaService';

// Lightweight Suspense Fallback Loader
const ModuleLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4 animate-fade-in">
    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center animate-pulse">
      <span className="font-serif font-black text-amber-500 text-xl">K</span>
    </div>
    <div className="text-center space-y-1">
      <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Initializing Digital Experience</span>
      <p className="text-[11px] opacity-60">Streaming 3D blueprints and statutory escrow data...</p>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'explore' | 'search' | 'map' | 'family' | 'share' | 'contracts' | 'finance' | 'vip' | 'ai' | 'calculators' | 'rera' | 'commercial' | 'phase04' | 'phase03' | 'phase02' | 'phase01'
  >('explore');
  const [customerMode, setCustomerMode] = useState<'BUY' | 'RENT_LEASE' | 'INVEST' | 'COMMERCIAL'>('BUY');
  const [currency, setCurrency] = useState<import('./types').CurrencyCode>('INR');

  // Theme Management (Light Mode & Dark Mode with system preference check)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('kiaan_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const handleSetTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('kiaan_theme', newTheme);
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Core Digital Product Asset Experience State (ONE PROJECT / ONE UNIT = ONE DIGITAL EXPERIENCE)
  const [selectedExperienceAsset, setSelectedExperienceAsset] = useState<{
    type?: 'PROJECT' | 'PROPERTY' | 'UNIT';
    project?: Project;
    property?: Property;
    unitId?: string;
  } | null>(null);

  // Modals & Digital Twin State
  const [selectedProjectForUnits, setSelectedProjectForUnits] = useState<Project | null>(null);
  const [selectedProjectForVisit, setSelectedProjectForVisit] = useState<Project | null>(null);
  const [selectedProjectForTwin, setSelectedProjectForTwin] = useState<{ project: Project; initialUnitId?: string } | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminCmsOpen, setIsAdminCmsOpen] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  // New Modals State (Items 97-107, 127-128, 143-149)
  const [isDocCenterOpen, setIsDocCenterOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);
  const [isNriModalOpen, setIsNriModalOpen] = useState(false);
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const [isPaymentSecurityOpen, setIsPaymentSecurityOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);

  // Active Share/Report Context Target
  const [activeShareTarget, setActiveShareTarget] = useState<{
    type: any;
    id: string;
    title: string;
    subtitle: string;
    priceINR: number;
    locationName: string;
    configuration: string;
    imageUrl: string;
    deepLinkPath: string;
  }>({
    type: 'PROJECT',
    id: 'proj_one_vertica_wakad',
    title: 'Kiaan One Vertica',
    subtitle: 'Sculpted Sky Residences',
    priceINR: 14800000,
    locationName: 'Wakad, Pune',
    configuration: '3.5 BHK Sky Residence',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
    deepLinkPath: 'project/kiaan-one-vertica-wakad',
  });

  const [activeReportTarget, setActiveReportTarget] = useState<{
    project?: Project;
    property?: Property;
    unit?: Unit;
  }>({});

  // Comparison Tray State
  const [comparisonUnitIds, setComparisonUnitIds] = useState<string[]>(['unit_a1201', 'unit_a1202']);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const toggleComparisonUnit = (unitId: string) => {
    setComparisonUnitIds((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId].slice(0, 4)
    );
  };

  const handleAddToComparison = (unit: Unit) => {
    if (!comparisonUnitIds.includes(unit.id)) {
      if (comparisonUnitIds.length >= 4) {
        setComparisonUnitIds((prev) => [...prev.slice(1), unit.id]);
      } else {
        setComparisonUnitIds((prev) => [...prev, unit.id]);
      }
    }
    setIsComparisonOpen(true);
  };

  // Open First-Class Digital Product Experience
  const openAssetExperience = (project: Project, unitId?: string) => {
    if (unitId) {
      setSelectedExperienceAsset({ type: 'UNIT', project, unitId });
      window.location.hash = `unit/${unitId}`;
    } else {
      setSelectedExperienceAsset({ type: 'PROJECT', project });
      window.location.hash = `project/${project.slug || project.id}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPropertyExperience = (property: Property) => {
    setSelectedExperienceAsset({ type: 'PROPERTY', property });
    window.location.hash = `property/${property.slug || property.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetch('/api/v1/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) {
          setProjects(data.data);
          offlineAndPwaService.cacheSavedProperties(data.data);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));

    fetch('/api/v1/properties')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProperties(data.data);
        }
      });
  }, []);

  // Deep Linking & Share Direct Landing (Item 148)
  useEffect(() => {
    if (projects.length === 0 && properties.length === 0) return;

    const handleDeepLink = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const projectParam = urlParams.get('project');
      const propertyParam = urlParams.get('property');
      const unitParam = urlParams.get('unit');
      const tabParam = urlParams.get('tab');

      if (tabParam && ['explore', 'search', 'map', 'contracts', 'finance', 'vip', 'ai', 'rera', 'commercial'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }

      if (projectParam) {
        const matched = projects.find((p) => p.id === projectParam || p.slug === projectParam);
        if (matched) {
          setSelectedExperienceAsset({ type: 'PROJECT', project: matched, unitId: unitParam || undefined });
          return;
        }
      }

      if (propertyParam) {
        const matched = properties.find((p) => p.id === propertyParam || p.slug === propertyParam);
        if (matched) {
          setSelectedExperienceAsset({ type: 'PROPERTY', property: matched });
          return;
        }
      }

      // Hash-based deep link fallback
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('project/') || hash.startsWith('experience/')) {
        const idOrSlug = hash.split('/')[1];
        const matched = projects.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
        if (matched) {
          setSelectedExperienceAsset({ type: 'PROJECT', project: matched });
        }
      } else if (hash.startsWith('unit/')) {
        const unitId = hash.split('/')[1];
        for (const p of projects) {
          const u = (p.towers || []).flatMap((t: any) => (t.floors || []).flatMap((f: any) => f.units || []))?.find((x: any) => x?.id === unitId);
          if (u) {
            setSelectedExperienceAsset({ type: 'UNIT', project: p, unitId });
            break;
          }
        }
      } else if (hash.startsWith('property/')) {
        const idOrSlug = hash.split('/')[1];
        const matched = properties.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
        if (matched) {
          setSelectedExperienceAsset({ type: 'PROPERTY', property: matched });
        }
      }
    };

    window.addEventListener('hashchange', handleDeepLink);
    window.addEventListener('popstate', handleDeepLink);
    handleDeepLink();

    return () => {
      window.removeEventListener('hashchange', handleDeepLink);
      window.removeEventListener('popstate', handleDeepLink);
    };
  }, [projects, properties]);

  // Synchronize SEO Metadata, Canonical Links & Schema.org JSON-LD (Items 143-147)
  useEffect(() => {
    if (selectedExperienceAsset?.project) {
      if (selectedExperienceAsset.unitId) {
        const u = (selectedExperienceAsset.project.towers || [])
          .flatMap((t: any) => (t.floors || []).flatMap((f: any) => f.units || []))
          .find((x: any) => x?.id === selectedExperienceAsset.unitId);
        if (u) {
          seoEngine.applyToDocument(seoEngine.getUnitSeo(selectedExperienceAsset.project, u));
        } else {
          seoEngine.applyToDocument(seoEngine.getProjectSeo(selectedExperienceAsset.project));
        }
      } else {
        seoEngine.applyToDocument(seoEngine.getProjectSeo(selectedExperienceAsset.project));
      }
      offlineAndPwaService.cacheRecentView({
        id: selectedExperienceAsset.project.id,
        type: 'PROJECT',
        title: selectedExperienceAsset.project.name,
        subtitle: selectedExperienceAsset.project.location?.microMarket || 'Pune',
        imageUrl: selectedExperienceAsset.project.media?.heroImage || '',
        priceINR: selectedExperienceAsset.project.priceStartingINR,
      });
    } else if (selectedExperienceAsset?.property) {
      seoEngine.applyToDocument(seoEngine.getPropertySeo(selectedExperienceAsset.property));
      offlineAndPwaService.cacheRecentView({
        id: selectedExperienceAsset.property.id,
        type: 'PROPERTY',
        title: selectedExperienceAsset.property.title,
        subtitle: selectedExperienceAsset.property.location?.microMarket || 'Pune',
        imageUrl: selectedExperienceAsset.property.media?.heroImage || '',
        priceINR: selectedExperienceAsset.property.priceINR,
      });
    } else {
      seoEngine.applyToDocument(seoEngine.getHomepageSeo());
    }
  }, [selectedExperienceAsset, activeTab]);

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 transition-colors duration-300 ${
        isDark ? 'bg-[#070A0F] text-[#F3F4F6]' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Real-time Network & Low-Bandwidth Status Banner (Item 142) */}
      <NetworkStatusBanner theme={theme} />

      {/* Top Luxury Navigation & Mobile Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedExperienceAsset(null);
          setActiveTab(tab as any);
        }}
        mode={customerMode}
        setMode={setCustomerMode}
        currency={currency}
        onOpenNriModal={() => setIsNriModalOpen(true)}
        onOpenPassportModal={() => setIsPassportModalOpen(true)}
        onOpenDocCenter={() => setIsDocCenterOpen(true)}
        onOpenPrivacyCenter={() => setIsPrivacyCenterOpen(true)}
        onOpenPaymentSecurity={() => setIsPaymentSecurityOpen(true)}
        onOpenSeoInspector={() => setIsSeoModalOpen(true)}
        theme={theme}
        setTheme={handleSetTheme}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenAdminCms={() => setIsAdminCmsOpen(true)}
        userSession={userSession}
        savedCount={comparisonUnitIds.length}
      />

      {/* CORE DIGITAL PRODUCT EXPERIENCE (When viewing an individual Project, Unit, or Property) */}
      {selectedExperienceAsset ? (
        <Suspense fallback={<ModuleLoadingFallback />}>
          {selectedExperienceAsset.type === 'PROPERTY' && selectedExperienceAsset.property ? (
            <PropertyExperiencePage
              property={selectedExperienceAsset.property}
              theme={theme}
              onBackToDiscovery={() => {
                setSelectedExperienceAsset(null);
                window.location.hash = '';
              }}
            />
          ) : selectedExperienceAsset.type === 'PROJECT' && selectedExperienceAsset.project ? (
            <ProjectExperiencePage
              project={selectedExperienceAsset.project}
              theme={theme}
              onBackToDiscovery={() => {
                setSelectedExperienceAsset(null);
                window.location.hash = '';
              }}
              onSelectUnitForExperience={(u) => {
                if (selectedExperienceAsset.project) {
                  openAssetExperience(selectedExperienceAsset.project, u.id);
                }
              }}
              onOpenDigitalTwin={(proj, uId) => {
                setSelectedProjectForTwin({ project: proj, initialUnitId: uId });
              }}
              onAddToComparison={handleAddToComparison}
            />
          ) : selectedExperienceAsset.project ? (
            <AssetExperienceView
              project={selectedExperienceAsset.project}
              initialUnitId={selectedExperienceAsset.unitId}
              theme={theme}
              onBackToDiscovery={() => {
                setSelectedExperienceAsset(null);
                window.location.hash = '';
              }}
              onOpenComparison={handleAddToComparison}
            />
          ) : null}
        </Suspense>
      ) : (
        /* DISCOVERY LAYER MAIN CONTENT AREA */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24 lg:pb-12">
          {/* TAB 1: LUXURY ASSET DISCOVERY & SHOWCASE HOMEPAGE */}
          {activeTab === 'explore' && (
            <DiscoveryHomepage
              projects={projects}
              properties={properties}
              customerMode={customerMode}
              setCustomerMode={setCustomerMode}
              theme={theme}
              onOpenAssetExperience={openAssetExperience}
              onOpenPropertyExperience={openPropertyExperience}
              onOpenScheduleVisit={(p) => setSelectedProjectForVisit(p)}
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
              onOpenSellModal={() => setIsSellModalOpen(true)}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              onExecuteSearchQuery={(q) => {
                setActiveTab('search');
              }}
            />
          )}

          {/* TAB 2: UNIFIED SEARCH & FACETED DISCOVERY */}
          {activeTab === 'search' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <UnifiedSearchView
                onOpenDigitalTwin={(proj, uId) => openAssetExperience(proj, uId)}
                onAddToComparison={handleAddToComparison}
                onScheduleVisit={(p) => setSelectedProjectForVisit(p)}
              />
            </Suspense>
          )}

          {/* TAB 2.1: SPATIAL MAP & GIS EXPLORER (SECTION 55) */}
          {activeTab === 'map' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <InteractiveMapExplorer
                onOpenProjectExperience={(projId) => {
                  const p = projects.find((x) => x.id === projId);
                  if (p) openAssetExperience(p);
                }}
                onOpenDigitalTwin={(proj, uId) => openAssetExperience(proj, uId)}
              />
            </Suspense>
          )}

          {/* TAB 2.2: FAMILY DECISION ROOM™ & CONSENSUS (SECTIONS 58-59) */}
          {activeTab === 'family' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <div className="space-y-6">
                <FamilyDiscussionRoom
                  assetId={projects[0]?.id || 'proj_one_vertica_wakad'}
                  assetTitle={projects[0]?.name || 'Kiaan One Vertica'}
                  theme={theme}
                />
              </div>
            </Suspense>
          )}

          {/* TAB 2.3: SHAREABLE COLLECTION SUITE (SECTION 60) */}
          {activeTab === 'share' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <ShareableCollectionSuite
                onOpenProjectExperience={(projId) => {
                  const p = projects.find((x) => x.id === projId);
                  if (p) openAssetExperience(p);
                }}
              />
            </Suspense>
          )}

          {/* TAB 3: CONTRACT LIFECYCLE & ESCROW SUITE */}
          {activeTab === 'contracts' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <ContractLifecycleSuite />
            </Suspense>
          )}

          {/* TAB 4: FINANCIAL INTELLIGENCE & TAX SHIELD */}
          {activeTab === 'finance' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <FinancialIntelligenceSuite />
            </Suspense>
          )}

          {/* TAB 5: VIP CLIENT PORTAL & HOLDS */}
          {activeTab === 'vip' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <VipClientPortal
                onOpenDigitalTwin={(proj, uId) => openAssetExperience(proj, uId)}
                onAddToComparison={handleAddToComparison}
              />
            </Suspense>
          )}

          {/* TAB 6: KIAAN INTELLIGENCE™ AI CONCIERGE */}
          {activeTab === 'ai' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <KiaanAIChat />
            </Suspense>
          )}

          {/* TAB 7: CALCULATORS SUITE */}
          {activeTab === 'calculators' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <CalculatorWidget />
            </Suspense>
          )}

          {/* TAB 8: MAHARERA REGULATORY CENTER */}
          {activeTab === 'rera' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <ReraComplianceCenter />
            </Suspense>
          )}

          {/* TAB 9: COMMERCIAL & INSTITUTIONAL ASSETS (ITEMS 108 & 109) */}
          {activeTab === 'commercial' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <CommercialExperienceView
                properties={properties}
                currency={currency}
                theme={theme}
                onSelectProperty={(prop) => openPropertyExperience(prop)}
                onOpenDocCenter={(prop) => {
                  setIsDocCenterOpen(true);
                }}
                onOpenShare={(prop) => {
                  setActiveShareTarget({
                    type: 'PROPERTY',
                    id: prop.id,
                    title: prop.title,
                    subtitle: `${prop.location?.microMarket}, ${prop.location?.city}`,
                    priceINR: prop.pricing?.basePrice || 48000000,
                    locationName: `${prop.location?.microMarket}, ${prop.location?.city}`,
                    configuration: prop.propertyType.replace('_', ' '),
                    imageUrl: prop.media?.[0]?.url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
                    deepLinkPath: `property/${prop.slug || prop.id}`,
                  });
                  setIsShareModalOpen(true);
                }}
                onOpenReport={(prop) => {
                  setActiveReportTarget({ property: prop });
                  setIsReportModalOpen(true);
                }}
              />
            </Suspense>
          )}

          {/* DIAGNOSTIC AUDIT TEST SUITES (ACCESSIBLE VIA AUDIT DROPDOWN) */}
          {activeTab === 'phase04' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <Phase04Report />
            </Suspense>
          )}
          {activeTab === 'phase03' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <Phase03Report />
            </Suspense>
          )}
          {activeTab === 'phase02' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <Phase02Report />
            </Suspense>
          )}
          {activeTab === 'phase01' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <Phase01Report />
            </Suspense>
          )}
        </main>
      )}

      {/* Floating Comparison Tray Bar (When items are loaded) */}
      {comparisonUnitIds.length > 0 && !isComparisonOpen && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-40 animate-slide-up">
          <div
            className={`flex items-center gap-3 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl ${
              isDark ? 'bg-[#0E1524]/95 border-amber-500/40 text-white' : 'bg-white/95 border-slate-300 text-slate-900 shadow-xl'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs font-bold">
                {comparisonUnitIds.length} Units in Comparison
              </span>
            </div>
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Launch Matrix</span>
            </button>
            <button
              onClick={() => setComparisonUnitIds([])}
              className="p-1 rounded-lg opacity-40 hover:opacity-100 transition-all cursor-pointer"
              title="Clear comparison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Luxury Brand Footer */}
      <footer
        className={`mt-auto border-t py-14 text-xs transition-colors duration-300 ${
          isDark ? 'border-amber-500/15 bg-[#05070B] text-white/60' : 'border-slate-200 bg-white text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b pb-8 border-current/10">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-700 flex items-center justify-center font-serif font-black text-black text-lg shadow-lg">
                K
              </div>
              <div>
                <p className={`font-serif text-lg font-bold tracking-wider ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  KIAAN ESTATES
                </p>
                <p className="text-[11px] text-amber-500">Private Client Luxury Real Estate & Digital Twins</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs">
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('explore'); }} className="hover:text-amber-500 transition-colors">Residences</button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('search'); }} className="hover:text-amber-500 transition-colors">Digital Twins</button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('finance'); }} className="hover:text-amber-500 transition-colors">Financial Intelligence</button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('vip'); }} className="hover:text-amber-500 transition-colors">VIP Concierge</button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('contracts'); }} className="hover:text-amber-500 transition-colors">Contracts & Escrow</button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('phase04'); }} className="text-amber-500 hover:text-amber-400 transition-colors">Engineering Audits</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] opacity-60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Registered with Maharashtra Real Estate Regulatory Authority (MahaRERA)</span>
            </div>
            <div>
              © 2026 Kiaan Luxury Properties Private Limited. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Unit Selection & Floor Plan Modal */}
      {selectedProjectForUnits && (
        <Suspense fallback={null}>
          <UnitSelectionModal
            project={selectedProjectForUnits}
            onClose={() => setSelectedProjectForUnits(null)}
            onOpenDigitalTwin={(proj, unitId) => openAssetExperience(proj, unitId)}
            onAddToComparison={handleAddToComparison}
          />
        </Suspense>
      )}

      {/* 3D Digital Twin Viewer Modal */}
      {selectedProjectForTwin && (
        <Suspense fallback={null}>
          <DigitalTwinViewer
            project={selectedProjectForTwin.project}
            initialUnitId={selectedProjectForTwin.initialUnitId}
            onClose={() => setSelectedProjectForTwin(null)}
          />
        </Suspense>
      )}

      {/* Multi-Unit Side-by-Side Comparison Matrix Modal */}
      {isComparisonOpen && (
        <Suspense fallback={null}>
          <ComparisonMatrixModal
            unitIds={comparisonUnitIds}
            onClose={() => setIsComparisonOpen(false)}
            onSelectUnitForDigitalTwin={(unit) => {
              const matchedProject = projects.find((p) => p.id === unit.projectId);
              if (matchedProject) {
                openAssetExperience(matchedProject, unit.id);
                setIsComparisonOpen(false);
              }
            }}
          />
        </Suspense>
      )}

      {/* Schedule Private Site Visit Modal */}
      {selectedProjectForVisit && (
        <Suspense fallback={null}>
          <SiteVisitModal project={selectedProjectForVisit} onClose={() => setSelectedProjectForVisit(null)} />
        </Suspense>
      )}

      {/* Sell / List Property Modal */}
      {isSellModalOpen && (
        <Suspense fallback={null}>
          <SellPropertyModal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} theme={theme} />
        </Suspense>
      )}

      {/* Unified Enterprise Authentication Modal (Customer OTP vs Enterprise Admin MFA) */}
      {isLoginModalOpen && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={isLoginModalOpen}
            theme={theme}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={(session) => {
              setUserSession(session);
              setIsLoginModalOpen(false);
              if (session.role === 'CUSTOMER') {
                setActiveTab('vip');
              } else {
                setIsAdminCmsOpen(true);
              }
            }}
          />
        </Suspense>
      )}

      {/* Enterprise Admin CMS Console with RBAC, Quality Score & Version Rollbacks */}
      {isAdminCmsOpen && userSession && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black animate-fadeIn">
          <Suspense fallback={<ModuleLoadingFallback />}>
            <AdminCmsConsole
              session={userSession}
              projects={projects}
              properties={properties}
              theme={theme}
              onClose={() => setIsAdminCmsOpen(false)}
            />
          </Suspense>
        </div>
      )}

      {/* DOCUMENT CENTER & AI EXPLAINER MODAL (ITEMS 96 & 97) */}
      {isDocCenterOpen && (
        <Suspense fallback={null}>
          <DocumentCenterModal
            isOpen={isDocCenterOpen}
            onClose={() => setIsDocCenterOpen(false)}
            userSession={userSession}
            theme={theme}
          />
        </Suspense>
      )}

      {/* CUSTOMER PROPERTY DOSSIER REPORT GENERATOR MODAL (ITEM 98) */}
      {isReportModalOpen && (
        <Suspense fallback={null}>
          <CustomerReportGeneratorModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            project={activeReportTarget.project || projects[0]}
            property={activeReportTarget.property}
            unit={activeReportTarget.unit}
            currency={currency}
            theme={theme}
          />
        </Suspense>
      )}

      {/* OMNICHANNEL SHARE ENGINE MODAL (ITEMS 99 & 100) */}
      {isShareModalOpen && (
        <Suspense fallback={null}>
          <ShareEngineModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            data={activeShareTarget}
            currency={currency}
            theme={theme}
          />
        </Suspense>
      )}

      {/* CUSTOMER JOURNEY PASSPORT MODAL (ITEMS 101-105) */}
      {isPassportModalOpen && (
        <Suspense fallback={null}>
          <CustomerJourneyPassportModal
            isOpen={isPassportModalOpen}
            onClose={() => setIsPassportModalOpen(false)}
            userSession={userSession}
            theme={theme}
          />
        </Suspense>
      )}

      {/* NRI GLOBAL DESK & MULTI-CURRENCY CONVERTER MODAL (ITEMS 106 & 107) */}
      {isNriModalOpen && (
        <Suspense fallback={null}>
          <NriExperienceModal
            isOpen={isNriModalOpen}
            onClose={() => setIsNriModalOpen(false)}
            selectedCurrency={currency}
            onSelectCurrency={(cur) => setCurrency(cur)}
            theme={theme}
          />
        </Suspense>
      )}

      {/* DPDPA 2023 DATA PRIVACY & CONSENT MANAGEMENT MODAL (ITEM 127) */}
      {isPrivacyCenterOpen && (
        <Suspense fallback={null}>
          <DataPrivacyCenterModal
            isOpen={isPrivacyCenterOpen}
            onClose={() => setIsPrivacyCenterOpen(false)}
            userSession={userSession}
            theme={theme}
          />
        </Suspense>
      )}

      {/* PAYMENT SECURITY & TOKENIZED ESCROW LEDGER (ITEM 128) */}
      {isPaymentSecurityOpen && (
        <Suspense fallback={null}>
          <PaymentSecurityModal
            isOpen={isPaymentSecurityOpen}
            onClose={() => setIsPaymentSecurityOpen(false)}
            theme={theme}
          />
        </Suspense>
      )}

      {/* FLOATING ACCESSIBILITY SUITE (ITEM 135) */}
      <AccessibilityToolbar
        theme={theme}
        onToggleTheme={() => handleSetTheme(theme === 'dark' ? 'light' : 'dark')}
      />
    </div>
  );
}
