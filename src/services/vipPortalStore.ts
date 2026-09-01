/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  VipHoldRecord,
  VipSiteVisitBooking,
  LegalDossierDocument,
  Project,
  Unit,
} from '../types';

export class VipPortalStore {
  private activeHolds: Map<string, VipHoldRecord> = new Map();
  private siteVisits: VipSiteVisitBooking[] = [];
  private legalDossiers: LegalDossierDocument[] = [];
  private savedUnitIds: Set<string> = new Set(['unit_a1201', 'unit_a1202']);

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    // 1. Seed Active Sample Hold
    const now = Date.now();
    const expiry = now + 14 * 60 * 1000 + 35 * 1000; // 14 mins 35 secs remaining

    const sampleHold: VipHoldRecord = {
      holdId: 'hold_vip_88492',
      unitId: 'unit_a1201',
      unitNumber: 'A-1201 (Tower A - The Solitaire)',
      projectId: 'proj_one_vertica_wakad',
      projectName: 'Kiaan One Vertica',
      customerName: 'Rohit Deshmukh (HNW Private Client)',
      customerPhone: '+91 98230 44910',
      customerEmail: 'rohit.deshmukh@investors.in',
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(expiry).toISOString(),
      remainingSeconds: Math.floor((expiry - now) / 1000),
      status: 'ACTIVE',
      tokenAmountINR: 50000,
      extensionCount: 0,
    };
    this.activeHolds.set(sampleHold.holdId, sampleHold);

    // 2. Seed VIP Site Visit Booking
    this.siteVisits.push({
      visitId: 'visit_vip_7719',
      projectId: 'proj_one_vertica_wakad',
      projectName: 'Kiaan One Vertica',
      preferredDate: '2026-08-31',
      timeSlot: '11:00 AM - 01:00 PM',
      pickupAddress: 'Senapati Bapat Road, Pune',
      luxuryVehicleChoice: 'MERCEDES_E_CLASS',
      hospitalityChoice: 'HIGH_TEA_SKY_CLUB',
      specialRequirements: 'Solar study inspection for Master Bedroom & Sky Deck balcony briefing.',
      relationshipManager: {
        name: 'Aishwarya Kulkarni',
        title: 'Senior Vice President — Private Client Advisory',
        phone: '+91 99201 88471',
        email: 'aishwarya.k@kiaanproperties.com',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      },
      status: 'CHAUFFEUR_ASSIGNED',
      chauffeurDetails: {
        driverName: 'Suresh Patil (Verified Chauffeur)',
        vehicleRegNumber: 'MH 12 VJ 0001 (Mercedes-Benz E 220d)',
        contactNumber: '+91 98900 12345',
      },
    });

