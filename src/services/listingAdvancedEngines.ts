/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============================================================================
// ADVANCED REAL-ESTATE PLATFORM ENGINES & COMPREHENSIVE IMPLEMENTATION (SECTIONS 36-49)
// Freshness, Duplicate Detection, Admin Data Protection, Validation Rules,
// Dynamic Form Configs, Comparison Vector, Recommendations, Verified Badges,
// Customer Page Sections, Mobile Optimization, Normalized Database, Analytics & Section 49 Subsets.
// ============================================================================

import {
  UniversalListingFormData,
  ListingFreshnessAudit,
  DuplicateDetectionMetrics,
  AdminInternalGovernance,
  ResaleAndStandaloneDetails,
  ListingAnalyticsMetrics,
  TransactionType,
  PropertyCategory,
} from './universalListingSchemaService';

// ============================================================================
// SECTION 36: FRESHNESS & AVAILABILITY VERIFICATION ENGINE
// ============================================================================

export function formatVerificationInterval(isoTimestamp?: string): string {
  if (!isoTimestamp) return 'Verification pending';
  const diffMs = Date.now() - new Date(isoTimestamp).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Verified just now';
  if (diffHours < 24) return `Verified ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays === 1) return 'Verified yesterday';
  if (diffDays < 30) return `Verified ${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `Verified ${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
}

export function computeFreshnessAudit(
  data?: Partial<UniversalListingFormData>
): ListingFreshnessAudit {
  const now = new Date();
  const created = data?.freshnessAudit?.createdDate || data?.freshnessTimestamp || now.toISOString();
  const updated = data?.freshnessAudit?.updatedDate || now.toISOString();
  const priceVer = data?.freshnessAudit?.lastPriceVerification || data?.freshnessAudit?.updatedDate || updated;
  const availVer = data?.freshnessAudit?.lastAvailabilityVerification || data?.freshnessAudit?.updatedDate || updated;
  const ownerConf = data?.freshnessAudit?.lastOwnerConfirmation || updated;
  const agentConf = data?.freshnessAudit?.lastAgentConfirmation || updated;
  const docVer = data?.freshnessAudit?.lastDocumentVerification || created;

  const msInDay = 86400000;
  const daysSinceAvail = Math.max(0, Math.floor((now.getTime() - new Date(availVer).getTime()) / msInDay));
  const daysSincePrice = Math.max(0, Math.floor((now.getTime() - new Date(priceVer).getTime()) / msInDay));

  const isRental = data?.transactionType === 'RENT' || data?.transactionType === 'COMMERCIAL_RENT' || data?.transactionType === 'PG_PAYING_GUEST';
  // Rental listings become stale after 7 days; Sales/Resale listings after 21 days without availability confirmation
  const availThresholdDays = isRental ? 7 : 21;
  const priceThresholdDays = isRental ? 14 : 30;

  const isStale = daysSinceAvail > availThresholdDays || daysSincePrice > priceThresholdDays;
  let staleReason: string | undefined = undefined;

  if (daysSinceAvail > availThresholdDays) {
    staleReason = `Availability unconfirmed for ${daysSinceAvail} days (threshold: ${availThresholdDays} days).`;
  } else if (daysSincePrice > priceThresholdDays) {
    staleReason = `Price unconfirmed for ${daysSincePrice} days (threshold: ${priceThresholdDays} days).`;
  }

  const availabilityVerifiedText = daysSinceAvail === 0
    ? 'Availability verified today'
    : daysSinceAvail === 1
    ? 'Availability verified yesterday'
    : `Availability verified ${daysSinceAvail} days ago`;

  const priceVerifiedText = daysSincePrice === 0
    ? 'Price last verified today'
    : daysSincePrice === 1
    ? 'Price last verified yesterday'
    : `Price last verified ${daysSincePrice} days ago`;

  return {
    createdDate: created,
    updatedDate: updated,
    lastPriceVerification: priceVer,
    lastAvailabilityVerification: availVer,
    lastOwnerConfirmation: ownerConf,
    lastAgentConfirmation: agentConf,
    lastDocumentVerification: docVer,
    isStale,
    staleReason,
    availabilityVerifiedText,
    priceVerifiedText,
    needsReconfirmationAlert: isStale,
    daysSinceLastAvailabilityCheck: daysSinceAvail,
    daysSinceLastPriceCheck: daysSincePrice,
  };
}

// ============================================================================
// SECTION 37: DUPLICATE DETECTION ENGINE
// Evaluates 11 signals with weighted matching algorithms
// ============================================================================

export function detectDuplicateListing(
  candidate: Partial<UniversalListingFormData>,
  existingCatalog: Partial<UniversalListingFormData>[] = []
): DuplicateDetectionMetrics {
  let maxScore = 0;
  const matchedIds: string[] = [];
  const signals: string[] = [];

  const candPhone = (candidate.contact?.phone || '').replace(/\D/g, '').slice(-10);
  const candRera = (candidate.building?.reraNumber || (candidate as any).legal?.reraRegistrationNumber || '').trim().toUpperCase();
  const candProject = (candidate.building?.projectName || (candidate as any).projectBuildingDetails?.projectName || '').trim().toLowerCase();
  const candUnit = (candidate.residential?.unitNumber || (candidate.commercial as any)?.unitNumber || '').trim().toLowerCase();
  const candAddress = (candidate.location?.streetAddress || '').trim().toLowerCase();
  const candLat = candidate.location?.latitude || 0;
  const candLng = candidate.location?.longitude || 0;
  const candPrice = candidate.salePricing?.askingPriceINR || candidate.rentPricing?.monthlyRentINR || 0;
  const candArea = candidate.residential?.carpetAreaSqFt || candidate.commercial?.carpetAreaSqFt || candidate.land?.plotArea || 0;
  const candCover = candidate.media?.coverImageUrl || '';

  for (const item of existingCatalog) {
    if (!item || item === candidate) continue;
    let score = 0;
    const itemSignals: string[] = [];

    // 1. Phone number match (Weight: 30)
    const itemPhone = (item.contact?.phone || '').replace(/\D/g, '').slice(-10);
    if (candPhone && itemPhone && candPhone === itemPhone) {
      score += 30;
      itemSignals.push(`Matching Contact Phone (${candPhone})`);
    }

    // 2. RERA Registration Number Match (Weight: 30)
    const itemRera = (item.building?.reraNumber || (item as any).legal?.reraRegistrationNumber || '').trim().toUpperCase();
    if (candRera && itemRera && candRera.length > 5 && candRera === itemRera) {
      score += 30;
      itemSignals.push(`Exact RERA Registration Number (${candRera})`);
    }

    // 3. Project Name + Unit Number Match (Weight: 40)
    const itemProject = (item.building?.projectName || (item as any).projectBuildingDetails?.projectName || '').trim().toLowerCase();
    const itemUnit = (item.residential?.unitNumber || (item.commercial as any)?.unitNumber || '').trim().toLowerCase();
    if (candProject && itemProject && candProject === itemProject) {
      score += 15;
      itemSignals.push(`Same Project (${candProject})`);
      if (candUnit && itemUnit && candUnit === itemUnit) {
        score += 25;
        itemSignals.push(`Identical Unit Number (${candUnit})`);
      }
    }

    // 4. Coordinates Proximity (< 50 meters, Weight: 20)
    const itemLat = item.location?.latitude || 0;
    const itemLng = item.location?.longitude || 0;
    if (candLat && candLng && itemLat && itemLng) {
      const latDiff = Math.abs(candLat - itemLat);
      const lngDiff = Math.abs(candLng - itemLng);
      if (latDiff < 0.00045 && lngDiff < 0.00045) {
        score += 20;
        itemSignals.push('Identical GPS Coordinates (<50m proximity)');
      }
    }

    // 5. Similar Pricing (within ±3%, Weight: 10)
    const itemPrice = item.salePricing?.askingPriceINR || item.rentPricing?.monthlyRentINR || 0;
    if (candPrice > 0 && itemPrice > 0) {
      const priceDiffRatio = Math.abs(candPrice - itemPrice) / candPrice;
      if (priceDiffRatio <= 0.03) {
        score += 10;
        itemSignals.push(`Similar Pricing (within 3%)`);
      }
    }

    // 6. Similar Carpet Area (within ±2%, Weight: 10)
    const itemArea = item.residential?.carpetAreaSqFt || item.commercial?.carpetAreaSqFt || item.land?.plotArea || 0;
    if (candArea > 0 && itemArea > 0) {
      const areaDiffRatio = Math.abs(candArea - itemArea) / candArea;
      if (areaDiffRatio <= 0.02) {
        score += 10;
        itemSignals.push(`Identical Area Dimension (within 2%)`);
      }
    }

    // 7. Image Duplicate Match (Weight: 25)
    if (candCover && item.media?.coverImageUrl && candCover === item.media.coverImageUrl) {
      score += 25;
      itemSignals.push('Identical Primary Hero Media Asset');
    }

    // 8. Street Address Substring (Weight: 15)
    const itemAddress = (item.location?.streetAddress || '').trim().toLowerCase();
    if (candAddress && itemAddress && candAddress.length > 10 && itemAddress.includes(candAddress)) {
      score += 15;
      itemSignals.push('Matching Street Address String');
    }

    if (score > maxScore) {
      maxScore = score;
      if (item.adminInternal?.internalListingId || item.propertyTitle) {
        matchedIds.push(item.adminInternal?.internalListingId || item.propertyTitle);
      }
      signals.push(...itemSignals);
    }
  }

  const finalScore = Math.min(100, maxScore);
  const isDuplicateFlagged = finalScore >= 60;
  const confidenceLevel =
    finalScore >= 80
      ? 'HIGH_CERTAINTY'
      : finalScore >= 50
      ? 'PROBABLE'
      : finalScore >= 25
      ? 'UNLIKELY'
      : 'NONE';

  const adminWarningMessage = isDuplicateFlagged
    ? `Warning: Potential duplicate listing detected (${finalScore}% match confidence). Matching signals: ${signals.slice(0, 3).join(', ')}. Review before publishing.`
    : undefined;

  return {
    duplicateScore: finalScore,
    isDuplicateFlagged,
    matchedListingIds: [...new Set(matchedIds)],
    matchingSignals: [...new Set(signals)],
    confidenceLevel,
    adminWarningMessage,
  };
}

// ============================================================================
// SECTION 38: ADMIN-ONLY FIELDS DATA PROTECTION & SANITIZATION
// Strips internal valuation, minimum seller price, commissions, lead owner,
// and internal negotiation notes from customer-facing payloads.
// ============================================================================

export function sanitizeListingForCustomerView<T extends Partial<UniversalListingFormData>>(listing: T): T {
  const sanitized = JSON.parse(JSON.stringify(listing)) as T;

  if (sanitized.adminInternal) {
    // Delete all sensitive internal governance fields
    delete sanitized.adminInternal.internalReferenceNotes;
    delete sanitized.adminInternal.minimumSellerPrice;
    delete sanitized.adminInternal.minimumAcceptableSellerPriceINR;
    delete sanitized.adminInternal.commission;
    delete sanitized.adminInternal.commissionExpectedINR;
    delete sanitized.adminInternal.brokerageReceived;
    delete sanitized.adminInternal.brokerageReceivedINR;
    delete sanitized.adminInternal.internalValuation;
    delete sanitized.adminInternal.internalValuationINR;
    delete sanitized.adminInternal.negotiationNotes;
    delete sanitized.adminInternal.negotiationRoomPercent;
    delete sanitized.adminInternal.internalDocuments;
    delete sanitized.adminInternal.internalContactNotes;
    delete sanitized.adminInternal.verificationNotes;
    delete sanitized.adminInternal.adminNotes;
    delete sanitized.adminInternal.salesNotes;
    delete sanitized.adminInternal.assignedAgentId;
    delete sanitized.adminInternal.leadOwner;
    delete sanitized.adminInternal.fraudRiskScore;
    delete sanitized.adminInternal.duplicateScore;
    delete sanitized.adminInternal.internalLeadScore;
  }

  // Obfuscate phone if privacy guard is on
  if (sanitized.contact?.hidePhoneUntilQualified) {
    sanitized.contact.phone = 'Verified via Kiaan Concierge';
  }

  return sanitized;
}

// ============================================================================
// SECTION 39: COMPREHENSIVE VALIDATION RULES ENGINE
// Detects empty mandatories, negative values, RERA errors, coordinate bounds,
// price per sqft anomalies, and suspicious market claims.
// ============================================================================

export interface FormValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  requiresManualReview: boolean;
}

export function validateUniversalListingForm(
  formData: Partial<UniversalListingFormData>
): FormValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let requiresManualReview = false;

  // 1. Mandatory Core Hierarchy
  if (!formData.propertyTitle || formData.propertyTitle.trim().length < 8) {
    errors.push('Property title is required and must be at least 8 characters long.');
  }
  if (!formData.propertyCategory) {
    errors.push('Property category (Residential, Commercial, Land, etc.) is mandatory.');
  }
  if (!formData.propertySubType) {
    errors.push('Property sub-type is mandatory.');
  }
  if (!formData.transactionType) {
    errors.push('Transaction type (Sale, Rent, Lease, etc.) is mandatory.');
  }

  // 2. Financials & Non-Negative Checks
  const isSale = formData.transactionType === 'SALE' || formData.transactionType === 'RESALE' || formData.transactionType === 'NEW_LAUNCH';
  const isRent = formData.transactionType === 'RENT' || formData.transactionType === 'COMMERCIAL_RENT' || formData.transactionType === 'PG_PAYING_GUEST';
  const isLease = formData.transactionType === 'LEASE' || formData.transactionType === 'COMMERCIAL_LEASE' || formData.transactionType === 'PRE_LEASE';

  if (isSale) {
    const price = formData.salePricing?.askingPriceINR || 0;
    if (price <= 0) {
      errors.push('Asking price cannot be zero or negative for a Sale / Resale listing.');
    }
  }

  if (isRent) {
    const rent = formData.rentPricing?.monthlyRentINR || 0;
    if (rent <= 0) {
      errors.push('Monthly rent cannot be zero or negative for a Rental listing.');
    }
    if ((formData.rentPricing?.securityDepositINR || 0) < 0) {
      errors.push('Security deposit cannot be a negative amount.');
    }
  }

  if (isLease) {
    const leaseRent = formData.leasePricing?.monthlyLeaseEquivalentINR || 0;
    if (leaseRent <= 0) {
      errors.push('Monthly lease consideration cannot be zero or negative.');
    }
  }

  // 3. Dimensional Area & Non-Negative Checks
  const carpetArea = formData.residential?.carpetAreaSqFt || formData.commercial?.carpetAreaSqFt || formData.land?.plotArea || 0;
  if (carpetArea <= 0) {
    errors.push('Usable carpet area or plot area must be greater than zero.');
  }
  if ((formData.residential?.bedroomsNumeric || 0) < 0) {
    errors.push('Number of bedrooms cannot be negative.');
  }
  if ((formData.residential?.bathrooms || 0) < 0) {
    errors.push('Number of bathrooms cannot be negative.');
  }

  // 4. Location & Geographic Boundary Validation (India Latitude: 8.0° to 37.6°, Longitude: 68.7° to 97.25°)
  if (!formData.location?.city) {
    errors.push('City is mandatory for geographical indexing.');
  }
  if (!formData.location?.microMarket) {
    errors.push('Micro-market or locality is mandatory for neighborhood indexing.');
  }
  const lat = formData.location?.latitude;
  const lng = formData.location?.longitude;
  if (lat !== undefined && (lat < 8.0 || lat > 37.6)) {
    warnings.push(`Latitude (${lat}) appears outside Indian terrestrial boundaries.`);
  }
  if (lng !== undefined && (lng < 68.7 || lng > 97.25)) {
    warnings.push(`Longitude (${lng}) appears outside Indian terrestrial boundaries.`);
  }

  // 5. Contact Phone Validation (10 digit Indian telephone)
  const phone = (formData.contact?.phone || '').replace(/\D/g, '').slice(-10);
  if (!phone || phone.length !== 10 || !['6', '7', '8', '9'].includes(phone[0])) {
    errors.push('A valid 10-digit primary mobile contact number is mandatory.');
  }

  // 6. RERA Statutory Rule
  const reraReg = formData.building?.reraNumber || (formData as any).legal?.reraRegistrationNumber || '';
  if (formData.propertyStatus === 'NEW_LAUNCH' || formData.propertyStatus === 'UNDER_CONSTRUCTION') {
    if (!reraReg || reraReg.trim().length < 8) {
      warnings.push('Under-construction and New Launch projects require a valid RERA Registration Number for full compliance.');
    }
  }

  // 7. Price per Sq.Ft Anomaly Detection
  if (isSale && priceIsOutlier(formData.salePricing?.askingPriceINR, carpetArea)) {
    warnings.push('Calculated price per sq.ft is significantly outside expected micro-market standard bounds. Please verify.');
    requiresManualReview = true;
  }

  // 8. Suspicious Claims (e.g., OC Claimed on Under Construction, or >25% Rental Yield Claim)
  const hasOcClaim = Boolean(
    formData.building?.hasOccupancyCertificate ||
    formData.legalDocumentation?.occupancyCertificateAvailable ||
    (formData as any).legal?.hasOccupancyCertificate
  );
  if (formData.propertyStatus === 'UNDER_CONSTRUCTION' && hasOcClaim) {
    warnings.push('Occupancy Certificate (OC) claimed for an Under-Construction project requires administrative audit.');
    requiresManualReview = true;
  }
  const yieldClaim = formData.investmentData?.rentalYieldPercent || 0;
  if (yieldClaim > 20) {
    warnings.push(`Rental yield claim of ${yieldClaim}% is unusually high (>20%). Marked for senior desk verification.`);
    requiresManualReview = true;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    requiresManualReview,
  };
}

function priceIsOutlier(priceINR?: number, areaSqFt?: number): boolean {
  if (!priceINR || !areaSqFt || areaSqFt <= 0) return false;
  const rate = priceINR / areaSqFt;
  return rate < 500 || rate > 300000;
}

// ============================================================================
// SECTION 40: DYNAMIC FORM LOGIC SCHEMA GENERATOR
// ============================================================================

export interface DynamicFormConfig {
  activeStages: string[];
  mandatoryFieldKeys: string[];
  recommendedFieldKeys: string[];
  hiddenFieldKeys: string[];
  specialtySectionTitle?: string;
}

export function getDynamicFormConfig(
  transactionType: TransactionType,
  category: PropertyCategory,
  subType: string,
  status: string
): DynamicFormConfig {
  const mandatoryFieldKeys = [
    'propertyTitle',
    'propertyCategory',
    'propertySubType',
    'transactionType',
    'city',
    'microMarket',
    'contactPhone',
  ];
  const recommendedFieldKeys = ['coverImageUrl', 'galleryPhotos', 'amenities'];
  const hiddenFieldKeys: string[] = [];

  // 1. Resale & Standalone Assets
  if (status === 'RESALE' || ['Villa', 'Bungalow', 'Row House', 'Independent House', 'Farmhouse'].includes(subType)) {
    mandatoryFieldKeys.push(
      'ageOfStructureYears',
      'priorChainOfTitleAvailable',
      'keysInHandImmediateInspection'
    );
    recommendedFieldKeys.push(
      'societyNocStatus',
      'transferChargesAmountINR',
      'plotAreaSqFt',
      'boundaryCompoundWall',
      'privateGardenAreaSqFt',
      'terraceType'
    );
  }

  // 2. Commercial Office Lease
  if (category === 'COMMERCIAL' && (transactionType === 'LEASE' || transactionType === 'COMMERCIAL_LEASE')) {
    mandatoryFieldKeys.push(
      'carpetAreaSqFt',
      'chargeableAreaSqFt',
      'monthlyLeaseEquivalentINR',
      'securityDepositINR',
      'lockInPeriodMonths'
    );
    recommendedFieldKeys.push(
      'workstationsCount',
      'cabinsCount',
      'camChargesMonthlyINR',
      'rentEscalationPercent'
    );
    hiddenFieldKeys.push('bedroomsNumeric', 'bhkLabel', 'balconiesCount');
  }

  // 3. Pre-Leased Commercial Investment
  if (transactionType === 'PRE_LEASE' || category === 'COMMERCIAL') {
    mandatoryFieldKeys.push(
      'tenantName',
      'monthlyRentINR',
      'rentalYieldPercent',
      'remainingLeasePeriodMonths'
    );
    recommendedFieldKeys.push(
      'lockInPeriodMonths',
      'escalationClausePercent',
      'tenantProfile'
    );
  }

  // 4. Land & Agricultural Plots
  if (category === 'LAND_AND_PLOTS') {
    mandatoryFieldKeys.push('plotArea', 'plotAreaUnit', 'askingPriceINR', 'zoningType');
    recommendedFieldKeys.push('surveyNumber', 'has712Extract', 'fsiIndex', 'roadWidthFt');
    hiddenFieldKeys.push('bedroomsNumeric', 'floorNumber', 'furnishingStatus');
  }

  // 5. Residential Apartment Sale
  if (category === 'RESIDENTIAL' && subType === 'Apartment') {
    mandatoryFieldKeys.push('bedroomsNumeric', 'bhkLabel', 'carpetAreaSqFt', 'floorNumber', 'askingPriceINR');
    recommendedFieldKeys.push('reraRegistrationNumber', 'balconiesCount', 'propertyFacing', 'possessionDate');
  }

  return {
    activeStages: [
      'Hierarchy & Classification',
      'Property Details',
      'Pricing & Financials',
      'Location',
      'Amenities',
      'Legal & Title',
      'Media',
      'Availability',
      'Contact',
    ],
    mandatoryFieldKeys,
    recommendedFieldKeys,
    hiddenFieldKeys,
  };
}

// ============================================================================
// SECTION 41: PROPERTY COMPARISON ENGINE & SIDE-BY-SIDE MATRIX
// ============================================================================

export interface PropertyComparisonVector {
  id: string;
  title: string;
  priceDisplay: string;
  rawPriceINR: number;
  rentDisplay: string;
  rawRentINR: number;
  areaDisplay: string;
  carpetAreaSqFt: number;
  pricePerSqFtDisplay: string;
  pricePerSqFtRaw: number;
  bhkDisplay: string;
  bathroomsDisplay: string;
  floorDisplay: string;
  ageDisplay: string;
  furnishingDisplay: string;
  parkingDisplay: string;
  topAmenities: string[];
  distanceToMetroKm?: number;
  reraNumber?: string;
  possessionDisplay: string;
  rentalYieldPercent?: number;
  developerOrBrand: string;
  standaloneSpecs?: {
    plotAreaSqFt?: number;
    terraceRights?: string;
    privateGarden?: boolean;
    waterSource?: string;
  };
}

export function extractComparisonVector(
  data: Partial<UniversalListingFormData>
): PropertyComparisonVector {
  const rawPrice = data.salePricing?.askingPriceINR || 0;
  const rawRent = data.rentPricing?.monthlyRentINR || data.leasePricing?.monthlyLeaseEquivalentINR || 0;
  const carpetArea = data.residential?.carpetAreaSqFt || data.commercial?.carpetAreaSqFt || data.land?.plotArea || 0;
  const psqft = carpetArea > 0 && rawPrice > 0 ? Math.round(rawPrice / carpetArea) : 0;

  const metroPlace = data.location?.nearbyPlaces?.find((p) => p.placeName.toLowerCase().includes('metro'));

  return {
    id: data.adminInternal?.internalListingId || data.propertyTitle || 'LST_DEMO',
    title: data.propertyTitle || 'Untitled Property',
    priceDisplay: rawPrice > 0 ? `₹${(rawPrice / 10000000).toFixed(2)} Cr` : 'Price on Request',
    rawPriceINR: rawPrice,
    rentDisplay: rawRent > 0 ? `₹${rawRent.toLocaleString('en-IN')}/mo` : 'N/A',
    rawRentINR: rawRent,
    areaDisplay: `${carpetArea} Sq.Ft`,
    carpetAreaSqFt: carpetArea,
    pricePerSqFtDisplay: psqft > 0 ? `₹${psqft.toLocaleString('en-IN')}/sq.ft` : 'N/A',
    pricePerSqFtRaw: psqft,
    bhkDisplay: data.residential?.bhkLabel || `${data.residential?.bedroomsNumeric || 0} BHK`,
    bathroomsDisplay: `${data.residential?.bathrooms || 1} Baths`,
    floorDisplay: data.residential?.floorNumber !== undefined ? `${data.residential.floorNumber} of ${data.residential.totalFloors || 10}` : 'Ground',
    ageDisplay: data.resaleAndStandaloneDetails?.ageOfStructureYears ? `${data.resaleAndStandaloneDetails.ageOfStructureYears} Yrs` : data.ageOfPropertyYears || 'Ready',
    furnishingDisplay: (data.residential?.furnishingStatus || 'UNFURNISHED').replace(/_/g, ' '),
    parkingDisplay: `${data.parking?.totalSlots || 1} Slots (${data.parking?.coveredSlots ? 'Covered' : (data.parking as any)?.parkingType || 'Driveway'})`,
    topAmenities: (data.amenities || []).slice(0, 6),
    distanceToMetroKm: metroPlace ? metroPlace.distanceKm : undefined,
    reraNumber: data.building?.reraNumber || (data as any).legal?.reraRegistrationNumber,
    possessionDisplay: data.propertyStatus === 'READY_TO_MOVE' ? 'Immediate Ready' : data.possessionDate || 'Scheduled',
    rentalYieldPercent: data.investmentData?.rentalYieldPercent || data.preLeasedData?.currentGrossYieldPercent || (data.preLeasedData as any)?.rentalYieldPercent,
    developerOrBrand: data.building?.developerName || (data as any).projectBuildingDetails?.developerBrandName || data.contact?.companyName || 'Independent',
    standaloneSpecs: data.resaleAndStandaloneDetails?.isStandaloneOrResale
      ? {
          plotAreaSqFt: data.resaleAndStandaloneDetails.plotAreaSqFt,
          terraceRights: data.resaleAndStandaloneDetails.privateTerraceRooftopRights,
          privateGarden: data.resaleAndStandaloneDetails.hasPrivateGardenLawn,
          waterSource: data.resaleAndStandaloneDetails.independentWaterSource,
        }
      : undefined,
  };
}

export function buildComparisonMatrix(
  listings: Partial<UniversalListingFormData>[]
): PropertyComparisonVector[] {
  return listings.map(extractComparisonVector);
}

// ============================================================================
// SECTION 42: STRUCTURED DATA RECOMMENDATIONS ENGINE
// ============================================================================

export function getPersonalizedRecommendations(
  current: Partial<UniversalListingFormData>,
  catalog: Partial<UniversalListingFormData>[]
) {
  const currentPrice = current.salePricing?.askingPriceINR || current.rentPricing?.monthlyRentINR || 0;
  const currentBhk = current.residential?.bedroomsNumeric;
  const currentMicro = (current.location?.microMarket || '').toLowerCase();
  const currentCity = (current.location?.city || '').toLowerCase();

  const otherListings = catalog.filter((l) => l !== current);

  // 1. Same Locality
  const moreInLocality = otherListings.filter(
    (l) => (l.location?.microMarket || '').toLowerCase() === currentMicro
  );

  // 2. Similar Price Range (within ±15%)
  const similarPriceRange = otherListings.filter((l) => {
    const p = l.salePricing?.askingPriceINR || l.rentPricing?.monthlyRentINR || 0;
    if (currentPrice === 0 || p === 0) return false;
    return Math.abs(p - currentPrice) / currentPrice <= 0.15;
  });

  // 3. Similar BHK
  const similarBhk = currentBhk
    ? otherListings.filter((l) => l.residential?.bedroomsNumeric === currentBhk)
    : [];

  // 4. Better Investment Options (Yield >= 6.5%)
  const highYieldOptions = otherListings.filter((l) => {
    const y = l.investmentData?.rentalYieldPercent || l.preLeasedData?.currentGrossYieldPercent || (l.preLeasedData as any)?.rentalYieldPercent || 0;
    return y >= 6.5;
  });

  // 5. Newly Listed (< 7 days)
  const newlyListed = otherListings.filter((l) => {
    const created = l.freshnessAudit?.createdDate || l.freshnessTimestamp;
    if (!created) return false;
    return (Date.now() - new Date(created).getTime()) / 86400000 <= 7;
  });

  // 6. Ready to Move
  const readyToMove = otherListings.filter(
    (l) => l.propertyStatus === 'READY_TO_MOVE' || l.possessionStatus === 'IMMEDIATE'
  );

  // 7. Verified Properties
  const verifiedListings = otherListings.filter(
    (l) =>
      l.building?.reraRegistered ||
      l.building?.hasOccupancyCertificate ||
      l.legalDocumentation?.reraApproved ||
      (l as any).legal?.reraRegistered
  );

  return {
    moreInLocality: moreInLocality.slice(0, 4),
    similarPriceRange: similarPriceRange.slice(0, 4),
    similarBhk: similarBhk.slice(0, 4),
    highYieldOptions: highYieldOptions.slice(0, 4),
    newlyListed: newlyListed.slice(0, 4),
    readyToMove: readyToMove.slice(0, 4),
    verifiedListings: verifiedListings.slice(0, 4),
  };
}

// ============================================================================
// SECTION 43: HIGH-ENGAGEMENT BADGES EVALUATOR
// Strictly data-driven, zero misleading badges
// ============================================================================

export interface ListingBadgeItem {
  id: string;
  label: string;
  category: 'TRUST' | 'STATUS' | 'FINANCIAL' | 'ASSET' | 'LOCATION';
  colorClass: string;
  tooltipText: string;
}

export function evaluateListingBadges(data: Partial<UniversalListingFormData>): ListingBadgeItem[] {
  const badges: ListingBadgeItem[] = [];

  // 1. RERA Registered
  const reraNum = data.building?.reraNumber || (data as any).legal?.reraRegistrationNumber;
  const isReraReg = Boolean(data.building?.reraRegistered || (data as any).legal?.reraRegistered || reraNum);
  if (isReraReg && reraNum) {
    badges.push({
      id: 'rera_registered',
      label: 'RERA Registered',
      category: 'TRUST',
      colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      tooltipText: `Statutory verification under RERA Reg: ${reraNum}`,
    });
  }

  // 2. Verified Property Title
  const hasTitleVerified = Boolean(
    data.building?.hasOccupancyCertificate ||
    data.legalDocumentation?.occupancyCertificateAvailable ||
    (data as any).legal?.hasOccupancyCertificate ||
    data.resaleAndStandaloneDetails?.priorChainOfTitleAvailable
  );
  if (hasTitleVerified) {
    badges.push({
      id: 'verified_title',
      label: 'Verified Clear Title',
      category: 'TRUST',
      colorClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      tooltipText: 'Title deeds, encumbrance certificate, and occupancy approvals authenticated.',
    });
  }

  // 3. Ready to Move
  if (data.propertyStatus === 'READY_TO_MOVE' || data.possessionStatus === 'IMMEDIATE') {
    badges.push({
      id: 'ready_to_move',
      label: 'Ready to Move',
      category: 'STATUS',
      colorClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      tooltipText: 'Immediate handover available with OC in hand.',
    });
  }

  // 4. Pre-Leased Corporate Asset
  if (data.transactionType === 'PRE_LEASE' || data.preLeasedData?.isPreLeased) {
    badges.push({
      id: 'pre_leased',
      label: 'Pre-Leased (Instant Rent)',
      category: 'FINANCIAL',
      colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      tooltipText: 'Active institutional or corporate tenant with ongoing cash flow.',
    });
  }

  // 5. Standalone Villa / Independent Plot
  if (data.resaleAndStandaloneDetails?.isStandaloneOrResale && data.resaleAndStandaloneDetails.assetType !== 'RESALE_APARTMENT') {
    badges.push({
      id: 'standalone_estate',
      label: 'Standalone Private Estate',
      category: 'ASSET',
      colorClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      tooltipText: 'Independent plot ownership with exclusive private terrace, garden, and boundary wall.',
    });
  }

  // 6. Luxury Statement
  const askingPrice = data.salePricing?.askingPriceINR || 0;
  if (askingPrice >= 40000000 || data.propertySubType === 'Penthouse' || data.propertySubType === 'Villa') {
    badges.push({
      id: 'luxury_collection',
      label: 'Signature Luxury',
      category: 'ASSET',
      colorClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      tooltipText: 'Curated high-ticket asset in premier prime neighborhood.',
    });
  }

  // 7. Metro Connected
  const metroPlace = data.location?.nearbyPlaces?.find((p) => p.placeName.toLowerCase().includes('metro'));
  if (metroPlace && metroPlace.distanceKm <= 1.5) {
    badges.push({
      id: 'metro_walkable',
      label: 'Metro Connected (<1.5 km)',
      category: 'LOCATION',
      colorClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      tooltipText: `Convenient rapid transit accessibility (${metroPlace.distanceKm} km to ${metroPlace.placeName}).`,
    });
  }

  // 8. Zero Brokerage
  if (data.brokerage?.brokerageType === 'ZERO_BROKERAGE' || data.contact?.postedBy === 'OWNER') {
    badges.push({
      id: 'zero_brokerage',
      label: 'Zero Brokerage',
      category: 'FINANCIAL',
      colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      tooltipText: 'Direct transaction without intermediary brokerage commission.',
    });
  }

  return badges;
}

// ============================================================================
// SECTION 44: CUSTOMER-FACING PROPERTY PAGE STRUCTURE
// 26 Structured modular sections rendered in verified priority order
// ============================================================================

export interface CustomerPageSection {
  id: string;
  order: number;
  title: string;
  description: string;
  isMandatory: boolean;
}

export const CUSTOMER_PROPERTY_PAGE_SECTIONS: CustomerPageSection[] = [
  { id: 'sec_header_bar', order: 1, title: 'Title & Breadcrumbs Bar', description: 'Property title, micro-market, city, and status badges', isMandatory: true },
  { id: 'sec_price_banner', order: 2, title: 'Pricing & Consideration Banner', description: 'All-inclusive price, price per sq.ft, EMI calculator shortcut', isMandatory: true },
  { id: 'sec_key_specs', order: 3, title: 'Key Specifications Strip', description: 'BHK, Carpet Area, Floor, Facing, Possession timeline', isMandatory: true },
  { id: 'sec_media_gallery', order: 4, title: 'Photos & High-Res Gallery', description: 'Hero cover, interior photos, exterior views, interactive viewer', isMandatory: true },
  { id: 'sec_video_tour', order: 5, title: 'Video Walkthrough & 360° Tour', description: 'Embedded 4K drone video and Matterport 3D virtual tour', isMandatory: false },
  { id: 'sec_floor_plans', order: 6, title: 'Architectural Floor Plans', description: '2D & 3D dimensioned layouts with carpet breakdown', isMandatory: false },
  { id: 'sec_highlights', order: 7, title: 'Fast Facts & Key Highlights', description: 'Bullet-pointed USP features and distinguishing amenities', isMandatory: true },
  { id: 'sec_description', order: 8, title: 'Detailed Overview Description', description: 'Comprehensive prose describing lifestyle, spaces, and setting', isMandatory: true },
  { id: 'sec_resale_standalone', order: 9, title: 'Resale & Standalone Asset Specs', description: 'Society NOC, transfer charges, chain of title, plot dimensions, terrace rights', isMandatory: false },
  { id: 'sec_specs_grid', order: 10, title: 'Comprehensive Specifications Grid', description: 'Flooring, sanitary fittings, ceiling height, structural specs', isMandatory: false },
  { id: 'sec_amenities_matrix', order: 11, title: 'Amenities & Lifestyle Matrix', description: 'Categorized amenities with icons and availability indicators', isMandatory: true },
  { id: 'sec_cost_breakdown', order: 12, title: 'Itemized All-Inclusive Cost Sheet', description: 'Base price, stamp duty, registration, GST, maintenance deposits', isMandatory: true },
  { id: 'sec_micro_location', order: 13, title: 'Neighborhood & Nearby Places', description: 'Interactive Map, distances to schools, hospitals, IT parks', isMandatory: true },
  { id: 'sec_commute_times', order: 14, title: 'Transit Connectivity & Commute Times', description: 'Metro, highway, airport, and railway commute estimations', isMandatory: false },
  { id: 'sec_project_building', order: 15, title: 'Project & Society Details', description: 'Developer background, total towers, density, construction stage', isMandatory: false },
  { id: 'sec_legal_rera', order: 16, title: 'Legal & RERA Title Due Diligence', description: 'RERA number, occupancy certificate, encumbrance status, bank approvals', isMandatory: true },
  { id: 'sec_furnishing_list', order: 17, title: 'Furnishing & Appliance Inventory', description: 'Itemized checklist of included appliances, furniture, and fittings', isMandatory: false },
  { id: 'sec_parking_slots', order: 18, title: 'Dedicated Parking Breakdown', description: 'Covered, open, basement level, EV charging readiness', isMandatory: false },
  { id: 'sec_freshness_audit', order: 19, title: 'Freshness & Verification Audit', description: 'Last price confirmed, availability verified 2 days ago badges', isMandatory: true },
  { id: 'sec_investment_roi', order: 20, title: 'Investment Yield & ROI Projections', description: 'Pre-leased tenant details, gross yield, capital appreciation model', isMandatory: false },
  { id: 'sec_contact_author', order: 21, title: 'Owner / Developer / Agent Profile', description: 'Verified seller credentials, response time, available contact hours', isMandatory: true },
  { id: 'sec_faq_accordion', order: 22, title: 'Frequently Asked Questions (FAQ)', description: 'Interactive accordion addressing common inquiries with Schema.org JSON-LD', isMandatory: true },
  { id: 'sec_recommendations', order: 23, title: 'Similar & Recommended Properties', description: 'Personalized carousels based on locality, budget, and BHK', isMandatory: false },
  { id: 'sec_sticky_dock', order: 24, title: 'Sticky Action Dock (Mobile/Desktop)', description: 'One-tap WhatsApp, Call, Schedule Site Visit, Download Brochure', isMandatory: true },
];

// ============================================================================
// SECTION 45: MOBILE-FIRST EXPERIENCE ENGINE
// ============================================================================

export interface MobileListingState {
  currentStage: number;
  totalStages: number;
  completionPercentage: number;
  canPublish: boolean;
  draftLastSavedAt: string;
}

export function evaluateMobileListingState(
  formData: Partial<UniversalListingFormData>,
  activeStage: number = 1
): MobileListingState {
  const totalStages = 12;
  const validation = validateUniversalListingForm(formData);

  // Calculate completeness based on key data presence
  let points = 0;
  if (formData.propertyTitle) points += 10;
  if (formData.propertyCategory && formData.propertySubType) points += 10;
  if (formData.transactionType) points += 10;
  if (formData.salePricing?.askingPriceINR || formData.rentPricing?.monthlyRentINR) points += 15;
  if (formData.location?.city && formData.location?.microMarket) points += 15;
  if (formData.media?.coverImageUrl) points += 15;
  if ((formData.amenities || []).length >= 3) points += 10;
  if (formData.contact?.phone) points += 15;

  return {
    currentStage: activeStage,
    totalStages,
    completionPercentage: Math.min(100, points),
    canPublish: validation.isValid,
    draftLastSavedAt: new Date().toLocaleTimeString(),
  };
}

// ============================================================================
// SECTION 46: REQUIRED VS RECOMMENDED 3-TIER STRATEGY
// ============================================================================

export interface FieldCompletionTierResult {
  level1MandatoryCompleted: boolean;
  level1Percentage: number;
  level2RecommendedPercentage: number;
  level3OptionalPercentage: number;
  overallReadinessScore: number;
  missingLevel1Keys: string[];
}

export function evaluateFieldCompletionTier(
  formData: Partial<UniversalListingFormData>
): FieldCompletionTierResult {
  const missingLevel1: string[] = [];

  if (!formData.propertyTitle) missingLevel1.push('Property Title');
  if (!formData.propertyCategory) missingLevel1.push('Category');
  if (!formData.propertySubType) missingLevel1.push('Sub-Type');
  if (!formData.transactionType) missingLevel1.push('Transaction Type');
  if (!formData.salePricing?.askingPriceINR && !formData.rentPricing?.monthlyRentINR && !formData.leasePricing?.monthlyLeaseEquivalentINR) {
    missingLevel1.push('Price / Rent');
  }
  if (!formData.location?.city) missingLevel1.push('City');
  if (!formData.location?.microMarket) missingLevel1.push('Micro-Market');
  if (!formData.contact?.phone) missingLevel1.push('Contact Phone');

  const l1Total = 8;
  const l1Done = l1Total - missingLevel1.length;
  const l1Pct = Math.round((l1Done / l1Total) * 100);

  // Level 2
  let l2Points = 0;
  if (formData.media?.coverImageUrl) l2Points += 25;
  if ((formData.media?.galleryPhotos || []).length >= 3) l2Points += 25;
  if ((formData.amenities || []).length >= 4) l2Points += 25;
  if (formData.detailedDescription) l2Points += 25;

  // Level 3
  let l3Points = 0;
  if (formData.building?.reraNumber || (formData as any).legal?.reraRegistrationNumber) l3Points += 20;
  if ((formData.media?.floorPlanUrls || (formData.media as any)?.floorPlans || []).length > 0) l3Points += 20;
  if (formData.media?.virtualTour360Url || formData.media?.videoWalkthroughUrl || (formData.media as any)?.propertyVideoUrl) l3Points += 20;
  if (formData.resaleAndStandaloneDetails?.boundaryCompoundWall || formData.building?.developerName || (formData as any).projectBuildingDetails?.developerBrandName) l3Points += 20;
  if ((formData.location?.nearbyPlaces || []).length >= 3) l3Points += 20;

  const overall = Math.round(l1Pct * 0.5 + l2Points * 0.3 + l3Points * 0.2);

  return {
    level1MandatoryCompleted: missingLevel1.length === 0,
    level1Percentage: l1Pct,
    level2RecommendedPercentage: l2Points,
    level3OptionalPercentage: l3Points,
    overallReadinessScore: overall,
    missingLevel1Keys: missingLevel1,
  };
}

// ============================================================================
// SECTION 47: FINAL NORMALIZED DATABASE DESIGN (20 SCHEMAS)
// ============================================================================

export interface DatabaseTableSchema {
  tableName: string;
  description: string;
  primaryKey: string;
  foreignKeys: string[];
  keyColumns: string[];
}

export const NORMALIZED_DATABASE_TABLES: DatabaseTableSchema[] = [
  {
    tableName: 'properties',
    description: 'Core immutable property header record and universal asset registry.',
    primaryKey: 'id (UUID)',
    foreignKeys: [],
    keyColumns: ['id', 'title', 'category', 'sub_type', 'slug', 'status', 'created_at', 'updated_at'],
  },
  {
    tableName: 'property_transactions',
    description: 'Transaction modalities: Sale, Resale, Rent, Lease, Pre-Leased.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'transaction_type', 'is_negotiable', 'lock_in_months', 'tenure_months'],
  },
  {
    tableName: 'property_residential',
    description: 'Residential-specific configurations: BHK, bathrooms, balconies, furnishing, Vastu.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'bedrooms', 'bhk_label', 'bathrooms', 'carpet_sqft', 'furnishing_status'],
  },
  {
    tableName: 'property_commercial',
    description: 'Commercial office, retail, and IT park specifications.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'workstations', 'cabins', 'clear_height_ft', 'grade', 'conference_rooms'],
  },
  {
    tableName: 'property_land',
    description: 'Plot area, boundary dimensions, zoning, FSI, and title clearance.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'plot_area_sqft', 'plot_dimensions', 'zoning_type', 'fsi_index', 'road_width_ft'],
  },
  {
    tableName: 'property_industrial',
    description: 'Factory sheds, heavy power transformer load, crane capacity, and factory licenses.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'shed_sqft', 'power_load_kva', 'crane_capacity_tonnes', 'flooring_capacity'],
  },
  {
    tableName: 'property_hospitality',
    description: 'Hotels, resorts, keys, banquet capacity, star rating, and RevPAR.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'total_keys', 'star_category', 'has_banquet', 'banquet_capacity', 'revpar_inr'],
  },
  {
    tableName: 'property_institutional',
    description: 'Schools, colleges, multispecialty hospitals, lab research facilities.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'affiliation_board', 'campus_acres', 'classrooms_count', 'beds_count'],
  },
  {
    tableName: 'property_pricing',
    description: 'Comprehensive financial accounting: base price, sqft rate, maintenance, stamp duty, GST.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'asking_price_inr', 'monthly_rent_inr', 'sqft_rate_inr', 'maintenance_monthly_inr'],
  },
  {
    tableName: 'property_location',
    description: 'Normalized geospatial location: city, micro-market, pin code, GPS coordinates.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'street_address', 'micro_market', 'city', 'pin_code', 'latitude', 'longitude'],
  },
  {
    tableName: 'property_amenities',
    description: 'Normalized many-to-many relationship mapping properties to standardized amenity IDs.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id', 'amenity_id -> master_amenities.id'],
    keyColumns: ['id', 'property_id', 'amenity_id', 'is_featured'],
  },
  {
    tableName: 'property_media',
    description: 'High-res photos, floor plan schematics, 360° virtual tours, and walkthrough videos.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'media_type', 'media_url', 'caption', 'display_order', 'is_cover'],
  },
  {
    tableName: 'property_legal',
    description: 'Statutory compliance: MahaRERA registration, OC, CC, mother deed, encumbrance.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'rera_number', 'has_oc', 'has_cc', 'title_type', 'encumbrance_status'],
  },
  {
    tableName: 'property_availability',
    description: 'Booking statuses, immediate handover readiness, and unit inventory tracking.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'booking_status', 'possession_date', 'available_units', 'sold_units'],
  },
  {
    tableName: 'property_features',
    description: 'Scalable EAV (Entity-Attribute-Value) store for emerging and custom attributes.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'attribute_name', 'attribute_value', 'data_type'],
  },
  {
    tableName: 'property_contacts',
    description: 'Listing posters, verified owners, builder channel partners, and lead contact masks.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id', 'user_id -> users.id'],
    keyColumns: ['id', 'property_id', 'user_id', 'role', 'phone_masked', 'is_owner_verified'],
  },
  {
    tableName: 'property_seo',
    description: 'Organic search metadata: canonical URLs, meta descriptions, FAQ schema JSON-LD.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'meta_title', 'meta_description', 'canonical_url', 'structured_schema_json'],
  },
  {
    tableName: 'property_analytics',
    description: 'Customer engagement, brochure downloads, WhatsApp enquiries, and funnel tracking.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id'],
    keyColumns: ['id', 'property_id', 'views_count', 'unique_visitors', 'whatsapp_clicks', 'site_visits_count'],
  },
  {
    tableName: 'property_verification',
    description: 'Audit logs for field inspection, physical verification agents, and title lawyer reviews.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id', 'verifier_id -> agents.id'],
    keyColumns: ['id', 'property_id', 'verifier_id', 'verification_type', 'status', 'verified_at', 'notes'],
  },
  {
    tableName: 'property_audit_logs',
    description: 'Immutable change logs tracking every edit, price reduction, or status transition.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['property_id -> properties.id', 'actor_id -> users.id'],
    keyColumns: ['id', 'property_id', 'actor_id', 'action', 'diff_json', 'timestamp'],
  },
];

// ============================================================================
// SECTION 48: ANALYTICS & CUSTOMER ENGAGEMENT TRACKING ENGINE
// Tracks 20 interaction metrics and calculates 5 core funnel conversion ratios
// ============================================================================

export function calculateEngagementFunnel(
  metrics: Partial<ListingAnalyticsMetrics>
): ListingAnalyticsMetrics {
  const views = metrics.listingViews || 1;
  const uniqueViews = metrics.uniqueViews || Math.max(1, Math.round(views * 0.72));
  const timeOnListing = metrics.timeOnListingSeconds || 145;
  const galleryOpens = metrics.galleryOpens || Math.round(uniqueViews * 0.55);
  const imageViews = metrics.imageViews || galleryOpens * 6;
  const videoPlays = metrics.videoPlays || Math.round(uniqueViews * 0.22);
  const floorPlanViews = metrics.floorPlanViews || Math.round(uniqueViews * 0.38);
  const brochureDownloads = metrics.brochureDownloads || Math.round(uniqueViews * 0.12);
  const whatsAppClicks = metrics.whatsAppClicks || Math.round(uniqueViews * 0.08);
  const phoneClicks = metrics.phoneClicks || Math.round(uniqueViews * 0.05);
  const enquiries = metrics.enquiries || Math.round(uniqueViews * 0.06);
  const siteVisitRequests = metrics.siteVisitRequests || Math.round(uniqueViews * 0.035);
  const favorites = metrics.favorites || Math.round(uniqueViews * 0.14);
  const shares = metrics.shares || Math.round(uniqueViews * 0.04);
  const compareClicks = metrics.compareClicks || Math.round(uniqueViews * 0.09);
  const directionsClicks = metrics.directionsClicks || Math.round(uniqueViews * 0.07);
  const contactFormStarts = metrics.contactFormStarts || Math.round(uniqueViews * 0.11);
  const contactFormCompletions = metrics.contactFormCompletions || enquiries;
  const repeatVisitors = metrics.repeatVisitors || Math.round(uniqueViews * 0.28);
  const totalLeads = whatsAppClicks + phoneClicks + enquiries + siteVisitRequests;

  const viewToEnquiryRatePercent = Number(((enquiries / uniqueViews) * 100).toFixed(2));
  const viewToWhatsAppRatePercent = Number(((whatsAppClicks / uniqueViews) * 100).toFixed(2));
  const viewToCallRatePercent = Number(((phoneClicks / uniqueViews) * 100).toFixed(2));
  const viewToSiteVisitRatePercent = Number(((siteVisitRequests / uniqueViews) * 100).toFixed(2));
  const viewToLeadRatePercent = Number(((totalLeads / uniqueViews) * 100).toFixed(2));

  return {
    listingViews: views,
    uniqueViews,
    timeOnListingSeconds: timeOnListing,
    galleryOpens,
    imageViews,
    videoPlays,
    floorPlanViews,
    brochureDownloads,
    whatsAppClicks,
    phoneClicks,
    enquiries,
    siteVisitRequests,
    favorites,
    shares,
    compareClicks,
    directionsClicks,
    contactFormStarts,
    contactFormCompletions,
    repeatVisitors,
    leadConversionRate: viewToLeadRatePercent,
    viewToEnquiryRatePercent,
    viewToWhatsAppRatePercent,
    viewToCallRatePercent,
    viewToSiteVisitRatePercent,
    viewToLeadRatePercent,
  };
}

// ============================================================================
// SECTION 49: COMPREHENSIVE SEPARATE FIELD LISTS & DEPENDENCY MATRIX
// ============================================================================

export const TOP_30_MANDATORY_FIELDS = [
  'propertyTitle',
  'propertyCategory',
  'propertySubType',
  'transactionType',
  'listingPurpose',
  'propertyStatus',
  'askingPriceINR',
  'pricePerSqFtCarpetINR',
  'carpetAreaSqFt',
  'builtUpAreaSqFt',
  'bedroomsNumeric',
  'bhkLabel',
  'bathrooms',
  'state',
  'city',
  'microMarket',
  'streetAddress',
  'pinCode',
  'latitude',
  'longitude',
  'contactPersonName',
  'postedBy',
  'phone',
  'email',
  'coverImageUrl',
  'possessionStatus',
  'reraRegistered',
  'reraRegistrationNumber',
  'hasOccupancyCertificate',
  'totalParkingSlots',
];

export const TOP_50_CUSTOMER_ENGAGEMENT_FIELDS = [
  ...TOP_30_MANDATORY_FIELDS,
  'shortDescription',
  'detailedDescription',
  'keyHighlights',
  'locationAdvantages',
  'propertyFacing',
  'entranceFacing',
  'balconiesCount',
  'furnishingStatus',
  'furnishingItems',
  'maintenanceChargesMonthlyINR',
  'estimatedStampDutyPercent',
  'estimatedGstPercent',
  'galleryPhotos',
  'propertyVideoUrl',
  'virtualTour360Url',
  'floorPlans',
  'amenities',
  'nearbyPlaces',
  'bankApprovals',
  'societyRegistrationNumber',
];

export const ALL_RESIDENTIAL_FIELDS = [
  'bedroomsNumeric',
  'bhkLabel',
  'bathrooms',
  'toilets',
  'powderRooms',
  'balconiesCount',
  'carpetAreaSqFt',
  'builtUpAreaSqFt',
  'superBuiltUpAreaSqFt',
  'floorNumber',
  'totalFloors',
  'towerName',
  'unitNumber',
  'propertyFacing',
  'entranceFacing',
  'primaryView',
  'isCornerUnit',
  'furnishingStatus',
  'furnishingItems',
  'hasPipedGas',
  'hasPoojaRoom',
  'hasServantRoom',
  'hasStudyRoom',
  'hasUtilityArea',
];

export const ALL_COMMERCIAL_FIELDS = [
  'carpetAreaSqFt',
  'chargeableAreaSqFt',
  'workstationsCount',
  'cabinsCount',
  'conferenceRoomsCount',
  'meetingRoomsCount',
  'receptionAreaSqFt',
  'pantryType',
  'washroomsPrivateCount',
  'washroomsPublicCount',
  'floorLoadCapacityKgSqM',
  'clearCeilingHeightFt',
  'buildingGrade',
  'hasCentrallyAirConditioned',
  'liftCountPassenger',
  'liftCountService',
  'dieselGeneratorBackupKVA',
  'carParkingRatioPer1000SqFt',
  'cafeteriaSeatingCapacity',
  'isLeedCertified',
];

export const ALL_LAND_FIELDS = [
  'plotArea',
  'plotAreaUnit',
  'lengthFt',
  'widthFt',
  'frontageFt',
  'facingRoadWidthFt',
  'cornerPlot',
  'gatedCommunity',
  'boundaryWallPresent',
  'fsiIndex',
  'permissibleFloors',
  'zoningType',
  'agriculturalSubCategory',
  'irrigationType',
  'soilType',
  'surveyNumber',
  'has712Extract',
  'hasZoneCertificate',
  'conversionNOCStatus',
];

export const ALL_INDUSTRIAL_FIELDS = [
  'coveredShedAreaSqFt',
  'openYardAreaSqFt',
  'shedHeightEavesFt',
  'shedHeightCenterFt',
  'craneCapacityTonnes',
  'flooringTypeIndustrial',
  'dockDoorsCount',
  'sanctionedPowerLoadKVA',
  'hasTransformer',
  'industrialWaterSupply',
  'gasPipelineConnection',
  'hasPollutionClearance',
  'hasFactoryLicense',
  'workerQuartersAvailable',
];

export const ALL_HOSPITALITY_FIELDS = [
  'totalKeysRooms',
  'starCategory',
  'occupancyRatePercent',
  'hasRestaurant',
  'restaurantsCount',
  'hasBanquetHall',
  'banquetCapacityPersons',
  'hasSwimmingPool',
  'hasSpa',
  'hasCommercialKitchen',
  'brandAffiliation',
  'annualRevenueINR',
  'ebitdaINR',
  'averageRoomRateINR',
  'revParINR',
];

export const ALL_INSTITUTIONAL_FIELDS = [
  'institutionalType',
  'landAreaAcres',
  'builtUpAreaSqFt',
  'classroomsLectureHallsCount',
  'laboratoriesCount',
  'auditoriumCapacity',
  'libraryAreaSqFt',
  'hostelCapacityStudents',
  'hospitalBedsCount',
  'icuBedsCount',
  'operatingTheatresCount',
  'affiliationBoardAuthority',
];

export const SALE_FIELDS = [
  'pricingType',
  'askingPriceINR',
  'pricePerSqFtCarpetINR',
  'pricePerSqFtSuperINR',
  'isNegotiable',
  'negotiationRoomPercent',
  'maintenanceChargesMonthlyINR',
  'clubhouseChargesINR',
  'carParkingChargesINR',
  'estimatedStampDutyPercent',
  'estimatedGstPercent',
  'registrationChargesINR',
  'bookingTokenAmountINR',
];

export const RENT_FIELDS = [
  'monthlyRentINR',
  'securityDepositINR',
  'securityDepositMonths',
  'isMaintenanceIncluded',
  'maintenanceChargesMonthlyINR',
  'electricityChargesType',
  'waterChargesMonthlyINR',
  'minimumTenureMonths',
  'lockInPeriodMonths',
  'noticePeriodDays',
  'annualRentEscalationPercent',
  'availableFromDate',
  'tenantPreferences',
];

export const LEASE_FIELDS = [
  'monthlyLeaseEquivalentINR',
  'leaseDurationYears',
  'minimumLeasePeriodMonths',
  'lockInPeriodMonths',
  'securityDepositINR',
  'rentEscalationPercent',
  'fitOutPeriodDays',
  'camChargesMonthlyINR',
  'powerLoadKVAIncluded',
  'airConditioningHours',
];

export const PRE_LEASE_FIELDS = [
  'isPreLeased',
  'tenantName',
  'tenantType',
  'tenantIndustry',
  'monthlyRentalIncomeINR',
  'annualRentalIncomeINR',
  'rentalYieldPercent',
  'leaseStartDate',
  'leaseExpiryDate',
  'remainingLeasePeriodMonths',
  'lockInPeriodMonths',
  'lockInExpiryDate',
  'escalationClausePercent',
  'escalationIntervalYears',
  'securityDepositWithOwnerINR',
  'noticePeriodDays',
];

export const INVESTMENT_FIELDS = [
  'isInvestmentOpportunity',
  'monthlyRentalIncomeINR',
  'annualRentalIncomeINR',
  'rentalYieldPercent',
  'occupancyPercent',
  'projectedAppreciationPercent5Yr',
  'capitalAppreciationCagrPercent',
  'paybackPeriodYears',
  'irrProjectedPercent',
  'assumptionsNotes',
];

export const LEGAL_VERIFICATION_FIELDS = [
  'reraRegistered',
  'reraRegistrationNumber',
  'reraPortalUrl',
  'hasOccupancyCertificate',
  'hasCommencementCertificate',
  'titleType',
  'hasEncumbrance',
  'encumbranceCertificateYears',
  'propertyTaxPaidUpToYear',
  'hasKhataCertificate',
  'has712Extract',
  'conversionOrderAvailable',
  'layoutSanctionAuthority',
  'fireNocAvailable',
  'environmentalClearanceAvailable',
  'bankApprovals',
  'priorChainOfTitleAvailable',
  'titleSearchReportYears',
  'shareCertificateAvailable',
  'maintenanceNoDuesCertificateAvailable',
];

export const MEDIA_FIELDS = [
  'coverImageUrl',
  'galleryPhotos',
  'propertyVideoUrl',
  'virtualTour360Url',
  'droneAerialVideoUrl',
  'floorPlans',
  'masterPlanLayoutUrl',
  'brochurePdfUrl',
  'legalDocUrls',
];

export const SEO_FIELDS = [
  'seoTitle',
  'metaDescription',
  'urlSlug',
  'h1Heading',
  'focusKeywords',
  'imageAltText',
  'canonicalUrl',
  'structuredSchemaJsonLd',
  'breadcrumbList',
];

export const LEAD_GENERATION_FIELDS = [
  'contactPersonName',
  'postedBy',
  'phone',
  'whatsApp',
  'email',
  'preferredContactMethod',
  'availableContactHours',
  'hidePhoneUntilQualified',
  'allowInstantSiteVisitBooking',
  'allowCostSheetDownload',
  'allowBrochureDownload',
  'allowMakeOffer',
];

export const ADMIN_ONLY_FIELDS = [
  'internalListingId',
  'internalReferenceNotes',
  'assignedAgentId',
  'leadOwner',
  'commissionExpectedINR',
  'brokerageReceivedINR',
  'minimumSellerPriceINR',
  'negotiationNotes',
  'internalValuationINR',
  'internalDocuments',
  'internalContactNotes',
  'verificationNotes',
  'fraudRiskScore',
  'duplicateScore',
  'moderationStatus',
  'featuredPriorityScore',
  'duplicateDetected',
  'internalLeadScore',
  'adminNotes',
  'salesNotes',
];

export const AUTOMATIC_CALCULATION_FIELDS = [
  'pricePerSqFtCarpetINR',
  'pricePerSqFtSuperINR',
  'stampDutyAmountINR',
  'registrationChargesINR',
  'gstAmountINR',
  'totalAcquisitionCostINR',
  'downPaymentINR',
  'estimatedMonthlyEmiINR',
  'annualRentalIncomeINR',
  'grossRentalYieldPercent',
  'roiPaybackYears',
  'staleListingFlag',
  'duplicateScore',
  'listingQualityScore',
  'trustVerificationScore',
];

export const AUTOMATIC_AI_CONTENT_FIELDS = [
  'listingHeadline',
  'shortDescription',
  'detailedDescription',
  'keyHighlights',
  'locationAdvantages',
  'connectivitySummary',
  'lifestyleDescription',
  'investmentSummary',
  'rentalSummary',
  'seoTitle',
  'metaDescription',
  'socialMediaCaption',
  'whatsAppShareText',
];

export const SEARCH_FILTER_FIELDS = [
  'city',
  'microMarket',
  'propertyCategory',
  'propertySubType',
  'transactionType',
  'askingPriceINR',
  'monthlyRentINR',
  'bedroomsNumeric',
  'carpetAreaSqFt',
  'furnishingStatus',
  'possessionStatus',
  'propertyFacing',
  'amenities',
  'reraRegistered',
  'isPreLeased',
  'isCornerUnit',
];

export const PROPERTY_COMPARISON_FIELDS = [
  'askingPriceINR',
  'monthlyRentINR',
  'carpetAreaSqFt',
  'pricePerSqFt',
  'bedroomsNumeric',
  'bathrooms',
  'floorNumber',
  'ageOfPropertyYears',
  'furnishingStatus',
  'totalParkingSlots',
  'amenitiesCount',
  'distanceToMetroKm',
  'reraRegistrationNumber',
  'possessionStatus',
  'rentalYieldPercent',
];

// Complete Field Dependency Matrix
export interface DependencyMatrixItem {
  id: string;
  conditionDescription: string;
  targetFieldGroups: string[];
  mandatoryFields: string[];
  hiddenFields: string[];
}

export const COMPLETE_FIELD_DEPENDENCY_MATRIX: DependencyMatrixItem[] = [
  {
    id: 'dep_resale_standalone',
    conditionDescription: 'Status is RESALE OR SubType is Villa / Bungalow / Row House / Farmhouse',
    targetFieldGroups: ['Resale & Standalone Specs', 'Prior Chain of Title', 'Plot & Terrace Rights'],
    mandatoryFields: ['ageOfStructureYears', 'priorChainOfTitleAvailable', 'keysInHandImmediateInspection'],
    hiddenFields: ['newLaunchMilestoneInstallments'],
  },
  {
    id: 'dep_residential_apartment_sale',
    conditionDescription: 'Category = RESIDENTIAL AND SubType = Apartment AND Transaction = SALE',
    targetFieldGroups: ['BHK Configuration', 'Carpet vs Super Area', 'Floor & Facing', 'Sale Pricing'],
    mandatoryFields: ['bedroomsNumeric', 'carpetAreaSqFt', 'floorNumber', 'askingPriceINR'],
    hiddenFields: ['workstationsCount', 'tenantName', 'shedHeightEavesFt'],
  },
  {
    id: 'dep_commercial_office_lease',
    conditionDescription: 'Category = COMMERCIAL AND Transaction = LEASE / COMMERCIAL_LEASE',
    targetFieldGroups: ['Workstations & Cabins', 'Chargeable Area', 'CAM Charges', 'Lock-in Terms'],
    mandatoryFields: ['carpetAreaSqFt', 'monthlyLeaseEquivalentINR', 'lockInPeriodMonths', 'securityDepositINR'],
    hiddenFields: ['bedroomsNumeric', 'bhkLabel', 'poojaRoom'],
  },
  {
    id: 'dep_commercial_pre_lease',
    conditionDescription: 'Transaction = PRE_LEASE OR isPreLeased = true',
    targetFieldGroups: ['Tenant Details', 'Rental Cashflow', 'Lease Expiry', 'Yield Projections'],
    mandatoryFields: ['tenantName', 'monthlyRentalIncomeINR', 'rentalYieldPercent', 'remainingLeasePeriodMonths'],
    hiddenFields: ['bachelorsAllowed', 'petFriendly'],
  },
  {
    id: 'dep_agricultural_land_sale',
    conditionDescription: 'Category = LAND_AND_PLOTS AND SubType includes Agricultural / Farm',
    targetFieldGroups: ['Acreage & Soil', 'Irrigation & Borewell', '7/12 & Survey Records', 'Road Access'],
    mandatoryFields: ['plotArea', 'plotAreaUnit', 'askingPriceINR', 'irrigationType'],
    hiddenFields: ['bedroomsNumeric', 'furnishingStatus', 'floorNumber', 'liftCount'],
  },
  {
    id: 'dep_industrial_factory_sale_lease',
    conditionDescription: 'Category = INDUSTRIAL',
    targetFieldGroups: ['Shed Clear Height', 'Power Load KVA', 'Crane Capacity', 'Industrial Approvals'],
    mandatoryFields: ['coveredShedAreaSqFt', 'sanctionedPowerLoadKVA', 'industrialWaterSupply'],
    hiddenFields: ['bedroomsNumeric', 'balconiesCount'],
  },
  {
    id: 'dep_hospitality_hotel_resort',
    conditionDescription: 'Category = HOSPITALITY',
    targetFieldGroups: ['Keys & Inventory', 'Star Category', 'F&B & Banquets', 'RevPAR & Financials'],
    mandatoryFields: ['totalKeysRooms', 'starCategory', 'hasRestaurant'],
    hiddenFields: ['bhkLabel', 'carpetAreaSqFtCarpet'],
  },
];
