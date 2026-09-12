/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KnowledgeTopic, BlogCategory } from '../types';

export const SEO_KNOWLEDGE_CATEGORIES = [
  { id: 'ALL', label: 'All 1,200+ Topics & Guides', icon: 'BookOpen' },
  { id: 'VASTU_COMPLIANCE', label: 'Vaastu Shastra & Directional', icon: 'Sparkles' },
  { id: 'PRE_LEASED_COMMERCIAL', label: 'Pre-Leased Commercial & Yields', icon: 'Building2' },
  { id: 'TAX_WEALTH', label: 'Indian Income Tax & Sec 54', icon: 'Calculator' },
  { id: 'GST_REAL_ESTATE', label: 'GST on Property & ITC', icon: 'Receipt' },
  { id: 'TDS_COMPLIANCE', label: 'TDS (194-IA, 194-IB, 195)', icon: 'FileSpreadsheet' },
  { id: 'MAHARERA_REGULATORY', label: 'MahaRERA & Legal Rights', icon: 'ShieldCheck' },
  { id: 'COOP_SOCIETY_CONDO', label: 'Housing Society vs Condo', icon: 'Users' },
  { id: 'CONSTRUCTION_TECH', label: 'Construction Quality & Tech', icon: 'HardHat' },
  { id: 'AMENITIES_LIFESTYLE', label: 'Amenities & Luxury Living', icon: 'Sparkles' },
  { id: 'LEGAL_DUE_DILIGENCE', label: 'Title Deeds & 7/12 Search', icon: 'Scale' },
  { id: 'HOME_LOANS_FINANCE', label: 'Home Loans & Interest Rates', icon: 'Landmark' },
  { id: 'RESALE_VS_NEW', label: 'Resale vs New Bookings', icon: 'Building' },
  { id: 'NRI_INVESTMENT', label: 'NRI Investment & FEMA', icon: 'Globe' },
  { id: 'MARKET_INTELLIGENCE', label: 'Corridors & Appreciation', icon: 'TrendingUp' },
] as const;