    // 3. Seed Statutory Legal Due Diligence Dossier
    this.legalDossiers = [
      {
        id: 'doc_maharera_cert',
        projectId: 'proj_one_vertica_wakad',
        projectName: 'Kiaan One Vertica',
        documentTitle: 'MahaRERA Project Registration Certificate (Form 5)',
        category: 'MAHARERA_CERTIFICATE',
        issuingAuthority: 'Maharashtra Real Estate Regulatory Authority (MahaRERA)',
        issuedDate: '2024-03-15',
        validUntil: '2028-12-31',
        verifiedClearStatus: true,
        legalSummary: 'Statutory government certificate confirming registration P52100028492 with 70% dedicated escrow account compliance.',
        fileSizeBytes: 2450000,
        downloadFilename: 'Kiaan_One_Vertica_MahaRERA_Certificate_P52100028492.pdf',
      },
      {
        id: 'doc_title_search',
        projectId: 'proj_one_vertica_wakad',
        projectName: 'Kiaan One Vertica',
        documentTitle: '30-Year Comprehensive Title Search & Legal Opinion Report',
        category: 'TITLE_SEARCH_REPORT',
        issuingAuthority: 'Adv. S. K. Deshpande & Associates (High Court Advocates)',
        issuedDate: '2024-02-10',
        verifiedClearStatus: true,
        legalSummary: '100% marketable, clear, and unencumbered freehold land title with zero litigations across 30-year revenue search.',
        fileSizeBytes: 5800000,
        downloadFilename: 'Kiaan_One_Vertica_30Yr_Title_Search_Opinion.pdf',
      },
      {
        id: 'doc_commencement_cert',
        projectId: 'proj_one_vertica_wakad',
        projectName: 'Kiaan One Vertica',
        documentTitle: 'Commencement Certificate (CC) up to Top Floor Plinth & Slab',
        category: 'COMMENCEMENT_CERTIFICATE',
        issuingAuthority: 'Pimpri Chinchwad Municipal Corporation (PCMC)',
        issuedDate: '2024-04-20',
        verifiedClearStatus: true,
        legalSummary: 'Full building plan sanction granting development rights for 32 residential floors and multi-tier basement podium.',
        fileSizeBytes: 3200000,
        downloadFilename: 'Kiaan_One_Vertica_Commencement_Certificate_PCMC.pdf',
      },
      {
        id: 'doc_env_clearance',
        projectId: 'proj_one_vertica_wakad',
        projectName: 'Kiaan One Vertica',
        documentTitle: 'State Environmental Impact Assessment (SEIAA) Clearance & IGBC Gold',
        category: 'ENVIRONMENTAL_CLEARANCE',
        issuingAuthority: 'State Level Environment Impact Assessment Authority (SEIAA)',
        issuedDate: '2024-01-28',
        verifiedClearStatus: true,
        legalSummary: 'Environmental clearance approved with zero-discharge STP, 40% green cover preservation, and solar grid tie-in.',
        fileSizeBytes: 1900000,
        downloadFilename: 'Kiaan_One_Vertica_Environmental_Clearance_SEIAA.pdf',
      },
      {
        id: 'doc_architect_form4',
        projectId: 'proj_one_vertica_wakad',
        projectName: 'Kiaan One Vertica',
        documentTitle: 'Architect Certificate (MahaRERA Form 4) - Quarter 2 2026',
        category: 'FORM_4_ARCHITECT_CERT',
        issuingAuthority: 'Design Consortium International (Lead Structural Architects)',
        issuedDate: '2026-06-30',
        verifiedClearStatus: true,
        legalSummary: 'Certified structural completion milestone: Tower A Level 16 slab casted, on-track for December 2027 handover.',
        fileSizeBytes: 1400000,
        downloadFilename: 'Kiaan_One_Vertica_Architect_Form4_Q2_2026.pdf',
      },
    ];
  }

  // --- Holds API ---
  public createHold(params: {
    unitId: string;
    unitNumber: string;
    projectId: string;
    projectName: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
  }): VipHoldRecord {
    const holdId = `hold_vip_${Date.now().toString().slice(-6)}`;
    const now = Date.now();
    const expiry = now + 15 * 60 * 1000; // 15 minutes hold

    const hold: VipHoldRecord = {
      holdId,
      unitId: params.unitId,
      unitNumber: params.unitNumber,
      projectId: params.projectId,
      projectName: params.projectName,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerEmail: params.customerEmail || 'vip.client@kiaanproperties.com',
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(expiry).toISOString(),
      remainingSeconds: 15 * 60,
      status: 'ACTIVE',
      tokenAmountINR: 50000,
      extensionCount: 0,
    };

    this.activeHolds.set(holdId, hold);
    return hold;
  }

  public getActiveHolds(): VipHoldRecord[] {
    const now = Date.now();
    const list: VipHoldRecord[] = [];

    this.activeHolds.forEach((hold) => {
      const exp = new Date(hold.expiresAt).getTime();
      const remainingSecs = Math.max(0, Math.floor((exp - now) / 1000));
      hold.remainingSeconds = remainingSecs;
      if (remainingSecs === 0 && hold.status === 'ACTIVE') {
        hold.status = 'EXPIRED';
      }
      list.push(hold);
    });

    return list;
  }

  public extendHold(holdId: string): { success: boolean; hold?: VipHoldRecord; message: string } {
    const hold = this.activeHolds.get(holdId);
    if (!hold) return { success: false, message: 'Hold reservation not found' };
    if (hold.status === 'CONVERTED_TO_TOKEN') {
      return { success: false, message: 'Unit is already converted to confirmed token booking.' };
    }

    if (hold.extensionCount >= 2) {
      return { success: false, message: 'Maximum hold extension limit (2 times) reached. Please proceed to token lock.' };
    }

    const newExpiry = Date.now() + 15 * 60 * 1000;
    hold.expiresAt = new Date(newExpiry).toISOString();
    hold.remainingSeconds = 15 * 60;
    hold.status = 'EXTENDED';
    hold.extensionCount += 1;

    return {
      success: true,
      hold,
      message: `Hold successfully extended for +15 minutes. New expiration: ${new Date(newExpiry).toLocaleTimeString()}`,
    };
  }

  public convertHoldToToken(holdId: string): { success: boolean; hold?: VipHoldRecord; transactionId: string } {
    const hold = this.activeHolds.get(holdId);
    if (!hold) throw new Error('Hold reservation not found');

    hold.status = 'CONVERTED_TO_TOKEN';
    const txnId = `TXN_KIAAN_TOKEN_${Date.now().toString().slice(-8)}`;

    return {
      success: true,
      hold,
      transactionId: txnId,
    };
  }

  // --- Site Visits API ---
  public getSiteVisits(): VipSiteVisitBooking[] {
    return [...this.siteVisits];
  }

  public bookSiteVisit(booking: Omit<VipSiteVisitBooking, 'visitId' | 'status' | 'relationshipManager'>): VipSiteVisitBooking {
    const newBooking: VipSiteVisitBooking = {
      ...booking,
      visitId: `visit_vip_${Date.now().toString().slice(-6)}`,
      status: 'CONFIRMED',
      relationshipManager: {
        name: 'Aishwarya Kulkarni',
        title: 'Senior Vice President — Private Client Advisory',
        phone: '+91 99201 88471',
        email: 'aishwarya.k@kiaanproperties.com',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      },
    };
    this.siteVisits.unshift(newBooking);
    return newBooking;
  }

  // --- Legal Dossiers API ---
  public getLegalDossiers(projectId?: string): LegalDossierDocument[] {
    if (projectId) {
      return this.legalDossiers.filter((d) => d.projectId === projectId);
    }
    return [...this.legalDossiers];
  }

  // --- Saved Units API ---
  public getSavedUnitIds(): string[] {
    return Array.from(this.savedUnitIds);
  }

  public toggleSavedUnit(unitId: string): boolean {
    if (this.savedUnitIds.has(unitId)) {
      this.savedUnitIds.delete(unitId);
      return false; // removed
    } else {
      this.savedUnitIds.add(unitId);
      return true; // added
    }
  }
}

export const globalVipPortalStore = new VipPortalStore();
