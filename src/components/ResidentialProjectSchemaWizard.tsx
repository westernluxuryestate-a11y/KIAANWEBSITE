/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Building2,
  MapPin,
  ShieldCheck,
  Calculator,
  Compass,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Search,
  Upload,
  Eye,
  Info,
  Car,
  Trees,
  Wifi,
  Video,
  HelpCircle,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { getScannableQrUrl } from './ReraBadge';
import {
  ComprehensiveProjectData,
  UnitConfigurationItem,
  DistanceMatrixItem,
  ProjectFaqItem,
  calculateListingQualityScore,
  calculateEstimatedTotalCost,
  generateSmartProjectContent,
} from '../services/projectSchemaService';
import { Amenity, Project } from '../types';
import { MASTER_AMENITIES } from '../data/seedData';

interface ResidentialProjectSchemaWizardProps {
  initialData?: Partial<ComprehensiveProjectData>;
  initialProject?: Project | null;
  onSave: (comprehensiveData: ComprehensiveProjectData) => void;
  onCancel: () => void;
  theme?: 'dark' | 'light';
}

export const ResidentialProjectSchemaWizard: React.FC<ResidentialProjectSchemaWizardProps> = ({
  initialData,
  initialProject,
  onSave,
  onCancel,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  // 7 Guided Steps
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 7;

  // Local state for all fields
  const [data, setData] = useState<ComprehensiveProjectData>(() => {
    // Merge initialData or initialProject fallback
    const fallback: ComprehensiveProjectData = {
      projectName: initialProject?.name || initialData?.projectName || '',
      developerName: initialProject?.developerName || initialData?.developerName || '',
      projectStatus: (initialProject?.status === 'UNDER_CONSTRUCTION'
        ? 'Under Construction'
        : initialProject?.status === 'READY_TO_MOVE'
        ? 'Ready to Move'
        : initialData?.projectStatus || 'Under Construction') as any,
      reraRegistered: true,
      reraNumber: initialProject?.reraRecord?.registrationNumber || initialData?.reraNumber || 'P52100039281',
      projectType: 'Residential Apartment',
      propertyCategory: 'Premium',
      possessionDate: initialProject?.possessionDate || 'December 2027',
      totalLandAreaAcres: initialProject?.totalLandAcres || 6.2,
      totalTowers: initialProject?.totalTowersCount || 4,
      totalFloors: initialProject?.totalFloorsCount || 32,
      totalUnits: initialProject?.totalUnitsCount || 280,
      availableUnits: initialProject?.availableUnitsCount || 64,
      densityPerAcre: 45,
      unitsPerFloor: 4,
      constructionStage: 'Slab Casting',
      constructionPercentage: 68,
      completeAddress: initialProject?.location?.address || 'Survey 48/2, Datta Mandir Road, Wakad, Pune 411057',
      locality: initialProject?.location?.microMarket || 'Wakad',
      city: initialProject?.location?.city || 'Pune',
      state: initialProject?.location?.state || 'Maharashtra',
      pinCode: initialProject?.location?.pincode || '411057',
      latitude: initialProject?.location?.coordinates?.lat || 18.598,
      longitude: initialProject?.location?.coordinates?.lng || 73.765,
      nearbyLandmark: 'Near Hinjewadi IT Gateway & Expressway',
      distanceMatrix: [
        { category: 'Metro Station', name: 'Wakad Metro Station', distanceKm: 1.2, commuteMinutes: 4 },
        { category: 'IT Park', name: 'Hinjewadi IT Park Phase 1', distanceKm: 3.5, commuteMinutes: 10 },
        { category: 'School', name: 'Indus International Early Learning', distanceKm: 1.8, commuteMinutes: 6 },
        { category: 'Hospital', name: 'Jupiter Super Speciality Hospital', distanceKm: 4.0, commuteMinutes: 12 },
        { category: 'Highway', name: 'Mumbai-Pune Expressway', distanceKm: 2.1, commuteMinutes: 5 },
        { category: 'Mall', name: 'Phoenix Marketcity Millennium Mall', distanceKm: 2.8, commuteMinutes: 8 },
      ],
      unitConfigurations: [
        {
          id: 'u_1',
          name: '3 BHK Signature Grande',
          bhkType: '3 BHK',
          bedrooms: 3,
          bathrooms: 3,
          carpetAreaSqFt: 1450,
          balconyAreaSqFt: 120,
          facing: 'East',
          startingPrice: 18500000,
          floorRange: 'Floor 4 to 28',
          parkingIncluded: true,
          parkingCount: 2,
          furnishingStatus: 'Semi-Furnished',
          availabilityStatus: 'Available',
          floorPlanUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        },
        {
          id: 'u_2',
          name: '3.5 BHK Sky Residence',
          bhkType: '3.5 BHK',
          bedrooms: 3,
          bathrooms: 4,
          carpetAreaSqFt: 1850,
          balconyAreaSqFt: 160,
          facing: 'North-East',
          startingPrice: 24500000,
          floorRange: 'Floor 10 to 30',
          parkingIncluded: true,
          parkingCount: 2,
          furnishingStatus: 'Unfurnished',
          availabilityStatus: 'Available',
        },
        {
          id: 'u_3',
          name: '4 BHK Presidential Penthouse',
          bhkType: '4 BHK',
          bedrooms: 4,
          bathrooms: 5,
          carpetAreaSqFt: 2850,
          balconyAreaSqFt: 350,
          facing: 'North',
          startingPrice: 42000000,
          floorRange: 'Floor 31 & 32',
          parkingIncluded: true,
          parkingCount: 3,
          furnishingStatus: 'Luxury Designer Fitted',
          availabilityStatus: 'Limited Units',
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
        paymentPlans: ['Construction Linked Plan (CLP)', '10:90 Bank Subvention'],
        emiStartingFrom: 135000,
        homeLoanAvailable: true,
        bankTieUps: ['HDFC', 'SBI', 'ICICI', 'Axis Bank', 'Kotak Mahindra'],
        estimatedTotalAcquisitionCost: 21545000,
      },
      selectedAmenities: ['am_inf_pool', 'am_clubhouse', 'am_gym', 'am_spa', 'am_ev', 'am_concierge', 'am_theatre'],
      amenityCategories: {
        lifestyle: ['Infinity Edge Pool', '40,000 sq.ft Clubhouse', 'Sky Lounge'],
        sports: ['Badminton Court', 'Squash Court', 'Jogging Track'],
        kids: ["Children's Splash Pool", 'Sensory Play Park'],
        wellness: ['Spa & Steam Pavilions', 'Yoga & Meditation Deck'],
        outdoor: ['3-Acre Bio-reserve Garden', 'Open-Air Amphitheater'],
        convenience: ['EV Supercharging Station', 'Concierge Desk', 'Business Pods'],
        security: ['3-Tier Biometric Security', 'CCTV 24/7 Surveillance'],
      },
      specifications: {
        structureType: 'Earthquake Resistant RCC Framed Structure (Zone III)',
        ceilingHeightFt: 11.5,
        flooring: 'Italian Statuario marble in living & dining, engineered wooden flooring in master suites',
        doorsAndWindows: 'Full-height acoustic double glazed (DGU) sliding glass panels',
        balconyRailings: 'Seamless frameless toughened glass railing with stainless steel caps',
        sanitaryFittings: 'Villeroy & Boch wall-hung basins with Gessi brushed brass mixers',
        electricalBackup: '100% DG Power Backup for residences & common utilities',
        elevators: 'High-speed 3.5 m/s Mitsubishi passenger & stretcher elevators',
      },
      parkingSlotsCount: 560,
      coveredParking: true,
      basementLevels: 3,
      evChargingBays: 48,
      visitorParkingBays: 35,
      primaryOrientation: 'East',
      viewTypes: ['Scenic Hill View', 'Private Garden & Bio-Reserve View'],
      vaastuCompliantPercent: 100,
      smartHomeEnabled: true,
      smartFeatures: ['Biometric Smart Door Lock', 'Video Door Phone (VDP)', 'Fiber-to-Home Gigabit Internet'],
      greenCertification: 'IGBC Platinum Certified',
      rainwaterHarvesting: true,
      solarPowerForCommonAreas: true,
      sewageTreatmentPlant: true,
      organicWasteConverter: true,
      coverImageUrl: initialProject?.bannerImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
      galleryImages: [
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', category: 'EXTERIOR' },
        { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', category: 'INTERIOR' },
        { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', category: 'AMENITIES' },
        { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', category: 'CLUBHOUSE' },
      ],
      masterPlanUrl: initialProject?.masterPlanUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      floorPlanImages: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      ],
      videoWalkthroughUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      siteVisitInfo: {
        siteVisitAvailable: true,
        siteOfficeAddress: 'Survey 48/2, Datta Mandir Road, Wakad, Pune 411057',
        siteOfficePhone: '+91 98230 11000',
        siteVisitDaysHours: 'Monday - Sunday: 9:30 AM to 6:30 PM',
        appointmentRequired: true,
        virtualSiteVisitAvailable: true,
        complimentaryPickupDrop: true,
        sampleFlatAvailable: true,
      },
      targetBuyerPersona: ['Luxury Seekers', 'IT Leadership & Founders', 'NRI Investors'],
      projectHeadline: 'Landmark Biophilic Sky Residences Above Wakad',
      shortSummary: 'Sculpted master residences featuring 11.5 ft ceilings, biometric sky lounges, 40,000 sq.ft signature clubhouse, and 3-acre bio-reserve.',
      projectHighlights: [
        'IGBC Platinum certified biophilic master community',
        'Direct 5-min signal-free connectivity to Hinjewadi IT Park',
        '100% Vaastu compliant residences with 3-side open panoramic viewing decks',
      ],
      seoTitle: 'Kiaan Sky Residences Wakad Pune | 3 & 4 BHK Luxury Apartments',
      metaDescription: 'Explore Kiaan Sky Residences in Wakad, Pune. RERA registered P52100039281. Check 3 & 4 BHK floor plans, all-inclusive cost sheet, and schedule private site visits.',
      faqs: [
        { id: 'f1', question: 'What is the starting price of apartments?', answer: '3 BHK Signature Grande residences start at ₹1.85 Cr base price with all-inclusive estimated acquisition of ₹2.15 Cr.' },
        { id: 'f2', question: 'Is the project MahaRERA approved?', answer: 'Yes, fully registered under MahaRERA with registration number P52100039281.' },
        { id: 'f3', question: 'What is the possession date?', answer: 'Possession is scheduled for December 2027 with RERA compliance milestones.' },
        { id: 'f4', question: 'Are sample flats ready for inspection?', answer: 'Yes, fully furnished 3 BHK & 4 BHK experiential sample suites are available for guided walkthroughs at the experience centre.' },
      ],
    };

    return { ...fallback, ...initialData };
  });

  // Calculate Real-Time LQS
  const lqs = useMemo(() => calculateListingQualityScore(data), [data]);

  // Calculate live Estimated Total Cost from current costSheet variables
  const liveCost = useMemo(() => {
    const cs = data.costSheet;
    if (!cs) return null;
    return calculateEstimatedTotalCost({
      basePrice: cs.startingPrice || 18500000,
      carpetAreaSqFt: data.unitConfigurations[0]?.carpetAreaSqFt || 1450,
      floorNumber: 12,
      floorRisePerFloor: cs.floorRisePerFloor || 60000,
      plcCharges: cs.plcCharges || 450000,
      parkingCharges: cs.parkingCharges || 500000,
      clubhouseCharges: cs.clubhouseCharges || 350000,
      infraCharges: cs.infrastructureCharges || 250000,
      advanceMaintenanceCharges: cs.advanceMaintenanceCharges || 180000,
      stampDutyPercent: cs.stampDutyPercent || 6.0,
      gstPercent: cs.gstPercent || 5.0,
      registrationCharges: cs.registrationCharges || 30000,
    });
  }, [data.costSheet, data.unitConfigurations]);

  // Sync calculated estimated acquisition cost into state
  useEffect(() => {
    if (liveCost && data.costSheet && data.costSheet.estimatedTotalAcquisitionCost !== liveCost.estimatedTotalAcquisitionCost) {
      setData((prev) => ({
        ...prev,
        costSheet: {
          ...prev.costSheet!,
          estimatedTotalAcquisitionCost: liveCost.estimatedTotalAcquisitionCost,
        },
      }));
    }
  }, [liveCost]);

  // Auto-Save Draft to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('kiaan_project_schema_draft', JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  // Backend RERA QR Provisioning & Upload State
  const [isSyncingBackendQr, setIsSyncingBackendQr] = useState(false);
  const [backendQrStatusMsg, setBackendQrStatusMsg] = useState<string | null>(null);
  const [backendQrAuditStamp, setBackendQrAuditStamp] = useState<string | null>(null);
  const [backendQrUrl, setBackendQrUrl] = useState<string | null>(null);

  const handleSyncBackendQr = async () => {
    const regNo = (data.reraNumber || '').trim().toUpperCase();
    if (!regNo) {
      setBackendQrStatusMsg('Please enter a valid MahaRERA registration number first.');
      return;
    }
    setIsSyncingBackendQr(true);
    setBackendQrStatusMsg('Contacting backend regulatory gateway to verify & generate certified QR...');
    try {
      const res = await fetch('/api/v1/rera/qr/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: 'PROJECT',
          entityId: initialProject?.id,
          registrationNumber: regNo,
          officialAuthorityUrl: data.trustLegal?.reraPortalUrl || `https://maharera.maharashtra.gov.in/projects-search-result?regNo=${encodeURIComponent(regNo)}`,
          verifiedBy: 'Kiaan Statutory Compliance Desk (Master Schema)',
          complianceNotes: 'Statutory QR provisioned through backend regulatory engine',
        }),
      });
      const resData = await res.json();
      if (resData.success && resData.data?.qrCodeUrl) {
        setBackendQrUrl(resData.data.qrCodeUrl);
        setBackendQrAuditStamp(resData.data.auditStamp);
        setBackendQrStatusMsg(`Verified by Backend Engine: ${resData.data.auditStamp}`);
        setData((prev) => ({
          ...prev,
          reraNumber: regNo,
          reraRegistered: true,
          trustLegal: {
            reraRegistered: true,
            reraNumber: regNo,
            reraPortalUrl: resData.data.officialAuthorityUrl,
            legalClearanceStatus: prev.trustLegal?.legalClearanceStatus || 'Clear & Marketable Title Deed',
            landTitleClear: true,
            commencementCertificateStatus: prev.trustLegal?.commencementCertificateStatus || 'Full CC Received',
            occupancyCertificateStatus: prev.trustLegal?.occupancyCertificateStatus || 'In Process',
            bankApprovals: prev.trustLegal?.bankApprovals || ['HDFC', 'SBI', 'ICICI'],
            environmentalClearance: true,
            fireNocApproved: true,
            municipalSanctionsApproved: true,
          },
        }));
      } else {
        setBackendQrStatusMsg(resData.message || 'Failed to sync QR from backend.');
      }
    } catch (err) {
      console.error('Failed to sync backend QR:', err);
      setBackendQrStatusMsg('Backend connection error while provisioning statutory QR.');
    } finally {
      setIsSyncingBackendQr(false);
    }
  };

  const handleUploadQrFileToBackend = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const regNo = (data.reraNumber || '').trim().toUpperCase();
    if (!regNo) {
      setBackendQrStatusMsg('Please enter a valid MahaRERA registration number first.');
      return;
    }
    setIsSyncingBackendQr(true);
    setBackendQrStatusMsg(`Uploading certificate (${file.name}) to backend regulatory gateway...`);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      try {
        const res = await fetch('/api/v1/rera/qr/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entityType: 'PROJECT',
            entityId: initialProject?.id,
            registrationNumber: regNo,
            qrCodeDataUrl: base64Data,
            officialAuthorityUrl: data.trustLegal?.reraPortalUrl,
            verifiedBy: 'Kiaan Statutory Compliance Desk (Master Schema Upload)',
            complianceNotes: `Authoritative certificate file uploaded to backend (${file.name}, ${(file.size / 1024).toFixed(1)} KB)`,
          }),
        });
        const resData = await res.json();
        if (resData.success && resData.data?.qrCodeUrl) {
          setBackendQrUrl(resData.data.qrCodeUrl);
          setBackendQrAuditStamp(resData.data.auditStamp);
          setBackendQrStatusMsg(`Uploaded & Verified by Backend Vault: ${resData.data.auditStamp}`);
          setData((prev) => ({
            ...prev,
            reraNumber: regNo,
            reraRegistered: true,
            trustLegal: {
              reraRegistered: true,
              reraNumber: regNo,
              reraPortalUrl: resData.data.officialAuthorityUrl,
              legalClearanceStatus: prev.trustLegal?.legalClearanceStatus || 'Clear & Marketable Title Deed',
              landTitleClear: true,
              commencementCertificateStatus: prev.trustLegal?.commencementCertificateStatus || 'Full CC Received',
              occupancyCertificateStatus: prev.trustLegal?.occupancyCertificateStatus || 'In Process',
              bankApprovals: prev.trustLegal?.bankApprovals || ['HDFC', 'SBI', 'ICICI'],
              environmentalClearance: true,
              fireNocApproved: true,
              municipalSanctionsApproved: true,
            },
          }));
        } else {
          setBackendQrStatusMsg(resData.message || 'Failed to process QR in backend.');
        }
      } catch (err) {
        console.error('Failed backend upload:', err);
        setBackendQrStatusMsg('Backend connection error while uploading statutory QR.');
      } finally {
        setIsSyncingBackendQr(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Field change helpers
  const updateField = <K extends keyof ComprehensiveProjectData>(key: K, value: ComprehensiveProjectData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateCostSheetField = (key: string, value: any) => {
    setData((prev) => ({
      ...prev,
      costSheet: {
        ...prev.costSheet!,
        [key]: value,
      },
    }));
  };

  const updateSiteVisitField = (key: string, value: any) => {
    setData((prev) => ({
      ...prev,
      siteVisitInfo: {
        ...prev.siteVisitInfo!,
        [key]: value,
      },
    }));
  };

  // Add / Remove Unit Configuration
  const handleAddUnitConfig = () => {
    const newConfig: UnitConfigurationItem = {
      id: `u_${Date.now()}`,
      name: 'New Residence Configuration',
      bhkType: '3 BHK',
      bedrooms: 3,
      bathrooms: 3,
      carpetAreaSqFt: 1500,
      startingPrice: 19000000,
      availabilityStatus: 'Available',
      parkingIncluded: true,
      parkingCount: 2,
    };
    setData((prev) => ({
      ...prev,
      unitConfigurations: [...prev.unitConfigurations, newConfig],
    }));
  };

  const handleRemoveUnitConfig = (id: string) => {
    setData((prev) => ({
      ...prev,
      unitConfigurations: prev.unitConfigurations.filter((c) => c.id !== id),
    }));
  };

  const handleUpdateUnitConfig = (id: string, field: keyof UnitConfigurationItem, val: any) => {
    setData((prev) => ({
      ...prev,
      unitConfigurations: prev.unitConfigurations.map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    }));
  };

  // Add / Remove Travel Matrix
  const handleAddTravelItem = () => {
    const newItem: DistanceMatrixItem = {
      category: 'Landmark',
      name: 'Nearby Destination',
      distanceKm: 2.0,
      commuteMinutes: 5,
    };
    setData((prev) => ({
      ...prev,
      distanceMatrix: [...prev.distanceMatrix, newItem],
    }));
  };

  const handleRemoveTravelItem = (index: number) => {
    setData((prev) => ({
      ...prev,
      distanceMatrix: prev.distanceMatrix.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateTravelItem = (index: number, field: keyof DistanceMatrixItem, val: any) => {
    setData((prev) => ({
      ...prev,
      distanceMatrix: prev.distanceMatrix.map((item, i) => (i === index ? { ...item, [field]: val } : item)),
    }));
  };

  // AI Content Generator 1-Click
  const handleRunAiAssistant = () => {
    const generated = generateSmartProjectContent(data);
    setData((prev) => ({
      ...prev,
      projectHeadline: generated.projectHeadline,
      shortSummary: generated.shortSummary,
      projectHighlights: generated.projectHighlights,
      seoTitle: generated.seoTitle,
      metaDescription: generated.metaDescription,
      faqs: generated.suggestedFaqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
    }));
  };

  // Submit
  const handleSave = () => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-5xl max-h-[94vh] flex flex-col rounded-3xl shadow-2xl border overflow-hidden ${
          isDark
            ? 'bg-neutral-900 border-neutral-700 text-neutral-100'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* HEADER BAR */}
        <div className="px-6 py-4 border-b border-current/10 flex items-center justify-between flex-shrink-0 bg-current/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  Residential New Project Posting Wizard
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <p className="text-xs opacity-70">
                29 Structured Custom Sections • Full RERA & Cost Transparency Engine
              </p>
            </div>
          </div>

          {/* REAL TIME LQS BADGE */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-current/5 px-3 py-1.5 rounded-xl border border-current/10 text-xs">
              <div className="text-right">
                <div className="text-[10px] font-mono opacity-60 uppercase">Listing Quality</div>
                <div className="font-mono font-black text-amber-400">
                  {lqs.totalScore}/100 <span className="text-[10px]">({lqs.completenessPercent}%)</span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-lg text-xs font-black uppercase ${
                  lqs.grade === 'A'
                    ? 'bg-emerald-500 text-black'
                    : lqs.grade === 'B'
                    ? 'bg-amber-500 text-black'
                    : 'bg-rose-500 text-white'
                }`}
              >
                Grade {lqs.grade}
              </span>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="p-2 rounded-xl hover:bg-current/10 transition-colors opacity-70 hover:opacity-100"
              title="Close Wizard"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PROGRESS BAR & STEP NAVIGATION */}
        <div className="px-6 py-2.5 border-b border-current/10 bg-current/5 flex items-center justify-between overflow-x-auto scrollbar-none flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { num: 1, title: 'Basics & RERA' },
              { num: 2, title: 'Location & Travel' },
              { num: 3, title: 'Configs & Cost' },
              { num: 4, title: 'Amenities & Specs' },
              { num: 5, title: 'Orientation & Tech' },
              { num: 6, title: 'Media & Plans' },
              { num: 7, title: 'AI, SEO & LQS' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  currentStep === s.num
                    ? 'bg-amber-500 text-black shadow-sm'
                    : s.num < currentStep
                    ? 'bg-current/10 text-emerald-400 font-semibold'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                <span>{s.num}.</span>
                <span>{s.title}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRunAiAssistant}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 transition-all flex-shrink-0"
            title="Auto-generate headlines, highlights, SEO and FAQs from current data"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Auto-Complete</span>
          </button>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ============================================================== */}
          {/* STEP 1: PROJECT BASIC INFORMATION & REGULATORY */}
          {/* ============================================================== */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Step 1: Project Basic Information & Regulatory Compliance</span>
                  </h3>
                  <p className="text-xs opacity-70 mt-0.5">
                    Fundamental identity, statutory MahaRERA compliance, density metrics, and architectural timeline.
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Required Fields Marked *
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Project Name */}
                <div>
                  <label className="block font-bold mb-1">
                    Project Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.projectName}
                    onChange={(e) => updateField('projectName', e.target.value)}
                    placeholder="e.g. Kiaan Sky Residences"
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Developer Name */}
                <div>
                  <label className="block font-bold mb-1">
                    Developer / Builder Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.developerName}
                    onChange={(e) => updateField('developerName', e.target.value)}
                    placeholder="e.g. Kiaan Luxury Developments"
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Project Status */}
                <div>
                  <label className="block font-bold mb-1">
                    Project Status <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={data.projectStatus}
                    onChange={(e) => updateField('projectStatus', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="New Launch">New Launch</option>
                    <option value="Pre-Launch">Pre-Launch</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Project Type */}
                <div>
                  <label className="block font-bold mb-1">
                    Project Type <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={data.projectType}
                    onChange={(e) => updateField('projectType', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Residential Apartment">Residential Apartment</option>
                    <option value="Villa">Villa / Row House</option>
                    <option value="Plot">Residential Plot</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Penthouse">Sky Penthouse</option>
                    <option value="Other">Integrated Township</option>
                  </select>
                </div>

                {/* Property Category */}
                <div>
                  <label className="block font-bold mb-1">
                    Property Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={data.propertyCategory}
                    onChange={(e) => updateField('propertyCategory', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Affordable">Affordable (&lt; ₹45 Lakhs)</option>
                    <option value="Mid-Segment">Mid-Segment (₹45L - ₹1.2 Cr)</option>
                    <option value="Premium">Premium (₹1.2 Cr - ₹3 Cr)</option>
                    <option value="Ultra-Luxury">Ultra-Luxury (&gt; ₹3 Cr)</option>
                  </select>
                </div>

                {/* Possession Date */}
                <div>
                  <label className="block font-bold mb-1">
                    Expected Possession Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.possessionDate}
                    onChange={(e) => updateField('possessionDate', e.target.value)}
                    placeholder="e.g. December 2027"
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* RERA Section */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                      RERA Statutory Registration
                    </span>
                  </div>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.reraRegistered}
                      onChange={(e) => updateField('reraRegistered', e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>RERA Registered Project</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1">
                      RERA Registration Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={data.reraNumber}
                      onChange={(e) => updateField('reraNumber', e.target.value)}
                      placeholder="e.g. P52100039281"
                      className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Current Construction Stage</label>
                    <select
                      value={data.constructionStage}
                      onChange={(e) => updateField('constructionStage', e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="Excavation">Excavation / Foundation</option>
                      <option value="Plinth Level">Plinth Level</option>
                      <option value="Slab Casting">Slab Casting (Superstructure)</option>
                      <option value="Brickwork & MEP">Brickwork &amp; MEP Fittings</option>
                      <option value="Finishing & Glazing">Finishing, Facade &amp; Glazing</option>
                      <option value="Ready for OC">Ready for OC / Handover</option>
                    </select>
                  </div>
                </div>

                {/* Backend Authoritative RERA QR Provisioning & Upload Gateway */}
                <div className="p-3.5 rounded-xl bg-black/25 border border-amber-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Statutory MahaRERA QR Code (Backend Governed)</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Backend Verified
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Live Scannable Preview Box */}
                    <div className="relative p-2.5 bg-white rounded-xl border-2 border-emerald-400/40 shadow-sm flex flex-col items-center flex-shrink-0">
                      <img
                        src={backendQrUrl || getScannableQrUrl(data.reraNumber || 'P52100039281')}
                        alt="MahaRERA Project QR Code"
                        className="w-24 h-24 object-contain"
                      />
                      <span className="mt-1 text-[9px] font-bold text-emerald-800 tracking-wider uppercase">
                        Scan-Ready
                      </span>
                    </div>

                    {/* Backend Provisioning & Upload Controls */}
                    <div className="flex-1 space-y-2.5 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={isSyncingBackendQr || !data.reraNumber}
                          onClick={handleSyncBackendQr}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-50"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>
                            {isSyncingBackendQr ? 'Contacting Backend...' : 'Auto-Generate & Verify QR'}
                          </span>
                        </button>

                        <label
                          className={`px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all ${
                            isSyncingBackendQr || !data.reraNumber ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Certificate File to Backend</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isSyncingBackendQr || !data.reraNumber}
                            onChange={handleUploadQrFileToBackend}
                            className="hidden"
                          />
                        </label>

                        {backendQrAuditStamp && (
                          <span className="text-[10px] px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Backend Stamped
                          </span>
                        )}
                      </div>

                      {backendQrStatusMsg && (
                        <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/20">
                          {backendQrStatusMsg}
                        </div>
                      )}

                      <div className="text-[10px] opacity-70 leading-relaxed bg-black/30 p-2 rounded-lg border border-white/5">
                        <strong className="text-emerald-400">Statutory Regulatory Note:</strong> The QR code is uploaded, validated, and bound directly via the backend server (<code className="text-amber-300 font-mono">/api/v1/rera/qr/upload</code>) with cryptographic audit logging to ensure consumer protection and anti-counterfeiting.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architectural Scale Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block opacity-70 mb-1">Total Land Acres:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={data.totalLandAreaAcres}
                    onChange={(e) => updateField('totalLandAreaAcres', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-current/5 border border-current/15 font-mono"
                  />
                </div>
                <div>
                  <label className="block opacity-70 mb-1">Total Towers:</label>
                  <input
                    type="number"
                    value={data.totalTowers}
                    onChange={(e) => updateField('totalTowers', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-current/5 border border-current/15 font-mono"
                  />
                </div>
                <div>
                  <label className="block opacity-70 mb-1">Total Floors:</label>
                  <input
                    type="number"
                    value={data.totalFloors}
                    onChange={(e) => updateField('totalFloors', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-current/5 border border-current/15 font-mono"
                  />
                </div>
                <div>
                  <label className="block opacity-70 mb-1">Available Units:</label>
                  <input
                    type="number"
                    value={data.availableUnits}
                    onChange={(e) => updateField('availableUnits', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-current/5 border border-current/15 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: LOCATION & STRUCTURED COMMUTE MATRIX */}
          {/* ============================================================== */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Step 2: Location &amp; Commute Travel Matrix</span>
                  </h3>
                  <p className="text-xs opacity-70 mt-0.5">
                    Precise geographical coordinates and verified distance/time points to transit, IT hubs, and top institutions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1">
                    Complete Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.completeAddress}
                    onChange={(e) => updateField('completeAddress', e.target.value)}
                    placeholder="Full street address including survey number"
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">
                    Locality / Micro-Market <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.locality}
                    onChange={(e) => updateField('locality', e.target.value)}
                    placeholder="e.g. Wakad or Baner"
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">
                    City <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="e.g. Pune"
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-1">State</label>
                    <input
                      type="text"
                      value={data.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={data.pinCode}
                      onChange={(e) => updateField('pinCode', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={data.latitude}
                      onChange={(e) => updateField('latitude', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={data.longitude}
                      onChange={(e) => updateField('longitude', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Commute Matrix Table */}
              <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                      Structured Commute Travel Matrix
                    </span>
                    <p className="text-[11px] opacity-70">
                      Powers the "What's Nearby" spatial radar on the project page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTravelItem}
                    className="px-3 py-1 rounded-xl bg-amber-500 text-black text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Travel Node</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {data.distanceMatrix.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-black/20 border border-white/5 text-xs"
                    >
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => handleUpdateTravelItem(idx, 'category', e.target.value)}
                          placeholder="Category (e.g. Metro)"
                          className="w-full px-2 py-1 rounded bg-current/5 border border-current/10 text-xs"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateTravelItem(idx, 'name', e.target.value)}
                          placeholder="Node Name (e.g. Hinjewadi IT Phase 1)"
                          className="w-full px-2 py-1 rounded bg-current/5 border border-current/10 text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.1"
                          value={item.distanceKm}
                          onChange={(e) => handleUpdateTravelItem(idx, 'distanceKm', Number(e.target.value))}
                          placeholder="KM"
                          className="w-full px-2 py-1 rounded bg-current/5 border border-current/10 text-xs font-mono"
                        />
                      </div>
                      <div className="col-span-1">
                        <input
                          type="number"
                          value={item.commuteMinutes}
                          onChange={(e) => handleUpdateTravelItem(idx, 'commuteMinutes', Number(e.target.value))}
                          placeholder="Mins"
                          className="w-full px-2 py-1 rounded bg-current/5 border border-current/10 text-xs font-mono"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveTravelItem(idx)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                          title="Remove node"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: UNIT CONFIGURATIONS & TRANSPARENT COST ENGINE */}
          {/* ============================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-400" />
                    <span>Step 3: Unit Configurations &amp; Estimated Total Cost Sheet</span>
                  </h3>
                  <p className="text-xs opacity-70 mt-0.5">
                    Repeatable unit configurations paired with an unbundled cost sheet calculator.
                  </p>
                </div>
              </div>

              {/* Configurations List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                    Active Unit Typologies ({data.unitConfigurations.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddUnitConfig}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Configuration</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {data.unitConfigurations.map((cfg) => (
                    <div
                      key={cfg.id}
                      className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-current/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold font-mono">
                            {cfg.bhkType}
                          </span>
                          <input
                            type="text"
                            value={cfg.name}
                            onChange={(e) => handleUpdateUnitConfig(cfg.id, 'name', e.target.value)}
                            className="font-bold text-sm bg-transparent border-b border-transparent hover:border-current/30 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveUnitConfig(cfg.id)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block opacity-70 mb-1">
                            Carpet Area (Sq.Ft) <span className="text-rose-400">*</span>:
                          </label>
                          <input
                            type="number"
                            value={cfg.carpetAreaSqFt}
                            onChange={(e) => handleUpdateUnitConfig(cfg.id, 'carpetAreaSqFt', Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block opacity-70 mb-1">
                            Starting Price (₹) <span className="text-rose-400">*</span>:
                          </label>
                          <input
                            type="number"
                            value={cfg.startingPrice}
                            onChange={(e) => handleUpdateUnitConfig(cfg.id, 'startingPrice', Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block opacity-70 mb-1">Facing:</label>
                          <input
                            type="text"
                            value={cfg.facing || 'East'}
                            onChange={(e) => handleUpdateUnitConfig(cfg.id, 'facing', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15"
                          />
                        </div>
                        <div>
                          <label className="block opacity-70 mb-1">Availability:</label>
                          <select
                            value={cfg.availabilityStatus}
                            onChange={(e) => handleUpdateUnitConfig(cfg.id, 'availabilityStatus', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15"
                          >
                            <option value="Available">Available</option>
                            <option value="Few Units Left">Few Units Left</option>
                            <option value="Sold Out">Sold Out</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itemized Cost Sheet Engine */}
              {data.costSheet && (
                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        Itemized Cost Sheet Engine (Unbundled Charges)
                      </span>
                      <p className="text-[11px] opacity-70">
                        Constitutes base rate, preferred location charges (PLC), floor rise, covered parking, and statutory taxes.
                      </p>
                    </div>
                    {liveCost && (
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-mono opacity-60">Estimated Acquisition</div>
                        <div className="text-lg font-black font-mono text-emerald-400">
                          ₹{(liveCost.estimatedTotalAcquisitionCost / 10000000).toFixed(2)} Cr
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block opacity-70 mb-1">Floor Rise / Floor (₹):</label>
                      <input
                        type="number"
                        value={data.costSheet.floorRisePerFloor}
                        onChange={(e) => updateCostSheetField('floorRisePerFloor', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">PLC Charges (₹):</label>
                      <input
                        type="number"
                        value={data.costSheet.plcCharges}
                        onChange={(e) => updateCostSheetField('plcCharges', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">Covered Parking (₹):</label>
                      <input
                        type="number"
                        value={data.costSheet.parkingCharges}
                        onChange={(e) => updateCostSheetField('parkingCharges', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">Clubhouse Charges (₹):</label>
                      <input
                        type="number"
                        value={data.costSheet.clubhouseCharges}
                        onChange={(e) => updateCostSheetField('clubhouseCharges', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">Stamp Duty (%):</label>
                      <input
                        type="number"
                        step="0.5"
                        value={data.costSheet.stampDutyPercent}
                        onChange={(e) => updateCostSheetField('stampDutyPercent', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">GST (%):</label>
                      <input
                        type="number"
                        step="1"
                        value={data.costSheet.gstPercent}
                        onChange={(e) => updateCostSheetField('gstPercent', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">Registration (₹):</label>
                      <input
                        type="number"
                        value={data.costSheet.registrationCharges}
                        onChange={(e) => updateCostSheetField('registrationCharges', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">Booking Amount (₹):</label>
                      <input
                        type="number"
                        value={data.costSheet.bookingAmount}
                        onChange={(e) => updateCostSheetField('bookingAmount', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 4: AMENITIES & ARCHITECTURAL SPECIFICATIONS */}
          {/* ============================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Trees className="w-4 h-4 text-amber-400" />
                    <span>Step 4: Amenities &amp; Architectural Specifications</span>
                  </h3>
                  <p className="text-xs opacity-70 mt-0.5">
                    Categorized luxury amenities and building structural specifications.
                  </p>
                </div>
              </div>

              {/* Master Amenities Picker */}
              <div className="space-y-3">
                <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                  Select Project Amenities ({data.selectedAmenities.length} selected)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MASTER_AMENITIES.map((am) => {
                    const isSelected = data.selectedAmenities.includes(am.id);
                    return (
                      <button
                        key={am.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            updateField(
                              'selectedAmenities',
                              data.selectedAmenities.filter((id) => id !== am.id)
                            );
                          } else {
                            updateField('selectedAmenities', [...data.selectedAmenities, am.id]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                            : 'bg-current/5 border-current/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span className="truncate">{am.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Architectural Specs Form */}
              {data.specifications && (
                <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-3 text-xs">
                  <span className="font-bold uppercase tracking-wider text-amber-400">
                    Material &amp; Structural Specifications
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block opacity-70 mb-1">RCC Structure:</label>
                      <input
                        type="text"
                        value={data.specifications.structureType}
                        onChange={(e) =>
                          setData((p) => ({
                            ...p,
                            specifications: { ...p.specifications!, structureType: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-current/5 border border-current/15"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">Ceiling Height (Feet):</label>
                      <input
                        type="number"
                        step="0.5"
                        value={data.specifications.ceilingHeightFt}
                        onChange={(e) =>
                          setData((p) => ({
                            ...p,
                            specifications: { ...p.specifications!, ceilingHeightFt: Number(e.target.value) },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-current/5 border border-current/15 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">Flooring Specifications:</label>
                      <input
                        type="text"
                        value={data.specifications.flooring}
                        onChange={(e) =>
                          setData((p) => ({
                            ...p,
                            specifications: { ...p.specifications!, flooring: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-current/5 border border-current/15"
                      />
                    </div>
                    <div>
                      <label className="block opacity-70 mb-1">Windows &amp; Glazing:</label>
                      <input
                        type="text"
                        value={data.specifications.doorsAndWindows}
                        onChange={(e) =>
                          setData((p) => ({
                            ...p,
                            specifications: { ...p.specifications!, doorsAndWindows: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-current/5 border border-current/15"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 5: ORIENTATION, SMART TECH & SUSTAINABILITY */}
          {/* ============================================================== */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>Step 5: Orientation, Parking, Smart Tech &amp; Sustainability</span>
                  </h3>
                  <p className="text-xs opacity-70 mt-0.5">
                    Vaastu compliance, scenic views, EV infrastructure, and smart automation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Primary Orientation / Facing</label>
                  <select
                    value={data.primaryOrientation}
                    onChange={(e) => updateField('primaryOrientation', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs"
                  >
                    <option value="East">East</option>
                    <option value="North-East">North-East</option>
                    <option value="North">North</option>
                    <option value="West">West</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Vaastu Compliance (%)</label>
                  <input
                    type="number"
                    value={data.vaastuCompliantPercent}
                    onChange={(e) => updateField('vaastuCompliantPercent', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">EV Supercharging Bays</label>
                  <input
                    type="number"
                    value={data.evChargingBays}
                    onChange={(e) => updateField('evChargingBays', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Green Certification</label>
                  <input
                    type="text"
                    value={data.greenCertification}
                    onChange={(e) => updateField('greenCertification', e.target.value)}
                    placeholder="e.g. IGBC Platinum Certified"
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15"
                  />
                </div>
              </div>

              {/* Smart Automation & Sustainability Checkboxes */}
              <div className="p-4 rounded-2xl bg-current/5 border border-current/10 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.smartHomeEnabled}
                    onChange={(e) => updateField('smartHomeEnabled', e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Smart Home Automation</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.rainwaterHarvesting}
                    onChange={(e) => updateField('rainwaterHarvesting', e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Rainwater Harvesting</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.solarPowerForCommonAreas}
                    onChange={(e) => updateField('solarPowerForCommonAreas', e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Solar Common Power</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.sewageTreatmentPlant}
                    onChange={(e) => updateField('sewageTreatmentPlant', e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Sewage Treatment (STP)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.organicWasteConverter}
                    onChange={(e) => updateField('organicWasteConverter', e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Organic Waste Converter</span>
                </label>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 6: VISUAL MEDIA & MASTER BLUEPRINTS */}
          {/* ============================================================== */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Step 6: Visual Media, Master Layouts &amp; Blueprints</span>
                  </h3>
                  <p className="text-xs opacity-70 mt-0.5">
                    High-resolution hero elevation, categorized photography, and layout plans.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Cover Image */}
                <div>
                  <label className="block font-bold mb-1">
                    Cover Hero Image URL <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.coverImageUrl}
                    onChange={(e) => updateField('coverImageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs font-mono"
                  />
                  {data.coverImageUrl && (
                    <div className="mt-2 h-36 rounded-xl overflow-hidden border border-current/15">
                      <img
                        src={data.coverImageUrl}
                        alt="Project Cover Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>

                {/* Master Plan & Video */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">
                      Master Plan Blueprint URL <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={data.masterPlanUrl}
                      onChange={(e) => updateField('masterPlanUrl', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Walkthrough Video URL (YouTube / MP4)</label>
                    <input
                      type="text"
                      value={data.videoWalkthroughUrl || ''}
                      onChange={(e) => updateField('videoWalkthroughUrl', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 7: AI CONTENT, SEO, FAQS & LISTING QUALITY AUDIT */}
          {/* ============================================================== */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Step 7: AI Smart Content, SEO Meta Tags &amp; Quality Audit</span>
                  </h3>
                  <p className="text-xs opacity-70 mt-0.5">
                    Synthesizes discovery copy, ground-truth FAQs, and final institutional quality check.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRunAiAssistant}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Re-Generate AI Copy</span>
                </button>
              </div>

              {/* Quality Audit Summary */}
              <div className="p-4 rounded-2xl bg-current/5 border border-current/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                    Pre-Publishing Quality Certification
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-black font-mono">{lqs.totalScore}/100</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                        lqs.grade === 'A'
                          ? 'bg-emerald-500 text-black'
                          : lqs.grade === 'B'
                          ? 'bg-amber-500 text-black'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      Grade {lqs.grade} • {lqs.gradeTitle}
                    </span>
                  </div>
                </div>

                {lqs.missingFields.length > 0 && (
                  <div className="text-right text-xs">
                    <span className="text-rose-400 font-bold">
                      {lqs.missingFields.length} Recommended Fields Missing
                    </span>
                    <p className="text-[11px] opacity-60">
                      Fill remaining fields to maximize buyer enquiry conversion.
                    </p>
                  </div>
                )}
              </div>

              {/* Content Editorial Fields */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Project Headline</label>
                  <input
                    type="text"
                    value={data.projectHeadline}
                    onChange={(e) => updateField('projectHeadline', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Editorial Short Summary</label>
                  <textarea
                    rows={3}
                    value={data.shortSummary}
                    onChange={(e) => updateField('shortSummary', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">SEO Meta Title (&lt;60 Chars)</label>
                    <input
                      type="text"
                      value={data.seoTitle}
                      onChange={(e) => updateField('seoTitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">SEO Meta Description (&lt;160 Chars)</label>
                    <input
                      type="text"
                      value={data.metaDescription}
                      onChange={(e) => updateField('metaDescription', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-current/5 border border-current/15 text-xs"
                    />
                  </div>
                </div>

                {/* Grounded FAQs */}
                <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-3">
                  <span className="font-bold uppercase tracking-wider text-amber-400">
                    Grounded Project FAQs ({data.faqs.length})
                  </span>
                  <div className="space-y-2">
                    {data.faqs.map((faq, idx) => (
                      <div key={faq.id || idx} className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...data.faqs];
                            updated[idx].question = e.target.value;
                            updateField('faqs', updated);
                          }}
                          className="font-bold text-xs w-full bg-transparent border-b border-transparent focus:border-amber-500 focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = [...data.faqs];
                            updated[idx].answer = e.target.value;
                            updateField('faqs', updated);
                          }}
                          className="text-xs opacity-75 w-full bg-transparent border-b border-transparent focus:border-amber-500 focus:outline-none leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER CONTROLS */}
        <div className="px-6 py-4 border-t border-current/10 flex items-center justify-between flex-shrink-0 bg-current/5 text-xs">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-4 py-2 rounded-xl bg-current/10 hover:bg-current/20 font-bold flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-current/10 hover:bg-current/20 font-medium transition-colors"
            >
              Cancel
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black flex items-center gap-2 transition-all shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Publish Project with Master Schema</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
