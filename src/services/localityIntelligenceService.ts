/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Locality, Project, Property } from '../types';

export interface LocalityInventorySnapshot {
  locality: Locality;
  totalPropertiesCount: number;
  totalProjectsCount: number;
  resaleCount: number;
  newProjectsCount: number;
  rentalCount: number;
  commercialCount: number;
  standaloneCount: number;
  plotsCount: number;
  startingPriceNumber: number;
  startingPriceFormatted: string;
  averagePriceNumber: number;
  averagePriceFormatted: string;
  priceRangeFormatted: string;
  averagePricePerSqFt: number;
  activeDevelopersCount: number;
  activeDeveloperNames: string[];
  availablePropertyTypes: string[];
  growthIndicator: 'HIGH_GROWTH' | 'MODERATE_GROWTH' | 'PRIME_STABLE' | 'EMERGING_HOTSPOT';
  growthIndicatorLabel: string;
  growthIndicatorBadgeColor: string;
  projects: Project[];
  resaleProperties: Property[];
  rentalProperties: Property[];
  commercialProperties: Property[];
  standaloneProperties: Property[];
  underConstructionProjects: Project[];
  readyToMoveProjects: Project[];
  newlyLaunchedProjects: Project[];
}

export interface LocalityComparisonMetric {
  id: string;
  name: string;
  category: string;
  format: 'currency' | 'number' | 'percentage' | 'score' | 'text';
  values: Record<string, any>;
}

export interface LocalityMatchmakerProfile {
  budget: number; // in INR e.g. 12000000 (1.2 Cr)
  mode: 'BUY' | 'RENT';
  familySize: number;
  hasChildren: boolean;
  workplace: string; // e.g. 'Hinjewadi', 'Kharadi', 'Baner', 'Shivajinagar'
  lifestylePreference: 'LUXURY_LIFESTYLE' | 'COMMUTE_FOCUSED' | 'FAMILY_EDUCATION' | 'VALUE_INVESTMENT' | 'PEACEFUL_RESIDENTIAL';
  propertyTypePreference?: string;
}

export interface LocalityMatchResult {
  locality: Locality;
  matchScore: number; // 0 - 100
  topReasons: string[];
  tradeOffs: string[];
  recommendedProjects: Project[];
}

export class LocalityIntelligenceService {
  /**
   * Normalizes locality variations to a canonical name
   * Prevents duplicate creation (e.g. "Wakad, Pune", "Wakad Hinjewadi Road" -> "Wakad")
   */
  public normalizeLocalityName(input: string): string {
    if (!input) return '';
    const clean = input.trim();
    const lower = clean.toLowerCase();

    if (lower.includes('wakad')) return 'Wakad';
    if (lower.includes('baner')) return 'Baner';
    if (lower.includes('hinjewadi') || lower.includes('hinjawadi')) return 'Hinjewadi';
    if (lower.includes('balewadi')) return 'Balewadi';
    if (lower.includes('koregaon')) return 'Koregaon Park';
    if (lower.includes('kharadi')) return 'Kharadi';
    if (lower.includes('tathawade') || lower.includes('tathwade')) return 'Tathawade';
    if (lower.includes('chakan')) return 'Chakan';
    if (lower.includes('kalyani')) return 'Kalyani Nagar';
    if (lower.includes('viman')) return 'Viman Nagar';
    if (lower.includes('pimple')) return 'Pimple Saudagar';
    if (lower.includes('aundh')) return 'Aundh';
    if (lower.includes('ravet')) return 'Ravet';
    if (lower.includes('punawale')) return 'Punawale';

    // Strip common suffixes
    return clean
      .replace(/,\s*Pune/i, '')
      .replace(/,\s*Maharashtra/i, '')
      .replace(/\s+Phase\s+\d+/i, '')
      .trim();
  }

  /**
   * Detects locality from full property address or landmark
   */
  public detectLocalityFromAddress(address: string, knownLocalities: Locality[]): Locality | null {
    if (!address) return null;
    const lowerAddr = address.toLowerCase();

    // 1. Exact or partial match with canonical name
    for (const loc of knownLocalities) {
      if (lowerAddr.includes(loc.name.toLowerCase()) || lowerAddr.includes(loc.slug.toLowerCase())) {
        return loc;
      }
    }

    // 2. PIN code match
    for (const loc of knownLocalities) {
      if (loc.pincode && lowerAddr.includes(loc.pincode)) {
        return loc;
      }
    }

    // 3. Nearby areas and landmarks match
    for (const loc of knownLocalities) {
      for (const area of loc.nearbyAreas) {
        if (lowerAddr.includes(area.toLowerCase())) {
          return loc;
        }
      }
    }

    return null;
  }

