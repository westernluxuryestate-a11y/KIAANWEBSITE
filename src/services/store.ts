/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INITIAL_PROJECTS, INITIAL_PROPERTIES } from '../data/seedData';
import {
  BookingRecord,
  CRMEvent,
  HoldRecord,
  OfferRecord,
  Project,
  Property,
  SiteVisit,
  Unit,
  UserSession,
} from '../types';

export class KiaanStore {
  private projects: Map<string, Project> = new Map();
  private properties: Map<string, Property> = new Map();
  private units: Map<string, Unit> = new Map();
  private holds: Map<string, HoldRecord> = new Map();
  private bookings: Map<string, BookingRecord> = new Map();
  private offers: Map<string, OfferRecord> = new Map();
  private siteVisits: Map<string, SiteVisit> = new Map();
  private crmQueue: CRMEvent[] = [];
  private unitLocks: Map<string, { lockedBy: string; expiresAt: number }> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    for (const p of INITIAL_PROJECTS) {
      this.projects.set(p.id, { ...p });
      for (const t of p.towers || []) {
        for (const fl of t.floors || []) {
          for (const u of fl.units || []) {
            this.units.set(u.id, { ...u });
          }
        }
      }
    }

    for (const prop of INITIAL_PROPERTIES) {
      this.properties.set(prop.id, { ...prop });
    }
  }

  // --- PROJECTS ---
  public getProjects(): Project[] {
    return Array.from(this.projects.values()).filter((p) => p.isPublished);
  }

  public getAllProjectsForAdmin(): Project[] {
    return Array.from(this.projects.values());
  }

  public getProjectById(idOrSlug: string): Project | undefined {
    return Array.from(this.projects.values()).find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  }

  public saveProject(project: Project): Project {
    project.updatedAt = new Date().toISOString();
    this.projects.set(project.id, project);
    return project;
  }

  // --- PROPERTIES ---
  public getProperties(): Property[] {
    return Array.from(this.properties.values()).filter((p) => p.isPublished);
  }

  public getPropertyById(idOrSlug: string): Property | undefined {
    return Array.from(this.properties.values()).find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  }

  public saveProperty(property: Property): Property {
    property.updatedAt = new Date().toISOString();
    this.properties.set(property.id, property);
    return property;
  }

  // --- UNITS & CONCURRENCY / DOUBLE-BOOKING PREVENTION ---
  public getUnitById(unitId: string): Unit | undefined {
    this.cleanupExpiredHolds();
    return this.units.get(unitId);
  }

  public getAllUnits(): Unit[] {
    this.cleanupExpiredHolds();
    return Array.from(this.units.values());
  }

  public getUnitsByIds(unitIds: string[]): Unit[] {
    this.cleanupExpiredHolds();
    return unitIds.map((id) => this.units.get(id)).filter((u): u is Unit => Boolean(u));
  }

  public getUnitsByProject(projectId: string): Unit[] {
    this.cleanupExpiredHolds();
    return Array.from(this.units.values()).filter((u) => u.projectId === projectId);
  }

  private cleanupExpiredHolds() {
    const now = Date.now();
    for (const [unitId, lock] of this.unitLocks.entries()) {
      if (lock.expiresAt < now) {
        this.unitLocks.delete(unitId);
        const unit = this.units.get(unitId);
        if (unit && unit.status === 'HOLD') {
          unit.status = 'AVAILABLE';
          unit.holdExpiresAt = undefined;
          unit.heldByUserId = undefined;
          this.units.set(unitId, unit);
        }
      }
    }
  }

  /**
   * Atomic Unit Hold Request. Prevents concurrent double-hold or double-booking.
   */
  public holdUnit(params: {
    unitId: string;
    userId: string;
    userName: string;
    tokenAmountPaid: number;
    durationMinutes?: number;
  }): { success: boolean; hold?: HoldRecord; message?: string } {
    this.cleanupExpiredHolds();
    const { unitId, userId, userName, tokenAmountPaid, durationMinutes = 15 } = params;
    const unit = this.units.get(unitId);

    if (!unit) {
      return { success: false, message: 'Unit not found.' };
    }

    if (unit.status === 'BOOKED' || unit.status === 'SOLD') {
      return { success: false, message: `Unit ${unit.unitNumber} has already been acquired and is no longer available.` };
    }

    const now = Date.now();
    const existingLock = this.unitLocks.get(unitId);
    if (existingLock && existingLock.expiresAt > now && existingLock.lockedBy !== userId) {
      const remainingSeconds = Math.ceil((existingLock.expiresAt - now) / 1000);
      return {
        success: false,
        message: `Unit ${unit.unitNumber} is currently locked by another prospective buyer. Hold expires in ${remainingSeconds}s.`,
      };
    }

    const expiryTime = now + durationMinutes * 60 * 1000;
    this.unitLocks.set(unitId, { lockedBy: userId, expiresAt: expiryTime });

    unit.status = 'HOLD';
    unit.heldByUserId = userId;
    unit.holdExpiresAt = new Date(expiryTime).toISOString();
    this.units.set(unitId, unit);

    const holdRecord: HoldRecord = {
      id: `hold_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      unitId,
      unitNumber: unit.unitNumber,
      projectId: unit.projectId,
      projectName: unit.projectName,
      userId,
      userName,
      tokenAmountPaid,
      expiresAt: unit.holdExpiresAt,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    this.holds.set(holdRecord.id, holdRecord);

    // Queue CRM decoupled event
    this.enqueueCRMEvent('UNIT_HELD', {
      unitId,
      unitNumber: unit.unitNumber,
      userId,
      userName,
      expiresAt: holdRecord.expiresAt,
    });

    return { success: true, hold: holdRecord };
  }

  /**
   * Atomic Unit Booking Completion. Enforces single-winner guarantee.
   */
  public bookUnit(params: {
    unitId: string;
    userId: string;
    customerDetails: BookingRecord['customerDetails'];
    bookingAmountPaid: number;
    paymentTransactionId: string;
    agreedToTerms: boolean;
    reraVerifiedAcknowledged: boolean;
  }): { success: boolean; booking?: BookingRecord; message?: string } {
    this.cleanupExpiredHolds();
    const { unitId, userId, customerDetails, bookingAmountPaid, paymentTransactionId, agreedToTerms, reraVerifiedAcknowledged } =
      params;

    const unit = this.units.get(unitId);
    if (!unit) {
      return { success: false, message: 'Unit not found.' };
    }

    if (unit.status === 'BOOKED' || unit.status === 'SOLD') {
      return { success: false, message: `Unit ${unit.unitNumber} was already booked. Acquisition failed.` };
    }

    const now = Date.now();
    const existingLock = this.unitLocks.get(unitId);
    if (existingLock && existingLock.expiresAt > now && existingLock.lockedBy !== userId) {
      return { success: false, message: `Cannot book: Unit ${unit.unitNumber} is locked by another transaction in progress.` };
    }

    // Mark unit BOOKED atomically
    unit.status = 'BOOKED';
    unit.holdExpiresAt = undefined;
    unit.heldByUserId = userId;
    this.units.set(unitId, unit);
    this.unitLocks.delete(unitId);

    const bookingRef = `KP-2026-B${Math.floor(1000 + Math.random() * 9000)}`;
    const bookingRecord: BookingRecord = {
      id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      bookingRef,
      unitId: unit.id,
      unitNumber: unit.unitNumber,
      projectId: unit.projectId,
      projectName: unit.projectName,
      userId,
      customerDetails,
      pricingBreakdown: unit.pricing,
      bookingAmountPaid,
      paymentTransactionId,
      status: 'CONFIRMED',
      agreedToTerms,
      reraVerifiedAcknowledged,
      allotmentLetterUrl: `/api/v1/documents/allotment/${bookingRef}.pdf`,
      createdAt: new Date().toISOString(),
    };

    this.bookings.set(bookingRecord.id, bookingRecord);

    // Update project available unit count
    const project = this.projects.get(unit.projectId);
    if (project && project.availableUnitsCount > 0) {
      project.availableUnitsCount -= 1;
      this.projects.set(project.id, project);
    }

    // Queue CRM decoupled event
    this.enqueueCRMEvent('BOOKING_COMPLETED', {
      bookingRef,
      unitNumber: unit.unitNumber,
      customerName: customerDetails.fullName,
      email: customerDetails.email,
      phone: customerDetails.phone,
      amountPaid: bookingAmountPaid,
      transactionId: paymentTransactionId,
    });

    return { success: true, booking: bookingRecord };
  }

  // --- OFFERS ---
  public submitOffer(params: Omit<OfferRecord, 'id' | 'createdAt' | 'status' | 'auditTrail'>): OfferRecord {
    const offer: OfferRecord = {
      ...params,
      id: `off_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          action: 'OFFER_SUBMITTED',
          amount: params.offeredAmount,
          by: params.userName,
        },
      ],
    };

    this.offers.set(offer.id, offer);

    this.enqueueCRMEvent('OFFER_SUBMITTED', {
      offerId: offer.id,
      assetTitle: offer.assetTitle,
      askingPrice: offer.askingPrice,
      offeredAmount: offer.offeredAmount,
      customerName: offer.userName,
    });

    return offer;
  }

  public getOffersByUser(userId: string): OfferRecord[] {
    return Array.from(this.offers.values()).filter((o) => o.userId === userId);
  }

  public getAllOffers(): OfferRecord[] {
    return Array.from(this.offers.values());
  }

  // --- SITE VISITS ---
  public scheduleSiteVisit(params: Omit<SiteVisit, 'id' | 'createdAt' | 'status'>): SiteVisit {
    const visit: SiteVisit = {
      ...params,
      id: `vis_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      advisorAssigned: 'Kiaan Senior Portfolio Executive',
    };

    this.siteVisits.set(visit.id, visit);

    this.enqueueCRMEvent('VISIT_REQUESTED', {
      visitId: visit.id,
      assetTitle: visit.assetTitle,
      visitType: visit.visitType,
      preferredDate: visit.preferredDate,
      customerName: visit.userName,
      phone: visit.userPhone,
    });

    return visit;
  }

  public getVisitsByUser(userId: string): SiteVisit[] {
    return Array.from(this.siteVisits.values()).filter((v) => v.userId === userId);
  }

  // --- CRM ISOLATION & QUEUE ---
  public enqueueCRMEvent(eventType: CRMEvent['eventType'], payload: Record<string, unknown>) {
    const event: CRMEvent = {
      id: `crm_evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      eventType,
      timestamp: new Date().toISOString(),
      payload,
      syncStatus: 'QUEUED',
      retryCount: 0,
    };
    this.crmQueue.push(event);
  }

  public getCRMEventQueue(): CRMEvent[] {
    return [...this.crmQueue];
  }

  public processCRMSync(): { processedCount: number; status: string } {
    let count = 0;
    for (const evt of this.crmQueue) {
      if (evt.syncStatus === 'QUEUED' || evt.syncStatus === 'FAILED_RETRYING') {
        // Simulating safe resilient delivery to external CRM webhook
        evt.syncStatus = 'SENT';
        evt.lastAttemptAt = new Date().toISOString();
        count++;
      }
    }
    return { processedCount: count, status: 'CRM Event queue synced smoothly without impacting website performance.' };
  }
}

export const globalKiaanStore = new KiaanStore();
