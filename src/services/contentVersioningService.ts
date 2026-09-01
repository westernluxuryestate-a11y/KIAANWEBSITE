/**
 * Kiaan Properties - Content Versioning & Rollback Service (Item 150)
 * Tracks Version, Created, Updated, Published, Archived, and Rollback states.
 */

import { Project, Property } from '../types';

export interface ContentVersionRecord<T = any> {
  versionId: string;
  versionNumber: string; // e.g., "v1.0", "v1.1", "v2.0"
  entityType: 'PROJECT' | 'PROPERTY';
  entityId: string;
  authorName: string;
  authorRole: string;
  changeSummary: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'ROLLED_BACK';
  createdAt: string;
  publishedAt?: string;
  archivedAt?: string;
  snapshot: T;
}

export class ContentVersioningService {
  private static instance: ContentVersioningService;
  private storageKey = 'kiaan_content_versions_store';

  private constructor() {}

  public static getInstance(): ContentVersioningService {
    if (!ContentVersioningService.instance) {
      ContentVersioningService.instance = new ContentVersioningService();
    }
    return ContentVersioningService.instance;
  }

  private getAllVersions(): ContentVersionRecord[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to read content versions:', e);
    }
    return this.getInitialSeedVersions();
  }

  private saveAllVersions(records: ContentVersionRecord[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(records));
    } catch (e) {
      console.warn('Failed to save content versions:', e);
    }
  }

  /**
   * Get version history for a specific project or property
   */
  public getVersionHistory(entityId: string): ContentVersionRecord[] {
    const all = this.getAllVersions();
    return all.filter((v) => v.entityId === entityId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Create a new version snapshot
   */
  public createVersion<T extends { id: string }>(
    entityType: 'PROJECT' | 'PROPERTY',
    entity: T,
    author: { name: string; role: string },
    changeSummary: string,
    isPublish = true
  ): ContentVersionRecord<T> {
    const existing = this.getVersionHistory(entity.id);
    const versionMajor = Math.max(1, existing.length + 1);
    const versionNumber = `v${versionMajor}.0`;

    const newRecord: ContentVersionRecord<T> = {
      versionId: `ver_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      versionNumber,
      entityType,
      entityId: entity.id,
      authorName: author.name,
      authorRole: author.role,
      changeSummary,
      status: isPublish ? 'PUBLISHED' : 'DRAFT',
      createdAt: new Date().toISOString(),
      publishedAt: isPublish ? new Date().toISOString() : undefined,
      snapshot: JSON.parse(JSON.stringify(entity)),
    };

    const all = this.getAllVersions();
    this.saveAllVersions([newRecord, ...all]);
    return newRecord;
  }

  /**
   * Rollback to an earlier version snapshot (Item 150)
   */
  public rollbackToVersion<T extends { id: string }>(
    versionId: string,
    operator: { name: string; role: string }
  ): { success: boolean; rolledBackData?: T; message: string } {
    const all = this.getAllVersions();
    const target = all.find((v) => v.versionId === versionId);

    if (!target) {
      return { success: false, message: 'Target version not found in immutable history.' };
    }

    // Create a new version representing the rollback action
    const rollbackRecord: ContentVersionRecord<T> = {
      versionId: `ver_${Date.now()}_rollback`,
      versionNumber: `v${all.filter((v) => v.entityId === target.entityId).length + 1}.0-rollback`,
      entityType: target.entityType,
      entityId: target.entityId,
      authorName: operator.name,
      authorRole: operator.role,
      changeSummary: `Restored snapshot from ${target.versionNumber} (${target.changeSummary})`,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      snapshot: JSON.parse(JSON.stringify(target.snapshot)),
    };

    this.saveAllVersions([rollbackRecord, ...all]);

    return {
      success: true,
      rolledBackData: target.snapshot,
      message: `Successfully rolled back to version ${target.versionNumber}.`,
    };
  }

  /**
   * Initial seed versions for demonstration
   */
  private getInitialSeedVersions(): ContentVersionRecord[] {
    return [
      {
        versionId: 'ver_seed_001',
        versionNumber: 'v2.1',
        entityType: 'PROJECT',
        entityId: 'proj_one_vertica_wakad',
        authorName: 'Aarav Malhotra',
        authorRole: 'PRINCIPAL_ARCHITECT',
        changeSummary: 'Updated statutory MahaRERA completion milestones and added Sky Club layout blueprint.',
        status: 'PUBLISHED',
        createdAt: '2026-08-20T14:30:00Z',
        publishedAt: '2026-08-20T14:35:00Z',
        snapshot: { id: 'proj_one_vertica_wakad', name: 'Kiaan One Vertica' },
      },
      {
        versionId: 'ver_seed_002',
        versionNumber: 'v2.0',
        entityType: 'PROJECT',
        entityId: 'proj_one_vertica_wakad',
        authorName: 'Pooja Iyer',
        authorRole: 'COMPLIANCE_MANAGER',
        changeSummary: 'Quarterly price revision and escrow ledger verification update.',
        status: 'ARCHIVED',
        createdAt: '2026-06-12T09:15:00Z',
        publishedAt: '2026-06-12T09:20:00Z',
        archivedAt: '2026-08-20T14:30:00Z',
        snapshot: { id: 'proj_one_vertica_wakad', name: 'Kiaan One Vertica' },
      },
      {
        versionId: 'ver_seed_003',
        versionNumber: 'v1.0',
        entityType: 'PROJECT',
        entityId: 'proj_one_vertica_wakad',
        authorName: 'Sanjay Deshmukh',
        authorRole: 'MANAGING_DIRECTOR',
        changeSummary: 'Initial RERA launch and 3D digital twin release.',
        status: 'ARCHIVED',
        createdAt: '2026-01-10T10:00:00Z',
        publishedAt: '2026-01-10T10:10:00Z',
        archivedAt: '2026-06-12T09:15:00Z',
        snapshot: { id: 'proj_one_vertica_wakad', name: 'Kiaan One Vertica' },
      },
    ];
  }
}

export const contentVersioningService = ContentVersioningService.getInstance();
