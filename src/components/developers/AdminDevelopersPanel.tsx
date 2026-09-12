/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Building,
  ShieldCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  ExternalLink,
  Save,
  Link,
  AlertTriangle,
  BadgeAlert,
  Layers,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Developer, DeveloperType, DeveloperVerificationStatus, Project } from '../../types';
import { globalKiaanStore } from '../../services/store';

export const AdminDevelopersPanel: React.FC = () => {
  const [developers, setDevelopers] = useState<Developer[]>(() => globalKiaanStore.getDevelopers());
  const [projects, setProjects] = useState<Project[]>(() => globalKiaanStore.getProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [selectedVerificationFilter, setSelectedVerificationFilter] = useState('ALL');

  // Modal edit/add state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<Partial<Developer> | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to store updates
  useEffect(() => {
    const unsub = globalKiaanStore.subscribe(() => {
      setDevelopers(globalKiaanStore.getDevelopers());
      setProjects(globalKiaanStore.getProjects());
    });
    return unsub;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter developers
  const filteredDevelopers = developers.filter((dev) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = dev.name.toLowerCase().includes(q);
      const matchBrand = dev.brandName?.toLowerCase().includes(q);
      const matchCity = dev.headquarters.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCity) return false;
    }
    if (selectedTypeFilter !== 'ALL' && dev.developerType !== selectedTypeFilter) return false;
    if (selectedVerificationFilter !== 'ALL' && dev.verificationStatus !== selectedVerificationFilter) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingDeveloper({
      id: `dev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: '',
      name: '',
      legalName: '',
      brandName: '',
      logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=200&h=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
      shortDescription: '',
      fullDescription: '',
      headquarters: 'Pune, Maharashtra',
      establishedYear: 2015,
      yearsOfExperience: 11,
      website: 'https://example.com',
      phone: '+91 20 0000 0000',
      email: 'contact@example.com',
      socialLinks: {},
      developerType: 'LUXURY',
      citiesServed: ['Pune'],
      propertySegments: ['Ultra-Luxury Residences'],
      totalProjectsCount: 1,
      awards: [],
      reraInfo: {
        registrationNumber: 'P52100000000',
        jurisdiction: 'MAHARERA',
        authorityName: 'Maharashtra Real Estate Regulatory Authority',
        verified: true,
      },
      verificationStatus: 'VERIFIED',
      verifiedBadge: true,
      projectIds: [],
      metrics: {
        profileViews: 1,
        projectViews: 0,
        enquiriesCount: 0,
        phoneClicks: 0,
        whatsappClicks: 0,
        brochureDownloads: 0,
        shortlistCount: 0,
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dev: Developer) => {
    setEditingDeveloper(JSON.parse(JSON.stringify(dev)));
    setIsModalOpen(true);
  };

  const handleToggleVerification = (dev: Developer) => {
    const nextStatus: DeveloperVerificationStatus =
      dev.verificationStatus === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
    globalKiaanStore.updateDeveloperVerificationStatus(dev.id, nextStatus);
    showToast(`Updated ${dev.name} verification to: ${nextStatus}`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete developer "${name}"?`)) {
      globalKiaanStore.deleteDeveloper(id);
      showToast(`Deleted ${name} from registry.`);
    }
  };

  const handleSaveDeveloper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeveloper || !editingDeveloper.name) return;

    // Generate slug if empty
    const slug =
      editingDeveloper.slug?.trim() ||
      editingDeveloper.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const completeDev: Developer = {
      id: editingDeveloper.id || `dev_${Date.now()}`,
      slug,
      name: editingDeveloper.name,
      legalName: editingDeveloper.legalName || editingDeveloper.name,
      brandName: editingDeveloper.brandName || editingDeveloper.name,
      logo: editingDeveloper.logo || 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=200&h=200&q=80',
      coverImage: editingDeveloper.coverImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
      shortDescription: editingDeveloper.shortDescription || 'Leading real estate developer.',
      fullDescription: editingDeveloper.fullDescription || editingDeveloper.shortDescription || '',
      headquarters: editingDeveloper.headquarters || 'Pune, Maharashtra',
      establishedYear: Number(editingDeveloper.establishedYear) || 2010,
      yearsOfExperience: Number(editingDeveloper.yearsOfExperience) || 15,
      website: editingDeveloper.website || '',
      phone: editingDeveloper.phone || '',
      email: editingDeveloper.email || '',
      socialLinks: editingDeveloper.socialLinks || {},
      developerType: editingDeveloper.developerType || 'LUXURY',
      citiesServed: editingDeveloper.citiesServed || ['Pune'],
      propertySegments: editingDeveloper.propertySegments || ['Luxury Homes'],
      totalProjectsCount: Number(editingDeveloper.totalProjectsCount) || 1,
      awards: editingDeveloper.awards || [],
      reraInfo: editingDeveloper.reraInfo || {
        registrationNumber: 'P52100000000',
        jurisdiction: 'MAHARERA',
        authorityName: 'Maharashtra Real Estate Regulatory Authority',
        verified: true,
      },
      verificationStatus: editingDeveloper.verificationStatus || 'VERIFIED',
      verifiedBadge: editingDeveloper.verificationStatus === 'VERIFIED',
      projectIds: editingDeveloper.projectIds || [],
      metrics: editingDeveloper.metrics || {
        profileViews: 1,
        projectViews: 0,
        enquiriesCount: 0,
        phoneClicks: 0,
        whatsappClicks: 0,
        brochureDownloads: 0,
        shortlistCount: 0,
      },
      createdAt: editingDeveloper.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    globalKiaanStore.saveDeveloper(completeDev);
    setIsModalOpen(false);
    setEditingDeveloper(null);
    showToast(`Successfully published ${completeDev.name}`);
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-serif">Developers Management Console</h2>
          </div>
          <p className="text-xs opacity-60">
            Create, verify, and link real estate developers to existing projects and statutory filings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Developer</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Filter by name, brand, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="LUXURY">Luxury Specialists</option>
            <option value="TIER_1">Tier-1 Listed</option>
            <option value="CONGLOMERATE">Conglomerate</option>
            <option value="BOUTIQUE">Boutique</option>
          </select>
        </div>

        <div>
          <select
            value={selectedVerificationFilter}
            onChange={(e) => setSelectedVerificationFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white outline-none cursor-pointer"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="UNVERIFIED">Unverified Only</option>
            <option value="PENDING">Pending Only</option>
          </select>
        </div>
      </div>

      {/* Developers Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-white/70">
              <tr>
                <th className="p-4">Developer</th>
                <th className="p-4">Category & Location</th>
                <th className="p-4">Track Record</th>
                <th className="p-4">Linked Projects</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDevelopers.map((dev) => {
                const breakdown = globalKiaanStore.getProjectsForDeveloper(dev.id);

                return (
                  <tr key={dev.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={dev.logo}
                          alt={dev.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10 bg-white/5 shrink-0"
                        />
                        <div>
                          <div className="font-bold font-serif text-sm text-white flex items-center gap-1.5">
                            {dev.name}
                          </div>
                          <span className="text-[11px] opacity-60 font-mono">/{dev.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-amber-400">
                          {dev.developerType.replace('_', ' ')}
                        </span>
                        <div className="opacity-60 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{dev.headquarters}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <div className="font-semibold">{dev.yearsOfExperience} yrs experience</div>
                        <div className="opacity-60 text-[11px]">Est. {dev.establishedYear}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-bold text-amber-400">
                        <Layers className="w-3 h-3" />
                        <span>{breakdown.allProjects.length} Connected</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleVerification(dev)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                          dev.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/25'
                            : dev.verificationStatus === 'PENDING'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 hover:bg-amber-500/25'
                            : 'bg-red-500/15 text-red-400 border border-red-500/40 hover:bg-red-500/25'
                        }`}
                        title="Click to toggle status"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{dev.verificationStatus}</span>
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(dev)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                          title="Edit Developer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(dev.id, dev.name)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                          title="Delete Developer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ADD / EDIT DEVELOPER MODAL */}
      {/* ============================================================ */}
      {isModalOpen && editingDeveloper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#0E1526] border border-white/10 text-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Building className="w-6 h-6 text-amber-400" />
                <h3 className="text-xl font-bold font-serif">
                  {editingDeveloper.id && developers.some((d) => d.id === editingDeveloper.id)
                    ? `Edit Developer: ${editingDeveloper.name}`
                    : 'Add New Real Estate Developer'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDeveloper} className="space-y-5">
              {/* Section 1: Basic Details */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  1. Basic Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">Developer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Prestige Estates"
                      value={editingDeveloper.name || ''}
                      onChange={(e) =>
                        setEditingDeveloper({ ...editingDeveloper, name: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">Legal Corporate Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Prestige Estates Projects Limited"
                      value={editingDeveloper.legalName || ''}
                      onChange={(e) =>
                        setEditingDeveloper({ ...editingDeveloper, legalName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">URL Slug (SEO-friendly)</label>
                    <input
                      type="text"
                      placeholder="e.g. prestige-estates"
                      value={editingDeveloper.slug || ''}
                      onChange={(e) =>
                        setEditingDeveloper({ ...editingDeveloper, slug: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white font-mono outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">Developer Category</label>
                    <select
                      value={editingDeveloper.developerType || 'LUXURY'}
                      onChange={(e) =>
                        setEditingDeveloper({
                          ...editingDeveloper,
                          developerType: e.target.value as DeveloperType,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#141C30] border border-white/15 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="LUXURY">Ultra-Luxury Specialists</option>
                      <option value="TIER_1">Tier-1 Listed</option>
                      <option value="CONGLOMERATE">Conglomerate</option>
                      <option value="BOUTIQUE">Boutique & Heritage</option>
                      <option value="COMMERCIAL_SPECIALIST">Commercial & IT Parks</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">Logo Image URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editingDeveloper.logo || ''}
                      onChange={(e) =>
                        setEditingDeveloper({ ...editingDeveloper, logo: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">Cover Image URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editingDeveloper.coverImage || ''}
                      onChange={(e) =>
                        setEditingDeveloper({ ...editingDeveloper, coverImage: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">Short Description</label>
                  <input
                    type="text"
                    placeholder="Concise 1-2 sentence tagline summary..."
                    value={editingDeveloper.shortDescription || ''}
                    onChange={(e) =>
                      setEditingDeveloper({ ...editingDeveloper, shortDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">Full Editorial Narrative</label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive history, architectural philosophy, milestones..."
                    value={editingDeveloper.fullDescription || ''}
                    onChange={(e) =>
                      setEditingDeveloper({ ...editingDeveloper, fullDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>

              {/* Section 2: Operational & Contact Info */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  2. Operational Details & MahaRERA
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">Headquarters</label>
                    <input
                      type="text"
                      placeholder="e.g. Pune, Maharashtra"
                      value={editingDeveloper.headquarters || ''}
                      onChange={(e) =>
                        setEditingDeveloper({ ...editingDeveloper, headquarters: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">Established Year</label>
                    <input
                      type="number"
                      placeholder="1995"
                      value={editingDeveloper.establishedYear || 2000}
                      onChange={(e) =>
                        setEditingDeveloper({
                          ...editingDeveloper,
                          establishedYear: Number(e.target.value),
                          yearsOfExperience: new Date().getFullYear() - Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">Years Experience</label>
                    <input
                      type="number"
                      value={editingDeveloper.yearsOfExperience || 10}
                      onChange={(e) =>
                        setEditingDeveloper({
                          ...editingDeveloper,
                          yearsOfExperience: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">MahaRERA Registration</label>
                    <input
                      type="text"
                      placeholder="A031262603640"
                      value={editingDeveloper.reraInfo?.registrationNumber || ''}
                      onChange={(e) =>
                        setEditingDeveloper({
                          ...editingDeveloper,
                          reraInfo: {
                            ...editingDeveloper.reraInfo!,
                            registrationNumber: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 20..."
                      value={editingDeveloper.phone || ''}
                      onChange={(e) =>
                        setEditingDeveloper({ ...editingDeveloper, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">Website</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editingDeveloper.website || ''}
                      onChange={(e) =>
                        setEditingDeveloper({ ...editingDeveloper, website: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Project Association */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                    3. Associated Projects ({editingDeveloper.projectIds?.length || 0} selected)
                  </span>
                  <span className="text-[10px] opacity-60">
                    Check projects to link directly to this developer profile
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 rounded-2xl bg-black/40 border border-white/10">
                  {projects.map((proj) => {
                    const isChecked = editingDeveloper.projectIds?.includes(proj.id) || false;
                    return (
                      <label
                        key={proj.id}
                        className={`p-2 rounded-xl border flex items-center gap-2.5 text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                            : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = editingDeveloper.projectIds || [];
                            const updated = e.target.checked
                              ? [...current, proj.id]
                              : current.filter((id) => id !== proj.id);
                            setEditingDeveloper({ ...editingDeveloper, projectIds: updated });
                          }}
                          className="accent-amber-500"
                        />
                        <span className="font-semibold truncate">{proj.name}</span>
                        <span className="text-[10px] opacity-60 ml-auto shrink-0">
                          {proj.status}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Verification Status */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">Verification Status</label>
                  <select
                    value={editingDeveloper.verificationStatus || 'VERIFIED'}
                    onChange={(e) =>
                      setEditingDeveloper({
                        ...editingDeveloper,
                        verificationStatus: e.target.value as DeveloperVerificationStatus,
                        verifiedBadge: e.target.value === 'VERIFIED',
                      })
                    }
                    className="px-3 py-2 rounded-xl bg-[#141C30] border border-white/15 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="VERIFIED">VERIFIED (Show Verified Badge)</option>
                    <option value="PENDING">PENDING REVIEW</option>
                    <option value="UNVERIFIED">UNVERIFIED</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/15 text-xs font-semibold hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Developer</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
