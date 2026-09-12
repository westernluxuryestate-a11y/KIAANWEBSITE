/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============================================================================
// RESIDENTIAL NEW PROJECT LISTINGS — MASTER CUSTOM FIELDS & DATA SCHEMA SERVICE
// ============================================================================

export type FieldClassification = 'REQUIRED' | 'RECOMMENDED' | 'OPTIONAL';
export type FieldDataType =
  | 'TEXT'
  | 'NUMBER'
  | 'CURRENCY'
  | 'DROPDOWN'
  | 'MULTI_SELECT'
  | 'CHECKBOX'
  | 'YES_NO'
  | 'DATE'
  | 'LOCATION_MAP'
  | 'URL'
  | 'IMAGE'
  | 'VIDEO'
  | 'RICH_TEXT';

export interface FieldDefinition {
  key: string;
  label: string;
  classification: FieldClassification;
  type: FieldDataType;
  section: string;
  description: string;
  options?: string[];
  placeholder?: string;
  unit?: string;
  conditionalRule?: string;
}

export interface UnitConfigurationItem {
  id: string;
  name: string; // e.g. "3 BHK Grande"
  bhkType: '1 BHK' | '2 BHK' | '2.5 BHK' | '3 BHK' | '3.5 BHK' | '4 BHK' | '4.5 BHK' | '5+ BHK' | 'Villa' | 'Penthouse' | 'Duplex' | 'Plot';
  bedrooms: number;
  bathrooms: number;
  carpetAreaSqFt: number; // Required
  builtUpAreaSqFt?: number;
  superBuiltUpAreaSqFt?: number;
  balconyAreaSqFt?: number;
  terraceAreaSqFt?: number;
  floorRange?: string; // e.g. "Floors 6-18"
  facing?: 'East' | 'West' | 'North' | 'South' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  unitsAvailable?: number;
  startingPrice: number; // Required (INR)
  maximumPrice?: number; // (INR)
  pricePerSqFt?: number; // (auto-calc)
  bookingAmount?: number; // (INR)
  maintenanceEstimate?: number; // (INR / month)
  parkingIncluded: boolean;
  parkingCount?: number;
  parkingType?: 'Covered' | 'Open' | 'Basement' | 'Podium' | 'Mechanical';
  furnishingStatus?: 'Bare Shell' | 'Semi-Furnished' | 'Fully Furnished with Italian Fit-outs' | string;
  floorPlanImage?: string;
  floorPlanUrl?: string; // alias
  availabilityStatus: 'Available' | 'Fast Selling' | 'Few Units Left' | 'Sold Out' | 'Reserved' | string;
}

export interface LocationCommuteItem {
  category: 'Airport' | 'Railway Station' | 'Metro Station' | 'Major Highway' | 'Bus Stop' | 'IT Park' | 'Business District' | 'School' | 'College' | 'Hospital' | 'Shopping Mall' | 'Market' | 'Entertainment Zone' | string;
  name: string;
  distanceKm: number;
  commuteMinutes: number;
}

export type DistanceMatrixItem = LocationCommuteItem;

export interface ProjectCostSheet {
  baseRatePerSqFt: number;
  startingPrice: number; // Base
  maximumPrice?: number;
  floorRisePerFloor: number;
  plcCharges: number; // Preferred Location Charge
  parkingCharges: number;
  clubhouseCharges: number;
  infrastructureCharges: number;
  advanceMaintenanceCharges: number;
  stampDutyPercent: number; // e.g., 6% or 7%
  registrationCharges: number; // e.g., 30,000 INR
  gstPercent: number; // e.g., 5% or 0%
  bookingAmount: number;
  paymentPlans: string[];
  emiStartingFrom: number;
  homeLoanAvailable: boolean;
  bankTieUps: string[];
  estimatedTotalAcquisitionCost: number; // Auto-calculated
}

export interface BuildingSpecifications {
  structureType?: string; // RCC Mivan Shear Wall
  earthquakeResistant?: boolean;
  ceilingHeightFt?: number;
  flooringLiving?: string;
  flooringMasterBed?: string;
  kitchenSpecification?: string;
  bathroomSpecification?: string;
  electricalSpecification?: string;
  doorsSpecification?: string;
  windowsGlazing?: string;
  balconyRailing?: string;
  waterproofing?: string;
  fireSafetySystem?: string;
  liftBrandAndCount?: string;
  powerBackup?: '100% Full Unit' | 'Partial (Lights/Fans)' | 'Common Areas Only';
  waterSupplySource?: string;
  sewageTreatmentPlant?: boolean;
  rainwaterHarvesting?: boolean;
  solarPowerUtilized?: boolean;
  wasteManagement?: string;
}

export interface ParkingSpecs {
  totalParkingSpaces?: number;
  coveredParking: boolean;
  openParking?: boolean;
  basementParking?: boolean;
  mechanicalParking?: boolean;
  visitorParkingCount?: number;
  evChargingAvailable: boolean;
  twoWheelerParking?: boolean;
  parkingIncludedInPrice: boolean;
  additionalParkingCost?: number;
}

export interface OrientationViewsSpecs {
  primaryFacing: string[];
  viewsAvailable: string[];
  vaastuCompliant: boolean;
  cornerUnitsAvailable: boolean;
  premiumViewUnits: boolean;
  higherFloorAvailable: boolean;
  privateTerraceAvailable: boolean;
  privateGardenAvailable: boolean;
}

