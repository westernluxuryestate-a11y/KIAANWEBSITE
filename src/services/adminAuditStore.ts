/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdminAuditActionType, AdminAuditLogEntry, UserRole } from '../types';

const AUDIT_STORAGE_KEY = 'kiaan_admin_audit_log_records_v1';

class AdminAuditStore {
  private auditLogs: AdminAuditLogEntry[] = [];
  private listeners: ((logs: AdminAuditLogEntry[]) => void)[] = [];

  constructor() {
    this.loadFromStorage();
    this.seedSampleAuditLogsIfEmpty();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (stored) {
        this.auditLogs = JSON.parse(stored);
      }
    } catch {
      // fallback
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.auditLogs));
    } catch {
      // fallback
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((cb) => cb([...this.auditLogs]));
  }

  public subscribe(callback: (logs: AdminAuditLogEntry[]) => void) {
    this.listeners.push(callback);
    callback([...this.auditLogs]);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private seedSampleAuditLogsIfEmpty() {
    if (this.auditLogs.length === 0) {
      this.auditLogs = [
        {
          id: 'AUDIT_LOG_9001',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          action: 'PRICE_CHANGE',
          actor: {
            id: 'ADM_001',
            name: 'Rajesh Shah',
            email: 'rajesh.shah@kiaanproperties.com',
            role: 'SUPER_ADMIN',
          },
          entity: {
            type: 'PROJECT',
            id: 'proj-1',
            name: 'The One Horizon — Tower Aurora',
          },
          beforeState: { baseRatePerSqFtINR: 12500, headlinePriceRange: '₹2.8 Cr - ₹4.5 Cr' },
          afterState: { baseRatePerSqFtINR: 13200, headlinePriceRange: '₹3.0 Cr - ₹4.8 Cr' },
          reason: 'Quarterly price index calibration following MahaRERA structural milestone achievement (Phase 2 casting complete).',
          ipHash: 'SHA256:4a8b29f0...e91a',
          severity: 'CRITICAL',
        },
        {
          id: 'AUDIT_LOG_9002',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          action: 'RERA_CHANGE',
          actor: {
            id: 'ADM_002',
            name: 'Pooja Iyer',
            email: 'pooja.i@kiaanproperties.com',
            role: 'COMPLIANCE_MANAGER',
          },
          entity: {
            type: 'RERA_RECORD',
            id: 'RERA_P52100028492',
            name: 'The One Horizon (P52100028492)',
          },
          beforeState: { verificationStatus: 'PENDING_AUDIT', validUntil: '2027-06-30' },
          afterState: { verificationStatus: 'VERIFIED', validUntil: '2027-12-31' },
          reason: 'Audited Advocate 30-Year Title Clear Certificate & MahaRERA Quarterly Progress Report Q2.',
          ipHash: 'SHA256:7c9e11a2...f33b',
          severity: 'INFO',
        },
        {
          id: 'AUDIT_LOG_9003',
          timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
          action: 'INVENTORY_CHANGE',
          actor: {
            id: 'ADM_001',
            name: 'Rajesh Shah',
            email: 'rajesh.shah@kiaanproperties.com',
            role: 'SUPER_ADMIN',
          },
          entity: {
            type: 'UNIT',
            id: 'unit-1802',
            name: 'Unit 1802 (4 BHK Sky Villa)',
          },
          beforeState: { status: 'AVAILABLE', holdExpiryTimestamp: null },
          afterState: { status: 'HOLD', holdExpiryTimestamp: new Date(Date.now() + 900000).toISOString() },
          reason: '15-Minute Token Hold Lock placed by verified HNI buyer via Razorpay escrow pre-authorization.',
          ipHash: 'SHA256:11bb89c1...a02f',
          severity: 'WARNING',
        },
        {
          id: 'AUDIT_LOG_9004',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          action: 'LOGIN',
          actor: {
            id: 'ADM_001',
            name: 'Rajesh Shah',
            email: 'rajesh.shah@kiaanproperties.com',
            role: 'SUPER_ADMIN',
          },
          entity: {
            type: 'USER',
            id: 'ADM_001',
            name: 'Admin Session Authentication',
          },
          beforeState: { sessionState: 'OFFLINE' },
          afterState: { sessionState: 'AUTHENTICATED_MFA_ACTIVE' },
          reason: 'Admin portal login with TOTP MFA hardware token verification.',
          ipHash: 'SHA256:4a8b29f0...e91a',
          severity: 'INFO',
        },
      ];
      this.saveToStorage();
    }
  }

  public recordAuditLog(log: Omit<AdminAuditLogEntry, 'id' | 'timestamp'>): AdminAuditLogEntry {
    const entry: AdminAuditLogEntry = {
      ...log,
      id: `AUDIT_LOG_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    this.saveToStorage();
    return entry;
  }

  public getLogs(): AdminAuditLogEntry[] {
    return [...this.auditLogs];
  }
}

export const adminAuditStore = new AdminAuditStore();
