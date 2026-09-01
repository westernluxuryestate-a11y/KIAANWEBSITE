/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Jurisdiction, RERARecord, RERAStatus, RERAVerificationStatus } from '../types';

export interface RERAGateValidationResult {
  canPublish: boolean;
  blockers: string[];
  warnings: string[];
  readinessScorePercent: number;
  jurisdiction: Jurisdiction;
  authorityName: string;
  checkedAt: string;
}

export interface JurisdictionRule {
  jurisdiction: Jurisdiction;
  authorityName: string;
  officialPortalUrl: string;
  regNumberPattern: RegExp;
  requiresQrCode: boolean;
  requiresOfficialLink: boolean;
}

export const JURISDICTION_RULES: Record<Jurisdiction, JurisdictionRule> = {
  MAHARERA: {
    jurisdiction: 'MAHARERA',
    authorityName: 'Maharashtra Real Estate Regulatory Authority (MahaRERA)',
    officialPortalUrl: 'https://maharera.mahaonline.gov.in',
    regNumberPattern: /^P[0-9]{11}$|^P5[0-9]{10}$/,
    requiresQrCode: true,
    requiresOfficialLink: true,
  },
  KARNATAKA_RERA: {
    jurisdiction: 'KARNATAKA_RERA',
    authorityName: 'Karnataka Real Estate Regulatory Authority (K-RERA)',
    officialPortalUrl: 'https://rera.karnataka.gov.in',
    regNumberPattern: /^PRM\/KA\/RERA\/[0-9/A-Z-]+$/,
    requiresQrCode: true,
    requiresOfficialLink: true,
  },
  GUJARAT_RERA: {
    jurisdiction: 'GUJARAT_RERA',
    authorityName: 'Gujarat Real Estate Regulatory Authority (GujRERA)',
    officialPortalUrl: 'https://gujrera.gujarat.gov.in',
    regNumberPattern: /^PR\/GJ\/[0-9/A-Z-]+$/,
    requiresQrCode: true,
    requiresOfficialLink: true,
  },
  UP_RERA: {
    jurisdiction: 'UP_RERA',
    authorityName: 'Uttar Pradesh Real Estate Regulatory Authority (UP RERA)',
    officialPortalUrl: 'https://www.up-rera.in',
    regNumberPattern: /^UPRERAPRJ[0-9]+$/,
    requiresQrCode: true,
    requiresOfficialLink: true,
  },
  OTHER: {
    jurisdiction: 'OTHER',
    authorityName: 'State Real Estate Regulatory Authority',
    officialPortalUrl: 'https://rera.gov.in',
    regNumberPattern: /^[A-Z0-9/-]{5,30}$/,
    requiresQrCode: false,
    requiresOfficialLink: true,
  },
};

/**
 * Validates a project's RERA compliance before publication.
 * Hard publishing gate: Fails if mandatory regulatory requirements are unmet.
 */
export function validateRERAPublishingGate(record?: Partial<RERARecord>): RERAGateValidationResult {
  const blockers: string[] = [];
  const warnings: string[] = [];
  let points = 0;
  const maxPoints = 5;

  if (!record) {
    return {
      canPublish: false,
      blockers: ['No RERA compliance record attached to project.'],
      warnings: [],
      readinessScorePercent: 0,
      jurisdiction: 'MAHARERA',
      authorityName: JURISDICTION_RULES.MAHARERA.authorityName,
      checkedAt: new Date().toISOString(),
    };
  }

  const jurisdiction = record.jurisdiction || 'MAHARERA';
  const rules = JURISDICTION_RULES[jurisdiction] || JURISDICTION_RULES.MAHARERA;

  // 1. Check Registration Number
  if (!record.registrationNumber || record.registrationNumber.trim().length === 0) {
    blockers.push(`Missing ${rules.authorityName} registration number.`);
  } else {
    points += 1;
    if (rules.regNumberPattern && !rules.regNumberPattern.test(record.registrationNumber.trim())) {
      warnings.push(`Registration number "${record.registrationNumber}" does not follow standard ${jurisdiction} pattern format.`);
    }
  }

  // 2. Check QR Code
  if (rules.requiresQrCode) {
    if (!record.qrCodeUrl || record.qrCodeUrl.trim().length === 0) {
      blockers.push(`Mandatory MahaRERA QR code is missing. MahaRERA mandates an optically legible QR code on all project marketing.`);
    } else {
      points += 1;
    }
  } else {
    points += 1;
  }

  // 3. Check Official Authority Link
  if (rules.requiresOfficialLink) {
    if (!record.officialAuthorityUrl || record.officialAuthorityUrl.trim().length === 0) {
      blockers.push(`Missing link to official regulatory authority portal (${rules.officialPortalUrl}).`);
    } else {
      points += 1;
    }
  } else {
    points += 1;
  }

  // 4. Verification Status
  if (record.verificationStatus === 'VERIFIED') {
    points += 1;
  } else if (record.verificationStatus === 'REJECTED') {
    blockers.push('RERA compliance status was marked as REJECTED during audit.');
  } else {
    warnings.push('Compliance record is currently in PENDING_AUDIT status.');
  }

  // 5. Active Status
  if (record.status === 'REGISTERED') {
    points += 1;
  } else if (record.status === 'BLOCKED' || record.status === 'REVOKED') {
    blockers.push(`Regulatory status is marked as ${record.status}. Publishing is forbidden.`);
  } else if (record.status === 'APPLIED') {
    warnings.push('RERA status is APPLIED (Pending final certificate allocation).');
  }

  const canPublish = blockers.length === 0 && (record.status === 'REGISTERED' || record.status === 'EXEMPT');
  const readinessScorePercent = Math.round((points / maxPoints) * 100);

  return {
    canPublish,
    blockers,
    warnings,
    readinessScorePercent,
    jurisdiction,
    authorityName: rules.authorityName,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Creates a compliant RERA record with initial audit stamp.
 */
export function createRERARecord(params: {
  jurisdiction: Jurisdiction;
  registrationNumber: string;
  officialAuthorityUrl?: string;
  qrCodeUrl?: string;
  verifiedBy: string;
}): RERARecord {
  const rules = JURISDICTION_RULES[params.jurisdiction] || JURISDICTION_RULES.MAHARERA;
  const now = new Date().toISOString();

  return {
    id: `rera_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    jurisdiction: params.jurisdiction,
    regulatoryAuthority: rules.authorityName,
    registrationNumber: params.registrationNumber.trim().toUpperCase(),
    officialAuthorityUrl: params.officialAuthorityUrl || rules.officialPortalUrl,
    qrCodeUrl: params.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${rules.officialPortalUrl}/project/${params.registrationNumber}`)}`,
    status: 'REGISTERED',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: now,
    verifiedBy: params.verifiedBy,
    auditHistory: [
      {
        timestamp: now,
        action: 'CREATED_AND_VERIFIED',
        actor: params.verifiedBy,
        details: `Initial regulatory compliance check completed for ${params.jurisdiction}`,
      },
    ],
  };
}