export interface SmartHomeTechnologySpecs {
  smartHomeEnabled: boolean;
  smartDoorLock: boolean;
  videoDoorPhone: boolean;
  smartLighting: boolean;
  smartAcControl: boolean;
  smartAppliances: boolean;
  homeAutomationPreWired: boolean;
  fiberInternetConnectivity: boolean;
  digitalSecurity: boolean;
}

export interface SustainabilitySpecs {
  greenBuildingCert?: 'IGBC Platinum' | 'IGBC Gold' | 'GRIHA 5-Star' | 'GRIHA 4-Star' | 'LEED Certified' | 'None';
  solarPanelsForCommonAreas: boolean;
  solarWaterHeating: boolean;
  rainwaterHarvesting: boolean;
  sewageTreatmentPlant: boolean;
  greywaterRecycling: boolean;
  organicWasteConverter: boolean;
  evChargingStations: boolean;
  energyEfficientLighting: boolean;
  waterConservationFixtures: boolean;
}

export interface DeveloperDetails {
  name: string;
  logoUrl?: string;
  description?: string;
  yearsOfExperience?: number;
  totalDeliveredProjects?: number;
  ongoingProjectsCount?: number;
  totalSqFtDeliveredMillion?: number;
  websiteUrl?: string;
  contactNumber?: string;
  corporateAddress?: string;
  developerReraNumber?: string;
  trustScore?: number; // e.g., 9.8 / 10
}

export interface ProjectTrustLegal {
  reraRegistered: boolean;
  reraNumber: string;
  reraPortalUrl: string;
  legalClearanceStatus: string;
  landTitleClear: boolean;
  approvedPlansDocumentUrl?: string;
  commencementCertificateStatus: 'Full CC Received' | 'Plinth Level CC' | 'In Process';
  occupancyCertificateStatus: 'Full OC Received' | 'Partial OC Received' | 'In Process' | 'Under Construction N/A';
  bankApprovals: string[];
  environmentalClearance: boolean;
  fireNocApproved: boolean;
  municipalSanctionsApproved: boolean;
}

export interface BuyerSuitabilitySpecs {
  idealFor: string[];
  lifestyleThemes: string[];
}

export interface InvestmentMetricsSpecs {
  projectedRentalYieldPercent: number; // e.g. 4.2%
  currentMonthlyRentRange: string; // e.g. "₹45,000 - ₹65,000"
  expectedAppreciationPercent3Yr: number; // e.g. 18%
  rentalDemandScore: 'HIGH' | 'MODERATE' | 'EMERGING';
  capitalDrivers: string[];
}

export interface SiteVisitInfoSpecs {
  siteVisitAvailable: boolean;
  siteOfficeAddress: string;
  siteOfficePhone: string;
  siteVisitDaysHours: string;
  appointmentRequired: boolean;
  virtualSiteVisitAvailable: boolean;
  complimentaryPickupDrop: boolean;
  sampleFlatAvailable: boolean;
}

export interface ProjectFaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isAutoGenerated?: boolean;
}

export interface AdministratorFieldsSpecs {
  internalListingId: string;
  internalReferenceNumber?: string;
  assignedAgentName?: string;
  assignedAgentPhone?: string;
  listingSource?: 'Developer Direct Mandate' | 'Exclusive Mandate' | 'Channel Partner' | 'Owner';
  leadOwner?: string;
  verificationStatus: 'DRAFT' | 'PENDING_VERIFICATION' | 'VERIFIED_LIVE' | 'SUSPENDED';
  dataVerifiedBy?: string;
  lastVerifiedDate?: string;
  priceVerifiedDate?: string;
  internalNotes?: string;
  isFeaturedListing: boolean;
  isPremiumListing: boolean;
  isSponsoredListing: boolean;
  listingPriority: number; // 1 to 10
}

export interface ComprehensiveProjectData {
  // 1. Basic Information
  projectName: string;
  developerName: string;
  projectStatus: 'New Launch' | 'Pre-Launch' | 'Under Construction' | 'Ready to Move' | 'Completed';
  reraRegistered: boolean;
  reraNumber: string;
  projectType: string[] | string; // ["Residential Apartment", "Villa", etc.]
  propertyCategory: 'Affordable (<45L)' | 'Mid-Segment (45L-1.2Cr)' | 'Premium (1.2Cr-3Cr)' | 'Ultra-Luxury (>3Cr)' | string;
  projectHeadline?: string;
  shortSummary?: string;
  totalLandAreaAcres?: number;
  totalTowers?: number;
  totalFloors?: number;
  totalUnits?: number;
  availableUnits?: number;
  densityPerAcre?: number;
  unitsPerFloor?: number;
  primaryOrientation?: string;
  vaastuCompliantPercent?: number;
  evChargingBays?: number;
  greenCertification?: string;
  smartHomeEnabled?: boolean;
  rainwaterHarvesting?: boolean;
  solarPowerForCommonAreas?: boolean;
  sewageTreatmentPlant?: boolean;
  organicWasteConverter?: boolean;
  videoWalkthroughUrl?: string;
  specifications?: Record<string, any>;
  parkingSlotsCount?: number;
  coveredParking?: boolean;
  basementLevels?: number;
  visitorParkingBays?: number;
  viewTypes?: string[];
  smartFeatures?: string[];
  targetBuyerPersona?: string[];
  projectDescription?: string;
  projectHighlights?: string[];
  possessionDate?: string;
  launchDate?: string;
  totalProjectArea?: string; // e.g. "6.2 Acres"
  numberOfTowers?: number;
  numberOfFloors?: number;
  totalNumberOfUnits?: number;
  numberOfUnitsPerFloor?: number;
  densityUnitsPerAcre?: number;
  constructionStage?: string;

