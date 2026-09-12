/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Calculator,
  Compass,
  Building2,
  MapPin,
  QrCode,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  Search,
  ExternalLink,
  Layers,
  Copy,
  Check,
  Zap,
  Phone,
  MessageSquare,
  Calendar,
  Eye,
  BarChart3,
  SlidersHorizontal,
} from 'lucide-react';
import {
  MASTER_PROJECT_SCHEMA_FIELDS,
  FieldDefinition,
  FieldClassification,
  calculateListingQualityScore,
  calculateEstimatedTotalCost,
  generateSmartProjectContent,
  calculateCustomerEngagementScore,
  ComprehensiveProjectData,
} from '../services/projectSchemaService';

interface ProjectSchemaSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
  onOpenPostingWizard?: () => void;
}

export const ProjectSchemaSuiteModal: React.FC<ProjectSchemaSuiteModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
  onOpenPostingWizard,
}) => {
  const isDark = theme === 'dark';

  // Navigation Tabs inside the Schema Suite
  const [activeTab, setActiveTab] = useState<
    'DICTIONARY' | 'QUALITY_SCORE' | 'COST_ENGINE' | 'AI_GENERATOR' | 'ENGAGEMENT' | 'VALIDATION_RULES'
  >('DICTIONARY');

  // Dictionary Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<'ALL' | FieldClassification>('ALL');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');

  // Copy indicator
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Sections list for filtering
  const sections = useMemo(() => {
    const set = new Set<string>();
    MASTER_PROJECT_SCHEMA_FIELDS.forEach((f) => set.add(f.section));
    return Array.from(set);
  }, []);

  // Filtered Schema Fields
  const filteredFields = useMemo(() => {
    return MASTER_PROJECT_SCHEMA_FIELDS.filter((f) => {
      const matchSearch =
        !searchQuery ||
        f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.section.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = classificationFilter === 'ALL' || f.classification === classificationFilter;
      const matchSec = selectedSection === 'ALL' || f.section === selectedSection;
      return matchSearch && matchClass && matchSec;
    });
  }, [searchQuery, classificationFilter, selectedSection]);

  // --------------------------------------------------------------------------
  // INTERACTIVE COST SHEET SIMULATOR STATE
  // --------------------------------------------------------------------------
  const [simBasePrice, setSimBasePrice] = useState<number>(18500000);
  const [simCarpetSqFt, setSimCarpetSqFt] = useState<number>(1450);
  const [simFloorNumber, setSimFloorNumber] = useState<number>(12);
  const [simFloorRise, setSimFloorRise] = useState<number>(60000);
  const [simPlc, setSimPlc] = useState<number>(450000);
  const [simParking, setSimParking] = useState<number>(500000);
  const [simClubhouse, setSimClubhouse] = useState<number>(350000);
  const [simInfra, setSimInfra] = useState<number>(250000);
  const [simAdvMaint, setSimAdvMaint] = useState<number>(180000);
  const [simStampDutyPct, setSimStampDutyPct] = useState<number>(6.0);
  const [simGstPct, setSimGstPct] = useState<number>(5.0);

  const costCalculation = useMemo(() => {
    return calculateEstimatedTotalCost({
      basePrice: simBasePrice,
      carpetAreaSqFt: simCarpetSqFt,
      floorNumber: simFloorNumber,
      floorRisePerFloor: simFloorRise,
      plcCharges: simPlc,
      parkingCharges: simParking,
      clubhouseCharges: simClubhouse,
      infraCharges: simInfra,
      advanceMaintenanceCharges: simAdvMaint,
      stampDutyPercent: simStampDutyPct,
      gstPercent: simGstPct,
    });
  }, [
    simBasePrice,
    simCarpetSqFt,
    simFloorNumber,
    simFloorRise,
    simPlc,
    simParking,
    simClubhouse,
    simInfra,
    simAdvMaint,
    simStampDutyPct,
    simGstPct,
  ]);

  // --------------------------------------------------------------------------
  // LISTING QUALITY SCORE (LQS) AUDIT SIMULATOR STATE
  // --------------------------------------------------------------------------
  const [auditSampleData, setAuditSampleData] = useState<Partial<ComprehensiveProjectData>>({
    projectName: 'Kiaan Sky Terraces',
    developerName: 'Kiaan Luxury Developments',
    projectStatus: 'Under Construction',
    reraRegistered: true,
    reraNumber: 'P52100039281',
    completeAddress: 'Balewadi High Street Extension, Baner, Pune 411045',
    latitude: 18.5721,
    longitude: 73.7745,
    coverImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      { url: 'https://images.unsplash.com/photo-1', category: 'EXTERIOR' },
      { url: 'https://images.unsplash.com/photo-2', category: 'INTERIOR' },
      { url: 'https://images.unsplash.com/photo-3', category: 'AMENITIES' },
      { url: 'https://images.unsplash.com/photo-4', category: 'CLUBHOUSE' },
    ],
    floorPlanImages: ['https://images.unsplash.com/floorplan1'],
    masterPlanUrl: 'https://images.unsplash.com/masterplan',
    selectedAmenities: ['am_inf_pool', 'am_clubhouse', 'am_gym', 'am_spa', 'am_ev', 'am_concierge', 'am_theatre'],
    distanceMatrix: [
      { category: 'Metro Station', name: 'Baner Metro', distanceKm: 0.8, commuteMinutes: 3 },
      { category: 'IT Park', name: 'Hinjewadi Phase 1', distanceKm: 4.2, commuteMinutes: 12 },
      { category: 'School', name: 'The Orchid School', distanceKm: 1.5, commuteMinutes: 5 },
      { category: 'Hospital', name: 'Jupiter Hospital', distanceKm: 2.1, commuteMinutes: 7 },
    ],
    constructionPercentage: 68,
    constructionStage: 'Slab Casting',
    unitConfigurations: [
      {
        id: 'c1',
        name: '3 BHK Grande',
        bhkType: '3 BHK',
        bedrooms: 3,
        bathrooms: 3,
        carpetAreaSqFt: 1450,
        startingPrice: 18500000,
        parkingIncluded: true,
        availabilityStatus: 'Available',
      },
    ],
    costSheet: {
      baseRatePerSqFt: 12750,
      startingPrice: 18500000,
      floorRisePerFloor: 60000,
      plcCharges: 450000,
      parkingCharges: 500000,
      clubhouseCharges: 350000,
      infrastructureCharges: 250000,
      advanceMaintenanceCharges: 180000,
      stampDutyPercent: 6.0,
      registrationCharges: 30000,
      gstPercent: 5.0,
      bookingAmount: 500000,
      paymentPlans: ['Construction Linked (CLP)'],
      emiStartingFrom: 135000,
      homeLoanAvailable: true,
      bankTieUps: ['HDFC', 'SBI', 'ICICI'],
      estimatedTotalAcquisitionCost: 21545000,
    },
    siteVisitInfo: {
      siteVisitAvailable: true,
      siteOfficeAddress: 'Survey 48, Datta Mandir Road, Wakad',
      siteOfficePhone: '+91 98230 11000',
      siteVisitDaysHours: 'Mon-Sun: 9:30 AM to 6:30 PM',
      appointmentRequired: true,
      virtualSiteVisitAvailable: true,
      complimentaryPickupDrop: true,
      sampleFlatAvailable: true,
    },
    seoTitle: 'Kiaan Sky Terraces Baner Pune | 3 & 4 BHK Luxury Residences',
    metaDescription: 'Discover Kiaan Sky Terraces in Baner, Pune. RERA registered P52100039281. Download verified floor plans and itemized cost sheets.',
    faqs: [
      { id: 'f1', question: 'What is the starting price?', answer: 'Starting at ₹1.85 Cr base.' },
      { id: 'f2', question: 'Is the project MahaRERA approved?', answer: 'Yes, RERA # P52100039281.' },
      { id: 'f3', question: 'When is possession?', answer: 'December 2027.' },
    ],
  });

  const auditScore = useMemo(() => {
    return calculateListingQualityScore(auditSampleData);
  }, [auditSampleData]);

  // --------------------------------------------------------------------------
  // AI CONTENT GENERATOR PREVIEW
  // --------------------------------------------------------------------------
  const aiGenerated = useMemo(() => {
    return generateSmartProjectContent(auditSampleData);
  }, [auditSampleData]);

  // --------------------------------------------------------------------------
  // ENGAGEMENT SIMULATOR STATE
  // --------------------------------------------------------------------------
  const [engViews, setEngViews] = useState<number>(1250);
  const [engGallery, setEngGallery] = useState<number>(680);
  const [engBrochure, setEngBrochure] = useState<number>(85);
  const [engCostSheet, setEngCostSheet] = useState<number>(64);
  const [engWhatsapp, setEngWhatsapp] = useState<number>(48);
  const [engPhone, setEngPhone] = useState<number>(32);
  const [engSiteVisits, setEngSiteVisits] = useState<number>(18);
  const [engRepeat, setEngRepeat] = useState<number>(110);

  const engagementResult = useMemo(() => {
    return calculateCustomerEngagementScore({
      viewsCount: engViews,
      galleryViewsCount: engGallery,
      brochureDownloadsCount: engBrochure,
      costSheetsDownloadedCount: engCostSheet,
      whatsappClicksCount: engWhatsapp,
      phoneRevealsCount: engPhone,
      siteVisitsRequestedCount: engSiteVisits,
      repeatVisitsCount: engRepeat,
    });
  }, [engViews, engGallery, engBrochure, engCostSheet, engWhatsapp, engPhone, engSiteVisits, engRepeat]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-hidden bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
          isDark
            ? 'bg-neutral-900 border-neutral-700 text-neutral-100'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-current/10 flex items-center justify-between flex-shrink-0 bg-current/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">
                  Residential New Project Custom Fields & Data Schema Suite
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  29 Structured Sections
                </span>
              </div>
              <p className="text-xs opacity-70">
                Institutional data schema for high-conversion listings, buyer trust, and SEO excellence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenPostingWizard && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPostingWizard();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Project Posting Wizard</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-current/10 transition-colors opacity-70 hover:opacity-100"
              title="Close Schema Suite"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOP NAVIGATION TABS */}
        <div className="flex items-center gap-1 px-6 border-b border-current/10 overflow-x-auto scrollbar-none bg-current/5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('DICTIONARY')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'DICTIONARY'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>1. Field Dictionary & Matrix</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-current/10">
              {MASTER_PROJECT_SCHEMA_FIELDS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('QUALITY_SCORE')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'QUALITY_SCORE'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2. Listing Quality Score (LQS)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
              {auditScore.totalScore}/100
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('COST_ENGINE')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'COST_ENGINE'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>3. Estimated Total Cost Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AI_GENERATOR')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'AI_GENERATOR'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>4. Smart Auto-Content & FAQs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ENGAGEMENT')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'ENGAGEMENT'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>5. Engagement Score Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('VALIDATION_RULES')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'VALIDATION_RULES'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>6. Validation & Publishing Rules</span>
          </button>
        </div>

        {/* TAB BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ================================================================ */}
          {/* TAB 1: FIELD DICTIONARY */}
          {/* ================================================================ */}
          {activeTab === 'DICTIONARY' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Filter and Search Bar */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-4 rounded-xl bg-current/5 border border-current/10">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search custom fields by name, key, or category..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-current/5 p-1 rounded-xl border border-current/10 text-xs">
                    {(['ALL', 'REQUIRED', 'RECOMMENDED', 'OPTIONAL'] as const).map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setClassificationFilter(cls)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                          classificationFilter === cls
                            ? cls === 'REQUIRED'
                              ? 'bg-rose-500 text-white'
                              : cls === 'RECOMMENDED'
                              ? 'bg-amber-500 text-black'
                              : cls === 'OPTIONAL'
                              ? 'bg-blue-500 text-white'
                              : 'bg-current/20 font-extrabold'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>

                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-current/5 border border-current/15 text-xs font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="ALL">All Sections</option>
                    {sections.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fields Table */}
              <div className="rounded-xl border border-current/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-current/15 bg-current/5 text-[11px] font-mono uppercase tracking-wider opacity-70">
                        <th className="py-3 px-4">Field Label & Key</th>
                        <th className="py-3 px-4">Classification</th>
                        <th className="py-3 px-4">Field Type</th>
                        <th className="py-3 px-4">Section</th>
                        <th className="py-3 px-4">Specification & Business Rules</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-current/10">
                      {filteredFields.map((field) => (
                        <tr key={field.key} className="hover:bg-current/5 transition-colors">
                          <td className="py-3 px-4 align-top">
                            <div className="font-bold text-sm">{field.label}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <code className="text-[10px] px-1.5 py-0.5 rounded bg-current/10 font-mono text-amber-400">
                                {field.key}
                              </code>
                              <button
                                type="button"
                                onClick={() => handleCopy(field.key, field.key)}
                                className="opacity-40 hover:opacity-100 p-0.5"
                                title="Copy technical key"
                              >
                                {copiedKey === field.key ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4 align-top whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide ${
                                field.classification === 'REQUIRED'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : field.classification === 'RECOMMENDED'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}
                            >
                              {field.classification}
                            </span>
                          </td>

                          <td className="py-3 px-4 align-top whitespace-nowrap">
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-current/10">
                              {field.type}
                            </span>
                          </td>

                          <td className="py-3 px-4 align-top whitespace-nowrap text-xs opacity-75 font-medium">
                            {field.section}
                          </td>

                          <td className="py-3 px-4 align-top text-xs opacity-80 leading-relaxed">
                            <p>{field.description}</p>
                            {field.options && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {field.options.map((opt) => (
                                  <span
                                    key={opt}
                                    className="text-[10px] px-1.5 py-0.2 rounded bg-current/5 border border-current/10 opacity-70"
                                  >
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: LISTING QUALITY SCORE AUDIT */}
          {/* ================================================================ */}
          {activeTab === 'QUALITY_SCORE' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 rounded-2xl bg-current/5 border border-current/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">
                      Institutional Certification Engine
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">
                    Project Listing Quality Score (LQS)
                  </h3>
                  <p className="text-xs opacity-70 leading-relaxed">
                    Evaluates completeness across 29 sections: RERA verification, unit configurations, transparent pricing, visual assets, travel matrix, and SEO discovery tags.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-current/5 p-4 rounded-2xl border border-current/10">
                  <div className="text-center">
                    <div className="text-4xl font-black text-amber-400 font-mono">
                      {auditScore.totalScore}
                      <span className="text-lg opacity-40">/100</span>
                    </div>
                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-60 mt-1">
                      Completeness {auditScore.completenessPercent}%
                    </div>
                  </div>

                  <div className="h-12 w-px bg-current/15"></div>

                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                        auditScore.grade === 'A'
                          ? 'bg-emerald-500 text-black'
                          : auditScore.grade === 'B'
                          ? 'bg-amber-500 text-black'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      Grade {auditScore.grade}
                    </span>
                    <div className="text-xs font-bold mt-1">{auditScore.gradeTitle}</div>
                  </div>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Achieved Listing Strengths ({auditScore.strengths.length})
                      </h4>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {auditScore.strengths.map((str, idx) => (
                      <li key={idx} className="text-xs flex items-center gap-2 opacity-90">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Fields Alerts */}
                <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                        High-Impact Missing Fields ({auditScore.missingFields.length})
                      </h4>
                    </div>
                  </div>
                  {auditScore.missingFields.length === 0 ? (
                    <div className="text-xs opacity-70 py-4 text-center">
                      Congratulations! Listing meets 100% of institutional quality criteria.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {auditScore.missingFields.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-black/20 border border-rose-500/20 flex items-start justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-bold text-rose-300">{m.field}</span>
                            <p className="text-[11px] opacity-70 mt-0.5">{m.reason}</p>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 whitespace-nowrap">
                            +{m.weight} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: ESTIMATED TOTAL COST ENGINE */}
          {/* ================================================================ */}
          {activeTab === 'COST_ENGINE' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-current/5 border border-current/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold">
                    Transparent "Estimated Total Cost" Calculation Engine
                  </h3>
                </div>
                <p className="text-xs opacity-70">
                  Unbundles all hidden developer charges: Base Price + Floor Rise + Preferred Location (PLC) + Covered Parking + Clubhouse + Infrastructure + Statutory Taxes (GST, Stamp Duty & Registration).
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Inputs Form */}
                <div className="lg:col-span-5 p-5 rounded-xl bg-current/5 border border-current/10 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider opacity-80">
                    Adjust Cost Variables (INR)
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block opacity-70 mb-1">Base Price (₹):</label>
                      <input
                        type="number"
                        value={simBasePrice}
                        onChange={(e) => setSimBasePrice(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block opacity-70 mb-1">Carpet Area (Sq.Ft):</label>
                        <input
                          type="number"
                          value={simCarpetSqFt}
                          onChange={(e) => setSimCarpetSqFt(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block opacity-70 mb-1">Floor Level:</label>
                        <input
                          type="number"
                          value={simFloorNumber}
                          onChange={(e) => setSimFloorNumber(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block opacity-70 mb-1">Covered Parking (₹):</label>
                        <input
                          type="number"
                          value={simParking}
                          onChange={(e) => setSimParking(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block opacity-70 mb-1">Clubhouse Fee (₹):</label>
                        <input
                          type="number"
                          value={simClubhouse}
                          onChange={(e) => setSimClubhouse(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block opacity-70 mb-1">Stamp Duty (%):</label>
                        <input
                          type="number"
                          step="0.5"
                          value={simStampDutyPct}
                          onChange={(e) => setSimStampDutyPct(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block opacity-70 mb-1">GST (%):</label>
                        <input
                          type="number"
                          step="1"
                          value={simGstPct}
                          onChange={(e) => setSimGstPct(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculation Output Card */}
                <div className="lg:col-span-7 p-6 rounded-xl bg-current/5 border border-current/10 space-y-5">
                  <div className="flex items-center justify-between border-b border-current/10 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">
                        Calculated Final Acquisition
                      </span>
                      <h4 className="text-2xl font-black font-mono text-emerald-400">
                        ₹{(costCalculation.estimatedTotalAcquisitionCost / 10000000).toFixed(2)} Cr
                      </h4>
                      <span className="text-xs opacity-60">
                        (₹{costCalculation.estimatedTotalAcquisitionCost.toLocaleString('en-IN')})
                      </span>
                    </div>

                    <div className="text-right text-xs">
                      <div className="opacity-70">Effective All-In Rate:</div>
                      <div className="font-mono font-bold text-amber-400">
                        ₹
                        {Math.round(
                          costCalculation.estimatedTotalAcquisitionCost / simCarpetSqFt
                        ).toLocaleString('en-IN')}{' '}
                        / sq.ft carpet
                      </div>
                    </div>
                  </div>

                  {/* Visual Proportion Bar */}
                  <div className="space-y-1.5">
                    <div className="h-3 rounded-full overflow-hidden flex bg-current/10">
                      {costCalculation.breakdownSummary.map((item, idx) => (
                        <div
                          key={idx}
                          title={`${item.label}: ${item.percentage.toFixed(1)}%`}
                          style={{ width: `${item.percentage}%` }}
                          className={`${
                            idx === 0
                              ? 'bg-amber-500'
                              : idx === 1
                              ? 'bg-amber-400'
                              : idx === 2
                              ? 'bg-emerald-500'
                              : idx === 3
                              ? 'bg-blue-500'
                              : idx === 4
                              ? 'bg-indigo-500'
                              : idx === 5
                              ? 'bg-rose-500'
                              : 'bg-purple-500'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] opacity-60">
                      <span>Base Agreement (75-82%)</span>
                      <span>Statutory Taxes & Charges (18-25%)</span>
                    </div>
                  </div>

                  {/* Breakdown Table */}
                  <div className="divide-y divide-current/10 text-xs">
                    {costCalculation.breakdownSummary.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <span className="opacity-80">{item.label}</span>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="font-bold">
                            ₹{item.amount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] opacity-50 w-10 text-right">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 4: SMART AUTO-CONTENT & FAQS */}
          {/* ================================================================ */}
          {activeTab === 'AI_GENERATOR' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-current/5 border border-current/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold">
                    Smart AI Auto-Content & Grounded FAQ Engine
                  </h3>
                </div>
                <p className="text-xs opacity-70">
                  Automatically synthesizes headlines, project vision narratives, location highlights, and grounded FAQs directly from structured project fields. Administrators can review and edit before publication.
                </p>
              </div>

              <div className="space-y-4">
                {/* Headline & Summary */}
                <div className="p-4 rounded-xl bg-current/5 border border-current/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Generated Editorial Headline & Summary
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(aiGenerated.shortSummary, 'summary')}
                      className="text-xs opacity-70 hover:opacity-100 flex items-center gap-1 font-mono"
                    >
                      {copiedKey === 'summary' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                  <h4 className="text-sm font-black">{aiGenerated.projectHeadline}</h4>
                  <p className="text-xs opacity-80 leading-relaxed">{aiGenerated.shortSummary}</p>
                </div>

                {/* SEO Meta Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-current/5 border border-current/10 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400">
                      SEO Title Tag (&lt;60 Chars)
                    </span>
                    <p className="text-xs font-bold">{aiGenerated.seoTitle}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-current/5 border border-current/10 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400">
                      Meta Description (&lt;160 Chars)
                    </span>
                    <p className="text-xs opacity-80">{aiGenerated.metaDescription}</p>
                  </div>
                </div>

                {/* Grounded FAQs */}
                <div className="p-4 rounded-xl bg-current/5 border border-current/10 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Auto-Grounded FAQ Accordions
                  </span>
                  <div className="space-y-2">
                    {aiGenerated.suggestedFaqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-1"
                      >
                        <div className="text-xs font-bold flex items-center gap-2">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>{faq.question}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-current/10 font-normal opacity-60 ml-auto">
                            {faq.category}
                          </span>
                        </div>
                        <p className="text-xs opacity-75 pl-5.5 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 5: ENGAGEMENT SCORE SIMULATOR */}
          {/* ================================================================ */}
          {activeTab === 'ENGAGEMENT' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-current/5 border border-current/10 space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold">
                    Internal Customer Engagement & Conversion Scoring
                  </h3>
                </div>
                <p className="text-xs opacity-70">
                  Weighted formula identifying high-performing projects based on views, brochure downloads, WhatsApp clicks, phone reveals, and booked site visits.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Inputs */}
                <div className="lg:col-span-6 p-5 rounded-xl bg-current/5 border border-current/10 space-y-3 text-xs">
                  <h4 className="font-bold uppercase tracking-wider opacity-80 mb-2">
                    Simulate Project Interaction Telemetry
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block opacity-70 mb-1">Listing Views:</label>
                      <input
                        type="number"
                        value={engViews}
                        onChange={(e) => setEngViews(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">Gallery Views:</label>
                      <input
                        type="number"
                        value={engGallery}
                        onChange={(e) => setEngGallery(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block opacity-70 mb-1">Brochures Downloaded (15x):</label>
                      <input
                        type="number"
                        value={engBrochure}
                        onChange={(e) => setEngBrochure(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">Cost Sheets Downloaded (18x):</label>
                      <input
                        type="number"
                        value={engCostSheet}
                        onChange={(e) => setEngCostSheet(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block opacity-70 mb-1">WhatsApp Inquiries (25x):</label>
                      <input
                        type="number"
                        value={engWhatsapp}
                        onChange={(e) => setEngWhatsapp(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">Phone Number Clicks (20x):</label>
                      <input
                        type="number"
                        value={engPhone}
                        onChange={(e) => setEngPhone(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block opacity-70 mb-1">Site Visits Booked (50x Intent):</label>
                    <input
                      type="number"
                      value={engSiteVisits}
                      onChange={(e) => setEngSiteVisits(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                    />
                  </div>
                </div>

                {/* Score Output */}
                <div className="lg:col-span-6 p-6 rounded-xl bg-current/5 border border-current/10 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">
                      Calculated Intent Score
                    </span>
                    <div className="text-4xl font-black font-mono text-amber-400 mt-1">
                      {engagementResult.engagementScore.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      Conversion Rate:{' '}
                      <strong className="text-emerald-400">
                        {engagementResult.conversionRatePercent}%
                      </strong>{' '}
                      from visitor to high-intent inquiry
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono uppercase opacity-60">Performance Tier</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                          engagementResult.performanceTier === 'VIRAL_HOT'
                            ? 'bg-rose-500 text-white animate-pulse'
                            : engagementResult.performanceTier === 'HIGH_CONVERTING'
                            ? 'bg-emerald-500 text-black'
                            : 'bg-amber-500 text-black'
                        }`}
                      >
                        {engagementResult.performanceTier}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-70">
                      Eligible for featured spotlight placement on the homepage discovery carousel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 6: VALIDATION & PUBLISHING RULES */}
          {/* ================================================================ */}
          {activeTab === 'VALIDATION_RULES' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-current/5 border border-current/10 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold">
                    Automated Data Validation & Publishing Guards
                  </h3>
                </div>
                <p className="text-xs opacity-70">
                  Pre-flight automated checks enforced before a residential project can transition from DRAFT to PUBLISHED.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    Critical Blockers (Publishing Prevented)
                  </h4>
                  <ul className="space-y-2.5 text-xs opacity-85">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                      <span><strong>Project Name & Developer:</strong> Cannot be empty or less than 3 characters.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                      <span><strong>RERA Validation:</strong> If registered, RERA number must match state pattern (e.g. ^P5[0-9]{9}$).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                      <span><strong>Price Integrity:</strong> Starting price must be strictly greater than zero and non-negative.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                      <span><strong>Carpet Area Integrity:</strong> Every active unit configuration must specify carpet area &gt; 0 sq.ft.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                      <span><strong>Duplicate Guard:</strong> Prevents duplicate registration of same project title in the same locality.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Quality Warnings (Publish Allowed with Alert)
                  </h4>
                  <ul className="space-y-2.5 text-xs opacity-85">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                      <span><strong>Missing Floor Plans:</strong> Listing quality reduced by 5 points if blueprints are omitted.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                      <span><strong>Under Construction Progress:</strong> If under construction, recent site photo and completion % recommended.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                      <span><strong>Cost Sheet Discrepancy:</strong> Alert raised if base rate diverges significantly from locality average.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                      <span><strong>LQS Score &lt; 70%:</strong> Administrator warned that listing conversion may suffer due to incomplete data.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 border-t border-current/10 flex items-center justify-between flex-shrink-0 bg-current/5 text-xs">
          <div className="flex items-center gap-2 opacity-70">
            <span>Standard: Residential New Projects Schema v2.8</span>
            <span>•</span>
            <span>RERA & MahaRERA Statutory Aligned</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-current/10 hover:bg-current/20 font-medium transition-colors"
            >
              Close Guide
            </button>
            {onOpenPostingWizard && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPostingWizard();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Residential Project Wizard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