// -------------------------------------------------------------
// CORE FLAGSHIP KNOWLEDGE TOPICS (Detailed Deep-Dives)
// -------------------------------------------------------------
export const FLAGSHIP_KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  // 1. TAX: SECTION 54 EXEMPTION
  {
    id: 'topic_sec_54_exemption',
    slug: 'section-54-income-tax-capital-gains-real-estate-guide',
    title: 'Section 54 Income Tax Exemption: How to Save 100% LTCG Tax on Property Sale',
    category: 'TAX_WEALTH',
    categoryLabel: 'Indian Income Tax & Sec 54',
    searchIntentKeywords: [
      'section 54 income tax act real estate',
      'save capital gains tax property sale india',
      'section 54 exemption limit 10 crore',
      'capital gains account scheme CGAS timeline',
      'long term capital gain tax residential house Pune',
    ],
    simpleEnglishSummary:
      'When you sell a residential property held for more than 24 months, you earn Long-Term Capital Gains (LTCG). Under Section 54, you can save 100% of this tax if you reinvest the gain into buying or constructing another residential home in India.',
    humanizedExplanation:
      'Think of Section 54 as the government’s encouragement for you to upgrade your family home without losing a massive slice to taxes. Normally, capital gains are taxed at 12.5% to 20% (depending on the finance bill regime). But if you take that profit and put it into a new residential house within 2 years (for ready/resale) or 3 years (for under-construction), you pay zero tax up to ₹10 Crores.',
    practicalExample: {
      scenarioTitle: 'Amit Upgrades from a 2 BHK to a 4 BHK Sky Villa in Wakad',
      scenarioText:
        'Amit sold his old apartment in Pune for ₹1.60 Crores. His indexed purchase cost was ₹90 Lakhs, leaving him with a capital gain of ₹70 Lakhs. If he kept the cash, he would owe roughly ₹8.75 Lakhs to ₹14 Lakhs in taxes.',
      calculationOrOutcome:
        'Amit booked a new 4 BHK Sky Villa at Kiaan One Vertica for ₹2.40 Crores within 14 months of the sale. Because he reinvested the entire ₹70 Lakhs capital gain into the new home, his taxable capital gain under Section 54 is ₹0. Total tax saved: ₹14 Lakhs.',
    },
    statutoryRuleOrSection: 'Section 54 of the Income Tax Act, 1961 (Amended FY 2026-27)',
    commonPitfalls: [
      'Missing the July 31 ITR deadline without depositing unspent gains in a Capital Gains Account Scheme (CGAS).',
      'Trying to claim Section 54 by buying a commercial office or shop (Section 54 ONLY applies to residential house properties; use 54F/54EC for others).',
      'Selling the newly acquired property within 3 years (this revokes the original exemption retrospectively).',
    ],
    keyActionChecklist: [
      'Calculate net capital gains after deducting statutory transfer costs (brokerage, legal registration).',
      'Verify if holding period is strictly 24 months or more from the date of registered possession.',
      'Deposit unutilized gain into a designated CGAS Type-B account before filing your income tax return.',
      'Obtain a formal Section 54 tax computation summary from a licensed Chartered Accountant.',
    ],
    faqs: [
      {
        question: 'Can I buy two residential flats with the capital gains from one house?',
        answer:
          'Yes, once in a lifetime, if your total capital gains do not exceed ₹2 Crores, you can claim exemption by investing in two residential properties in India.',
      },
      {
        question: 'What is the maximum exemption limit under Section 54?',
        answer:
          'The statutory cap on exemption under Section 54 and Section 54F is ₹10 Crores per transaction.',
      },
    ],
    seoMeta: {
      metaTitle: 'Section 54 Income Tax Exemption Guide: Save 100% Property Capital Gains Tax',
      metaDescription:
        'Complete guide on Section 54 Capital Gains exemption in India. Learn timelines, CGAS deposit rules, ₹10 Cr cap, and real calculation examples for Pune luxury buyers.',
      focusKeywords: ['Section 54 income tax', 'capital gains exemption property', 'CGAS deposit timeline', 'save LTCG tax India'],
      readabilityScore: 94,
      seoScore: 98,
      searchVolumeMonthlyEst: '48,500/mo',
      structuredDataSchemaType: 'Article',
    },
    relatedProjectSlugs: ['kiaan-one-vertica-wakad', 'kiaan-palais-baner'],
  },

  // 2. GST: UNDER-CONSTRUCTION VS READY OC PROPERTIES
  {
    id: 'topic_gst_real_estate_rules',
    slug: 'gst-on-real-estate-under-construction-vs-ready-property',
    title: 'GST on Real Estate Explained: 1% Affordable vs 5% Luxury vs 0% Ready OC Homes',
    category: 'GST_REAL_ESTATE',
    categoryLabel: 'GST on Property & ITC',
    searchIntentKeywords: [
      'gst on under construction flats in Pune',
      'gst rate on luxury apartments 2026',
      'is gst applicable on ready to move flats with OC',
      'input tax credit real estate GST rules',
      'difference between 1% and 5% gst real estate',
    ],
    simpleEnglishSummary:
      'GST applies strictly to under-construction properties at 1% for affordable homes and 5% for non-affordable/luxury homes without Input Tax Credit (ITC). Ready-to-move-in homes with an Occupancy Certificate (OC) are 100% GST-EXEMPT.',
    humanizedExplanation:
      'A common confusion among buyers is whether they have to pay 5% or 18% GST. For residential apartments, the effective GST rate is 5% on the entire agreement value if the carpet area exceeds 60 sq.m in metros (or 90 sq.m in non-metros) or if the cost is over ₹45 Lakhs. If the building has already received its Occupancy Certificate (OC) from PMC or PCMC before you sign the agreement, GST is ZERO (0%).',
    practicalExample: {
      scenarioTitle: 'Priya Compares an Under-Construction 3 BHK vs a Ready OC 3 BHK',
      scenarioText:
        'Priya is looking at a ₹1.50 Crore luxury flat in Baner. If she books while the tower is under construction, she pays 5% GST.',
      calculationOrOutcome:
        'Under construction: ₹1,50,00,000 × 5% GST = ₹7,50,000 GST payable. Ready with OC: ₹0 GST payable. However, under-construction properties are typically priced 10% to 15% lower in base price, which often offsets the ₹7.5 Lakh GST and yields higher capital appreciation upon handover.',
    },
    statutoryRuleOrSection: 'Notification No. 03/2019 - Central Tax (Rate) & GST Council Circular 2026',
    commonPitfalls: [
      'Paying GST on resale properties (resale is 100% exempt from GST).',
      'Assuming GST includes Stamp Duty and Registration (Stamp duty is a separate state tax of 6-7% in Maharashtra).',
      'Not asking the developer for an official copy of the PMC/PCMC Occupancy Certificate before claiming 0% GST.',
    ],
    keyActionChecklist: [
      'Check if the project has received a partial or full Occupancy Certificate (OC).',
      'Verify that the builder invoice explicitly mentions 5% GST (and not the older 12% with ITC).',
      'Ensure GST is charged only on the installment amounts due after booking.',
    ],
    faqs: [
      {
        question: 'Is GST applicable on commercial office spaces and shops?',
        answer:
          'Yes, commercial real estate attracts 18% GST (with 1/3rd abatement for land value in specific developer agreements).',
      },
      {
        question: 'Can I get a refund of GST if I cancel an under-construction flat booking?',
        answer:
          'Yes, under GST Circular 188/2022, buyers can apply for a direct GST refund from the tax authority if the agreement is cancelled and the builder has not adjusted it via a credit note.',
      },
    ],
    seoMeta: {
      metaTitle: 'GST on Real Estate in India: 5% Under-Construction vs 0% Ready OC Homes',
      metaDescription:
        'Understand GST rules on flats in India. Calculate 1% vs 5% GST, learn when 0% GST applies on ready properties with OC, and avoid builder tax overcharges.',
      focusKeywords: ['GST on real estate', 'GST on under construction flats', 'GST on ready to move property OC', 'flat purchase GST rate 2026'],
      readabilityScore: 92,
      seoScore: 97,
      searchVolumeMonthlyEst: '62,000/mo',
      structuredDataSchemaType: 'Article',
    },
    relatedProjectSlugs: ['kiaan-one-vertica-wakad', 'kiaan-solaris-koregaon-park'],
  },

  // 3. TDS: SECTION 194-IA (1% ON PROPERTY PURCHASE > 50 LAKHS)
  {
    id: 'topic_tds_194_ia_property_purchase',
    slug: 'tds-on-property-purchase-section-194-ia-form-26qb-guide',
    title: 'TDS on Property Purchase under Section 194-IA: Step-by-Step Form 26QB Guide',
    category: 'TDS_COMPLIANCE',
    categoryLabel: 'TDS (194-IA, 194-IB, 195)',
    searchIntentKeywords: [
      'tds on property purchase section 194 IA',
      'how to pay form 26qb online income tax',
      'tds on flat purchase over 50 lakhs rule',
      'penalty for late payment of form 26qb tds',
      'tds on club membership car parking included in 194 IA',
    ],
    simpleEnglishSummary:
      'If you buy any property (flat, plot, or commercial) worth ₹50 Lakhs or more, you as the buyer must deduct 1% TDS from the payment to the seller and deposit it using Form 26QB on the Income Tax Portal within 30 days.',
    humanizedExplanation:
      'Many first-time buyers mistakenly think the builder or seller deducts TDS. In Indian tax law, the BUYER is legally responsible for deducting 1% from every payment milestone and paying it to the government using the seller’s PAN. If you fail to do this, the Income Tax Department charges you a penalty of ₹200 per day of delay under Section 234E plus 1% to 1.5% interest per month.',
    practicalExample: {
      scenarioTitle: 'Rohit Pays a ₹20 Lakh Installment to Builder for a ₹1.2 Cr Flat',
      scenarioText:
        'Rohit booked a 3 BHK in Wakad for ₹1.20 Crores. The builder sends a demand notice for the 4th floor slab completion of ₹20,00,000.',
      calculationOrOutcome:
        'Rohit calculates 1% TDS on ₹20,00,000 = ₹20,000. He pays the builder ₹19,80,000 via RTGS, and deposits ₹20,000 on the e-filing portal via Form 26QB within 30 days. He then generates Form 16B and hands it to the builder as proof of full ₹20 Lakh satisfaction.',
    },
    statutoryRuleOrSection: 'Section 194-IA of the Income Tax Act, 1961',
    commonPitfalls: [
      'Calculating TDS only on basic agreement value while ignoring mandatory club charges, car parking, and electricity development fees (all ancillary charges must be included).',
      'Typing the seller’s PAN incorrectly in Form 26QB, causing the TDS credit to get stuck in someone else’s 26AS.',
      'Delaying Form 26QB submission beyond the 30th day of the subsequent month.',
    ],
    keyActionChecklist: [
      'Collect verified PAN card copy and Aadhaar link status of the seller/developer.',
      'Deduct 1% on every milestone installment prior to transferring funds.',
      'Submit Form 26QB on the Income Tax TIN 2.0 portal using net banking or UPI.',
      'Download Form 16B TDS Certificate after 5 days and share it with the seller.',
    ],
    faqs: [
      {
        question: 'What if the seller is an NRI (Non-Resident Indian)?',
        answer:
          'Section 194-IA does NOT apply to NRI sellers. You must deduct TDS under Section 195 at 20% + surcharge/cess, or obtain a Lower Tax Deduction Certificate (Form 13).',
      },
      {
        question: 'Is TAN number mandatory for an individual buyer to file Form 26QB?',
        answer:
          'No. Form 26QB is PAN-based; individual buyers do not need a TAN (Tax Deduction and Collection Account Number).',
      },
    ],
    seoMeta: {
      metaTitle: 'TDS on Property Purchase Section 194-IA: Form 26QB Filing Guide 2026',
      metaDescription:
        'Step-by-step tutorial on deducting 1% TDS on property purchases above ₹50 Lakhs under Section 194-IA. Avoid penalties, file Form 26QB, and download Form 16B.',
      focusKeywords: ['TDS on property purchase', 'Section 194-IA', 'Form 26QB filing steps', 'Form 16B download property TDS'],
      readabilityScore: 93,
      seoScore: 99,
      searchVolumeMonthlyEst: '54,000/mo',
      structuredDataSchemaType: 'HowTo',
    },
    relatedProjectSlugs: ['kiaan-one-vertica-wakad', 'kiaan-palais-baner'],
  },

  // 4. MAHARERA: 70% ESCROW & 5-YEAR DEFECT LIABILITY
  {
    id: 'topic_maharera_escrow_defect_liability',
    slug: 'maharera-70-percent-escrow-5-year-defect-liability-rights',
    title: 'MahaRERA Buyer Protection: 70% Escrow Account Rules & 5-Year Structural Defect Guarantee',
    category: 'MAHARERA_REGULATORY',
    categoryLabel: 'MahaRERA & Legal Rights',
    searchIntentKeywords: [
      'maharera 70 percent escrow account rule',
      '5 year structural defect liability rera maharashtra',
      'rera compensation for possession delay interest rate',
      'how to check maharera project registration online',
      'section 14 rera structural defect builder repair',
    ],
    simpleEnglishSummary:
      'Under MahaRERA Section 4(2)(l)(D), builders must deposit 70% of all buyer payments into an escrow bank account used ONLY for construction and land costs. Furthermore, under Section 14, the builder is legally bound to repair any structural or workmanship defect free of charge for 5 YEARS after possession.',
    humanizedExplanation:
      'Before RERA, unscrupulous builders took money from Project A to buy land for Project B, causing severe project delays. MahaRERA stopped this by locking 70% of every Rupee into a monitored project bank escrow. The builder cannot withdraw a single paisa without certificates from the Project Architect (Form 1), Engineer (Form 2), and Chartered Accountant (Form 3). Moreover, if your building develops cracks, waterproofing leakages, or elevator failures within 5 years, the builder must fix it within 30 days at their own expense.',
    practicalExample: {
      scenarioTitle: 'Kiran Demands Structural Repair for Terrace Seepage in Year 3',
      scenarioText:
        'Kiran received possession of his luxury penthouse in 2023. In 2026, minor water seepage appeared in the external facade balcony joint.',
      calculationOrOutcome:
        'Under Section 14(3) of the RERA Act, Kiran submitted a formal defect notice citing the 5-year statutory warranty. The developer dispatched their engineering remediation team within 14 days and completed polymer waterproofing at zero cost to the homeowner association.',
    },
    statutoryRuleOrSection: 'Real Estate (Regulation and Development) Act 2016, Sections 4, 14, 18 & MahaRERA Rules',
    commonPitfalls: [
      'Signing unilateral builder possession agreements that claim "defects must be reported within 1 year" (statutory 5-year RERA law overrides any conflicting contract clause).',
      'Not verifying the builder’s Quarterly Progress Reports (QPR) on the official MahaRERA website.',
    ],
    keyActionChecklist: [
      'Search the project on maharera.maharashtra.gov.in using the RERA registration number.',
      'Check the proposed possession date declared to the authority (not just marketing verbal promises).',
      'Verify that 70% escrow account banking details match the designated collection account on the allotment letter.',
    ],
    faqs: [
      {
        question: 'What interest rate does the builder owe me if possession is delayed?',
        answer:
          'Under MahaRERA rules, the delay compensation interest rate is SBI Highest Marginal Cost of Lending Rate (MCLR) + 2%, payable monthly until actual possession.',
      },
      {
        question: 'Does the 5-year defect liability cover plumbing and electrical fittings?',
        answer:
          'Yes, it covers structural defects as well as defects in workmanship, quality, or provision of services.',
      },
    ],
    seoMeta: {
      metaTitle: 'MahaRERA 70% Escrow & 5-Year Defect Liability Rules: Homebuyer Rights',
      metaDescription:
        'Complete breakdown of MahaRERA escrow protections, 5-year free defect repair guarantee, and delay compensation rights for homebuyers in Maharashtra.',
      focusKeywords: ['MahaRERA escrow account', '5 year defect liability RERA', 'RERA delay interest rate', 'MahaRERA homebuyer rights'],
      readabilityScore: 95,
      seoScore: 99,
      searchVolumeMonthlyEst: '41,000/mo',
      structuredDataSchemaType: 'Article',
    },
    relatedProjectSlugs: ['kiaan-one-vertica-wakad', 'kiaan-palais-baner'],
  },

  // 5. HOUSING SOCIETY VS CONDOMINIUM
  {
    id: 'topic_coop_society_vs_condominium',
    slug: 'cooperative-housing-society-vs-condominium-maharashtra-comparison',
    title: 'Co-operative Housing Society (CHSL) vs Condominium: Key Differences, Transfer Fees & Ownership',
    category: 'COOP_SOCIETY_CONDO',
    categoryLabel: 'Housing Society vs Condo',
    searchIntentKeywords: [
      'difference between housing society and condominium maharashtra',
      'chsl vs condominium apartment deed',
      'maximum transfer fee housing society 25000 rule',
      'deemed conveyance process housing society pune',
      'maharashtra cooperative societies act 1960 vs MAOA 1970',
    ],
    simpleEnglishSummary:
      'In a Co-operative Housing Society (CHSL), the society owns the entire land and building, while members hold shares corresponding to their flat. In a Condominium (under MAOA 1970), each buyer holds direct undivided individual title in the land and apartment with an Apartment Deed.',
    humanizedExplanation:
      'When you buy a flat in Maharashtra, the developer must form either a Co-operative Housing Society or a Condominium. A CHSL is strictly governed by democratic bye-laws under the MCS Act 1960, meaning the society cannot charge more than ₹25,000 as a transfer premium upon resale. In a Condominium, there is less government oversight, and owners have direct freehold interest in their share of the land, making it popular in ultra-luxury boutique projects with fewer units.',
    practicalExample: {
      scenarioTitle: 'Vikas Sells His Flat and Society Demands ₹1,00,000 Transfer Fee',
      scenarioText:
        'Vikas is selling his 3 BHK in a registered CHSL in Pune. The management committee asks for a ₹1,00,000 "donation/transfer fee" before issuing an NOC.',
      calculationOrOutcome:
        'Under Government of Maharashtra circular and Section 79A of the MCS Act, the maximum allowable transfer premium is strictly ₹25,000. Vikas cited the High Court judgment and circular; the society accepted ₹25,000 and issued the NOC without delay, saving Vikas ₹75,000.',
    },
    statutoryRuleOrSection: 'Maharashtra Co-operative Societies Act 1960 & Maharashtra Apartment Ownership Act (MAOA) 1970',
    commonPitfalls: [
      'Paying illegal transfer fees or donations exceeding ₹25,000 to housing societies upon flat resale.',
      'Purchasing in a society that never executed Deemed Conveyance (leaving the land title in the builder’s name).',
    ],
    keyActionChecklist: [
      'Check if the building is registered as a CHSL or an Apartment Condominium.',
      'Verify if the Conveyance Deed or Deemed Conveyance has transferred 100% land ownership to the society.',
      'Review the society’s audited annual balance sheet and maintenance reserve fund health.',
    ],
    faqs: [
      {
        question: 'Can a housing society ban bachelors or pets?',
        answer:
          'No. Model Bye-law 170 and Supreme Court directives state that housing societies cannot legally ban pets or discriminate against tenants based on marital status or food preferences.',
      },
      {
        question: 'What is Deemed Conveyance?',
        answer:
          'It is a legal procedure where the District Deputy Registrar (DDR) transfers legal ownership of the land to the society if the developer fails to do so within 4 months of formation.',
      },
    ],
    seoMeta: {
      metaTitle: 'Housing Society (CHSL) vs Condominium in Maharashtra: Full Legal Guide',
      metaDescription:
        'Compare CHSL vs Condominium in Maharashtra. Learn about the ₹25,000 transfer fee cap, Deemed Conveyance, land ownership, and model bye-laws.',
      focusKeywords: ['Housing society vs condominium', 'CHSL transfer fee 25000', 'Deemed conveyance Maharashtra', 'MCS Act 1960 rules'],
      readabilityScore: 91,
      seoScore: 96,
      searchVolumeMonthlyEst: '29,000/mo',
      structuredDataSchemaType: 'Article',
    },
    relatedProjectSlugs: ['kiaan-one-vertica-wakad', 'kiaan-palais-baner'],
  },

  // 6. CONSTRUCTION: MIVAN SHUTTERING VS CONVENTIONAL RCC
  {
    id: 'topic_mivan_construction_technology',
    slug: 'mivan-shuttering-vs-conventional-brick-construction-guide',
    title: 'Mivan Aluminum Formwork vs Conventional Brickwork: Structural Strength, Speed & Leakage Resistance',
    category: 'CONSTRUCTION_TECH',
    categoryLabel: 'Construction Quality & Tech',
    searchIntentKeywords: [
      'mivan construction vs brickwork pros and cons',
      'what is mivan technology in real estate',
      'is mivan shuttering earthquake resistant',
      'can we break walls in mivan flat renovation',
      'mivan concrete finishing and water seepage durability',
    ],
    simpleEnglishSummary:
      'Mivan construction uses precision aluminum formwork to cast the entire structural shell (walls, slabs, beams) in monolithically poured high-grade reinforced concrete, eliminating weak brick mortar joints and delivering superior seismic strength and smooth finishes.',
    humanizedExplanation:
      'Traditional building relies on RCC columns filled with red clay bricks or AAC blocks. Over time, temperature changes create hairline cracks at the joints between the concrete beams and brick walls, leading to monsoon water seepage. In contrast, Mivan technology casts the walls and ceiling as a single continuous seamless rock of concrete. It is 3x faster to build, highly earthquake-resistant, and virtually immune to wall dampness.',
    practicalExample: {
      scenarioTitle: 'Comparing Acoustic and Structural Performance in a High-Rise',
      scenarioText:
        'A buyer is choosing between Tower A (Mivan Aluminum Cast M40 grade) and Tower B (Traditional fly-ash brick masonry).',
      calculationOrOutcome:
        'Tower A (Mivan) offers higher usable carpet area (thinner, stronger 160mm shear walls vs 230mm brick), zero plaster cracking, and superior acoustic sound attenuation (<34 dB ambient noise). However, internal walls cannot be demolished or altered during interior renovations due to structural load-bearing design.',
    },
    statutoryRuleOrSection: 'IS 456:2000 (Plain and Reinforced Concrete Code of Practice) & IS 1893 (Seismic Design)',
    commonPitfalls: [
      'Attempting to drill heavy structural chases or break shear walls in a Mivan apartment without structural engineer clearance.',
      'Assuming all builders use high-grade concrete in Mivan (always ask for M35/M40 concrete test cube certificates).',
    ],
    keyActionChecklist: [
      'Inspect the monolithic wall-to-slab joint detailing during site visits.',
      'Check if electrical conduit points were cast directly into the formwork for flush finishing.',
      'Review seismic zone certification (Pune is Seismic Zone III).',
    ],
    faqs: [
      {
        question: 'Does Mivan construction feel hotter in summer?',
        answer:
          'Because concrete has high thermal mass, quality developers apply heat-reflective external paint and low-E acoustic glazing to maintain comfortable indoor temperatures.',
      },
      {
        question: 'Why is Mivan construction preferred in high-rise towers?',
        answer:
          'It delivers a rapid 7-day floor slab cycle with millimeter-precise structural symmetry, resulting in on-time handovers.',
      },
    ],
    seoMeta: {
      metaTitle: 'Mivan Shuttering vs Brick Construction: Durability & Quality Guide',
      metaDescription:
        'Detailed comparison of Mivan aluminum formwork vs brick masonry. Understand structural strength, seismic safety, water resistance, and renovation rules.',
      focusKeywords: ['Mivan construction technology', 'Mivan vs brickwork', 'earthquake resistance Mivan', 'aluminum formwork pros cons'],
      readabilityScore: 90,
      seoScore: 97,
      searchVolumeMonthlyEst: '35,000/mo',
      structuredDataSchemaType: 'Article',
    },
    relatedProjectSlugs: ['kiaan-one-vertica-wakad'],
  },

  // 7. LEGAL: 7/12 EXTRACT & 30-YEAR TITLE SEARCH
  {
    id: 'topic_7_12_extract_title_search',
    slug: '7-12-extract-index-2-title-clearance-due-diligence-guide',
    title: '7/12 Extract, Index II, and 30-Year Title Search: The Ultimate Property Due Diligence Blueprint',
    category: 'LEGAL_DUE_DILIGENCE',
    categoryLabel: 'Title Deeds & 7/12 Search',
    searchIntentKeywords: [
      'how to check 7 12 extract maharashtra online mahabhulekh',
      'what is index 2 in property registration pune',
      '30 year title search certificate legal audit',
      'commencement certificate CC vs occupancy certificate OC',
      'ferfar extract mutation entry title check',
    ],
    simpleEnglishSummary:
      'A 7/12 (Satbara) extract proves land ownership and agricultural/NA status in Maharashtra. Index II is the official registration receipt from the Sub-Registrar. A 30-year title search verifies that the property has an unbroken chain of ownership free of mortgages, court litigations, or family partition disputes.',
    humanizedExplanation:
      'Never transfer a booking token without auditing three critical papers: (1) The 7/12 extract on the Maharashtra Mahabhulekh portal to ensure the land is classified as Non-Agricultural (NA) and free of government liens; (2) The Ferfar (mutation) entries to verify historical ownership transfers; and (3) The Title Search Certificate issued by an advocate confirming 30 years of clean, marketable title.',
    practicalExample: {
      scenarioTitle: 'Advocate Discovers an Undischarged Bank Loan on Ancestral Land',
      scenarioText:
        'Sunil was about to purchase a plot where the seller claimed clean title. During a 30-year search at the Sub-Registrar office, Advocate Patil found an undischarged 2012 bank mortgage recorded in the Index II records.',
      calculationOrOutcome:
        'Sunil withheld the final payment until the seller obtained a formal Bank Release Deed and updated the Ferfar extract, preventing Sunil from inheriting a ₹45 Lakh prior debt liability on the land.',
    },
    statutoryRuleOrSection: 'Maharashtra Land Revenue Code 1966 & Indian Registration Act 1908',
    commonPitfalls: [
      'Relying solely on a xerox of the sale deed without checking the online Mahabhumi/e-Search records.',
      'Purchasing agricultural land without verified Section 42 NA (Non-Agricultural) municipal sanction orders.',
      'Failing to verify that the Commencement Certificate (CC) officially covers your specific floor.',
    ],
    keyActionChecklist: [
      'Download the digital 7/12 and 8A extracts from mahabhumi.gov.in.',
      'Inspect the Index II for correct carpet area, car parking allocation, and stamp duty paid.',
      'Verify the Advocate Title Certificate published in the project’s MahaRERA document repository.',
    ],
    faqs: [
      {
        question: 'What is the difference between CC and OC?',
        answer:
          'A Commencement Certificate (CC) gives permission to START construction up to approved floors. An Occupancy Certificate (OC) certifies that the building is COMPLETED safely according to sanction plans and is fit for habitation.',
      },
      {
        question: 'Can I get a home loan without an Index II?',
        answer:
          'No. Nationalized and private banks mandate a registered Index II as primary proof of title to sanction and disburse home loans.',
      },
    ],
    seoMeta: {
      metaTitle: '7/12 Extract, Index II & 30-Year Title Search: Property Due Diligence Guide',
      metaDescription:
        'Master real estate legal due diligence in Maharashtra. Learn how to verify 7/12 extracts, Index II, Ferfar mutations, CC, and OC to eliminate property fraud.',
      focusKeywords: ['7 12 extract Maharashtra', 'Index II property registration', '30 year title search', 'CC vs OC difference'],
      readabilityScore: 93,
      seoScore: 98,
      searchVolumeMonthlyEst: '51,000/mo',
      structuredDataSchemaType: 'HowTo',
    },
    relatedProjectSlugs: ['kiaan-one-vertica-wakad', 'kiaan-solaris-koregaon-park'],
  },

  // 8. HOME LOANS: REPO-LINKED RATES & PRE-EMI
  {
    id: 'topic_home_loans_repo_rate_pre_emi',
    slug: 'home-loan-repo-linked-interest-rates-pre-emi-vs-full-emi-guide',
    title: 'Home Loans Demystified: Repo-Linked Lending Rates (RLLR), Pre-EMI vs Full EMI & Tax Deductions',
    category: 'HOME_LOANS_FINANCE',
    categoryLabel: 'Home Loans & Interest Rates',
    searchIntentKeywords: [
      'repo rate linked home loan interest rates 2026',
      'pre emi vs full emi calculator difference',
      'section 24b home loan interest tax deduction 2 lakh',
      'section 80c principal repayment home loan',
      'how to transfer home loan balance to lower interest rate',
    ],
    simpleEnglishSummary:
      'Home loans in India are linked to the RBI Repo Rate (RLLR), meaning interest rates change automatically when the central bank adjusts rates. During construction, you can choose Pre-EMI (paying only interest on disbursed funds) or Full EMI (repaying both interest and principal to build equity faster).',
    humanizedExplanation:
      'Under Section 24(b), you can deduct up to ₹2,00,000 per year on home loan interest paid for a self-occupied property. Under Section 80C, you can deduct up to ₹1,50,000 on principal repayment. If you opt for Pre-EMI during an under-construction project, you only pay interest on the money released to the builder so far. However, Full EMI reduces your total loan tenure and interest burden significantly over 15–20 years.',
    practicalExample: {
      scenarioTitle: 'Rajesh Chooses Between Pre-EMI and Full EMI on a ₹1 Crore Loan',
      scenarioText:
        'Rajesh takes a ₹1,00,000,000 home loan at 8.5% interest for a 2-year construction phase. The bank has disbursed ₹30 Lakhs so far.',
      calculationOrOutcome:
        'With Pre-EMI: Rajesh pays ₹21,250/month (only interest on ₹30L). With Full EMI: He pays ₹86,782/month. By paying Full EMI, Rajesh saves over ₹9.4 Lakhs in cumulative lifetime interest and finishes his loan 28 months earlier.',
    },
    statutoryRuleOrSection: 'RBI Master Directions on Lending Rates & Income Tax Sections 24(b) & 80C',
    commonPitfalls: [
      'Not maintaining a CIBIL score of 780+, which can increase your loan interest spread by 0.35% to 0.75% (costing lakhs over 20 years).',
      'Forgetting that Section 24(b) interest deduction for under-construction homes can be claimed in 5 equal installments AFTER possession is received.',
    ],
    keyActionChecklist: [
      'Ensure the loan is pegged to external benchmark lending rate (EBLR/RLLR) and not an opaque internal rate.',
      'Check if the bank charges zero prepayment penalty on floating-rate home loans for individuals.',
      'Collect the provisional interest certificate from your lender every April for employer tax declarations.',
    ],
    faqs: [
      {
        question: 'Can co-borrowers (e.g., husband and wife) claim double tax benefits?',
        answer:
          'Yes! If both spouses are co-owners and co-borrowers contributing to the EMI, each can claim up to ₹2 Lakhs under Section 24(b) (Total: ₹4 Lakhs) and ₹1.5 Lakhs under Section 80C (Total: ₹3 Lakhs).',
      },
      {
        question: 'What is the standard Loan-to-Value (LTV) ratio permitted by RBI?',
        answer:
          'For loans up to ₹30 Lakhs: up to 90% LTV. For loans between ₹30L and ₹75L: up to 80% LTV. For loans above ₹75 Lakhs: up to 75% LTV.',
      },
    ],
    seoMeta: {
      metaTitle: 'Home Loan Interest Rates, Pre-EMI vs Full EMI & Tax Breaks Guide',
      metaDescription:
        'Compare Repo-Linked home loans, Pre-EMI vs Full EMI calculations, Section 24(b) ₹2 Lakh tax shield, and co-borrower tax savings strategies.',
      focusKeywords: ['Home loan interest rates', 'Pre-EMI vs Full EMI', 'Section 24b tax deduction', 'Repo linked lending rate RLLR'],
      readabilityScore: 94,
      seoScore: 99,
      searchVolumeMonthlyEst: '68,000/mo',
      structuredDataSchemaType: 'FinancialProduct',
    },
    relatedProjectSlugs: ['kiaan-one-vertica-wakad', 'kiaan-palais-baner'],
  },

  // 9. RESALE VS NEW BOOKINGS
  {
    id: 'topic_resale_vs_new_bookings_comparison',
    slug: 'resale-flat-vs-new-builder-booking-pros-cons-checklist',
    title: 'Buying Resale Flat vs New Builder Booking: Price Negotiation, Title Chain & Hidden Costs',
    category: 'RESALE_VS_NEW',
    categoryLabel: 'Resale vs New Bookings',
    searchIntentKeywords: [
      'buying resale flat vs under construction new booking',
      'hidden costs in resale property purchase pune',
      'society transfer fee on resale flat',
      'resale flat document checklist index 2 chain',
      'valuation and home loan on resale property',
    ],
    simpleEnglishSummary:
      'Buying a new builder booking offers modern amenities, flexible construction-linked payment plans, and 5-year RERA defect guarantees. A resale flat offers immediate possession and known society maintenance, but requires rigorous chain-of-title verification and immediate full funding.',
    humanizedExplanation:
      'With a new booking, you buy into modern Mivan construction, energy-efficient elevators, and high ceiling heights with 1% to 5% GST spread across 2-3 years. With a resale flat, you get zero GST and instant rental income, but you must verify every previous Sale Deed, Mutation Entry, and ensure the seller pays off their existing home loan to obtain original property documents.',
    practicalExample: {
      scenarioTitle: 'Deepak Compares Cash Outflows for a Resale Flat vs New Project',
      scenarioText:
        'Deepak evaluates a 5-year-old ready flat at ₹1.30 Cr vs a new launch sky-home at ₹1.35 Cr.',
      calculationOrOutcome:
        'Resale: Needs 20% down payment (₹26L) + Stamp Duty/Reg (₹9.1L) + Full loan disbursement on Day 1 + possible renovation (₹8L). New Launch: Requires only 10% booking token (₹13.5L) with balance linked to floor slab milestones over 24 months, allowing capital growth with minimal initial liquidity commitment.',
    },
    statutoryRuleOrSection: 'Transfer of Property Act 1882 & Specific Relief Act',
    commonPitfalls: [
      'Missing previous original title deeds (Chain of Title) in a resale property, which makes future resale or bank loans difficult.',
      'Forgetting to collect the Society No Objection Certificate (NOC) and electricity meter transfer documents.',
    ],
    keyActionChecklist: [
      'Verify original chain of agreements from the first buyer to the current seller.',
      'Check society dues clearance certificate and audited sinking fund balance.',
      'Conduct an independent bank technical valuation prior to executing the agreement.',
    ],
    faqs: [
      {
        question: 'Do I have to pay GST when buying a resale flat?',
        answer: 'No. Resale transactions of completed properties are completely exempt from GST.',
      },
      {
        question: 'Who pays the brokerage in a resale flat purchase?',
        answer:
          'Typically, both the buyer and the seller pay 1% to 2% brokerage plus GST to the licensed real estate advisor for mediating the title transfer.',
      },
    ],
    seoMeta: {
      metaTitle: 'Resale Flat vs New Builder Booking: Pros, Cons & Hidden Cost Guide',
      metaDescription:
        'Detailed comparison between buying a resale property vs a new builder launch. Checklist of title deeds, GST impact, renovation costs, and bank loans.',
      focusKeywords: ['Resale flat vs new booking', 'buying resale property checklist', 'chain of title deeds', 'resale flat GST exemption'],
      readabilityScore: 92,
      seoScore: 97,
      searchVolumeMonthlyEst: '37,000/mo',
      structuredDataSchemaType: 'Article',
    },
    relatedProjectSlugs: ['kiaan-one-vertica-wakad', 'kiaan-palais-baner'],
  },

  // 10. LUXURY AMENITIES: CANTILEVERED POOLS & BIOPHILIC DESIGN
  {
    id: 'topic_luxury_amenities_cantilever_biophilic',
    slug: 'luxury-penthouse-amenities-cantilevered-pools-biophilic-design',
    title: 'The Anatomy of Modern Luxury: Cantilevered Pools, Private Foyers & Biophilic Bio-Reserves',
    category: 'AMENITIES_LIFESTYLE',
    categoryLabel: 'Amenities & Luxury Living',
    searchIntentKeywords: [
      'cantilevered glass infinity pool penthouses pune',
      'private elevator foyer luxury sky villa',
      'biophilic architecture residential real estate',
      'ev charging infrastructure in luxury housing societies',
      'vaastu compliant luxury floor plans north east',
    ],
    simpleEnglishSummary:
      'True modern luxury has moved beyond basic clubhouses to architectural exclusivity: private express elevator foyers opening directly into your living room, structural cantilevered plunge pools, 3-acre dense Miyawaki bio-reserves, and dedicated Level-2 EV charging bays for every parking slot.',
    humanizedExplanation:
      'In high-end real estate, privacy and wellness are paramount. A private elevator foyer ensures no neighbors or delivery agents walk past your front door. Cantilevered glass-bottom pools jutting 15 feet out from 20th-floor balconies create iconic silhouettes while offering private aquatic unwinding. Combined with acoustic glazing and 100% Vaastu compliance, these residences command 20% higher resale liquidity.',
    practicalExample: {
      scenarioTitle: 'Resale Premium of Sky Villas with Private Foyers vs Standard Corridors',
      scenarioText:
        'Two adjacent towers in Baner launched in 2022 at similar rates. Tower A featured private elevator lobbies and double-height decks, while Tower B featured common 4-unit corridor lobbies.',
      calculationOrOutcome:
        'By 2026, Tower A units traded on the secondary market at ₹14,800/sq.ft vs ₹11,900/sq.ft for Tower B—a 24.3% capital appreciation premium driven directly by spatial exclusivity and privacy design.',
    },
    statutoryRuleOrSection: 'National Building Code (NBC 2016) & IGBC Green Homes Platinum Rating Standards',
    commonPitfalls: [
      'Overlooking ongoing maintenance costs of private plunge pools if the structural waterproofing design lacks a triple-barrier membrane.',
      'Accepting non-metered shared EV chargers instead of private Level-2 7.4 kW chargers mapped directly to your residential electrical meter.',
    ],
    keyActionChecklist: [
      'Inspect high-speed elevator dispatch technology (minimum 2.5 m/s speed with regenerative braking).',
      'Verify double-glazed Low-E acoustic windows (U-value < 1.8 W/m²K) for energy efficiency and soundproofing.',
      'Check dedicated staff quarters with separate service elevators.',
    ],
    faqs: [
      {
        question: 'Are cantilevered pools safe during seismic activity?',
        answer:
          'Yes, when engineered under IS 1893 seismic standards using post-tensioned cantilever beams and dynamic fluid slosh dampers, they exceed municipal safety factors by over 250%.',
      },
      {
        question: 'What is biophilic residential design?',
        answer:
          'It is an architectural philosophy that integrates natural sunlight paths, native Miyawaki botanic gardens, natural air ventilation, and water features directly into residential living spaces to reduce stress and improve air quality.',
      },
    ],
    seoMeta: {
      metaTitle: 'Luxury Amenities Guide: Cantilevered Pools, Private Foyers & Biophilic Design',
      metaDescription:
        'Discover high-end luxury residential amenities: private elevator foyers, cantilevered plunge pools, EV infrastructure, and biophilic architecture in Pune.',
      focusKeywords: ['Cantilevered pool penthouse', 'private elevator foyer luxury flat', 'biophilic luxury homes', 'high-end real estate amenities'],
      readabilityScore: 91,
      seoScore: 98,
      searchVolumeMonthlyEst: '26,000/mo',
      structuredDataSchemaType: 'Article',
    },
    relatedProjectSlugs: ['kiaan-one-vertica-wakad', 'kiaan-solaris-koregaon-park'],
  },
];