  // 2. Location Details
  completeAddress?: string;
  locality?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  nearbyLandmark?: string;
  locationAdvantages?: string[];
  upcomingInfrastructure?: string[];
  connectivityHighlights?: string;
  distanceMatrix?: LocationCommuteItem[];

  // 3. Unit Configurations (Repeatable)
  unitConfigurations?: UnitConfigurationItem[];

  // 4. Price & Payment Information
  costSheet?: ProjectCostSheet;

  // 5. Amenities (Categorized Multi-select)
  selectedAmenities?: string[]; // Amenity IDs
  amenityCategories?: Record<string, string[]>;

  // 6. Building & Construction Features
  buildingSpecs?: BuildingSpecifications;

  // 7. Parking
  parkingSpecs?: ParkingSpecs;

  // 8. Orientation & Views
  orientationViews?: OrientationViewsSpecs;

  // 9. Smart Home & Tech
  smartTech?: SmartHomeTechnologySpecs;

  // 10. Sustainability
  sustainability?: SustainabilitySpecs;

  // 11. Media & Visual Content
  coverImageUrl?: string;
  galleryImages?: { url: string; caption?: string; altText?: string; category: 'EXTERIOR' | 'INTERIOR' | 'AMENITIES' | 'CLUBHOUSE' }[];
  floorPlanImages?: string[];
  masterPlanUrl?: string;
  brochurePdfUrl?: string;
  projectVideoUrl?: string;
  virtualTour360Url?: string;
  droneVideoUrl?: string;
  sampleFlatImages?: string[];
  constructionProgressImages?: string[];

  // 12. Developer Information
  developerInfo?: DeveloperDetails;

  // 13. Trust & Legal Information
  trustLegal?: ProjectTrustLegal;

  // 14. Possession & Construction
  expectedPossessionDate?: string;
  constructionPercentage?: number;
  currentConstructionStageText?: string;
  lastConstructionUpdateDate?: string;
  nextConstructionMilestone?: string;

  // 15. Buyer Suitability
  buyerSuitability?: BuyerSuitabilitySpecs;

  // 16. Investment Information
  investmentMetrics?: InvestmentMetricsSpecs;

  // 17. Site Visit Info
  siteVisitInfo?: SiteVisitInfoSpecs;

  // 18. SEO & Meta
  seoTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
  urlSlug?: string;
  canonicalUrl?: string;
  h1Title?: string;

  // 19. FAQs
  faqs?: ProjectFaqItem[];

  // 20. Administrator Only Fields
  adminFields?: AdministratorFieldsSpecs;
}

// ============================================================================
// MASTER SCHEMA DICTIONARY (SECTIONS 1-26) WITH FIELD CLASSIFICATION
// ============================================================================

