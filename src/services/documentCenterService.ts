/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DocumentCategory, DocumentItem, DocumentAiExplainerState } from '../types';

export const MANDATORY_AI_DOCUMENT_DISCLAIMER =
  'Kiaan AI is an intelligent explanatory layer designed to summarize and highlight statutory terms for convenience. It is NOT a substitute for formal legal, financial, or real estate advisory. All agreements are governed strictly by the executed physical/digital contract and statutory MahaRERA directives.';

export const SAMPLE_PROJECT_DOCUMENTS: DocumentItem[] = [
  // 1. BROCHURE
  {
    id: 'doc_brochure_ov',
    projectId: 'proj_one_vertica_wakad',
    projectName: 'Kiaan One Vertica',
    category: 'BROCHURE',
    title: 'Architectural Monograph & Master Brochure',
    fileName: 'Kiaan_One_Vertica_Master_Brochure_2026.pdf',
    fileSizeBytes: 24500000, // 24.5 MB
    fileFormat: 'PDF',
    isCustomerSpecific: false,
    issuanceDate: '2026-06-01',
    issuingAuthorityOrEntity: 'Kiaan Luxury Developments Brand Studio',
    verificationBadge: 'OFFICIAL_BUILDER_RELEASE',
    summary: 'Comprehensive 48-page architectural monograph covering tower elevation, double-glazed facade engineering, sky-pool specifications, biophilic materials, and unit floorplates.',
    downloadUrl: '#download-brochure',
    sampleClauses: [
      {
        clauseTitle: 'Facade & Acoustical Specifications',
        text: 'All external glazing shall utilize Saint-Gobain Planitherm 28mm double-glazed argon-filled acoustic units providing 42dB noise attenuation.',
        plainEnglishMeaning: 'Whisper-quiet interiors with high thermal insulation against highway or urban noise.',
      },
    ],
  },

  // 2. PRICE SHEET
  {
    id: 'doc_price_sheet_ov',
    projectId: 'proj_one_vertica_wakad',
    projectName: 'Kiaan One Vertica',
    category: 'PRICE_SHEET',
    title: 'Statutory Cost Sheet & Breakdown Matrix (Tower A & B)',
    fileName: 'Kiaan_OV_Detailed_Cost_Breakdown_Q3_2026.pdf',
    fileSizeBytes: 3200000,
    fileFormat: 'PDF',
    isCustomerSpecific: false,
    issuanceDate: '2026-08-01',
    validUntil: '2026-09-30',
    issuingAuthorityOrEntity: 'Kiaan Corporate Finance & Escrow Cell',
    verificationBadge: 'TRANSPARENT_COST_COMPLIANT',
    summary: 'Itemized price sheet detailing Base Agreement Value, Floor Rise Slab (₹25k/floor), Covered Parking Allocation, 5% GST, 6% Maharashtra Stamp Duty, and ₹30k Registration.',
    downloadUrl: '#download-pricesheet',
    sampleClauses: [
      {
        clauseTitle: 'No Hidden Surcharges Guarantee',
        text: 'Agreement value includes basic infrastructure, piped gas connection, DG back-up energization, and water connection charges without supplementary developer levies.',
        plainEnglishMeaning: 'You will not be surprised by undisclosed ancillary fees at possession.',
      },
    ],
  },

  // 3. PAYMENT PLAN
  {
    id: 'doc_payment_plan_ov',
    projectId: 'proj_one_vertica_wakad',
    projectName: 'Kiaan One Vertica',
    category: 'PAYMENT_PLAN',
    title: 'MahaRERA Statutory Milestone-Linked Payment Schedule',
    fileName: 'Kiaan_OV_MahaRERA_Payment_Milestone_Schedule.pdf',
    fileSizeBytes: 1800000,
    fileFormat: 'PDF',
    isCustomerSpecific: false,
    issuanceDate: '2026-07-15',
    issuingAuthorityOrEntity: 'MahaRERA Approved Model Schedule',
    verificationBadge: 'MAHARERA_ALIGNED',
    summary: 'Standard 8-milestone construction linked payment plan certified by structural architect Form 4 triggers. 70% of every payment is directly credited to the statutory Escrow Account.',
    downloadUrl: '#download-paymentplan',
    sampleClauses: [
      {
        clauseTitle: 'Payment Milestones (Section 13 Compliance)',
        text: '10% on Booking • 20% on Execution of Agreement • 15% on Completion of Plinth • 25% across Slabs proportionally • 10% on External Facade • 10% on MEP & Elevators • 5% on Possession.',
        plainEnglishMeaning: 'You only pay for construction stages that are physically completed and certified by registered engineers and architects.',
      },
    ],
  },

  // 4. FLOOR PLANS
  {
    id: 'doc_floorplans_ov',
    projectId: 'proj_one_vertica_wakad',
    projectName: 'Kiaan One Vertica',
    category: 'FLOOR_PLANS',
    title: 'Architectural Blueprints & Carpet Area Certifications',
    fileName: 'Kiaan_OV_Sanctioned_Floor_Layouts_All_Floors.pdf',
    fileSizeBytes: 18500000,
    fileFormat: 'PDF',
    isCustomerSpecific: false,
    issuanceDate: '2026-05-10',
    issuingAuthorityOrEntity: 'Pimpri-Chinchwad Municipal Corporation (PCMC)',
    verificationBadge: 'SANCTIONED_BY_PCMC',
    summary: 'High-resolution architectural CAD and PDF layouts showing room dimensions, structural shear walls, shaft locations, deck projections, and net usable MahaRERA carpet areas.',
    downloadUrl: '#download-floorplans',
  },

  // 5. PROJECT DOCUMENTS
  {
    id: 'doc_sanction_ov',
    projectId: 'proj_one_vertica_wakad',
    projectName: 'Kiaan One Vertica',
    category: 'PROJECT_DOCUMENTS',
    title: 'PCMC Building Commencement Certificate & Clear Title Search',
    fileName: 'Kiaan_OV_Commencement_Cert_And_Title_Report.pdf',
    fileSizeBytes: 9400000,
    fileFormat: 'PDF',
    isCustomerSpecific: false,
    issuanceDate: '2026-03-20',
    issuingAuthorityOrEntity: 'Advocate R. S. Kulkarni & Associates (Solicitors)',
    verificationBadge: '30_YR_CLEAR_TITLE',
    summary: 'Legal title search report confirming 30-year unencumbered freehold land ownership, PCMC full commencement approval, Fire Dept NOC, and Environmental Clearance.',
    downloadUrl: '#download-sanctions',
  },

  // 6. RERA INFORMATION
  {
    id: 'doc_rera_cert_ov',
    projectId: 'proj_one_vertica_wakad',
    projectName: 'Kiaan One Vertica',
    category: 'RERA_INFORMATION',
    title: 'Official MahaRERA Registration Certificate & Quarterly Progress Report (Q2 2026)',
    fileName: 'MahaRERA_Certificate_P52100028492.pdf',
    fileSizeBytes: 4200000,
    fileFormat: 'PDF',
    isCustomerSpecific: false,
    issuanceDate: '2026-06-15',
    validUntil: '2027-12-31',
    issuingAuthorityOrEntity: 'Maharashtra Real Estate Regulatory Authority',
    verificationBadge: 'MAHARERA_VERIFIED',
    summary: 'Official registration certificate for project P52100028492 with approved completion deadline December 2027, Form 1, Form 2, and Form 3 escrow declarations.',
    downloadUrl: '#download-rera-cert',
    sampleClauses: [
      {
        clauseTitle: 'Statutory Possession Date',
        text: 'Project registration P52100028492 stipulates final occupancy handover date on or before 31st December 2027 with statutory 6-month cure window.',
        plainEnglishMeaning: 'The builder is legally bound under MahaRERA to complete the project and hand over keys by December 2027.',
      },
    ],
  },

  // 7. BOOKING DOCUMENTS (SECURE - CUSTOMER SPECIFIC)
  {
    id: 'doc_booking_sample_ov',
    projectId: 'proj_one_vertica_wakad',
    projectName: 'Kiaan One Vertica',
    category: 'BOOKING_DOCUMENTS',
    title: 'Model Agreement for Sale & Allotment Letter (Draft / Executed)',
    fileName: 'Kiaan_OV_Model_Agreement_For_Sale_Executed.pdf',
    fileSizeBytes: 5800000,
    fileFormat: 'PDF',
    isCustomerSpecific: true, // Requires Auth / VIP session
    issuanceDate: '2026-08-20',
    issuingAuthorityOrEntity: 'Kiaan Luxury Developments Legal Registry',
    verificationBadge: 'STAMPED_LEGAL_AGREEMENT',
    summary: 'MahaRERA standard Model Agreement for Sale format including Section 14(3) 5-year structural defect liability, interest for delay clauses, and allocated unit parking slot schedule.',
    downloadUrl: '#download-agreement',
    sampleClauses: [
      {
        clauseTitle: '5-Year Structural Defect Warranty (Section 14(3))',
        text: 'The Promoter shall rectify without charge any structural defect or quality workmanship defect brought to notice by the Allottee within 5 years from date of possession, within 30 days.',
        plainEnglishMeaning: 'If any structural cracks or water leakages occur within 5 years of possession, the builder must fix them free of cost within 30 days.',
      },
      {
        clauseTitle: 'Equal Interest for Delay (MahaRERA Rule 18)',
        text: 'In the event of default in payment or handover, the defaulting party shall pay statutory interest equal to SBI Highest Marginal Cost of Lending Rate (MCLR) + 2%.',
        plainEnglishMeaning: 'Both builder and buyer are treated equally: if builder delays possession, they pay you interest; if you delay payment, you pay interest at the same rate.',
      },
    ],
  },

  // 8. RECEIPTS (SECURE - CUSTOMER SPECIFIC)
  {
    id: 'doc_receipt_token_ov',
    projectId: 'proj_one_vertica_wakad',
    projectName: 'Kiaan One Vertica',
    category: 'RECEIPTS',
    title: 'Statutory Token Deposit & Escrow Credit E-Receipt',
    fileName: 'Kiaan_OV_Token_Deposit_Receipt_ESCR_8921.pdf',
    fileSizeBytes: 850000,
    fileFormat: 'PDF',
    isCustomerSpecific: true, // Requires Auth / VIP session
    issuanceDate: '2026-08-22',
    issuingAuthorityOrEntity: 'HDFC Escrow Banking Desk (A/c No: ****9812)',
    verificationBadge: 'ESCROW_BANK_STAMPED',
    summary: 'Official digitally signed GST tax receipt acknowledging ₹5,00,000 token booking reservation amount credited to MahaRERA Escrow Account with transaction UTR hash.',
    downloadUrl: '#download-receipt',
  },
];