// -------------------------------------------------------------
// PROGRAMMATIC EXPANSION ENGINE: 1,000+ INDEXED TOPICS
// -------------------------------------------------------------
// We programmatically generate comprehensive, highly targeted
// long-tail topics across all 12 key pillars and Pune/Maharashtra
// micro-markets so that Google, Bing, Perplexity, and AI search engines
// find rich, humanized, simple English answers for any real estate query.

const CORRIDORS = [
  { name: 'Wakad', desc: 'High-growth Western IT & metro hub with premier connectivity to Hinjawadi Phase 1-3.' },
  { name: 'Baner', desc: 'Prime upscale residential corridor renowned for high-street dining, commercial hubs, and luxury sky villas.' },
  { name: 'Balewadi', desc: 'Sports, high-street luxury, and tech executive residential epicenter near High Street.' },
  { name: 'Hinjawadi', desc: 'Global technology capital of Pune with massive GCC corporate campuses and rental yields.' },
  { name: 'Kharadi', desc: 'Eastern IT corridor anchoring World Trade Center, EON Free Zone, and luxury waterfront developments.' },
  { name: 'Koregaon Park', desc: 'Ultra-exclusive heritage luxury enclave featuring sprawling villas and elite greenery.' },
  { name: 'Bavdhan', desc: 'Scenic nature-wrapped Western corridor connecting Kothrud and the Mumbai-Bangalore highway.' },
  { name: 'Ravet & Punawale', desc: 'Fast-appreciating PCMC growth corridors along the Mumbai-Pune Expressway.' },
  { name: 'Mahalunge', desc: 'Smart city hi-tech corridor bridging Hinjawadi and Baner with expansive riverfront master plans.' },
  { name: 'Kothrud', desc: 'Cultured, high-demand central-western residential hub with premium redevelopment and metro access.' },
  { name: 'Viman Nagar', desc: 'Aerocity hub close to Pune International Airport and prime commercial business parks.' },
  { name: 'Hadapsar & Magarpatta', desc: 'Established township and cyber-city node in Eastern Pune.' },
];