export const MASTER_PROJECT_SCHEMA_FIELDS: FieldDefinition[] = [
  // SECTION 1: PROJECT BASIC INFORMATION
  { key: 'projectName', label: 'Project Name', classification: 'REQUIRED', type: 'TEXT', section: '1. Project Basic Information', description: 'Official registered title of the real estate project.' },
  { key: 'developerName', label: 'Developer / Builder Name', classification: 'REQUIRED', type: 'DROPDOWN', section: '1. Project Basic Information', description: 'Real estate developer executing the project.' },
  { key: 'projectStatus', label: 'Project Status', classification: 'REQUIRED', type: 'DROPDOWN', section: '1. Project Basic Information', description: 'Regulatory life-cycle phase.', options: ['New Launch', 'Pre-Launch', 'Under Construction', 'Ready to Move', 'Completed'] },
  { key: 'reraRegistered', label: 'RERA Registered', classification: 'REQUIRED', type: 'YES_NO', section: '1. Project Basic Information', description: 'Statutory registration confirmation with state RERA authority.' },
  { key: 'reraNumber', label: 'RERA Number', classification: 'REQUIRED', type: 'TEXT', section: '1. Project Basic Information', description: 'Unique government registration number.', placeholder: 'e.g. P52100028492' },
  { key: 'projectType', label: 'Project Type', classification: 'REQUIRED', type: 'MULTI_SELECT', section: '1. Project Basic Information', description: 'Structural archetype of units.', options: ['Residential Apartment', 'Villa', 'Row House', 'Plot', 'Duplex', 'Penthouse', 'Other'] },
  { key: 'propertyCategory', label: 'Property Category', classification: 'REQUIRED', type: 'DROPDOWN', section: '1. Project Basic Information', description: 'Target market segment tier.', options: ['Affordable (<45L)', 'Mid-Segment (45L-1.2Cr)', 'Premium (1.2Cr-3Cr)', 'Ultra-Luxury (>3Cr)'] },
  { key: 'projectDescription', label: 'Project Description', classification: 'REQUIRED', type: 'RICH_TEXT', section: '1. Project Basic Information', description: 'Editorial architectural overview and vision story.' },
  { key: 'projectHighlights', label: 'Project Highlights', classification: 'RECOMMENDED', type: 'TEXT', section: '1. Project Basic Information', description: 'Core bullet points displayed above the fold.' },
  { key: 'possessionDate', label: 'Possession Date', classification: 'REQUIRED', type: 'DATE', section: '1. Project Basic Information', description: 'Committed possession timeline month and year.' },
  { key: 'launchDate', label: 'Launch Date', classification: 'RECOMMENDED', type: 'DATE', section: '1. Project Basic Information', description: 'Project launch commencement date.' },
  { key: 'totalProjectArea', label: 'Total Project Area', classification: 'RECOMMENDED', type: 'TEXT', section: '1. Project Basic Information', description: 'Township footprint in acres or square metres.' },
  { key: 'numberOfTowers', label: 'Number of Towers', classification: 'RECOMMENDED', type: 'NUMBER', section: '1. Project Basic Information', description: 'Total residential building towers.' },
  { key: 'numberOfFloors', label: 'Number of Floors', classification: 'RECOMMENDED', type: 'NUMBER', section: '1. Project Basic Information', description: 'Height level of tallest tower.' },
  { key: 'totalNumberOfUnits', label: 'Total Number of Units', classification: 'RECOMMENDED', type: 'NUMBER', section: '1. Project Basic Information', description: 'Master inventory count.' },
  { key: 'numberOfUnitsPerFloor', label: 'Units Per Floor', classification: 'OPTIONAL', type: 'NUMBER', section: '1. Project Basic Information', description: 'Floor density index.' },
  { key: 'constructionStage', label: 'Construction Stage', classification: 'RECOMMENDED', type: 'DROPDOWN', section: '1. Project Basic Information', description: 'Civil work stage.', options: ['Excavation/Foundation', 'Plinth Level', 'Slab Casting', 'Brickwork & MEP', 'Finishing & Glazing', 'Ready for OC'] },

  // SECTION 2: LOCATION DETAILS
  { key: 'completeAddress', label: 'Complete Project Address', classification: 'REQUIRED', type: 'TEXT', section: '2. Location Details', description: 'Full physical site address with survey and plot numbers.' },
  { key: 'locality', label: 'Locality / Micro-Market', classification: 'REQUIRED', type: 'DROPDOWN', section: '2. Location Details', description: 'Primary micro-market area.' },
  { key: 'city', label: 'City', classification: 'REQUIRED', type: 'DROPDOWN', section: '2. Location Details', description: 'Governing municipality/city.' },
  { key: 'state', label: 'State', classification: 'REQUIRED', type: 'DROPDOWN', section: '2. Location Details', description: 'State of jurisdiction.' },
  { key: 'pinCode', label: 'PIN Code', classification: 'RECOMMENDED', type: 'TEXT', section: '2. Location Details', description: 'Postal index code.' },
  { key: 'latitude', label: 'Latitude', classification: 'REQUIRED', type: 'NUMBER', section: '2. Location Details', description: 'Geographical latitude coordinate.' },
  { key: 'longitude', label: 'Longitude', classification: 'REQUIRED', type: 'NUMBER', section: '2. Location Details', description: 'Geographical longitude coordinate.' },
  { key: 'nearbyLandmark', label: 'Nearby Landmark', classification: 'RECOMMENDED', type: 'TEXT', section: '2. Location Details', description: 'Recognizable navigation orientation reference.' },
  { key: 'distanceMatrix', label: 'Structured Travel Matrix', classification: 'RECOMMENDED', type: 'TEXT', section: '2. Location Details', description: 'Distance in KM and commute time in minutes to key hubs.' },

  // SECTION 3: UNIT CONFIGURATIONS
  { key: 'unitConfigurations', label: 'Available Unit Configurations', classification: 'REQUIRED', type: 'TEXT', section: '3. Unit Configurations', description: 'Repeatable matrix of 1 BHK, 2 BHK, 3 BHK, 4 BHK, Villa, Penthouse.' },

  // SECTION 4: PRICE & PAYMENT INFORMATION
  { key: 'startingPrice', label: 'Starting Price (INR)', classification: 'REQUIRED', type: 'CURRENCY', section: '4. Price & Payment Information', description: 'Minimum base entry price.' },
  { key: 'maximumPrice', label: 'Maximum Price (INR)', classification: 'RECOMMENDED', type: 'CURRENCY', section: '4. Price & Payment Information', description: 'Ceiling price for premium units.' },
  { key: 'costSheet', label: 'Estimated Total Cost Calculation', classification: 'RECOMMENDED', type: 'CURRENCY', section: '4. Price & Payment Information', description: 'Itemized base + GST + Stamp Duty + Parking + Infra breakdown.' },

  // SECTION 5: AMENITIES
  { key: 'selectedAmenities', label: 'Categorized Amenities', classification: 'RECOMMENDED', type: 'MULTI_SELECT', section: '5. Amenities', description: 'Multi-select categorized lifestyle, sports, wellness, security, and outdoor facilities.' },

  // SECTION 6: BUILDING & CONSTRUCTION FEATURES
  { key: 'buildingSpecs', label: 'Building & Construction Specifications', classification: 'RECOMMENDED', type: 'TEXT', section: '6. Building Specifications', description: 'RCC structure, Italian marble, DGU glazing, ceiling height, and MEP details.' },

  // SECTION 7: PARKING
  { key: 'parkingSpecs', label: 'Parking Infrastructure', classification: 'RECOMMENDED', type: 'TEXT', section: '7. Parking Details', description: 'Covered, basement, mechanical, visitor, and EV charging bays.' },

  // SECTION 8: ORIENTATION & VIEWS
  { key: 'orientationViews', label: 'Orientation, Views & Vaastu', classification: 'RECOMMENDED', type: 'TEXT', section: '8. Orientation & Views', description: 'Directional facing, pool/garden/city views, and 100% Vaastu compliance.' },

  // SECTION 9: SMART HOME & TECH
  { key: 'smartTech', label: 'Smart Home & Technology', classification: 'RECOMMENDED', type: 'TEXT', section: '9. Smart Home & Tech', description: 'Digital biometric locks, VDP, smart AC, and FTTH fiber.' },

  // SECTION 10: SUSTAINABILITY
  { key: 'sustainability', label: 'Green & Sustainable Features', classification: 'RECOMMENDED', type: 'TEXT', section: '10. Sustainability', description: 'IGBC/GRIHA green ratings, solar power, rainwater harvesting, and STP.' },

  // SECTION 11: MEDIA & VISUAL CONTENT
  { key: 'coverImageUrl', label: 'Project Cover Hero Image', classification: 'REQUIRED', type: 'IMAGE', section: '11. Media & Visual Content', description: 'High-definition primary project render or elevation photograph.' },
  { key: 'galleryImages', label: 'Project Photo Gallery', classification: 'REQUIRED', type: 'IMAGE', section: '11. Media & Visual Content', description: 'At least 5 categorized high-res exterior, interior, and amenity photographs.' },
  { key: 'masterPlanUrl', label: 'Master Site Layout Plan', classification: 'REQUIRED', type: 'IMAGE', section: '11. Media & Visual Content', description: 'Master site township blueprint.' },
  { key: 'brochurePdfUrl', label: 'Official Project Brochure PDF', classification: 'RECOMMENDED', type: 'URL', section: '11. Media & Visual Content', description: 'Direct downloadable marketing brochure.' },

  // SECTION 12: DEVELOPER INFORMATION
  { key: 'developerInfo', label: 'Developer Track Record & Profile', classification: 'RECOMMENDED', type: 'TEXT', section: '12. Developer Profile', description: 'Delivered square feet, years of experience, and brand credentials.' },

  // SECTION 13: TRUST & LEGAL
  { key: 'trustLegal', label: 'Trust & Legal Clearances', classification: 'RECOMMENDED', type: 'TEXT', section: '13. Trust & Legal', description: 'Title search report, CC, OC, Fire NOC, and bank approvals.' },

  // SECTION 14: POSSESSION & CONSTRUCTION
  { key: 'constructionPercentage', label: 'Construction Completion %', classification: 'REQUIRED', type: 'NUMBER', section: '14. Construction Progress', description: 'Current progress completion percentage.' },

  // SECTION 15: BUYER SUITABILITY & PERSONA
  { key: 'buyerSuitability', label: 'Buyer Personas & Suitability', classification: 'RECOMMENDED', type: 'MULTI_SELECT', section: '15. Buyer Suitability', description: 'Families, NRIs, luxury buyers, or investors.' },

  // SECTION 16: INVESTMENT INFORMATION
  { key: 'investmentMetrics', label: 'Investment & Rental Potential', classification: 'RECOMMENDED', type: 'TEXT', section: '16. Investment Metrics', description: 'Projected rental yield, appreciation estimates, and micro-market drivers.' },

  // SECTION 17: SITE VISIT INFORMATION
  { key: 'siteVisitInfo', label: 'Site Visit & Experience Centre', classification: 'REQUIRED', type: 'TEXT', section: '17. Site Visit Details', description: 'Lounge address, operational timings, and complimentary cab pickup status.' },

  // SECTION 18: SEO & DISCOVERY
  { key: 'seoTitle', label: 'SEO Meta Title', classification: 'RECOMMENDED', type: 'TEXT', section: '18. SEO & Discovery', description: 'Search engine optimized title tag (<60 characters).' },
  { key: 'metaDescription', label: 'Meta Description', classification: 'RECOMMENDED', type: 'TEXT', section: '18. SEO & Discovery', description: 'Search snippet description (<160 characters).' },

  // SECTION 19: FAQS
  { key: 'faqs', label: 'Project-Specific FAQ Accordions', classification: 'RECOMMENDED', type: 'TEXT', section: '19. FAQs', description: 'Grounded question & answer entries covering pricing, banks, and possession.' },

  // SECTION 20: ADMINISTRATOR GOVERNANCE
  { key: 'adminFields', label: 'Administrative Governance', classification: 'OPTIONAL', type: 'TEXT', section: '20. Administrator Only', description: 'Internal CRM ID, lead routing, verification state, and sponsorship tier.' },
];