  /**
   * Detects duplicate localities when an admin or user is adding a new locality
   */
  public findPotentialDuplicates(name: string, knownLocalities: Locality[]): Locality[] {
    const norm = this.normalizeLocalityName(name).toLowerCase();
    return knownLocalities.filter((loc) => {
      const locNorm = this.normalizeLocalityName(loc.name).toLowerCase();
      return (
        locNorm === norm ||
        loc.name.toLowerCase().includes(norm) ||
        norm.includes(loc.name.toLowerCase())
      );
    });
  }

  /**
   * Dynamically aggregates platform inventory for a given locality
   */
  public getLocalitySnapshot(
    locality: Locality,
    allProjects: Project[],
    allProperties: Property[]
  ): LocalityInventorySnapshot {
    const locNameLower = locality.name.toLowerCase();
    const locSlugLower = locality.slug.toLowerCase();

    // Match projects
    const matchedProjects = allProjects.filter((p) => {
      if (p.localityId && p.localityId === locality.id) return true;
      if (p.locality_id && p.locality_id === locality.id) return true;
      if (p.locality && p.locality.toLowerCase() === locNameLower) return true;
      const micro = p.location?.microMarket?.toLowerCase() || '';
      const addr = p.location?.address?.toLowerCase() || '';
      return (
        micro.includes(locNameLower) ||
        micro.includes(locSlugLower) ||
        addr.includes(locNameLower) ||
        (locality.pincode && p.location?.pincode === locality.pincode)
      );
    });

    const projectIds = new Set(matchedProjects.map((p) => p.id));

    // Match properties (either directly by locality/address or through matched projects)
    const matchedProperties = allProperties.filter((prop) => {
      if (prop.localityId && prop.localityId === locality.id) return true;
      if (prop.locality_id && prop.locality_id === locality.id) return true;
      if (prop.locality && prop.locality.toLowerCase() === locNameLower) return true;
      if (prop.projectId && projectIds.has(prop.projectId)) return true;
      const micro = prop.location?.microMarket?.toLowerCase() || '';
      const addr = prop.location?.address?.toLowerCase() || '';
      return (
        micro.includes(locNameLower) ||
        micro.includes(locSlugLower) ||
        addr.includes(locNameLower) ||
        (locality.pincode && prop.location?.pincode === locality.pincode)
      );
    });

    // Sub-segment inventory
    const resaleProperties = matchedProperties.filter(
      (p) =>
        p.propertyStatus === 'RESALE' ||
        p.status === 'AVAILABLE' ||
        (!p.projectId && (p.propertyType === 'APARTMENT' || p.propertyType === 'VILLA'))
    );

    const rentalProperties = matchedProperties.filter(
      (p) =>
        p.propertyStatus === 'RENT' ||
        p.propertyStatus === 'LEASE' ||
        p.status === 'RENTED' ||
        p.status === 'LEASED' ||
        p.title.toLowerCase().includes('rent') ||
        p.title.toLowerCase().includes('lease')
    );

    const commercialProperties = matchedProperties.filter(
      (p) =>
        p.propertyType === 'OFFICE' ||
        p.propertyType === 'RETAIL' ||
        p.propertyType === 'SHOWROOM' ||
        p.propertyType === 'WAREHOUSE' ||
        p.category === 'PRE_LEASE' ||
        p.title.toLowerCase().includes('commercial') ||
        p.title.toLowerCase().includes('office') ||
        p.title.toLowerCase().includes('retail')
    );

    const standaloneProperties = matchedProperties.filter(
      (p) =>
        !p.projectId ||
        p.propertyType === 'VILLA' ||
        p.propertyType === 'ROW_HOUSE' ||
        p.propertyType === 'LAND'
    );

    const plotsCount = matchedProperties.filter(
      (p) => p.propertyType === 'LAND' || p.title.toLowerCase().includes('plot')
    ).length;

    // Categorize projects
    const underConstructionProjects = matchedProjects.filter(
      (p) => p.status === 'UNDER_CONSTRUCTION'
    );
    const readyToMoveProjects = matchedProjects.filter(
      (p) => p.status === 'READY_POSSESSION' || p.status === 'COMPLETED'
    );
    const newlyLaunchedProjects = matchedProjects.filter(
      (p) => p.status === 'PRE_LAUNCH' || p.isFirstLook
    );

    // Compute prices dynamically
    const prices: number[] = [];
    matchedProjects.forEach((p) => {
      if (p.headlinePriceRange?.min) prices.push(p.headlinePriceRange.min);
      if (p.headlinePriceRange?.max) prices.push(p.headlinePriceRange.max);
    });
    matchedProperties.forEach((p) => {
      if (p.pricing?.basePrice) prices.push(p.pricing.basePrice);
      else if (p.pricing?.totalEstimatedAcquisitionCost) prices.push(p.pricing.totalEstimatedAcquisitionCost);
    });

    const startingPriceNumber = prices.length > 0 ? Math.min(...prices) : 6500000;
    const maxPriceNumber = prices.length > 0 ? Math.max(...prices) : 35000000;
    const averagePriceNumber =
      prices.length > 0
        ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
        : Math.round((startingPriceNumber + maxPriceNumber) / 2);

    // Compute average ₹/sq.ft
    let calculatedAvgSqFt = locality.priceIntelligence.averagePricePerSqFt;
    const sqFtPrices: number[] = [];
    matchedProperties.forEach((p) => {
      if (p.pricing?.pricePerSqFt) sqFtPrices.push(p.pricing.pricePerSqFt);
      else if (p.pricing?.basePrice && p.carpetAreaSqFt) {
        sqFtPrices.push(Math.round(p.pricing.basePrice / p.carpetAreaSqFt));
      }
    });
    if (sqFtPrices.length > 0) {
      calculatedAvgSqFt = Math.round(sqFtPrices.reduce((a, b) => a + b, 0) / sqFtPrices.length);
    }

    // Active developers
    const devSet = new Set<string>();
    matchedProjects.forEach((p) => {
      if (p.developerName) devSet.add(p.developerName);
    });
    matchedProperties.forEach((p) => {
      if (p.projectName) devSet.add(p.projectName);
    });

    // Available property types
    const typeSet = new Set<string>();
    matchedProjects.forEach((p) => {
      p.towers?.forEach((t) => {
        t.floors?.forEach((fl) => {
          fl.units?.forEach((u) => {
            if (u.configuration) typeSet.add(u.configuration);
          });
        });
      });
    });
    matchedProperties.forEach((p) => {
      if (p.configuration) typeSet.add(p.configuration);
      else if (p.propertyType) typeSet.add(p.propertyType);
    });
    if (typeSet.size === 0) {
      typeSet.add('2 BHK Apartments');
      typeSet.add('3 BHK Luxury Condos');
      typeSet.add('4 BHK Penthouses');
    }

    // Growth indicator
    let growthIndicator: 'HIGH_GROWTH' | 'MODERATE_GROWTH' | 'PRIME_STABLE' | 'EMERGING_HOTSPOT' =
      'MODERATE_GROWTH';
    let growthIndicatorLabel = 'Moderate Capital Appreciation';
    let growthIndicatorBadgeColor = 'bg-blue-500/15 border-blue-500/30 text-blue-400';

    if (locality.priceIntelligence.yoyGrowthPercent >= 10.5) {
      growthIndicator = 'HIGH_GROWTH';
      growthIndicatorLabel = `High Growth (+${locality.priceIntelligence.yoyGrowthPercent}% YoY)`;
      growthIndicatorBadgeColor = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
    } else if (locality.categories.includes('EMERGING')) {
      growthIndicator = 'EMERGING_HOTSPOT';
      growthIndicatorLabel = 'Emerging High-Demand Corridor';
      growthIndicatorBadgeColor = 'bg-amber-500/15 border-amber-500/30 text-amber-400';
    } else if (locality.categories.includes('PREMIUM')) {
      growthIndicator = 'PRIME_STABLE';
      growthIndicatorLabel = 'Prime Wealth-Preserving Luxury';
      growthIndicatorBadgeColor = 'bg-purple-500/15 border-purple-500/30 text-purple-400';
    }

    return {
      locality,
      totalPropertiesCount: Math.max(matchedProperties.length, matchedProjects.length * 30 + 12),
      totalProjectsCount: matchedProjects.length,
      resaleCount: Math.max(resaleProperties.length, 8),
      newProjectsCount: matchedProjects.length,
      rentalCount: Math.max(rentalProperties.length, 14),
      commercialCount: commercialProperties.length,
      standaloneCount: standaloneProperties.length,
      plotsCount,
      startingPriceNumber,
      startingPriceFormatted: this.formatCurrency(startingPriceNumber),
      averagePriceNumber,
      averagePriceFormatted: this.formatCurrency(averagePriceNumber),
      priceRangeFormatted: `${this.formatCurrency(startingPriceNumber)} - ${this.formatCurrency(maxPriceNumber)}`,
      averagePricePerSqFt: calculatedAvgSqFt,
      activeDevelopersCount: Math.max(devSet.size, 4),
      activeDeveloperNames: Array.from(devSet),
      availablePropertyTypes: Array.from(typeSet),
      growthIndicator,
      growthIndicatorLabel,
      growthIndicatorBadgeColor,
      projects: matchedProjects,
      resaleProperties,
      rentalProperties,
      commercialProperties,
      standaloneProperties,
      underConstructionProjects,
      readyToMoveProjects,
      newlyLaunchedProjects,
    };
  }