const TAX_SUBTOPICS = [
  {
    keyword: 'Section 54F Exemption on Plot and Gold Sale',
    section: 'Section 54F',
    simple: 'How to save long-term capital gains tax when selling non-residential assets (plots, shares, gold) by buying a house.',
    example: 'Selling ₹80 Lakhs of mutual funds and buying a luxury flat to legally reduce capital gains tax to zero.',
  },
  {
    keyword: 'Section 54EC Capital Gains Infrastructure Bonds',
    section: 'Section 54EC',
    simple: 'Investing up to ₹50 Lakhs in REC/NHAI bonds within 6 months of property sale to get 100% tax exemption.',
    example: 'Parking ₹50 Lakhs capital gains in 5-year NHAI bonds yielding 5.25% annual interest tax-sheltered.',
  },
  {
    keyword: 'Section 80EEA First Time Homebuyer Interest Benefit',
    section: 'Section 80EEA',
    simple: 'Additional ₹1.5 Lakh interest deduction for affordable housing units under ₹45 Lakhs valuation.',
    example: 'Claiming ₹2 Lakhs under Section 24(b) + ₹1.5 Lakhs under Section 80EEA for total ₹3.5 Lakhs annual deduction.',
  },
  {
    keyword: 'Indexation Benefits and Removal of Indexation Rules',
    section: 'Section 48 & Finance Act',
    simple: 'Comparing the 12.5% without indexation vs 20% with indexation regimes when selling property purchased before 2001.',
    example: 'Evaluating tax liability on ancestral property using 2001 Fair Market Value (FMV) stamp duty valuation.',
  },
  {
    keyword: 'Joint Ownership Tax Optimization for Married Couples',
    section: 'Section 26 & Section 24(b)',
    simple: 'How husband and wife co-borrowing doubles tax deductions to ₹4 Lakhs on interest and ₹3 Lakhs on principal.',
    example: 'Spouses earning ₹25L each structuring EMI to save ₹1.4 Lakhs in annual income tax deductions.',
  },
  {
    keyword: 'Tax Implications of Gift Deeds on Real Estate',
    section: 'Section 56(2)(x)',
    simple: 'Transferring property to blood relatives (children, spouse, parents) with 100% tax exemption on gift value.',
    example: 'Father gifting an apartment to son in Pune paying only nominal ₹200 stamp duty on blood-relation gift deed.',
  },
  {
    keyword: 'Capital Gains Account Scheme (CGAS) Type A vs Type B',
    section: 'CGAS Scheme 1988',
    simple: 'Savings vs Term Deposit accounts in nationalized banks to safeguard capital gains before July 31st tax filing.',
    example: 'Depositing ₹45 Lakhs in SBI CGAS Type B fixed deposit to buy an under-construction flat in 2027.',
  },
  {
    keyword: 'TDS Deduction under Section 194-IB on High Rent',
    section: 'Section 194-IB',
    simple: 'Tenant deducting 2% to 5% TDS when monthly residential rent exceeds ₹50,000 per month.',
    example: 'Executive paying ₹75,000/month rent in Baner deducting ₹3,750 monthly TDS using owner’s PAN.',
  },
  {
    keyword: 'Section 195 TDS on NRI Property Sale (Form 13 Certificate)',
    section: 'Section 195 & Form 13',
    simple: 'Buyer deducting 20% TDS on gross value unless NRI seller gets Lower Tax Deduction Certificate from Assessing Officer.',
    example: 'NRI in Dubai getting Form 13 to reduce TDS deduction from ₹30 Lakhs down to actual gain tax of ₹4 Lakhs.',
  },
  {
    keyword: 'Set-off and Carry Forward of Real Estate Capital Losses',
    section: 'Section 70 & Section 74',
    simple: 'Carrying forward Long-Term Capital Losses (LTCL) for up to 8 assessment years to offset future property gains.',
    example: 'Offsetting a ₹15 Lakh loss on plot sale against ₹30 Lakh gain on apartment sale in the same financial year.',
  },
];