// ============================================================================
// ESTIMATED TOTAL COST CALCULATOR ENGINE
// ============================================================================

export function calculateEstimatedTotalCost(params: {
  basePrice: number;
  carpetAreaSqFt: number;
  floorRisePerFloor?: number;
  floorNumber?: number;
  plcCharges?: number;
  parkingCharges?: number;
  clubhouseCharges?: number;
  infraCharges?: number;
  advanceMaintenanceCharges?: number;
  stampDutyPercent?: number; // e.g., 6.0% or 7.0%
  registrationCharges?: number; // e.g., 30,000 INR
  gstPercent?: number; // e.g., 5.0% for Under Construction, 0% for Ready OC
}): {
  basePrice: number;
  floorRiseTotal: number;
  plcTotal: number;
  parkingTotal: number;
  clubhouseTotal: number;
  infraTotal: number;
  advanceMaintenanceTotal: number;
  agreementValue: number;
  gstAmount: number;
  stampDutyAmount: number;
  registrationAmount: number;
  estimatedTotalAcquisitionCost: number;
  breakdownSummary: { label: string; amount: number; percentage: number }[];
} {
  const basePrice = Math.max(0, params.basePrice || 0);
  const floorRiseTotal = (params.floorRisePerFloor || 0) * (params.floorNumber || 0);
  const plcTotal = params.plcCharges || 0;
  const parkingTotal = params.parkingCharges || 0;
  const clubhouseTotal = params.clubhouseCharges || 0;
  const infraTotal = params.infraCharges || 0;
  const advanceMaintenanceTotal = params.advanceMaintenanceCharges || 0;

  // Agreement Value consists of Base + Floor Rise + PLC + Parking + Clubhouse + Infra
  const agreementValue = basePrice + floorRiseTotal + plcTotal + parkingTotal + clubhouseTotal + infraTotal;

  // Taxes
  const gstPercent = params.gstPercent !== undefined ? params.gstPercent : 5.0;
  const stampDutyPercent = params.stampDutyPercent !== undefined ? params.stampDutyPercent : 6.0;
  const registrationAmount = params.registrationCharges !== undefined ? params.registrationCharges : 30000;

  const gstAmount = Math.round((agreementValue * gstPercent) / 100);
  const stampDutyAmount = Math.round((agreementValue * stampDutyPercent) / 100);

  const estimatedTotalAcquisitionCost =
    agreementValue + gstAmount + stampDutyAmount + registrationAmount + advanceMaintenanceTotal;

  const breakdownSummary = [
    { label: 'Base Unit Cost', amount: basePrice, percentage: (basePrice / estimatedTotalAcquisitionCost) * 100 },
    { label: 'Floor Rise & PLC', amount: floorRiseTotal + plcTotal, percentage: ((floorRiseTotal + plcTotal) / estimatedTotalAcquisitionCost) * 100 },
    { label: 'Covered Parking Bay', amount: parkingTotal, percentage: (parkingTotal / estimatedTotalAcquisitionCost) * 100 },
    { label: 'Clubhouse & Amenities', amount: clubhouseTotal, percentage: (clubhouseTotal / estimatedTotalAcquisitionCost) * 100 },
    { label: 'Infrastructure & Civic Connection', amount: infraTotal, percentage: (infraTotal / estimatedTotalAcquisitionCost) * 100 },
    { label: `Statutory GST (${gstPercent}%)`, amount: gstAmount, percentage: (gstAmount / estimatedTotalAcquisitionCost) * 100 },
    { label: `Stamp Duty (${stampDutyPercent}%)`, amount: stampDutyAmount, percentage: (stampDutyAmount / estimatedTotalAcquisitionCost) * 100 },
    { label: 'Registration Fee (Govt Cap)', amount: registrationAmount, percentage: (registrationAmount / estimatedTotalAcquisitionCost) * 100 },
    { label: 'Advance Maintenance & Sinking Fund', amount: advanceMaintenanceTotal, percentage: (advanceMaintenanceTotal / estimatedTotalAcquisitionCost) * 100 },
  ].filter((item) => item.amount > 0);

  return {
    basePrice,
    floorRiseTotal,
    plcTotal,
    parkingTotal,
    clubhouseTotal,
    infraTotal,
    advanceMaintenanceTotal,
    agreementValue,
    gstAmount,
    stampDutyAmount,
    registrationAmount,
    estimatedTotalAcquisitionCost,
    breakdownSummary,
  };
}