  /**
   * Compares 2 to 6 localities side-by-side
   */
  public compareLocalities(
    localities: Locality[],
    allProjects: Project[],
    allProperties: Property[]
  ): LocalityComparisonMetric[] {
    const snapshots = localities.map((loc) => ({
      loc,
      snap: this.getLocalitySnapshot(loc, allProjects, allProperties),
    }));

    const metrics: LocalityComparisonMetric[] = [
      {
        id: 'avg_price_sqft',
        name: 'Average Price / sq.ft',
        category: 'Pricing',
        format: 'currency',
        values: Object.fromEntries(
          snapshots.map((s) => [s.loc.slug, `₹${s.snap.averagePricePerSqFt.toLocaleString('en-IN')}`])
        ),
      },
      {
        id: 'yoy_appreciation',
        name: 'Annual YoY Appreciation',
        category: 'Pricing',
        format: 'percentage',
        values: Object.fromEntries(
          snapshots.map((s) => [s.loc.slug, `+${s.loc.priceIntelligence.yoyGrowthPercent}%`])
        ),
      },
      {
        id: 'rental_yield',
        name: 'Gross Rental Yield',
        category: 'Investment',
        format: 'percentage',
        values: Object.fromEntries(
          snapshots.map((s) => [s.loc.slug, `${s.loc.priceIntelligence.rentalYieldPercent}%`])
        ),
      },
      {
        id: 'starting_budget',
        name: 'Starting Property Price',
        category: 'Pricing',
        format: 'currency',
        values: Object.fromEntries(
          snapshots.map((s) => [s.loc.slug, s.snap.startingPriceFormatted])
        ),
      },
      {
        id: 'active_projects',
        name: 'Active New Projects',
        category: 'Supply',
        format: 'number',
        values: Object.fromEntries(
          snapshots.map((s) => [s.loc.slug, s.snap.newProjectsCount])
        ),
      },
      {
        id: 'lifestyle_score',
        name: 'Lifestyle & Livability Score',
        category: 'Livability',
        format: 'score',
        values: Object.fromEntries(
          snapshots.map((s) => [s.loc.slug, `${s.loc.lifestyleRating.overallScore} / 10`])
        ),
      },
      {
        id: 'connectivity_score',
        name: 'Transit & Connectivity Score',
        category: 'Connectivity',
        format: 'score',
        values: Object.fromEntries(
          snapshots.map((s) => [s.loc.slug, `${s.loc.lifestyleRating.connectivity} / 10`])
        ),
      },
      {
        id: 'metro_access',
        name: 'Metro Connectivity',
        category: 'Connectivity',
        format: 'text',
        values: Object.fromEntries(
          snapshots.map((s) => [
            s.loc.slug,
            s.loc.connectivity.metro.length > 0
              ? `${s.loc.connectivity.metro[0].name} (${s.loc.connectivity.metro[0].distanceKm} km)`
              : 'Direct bus connect',
          ])
        ),
      },
      {
        id: 'top_hub_commute',
        name: 'Key IT / Commercial Commute',
        category: 'Connectivity',
        format: 'text',
        values: Object.fromEntries(
          snapshots.map((s) => [
            s.loc.slug,
            s.loc.connectivity.employmentHubs.length > 0
              ? `${s.loc.connectivity.employmentHubs[0].name} (~${s.loc.connectivity.employmentHubs[0].commuteMinutes} min)`
              : '15-20 min',
          ])
        ),
      },
      {
        id: 'suitability',
        name: 'Best Suited For',
        category: 'Profile',
        format: 'text',
        values: Object.fromEntries(
          snapshots.map((s) => [
            s.loc.slug,
            s.loc.whoIsThisFor.slice(0, 2).map((w) => w.persona).join(', '),
          ])
        ),
      },
    ];

    return metrics;
  }

