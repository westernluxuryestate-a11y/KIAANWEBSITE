/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Property, Unit, UnifiedSearchFilter } from '../types';
import { globalKiaanStore } from './store';

export interface SearchFacetCounts {
  microMarkets: Record<string, number>;
  configurations: Record<string, number>;
  facings: Record<string, number>;
  budgetTiers: {
    under1_5Cr: number;
    from1_5To2_5Cr: number;
    from2_5To4Cr: number;
    above4Cr: number;
  };
  totalMatchingProjects: number;
  totalMatchingUnits: number;
}

export interface UnifiedSearchResult {
  filteredProjects: Project[];
  filteredUnits: Unit[];
  facets: SearchFacetCounts;
  appliedFilter: UnifiedSearchFilter;
}

export function executeUnifiedSearch(
  projects: Project[],
  units: Unit[],
  filter: UnifiedSearchFilter
): UnifiedSearchResult {
  const queryLower = (filter.query || '').trim().toLowerCase();

  // 1. Filter Projects
  let matchedProjects = projects.filter((project) => {
    // Text search query
    if (queryLower) {
      const matchName = project.name.toLowerCase().includes(queryLower);
      const matchMarket = project.location.microMarket.toLowerCase().includes(queryLower);
      const matchAddress = project.location.address.toLowerCase().includes(queryLower);
      const matchArch = project.architecturalHighlights.some((h) => h.toLowerCase().includes(queryLower));
      const matchConfig = project.configurations.some((c) => c.toLowerCase().includes(queryLower));
      if (!matchName && !matchMarket && !matchAddress && !matchArch && !matchConfig) {
        return false;
      }
    }

    // Micro-Market
    if (filter.microMarket && filter.microMarket !== 'ALL') {
      if (!project.location.microMarket.toLowerCase().includes(filter.microMarket.toLowerCase())) {
        return false;
      }
    }

    // Budget range check
    if (filter.minPrice > 0 && project.headlinePriceRange.max < filter.minPrice) {
      return false;
    }
    if (filter.maxPrice < 100000000 && project.headlinePriceRange.min > filter.maxPrice) {
      return false;
    }

    // Configuration
    if (filter.configurations && filter.configurations.length > 0) {
      const hasConfig = filter.configurations.some((cfg) =>
        project.configurations.some((pCfg) => pCfg.toLowerCase().includes(cfg.toLowerCase()))
      );
      if (!hasConfig) return false;
    }

    // RERA verified only
    if (filter.reraVerifiedOnly && project.reraRecord.status !== 'REGISTERED') {
      return false;
    }

    // Amenities
    if (filter.amenities && filter.amenities.length > 0) {
      const projectAmenityNames = (project.amenities || []).map((a) => a.name.toLowerCase());
      const hasAmenities = filter.amenities.every((req) =>
        projectAmenityNames.some((pAm) => pAm.includes(req.toLowerCase()))
      );
      if (!hasAmenities) return false;
    }

    return true;
  });

  // 2. Filter Units
  let matchedUnits = units.filter((unit) => {
    // Match Project parent filter
    const project = projects.find((p) => p.id === unit.projectId);
    if (!project) return false;

    // Text search
    if (queryLower) {
      const matchUnit = unit.unitNumber.toLowerCase().includes(queryLower);
      const matchConfig = unit.configuration.toLowerCase().includes(queryLower);
      const matchView = unit.orientationView.toLowerCase().includes(queryLower);
      const matchProj = unit.projectName.toLowerCase().includes(queryLower);
      if (!matchUnit && !matchConfig && !matchView && !matchProj) {
        return false;
      }
    }

    // Micro-Market
    if (filter.microMarket && filter.microMarket !== 'ALL') {
      if (!project.location.microMarket.toLowerCase().includes(filter.microMarket.toLowerCase())) {
        return false;
      }
    }

    // Facing
    if (filter.facing && filter.facing !== 'ALL') {
      if (unit.facing !== filter.facing) return false;
    }

    // Price
    if (filter.minPrice > 0 && unit.pricing.basePrice < filter.minPrice) return false;
    if (filter.maxPrice < 100000000 && unit.pricing.basePrice > filter.maxPrice) return false;

    // Min Carpet Area
    if (filter.minCarpetAreaSqFt && unit.carpetAreaSqFt < filter.minCarpetAreaSqFt) return false;

    // Configuration
    if (filter.configurations && filter.configurations.length > 0) {
      const hasConfig = filter.configurations.some((cfg) =>
        unit.configuration.toLowerCase().includes(cfg.toLowerCase())
      );
      if (!hasConfig) return false;
    }

    return true;
  });

  // 3. Sorting
  if (filter.sortOrder === 'PRICE_LOW_HIGH') {
    matchedProjects.sort((a, b) => a.headlinePriceRange.min - b.headlinePriceRange.min);
    matchedUnits.sort((a, b) => a.pricing.basePrice - b.pricing.basePrice);
  } else if (filter.sortOrder === 'PRICE_HIGH_LOW') {
    matchedProjects.sort((a, b) => b.headlinePriceRange.max - a.headlinePriceRange.max);
    matchedUnits.sort((a, b) => b.pricing.basePrice - a.pricing.basePrice);
  } else if (filter.sortOrder === 'CARPET_AREA_HIGH_LOW') {
    matchedProjects.sort((a, b) => b.carpetAreaRangeSqFt.max - a.carpetAreaRangeSqFt.max);
    matchedUnits.sort((a, b) => b.carpetAreaSqFt - a.carpetAreaSqFt);
  }

  // 4. Calculate Facet Counts across full catalog
  const facetCounts: SearchFacetCounts = {
    microMarkets: {},
    configurations: {},
    facings: {},
    budgetTiers: {
      under1_5Cr: 0,
      from1_5To2_5Cr: 0,
      from2_5To4Cr: 0,
      above4Cr: 0,
    },
    totalMatchingProjects: matchedProjects.length,
    totalMatchingUnits: matchedUnits.length,
  };

  units.forEach((u) => {
    // Facings
    facetCounts.facings[u.facing] = (facetCounts.facings[u.facing] || 0) + 1;

    // Configurations
    facetCounts.configurations[u.configuration] = (facetCounts.configurations[u.configuration] || 0) + 1;

    // Budget
    if (u.pricing.basePrice < 15000000) facetCounts.budgetTiers.under1_5Cr++;
    else if (u.pricing.basePrice < 25000000) facetCounts.budgetTiers.from1_5To2_5Cr++;
    else if (u.pricing.basePrice < 40000000) facetCounts.budgetTiers.from2_5To4Cr++;
    else facetCounts.budgetTiers.above4Cr++;
  });

  projects.forEach((p) => {
    facetCounts.microMarkets[p.location.microMarket] = (facetCounts.microMarkets[p.location.microMarket] || 0) + 1;
  });

  return {
    filteredProjects: matchedProjects,
    filteredUnits: matchedUnits,
    facets: facetCounts,
    appliedFilter: filter,
  };
}
