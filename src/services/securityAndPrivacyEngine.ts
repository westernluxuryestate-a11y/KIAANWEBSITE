/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UserConsentPreferences,
  DataAccessExport,
  DataDeletionRequest,
  TokenizedPaymentRecord,
  PaymentGatewayProvider,
} from '../types';

const CONSENT_STORAGE_KEY = 'kiaan_user_consent_prefs_v1';
const TOKENIZED_PAYMENTS_KEY = 'kiaan_tokenized_payments_v1';
const RATE_LIMIT_STORAGE_KEY = 'kiaan_rate_limit_records_v1';

class SecurityAndPrivacyEngine {
  private consentPreferences: UserConsentPreferences;
  private paymentRecords: TokenizedPaymentRecord[] = [];
  private deletionRequests: DataDeletionRequest[] = [];
  private rateLimitMap: Map<string, { count: number; firstAttempt: number; lockedUntil?: number }> = new Map();

  constructor() {
    this.consentPreferences = this.loadConsentFromStorage();
    this.loadPaymentRecords();
    this.seedSamplePaymentsIfEmpty();
  }

  // ============================================================
  // ITEM 127: DPDPA 2023 CONSENT MANAGEMENT
  // ============================================================
  private loadConsentFromStorage(): UserConsentPreferences {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }

    return {
      marketingConsent: true,
      whatsAppConsent: true,
      emailConsent: true,
      smsTransactionalConsent: true,
      pushNotificationConsent: false,
      analyticsConsent: true,
      essentialCookiesRequired: true,
      lastUpdatedTimestamp: new Date().toISOString(),
      consentVersion: 'DPDPA_v2.1_2026',
    };
  }

  public getConsentPreferences(): UserConsentPreferences {
    return { ...this.consentPreferences };
  }

  public updateConsentPreferences(updates: Partial<UserConsentPreferences>): UserConsentPreferences {
    this.consentPreferences = {
      ...this.consentPreferences,
      ...updates,
      essentialCookiesRequired: true, // Always required
      lastUpdatedTimestamp: new Date().toISOString(),
      consentIpHash: 'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    };
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(this.consentPreferences));
    } catch {
      // fallback
    }
    return this.getConsentPreferences();
  }

  // ============================================================
  // ITEM 127: DATA ACCESS & RIGHT TO BE FORGOTTEN
  // ============================================================
  public generateDataAccessExport(userSession: any): DataAccessExport {
    return {
      exportId: `DPA_EXPORT_${Date.now()}`,
      userId: userSession?.userId || 'USER_CURRENT_SESSION',
      requestedAt: new Date().toISOString(),
      userProfile: {
        name: userSession?.userName || 'Verified Buyer',
        email: userSession?.userEmail || 'client@kiaanproperties.com',
        phone: '+91 98201 00000',
        role: userSession?.role || 'CLIENT',
        nriStatus: false,
      },
      consentLog: this.getConsentPreferences(),
      savedProperties: ['prop-1', 'prop-2', 'proj-1'],
      submittedOffers: [
        {
          offerId: 'OFFER_8819',
          assetTitle: 'Sky Manor Presidential Penthouse',
          amountINR: 57500000,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      scheduledVisits: [
        {
          visitId: 'VISIT_4401',
          projectTitle: 'The One Horizon',
          scheduledDate: '2026-09-04 11:30 AM',
        },
      ],
      dossierDownloads: [
        {
          documentTitle: 'MahaRERA Sanction Order & Approved Title Search',
          downloadedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
      ],
    };
  }

  public submitDataDeletionRequest(userEmail: string, userId: string): DataDeletionRequest {
    const req: DataDeletionRequest = {
      requestId: `DEL_REQ_${Date.now()}`,
      userId,
      userEmail,
      requestedAt: new Date().toISOString(),
      status: 'PROCESSING',
      statutoryRetentionPeriodNote:
        'Marketing profile, search history, and direct communication logs are queued for immediate purge. Note: Transaction token ledgers and MahaRERA reservation compliance audit logs are retained in encrypted cold storage for 7 years per statutory taxation and RERA regulations.',
    };
    this.deletionRequests.push(req);
    return req;
  }

  // ============================================================
  // ITEM 126: SECURITY, RATE LIMITING, BOT & OTP PROTECTION
  // ============================================================

  /**
   * Sanitizes input string to prevent XSS injection attacks.
   */
  public sanitizeInput(input: string): string {
    if (!input) return '';
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Rate limit check for OTP requests, login attempts, and bid creation.
   */
  public checkRateLimit(
    actionKey: string,
    maxAttempts = 5,
    windowMs = 60000,
    lockoutDurationMs = 900000
  ): { allowed: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
    const now = Date.now();
    const record = this.rateLimitMap.get(actionKey);

    if (record?.lockedUntil && now < record.lockedUntil) {
      const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
    }

    if (!record || now - record.firstAttempt > windowMs) {
      this.rateLimitMap.set(actionKey, { count: 1, firstAttempt: now });
      return { allowed: true, remainingAttempts: maxAttempts - 1 };
    }

    if (record.count >= maxAttempts) {
      record.lockedUntil = now + lockoutDurationMs;
      this.rateLimitMap.set(actionKey, record);
      return { allowed: false, remainingAttempts: 0, retryAfterSeconds: Math.ceil(lockoutDurationMs / 1000) };
    }

    record.count += 1;
    this.rateLimitMap.set(actionKey, record);
    return { allowed: true, remainingAttempts: maxAttempts - record.count };
  }

  /**
   * Validates honeypot field for bot detection.
   */
  public validateHoneypot(honeypotValue: string): boolean {
    // If hidden honeypot has any value, request was populated by a bot
    return honeypotValue.trim().length === 0;
  }

  // ============================================================
  // ITEM 128: PAYMENT SECURITY & TOKENIZED ESCROW LEDGER
  // (Never stores raw cards, CVVs, or banking passwords)
  // ============================================================
  private loadPaymentRecords() {
    try {
      const stored = localStorage.getItem(TOKENIZED_PAYMENTS_KEY);
      if (stored) {
        this.paymentRecords = JSON.parse(stored);
      }
    } catch {
      // fallback
    }
  }

  private savePaymentRecords() {
    try {
      localStorage.setItem(TOKENIZED_PAYMENTS_KEY, JSON.stringify(this.paymentRecords));
    } catch {
      // fallback
    }
  }

  private seedSamplePaymentsIfEmpty() {
    if (this.paymentRecords.length === 0) {
      this.paymentRecords = [
        {
          transactionId: 'TXN_ESCROW_8920194',
          tokenReference: 'tok_rzp_escrow_88192_masked',
          status: 'ESCROW_HELD',
          amountINR: 500000,
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          providerReference: 'rzp_order_KJ981293849',
          gatewayProvider: 'RAZORPAY_ESCROW',
          maskedPaymentMethod: 'UPI •••• 8291 (HDFC Bank)',
          purpose: 'TOKEN_RESERVATION',
          assetId: 'proj-1',
          assetTitle: 'The One Horizon — Unit 1802',
          buyerConsentTimestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          escrowTrustAccountRef: 'ICICI-ESCROW-TRUST-00921-RERA',
          taxInvoiceHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        },
      ];
      this.savePaymentRecords();
    }
  }

  public recordTokenizedPayment(payment: Omit<TokenizedPaymentRecord, 'transactionId' | 'timestamp' | 'taxInvoiceHash'>): TokenizedPaymentRecord {
    const timestamp = new Date().toISOString();
    const transactionId = `TXN_ESCROW_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const taxInvoiceHash = `SHA256:${Math.random().toString(36).substring(2)}${Date.now()}`;

    const fullRecord: TokenizedPaymentRecord = {
      ...payment,
      transactionId,
      timestamp,
      taxInvoiceHash,
    };

    this.paymentRecords.unshift(fullRecord);
    this.savePaymentRecords();
    return fullRecord;
  }

  public getTokenizedPayments(): TokenizedPaymentRecord[] {
    return [...this.paymentRecords];
  }
}

export const securityAndPrivacyEngine = new SecurityAndPrivacyEngine();