// ============================================================================
// LISTING QUALITY SCORE (LQS) CALCULATION ENGINE (OUT OF 100)
// ============================================================================

export interface ListingQualityScoreResult {
  totalScore: number; // 0 to 100
  completenessPercent: number; // 0 to 100%
  grade: 'A' | 'B' | 'C';
  gradeTitle: string;
  missingFields: { field: string; weight: number; reason: string }[];
  strengths: string[];
}

export function calculateListingQualityScore(data: Partial<ComprehensiveProjectData>): ListingQualityScoreResult {
  let score = 0;
  const missing: { field: string; weight: number; reason: string }[] = [];
  const strengths: string[] = [];

  // Core Basics (25 Points)
  if (data.projectName && data.projectName.trim().length >= 3) {
    score += 5;
    strengths.push('Verified Project Name');
  } else {
    missing.push({ field: 'Project Name', weight: 5, reason: 'Provide official project title (min 3 chars)' });
  }

  if (data.developerName && data.developerName.trim().length > 0) {
    score += 5;
    strengths.push('Developer Brand Linked');
  } else {
    missing.push({ field: 'Developer Name', weight: 5, reason: 'Link an authorized developer entity' });
  }

  if (data.reraRegistered && data.reraNumber && data.reraNumber.trim().length >= 8) {
    score += 10;
    strengths.push('MahaRERA Statutory Registration Bound');
  } else {
    missing.push({ field: 'RERA Registration Number', weight: 10, reason: 'Essential for buyer credibility and legality' });
  }

  if (data.latitude && data.longitude && data.completeAddress) {
    score += 5;
    strengths.push('Pinpoint Coordinates & Address');
  } else {
    missing.push({ field: 'Location & Map Coordinates', weight: 5, reason: 'Pin exact project location on Google Maps' });
  }

  // Configurations & Pricing (20 Points)
  if (data.unitConfigurations && data.unitConfigurations.length > 0) {
    const hasValidConfig = data.unitConfigurations.some((c) => c.carpetAreaSqFt > 0 && c.startingPrice > 0);
    if (hasValidConfig) {
      score += 10;
      strengths.push(`${data.unitConfigurations.length} Unit Configurations with Carpet Areas`);
    } else {
      missing.push({ field: 'Unit Configurations Carpet Area', weight: 10, reason: 'Add at least one unit configuration with valid carpet area' });
    }
  } else {
    missing.push({ field: 'Unit Configurations', weight: 10, reason: 'Add configurations (1 BHK, 2 BHK, 3 BHK, etc.)' });
  }

  if (data.costSheet && data.costSheet.startingPrice > 0) {
    score += 10;
    strengths.push('Estimated Total Acquisition Cost Sheet Available');
  } else {
    missing.push({ field: 'Transparent Cost Sheet', weight: 10, reason: 'Provide base price, parking, and tax breakdown' });
  }

  // Visual Assets & Plans (25 Points)
  if (data.coverImageUrl && data.coverImageUrl.startsWith('http')) {
    score += 5;
    strengths.push('High-Resolution Hero Cover Image');
  } else {
    missing.push({ field: 'Project Cover Hero Image', weight: 5, reason: 'Upload high-resolution project elevation image' });
  }

  if (data.galleryImages && data.galleryImages.length >= 4) {
    score += 10;
    strengths.push(`${data.galleryImages.length} Categorized Gallery Photos`);
  } else {
    missing.push({ field: 'Categorized Photo Gallery', weight: 10, reason: 'Upload at least 4 photos (Elevation, Interior, Amenities)' });
  }

  if (data.floorPlanImages && data.floorPlanImages.length > 0) {
    score += 5;
    strengths.push('Architectural Floor Plans Uploaded');
  } else {
    missing.push({ field: 'Floor Plan Blueprints', weight: 5, reason: 'Add dimensioned floor plan layouts' });
  }

  if (data.masterPlanUrl && data.masterPlanUrl.startsWith('http')) {
    score += 5;
    strengths.push('Master Site Township Plan');
  } else {
    missing.push({ field: 'Master Layout Plan', weight: 5, reason: 'Upload township master plan layout' });
  }

  // Specifications & What's Nearby (20 Points)
  if (data.selectedAmenities && data.selectedAmenities.length >= 6) {
    score += 5;
    strengths.push('Diverse Amenities Taxonomy (6+ Selected)');
  } else {
    missing.push({ field: 'Amenities Selection', weight: 5, reason: 'Select at least 6 lifestyle/sports amenities' });
  }

  if (data.distanceMatrix && data.distanceMatrix.length >= 4) {
    score += 5;
    strengths.push('Distance & Commute Travel Matrix');
  } else {
    missing.push({ field: 'Structured Distance Matrix', weight: 5, reason: 'Provide distance & time to Airport, Metro, IT Parks, and Schools' });
  }

  if (data.constructionPercentage !== undefined && data.constructionStage) {
    score += 5;
    strengths.push(`Construction Progress Specified (${data.constructionPercentage}%)`);
  } else {
    missing.push({ field: 'Construction Progress %', weight: 5, reason: 'Input current civil progress and construction stage' });
  }

  if (data.siteVisitInfo && data.siteVisitInfo.siteOfficeAddress) {
    score += 5;
    strengths.push('Experience Centre Visit Address Configured');
  } else {
    missing.push({ field: 'Site Visit Experience Centre', weight: 5, reason: 'Provide site office address and visiting hours' });
  }

  // SEO & FAQs (10 Points)
  if (data.seoTitle && data.metaDescription) {
    score += 5;
    strengths.push('Optimized SEO Title & Description');
  } else {
    missing.push({ field: 'SEO Meta Tags', weight: 5, reason: 'Provide meta title and description for search visibility' });
  }

  if (data.faqs && data.faqs.length >= 3) {
    score += 5;
    strengths.push('Project FAQs Configured (3+ Entries)');
  } else {
    missing.push({ field: 'Project FAQs', weight: 5, reason: 'Add at least 3 frequently asked questions' });
  }

  const finalScore = Math.min(100, Math.max(0, score));
  const completenessPercent = finalScore;

  let grade: 'A' | 'B' | 'C' = 'C';
  let gradeTitle = 'Needs Improvement (Incomplete)';
  if (finalScore >= 85) {
    grade = 'A';
    gradeTitle = 'Certified Institutional Grade (Highest Trust)';
  } else if (finalScore >= 70) {
    grade = 'B';
    gradeTitle = 'Good Listing (Publishable)';
  }

  return {
    totalScore: finalScore,
    completenessPercent,
    grade,
    gradeTitle,
    missingFields: missing,
    strengths,
  };
}

