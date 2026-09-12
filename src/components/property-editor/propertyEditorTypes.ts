import { PropertyCategory, TransactionType } from '../../services/universalListingSchemaService';
import { Amenity } from '../../types';

export interface PreLeasedState {
  isPreLeased: boolean;
  isPreRented: boolean;
  hasExistingTenant: boolean;
  tenantName: string;
  isTenantNamePublic: boolean;
  tenantType: 'MNC' | 'BANK' | 'DOMESTIC_CORPORATE' | 'HIGH_STREET_RETAIL' | 'GOVERNMENT' | 'INDIVIDUAL' | 'SME';
  tenantIndustry: string;
  leaseStartDate: string;
  leaseExpiryDate: string;
  remainingLeaseMonths: number;
  monthlyRentINR: number;
  annualRentINR: number;
  escalationClause: string;
  currentYieldPercent: number; // Verified
  expectedYieldPercent: number; // Projected / Non-guaranteed
  securityDepositINR: number;
  lockInMonths: number;
  renewalProbability: 'HIGH' | 'MEDIUM' | 'LOW';
  leaseRegistrationStatus: 'REGISTERED' | 'IN_PROCESS' | 'UNREGISTERED';
  rentPaymentHistory: 'FLAWLESS_ON_TIME' | 'OCCASIONAL_DELAY' | 'NEW_TENANT';
  occupancyStatus: 'FULLY_OCCUPIED' | 'PARTIALLY_OCCUPIED' | 'VACANT';
  investmentValueINR: number;
  capitalAppreciationPotential: 'HIGH' | 'MODERATE' | 'STABLE';
  tenantCreditProfile: 'AAA_INVESTMENT_GRADE' | 'AA_BLUE_CHIP' | 'A_ESTABLISHED' | 'SME_UNRATED';
  leaseDocsAvailable: {
    agreement: boolean;
    cam: boolean;
    receipts: boolean;
    bankStatements: boolean;
  };
}

export interface ResidentialSpecsState {
  bedroomsNumeric: number | string;
  bhkLabel: string;
  bathrooms: number;
  toilets: number;
  powderRoom: number;
  balconies: number;
  carpetAreaSqFt: number;
  minCarpetAreaSqFt: number;
  maxCarpetAreaSqFt: number;
  superBuiltUpAreaSqFt: number;
  builtUpAreaSqFt: number;
  floorNumber: number;
  totalFloors: number;
  towerWing: string;
  unitNumber: string;
  facingDirection: string;
  mainDoorDirection: string;
  views: {
    corner: boolean;
    garden: boolean;
    pool: boolean;
    river: boolean;
    hill: boolean;
    citySkyline: boolean;
    road: boolean;
    golfCourse: boolean;
  };
  furnishingStatus: 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED';
  furnishingItems: string[];
}

export interface CommercialSpecsState {
  usableCarpetAreaSqFt: number;
  superBuiltUpAreaSqFt: number;
  clearCeilingHeightFt: number;
  entranceWidthFt: number;
  frontageFt: number;
  loadingBaysCount: number;
  passengerLiftsCount: number;
  serviceLiftsCount: number;
  powerLoadKva: number;
  dgBackup: string;
  hvacType: string;
  sprinklersInstalled: boolean;
  smokeDetectorsInstalled: boolean;
  fitOutStatus: 'BARE_SHELL' | 'WARM_SHELL' | 'FULLY_FURNISHED';
  workstationsCount: number;
  cabinsCount: number;
  conferenceRoomsCount: number;
  washroomsCount: number;
  separateWashrooms: boolean;
  signageRights: boolean;
  buildingGrade: 'GRADE_A_PLUS' | 'GRADE_A' | 'GRADE_B';
  idealUsage: string;
  operatingHours: '24_7_ALLOWED' | 'BUSINESS_HOURS_ONLY';
}

