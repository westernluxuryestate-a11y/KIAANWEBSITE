/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Locality } from '../types';
import { ADDITIONAL_LOCALITIES } from './additionalSeedLocalities';

const PRIMARY_LOCALITIES: Locality[] = [
  {
    id: 'loc_wakad',
    slug: 'wakad',
    name: 'Wakad',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411057',
    localityType: 'RESIDENTIAL',
    categories: ['POPULAR', 'RESIDENTIAL_HUB', 'INVESTMENT_HOTSPOT'],
    zoneId: 'NORTH_PUNE_PCMC',
    zoneName: 'North Pune / PCMC',
    subLocalities: [
      { id: 'sub_kaspate_vasti', name: 'Kaspate Vasti', slug: 'kaspate-vasti', pincode: '411057', coordinates: { lat: 18.593, lng: 73.778 } },
      { id: 'sub_shankar_kalat_nagar', name: 'Shankar Kalat Nagar', slug: 'shankar-kalat-nagar', pincode: '411057', coordinates: { lat: 18.597, lng: 73.764 } },
    ],
    microLocations: [
      { id: 'road_datta_mandir', name: 'Datta Mandir Road', slug: 'datta-mandir-road', type: 'ROAD', coordinates: { lat: 18.601, lng: 73.771 } },
      { id: 'road_bhumkar_chowk', name: 'Bhumkar Chowk', slug: 'bhumkar-chowk', type: 'JUNCTION', coordinates: { lat: 18.5995, lng: 73.754 } },
    ],
    shortDescription: 'Established residential and IT corridor gateway with rapid social infrastructure and expressway access.',
    fullDescription:
      'Wakad is a premier, well-established residential and commercial micro-market in West Pune, situated directly at the confluence of the Hinjewadi IT Park corridor and the Mumbai–Pune Expressway. Known for wide arterial boulevards, seamless connectivity, and contemporary high-rise gated communities, Wakad has evolved from a suburban satellite into one of Pune’s most vibrant urban districts. The locality offers a diverse real-estate spectrum ranging from luxury high-rise penthouses to affordable multi-bedroom apartments, commercial retail spaces, and high-yield rental assets favored by IT leaders and young corporate families.',
    developmentStatus: 'ESTABLISHED',
    coordinates: {
      lat: 18.5987,
      lng: 73.7689,
    },
    coverImage:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    nearbyAreas: ['Hinjewadi Phase 1', 'Baner', 'Balewadi', 'Tathawade', 'Pimple Saudagar', 'Punawale'],
    connectivity: {
      highways: [
        { name: 'Mumbai-Pune Expressway Gateway', type: 'HIGHWAY', distanceKm: 3.8, commuteMinutes: 10, status: 'OPERATIONAL' },
        { name: 'NH-48 (Bengaluru-Mumbai Bypass)', type: 'HIGHWAY', distanceKm: 1.2, commuteMinutes: 4, status: 'OPERATIONAL' },
        { name: 'Datta Mandir 120ft Spine Road', type: 'HIGHWAY', distanceKm: 0.2, commuteMinutes: 1, status: 'OPERATIONAL' },
      ],
      metro: [
        { name: 'Upcoming Hinjewadi-Shivajinagar Line 3 Wakad Station', type: 'METRO', distanceKm: 1.1, commuteMinutes: 3, status: 'UNDER_CONSTRUCTION' },
        { name: 'Balewadi Stadium Metro Station', type: 'METRO', distanceKm: 3.5, commuteMinutes: 10, status: 'UNDER_CONSTRUCTION' },
      ],
      railway: [
        { name: 'Chinchwad Railway Station', type: 'RAILWAY', distanceKm: 6.8, commuteMinutes: 18, status: 'OPERATIONAL' },
        { name: 'Pune Junction Railway Station', type: 'RAILWAY', distanceKm: 17.5, commuteMinutes: 42, status: 'OPERATIONAL' },
      ],
      airport: [
        { name: 'Pune International Airport (Lohegaon/Viman Nagar)', type: 'AIRPORT', distanceKm: 21.0, commuteMinutes: 50, status: 'OPERATIONAL' },
        { name: 'Navi Mumbai International Airport (NMIA)', type: 'AIRPORT', distanceKm: 108.0, commuteMinutes: 95, status: 'UNDER_CONSTRUCTION' },
      ],
      busConnectivity: 'Direct PMPML bus terminals at Wakad Bridge, Dange Chowk, and Bhumkar Chowk connecting all parts of Pune and PCMC.',
      employmentHubs: [
        { name: 'Rajiv Gandhi Infotech Park (Phase 1, Hinjewadi)', distanceKm: 2.8, commuteMinutes: 8, companiesCount: 220 },
        { name: 'Hinjewadi Phase 2 & 3 SEZ', distanceKm: 6.5, commuteMinutes: 16, companiesCount: 180 },
        { name: 'Talawade IT Park', distanceKm: 14.2, commuteMinutes: 30, companiesCount: 45 },
      ],
    },
    socialInfrastructure: {
      schools: [
        { name: 'EuroSchool Wakad ICSE', category: 'SCHOOL', distanceKm: 1.2, rating: 4.8 },
        { name: 'Wisdom World School', category: 'SCHOOL', distanceKm: 1.8, rating: 4.7 },
        { name: 'Indus Valley International School', category: 'SCHOOL', distanceKm: 2.5, rating: 4.6 },
        { name: 'Akshara International School', category: 'SCHOOL', distanceKm: 2.0, rating: 4.6 },
      ],
      hospitals: [
        { name: 'Jupiter Hospital Baner-Wakad', category: 'HOSPITAL', distanceKm: 3.6, rating: 4.8 },
        { name: 'Ruby Hall Clinic Hinjewadi', category: 'HOSPITAL', distanceKm: 4.2, rating: 4.7 },
        { name: 'Surya Mother & Child Super Specialty Hospital', category: 'HOSPITAL', distanceKm: 1.5, rating: 4.6 },
        { name: 'Lifepoint Multispecialty Hospital', category: 'HOSPITAL', distanceKm: 0.9, rating: 4.5 },
      ],
      malls: [
        { name: 'Phoenix Mall of the Millennium (Wakad)', category: 'MALL', distanceKm: 1.1, rating: 4.9 },
        { name: 'Xion Mall Hinjewadi', category: 'MALL', distanceKm: 2.7, rating: 4.3 },
        { name: 'Westend Mall Aundh', category: 'MALL', distanceKm: 7.5, rating: 4.7 },
      ],
      restaurants: [
        { name: 'Balewadi High Street Dining Boulevard', category: 'RESTAURANT', distanceKm: 3.4, rating: 4.8 },
        { name: 'Sayaji Hotel Rooftop Dining & Portico', category: 'RESTAURANT', distanceKm: 1.3, rating: 4.6 },
        { name: 'Courtyard by Marriott Hinjewadi', category: 'RESTAURANT', distanceKm: 3.2, rating: 4.7 },
      ],
      parks: [
        { name: 'Wakad Biodiversity Oxygen Park', category: 'PARK', distanceKm: 0.8, rating: 4.5 },
        { name: 'Pashan Bird Sanctuary & Lake', category: 'PARK', distanceKm: 5.2, rating: 4.7 },
      ],
    },
    lifestyleRating: {
      connectivity: 9.4,
      safety: 8.9,
      greenSpaces: 7.8,
      lifestyle: 9.2,
      education: 9.1,
      healthcare: 9.0,
      overallScore: 9.1,
    },
    priceIntelligence: {
      averagePricePerSqFt: 8850,
      priceRangeMin: 7200,
      priceRangeMax: 13500,
      yoyGrowthPercent: 8.8,
      rentalYieldPercent: 4.4,
      lastAuditedQuarter: 'Q2 2026',
      resaleAvgSqFt: 8200,
      newProjectAvgSqFt: 9600,
      historicalTrend: [
        { year: 2021, avgSqFt: 6400 },
        { year: 2022, avgSqFt: 6950 },
        { year: 2023, avgSqFt: 7600 },
        { year: 2024, avgSqFt: 8150 },
        { year: 2025, avgSqFt: 8550 },
        { year: 2026, avgSqFt: 8850 },
      ],
      categoryBreakdown: [
        { type: '2 BHK Apartments', avgSqFt: 8400 },
        { type: '3 BHK Apartments', avgSqFt: 9200 },
        { type: '4 BHK Luxury Residences', avgSqFt: 11500 },
        { type: 'Commercial Retail / Office', avgSqFt: 14800 },
      ],
    },
    whyLiveHere: [
      {
        title: 'Zero-Stress Daily Commute to Tech Giants',
        description: 'Under 10 minutes to Infosys, Wipro, TCS, Cognizant, and 200+ global enterprises at Hinjewadi Phase 1.',
      },
      {
        title: 'Retail & Social Metropolis',
        description: 'Home to Phoenix Mall of the Millennium with 1.1 million sq.ft of luxury shopping, multiplexes, and dining.',
      },
      {
        title: 'High Capital & Rental Appreciation',
        description: 'Consistently ranks among Pune’s top 3 rental yield micro-markets (4.2% to 4.8% gross yields).',
      },
      {
        title: 'Future-Proof Transit Infrastructure',
        description: 'Upcoming Hinjewadi-Shivajinagar Metro Line 3 station within 1 km walking distance.',
      },
    ],
    whoIsThisFor: [
      { persona: 'IT & Corporate Professionals', description: 'Immediate proximity to Hinjewadi Tech Park with premium work-life balance.', suitabilityPercent: 96 },
      { persona: 'Young Growing Families', description: 'Top CBSE/ICSE schools within 2 km radius and world-class multi-specialty pediatric healthcare.', suitabilityPercent: 92 },
      { persona: 'Rental Yield Investors', description: 'High tenant occupancy (>96%) driven by year-round IT engineer and executive influx.', suitabilityPercent: 90 },
      { persona: 'First-Time Home Buyers', description: 'Broad pricing spectrum from ₹65L 2 BHKs to ₹1.8 Cr spacious 3 BHK luxury condominiums.', suitabilityPercent: 88 },
    ],
    pros: [
      'Prime gateway location next to Hinjewadi IT Park and Mumbai Expressway',
      'High-end retail infrastructure with Phoenix Mall of the Millennium',
      'Consistent 8%+ annual capital appreciation over the past 5 years',
      'Upcoming Metro Line 3 set to drastically cut Shivajinagar transit times',
    ],
    considerations: [
      'Peak hour vehicular traffic at Bhumkar Chowk and Hinjewadi flyover',
      'Rapid urbanization has reduced ground-level open green municipal plots',
    ],
    investmentOutlook: {
      appreciationRateYoY: 8.8,
      rentalYieldPercent: 4.4,
      futureDrivers: [
        'Commencement of Hinjewadi-Shivajinagar Metro Line 3 commercial operations',
        'Ring Road expansion easing transit toward Chakan and Talegaon industrial zones',
        'Continued expansion of Global Capability Centers (GCCs) in Hinjewadi',
      ],
    },
    seo: {
      title: 'Property in Wakad Pune | New Projects, Resale Flats & Price Trends',
      metaDescription:
        'Explore verified residential properties, luxury apartments, new projects and resale homes in Wakad, Pune. Get real-time ₹/sq.ft price trends, connectivity, and expert analysis.',
      h1: 'Wakad Locality Intelligence & Property Discovery',
      keywords: ['Property in Wakad', 'Flats for sale in Wakad', 'New projects in Wakad', 'Wakad real estate prices', 'Wakad resale apartments'],
      canonicalUrl: 'https://kiaanproperties.com/localities/pune/wakad',
    },
    faqs: [
      {
        id: 'faq_wakad_1',
        question: 'What makes Wakad a top residential choice in Pune?',
        answer:
          'Wakad is strategically located between the Hinjewadi IT corridor and the Mumbai-Pune Expressway. It offers world-class social infrastructure including EuroSchool and Phoenix Mall of the Millennium, rapid transit, and a wide variety of gated high-rise developments.',
        isAiGenerated: false,
        approved: true,
      },
      {
        id: 'faq_wakad_2',
        question: 'What is the average property price per sq.ft in Wakad in 2026?',
        answer:
          'In 2026, the average property price in Wakad ranges from ₹8,200 to ₹9,600 per sq.ft, with premium high-rise luxury developments commanding up to ₹13,500 per sq.ft.',
        isAiGenerated: false,
        approved: true,
      },
      {
        id: 'faq_wakad_3',
        question: 'Is Wakad suitable for rental income investment?',
        answer:
          'Yes. Wakad maintains one of the highest rental yields in Pune (4.2% - 4.8% gross) due to persistent housing demand from tech professionals working in Hinjewadi Infotech Park.',
        isAiGenerated: false,
        approved: true,
      },
      {
        id: 'faq_wakad_4',
        question: 'Which metro line connects Wakad?',
        answer:
          'The upcoming Pune Metro Line 3 (Hinjewadi to Shivajinagar) features dedicated stations serving Wakad and Bhumkar Chowk, linking directly to Pune city center.',
        isAiGenerated: false,
        approved: true,
      },
    ],
    isVerified: true,
    isFeatured: true,
    lastUpdated: '2026-08-15',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
  },
  {
    id: 'loc_baner',
    slug: 'baner',
    name: 'Baner',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411045',
    localityType: 'MIXED_USE',
    categories: ['PREMIUM', 'RESIDENTIAL_HUB', 'POPULAR', 'INVESTMENT_HOTSPOT'],
    zoneId: 'WEST_PUNE',
    zoneName: 'West Pune',
    subLocalities: [
      { id: 'sub_baner_gaon', name: 'Baner Gaon', slug: 'baner-gaon', pincode: '411045', coordinates: { lat: 18.561, lng: 73.784 } },
      { id: 'sub_balewadi_phata', name: 'Balewadi Phata', slug: 'balewadi-phata', pincode: '411045', coordinates: { lat: 18.568, lng: 73.781 } },
    ],
    microLocations: [
      { id: 'road_baner_pashan_link', name: 'Baner-Pashan Link Road', slug: 'baner-pashan-link-road', type: 'ROAD', coordinates: { lat: 18.548, lng: 73.789 } },
    ],
    shortDescription: 'Upscale cosmopolitan residential and commercial hotspot famed for luxury high-rises, hills, and fine dining.',
    fullDescription:
      'Baner stands as West Pune’s most sophisticated residential and commercial micro-market. Bordered by the scenic Baner-Pashan Biodiversity Hills on one flank and Balewadi High Street on the other, Baner seamlessly blends natural serenity with high-energy urban glamour. Frequented by CXOs, tech founders, and affluent Pune families, the area boasts Michelin-vibe culinary avenues, boutique business towers, and premier gated communities offering panoramic hillside views and bespoke amenities.',
    developmentStatus: 'ESTABLISHED',
    coordinates: {
      lat: 18.559,
      lng: 73.7868,
    },
    coverImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    nearbyAreas: ['Balewadi', 'Aundh', 'Pashan', 'Wakad', 'Bavdhan', 'Sus'],
    connectivity: {
      highways: [
        { name: 'Baner Road (Direct Link to University / Shivajinagar)', type: 'HIGHWAY', distanceKm: 0.1, commuteMinutes: 1, status: 'OPERATIONAL' },
        { name: 'NH-48 Mumbai-Bengaluru Bypass', type: 'HIGHWAY', distanceKm: 0.8, commuteMinutes: 3, status: 'OPERATIONAL' },
      ],
      metro: [
        { name: 'Upcoming Baner Metro Station (Line 3)', type: 'METRO', distanceKm: 0.9, commuteMinutes: 2, status: 'UNDER_CONSTRUCTION' },
      ],
      railway: [
        { name: 'Pune Central Railway Station', type: 'RAILWAY', distanceKm: 12.5, commuteMinutes: 30, status: 'OPERATIONAL' },
      ],
      airport: [
        { name: 'Pune International Airport', type: 'AIRPORT', distanceKm: 18.2, commuteMinutes: 44, status: 'OPERATIONAL' },
      ],
      busConnectivity: 'Excellent connectivity via Baner Depot and high-frequency city transit.',
      employmentHubs: [
        { name: 'Baner Commercial IT Enclave & High Street Offices', distanceKm: 0.5, commuteMinutes: 2, companiesCount: 95 },
        { name: 'Hinjewadi Tech Park Phase 1', distanceKm: 6.5, commuteMinutes: 16, companiesCount: 220 },
        { name: 'Senapati Bapat Road Corporate Core', distanceKm: 7.8, commuteMinutes: 20, companiesCount: 70 },
      ],
    },
    socialInfrastructure: {
      schools: [
        { name: 'The Orchid School', category: 'SCHOOL', distanceKm: 1.4, rating: 4.8 },
        { name: 'VIBGYOR High School Balewadi', category: 'SCHOOL', distanceKm: 2.2, rating: 4.7 },
      ],
      hospitals: [
        { name: 'Jupiter Hospital', category: 'HOSPITAL', distanceKm: 1.5, rating: 4.9 },
        { name: 'Manipal Hospital Baner', category: 'HOSPITAL', distanceKm: 0.8, rating: 4.8 },
      ],
      malls: [
        { name: 'Westend Mall Aundh', category: 'MALL', distanceKm: 4.2, rating: 4.7 },
        { name: 'Balewadi High Street Boutiques', category: 'MALL', distanceKm: 1.2, rating: 4.9 },
      ],
      restaurants: [
        { name: 'The Urban Foundry & High Street Pubs', category: 'RESTAURANT', distanceKm: 1.1, rating: 4.8 },
        { name: 'Effingut Brewerkz & fine dining', category: 'RESTAURANT', distanceKm: 0.7, rating: 4.7 },
      ],
      parks: [
        { name: 'Baner Biodiversity Hill & Sunrise Trail', category: 'PARK', distanceKm: 0.4, rating: 4.9 },
      ],
    },
    lifestyleRating: {
      connectivity: 9.6,
      safety: 9.5,
      greenSpaces: 9.0,
      lifestyle: 9.8,
      education: 9.3,
      healthcare: 9.6,
      overallScore: 9.5,
    },
    priceIntelligence: {
      averagePricePerSqFt: 10450,
      priceRangeMin: 8900,
      priceRangeMax: 16800,
      yoyGrowthPercent: 9.2,
      rentalYieldPercent: 3.9,
      lastAuditedQuarter: 'Q2 2026',
      resaleAvgSqFt: 9800,
      newProjectAvgSqFt: 11400,
      historicalTrend: [
        { year: 2021, avgSqFt: 7800 },
        { year: 2022, avgSqFt: 8400 },
        { year: 2023, avgSqFt: 9100 },
        { year: 2024, avgSqFt: 9750 },
        { year: 2025, avgSqFt: 10100 },
        { year: 2026, avgSqFt: 10450 },
      ],
      categoryBreakdown: [
        { type: '3 BHK Premium Residences', avgSqFt: 10800 },
        { type: '4 BHK Ultra Luxury Condos', avgSqFt: 13500 },
        { type: 'Boutique Commercial Floors', avgSqFt: 17200 },
      ],
    },
    whyLiveHere: [
      {
        title: 'Premium High-Street Social Culture',
        description: 'Home to Balewadi High Street, Pune’s foremost pedestrian-friendly dining, lounge, and cultural strip.',
      },
      {
        title: 'Lush Biodiversity Hill Escapes',
        description: 'Wake up to fresh hill air and immediate access to Baner Hill walking and jogging trails.',
      },
      {
        title: 'Seamless Dual-Corridor Access',
        description: 'Effortless access both inwards to Shivaji Nagar / Central Pune and outwards to Hinjewadi & Mumbai.',
      },
    ],
    whoIsThisFor: [
      { persona: 'CXOs & Senior Leaders', description: 'Cosmopolitan high-end residential address with elite social status.', suitabilityPercent: 98 },
      { persona: 'Affluent Families', description: 'Proximity to top international schools, leading hospitals, and lifestyle hubs.', suitabilityPercent: 94 },
      { persona: 'Luxury Home Buyers', description: 'Penthouses and large format 3-4 BHK homes with panoramic hillside views.', suitabilityPercent: 95 },
    ],
    pros: [
      'High-end lifestyle and dining with Balewadi High Street in immediate proximity',
      'Scenic natural hill backdrop and cleaner air quality index',
      'Strong historical capital appreciation and premium resale liquidity',
    ],
    considerations: [
      'Higher entry barrier capital requirements compared to outer suburbs',
      'Limited land parcels remaining for new villa/independent developments',
    ],
    investmentOutlook: {
      appreciationRateYoY: 9.2,
      rentalYieldPercent: 3.9,
      futureDrivers: [
        'Operationalization of Baner Metro Station on Line 3',
        'Corporate headquarters shifting into Baner Commercial spine',
      ],
    },
    seo: {
      title: 'Luxury Properties in Baner Pune | Flats, Projects & Real Estate Trends',
      metaDescription:
        'Discover premium residential properties, luxury apartments, and penthouses in Baner, Pune. Review real-time price trends, lifestyle amenities, and investment potential.',
      h1: 'Baner Locality Intelligence & Luxury Living Guide',
      keywords: ['Property in Baner', 'Luxury flats in Baner', 'Baner Pune real estate', 'Baner property prices', 'Baner new projects'],
      canonicalUrl: 'https://kiaanproperties.com/localities/pune/baner',
    },
    faqs: [
      {
        id: 'faq_baner_1',
        question: 'Why is Baner considered one of Pune’s most premium residential areas?',
        answer:
          'Baner offers a rare combination of scenic hill topography, high-end fine dining, excellent educational institutions like The Orchid School, and rapid connectivity to Hinjewadi and Pune University.',
        isAiGenerated: false,
        approved: true,
      },
      {
        id: 'faq_baner_2',
        question: 'What is the price trend in Baner for 2026?',
        answer:
          'Average prices stand at ₹10,450 per sq.ft with 9.2% annual growth. Luxury projects with hill views reach ₹14,000 to ₹16,800 per sq.ft.',
        isAiGenerated: false,
        approved: true,
      },
    ],
    isVerified: true,
    isFeatured: true,
    lastUpdated: '2026-08-20',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'loc_hinjewadi',
    slug: 'hinjewadi',
    name: 'Hinjewadi',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411057',
    localityType: 'IT_HUB',
    categories: ['IT_HUB', 'COMMERCIAL_HUB', 'INVESTMENT_HOTSPOT', 'POPULAR'],
    zoneId: 'NORTH_PUNE_PCMC',
    zoneName: 'North Pune / PCMC',
    subLocalities: [
      { id: 'sub_hinjewadi_phase_1', name: 'Hinjewadi Phase I', slug: 'hinjewadi-phase-1', pincode: '411057', coordinates: { lat: 18.5925, lng: 73.7405 } },
      { id: 'sub_hinjewadi_phase_2', name: 'Hinjewadi Phase II', slug: 'hinjewadi-phase-2', pincode: '411057', coordinates: { lat: 18.598, lng: 73.725 } },
      { id: 'sub_hinjewadi_phase_3', name: 'Hinjewadi Phase III', slug: 'hinjewadi-phase-3', pincode: '411057', coordinates: { lat: 18.583, lng: 73.702 } },
      { id: 'sub_marunji', name: 'Marunji', slug: 'marunji', pincode: '411057', coordinates: { lat: 18.605, lng: 73.731 } },
      { id: 'sub_maan', name: 'Maan', slug: 'maan', pincode: '411057', coordinates: { lat: 18.588, lng: 73.715 } },
    ],
    shortDescription: 'India’s premier Silicon Valley of Maharashtra housing 400,000+ tech employees and Fortune 500 campuses.',
    fullDescription:
      'Hinjewadi is the economic heartbeat of Pune and the premier information technology capital of Maharashtra. Spanned across Phases 1, 2, and 3 of the sprawling Rajiv Gandhi Infotech Park, the locality accommodates multinational giants such as Infosys, Wipro, Tata Consultancy Services, Cognizant, and dozens of Global Capability Centers (GCCs). Accompanied by integrated townships, corporate hotels, and upcoming metro infrastructure, Hinjewadi represents an unmatched commercial real estate powerhouse and an extraordinary rental yield magnet.',
    developmentStatus: 'ESTABLISHED',
    coordinates: {
      lat: 18.5913,
      lng: 73.7389,
    },
    coverImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    nearbyAreas: ['Wakad', 'Marunji', 'Maan', 'Tathawade', 'Punawale'],
    connectivity: {
      highways: [
        { name: 'Hinjewadi Main Spine Road', type: 'HIGHWAY', distanceKm: 0.1, commuteMinutes: 1, status: 'OPERATIONAL' },
        { name: 'Mumbai-Pune Expressway Connect', type: 'HIGHWAY', distanceKm: 4.5, commuteMinutes: 10, status: 'OPERATIONAL' },
      ],
      metro: [
        { name: 'Upcoming Hinjewadi Phase 1 Metro Station (Line 3 Terminal)', type: 'METRO', distanceKm: 0.4, commuteMinutes: 1, status: 'UNDER_CONSTRUCTION' },
      ],
      railway: [
        { name: 'Chinchwad Station', type: 'RAILWAY', distanceKm: 9.2, commuteMinutes: 22, status: 'OPERATIONAL' },
      ],
      airport: [
        { name: 'Pune International Airport', type: 'AIRPORT', distanceKm: 25.0, commuteMinutes: 58, status: 'OPERATIONAL' },
      ],
      busConnectivity: 'Extensive corporate bus shuttle networks and PMPML depot.',
      employmentHubs: [
        { name: 'Rajiv Gandhi Infotech Park (400+ Enterprises)', distanceKm: 0.0, commuteMinutes: 0, companiesCount: 420 },
      ],
    },
    socialInfrastructure: {
      schools: [
        { name: 'Blue Ridge Public School', category: 'SCHOOL', distanceKm: 1.2, rating: 4.7 },
        { name: 'Pawar Public School Hinjewadi', category: 'SCHOOL', distanceKm: 2.1, rating: 4.6 },
      ],
      hospitals: [
        { name: 'Ruby Hall Clinic Hinjewadi', category: 'HOSPITAL', distanceKm: 0.8, rating: 4.8 },
        { name: 'Sanjeevani Hospital', category: 'HOSPITAL', distanceKm: 1.9, rating: 4.4 },
      ],
      malls: [
        { name: 'Xion Mall & Multiplex', category: 'MALL', distanceKm: 1.0, rating: 4.3 },
        { name: 'Grand Highstreet Hinjewadi', category: 'MALL', distanceKm: 1.8, rating: 4.5 },
      ],
      restaurants: [
        { name: 'Courtyard by Marriott MoMo Cafe', category: 'RESTAURANT', distanceKm: 0.5, rating: 4.8 },
        { name: 'Mezza9 Culinary Hub', category: 'RESTAURANT', distanceKm: 1.2, rating: 4.5 },
      ],
      parks: [
        { name: 'Mula-Mutha Riverfront & Hinjewadi Eco Trail', category: 'PARK', distanceKm: 1.5, rating: 4.3 },
      ],
    },
    lifestyleRating: {
      connectivity: 8.8,
      safety: 9.0,
      greenSpaces: 8.2,
      lifestyle: 8.7,
      education: 8.6,
      healthcare: 8.8,
      overallScore: 8.7,
    },
    priceIntelligence: {
      averagePricePerSqFt: 7650,
      priceRangeMin: 6200,
      priceRangeMax: 10800,
      yoyGrowthPercent: 10.4,
      rentalYieldPercent: 6.8,
      lastAuditedQuarter: 'Q2 2026',
      resaleAvgSqFt: 7100,
      newProjectAvgSqFt: 8400,
      historicalTrend: [
        { year: 2021, avgSqFt: 5300 },
        { year: 2022, avgSqFt: 5800 },
        { year: 2023, avgSqFt: 6400 },
        { year: 2024, avgSqFt: 6900 },
        { year: 2025, avgSqFt: 7300 },
        { year: 2026, avgSqFt: 7650 },
      ],
      categoryBreakdown: [
        { type: '1 & 2 BHK Studio / Apartments', avgSqFt: 7200 },
        { type: '3 BHK Township Residences', avgSqFt: 8200 },
        { type: 'Pre-Leased Grade-A Commercial', avgSqFt: 11400 },
      ],
    },
    whyLiveHere: [
      {
        title: 'Walk-to-Work Tech Lifestyle',
        description: 'Eliminate commute stress completely by living steps away from your tech campus.',
      },
      {
        title: 'Exceptional Commercial & Rental Yields',
        description: 'Industry-leading 6.5% to 8.4% gross yields for pre-leased corporate IT assets.',
      },
    ],
    whoIsThisFor: [
      { persona: 'Tech Employees & Engineers', description: 'Immediate proximity to workspaces and vibrant community.', suitabilityPercent: 98 },
      { persona: 'Commercial & Pre-Leased Investors', description: 'Institutional grade office spaces with Fortune 500 tenants.', suitabilityPercent: 95 },
      { persona: 'First-Time Investors', description: 'High occupancy rates with reliable tenant succession.', suitabilityPercent: 92 },
    ],
    pros: [
      'Direct walking distance to 400+ top tech campuses',
      'High rental yields with near 100% occupancy year-round',
      'Substantial upcoming infrastructure catalysts including Metro Line 3',
    ],
    considerations: [
      'Traffic bottlenecks at Shivaji Chowk during shift change hours',
    ],
    investmentOutlook: {
      appreciationRateYoY: 10.4,
      rentalYieldPercent: 6.8,
      futureDrivers: [
        'Hinjewadi-Shivajinagar Metro Line 3 inauguration',
        'Phase 4 tech park expansion and data center additions',
      ],
    },
    seo: {
      title: 'Properties in Hinjewadi Pune | IT Park Flats, Commercial & Projects',
      metaDescription:
        'Explore verified residential apartments, pre-leased commercial assets, and new projects in Hinjewadi, Pune. Live data on rental yields and price per sq.ft.',
      h1: 'Hinjewadi Locality Intelligence & IT Real Estate Hub',
      keywords: ['Property in Hinjewadi', 'Hinjewadi IT park flats', 'Pre-leased office Hinjewadi', 'Hinjewadi real estate prices'],
      canonicalUrl: 'https://kiaanproperties.com/localities/pune/hinjewadi',
    },
    faqs: [
      {
        id: 'faq_hinj_1',
        question: 'What is the rental yield in Hinjewadi?',
        answer:
          'Hinjewadi delivers some of Pune’s highest rental yields, ranging from 4.8% for residential apartments to 8.4% for pre-leased commercial IT spaces.',
        isAiGenerated: false,
        approved: true,
      },
    ],
    isVerified: true,
    isFeatured: true,
    lastUpdated: '2026-08-18',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-08-18T00:00:00.000Z',
  },
  {
    id: 'loc_balewadi',
    slug: 'balewadi',
    name: 'Balewadi',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411045',
    localityType: 'RESIDENTIAL',
    categories: ['PREMIUM', 'POPULAR', 'NEW_DEVELOPMENT', 'INVESTMENT_HOTSPOT'],
    zoneId: 'WEST_PUNE',
    zoneName: 'West Pune',
    subLocalities: [
      { id: 'sub_sports_complex', name: 'Shiv Chhatrapati Sports Complex Area', slug: 'balewadi-stadium-area', pincode: '411045', coordinates: { lat: 18.579, lng: 73.771 } },
    ],
    microLocations: [
      { id: 'road_balewadi_high_street', name: 'Balewadi High Street', slug: 'balewadi-high-street', type: 'ROAD', coordinates: { lat: 18.571, lng: 73.777 } },
    ],
    shortDescription: 'High-street luxury living along the Mula riverfront, renowned for sports complexes and upscale riverside residences.',
    fullDescription:
      'Balewadi has cemented its status as one of Pune’s most prestigious residential corridors. Renowned for Balewadi High Street, the iconic Shree Shiv Chhatrapati Sports Complex, and picturesque waterfront frontages along the Mula River, Balewadi offers an enviable balance of active athleticism and elite cosmopolitan culture. Top-tier developers including Kasturi Housing have raised the architectural benchmark with ultra-luxury riverside estates.',
    developmentStatus: 'ESTABLISHED',
    coordinates: {
      lat: 18.5786,
      lng: 73.7707,
    },
    coverImage:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    nearbyAreas: ['Baner', 'Wakad', 'Pimple Saudagar', 'Aundh'],
    connectivity: {
      highways: [
        { name: 'Mumbai-Bengaluru Highway (NH 48)', type: 'HIGHWAY', distanceKm: 0.5, commuteMinutes: 2, status: 'OPERATIONAL' },
        { name: 'Balewadi-Wakad Bridge', type: 'HIGHWAY', distanceKm: 1.0, commuteMinutes: 3, status: 'OPERATIONAL' },
      ],
      metro: [
        { name: 'Balewadi Metro Station (Line 3)', type: 'METRO', distanceKm: 0.8, commuteMinutes: 2, status: 'UNDER_CONSTRUCTION' },
      ],
      railway: [
        { name: 'Shivajinagar Station', type: 'RAILWAY', distanceKm: 11.0, commuteMinutes: 26, status: 'OPERATIONAL' },
      ],
      airport: [
        { name: 'Pune International Airport', type: 'AIRPORT', distanceKm: 19.5, commuteMinutes: 46, status: 'OPERATIONAL' },
      ],
      busConnectivity: 'Regular PMPML city bus services from Balewadi Gaon & Stadium.',
      employmentHubs: [
        { name: 'Balewadi High Street Business Parks', distanceKm: 0.6, commuteMinutes: 2, companiesCount: 60 },
        { name: 'Hinjewadi Tech Corridor', distanceKm: 5.8, commuteMinutes: 14, companiesCount: 220 },
      ],
    },
    socialInfrastructure: {
      schools: [
        { name: 'VIBGYOR High Balewadi', category: 'SCHOOL', distanceKm: 1.1, rating: 4.8 },
        { name: 'Bharati Vidyapeeth English Medium', category: 'SCHOOL', distanceKm: 1.6, rating: 4.5 },
      ],
      hospitals: [
        { name: 'Jupiter Hospital', category: 'HOSPITAL', distanceKm: 2.1, rating: 4.9 },
        { name: 'Aditya Birla Clinic Balewadi', category: 'HOSPITAL', distanceKm: 0.9, rating: 4.6 },
      ],
      malls: [
        { name: 'Balewadi High Street Retail', category: 'MALL', distanceKm: 0.5, rating: 4.9 },
        { name: 'Phoenix Mall of the Millennium', category: 'MALL', distanceKm: 2.5, rating: 4.9 },
      ],
      restaurants: [
        { name: 'Incognito Restaurant & Bar', category: 'RESTAURANT', distanceKm: 0.5, rating: 4.7 },
        { name: 'Terttulia Balewadi', category: 'RESTAURANT', distanceKm: 0.6, rating: 4.8 },
      ],
      parks: [
        { name: 'Shree Shiv Chhatrapati Sports Complex & Olympic Stadium', category: 'PARK', distanceKm: 0.8, rating: 4.9 },
        { name: 'Mula Riverfront Promenade', category: 'PARK', distanceKm: 0.3, rating: 4.6 },
      ],
    },
    lifestyleRating: {
      connectivity: 9.5,
      safety: 9.3,
      greenSpaces: 8.8,
      lifestyle: 9.7,
      education: 9.2,
      healthcare: 9.3,
      overallScore: 9.4,
    },
    priceIntelligence: {
      averagePricePerSqFt: 11200,
      priceRangeMin: 9200,
      priceRangeMax: 17500,
      yoyGrowthPercent: 9.6,
      rentalYieldPercent: 4.1,
      lastAuditedQuarter: 'Q2 2026',
      resaleAvgSqFt: 10200,
      newProjectAvgSqFt: 12100,
      historicalTrend: [
        { year: 2021, avgSqFt: 8100 },
        { year: 2022, avgSqFt: 8800 },
        { year: 2023, avgSqFt: 9600 },
        { year: 2024, avgSqFt: 10300 },
        { year: 2025, avgSqFt: 10800 },
        { year: 2026, avgSqFt: 11200 },
      ],
      categoryBreakdown: [
        { type: '3 & 4 BHK Riverside Condos', avgSqFt: 12500 },
        { type: 'Balewadi High Street Retail', avgSqFt: 18500 },
      ],
    },
    whyLiveHere: [
      {
        title: 'Riverfront Panoramic Tranquility',
        description: 'Unobstructed scenic water and green canopy views along the Mula river bend.',
      },
      {
        title: 'International Sports & Fitness Capital',
        description: 'Olympic athletic tracks, badminton academies, tennis, and aquatic stadiums at your doorstep.',
      },
    ],
    whoIsThisFor: [
      { persona: 'Lifestyle & Luxury Connoisseurs', description: 'Looking for riverside serenity with high street dining minutes away.', suitabilityPercent: 96 },
      { persona: 'Sports Enthusiasts & Active Families', description: 'Access to Olympic grade facilities and youth sports coaching.', suitabilityPercent: 95 },
    ],
    pros: [
      'Iconic riverside developments like The Balmoral Riverside',
      'Immediate access to Balewadi High Street nightlife and cafes',
      'Quick transit to both Hinjewadi IT park and central Pune',
    ],
    considerations: [
      'High price brackets in premier riverside and High Street belts',
    ],
    investmentOutlook: {
      appreciationRateYoY: 9.6,
      rentalYieldPercent: 4.1,
      futureDrivers: [
        'Completion of the Mula Riverfront Beautification and Promenade project',
        'Metro Line 3 Balewadi Stadium Station commencement',
      ],
    },
    seo: {
      title: 'Properties in Balewadi Pune | Riverside Condos & Balewadi High Street Flats',
      metaDescription:
        'Explore luxury properties, apartments, and riverside residences in Balewadi, Pune. Check live price trends, projects, and amenities.',
      h1: 'Balewadi Locality Intelligence & Riverside Living',
      keywords: ['Property in Balewadi', 'Flats near Balewadi High Street', 'Balewadi luxury projects', 'Balewadi real estate'],
      canonicalUrl: 'https://kiaanproperties.com/localities/pune/balewadi',
    },
    faqs: [
      {
        id: 'faq_balewadi_1',
        question: 'What makes Balewadi a premier residential locality?',
        answer:
          'Balewadi uniquely offers riverside natural vistas alongside high-street dining, Olympic sports infrastructure, and rapid highway connectivity.',
        isAiGenerated: false,
        approved: true,
      },
    ],
    isVerified: true,
    isFeatured: true,
    lastUpdated: '2026-08-22',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-08-22T00:00:00.000Z',
  },
  {
    id: 'loc_koregaon_park',
    slug: 'koregaon-park',
    name: 'Koregaon Park',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411001',
    localityType: 'RESIDENTIAL',
    categories: ['PREMIUM', 'POPULAR', 'INVESTMENT_HOTSPOT'],
    zoneId: 'CENTRAL_PUNE',
    zoneName: 'Central Pune',
    subLocalities: [
      { id: 'sub_kp_lanes', name: 'Lane 5 & Lane 7 Residential Enclave', slug: 'kp-lane-5-7', pincode: '411001', coordinates: { lat: 18.537, lng: 73.8945 } },
    ],
    microLocations: [
      { id: 'road_north_main_road', name: 'North Main Road', slug: 'north-main-road', type: 'ROAD', coordinates: { lat: 18.5385, lng: 73.8965 } },
      { id: 'road_south_main_road', name: 'South Main Road', slug: 'south-main-road', type: 'ROAD', coordinates: { lat: 18.534, lng: 73.892 } },
    ],
    shortDescription: 'Pune’s most legendary ultra-luxury address featuring heritage banyan avenues, fine dining, and elite estates.',
    fullDescription:
      'Koregaon Park (KP) is the undisputed crown jewel of Pune luxury real estate. Famed across India and internationally for its peaceful leafy tree-canopied lanes (Numbered North and South Main Roads), the Osho International Meditation Resort, and German Bakery heritage, Koregaon Park represents the pinnacle of aristocratic Pune living. Home to industrial royalty, international diplomats, and distinguished artists, KP commands the highest residential capital values in the city.',
    developmentStatus: 'ESTABLISHED',
    coordinates: {
      lat: 18.5362,
      lng: 73.894,
    },
    coverImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    nearbyAreas: ['Kalyani Nagar', 'Camp', 'Viman Nagar', 'Bund Garden', 'Boat Club Road'],
    connectivity: {
      highways: [
        { name: 'North Main Road & South Main Road Arterials', type: 'HIGHWAY', distanceKm: 0.1, commuteMinutes: 1, status: 'OPERATIONAL' },
        { name: 'Bund Garden Bridge', type: 'HIGHWAY', distanceKm: 1.2, commuteMinutes: 3, status: 'OPERATIONAL' },
      ],
      metro: [
        { name: 'Ruby Hall Clinic Metro Station (Aqua Line)', type: 'METRO', distanceKm: 2.1, commuteMinutes: 6, status: 'OPERATIONAL' },
      ],
      railway: [
        { name: 'Pune Central Railway Station', type: 'RAILWAY', distanceKm: 3.5, commuteMinutes: 10, status: 'OPERATIONAL' },
      ],
      airport: [
        { name: 'Pune International Airport (Viman Nagar)', type: 'AIRPORT', distanceKm: 5.8, commuteMinutes: 14, status: 'OPERATIONAL' },
      ],
      busConnectivity: 'Direct connectivity to Camp, Station, and Kalyani Nagar.',
      employmentHubs: [
        { name: 'Kalyani Nagar Tech Parks & Trump Towers Hub', distanceKm: 1.5, commuteMinutes: 4, companiesCount: 80 },
        { name: 'Cerebrum IT Park', distanceKm: 2.2, commuteMinutes: 6, companiesCount: 45 },
      ],
    },
    socialInfrastructure: {
      schools: [
        { name: 'St. Mira’s Girls College & High School', category: 'SCHOOL', distanceKm: 1.8, rating: 4.8 },
        { name: 'The Bishop’s School Camp', category: 'SCHOOL', distanceKm: 3.4, rating: 4.9 },
      ],
      hospitals: [
        { name: 'Jehangir Hospital & Ruby Hall Clinic', category: 'HOSPITAL', distanceKm: 2.4, rating: 4.9 },
        { name: 'Inlaks and Budhrani Hospital', category: 'HOSPITAL', distanceKm: 0.6, rating: 4.7 },
      ],
      malls: [
        { name: 'Niteesh Mall & Lifestyle Boutiques', category: 'MALL', distanceKm: 0.5, rating: 4.8 },
        { name: 'Phoenix Marketcity Viman Nagar', category: 'MALL', distanceKm: 5.0, rating: 4.9 },
      ],
      restaurants: [
        { name: 'German Bakery, Arthur’s Theme & Sante Spa', category: 'RESTAURANT', distanceKm: 0.2, rating: 4.9 },
        { name: 'Malaka Spice & Boteco', category: 'RESTAURANT', distanceKm: 0.4, rating: 4.8 },
      ],
      parks: [
        { name: 'Osho Teerth Peace Park & Zen Garden', category: 'PARK', distanceKm: 0.3, rating: 5.0 },
        { name: 'Bund Garden Riverside Park', category: 'PARK', distanceKm: 1.1, rating: 4.6 },
      ],
    },
    lifestyleRating: {
      connectivity: 9.8,
      safety: 9.8,
      greenSpaces: 9.9,
      lifestyle: 10.0,
      education: 9.5,
      healthcare: 9.7,
      overallScore: 9.8,
    },
    priceIntelligence: {
      averagePricePerSqFt: 18500,
      priceRangeMin: 14500,
      priceRangeMax: 29000,
      yoyGrowthPercent: 7.8,
      rentalYieldPercent: 3.6,
      lastAuditedQuarter: 'Q2 2026',
      resaleAvgSqFt: 17200,
      newProjectAvgSqFt: 21500,
      historicalTrend: [
        { year: 2021, avgSqFt: 13800 },
        { year: 2022, avgSqFt: 14900 },
        { year: 2023, avgSqFt: 16100 },
        { year: 2024, avgSqFt: 17200 },
        { year: 2025, avgSqFt: 17900 },
        { year: 2026, avgSqFt: 18500 },
      ],
      categoryBreakdown: [
        { type: 'Luxury High-Rise Penthouse', avgSqFt: 22000 },
        { type: 'Signature Bungalow Estates', avgSqFt: 27500 },
      ],
    },
    whyLiveHere: [
      {
        title: 'Unrivaled Heritage & Prestige',
        description: 'The definitive luxury address of Pune with world-renowned Osho Zen gardens and historic green avenues.',
      },
      {
        title: '14-Minute Transit to International Airport',
        description: 'Prime central-east location affording lightning-fast airport and central business district access.',
      },
    ],
    whoIsThisFor: [
      { persona: 'Ultra-High-Net-Worth Individuals (UHNIs)', description: 'Seeking trophy assets and peerless lifestyle standards.', suitabilityPercent: 99 },
      { persona: 'NRIs & Global Citizens', description: 'Familiar international ambiance with botanical serenity.', suitabilityPercent: 97 },
    ],
    pros: [
      'Peerless luxury heritage with strict architectural and green zoning',
      'Walking distance to top-rated international bistros and zen gardens',
      'Extremely limited supply ensuring immense wealth preservation',
    ],
    considerations: [
      'Very high capital threshold per sq.ft',
      'Selective property availability in North Main Road lanes',
    ],
    investmentOutlook: {
      appreciationRateYoY: 7.8,
      rentalYieldPercent: 3.6,
      futureDrivers: [
        'Scarce new supply maintaining high prestige premium',
        'Consul and expat tenant preference sustaining highest rental rates per sq.ft',
      ],
    },
    seo: {
      title: 'Luxury Properties in Koregaon Park Pune | Bungalows & Penthouses',
      metaDescription:
        'Explore exclusive estates, luxury penthouses, and heritage apartments in Koregaon Park, Pune. Full intelligence on price per sq.ft and trophy assets.',
      h1: 'Koregaon Park Real Estate & Ultra-Luxury Locality Guide',
      keywords: ['Property in Koregaon Park', 'Koregaon Park penthouses', 'Bungalows in Koregaon Park', 'KP real estate prices'],
      canonicalUrl: 'https://kiaanproperties.com/localities/pune/koregaon-park',
    },
    faqs: [
      {
        id: 'faq_kp_1',
        question: 'What is the average price of a property in Koregaon Park?',
        answer:
          'Koregaon Park averages ₹18,500 per sq.ft, with premium boutique developments and standalone estates reaching ₹25,000 to ₹29,000 per sq.ft.',
        isAiGenerated: false,
        approved: true,
      },
    ],
    isVerified: true,
    isFeatured: true,
    lastUpdated: '2026-08-25',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-08-25T00:00:00.000Z',
  },
  {
    id: 'loc_kharadi',
    slug: 'kharadi',
    name: 'Kharadi',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411014',
    localityType: 'MIXED_USE',
    categories: ['IT_HUB', 'EMERGING', 'POPULAR', 'INVESTMENT_HOTSPOT'],
    zoneId: 'EAST_PUNE',
    zoneName: 'East Pune',
    subLocalities: [
      { id: 'sub_ashoka_nagar', name: 'Ashoka Nagar', slug: 'ashoka-nagar-kharadi', pincode: '411014', coordinates: { lat: 18.548, lng: 73.932 } },
      { id: 'sub_kharadi_annexe', name: 'Kharadi Annexe', slug: 'kharadi-annexe', pincode: '412207', coordinates: { lat: 18.562, lng: 73.948 } },
    ],
    microLocations: [
      { id: 'road_kharadi_bypass', name: 'Kharadi Bypass Road', slug: 'kharadi-bypass-road', type: 'ROAD', coordinates: { lat: 18.556, lng: 73.939 } },
    ],
    shortDescription: 'Eastern Pune’s corporate and IT powerhouse home to EON Free Zone, WTC, and premium high-rise townships.',
    fullDescription:
      'Kharadi is East Pune’s marquee commercial and residential epicentre. Powered by massive Special Economic Zones including EON Free Zone and the World Trade Center (WTC) Pune, Kharadi employs over 150,000 software professionals. The locality offers integrated luxury townships with world-class amenities, close proximity to Pune Airport, and high rental appreciation.',
    developmentStatus: 'ESTABLISHED',
    coordinates: {
      lat: 18.5514,
      lng: 73.9348,
    },
    coverImage:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    nearbyAreas: ['Viman Nagar', 'Kalyani Nagar', 'Wagholi', 'Magarpatta City', 'Hadapsar'],
    connectivity: {
      highways: [
        { name: 'Kharadi-Hadapsar Bypass Road', type: 'HIGHWAY', distanceKm: 0.2, commuteMinutes: 1, status: 'OPERATIONAL' },
        { name: 'Pune-Ahmednagar Highway', type: 'HIGHWAY', distanceKm: 1.5, commuteMinutes: 4, status: 'OPERATIONAL' },
      ],
      metro: [
        { name: 'Upcoming Ramwadi to Kharadi Metro Extension', type: 'METRO', distanceKm: 2.0, commuteMinutes: 5, status: 'UNDER_CONSTRUCTION' },
      ],
      railway: [
        { name: 'Pune Central Station', type: 'RAILWAY', distanceKm: 11.5, commuteMinutes: 28, status: 'OPERATIONAL' },
      ],
      airport: [
        { name: 'Pune International Airport (Viman Nagar)', type: 'AIRPORT', distanceKm: 8.5, commuteMinutes: 18, status: 'OPERATIONAL' },
      ],
      busConnectivity: 'Direct PMPML air-conditioned buses to Railway Station, Hinjewadi, and Camp.',
      employmentHubs: [
        { name: 'EON Free Zone IT SEZ', distanceKm: 0.5, commuteMinutes: 2, companiesCount: 160 },
        { name: 'World Trade Center (WTC) Pune', distanceKm: 0.6, commuteMinutes: 2, companiesCount: 90 },
      ],
    },
    socialInfrastructure: {
      schools: [
        { name: 'Podar International School', category: 'SCHOOL', distanceKm: 1.2, rating: 4.7 },
        { name: 'Victorious Kidss Educares (IB World School)', category: 'SCHOOL', distanceKm: 1.8, rating: 4.8 },
      ],
      hospitals: [
        { name: 'Manipal Hospital Kharadi', category: 'HOSPITAL', distanceKm: 1.0, rating: 4.8 },
        { name: 'Motherhood Hospital', category: 'HOSPITAL', distanceKm: 1.4, rating: 4.6 },
      ],
      malls: [
        { name: 'Phoenix Marketcity Viman Nagar', category: 'MALL', distanceKm: 4.5, rating: 4.9 },
      ],
      restaurants: [
        { name: 'Radisson Blu Fine Dining & The Great Kabab Factory', category: 'RESTAURANT', distanceKm: 0.8, rating: 4.7 },
      ],
      parks: [
        { name: 'Mula-Mutha Riverfront Park Kharadi', category: 'PARK', distanceKm: 1.1, rating: 4.4 },
      ],
    },
    lifestyleRating: {
      connectivity: 9.3,
      safety: 9.1,
      greenSpaces: 8.2,
      lifestyle: 9.2,
      education: 9.1,
      healthcare: 9.3,
      overallScore: 9.1,
    },
    priceIntelligence: {
      averagePricePerSqFt: 9650,
      priceRangeMin: 7800,
      priceRangeMax: 14200,
      yoyGrowthPercent: 9.8,
      rentalYieldPercent: 4.9,
      lastAuditedQuarter: 'Q2 2026',
      resaleAvgSqFt: 8900,
      newProjectAvgSqFt: 10400,
      historicalTrend: [
        { year: 2021, avgSqFt: 6900 },
        { year: 2022, avgSqFt: 7500 },
        { year: 2023, avgSqFt: 8200 },
        { year: 2024, avgSqFt: 8900 },
        { year: 2025, avgSqFt: 9350 },
        { year: 2026, avgSqFt: 9650 },
      ],
      categoryBreakdown: [
        { type: '2 & 3 BHK High-Rise Condominiums', avgSqFt: 9400 },
        { type: 'Grade A Tech SEZ Commercial', avgSqFt: 14500 },
      ],
    },
    whyLiveHere: [
      {
        title: 'Walk-to-Work in East Pune Tech Hub',
        description: 'Direct proximity to EON Free Zone and WTC Pune.',
      },
      {
        title: '18-Minute Transit to International Airport',
        description: 'Ideal for frequent domestic and international flyers.',
      },
    ],
    whoIsThisFor: [
      { persona: 'East Pune IT Executives', description: 'Top work-life integration in modern high-rises.', suitabilityPercent: 95 },
      { persona: 'Rental Investors', description: 'Exceptional tenancy demand from multinational corporate employees.', suitabilityPercent: 94 },
    ],
    pros: [
      'Massive employment density with EON IT Park and WTC',
      'Superb proximity to airport and upscale Viman Nagar / Kalyani Nagar',
      'Strong institutional grade developers with master-planned townships',
    ],
    considerations: [
      'Ahmednagar road traffic congestion at peak commuter times',
    ],
    investmentOutlook: {
      appreciationRateYoY: 9.8,
      rentalYieldPercent: 4.9,
      futureDrivers: [
        'Ramwadi to Kharadi Metro extension',
        'Riverfront rejuvenation and bridge connections to Magarpatta',
      ],
    },
    seo: {
      title: 'Properties in Kharadi Pune | EON IT Park Flats & Price Trends',
      metaDescription:
        'Find verified apartments, resale flats, and new projects in Kharadi, Pune. Explore price trends, rental yields, and EON IT Park proximity.',
      h1: 'Kharadi Locality Intelligence & East Pune Real Estate',
      keywords: ['Property in Kharadi', 'Flats near EON Free Zone', 'Kharadi Pune real estate', 'Kharadi property prices'],
      canonicalUrl: 'https://kiaanproperties.com/localities/pune/kharadi',
    },
    faqs: [
      {
        id: 'faq_kharadi_1',
        question: 'Why invest in Kharadi real estate?',
        answer:
          'Kharadi combines high rental yields (~4.9%) with massive job concentration at EON Free Zone and World Trade Center, making it the premier East Pune investment corridor.',
        isAiGenerated: false,
        approved: true,
      },
    ],
    isVerified: true,
    isFeatured: true,
    lastUpdated: '2026-08-20',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'loc_tathawade',
    slug: 'tathawade',
    name: 'Tathawade',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411033',
    localityType: 'RESIDENTIAL',
    categories: ['AFFORDABLE', 'EMERGING', 'NEW_DEVELOPMENT', 'INVESTMENT_HOTSPOT'],
    zoneId: 'NORTH_PUNE_PCMC',
    zoneName: 'North Pune / PCMC',
    subLocalities: [],
    microLocations: [
      { id: 'road_jspm_campus', name: 'JSPM Campus Road', slug: 'jspm-campus-road', type: 'ROAD', coordinates: { lat: 18.619, lng: 73.754 } },
      { id: 'road_nh48_tathawade', name: 'NH-48 Tathawade Service Road', slug: 'nh48-tathawade-service-road', type: 'ROAD', coordinates: { lat: 18.615, lng: 73.758 } },
    ],
    shortDescription: 'Rapidly emerging education and residential hotspot offering competitive pricing next to Hinjewadi and Expressway.',
    fullDescription:
      'Tathawade is one of West Pune’s most promising emerging residential hubs. Positioned immediately adjacent to Wakad and Hinjewadi, Tathawade has become renowned as an educational and residential corridor hosting premier institutions like Indira Institute and D.Y. Patil Knowledge City. Offering modern gated communities at more accessible entry pricing than core Wakad or Baner, Tathawade is a magnet for young first-time home buyers and capital growth investors.',
    developmentStatus: 'GROWING',
    coordinates: {
      lat: 18.6186,
      lng: 73.7548,
    },
    coverImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    nearbyAreas: ['Wakad', 'Punawale', 'Ravet', 'Hinjewadi', 'Nigdi Pradhikaran'],
    connectivity: {
      highways: [
        { name: 'Mumbai-Pune Expressway Direct Slip', type: 'HIGHWAY', distanceKm: 1.0, commuteMinutes: 3, status: 'OPERATIONAL' },
        { name: 'Aundh-Ravet BRTS Corridor', type: 'HIGHWAY', distanceKm: 0.5, commuteMinutes: 2, status: 'OPERATIONAL' },
      ],
      metro: [
        { name: 'Upcoming Metro Line 3 Extension / Bhumkar Chowk', type: 'METRO', distanceKm: 2.8, commuteMinutes: 7, status: 'UNDER_CONSTRUCTION' },
      ],
      railway: [
        { name: 'Akurdi Railway Station', type: 'RAILWAY', distanceKm: 4.8, commuteMinutes: 12, status: 'OPERATIONAL' },
      ],
      airport: [
        { name: 'Pune International Airport', type: 'AIRPORT', distanceKm: 23.5, commuteMinutes: 52, status: 'OPERATIONAL' },
      ],
      busConnectivity: 'Aundh-Ravet BRTS dedicated corridor buses running every 5 minutes.',
      employmentHubs: [
        { name: 'Hinjewadi IT Corridor', distanceKm: 4.2, commuteMinutes: 11, companiesCount: 220 },
      ],
    },
    socialInfrastructure: {
      schools: [
        { name: 'Indira National School', category: 'SCHOOL', distanceKm: 0.8, rating: 4.7 },
        { name: 'JSPM Blossom Public School', category: 'SCHOOL', distanceKm: 1.1, rating: 4.6 },
      ],
      hospitals: [
        { name: 'Aditya Birla Memorial Hospital', category: 'HOSPITAL', distanceKm: 3.2, rating: 4.8 },
      ],
      malls: [
        { name: 'Phoenix Mall of the Millennium (Wakad)', category: 'MALL', distanceKm: 2.9, rating: 4.9 },
      ],
      restaurants: [
        { name: 'Sayaji Hotel & Wakad Boulevards', category: 'RESTAURANT', distanceKm: 2.4, rating: 4.6 },
      ],
      parks: [
        { name: 'Thergaon Boat Club & Botanical Garden', category: 'PARK', distanceKm: 2.2, rating: 4.5 },
      ],
    },
    lifestyleRating: {
      connectivity: 8.9,
      safety: 8.8,
      greenSpaces: 8.5,
      lifestyle: 8.3,
      education: 9.5,
      healthcare: 8.7,
      overallScore: 8.8,
    },
    priceIntelligence: {
      averagePricePerSqFt: 6950,
      priceRangeMin: 5600,
      priceRangeMax: 8800,
      yoyGrowthPercent: 11.2,
      rentalYieldPercent: 4.7,
      lastAuditedQuarter: 'Q2 2026',
      resaleAvgSqFt: 6400,
      newProjectAvgSqFt: 7400,
      historicalTrend: [
        { year: 2021, avgSqFt: 4800 },
        { year: 2022, avgSqFt: 5250 },
        { year: 2023, avgSqFt: 5800 },
        { year: 2024, avgSqFt: 6300 },
        { year: 2025, avgSqFt: 6650 },
        { year: 2026, avgSqFt: 6950 },
      ],
      categoryBreakdown: [
        { type: '2 BHK Smart Value Homes', avgSqFt: 6700 },
        { type: '3 BHK Lifestyle Condominiums', avgSqFt: 7400 },
      ],
    },
    whyLiveHere: [
      {
        title: 'Outstanding Value for Money',
        description: '20-25% lower price point per sq.ft compared to immediate neighbor Wakad, with equal expressway connectivity.',
      },
      {
        title: 'Education Capital of West Pune',
        description: 'Home to top engineering, management, and international schooling campuses.',
      },
    ],
    whoIsThisFor: [
      { persona: 'First-Time Home Buyers', description: 'Affordable modern 2 & 3 BHKs with clubhouse amenities.', suitabilityPercent: 96 },
      { persona: 'Young IT Couples', description: 'Short daily commute to Hinjewadi with lower EMIs.', suitabilityPercent: 94 },
    ],
    pros: [
      'Accessible ticket sizes for quality gated community residences',
      'Highest YoY capital appreciation rate in West Pune corridor (11.2%)',
      'Direct BRTS connectivity to Pune university and expressway',
    ],
    considerations: [
      'Internal road widening underway in certain developing sectors',
    ],
    investmentOutlook: {
      appreciationRateYoY: 11.2,
      rentalYieldPercent: 4.7,
      futureDrivers: [
        'Complete integration with PCMC smart city road network',
        'Expanding student and tech professional rental pool',
      ],
    },
    seo: {
      title: 'Affordable Properties in Tathawade Pune | New Flats & Projects',
      metaDescription:
        'Discover affordable and emerging residential properties in Tathawade, Pune. Review real estate price trends, Indira College proximity, and projects.',
      h1: 'Tathawade Locality Intelligence & Growth Guide',
      keywords: ['Property in Tathawade', 'Flats in Tathawade Pune', 'Tathawade real estate prices', 'Affordable homes Hinjewadi border'],
      canonicalUrl: 'https://kiaanproperties.com/localities/pune/tathawade',
    },
    faqs: [
      {
        id: 'faq_tath_1',
        question: 'Is Tathawade a good investment in 2026?',
        answer:
          'Yes. Tathawade offers the highest capital growth rate (11.2% YoY) in West Pune due to its lower cost base, educational hub status, and direct proximity to Wakad and Hinjewadi.',
        isAiGenerated: false,
        approved: true,
      },
    ],
    isVerified: true,
    isFeatured: false,
    lastUpdated: '2026-08-15',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
  },
];

export const INITIAL_LOCALITIES: Locality[] = [...PRIMARY_LOCALITIES, ...ADDITIONAL_LOCALITIES];

