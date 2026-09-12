/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KIAAN REALTY ENTERPRISE LOCATION INTELLIGENCE PLATFORM (LIP)
 * Single Source of Truth (SSOT) Canonical Location Intelligence Engine
 */

export type LocationType =
  | 'STATE'
  | 'DISTRICT'
  | 'TALUKA'
  | 'MUNICIPAL_CORP'
  | 'ZONE'
  | 'WARD'
  | 'LOCALITY'
  | 'SUBLOCALITY'
  | 'ROAD'
  | 'LANDMARK'
  | 'SOCIETY'
  | 'BUILDING'
  | 'PROPERTY';

export type VerificationStatus = 'APPROVED' | 'PENDING_REVIEW' | 'DRAFT' | 'REJECTED';

export type LocationSource =
  | 'GOV_GAZETTEER'
  | 'MAHARERA'
  | 'IGR_MAHARASHTRA'
  | 'GOOGLE_PLACES'
  | 'OPENSTREETMAP'
  | 'PMC_GIS'
  | 'PCMC_GIS'
  | 'PMRDA_GIS'
  | 'MANUAL_CURATION';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface GeoPolygon {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][]; // [ [ [lng, lat], ... ] ]
}

export interface LocationMasterRecord {
  id: string; // Canonical Location ID e.g. "LOC-BANER-552"
  uuid: string;
  parentId: string | null; // e.g. "WARD-PMC-09"
  hierarchyPath: string; // e.g. "/MH/PUN/HAV/PMC/WZ/W09/LOC-BANER-552"
  locationType: LocationType;
  locationLevel: number; // 1 (State) to 12 (Property)
  nameEn: string;
  nameMr: string; // Marathi (Devanagari)
  nameHi: string; // Hindi (Devanagari)
  googleName: string;
  googlePlaceId?: string;
  osmId?: string;
  latitude: number;
  longitude: number;
  polygon?: GeoPolygon;
  geohash: string;
  h3Index?: string;
  areaSqKm: number;
  pincode: string;
  taluka: string;
  district: string;
  state: string;
  municipalCorporation: string; // PMC, PCMC, PMRDA, etc.
  ward: string;
  zone: string;
  slug: string;
  seoPath: string; // e.g. "/pune/baner"
  displayName: string;
  alternateNames: string[];
  popularName: string;
  verificationStatus: VerificationStatus;
  source: LocationSource;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Metadata and stats
  reraRegisteredProjectCount?: number;
  avgPricePerSqFt?: number;
  nearestMetroStation?: string;
  nearestHighway?: string;
  keyPois?: {
    name: string;
    category: 'METRO' | 'HIGHWAY' | 'IT_PARK' | 'HOSPITAL' | 'SCHOOL' | 'MALL';
    distanceKm: number;
  }[];
}

export interface LocationAliasRecord {
  id: string;
  locationId: string; // Foreign Key to LocationMasterRecord.id
  aliasName: string;
  language: 'en' | 'mr' | 'hi' | 'phonetic';
  aliasType:
    | 'SPELLING_VARIATION'
    | 'LOCAL_NAME'
    | 'ROAD_REFERENCE'
    | 'ABBREVIATION'
    | 'HISTORICAL_NAME'
    | 'TYPO'
    | 'SEARCH_SYNONYM';
  confidenceScore: number; // 0.0 to 1.0
  isPrimaryRedirect: boolean; // 301 canonical redirect
  createdAt: string;
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  confidence: number; // 0 to 100
  matchedLocation?: LocationMasterRecord;
  reason?: string;
  candidates: {
    location: LocationMasterRecord;
    similarityScore: number;
    matchType: 'EXACT_PLACE_ID' | 'EXACT_NAME' | 'ALIAS_MATCH' | 'SPATIAL_PROXIMITY' | 'FUZZY_STRING';
    distanceMeters?: number;
  }[];
}

export interface LocationCreationPayload {
  nameEn: string;
  nameMr?: string;
  nameHi?: string;
  parentId: string;
  locationType: LocationType;
  pincode: string;
  latitude: number;
  longitude: number;
  googlePlaceId?: string;
  municipalCorporation: string;
  zone: string;
  ward: string;
  taluka: string;
  district: string;
  state: string;
  popularName?: string;
  alternateNames?: string[];
  source?: LocationSource;
  polygon?: GeoPolygon;
  areaSqKm?: number;
  notes?: string;
}

// ============================================================
// CANONICAL HIERARCHY REFERENCE NODES (STATE -> WARD)
// ============================================================
export const CANONICAL_PARENT_NODES: Record<string, { id: string; name: string; type: LocationType; path: string }> = {
  'STATE-MH': { id: 'STATE-MH', name: 'Maharashtra', type: 'STATE', path: '/MH' },
  'DIST-PUN': { id: 'DIST-PUN', name: 'Pune District', type: 'DISTRICT', path: '/MH/PUN' },
  'TAL-HAV': { id: 'TAL-HAV', name: 'Haveli Taluka', type: 'TALUKA', path: '/MH/PUN/HAV' },
  'TAL-MUL': { id: 'TAL-MUL', name: 'Mulshi Taluka', type: 'TALUKA', path: '/MH/PUN/MUL' },
  'CORP-PMC': { id: 'CORP-PMC', name: 'Pune Municipal Corporation (PMC)', type: 'MUNICIPAL_CORP', path: '/MH/PUN/HAV/PMC' },
  'CORP-PCMC': { id: 'CORP-PCMC', name: 'Pimpri-Chinchwad Municipal Corporation (PCMC)', type: 'MUNICIPAL_CORP', path: '/MH/PUN/HAV/PCMC' },
  'CORP-PMRDA': { id: 'CORP-PMRDA', name: 'Pune Metropolitan Region Development Authority (PMRDA)', type: 'MUNICIPAL_CORP', path: '/MH/PUN/MUL/PMRDA' },
  'ZONE-WEST': { id: 'ZONE-WEST', name: 'West Pune Zone', type: 'ZONE', path: '/MH/PUN/HAV/PMC/WEST' },
  'ZONE-EAST': { id: 'ZONE-EAST', name: 'East Pune Zone', type: 'ZONE', path: '/MH/PUN/HAV/PMC/EAST' },
  'ZONE-CENTRAL': { id: 'ZONE-CENTRAL', name: 'Central Pune Zone', type: 'ZONE', path: '/MH/PUN/HAV/PMC/CENTRAL' },
  'ZONE-PCMC-NORTH': { id: 'ZONE-PCMC-NORTH', name: 'North PCMC Zone', type: 'ZONE', path: '/MH/PUN/HAV/PCMC/NORTH' },
  'WARD-PMC-09': { id: 'WARD-PMC-09', name: 'Ward No. 09 (Baner - Balewadi)', type: 'WARD', path: '/MH/PUN/HAV/PMC/WEST/W09' },
  'WARD-PMC-14': { id: 'WARD-PMC-14', name: 'Ward No. 14 (Aundh - Pashan)', type: 'WARD', path: '/MH/PUN/HAV/PMC/WEST/W14' },
  'WARD-PMC-26': { id: 'WARD-PMC-26', name: 'Ward No. 26 (Kharadi - Chandan Nagar)', type: 'WARD', path: '/MH/PUN/HAV/PMC/EAST/W26' },
  'WARD-PMC-21': { id: 'WARD-PMC-21', name: 'Ward No. 21 (Koregaon Park - Ghorpadi)', type: 'WARD', path: '/MH/PUN/HAV/PMC/CENTRAL/W21' },
  'WARD-PMC-22': { id: 'WARD-PMC-22', name: 'Ward No. 22 (Kalyani Nagar - Vadgaon Sheri)', type: 'WARD', path: '/MH/PUN/HAV/PMC/EAST/W22' },
  'WARD-PMC-11': { id: 'WARD-PMC-11', name: 'Ward No. 11 (Kothrud - Bavdhan)', type: 'WARD', path: '/MH/PUN/HAV/PMC/WEST/W11' },
  'WARD-PCMC-25': { id: 'WARD-PCMC-25', name: 'Ward No. 25 (Wakad - Pimple Saudagar)', type: 'WARD', path: '/MH/PUN/HAV/PCMC/NORTH/W25' },
  'WARD-PMRDA-01': { id: 'WARD-PMRDA-01', name: 'PMRDA Sector 1 (Hinjewadi Tech Corridor)', type: 'WARD', path: '/MH/PUN/MUL/PMRDA/SEC01' },
};

