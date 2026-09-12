/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ConstructionMilestone,
  StatutoryAllotmentLetter,
  ModelAgreementForSale,
  EscrowDisbursementOverview,
  EscrowAuditTransaction,
  MAHARERA_STANDARD_PAYMENT_SCHEDULE,
} from '../typesPhase4';

class ContractLifecycleStore {
  private milestones: Map<string, ConstructionMilestone[]> = new Map();
  private allotmentLetters: Map<string, StatutoryAllotmentLetter> = new Map();
  private agreements: Map<string, ModelAgreementForSale> = new Map();
  private escrowReports: Map<string, EscrowDisbursementOverview> = new Map();

  constructor() {
    this.seedMilestones();
    this.seedAllotments();
    this.seedAgreements();
    this.seedEscrowReports();
  }

  private seedMilestones() {
    const oneVerticaMilestones: ConstructionMilestone[] = [
      {
        id: 'ms_1',
        stageNumber: 1,
        stageName: 'Token & Booking Application',
        statutoryPercentOfTotal: 10,
        description: 'Statutory maximum 10% booking consideration paid prior to registered Agreement for Sale execution.',
        architectForm4CertRequired: false,
        architectForm4Status: 'ISSUED_VERIFIED',
        completionDateEstimated: 'August 2026',
        currentActualProgressPercent: 100,
        status: 'COMPLETED',
        photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80'],
      },
      {
        id: 'ms_2',
        stageNumber: 2,
        stageName: 'Execution of Registered Agreement for Sale',
        statutoryPercentOfTotal: 20,
        description: 'Upon execution and electronic registration of Model Agreement for Sale under Section 13.',
        architectForm4CertRequired: false,
        architectForm4Status: 'ISSUED_VERIFIED',
        completionDateEstimated: 'September 2026',
        currentActualProgressPercent: 100,
        status: 'COMPLETED',
        photos: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80'],
      },
      {
        id: 'ms_3',
        stageNumber: 3,
        stageName: 'Completion of Foundation & Plinth Level',
        statutoryPercentOfTotal: 15,
        description: 'Completion of subterranean substructure, 120-foot piling, and ground plinth beam casting.',
        architectForm4CertRequired: true,
        architectForm4Status: 'ISSUED_VERIFIED',
        completionDateEstimated: 'March 2027',
        currentActualProgressPercent: 100,
        status: 'COMPLETED',
        photos: ['https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80'],
      },
      {
        id: 'ms_4',
        stageNumber: 4,
        stageName: 'Completion of 12th Floor RCC Slab',
        statutoryPercentOfTotal: 15,
        description: 'Structural RCC framing completed up to mid-rise 12th structural floor slab.',
        architectForm4CertRequired: true,
        architectForm4Status: 'ISSUED_VERIFIED',
        completionDateEstimated: 'October 2027',
        currentActualProgressPercent: 75,
        status: 'IN_PROGRESS',
        photos: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80'],
      },
      {
        id: 'ms_5',
        stageNumber: 5,
        stageName: 'Completion of 28th Floor Roof & Helipad Slab',
        statutoryPercentOfTotal: 10,
        description: 'Final structural top roof casting, infinity pool deck, and sky bridge structural framing.',
        architectForm4CertRequired: true,
        architectForm4Status: 'PENDING_INSPECTION',
        completionDateEstimated: 'April 2028',
        currentActualProgressPercent: 10,
        status: 'UPCOMING',
        photos: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'],
      },
      {
        id: 'ms_6',
        stageNumber: 6,
        stageName: 'Internal Masonry & Acoustic Fenestration',
        statutoryPercentOfTotal: 10,
        description: 'Wienerberger clay bricks masonry, double-glazed soundproof DGU windows, internal gyro plaster.',
        architectForm4CertRequired: true,
        architectForm4Status: 'NOT_DUE',
        completionDateEstimated: 'October 2028',
        currentActualProgressPercent: 0,
        status: 'UPCOMING',
        photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'],
      },
      {
        id: 'ms_7',
        stageNumber: 7,
        stageName: 'Finishes, Sanitaryware & High-Speed Elevators',
        statutoryPercentOfTotal: 10,
        description: 'Bespoke Italian marble, concealed smart home automation conduits, Mitsubishi 3.5 m/s lifts.',
        architectForm4CertRequired: true,
        architectForm4Status: 'NOT_DUE',
        completionDateEstimated: 'March 2029',
        currentActualProgressPercent: 0,
        status: 'UPCOMING',
        photos: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80'],
      },
      {
        id: 'ms_8',
        stageNumber: 8,
        stageName: 'Grant of Occupancy Certificate & Key Handover',
        statutoryPercentOfTotal: 10,
        description: 'Municipal Fire CFO clearance, PCMC Occupancy Certificate (OC) grant, and physical key handover.',
        architectForm4CertRequired: true,
        architectForm4Status: 'NOT_DUE',
        completionDateEstimated: 'December 2029',
        currentActualProgressPercent: 0,
        status: 'UPCOMING',
        photos: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80'],
      },
    ];

    this.milestones.set('proj_one_vertica_wakad', oneVerticaMilestones);
    this.milestones.set('proj_aurum_residences_baner', oneVerticaMilestones);
    this.milestones.set('proj_techscape_horizon_hinjewadi', oneVerticaMilestones);
  }