/**
 * AI Document Explainer Engine
 * Pre-analyzed answers for top questions and dynamic parsing for custom queries.
 */
export function explainDocumentQuery(
  document: DocumentItem,
  query: string
): {
  answer: string;
  keyClausesExtracted: string[];
  disclaimer: string;
} {
  const q = query.toLowerCase();

  let answer = '';
  let keyClauses: string[] = [];

  if (q.includes('explain') || q.includes('simply') || q.includes('summary') || q.includes('what is this')) {
    answer = `**Document Overview: ${document.title}**\n\nThis is an official **${document.category.replace('_', ' ')}** issued by **${document.issuingAuthorityOrEntity}** on ${document.issuanceDate}.\n\n- **Core Purpose**: ${document.summary}\n- **Verification Status**: ${document.verificationBadge || 'Officially Verified'}\n- **Access Level**: ${document.isCustomerSpecific ? 'Secure Authenticated Document (Customer/Allottee Specific)' : 'Public Transparency Repository'}`;
    keyClauses = [
      `File Size: ${(document.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB (${document.fileFormat})`,
      `Issuing Authority: ${document.issuingAuthorityOrEntity}`,
      `Authenticity: MahaRERA / Legal Registry Stamped`,
    ];
  } else if (q.includes('payment') || q.includes('schedule') || q.includes('installment') || q.includes('milestone')) {
    answer = `**Payment Schedule Analysis:**\n\nUnder this document, payments follow the statutory **MahaRERA 8-Stage Milestone Schedule**:\n\n1. **10%** at initial booking & reservation\n2. **20%** upon formal execution of the Agreement for Sale\n3. **15%** upon structural foundation & plinth completion (Architect Form 4 certified)\n4. **25%** distributed evenly across podium and floor slab castings\n5. **10%** upon external facade, glazing, and brickwork\n6. **10%** on MEP installations, elevators, and water pumps\n7. **10%** at final handover of keys with Occupancy Certificate (OC)\n\n*Statutory Protection*: 70% of every remittance is legally locked in the project's HDFC Escrow account and cannot be diverted.`;
    keyClauses = [
      'Strictly construction-milestone linked (No advance demand without Form 4 certificate)',
      '70% Escrow ring-fenced under MahaRERA Section 4(2)(l)(D)',
    ];
  } else if (q.includes('possession') || q.includes('date') || q.includes('handover') || q.includes('delivery')) {
    const possDate = document.validUntil || 'December 2027';
    answer = `**Possession Date & Timeline Clause:**\n\n- **Target Possession Date**: **${possDate}**\n- **MahaRERA Registration Ref**: **P52100028492**\n- **Grace/Cure Period**: 6 months standard statutory allowance under force majeure\n\n**Buyer Protection**: Under MahaRERA Section 18, if the builder fails to deliver by ${possDate}, the buyer has the unilateral legal right to either claim a 100% full refund with SBI MCLR + 2% interest, OR remain in the project while receiving monthly delayed possession interest until keys are handed over.`;
    keyClauses = [
      `Statutory Possession: ${possDate}`,
      'MahaRERA Rule 18 delay interest compensation (SBI MCLR + 2%)',
    ];
  } else if (q.includes('defect') || q.includes('warranty') || q.includes('repair') || q.includes('leakage')) {
    answer = `**5-Year Defect Liability Warranty (Section 14(3)):**\n\nThe agreement incorporates mandatory MahaRERA Section 14(3) protections:\n\n- **Duration**: **5 full years** from the date of handover/possession\n- **Covers**: Structural flaws, water leakage, plaster fissures, plumbing failures, or subpar material workmanship\n- **Rectification Timeline**: The builder must inspect and remedy the defect within **30 days** at zero cost to the homeowner.`;
    keyClauses = [
      '5-Year zero-cost structural warranty',
      'Mandatory 30-day builder rectification clause',
    ];
  } else if (q.includes('cancellation') || q.includes('refund') || q.includes('default') || q.includes('penalty')) {
    answer = `**Cancellation & Default Terms:**\n\n- **Prior to Agreement Execution**: Token deposit refundable within 15 days subject to statutory administrative charges (not exceeding 1-2%).\n- **Post Agreement Execution**: Governed strictly by standard MahaRERA Model Agreement clause 7.\n- **Equality of Default**: Builder and buyer pay the identical interest rate for payment or possession delays.`;
    keyClauses = [
      'Standard MahaRERA cancellation & deduction caps',
      'No unilateral developer forfeiture penalties',
    ];
  } else {
    // Custom query fallback
    answer = `**Analysis for: "${query}"**\n\nBased on our scan of **${document.title}** (${document.category}):\n\n1. This document is authenticated and issued by **${document.issuingAuthorityOrEntity}**.\n2. The terms align with the statutory MahaRERA regulatory framework and Maharashtra ownership flats conventions.\n3. Pertinent terms in this category: ${document.summary}\n\n*Would you like me to highlight specific financial terms, possession dates, or legal warranties?*`;
    keyClauses = [
      `Category: ${document.category}`,
      `Verified Status: ${document.verificationBadge || 'Compliant'}`,
    ];
  }

  return {
    answer,
    keyClausesExtracted: keyClauses,
    disclaimer: MANDATORY_AI_DOCUMENT_DISCLAIMER,
  };
}