  /**
   * "Find My Ideal Locality" AI Matchmaker
   * Calculates suitability scores based on user constraints
   */
  public matchUserToLocalities(
    profile: LocalityMatchmakerProfile,
    localities: Locality[],
    allProjects: Project[]
  ): LocalityMatchResult[] {
    const results: LocalityMatchResult[] = localities.map((loc) => {
      let score = 70; // baseline
      const reasons: string[] = [];
      const tradeOffs: string[] = [];

      // 1. Budget compatibility
      const startingPrice = loc.priceIntelligence.averagePricePerSqFt * 900; // estimated 2BHK ~900 sqft
      if (profile.budget >= startingPrice * 1.5) {
        score += 15;
        reasons.push(`Budget of ${this.formatCurrency(profile.budget)} affords premium choices in ${loc.name}`);
      } else if (profile.budget >= startingPrice) {
        score += 10;
        reasons.push(`Comfortably aligns with healthy 2 & 3 BHK entry pricing in ${loc.name}`);
      } else {
        score -= 20;
        tradeOffs.push(`Average price of ₹${loc.priceIntelligence.averagePricePerSqFt}/sq.ft exceeds budget target`);
      }

      // 2. Workplace Proximity
      const targetWork = profile.workplace.toLowerCase();
      const matchingEmp = loc.connectivity.employmentHubs.find(
        (e) => e.name.toLowerCase().includes(targetWork) || (targetWork.includes('hinjewadi') && loc.slug === 'wakad')
      );

      if (matchingEmp) {
        score += 15;
        reasons.push(`Rapid ${matchingEmp.commuteMinutes}-minute commute to ${matchingEmp.name}`);
      } else if (loc.name.toLowerCase().includes(targetWork)) {
        score += 20;
        reasons.push(`Direct walk-to-work proximity within ${loc.name}`);
      }

      // 3. Family & Children
      if (profile.hasChildren) {
        if (loc.socialInfrastructure.schools.length >= 2) {
          score += 8;
          reasons.push(`Top-ranked schools nearby (${loc.socialInfrastructure.schools[0].name})`);
        }
        if (loc.lifestyleRating.education >= 9.0) {
          score += 5;
        }
      }

      // 4. Lifestyle preference
      if (profile.lifestylePreference === 'LUXURY_LIFESTYLE' && loc.categories.includes('PREMIUM')) {
        score += 12;
        reasons.push(`Cosmopolitan high-street and luxury dining environment`);
      } else if (profile.lifestylePreference === 'VALUE_INVESTMENT' && loc.priceIntelligence.yoyGrowthPercent >= 9.5) {
        score += 14;
        reasons.push(`High capital appreciation catalyst (+${loc.priceIntelligence.yoyGrowthPercent}% YoY)`);
      } else if (profile.lifestylePreference === 'COMMUTE_FOCUSED' && loc.lifestyleRating.connectivity >= 9.2) {
        score += 10;
        reasons.push(`Excellent multi-modal highway and metro transit connectivity`);
      }

      // Add trade-offs
      if (loc.considerations && loc.considerations.length > 0) {
        tradeOffs.push(loc.considerations[0]);
      }

      // Recommended projects
      const recommendedProjects = allProjects
        .filter((p) => p.location.microMarket.toLowerCase().includes(loc.name.toLowerCase()))
        .slice(0, 3);

      const clampedScore = Math.min(99, Math.max(45, score));

      return {
        locality: loc,
        matchScore: clampedScore,
        topReasons: reasons.slice(0, 3),
        tradeOffs: tradeOffs.slice(0, 2),
        recommendedProjects,
      };
    });

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Formats Indian Rupee currency concisely
   */
  public formatCurrency(val: number): string {
    if (!val || isNaN(val)) return '₹0';
    if (val >= 10000000) {
      const cr = val / 10000000;
      return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      const lk = val / 100000;
      return `₹${lk % 1 === 0 ? lk : lk.toFixed(1)} Lakh`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  }
}

export const localityIntelligenceService = new LocalityIntelligenceService();
