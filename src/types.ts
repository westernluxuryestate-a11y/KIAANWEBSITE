/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ==========================================
// KIAAN PROPERTIES — MASTER TYPE SPECIFICATION
// ==========================================

export type Jurisdiction = 'MAHARERA' | 'KARNATAKA_RERA' | 'GUJARAT_RERA' | 'UP_RERA' | 'OTHER';

export type RERAStatus = 'REGISTERED' | 'APPLIED' | 'EXEMPT' | 'REVOKED' | 'EXPIRED' | 'BLOCKED';

export type RERAVerificationStatus = 'VERIFIED' | 'PENDING_AUDIT' | 'REJECTED' | 'NOT_APPLICABLE';

export interface RERARecord {
  id: string;
  jurisdiction: Jurisdiction;
  regulatoryAuthority: string; // e.g. "Maharashtra Real Estate Regulatory Authority (MahaRERA)"
  registrationNumber: string; // e.g. "P52100028492"
  officialAuthorityUrl: string; // e.g. "https://maharera.mahaonline.gov.in"
  qrCodeUrl: string; // QR code image pointing to MahaRERA official project certificate
  status: RERAStatus;
  verificationStatus: RERAVerificationStatus;
  lastVerifiedAt: string;
  verifiedBy: string;
  certificatePdfUrl?: string;
  validUntil?: string;
  auditHistory: {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
  }[];
}

export type ProjectType = 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED_USE' | 'PLOTTED_DEVELOPMENT' | 'LUXURY_ESTATE';

export type ProjectStatus = 'PRE_LAUNCH' | 'UNDER_CONSTRUCTION' | 'NEAR_POSSESSION' | 'READY_POSSESSION' | 'COMPLETED';

export type PropertyType = 
  | 'APARTMENT' 
  | 'PENTHOUSE' 
  | 'VILLA' 
  | 'ROW_HOUSE' 
  | 'STUDIO' 
  | 'OFFICE' 
  | 'RETAIL' 
  | 'SHOWROOM' 
  | 'WAREHOUSE' 
  | 'LAND';

export type PropertyStatus = 
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'PUBLISHED'
  | 'AVAILABLE'
  | 'HOLD'
  | 'RESERVED'
  | 'SOLD'
  | 'RENTED'
  | 'LEASED'
  | 'WITHDRAWN'
  | 'ARCHIVED';

export type UnitStatus = 
  | 'AVAILABLE'
  | 'SELECTED'
  | 'HOLD'
  | 'OFFER_IN_PROGRESS'
  | 'RESERVED'
  | 'BOOKED'
  | 'SOLD';

export interface Amenity {
  id: string;
  name: string;
  category: 'LIFESTYLE' | 'FITNESS' | 'SECURITY' | 'ENVIRONMENT' | 'COMMUNITY' | 'BUSINESS';
  icon: string;
  description?: string;
  featured?: boolean;
}

export interface LocationInfo {
  id: string;
  microMarket: string; // e.g. "Wakad", "Baner", "Kharadi", "Koregaon Park"
  city: string; // e.g. "Pune", "Mumbai"
  state: string; // e.g. "Maharashtra"
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  landmarks: {
    name: string;
    type: 'METRO' | 'HIGHWAY' | 'IT_PARK' | 'SCHOOL' | 'HOSPITAL' | 'AIRPORT' | 'MALL';
    distanceKm: number;
    commuteMinutes: number;
  }[];
}

export interface MediaAsset {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'VIRTUAL_360' | 'MODEL_3D' | 'DRONE' | 'DOCUMENT';
  url: string;
  title: string;
  caption?: string;
  thumbnailUrl?: string;
  category: 'EXTERIOR' | 'INTERIOR' | 'AMENITY' | 'VIEWS' | 'MASTER_PLAN' | 'CONSTRUCTION';
  resolution?: string;
  isCover?: boolean;
}

export interface MasterPlanHotspot {
  id: string;
  title: string;
  category: 'AMENITY' | 'TOWER' | 'ENTRY' | 'LANDSCAPE' | 'RECREATION';
  xPercent: number; // 0-100 on master plan canvas
  yPercent: number; // 0-100 on master plan canvas
  description: string;
  previewImageUrl: string;
  badge?: string;
  details?: {
    operatingHours?: string;
    level?: string;
    walkingDistanceMeters?: number;
    capacity?: string;
  };
}

export interface SunlightStudyResult {
  timeOfDayHour: number; // 6 to 18
  timeFormatted: string; // e.g. "08:30 AM"
  sunAzimuthDegrees: number; // 0-360 (90=East, 180=South, 270=West)
  sunAltitudeDegrees: number; // 0-90
  shadowAngleDegrees: number;
  shadowLengthMultiplier: number;
  solarHeatIndex: 'LOW' | 'OPTIMAL' | 'WARM' | 'INTENSE';
  thermalComfortScorePercent: number;
  directSunlightRooms: string[];
  ambientLightRooms: string[];
  facingIlluminationPercent: number;
  naturalLightSummary: string;
}

export interface RoomLayoutPolygon {
  roomId: string;
  roomName: string;
  category: 'LIVING' | 'MASTER_BED' | 'BEDROOM' | 'KITCHEN' | 'BALCONY' | 'BATH' | 'FOYER' | 'DECK';
  polygonPoints: string; // SVG coordinates e.g. "50,50 250,50 250,200 50,200"
  centerPoint: { x: number; y: number };
  widthFt: number;
  lengthFt: number;
  carpetSqFt: number;
  windowFacing: 'EAST' | 'WEST' | 'NORTH' | 'SOUTH' | 'NORTH_EAST' | 'SOUTH_EAST';
  ceilingHeightFt: number;
  features: string[];
}

export interface InteractiveFloorPlanData {
  id: string;
  unitId?: string;
  title: string;
  configuration: string;
  carpetAreaSqFt: number;
  balconySqFt: number;
  svgViewBox: string;
  rooms: RoomLayoutPolygon[];
  furnitureStagingPresets: {
    presetId: 'MINIMALIST' | 'LUXURY_CLASSIC' | 'BARE_SHELL';
    name: string;
    description: string;
  }[];
}

export interface UnitComparisonDiff {
  units: Unit[];
  priceDiffINR: number;
  carpetAreaDiffSqFt: number;
  pricePerSqFtDiff: number;
  taxDifferenceINR: number;
  commonAmenities: string[];
  exclusiveAmenitiesPerUnit: Record<string, string[]>;
  facingSummary: Record<string, string>;
  propertyScoreDeltas: Record<string, number>;
}