export interface IndustrialSpecsState {
  industrialType: string;
  shedAreaSqFt: number;
  landAreaSqFt: number;
  clearHeightCenterFt: number;
  clearHeightEavesFt: number;
  floorLoadCapacityTons: number;
  overheadCraneAvailable: boolean;
  craneCapacityTons: number;
  loadingDocksCount: number;
  dockLevelersCount: number;
  truckTurningRadiusFt: number;
  roadWidthFrontageFt: number;
  powerLoadKva: number;
  dedicatedTransformer: boolean;
  waterSupplySource: string;
  pcbConsentToOperate: boolean;
  factoryInspectorLicense: boolean;
  fireNocApproved: boolean;
  storageCapacityTons: number;
  coldStorageAvailable: boolean;
}

export interface HospitalitySpecsState {
  hospitalityType: string;
  totalKeys: number;
  deluxeRoomsCount: number;
  executiveSuitesCount: number;
  presidentialSuitesCount: number;
  averageOccupancyPercent: number;
  restaurantCount: number;
  banquetCapacityPersons: number;
  conferenceHallCount: number;
  swimmingPoolAvailable: boolean;
  spaWellnessCenter: boolean;
  commercialKitchen: boolean;
  liquorLicenseActive: boolean;
  fssaiLicenseActive: boolean;
  starCategory: 'FIVE_STAR_DELUXE' | 'FIVE_STAR' | 'FOUR_STAR' | 'THREE_STAR' | 'BOUTIQUE';
  averageRoomRateINR: number;
  revParINR: number;
  annualGrossRevenueINR: number;
  ebitdaAnnualINR: number;
  operatorBrandAffiliation: string;
}

export interface AgriculturalSpecsState {
  acre: number;
  hectare: number;
  guntha: number;
  sqFt: number;
  sqM: number;
  soilType: string;
  waterSource: string;
  borewellsCount: number;
  openWellsCount: number;
  riverCanalAccess: boolean;
  dripIrrigationInstalled: boolean;
  electricityPhase: string;
  solarPumpInstalled: boolean;
  fencingType: string;
  farmhouseBuilt: boolean;
  plantationDetails: string;
  roadAccessType: string;
  topography: string;
  distanceToHighwayKm: number;
  distanceToCityKm: number;
  clear712Extract: boolean;
  naStatus: string;
  zoneClassification: string;
  mutationEntryClear: boolean;
}

export interface LocationConnectivityState {
  locationMasterId?: string; // Canonical Location Master ID (SSOT)
  canonicalHierarchyPath?: string;
  canonicalCorporation?: string;
  canonicalWard?: string;
  country: string;
  state: string;
  district: string;
  taluka: string;
  city: string;
  microMarket: string;
  subLocality: string;
  societyBuildingName: string;
  landmark: string;
  pincode: string;
  latitude: number;
  longitude: number;
  pois: Array<{
    id: string;
    name: string;
    category: 'TRANSIT' | 'EDUCATION' | 'HEALTHCARE' | 'EMPLOYMENT' | 'LIFESTYLE';
    distanceKm: number;
    timeMins: number;
    mode: 'DRIVE' | 'WALK' | 'METRO';
  }>;
}

export interface BuildingApprovalsState {
  projectName: string;
  developerName: string;
  architectName: string;
  totalTowers: number;
  totalFloors: number;
  totalUnitsInProject: number;
  unitsPerFloor: number;
  constructionProgressPercent: number;
  launchDate: string;
  possessionDate: string;
  reraNumber: string;
  reraAuthorityUrl: string;
  reraQrCodeUrl: string;
  occupancyCertificateStatus: 'RECEIVED' | 'IN_PROCESS' | 'AWAITED';
  commencementCertificateStatus: 'RECEIVED' | 'IN_PROCESS' | 'AWAITED';
  fireNocReceived: boolean;
  environmentalClearance: boolean;
  approvedBanks: string[];
}

export interface ParkingSpecsState {
  parkingAvailable: boolean;
  totalSlots: number;
  coveredSlots: number;
  openSlots: number;
  basementSlots: number;
  mechanicalStackSlots: number;
  stiltSlots: number;
  podiumSlots: number;
  evChargingAvailable: boolean;
  dedicatedVisitorParking: boolean;
  twoWheelerSlots: number;
  includedInAgreementValue: boolean;
  additionalCostINR: number;
}
