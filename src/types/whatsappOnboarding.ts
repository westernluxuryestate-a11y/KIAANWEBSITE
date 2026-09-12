/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Jurisdiction, PropertyType, ProjectType, RERARecord, LocationInfo, Amenity, MediaAsset } from '../types';

export type WhatsAppIntent = 
  | 'ADD_PROPERTY' 
  | 'ADD_PROJECT' 
  | 'ADD_MULTIPLE_UNITS' 
  | 'UPDATE_LISTING' 
  | 'ADD_COMMERCIAL' 
  | 'ADD_RENTAL' 
  | 'ADD_PRE_LEASE'
  | 'GENERAL_QUERY'
  | 'CUSTOMER_SEARCH'
  | 'BULK_INVENTORY_UPLOAD';

export type OnboardingFlowType = 'PROPERTY' | 'PROJECT';

export type WhatsAppUserRole = 'CUSTOMER' | 'CONTRIBUTOR';

export type ContributorTrustLevel = 'UNVERIFIED' | 'VERIFIED' | 'TRUSTED_PARTNER' | 'INTERNAL';

export type MarketingStatus = 
  | 'NEW' 
  | 'UNDER_CONSTRUCTION' 
  | 'READY_POSSESSION' 
  | 'RESALE' 
  | 'RENT' 
  | 'LEASE' 
  | 'PRE_LEASE';

export type TransactionStatus = 
  | 'AVAILABLE' 
  | 'SOLD' 
  | 'RESERVED' 
  | 'ON_HOLD' 
  | 'OFF_MARKET';

export type AdminReviewStatus = 
  | 'DRAFT' 
  | 'PENDING_REVIEW' 
  | 'INFORMATION_REQUESTED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PUBLISHED';

export type WhatsAppMessageType = 
  | 'TEXT' 
  | 'VOICE' 
  | 'IMAGE' 
  | 'VIDEO' 
  | 'DOCUMENT' 
  | 'LOCATION' 
  | 'CONTACT' 
  | 'SYSTEM_CARD' 
  | 'INTERACTIVE_BUTTONS'
  | 'CONFIRMATION_CARD'
  | 'DUPLICATE_ALERT'
  | 'BULK_INVENTORY_CARD';

export type ReraGateStatus = 'RERA_INCOMPLETE' | 'RERA_PENDING_VERIFICATION' | 'RERA_VERIFIED';

export interface PriceNormalizationRecord {
  rawInput: string;
  canonicalINR: number;
  formattedDisplay: string;
  pricePerSqFt?: number;
  normalizationConfidence: number; // 0-100
  originalCurrency: string;
  isNegotiable: boolean;
}

export interface ContributorVerificationRecord {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  whatsappId?: string;
  trustLevel: ContributorTrustLevel;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  otpCode?: string;
  otpVerifiedAt?: string;
  verificationMethod: 'WHATSAPP_OTP' | 'SMS_OTP' | 'MANUAL_KYC' | 'PARTNER_TOKEN';
  organization?: string;
}

export interface DuplicateDetectionMatch {
  matchAssetId: string;
  matchTitle: string;
  matchType: 'PROPERTY' | 'PROJECT';
  confidenceScore: number; // 0 - 100
  reasons: string[];
  existingUrl?: string;
  existingPriceINR?: number;
  existingCarpetArea?: number;
  existingReraNumber?: string;
  existingAddress?: string;
}

export interface UnitDraftItem {
  id: string;
  tower: string;
  unitNumber: string;
  floor: number;
  configuration: string;
  carpetAreaSqFt: number;
  askingPriceINR: number;
  rawPriceInput?: string;
  facing: string;
  status: TransactionStatus;
  parkingCount: number;
  balconyCount: number;
  isValid: boolean;
  validationErrors: string[];
}

export interface BulkInventorySummary {
  id: string;
  fileName: string;
  uploadedAt: string;
  totalUnitsDetected: number;
  validUnitsCount: number;
  duplicateUnitsCount: number;
  missingDataCount: number;
  towersFound: string[];
  unitDrafts: UnitDraftItem[];
  validationRulesApplied: string[];
  isApprovedForMerge: boolean;
}