// ============================================================
// SEED CANONICAL LOCATION MASTER RECORDS
// ============================================================
export const SEED_CANONICAL_LOCATIONS: LocationMasterRecord[] = [
  {
    id: 'LOC-BANER-552',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000552',
    parentId: 'WARD-PMC-09',
    hierarchyPath: '/MH/PUN/HAV/PMC/WEST/W09/LOC-BANER-552',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Baner',
    nameMr: 'बाणेर',
    nameHi: 'बानेर',
    googleName: 'Baner, Pune, Maharashtra 411045, India',
    googlePlaceId: 'ChIJq_j3X6jBwjsR2T_8qZfTj0M',
    osmId: 'relation/7892341',
    latitude: 18.5596,
    longitude: 73.7799,
    geohash: 'te7u8k',
    h3Index: '8860145b23fffff',
    areaSqKm: 11.45,
    pincode: '411045',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PMC (Pune Municipal Corporation)',
    ward: 'Ward No. 09 (Baner - Balewadi)',
    zone: 'West Pune Zone',
    slug: 'baner',
    seoPath: '/pune/baner',
    displayName: 'Baner, West Pune (PMC)',
    alternateNames: ['Baner Road', 'Baner Gaon', 'Baner Village', 'Baner West', 'Baner Hill', 'Veerbhadra Nagar'],
    popularName: 'Baner Luxury & High-Street Corridor',
    verificationStatus: 'APPROVED',
    source: 'PMC_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 84,
    avgPricePerSqFt: 11850,
    nearestMetroStation: 'Baner Phata Metro Station (Line 3)',
    nearestHighway: 'NH-48 (Mumbai-Bengaluru Western Bypass)',
    keyPois: [
      { name: 'Balewadi High Street Retail', category: 'MALL', distanceKm: 0.8 },
      { name: 'Jupiter Hospital Baner', category: 'HOSPITAL', distanceKm: 1.4 },
      { name: 'The Orchid International School', category: 'SCHOOL', distanceKm: 1.1 },
      { name: 'Baner Phata Metro Hub', category: 'METRO', distanceKm: 0.6 },
    ],
    polygon: {
      type: 'Polygon',
      coordinates: [
        [
          [73.765, 18.572],
          [73.792, 18.574],
          [73.801, 18.548],
          [73.774, 18.545],
          [73.765, 18.572],
        ],
      ],
    },
  },
  {
    id: 'LOC-WAKAD-553',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000553',
    parentId: 'WARD-PCMC-25',
    hierarchyPath: '/MH/PUN/HAV/PCMC/NORTH/W25/LOC-WAKAD-553',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Wakad',
    nameMr: 'वाकड',
    nameHi: 'वाकड़',
    googleName: 'Wakad, Pimpri-Chinchwad, Maharashtra 411057, India',
    googlePlaceId: 'ChIJz2v3eL_BwjsRe-hQk90W55E',
    osmId: 'relation/7892342',
    latitude: 18.5987,
    longitude: 73.7689,
    geohash: 'te7u9m',
    h3Index: '8860145b25fffff',
    areaSqKm: 12.8,
    pincode: '411057',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PCMC (Pimpri-Chinchwad Municipal Corporation)',
    ward: 'Ward No. 25 (Wakad - Pimple Saudagar)',
    zone: 'North PCMC Zone',
    slug: 'wakad',
    seoPath: '/pune/wakad',
    displayName: 'Wakad, PCMC (Hinjewadi Gateway)',
    alternateNames: ['Wakad Chowk', 'Wakad Gaon', 'Kaspate Vasti', 'Datta Mandir Road', 'Shankar Kalat Nagar', 'Bhumkar Chowk'],
    popularName: 'Wakad IT-Expressway Growth Hub',
    verificationStatus: 'APPROVED',
    source: 'PCMC_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 112,
    avgPricePerSqFt: 8650,
    nearestMetroStation: 'Wakad Chowk Metro Station (Line 3)',
    nearestHighway: 'Mumbai-Pune Expressway Confluence',
    keyPois: [
      { name: 'Phoenix Mall of the Millennium', category: 'MALL', distanceKm: 1.2 },
      { name: 'Lifepoint Multispecialty Hospital', category: 'HOSPITAL', distanceKm: 0.9 },
      { name: 'Indira National School', category: 'SCHOOL', distanceKm: 1.5 },
      { name: 'Wakad Chowk Metro Station', category: 'METRO', distanceKm: 0.7 },
    ],
  },
  {
    id: 'LOC-HINJEWADI-301',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000301',
    parentId: 'WARD-PMRDA-01',
    hierarchyPath: '/MH/PUN/MUL/PMRDA/SEC01/LOC-HINJEWADI-301',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Hinjewadi',
    nameMr: 'हिंजवडी',
    nameHi: 'हिंजेवाड़ी',
    googleName: 'Hinjawadi, Pune, Maharashtra 411057, India',
    googlePlaceId: 'ChIJh922YavBwjsRf_n9Z4t8k90',
    osmId: 'relation/7892343',
    latitude: 18.5913,
    longitude: 73.7389,
    geohash: 'te7u94',
    h3Index: '8860145b27fffff',
    areaSqKm: 28.5,
    pincode: '411057',
    taluka: 'Mulshi',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PMRDA (Pune Metropolitan Region)',
    ward: 'PMRDA Sector 1 (Hinjewadi Tech Corridor)',
    zone: 'West PMRDA Zone',
    slug: 'hinjewadi',
    seoPath: '/pune/hinjewadi',
    displayName: 'Hinjewadi Rajiv Gandhi Infotech Park (PMRDA)',
    alternateNames: ['Hinjawadi', 'Hinjewadi Phase 1', 'Hinjewadi Phase 2', 'Hinjewadi Phase 3', 'Maan Hinjewadi', 'RG Infotech Park'],
    popularName: 'Hinjewadi Silicon Hub of Maharashtra',
    verificationStatus: 'APPROVED',
    source: 'PMRDA_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 96,
    avgPricePerSqFt: 7950,
    nearestMetroStation: 'Megapolis Hinjewadi Metro Terminal',
    nearestHighway: 'Pune Ring Road & Expressway Connector',
    keyPois: [
      { name: 'Rajiv Gandhi Infotech Park Phase 1 & 2', category: 'IT_PARK', distanceKm: 0.5 },
      { name: 'Ruby Hall Clinic Hinjewadi', category: 'HOSPITAL', distanceKm: 1.8 },
      { name: 'Pawar Public School', category: 'SCHOOL', distanceKm: 2.1 },
      { name: 'Hinjewadi Metro Line 3 Hub', category: 'METRO', distanceKm: 0.4 },
    ],
  },
  {
    id: 'LOC-KHARADI-102',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000102',
    parentId: 'WARD-PMC-26',
    hierarchyPath: '/MH/PUN/HAV/PMC/EAST/W26/LOC-KHARADI-102',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Kharadi',
    nameMr: 'खराडी',
    nameHi: 'खराड़ी',
    googleName: 'Kharadi, Pune, Maharashtra 411014, India',
    googlePlaceId: 'ChIJzWv686TBwjsR3X_9v417a8c',
    osmId: 'relation/7892344',
    latitude: 18.5514,
    longitude: 73.9348,
    geohash: 'te7v2k',
    h3Index: '8860145b29fffff',
    areaSqKm: 14.2,
    pincode: '411014',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PMC (Pune Municipal Corporation)',
    ward: 'Ward No. 26 (Kharadi - Chandan Nagar)',
    zone: 'East Pune Zone',
    slug: 'kharadi',
    seoPath: '/pune/kharadi',
    displayName: 'Kharadi, East Pune (World Trade Centre / EON Free Zone)',
    alternateNames: ['EON Free Zone', 'World Trade Center Kharadi', 'Kharadi Bypass', 'Chandan Nagar', 'Zensar IT Park', 'Upper Kharadi'],
    popularName: 'Kharadi Global Financial & IT Waterfront',
    verificationStatus: 'APPROVED',
    source: 'PMC_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 78,
    avgPricePerSqFt: 10450,
    nearestMetroStation: 'Ramwadi Metro Station & Kharadi Extension',
    nearestHighway: 'Pune-Ahmednagar Highway & Riverside Road',
    keyPois: [
      { name: 'World Trade Center (WTC) Pune', category: 'IT_PARK', distanceKm: 0.6 },
      { name: 'EON Free Zone SEZ', category: 'IT_PARK', distanceKm: 0.8 },
      { name: 'Manipal Hospital Kharadi', category: 'HOSPITAL', distanceKm: 1.5 },
      { name: 'The Orbis International School', category: 'SCHOOL', distanceKm: 1.2 },
    ],
  },
  {
    id: 'LOC-BALEWADI-104',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000104',
    parentId: 'WARD-PMC-09',
    hierarchyPath: '/MH/PUN/HAV/PMC/WEST/W09/LOC-BALEWADI-104',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Balewadi',
    nameMr: 'बालेवाडी',
    nameHi: 'बालेवाड़ी',
    googleName: 'Balewadi, Pune, Maharashtra 411045, India',
    googlePlaceId: 'ChIJVf_3a6TBwjsR3B_7k29m54a',
    osmId: 'relation/7892345',
    latitude: 18.5756,
    longitude: 73.7712,
    geohash: 'te7u9s',
    h3Index: '8860145b2bfffff',
    areaSqKm: 8.9,
    pincode: '411045',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PMC (Pune Municipal Corporation)',
    ward: 'Ward No. 09 (Baner - Balewadi)',
    zone: 'West Pune Zone',
    slug: 'balewadi',
    seoPath: '/pune/balewadi',
    displayName: 'Balewadi, West Pune (Balewadi High Street Corridor)',
    alternateNames: ['Balewadi High Street', 'Balewadi Stadium', 'Balewadi Gaon', 'Balewadi Phata', 'Shree Shiv Chhatrapati Sports Complex'],
    popularName: 'Balewadi High Street & Sports Hub',
    verificationStatus: 'APPROVED',
    source: 'PMC_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 65,
    avgPricePerSqFt: 11400,
    nearestMetroStation: 'Balewadi Stadium Metro Station',
    nearestHighway: 'Mumbai-Bengaluru Highway',
    keyPois: [
      { name: 'Balewadi High Street Dining Boulevard', category: 'MALL', distanceKm: 0.3 },
      { name: 'Shiv Chhatrapati National Stadium', category: 'MALL', distanceKm: 0.9 },
      { name: 'Jupiter Hospital', category: 'HOSPITAL', distanceKm: 2.1 },
      { name: 'Balewadi Metro Station', category: 'METRO', distanceKm: 0.5 },
    ],
  },
  {
    id: 'LOC-KOREGAON-PARK-001',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000001',
    parentId: 'WARD-PMC-21',
    hierarchyPath: '/MH/PUN/HAV/PMC/CENTRAL/W21/LOC-KOREGAON-PARK-001',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Koregaon Park',
    nameMr: 'कोरेगाव पार्क',
    nameHi: 'कोरेगांव पार्क',
    googleName: 'Koregaon Park, Pune, Maharashtra 411001, India',
    googlePlaceId: 'ChIJff_769_BwjsRd3_5k69m71b',
    osmId: 'relation/7892346',
    latitude: 18.5362,
    longitude: 73.894,
    geohash: 'te7ufr',
    h3Index: '8860145b2dfffff',
    areaSqKm: 5.8,
    pincode: '411001',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PMC (Pune Municipal Corporation)',
    ward: 'Ward No. 21 (Koregaon Park - Ghorpadi)',
    zone: 'Central Pune Zone',
    slug: 'koregaon-park',
    seoPath: '/pune/koregaon-park',
    displayName: 'Koregaon Park, Central Pune (Ultra-Luxury & Consulates)',
    alternateNames: ['KP Pune', 'North Main Road', 'South Main Road', 'Lane 1 to Lane 7 Koregaon Park', 'Osho International Commune'],
    popularName: 'Koregaon Park Ultra-Luxury Enclave',
    verificationStatus: 'APPROVED',
    source: 'PMC_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 32,
    avgPricePerSqFt: 18500,
    nearestMetroStation: 'Bund Garden Metro Station',
    nearestHighway: 'Mangaon-Pune Highway / Airport Road',
    keyPois: [
      { name: 'Osho Meditation Resort & Park', category: 'LIFESTYLE' as any, distanceKm: 0.4 },
      { name: 'Je hangir Hospital', category: 'HOSPITAL', distanceKm: 2.2 },
      { name: 'Bund Garden Metro Hub', category: 'METRO', distanceKm: 1.1 },
    ],
  },
  {
    id: 'LOC-KALYANI-NAGAR-002',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000002',
    parentId: 'WARD-PMC-22',
    hierarchyPath: '/MH/PUN/HAV/PMC/EAST/W22/LOC-KALYANI-NAGAR-002',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Kalyani Nagar',
    nameMr: 'कल्याणी नगर',
    nameHi: 'कल्याणी नगर',
    googleName: 'Kalyani Nagar, Pune, Maharashtra 411006, India',
    googlePlaceId: 'ChIJee_879_BwjsRd4_6k70m82c',
    osmId: 'relation/7892347',
    latitude: 18.5463,
    longitude: 73.9034,
    geohash: 'te7v14',
    h3Index: '8860145b2fffffc',
    areaSqKm: 4.6,
    pincode: '411006',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PMC (Pune Municipal Corporation)',
    ward: 'Ward No. 22 (Kalyani Nagar - Vadgaon Sheri)',
    zone: 'East Pune Zone',
    slug: 'kalyani-nagar',
    seoPath: '/pune/kalyani-nagar',
    displayName: 'Kalyani Nagar, East Pune',
    alternateNames: ['Kalyani Nagar Bridge', 'Bishop School Kalyani Nagar', 'Jogger Park Kalyani Nagar'],
    popularName: 'Kalyani Nagar Riverside Residential',
    verificationStatus: 'APPROVED',
    source: 'PMC_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 28,
    avgPricePerSqFt: 15400,
    nearestMetroStation: 'Kalyani Nagar Metro Station',
    nearestHighway: 'Pune Airport VIP Road',
  },
  {
    id: 'LOC-AUNDH-003',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000003',
    parentId: 'WARD-PMC-14',
    hierarchyPath: '/MH/PUN/HAV/PMC/WEST/W14/LOC-AUNDH-003',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Aundh',
    nameMr: 'औंध',
    nameHi: 'औंध',
    googleName: 'Aundh, Pune, Maharashtra 411007, India',
    googlePlaceId: 'ChIJaa_111_BwjsRd1_1k11m11a',
    osmId: 'relation/7892348',
    latitude: 18.558,
    longitude: 73.8077,
    geohash: 'te7u8z',
    h3Index: '8860145b31fffff',
    areaSqKm: 6.2,
    pincode: '411007',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PMC (Pune Municipal Corporation)',
    ward: 'Ward No. 14 (Aundh - Pashan)',
    zone: 'West Pune Zone',
    slug: 'aundh',
    seoPath: '/pune/aundh',
    displayName: 'Aundh, West Pune (University & Legacy Luxury)',
    alternateNames: ['Aundh Gaon', 'Aundh ITI Road', 'Parihar Chowk', 'Bremen Chowk', 'Spicer College Aundh'],
    popularName: 'Aundh Established Heritage Suburb',
    verificationStatus: 'APPROVED',
    source: 'PMC_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 35,
    avgPricePerSqFt: 12200,
    nearestMetroStation: 'University Square Metro Station',
    nearestHighway: 'Aundh-Ravet BRTS & Old Mumbai Highway',
  },
  {
    id: 'LOC-KOTHRUD-004',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000004',
    parentId: 'WARD-PMC-11',
    hierarchyPath: '/MH/PUN/HAV/PMC/WEST/W11/LOC-KOTHRUD-004',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Kothrud',
    nameMr: 'कोथरूड',
    nameHi: 'कोथरूड',
    googleName: 'Kothrud, Pune, Maharashtra 411038, India',
    googlePlaceId: 'ChIJbb_222_BwjsRd2_2k22m22b',
    osmId: 'relation/7892349',
    latitude: 18.5074,
    longitude: 73.8077,
    geohash: 'te7ud8',
    h3Index: '8860145b33fffff',
    areaSqKm: 12.1,
    pincode: '411038',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PMC (Pune Municipal Corporation)',
    ward: 'Ward No. 11 (Kothrud - Bavdhan)',
    zone: 'West Pune Zone',
    slug: 'kothrud',
    seoPath: '/pune/kothrud',
    displayName: 'Kothrud, West Pune',
    alternateNames: ['Kothrud Stand', 'Karve Road Kothrud', 'Paud Road', 'Chandani Chowk', 'Vanaz Corner'],
    popularName: 'Kothrud Cultural & Metro Hub',
    verificationStatus: 'APPROVED',
    source: 'PMC_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 52,
    avgPricePerSqFt: 13500,
    nearestMetroStation: 'Vanaz Metro Terminal (Line 2)',
    nearestHighway: 'Paud Road & Chandani Chowk Flyover',
  },
  {
    id: 'LOC-TATHAWADE-005',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000005',
    parentId: 'WARD-PCMC-25',
    hierarchyPath: '/MH/PUN/HAV/PCMC/NORTH/W25/LOC-TATHAWADE-005',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Tathawade',
    nameMr: 'ताथावडे',
    nameHi: 'ताथवडे',
    googleName: 'Tathawade, Pimpri-Chinchwad, Maharashtra 411033, India',
    googlePlaceId: 'ChIJcc_333_BwjsRd3_3k33m33c',
    osmId: 'relation/7892350',
    latitude: 18.6189,
    longitude: 73.7523,
    geohash: 'te7udm',
    h3Index: '8860145b35fffff',
    areaSqKm: 9.3,
    pincode: '411033',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PCMC (Pimpri-Chinchwad Municipal Corporation)',
    ward: 'Ward No. 25 (Wakad - Tathawade)',
    zone: 'North PCMC Zone',
    slug: 'tathawade',
    seoPath: '/pune/tathawade',
    displayName: 'Tathawade, PCMC (Education Corridor)',
    alternateNames: ['Tathwade', 'JSPM Tathawade', 'Dange Chowk Tathawade', 'Ashok Nagar Tathawade'],
    popularName: 'Tathawade Education & Tech Hub',
    verificationStatus: 'APPROVED',
    source: 'PCMC_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 48,
    avgPricePerSqFt: 7200,
    nearestMetroStation: 'Dange Chowk Proposed Metro',
    nearestHighway: 'Mumbai-Pune Expressway',
  },
  {
    id: 'LOC-PUNAWALE-006',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000006',
    parentId: 'WARD-PCMC-25',
    hierarchyPath: '/MH/PUN/HAV/PCMC/NORTH/W25/LOC-PUNAWALE-006',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Punawale',
    nameMr: 'पुनावळे',
    nameHi: 'पुनावले',
    googleName: 'Punawale, Pimpri-Chinchwad, Maharashtra 411033, India',
    googlePlaceId: 'ChIJdd_444_BwjsRd4_4k44m44d',
    osmId: 'relation/7892351',
    latitude: 18.634,
    longitude: 73.744,
    geohash: 'te7ue1',
    h3Index: '8860145b37fffff',
    areaSqKm: 8.5,
    pincode: '411033',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PCMC (Pimpri-Chinchwad Municipal Corporation)',
    ward: 'Ward No. 25 (Punawale - Ravet)',
    zone: 'North PCMC Zone',
    slug: 'punawale',
    seoPath: '/pune/punawale',
    displayName: 'Punawale, PCMC (Expressway Belt)',
    alternateNames: ['Punawale Gaon', 'Kate Wasti Punawale', 'Malwadi Punawale'],
    popularName: 'Punawale High-Velocity Residential',
    verificationStatus: 'APPROVED',
    source: 'PCMC_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 39,
    avgPricePerSqFt: 6950,
    nearestMetroStation: 'Bhumkar Chowk Metro Node',
    nearestHighway: 'Mumbai-Pune Expressway',
  },
  {
    id: 'LOC-RAVET-007',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000007',
    parentId: 'WARD-PCMC-25',
    hierarchyPath: '/MH/PUN/HAV/PCMC/NORTH/W25/LOC-RAVET-007',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Ravet',
    nameMr: 'रावेत',
    nameHi: 'रावेत',
    googleName: 'Ravet, Pimpri-Chinchwad, Maharashtra 412101, India',
    googlePlaceId: 'ChIJee_555_BwjsRd5_5k55m55e',
    osmId: 'relation/7892352',
    latitude: 18.656,
    longitude: 73.738,
    geohash: 'te7uf2',
    h3Index: '8860145b39fffff',
    areaSqKm: 10.2,
    pincode: '412101',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PCMC (Pimpri-Chinchwad Municipal Corporation)',
    ward: 'Ward No. 25 (Ravet - Kiwale)',
    zone: 'North PCMC Zone',
    slug: 'ravet',
    seoPath: '/pune/ravet',
    displayName: 'Ravet, PCMC (Expressway Gateway)',
    alternateNames: ['Ravet Gaon', 'Shinde Vasti Ravet', 'Ravet Bridge', 'Aundh Ravet BRTS Terminal'],
    popularName: 'Ravet Gateway to Mumbai & IT',
    verificationStatus: 'APPROVED',
    source: 'PCMC_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 44,
    avgPricePerSqFt: 7100,
    nearestMetroStation: 'Nigdi Bhakti Shakti Metro',
    nearestHighway: 'Mumbai-Pune Expressway Start Point',
  },
  {
    id: 'LOC-VIMAN-NAGAR-008',
    uuid: 'a1b2c3d4-e5f6-4a1b-8c2d-000000000008',
    parentId: 'WARD-PMC-22',
    hierarchyPath: '/MH/PUN/HAV/PMC/EAST/W22/LOC-VIMAN-NAGAR-008',
    locationType: 'LOCALITY',
    locationLevel: 7,
    nameEn: 'Viman Nagar',
    nameMr: 'विमान नगर',
    nameHi: 'विमान नगर',
    googleName: 'Viman Nagar, Pune, Maharashtra 411014, India',
    googlePlaceId: 'ChIJff_666_BwjsRd6_6k66m66f',
    osmId: 'relation/7892353',
    latitude: 18.5679,
    longitude: 73.9143,
    geohash: 'te7v1t',
    h3Index: '8860145b3bfffff',
    areaSqKm: 5.4,
    pincode: '411014',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    municipalCorporation: 'PMC (Pune Municipal Corporation)',
    ward: 'Ward No. 22 (Viman Nagar - Airport)',
    zone: 'East Pune Zone',
    slug: 'viman-nagar',
    seoPath: '/pune/viman-nagar',
    displayName: 'Viman Nagar, East Pune (Airport Corridor)',
    alternateNames: ['Pune Airport Area', 'Phoenix Marketcity Viman Nagar', 'Symbiosis Viman Nagar', 'Datta Mandir Chowk Viman Nagar'],
    popularName: 'Viman Nagar Airport & Lifestyle Center',
    verificationStatus: 'APPROVED',
    source: 'PMC_GIS',
    isActive: true,
    createdBy: 'system_gis_architect',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    reraRegisteredProjectCount: 30,
    avgPricePerSqFt: 13900,
    nearestMetroStation: 'Viman Nagar Metro Station (Line 2)',
    nearestHighway: 'Pune-Ahmednagar Highway & VIP Airport Road',
  },
];

