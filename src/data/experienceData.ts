/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PreLeaseAsset,
  KiaanPickData,
  OpportunityItem,
  PropertyPersonalityExplanation,
  PropertyReviewItem,
  GroundedFaqItem,
  TrustCenterData,
  StructuredAnalyticsEvent,
  WebsiteAnalyticsDashboardMetrics,
} from '../types';

// ============================================================
// 110. PRE-LEASE HIGH-YIELD COMMERCIAL ASSETS
// ============================================================

export const SEED_PRE_LEASE_ASSETS: PreLeaseAsset[] = [
  {
    id: 'pre_lease_hinjewadi_p1',
    assetTitle: 'Infosys & Cisco Anchor Commercial Floor',
    propertyType: 'COMMERCIAL_OFFICE',
    location: {
      id: 'loc_hinj_p1',
      microMarket: 'Hinjewadi Phase 1',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411057',
      coordinates: { lat: 18.5913, lng: 73.7389 },
      address: 'Plot 14, Rajiv Gandhi Infotech Park, Phase 1, Hinjewadi',
      landmarks: [
        { name: 'Infosys Main Campus', type: 'IT_PARK', distanceKm: 0.2, commuteMinutes: 2 },
        { name: 'Metro Line 3 Station', type: 'METRO', distanceKm: 0.4, commuteMinutes: 4 },
        { name: 'Mumbai-Pune Expressway', type: 'HIGHWAY', distanceKm: 2.1, commuteMinutes: 6 },
      ],
    },
    carpetAreaSqFt: 18500,
    tenantName: 'Cisco Systems India Pvt Ltd',
    tenantIndustry: 'Enterprise Networking & Cloud Infrastructure',
    tenantCreditRating: 'CRISIL AAA (Fortune 500 US)',
    currentMonthlyRentINR: 1757500, // ₹95 / sq.ft
    rentPerSqFtINR: 95,
    annualEscalationPercent: 5.0,
    lockInPeriodYears: 5,
    lockInExpiresDate: '31 Dec 2028',
    overallLeaseExpiryDate: '31 Dec 2033',
    securityDepositMonths: 6,
    grossRentalYieldPercent: 8.64,
    netRentalYieldPercent: 8.12,
    purchasePriceINR: 244000000, // ₹24.40 Cr
    pricePerSqFtINR: 13189,
    camChargesPerSqFtINR: 12,
    propertyTaxResponsibility: 'TENANT',
    fitoutInvestmentByTenantINR: 42000000,
    scenarioReturns: {
      baseCase: {
        scenarioName: 'BASE_CASE',
        label: 'Base Case (Standard 5% Escalation)',
        assumedAnnualRentEscalationPercent: 5.0,
        assumedCapitalAppreciationCagrPercent: 7.5,
        assumedVacancyMonthsOver10Yrs: 0,
        fiveYearGrossRentalIncomeINR: 116450000,
        fiveYearEstimatedCapitalGainINR: 106200000,
        fiveYearTotalNetReturnINR: 222650000,
        fiveYearIrrPercent: 15.8,
        tenYearTotalNetWealthCreatedINR: 512000000,
        tenYearIrrPercent: 16.4,
      },
      bullCase: {
        scenarioName: 'BULL_CASE',
        label: 'Bull Case (Metro Corridor Expansion & Re-leasing at +15%)',
        assumedAnnualRentEscalationPercent: 6.5,
        assumedCapitalAppreciationCagrPercent: 10.0,
        assumedVacancyMonthsOver10Yrs: 0,
        fiveYearGrossRentalIncomeINR: 124800000,
        fiveYearEstimatedCapitalGainINR: 148900000,
        fiveYearTotalNetReturnINR: 273700000,
        fiveYearIrrPercent: 19.2,
        tenYearTotalNetWealthCreatedINR: 678000000,
        tenYearIrrPercent: 20.1,
      },
      bearCase: {
        scenarioName: 'BEAR_CASE',
        label: 'Conservative (3-Month Transition Vacancy in Year 6)',
        assumedAnnualRentEscalationPercent: 4.0,
        assumedCapitalAppreciationCagrPercent: 5.0,
        assumedVacancyMonthsOver10Yrs: 3,
        fiveYearGrossRentalIncomeINR: 111200000,
        fiveYearEstimatedCapitalGainINR: 67400000,
        fiveYearTotalNetReturnINR: 178600000,
        fiveYearIrrPercent: 12.9,
        tenYearTotalNetWealthCreatedINR: 384000000,
        tenYearIrrPercent: 13.5,
      },
    },
    keyFeatures: [
      'Grade A+ LEED Platinum certified IT park',
      'Dual 100% DG power backup & 8 high-speed Otis passenger elevators',
      'Direct skywalk connectivity to Hinjewadi Metro Line 3',
      'Triple net lease structure: tenant bears maintenance, property tax & utilities',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    reraRegNumber: 'P52100039841',
  },
  {
    id: 'pre_lease_baner_retail_p2',
    assetTitle: 'Balewadi High Street Flagship QSR & Luxury Retail',
    propertyType: 'HIGH_STREET_RETAIL',
    location: {
      id: 'loc_baner_hs',
      microMarket: 'Baner',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045',
      coordinates: { lat: 18.5721, lng: 73.7842 },
      address: 'Main Balewadi High Street Boulevard, Baner',
      landmarks: [
        { name: 'Balewadi High Street Hub', type: 'MALL', distanceKm: 0.1, commuteMinutes: 1 },
        { name: 'Mumbai-Bangalore Bypass', type: 'HIGHWAY', distanceKm: 0.8, commuteMinutes: 3 },
      ],
    },
    carpetAreaSqFt: 6200,
    tenantName: 'Starbucks Coffee & Tata Consumer Brands',
    tenantIndustry: 'Global Food & Beverage Retail',
    tenantCreditRating: 'CRISIL AAA / Tata Group JV',
    currentMonthlyRentINR: 992000, // ₹160 / sq.ft
    rentPerSqFtINR: 160,
    annualEscalationPercent: 5.0,
    lockInPeriodYears: 6,
    lockInExpiresDate: '30 Jun 2030',
    overallLeaseExpiryDate: '30 Jun 2035',
    securityDepositMonths: 9,
    grossRentalYieldPercent: 8.93,
    netRentalYieldPercent: 8.45,
    purchasePriceINR: 133200000, // ₹13.32 Cr
    pricePerSqFtINR: 21483,
    camChargesPerSqFtINR: 18,
    propertyTaxResponsibility: 'TENANT',
    fitoutInvestmentByTenantINR: 28000000,
    scenarioReturns: {
      baseCase: {
        scenarioName: 'BASE_CASE',
        label: 'Base Case (5% Annual Escalation + 8.5% High-Street Growth)',
        assumedAnnualRentEscalationPercent: 5.0,
        assumedCapitalAppreciationCagrPercent: 8.5,
        assumedVacancyMonthsOver10Yrs: 0,
        fiveYearGrossRentalIncomeINR: 65700000,
        fiveYearEstimatedCapitalGainINR: 67100000,
        fiveYearTotalNetReturnINR: 132800000,
        fiveYearIrrPercent: 17.2,
        tenYearTotalNetWealthCreatedINR: 314000000,
        tenYearIrrPercent: 17.9,
      },
      bullCase: {
        scenarioName: 'BULL_CASE',
        label: 'Bull Case (Footfall Surge + 12% Capital Revaluation)',
        assumedAnnualRentEscalationPercent: 6.0,
        assumedCapitalAppreciationCagrPercent: 12.0,
        assumedVacancyMonthsOver10Yrs: 0,
        fiveYearGrossRentalIncomeINR: 69400000,
        fiveYearEstimatedCapitalGainINR: 101500000,
        fiveYearTotalNetReturnINR: 170900000,
        fiveYearIrrPercent: 21.4,
        tenYearTotalNetWealthCreatedINR: 428000000,
        tenYearIrrPercent: 22.1,
      },
      bearCase: {
        scenarioName: 'BEAR_CASE',
        label: 'Conservative (6% Capital Appreciation)',
        assumedAnnualRentEscalationPercent: 4.5,
        assumedCapitalAppreciationCagrPercent: 6.0,
        assumedVacancyMonthsOver10Yrs: 2,
        fiveYearGrossRentalIncomeINR: 62100000,
        fiveYearEstimatedCapitalGainINR: 45000000,
        fiveYearTotalNetReturnINR: 107100000,
        fiveYearIrrPercent: 14.1,
        tenYearTotalNetWealthCreatedINR: 242000000,
        tenYearIrrPercent: 14.6,
      },
    },
    keyFeatures: [
      '72-foot continuous road frontage with high footfall density',
      'Exclusive outdoor alfresco patio dining rights with license',
      'Pre-fitted heavy 3-phase commercial kitchen power & chimney ducting',
      'Zero vacancy history over the past 8 years in the micro-market',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    reraRegNumber: 'P52100041289',
  },
  {
    id: 'pre_lease_chakan_logistics_p3',
    assetTitle: 'Chakan Industrial Grade-A Multi-Tenant Logistics Bay',
    propertyType: 'LOGISTICS_WAREHOUSE',
    location: {
      id: 'loc_chakan_ind',
      microMarket: 'Chakan Industrial Belt',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '410501',
      coordinates: { lat: 18.7606, lng: 73.8567 },
      address: 'MIDC Phase II, Chakan Auto Hub, Pune-Nashik Highway Corridor',
      landmarks: [
        { name: 'Mercedes-Benz & Foxconn Plants', type: 'IT_PARK', distanceKm: 1.5, commuteMinutes: 4 },
        { name: 'Pune-Nashik Highway', type: 'HIGHWAY', distanceKm: 0.5, commuteMinutes: 2 },
      ],
    },
    carpetAreaSqFt: 54000,
    tenantName: 'DHL Supply Chain & Bosch Automotive',
    tenantIndustry: 'Global Contract Logistics & EV Components',
    tenantCreditRating: 'Moody’s A1 / DAX 40 Germany',
    currentMonthlyRentINR: 2052000, // ₹38 / sq.ft
    rentPerSqFtINR: 38,
    annualEscalationPercent: 5.0,
    lockInPeriodYears: 7,
    lockInExpiresDate: '31 Mar 2031',
    overallLeaseExpiryDate: '31 Mar 2036',
    securityDepositMonths: 6,
    grossRentalYieldPercent: 9.47,
    netRentalYieldPercent: 8.92,
    purchasePriceINR: 260000000, // ₹26.00 Cr
    pricePerSqFtINR: 4814,
    camChargesPerSqFtINR: 4.5,
    propertyTaxResponsibility: 'TENANT',
    fitoutInvestmentByTenantINR: 55000000,
    scenarioReturns: {
      baseCase: {
        scenarioName: 'BASE_CASE',
        label: 'Base Case (Long Term 7-Yr Lock-in + 8% Asset Growth)',
        assumedAnnualRentEscalationPercent: 5.0,
        assumedCapitalAppreciationCagrPercent: 8.0,
        assumedVacancyMonthsOver10Yrs: 0,
        fiveYearGrossRentalIncomeINR: 135900000,
        fiveYearEstimatedCapitalGainINR: 122000000,
        fiveYearTotalNetReturnINR: 257900000,
        fiveYearIrrPercent: 17.6,
        tenYearTotalNetWealthCreatedINR: 615000000,
        tenYearIrrPercent: 18.2,
      },
      bullCase: {
        scenarioName: 'BULL_CASE',
        label: 'Bull Case (Industrial Corridor Infrastructure Boost)',
        assumedAnnualRentEscalationPercent: 6.0,
        assumedCapitalAppreciationCagrPercent: 11.0,
        assumedVacancyMonthsOver10Yrs: 0,
        fiveYearGrossRentalIncomeINR: 145200000,
        fiveYearEstimatedCapitalGainINR: 178000000,
        fiveYearTotalNetReturnINR: 323200000,
        fiveYearIrrPercent: 21.0,
        tenYearTotalNetWealthCreatedINR: 810000000,
        tenYearIrrPercent: 21.8,
      },
      bearCase: {
        scenarioName: 'BEAR_CASE',
        label: 'Conservative (Single-Tenant Roll-over)',
        assumedAnnualRentEscalationPercent: 4.0,
        assumedCapitalAppreciationCagrPercent: 5.5,
        assumedVacancyMonthsOver10Yrs: 4,
        fiveYearGrossRentalIncomeINR: 126500000,
        fiveYearEstimatedCapitalGainINR: 79800000,
        fiveYearTotalNetReturnINR: 206300000,
        fiveYearIrrPercent: 14.3,
        tenYearTotalNetWealthCreatedINR: 462000000,
        tenYearIrrPercent: 14.9,
      },
    },
    keyFeatures: [
      '38-foot clear hook height with FM-2 compliant heavy industrial flooring',
      '12 motorized hydraulic dock levelers with 42m multi-axle turning apron',
      'NFPA compliant ESFR automated sprinkler grid with dedicated 500kL reservoir',
      'Direct industrial feeder power line with 100% captive solar roof generation',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    reraRegNumber: 'P52100048122',
  },
];

// ============================================================
// 112. KIAAN PICKS (HUMAN EXPERTISE + AI INTELLIGENCE)
// ============================================================

export const SEED_KIAAN_PICKS: KiaanPickData[] = [
  {
    category: 'BEST_FAMILY_HOME',
    categoryTitle: 'Best Family Home',
    targetId: 'proj_one_vertica_wakad',
    targetType: 'PROJECT',
    title: 'Kiaan One Vertica — 3.5 BHK Sky Residence',
    locationName: 'Wakad, West Pune',
    priceFormatted: '₹1.48 Cr - ₹2.25 Cr',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    humanCuratorNote: {
      curatorName: 'Rajesh Singhania',
      curatorRole: 'Managing Partner, Luxury Residential Advisory',
      commentary:
        'Selected for exceptional child-safety infrastructure and family zoning: 4.5 acres of zero-vehicular podium parks, 3 reputable international schools within a 1.2km radius, and high 83.4% carpet-to-super ratio.',
      curatedDate: '28 Aug 2026',
    },
    aiIntelligenceMetrics: {
      aiMatchScore: 97,
      spatialEfficiencyScore: 94,
      daylightComfortScore: 96,
      valuationBenchmarkRatio: 0.91, // 9% under micro-market avg
      aiSummaryReason:
        'Triple-aspect cross ventilation with morning East light in master suite and kitchen; 100% clear title with zero litigation.',
    },
  },
  {
    category: 'BEST_VALUE',
    categoryTitle: 'Best Value',
    targetId: 'prop_hinjewadi_exec_suite',
    targetType: 'PROPERTY',
    title: 'Solitaire Tech Suites — 2.5 BHK Skyline',
    locationName: 'Hinjewadi Phase 1, Pune',
    priceFormatted: '₹1.05 Cr (All Inclusive)',
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    humanCuratorNote: {
      curatorName: 'Meera Kulkarni',
      curatorRole: 'Senior Valuation Analyst',
      commentary:
        'Exceptional acquisition price per usable carpet square foot. Zero floor-rise markup on floors 4 through 12, accompanied by fully paid lifetime clubhouse membership.',
      curatedDate: '29 Aug 2026',
    },
    aiIntelligenceMetrics: {
      aiMatchScore: 95,
      spatialEfficiencyScore: 96,
      daylightComfortScore: 92,
      valuationBenchmarkRatio: 0.84, // 16% below micro-market avg
      aiSummaryReason:
        'Micro-market valuation index benchmarked at ₹9,800/sq.ft vs this asset at ₹8,200/sq.ft. High immediate rental demand from tech employers.',
    },
  },
  {
    category: 'BEST_INVESTMENT',
    categoryTitle: 'Best Investment',
    targetId: 'pre_lease_hinjewadi_p1',
    targetType: 'PROPERTY',
    title: 'Fortune 500 Pre-Leased Tech Office Floor',
    locationName: 'Hinjewadi Phase 1',
    priceFormatted: '₹24.40 Cr',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    humanCuratorNote: {
      curatorName: 'Vikramaditya Rao',
      curatorRole: 'Director of Institutional Real Estate',
      commentary:
        '8.64% gross yield tenanted by Cisco Systems with a 5-year lock-in and corporate security deposit. Exceptional cash-flow reliability.',
      curatedDate: '30 Aug 2026',
    },
    aiIntelligenceMetrics: {
      aiMatchScore: 98,
      spatialEfficiencyScore: 98,
      daylightComfortScore: 90,
      valuationBenchmarkRatio: 0.88,
      aiSummaryReason:
        '10-Year projected IRR of 16.4% on base case; located in primary tech node with direct proposed metro connectivity.',
    },
  },
  {
    category: 'BEST_COMMERCIAL_OPPORTUNITY',
    categoryTitle: 'Best Commercial Opportunity',
    targetId: 'pre_lease_baner_retail_p2',
    targetType: 'PROPERTY',
    title: 'High Street Flagship Retail Showroom',
    locationName: 'Balewadi High Street, Baner',
    priceFormatted: '₹13.32 Cr',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    humanCuratorNote: {
      curatorName: 'Pooja Merchant',
      curatorRole: 'Commercial & Retail Assets Lead',
      commentary:
        '72 feet of high-visibility road frontage in Pune’s most densely visited lifestyle strip. Locked lease with Tata Starbucks.',
      curatedDate: '30 Aug 2026',
    },
    aiIntelligenceMetrics: {
      aiMatchScore: 96,
      spatialEfficiencyScore: 95,
      daylightComfortScore: 94,
      valuationBenchmarkRatio: 0.89,
      aiSummaryReason:
        '8.93% gross yield, 9 months security deposit, and historic 100% occupancy retention on the High Street boulevard.',
    },
  },
  {
    category: 'BEST_LUXURY',
    categoryTitle: 'Best Luxury',
    targetId: 'prop_kp_sky_penthouse',
    targetType: 'PROPERTY',
    title: 'The Sky Mansions — Triplex Penthouse',
    locationName: 'Lane 5, Koregaon Park',
    priceFormatted: '₹8.50 Cr',
    heroImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    humanCuratorNote: {
      curatorName: 'Rajesh Singhania',
      curatorRole: 'Managing Partner, Luxury Residential Advisory',
      commentary:
        'Rare trophy triplex offering complete 360-degree city views, private cantilevered heated infinity pool, Italian Statuario marble, and private high-speed elevator access.',
      curatedDate: '31 Aug 2026',
    },
    aiIntelligenceMetrics: {
      aiMatchScore: 99,
      spatialEfficiencyScore: 98,
      daylightComfortScore: 99,
      valuationBenchmarkRatio: 0.94,
      aiSummaryReason:
        '14.5-foot clear ceiling heights, 4 private basement parking bays, and biometric private elevator foyer.',
    },
  },
  {
    category: 'BEST_READY_POSSESSION',
    categoryTitle: 'Best Ready Possession',
    targetId: 'prop_baner_forest_villa',
    targetType: 'PROPERTY',
    title: 'Baner Hills Forest-Front Ready Villa',
    locationName: 'Baner Bio-Diversity Reserve',
    priceFormatted: '₹4.20 Cr',
    heroImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    humanCuratorNote: {
      curatorName: 'Arjun Nambiar',
      curatorRole: 'Legal & Handover Specialist',
      commentary:
        'Full Occupancy Certificate (OC) received and verified. 0% GST liability. Immediate key handover with clear freehold title and private solar microgrid.',
      curatedDate: '31 Aug 2026',
    },
    aiIntelligenceMetrics: {
      aiMatchScore: 97,
      spatialEfficiencyScore: 95,
      daylightComfortScore: 98,
      valuationBenchmarkRatio: 0.90,
      aiSummaryReason:
        'Immediate move-in with ₹0 GST surcharge saving over ₹21 Lakhs in transaction costs; private bio-reserve forest frontage.',
    },
  },
];

// ============================================================
// 113. KIAAN OPPORTUNITY WALL (DYNAMIC LIVE OPPORTUNITIES)
// ============================================================

export const SEED_OPPORTUNITY_WALL: OpportunityItem[] = [
  {
    id: 'opp_price_drop_wakad',
    tag: 'PRICE_DROP',
    tagLabel: 'Price Drop',
    badgeColor: 'red',
    title: '3 BHK East-Facing Sky Suite — Special Developer Price Cut',
    subtitle: 'Direct Developer Reallocation with 0% Stamp Duty Surcharge',
    location: 'Wakad, Pune',
    priceOriginalINR: 16200000,
    priceCurrentINR: 14800000,
    priceDisplay: '₹1.48 Cr (Was ₹1.62 Cr)',
    priceDropSavingsINR: 1400000,
    unitsRemainingCount: 2,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    urgencyText: 'Price valid until 15 Sep 2026 or until 2 reserved units sell',
    targetType: 'PROJECT',
    targetId: 'proj_one_vertica_wakad',
  },
  {
    id: 'opp_new_release_baner',
    tag: 'NEWLY_RELEASED',
    tagLabel: 'Newly Released',
    badgeColor: 'emerald',
    title: 'Sky Tower B: Penthouse Floors 28 to 32 Unlocked',
    subtitle: 'Freshly launched panoramic sunset suites with double-height decks',
    location: 'Baner, Pune',
    priceCurrentINR: 23500000,
    priceDisplay: '₹2.35 Cr - ₹3.10 Cr',
    unitsRemainingCount: 6,
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    urgencyText: 'First 3 bookings receive complimentary 2-car basement parking upgrade',
    targetType: 'PROJECT',
    targetId: 'proj_solitaire_baner',
  },
  {
    id: 'opp_pre_launch_hinj',
    tag: 'PRE_LAUNCH',
    tagLabel: 'Pre-launch',
    badgeColor: 'purple',
    title: 'The Tech Pavilion — Commercial IT Suites',
    subtitle: 'Exclusive VIP pre-launch pricing prior to public media release',
    location: 'Hinjewadi Phase 1, Pune',
    priceCurrentINR: 8800000,
    priceDisplay: '₹88 Lakhs - ₹1.45 Cr',
    unitsRemainingCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    urgencyText: 'Early-bird tranche strictly limited to registered VIP members',
    targetType: 'PROJECT',
    targetId: 'proj_solitaire_hinjewadi',
  },
  {
    id: 'opp_ready_oc_kp',
    tag: 'READY_POSSESSION',
    tagLabel: 'Ready Possession',
    badgeColor: 'blue',
    title: 'The Aristocrat — Ready 4 BHK Duplex with Full OC',
    subtitle: 'Move in immediately. 0% GST liability. Freehold registry.',
    location: 'Koregaon Park, Pune',
    priceCurrentINR: 49500000,
    priceDisplay: '₹4.95 Cr',
    unitsRemainingCount: 1,
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    urgencyText: 'Last remaining garden duplex in the completed boutique building',
    targetType: 'PROPERTY',
    targetId: 'prop_kp_sky_penthouse',
  },
  {
    id: 'opp_invest_cisco_lease',
    tag: 'INVESTMENT_PICK',
    tagLabel: 'Investment Pick',
    badgeColor: 'amber',
    title: 'Pre-Leased IT Floor with 8.64% Gross Rental Yield',
    subtitle: 'Fortune 500 US Tenant. 5-Year Lock-In. ₹17.57 Lakhs Monthly Rent.',
    location: 'Hinjewadi Phase 1',
    priceCurrentINR: 244000000,
    priceDisplay: '₹24.40 Cr',
    unitsRemainingCount: 1,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    urgencyText: 'Immediate rental income credit from Day 1 of sale deed registration',
    targetType: 'PROPERTY',
    targetId: 'pre_lease_hinjewadi_p1',
  },
  {
    id: 'opp_commercial_starbucks',
    tag: 'COMMERCIAL_OPPORTUNITY',
    tagLabel: 'Commercial Opportunity',
    badgeColor: 'emerald',
    title: 'High Street Corner Retail tenanted by Starbucks',
    subtitle: '72 Ft frontage. 18,500 daily pedestrian footfall. 8.93% yield.',
    location: 'Balewadi High Street, Baner',
    priceCurrentINR: 133200000,
    priceDisplay: '₹13.32 Cr',
    unitsRemainingCount: 1,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    urgencyText: 'Single trophy asset; institutional documentation available in Doc Center',
    targetType: 'PROPERTY',
    targetId: 'pre_lease_baner_retail_p2',
  },
  {
    id: 'opp_limited_inv_penthouse',
    tag: 'LIMITED_INVENTORY',
    tagLabel: 'Limited Inventory',
    badgeColor: 'red',
    title: 'Only 1 Duplex Sky Villa Remaining on 32nd Floor',
    subtitle: 'Private heated plunge pool and uninterrupted Sahyadri hill views',
    location: 'Baner Hills, Pune',
    priceCurrentINR: 38000000,
    priceDisplay: '₹3.80 Cr',
    unitsRemainingCount: 1,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    urgencyText: '3 active enquiries in progress. 15-minute concurrency lock active.',
    targetType: 'PROJECT',
    targetId: 'proj_solitaire_baner',
  },
];

// ============================================================
// 114. PROPERTY PERSONALITY (EXPLAINABLE CHARACTERISTICS)
// ============================================================

export const PROPERTY_PERSONALITY_EXPLANATIONS: Record<string, PropertyPersonalityExplanation> = {
  'Family Favourite': {
    type: 'Family Favourite',
    badge: '👨‍👩‍👧‍👦 Family Favourite',
    color: 'emerald',
    headlineReason: 'Ranked #1 for family harmony, child safety, and school proximity',
    explainableFactors: [
      {
        label: 'School & Education Proximity',
        metricValue: '< 1.2 km (3 Top Schools)',
        subtext: 'Vibgyor High (800m), EuroKids (350m), and Symbiosis (1.2km) within short commute.',
      },
      {
        label: 'Podium Green Space & Child Safety',
        metricValue: '4.5 Acres 100% Vehicular-Free',
        subtext: 'Zero vehicle circulation on surface podium; 24/7 RFID child-perimeter monitoring.',
      },
      {
        label: 'Usable Carpet Ratio',
        metricValue: '83.4% Super-to-Carpet',
        subtext: 'Spacious dedicated family dining alcove and oversized private children’s study balcony.',
      },
      {
        label: 'Healthcare & Emergency',
        metricValue: '6 Mins to Multi-Speciality',
        subtext: 'Aditya Birla Memorial Hospital located 2.4 km away with 24-hour pediatric emergency.',
      },
    ],
    suitabilityProfile:
      'Ideal for growing families with school-age children seeking expansive green play areas, community sports academies, and quiet residential surroundings.',
  },
  "Investor's Pick": {
    type: "Investor's Pick",
    badge: "📈 Investor's Pick",
    color: 'amber',
    headlineReason: 'Ranked #1 for institutional rental yield, capital liquidity, and tenant demand',
    explainableFactors: [
      {
        label: 'Gross Rental Yield',
        metricValue: '8.64% - 9.47% p.a.',
        subtext: 'High recurring rental return, significantly outpacing standard 3.2% residential averages.',
      },
      {
        label: 'Corporate Tenant Quality',
        metricValue: 'Fortune 500 / CRISIL AAA',
        subtext: 'Locked long-term corporate leases with institutional security deposits and escalations.',
      },
      {
        label: 'Acquisition Price Advantage',
        metricValue: '12% Below Micro-Market Index',
        subtext: 'Acquired at preferential direct-tranche pricing with zero brokerage or middleman fees.',
      },
      {
        label: 'Corridor Infrastructure Catalyst',
        metricValue: 'Hinjewadi Metro Line 3',
        subtext: 'Operational metro terminal within 400 meters driving sustained long-term capital appreciation.',
      },
    ],
    suitabilityProfile:
      'Engineered for high-net-worth investors, family offices, and NRI clients seeking dependable monthly rental cash flows and capital security.',
  },
  'Value Champion': {
    type: 'Value Champion',
    badge: '💎 Value Champion',
    color: 'blue',
    headlineReason: 'Ranked #1 for maximum usable area and zero unnecessary developer surcharges',
    explainableFactors: [
      {
        label: 'All-Inclusive Ticket vs Competition',
        metricValue: '₹8,200 vs ₹9,800/sq.ft Avg',
        subtext: 'Direct developer tranche saving an estimated ₹14 - 18 Lakhs on equivalent configurations.',
      },
      {
        label: 'Zero Floor-Rise Premium',
        metricValue: 'Floors 4 to 12 at Base Rate',
        subtext: 'No incremental floor rise penalty applied on middle residential tiers.',
      },
      {
        label: 'Statutory Tax Shield Potential',
        metricValue: '₹2.12 Lakhs / Yr Saved',
        subtext: 'Optimal loan structuring qualifies for maximum statutory Section 24(b) and 80C exemptions.',
      },
      {
        label: 'Maintenance & CAM Cost Efficiency',
        metricValue: '₹3.20 / sq.ft Low CAM',
        subtext: 'Solar-powered common areas and rainwater harvesting keep monthly recurring society costs low.',
      },
    ],
    suitabilityProfile:
      'Engineered for discerning smart buyers who prioritize architectural efficiency, sound financial fundamentals, and maximum living area per rupee invested.',
  },
  'Luxury Statement': {
    type: 'Luxury Statement',
    badge: '👑 Luxury Statement',
    color: 'purple',
    headlineReason: 'Ranked #1 for bespoke craftsmanship, architectural prestige, and privacy',
    explainableFactors: [
      {
        label: 'Clear Ceiling Height',
        metricValue: '14.5 Feet Double-Height',
        subtext: 'Volumetric sky ceilings with floor-to-ceiling soundproof acoustic glass envelopes.',
      },
      {
        label: 'Private Leisure Amenities',
        metricValue: 'Cantilevered Plunge Deck',
        subtext: 'Private temperature-controlled infinity pool on personal cantilevered sky deck.',
      },
      {
        label: 'Finishes & Materials',
        metricValue: 'Italian Statuario & Boffi Kitchen',
        subtext: 'Book-matched imported Italian marble, Miele appliances, and Dornbracht sanitary fittings.',
      },
      {
        label: 'Concierge & Privacy',
        metricValue: 'Biometric Private Foyer',
        subtext: 'High-speed destination-controlled elevator opening directly inside the private sky residence.',
      },
    ],
    suitabilityProfile:
      'Designed for industrialists, CXOs, and global citizens demanding an iconic architectural landmark that reflects their stature.',
  },
  'Hidden Gem': {
    type: 'Hidden Gem',
    badge: '✨ Hidden Gem',
    color: 'amber',
    headlineReason: 'Ranked #1 for boutique exclusivity, undisturbed natural tranquility, and low density',
    explainableFactors: [
      {
        label: 'Enclave Density',
        metricValue: 'Only 24 Boutique Residences',
        subtext: 'Ultra-low density community ensuring absolute peace, quiet, and exclusive access.',
      },
      {
        label: 'Direct Nature Frontage',
        metricValue: 'Bordering Forest Reserve',
        subtext: 'Direct views over 400 acres of protected green bio-diversity reserve that can never be built upon.',
      },
      {
        label: 'Air Quality & Microclimate',
        metricValue: 'AQI 32 (Clean Mountain Air)',
        subtext: 'Ambient temperatures 2.5°C cooler than the central city with zero vehicular noise pollution.',
      },
      {
        label: 'Bespoke Solar Autonomy',
        metricValue: '100% Green Microgrid',
        subtext: 'Private rooftop photovoltaic cells and dedicated electric vehicle ultra-fast chargers.',
      },
    ],
    suitabilityProfile:
      'Perfect for nature lovers, artists, authors, and retirees seeking a serene, green sanctuary while remaining within 15 minutes of major city hubs.',
  },
};

// ============================================================
// 116. TRUST CENTER SEED DATA & VERIFICATION STAMP
// ============================================================

export const SEED_TRUST_CENTER_DATA: TrustCenterData = {
  informationCompletenessPercent: 98,
  completenessChecklist: [
    { field: 'MahaRERA Registration Certificate & Order', isVerified: true },
    { field: '30-Year Clear Freehold Title Search Opinion', isVerified: true },
    { field: 'Sanctioned Layout & Building Elevation Plans', isVerified: true },
    { field: 'Commencement Certificate (CC) Validated', isVerified: true },
    { field: 'Dedicated 70% Escrow Bank Account (Sec 4)', isVerified: true },
    { field: 'Civil Engineer & Architect Milestone Certs', isVerified: true },
    { field: 'Ground Truth Physical Site Audit', isVerified: true },
    { field: 'Ray-Traced Solar & Daylight Simulation', isVerified: true },
    { field: 'Millimeter Carpet Area Confirmation', isVerified: true },
    { field: 'Zero Hidden Brokerage Developer Pricing', isVerified: true },
    { field: 'Environmental & Fire NOC Clearances', isVerified: true },
    { field: 'Live Inventory Concurrency Lock State', isVerified: true },
  ],
  propertyInfoLastUpdatedDate: '31 Aug 2026',
  inventoryLastUpdatedRelative: '3 mins ago',
  inventoryLastUpdatedIso: '2026-08-31T20:30:00Z',
  verificationStatus: 'GOVERNMENT_RERA_AND_LEGAL_VERIFIED',
  verificationStamp: {
    isPhysicalSiteAudited: true,
    physicalAuditDate: '28 Aug 2026',
    physicalAuditorName: 'Er. Sandeep Patil, Chartered Civil Engineer',
    isLegalTitleVerified: true,
    legalTitleAdvocateFirm: 'Deshmukh & Associates Law Chambers, High Court Advocates',
    legalTitleReportDate: '24 Aug 2026',
    isMahaReraCrossVerified: true,
    mahaReraApiVerifiedTimestamp: '2026-08-31T18:00:00Z',
    isEscrowCompliant: true,
    escrowBankVerified: 'HDFC Bank Ltd, Nariman Point / FC Road Branch (A/C: 50200084920194)',
  },
  reraRegistrationNumber: 'P52100028492',
  reraOfficialUrl: 'https://maharera.mahaonline.gov.in',
  reraQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://maharera.mahaonline.gov.in/project/P52100028492',
  documentAvailability: [
    { docName: 'MahaRERA Sanction Order & Certificate', isAvailableForInstantView: true, format: 'PDF (2.4 MB)' },
    { docName: '30-Year Title Search & Non-Encumbrance Report', isAvailableForInstantView: true, format: 'PDF (4.1 MB)' },
    { docName: 'Municipal Commencement Certificate (CC)', isAvailableForInstantView: true, format: 'PDF (1.8 MB)' },
    { docName: 'Standard Model Agreement for Sale (MahaRERA)', isAvailableForInstantView: true, format: 'PDF (3.2 MB)' },
    { docName: 'Civil Construction Progress & CA Form 3', isAvailableForInstantView: true, format: 'PDF (1.5 MB)' },
  ],
  pricingAuditStatus: 'VERIFIED_DEVELOPER_DIRECT_NO_MARKUP',
  pricePerSqFtCarpetAudit: 11840,
};

// ============================================================
// 118. CUSTOMER REVIEWS (SEPARATED PROPERTY VS KIAAN SERVICE)
// ============================================================

export const SEED_CUSTOMER_REVIEWS: PropertyReviewItem[] = [
  // PROPERTY / PROJECT LIVING EXPERIENCE REVIEWS
  {
    id: 'rev_prop_1',
    reviewType: 'PROPERTY_EXPERIENCE',
    authorName: 'Dr. Anand Deshmukh',
    authorDesignation: 'Senior Cardiac Surgeon • Resident of Tower A',
    verifiedBuyerBadge: true,
    date: '14 Aug 2026',
    ratingOverall: 5,
    title: 'Flawless acoustic insulation & tranquil morning light',
    commentary:
      'Living here for the past 8 months has been extraordinary. The acoustic double glazing ensures zero highway noise reaches our master bedroom. Morning light in the East-facing deck is exactly as shown in the solar ray-tracing simulation before we booked.',
    propertyAspectRatings: {
      constructionQuality: 5,
      amenitiesUpkeep: 5,
      soundInsulationAndQuietness: 5,
      daylightAndVentilation: 5,
      locationAndCommute: 4.8,
    },
    helpfulCount: 28,
  },
  {
    id: 'rev_prop_2',
    reviewType: 'PROPERTY_EXPERIENCE',
    authorName: 'Sneha & Rohan Mehta',
    authorDesignation: 'Tech Leaders at Microsoft • 3.5 BHK Sky Residence',
    verifiedBuyerBadge: true,
    date: '02 Aug 2026',
    ratingOverall: 5,
    title: 'The children’s podium park is a godsend for working parents',
    commentary:
      'Our twin daughters play in the vehicular-free podium park every single evening. The sports coaching academy and rooftop infinity pool are maintained to 5-star hospitality standards. Water pressure and dual DG backup have never failed even once during monsoons.',
    propertyAspectRatings: {
      constructionQuality: 4.9,
      amenitiesUpkeep: 5,
      soundInsulationAndQuietness: 4.8,
      daylightAndVentilation: 5,
      locationAndCommute: 5,
    },
    helpfulCount: 19,
  },
  {
    id: 'rev_prop_3',
    reviewType: 'PROPERTY_EXPERIENCE',
    authorName: 'Col. Virendra Rawat (Retd.)',
    authorDesignation: 'Tower B Garden Duplex Resident',
    verifiedBuyerBadge: true,
    date: '18 Jul 2026',
    ratingOverall: 4.8,
    title: 'Sturdy structural civil engineering & immaculate security staff',
    commentary:
      'Being from a military background, I audited the plinth and seismic construction reports thoroughly. The build quality exceeds standard municipal guidelines. The 3-tier RFID access control gives complete peace of mind.',
    propertyAspectRatings: {
      constructionQuality: 5,
      amenitiesUpkeep: 4.7,
      soundInsulationAndQuietness: 5,
      daylightAndVentilation: 4.8,
      locationAndCommute: 4.7,
    },
    helpfulCount: 15,
  },

  // KIAAN SERVICE EXPERIENCE REVIEWS
  {
    id: 'rev_serv_1',
    reviewType: 'KIAAN_SERVICE',
    authorName: 'Aditya Birla Capital Advisory Group',
    authorDesignation: 'Family Office Client • 2 Penthouse Acquisitions',
    verifiedBuyerBadge: true,
    date: '22 Aug 2026',
    ratingOverall: 5,
    title: 'Zero brokerage, total transparency, and seamless Maybach concierge',
    commentary:
      'The Kiaan advisory team operates like a high-end Swiss private bank. The chauffeured Maybach site visit was punctual and dignified. Most importantly, not a single rupee of broker commission was charged, and all MahaRERA documentation was cross-verified by their legal team within 2 hours.',
    serviceAspectRatings: {
      advisorExpertise: 5,
      transparencyAndNoBrokerage: 5,
      maybachSiteVisitHospitality: 5,
      paperworkAndReraClarity: 5,
      digitalTwinAccuracy: 5,
    },
    helpfulCount: 34,
  },
  {
    id: 'rev_serv_2',
    reviewType: 'KIAAN_SERVICE',
    authorName: 'Priya & Vikram Shenoy',
    authorDesignation: 'NRI Buyers based in Silicon Valley (Sunnyvale, CA)',
    verifiedBuyerBadge: true,
    date: '09 Aug 2026',
    ratingOverall: 5,
    title: 'Digital twin was 100% identical to the physical reality in Pune',
    commentary:
      'We booked our 4 BHK entirely from California using Kiaan’s 3D Digital Twin and live daylight simulator. When my parents visited the physical site in Wakad, the view lines, carpet area, and sun angles matched the digital model to the millimeter. Their NRE/NRO legal banking team handled our repatriation questions effortlessly.',
    serviceAspectRatings: {
      advisorExpertise: 5,
      transparencyAndNoBrokerage: 5,
      maybachSiteVisitHospitality: 4.9,
      paperworkAndReraClarity: 5,
      digitalTwinAccuracy: 5,
    },
    helpfulCount: 42,
  },
  {
    id: 'rev_serv_3',
    reviewType: 'KIAAN_SERVICE',
    authorName: 'Suresh Singhal',
    authorDesignation: 'Managing Director, Singhal Polymers',
    verifiedBuyerBadge: true,
    date: '27 Jul 2026',
    ratingOverall: 4.9,
    title: '15-Minute concurrency lock saved us from a bidding war',
    commentary:
      'We were evaluating Unit A-1802 while two other buyers were looking at it. Kiaan’s 15-minute concurrency holding token secured our priority instantly without pressure, giving us time to review the statutory tax breakdown with our CA before confirming the booking.',
    serviceAspectRatings: {
      advisorExpertise: 4.9,
      transparencyAndNoBrokerage: 5,
      maybachSiteVisitHospitality: 5,
      paperworkAndReraClarity: 5,
      digitalTwinAccuracy: 4.8,
    },
    helpfulCount: 21,
  },
];

// ============================================================
// 119. GROUNDED FAQ ENGINE (9 CATEGORIES WITH AUDITED CITATIONS)
// ============================================================

export const SEED_GROUNDED_FAQS: GroundedFaqItem[] = [
  {
    id: 'faq_price_1',
    category: 'PRICE',
    question: 'Are there any hidden costs beyond the quoted acquisition price?',
    groundedAnswer:
      'No. Kiaan maintains a strict statutory transparent pricing policy. The acquisition summary covers: Base Consideration, Statutory 5% GST (or 0% for ready OC properties), 6% Maharashtra Stamp Duty, ₹30,000 Registration Fee, 1-Year Advance Maintenance Corpus, and Allocated Covered Car Parking. There are zero broker commissions or undocumented floor-rise surcharges.',
    verifiedSourceReference: 'MahaRERA Cost Disclosure Schedule & Developer Direct Pricing Guarantee',
    isAiAssistedGrounded: true,
    helpfulVotes: 64,
  },
  {
    id: 'faq_parking_1',
    category: 'PARKING',
    question: 'What is the parking allocation policy, and is EV charging supported?',
    groundedAnswer:
      'Every 3 BHK and 3.5 BHK includes 2 covered basement parking bays; Penthouses include 3 to 4 dedicated parking slots with demarcated RFID access. All bays include dedicated conduits connected to individual electrical meters for Level-2 EV wallbox charging installations.',
    verifiedSourceReference: 'Approved Municipal Building Layout Plan & Parking Allotment Annexure',
    isAiAssistedGrounded: true,
    helpfulVotes: 51,
  },
  {
    id: 'faq_possession_1',
    category: 'POSSESSION',
    question: 'What is the exact MahaRERA possession date, and what is the penalty for delay?',
    groundedAnswer:
      'The statutory MahaRERA committed possession date for Phase 1 is December 2027 (Registration P52100028492). Under Section 18 of the RERA Act, 2016, in the event of any developer delay beyond the statutory grace period, the developer is legally mandated to pay monthly interest at State Bank of India MCLR + 2% per annum to the allottee until actual possession handover.',
    verifiedSourceReference: 'Real Estate (Regulation and Development) Act 2016, Section 18 & MahaRERA Registration',
    isAiAssistedGrounded: true,
    helpfulVotes: 89,
  },
  {
    id: 'faq_maintenance_1',
    category: 'MAINTENANCE',
    question: 'How are monthly Common Area Maintenance (CAM) charges calculated?',
    groundedAnswer:
      'CAM is calculated at ₹3.50 per sq.ft of RERA carpet area per month. It includes 24/7 security personnel, Otis elevator annual maintenance contracts (AMC), dual DG fuel backup, infinity pool filtration, landscaping horticulture, and automated rainwater harvesting. A 1-year deposit is held in a dedicated society escrow account.',
    verifiedSourceReference: 'Draft Society Bye-Laws & Section 11(4)(g) MahaRERA Handover Charter',
    isAiAssistedGrounded: true,
    helpfulVotes: 42,
  },
  {
    id: 'faq_config_1',
    category: 'CONFIGURATION',
    question: 'How is the carpet area measured, and is the floor plan 100% Vaastu compliant?',
    groundedAnswer:
      'Carpet area is measured strictly as the net usable floor area of the apartment, excluding external walls, common service shafts, and open terraces, strictly in accordance with Section 2(k) of the RERA Act. Units feature East or North facing main entry doors with kitchens positioned in the South-East (Agni) quadrant for optimal solar and positive energy alignment.',
    verifiedSourceReference: 'MahaRERA Section 2(k) Carpet Area Certification & Architectural Layout',
    isAiAssistedGrounded: true,
    helpfulVotes: 73,
  },
  {
    id: 'faq_docs_1',
    category: 'DOCUMENTS',
    question: 'Can I review the original title certificate and sanction orders before placing a hold?',
    groundedAnswer:
      'Yes. All statutory legal documents—including the 30-Year Title Search Report by High Court advocates, Commencement Certificate (CC), Non-Agricultural (NA) Order, and Model Agreement for Sale—are available for immediate review and download inside the Kiaan Document Center modal.',
    verifiedSourceReference: 'Kiaan Verified Document Center & Legal Title Audit Chamber',
    isAiAssistedGrounded: true,
    helpfulVotes: 58,
  },
  {
    id: 'faq_amenities_1',
    category: 'AMENITIES',
    question: 'Are club amenities shared with commercial or external visitors?',
    groundedAnswer:
      'No. The Sky Club, rooftop infinity pool, temperature-controlled squash courts, and co-working executive pods are strictly private and accessible exclusively by registered resident RFID keys and their accompanied guests. Commercial retail is completely segregated with separate road entry and multi-level parking.',
    verifiedSourceReference: 'Master Plan Gated Security Architecture & Residential Charter',
    isAiAssistedGrounded: true,
    helpfulVotes: 36,
  },
  {
    id: 'faq_negotiation_1',
    category: 'NEGOTIATION',
    question: 'Can I negotiate the price or submit a formal digital counter-offer?',
    groundedAnswer:
      'Yes. Discerning buyers can submit formal digital offers with custom earnest deposits and preferred payment milestones directly to the promoter via Kiaan’s "Make Offer" portal. Offers are audited against market liquidity indices and reviewed directly by the developer decision board within 24 hours.',
    verifiedSourceReference: 'Kiaan Digital Offer Protocol & Promoter Direct Desk',
    isAiAssistedGrounded: true,
    helpfulVotes: 61,
  },
  {
    id: 'faq_availability_1',
    category: 'AVAILABILITY',
    question: 'How do I know if a unit displayed on the 3D elevation is currently available?',
    groundedAnswer:
      'Kiaan operates a live WebSocket-synchronized inventory ledger. When a unit is marked "AVAILABLE", it can be reserved for a 15-minute exclusive hold window. If another buyer is actively checking out, the unit state transitions to "HOLD" in real time, preventing duplicate bookings or stale listings.',
    verifiedSourceReference: 'Kiaan Real-Time Concurrency Inventory Ledger',
    isAiAssistedGrounded: true,
    helpfulVotes: 47,
  },
  {
    id: 'faq_nri_1',
    category: 'NRI_LEGAL',
    question: 'How does an NRI purchase a property remotely without physical presence in India?',
    groundedAnswer:
      'Non-Resident Indians (NRIs) and OCIs can execute 100% compliant property acquisitions under FEMA guidelines through inward remittances via NRE / NRO bank accounts. Agreement for Sale registration is supported via digital e-registration or consular-attested Special Power of Attorney (PoA) handled by our senior legal desk.',
    verifiedSourceReference: 'RBI FEMA Master Direction (Acquisition and Transfer of Immovable Property in India) & High Court PoA Framework',
    isAiAssistedGrounded: true,
    helpfulVotes: 82,
  },
  {
    id: 'faq_finance_1',
    category: 'FINANCE_ESCROW',
    question: 'Which leading banks have pre-approved the projects, and where are buyer funds deposited?',
    groundedAnswer:
      'All developments hold Approved Project Finance (APF) approvals from HDFC Bank, State Bank of India (SBI), ICICI Bank, and Kotak Mahindra Bank. 70% of all customer funds are deposited directly into statutory MahaRERA project-specific escrow accounts, withdrawable only upon certified architect and engineer milestone completions.',
    verifiedSourceReference: 'MahaRERA Section 4(2)(l)(D) Escrow Certification & Banking APF Letter Registry',
    isAiAssistedGrounded: true,
    helpfulVotes: 69,
  },
  {
    id: 'faq_price_2',
    category: 'PRICE',
    question: 'What is the token booking amount, and is it 100% refundable if due diligence fails?',
    groundedAnswer:
      'The initial reservation token is ₹1,00,000 for luxury residences and ₹5,00,000 for penthouses. Under Kiaan’s 7-day Due Diligence Guarantee, tokens are 100% refundable with zero administrative deductions if the buyer finds any encumbrance or legal title discrepancy during document review.',
    verifiedSourceReference: 'Kiaan Fair Escrow & Token Refund Charter (Clause 3.1)',
    isAiAssistedGrounded: true,
    helpfulVotes: 95,
  },
  {
    id: 'faq_config_2',
    category: 'CONFIGURATION',
    question: 'Can luxury apartments be customized or purchased as a bare-shell layout?',
    groundedAnswer:
      'Yes. For select 4 BHK and sky duplex residences, buyers can opt for custom structural layout reconfiguration prior to the 12th-floor slab casting, or select a "Bare-Shell Bespoke" hand-over with credits adjusted against luxury Italian marble and sanitary fittings.',
    verifiedSourceReference: 'Architectural Structural Modification Annexure & Custom Fit-Out Guidelines',
    isAiAssistedGrounded: true,
    helpfulVotes: 54,
  },
];

// ============================================================
// 120 - 121. ADMIN ANALYTICS METRICS & STRUCTURED EVENT STREAM
// ============================================================

export const SEED_ADMIN_ANALYTICS_METRICS: WebsiteAnalyticsDashboardMetrics = {
  discovery: {
    totalSearchesCount: 14280,
    aiNaturalLanguageSearchesCount: 8940,
    topLocationsExplored: [
      { location: 'Wakad / Baner Tech Corridor', searchCount: 5420, growthPercent: 24.5 },
      { location: 'Hinjewadi Phase 1 Pre-Leased', searchCount: 3890, growthPercent: 18.2 },
      { location: 'Koregaon Park Luxury Mansions', searchCount: 2640, growthPercent: 14.8 },
      { location: 'Chakan Logistics Parks', searchCount: 2330, growthPercent: 31.0 },
    ],
  },
  engagement: {
    totalPageViews: 94250,
    propertiesSavedCount: 4820,
    comparisonsCreatedCount: 1940,
    aiConversationsCount: 6120,
    pdfDossiersDownloadedCount: 2340,
    sharesOmnichannelCount: 3880,
  },
  intent: {
    vipSiteVisitsRequestedCount: 384,
    formalOffersSubmittedCount: 86,
    unitsSelectedCount: 712,
    activeHoldsCount: 18,
  },
  transaction: {
    bookingsInitiatedCount: 42,
    bookingsCompletedCount: 28,
    totalBookingValueINR: 584000000, // ₹58.40 Cr
    paymentEventsCount: 114,
    tokenDisbursementsAuditedINR: 14000000, // ₹1.40 Cr
  },
};

export const SEED_STRUCTURED_ANALYTICS_EVENTS: StructuredAnalyticsEvent[] = [
  {
    event_id: 'evt_101',
    eventName: 'booking_completed',
    timestamp: '2026-08-31T20:25:00Z',
    user_session: {
      sessionId: 'sess_9941a',
      userId: 'usr_882',
      userName: 'Dr. Anand Deshmukh',
      userRole: 'CUSTOMER',
      consentState: 'ANALYTICS_CONSENT_GRANTED',
    },
    entity: {
      type: 'UNIT',
      id: 'unit_a1201',
      name: 'Unit A-1201 (3.5 BHK Sky Suite)',
      valueINR: 14800000,
    },
    metadata: {
      bookingRef: 'KP-2026-B8291',
      tokenPaidINR: 100000,
      paymentMethod: 'ESCROW_NETBANKING',
      escrowBank: 'HDFC Bank Ltd',
    },
    source: 'WEB_DESKTOP',
    consent_context: 'EXPLICIT_CONSENT_GIVEN_ON_SESSION_START',
  },
  {
    event_id: 'evt_102',
    eventName: 'unit_held',
    timestamp: '2026-08-31T20:18:30Z',
    user_session: {
      sessionId: 'sess_8421b',
      userId: 'usr_741',
      userName: 'Vikram Shenoy (NRI Silicon Valley)',
      userRole: 'CUSTOMER',
      consentState: 'ANALYTICS_CONSENT_GRANTED',
    },
    entity: {
      type: 'UNIT',
      id: 'unit_a1202',
      name: 'Unit A-1202 (4 BHK Sky Villa)',
      valueINR: 18500000,
    },
    metadata: {
      holdDurationMinutes: 15,
      lockExpiresAt: '2026-08-31T20:33:30Z',
      currency: 'USD',
      currencyEstimate: '$222,891 USD',
    },
    source: 'WEB_DESKTOP',
    consent_context: 'EXPLICIT_CONSENT_GIVEN_ON_SESSION_START',
  },
  {
    event_id: 'evt_103',
    eventName: 'pdf_downloaded',
    timestamp: '2026-08-31T20:12:15Z',
    user_session: {
      sessionId: 'sess_7712c',
      userRole: 'CUSTOMER',
      consentState: 'ANALYTICS_CONSENT_GRANTED',
    },
    entity: {
      type: 'REPORT',
      id: 'rep_dossier_wakad_3bhk',
      name: 'Kiaan Architectural & MahaRERA Dossier',
      valueINR: 14800000,
    },
    metadata: {
      sectionsIncluded: ['OVERVIEW', 'FLOOR_PLAN', 'TAX_SHIELD', 'MahaRERA_CERTIFICATE'],
      format: 'PDF_PRINT_READY',
    },
    source: 'MOBILE_BROWSER',
    consent_context: 'EXPLICIT_CONSENT_GIVEN_ON_SESSION_START',
  },
  {
    event_id: 'evt_104',
    eventName: 'visit_requested',
    timestamp: '2026-08-31T19:55:00Z',
    user_session: {
      sessionId: 'sess_6623d',
      userId: 'usr_512',
      userName: 'Mrs. Radhika Kulkarni',
      userRole: 'CUSTOMER',
      consentState: 'ANALYTICS_CONSENT_GRANTED',
    },
    entity: {
      type: 'PROJECT',
      id: 'proj_one_vertica_wakad',
      name: 'Kiaan One Vertica',
      valueINR: 14800000,
    },
    metadata: {
      preferredDate: '2026-09-02',
      timeSlot: '04:30 PM',
      hospitalityVehicle: 'MERCEDES_MAYBACH_CHAUFFEUR',
    },
    source: 'WEB_DESKTOP',
    consent_context: 'EXPLICIT_CONSENT_GIVEN_ON_SESSION_START',
  },
  {
    event_id: 'evt_105',
    eventName: 'offer_created',
    timestamp: '2026-08-31T19:40:20Z',
    user_session: {
      sessionId: 'sess_5519e',
      userId: 'usr_392',
      userName: 'Amitabh Sen',
      userRole: 'CUSTOMER',
      consentState: 'ANALYTICS_CONSENT_GRANTED',
    },
    entity: {
      type: 'PROPERTY',
      id: 'pre_lease_baner_retail_p2',
      name: 'Balewadi High Street Starbucks Retail',
      valueINR: 133200000,
    },
    metadata: {
      askingPriceINR: 133200000,
      offeredAmountINR: 129000000,
      earnestTokenOfferedINR: 1000000,
      contingency: 'TITLE_VERIFICATION_PASS',
    },
    source: 'WEB_DESKTOP',
    consent_context: 'EXPLICIT_CONSENT_GIVEN_ON_SESSION_START',
  },
  {
    event_id: 'evt_106',
    eventName: 'ai_query',
    timestamp: '2026-08-31T19:22:10Z',
    user_session: {
      sessionId: 'sess_4411f',
      userRole: 'CUSTOMER',
      consentState: 'ANALYTICS_CONSENT_GRANTED',
    },
    entity: {
      type: 'SEARCH',
      id: 'search_ai_nl_001',
      name: 'Natural Language AI Query',
    },
    metadata: {
      queryText: 'Find high-yield pre-leased commercial office in Hinjewadi with over 8.5% net return',
      matchedResultsCount: 3,
      aiConfidenceScore: 98,
    },
    source: 'WEB_DESKTOP',
    consent_context: 'EXPLICIT_CONSENT_GIVEN_ON_SESSION_START',
  },
];
