/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { DiscoveryHomepage } from './components/DiscoveryHomepage';
import { Project, Property, Unit, UserSession, CurrencyCode, Locality } from './types';
import { Layers, X, ShieldCheck, ExternalLink, CheckCircle2 } from 'lucide-react';
import { adminAuthService } from './services/adminAuthService';
import { StatusCommandBar } from './components/auth/StatusCommandBar';
import { AuthStatusSwitcher } from './components/auth/AuthStatusSwitcher';
import { AuthPortalView } from './components/auth/AuthPortalView';
import { lazyWithRetry } from './services/lazyWithRetry';
import { ErrorBoundary } from './components/ErrorBoundary';

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
const WhatsAppOnboardingModal = lazy(() =>
  import('./components/WhatsAppOnboardingModal').then((m) => ({ default: m.WhatsAppOnboardingModal }))
);
const MyManagedListingsModal = lazy(() =>
  import('./components/MyManagedListingsModal').then((m) => ({ default: m.MyManagedListingsModal }))
);
const ProjectSchemaSuiteModal = lazy(() =>
  import('./components/ProjectSchemaSuiteModal').then((m) => ({ default: m.ProjectSchemaSuiteModal }))
);
const ResidentialProjectSchemaWizard = lazy(() =>
  import('./components/ResidentialProjectSchemaWizard').then((m) => ({ default: m.ResidentialProjectSchemaWizard }))
);
const UniversalPropertyListingFormModal = lazy(() =>
  import('./components/UniversalPropertyListingFormModal').then((m) => ({ default: m.UniversalPropertyListingFormModal }))
);
const PropertyProjectEditorModal = lazy(() =>
  import('./components/PropertyProjectEditorModal').then((m) => ({ default: m.PropertyProjectEditorModal }))
);
const BlogIntelligenceView = lazy(() =>
  import('./components/BlogIntelligenceView').then((m) => ({ default: m.BlogIntelligenceView }))
);
const CareerPage = lazyWithRetry(
  () => import('./components/CareerPage'),
  'CareerPage'
);
const DevelopersDirectoryPage = lazyWithRetry(
  () => import('./components/developers/DevelopersDirectoryPage'),
  'DevelopersDirectoryPage'
);
const DeveloperProfilePage = lazyWithRetry(
  () => import('./components/developers/DeveloperProfilePage'),
  'DeveloperProfilePage'
);
const LocalitiesDirectoryPage = lazyWithRetry(
  () => import('./components/localities/LocalitiesDirectoryPage'),
  'LocalitiesDirectoryPage'
);
const LocalityDetailPage = lazyWithRetry(
  () => import('./components/localities/LocalityDetailPage'),
  'LocalityDetailPage'
);
const LocalityMatchmakerModal = lazyWithRetry(
  () => import('./components/localities/LocalityMatchmakerModal'),
  'LocalityMatchmakerModal'
);
const AdminLocalitiesPanel = lazyWithRetry(
  () => import('./components/localities/AdminLocalitiesPanel'),
  'AdminLocalitiesPanel'
);
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { NetworkStatusBanner } from './components/NetworkStatusBanner';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { FloatingKiaanAIButton, FloatingKiaanAIContext } from './components/FloatingKiaanAIButton';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { KiaanPropertiesLogo } from './components/KiaanBrandLogo';
import { seoEngine } from './services/seoAndMetadataEngine';
import { offlineAndPwaService } from './services/offlineAndPwaService';
import { globalKiaanStore } from './services/store';

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
    | 'explore'
    | 'login'
    | 'search'
    | 'map'
    | 'family'
    | 'share'
    | 'contracts'
    | 'finance'
    | 'vip'
    | 'ai'
    | 'calculators'
    | 'rera'
    | 'commercial'
    | 'blog'
    | 'careers'
    | 'developers'
    | 'developer-profile'
    | 'phase04'
    | 'phase03'
    | 'phase02'
    | 'phase01'
  >('explore');
  const [customerMode, setCustomerMode] = useState<'BUY' | 'RENT_LEASE' | 'INVEST' | 'COMMERCIAL'>('BUY');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [selectedDeveloperSlug, setSelectedDeveloperSlug] = useState<string | null>(null);

  // Locality Intelligence State
  const [localities, setLocalities] = useState<Locality[]>(() => globalKiaanStore.getLocalities());
  const [selectedLocalitySlug, setSelectedLocalitySlug] = useState<string>('wakad');
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);
  const [isAdminLocalitiesOpen, setIsAdminLocalitiesOpen] = useState(false);

  // Subscribe to store updates for real-time reactivity across localities
  useEffect(() => {
    const unsubscribe = globalKiaanStore.subscribe(() => {
      setLocalities(globalKiaanStore.getLocalities());
    });
    return () => unsubscribe();
  }, []);

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
  const [selectedProjectForVisit, setSelectedProjectForVisit] = useState<any | null>(null);
  const [selectedProjectForTwin, setSelectedProjectForTwin] = useState<{ project: Project; initialUnitId?: string } | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminCmsOpen, setIsAdminCmsOpen] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('kiaan_user_session');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse saved user session', e);
    }
    return null;
  });

  const handleUpdateUserSession = (session: UserSession | null) => {
    setUserSession(session);
    try {
      if (session) {
        localStorage.setItem('kiaan_user_session', JSON.stringify(session));
      } else {
        localStorage.removeItem('kiaan_user_session');
      }
    } catch (e) {
      console.warn('Could not save user session to localStorage', e);
    }
  };

  // New Modals State (Items 97-107, 127-128, 143-149)
  const [isDocCenterOpen, setIsDocCenterOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);
  const [isNriModalOpen, setIsNriModalOpen] = useState(false);
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const [isPaymentSecurityOpen, setIsPaymentSecurityOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isMyManagedListingsOpen, setIsMyManagedListingsOpen] = useState(false);
  const [isProjectSchemaSuiteOpen, setIsProjectSchemaSuiteOpen] = useState(false);
  const [isResidentialWizardOpen, setIsResidentialWizardOpen] = useState(false);
  const [isUniversalListingModalOpen, setIsUniversalListingModalOpen] = useState(false);
  const [whatsAppInitialMode, setWhatsAppInitialMode] = useState<'PROPERTY' | 'PROJECT'>('PROPERTY');
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);

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

  const openLocalityExperience = (loc: Locality) => {
    setSelectedLocalitySlug(loc.slug || loc.id);
    setActiveTab('locality-page');
    window.location.hash = `localities/${loc.city.toLowerCase()}/${loc.slug || loc.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetch('/api/v1/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setProjects(data.data);
          offlineAndPwaService.cacheSavedProperties(data.data);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));

    fetch('/api/v1/properties')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setProperties(data.data);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  // Deep Linking & Share Direct Landing (Item 148)
  useEffect(() => {
    if ((projects?.length || 0) === 0 && (properties?.length || 0) === 0) return;

    const handleDeepLink = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const projectParam = urlParams.get('project');
      const propertyParam = urlParams.get('property');
      const unitParam = urlParams.get('unit');
      const developerParam = urlParams.get('developer');
      const localityParam = urlParams.get('locality');
      const tabParam = urlParams.get('tab');

      if (tabParam && ['explore', 'search', 'map', 'contracts', 'finance', 'vip', 'ai', 'rera', 'commercial', 'developers', 'localities', 'careers', 'blog'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }

      if (localityParam) {
        setSelectedLocalitySlug(localityParam);
        setActiveTab('locality-page');
        return;
      }

      if (developerParam) {
        setSelectedDeveloperSlug(developerParam);
        setActiveTab('developer-profile');
        return;
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
      } else if (hash.startsWith('developer/')) {
        const devSlug = hash.split('/')[1];
        setSelectedDeveloperSlug(devSlug);
        setActiveTab('developer-profile');
      } else if (hash === 'developers') {
        setActiveTab('developers');
      } else if (hash.startsWith('localities/') || hash.startsWith('locality/')) {
        const parts = hash.split('/');
        const locSlug = parts.length > 2 ? parts[2] : parts[1];
        setSelectedLocalitySlug(locSlug);
        setActiveTab('locality-page');
      } else if (hash === 'localities') {
        setActiveTab('localities');
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
        onOpenMyListings={() => setIsMyManagedListingsOpen(true)}
        onOpenComparisonTray={() => setIsComparisonOpen(true)}
        onOpenProjectSchemaSuite={() => setIsProjectSchemaSuiteOpen(true)}
        onOpenResidentialWizard={() => setIsResidentialWizardOpen(true)}
        onOpenUniversalListingModal={() => setIsUniversalListingModalOpen(true)}
        onOpenWhatsAppOnboarding={(mode) => {
          setWhatsAppInitialMode(mode || 'PROPERTY');
          setIsWhatsAppModalOpen(true);
        }}
        userSession={userSession}
        onLogout={() => handleUpdateUserSession(null)}
        savedCount={comparisonUnitIds.length}
      />

      {/* Visual Status Command Bar: Clearly distinguishes between Logged Out / Visitor and Logged In Member states */}
      <StatusCommandBar
        theme={theme}
        session={userSession}
        savedCount={comparisonUnitIds.length + (userSession?.savedPropertyIds?.length || 0)}
        onOpenLogin={() => {
          setActiveTab('login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenVipLounge={() => {
          setActiveTab('vip');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdminCms={() => setIsAdminCmsOpen(true)}
        onQuickDemoLogin={() => {
          const session: UserSession = {
            userId: 'usr_rajesh_malhotra_01',
            name: 'Rajesh Malhotra',
            email: 'rajesh.malhotra@investor.in',
            phone: '+91 98230 45678',
            role: 'CUSTOMER',
            token: `jwt_vip_malhotra_${Date.now()}`,
            savedPropertyIds: ['prop-res-01', 'prop-res-02'],
            savedUnitIds: ['unit-1402'],
            propertyDNA: {
              budgetMin: 40000000,
              budgetMax: 90000000,
              preferredLocations: ['Wakad', 'Balewadi', 'Koregaon Park'],
              configurations: ['3.5 BHK', '4 BHK Sky Residence'],
              purpose: 'INVESTMENT_GROWTH',
              timeline: 'IMMEDIATE',
              priorities: {
                commute: 4,
                lifestyleAmenities: 5,
                spaciousLayout: 5,
                appreciationPotential: 5,
                schoolProximity: 3,
              },
            },
          };
          handleUpdateUserSession(session);
        }}
        onLogout={() => handleUpdateUserSession(null)}
      />

      {/* CORE DIGITAL PRODUCT EXPERIENCE (When viewing an individual Project, Unit, or Property) */}
      {selectedExperienceAsset ? (
        <Suspense fallback={<ModuleLoadingFallback />}>
          {selectedExperienceAsset.type === 'PROPERTY' && selectedExperienceAsset.property ? (
            <PropertyExperiencePage
              property={selectedExperienceAsset.property}
              session={userSession}
              theme={theme}
              onBackToDiscovery={() => {
                setSelectedExperienceAsset(null);
                window.location.hash = '';
              }}
              onPropertyUpdated={(upd) => {
                setProperties((prev) => prev.map((p) => (p.id === upd.id ? upd : p)));
              }}
            />
          ) : selectedExperienceAsset.type === 'PROJECT' && selectedExperienceAsset.project ? (
            <ProjectExperiencePage
              project={selectedExperienceAsset.project}
              session={userSession}
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
              onProjectUpdated={(upd) => {
                setProjects((prev) => prev.map((p) => (p.id === upd.id ? upd : p)));
              }}
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
              userSession={userSession}
              onOpenAssetExperience={openAssetExperience}
              onOpenPropertyExperience={openPropertyExperience}
              onOpenScheduleVisit={(p) => setSelectedProjectForVisit(p)}
              onNavigateToTab={(tab) => {
                if (tab === 'login') {
                  setActiveTab('login');
                } else {
                  setActiveTab(tab as any);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenSellModal={() => setIsSellModalOpen(true)}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              onOpenWhatsAppOnboarding={(mode) => {
                setWhatsAppInitialMode(mode || 'PROPERTY');
                setIsWhatsAppModalOpen(true);
              }}
              onExecuteSearchQuery={(q) => {
                setActiveTab('search');
              }}
            />
          )}

          {/* TAB 1.5: DEDICATED AUTHENTICATION & PRIVATE MEMBER ACCESS PORTAL */}
          {activeTab === 'login' && (
            <AuthPortalView
              theme={theme}
              currentSession={userSession}
              onLoginSuccess={(session) => {
                handleUpdateUserSession(session);
                if (session.role === 'CUSTOMER') {
                  setActiveTab('vip');
                } else if (session.role === 'SUPER_ADMIN' || session.role === 'ADMIN') {
                  setIsAdminCmsOpen(true);
                  setActiveTab('explore');
                } else {
                  setActiveTab('explore');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLogout={() => handleUpdateUserSession(null)}
              onNavigateHome={() => {
                setActiveTab('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenVipLounge={() => {
                setActiveTab('vip');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAdminCms={() => setIsAdminCmsOpen(true)}
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
                userSession={userSession}
                onOpenLogin={() => {
                  setActiveTab('login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onQuickDemoLogin={() => {
                  const session: UserSession = {
                    userId: 'usr_rajesh_malhotra_01',
                    name: 'Rajesh Malhotra',
                    email: 'rajesh.malhotra@investor.in',
                    phone: '+91 98230 45678',
                    role: 'CUSTOMER',
                    token: `jwt_vip_malhotra_${Date.now()}`,
                    savedPropertyIds: ['prop-res-01', 'prop-res-02'],
                    savedUnitIds: ['unit-1402'],
                    propertyDNA: {
                      budgetMin: 40000000,
                      budgetMax: 90000000,
                      preferredLocations: ['Wakad', 'Balewadi', 'Koregaon Park'],
                      configurations: ['3.5 BHK', '4 BHK Sky Residence'],
                      purpose: 'INVESTMENT_GROWTH',
                      timeline: 'IMMEDIATE',
                      priorities: {
                        commute: 4,
                        lifestyleAmenities: 5,
                        spaciousLayout: 5,
                        appreciationPotential: 5,
                        schoolProximity: 3,
                      },
                    },
                  };
                  handleUpdateUserSession(session);
                }}
                onOpenDigitalTwin={(proj, uId) => openAssetExperience(proj, uId)}
                onAddToComparison={handleAddToComparison}
              />
            </Suspense>
          )}

          {/* TAB 6: KIAAN INTELLIGENCE™ AI CONCIERGE */}
          {activeTab === 'ai' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <KiaanAIChat initialPrompt={aiInitialPrompt} />
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

          {/* TAB 10: KIAAN JOURNAL & REAL ESTATE EDITORIAL INTELLIGENCE (BLOG) */}
          {activeTab === 'blog' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <BlogIntelligenceView
                theme={theme}
                onNavigateToTab={(tab) => {
                  setActiveTab(tab as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenProjectBySlug={(slug) => {
                  const matchProj = projects.find((p) => p.slug === slug || p.id === slug);
                  if (matchProj) {
                    openAssetExperience(matchProj);
                  } else {
                    setActiveTab('search');
                  }
                }}
                onAskKiaanAI={(prompt) => {
                  if (prompt) setAiInitialPrompt(prompt);
                  setActiveTab('ai');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </Suspense>
          )}

          {/* TAB 11: CAREERS & TALENT RECRUITMENT HUB */}
          {activeTab === 'careers' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <CareerPage
                theme={theme}
                userSession={userSession}
                onNavigateHome={() => {
                  setActiveTab('explore');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenAdminCms={() => setIsAdminCmsOpen(true)}
              />
            </Suspense>
          )}

          {/* TAB 12: REAL ESTATE DEVELOPERS DIRECTORY */}
          {activeTab === 'developers' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <DevelopersDirectoryPage
                theme={theme}
                onSelectDeveloper={(dev) => {
                  setSelectedDeveloperSlug(dev.slug || dev.id);
                  setActiveTab('developer-profile');
                  window.location.hash = `developer/${dev.slug || dev.id}`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </Suspense>
          )}

          {/* TAB 13: DEVELOPER PROFILE PAGE */}
          {activeTab === 'developer-profile' && (
            <Suspense fallback={<ModuleLoadingFallback />}>
              <DeveloperProfilePage
                developerSlugOrId={selectedDeveloperSlug || 'panchshil-realty'}
                theme={theme}
                onBack={() => {
                  setActiveTab('developers');
                  window.location.hash = 'developers';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectProject={(project) => {
                  openAssetExperience(project);
                }}
                onSelectDeveloper={(dev) => {
                  setSelectedDeveloperSlug(dev.slug || dev.id);
                  window.location.hash = `developer/${dev.slug || dev.id}`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </Suspense>
          )}

          {/* TAB 14: LOCALITIES DIRECTORY PAGE */}
          {activeTab === 'localities' && (
            <ErrorBoundary fallbackTitle="Locality Intelligence Directory">
              <Suspense fallback={<ModuleLoadingFallback />}>
                <LocalitiesDirectoryPage
                  localities={localities}
                  allProjects={projects}
                  allProperties={properties}
                  onSelectLocality={(loc) => openLocalityExperience(loc)}
                  onOpenMatchmaker={() => setIsMatchmakerOpen(true)}
                  onOpenAdminPanel={() => setIsAdminLocalitiesOpen(true)}
                  canAccessAdmin={true}
                  theme={theme}
                />
              </Suspense>
            </ErrorBoundary>
          )}

          {/* TAB 15: DYNAMIC LOCALITY INTELLIGENCE PAGE */}
          {activeTab === 'locality-page' && (
            <ErrorBoundary fallbackTitle="Locality Deep Intelligence">
              <Suspense fallback={<ModuleLoadingFallback />}>
                <LocalityDetailPage
                  locality={
                    globalKiaanStore.getLocalityBySlug(selectedLocalitySlug) ||
                    localities[0]
                  }
                  allProjects={projects}
                  allProperties={properties}
                  allLocalities={localities}
                  onBack={() => {
                    setActiveTab('localities');
                    window.location.hash = 'localities';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onSelectLocality={(loc) => openLocalityExperience(loc)}
                  onSelectProject={(project) => {
                    openAssetExperience(project);
                  }}
                  onSelectProperty={(property) => {
                    openPropertyExperience(property);
                  }}
                  onOpenMatchmaker={() => setIsMatchmakerOpen(true)}
                  theme={theme}
                />
              </Suspense>
            </ErrorBoundary>
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
      {(comparisonUnitIds?.length || 0) > 0 && !isComparisonOpen && (
        <div className="fixed bottom-20 lg:bottom-6 left-6 z-40 animate-slide-up">
          <div
            className={`flex items-center gap-3 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl ${
              isDark ? 'bg-[#0E1524]/95 border-amber-500/40 text-white' : 'bg-white/95 border-slate-300 text-slate-900 shadow-xl'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs font-bold">
                {comparisonUnitIds?.length || 0} Units in Comparison
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Top Brand & Navigation Links */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b pb-8 border-current/10">
            <div
              onClick={() => {
                setSelectedExperienceAsset(null);
                setActiveTab('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer"
            >
              <KiaanPropertiesLogo theme={theme} size="lg" animated />
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs">
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('explore'); }} className="hover:text-amber-500 transition-colors">Residences</button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('search'); }} className="hover:text-amber-500 transition-colors">Digital Twins</button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('blog'); }} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">Journal & Intelligence</button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('careers'); }} className="text-red-400 hover:text-red-300 font-bold transition-colors flex items-center gap-1">
                <span>Careers & Hiring</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-600 text-white font-mono">HIRING</span>
              </button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('finance'); }} className="hover:text-amber-500 transition-colors">Financial Intelligence</button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('vip'); }} className="hover:text-amber-500 transition-colors">VIP Concierge</button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('contracts'); }} className="hover:text-amber-500 transition-colors">Contracts & Escrow</button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('rera'); }} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>MahaRERA Suite</span>
              </button>
              <button
                onClick={() => {
                  setWhatsAppInitialMode('PROPERTY');
                  setIsWhatsAppModalOpen(true);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer"
              >
                + Add Property via WhatsApp
              </button>
              <button
                onClick={() => {
                  setWhatsAppInitialMode('PROJECT');
                  setIsWhatsAppModalOpen(true);
                }}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
              >
                + Add Project via WhatsApp
              </button>
              <button onClick={() => { setSelectedExperienceAsset(null); setActiveTab('phase04'); }} className="text-amber-500 hover:text-amber-400 transition-colors">Engineering Audits</button>
            </div>
          </div>

          {/* Prominent WhatsApp Assisted Onboarding & Concierge Banner */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              isDark
                ? 'bg-gradient-to-r from-emerald-950/30 via-[#0B101C] to-emerald-950/15 border-emerald-500/30 shadow-xl'
                : 'bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-emerald-300 shadow-md'
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    WhatsApp Assisted Intake Desk
                  </span>
                  <span className="text-[11px] opacity-75">
                    Multilingual NLP • Voice Notes • Zero Form Fatigue
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h4 className="text-base sm:text-lg font-serif font-bold text-current">
                    List Your Asset or Master Project via WhatsApp
                  </h4>
                  <a
                    href="https://wa.me/917796655556?text=Hi%20Kiaan%2C%20I%20want%20to%20list%20my%20property%20or%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>+91 77966 55556 (WhatsApp Listing Desk)</span>
                  </a>
                </div>
                <p className="text-[11px] opacity-75 leading-relaxed">
                  Send conversational Hindi/English text, voice recordings, photos, or MahaRERA sanction PDFs. Our AI normalizes pricing (₹ Cr / Lakhs / ₹ per sq.ft), audits title encumbrances, and compiles a canonical draft for rapid review.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setWhatsAppInitialMode('PROPERTY');
                    setIsWhatsAppModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span>+ List Property on WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    setWhatsAppInitialMode('PROJECT');
                    setIsWhatsAppModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <span>+ Onboard Master Project</span>
                </button>

                <a
                  href="https://wa.me/917796655556?text=Hi%20Kiaan%2C%20I%20want%20to%20list%20my%20property%20or%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-current/10 hover:bg-current/20 text-current text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Direct WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Prominent Statutory MahaRERA Compliance Showcase Banner */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              isDark
                ? 'bg-gradient-to-r from-emerald-950/20 via-black to-amber-950/15 border-emerald-500/25 shadow-xl'
                : 'bg-gradient-to-r from-emerald-50 via-slate-50 to-amber-50 border-emerald-200 shadow-md'
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Official Regulatory Compliance
                  </span>
                  <span className="text-[11px] opacity-70">
                    Maharashtra Real Estate Regulatory Authority (MahaRERA)
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h4 className="text-base sm:text-lg font-serif font-bold text-current">
                    Kiaan Properties Registered Real Estate Agent
                  </h4>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-bold text-sm tracking-wider">
                    <span>MahaRERA Reg. No:</span>
                    <strong className="text-amber-300 font-mono text-base">A031262603640</strong>
                  </div>
                </div>
                <p className="text-[11px] opacity-75 leading-relaxed">
                  All property listings, layouts, and escrow bank accounts displayed on Kiaan Properties are verified in accordance with MahaRERA statutory standards and Section 4(2)(l)(D) of the RERA Act 2016.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setSelectedExperienceAsset(null);
                    setActiveTab('rera');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Explore Compliance Dossier</span>
                </button>

                <a
                  href="https://maharera.mahaonline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>Verify on MahaRERA Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] opacity-75 border-t pt-6 border-current/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Kiaan Properties • MahaRERA Certified Real Estate Agent Reg. No: <strong>A031262603640</strong>
              </span>
            </div>
            <div>
              © 2026 Kiaan Properties. All Rights Reserved.
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
            units={(() => {
              const allUnits = (projects || []).flatMap((p) =>
                (p.towers || []).flatMap((t) => (t.floors || []).flatMap((f) => f.units || []))
              );
              return allUnits.filter((u) => (comparisonUnitIds || []).includes(u.id));
            })()}
            onClose={() => setIsComparisonOpen(false)}
            onRemoveUnit={(unitId) => setComparisonUnitIds((prev) => (prev || []).filter((id) => id !== unitId))}
            onHoldUnit={(unit) => {
              const matchedProject = (projects || []).find((p) => p.id === unit.projectId);
              if (matchedProject) {
                openAssetExperience(matchedProject, unit.id);
                setIsComparisonOpen(false);
              }
            }}
            onSelectUnitForDigitalTwin={(unit) => {
              const matchedProject = (projects || []).find((p) => p.id === unit.projectId);
              if (matchedProject) {
                openAssetExperience(matchedProject, unit.id);
                setIsComparisonOpen(false);
              }
            }}
          />
        </Suspense>
      )}

      {/* Schedule Private Site Visit & Viewing Modal */}
      {selectedProjectForVisit && (
        <Suspense fallback={null}>
          <SiteVisitModal
            asset={selectedProjectForVisit}
            userSession={userSession}
            onClose={() => setSelectedProjectForVisit(null)}
            onNavigateToTab={(tab) => {
              setActiveTab(tab as any);
              setSelectedProjectForVisit(null);
            }}
          />
        </Suspense>
      )}

      {/* Sell / List Property Modal */}
      {isSellModalOpen && (
        <Suspense fallback={null}>
          <SellPropertyModal
            isOpen={isSellModalOpen}
            onClose={() => setIsSellModalOpen(false)}
            theme={theme}
            onOpenWhatsAppOnboarding={() => {
              setIsSellModalOpen(false);
              setWhatsAppInitialMode('PROPERTY');
              setIsWhatsAppModalOpen(true);
            }}
            onOpenUniversalListingForm={() => {
              setIsSellModalOpen(false);
              setIsUniversalListingModalOpen(true);
            }}
          />
        </Suspense>
      )}

      {/* Universal Property Listing Form Modal (All Categories, All Sub-Types, RERA Compliance & Schema Inspector) */}
      {isUniversalListingModalOpen && (
        <Suspense fallback={null}>
          <UniversalPropertyListingFormModal
            isOpen={isUniversalListingModalOpen}
            onClose={() => setIsUniversalListingModalOpen(false)}
            theme={theme}
            onSuccessPublished={(newPropId) => {
              setProperties(globalKiaanStore.getProperties());
              const createdProp = globalKiaanStore.getPropertyById(newPropId);
              if (createdProp) {
                openPropertyExperience(createdProp);
              }
            }}
          />
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
              handleUpdateUserSession(session);
              setIsLoginModalOpen(false);
              if (session.role === 'CUSTOMER') {
                setActiveTab('vip');
              } else if (session.role === 'VISITOR') {
                // Visitor session active with saved shortlists & DNA profile
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
              onRefreshProjects={() => {
                setProjects(globalKiaanStore.getAllProjectsForAdmin());
                setProperties(globalKiaanStore.getAllPropertiesForAdmin());
              }}
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

      {/* SEO & SCHEMA.ORG JSON-LD INSPECTOR MODAL (ITEMS 143-147, 149) */}
      {isSeoModalOpen && (
        <Suspense fallback={null}>
          <SeoInspectionModal
            isOpen={isSeoModalOpen}
            onClose={() => setIsSeoModalOpen(false)}
            theme={theme}
            currentEntity={
              selectedExperienceAsset?.project
                ? {
                    id: selectedExperienceAsset.project.id,
                    type: 'PROJECT',
                    title: selectedExperienceAsset.project.name,
                    slug: selectedExperienceAsset.project.slug,
                    microMarket: selectedExperienceAsset.project.location?.microMarket || 'Pune',
                    reraNumber: selectedExperienceAsset.project.reraId,
                    data: selectedExperienceAsset.project,
                  }
                : selectedExperienceAsset?.property
                ? {
                    id: selectedExperienceAsset.property.id,
                    type: 'PROPERTY',
                    title: selectedExperienceAsset.property.title,
                    slug: selectedExperienceAsset.property.slug,
                    microMarket: selectedExperienceAsset.property.location?.microMarket || 'Pune',
                    reraNumber: selectedExperienceAsset.property.reraNumber,
                    data: selectedExperienceAsset.property,
                  }
                : undefined
            }
          />
        </Suspense>
      )}

      {/* WHATSAPP PROPERTY & PROJECT ONBOARDING MODAL */}
      {isWhatsAppModalOpen && (
        <Suspense fallback={null}>
          <WhatsAppOnboardingModal
            isOpen={isWhatsAppModalOpen}
            onClose={() => setIsWhatsAppModalOpen(false)}
            initialMode={whatsAppInitialMode}
            theme={theme}
            onPropertyPublished={(prop) => {
              setProperties((prev) => [prop, ...prev]);
              openPropertyExperience(prop);
            }}
            onProjectPublished={(proj) => {
              setProjects((prev) => [proj, ...prev]);
              openAssetExperience(proj);
            }}
          />
        </Suspense>
      )}

      {/* USER LISTINGS & PORTFOLIO MANAGEMENT MODAL (ADD, EDIT, DELETE BY CREATOR) */}
      {isMyManagedListingsOpen && (
        <Suspense fallback={null}>
          <MyManagedListingsModal
            isOpen={isMyManagedListingsOpen}
            onClose={() => setIsMyManagedListingsOpen(false)}
            session={userSession}
            theme={theme}
            onOpenProject={(proj) => openAssetExperience(proj)}
            onOpenProperty={(prop) => openPropertyExperience(prop)}
            onDataChanged={() => {
              setProjects(globalKiaanStore.getProjects());
              setProperties(globalKiaanStore.getProperties());
            }}
          />
        </Suspense>
      )}

      {/* 29-SECTION MASTER PROJECT SCHEMA SUITE DIAGNOSTIC MODAL */}
      {isProjectSchemaSuiteOpen && (
        <Suspense fallback={null}>
          <ProjectSchemaSuiteModal
            isOpen={isProjectSchemaSuiteOpen}
            onClose={() => setIsProjectSchemaSuiteOpen(false)}
            theme={theme}
            onLaunchWizard={() => {
              setIsProjectSchemaSuiteOpen(false);
              setIsResidentialWizardOpen(true);
            }}
          />
        </Suspense>
      )}

      {/* 7-STEP MASTER RESIDENTIAL PROJECT POSTING WIZARD */}
      {isResidentialWizardOpen && (
        <Suspense fallback={null}>
          <ResidentialProjectSchemaWizard
            theme={theme}
            onSave={() => {
              setIsResidentialWizardOpen(false);
              setProjects(globalKiaanStore.getProjects());
            }}
            onCancel={() => setIsResidentialWizardOpen(false)}
          />
        </Suspense>
      )}

      {/* PWA INSTALL BANNER (ITEM 141) */}
      <PwaInstallBanner theme={theme} />

      {/* AI LOCALITY MATCHMAKER MODAL */}
      {isMatchmakerOpen && (
        <ErrorBoundary fallbackTitle="Locality Matchmaker">
          <Suspense fallback={null}>
            <LocalityMatchmakerModal
              isOpen={isMatchmakerOpen}
              onClose={() => setIsMatchmakerOpen(false)}
              localities={localities}
              projects={projects}
              onSelectLocality={(loc) => openLocalityExperience(loc)}
              onSelectProject={(proj) => openAssetExperience(proj)}
            />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* ADMIN LOCALITIES MANAGEMENT MODAL */}
      {isAdminLocalitiesOpen && (
        <ErrorBoundary fallbackTitle="Locality Management Console">
          <Suspense fallback={null}>
            <AdminLocalitiesPanel
              localities={localities}
              onClose={() => setIsAdminLocalitiesOpen(false)}
              onLocalityUpdated={() => setLocalities(globalKiaanStore.getLocalities())}
            />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* CONTEXTUAL SIGNATURE FLOATING KIAAN AI INTERACTION (VISIBLE ON HERO, PROJECTS, AND SEARCH) */}
      {activeTab !== 'ai' && (
        <FloatingKiaanAIButton
          theme={theme}
          context={
            selectedExperienceAsset
              ? {
                  type: 'project',
                  title: selectedExperienceAsset.project?.name || selectedExperienceAsset.property?.title,
                  subtitle: selectedExperienceAsset.project?.tagline,
                  microMarket:
                    selectedExperienceAsset.project?.location?.microMarket ||
                    selectedExperienceAsset.property?.location?.microMarket,
                  price: selectedExperienceAsset.project?.priceRange || 'Luxury',
                  reraId:
                    selectedExperienceAsset.project?.reraId ||
                    selectedExperienceAsset.property?.reraNumber,
                }
              : activeTab === 'search'
              ? {
                  type: 'search',
                  title: 'Unified Spatial Search & Filtering',
                }
              : {
                  type: 'homepage',
                  title: 'Kiaan Properties Private Client Luxury',
                }
          }
          onOpenAI={(prompt) => {
            if (prompt) {
              setAiInitialPrompt(prompt);
            }
            setActiveTab('ai');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* FLOATING WHATSAPP ASSISTED ONBOARDING BUTTON */}
      <FloatingWhatsAppButton
        theme={theme}
        onOpenWhatsAppOnboarding={(mode) => {
          setWhatsAppInitialMode(mode);
          setIsWhatsAppModalOpen(true);
        }}
      />

      {/* FLOATING ACCESSIBILITY SUITE (ITEM 135) */}
      <AccessibilityToolbar
        theme={theme}
        onToggleTheme={() => handleSetTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      {/* FLOATING AUTH STATUS PERSONA SWITCHER FOR INSTANT TESTING & REVIEW */}
      <AuthStatusSwitcher
        theme={theme}
        currentSession={userSession}
        onSelectSession={(session) => handleUpdateUserSession(session)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenFullAuthPortal={() => {
          setActiveTab('login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