export interface FloorPlan {
  id: string;
  title: string;
  configuration: string; // e.g. "3 BHK Grande"
  carpetAreaSqFt: number;
  superBuiltUpSqFt?: number;
  balconySqFt?: number;
  layoutImageUrl: string;
  interactiveData?: InteractiveFloorPlanData;
  dimensions: {
    room: string;
    widthFt: number;
    lengthFt: number;
  }[];
}

export interface PricingBreakdown {
  basePrice: number; // in INR
  pricePerSqFt: number;
  floorRisePerFloor?: number;
  carParkingCharges: number;
  clubhouseMaintenanceCharges: number;
  estimatedGstPercent: number; // 5% under construction, 0% ready
  estimatedStampDutyPercent: number; // e.g. 6% in Maharashtra
  registrationCharges: number; // e.g. 30,000 INR
  maintenanceDeposit1Yr: number;
  totalEstimatedAcquisitionCost: number;
  comparableMarketRange: {
    min: number;
    max: number;
    positioning: 'FAIR' | 'VALUE' | 'PREMIUM';
  };
}

export interface Unit {
  id: string;
  projectId: string;
  projectName: string;
  towerId: string;
  towerName: string;
  floorNumber: number;
  unitNumber: string; // e.g. "A-1203"
  configuration: string; // "3 BHK", "4 BHK", "Penthouse"
  carpetAreaSqFt: number;
  facing: 'EAST' | 'WEST' | 'NORTH' | 'SOUTH' | 'NORTH_EAST' | 'SOUTH_EAST';
  orientationView: string; // e.g. "Panoramic Hinjewadi Skyline & Infinity Pool"
  balconiesCount: number;
  parkingSlots: number;
  pricing: PricingBreakdown;
  status: UnitStatus;
  holdExpiresAt?: string;
  heldByUserId?: string;
  floorPlan: FloorPlan;
  images: string[];
  lastUpdated: string;
}

export interface Tower {
  id: string;
  projectId: string;
  name: string; // e.g. "Tower A - The Solitaire"
  totalFloors: number;
  totalUnits: number;
  availableUnits: number;
  constructionStage: string;
  expectedPossessionDate: string;
  floors: {
    floorNumber: number;
    units: Unit[];
  }[];
}

export interface ConstructionUpdate {
  id: string;
  projectId: string;
  date: string;
  stageName: string; // e.g. "18th Floor Slab Completed"
  progressPercent: number;
  description: string;
  mediaUrls: string[];
}

export interface PropertyScore {
  overallScore: number; // 0-100
  breakdown: {
    location: number;
    value: number;
    lifestyle: number;
    connectivity: number;
    investmentYield: number;
    spaceLayout: number;
    developerReputation: number;
  };
  decisionConfidencePercent: number;
  informationCompletenessPercent: number;
  personalityBadge: 'Family Favourite' | "Investor's Pick" | 'Value Champion' | 'Luxury Statement' | 'Hidden Gem';
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  developerName: string;
  projectType: ProjectType;
  status: ProjectStatus;
  reraRecord: RERARecord;
  location: LocationInfo;
  headlinePriceRange: {
    min: number;
    max: number;
    displayString: string; // e.g. "₹1.45 Cr - ₹3.20 Cr"
  };
  configurations: string[]; // ["2.5 BHK", "3 BHK", "4 BHK Penthouse"]
  carpetAreaRangeSqFt: {
    min: number;
    max: number;
  };
  totalLandAcres: number;
  totalTowersCount: number;
  totalUnitsCount: number;
  availableUnitsCount: number;
  possessionDate: string;
  overviewStory: string;
  architecturalHighlights: string[];
  specifications: {
    category: string;
    items: string[];
  }[];
  amenities: Amenity[];
  media: MediaAsset[];
  masterPlanUrl: string;
  masterPlanHotspots?: MasterPlanHotspot[];
  towers: Tower[];
  constructionUpdates: ConstructionUpdate[];
  propertyScore: PropertyScore;
  aiKnowledgeContext: string;
  isKiaanPick?: boolean;
  isFirstLook?: boolean;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  projectId?: string;
  projectName?: string;
  unitId?: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  reraRecord?: RERARecord;
  location: LocationInfo;
  configuration: string;
  carpetAreaSqFt: number;
  floorNumber?: number;
  totalFloors?: number;
  facing: string;
  parkingCount: number;
  pricing: PricingBreakdown;
  amenities: Amenity[];
  media: MediaAsset[];
  propertyScore: PropertyScore;
  possessionStatus: 'READY_POSSESSION' | 'UNDER_CONSTRUCTION' | 'PRE_LAUNCH';
  possessionDate: string;
  overviewDescription: string;
  isKiaanPick?: boolean;
  isFirstLook?: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyDNA {
  userId?: string;
  budgetMin: number;
  budgetMax: number;
  preferredLocations: string[];
  configurations: string[];
  purpose: 'BUY_FAMILY' | 'INVESTMENT_GROWTH' | 'RENTAL_YIELD' | 'COMMERCIAL_LEASE';
  timeline: 'IMMEDIATE' | 'UNDER_6_MONTHS' | '1_TO_2_YEARS' | 'FLEXIBLE';
  priorities: {
    commute: number; // 1-5
    lifestyleAmenities: number;
    spaciousLayout: number;
    appreciationPotential: number;
    schoolProximity: number;
  };
}

export interface SiteVisit {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  assetType: 'PROJECT' | 'PROPERTY' | 'UNIT';
  assetId: string;
  assetTitle: string;
  visitType: 'PHYSICAL_SITE_VISIT' | 'LIVE_VIDEO_TOUR';
  preferredDate: string;
  preferredSlot: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED';
  advisorAssigned?: string;
  notes?: string;
  createdAt: string;
}

export interface OfferRecord {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  assetId: string;
  assetTitle: string;
  unitId?: string;
  askingPrice: number;
  offeredAmount: number;
  conditions: string[];
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'COUNTERED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'WITHDRAWN';
  counterOfferAmount?: number;
  sellerNotes?: string;
  expiresAt: string;
  auditTrail: {
    timestamp: string;
    action: string;
    amount?: number;
    by: string;
  }[];
  createdAt: string;
}

export interface HoldRecord {
  id: string;
  unitId: string;
  unitNumber: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  tokenAmountPaid: number;
  expiresAt: string; // 15-minute concurrency lock
  status: 'ACTIVE' | 'CONVERTED_TO_BOOKING' | 'EXPIRED' | 'RELEASED';
  createdAt: string;
}

export interface BookingRecord {
  id: string;
  bookingRef: string; // e.g. "KP-2026-B8291"
  unitId: string;
  unitNumber: string;
  projectId: string;
  projectName: string;
  userId: string;
  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
    panNumber: string;
    address: string;
  };
  pricingBreakdown: PricingBreakdown;
  bookingAmountPaid: number;
  paymentTransactionId: string;
  status: 'INITIATED' | 'CONFIRMED' | 'ALLOTMENT_ISSUED' | 'CANCELLED';
  agreedToTerms: boolean;
  reraVerifiedAcknowledged: boolean;
  allotmentLetterUrl?: string;
  createdAt: string;
}