// ============================================================
// SEED ALIAS MASTER RECORDS (CANONICAL ALIAS NORMALIZATION)
// ============================================================
export const SEED_LOCATION_ALIASES: LocationAliasRecord[] = [
  // Baner Aliases
  { id: 'ALS-BAN-01', locationId: 'LOC-BANER-552', aliasName: 'Baner', language: 'en', aliasType: 'LOCAL_NAME', confidenceScore: 1.0, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-BAN-02', locationId: 'LOC-BANER-552', aliasName: 'Baner Road', language: 'en', aliasType: 'ROAD_REFERENCE', confidenceScore: 0.98, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-BAN-03', locationId: 'LOC-BANER-552', aliasName: 'Baner Pune', language: 'en', aliasType: 'SEARCH_SYNONYM', confidenceScore: 1.0, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-BAN-04', locationId: 'LOC-BANER-552', aliasName: 'Baner Gaon', language: 'en', aliasType: 'HISTORICAL_NAME', confidenceScore: 0.95, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-BAN-05', locationId: 'LOC-BANER-552', aliasName: 'Baner Village', language: 'en', aliasType: 'HISTORICAL_NAME', confidenceScore: 0.95, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-BAN-06', locationId: 'LOC-BANER-552', aliasName: 'Baner West', language: 'en', aliasType: 'SPELLING_VARIATION', confidenceScore: 0.92, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-BAN-07', locationId: 'LOC-BANER-552', aliasName: 'बाणेर', language: 'mr', aliasType: 'LOCAL_NAME', confidenceScore: 1.0, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-BAN-08', locationId: 'LOC-BANER-552', aliasName: 'बाणेर रोड', language: 'mr', aliasType: 'ROAD_REFERENCE', confidenceScore: 0.98, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-BAN-09', locationId: 'LOC-BANER-552', aliasName: 'बानेर', language: 'hi', aliasType: 'LOCAL_NAME', confidenceScore: 0.99, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-BAN-10', locationId: 'LOC-BANER-552', aliasName: 'Veerbhadra Nagar', language: 'en', aliasType: 'LOCAL_NAME', confidenceScore: 0.9, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },

  // Wakad Aliases
  { id: 'ALS-WAK-01', locationId: 'LOC-WAKAD-553', aliasName: 'Wakad', language: 'en', aliasType: 'LOCAL_NAME', confidenceScore: 1.0, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-WAK-02', locationId: 'LOC-WAKAD-553', aliasName: 'Wakad Pune', language: 'en', aliasType: 'SEARCH_SYNONYM', confidenceScore: 1.0, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-WAK-03', locationId: 'LOC-WAKAD-553', aliasName: 'Wakad PCMC', language: 'en', aliasType: 'SEARCH_SYNONYM', confidenceScore: 0.98, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-WAK-04', locationId: 'LOC-WAKAD-553', aliasName: 'Wakad Chowk', language: 'en', aliasType: 'ROAD_REFERENCE', confidenceScore: 0.95, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-WAK-05', locationId: 'LOC-WAKAD-553', aliasName: 'Kaspate Vasti', language: 'en', aliasType: 'LOCAL_NAME', confidenceScore: 0.93, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-WAK-06', locationId: 'LOC-WAKAD-553', aliasName: 'Datta Mandir Road', language: 'en', aliasType: 'ROAD_REFERENCE', confidenceScore: 0.92, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-WAK-07', locationId: 'LOC-WAKAD-553', aliasName: 'वाकड', language: 'mr', aliasType: 'LOCAL_NAME', confidenceScore: 1.0, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-WAK-08', locationId: 'LOC-WAKAD-553', aliasName: 'वाकड़', language: 'hi', aliasType: 'LOCAL_NAME', confidenceScore: 0.99, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },

  // Hinjewadi Aliases
  { id: 'ALS-HIN-01', locationId: 'LOC-HINJEWADI-301', aliasName: 'Hinjewadi', language: 'en', aliasType: 'LOCAL_NAME', confidenceScore: 1.0, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-HIN-02', locationId: 'LOC-HINJEWADI-301', aliasName: 'Hinjawadi', language: 'en', aliasType: 'SPELLING_VARIATION', confidenceScore: 1.0, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-HIN-03', locationId: 'LOC-HINJEWADI-301', aliasName: 'Hinjewadi Phase 1', language: 'en', aliasType: 'LOCAL_NAME', confidenceScore: 0.97, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-HIN-04', locationId: 'LOC-HINJEWADI-301', aliasName: 'Hinjewadi Phase 2', language: 'en', aliasType: 'LOCAL_NAME', confidenceScore: 0.97, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-HIN-05', locationId: 'LOC-HINJEWADI-301', aliasName: 'Hinjewadi Phase 3', language: 'en', aliasType: 'LOCAL_NAME', confidenceScore: 0.97, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-HIN-06', locationId: 'LOC-HINJEWADI-301', aliasName: 'RG Infotech Park', language: 'en', aliasType: 'SEARCH_SYNONYM', confidenceScore: 0.94, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-HIN-07', locationId: 'LOC-HINJEWADI-301', aliasName: 'हिंजवडी', language: 'mr', aliasType: 'LOCAL_NAME', confidenceScore: 1.0, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-HIN-08', locationId: 'LOC-HINJEWADI-301', aliasName: 'हिंजेवाड़ी', language: 'hi', aliasType: 'LOCAL_NAME', confidenceScore: 0.99, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },

  // Kharadi Aliases
  { id: 'ALS-KHA-01', locationId: 'LOC-KHARADI-102', aliasName: 'Kharadi', language: 'en', aliasType: 'LOCAL_NAME', confidenceScore: 1.0, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-KHA-02', locationId: 'LOC-KHARADI-102', aliasName: 'Kharadi Pune', language: 'en', aliasType: 'SEARCH_SYNONYM', confidenceScore: 1.0, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-KHA-03', locationId: 'LOC-KHARADI-102', aliasName: 'EON Free Zone', language: 'en', aliasType: 'SEARCH_SYNONYM', confidenceScore: 0.96, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-KHA-04', locationId: 'LOC-KHARADI-102', aliasName: 'World Trade Center Pune', language: 'en', aliasType: 'SEARCH_SYNONYM', confidenceScore: 0.96, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-KHA-05', locationId: 'LOC-KHARADI-102', aliasName: 'Kharadi Bypass', language: 'en', aliasType: 'ROAD_REFERENCE', confidenceScore: 0.93, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-KHA-06', locationId: 'LOC-KHARADI-102', aliasName: 'खराडी', language: 'mr', aliasType: 'LOCAL_NAME', confidenceScore: 1.0, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },

  // Balewadi Aliases
  { id: 'ALS-BAL-01', locationId: 'LOC-BALEWADI-104', aliasName: 'Balewadi', language: 'en', aliasType: 'LOCAL_NAME', confidenceScore: 1.0, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-BAL-02', locationId: 'LOC-BALEWADI-104', aliasName: 'Balewadi High Street', language: 'en', aliasType: 'ROAD_REFERENCE', confidenceScore: 0.98, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-BAL-03', locationId: 'LOC-BALEWADI-104', aliasName: 'Balewadi Stadium', language: 'en', aliasType: 'SEARCH_SYNONYM', confidenceScore: 0.95, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-BAL-04', locationId: 'LOC-BALEWADI-104', aliasName: 'बालेवाडी', language: 'mr', aliasType: 'LOCAL_NAME', confidenceScore: 1.0, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },

  // Koregaon Park Aliases
  { id: 'ALS-KP-01', locationId: 'LOC-KOREGAON-PARK-001', aliasName: 'Koregaon Park', language: 'en', aliasType: 'LOCAL_NAME', confidenceScore: 1.0, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-KP-02', locationId: 'LOC-KOREGAON-PARK-001', aliasName: 'KP Pune', language: 'en', aliasType: 'ABBREVIATION', confidenceScore: 0.97, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-KP-03', locationId: 'LOC-KOREGAON-PARK-001', aliasName: 'North Main Road Koregaon Park', language: 'en', aliasType: 'ROAD_REFERENCE', confidenceScore: 0.94, isPrimaryRedirect: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: 'ALS-KP-04', locationId: 'LOC-KOREGAON-PARK-001', aliasName: 'कोरेगाव पार्क', language: 'mr', aliasType: 'LOCAL_NAME', confidenceScore: 1.0, isPrimaryRedirect: false, createdAt: '2024-01-15T00:00:00Z' },
];

// ============================================================
// ENTERPRISE LOCATION INTELLIGENCE SERVICE SINGLETON
// ============================================================
export class LocationIntelligencePlatformService {
  private locations: Map<string, LocationMasterRecord> = new Map();
  private aliases: Map<string, LocationAliasRecord> = new Map();
  private aliasIndex: Map<string, string> = new Map(); // normalized string -> locationId
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initialize();
  }

  private initialize() {
    // 1. Load seed canonical locations
    SEED_CANONICAL_LOCATIONS.forEach((loc) => {
      this.locations.set(loc.id, { ...loc });
    });

    // 2. Load seed aliases
    SEED_LOCATION_ALIASES.forEach((als) => {
      this.aliases.set(als.id, { ...als });
    });

    // 3. Hydrate from localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedLocs = localStorage.getItem('kiaan_canonical_locations_master_v1');
        if (storedLocs) {
          const parsed: LocationMasterRecord[] = JSON.parse(storedLocs);
          parsed.forEach((loc) => this.locations.set(loc.id, loc));
        }

        const storedAliases = localStorage.getItem('kiaan_location_aliases_master_v1');
        if (storedAliases) {
          const parsed: LocationAliasRecord[] = JSON.parse(storedAliases);
          parsed.forEach((als) => this.aliases.set(als.id, als));
        }
      } catch (err) {
        console.warn('Failed to load Location Master from localStorage:', err);
      }
    }

    // 4. Build fast in-memory alias index
    this.rebuildAliasIndex();
  }

  private saveToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(
          'kiaan_canonical_locations_master_v1',
          JSON.stringify(Array.from(this.locations.values()))
        );
        localStorage.setItem(
          'kiaan_location_aliases_master_v1',
          JSON.stringify(Array.from(this.aliases.values()))
        );
      } catch (err) {
        console.warn('Failed to save Location Master to localStorage:', err);
      }
    }
  }

  private rebuildAliasIndex() {
    this.aliasIndex.clear();

    // Map canonical names first
    this.locations.forEach((loc) => {
      this.aliasIndex.set(this.normalizeKey(loc.nameEn), loc.id);
      if (loc.nameMr) this.aliasIndex.set(this.normalizeKey(loc.nameMr), loc.id);
      if (loc.nameHi) this.aliasIndex.set(this.normalizeKey(loc.nameHi), loc.id);
      if (loc.slug) this.aliasIndex.set(this.normalizeKey(loc.slug), loc.id);
      if (loc.pincode) this.aliasIndex.set(`pin_${loc.pincode}`, loc.id);

      loc.alternateNames.forEach((alt) => {
        this.aliasIndex.set(this.normalizeKey(alt), loc.id);
      });
    });

    // Map all alias records
    this.aliases.forEach((als) => {
      this.aliasIndex.set(this.normalizeKey(als.aliasName), als.locationId);
    });
  }

  public normalizeKey(input: string): string {
    if (!input) return '';
    return input
      .toLowerCase()
      .trim()
      .replace(/[\s\-_,.]+/g, '')
      .replace(/pune|pcmc|pmrda|road|nagar|chowk|gaon|village|west|east|phase\d+/gi, '')
      .trim();
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.rebuildAliasIndex();
    this.saveToStorage();
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('LIP listener error:', e);
      }
    });
  }

  // ============================================================
  // READ API: CANONICAL LOCATION RETRIEVAL
  // ============================================================
  public getAllLocations(includePending: boolean = false): LocationMasterRecord[] {
    const list = Array.from(this.locations.values());
    if (includePending) return list;
    return list.filter((l) => l.isActive && l.verificationStatus === 'APPROVED');
  }

  public getLocationById(id: string): LocationMasterRecord | undefined {
    return this.locations.get(id);
  }

  public getLocationBySlug(slug: string): LocationMasterRecord | undefined {
    const cleanSlug = slug.toLowerCase().trim();
    return Array.from(this.locations.values()).find(
      (l) => l.slug.toLowerCase() === cleanSlug || l.id.toLowerCase() === cleanSlug
    );
  }

  public getAliasesForLocation(locationId: string): LocationAliasRecord[] {
    return Array.from(this.aliases.values()).filter((a) => a.locationId === locationId);
  }

  // ============================================================
  // SEARCH & AUTOCOMPLETE: MULTI-LINGUAL, ALIAS-AWARE
  // ============================================================
  public searchLocations(query: string, options?: { maxResults?: number; onlyApproved?: boolean }): LocationMasterRecord[] {
    if (!query || !query.trim()) {
      return this.getAllLocations(!options?.onlyApproved).slice(0, options?.maxResults || 10);
    }

    const q = query.toLowerCase().trim();
    const qNorm = this.normalizeKey(q);
    const max = options?.maxResults || 15;
    const pool = this.getAllLocations(!options?.onlyApproved);

    const scored: { location: LocationMasterRecord; score: number }[] = [];

    pool.forEach((loc) => {
      let score = 0;
      const nameEn = loc.nameEn.toLowerCase();
      const nameMr = loc.nameMr ? loc.nameMr.toLowerCase() : '';
      const nameHi = loc.nameHi ? loc.nameHi.toLowerCase() : '';
      const pincode = loc.pincode || '';
      const popular = loc.popularName ? loc.popularName.toLowerCase() : '';

      // Exact match
      if (nameEn === q || nameMr === q || nameHi === q || pincode === q) {
        score += 100;
      }
      // Starts with
      else if (nameEn.startsWith(q) || nameMr.startsWith(q) || nameHi.startsWith(q) || pincode.startsWith(q)) {
        score += 75;
      }
      // Contains
      else if (nameEn.includes(q) || nameMr.includes(q) || nameHi.includes(q) || pincode.includes(q) || popular.includes(q)) {
        score += 50;
      }
      // Normalized match
      else if (qNorm && (this.normalizeKey(loc.nameEn).includes(qNorm) || qNorm.includes(this.normalizeKey(loc.nameEn)))) {
        score += 40;
      }

      // Check alternates & aliases
      const aliases = this.getAliasesForLocation(loc.id);
      for (const als of aliases) {
        const aName = als.aliasName.toLowerCase();
        if (aName === q) {
          score = Math.max(score, 85 * als.confidenceScore);
        } else if (aName.startsWith(q)) {
          score = Math.max(score, 65 * als.confidenceScore);
        } else if (aName.includes(q)) {
          score = Math.max(score, 45 * als.confidenceScore);
        }
      }

      // Check key POIs / metro
      if (loc.nearestMetroStation && loc.nearestMetroStation.toLowerCase().includes(q)) {
        score = Math.max(score, 40);
      }
      if (loc.keyPois) {
        for (const poi of loc.keyPois) {
          if (poi.name.toLowerCase().includes(q)) {
            score = Math.max(score, 42);
          }
        }
      }

      if (score > 0) {
        scored.push({ location: loc, score });
      }
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, max).map((s) => s.location);
  }

  // ============================================================
  // NORMALIZATION ENGINE: RESOLVE TEXT TO CANONICAL LOCATION ID
  // ============================================================
  public resolveToCanonicalLocation(text: string): LocationMasterRecord | null {
    if (!text || !text.trim()) return null;
    const clean = text.trim();
    const lower = clean.toLowerCase();

    // 1. Direct ID match
    if (this.locations.has(clean)) {
      return this.locations.get(clean)!;
    }

    // 2. Direct Slug match
    const slugMatch = Array.from(this.locations.values()).find((l) => l.slug.toLowerCase() === lower);
    if (slugMatch) return slugMatch;

    // 3. Search through aliases
    const directAlias = Array.from(this.aliases.values()).find((a) => a.aliasName.toLowerCase() === lower);
    if (directAlias && this.locations.has(directAlias.locationId)) {
      return this.locations.get(directAlias.locationId)!;
    }

    // 4. Normalized index match
    const normKey = this.normalizeKey(clean);
    if (normKey && this.aliasIndex.has(normKey)) {
      const locId = this.aliasIndex.get(normKey)!;
      if (this.locations.has(locId)) {
        return this.locations.get(locId)!;
      }
    }

    // 5. Fallback fuzzy search top hit with high confidence
    const searchHits = this.searchLocations(clean, { maxResults: 1 });
    if (searchHits.length > 0) {
      return searchHits[0];
    }

    return null;
  }

  // ============================================================
  // DUPLICATE DETECTION ALGORITHM (MANDATORY REQUIREMENT)
  // ============================================================
  public detectDuplicateLocation(candidate: {
    nameEn: string;
    googlePlaceId?: string;
    latitude?: number;
    longitude?: number;
    pincode?: string;
  }): DuplicateDetectionResult {
    const candidates: DuplicateDetectionResult['candidates'] = [];
    const normCand = this.normalizeKey(candidate.nameEn);
    const candLower = candidate.nameEn.toLowerCase().trim();

    for (const loc of this.locations.values()) {
      let similarityScore = 0;
      let matchType: DuplicateDetectionResult['candidates'][0]['matchType'] = 'FUZZY_STRING';
      let distMeters: number | undefined;

      // 1. Exact Google Place ID match
      if (candidate.googlePlaceId && loc.googlePlaceId && candidate.googlePlaceId === loc.googlePlaceId) {
        similarityScore = 100;
        matchType = 'EXACT_PLACE_ID';
      }

      // 2. Exact or close name match
      const locNameLower = loc.nameEn.toLowerCase();
      if (locNameLower === candLower || (loc.nameMr && loc.nameMr === candidate.nameEn)) {
        similarityScore = Math.max(similarityScore, 98);
        matchType = 'EXACT_NAME';
      } else if (normCand && this.normalizeKey(loc.nameEn) === normCand) {
        similarityScore = Math.max(similarityScore, 90);
        matchType = 'FUZZY_STRING';
      }

      // 3. Check alias matches
      const aliases = this.getAliasesForLocation(loc.id);
      for (const als of aliases) {
        if (als.aliasName.toLowerCase() === candLower) {
          similarityScore = Math.max(similarityScore, 92);
          matchType = 'ALIAS_MATCH';
        }
      }

      // 4. Spatial Proximity check (Haversine formula)
      if (candidate.latitude && candidate.longitude && loc.latitude && loc.longitude) {
        distMeters = this.calculateHaversineDistance(
          candidate.latitude,
          candidate.longitude,
          loc.latitude,
          loc.longitude
        );

        // Within 600m with same pincode or partial name
        if (distMeters < 600) {
          if (candidate.pincode && loc.pincode === candidate.pincode) {
            similarityScore = Math.max(similarityScore, 88);
            matchType = 'SPATIAL_PROXIMITY';
          } else {
            similarityScore = Math.max(similarityScore, 75);
            matchType = 'SPATIAL_PROXIMITY';
          }
        }
      }

      if (similarityScore >= 60) {
        candidates.push({
          location: loc,
          similarityScore,
          matchType,
          distanceMeters: distMeters,
        });
      }
    }

    candidates.sort((a, b) => b.similarityScore - a.similarityScore);

    if (candidates.length > 0 && candidates[0].similarityScore >= 75) {
      return {
        isDuplicate: true,
        confidence: candidates[0].similarityScore,
        matchedLocation: candidates[0].location,
        reason: `Potential duplicate of existing canonical location "${candidates[0].location.nameEn}" (${candidates[0].matchType}, score: ${candidates[0].similarityScore}%)`,
        candidates,
      };
    }

    return {
      isDuplicate: false,
      confidence: candidates.length > 0 ? candidates[0].similarityScore : 0,
      candidates,
    };
  }

  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }

  // ============================================================
  // WRITE API: CREATE LOCATION (WITH MANDATORY PARENT & STATUS)
  // ============================================================
  public createLocation(
    payload: LocationCreationPayload,
    options?: { requestedByAdmin?: boolean; autoApprove?: boolean }
  ): { success: boolean; location?: LocationMasterRecord; error?: string } {
    // 1. Validation: Name required
    if (!payload.nameEn || !payload.nameEn.trim()) {
      return { success: false, error: 'Location English Name is mandatory.' };
    }

    // 2. Validation: Parent ID required (No Orphan Records)
    if (!payload.parentId || !CANONICAL_PARENT_NODES[payload.parentId]) {
      return { success: false, error: 'Every location must have a valid parent from the canonical hierarchy.' };
    }

    // 3. Validation: Coordinates required
    if (!payload.latitude || !payload.longitude) {
      return { success: false, error: 'Latitude and Longitude coordinates are mandatory.' };
    }

    // 4. Duplicate prevention check
    const dupCheck = this.detectDuplicateLocation({
      nameEn: payload.nameEn,
      googlePlaceId: payload.googlePlaceId,
      latitude: payload.latitude,
      longitude: payload.longitude,
      pincode: payload.pincode,
    });

    if (dupCheck.isDuplicate && dupCheck.confidence >= 90) {
      return {
        success: false,
        error: `Location "${dupCheck.matchedLocation?.nameEn}" already exists as canonical ID ${dupCheck.matchedLocation?.id}. Please select the existing location.`,
      };
    }

    // 5. Generate Canonical ID & Slug
    const cleanSlug = payload.nameEn
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const canonicalId = `LOC-${cleanSlug.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const parentNode = CANONICAL_PARENT_NODES[payload.parentId];
    const hierarchyPath = `${parentNode.path}/${canonicalId}`;

    const newLocation: LocationMasterRecord = {
      id: canonicalId,
      uuid: `loc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      parentId: payload.parentId,
      hierarchyPath,
      locationType: payload.locationType || 'LOCALITY',
      locationLevel: 7,
      nameEn: payload.nameEn.trim(),
      nameMr: payload.nameMr || '',
      nameHi: payload.nameHi || '',
      googleName: `${payload.nameEn}, ${payload.district}, ${payload.state}`,
      googlePlaceId: payload.googlePlaceId,
      latitude: payload.latitude,
      longitude: payload.longitude,
      polygon: payload.polygon,
      geohash: this.encodeSimpleGeohash(payload.latitude, payload.longitude),
      areaSqKm: payload.areaSqKm || 5.0,
      pincode: payload.pincode || '411001',
      taluka: payload.taluka || 'Haveli',
      district: payload.district || 'Pune',
      state: payload.state || 'Maharashtra',
      municipalCorporation: payload.municipalCorporation || 'PMC',
      ward: payload.ward || parentNode.name,
      zone: payload.zone || 'Central Pune',
      slug: cleanSlug,
      seoPath: `/pune/${cleanSlug}`,
      displayName: `${payload.nameEn}, ${payload.district} (${payload.municipalCorporation})`,
      alternateNames: payload.alternateNames || [],
      popularName: payload.popularName || `${payload.nameEn} Micro-Market`,
      verificationStatus: options?.autoApprove ? 'APPROVED' : 'PENDING_REVIEW',
      source: payload.source || 'MANUAL_CURATION',
      isActive: true,
      createdBy: options?.requestedByAdmin ? 'admin_console' : 'portal_user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.locations.set(newLocation.id, newLocation);

    // Auto-create initial aliases
    this.addAlias({
      locationId: newLocation.id,
      aliasName: newLocation.nameEn,
      language: 'en',
      aliasType: 'LOCAL_NAME',
      confidenceScore: 1.0,
      isPrimaryRedirect: false,
    });

    if (newLocation.nameMr) {
      this.addAlias({
        locationId: newLocation.id,
        aliasName: newLocation.nameMr,
        language: 'mr',
        aliasType: 'LOCAL_NAME',
        confidenceScore: 1.0,
        isPrimaryRedirect: false,
      });
    }

    if (payload.alternateNames) {
      payload.alternateNames.forEach((alt) => {
        if (alt.trim()) {
          this.addAlias({
            locationId: newLocation.id,
            aliasName: alt.trim(),
            language: 'en',
            aliasType: 'SEARCH_SYNONYM',
            confidenceScore: 0.95,
            isPrimaryRedirect: true,
          });
        }
      });
    }

    this.notify();
    return { success: true, location: newLocation };
  }

  // ============================================================
  // ALIAS CREATION & MANAGEMENT
  // ============================================================
  public addAlias(payload: {
    locationId: string;
    aliasName: string;
    language?: 'en' | 'mr' | 'hi' | 'phonetic';
    aliasType?: LocationAliasRecord['aliasType'];
    confidenceScore?: number;
    isPrimaryRedirect?: boolean;
  }): LocationAliasRecord | null {
    if (!payload.locationId || !this.locations.has(payload.locationId)) return null;
    if (!payload.aliasName || !payload.aliasName.trim()) return null;

    const id = `ALS-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const record: LocationAliasRecord = {
      id,
      locationId: payload.locationId,
      aliasName: payload.aliasName.trim(),
      language: payload.language || 'en',
      aliasType: payload.aliasType || 'SEARCH_SYNONYM',
      confidenceScore: payload.confidenceScore ?? 0.95,
      isPrimaryRedirect: payload.isPrimaryRedirect ?? true,
      createdAt: new Date().toISOString(),
    };

    this.aliases.set(record.id, record);
    this.notify();
    return record;
  }

  public deleteAlias(aliasId: string): boolean {
    if (this.aliases.has(aliasId)) {
      this.aliases.delete(aliasId);
      this.notify();
      return true;
    }
    return false;
  }

  // ============================================================
  // ADMIN APPROVAL WORKFLOW
  // ============================================================
  public updateVerificationStatus(
    locationId: string,
    status: VerificationStatus,
    adminEmail?: string
  ): boolean {
    const loc = this.locations.get(locationId);
    if (!loc) return false;

    loc.verificationStatus = status;
    loc.updatedAt = new Date().toISOString();
    this.locations.set(locationId, loc);
    this.notify();
    return true;
  }

  public updateLocation(locationId: string, updates: Partial<LocationMasterRecord>): boolean {
    const loc = this.locations.get(locationId);
    if (!loc) return false;

    const merged = {
      ...loc,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.locations.set(locationId, merged);
    this.notify();
    return true;
  }

  private encodeSimpleGeohash(lat: number, lng: number): string {
    // Lightweight geohash encoder
    const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
    let latRange = [-90.0, 90.0];
    let lonRange = [-180.0, 180.0];
    let isEven = true;
    let bit = 0;
    let ch = 0;
    let geohash = '';

    while (geohash.length < 6) {
      let mid = 0;
      if (isEven) {
        mid = (lonRange[0] + lonRange[1]) / 2;
        if (lng > mid) {
          ch |= 1 << (4 - bit);
          lonRange[0] = mid;
        } else {
          lonRange[1] = mid;
        }
      } else {
        mid = (latRange[0] + latRange[1]) / 2;
        if (lat > mid) {
          ch |= 1 << (4 - bit);
          latRange[0] = mid;
        } else {
          latRange[1] = mid;
        }
      }

      isEven = !isEven;
      if (bit < 4) {
        bit++;
      } else {
        geohash += BASE32[ch];
        bit = 0;
        ch = 0;
      }
    }
    return geohash;
  }
}

// Global Singleton Instance
export const locationIntelligencePlatform = new LocationIntelligencePlatformService();