export interface CrmOutboundEvent {
  id: string;
  eventType: 'LEAD_CONTRIBUTOR_ONBOARDED' | 'DRAFT_CREATED' | 'ADMIN_REVIEW_REQUESTED' | 'PROPERTY_PUBLISHED' | 'PRICE_MODIFIED';
  timestamp: string;
  source: 'WHATSAPP_ONBOARDING';
  payload: Record<string, any>;
  dispatchedToCrm: boolean;
}

export interface SecureOnboardingToken {
  token: string;
  draftId: string;
  onboardingType: OnboardingFlowType;
  expiresAt: string;
  deepLinkUrl: string;
  qrCodeSvgData?: string;
}

export type MediaRoomCategory = 
  | 'EXTERIOR' 
  | 'LIVING_ROOM' 
  | 'BEDROOM' 
  | 'KITCHEN' 
  | 'BATHROOM' 
  | 'BALCONY' 
  | 'VIEW' 
  | 'AMENITIES' 
  | 'FLOOR_PLAN' 
  | 'LOCATION';

export interface ImageQualityAnalysis {
  isHighQuality: boolean;
  resolutionText: string;
  clarityScore: number; // 0-100
  lightingScore: number; // 0-100
  isBlurry: boolean;
  hasWatermark: boolean;
  isDuplicate: boolean;
  suggestedCategory: MediaRoomCategory;
  confidenceScore: number; // 0-100
  unsuitableReason?: string;
  thumbnailUrl: string;
}

export interface WhatsAppMediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  url: string;
  originalFileName: string;
  fileSizeMb: number;
  uploadedAt: string;
  qualityAnalysis?: ImageQualityAnalysis;
  videoProcessingStatus?: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  documentExtractionStatus?: 'PARSED_UNVERIFIED' | 'VALIDATED' | 'FAILED';
  extractedInfo?: Record<string, any>;
}

export interface WhatsAppVoiceItem {
  id: string;
  audioUrl?: string;
  durationSeconds: number;
  recordedAt: string;
  rawTranscript: string;
  detectedLanguage: 'English' | 'Hindi' | 'Hinglish' | 'Marathi';
  confidencePercent: number;
  structuredConfirmation: {
    configuration?: string;
    location?: string;
    carpetAreaSqFt?: number;
    priceFormatted?: string;
    priceINR?: number;
    facing?: string;
    floor?: number;
  };
  confirmedByUser: boolean;
}

export interface WhatsAppLocationItem {
  id: string;
  address: string;
  microMarket: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  googleMapsUrl?: string;
  landmarks: {
    name: string;
    type?: 'METRO' | 'HIGHWAY' | 'IT_PARK' | 'SCHOOL' | 'HOSPITAL' | 'AIRPORT' | 'MALL';
    distanceKm: number;
    commuteMinutes: number;
  }[];
}

export interface WhatsAppChatMessage {
  id: string;
  sender: 'USER' | 'KIAAN_BOT' | 'ADMIN_ADVISOR';
  timestamp: string;
  type: WhatsAppMessageType;
  text?: string;
  media?: WhatsAppMediaItem;
  voice?: WhatsAppVoiceItem;
  location?: WhatsAppLocationItem;
  buttons?: {
    id: string;
    label: string;
    intent: WhatsAppIntent;
  }[];
  extractedSnippet?: {
    label: string;
    value: string;
  }[];
}