export interface CRMEvent {
  id: string;
  eventType: 
    | 'LEAD_CAPTURED' 
    | 'PROPERTY_INTEREST' 
    | 'VISIT_REQUESTED' 
    | 'OFFER_SUBMITTED' 
    | 'UNIT_HELD' 
    | 'BOOKING_COMPLETED';
  timestamp: string;
  payload: Record<string, unknown>;
  syncStatus: 'QUEUED' | 'SENT' | 'FAILED_RETRYING' | 'DEAD_LETTER';
  retryCount: number;
  lastAttemptAt?: string;
}

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  userId?: string;
  eventName: string;
  timestamp: string;
  entityType?: 'PROJECT' | 'PROPERTY' | 'UNIT' | 'CALCULATOR' | 'SEARCH' | 'AI';
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'WEBSITE_ADMIN'
  | 'PROPERTY_MANAGER'
  | 'COMPLIANCE_MANAGER'
  | 'MEDIA_MANAGER'
  | 'CONTENT_EDITOR'
  | 'FINANCE_MANAGER'
  | 'BOOKING_MANAGER'
  | 'ANALYST'
  | 'CUSTOMER';

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  token?: string;
  savedPropertyIds: string[];
  savedUnitIds?: string[];
  propertyDNA?: PropertyDNA;
}

// ==========================================
// PHASE 03 — FINANCIAL INTELLIGENCE, SEARCH & VIP PORTAL TYPES
// ==========================================

export interface BankLoanOffer {
  bankId: string;
  bankName: string;
  benchmarkRoiPercent: number;
  minDownpaymentPercent: number;
  maxTenureYears: number;
  processingFeePercent: number;
  processingFeeCapINR: number;
  specialFeature: string;
  preApprovalTimeHours: number;
  logoBadge: string;
}

export interface TaxOptimizationResult {
  taxBracketPercent: number;
  annualGrossEmi: number;
  annualPrincipalEligible80C: number;
  annualInterestEligible24b: number;
  actualDeduction80C: number;
  actualDeduction24b: number;
  totalAnnualTaxSavedINR: number;
  monthlyTaxShieldINR: number;
  monthlyNetEffectiveEmiINR: number;
  tenYearCumulativeTaxSavingsINR: number;
}

export interface AppreciationForecastYear {
  year: number;
  yearLabel: string;
  estimatedCapitalValueINR: number;
  annualRentalIncomeINR: number;
  monthlyRentalINR: number;
  grossRentalYieldPercent: number;
  cumulativeCapitalGainINR: number;
  cumulativeTotalReturnINR: number;
  returnOnEquityPercent: number;
}

export interface AppreciationForecastReport {
  propertyIdOrProject: string;
  baseAcquisitionCostINR: number;
  assumedCagrPercent: number;
  microMarketInflationFactor: number;
  infrastructureCatalystDescription: string;
  forecastTimeline: AppreciationForecastYear[];
  fiveYearSummary: {
    totalAppreciationINR: number;
    totalRentalIncomeINR: number;
    totalNetWealthCreatedINR: number;
    cagrNetReturnPercent: number;
  };
}

export interface VipHoldRecord {
  holdId: string;
  unitId: string;
  unitNumber: string;
  projectId: string;
  projectName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  createdAt: string;
  expiresAt: string;
  remainingSeconds: number;
  status: 'ACTIVE' | 'EXTENDED' | 'EXPIRED' | 'CONVERTED_TO_TOKEN';
  tokenAmountINR: number;
  extensionCount: number;
}

export interface VipSiteVisitBooking {
  visitId: string;
  projectId: string;
  projectName: string;
  preferredDate: string;
  timeSlot: string;
  pickupAddress: string;
  luxuryVehicleChoice: 'MERCEDES_E_CLASS' | 'BMW_5_SERIES' | 'AUDI_A6' | 'SELF_DRIVE';
  hospitalityChoice: 'HIGH_TEA_SKY_CLUB' | 'EXECUTIVE_LUNCH' | 'EXPRESS_TOUR';
  specialRequirements?: string;
  relationshipManager: {
    name: string;
    title: string;
    phone: string;
    email: string;
    photoUrl: string;
  };
  status: 'CONFIRMED' | 'CHAUFFEUR_ASSIGNED' | 'COMPLETED';
  chauffeurDetails?: {
    driverName: string;
    vehicleRegNumber: string;
    contactNumber: string;
  };
}

export interface LegalDossierDocument {
  id: string;
  projectId: string;
  projectName: string;
  documentTitle: string;
  category: 'MAHARERA_CERTIFICATE' | 'TITLE_SEARCH_REPORT' | 'COMMENCEMENT_CERTIFICATE' | 'SANCTION_LAYOUT_PLAN' | 'ENVIRONMENTAL_CLEARANCE' | 'FORM_4_ARCHITECT_CERT';
  issuingAuthority: string;
  issuedDate: string;
  validUntil?: string;
  verifiedClearStatus: boolean;
  legalSummary: string;
  fileSizeBytes: number;
  downloadFilename: string;
}

export interface UnifiedSearchFilter {
  query?: string;
  microMarket: string;
  minPrice: number;
  maxPrice: number;
  configurations: string[];
  propertyTypes?: string[];
  possessionYear?: string;
  facing?: string;
  minCarpetAreaSqFt?: number;
  floorRise?: 'ALL' | 'LOW' | 'MID' | 'HIGH';
  status?: string;
  furnishing?: string;
  parking?: string;
  transactionMode?: 'BUY' | 'RENT' | 'LEASE' | 'INVEST';
  minYieldPercent?: number;
  amenities: string[];
  reraVerifiedOnly: boolean;
  sortOrder: 'PRICE_LOW_HIGH' | 'PRICE_HIGH_LOW' | 'CARPET_AREA_HIGH_LOW' | 'POSSESSION_SOONEST' | 'FEATURED';
}

