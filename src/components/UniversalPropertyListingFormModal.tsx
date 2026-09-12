/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  Home,
  Map,
  Factory,
  Hotel,
  Layers,
  MapPin,
  IndianRupee,
  Calendar,
  ShieldCheck,
  Phone,
  MessageSquare,
  FileText,
  Upload,
  Plus,
  Trash2,
  Eye,
  Check,
  HelpCircle,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Search,
  ExternalLink,
  Lock,
  ArrowRight,
  TrendingUp,
  Percent,
  Download,
  Info,
  AlertTriangle,
} from 'lucide-react';
import {
  TransactionType,
  PropertyCategory,
  TRANSACTION_TYPES,
  PROPERTY_CATEGORIES,
  UniversalListingFormData,
  MASTER_SCHEMA_FIELDS,
  TOP_30_MANDATORY_FIELDS,
  TOP_50_CUSTOMER_ENGAGEMENT_FIELDS,
  FIELD_DEPENDENCY_RULES,
  computeFinancialCalculations,
  computeListingQualityScore,
  computeTrustScore,
  generateAiListingContent,
  getSamplePreset,
} from '../services/universalListingSchemaService';
import { detectDuplicateListing } from '../services/listingAdvancedEngines';
import { globalKiaanStore } from '../services/store';
import { Property, PricingBreakdown, LocationInfo } from '../types';
import { FormHierarchyBreadcrumbs, FORM_HIERARCHY_STAGES } from './universal-listing/FormHierarchyBreadcrumbs';
import { StagePropertyDetails } from './universal-listing/StagePropertyDetails';
import { StagePricing } from './universal-listing/StagePricing';
import { StageLocation } from './universal-listing/StageLocation';
import { StageAmenities } from './universal-listing/StageAmenities';
import { StageLegalDocs } from './universal-listing/StageLegalDocs';
import { StageMedia } from './universal-listing/StageMedia';
import { StageAvailability } from './universal-listing/StageAvailability';
import { StageContactLeads } from './universal-listing/StageContactLeads';
import { ErrorBoundary } from './ErrorBoundary';

interface UniversalPropertyListingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
  initialCategory?: PropertyCategory;
  initialTransaction?: TransactionType;
  onSuccessPublished?: (propertyId: string) => void;
}