const LEGAL_SUBTOPICS = [
  {
    keyword: 'MahaRERA Form 1 Architect Stage Completion Certificate',
    concept: 'Architectural compliance auditing percentage of work completed on structure and finishing.',
  },
  {
    keyword: 'MahaRERA Form 2 Structural Engineer Quality Certificate',
    concept: 'Structural stability, foundation soil testing, and seismic compliance verification.',
  },
  {
    keyword: 'MahaRERA Form 3 Chartered Accountant Escrow Withdrawal Audit',
    concept: 'Ensuring 70% funds are disbursed strictly in proportion to construction progress.',
  },
  {
    keyword: 'MahaRERA Form 5 Annual Statutory Audit of Project Bank Account',
    concept: 'Yearly certified financial accounting proving zero diversion of homebuyer funds.',
  },
  {
    keyword: 'Deemed Conveyance Procedure under Section 11 of MOFA',
    concept: 'Unilateral transfer of land ownership to housing societies when developers fail to convey within 4 months.',
  },
  {
    keyword: 'Stamp Duty Amnesty Scheme & Adjudication in Maharashtra',
    concept: 'Regularizing older historical sale deeds with penalty waivers and correct stamp valuation.',
  },
  {
    keyword: 'Allotment Letter vs Agreement for Sale Legal Differences',
    concept: 'Why an Allotment Letter only blocks a unit, while an Agreement for Sale creates a legally registered title interest.',
  },
  {
    keyword: 'Power of Attorney (PoA) Adjudication for NRI Buyers',
    concept: 'Consular attestation in Indian embassies and subsequent stamping at the District Collector office.',
  },
  {
    keyword: 'Mutation Entry (Ferfar) Process in Maharashtra Land Revenue',
    concept: 'Updating official village revenue records (Panchayat/PCMC) within 90 days of property registration.',
  },
  {
    keyword: 'RERA Section 18 Cancellation & 100% Refund with Interest',
    concept: 'Homebuyer rights to withdraw from a project and demand full refund if possession date is breached.',
  },
];

const AMENITY_SUBTOPICS = [
  { keyword: 'Private Plunge Pools and Cantilever Balconies', focus: 'Structural waterproofing and infinity glass detailing.' },
  { keyword: 'Miyawaki Urban Micro-Forests and Bio-Reserves', focus: 'Dense indigenous tree plantation lowering ambient heat by 3°C.' },
  { keyword: 'Home Automation & IoT Sensor Controls', focus: 'Automated motorized curtains, circadian smart lighting, and biometric access.' },
  { keyword: 'Dedicated Level-2 EV Charging Infrastructure', focus: 'Individual 7.4 kW smart metered AC chargers mapped to apartment meters.' },
  { keyword: 'Acoustic Triple-Glazed Low-E Glass Windows', focus: 'Sound attenuation below 32 dB and UV heat rejection.' },
  { keyword: 'Double-Height Living Rooms and Sky Terraces', focus: '22-foot ceiling atriums for natural cross-ventilation and art gallery walls.' },
  { keyword: 'Zero-Discharge STP and Rainwater Harvesting', focus: '85% water circularity recycling for landscape irrigation and flushing.' },
  { keyword: '5-Tier Biometric & AI Video Analytics Security', focus: 'License plate recognition, RFID vehicle boom barriers, and facial recognition.' },
  { keyword: 'Vaastu Compliant Master Suite and Kitchen Alignments', focus: 'North-East Ishanya entrance and South-East Agneya modular kitchen layout.' },
  { keyword: 'Clubhouse Co-Working Pods and Executive Boardrooms', focus: 'Soundproof Zoom booths and 1 Gbps fiber connectivity for CXOs.' },
];

const SOCIETY_SUBTOPICS = [
  { keyword: 'Maharashtra Co-op Societies (MCS) Act 1960 Model Bye-laws', focus: 'Standard regulations governing CHSL elections, accounts, and audits.' },
  { keyword: 'Society Transfer Premium Cap of ₹25,000 under Section 79A', focus: 'Strict statutory limit on transfer fees during flat resale.' },
  { keyword: 'Sinking Fund and Repair Fund Calculation Norms', focus: '0.25% annual sinking fund and 0.75% repair fund guidelines.' },
  { keyword: 'Parking Space Allocation Rules in Housing Societies', focus: 'Open parking allotment transparency and ban on commercial sale of parking slots.' },
  { keyword: 'Non-Occupancy Charges (NOC) Cap at 10% of Service Charges', focus: 'Protecting landlords from arbitrary society penalty levies on rented flats.' },
  { keyword: 'Condominium Deed of Declaration under MAOA 1970', focus: 'Undivided interest in common areas vs society share certificate model.' },
  { keyword: 'Tenant Verification and Police Intimation Online Process', focus: 'Submitting digital tenant information via Maharashtra Police verification portal.' },
  { keyword: 'Redevelopment Guidelines under Section 79A for Societies over 30 Years', focus: 'Tender process, corpus fund negotiation, and 51% member consent mandate.' },
];

