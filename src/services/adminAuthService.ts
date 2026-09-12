/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole, UserSession } from '../types';

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  designation: string;
  department: string;
  avatarUrl?: string;
  isSuperAdmin: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'INVITED';
  lastLoginAt?: string;
  permissions: string[];
}

export const PROVISIONED_ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: 'adm_sales_superadmin_01',
    name: 'Kiaan Sales Leadership',
    email: 'sales@kiaanproperties.in',
    phone: '+91 98230 11000',
    role: 'SUPER_ADMIN',
    designation: 'Head of Sales & Portfolio Strategy (Super Admin)',
    department: 'Sales & Executive Leadership',
    isSuperAdmin: true,
    status: 'ACTIVE',
    lastLoginAt: new Date().toISOString(),
    permissions: [
      '*', // Full root access
      'cms.publish',
      'cms.delete',
      'cms.pricing_override',
      'rera.compliance_signoff',
      'contracts.execute',
      'crm.dispatch',
      'audit.read_all',
      'analytics.executive_view',
      'rbac.manage_users',
      'jobs.manage',
      'careers.create_post',
    ],
  },
  {
    id: 'adm_western_luxury_01',
    name: 'Western Luxury Estate Admin',
    email: 'westernluxuryestate@gmail.com',
    phone: '+91 98230 11000',
    role: 'SUPER_ADMIN',
    designation: 'Principal Luxury Real Estate Partner & Administrator',
    department: 'Executive Leadership & Acquisitions',
    isSuperAdmin: true,
    status: 'ACTIVE',
    lastLoginAt: new Date().toISOString(),
    permissions: [
      '*',
      'cms.publish',
      'cms.delete',
      'jobs.manage',
      'careers.create_post',
      'rera.compliance_signoff',
    ],
  },
  {
    id: 'adm_superadmin_corp_02',
    name: 'Vikram Singhania',
    email: 'superadmin@kiaanproperties.com',
    phone: '+91 99000 11223',
    role: 'SUPER_ADMIN',
    designation: 'Chief Technology & Governance Officer',
    department: 'Executive Board',
    isSuperAdmin: true,
    status: 'ACTIVE',
    lastLoginAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    permissions: ['*'],
  },
  {
    id: 'adm_compliance_03',
    name: 'Adv. Radhika Deshmukh',
    email: 'compliance@kiaanproperties.in',
    phone: '+91 98230 44556',
    role: 'COMPLIANCE_MANAGER',
    designation: 'Chief Legal Counsel & MahaRERA Lead',
    department: 'Legal & Regulatory Compliance',
    isSuperAdmin: false,
    status: 'ACTIVE',
    lastLoginAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    permissions: ['rera.compliance_signoff', 'contracts.review', 'audit.read_all'],
  },
  {
    id: 'adm_inventory_04',
    name: 'Rohan Varma',
    email: 'inventory@kiaanproperties.in',
    phone: '+91 98230 77889',
    role: 'PROPERTY_MANAGER',
    designation: 'Lead Inventory & Tower Operations Manager',
    department: 'Real Estate Asset Management',
    isSuperAdmin: false,
    status: 'ACTIVE',
    lastLoginAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    permissions: ['inventory.manage', 'towers.manage', 'pricing.view'],
  },
];

class AdminAuthService {
  private accounts: AdminAccount[] = [...PROVISIONED_ADMIN_ACCOUNTS];

  public getAccounts(): AdminAccount[] {
    return this.accounts;
  }

  public getAccountByEmail(email: string): AdminAccount | undefined {
    const cleanEmail = email.trim().toLowerCase();
    return this.accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);
  }

  public isAuthorizedAdminDomain(email: string): boolean {
    const clean = email.trim().toLowerCase();
    return (
      clean.endsWith('@kiaanproperties.in') ||
      clean.endsWith('@kiaanproperties.com') ||
      clean.endsWith('@admin') ||
      clean === 'sales@kiaanproperties.in' ||
      clean === 'westernluxuryestate@gmail.com'
    );
  }

  public createSuperAdminSession(email: string = 'sales@kiaanproperties.in'): UserSession {
    const found = this.getAccountByEmail(email);
    if (found) {
      found.lastLoginAt = new Date().toISOString();
      return {
        userId: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        role: found.role,
        token: `jwt_superadmin_sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        savedPropertyIds: [],
        savedUnitIds: [],
      };
    }

    // Default Super Admin fallback for sales@kiaanproperties.in
    return {
      userId: `adm-super-${Date.now()}`,
      name: 'Kiaan Sales Leadership (Super Admin)',
      email: 'sales@kiaanproperties.in',
      phone: '+91 98230 11000',
      role: 'SUPER_ADMIN',
      token: `jwt_superadmin_sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      savedPropertyIds: [],
      savedUnitIds: [],
    };
  }
}

export const adminAuthService = new AdminAuthService();