export interface WhatsAppPropertyDraft {
  id: string;
  sourceChannel: 'WHATSAPP';
  onboardingType: 'PROPERTY';
  status: 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED';
  reviewStatus: AdminReviewStatus;
  marketingStatus: MarketingStatus;
  transactionStatus: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  contributor: ContributorVerificationRecord;
  contactNumber: string;
  ownerOrAgentName: string;
  propertyType: PropertyType;
  listingIntent: 'SELL' | 'RENT' | 'LEASE' | 'PRE_LEASE' | 'RESALE';
  title: string;
  configuration: string; // e.g. "3 BHK"
  carpetAreaSqFt: number;
  askingPriceINR: number;
  askingPriceFormatted: string; // e.g. "₹1.45 Cr"
  priceAudit: PriceNormalizationRecord;
  monthlyRentINR?: number;
  expectedYieldPercent?: number;
  floorNumber?: number;
  totalFloors?: number;
  facing?: string;
  parkingSpaces?: number;
  ownershipType?: 'FREEHOLD' | 'LEASEHOLD' | 'COOPERATIVE_SOCIETY' | 'POWER_OF_ATTORNEY' | 'UNKNOWN';
  possessionDate?: string;
  availabilityStatus: 'IMMEDIATE' | 'UNDER_30_DAYS' | 'READY_POSSESSION' | 'UNDER_CONSTRUCTION';
  location: WhatsAppLocationItem;
  buildingOrSocietyName: string;
  hasReraCertificate: boolean;
  reraNumber?: string;
  reraStatus: ReraGateStatus;
  media: WhatsAppMediaItem[];
  missingMandatoryFields: string[];
  requestedMissingFields?: string[];
  completenessPercent: number;
  duplicateMatches: DuplicateDetectionMatch[];
  duplicateDecision?: 'IGNORE_PROCEED' | 'ATTACH_TO_EXISTING' | 'UNDER_EVALUATION';
  aiSafetyCheck: {
    isSafe: boolean;
    flaggedHallucinations: string[];
    unverifiedFields: string[];
    confidenceScore: number;
  };
  adminReviewNotes?: string;
  adminReviewHistory?: {
    timestamp: string;
    action: string;
    note: string;
    adminName: string;
  }[];
  verifiedByAdmin?: string;
  secureToken?: SecureOnboardingToken;
  publishedAssetId?: string;
  originalRawMessages?: string[];
}

export interface WhatsAppProjectDraft {
  id: string;
  sourceChannel: 'WHATSAPP';
  onboardingType: 'PROJECT';
  status: 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED';
  reviewStatus: AdminReviewStatus;
  marketingStatus: MarketingStatus;
  transactionStatus: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  contributor: ContributorVerificationRecord;
  developerOrPromoterName: string;
  projectName: string;
  tagline: string;
  projectType: ProjectType;
  jurisdiction: Jurisdiction;
  reraNumber: string; // e.g. "P52100028492"
  reraGateStatus: ReraGateStatus;
  reraGateDetails: {
    hasValidRegistrationFormat: boolean;
    hasOfficialQrCode: boolean;
    hasTitleSearchCertificate: boolean;
    hasDedicatedEscrow: boolean;
    officialAuthority: string;
    verifiedOnMahaReraPortal: boolean;
  };
  location: WhatsAppLocationItem;
  configurations: string[]; // e.g. ["2 BHK", "3 BHK", "4 BHK Sky Suite"]
  priceRangeDisplay: string; // e.g. "₹1.25 Cr - ₹3.40 Cr"
  priceMinINR: number;
  priceMaxINR: number;
  priceAudit?: PriceNormalizationRecord;
  carpetAreaMinSqFt: number;
  carpetAreaMaxSqFt: number;
  totalLandAcres: number;
  totalTowersCount: number;
  totalUnitsCount: number;
  units: UnitDraftItem[];
  bulkInventorySummary?: BulkInventorySummary;
  possessionDate: string;
  projectStatus: 'PRE_LAUNCH' | 'UNDER_CONSTRUCTION' | 'NEAR_POSSESSION' | 'READY_POSSESSION';
  amenities: string[];
  media: WhatsAppMediaItem[];
  brochurePdfUrl?: string;
  floorPlans: {
    title: string;
    bhk: string;
    carpetAreaSqFt: number;
    layoutUrl: string;
  }[];
  missingMandatoryFields: string[];
  requestedMissingFields?: string[];
  completenessPercent: number;
  duplicateMatches: DuplicateDetectionMatch[];
  duplicateDecision?: 'IGNORE_PROCEED' | 'ATTACH_TO_EXISTING' | 'UNDER_EVALUATION';
  aiSafetyCheck: {
    isSafe: boolean;
    flaggedHallucinations: string[];
    unverifiedFields: string[];
    confidenceScore: number;
  };
  canPublish: boolean;
  adminReviewNotes?: string;
  adminReviewHistory?: {
    timestamp: string;
    action: string;
    note: string;
    adminName: string;
  }[];
  verifiedByAdmin?: string;
  secureToken?: SecureOnboardingToken;
  publishedProjectId?: string;
  originalRawMessages?: string[];
}