// ============================================================
// KIAAN INTELLIGENCE™ & PROPERTY DNA™ (SECTIONS 39 - 54)
// ============================================================

export type AiDataClassification = 'VERIFIED' | 'CALCULATED' | 'ESTIMATED' | 'AI_ANALYSIS';

export interface PropertyDna {
  budgetMinINR: number;
  budgetMaxINR: number;
  preferredLocations: string[];
  preferredConfigurations: string[];
  purpose: 'END_USE_SELF' | 'LONG_TERM_INVESTMENT' | 'RENTAL_YIELD' | 'VACATION_HOME';
  familyRequirements: {
    familyMembersCount: number;
    childrenCount: number;
    elderlyParents: boolean;
    pets: boolean;
    workFromHomeCount: number;
  };
  primaryCommuteDestination: string; // e.g., 'Hinjewadi Phase 1'
  maxCommuteMinutes: number;
  schoolPriorityLevel: 'CRITICAL' | 'IMPORTANT' | 'MODERATE' | 'NOT_APPLICABLE';
  lifestylePreferences: string[]; // e.g. ['Sky Pool', 'EV Charging', 'Quiet Greenery', 'Clubhouse']
  possessionPreference: 'IMMEDIATE_READY' | 'WITHIN_6_MONTHS' | 'UNDER_CONSTRUCTION_1_2_YRS' | 'FLEXIBLE';
  investmentPriority: 'CAPITAL_APPRECIATION' | 'HIGH_RENTAL_YIELD' | 'TAX_SHIELD_MAX' | 'BALANCED';
  riskPreference: 'CONSERVATIVE_TIER1_ONLY' | 'MODERATE_GROWTH' | 'HIGH_ALPHA_PRE_LAUNCH';
}

export type RecommendationCategory =
  | 'BEST_MATCH'
  | 'BEST_VALUE'
  | 'BEST_INVESTMENT'
  | 'BEST_FAMILY'
  | 'BEST_LOCATION'
  | 'BEST_SPACE'
  | 'BEST_READY_POSSESSION'
  | 'PREMIUM_UPGRADE'
  | 'HIDDEN_GEM';

export interface PropertyIntelligenceScore {
  overallScore: number; // e.g. 92/100
  breakdown: {
    location: number; // 95
    value: number; // 91
    lifestyle: number; // 94
    connectivity: number; // 96
    investment: number; // 84
    space: number; // 90
    developer: number; // 93
  };
  explanations: {
    locationReason: string;
    valueReason: string;
    lifestyleReason: string;
    connectivityReason: string;
    investmentReason: string;
    spaceReason: string;
    developerReason: string;
  };
}

export interface DecisionConfidence {
  confidencePercent: number; // e.g. 89%
  factors: {
    dataCompletenessPercent: number;
    customerFitPercent: number;
    priceComparablesReliability: 'VERY_HIGH' | 'HIGH' | 'MODERATE';
    locationVerificationStatus: 'VERIFIED_GEO_STAMPED';
    documentAvailabilityScore: number;
  };
  summaryRationale: string;
}

export interface InformationCompleteness {
  completenessPercent: number; // e.g. 94%
  checklist: {
    photos: boolean;
    floorPlan: boolean;
    locationGeo: boolean;
    pricingMatrix: boolean;
    amenitiesList: boolean;
    detailedDocuments: boolean;
    reraVerified: boolean;
  };
  pendingNotices: string[];
}

export interface PriceHistoryRecord {
  year: number; // 2024, 2025, 2026, 2027
  avgPricePerSqFtINR: number;
  historicalRecordSource: string;
  sampleTransactionCount: number;
}

export interface PriceIntelligence {
  askingPriceINR: number;
  comparableRangeMinINR: number;
  comparableRangeMaxINR: number;
  ratePerSqFtINR: number;
  pricePositioning: 'BELOW_MARKET_VALUE' | 'FAIR_MARKET_VALUE' | 'PREMIUM_QUALITY_PRICING';
  kiaanVerdict: 'EXCELLENT_VALUE' | 'FAIR' | 'SLIGHT_PREMIUM_JUSTIFIED' | 'OVERPRICED';
  historicalMovement: PriceHistoryRecord[];
  dataSourceContext: string;
  lastUpdatedDate: string;
}

export interface OpportunityScore {
  scorePercent: number;
  badges: ('PRICE_OPPORTUNITY' | 'VALUE_OPPORTUNITY' | 'YIELD_OPPORTUNITY' | 'LIMITED_INVENTORY')[];
  rationale: string;
  disclaimer: 'Calculated using historical registrations and current inventory. Past growth does not guarantee future yields.';
}

export interface PropertyLadderTier {
  tierName: 'Value' | 'Best Match' | 'Upgrade' | 'Premium';
  priceINR: number;
  unitConfiguration: string;
  carpetAreaSqFt: number;
  keyGainsDescription: string;
  projectId: string;
  unitId: string;
}

export interface TradeOffDilemma {
  id: string;
  title: string;
  optionA: {
    label: string;
    description: string;
    impactScore: { space: number; location: number; price: number };
  };
  optionB: {
    label: string;
    description: string;
    impactScore: { space: number; location: number; price: number };
  };
}

export interface CommuteDestination {
  id: string;
  label: string; // 'Work / Hinjewadi IT Park', 'School / Indus', 'Airport'
  destinationType: 'OFFICE' | 'SCHOOL' | 'AIRPORT' | 'TRANSIT' | 'HEALTHCARE';
  address: string;
  coordinates: { lat: number; lng: number };
  travelTimes: {
    fromWakadMinutes: number;
    fromBanerMinutes: number;
    fromHinjewadiMinutes: number;
    fromKharadiMinutes: number;
  };
}

// ============================================================
// DOCUMENT CENTER & AI EXPLAINER (SECTION 97)
// ============================================================

export type DocumentCategory =
  | 'BROCHURE'
  | 'PRICE_SHEET'
  | 'PAYMENT_PLAN'
  | 'FLOOR_PLANS'
  | 'PROJECT_DOCUMENTS'
  | 'RERA_INFORMATION'
  | 'BOOKING_DOCUMENTS'
  | 'RECEIPTS';