const DEFAULT_FORM_DATA: UniversalListingFormData = {
  transactionType: 'SALE',
  propertyCategory: 'RESIDENTIAL',
  propertySubType: 'Apartment',
  listingPurpose: 'SELF_USE',
  propertyStatus: 'READY_TO_MOVE',
  ageOfPropertyYears: '0-2 Yrs',
  possessionStatus: 'IMMEDIATE',
  possessionDate: new Date().toISOString().split('T')[0],
  internalReferenceId: `REF_${Date.now().toString().slice(-6)}`,

  propertyTitle: '',
  listingHeadline: '',
  shortDescription: '',
  detailedDescription: '',
  keyHighlights: [],
  locationAdvantages: [],

  residential: {
    bedroomsNumeric: 3,
    bhkLabel: '3 BHK',
    bathrooms: 3,
    toilets: 3,
    powderRooms: 0,
    balconiesCount: 2,
    carpetAreaSqFt: 1450,
    builtUpAreaSqFt: 1750,
    superBuiltUpAreaSqFt: 1950,
    balconyAreaSqFt: 180,
    floorNumber: 7,
    totalFloors: 22,
    towerName: 'Tower A',
    wingName: 'East Wing',
    unitNumber: 'A-702',
    entranceFacing: 'EAST',
    propertyFacing: 'EAST',
    mainDoorDirection: 'EAST',
    primaryView: 'Landscaped Garden & City Skyline',
    isCornerUnit: true,
    isRoadFacing: false,
    isGardenFacing: true,
    isPoolFacing: false,
    isHillFacing: false,
    isRiverFacing: false,
    furnishingStatus: 'SEMI_FURNISHED',
    furnishingItems: ['Modular Kitchen', 'Wardrobes', 'Geysers', 'LED Lights & Fans'],
  },

  location: {
    country: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    district: 'Pune',
    microMarket: 'Baner',
    locality: 'Baner High Street Corridor',
    streetAddress: 'Near Pancard Club Road, Baner',
    pinCode: '411045',
    nearbyPlaces: [
      { category: 'TRANSPORT', placeName: 'Pune-Bangalore Highway', distanceKm: 1.5, travelTimeMins: 5, transportMode: 'DRIVE' },
      { category: 'TRANSPORT', placeName: 'Balewadi Metro Station', distanceKm: 2.2, travelTimeMins: 7, transportMode: 'DRIVE' },
      { category: 'EMPLOYMENT', placeName: 'Hinjawadi IT Park', distanceKm: 7.0, travelTimeMins: 16, transportMode: 'DRIVE' },
    ],
  },

  building: {
    projectName: 'The Grand Crest',
    developerName: 'Kiaan Luxury Estates',
    totalTowersCount: 2,
    totalFloorsCount: 22,
    totalUnitsCount: 88,
    constructionStage: 'Ready Possession with OC',
    reraRegistered: true,
    reraNumber: 'P52100039201',
    hasOccupancyCertificate: true,
    hasCommencementCertificate: true,
    hasFireNoc: true,
    hasEnvironmentalClearance: true,
    approvedBanks: ['HDFC Bank', 'State Bank of India', 'ICICI Bank'],
  },

  salePricing: {
    askingPriceINR: 23500000, // 2.35 Cr
    pricePerSqFt: 16206,
    isNegotiable: true,
    expectedPriceINR: 23000000,
    minimumAcceptablePriceINR: 22000000,
    bookingTokenAmountINR: 200000,
    downPaymentPercent: 20,
    loanAvailable: true,
    loanApprovedBanks: ['HDFC Bank', 'SBI', 'ICICI Bank', 'Kotak Mahindra'],
    stampDutyPercent: 6,
    stampDutyAmountINR: 1410000,
    registrationChargesINR: 30000,
    gstPercent: 0,
    gstAmountINR: 0,
    brokeragePercent: 1,
    brokerageAmountINR: 235000,
    otherChargesINR: 150000,
    totalAcquisitionCostINR: 25325000,
    estimatedMonthlyEmiINR: 163000,
  },

  amenities: [
    'Swimming Pool',
    'Clubhouse',
    'Gymnasium',
    '24x7 Security',
    'CCTV Surveillance',
    'Power Backup',
    'EV Charging',
    'Piped Gas Pipeline',
    'Children Play Area',
    'Visitor Parking',
  ],
  customAmenities: [],

  parking: {
    parkingAvailable: true,
    totalSlots: 2,
    coveredSlots: 2,
    openSlots: 0,
    basementSlots: 1,
    stiltSlots: 1,
    hasEvChargingBay: true,
    hasVisitorParking: true,
    twoWheelerSlots: 2,
    isParkingIncludedInPrice: true,
  },

  vastu: {
    vastuCompliant: true,
    vastuConsultantCertified: false,
    mainEntranceDirection: 'EAST',
    balconyDirection: 'NORTH_EAST',
  },

  legalDocumentation: {
    titleClearAndMarketable: true,
    saleDeedAvailable: true,
    motherDeedAvailable: true,
    encumbranceCertificateAvailable: true,
    propertyTaxReceiptsUpdated: true,
    mutationCertificateAvailable: true,
    sevenTwelveExtractAvailable: false,
    naOrderAvailable: true,
    commencementCertificateAvailable: true,
    occupancyCertificateAvailable: true,
    fireNocAvailable: true,
    environmentalClearanceAvailable: true,
    reraApproved: true,
    societyNocAvailable: true,
    bankNocAvailable: true,
    isLitigationFree: true,
    publicVerificationStatus: 'FULLY_VERIFIED',
    privateInternalDocCount: 6,
  },

  media: {
    coverImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    galleryPhotos: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', category: 'LIVING', caption: 'Living Room' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', category: 'BALCONY', caption: 'Balcony View' },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80', category: 'BEDROOM', caption: 'Master Bedroom' },
    ],
    floorPlanUrls: ['https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80'],
    brochurePdfUrl: '',
    costSheetPdfUrl: '',
    videoWalkthroughUrl: '',
  },

  condition: {
    propertyCondition: 'BRAND_NEW',
    paintCondition: 'FRESH',
    flooringType: 'Vitrified Tiles & Hardwood Finish',
  },

  contact: {
    postedBy: 'OWNER',
    contactPersonName: 'Rajesh Sharma',
    phone: '+919822334455',
    whatsApp: '+919822334455',
    email: 'rajesh.sharma@example.com',
    preferredContactMethod: 'WHATSAPP',
    availableContactHours: '10:00 AM - 8:00 PM IST',
    hidePhoneUntilQualified: false,
  },

  brokerage: {
    brokerageApplicable: false,
    brokerageType: 'ZERO_BROKERAGE',
    brokeragePaidBy: 'SELLER',
  },

  engagementEnablers: {
    allowInstantPhoneCalls: true,
    allowDirectWhatsAppEnquiries: true,
    allowSiteVisitScheduling: true,
    allowFloorPlanDownload: true,
    allowCostSheetDownload: true,
    allowBrochureDownload: true,
    allowMakeOffer: true,
    stickyCtaActive: true,
  },

  seo: {
    seoTitle: '3 BHK Apartment for Sale in Baner Pune | Ready OC',
    metaDescription: 'Verified 3 BHK East facing apartment for sale in Baner, Pune. 1450 sq.ft carpet area with modular kitchen and 2 covered parkings.',
    urlSlug: '3-bhk-apartment-for-sale-baner-pune-grand-crest',
    h1Heading: '3 BHK Luxury Apartment in Baner, Pune',
    focusKeywords: ['3 bhk in baner', 'flat for sale baner', 'ready oc 3 bhk pune'],
  },

  adminInternal: {
    internalListingId: `KIAAN_LST_${Date.now().toString().slice(-6)}`,
    internalReferenceNotes: 'Owner direct mandate. Clean title documents attested.',
    minimumAcceptableSellerPriceINR: 22000000,
    fraudRiskScore: 5,
    moderationStatus: 'APPROVED_LIVE',
    featuredPriorityScore: 85,
    duplicateDetected: false,
    internalLeadScore: 90,
  },

  listingQualityScore: 88,
  trustVerificationScore: 95,
  freshnessTimestamp: new Date().toISOString(),
};

