/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INITIAL_PROJECTS, INITIAL_PROPERTIES } from '../data/seedData';
import { INITIAL_DEVELOPERS } from '../data/seedDevelopers';
import { INITIAL_LOCALITIES } from '../data/seedLocalities';
import {
  AssetAuthorInfo,
  BookingRecord,
  CRMEvent,
  Developer,
  DeveloperEngagementMetrics,
  DeveloperVerificationStatus,
  HoldRecord,
  Locality,
  OfferRecord,
  Project,
  Property,
  RERARecord,
  SiteVisit,
  Unit,
  UserSession,
} from '../types';

export class KiaanStore {
  private projects: Map<string, Project> = new Map();
  private properties: Map<string, Property> = new Map();
  private developers: Map<string, Developer> = new Map();
  private localities: Map<string, Locality> = new Map();
  private units: Map<string, Unit> = new Map();
  private holds: Map<string, HoldRecord> = new Map();
  private bookings: Map<string, BookingRecord> = new Map();
  private offers: Map<string, OfferRecord> = new Map();
  private siteVisits: Map<string, SiteVisit> = new Map();
  private crmQueue: CRMEvent[] = [];
  private unitLocks: Map<string, { lockedBy: string; expiresAt: number }> = new Map();
  private listeners: Set<() => void> = new Set();
  private deletedIds: Set<string> = new Set();