  private seedAllotments() {
    const sampleAllotment: StatutoryAllotmentLetter = {
      allotmentId: 'ALT_KIAAN_2026_0942',
      bookingReference: 'BK_VERTICA_A2401',
      dateGenerated: '28 August 2026',
      buyerLegalName: 'Aditya & Neha Kulkarni',
      buyerPanNumber: 'ABCDE1234F',
      buyerAadhaarLast4: '8841',
      buyerAddress: 'Penthouse 4B, Richmond Towers, Koregaon Park, Pune 411001',
      developerLegalEntity: 'Kiaan Properties & Infra Private Limited',
      developerCin: 'U45200PN2021PTC199842',
      developerReraRegNumber: 'P52100028492',
      projectName: 'Kiaan One Vertica',
      buildingTower: 'Tower A — The Solitaire',
      unitNumber: 'Unit A-2401',
      floorNumber: 24,
      carpetAreaSqMtr: 115.66,
      carpetAreaSqFt: 1245,
      exclusiveBalconySqFt: 185,
      allotmentConsiderationINR: 18500000,
      tokenPaidINR: 50000,
      balancePayableOnAgreementINR: 1800000, // to make 10% (₹18.5L)
      timestampEsignDeveloper: '2026-08-28T18:30:00Z',
      timestampEsignBuyer: '2026-08-28T19:15:00Z',
      isFullySigned: true,
    };

    this.allotmentLetters.set(sampleAllotment.allotmentId, sampleAllotment);
  }