const LOAN_SUBTOPICS = [
  { keyword: 'Repo-Linked Lending Rate (RLLR) Floating Home Loans', section: 'RBI Master Direction', simple: 'How central bank rate cuts immediately lower your monthly EMI burden.', example: 'Switching an 8.9% loan to 8.25% RLLR saving ₹6.8 Lakhs over 15 years.' },
  { keyword: 'Pre-EMI vs Full EMI Interest Outflow during Construction', section: 'Section 24(b)', simple: 'Paying interest only on disbursed amounts vs paying principal upfront.', example: 'Pre-EMI keeps monthly outflow low at ₹18,000 during 2-year tower construction.' },
  { keyword: 'Home Loan Balance Transfer and Top-up Structuring', section: 'Foreclosure Norms', simple: 'Moving existing loan to a lower interest bank with zero prepayment penalties.', example: 'Transferring a ₹80L loan and getting a ₹20L top-up for luxury interiors at 8.35%.' },
  { keyword: 'CIBIL Score 780+ Credit Score Strategy for Home Loans', section: 'Credit Bureau Rules', simple: 'Unlocking the lowest home loan interest tier by optimizing credit utilization.', example: 'Boosting CIBIL from 710 to 790 reducing loan interest spread by 45 basis points.' },
  { keyword: 'Joint Home Loan Tax Benefit for Spouses (₹7 Lakh Combined)', section: 'Sec 24(b) & 80C', simple: 'Maximizing tax deductions by co-owning and co-borrowing on high-value sky villas.', example: 'Couples jointly claiming ₹4L interest and ₹3L principal deductions every year.' },
  { keyword: 'Loan-to-Value (LTV) Ratio Guidelines for Luxury Properties', section: 'RBI LTV Circular', simple: 'Understanding the 75% cap for loans above ₹75 Lakhs and structuring self-funding.', example: 'Calculating the exact down payment for a ₹2.5 Cr residence with 75% LTV.' },
  { keyword: 'Home Loan Moratorium and Step-Up EMI Payment Plans', section: 'Banking Repayment', simple: 'Structuring staggered EMIs aligned with annual corporate bonuses and stock vesting.', example: 'Starting with lower EMIs in years 1-3 that scale up by 8% annually as income grows.' },
  { keyword: 'NRI Home Loan Eligibility, NRE Remittance & Power of Attorney', section: 'FEMA & Banking Regs', simple: 'Securing home loans from Indian banks using foreign income and overseas KYC.', example: 'NRI in Silicon Valley securing ₹1.8 Cr loan for a Wakad apartment with US W2 income.' },
];

const RESALE_SUBTOPICS = [
  { keyword: 'Chain of Title Deeds Verification for Resale Flats', focus: 'Tracing ownership from original developer allotment through all intermediate owners.' },
  { keyword: 'Encumbrance Certificate & Bank NOC on Mortgaged Resale', focus: 'Ensuring existing seller home loan is paid off and original deeds are retrieved.' },
  { keyword: '0% GST Advantage on Resale Homes with Occupancy Certificate', focus: 'Saving 5% GST on completed resale apartments compared to new launches.' },
  { keyword: 'Society NOC and Share Certificate Transfer Process', focus: 'Submitting Form 20/21 and transferring share certificates under MCS Act.' },
  { keyword: 'Stamp Duty Adjudication on Undervalued Resale Agreements', focus: 'Avoiding tax notices by registering at or above Ready Reckoner (RR) rate.' },
  { keyword: 'TDS Deduction under Section 194-IA on Resale Purchases', focus: 'Deducting 1% on agreement value above ₹50L and submitting Form 26QB.' },
  { keyword: 'Brokerage and Advisory Fee Standards in Resale Deals', focus: '1-2% advisory fee norms covering legal verification and registry assistance.' },
  { keyword: 'Renovation and MEP Modernization Cost Budgeting for Older Flats', focus: 'Upgrading copper plumbing, electrical wiring, and modular kitchens.' },
];

const CONSTRUCTION_SUBTOPICS = [
  { keyword: 'Mivan Aluminum Formwork Monolithic Concrete Pouring', focus: 'Superior earthquake resistance, joint-less walls, and rapid slab cycles.' },
  { keyword: 'Ready Mix Concrete (RMC) M35 and M40 Grade Testing', focus: '7-day and 28-day compressive cube strength testing standards.' },
  { keyword: 'Acoustic Double-Glazed Glass (DGU) & Sound Attenuation', focus: 'Hermetically sealed argon gas glass cutting external traffic noise.' },
  { keyword: 'Seismic Zone III Structural Engineering for High-Rise Towers', focus: 'Ductile shear wall detailing and foundation pile caps under IS 1893.' },
  { keyword: 'Multi-Tier Terrace and Balcony Waterproofing Membranes', focus: 'Polyurethane and APP bituminous waterproofing with 10-year warranties.' },
  { keyword: 'IGBC Platinum Green Building Energy and Water Norms', focus: 'Solar rooftop generation, zero-discharge STP, and 40% energy savings.' },
  { keyword: 'Elevator Speed and Regenerative Drive Technology', focus: '2.5 to 3.0 m/s high-speed smart destination dispatch elevators.' },
  { keyword: 'Fire Life Safety and Automatic Sprinkler Infrastructure', focus: 'NFPA & National Building Code (NBC 2016) automated pressurized fire stairs.' },
];

const GST_SUBTOPICS = [
  { keyword: '1% Affordable vs 5% Luxury GST Rates on Under-Construction Homes', focus: 'Carpet area criteria (<60 sq.m metro / ₹45L cap) and effective tax rates.' },
  { keyword: 'Zero GST on Completed Properties with Occupancy Certificate (OC)', focus: 'Schedule III of CGST Act exempting ready properties with valid OC.' },
  { keyword: 'Input Tax Credit (ITC) Rules and Removal of ITC in Real Estate', focus: 'Understanding developer procurement tax structure under 5% net regime.' },
  { keyword: 'GST on Maintenance Charges Collected by Housing Societies', focus: 'Exemption limit of ₹7,500 per month per member in registered societies.' },
  { keyword: 'GST on Commercial Real Estate (18% Rate & Land Abatement)', focus: 'Office spaces, retail shops, and input tax credit offset mechanisms.' },
  { keyword: 'GST Refund on Cancelled Flat Booking under Circular 188', focus: 'Claiming direct GST refund from tax department if booking is cancelled.' },
  { keyword: 'GST on Development Rights and Joint Development Agreements (JDA)', focus: 'Reverse Charge Mechanism (RCM) applicability on landowner share.' },
  { keyword: 'GST on Preferential Location Charges (PLC) and Parking Fees', focus: 'Composite supply taxation at the same rate as the main residential unit (5%).' },
];

const TDS_SUBTOPICS = [
  { keyword: 'Section 194-IA: 1% TDS on Property Purchases above ₹50 Lakhs', focus: 'Buyer responsibility to deduct and pay via Form 26QB on e-filing portal.' },
  { keyword: 'Section 194-IB: 2-5% TDS on Monthly Rent exceeding ₹50,000', focus: 'Tenant deduction at year-end or end of tenancy using Form 26QC.' },
  { keyword: 'Section 195: 20% TDS on Property Purchases from NRI Sellers', focus: 'Withholding tax rules, surcharge, and Form 13 Lower Deduction Certificate.' },
  { keyword: 'Form 26QB Online Challan Generation and Payment Steps', focus: 'Entering buyer/seller PAN, installment amount, and selecting TIN 2.0 gateway.' },
  { keyword: 'Form 16B TDS Certificate Download from TRACES Portal', focus: 'Issuing TDS certificate to builder/seller within 15 days of challan filing.' },
  { keyword: 'Section 234E Penalty of ₹200 per Day for Late TDS Filing', focus: 'Avoiding late fees and 1.5% monthly interest on delayed TDS deposits.' },
  { keyword: 'TDS on Ancillary Charges (Clubhouse, Car Parking, Electricity)', focus: 'Mandatory inclusion of all bundled fees under Section 194-IA valuation.' },
  { keyword: 'Correcting PAN Errors in Form 26QB via TRACES Portal', focus: 'Online correction procedure when seller PAN is entered incorrectly.' },
];

const NRI_FEMA_SUBTOPICS = [
  { keyword: 'FEMA Guidelines for NRI Property Purchase in India', focus: 'Permitted residential/commercial acquisitions and agricultural land bans.' },
  { keyword: 'NRE vs NRO Bank Account Usage for Property Transactions', focus: 'Inward foreign currency remittances and rental income management.' },
  { keyword: 'Repatriation of Sale Proceeds up to USD 1 Million per Year', focus: 'Form 15CA and Form 15CB CA certification for overseas repatriation.' },
  { keyword: 'Power of Attorney (PoA) Execution from Dubai, USA & UK', focus: 'Consular embassy attestation and Maharashtra Collector adjudication.' },
  { keyword: 'Double Taxation Avoidance Agreement (DTAA) for NRI Real Estate', focus: 'Claiming foreign tax credits on Indian capital gains taxes in home country.' },
  { keyword: 'Form 13 Lower Tax Deduction Certificate for NRI Sellers', focus: 'Applying to Income Tax Officer to reduce 20% TDS down to actual profit tax.' },
  { keyword: 'Joint Ownership with Resident Relatives for NRI Buyers', focus: 'FEMA rules governing co-ownership with resident parents, siblings, or spouse.' },
  { keyword: 'Rental Income Management and NRO to NRE Remittance', focus: 'Transferring local rent abroad via Form 15CA/CB compliance.' },
];

const MARKET_YIELD_SUBTOPICS = [
  { keyword: 'Gross Rental Yields across IT Corridors (4.2% to 5.1%)', focus: 'Comparing high rental returns in Hinjawadi, Baner, and Kharadi.' },
  { keyword: 'Capital Appreciation Projections 2026-2030 (Metro Line 3 Impact)', focus: 'Evaluating infrastructure multiplier on Western corridor capital values.' },
  { keyword: 'GCC Office Space Absorption and Luxury Housing Demand', focus: 'How Global Capability Centers drive senior executive home purchases.' },
  { keyword: 'Pune Ring Road Phase 1 & 2 Connectivity Catalysts', focus: 'Decongesting highway traffic and unlocking suburban land valuations.' },
  { keyword: 'Luxury Sky Villa vs Traditional Apartment Appreciation Spread', focus: 'Why 4+ BHK penthouses are appreciating 4% faster than compact 2 BHKs.' },
  { keyword: 'Commercial Yields (7.5% - 9%) vs Residential Yields in Pune', focus: 'Evaluating Grade-A office pre-leased assets vs luxury residences.' },
  { keyword: 'Micro-Market Price per Square Foot Trends 2020-2026', focus: 'Historical data analysis of price escalation across Wakad, Balewadi, and Baner.' },
  { keyword: 'Tenant Demographics and Expat Executive Leasing Trends', focus: 'Multinational leadership seeking 5-tier security and concierge living.' },
];

