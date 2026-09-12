/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  Search,
  Sparkles,
  MapPin,
  Compass,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { Locality, LocalityCategory, LocalityType } from '../../types';
import { globalKiaanStore } from '../../services/store';
import { localityIntelligenceService } from '../../services/localityIntelligenceService';

interface AdminLocalitiesPanelProps {
  localities: Locality[];
  onClose: () => void;
  onLocalityUpdated?: () => void;
}

export const AdminLocalitiesPanel: React.FC<AdminLocalitiesPanelProps> = ({
  localities,
  onClose,
  onLocalityUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Locality>>({
    name: '',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    district: 'Pune District',
    pincode: '411057',
    localityType: 'RESIDENTIAL',
    developmentStatus: 'ESTABLISHED',
    shortDescription: '',
    fullDescription: '',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
    categories: ['POPULAR', 'IT_HUB'],
    nearbyAreas: ['Wakad', 'Baner'],
    isVerified: true,
    isFeatured: true,
    coordinates: { lat: 18.598, lng: 73.765 },
    priceIntelligence: {
      averagePricePerSqFt: 8200,
      priceRangeMin: 6000000,
      priceRangeMax: 25000000,
      yoyGrowthPercent: 9.8,
      rentalYieldPercent: 4.2,
      resaleVsNewComparison: {
        resaleAvgSqFt: 7400,
        newProjectAvgSqFt: 8600,
        spreadPercentage: 14,
        insights: 'Healthy spread favoring brand new gated communities.',
      },
    },
    lifestyleRating: {
      connectivity: 9.2,
      education: 8.8,
      healthcare: 8.6,
      nightlife: 8.0,
      safety: 9.0,
      overallScore: 8.9,
    },
    connectivity: {
      highways: [{ name: 'Mumbai-Pune Expressway', distanceKm: 2.1, type: 'EXPRESSWAY' }],
      metro: [{ name: 'Pune Metro Line 3', distanceKm: 1.2, status: 'UNDER_CONSTRUCTION' }],
      railway: [{ name: 'Pune Junction', distanceKm: 16.5 }],
      airport: [{ name: 'Pune International Airport', distanceKm: 22.0 }],
      busConnectivity: 'PMPML bus feeder network connecting directly to Shivaji Nagar and Hinjewadi.',
      employmentHubs: [{ name: 'Hinjewadi IT Park', distanceKm: 3.5, commuteMinutes: 12 }],
    },
    socialInfrastructure: {
      schools: [{ name: 'EuroSchool', distanceKm: 1.8, board: 'CBSE' }],
      hospitals: [{ name: 'Jupiter Hospital', distanceKm: 3.2, bedCount: 350 }],
      malls: [{ name: 'Phoenix Mall of the Millennium', distanceKm: 2.5 }],
      restaurants: [{ name: 'Balewadi High Street Dining', distanceKm: 3.0 }],
      parks: [{ name: 'Sayaji Recreational Park', distanceKm: 1.5 }],
    },
    whyLiveHere: [
      { title: 'Prime Tech Access', description: 'Immediate connectivity to Hinjewadi Phase 1 & 2' },
      { title: 'Comprehensive Civic Infra', description: 'Established schools, multi-specialty hospitals, and premium retail hubs' },
    ],
    whoIsThisFor: [
      { persona: 'IT Professionals', description: 'Immediate access to Hinjewadi Tech Park', suitabilityPercent: 95 },
      { persona: 'Modern Families', description: 'Proximity to top-rated schools and hospitals', suitabilityPercent: 92 },
    ],
    pros: ['Proximity to major arterial expressways', 'Robust social and retail infrastructure'],
    considerations: ['Peak-hour traffic along primary highway crossings'],
    investmentOutlook: {
      appreciationRateYoY: 9.8,
      rentalYieldPercent: 4.2,
      futureDrivers: ['Metro Line 3 operationalization', 'Ring Road connectivity'],
    },
    seo: {
      metaTitle: 'Wakad, Pune Real Estate & Property Guide',
      metaDescription: 'Discover verified properties and projects in Wakad.',
      keywords: ['Wakad', 'Pune real estate', 'properties in Wakad'],
    },
    faqs: [
      {
        question: 'Is this locality suitable for long-term investment?',
        answer: 'Yes, steady corporate employment and upcoming metro connectivity ensure strong capital growth and rental demand.',
      },
    ],
  });

  const [potentialDuplicates, setPotentialDuplicates] = useState<Locality[]>([]);

  const handleOpenAdd = () => {
    setSelectedLocality(null);
    setFormData({
      name: '',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      district: 'Pune District',
      pincode: '411057',
      localityType: 'RESIDENTIAL',
      developmentStatus: 'ESTABLISHED',
      shortDescription: '',
      fullDescription: '',
      coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      gallery: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
      categories: ['POPULAR'],
      nearbyAreas: ['Baner', 'Wakad'],
      isVerified: true,
      isFeatured: false,
      coordinates: { lat: 18.59, lng: 73.78 },
      priceIntelligence: {
        averagePricePerSqFt: 8500,
        priceRangeMin: 6500000,
        priceRangeMax: 25000000,
        yoyGrowthPercent: 9.0,
        rentalYieldPercent: 4.0,
        resaleVsNewComparison: {
          resaleAvgSqFt: 7800,
          newProjectAvgSqFt: 8900,
          spreadPercentage: 12,
          insights: 'Consistent demand across both resale and new construction.',
        },
      },
      lifestyleRating: {
        connectivity: 9.0,
        education: 8.5,
        healthcare: 8.5,
        nightlife: 7.5,
        safety: 9.0,
        overallScore: 8.6,
      },
      connectivity: {
        highways: [{ name: 'NH-48', distanceKm: 1.5, type: 'NATIONAL_HIGHWAY' }],
        metro: [{ name: 'Metro Line 3', distanceKm: 2.0, status: 'UNDER_CONSTRUCTION' }],
        railway: [{ name: 'Pune Junction', distanceKm: 16.0 }],
        airport: [{ name: 'Pune Airport', distanceKm: 22.0 }],
        busConnectivity: 'Frequent public transit connectivity.',
        employmentHubs: [{ name: 'Hinjewadi Tech Park', distanceKm: 4.0, commuteMinutes: 15 }],
      },
      socialInfrastructure: {
        schools: [{ name: 'VIBGYOR High', distanceKm: 2.0, board: 'ICSE' }],
        hospitals: [{ name: 'Surya Mother & Child Hospital', distanceKm: 2.5, bedCount: 150 }],
        malls: [{ name: 'Westend Mall', distanceKm: 4.5 }],
        restaurants: [{ name: 'Local Dining Arcade', distanceKm: 1.2 }],
        parks: [{ name: 'Community Garden', distanceKm: 1.0 }],
      },
      whyLiveHere: [
        { title: 'Transit Accessibility', description: 'Excellent highway and upcoming metro connectivity' },
      ],
      whoIsThisFor: [
        { persona: 'Working Professionals', description: 'Rapid office commute and high rental liquidity', suitabilityPercent: 90 },
      ],
      pros: ['Rapid infrastructure modernization', 'Zero commute to corporate campuses'],
      considerations: ['Ongoing road expansion work during peak commute hours'],
      investmentOutlook: {
        appreciationRateYoY: 9.0,
        rentalYieldPercent: 4.0,
        futureDrivers: ['Metro corridor commissioning'],
      },
      seo: {
        metaTitle: 'Locality Real Estate Guide',
        metaDescription: 'Comprehensive guide to real estate opportunities.',
        keywords: ['real estate', 'projects'],
      },
      faqs: [
        {
          question: 'What are the expected rental yields?',
          answer: 'Gross rental yields typically range between 3.8% and 4.4% per annum.',
        },
      ],
    });
    setPotentialDuplicates([]);
    setIsEditing(true);
  };

  const handleOpenEdit = (loc: Locality) => {
    setSelectedLocality(loc);
    setFormData({ ...loc });
    setPotentialDuplicates([]);
    setIsEditing(true);
  };

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name });
    if (name.trim().length > 2) {
      const dupes = localityIntelligenceService.findPotentialDuplicates(name, localities);
      setPotentialDuplicates(dupes.filter((d) => d.id !== selectedLocality?.id));
    } else {
      setPotentialDuplicates([]);
    }
  };

  const handleSave = () => {
    if (!formData.name?.trim()) return;

    const slug =
      selectedLocality?.slug ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const id = selectedLocality?.id || `loc_${Date.now()}`;

    // Duplicate check
    const isDupe = globalKiaanStore.checkDuplicateLocality(formData.name.trim(), formData.city || 'Pune', selectedLocality?.id);
    if (isDupe && !selectedLocality) {
      if (!window.confirm(`Warning: A locality named "${formData.name}" already exists in ${formData.city}. Do you still want to proceed?`)) {
        return;
      }
    }

    const completeLocality: Locality = {
      id,
      slug,
      name: formData.name.trim(),
      city: formData.city || 'Pune',
      state: formData.state || 'Maharashtra',
      country: formData.country || 'India',
      district: formData.district || 'Pune District',
      pincode: formData.pincode || '411057',
      status: (formData.status as 'DRAFT' | 'PUBLISHED' | 'HIDDEN') || 'PUBLISHED',
      cityId: formData.cityId || (formData.city || 'pune').toLowerCase().replace(/\s+/g, '-'),
      stateId: formData.stateId || (formData.state || 'maharashtra').toLowerCase().replace(/\s+/g, '-'),
      localityType: formData.localityType || 'RESIDENTIAL',
      developmentStatus: formData.developmentStatus || 'ESTABLISHED',
      shortDescription:
        formData.shortDescription ||
        `${formData.name} is a premier real-estate corridor in ${formData.city}.`,
      fullDescription:
        formData.fullDescription ||
        `${formData.name} is one of ${formData.city}'s fastest growing residential and commercial micro-markets, known for high capital appreciation and transit convenience.`,
      coverImage:
        formData.coverImage ||
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      gallery: formData.gallery || [formData.coverImage || ''],
      coordinates: formData.coordinates || { lat: 18.59, lng: 73.78 },
      categories: (formData.categories as LocalityCategory[]) || ['POPULAR'],
      nearbyAreas: formData.nearbyAreas || ['Baner', 'Wakad'],
      isVerified: formData.isVerified ?? true,
      isFeatured: formData.isFeatured ?? false,
      priceIntelligence: formData.priceIntelligence as any,
      lifestyleRating: formData.lifestyleRating as any,
      connectivity: formData.connectivity as any,
      socialInfrastructure: formData.socialInfrastructure as any,
      whyLiveHere: formData.whyLiveHere || [
        { title: 'Strategic Location', description: 'Immediate connectivity and rapid infrastructure.' },
      ],
      whoIsThisFor: formData.whoIsThisFor || [
        { persona: 'IT Executives', description: 'Zero commute to corporate tech campuses', suitabilityPercent: 94 },
      ],
      pros: formData.pros || ['Proximity to major arterial expressways', 'Robust social and retail infrastructure'],
      considerations: formData.considerations || ['Peak-hour traffic around intersections'],
      investmentOutlook: formData.investmentOutlook || {
        appreciationRateYoY: formData.priceIntelligence?.yoyGrowthPercent || 9.5,
        rentalYieldPercent: formData.priceIntelligence?.rentalYieldPercent || 4.2,
        futureDrivers: ['Metro line expansion', 'Commercial office space absorption'],
      },
      seo: formData.seo || {
        metaTitle: `${formData.name}, ${formData.city} - Real Estate, Projects & Resale`,
        metaDescription: formData.shortDescription || '',
        keywords: [formData.name || '', formData.city || ''],
      },
      faqs: formData.faqs || [
        {
          question: `Is ${formData.name} RERA-compliant for new projects?`,
          answer: `All registered residential and commercial towers in ${formData.name} are regulated under MahaRERA.`,
        },
      ],
      lastUpdated: new Date().toISOString(),
      createdAt: selectedLocality?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    globalKiaanStore.saveLocality(completeLocality);
    setIsEditing(false);
    if (onLocalityUpdated) onLocalityUpdated();
  };

  const handleStatusChange = (id: string, newStatus: 'DRAFT' | 'PUBLISHED' | 'HIDDEN') => {
    globalKiaanStore.updateLocalityStatus(id, newStatus);
    if (onLocalityUpdated) onLocalityUpdated();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the locality "${name}"?`)) {
      globalKiaanStore.deleteLocality(id);
      if (onLocalityUpdated) onLocalityUpdated();
    }
  };

  const handleToggleVerified = (id: string, current: boolean) => {
    globalKiaanStore.updateLocalityVerification(id, !current);
    if (onLocalityUpdated) onLocalityUpdated();
  };

  const handleToggleFeatured = (id: string) => {
    globalKiaanStore.toggleLocalityFeatured(id);
    if (onLocalityUpdated) onLocalityUpdated();
  };

  const handleSyncDefaults = () => {
    const res = globalKiaanStore.forceSyncInitialLocalities();
    alert(`Synced initial localities! Total: ${res.totalLocalities}, Added: ${res.addedCount}`);
    if (onLocalityUpdated) onLocalityUpdated();
  };

  const filtered = localities.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.pincode.includes(searchQuery) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-white my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Locality Intelligence Admin Console</h2>
              <p className="text-xs text-white/60">
                Create, verify, edit, and organize micro-markets and dynamic property aggregators
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncDefaults}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/70 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset or sync seed localities"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync Defaults</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isEditing ? (
            <div className="space-y-6">
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search locality by name, PIN, or city..."
                    className="w-full bg-slate-800/80 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  onClick={handleOpenAdd}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  + Add New Locality
                </button>
              </div>

              {/* Localities Table */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950/40">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900/80 border-b border-white/10 text-white/60 font-semibold uppercase">
                    <tr>
                      <th className="py-3.5 px-4">Locality</th>
                      <th className="py-3.5 px-4">City / PIN</th>
                      <th className="py-3.5 px-4">Avg Rate / Sq.Ft</th>
                      <th className="py-3.5 px-4">1-Yr YoY</th>
                      <th className="py-3.5 px-4">Yield</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {filtered.map((loc) => (
                      <tr key={loc.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-sans font-bold text-white flex items-center gap-3">
                          <img
                            src={loc.coverImage}
                            alt={loc.name}
                            className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0"
                          />
                          <div>
                            <div>{loc.name}</div>
                            <div className="text-[10px] text-white/50 font-mono font-normal">
                              /{loc.slug}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-sans text-white/70">
                          {loc.city} • {loc.pincode}
                        </td>
                        <td className="py-3 px-4 text-amber-400 font-bold">
                          ₹{loc.priceIntelligence.averagePricePerSqFt.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-emerald-400">
                          +{loc.priceIntelligence.yoyGrowthPercent}%
                        </td>
                        <td className="py-3 px-4 text-purple-400">
                          {loc.priceIntelligence.rentalYieldPercent}%
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1 font-sans">
                            <select
                              value={loc.status || 'PUBLISHED'}
                              onChange={(e) => handleStatusChange(loc.id, e.target.value as any)}
                              className={`text-[10px] font-bold rounded-md px-1.5 py-0.5 border cursor-pointer ${
                                (loc.status || 'PUBLISHED') === 'PUBLISHED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : (loc.status || 'PUBLISHED') === 'DRAFT'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-700/50 text-white/50 border-white/20'
                              }`}
                            >
                              <option value="PUBLISHED" className="bg-slate-900 text-white">PUBLISHED</option>
                              <option value="DRAFT" className="bg-slate-900 text-white">DRAFT</option>
                              <option value="HIDDEN" className="bg-slate-900 text-white">HIDDEN</option>
                            </select>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggleVerified(loc.id, loc.isVerified)}
                                className={`px-1.5 py-0.2 rounded text-[9px] font-semibold cursor-pointer ${
                                  loc.isVerified
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-white/10 text-white/40'
                                }`}
                              >
                                {loc.isVerified ? '✓ Verified' : 'Unverified'}
                              </button>
                              {loc.isFeatured && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-500/20 text-amber-300">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1 font-sans">
                            <button
                              onClick={() => handleOpenEdit(loc)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(loc.id, loc.name)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Editing / Creating Form */
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-400" />
                  {selectedLocality ? `Edit Locality: ${selectedLocality.name}` : 'Create New Locality'}
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white/80 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Duplicate Detection Alert */}
              {potentialDuplicates.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    Potential Duplicate Locality Detected
                  </div>
                  <p className="text-xs text-white/70">
                    The name you entered resembles existing localities in the database. Please avoid creating duplicate variations (e.g. "Wakad, Pune" when "Wakad" already exists):
                  </p>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {potentialDuplicates.map((d) => (
                      <span
                        key={d.id}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold"
                      >
                        {d.name} ({d.city} • PIN {d.pincode})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Locality Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Wakad, Baner, Kharadi"
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Pune"
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">PIN Code *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="e.g. 411057"
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Status & Hierarchy IDs (MVP Phase 1) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Publishing Status</label>
                  <select
                    value={formData.status || 'PUBLISHED'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live on Directory)</option>
                    <option value="DRAFT">DRAFT (Admin only)</option>
                    <option value="HIDDEN">HIDDEN (Archived / Unlisted)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">City ID (Normalized Key)</label>
                  <input
                    type="text"
                    value={formData.cityId || (formData.city || '').toLowerCase().replace(/\s+/g, '-')}
                    onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                    placeholder="e.g. pune"
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">State ID (Normalized Key)</label>
                  <input
                    type="text"
                    value={formData.stateId || (formData.state || 'maharashtra').toLowerCase().replace(/\s+/g, '-')}
                    onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
                    placeholder="e.g. maharashtra"
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Locality Type</label>
                  <select
                    value={formData.localityType}
                    onChange={(e) => setFormData({ ...formData, localityType: e.target.value as any })}
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="IT_HUB">IT / Tech Hub</option>
                    <option value="COMMERCIAL">Commercial Hub</option>
                    <option value="LUXURY">Luxury Micro-Market</option>
                    <option value="SUBURBAN">Suburban Growth Corridor</option>
                    <option value="INDUSTRIAL">Industrial Node</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Avg Price / Sq.Ft (₹)</label>
                  <input
                    type="number"
                    value={formData.priceIntelligence?.averagePricePerSqFt || 8500}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceIntelligence: {
                          ...formData.priceIntelligence!,
                          averagePricePerSqFt: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Annual YoY Appreciation (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.priceIntelligence?.yoyGrowthPercent || 9.5}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceIntelligence: {
                          ...formData.priceIntelligence!,
                          yoyGrowthPercent: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Short Description (1-2 sentences)</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="e.g. Pune's premier western residential corridor offering rapid Hinjewadi IT park commute."
                  className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Comprehensive Overview Narrative</label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Detailed multi-paragraph background, connectivity, and development overview..."
                  className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="accent-amber-500 rounded"
                  />
                  <span>Mark as Verified Locality (Shows Kiaan Trust Badge)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-amber-500 rounded"
                  />
                  <span>Featured on Homepage & Directory Carousel</span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white/80 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Save Locality
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLocalitiesPanel;