  private seedAgreements() {
    const sampleAgreement: ModelAgreementForSale = {
      agreementId: 'MHA_AGR_2026_9882',
      allotmentReference: 'ALT_KIAAN_2026_0942',
      jurisdiction: 'MAHARERA',
      statutoryAct: 'Real Estate (Regulation and Development) Act, 2016 (Section 13) & Maharashtra Real Estate Rules',
      clauses: [
        {
          clauseNumber: 'Clause 1(A)',
          heading: 'Absolute Carpet Area Definition & Guarantee',
          text: 'The Promoter confirms that the Carpet Area of the Apartment is 115.66 sq. meters (1245 sq. feet). In accordance with MahaRERA statutory directives, the Promoter shall not increase or reduce the carpet area by more than 3% without prior written consent.',
          isStatutoryNonNegotiable: true,
        },
        {
          clauseNumber: 'Clause 4(B)',
          heading: 'MahaRERA Section 4(2)(l)(D) 70% Escrow Account Mandate',
          text: 'Seventy percent (70%) of all amounts realized by the Promoter for the real estate project from the allottees, from time to time, shall be deposited in a separate dedicated escrow bank account maintained with ICICI Bank to cover the cost of construction and land cost and shall be used only for that purpose.',
          isStatutoryNonNegotiable: true,
        },
        {
          clauseNumber: 'Clause 7(C)',
          heading: '5-Year Structural Defect Liability Warranty (Section 14(3))',
          text: 'In case any structural defect or any other defect in workmanship, quality or provision of services is brought to the notice of the Promoter within a period of 5 (five) years from the date of handing over possession, the Promoter shall rectify such defects without further charge within thirty (30) days.',
          isStatutoryNonNegotiable: true,
        },
        {
          clauseNumber: 'Clause 9(E)',
          heading: 'Statutory Grace Period & Possession Compensation',
          text: 'The Promoter agrees and undertakes to complete the construction of the Apartment and obtain the Occupancy Certificate on or before 31st December 2029, with a statutory grace period of 6 months. In event of unjustified delay, Promoter shall pay interest at SBI Highest Marginal Cost of Funds Based Lending Rate (MCLR) + 2%.',
          isStatutoryNonNegotiable: true,
        },
      ],
      statutory70PercentEscrowBank: {
        bankName: 'ICICI Bank Limited — Specialized Real Estate Escrow Branch',
        accountNumber: 'ESC-70-00928492-MAHA',
        ifscCode: 'ICIC0000007',
        branch: 'Senapati Bapat Road, Pune',
        mandateRule: 'MahaRERA Section 4(2)(l)(D) — 70% of all customer deposits locked strictly for land & construction costs',
      },
      carpetAreaCertification: {
        reraDefinition: 'Usable area enclosed within walls, excluding external walls, common service shafts, balconies, and open terrace.',
        carpetAreaSqFt: 1245,
        carpetAreaSqMtr: 115.66,
      },
      possessionGracePeriodMonths: 6,
      defectLiabilityYears: 5,
      executionDate: '2026-08-28',
      isExecuted: true,
    };

    this.agreements.set(sampleAgreement.agreementId, sampleAgreement);
  }

  private seedEscrowReports() {
    const sampleTransactions: EscrowAuditTransaction[] = [
      {
        id: 'TXN_ESC_001',
        date: '2026-08-20',
        transactionType: 'CUSTOMER_DEPOSIT_RECEIPT',
        amountINR: 18500000,
        escrow70ComponentINR: 12950000, // 70%
        operational30ComponentINR: 5550000,
        architectForm4Ref: 'ARC_F4_VER_2026_Q2',
        caForm3Ref: 'CA_F3_SHARMA_2026_08',
        engineerForm2Ref: 'ENG_F2_PATIL_2026_08',
        auditVerificationStatus: 'AUDITED_COMPLIANT',
      },
      {
        id: 'TXN_ESC_002',
        date: '2026-08-22',
        transactionType: 'CONTRACTOR_RUNNING_BILL_DISBURSEMENT',
        amountINR: 8500000,
        escrow70ComponentINR: 8500000,
        operational30ComponentINR: 0,
        architectForm4Ref: 'ARC_F4_VER_2026_Q2',
        caForm3Ref: 'CA_F3_SHARMA_2026_08',
        engineerForm2Ref: 'ENG_F2_PATIL_2026_08',
        auditVerificationStatus: 'AUDITED_COMPLIANT',
      },
      {
        id: 'TXN_ESC_003',
        date: '2026-08-25',
        transactionType: 'CUSTOMER_DEPOSIT_RECEIPT',
        amountINR: 23500000,
        escrow70ComponentINR: 16450000, // 70%
        operational30ComponentINR: 7050000,
        architectForm4Ref: 'ARC_F4_VER_2026_Q2',
        caForm3Ref: 'CA_F3_SHARMA_2026_08',
        engineerForm2Ref: 'ENG_F2_PATIL_2026_08',
        auditVerificationStatus: 'AUDITED_COMPLIANT',
      },
    ];

    const sampleEscrowOverview: EscrowDisbursementOverview = {
      projectId: 'proj_one_vertica_wakad',
      projectName: 'Kiaan One Vertica (MahaRERA: P52100028492)',
      escrowAccountDetails: {
        accountName: 'KIAAN ONE VERTICA RERA DESIGNATED ESCROW ACCOUNT',
        bankName: 'ICICI Bank Real Estate Division',
        accountNo: 'ESC-70-00928492-MAHA',
        ifsc: 'ICIC0000007',
      },
      totalCollectionsINR: 142500000, // ₹14.25 Cr
      totalEscrowRetainedINR: 99750000, // ₹9.975 Cr (70%)
      totalDisbursedToConstructionINR: 64200000, // ₹6.42 Cr
      currentEscrowBalanceINR: 35550000, // ₹3.555 Cr
      complianceRating: '100% AUDIT CLEAR',
      recentAuditTransactions: sampleTransactions,
    };

    this.escrowReports.set('proj_one_vertica_wakad', sampleEscrowOverview);
  }