export interface DocumentItem {
  id: string;
  projectId?: string;
  projectName?: string;
  propertyId?: string;
  category: DocumentCategory;
  title: string;
  fileName: string;
  fileSizeBytes: number;
  fileFormat: 'PDF' | 'DWG' | 'DOCX' | 'XLSX';
  isCustomerSpecific: boolean; // Secure customer-specific docs require auth
  issuanceDate: string;
  validUntil?: string;
  issuingAuthorityOrEntity: string;
  verificationBadge?: string;
  summary: string;
  downloadUrl: string;
  sampleClauses?: {
    clauseTitle: string;
    text: string;
    plainEnglishMeaning: string;
  }[];
}

export interface DocumentAiExplainerState {
  activeDocumentId: string;
  query: string;
  answer?: string;
  keyClausesExtracted?: string[];
  disclaimer: string;
  isProcessing: boolean;
}

// ============================================================
// CUSTOMER REPORT GENERATOR ("MY PROPERTY REPORT") (SECTION 98)
// ============================================================

export type ReportSectionKey =
  | 'photos'
  | 'floorPlan'
  | 'price'
  | 'amenities'
  | 'location'
  | 'commute'
  | 'emi'
  | 'totalCost'
  | 'investment'
  | 'comparison'
  | 'rera';

export interface ReportSectionOption {
  key: ReportSectionKey;
  label: string;
  description: string;
  iconName: string;
  isDefaultSelected: boolean;
}

export interface PropertyReportConfig {
  targetId: string; // Project ID or Property ID
  targetType: 'PROJECT' | 'PROPERTY' | 'UNIT';
  unitId?: string;
  customerName?: string;
  customerPhoneOrEmail?: string;
  selectedSections: ReportSectionKey[];
  currency: CurrencyCode;
  includeQrCode: boolean;
  includeDisclaimers: boolean;
  notes?: string;
}

export interface GeneratedPropertyReport {
  reportId: string;
  generationDate: string;
  generationTimestamp: number;
  targetId: string;
  targetTitle: string;
  targetTagline?: string;
  reraRegistrationNumber: string;
  reraQrCodeUrl: string;
  livePagePermalink: string;
  includedSections: ReportSectionKey[];
  dossierData: Record<string, any>;
  mandatoryDisclaimer: string;
}

// ============================================================
// SHARE ENGINE & SHAREABLE PROPERTY CARD (SECTIONS 99 - 100)
// ============================================================

export type ShareEntityType =
  | 'PROJECT'
  | 'PROPERTY'
  | 'UNIT'
  | 'COLLECTION'
  | 'COMPARISON'
  | 'REPORT'
  | 'INVESTMENT';

export interface SharePackage {
  entityType: ShareEntityType;
  entityId: string;
  title: string;
  subtitle: string;
  priceINR: number;
  priceFormatted: string;
  locationName: string;
  configuration: string;
  matchScorePercent?: number;
  heroImageUrl: string;
  shareableUrl: string;
  whatsappMessageText: string;
  socialShareSnippet: string;
  emailSubject: string;
  emailBodyHtml: string;
}

export interface ShareablePropertyCardData {
  appName: 'Kiaan';
  headline: 'I found this on Kiaan';
  configuration: string; // e.g. '3 BHK • Wakad'
  priceDisplay: string; // e.g. '₹1.48 Cr'
  convertedPriceDisplay?: string; // e.g. '$178,000 USD'
  matchScore: number; // e.g. 94
  imageUrl: string;
  qrCodeUrl: string;
  exploreLink: string;
}

// ============================================================
// CUSTOMER JOURNEY TRACKING & PASSPORT (SECTIONS 101 - 102)
// ============================================================

export type JourneyMilestone =
  | 'DISCOVERED'
  | 'VIEWED'
  | 'ENGAGED'
  | 'SAVED'
  | 'COMPARED'
  | 'SHARED'
  | 'VISIT_REQUESTED'
  | 'OFFERED'
  | 'SELECTED'
  | 'BOOKED';

export interface CustomerJourneyEvent {
  id: string;
  timestamp: string;
  eventType: JourneyMilestone;
  entityType: 'PROJECT' | 'PROPERTY' | 'UNIT' | 'CALCULATOR' | 'REPORT';
  entityId: string;
  entityName: string;
  metadata?: Record<string, any>;
}

export interface JourneyPassportStep {
  stepNumber: number;
  id: string;
  title: string;
  description: string;
  milestoneKey: JourneyMilestone;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
  completedAt?: string;
  actionLabel: string;
  actionTab?: string;
}

// ============================================================
// RETARGETING & ABANDONED JOURNEY RECOVERY (SECTIONS 103 - 104)
// ============================================================

export interface AbandonedJourneyState {
  flowType: 'COMPARISON' | 'SITE_VISIT' | 'OFFER' | 'BOOKING' | 'REPORT';
  lastActivityTimestamp: string;
  targetId: string;
  targetTitle: string;
  statePayload: Record<string, any>;
  resumePromptText: string;
  resumeActionLabel: string;
  isInventoryValid: boolean;
}

export interface ConsentSettings {
  consentGiven: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  smsEnabled: boolean;
  frequency: 'INSTANT' | 'DAILY_DIGEST' | 'WEEKLY_BRIEF' | 'NEVER';
  consentedAt?: string;
  optOutUrl?: string;
}

// ============================================================
// SMART NOTIFICATIONS (SECTION 105)
// ============================================================

export type NotificationTriggerType =
  | 'PRICE_CHANGE'
  | 'NEW_UNIT_RELEASED'
  | 'AVAILABILITY_UPDATE'
  | 'SITE_VISIT_REMINDER'
  | 'OFFER_RESPONSE'
  | 'BOOKING_UPDATE'
  | 'CONSTRUCTION_UPDATE';

export interface SmartNotification {
  id: string;
  type: NotificationTriggerType;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  channel: 'PUSH' | 'EMAIL' | 'WHATSAPP' | 'SMS';
  priority: 'HIGH' | 'NORMAL' | 'URGENT';
}

// ============================================================
// NRI MODE & MULTI-CURRENCY (SECTIONS 106 - 107)
// ============================================================

export type CurrencyCode = 'INR' | 'USD' | 'GBP' | 'EUR' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  ratePerINR: number; // 1 INR = X foreign currency
  inrPerUnit: number; // 1 Foreign currency = X INR
  locale: string;
}

export type NriTopic =
  | 'VIRTUAL_TOUR_Matterport'
  | 'LEGAL_FEMA_REPATRIATION'
  | 'NRE_NRO_BANKING'
  | 'NRI_HOME_LOANS'
  | 'DIGITAL_POWER_OF_ATTORNEY'
  | 'TAX_TDS_ADVISORY';