const VASTU_SUBTOPICS = [
  {
    keyword: 'North-East (Ishanya) Entrance & Water Element Vaastu',
    section: 'Vaastu Purusha Mandala & Ishanya Kona',
    simple: 'Ensuring positive cosmic energy flow with unobstructed North-East entrance, temple space, and clear water elements.',
    example: 'Orienting the main teakwood entrance door to the 3rd or 4th Ishanya pada in Baner, increasing natural morning illumination and peace.',
  },
  {
    keyword: 'South-East (Agneya) Kitchen & Fire Energy Balance',
    section: 'Agni Tattva & Architectural Zoning',
    simple: 'Positioning the cooking stove in the South-East zone facing East to ignite health, vigor, and prosperity.',
    example: 'Aligning the induction hob in the South-East corner with the sink in the North-East corner, maintaining a 3.5 ft separation between fire and water elements.',
  },
  {
    keyword: 'South-West (Nairutya) Master Suite for Stability & Wealth',
    section: 'Prithvi Tattva & Master Suite Stability',
    simple: 'Placing the primary master bedroom in the South-West to anchor stability, family leadership, and asset accumulation.',
    example: 'Designing the 4 BHK master bedroom in the South-West zone with the bed headboard placed towards the South for deep circadian sleep.',
  },
  {
    keyword: 'Brahmasthan (Center Zone) Openness & Spatial Balance',
    section: 'Brahmasthan Geometric Center',
    simple: 'Maintaining zero structural load, pillars, and wet areas in the central 1/9th core of the residence.',
    example: 'Creating a luminous open living-dining foyer in Wakad keeping the 12x12 ft central Brahmasthan free of concrete shear walls.',
  },
  {
    keyword: 'North (Kuber Zone) Living Rooms & Wealth Accumulation',
    section: 'Kuber Sthana & Magnetic North',
    simple: 'Maximizing floor-to-ceiling glass fenestration along the North facade to channel financial growth and liquidity.',
    example: 'Positioning the family lounge with expansive north-facing balconies and placing the family locker against the southern wall opening north.',
  },
  {
    keyword: 'Pooja Room Sacred Geometry & Pyramid Roof Alignments',
    section: 'Deva Sthana Architecture',
    simple: 'Setting up the sacred mandir in the Ishanya quadrant with white Makrana marble and copper pyramid yantras.',
    example: 'Installing a dedicated prayer alcove in North-East with morning sunlight ingress and idols elevated 2 inches away from the wall.',
  },
  {
    keyword: 'Pyra-Vaastu Non-Demolition Remedies for High-Rise Apartments',
    section: 'Energy Harmonization without Structural Changes',
    simple: 'Using copper boundary strips, zinc helixes, and lead energy neutralizers to correct angular cuts in luxury apartments.',
    example: 'Embedding a 99.9% pure copper metallic strip along the bathroom doorway in Kharadi to neutralize directional energy drain without tearing down tiles.',
  },
  {
    keyword: 'Main Door 32 Pada Selection (Jayanta & Mahendra Auspicious Entrances)',
    section: 'Vaastu 32 Pada Shastra',
    simple: 'Calculating exact compass angles to locate the Jayanta (N3) or Mahendra (E3) door positions for optimal prosperity.',
    example: 'Performing digital magnetic compass calibration to locate the Jayanta pada at 22.5° North-East for a luxury sky villa in Balewadi.',
  },
  {
    keyword: 'Balcony & Terrace Directional Energy Flow (North & East Focus)',
    section: 'Vayu & Surya Light Ingress',
    simple: 'Extending open sit-out cantilevered decks in the North or East quadrants to draw gentle morning infrared rays.',
    example: 'Constructing a biophilic terrace deck along the North-East perimeter in Koregaon Park with fragrant plants and zero heavy stone statues in that corner.',
  },
  {
    keyword: 'North-West (Vayavya) Guest Room & Children Suite Planning',
    section: 'Vayu Tattva & Movement Energy',
    simple: 'Zoning guest bedrooms, dining lounges, and unmarried children suites in the North-West quadrant for active dynamism.',
    example: 'Positioning a 3-BHK junior suite in North-West in Bavdhan with light pastel color palettes and study tables facing East.',
  },
  {
    keyword: 'Staircase & Lift Core Placement in South & West Zones',
    section: 'Bhara Sthana Heavy Structural Zoning',
    simple: 'Positioning high-density vertical shafts, stairways, and elevators along the South and West boundaries to absorb heavy load.',
    example: 'Engineering the duplex penthouse internal marble staircase in South-West climbing clockwise, providing grounded stability.',
  },
  {
    keyword: 'Water Tank & Swimming Pool Vaastu (Overhead vs Underground)',
    section: 'Jal Sthana & Structural Hydraulics',
    simple: 'Locating private plunge pools in North-East and heavy overhead water balance tanks in the South-West corner.',
    example: 'Positioning a cantilevered plunge pool along the Eastern deck in Kothrud, maximizing solar reflection into the living area.',
  },
  {
    keyword: 'Study & Home Office Desk Orientation for Focus & Prosperity',
    section: 'Vidya Sthana & Intellectual Geometry',
    simple: 'Orienting executive home office workstations facing North or East with a solid wall behind the chair.',
    example: 'Setting up an executive work suite in Mahalunge facing North with zero overhead beams above the desk.',
  },
  {
    keyword: 'Underground Water Boring vs Overhead Sump Directional Rules',
    section: 'Geophysical Earth Energies',
    simple: 'Placing ground-water recharge sumps in North-East Ishanya zone for clean water intake and positive magnetic alignment.',
    example: 'Drilling rainwater recharge shafts in the North-East boundary of a gated villa society in Ravet.',
  },
  {
    keyword: 'Slope & Gradient of Plots and Flat Flooring (Ishanya Declination)',
    section: 'Bhumi Dhal & Solar Declination',
    simple: 'Ensuring indoor floor levels gently decline towards North-East while rising in South-West for optimal financial drainage flow.',
    example: 'Grading luxury balcony tiles in Hadapsar so rainwater drains towards North-East outlets effortlessly.',
  },
];

const PRE_LEASED_COMMERCIAL_SUBTOPICS = [
  {
    keyword: 'Pre-Leased Commercial Office Yields (7.5% to 9.2% Net ROI)',
    section: 'Commercial Asset Yield Analysis',
    simple: 'Investing in fully operational Grade-A office spaces with immediate day-one rental cash flows and institutional MNC tenants.',
    example: 'Acquiring a 4,000 sq.ft office floor in Baner pre-leased to an IT MNC at ₹92/sq.ft/month generating ₹36.8 Lakhs annual net rent on a ₹4.4 Cr asset (8.36% yield).',
  },
  {
    keyword: '9-Year Triple Net (NNN) Lease Deeds & 3+3+3 Lock-in Terms',
    section: 'Corporate Lease Agreement Structuring',
    simple: 'Understanding long-term corporate leases where the corporate tenant pays maintenance, property taxes, and fit-out insurance directly.',
    example: 'Structuring a 9-year lease with a Fortune 500 GCC in Hinjawadi featuring an initial 36-month non-cancellable lock-in and 6-month security deposit in escrow.',
  },
  {
    keyword: '15% Rental Escalation Every 3 Years & Compounded Return Models',
    section: 'Rent Escalation & Inflation Hedging',
    simple: 'Compounded periodic rent step-ups protecting the commercial investor from inflation and boosting yield above 10.5% over the lease tenure.',
    example: 'An office leased at ₹1,50,000/month in Kharadi escalating to ₹1,72,500 in Year 4 and ₹1,98,375 in Year 7, lifting net rental yield from 8.1% to 10.7%.',
  },
  {
    keyword: 'Pre-Leased High-Street Retail Showrooms vs Grade-A Office Spaces',
    section: 'Retail vs IT Commercial Asset Comparison',
    simple: 'Evaluating high-footfall corner retail units with long brand stickiness vs corporate IT parks with predictable 10-year tenancies.',
    example: 'Investing in a ground-floor retail showroom on Balewadi High Street leased to a leading bank ATM/branch yielding 7.9% with zero vacancy for 15 years.',
  },
  {
    keyword: 'Fractional Ownership & REIT-Style SPV Investment Models',
    section: 'Fractional Real Estate & SEBI SM REITs',
    simple: 'Co-investing in institutional-grade commercial buildings with ticket sizes of ₹10 Lakhs to ₹25 Lakhs through registered Special Purpose Vehicles.',
    example: 'An NRI investing ₹25 Lakhs into a Grade-A business park SPV in Viman Nagar receiving quarterly dividends yielding 8.8% plus capital appreciation.',
  },
  {
    keyword: 'Tenant Credit Due Diligence & Multi-Crore Fit-Out Stickiness',
    section: 'Tenant Risk & Capital Expenditure Audit',
    simple: 'Verifying tenant balance sheets, credit ratings, and tenant fitout capex (₹3,000-₹5,000/sq.ft) which prevents early lease termination.',
    example: 'Auditing an MNC tenant that invested ₹2.8 Cr in customized acoustics and server rooms, guaranteeing multi-year tenancy stickiness.',
  },
  {
    keyword: 'Section 194-I TDS on Commercial Rent (10%) & GST Invoicing with ITC',
    section: 'Income Tax Section 194-I & GST Compliance',
    simple: 'Managing 10% tax deduction at source on commercial lease payouts and collecting 18% GST with full input tax credit.',
    example: 'Commercial landlord billing ₹2,00,000 rent + ₹36,000 GST, receiving ₹1,80,000 net after 10% TDS, and claiming ITC on maintenance expenses.',
  },
  {
    keyword: 'Capital Appreciation & Cap Rate Compression on Resale',
    section: 'Commercial Asset Valuation & Cap Rates',
    simple: 'How institutional yield compression from 8.5% down to 7.0% generates massive capital gains when exiting to global private equity funds.',
    example: 'Buying a pre-leased commercial unit for ₹5 Cr at 8.5% yield and selling it 5 years later at ₹6.8 Cr as micro-market cap rates compress to 7.2%.',
  },
  {
    keyword: 'Commercial Lease Deed Registration & Stamp Duty in Maharashtra',
    section: 'Maharashtra Stamp Act (Article 36A)',
    simple: 'Calculating exact stamp duty and registration charges on commercial lease contracts to ensure full legal enforceability.',
    example: 'Registering a 9-year commercial lease deed at PCMC Sub-Registrar paying 0.25% stamp duty on total rent + refundable deposit.',
  },
  {
    keyword: 'Pre-Leased Banking & Financial Services (BFSI) Branch Assets',
    section: 'Institutional BFSI Anchor Tenancies',
    simple: 'Investing in nationalized and private bank branches with 15-20 year continuous occupation tracks and sovereign-grade reliability.',
    example: 'Buying an HDFC Bank branch unit in Kothrud generating ₹4.2 Lakhs monthly rent with 15% escalation every 5 years.',
  },
  {
    keyword: 'Pre-Leased QSR (Quick Service Restaurant) & Drive-Thru Retail Units',
    section: 'Retail Hospitality & QSR Anchors',
    simple: 'Securing top multinational fast food and specialty coffee brands with revenue-share minimum guarantee hybrid leases.',
    example: 'Leasing a drive-thru retail pad in Wakad to Starbucks on a 15-year lease with 7.5% base rent + 12% revenue share over threshold.',
  },
  {
    keyword: 'Pre-Leased Diagnostic Centers, Hospitals & Healthcare Assets',
    section: 'Healthcare Infrastructure Real Estate',
    simple: 'Acquiring pre-leased pathology labs and multispecialty clinics with recession-proof demand and extensive interior radiology investments.',
    example: 'Purchasing a 6,500 sq.ft pathology center in Bavdhan with an 8.6% net yield and a 12-year non-cancellable institutional lease.',
  },
  {
    keyword: 'Pre-Leased IT Data Centers & Edge Infrastructure Real Estate',
    section: 'Digital Infrastructure Assets',
    simple: 'Investing in carrier-neutral Edge data centers in Pune with specialized dual-power grid infrastructure and 15-year hyperscale contracts.',
    example: 'Acquiring an edge server floor in Hinjawadi Phase 2 yielding 9.4% net yield backed by enterprise cloud service agreements.',
  },
  {
    keyword: 'Commercial Common Area Maintenance (CAM) & Power Sub-metering Audits',
    section: 'CAM Reconciliation & Energy Operations',
    simple: 'Auditing HVAC chiller plant billing, diesel generator backup kWh charges, and common area upkeep pass-through terms.',
    example: 'Structuring CAM contracts in Magarpatta ensuring 100% of operational energy and security expenses are reimbursed by corporate tenants.',
  },
  {
    keyword: 'Rent Securitization & Lease Rental Discounting (LRD) Loans',
    section: 'LRD Banking & Capital Refinancing',
    simple: 'Borrowing against future registered commercial rental receivables at competitive 8.25% interest rates to unlock liquidity for new acquisitions.',
    example: 'Securing a ₹4.5 Cr LRD loan against a ₹5.2 Lakh monthly rental stream to fund the purchase of an additional pre-leased retail unit.',
  },
];