  public getMilestones(projectId: string): ConstructionMilestone[] {
    return this.milestones.get(projectId) || this.milestones.get('proj_one_vertica_wakad') || [];
  }

  public getAllotmentLetter(allotmentId: string): StatutoryAllotmentLetter | undefined {
    return this.allotmentLetters.get(allotmentId) || Array.from(this.allotmentLetters.values())[0];
  }

  public createAllotmentLetter(data: Partial<StatutoryAllotmentLetter>): StatutoryAllotmentLetter {
    const id = `ALT_KIAAN_2026_${Math.floor(1000 + Math.random() * 9000)}`;
    const newAllotment: StatutoryAllotmentLetter = {
      allotmentId: id,
      bookingReference: data.bookingReference || `BK_${Math.floor(1000 + Math.random() * 9000)}`,
      dateGenerated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      buyerLegalName: data.buyerLegalName || 'Honorable Private Client',
      buyerPanNumber: data.buyerPanNumber || 'ABCDE9999Z',
      buyerAadhaarLast4: data.buyerAadhaarLast4 || '9999',
      buyerAddress: data.buyerAddress || 'Pune, Maharashtra, India',
      developerLegalEntity: 'Kiaan Properties & Infra Private Limited',
      developerCin: 'U45200PN2021PTC199842',
      developerReraRegNumber: data.developerReraRegNumber || 'P52100028492',
      projectName: data.projectName || 'Kiaan One Vertica',
      buildingTower: data.buildingTower || 'Tower A — The Solitaire',
      unitNumber: data.unitNumber || 'Unit A-2401',
      floorNumber: data.floorNumber || 24,
      carpetAreaSqMtr: data.carpetAreaSqMtr || 115.66,
      carpetAreaSqFt: data.carpetAreaSqFt || 1245,
      exclusiveBalconySqFt: data.exclusiveBalconySqFt || 185,
      allotmentConsiderationINR: data.allotmentConsiderationINR || 18500000,
      tokenPaidINR: data.tokenPaidINR || 50000,
      balancePayableOnAgreementINR: data.balancePayableOnAgreementINR || 1800000,
      timestampEsignDeveloper: new Date().toISOString(),
      timestampEsignBuyer: new Date().toISOString(),
      isFullySigned: true,
    };

    this.allotmentLetters.set(id, newAllotment);
    return newAllotment;
  }

  public getModelAgreement(agreementId: string): ModelAgreementForSale | undefined {
    return this.agreements.get(agreementId) || Array.from(this.agreements.values())[0];
  }

  public getEscrowOverview(projectId: string): EscrowDisbursementOverview {
    return this.escrowReports.get(projectId) || this.escrowReports.get('proj_one_vertica_wakad')!;
  }
}

export const globalContractLifecycleStore = new ContractLifecycleStore();