export interface NriConsultationBooking {
  id: string;
  clientName: string;
  country: string;
  timezone: string;
  preferredDateTime: string;
  topic: NriTopic;
  preferredChannel: 'ZOOM' | 'GOOGLE_MEET' | 'WHATSAPP_VIDEO' | 'PHONE';
  status: 'CONFIRMED' | 'SCHEDULED' | 'COMPLETED';
}

// ============================================================
// RESIDENTIAL VS COMMERCIAL SEGMENTATION (SECTIONS 108 - 109)
// ============================================================

export type CommercialSector = 'OFFICE' | 'RETAIL' | 'WAREHOUSE';

export interface CommercialOfficeSpec {
  carpetAreaSqFt: number;
  rentPerSqFtINR: number;
  camPerSqFtINR: number; // Common Area Maintenance
  securityDepositMonths: number;
  lockInPeriodYears: number;
  annualEscalationPercent: number;
  fitoutCondition: 'BARE_SHELL' | 'WARM_SHELL' | 'FULLY_FURNISHED_IT';
  parkingRatio: string; // e.g. "1 : 1,000 Sq.Ft"
  grossRentalYieldPercent: number;
  leedCertification?: string;
}

export interface CommercialRetailSpec {
  mainRoadFrontageFeet: number;
  dailyPedestrianFootfallEst: number;
  dailyVehicularFootfallEst: number;
  anchorVisibility: 'HIGH_STREET_CORNER' | 'DIRECT_FACING' | 'ATRIUM_VISIBLE';
  floorLevel: 'GROUND_FLOOR' | 'FIRST_FLOOR' | 'PODIUM';
  formatType: 'HIGH_STREET' | 'SHOPPING_MALL' | 'DRIVE_THRU';
  signageRights: 'EXCLUSIVE_PYLON_AND_FACADE' | 'FACADE_ONLY' | 'STANDARD';
  rentPerSqFtINR: number;
  camPerSqFtINR: number;
  estimatedReturnOnInvestmentPercent: number;
}

export interface CommercialWarehouseSpec {
  clearCeilingHeightFeet: number;
  dockLevelersCount: number;
  loadingBaysCount: number;
  truckTurningRadiusMeters: number;
  powerBackupKVA: number;
  proximityToHighwayKm: number;
  flooringLoadCapacityTonsPerSqMeter: number;
  fireSafetySystem: 'NFPA_SPRINKLERS_AND_HYDRANT' | 'STANDARD_EXTINGUISHERS';
  leaseRatePerSqFtINR: number;
}

// ============================================================
// 110. PRE-LEASE EXPERIENCE SPECIFICATION
// ============================================================

export interface ScenarioReturnModel {
  scenarioName: 'BASE_CASE' | 'BULL_CASE' | 'BEAR_CASE';
  label: string;
  assumedAnnualRentEscalationPercent: number;
  assumedCapitalAppreciationCagrPercent: number;
  assumedVacancyMonthsOver10Yrs: number;
  fiveYearGrossRentalIncomeINR: number;
  fiveYearEstimatedCapitalGainINR: number;
  fiveYearTotalNetReturnINR: number;
  fiveYearIrrPercent: number;
  tenYearTotalNetWealthCreatedINR: number;
  tenYearIrrPercent: number;
}

export interface PreLeaseAsset {
  id: string;
  assetTitle: string;
  propertyType: 'COMMERCIAL_OFFICE' | 'HIGH_STREET_RETAIL' | 'LOGISTICS_WAREHOUSE' | 'CO_WORKING_HUB';
  location: LocationInfo;
  carpetAreaSqFt: number;
  tenantName: string;
  tenantIndustry: string;
  tenantCreditRating: string; // e.g. "CRISIL AAA", "Fortune 500 Global"
  currentMonthlyRentINR: number;
  rentPerSqFtINR: number;
  annualEscalationPercent: number;
  lockInPeriodYears: number;
  lockInExpiresDate: string;
  overallLeaseExpiryDate: string;
  securityDepositMonths: number;
  grossRentalYieldPercent: number;
  netRentalYieldPercent: number;
  purchasePriceINR: number;
  pricePerSqFtINR: number;
  camChargesPerSqFtINR: number;
  propertyTaxResponsibility: 'TENANT' | 'LANDLORD';
  fitoutInvestmentByTenantINR: number;
  scenarioReturns: {
    baseCase: ScenarioReturnModel;
    bullCase: ScenarioReturnModel;
    bearCase: ScenarioReturnModel;
  };
  keyFeatures: string[];
  imageUrl: string;
  reraRegNumber: string;
}

// ============================================================
// 111 - 114. CURATION, OPPORTUNITY WALL & PROPERTY PERSONALITY
// ============================================================

export type KiaanPickCategory =
  | 'BEST_FAMILY_HOME'
  | 'BEST_VALUE'
  | 'BEST_INVESTMENT'
  | 'BEST_COMMERCIAL_OPPORTUNITY'
  | 'BEST_LUXURY'
  | 'BEST_READY_POSSESSION';

export interface KiaanPickData {
  category: KiaanPickCategory;
  categoryTitle: string;
  targetId: string;
  targetType: 'PROJECT' | 'PROPERTY';
  title: string;
  locationName: string;
  priceFormatted: string;
  heroImage: string;
  humanCuratorNote: {
    curatorName: string;
    curatorRole: string;
    commentary: string;
    curatedDate: string;
  };
  aiIntelligenceMetrics: {
    aiMatchScore: number;
    spatialEfficiencyScore: number;
    daylightComfortScore: number;
    valuationBenchmarkRatio: number; // e.g. 0.88 (-12% below micro-market avg)
    aiSummaryReason: string;
  };
}

export type OpportunityFilterTag =
  | 'ALL'
  | 'PRICE_DROP'
  | 'NEWLY_RELEASED'
  | 'PREMIUM_VALUE'
  | 'PRE_LAUNCH'
  | 'READY_POSSESSION'
  | 'INVESTMENT_PICK'
  | 'COMMERCIAL_OPPORTUNITY'
  | 'LIMITED_INVENTORY';