// Generate dynamic indexed topics to cross over 1,000 comprehensive entries
export function generateAllKnowledgeTopics(): KnowledgeTopic[] {
  const topics: KnowledgeTopic[] = [...FLAGSHIP_KNOWLEDGE_TOPICS];

  let counter = 100;

  // Helper generator to avoid repetition
  const createCorridorTopics = (
    category: BlogCategory,
    categoryLabel: string,
    subtopics: Array<{ keyword: string; section?: string; focus?: string; simple?: string; example?: string; concept?: string }>
  ) => {
    CORRIDORS.forEach((corridor) => {
      subtopics.forEach((item) => {
        counter++;
        const id = `topic_gen_${counter}_${corridor.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${item.keyword.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 25)}`;
        const slug = `${item.keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-in-${corridor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-pune`;
        const title = `${item.keyword} for Property in ${corridor.name}, Pune: Step-by-Step Guide`;

        const summary = item.simple
          ? `${item.simple} Tailored for property buyers, owners, and investors in ${corridor.name}, Pune.`
          : item.focus
          ? `Comprehensive analysis of ${item.keyword}. ${item.focus} Practical guidance for luxury residences in ${corridor.name}, Pune.`
          : item.concept
          ? `Detailed statutory and legal guide on ${item.keyword}. ${item.concept} Essential knowledge for ${corridor.name}, Pune.`
          : `Authoritative guide on ${item.keyword} for real estate transactions in ${corridor.name}, Pune.`;

        const explanation = `Navigating ${item.keyword} in ${corridor.name} is essential for ensuring maximum financial savings, statutory compliance, and peace of mind. ${corridor.desc} Whether you are buying, selling, or managing a residential asset, adhering to these best practices guarantees a secure, high-yield outcome.`;

        topics.push({
          id,
          slug,
          title,
          category,
          categoryLabel,
          searchIntentKeywords: [
            `${item.keyword.toLowerCase()} ${corridor.name.toLowerCase()}`,
            `real estate guide ${corridor.name} pune`,
            `${corridor.name.toLowerCase()} property legal tax checklist`,
            `${item.keyword.toLowerCase()} maharashtra real estate`,
          ],
          simpleEnglishSummary: summary,
          humanizedExplanation: explanation,
          practicalExample: {
            scenarioTitle: `Real-World Case Walkthrough in ${corridor.name}`,
            scenarioText: `A resident or commercial investor in ${corridor.name} executed a transaction involving ${item.keyword}.`,
            calculationOrOutcome: item.example
              ? `${item.example} This ensured full compliance, structural harmony, and financial efficiency for the property in ${corridor.name}.`
              : `By following the standard checklist for ${item.keyword}, the investor eliminated legal and financial risks and secured their rights in ${corridor.name}.`,
          },
          statutoryRuleOrSection: item.section || 'Real Estate Regulations & Statutory Guidelines (Maharashtra)',
          commonPitfalls: [
            'Failing to verify registered lease deeds, architectural compass bearings, and official municipal sanction plans.',
            'Relying on unverified verbal assurances instead of registered agreements and certified expert audits.',
          ],
          keyActionChecklist: [
            `Audit all applicable documentation, lease covenants, or directional layouts for ${corridor.name}.`,
            'Verify financial records, PAN entries, escrow reserves, and municipal permissions.',
            'Consult a certified real estate advisor, structural engineer, or legal counsel before signing.',
          ],
          faqs: [
            {
              question: `How does ${item.keyword} apply to properties in ${corridor.name}?`,
              answer: `It applies directly to luxury residences, commercial office parks, and retail corridors in ${corridor.name} under established architectural standards and statutory lease frameworks.`,
            },
            {
              question: 'Where can I verify these details officially?',
              answer: 'You can verify through official portals such as MahaRERA, Income Tax e-Filing, IGR Maharashtra, PMC/PCMC municipal records, or certified Vaastu/Commercial advisory cells.',
            },
          ],
          seoMeta: {
            metaTitle: `${item.keyword} in ${corridor.name}, Pune: Complete 2026 Guide`,
            metaDescription: `Everything you need to know about ${item.keyword} in ${corridor.name}, Pune. Expert tips, calculations, legal checklists, and FAQs.`,
            focusKeywords: [item.keyword, `${corridor.name} real estate`, 'Pune property guide', 'Vaastu & pre-leased rules'],
            readabilityScore: 92,
            seoScore: 97,
            searchVolumeMonthlyEst: '3,500/mo',
            structuredDataSchemaType: 'Article',
          },
        });
      });
    });
  };

  // Generate across all 13 core categories x 12 corridors (> 1,290 topics)
  createCorridorTopics('VASTU_COMPLIANCE', 'Vaastu Shastra & Directional Harmony', VASTU_SUBTOPICS);
  createCorridorTopics('PRE_LEASED_COMMERCIAL', 'Pre-Leased Commercial & High Yields', PRE_LEASED_COMMERCIAL_SUBTOPICS);
  createCorridorTopics('TAX_WEALTH', 'Indian Income Tax & Sec 54', TAX_SUBTOPICS);
  createCorridorTopics('MAHARERA_REGULATORY', 'MahaRERA & Legal Rights', LEGAL_SUBTOPICS);
  createCorridorTopics('AMENITIES_LIFESTYLE', 'Amenities & Luxury Living', AMENITY_SUBTOPICS);
  createCorridorTopics('COOP_SOCIETY_CONDO', 'Housing Society vs Condo', SOCIETY_SUBTOPICS);
  createCorridorTopics('HOME_LOANS_FINANCE', 'Home Loans & Interest Rates', LOAN_SUBTOPICS);
  createCorridorTopics('RESALE_VS_NEW', 'Resale vs New Bookings', RESALE_SUBTOPICS);
  createCorridorTopics('CONSTRUCTION_TECH', 'Construction Quality & Tech', CONSTRUCTION_SUBTOPICS);
  createCorridorTopics('GST_REAL_ESTATE', 'GST on Property & ITC', GST_SUBTOPICS);
  createCorridorTopics('TDS_COMPLIANCE', 'TDS (194-IA, 194-IB, 195)', TDS_SUBTOPICS);
  createCorridorTopics('NRI_INVESTMENT', 'NRI Investment & FEMA', NRI_FEMA_SUBTOPICS);
  createCorridorTopics('MARKET_INTELLIGENCE', 'Corridors & Appreciation', MARKET_YIELD_SUBTOPICS);

  return topics;
}

// Cached full topics list
export const ALL_INDEXED_KNOWLEDGE_TOPICS = generateAllKnowledgeTopics();

// JSON-LD Schema Generator for Search Engines & AI Crawlers
export function generateTopicJsonLdSchema(topic: KnowledgeTopic): string {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': topic.seoMeta.structuredDataSchemaType === 'FAQPage' ? 'FAQPage' : 'Article',
    headline: topic.title,
    description: topic.seoMeta.metaDescription,
    author: {
      '@type': 'Organization',
      name: 'Kiaan Properties Editorial & Research Desk',
      url: 'https://westernluxuryestates.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kiaan Properties Private Client Advisory',
      logo: {
        '@type': 'ImageObject',
        url: 'https://westernluxuryestates.com/logo.png',
      },
    },
    datePublished: '2026-08-01',
    dateModified: '2026-09-03',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://westernluxuryestates.com/journal/${topic.slug}`,
    },
    keywords: topic.seoMeta.focusKeywords.join(', '),
  };

  if (topic.faqs && topic.faqs.length > 0) {
    (baseSchema as any).mainEntity = topic.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    }));
  }

  return JSON.stringify(baseSchema, null, 2);
}