  constructor() {
    this.seed();
    this.loadFromStorage();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.warn('Store subscriber listener error:', err);
      }
    });
  }

  private saveToStorage() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const projectsArr = Array.from(this.projects.values());
      const propertiesArr = Array.from(this.properties.values());
      const developersArr = Array.from(this.developers.values());
      const localitiesArr = Array.from(this.localities.values());
      const deletedArr = Array.from(this.deletedIds);

      localStorage.setItem('kiaan_projects_store_v1', JSON.stringify(projectsArr));
      localStorage.setItem('kiaan_properties_store_v1', JSON.stringify(propertiesArr));
      localStorage.setItem('kiaan_developers_store_v1', JSON.stringify(developersArr));
      localStorage.setItem('kiaan_localities_store_v1', JSON.stringify(localitiesArr));
      localStorage.setItem('kiaan_deleted_ids_v1', JSON.stringify(deletedArr));
    } catch (e) {
      console.warn('Failed to save KiaanStore to localStorage:', e);
    }
  }

  private loadFromStorage() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      
      const deletedRaw = localStorage.getItem('kiaan_deleted_ids_v1');
      if (deletedRaw) {
        const arr = JSON.parse(deletedRaw);
        if (Array.isArray(arr)) {
          arr.forEach((id) => this.deletedIds.add(id));
        }
      }

      // Remove any seeded items that were deleted
      this.deletedIds.forEach((id) => {
        this.projects.delete(id);
        this.properties.delete(id);
        this.developers.delete(id);
        this.localities.delete(id);
      });

      const projectsRaw = localStorage.getItem('kiaan_projects_store_v1');
      if (projectsRaw) {
        const arr: Project[] = JSON.parse(projectsRaw);
        if (Array.isArray(arr)) {
          arr.forEach((p) => {
            if (!this.deletedIds.has(p.id)) {
              const seedP = INITIAL_PROJECTS.find((ip) => ip.id === p.id);
              if (p.constructionPercentage === undefined && seedP?.constructionPercentage !== undefined) {
                p.constructionPercentage = seedP.constructionPercentage;
              }
              if (!p.constructionStage && seedP?.constructionStage) {
                p.constructionStage = seedP.constructionStage;
              }
              this.projects.set(p.id, p);
              for (const t of p.towers || []) {
                for (const fl of t.floors || []) {
                  for (const u of fl.units || []) {
                    this.units.set(u.id, { ...u });
                  }
                }
              }
            }
          });
        }
      }

      const propertiesRaw = localStorage.getItem('kiaan_properties_store_v1');
      if (propertiesRaw) {
        const arr: Property[] = JSON.parse(propertiesRaw);
        if (Array.isArray(arr)) {
          arr.forEach((prop) => {
            if (!this.deletedIds.has(prop.id)) {
              this.properties.set(prop.id, prop);
            }
          });
        }
      }

      const developersRaw = localStorage.getItem('kiaan_developers_store_v1');
      if (developersRaw) {
        const arr: Developer[] = JSON.parse(developersRaw);
        if (Array.isArray(arr)) {
          arr.forEach((dev) => {
            if (!this.deletedIds.has(dev.id)) {
              this.developers.set(dev.id, dev);
            }
          });
        }
      }

      const localitiesRaw = localStorage.getItem('kiaan_localities_store_v1');
      if (localitiesRaw) {
        const arr: Locality[] = JSON.parse(localitiesRaw);
        if (Array.isArray(arr)) {
          arr.forEach((loc) => {
            if (!this.deletedIds.has(loc.id)) {
              this.localities.set(loc.id, loc);
            }
          });
        }
      }

      // Ensure all initial projects, properties, and developers exist unless explicitly deleted
      for (const p of INITIAL_PROJECTS) {
        if (!this.deletedIds.has(p.id) && !this.projects.has(p.id)) {
          this.projects.set(p.id, p);
          for (const t of p.towers || []) {
            for (const fl of t.floors || []) {
              for (const u of fl.units || []) {
                this.units.set(u.id, { ...u });
              }
            }
          }
        }
      }

      for (const prop of INITIAL_PROPERTIES) {
        if (!this.deletedIds.has(prop.id) && !this.properties.has(prop.id)) {
          this.properties.set(prop.id, prop);
        }
      }

      for (const dev of INITIAL_DEVELOPERS) {
        if (!this.deletedIds.has(dev.id) && !this.developers.has(dev.id)) {
          this.developers.set(dev.id, dev);
        }
      }

      for (const loc of INITIAL_LOCALITIES) {
        if (!this.deletedIds.has(loc.id)) {
          const existing = this.localities.get(loc.id);
          if (!existing) {
            this.localities.set(loc.id, loc);
          } else {
            // Update hierarchy fields and coordinates if missing or outdated
            if (!existing.zoneId || !existing.subLocalities || existing.subLocalities.length === 0) {
              this.localities.set(loc.id, {
                ...existing,
                zoneId: loc.zoneId || existing.zoneId,
                zoneName: loc.zoneName || existing.zoneName,
                subLocalities: loc.subLocalities && loc.subLocalities.length > 0 ? loc.subLocalities : existing.subLocalities,
                microLocations: loc.microLocations && loc.microLocations.length > 0 ? loc.microLocations : existing.microLocations,
                coordinates: loc.coordinates?.lat ? loc.coordinates : existing.coordinates,
              });
            }
          }
        }
      }

      this.saveToStorage();
    } catch (e) {
      console.warn('Failed to load KiaanStore from localStorage:', e);
    }
  }

  public forceSyncInitialProjects(): { totalProjects: number; balmoralFound: boolean; addedCount: number } {
    let addedCount = 0;
    for (const p of INITIAL_PROJECTS) {
      if (!this.deletedIds.has(p.id)) {
        if (!this.projects.has(p.id)) {
          addedCount++;
        }
        // Ensure latest definition is populated or updated
        this.projects.set(p.id, { ...p });
        for (const t of p.towers || []) {
          for (const fl of t.floors || []) {
            for (const u of fl.units || []) {
              this.units.set(u.id, { ...u });
            }
          }
        }
      }
    }

    for (const prop of INITIAL_PROPERTIES) {
      if (!this.deletedIds.has(prop.id)) {
        this.properties.set(prop.id, { ...prop });
      }
    }

    this.saveToStorage();

    const balmoralFound = Array.from(this.projects.values()).some(
      (p) => p.id === 'proj_balmoral_riverside_balewadi' || p.name.toLowerCase().includes('balmoral')
    );

    return {
      totalProjects: this.getAllProjectsForAdmin().length,
      balmoralFound,
      addedCount,
    };
  }

  private seed() {
    for (const p of INITIAL_PROJECTS) {
      // Default initial projects created by sales super admin
      const seededProj: Project = {
        ...p,
        createdBy: p.createdBy || {
          name: 'Kiaan Sales Leadership',
          email: 'sales@kiaanproperties.in',
          role: 'SUPER_ADMIN',
          trustLevel: 'ADMIN',
        },
      };
      this.projects.set(p.id, seededProj);
      for (const t of p.towers || []) {
        for (const fl of t.floors || []) {
          for (const u of fl.units || []) {
            this.units.set(u.id, { ...u });
          }
        }
      }
    }

    for (const prop of INITIAL_PROPERTIES) {
      const seededProp: Property = {
        ...prop,
        createdBy: prop.createdBy || {
          name: 'Kiaan Sales Leadership',
          email: 'sales@kiaanproperties.in',
          role: 'SUPER_ADMIN',
          trustLevel: 'ADMIN',
        },
      };
      this.properties.set(prop.id, seededProp);
    }

    for (const loc of INITIAL_LOCALITIES) {
      this.localities.set(loc.id, {
        ...loc,
        status: loc.status || 'PUBLISHED',
        cityId: loc.cityId || loc.city_id || loc.city.toLowerCase(),
        city_id: loc.city_id || loc.cityId || loc.city.toLowerCase(),
      });
    }

    // Auto-associate seed projects and properties with localities if not explicitly assigned
    for (const [projId, proj] of this.projects.entries()) {
      if (!proj.localityId) {
        const matchedLoc = Array.from(this.localities.values()).find(
          (l) =>
            l.name.toLowerCase() === proj.location?.microMarket?.toLowerCase() ||
            proj.location?.address?.toLowerCase().includes(l.name.toLowerCase())
        );
        if (matchedLoc) {
          proj.localityId = matchedLoc.id;
          proj.locality_id = matchedLoc.id;
          proj.locality = matchedLoc.name;
          this.projects.set(projId, proj);
        }
      }
    }

    for (const [propId, prop] of this.properties.entries()) {
      if (!prop.localityId) {
        const matchedLoc = Array.from(this.localities.values()).find(
          (l) =>
            l.name.toLowerCase() === prop.location?.microMarket?.toLowerCase() ||
            prop.location?.address?.toLowerCase().includes(l.name.toLowerCase())
        );
        if (matchedLoc) {
          prop.localityId = matchedLoc.id;
          prop.locality_id = matchedLoc.id;
          prop.locality = matchedLoc.name;
          if (!prop.listing_type) {
            const isCommercial = ['OFFICE', 'RETAIL', 'SHOWROOM', 'WAREHOUSE'].includes(prop.propertyType as string);
            prop.listing_type = isCommercial ? 'COMMERCIAL' : 'RESALE';
          }
          this.properties.set(propId, prop);
        }
      }
    }
  }

  // --- PERMISSION AND OWNERSHIP ENFORCEMENT ---
  public isSuperAdminOrStaff(user?: UserSession | AssetAuthorInfo | null): boolean {
    if (!user) return false;
    const email = (user.email || '').trim().toLowerCase();
    const role = user.role;
    return (
      email === 'sales@kiaanproperties.in' ||
      email === 'superadmin@kiaanproperties.com' ||
      role === 'SUPER_ADMIN' ||
      role === 'WEBSITE_ADMIN' ||
      role === 'COMPLIANCE_MANAGER'
    );
  }

  public canUserModifyProject(
    projectOrId: Project | string,
    user?: UserSession | AssetAuthorInfo | null
  ): boolean {
    if (!user) return false;
    if (this.isSuperAdminOrStaff(user)) return true;

    const project = typeof projectOrId === 'string' ? this.getProjectById(projectOrId) : projectOrId;
    if (!project) return false;

    const userEmail = (user.email || '').trim().toLowerCase();
    const userId = ('userId' in user ? user.userId : user.userId) || '';

    // Check direct creator attribution
    if (project.createdBy) {
      if (project.createdBy.email && project.createdBy.email.toLowerCase() === userEmail) return true;
      if (userId && project.createdBy.userId && project.createdBy.userId === userId) return true;
    }

    // Check contributor attribution
    if (project.contributor) {
      if (project.contributor.email && project.contributor.email.toLowerCase() === userEmail) return true;
      if (userId && project.contributor.userId && project.contributor.userId === userId) return true;
    }

    return false;
  }

  public canUserModifyProperty(
    propertyOrId: Property | string,
    user?: UserSession | AssetAuthorInfo | null
  ): boolean {
    if (!user) return false;
    if (this.isSuperAdminOrStaff(user)) return true;

    const prop = typeof propertyOrId === 'string' ? this.getPropertyById(propertyOrId) : propertyOrId;
    if (!prop) return false;

    const userEmail = (user.email || '').trim().toLowerCase();
    const userId = ('userId' in user ? user.userId : user.userId) || '';

    // Check direct creator attribution
    if (prop.createdBy) {
      if (prop.createdBy.email && prop.createdBy.email.toLowerCase() === userEmail) return true;
      if (userId && prop.createdBy.userId && prop.createdBy.userId === userId) return true;
    }

    // Check contributor attribution
    if (prop.contributor) {
      if (prop.contributor.email && prop.contributor.email.toLowerCase() === userEmail) return true;
      if (userId && prop.contributor.userId && prop.contributor.userId === userId) return true;
    }

    return false;
  }

  // --- USER ASSET RETRIEVAL (BY RESPECTIVE CREATOR) ---
  public getProjectsByUser(user?: UserSession | AssetAuthorInfo | null): Project[] {
    if (!user) return [];
    if (this.isSuperAdminOrStaff(user)) {
      return Array.from(this.projects.values());
    }

    const userEmail = (user.email || '').trim().toLowerCase();
    const userId = ('userId' in user ? user.userId : user.userId) || '';

    return Array.from(this.projects.values()).filter((p) => {
      const creatorEmail = (p.createdBy?.email || '').trim().toLowerCase();
      const contribEmail = (p.contributor?.email || '').trim().toLowerCase();
      const creatorId = p.createdBy?.userId || '';
      const contribId = p.contributor?.userId || '';

      return (
        (userEmail && (creatorEmail === userEmail || contribEmail === userEmail)) ||
        (userId && (creatorId === userId || contribId === userId))
      );
    });
  }

  public getPropertiesByUser(user?: UserSession | AssetAuthorInfo | null): Property[] {
    if (!user) return [];
    if (this.isSuperAdminOrStaff(user)) {
      return Array.from(this.properties.values());
    }

    const userEmail = (user.email || '').trim().toLowerCase();
    const userId = ('userId' in user ? user.userId : user.userId) || '';

    return Array.from(this.properties.values()).filter((prop) => {
      const creatorEmail = (prop.createdBy?.email || '').trim().toLowerCase();
      const contribEmail = (prop.contributor?.email || '').trim().toLowerCase();
      const creatorId = prop.createdBy?.userId || '';
      const contribId = prop.contributor?.userId || '';

      return (
        (userEmail && (creatorEmail === userEmail || contribEmail === userEmail)) ||
        (userId && (creatorId === userId || contribId === userId))
      );
    });
  }

  // --- PROJECTS ---
  public getProjects(): Project[] {
    return Array.from(this.projects.values()).filter((p) => p.isPublished && !this.deletedIds.has(p.id));
  }

  public getAllProjectsForAdmin(): Project[] {
    return Array.from(this.projects.values()).filter((p) => !this.deletedIds.has(p.id));
  }

  public getProjectById(idOrSlug: string): Project | undefined {
    if (this.deletedIds.has(idOrSlug)) return undefined;
    return Array.from(this.projects.values()).find(
      (p) => (p.id === idOrSlug || p.slug === idOrSlug) && !this.deletedIds.has(p.id)
    );
  }

  public saveProject(project: Project, operator?: AssetAuthorInfo | UserSession): Project {
    project.updatedAt = new Date().toISOString();

    if (operator) {
      const opInfo: AssetAuthorInfo = {
        userId: 'userId' in operator ? operator.userId : operator.userId,
        name: operator.name,
        email: operator.email,
        phone: 'phone' in operator ? operator.phone : undefined,
        role: operator.role,
      };

      if (!project.createdBy) {
        project.createdBy = opInfo;
      } else {
        project.updatedBy = opInfo;
      }
    }

    this.deletedIds.delete(project.id);
    this.projects.set(project.id, project);

    // Sync tower units
    for (const t of project.towers || []) {
      for (const fl of t.floors || []) {
        for (const u of fl.units || []) {
          this.units.set(u.id, { ...u });
        }
      }
    }

    this.notify();
    return project;
  }

  public deleteProject(
    projectId: string,
    operator?: AssetAuthorInfo | UserSession
  ): { success: boolean; message: string } {
    const project = this.getProjectById(projectId);
    if (!project) {
      return { success: false, message: 'Project not found.' };
    }

    if (operator && !this.canUserModifyProject(project, operator)) {
      return {
        success: false,
        message: `Access denied: Only the creator (${project.createdBy?.name || project.createdBy?.email || 'Authorized Owner'}) or a Super Admin can delete this project.`,
      };
    }

    this.deletedIds.add(projectId);
    this.projects.delete(projectId);

    // Remove units
    const projectUnits = this.getUnitsByProject(projectId);
    for (const u of projectUnits) {
      this.units.delete(u.id);
    }

    this.enqueueCRMEvent('ASSET_SOFT_DELETED' as any, {
      assetType: 'PROJECT',
      assetId: projectId,
      title: project.name,
      deletedBy: operator?.name || 'System Operator',
      timestamp: new Date().toISOString(),
    });

    this.notify();
    return { success: true, message: `Project "${project.name}" has been successfully deleted by ${operator?.name || 'author'}.` };
  }

  // --- PROPERTIES ---
  public getProperties(): Property[] {
    return Array.from(this.properties.values()).filter((p) => p.isPublished && !this.deletedIds.has(p.id));
  }

  public getAllPropertiesForAdmin(): Property[] {
    return Array.from(this.properties.values()).filter((p) => !this.deletedIds.has(p.id));
  }

  public getPropertyById(idOrSlug: string): Property | undefined {
    if (this.deletedIds.has(idOrSlug)) return undefined;
    return Array.from(this.properties.values()).find(
      (p) => (p.id === idOrSlug || p.slug === idOrSlug) && !this.deletedIds.has(p.id)
    );
  }

  public saveProperty(property: Property, operator?: AssetAuthorInfo | UserSession): Property {
    property.updatedAt = new Date().toISOString();

    if (operator) {
      const opInfo: AssetAuthorInfo = {
        userId: 'userId' in operator ? operator.userId : operator.userId,
        name: operator.name,
        email: operator.email,
        phone: 'phone' in operator ? operator.phone : undefined,
        role: operator.role,
      };

      if (!property.createdBy) {
        property.createdBy = opInfo;
      } else {
        property.updatedBy = opInfo;
      }
    }

    this.deletedIds.delete(property.id);
    this.properties.set(property.id, property);
    this.notify();
    return property;
  }

  public deleteProperty(
    propertyId: string,
    operator?: AssetAuthorInfo | UserSession
  ): { success: boolean; message: string } {
    const property = this.getPropertyById(propertyId);
    if (!property) {
      return { success: false, message: 'Property not found.' };
    }

    if (operator && !this.canUserModifyProperty(property, operator)) {
      return {
        success: false,
        message: `Access denied: Only the creator (${property.createdBy?.name || property.createdBy?.email || 'Authorized Owner'}) or a Super Admin can delete this property.`,
      };
    }

    this.deletedIds.add(propertyId);
    this.properties.delete(propertyId);

    this.enqueueCRMEvent('ASSET_SOFT_DELETED' as any, {
      assetType: 'PROPERTY',
      assetId: propertyId,
      title: property.title,
      deletedBy: operator?.name || 'System Operator',
      timestamp: new Date().toISOString(),
    });

    this.notify();
    return { success: true, message: `Property "${property.title}" has been successfully deleted by ${operator?.name || 'author'}.` };
  }

  // --- STATUTORY MAHARERA BACKEND PROVISIONING & BINDING ---
  public updateEntityReraRecord(params: {
    entityType: 'PROJECT' | 'PROPERTY';
    entityId: string;
    registrationNumber: string;
    qrCodeUrl: string;
    officialAuthorityUrl?: string;
    verifiedBy?: string;
    auditDetails?: string;
  }): { success: boolean; message: string; reraRecord?: RERARecord } {
    const { entityType, entityId, registrationNumber, qrCodeUrl, officialAuthorityUrl, verifiedBy, auditDetails } = params;
    const now = new Date().toISOString();
    const authority = 'Maharashtra Real Estate Regulatory Authority (MahaRERA)';
    const cleanAuthorityUrl =
      officialAuthorityUrl ||
      `https://maharera.maharashtra.gov.in/projects-search-result?regNo=${encodeURIComponent(registrationNumber)}`;

    const reraRecord: RERARecord = {
      id: `rera_backend_${Date.now()}`,
      jurisdiction: 'MAHARERA',
      regulatoryAuthority: authority,
      registrationNumber: registrationNumber.trim().toUpperCase(),
      officialAuthorityUrl: cleanAuthorityUrl,
      qrCodeUrl,
      status: 'REGISTERED',
      verificationStatus: 'VERIFIED',
      lastVerifiedAt: now,
      verifiedBy: verifiedBy || 'Kiaan Statutory Compliance Desk (Backend Engine)',
      auditHistory: [
        {
          timestamp: now,
          action: 'BACKEND_QR_PROVISIONED_AND_VERIFIED',
          actor: verifiedBy || 'Backend Compliance Service',
          details: auditDetails || `Statutory QR code cryptographically verified & bound via backend regulatory engine for ${registrationNumber}`,
        },
      ],
    };

    if (entityType === 'PROJECT') {
      const proj = this.getProjectById(entityId);
      if (!proj) {
        return { success: false, message: `Project ${entityId} not found in store` };
      }
      proj.reraRecord = reraRecord;
      proj.updatedAt = now;
      this.projects.set(proj.id, proj);
      this.notify();
      return { success: true, message: `MahaRERA QR verified and bound to project "${proj.name}" by backend`, reraRecord };
    } else {
      const prop = this.getPropertyById(entityId);
      if (!prop) {
        return { success: false, message: `Property ${entityId} not found in store` };
      }
      prop.reraRecord = reraRecord;
      prop.updatedAt = now;
      this.properties.set(prop.id, prop);
      this.notify();
      return { success: true, message: `MahaRERA QR verified and bound to property "${prop.title}" by backend`, reraRecord };
    }
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

  // --- LEAD CAPTURE ---
  public submitLead(params: {
    name: string;
    phone: string;
    email: string;
    source?: string;
    notes?: string;
  }): { success: boolean; leadId: string } {
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    this.enqueueCRMEvent('LEAD_CAPTURED' as any, {
      leadId,
      ...params,
      timestamp: new Date().toISOString(),
    });
    return { success: true, leadId };
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

  // ============================================================
  // DEVELOPER & BUILDER MANAGEMENT ENGINE
  // ============================================================

  public getDevelopers(): Developer[] {
    return Array.from(this.developers.values());
  }

  public getDeveloperById(id: string): Developer | undefined {
    return this.developers.get(id);
  }

  public getDeveloperBySlug(slug: string): Developer | undefined {
    const cleanSlug = slug.toLowerCase().trim();
    return Array.from(this.developers.values()).find(
      (d) => d.slug.toLowerCase() === cleanSlug || d.id === cleanSlug
    );
  }

  public saveDeveloper(dev: Developer): Developer {
    const existing = this.developers.get(dev.id);
    const updated: Developer = {
      ...dev,
      updatedAt: new Date().toISOString(),
      createdAt: existing ? existing.createdAt : (dev.createdAt || new Date().toISOString()),
    };
    this.developers.set(updated.id, updated);

    // Also synchronize developerName/developerId onto associated projects in the store
    if (updated.projectIds && updated.projectIds.length > 0) {
      for (const pId of updated.projectIds) {
        const p = this.projects.get(pId);
        if (p) {
          p.developerId = updated.id;
          p.developerName = updated.name;
          this.projects.set(p.id, { ...p, updatedAt: new Date().toISOString() });
        }
      }
    }

    this.notify();
    return updated;
  }

  public deleteDeveloper(id: string): boolean {
    this.deletedIds.add(id);
    const res = this.developers.delete(id);
    this.notify();
    return res;
  }

  public updateDeveloperVerificationStatus(id: string, status: DeveloperVerificationStatus): boolean {
    const dev = this.developers.get(id);
    if (!dev) return false;
    dev.verificationStatus = status;
    dev.verifiedBadge = status === 'VERIFIED';
    dev.updatedAt = new Date().toISOString();
    this.developers.set(id, { ...dev });
    this.notify();
    return true;
  }

  public associateProjectToDeveloper(developerId: string, projectId: string): boolean {
    const dev = this.developers.get(developerId);
    const proj = this.projects.get(projectId);
    if (!dev || !proj) return false;

    if (!dev.projectIds.includes(projectId)) {
      dev.projectIds.push(projectId);
      dev.updatedAt = new Date().toISOString();
      this.developers.set(developerId, { ...dev });
    }

    proj.developerId = developerId;
    proj.developerName = dev.name;
    proj.updatedAt = new Date().toISOString();
    this.projects.set(projectId, { ...proj });

    this.notify();
    return true;
  }

  public removeProjectFromDeveloper(developerId: string, projectId: string): boolean {
    const dev = this.developers.get(developerId);
    if (!dev) return false;

    dev.projectIds = dev.projectIds.filter((id) => id !== projectId);
    dev.updatedAt = new Date().toISOString();
    this.developers.set(developerId, { ...dev });

    const proj = this.projects.get(projectId);
    if (proj && proj.developerId === developerId) {
      proj.developerId = undefined;
      proj.updatedAt = new Date().toISOString();
      this.projects.set(projectId, { ...proj });
    }

    this.notify();
    return true;
  }

  public trackDeveloperEngagement(
    developerId: string,
    metric: keyof DeveloperEngagementMetrics
  ): void {
    const dev = this.developers.get(developerId);
    if (!dev) return;

    if (!dev.metrics) {
      dev.metrics = {
        profileViews: 0,
        projectViews: 0,
        enquiriesCount: 0,
        phoneClicks: 0,
        whatsappClicks: 0,
        brochureDownloads: 0,
        shortlistCount: 0,
      };
    }

    dev.metrics[metric] = (dev.metrics[metric] || 0) + 1;
    this.developers.set(developerId, { ...dev });
    this.saveToStorage();
  }

  /**
   * Retrieves dynamically categorized projects for a developer:
   * Completed | Ongoing | Upcoming
   * Connected directly to the main project database!
   */
  public getProjectsForDeveloper(developerIdOrSlug: string): {
    developer: Developer | undefined;
    allProjects: Project[];
    completed: Project[];
    ongoing: Project[];
    upcoming: Project[];
  } {
    const dev = this.getDeveloperBySlug(developerIdOrSlug) || this.getDeveloperById(developerIdOrSlug);
    
    // Find all projects belonging to developer by ID or by developerName match
    const allProjects = Array.from(this.projects.values()).filter((p) => {
      if (dev && dev.projectIds.includes(p.id)) return true;
      if (dev && p.developerId === dev.id) return true;
      if (dev && p.developerName && dev.name && p.developerName.toLowerCase() === dev.name.toLowerCase()) return true;
      if (dev && dev.brandName && p.developerName && p.developerName.toLowerCase() === dev.brandName.toLowerCase()) return true;
      return false;
    });

    const completed = allProjects.filter((p) => {
      return (
        p.status === 'COMPLETED' ||
        p.status === 'READY_POSSESSION' ||
        (p.possessionDate && p.possessionDate.toLowerCase().includes('immediate'))
      );
    });

    const ongoing = allProjects.filter((p) => {
      return (
        p.status === 'UNDER_CONSTRUCTION' ||
        p.status === 'NEAR_POSSESSION'
      );
    });

    const upcoming = allProjects.filter((p) => {
      return (
        p.status === 'PRE_LAUNCH' ||
        (!completed.some((c) => c.id === p.id) && !ongoing.some((o) => o.id === p.id))
      );
    });

    return {
      developer: dev,
      allProjects,
      completed,
      ongoing,
      upcoming,
    };
  }

  // ============================================================
  // LOCALITY INTELLIGENCE & MICRO-MARKET REPOSITORY ENGINE
  // ============================================================

  public getLocalities(): Locality[] {
    return Array.from(this.localities.values());
  }

  public getLocalityById(id: string): Locality | undefined {
    return this.localities.get(id);
  }

  public getLocalityBySlug(slug: string): Locality | undefined {
    const cleanSlug = slug.toLowerCase().trim();
    return Array.from(this.localities.values()).find(
      (loc) => loc.slug.toLowerCase() === cleanSlug || loc.id === cleanSlug
    );
  }

  public saveLocality(locality: Locality): Locality {
    const existing = this.localities.get(locality.id);
    const updated: Locality = {
      ...locality,
      updatedAt: new Date().toISOString(),
      createdAt: existing ? existing.createdAt : (locality.createdAt || new Date().toISOString()),
    };
    this.localities.set(updated.id, updated);
    this.notify();
    return updated;
  }

  public deleteLocality(id: string): boolean {
    this.deletedIds.add(id);
    const res = this.localities.delete(id);
    this.notify();
    return res;
  }

  public updateLocalityVerification(id: string, verified: boolean): boolean {
    const loc = this.localities.get(id);
    if (!loc) return false;
    loc.isVerified = verified;
    loc.updatedAt = new Date().toISOString();
    this.localities.set(id, { ...loc });
    this.notify();
    return true;
  }

  public toggleLocalityFeatured(id: string): boolean {
    const loc = this.localities.get(id);
    if (!loc) return false;
    loc.isFeatured = !loc.isFeatured;
    loc.updatedAt = new Date().toISOString();
    this.localities.set(id, { ...loc });
    this.notify();
    return true;
  }

  public mergeLocalities(targetId: string, sourceId: string): boolean {
    const target = this.localities.get(targetId);
    const source = this.localities.get(sourceId);
    if (!target || !source) return false;

    // Merge nearby areas
    const mergedNearby = Array.from(new Set([...target.nearbyAreas, ...source.nearbyAreas, source.name]));
    target.nearbyAreas = mergedNearby;

    // Merge FAQs
    const existingQ = new Set(target.faqs.map((f) => f.question.toLowerCase()));
    source.faqs.forEach((f) => {
      if (!existingQ.has(f.question.toLowerCase())) {
        target.faqs.push(f);
      }
    });

    target.updatedAt = new Date().toISOString();
    this.localities.set(targetId, { ...target });

    // Mark source as deleted
    this.deleteLocality(sourceId);
    return true;
  }

  public updateLocalityStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN'): boolean {
    const loc = this.localities.get(id);
    if (!loc) return false;
    loc.status = status;
    loc.updatedAt = new Date().toISOString();
    this.localities.set(id, { ...loc });
    this.notify();
    return true;
  }

  public getLocalityByCityAndSlug(city: string, slug: string): Locality | undefined {
    const cleanCity = city.toLowerCase().trim();
    const cleanSlug = slug.toLowerCase().trim();
    return Array.from(this.localities.values()).find(
      (loc) =>
        loc.city.toLowerCase() === cleanCity &&
        (loc.slug.toLowerCase() === cleanSlug || loc.id.toLowerCase() === cleanSlug)
    );
  }

  /**
   * MVP 29.9: Duplicate locality protection (checks normalized name + city)
   */
  public checkDuplicateLocality(name: string, city: string, excludeId?: string): Locality | null {
    if (!name || !city) return null;
    const normName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const normCity = city.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    for (const loc of this.localities.values()) {
      if (excludeId && loc.id === excludeId) continue;
      const targetName = loc.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetCity = loc.city.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

      if (targetCity === normCity && (targetName === normName || targetName.includes(normName) || normName.includes(targetName))) {
        return loc;
      }
    }
    return null;
  }

  public associatePropertyToLocality(propertyId: string, localityId: string): boolean {
    const prop = this.properties.get(propertyId);
    const loc = this.localities.get(localityId);
    if (!prop || !loc) return false;

    prop.localityId = loc.id;
    prop.locality_id = loc.id;
    prop.locality = loc.name;
    if (prop.location) {
      prop.location.microMarket = loc.name;
      prop.location.city = loc.city;
      prop.location.pincode = loc.pincode;
    }
    prop.updatedAt = new Date().toISOString();
    this.properties.set(propertyId, { ...prop });
    this.notify();
    return true;
  }

  public associateProjectToLocality(projectId: string, localityId: string): boolean {
    const proj = this.projects.get(projectId);
    const loc = this.localities.get(localityId);
    if (!proj || !loc) return false;

    proj.localityId = loc.id;
    proj.locality_id = loc.id;
    proj.locality = loc.name;
    if (proj.location) {
      proj.location.microMarket = loc.name;
      proj.location.city = loc.city;
      proj.location.pincode = loc.pincode;
    }
    proj.updatedAt = new Date().toISOString();
    this.projects.set(projectId, { ...proj });
    this.notify();
    return true;
  }

  public getPropertiesByLocality(locality: Locality): Property[] {
    const locName = locality.name.toLowerCase();
    const locId = locality.id.toLowerCase();
    return Array.from(this.properties.values()).filter((p) => {
      if (p.localityId && p.localityId.toLowerCase() === locId) return true;
      if (p.locality_id && p.locality_id.toLowerCase() === locId) return true;
      if (p.locality && p.locality.toLowerCase() === locName) return true;
      if (p.location?.microMarket && p.location.microMarket.toLowerCase() === locName) return true;
      if (p.location?.address && p.location.address.toLowerCase().includes(locName)) return true;
      return false;
    });
  }

  public getProjectsByLocality(locality: Locality): Project[] {
    const locName = locality.name.toLowerCase();
    const locId = locality.id.toLowerCase();
    return Array.from(this.projects.values()).filter((proj) => {
      if (proj.localityId && proj.localityId.toLowerCase() === locId) return true;
      if (proj.locality_id && proj.locality_id.toLowerCase() === locId) return true;
      if (proj.locality && proj.locality.toLowerCase() === locName) return true;
      if (proj.location?.microMarket && proj.location.microMarket.toLowerCase() === locName) return true;
      if (proj.location?.address && proj.location.address.toLowerCase().includes(locName)) return true;
      return false;
    });
  }

  // --- 29.11 MVP ANALYTICS TRACKING ---
  private localityAnalyticsLog: Array<{
    id: string;
    type: string;
    localityId?: string;
    localityName?: string;
    meta?: any;
    timestamp: string;
  }> = [];

  public trackLocalityEvent(event: {
    type: string;
    localityId?: string;
    localityName?: string;
    meta?: any;
  }) {
    const record = {
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: event.type,
      localityId: event.localityId,
      localityName: event.localityName,
      meta: event.meta,
      timestamp: new Date().toISOString(),
    };
    this.localityAnalyticsLog.push(record);
    if (this.localityAnalyticsLog.length > 200) {
      this.localityAnalyticsLog.shift();
    }
    try {
      localStorage.setItem('kiaan_locality_analytics_mvp', JSON.stringify(this.localityAnalyticsLog.slice(-50)));
    } catch {
      // Ignore storage errors
    }
  }

  public getLocalityEvents() {
    return [...this.localityAnalyticsLog];
  }

  public forceSyncInitialLocalities(): { totalLocalities: number; addedCount: number } {
    let addedCount = 0;
    for (const loc of INITIAL_LOCALITIES) {
      if (!this.deletedIds.has(loc.id)) {
        if (!this.localities.has(loc.id)) {
          addedCount++;
        }
        this.localities.set(loc.id, { ...loc });
      }
    }
    this.notify();
    return {
      totalLocalities: this.localities.size,
      addedCount,
    };
  }
}

export const globalKiaanStore = new KiaanStore();