export interface OpportunityItem {
  id: string;
  tag: OpportunityFilterTag;
  tagLabel: string;
  badgeColor: 'red' | 'amber' | 'emerald' | 'blue' | 'purple';
  title: string;
  subtitle: string;
  location: string;
  priceOriginalINR?: number;
  priceCurrentINR: number;
  priceDisplay: string;
  priceDropSavingsINR?: number;
  unitsRemainingCount?: number;
  imageUrl: string;
  urgencyText: string;
  targetType: 'PROJECT' | 'PROPERTY' | 'UNIT';
  targetId: string;
}

export type PropertyPersonalityType =
  | 'Family Favourite'
  | "Investor's Pick"
  | 'Value Champion'
  | 'Luxury Statement'
  | 'Hidden Gem';

export interface PropertyPersonalityExplanation {
  type: PropertyPersonalityType;
  badge: string;
  color: string;
  headlineReason: string;
  explainableFactors: {
    label: string;
    metricValue: string;
    subtext: string;
  }[];
  suitabilityProfile: string;
}

// ============================================================
// 115 - 117. "BEFORE YOU BOOK", TRUST CENTER & "LAST UPDATED"
// ============================================================

export interface BeforeYouBookChecklist {
  totalCostUnderstood: boolean;
  financingUnderstood: boolean;
  documentsReviewed: boolean;
  possessionUnderstood: boolean;
  maintenanceUnderstood: boolean;
  cancellationTermsReviewed: boolean;
  unitDetailsConfirmed: boolean;
  applicableReraReviewed: boolean;
}

export interface VerificationAuditStamp {
  isPhysicalSiteAudited: boolean;
  physicalAuditDate: string;
  physicalAuditorName: string;
  isLegalTitleVerified: boolean;
  legalTitleAdvocateFirm: string;
  legalTitleReportDate: string;
  isMahaReraCrossVerified: boolean;
  mahaReraApiVerifiedTimestamp: string;
  isEscrowCompliant: boolean;
  escrowBankVerified: string;
}

export interface TrustCenterData {
  informationCompletenessPercent: number;
  completenessChecklist: {
    field: string;
    isVerified: boolean;
  }[];
  propertyInfoLastUpdatedDate: string; // e.g. "31 Aug 2026"
  inventoryLastUpdatedRelative: string; // e.g. "4 mins ago"
  inventoryLastUpdatedIso: string;
  verificationStatus: 'GOVERNMENT_RERA_AND_LEGAL_VERIFIED' | 'PENDING_PHYSICAL_AUDIT' | 'UNVERIFIED';
  verificationStamp: VerificationAuditStamp;
  reraRegistrationNumber: string;
  reraOfficialUrl: string;
  reraQrCodeUrl: string;
  documentAvailability: {
    docName: string;
    isAvailableForInstantView: boolean;
    format: string;
  }[];
  pricingAuditStatus: 'VERIFIED_DEVELOPER_DIRECT_NO_MARKUP';
  pricePerSqFtCarpetAudit: number;
}

// ============================================================
// 118. CUSTOMER REVIEWS (SEPARATED PROPERTY VS KIAAN SERVICE)
// ============================================================

export interface PropertyReviewItem {
  id: string;
  reviewType: 'PROPERTY_EXPERIENCE' | 'KIAAN_SERVICE';
  authorName: string;
  authorDesignation?: string;
  verifiedBuyerBadge: boolean;
  date: string;
  ratingOverall: number; // 1 to 5
  title: string;
  commentary: string;
  // Specific Property Experience facets
  propertyAspectRatings?: {
    constructionQuality: number;
    amenitiesUpkeep: number;
    soundInsulationAndQuietness: number;
    daylightAndVentilation: number;
    locationAndCommute: number;
  };
  // Specific Kiaan Service facets
  serviceAspectRatings?: {
    advisorExpertise: number;
    transparencyAndNoBrokerage: number;
    maybachSiteVisitHospitality: number;
    paperworkAndReraClarity: number;
    digitalTwinAccuracy: number;
  };
  helpfulCount: number;
}

// ============================================================
// 119. GROUNDED FAQ ENGINE
// ============================================================

export type FaqCategory =
  | 'PRICE'
  | 'PARKING'
  | 'POSSESSION'
  | 'MAINTENANCE'
  | 'CONFIGURATION'
  | 'DOCUMENTS'
  | 'AMENITIES'
  | 'NEGOTIATION'
  | 'AVAILABILITY';

export interface GroundedFaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  groundedAnswer: string;
  verifiedSourceReference: string; // e.g. "MahaRERA Sanction Order clause 4.2", "Developer Direct Price Policy"
  isAiAssistedGrounded: boolean;
  helpfulVotes: number;
}

// ============================================================
// 120 - 121. ADMIN ANALYTICS & STRUCTURED ANALYTICS EVENT MODEL
// ============================================================

export type StructuredEventName =
  | 'page_view'
  | 'search_started'
  | 'search_completed'
  | 'ai_query'
  | 'property_viewed'
  | 'project_viewed'
  | 'unit_viewed'
  | 'property_saved'
  | 'comparison_created'
  | 'collection_created'
  | 'collection_shared'
  | 'pdf_generated'
  | 'pdf_downloaded'
  | 'visit_requested'
  | 'visit_confirmed'
  | 'offer_created'
  | 'offer_countered'
  | 'offer_accepted'
  | 'bid_created'
  | 'unit_selected'
  | 'unit_held'
  | 'booking_started'
  | 'booking_completed';

export interface StructuredAnalyticsEvent {
  event_id: string;
  eventName: StructuredEventName;
  timestamp: string;
  user_session: {
    sessionId: string;
    userId?: string;
    userName?: string;
    userRole?: UserRole;
    consentState: 'ANALYTICS_CONSENT_GRANTED' | 'ANALYTICS_CONSENT_DECLINED';
  };
  entity?: {
    type: 'PROJECT' | 'PROPERTY' | 'UNIT' | 'SEARCH' | 'REPORT' | 'OFFER' | 'BOOKING';
    id: string;
    name: string;
    valueINR?: number;
  };
  metadata: Record<string, any>;
  source: 'WEB_DESKTOP' | 'MOBILE_BROWSER' | 'WHATSAPP_LINK' | 'SHARED_COLLECTION';
  consent_context: string;
}