// ============================================================================
// SMART AI-ASSISTED AUTO-CONTENT GENERATOR
// ============================================================================

export function generateSmartProjectContent(data: Partial<ComprehensiveProjectData>): {
  projectHeadline: string;
  shortSummary: string;
  projectHighlights: string[];
  locationAdvantages: string[];
  lifestyleDescription: string;
  investmentOverview: string;
  seoTitle: string;
  metaDescription: string;
  suggestedFaqs: ProjectFaqItem[];
} {
  const name = data.projectName || 'Luxury Residences';
  const dev = data.developerName || 'Premier Builders';
  const locality = data.locality || 'Prime Location';
  const city = data.city || 'Pune';
  const status = data.projectStatus || 'Under Construction';
  const rera = data.reraNumber || 'Applied';
  const minPriceCr = data.costSheet?.startingPrice
    ? (data.costSheet.startingPrice / 10000000).toFixed(2)
    : '1.45';

  const projectHeadline = `Sculpted Sky Residences & Luxury Living at ${name}, ${locality}`;

  const shortSummary = `${name} by ${dev} is an iconic ${status.toLowerCase()} residential landmark in ${locality}, ${city}. Offering meticulously planned residences with panoramic vistas, high clear ceiling heights, signature lifestyle clubhouse, and state-of-the-art sustainability infrastructure. Registered under MahaRERA (${rera}).`;

  const projectHighlights = [
    `Prime corridor positioning in ${locality} with immediate arterial highway connectivity`,
    `Architectural clear ceiling heights with expansive wrap-around viewing decks`,
    `Signature grand clubhouse with temperature-controlled swimming pool & wellness spa`,
    `100% Vaastu-compliant configurations with cross-ventilation orientation`,
    `MahaRERA verified project (${rera}) with zero legal encumbrance`,
  ];

  const locationAdvantages = [
    `Minutes away from leading IT business hubs and corporate employment zones`,
    `Direct walking distance to proposed high-speed Metro station and public transport corridors`,
    `Surrounded by premier international IB/CBSE schools, multi-specialty hospitals, and luxury malls`,
    `Seamless commute to Pune-Mumbai expressway gateway and international airport`,
  ];

  const lifestyleDescription = `Residents at ${name} enjoy a curated resort-style environment featuring multi-tier biometric security, dedicated EV fast-charging stations, tranquil reflexology pathways, co-working executive lounges, and lush biodiverse landscape gardens designed for peaceful intergenerational living.`;

  const investmentOverview = `Backed by high tenant demand in ${locality} and proximity to major employment hubs, ${name} offers strong capital appreciation potential and estimated gross rental yields of 3.8%–4.5% per annum, underpinned by ${dev}'s reliable on-time delivery track record. (Projections are estimates and subject to market forces).`;

  const seoTitle = `${name} ${locality}, ${city} | Price, Floor Plans, MahaRERA ${rera}`;
  const metaDescription = `Explore ${name} by ${dev} in ${locality}, ${city}. Luxury homes starting from ₹${minPriceCr} Cr. View official RERA details (${rera}), verified floor plans, itemized cost sheet & book VIP site visit.`;

  const suggestedFaqs: ProjectFaqItem[] = [
    {
      id: 'faq_1',
      question: `What is the starting price for residences in ${name}?`,
      answer: `Residences in ${name} start from approximately ₹${minPriceCr} Cr for base configurations, subject to chosen floor rise, orientation, and parking allocations. Transparent itemized cost sheets are available on request.`,
      category: 'Pricing',
      isAutoGenerated: true,
    },
    {
      id: 'faq_2',
      question: `Is ${name} registered with MahaRERA?`,
      answer: `Yes, ${name} is officially registered with the Maharashtra Real Estate Regulatory Authority under registration number ${rera}. All statutory quarterly Form 4 disclosures and approvals are up to date.`,
      category: 'Legal & RERA',
      isAutoGenerated: true,
    },
    {
      id: 'faq_3',
      question: `What is the committed possession date for ${name}?`,
      answer: `The scheduled possession date is ${data.possessionDate || 'December 2027'}, aligned with statutory regulatory filings and construction milestone schedules.`,
      category: 'Possession',
      isAutoGenerated: true,
    },
    {
      id: 'faq_4',
      question: `Are home loans approved for ${name}?`,
      answer: `Yes, major institutional lending partners including HDFC Bank, State Bank of India (SBI), ICICI Bank, and Axis Bank have pre-approved project financing with competitive repo-linked rates.`,
      category: 'Home Loans',
      isAutoGenerated: true,
    },
    {
      id: 'faq_5',
      question: `How can I schedule a physical or virtual site visit to ${name}?`,
      answer: `You can schedule an exclusive guided site visit or 3D live virtual tour with complimentary sanitized cab pickup through our VIP concierge desk on this portal.`,
      category: 'Site Visit',
      isAutoGenerated: true,
    },
  ];

  return {
    projectHeadline,
    shortSummary,
    projectHighlights,
    locationAdvantages,
    lifestyleDescription,
    investmentOverview,
    seoTitle,
    metaDescription,
    suggestedFaqs,
  };
}

