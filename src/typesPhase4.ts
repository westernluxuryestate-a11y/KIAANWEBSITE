/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Unit, Project } from './types';

// ==========================================
// PHASE 04: CONTRACT LIFECYCLE & MILESTONES
// ==========================================

export interface ConstructionMilestone {
  id: string;
  stageNumber: number;
  stageName: string;
  statutoryPercentOfTotal: number; // e.g. 10% on Booking, 20% on Plinth, etc.
  description: string;
  architectForm4CertRequired: boolean;
  architectForm4Status: 'ISSUED_VERIFIED' | 'PENDING_INSPECTION' | 'NOT_DUE';
  completionDateEstimated: string;
  currentActualProgressPercent: number; // 0 to 100%
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  photos: string[];
}

export interface StatutoryAllotmentLetter {
  allotmentId: string;
  bookingReference: string;
  dateGenerated: string;
  buyerLegalName: string;
  buyerPanNumber: string;
  buyerAadhaarLast4: string;
  buyerAddress: string;
  developerLegalEntity: string;
  developerCin: string;
  developerReraRegNumber: string;
  projectName: string;
  buildingTower: string;
  unitNumber: string;
  floorNumber: number;
  carpetAreaSqMtr: number;
  carpetAreaSqFt: number;
  exclusiveBalconySqFt: number;
  allotmentConsiderationINR: number;
  tokenPaidINR: number;
  balancePayableOnAgreementINR: number;
  timestampEsignDeveloper?: string;
  timestampEsignBuyer?: string;
  isFullySigned: boolean;
}

export interface ModelAgreementForSale {
  agreementId: string;
  allotmentReference: string;
  jurisdiction: 'MAHARERA';
  statutoryAct: 'Real Estate (Regulation and Development) Act, 2016 (Section 13) & Maharashtra Real Estate Rules';
  clauses: {
    clauseNumber: string;
    heading: string;
    text: string;
    isStatutoryNonNegotiable: boolean;
  }[];
  statutory70PercentEscrowBank: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    mandateRule: 'MahaRERA Section 4(2)(l)(D) — 70% of all customer deposits locked strictly for land & construction costs';
  };
  carpetAreaCertification: {
    reraDefinition: 'Usable area enclosed within walls, excluding external walls, common service shafts, balconies, and open terrace.';
    carpetAreaSqFt: number;
    carpetAreaSqMtr: number;
  };
  possessionGracePeriodMonths: 6;
  defectLiabilityYears: 5; // Section 14(3) 5-year defect liability warranty
  executionDate: string;
  isExecuted: boolean;
}

export interface EscrowAuditTransaction {
  id: string;
  date: string;
  transactionType: 'CUSTOMER_DEPOSIT_RECEIPT' | 'CONTRACTOR_RUNNING_BILL_DISBURSEMENT' | 'ARCHITECT_CERT_WITHDRAWAL';
  amountINR: number;
  escrow70ComponentINR: number;
  operational30ComponentINR: number;
  architectForm4Ref: string;
  caForm3Ref: string;
  engineerForm2Ref: string;
  auditVerificationStatus: 'AUDITED_COMPLIANT' | 'FLAGGED';
}

export interface EscrowDisbursementOverview {
  projectId: string;
  projectName: string;
  escrowAccountDetails: {
    accountName: string;
    bankName: string;
    accountNo: string;
    ifsc: string;
  };
  totalCollectionsINR: number;
  totalEscrowRetainedINR: number; // 70%
  totalDisbursedToConstructionINR: number;
  currentEscrowBalanceINR: number;
  complianceRating: '100% AUDIT CLEAR';
  recentAuditTransactions: EscrowAuditTransaction[];
}

// Standard MahaRERA Schedule of Payments (Section 13 Model Agreement)
export const MAHARERA_STANDARD_PAYMENT_SCHEDULE: Omit<ConstructionMilestone, 'id' | 'currentActualProgressPercent' | 'status' | 'photos'>[] = [
  {
    stageNumber: 1,
    stageName: 'Token & Booking Application',
    statutoryPercentOfTotal: 10,
    description: 'Statutory maximum 10% booking consideration paid prior to registered Agreement for Sale execution.',
    architectForm4CertRequired: false,
    architectForm4Status: 'ISSUED_VERIFIED',
    completionDateEstimated: 'At Allotment',
  },
  {
    stageNumber: 2,
    stageName: 'Execution of Registered Agreement for Sale',
    statutoryPercentOfTotal: 20, // Cumulative 30%
    description: 'Upon execution and electronic registration of Model Agreement for Sale under Section 13.',
    architectForm4CertRequired: false,
    architectForm4Status: 'ISSUED_VERIFIED',
    completionDateEstimated: 'Within 30 Days of Allotment',
  },
  {
    stageNumber: 3,
    stageName: 'Completion of Foundation & Plinth',
    statutoryPercentOfTotal: 15, // Cumulative 45%
    description: 'Completion of subterranean substructure, piling, and ground plinth casting.',
    architectForm4CertRequired: true,
    architectForm4Status: 'ISSUED_VERIFIED',
    completionDateEstimated: 'Q1 2027',
  },
  {
    stageNumber: 4,
    stageName: 'Completion of 12th Floor RCC Slab',
    statutoryPercentOfTotal: 15, // Cumulative 60%
    description: 'Structural RCC framing completed up to mid-rise 12th structural floor.',
    architectForm4CertRequired: true,
    architectForm4Status: 'ISSUED_VERIFIED',
    completionDateEstimated: 'Q3 2027',
  },
  {
    stageNumber: 5,
    stageName: 'Completion of Top Structural RCC Podium/Roof Slab',
    statutoryPercentOfTotal: 10, // Cumulative 70%
    description: 'Final rooftop casting, parapets, and helipad structure completion.',
    architectForm4CertRequired: true,
    architectForm4Status: 'PENDING_INSPECTION',
    completionDateEstimated: 'Q1 2028',
  },
  {
    stageNumber: 6,
    stageName: 'Internal Masonry, Plaster & Window Installation',
    statutoryPercentOfTotal: 10, // Cumulative 80%
    description: 'AAC blockwork masonry, soundproof fenestration, internal gyro plastering.',
    architectForm4CertRequired: true,
    architectForm4Status: 'NOT_DUE',
    completionDateEstimated: 'Q3 2028',
  },
  {
    stageNumber: 7,
    stageName: 'Flooring, Sanitaryware & Lift Electrification',
    statutoryPercentOfTotal: 10, // Cumulative 90%
    description: 'Italian marble installation, concealed Kohler/Grohe plumbing, high-speed lift elevators.',
    architectForm4CertRequired: true,
    architectForm4Status: 'NOT_DUE',
    completionDateEstimated: 'Q1 2029',
  },
  {
    stageNumber: 8,
    stageName: 'Grant of Occupancy Certificate & Handover of Keys',
    statutoryPercentOfTotal: 10, // Cumulative 100%
    description: 'Municipal Fire NOC, final CFO clearance, PCMC Occupancy Certificate (OC) and physical keys.',
    architectForm4CertRequired: true,
    architectForm4Status: 'NOT_DUE',
    completionDateEstimated: 'Q4 2029',
  },
];