export const UniversalPropertyListingFormModal: React.FC<UniversalPropertyListingFormModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
  initialCategory,
  initialTransaction,
  onSuccessPublished,
}) => {
  const isDark = theme === 'dark';

  // UI View Modes: 'WIZARD' (Guided 6 steps), 'EXPRESS' (Unified single page), 'SCHEMA_INSPECTOR' (Section 49 table & dependency matrix)
  const [viewMode, setViewMode] = useState<'WIZARD' | 'EXPRESS' | 'SCHEMA_INSPECTOR'>('WIZARD');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [formData, setFormData] = useState<UniversalListingFormData>(() => {
    try {
      const saved = localStorage.getItem('kiaan_universal_listing_draft_v1');
      if (saved) {
        return { ...DEFAULT_FORM_DATA, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not restore listing draft:', e);
    }
    return DEFAULT_FORM_DATA;
  });

  const [schemaSearchQuery, setSchemaSearchQuery] = useState('');
  const [schemaGroupFilter, setSchemaGroupFilter] = useState('ALL');
  const [schemaReqFilter, setSchemaReqFilter] = useState('ALL');
  const [schemaSubsetView, setSchemaSubsetView] = useState<'MASTER' | 'TOP_30' | 'TOP_50' | 'DEPENDENCY_MATRIX'>('MASTER');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState(false);
  const [publishSuccessId, setPublishSuccessId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [newCustomAmenity, setNewCustomAmenity] = useState('');

  // Update initial filters if passed
  useEffect(() => {
    if (initialCategory) {
      setFormData((prev) => ({ ...prev, propertyCategory: initialCategory }));
    }
    if (initialTransaction) {
      setFormData((prev) => ({ ...prev, transactionType: initialTransaction }));
    }
  }, [initialCategory, initialTransaction]);

  // Auto-save draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kiaan_universal_listing_draft_v1', JSON.stringify(formData));
    } catch (err) {
      // ignore
    }
  }, [formData]);

  // Recompute financial calculations live
  const financials = useMemo(() => computeFinancialCalculations(formData), [formData]);

  // Recompute Quality Score
  const qualityScore = useMemo(() => computeListingQualityScore(formData), [formData]);

  // Recompute Trust Score
  const trustScore = useMemo(() => computeTrustScore(formData), [formData]);

  // Sub-types for currently selected category
  const currentCategoryMeta = useMemo(
    () => PROPERTY_CATEGORIES.find((c) => c.id === formData.propertyCategory) || PROPERTY_CATEGORIES[0],
    [formData.propertyCategory]
  );

  // Filtered schema fields for Schema Inspector
  const filteredSchemaFields = useMemo(() => {
    return MASTER_SCHEMA_FIELDS.filter((f) => {
      const matchesSearch =
        schemaSearchQuery === '' ||
        f.fieldName.toLowerCase().includes(schemaSearchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(schemaSearchQuery.toLowerCase()) ||
        f.fieldGroup.toLowerCase().includes(schemaSearchQuery.toLowerCase());

      const matchesGroup = schemaGroupFilter === 'ALL' || f.fieldGroup === schemaGroupFilter;
      const matchesReq = schemaReqFilter === 'ALL' || f.requiredLevel === schemaReqFilter;

      return matchesSearch && matchesGroup && matchesReq;
    });
  }, [schemaSearchQuery, schemaGroupFilter, schemaReqFilter]);

  if (!isOpen) return null;

  // Handle Preset Load
  const handleLoadPreset = (
    preset:
      | 'LUXURY_PENTHOUSE'
      | 'COMMERCIAL_PRELEASE'
      | 'RESALE_LUXURY_APARTMENT'
      | 'STANDALONE_VILLA_BUNGALOW'
  ) => {
    const p = getSamplePreset(preset);
    setFormData((prev) => ({
      ...prev,
      ...p,
      propertyTitle: p.propertyTitle || prev.propertyTitle,
      listingHeadline: p.listingHeadline || prev.listingHeadline,
      shortDescription: p.shortDescription || prev.shortDescription,
      detailedDescription: p.detailedDescription || prev.detailedDescription,
      residential: p.residential || prev.residential,
      commercial: p.commercial || prev.commercial,
      land: p.land || prev.land,
      resaleAndStandaloneDetails: p.resaleAndStandaloneDetails || prev.resaleAndStandaloneDetails,
      freshnessAudit: p.freshnessAudit || prev.freshnessAudit,
      adminInternal: p.adminInternal || prev.adminInternal,
      availability: p.availability || prev.availability,
      salePricing: p.salePricing || prev.salePricing,
      preLeasedData: p.preLeasedData || prev.preLeasedData,
      location: p.location || prev.location,
      building: p.building || prev.building,
      media: p.media || prev.media,
      seo: p.seo || prev.seo,
      contact: p.contact || prev.contact,
    }));
  };

  // Section 37: Automated Duplicate Detection Engine
  const duplicateReport = useMemo(() => {
    const allProps = globalKiaanStore.getAllPropertiesForAdmin();
    const existingProperties: Partial<UniversalListingFormData>[] = allProps.map((p) => ({
      contact: {
        phone: p.createdBy?.phone || '9876543210',
        contactPersonName: p.createdBy?.name || 'Agent',
        whatsApp: p.createdBy?.phone || '9876543210',
        email: p.createdBy?.email || 'sales@kiaanproperties.in',
        preferredContactMethod: 'WHATSAPP' as const,
        availableContactHours: '9:00 AM - 8:00 PM',
        hidePhoneUntilQualified: false,
        postedBy: 'AGENT' as const,
      },
      building: {
        projectName: p.projectName || p.title,
        developerName: p.createdBy?.name || 'Kiaan Partner Developer',
        reraRegistered: Boolean(p.reraRecord?.registrationNumber),
        reraNumber: p.reraRecord?.registrationNumber || '',
        hasOccupancyCertificate: true,
        hasCommencementCertificate: true,
        hasFireNoc: true,
        hasEnvironmentalClearance: true,
        approvedBanks: ['HDFC', 'SBI'],
      },
      residential: {
        bedroomsNumeric: p.bedroomsNumeric || 3,
        bhkLabel: p.configuration || `${p.bedroomsNumeric || 3} BHK`,
        bathrooms: 2,
        toilets: 2,
        powderRooms: 0,
        balconiesCount: 1,
        carpetAreaSqFt: p.carpetAreaSqFt || 1200,
        floorNumber: p.floorNumber || 1,
        totalFloors: p.totalFloors || 10,
        unitNumber: p.unitId || '',
        entranceFacing: 'EAST',
        propertyFacing: 'EAST',
        mainDoorDirection: 'EAST',
        primaryView: 'Open City View',
        isCornerUnit: false,
        isRoadFacing: true,
        isGardenFacing: false,
        isPoolFacing: false,
        isHillFacing: false,
        isRiverFacing: false,
        furnishingStatus: 'SEMI_FURNISHED' as const,
        furnishingItems: [],
      },
      location: {
        country: 'India',
        state: p.location?.state || 'Maharashtra',
        city: p.location?.city || 'Pune',
        district: 'Pune',
        microMarket: p.location?.microMarket || 'Baner',
        locality: p.location?.microMarket || 'Baner',
        streetAddress: p.location?.address || '',
        pinCode: p.location?.pincode || '411045',
        latitude: p.location?.coordinates?.lat || 0,
        longitude: p.location?.coordinates?.lng || 0,
        nearbyPlaces: [],
      },
      salePricing: {
        askingPriceINR: p.pricing?.basePrice || p.pricing?.totalEstimatedAcquisitionCost || 0,
        pricePerSqFt: p.pricing?.pricePerSqFt || Math.round((p.pricing?.basePrice || 0) / (p.carpetAreaSqFt || 1)),
        isNegotiable: true,
        stampDutyPercent: 6,
        stampDutyAmountINR: Math.round((p.pricing?.basePrice || 0) * 0.06),
        registrationChargesINR: 30000,
        gstPercent: 0,
        gstAmountINR: 0,
        totalAcquisitionCostINR: p.pricing?.totalEstimatedAcquisitionCost || p.pricing?.basePrice || 0,
        estimatedMonthlyEmiINR: Math.round(((p.pricing?.basePrice || 0) * 0.8 * 0.085) / 12),
        loanAvailable: true,
        loanApprovedBanks: ['HDFC', 'SBI'],
      },
      media: {
        coverImageUrl: p.media?.[0]?.url || '',
        galleryPhotos: (p.media || []).map((m) => ({ url: m.url, category: 'LIVING' as const })),
        floorPlanUrls: p.floorPlanUrl ? [p.floorPlanUrl] : [],
      },
    }));

    return detectDuplicateListing(formData, existingProperties);
  }, [formData]);

  // AI Generation trigger
  const handleGenerateAiCopy = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const aiResult = generateAiListingContent(formData);
      setFormData((prev) => ({
        ...prev,
        listingHeadline: aiResult.listingHeadline,
        propertyTitle: prev.propertyTitle || aiResult.listingHeadline,
        shortDescription: aiResult.shortDescription,
        detailedDescription: aiResult.detailedDescription,
        keyHighlights: aiResult.keyHighlights,
        locationAdvantages: aiResult.locationAdvantages,
        socialMediaCaption: aiResult.socialMediaCaption,
        whatsAppShareText: aiResult.whatsAppShareText,
        seo: {
          ...prev.seo,
          seoTitle: `${aiResult.listingHeadline.slice(0, 50)} | Kiaan Properties`,
          metaDescription: aiResult.shortDescription.slice(0, 155),
          h1Heading: aiResult.listingHeadline,
        },
      }));
      setIsAiGenerating(false);
      setAiSuccessMsg(true);
      setTimeout(() => setAiSuccessMsg(false), 3500);
    }, 600);
  };

  // Publish to Store
  const handlePublishListing = () => {
    const errors: string[] = [];
    if (!formData.propertyTitle || formData.propertyTitle.trim().length < 5) {
      errors.push('Property Title is required (minimum 5 characters).');
    }
    if (!formData.location.city || !formData.location.microMarket) {
      errors.push('City and Micro-Market are mandatory location fields.');
    }
    const hasPrice =
      (formData.salePricing?.askingPriceINR && formData.salePricing.askingPriceINR > 0) ||
      (formData.rentPricing?.monthlyRentINR && formData.rentPricing.monthlyRentINR > 0) ||
      (formData.preLeasedData?.monthlyRentINR && formData.preLeasedData.monthlyRentINR > 0) ||
      (formData.auctionData?.reservePriceINR && formData.auctionData.reservePriceINR > 0) ||
      (formData.coworkingData?.dedicatedDeskMonthlyINR && formData.coworkingData.dedicatedDeskMonthlyINR > 0) ||
      (formData.pgHostelData?.doubleSharingMonthlyRentINR && formData.pgHostelData.doubleSharingMonthlyRentINR > 0) ||
      (formData.jointVentureData?.estimatedRevenuePotentialINR && formData.jointVentureData.estimatedRevenuePotentialINR > 0);
    if (!hasPrice) {
      errors.push('Asking Price, Monthly Rent, Reserve Price, or Desk/Bed Rent must be provided.');
    }
    if (!formData.contact.phone && !formData.contact.whatsApp) {
      errors.push('A valid Phone number or WhatsApp contact is required.');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    const propId = `prop_${Date.now()}`;
    const slug =
      formData.seo.urlSlug ||
      formData.propertyTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const propType: Property['propertyType'] =
      formData.propertyCategory === 'COMMERCIAL'
        ? 'OFFICE'
        : formData.propertyCategory === 'LAND_AND_PLOTS'
        ? 'LAND'
        : formData.residential?.bhkLabel?.includes('Penthouse')
        ? 'PENTHOUSE'
        : 'APARTMENT';

    const newProperty: Property = {
      id: propId,
      slug: slug || `property-${propId}`,
      title: formData.propertyTitle,
      propertyType: propType,
      status: 'PUBLISHED',
      location: {
        id: `loc_${propId}`,
        address: formData.location.streetAddress || 'Baner High Street',
        city: formData.location.city || 'Pune',
        state: formData.location.state || 'Maharashtra',
        microMarket: formData.location.microMarket || 'Baner',
        pincode: formData.location.pinCode || '411045',
        coordinates: {
          lat: formData.location.latitude || 18.559,
          lng: formData.location.longitude || 73.7868,
        },
        landmarks: formData.location.nearbyPlaces.map((p) => ({
          name: p.placeName,
          type: 'HIGHWAY',
          distanceKm: p.distanceKm,
          commuteMinutes: p.travelTimeMins,
        })),
      },
      configuration:
        formData.propertyCategory === 'RESIDENTIAL'
          ? formData.residential?.bhkLabel || '3 BHK'
          : `${formData.commercial?.carpetAreaSqFt || 1000} Sq.Ft Office`,
      carpetAreaSqFt:
        formData.residential?.carpetAreaSqFt ||
        formData.commercial?.carpetAreaSqFt ||
        formData.land?.plotArea ||
        1200,
      floorNumber: formData.residential?.floorNumber || formData.commercial?.floorNumber || 5,
      totalFloors: formData.residential?.totalFloors || formData.commercial?.totalFloors || 20,
      facing: formData.residential?.propertyFacing || 'EAST',
      parkingCount: formData.parking.totalSlots || 1,
      pricing: {
        basePrice: formData.salePricing?.askingPriceINR || 15000000,
        pricePerSqFt: financials.pricePerSqFt || 12000,
        carParkingCharges: 0,
        clubhouseMaintenanceCharges: 50000,
        estimatedGstPercent: formData.salePricing?.gstPercent || 0,
        estimatedStampDutyPercent: 6,
        registrationCharges: 30000,
        maintenanceDeposit1Yr: 60000,
        totalEstimatedAcquisitionCost: financials.totalAcquisitionCostINR || 16000000,
        comparableMarketRange: {
          min: Math.round((formData.salePricing?.askingPriceINR || 15000000) * 0.95),
          max: Math.round((formData.salePricing?.askingPriceINR || 15000000) * 1.05),
          positioning: 'PREMIUM',
        },
      },
      amenities: formData.amenities.map((a, idx) => ({
        id: `amenity_${idx}`,
        name: a,
        category: 'LIFESTYLE',
        icon: 'Sparkles',
        featured: true,
      })),
      media: [
        {
          id: `m_cov_${Date.now()}`,
          url:
            formData.media.coverImageUrl ||
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          type: 'IMAGE',
          category: 'EXTERIOR',
          title: 'Cover Image',
        },
        ...formData.media.galleryPhotos.map((p, i) => ({
          id: `m_gal_${i}`,
          url: p.url,
          type: 'IMAGE' as const,
          category: 'INTERIOR' as const,
          title: p.caption || 'Interior',
        })),
      ],
      propertyScore: {
        overallScore: qualityScore.score,
        breakdown: {
          location: 92,
          value: 88,
          lifestyle: 90,
          connectivity: 94,
          investmentYield: formData.transactionType === 'PRE_LEASE' ? 95 : 82,
          spaceLayout: 89,
          developerReputation: 93,
        },
        decisionConfidencePercent: trustScore.isReraVerified ? 96 : 85,
        informationCompletenessPercent: qualityScore.score,
        personalityBadge: 'Luxury Statement',
      },
      possessionStatus: formData.propertyStatus === 'READY_TO_MOVE' ? 'READY_POSSESSION' : 'UNDER_CONSTRUCTION',
      possessionDate: formData.possessionDate || 'Immediate',
      overviewDescription: formData.detailedDescription || formData.shortDescription || formData.propertyTitle,
      isPublished: true,
      isKiaanPick: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: {
        name: formData.contact.contactPersonName || 'Universal Real Estate Poster',
        email: formData.contact.email || 'sales@kiaanproperties.in',
        phone: formData.contact.phone,
        role: 'AGENT',
        trustLevel: 'VERIFIED_OWNER',
      },
    };

    // Save to KiaanStore
    globalKiaanStore.saveProperty(newProperty);

    setPublishSuccessId(propId);
    if (onSuccessPublished) {
      onSuccessPublished(propId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      <div
        className={`relative w-full max-w-7xl h-[94vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#0B101D] text-slate-100 border-amber-500/30' : 'bg-slate-50 text-slate-900 border-slate-300'
        }`}
      >
        {/* ================= HEADER ================= */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
            isDark ? 'bg-[#0E1526] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-black flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Universal Schema Engine
              </span>
              <span className="text-xs opacity-60 font-mono hidden sm:inline">RERA Compliant · All Categories</span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold tracking-wide mt-0.5">
              Universal Property Listing Platform
            </h2>
          </div>

          {/* Quick Presets & Mode Selector */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-black/30 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => handleLoadPreset('LUXURY_PENTHOUSE')}
                className="px-2.5 py-1 rounded-lg hover:bg-amber-500/20 text-amber-300 hover:text-white transition-all cursor-pointer font-medium"
                title="Load sample residential penthouse in Baner"
              >
                ⚡ Penthouse
              </button>
              <span className="text-white/20">|</span>
              <button
                type="button"
                onClick={() => handleLoadPreset('RESALE_LUXURY_APARTMENT')}
                className="px-2.5 py-1 rounded-lg hover:bg-cyan-500/20 text-cyan-300 hover:text-white transition-all cursor-pointer font-medium"
                title="Load sample resale luxury apartment with society NOC & chain title"
              >
                ⚡ Resale Flat
              </button>
              <span className="text-white/20">|</span>
              <button
                type="button"
                onClick={() => handleLoadPreset('STANDALONE_VILLA_BUNGALOW')}
                className="px-2.5 py-1 rounded-lg hover:bg-purple-500/20 text-purple-300 hover:text-white transition-all cursor-pointer font-medium"
                title="Load sample standalone villa / bungalow with independent plot & terrace"
              >
                ⚡ Standalone Villa
              </button>
              <span className="text-white/20">|</span>
              <button
                type="button"
                onClick={() => handleLoadPreset('COMMERCIAL_PRELEASE')}
                className="px-2.5 py-1 rounded-lg hover:bg-emerald-500/20 text-emerald-300 hover:text-white transition-all cursor-pointer font-medium"
                title="Load sample pre-leased commercial office in Hinjawadi"
              >
                ⚡ Pre-Leased
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('WIZARD')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'WIZARD'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Guided Wizard
              </button>
              <button
                type="button"
                onClick={() => setViewMode('EXPRESS')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'EXPRESS'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Express Form
              </button>
              <button
                type="button"
                onClick={() => setViewMode('SCHEMA_INSPECTOR')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'SCHEMA_INSPECTOR'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <FileText className="w-3 h-3" />
                Schema Inspector
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= QUALITY & TRUST SCORE BANNER ================= */}
        <div
          className={`px-4 sm:px-6 py-2 border-b flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 ${
            isDark ? 'bg-[#0B101D] border-white/5' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Listing Quality Score */}
            <div className="flex items-center gap-2">
              <span className="font-semibold opacity-75">Listing Quality Score (LQS):</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-xs ${
                  qualityScore.score >= 85
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : qualityScore.score >= 60
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {qualityScore.score}/100 · {qualityScore.tier}
              </span>
            </div>

            {/* Trust Score */}
            <div className="flex items-center gap-2">
              <span className="font-semibold opacity-75">Trust Verification:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold font-mono text-xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                {trustScore.score}% Verified
              </span>
            </div>

            {/* Dynamic Advice */}
            {qualityScore.recommendations.length > 0 && (
              <span className="hidden xl:inline text-amber-400/90 truncate max-w-md">
                💡 Tip: {qualityScore.recommendations[0]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerateAiCopy}
              disabled={isAiGenerating}
              className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : 'text-purple-300'}`} />
              {isAiGenerating ? 'Generating AI Copy...' : 'AI Auto-Fill Copy'}
            </button>
            {aiSuccessMsg && (
              <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Generated!
              </span>
            )}
          </div>
        </div>

        {/* Validation Errors Notice */}
        {validationErrors.length > 0 && (
          <div className="px-6 py-2.5 bg-rose-500/15 border-b border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Please complete Level 1 mandatory fields before publishing:</span>
              <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Duplicate Detection Warning Notice (Section 37) */}
        {duplicateReport.isDuplicateFlagged && (
          <div className="px-4 sm:px-6 py-2.5 bg-amber-500/15 border-b border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-amber-300">
                  37. Duplicate Detection Warning ({duplicateReport.duplicateScore}/100 Match Probability)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                  {duplicateReport.confidenceLevel}
                </span>
              </div>
              <p className="text-amber-200/90 leading-snug">
                The multi-vector duplication engine detected potential duplicate overlaps against the existing catalog based on {duplicateReport.matchingSignals.length} parameters:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {duplicateReport.matchingSignals.map((sig, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-black/40 border border-amber-500/30 text-amber-300 text-[10px] font-mono"
                  >
                    {sig}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-amber-300/80 italic">
                Administrator advisory: Check whether this unit is already posted under another agent, phone number, or project alias before publishing.
              </p>
            </div>
          </div>
        )}

        {/* Success Modal Confirmation */}
        {publishSuccessId && (
          <div className="p-8 text-center bg-emerald-950/90 border-b border-emerald-500/40 flex flex-col items-center justify-center shrink-0">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center mb-3 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">Property Successfully Published!</h3>
            <p className="text-emerald-200 text-sm max-w-md mt-1">
              Your listing has passed validation, received an LQS score of {qualityScore.score}%, and is now live in
              the public discovery index and comparison engine.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setPublishSuccessId(null);
                  onClose();
                }}
                className="px-6 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                View Live Property
              </button>
              <button
                type="button"
                onClick={() => setPublishSuccessId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Post Another Property
              </button>
            </div>
          </div>
        )}

        {/* ================= MAIN SCROLLABLE CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* ================= VIEW: SCHEMA INSPECTOR (SECTION 49) ================= */}
          {viewMode === 'SCHEMA_INSPECTOR' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <h3 className="text-base font-bold text-amber-400">
                    Section 49: Universal Real-Estate Data Schema & Field Dictionary
                  </h3>
                  <p className="text-xs opacity-75 mt-0.5">
                    Production-ready schema supporting residential, commercial, land, industrial, hospitality, and pre-leased investment assets.
                  </p>
                </div>

                {/* Sub-view switcher */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-black/50 border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setSchemaSubsetView('MASTER')}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      schemaSubsetView === 'MASTER' ? 'bg-amber-500 text-black font-bold' : 'text-white/70'
                    }`}
                  >
                    Master Table ({MASTER_SCHEMA_FIELDS.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchemaSubsetView('TOP_30')}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      schemaSubsetView === 'TOP_30' ? 'bg-amber-500 text-black font-bold' : 'text-white/70'
                    }`}
                  >
                    Top 30 Mandatory
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchemaSubsetView('TOP_50')}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      schemaSubsetView === 'TOP_50' ? 'bg-amber-500 text-black font-bold' : 'text-white/70'
                    }`}
                  >
                    Top 50 Engagement
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchemaSubsetView('DEPENDENCY_MATRIX')}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      schemaSubsetView === 'DEPENDENCY_MATRIX' ? 'bg-amber-500 text-black font-bold' : 'text-white/70'
                    }`}
                  >
                    Dependency Matrix
                  </button>
                </div>
              </div>

              {/* View: Master Table */}
              {schemaSubsetView === 'MASTER' && (
                <div className="space-y-4">
                  {/* Search and Filter bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[240px]">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        placeholder="Search fields by name, group, or description..."
                        value={schemaSearchQuery}
                        onChange={(e) => setSchemaSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <select
                      value={schemaGroupFilter}
                      onChange={(e) => setSchemaGroupFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="ALL">All Field Groups</option>
                      <option value="Hierarchy & Classification">Hierarchy & Classification</option>
                      <option value="Property Specifications">Property Specifications</option>
                      <option value="Pricing & Financials">Pricing & Financials</option>
                      <option value="Location & Connectivity">Location & Connectivity</option>
                      <option value="Building & Legal">Building & Legal</option>
                      <option value="Amenities & Lifestyle">Amenities & Lifestyle</option>
                      <option value="Media & Assets">Media & Assets</option>
                      <option value="Contact & Brokerage">Contact & Brokerage</option>
                      <option value="Customer Engagement">Customer Engagement</option>
                      <option value="SEO & Marketing">SEO & Marketing</option>
                      <option value="Admin Governance">Admin Governance</option>
                    </select>
                    <select
                      value={schemaReqFilter}
                      onChange={(e) => setSchemaReqFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="ALL">All Required Levels</option>
                      <option value="LEVEL_1_MANDATORY">Level 1 — Mandatory</option>
                      <option value="LEVEL_2_RECOMMENDED">Level 2 — Recommended</option>
                      <option value="LEVEL_3_OPTIONAL">Level 3 — Optional</option>
                    </select>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-white/5 border-b border-white/10 text-amber-400 font-mono">
                        <tr>
                          <th className="p-3">Field Name</th>
                          <th className="p-3">Group</th>
                          <th className="p-3">Target Asset</th>
                          <th className="p-3">Txn Type</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Level</th>
                          <th className="p-3">Scope</th>
                          <th className="p-3">Impact</th>
                          <th className="p-3">Validation & Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-sans">
                        {filteredSchemaFields.map((f, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-mono font-bold text-white">{f.fieldName}</td>
                            <td className="p-3 text-white/80">{f.fieldGroup}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px]">{f.propertyType}</span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                                {f.transactionType}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-[11px] text-cyan-300">{f.fieldType}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  f.requiredLevel === 'LEVEL_1_MANDATORY'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : f.requiredLevel === 'LEVEL_2_RECOMMENDED'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-500/20 text-slate-400'
                                }`}
                              >
                                {f.requiredLevel.replace('LEVEL_', 'L').replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] ${
                                  f.visibility === 'ADMIN_ONLY'
                                    ? 'bg-purple-500/20 text-purple-300 font-bold'
                                    : 'bg-emerald-500/20 text-emerald-300'
                                }`}
                              >
                                {f.visibility}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  f.engagementImpact === 'HIGH'
                                    ? 'text-emerald-400'
                                    : f.engagementImpact === 'MEDIUM'
                                    ? 'text-amber-400'
                                    : 'text-slate-400'
                                }`}
                              >
                                {f.engagementImpact}
                              </span>
                            </td>
                            <td className="p-3 max-w-xs text-white/70">
                              <div className="font-medium text-white/90">{f.description}</div>
                              <div className="text-[10px] opacity-60 font-mono mt-0.5">{f.validation}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* View: Top 30 Mandatory Fields */}
              {schemaSubsetView === 'TOP_30' && (
                <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <h4 className="font-bold text-sm text-white">Top 30 Mandatory Fields to Publish (Level 1)</h4>
                  </div>
                  <p className="text-xs text-white/70">
                    These fields are required before a listing can go live to maintain market integrity, accurate search indexing, and lead qualification.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {TOP_30_MANDATORY_FIELDS.map((item, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2 text-xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                          {i + 1}
                        </span>
                        <span className="font-mono text-white/90 truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View: Top 50 Customer Engagement Fields */}
              {schemaSubsetView === 'TOP_50' && (
                <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h4 className="font-bold text-sm text-white">Top 50 Customer Engagement & Conversion Fields</h4>
                  </div>
                  <p className="text-xs text-white/70">
                    Fields proven to maximize WhatsApp enquiries, verified phone calls, site visit bookings, and buyer saves.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {TOP_50_CUSTOMER_ENGAGEMENT_FIELDS.map((item, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2 text-xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                          {i + 1}
                        </span>
                        <span className="font-mono text-white/90 truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View: Complete Field Dependency Matrix */}
              {schemaSubsetView === 'DEPENDENCY_MATRIX' && (
                <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-4">
                  <h4 className="font-bold text-sm text-white">Complete Field Dependency Matrix</h4>
                  <p className="text-xs text-white/70">
                    Demonstrating dynamic conditional logic: fields automatically adapt to category and transaction selection without presenting irrelevant questions.
                  </p>
                  <div className="space-y-3">
                    {FIELD_DEPENDENCY_RULES.map((rule, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg bg-white/5 border border-white/10 text-xs space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold text-[10px]">
                            IF {JSON.stringify(rule.when).replace(/["{}]/g, '').replace(':', ' = ')}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                          <div className="p-2 rounded bg-black/30">
                            <span className="text-emerald-400 font-bold block mb-1">Active Form Groups:</span>
                            <span className="text-white/80">{rule.showGroups.join(', ')}</span>
                          </div>
                          <div className="p-2 rounded bg-black/30">
                            <span className="text-amber-400 font-bold block mb-1">Mandatory Fields:</span>
                            <span className="text-white/80 font-mono">{rule.mandatoryFields.join(', ')}</span>
                          </div>
                          <div className="p-2 rounded bg-black/30">
                            <span className="text-rose-400 font-bold block mb-1">Strictly Hidden:</span>
                            <span className="text-white/60 font-mono">{rule.hiddenFields.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW: WIZARD OR EXPRESS FORM ================= */}
          {(viewMode === 'WIZARD' || viewMode === 'EXPRESS') && (
            <div className="space-y-8 max-w-5xl mx-auto">
              {/* Wizard Step Breadcrumbs */}
              {viewMode === 'WIZARD' && (
                <FormHierarchyBreadcrumbs
                  activeStep={activeStep}
                  onSelectStep={setActiveStep}
                  selectedCategory={formData.propertyCategory}
                  selectedTransaction={formData.transactionType}
                />
              )}

              {/* Express Mode Quick-Jump Stage Pills */}
              {viewMode === 'EXPRESS' && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">
                      Express Unified Mode &bull; All 12 Stages Active
                    </span>
                    <span className="text-[11px] text-white/50">Click any stage to quick-scroll</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {FORM_HIERARCHY_STAGES.map((st) => (
                      <a
                        key={st.step}
                        href={`#stage-${st.step}`}
                        className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-amber-500/20 text-white/80 hover:text-amber-300 border border-white/10 text-[11px] font-mono transition-colors"
                      >
                        {st.step}. {st.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= STAGE 1: TRANSACTION TYPE ================= */}
              {(viewMode === 'EXPRESS' || activeStep === 1) && (
                <div id="stage-1" className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-5 scroll-mt-20">
                  <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-400" />
                        1. Transaction Model & Structure
                      </h3>
                      <p className="text-xs opacity-70">
                        Select from 25 institutional and standalone transaction types to activate targeted legal & financial logic.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      Stage 1 of 12 &bull; Mandatory
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {TRANSACTION_TYPES.map((t) => {
                      const isSelected = formData.transactionType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, transactionType: t.id }))}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-lg scale-[1.02]'
                              : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">{t.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span
                            className={`text-[10px] mt-1 line-clamp-1 ${
                              isSelected ? 'text-black/70 font-medium' : 'text-white/40'
                            }`}
                          >
                            {t.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= STAGE 2: PROPERTY CATEGORY ================= */}
              {(viewMode === 'EXPRESS' || activeStep === 2) && (
                <div id="stage-2" className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-5 scroll-mt-20">
                  <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        2. Property Asset Category
                      </h3>
                      <p className="text-xs opacity-70">
                        Choose your primary asset vertical to dynamically populate architecture, zoning, and compliance standards.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      Stage 2 of 12 &bull; Mandatory
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PROPERTY_CATEGORIES.map((cat) => {
                      const isSelected = formData.propertyCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              propertyCategory: cat.id,
                              propertySubType: cat.subTypes[0] || 'Standard',
                            }))
                          }
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400'
                              : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs text-white">{cat.name}</div>
                            <div className="text-[10px] opacity-70 line-clamp-2 mt-1">{cat.shortDesc}</div>
                          </div>
                          <div className="mt-3 text-[10px] font-mono text-amber-400/80">
                            {cat.subTypes.length} Specific Sub-types
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= STAGE 3: PROPERTY SUB-TYPE ================= */}
              {(viewMode === 'EXPRESS' || activeStep === 3) && (
                <div id="stage-3" className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-5 scroll-mt-20">
                  <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                        <Home className="w-4 h-4 text-amber-400" />
                        3. Property Sub-Type ({currentCategoryMeta.name})
                      </h3>
                      <p className="text-xs opacity-70">
                        Filtered specifically to sub-types belonging to {currentCategoryMeta.name}.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      Stage 3 of 12 &bull; Mandatory
                    </span>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-white/90 block">
                      Select Sub-Type for {currentCategoryMeta.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {currentCategoryMeta.subTypes.map((st) => {
                        const isSelected = formData.propertySubType === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, propertySubType: st }))}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md'
                                : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                            }`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STAGE 4: PURPOSE, TITLE & AI COPY ================= */}
              {(viewMode === 'EXPRESS' || activeStep === 4) && (
                <div id="stage-4" className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-5 scroll-mt-20">
                  <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        4. Purpose, Title & AI Copywriting Engine
                      </h3>
                      <p className="text-xs opacity-70">
                        Define buyer purpose, create high-converting titles, and auto-generate copy with zero hallucinations.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateAiCopy}
                      disabled={isAiGenerating}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
                      <span>{isAiGenerating ? 'Synthesizing...' : 'AI Auto-Fill Listing Copy'}</span>
                    </button>
                  </div>

                  {aiSuccessMsg && (
                    <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-xs text-purple-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      AI generated professional headline, SEO copy, highlights, and WhatsApp pitch grounded in verified data!
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/90 block">
                        Listing Purpose <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={formData.listingPurpose}
                        onChange={(e) => setFormData((prev) => ({ ...prev, listingPurpose: e.target.value as any }))}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="SELF_USE">Self-Use (End-User Occupant)</option>
                        <option value="INVESTMENT">High-Yield Investment / Capital Growth</option>
                        <option value="COMMERCIAL_OPERATIONS">Commercial Business Operations</option>
                        <option value="DEVELOPMENT">Development Opportunity / Joint Venture</option>
                        <option value="REDEVELOPMENT">Redevelopment Opportunity</option>
                        <option value="MIXED">Mixed / Multi-Purpose</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/90 block">
                        Listing Title <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Signature 3.5 BHK East-Facing Penthouse"
                        value={formData.propertyTitle}
                        onChange={(e) => setFormData((prev) => ({ ...prev, propertyTitle: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/90 block">
                      Listing Headline (High-Converting Hook)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rare 2,450 Sq.Ft Sky Duplex with 180° Panoramic Hill Views in Prime Baner"
                      value={formData.listingHeadline}
                      onChange={(e) => setFormData((prev) => ({ ...prev, listingHeadline: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/90 block">Short Summary (for Cards)</label>
                      <textarea
                        rows={3}
                        value={formData.shortDescription}
                        onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                        placeholder="Concise overview highlighting standout features..."
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/90 block">Detailed Description</label>
                      <textarea
                        rows={3}
                        value={formData.detailedDescription}
                        onChange={(e) => setFormData((prev) => ({ ...prev, detailedDescription: e.target.value }))}
                        placeholder="Comprehensive spatial and community walkthrough..."
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STAGE 5: PROPERTY SPECIFICATIONS ================= */}
              {(viewMode === 'EXPRESS' || activeStep === 5) && (
                <div id="stage-5" className="scroll-mt-20">
                  <ErrorBoundary fallbackTitle="Property Details Section">
                    <StagePropertyDetails formData={formData} setFormData={setFormData} />
                  </ErrorBoundary>
                </div>
              )}

              {/* ================= STAGE 6: PRICING & FINANCIALS ================= */}
              {(viewMode === 'EXPRESS' || activeStep === 6) && (
                <div id="stage-6" className="scroll-mt-20">
                  <ErrorBoundary fallbackTitle="Pricing & Financials Section">
                    <StagePricing formData={formData} setFormData={setFormData} financials={financials} />
                  </ErrorBoundary>
                </div>
              )}

              {/* ================= STAGE 7: LOCATION & MICRO-MARKET ================= */}
              {(viewMode === 'EXPRESS' || activeStep === 7) && (
                <div id="stage-7" className="scroll-mt-20">
                  <ErrorBoundary fallbackTitle="Location & Connectivity Section">
                    <StageLocation formData={formData} setFormData={setFormData} />
                  </ErrorBoundary>
                </div>
              )}

              {/* ================= STAGE 8: AMENITIES & LIFESTYLE ================= */}
              {(viewMode === 'EXPRESS' || activeStep === 8) && (
                <div id="stage-8" className="scroll-mt-20">
                  <ErrorBoundary fallbackTitle="Amenities & Lifestyle Section">
                    <StageAmenities formData={formData} setFormData={setFormData} />
                  </ErrorBoundary>
                </div>
              )}

              {/* ================= STAGE 9: LEGAL & TITLE DUE DILIGENCE ================= */}
              {(viewMode === 'EXPRESS' || activeStep === 9) && (
                <div id="stage-9" className="scroll-mt-20">
                  <ErrorBoundary fallbackTitle="Legal & RERA Documentation Section">
                    <StageLegalDocs formData={formData} setFormData={setFormData} />
                  </ErrorBoundary>
                </div>
              )}

              {/* ================= STAGE 10: RICH MEDIA & FLOOR PLANS ================= */}
              {(viewMode === 'EXPRESS' || activeStep === 10) && (
                <div id="stage-10" className="scroll-mt-20">
                  <ErrorBoundary fallbackTitle="Rich Media & Floor Plans Section">
                    <StageMedia formData={formData} setFormData={setFormData} />
                  </ErrorBoundary>
                </div>
              )}

              {/* ================= STAGE 11: AVAILABILITY & OCCUPANCY ================= */}
              {(viewMode === 'EXPRESS' || activeStep === 11) && (
                <div id="stage-11" className="scroll-mt-20">
                  <ErrorBoundary fallbackTitle="Availability & Tenancy Section">
                    <StageAvailability formData={formData} setFormData={setFormData} />
                  </ErrorBoundary>
                </div>
              )}

              {/* ================= STAGE 12: LEAD GENERATION & ADMIN SUITE ================= */}
              {(viewMode === 'EXPRESS' || activeStep === 12) && (
                <div id="stage-12" className="scroll-mt-20">
                  <ErrorBoundary fallbackTitle="Contact & Leads Section">
                    <StageContactLeads formData={formData} setFormData={setFormData} />
                  </ErrorBoundary>
                </div>
              )}

              {/* ================= UNIFIED FORM ACTIONS & PUBLISH BAR ================= */}
              <div className="sticky bottom-0 z-20 -mx-6 -mb-6 mt-6 p-4 bg-black/90 backdrop-blur-md border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                    <span className="text-white/60">Quality Score:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {qualityScore.totalScore} / 100 ({qualityScore.badgeTier})
                    </span>
                  </div>
                  <span className="text-[11px] text-white/40 hidden sm:inline">
                    {viewMode === 'WIZARD' ? `Stage ${activeStep} of 12` : 'Express All-in-One Mode'}
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {viewMode === 'WIZARD' && activeStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                      className="px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                  )}

                  {viewMode === 'WIZARD' && activeStep < 12 ? (
                    <button
                      type="button"
                      onClick={() => setActiveStep((prev) => Math.min(12, prev + 1))}
                      className="px-4 sm:px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
                    >
                      Continue to Stage {activeStep + 1} <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePublishListing}
                      className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xl scale-105"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Publish Verified Listing Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