// ============================================================================
// CUSTOMER ENGAGEMENT SCORE ALGORITHM
// ============================================================================

export function calculateCustomerEngagementScore(metrics: {
  viewsCount: number;
  galleryViewsCount: number;
  brochureDownloadsCount: number;
  whatsappClicksCount: number;
  phoneRevealsCount: number;
  siteVisitsRequestedCount: number;
  costSheetsDownloadedCount: number;
  repeatVisitsCount: number;
}): {
  engagementScore: number;
  performanceTier: 'VIRAL_HOT' | 'HIGH_CONVERTING' | 'STEADY' | 'LOW_ENGAGEMENT';
  conversionRatePercent: number;
} {
  const v = metrics.viewsCount || 0;
  const g = metrics.galleryViewsCount || 0;
  const b = metrics.brochureDownloadsCount || 0;
  const w = metrics.whatsappClicksCount || 0;
  const p = metrics.phoneRevealsCount || 0;
  const sv = metrics.siteVisitsRequestedCount || 0;
  const cs = metrics.costSheetsDownloadedCount || 0;
  const r = metrics.repeatVisitsCount || 0;

  // Weighted engagement formula
  const engagementScore =
    v * 1 +
    g * 2 +
    b * 15 +
    cs * 18 +
    p * 20 +
    w * 25 +
    sv * 50 +
    r * 5;

  const highIntentInquiries = b + cs + p + w + sv;
  const conversionRatePercent = v > 0 ? Number(((highIntentInquiries / v) * 100).toFixed(2)) : 0;

  let performanceTier: 'VIRAL_HOT' | 'HIGH_CONVERTING' | 'STEADY' | 'LOW_ENGAGEMENT' = 'STEADY';
  if (engagementScore > 1000 || conversionRatePercent >= 12) {
    performanceTier = 'VIRAL_HOT';
  } else if (engagementScore > 400 || conversionRatePercent >= 7) {
    performanceTier = 'HIGH_CONVERTING';
  } else if (engagementScore < 100) {
    performanceTier = 'LOW_ENGAGEMENT';
  }

  return {
    engagementScore,
    performanceTier,
    conversionRatePercent,
  };
}