export interface WebsiteAnalyticsDashboardMetrics {
  discovery: {
    totalSearchesCount: number;
    aiNaturalLanguageSearchesCount: number;
    topLocationsExplored: { location: string; searchCount: number; growthPercent: number }[];
  };
  engagement: {
    totalPageViews: number;
    propertiesSavedCount: number;
    comparisonsCreatedCount: number;
    aiConversationsCount: number;
    pdfDossiersDownloadedCount: number;
    sharesOmnichannelCount: number;
  };
  intent: {
    vipSiteVisitsRequestedCount: number;
    formalOffersSubmittedCount: number;
    unitsSelectedCount: number;
    activeHoldsCount: number;
  };
  transaction: {
    bookingsInitiatedCount: number;
    bookingsCompletedCount: number;
    totalBookingValueINR: number;
    paymentEventsCount: number;
    tokenDisbursementsAuditedINR: number;
  };
}

// ============================================================
// 122 - 125. CRM INTEGRATION & EVENT LAYER SPECIFICATION
// ============================================================

export type CrmEventType =
  | 'LEAD_CREATED'
  | 'PROPERTY_VIEWED'
  | 'PROJECT_INTEREST'
  | 'PROPERTY_SAVED'
  | 'PDF_DOWNLOADED'
  | 'VISIT_REQUESTED'
  | 'OFFER_CREATED'
  | 'BOOKING_STARTED'
  | 'BOOKING_COMPLETED';

export type CrmDeliveryStatus = 'QUEUED' | 'IN_FLIGHT' | 'DELIVERED' | 'RETRYING' | 'DEAD_LETTER' | 'FAILED';

export interface CrmEventPayload {
  eventId: string;
  idempotencyKey: string;
  eventType: CrmEventType;
  timestamp: string;
  customerId?: string;
  consentGranted: boolean;
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
    preferredChannel?: 'WHATSAPP' | 'PHONE' | 'EMAIL';
  };
  entityContext: {
    entityType: 'PROJECT' | 'PROPERTY' | 'UNIT';
    entityId: string;
    entityTitle: string;
    reraRegistrationNumber?: string;
    microMarket?: string;
    priceINR?: number;
  };
  intentCategory: 'DISCOVERY' | 'VIP_SITE_VISIT' | 'PRICE_OFFER' | 'ESCROW_RESERVATION' | 'INVESTMENT_INQUIRY';
  minimalMetadata: Record<string, string | number | boolean>;
  deliveryStatus: CrmDeliveryStatus;
  retryCount: number;
  maxRetries: number;
  lastAttemptTimestamp?: string;
  crmAcknowledgmentId?: string;
  errorMessage?: string;
}

export interface CrmIntegrationHealth {
  endpointUrl: string;
  isAvailable: boolean;
  activeQueueCount: number;
  deliveredCount: number;
  deadLetterCount: number;
  lastSyncTimestamp: string;
  averageLatencyMs: number;
}

// ============================================================
// 126 - 127. SECURITY, PRIVACY & DPDPA CONSENT SPECIFICATION
// ============================================================

export interface UserConsentPreferences {
  marketingConsent: boolean;
  whatsAppConsent: boolean;
  emailConsent: boolean;
  smsTransactionalConsent: boolean;
  pushNotificationConsent: boolean;
  analyticsConsent: boolean;
  essentialCookiesRequired: true;
  lastUpdatedTimestamp: string;
  consentIpHash?: string;
  consentVersion: string;
}

export interface DataAccessExport {
  exportId: string;
  userId: string;
  requestedAt: string;
  userProfile: {
    name?: string;
    email?: string;
    phone?: string;
    role: UserRole;
    nriStatus?: boolean;
  };
  consentLog: UserConsentPreferences;
  savedProperties: string[];
  submittedOffers: { offerId: string; assetTitle: string; amountINR: number; timestamp: string }[];
  scheduledVisits: { visitId: string; projectTitle: string; scheduledDate: string }[];
  dossierDownloads: { documentTitle: string; downloadedAt: string }[];
}

export interface DataDeletionRequest {
  requestId: string;
  userId: string;
  userEmail: string;
  requestedAt: string;
  status: 'PENDING_STATUTORY_AUDIT' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  statutoryRetentionPeriodNote: string; // e.g. "Transaction tokens retained for 7 years per statutory tax/RERA rules; marketing profile purged immediately."
}

// ============================================================
// 128. PAYMENT SECURITY & TOKENIZED ESCROW AUDIT
// ============================================================

export type PaymentGatewayProvider = 'RAZORPAY_ESCROW' | 'STRIPE_TOKEN' | 'ICICI_ESCROW_NODE' | 'HDFC_TRUST_ACCOUNT';

export interface TokenizedPaymentRecord {
  transactionId: string;
  tokenReference: string; // Masked provider payment token - NEVER raw card or CVV
  status: 'INITIATED' | 'ESCROW_HELD' | 'CAPTURED' | 'REFUNDED' | 'DISPUTED';
  amountINR: number;
  timestamp: string;
  providerReference: string;
  gatewayProvider: PaymentGatewayProvider;
  maskedPaymentMethod: string; // e.g. "UPI •••• 8291" or "Visa Card •••• 4242"
  purpose: 'TOKEN_RESERVATION' | 'ESCROW_ALLOCATION' | 'LEGAL_RETAINER';
  assetId: string;
  assetTitle: string;
  buyerConsentTimestamp: string;
  escrowTrustAccountRef: string;
  taxInvoiceHash: string;
}

// ============================================================
// 129. ENTERPRISE ADMIN AUDIT LOG
// ============================================================

export type AdminAuditActionType =
  | 'LOGIN'
  | 'MFA_VERIFIED'
  | 'PUBLISH'
  | 'UNPUBLISH'
  | 'PRICE_CHANGE'
  | 'INVENTORY_CHANGE'
  | 'RERA_CHANGE'
  | 'DOCUMENT_CHANGE'
  | 'OFFER_DECISION'
  | 'BOOKING_AUDIT'
  | 'PERMISSION_CHANGE'
  | 'USER_CHANGES'
  | 'SECURITY_POLICY_UPDATE';

export interface AdminAuditLogEntry {
  id: string;
  timestamp: string;
  action: AdminAuditActionType;
  actor: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  entity: {
    type: 'PROJECT' | 'PROPERTY' | 'UNIT' | 'USER' | 'RERA_RECORD' | 'OFFER' | 'SYSTEM_CONFIG';
    id: string;
    name: string;
  };
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  reason?: string;
  ipHash: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

// ============================================================
// 130 - 135. PERFORMANCE, MEDIA & ACCESSIBILITY SETTINGS
// ============================================================

export interface DeviceAccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReaderOptimized: boolean;
  fontSizeScale: 'NORMAL' | 'LARGE' | 'EXTRA_LARGE';
  keyboardNavigationActive: boolean;
}




