/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Check,
  Plus,
  Trash2,
  Sparkles,
  Search,
  Tag,
  ListPlus,
  SlidersHorizontal,
  CheckCheck,
  X,
  Building2,
  Dumbbell,
  ShieldCheck,
  Trees,
  Briefcase,
  Heart,
  Zap,
  Film,
  Waves,
  Activity,
  Award,
  Flame,
  Sun,
  Coffee,
  Car,
  Wifi,
  Compass,
} from 'lucide-react';
import { Amenity } from '../types';
import { MASTER_AMENITIES } from '../data/seedData';

// Extended curated real-estate master amenities for comprehensive ticking
export const EXTENDED_MASTER_AMENITIES: Amenity[] = [
  ...MASTER_AMENITIES,
  { id: 'am_jacuzzi', name: 'Heated Rooftop Jacuzzi & Hydro-deck', category: 'LIFESTYLE', icon: 'Waves', featured: true },
  { id: 'am_sky_lounge', name: 'Panoramic Sky Lounge & Sunset Deck', category: 'LIFESTYLE', icon: 'Sparkles', featured: true },
  { id: 'am_private_elevator', name: 'Private Biometric Foyer & High-Speed Elevators', category: 'SECURITY', icon: 'ShieldCheck', featured: true },
  { id: 'am_yoga', name: 'Zen Meditation Deck & Open-Air Yoga Shala', category: 'FITNESS', icon: 'Activity' },
  { id: 'am_badminton', name: 'Indoor Air-Conditioned Badminton Court', category: 'FITNESS', icon: 'Dumbbell' },
  { id: 'am_tennis', name: 'Championship Floodlit Tennis Court', category: 'FITNESS', icon: 'Activity' },
  { id: 'am_jogging', name: '1.2km Acclimatized Synthetic Jogging Track', category: 'FITNESS', icon: 'Activity' },
  { id: 'am_kids_pool', name: 'Kids Heated Splash Pool & Aqua Park', category: 'COMMUNITY', icon: 'Waves' },
  { id: 'am_banquet', name: 'Grand Ballroom & Banquet Lawn for 300+ Guests', category: 'COMMUNITY', icon: 'Building2', featured: true },
  { id: 'am_bbq', name: 'Outdoor Cabana BBQ & Alfresco Dining Grill', category: 'LIFESTYLE', icon: 'Flame' },
  { id: 'am_cigar_lounge', name: 'Private Member Cigar & Single Malt Lounge', category: 'LIFESTYLE', icon: 'Coffee', featured: true },
  { id: 'am_wine_cellar', name: 'Temperature-Controlled Sommelier Wine Cellar', category: 'LIFESTYLE', icon: 'Sparkles' },
  { id: 'am_solar', name: 'Solar Rooftop Grid & Net-Zero Energy Harvesting', category: 'ENVIRONMENT', icon: 'Sun' },
  { id: 'am_rainwater', name: 'Rainwater Harvesting & Advanced STP Water Recycling', category: 'ENVIRONMENT', icon: 'Waves' },
  { id: 'am_dg_backup', name: '100% DG Power Backup for Common & Private Units', category: 'SECURITY', icon: 'Zap' },
  { id: 'am_cctv_ai', name: 'AI-Powered Perimeter Intrusion Detection & 24/7 CCTV', category: 'SECURITY', icon: 'ShieldCheck' },
  { id: 'am_podcast_studio', name: 'Acoustically Treated Podcast & Content Studio', category: 'BUSINESS', icon: 'Film' },
  { id: 'am_conference', name: 'Smart Video-Conferencing Boardrooms & Tech Pods', category: 'BUSINESS', icon: 'Briefcase' },
  { id: 'am_valet', name: 'Dedicated Valet Desk & Chauffeur Waiting Quarters', category: 'COMMUNITY', icon: 'Car' },
  { id: 'am_car_wash', name: 'Automated Eco-Friendly Underbody Car Spa & Wash', category: 'ENVIRONMENT', icon: 'Car' },
  { id: 'am_high_speed_wifi', name: 'Campus-Wide High-Speed Wi-Fi 6 Mesh Coverage', category: 'BUSINESS', icon: 'Wifi' },
  { id: 'am_senior_park', name: 'Senior Citizen Reflexology Pathway & Gazebo', category: 'COMMUNITY', icon: 'Heart' },
  { id: 'am_organic_garden', name: 'Hydroponic Organic Herb & Vegetable Garden', category: 'ENVIRONMENT', icon: 'Trees' },
];

export interface AmenitySelectorProps {
  selectedAmenities: Amenity[];
  onChange: (amenities: Amenity[]) => void;
  disabled?: boolean;
  theme?: 'dark' | 'light';
  title?: string;
}

export const AmenitySelector: React.FC<AmenitySelectorProps> = ({
  selectedAmenities,
  onChange,
  disabled = false,
  theme = 'dark',
  title = 'Amenities & Lifestyle Features',
}) => {
  const isDark = theme === 'dark';

  // Active view: 'TICK_PRESETS' or 'MANUAL_ENTRY' or 'ALL_SELECTED'
  const [activeTab, setActiveTab] = useState<'TICK' | 'MANUAL'>('TICK');

  // Filter and Search for Ticking
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Manual Custom Amenity Form State
  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState<Amenity['category']>('LIFESTYLE');
  const [manualDesc, setManualDesc] = useState('');
  const [manualFeatured, setManualFeatured] = useState(false);
  const [manualBulkText, setManualBulkText] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  // Categories list
  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'ALL', label: 'All Amenities', icon: SlidersHorizontal },
    { id: 'LIFESTYLE', label: 'Lifestyle & Luxury', icon: Sparkles },
    { id: 'FITNESS', label: 'Fitness & Sports', icon: Dumbbell },
    { id: 'SECURITY', label: 'Security & Automation', icon: ShieldCheck },
    { id: 'ENVIRONMENT', label: 'Environment & Greenery', icon: Trees },
    { id: 'COMMUNITY', label: 'Community & Clubhouse', icon: Building2 },
    { id: 'BUSINESS', label: 'Business & Coworking', icon: Briefcase },
  ];

  // Helper to test if amenity is selected
  const isAmenitySelected = (id: string) => {
    return selectedAmenities.some((a) => a.id === id || a.name.toLowerCase() === id.toLowerCase());
  };

  // Toggle single preset amenity by tick
  const handleTogglePresetAmenity = (preset: Amenity) => {
    if (disabled) return;
    if (isAmenitySelected(preset.id)) {
      onChange(selectedAmenities.filter((a) => a.id !== preset.id && a.name.toLowerCase() !== preset.name.toLowerCase()));
    } else {
      onChange([...selectedAmenities, preset]);
    }
  };

  // Select all visible presets
  const handleSelectAllVisible = () => {
    if (disabled) return;
    const currentIds = new Set(selectedAmenities.map((a) => a.id));
    const newToAdd = filteredPresets.filter((p) => !currentIds.has(p.id));
    onChange([...selectedAmenities, ...newToAdd]);
  };

  // Clear all amenities
  const handleClearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  // Select popular top 8 presets
  const handleSelectPopular = () => {
    if (disabled) return;
    const popular = EXTENDED_MASTER_AMENITIES.slice(0, 8);
    const existingIds = new Set(selectedAmenities.map((a) => a.id));
    const toAdd = popular.filter((p) => !existingIds.has(p.id));
    onChange([...selectedAmenities, ...toAdd]);
  };

  // Add single manual amenity
  const handleAddManualAmenity = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (disabled || !manualName.trim()) return;

    const trimmed = manualName.trim();
    // Check if already in selected
    if (selectedAmenities.some((a) => a.name.toLowerCase() === trimmed.toLowerCase())) {
      setManualName('');
      return;
    }

    const newAmenity: Amenity = {
      id: `custom_am_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      category: manualCategory,
      icon: getCategoryDefaultIcon(manualCategory),
      description: manualDesc.trim() || undefined,
      featured: manualFeatured,
    };

    onChange([...selectedAmenities, newAmenity]);
    setManualName('');
    setManualDesc('');
    setManualFeatured(false);
  };

  // Add multiple manual amenities from comma or newline separated text
  const handleAddBulkManual = () => {
    if (disabled || !manualBulkText.trim()) return;

    const rawNames = manualBulkText
      .split(/[\n,;]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 1);

    const existingNames = new Set(selectedAmenities.map((a) => a.name.toLowerCase()));
    const newAmenities: Amenity[] = [];

    rawNames.forEach((name, idx) => {
      if (!existingNames.has(name.toLowerCase())) {
        existingNames.add(name.toLowerCase());
        newAmenities.push({
          id: `custom_am_${Date.now()}_${idx}`,
          name: name,
          category: manualCategory,
          icon: getCategoryDefaultIcon(manualCategory),
          featured: false,
        });
      }
    });

    if (newAmenities.length > 0) {
      onChange([...selectedAmenities, ...newAmenities]);
    }
    setManualBulkText('');
    setShowBulkInput(false);
  };

  // Remove selected amenity
  const handleRemoveAmenity = (id: string) => {
    if (disabled) return;
    onChange(selectedAmenities.filter((a) => a.id !== id));
  };

  const getCategoryDefaultIcon = (cat: Amenity['category']) => {
    switch (cat) {
      case 'FITNESS':
        return 'Dumbbell';
      case 'SECURITY':
        return 'ShieldCheck';
      case 'ENVIRONMENT':
        return 'Trees';
      case 'COMMUNITY':
        return 'Building2';
      case 'BUSINESS':
        return 'Briefcase';
      default:
        return 'Sparkles';
    }
  };

  // Filtered preset list
  const filteredPresets = useMemo(() => {
    return EXTENDED_MASTER_AMENITIES.filter((amenity) => {
      if (selectedCategory !== 'ALL' && amenity.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = amenity.name.toLowerCase().includes(query);
        const matchesCat = amenity.category.toLowerCase().includes(query);
        if (!matchesName && !matchesCat) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div
      className={`space-y-4 p-4 sm:p-5 rounded-2xl border transition-all ${
        isDark ? 'bg-black/30 border-white/10' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-current/10">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-current">{title}</h4>
          </div>
          <p className="text-[11px] opacity-70 mt-0.5">
            Add amenities either by <strong>ticking standard verified presets</strong> or by <strong>typing custom features manually</strong>.
          </p>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div
          className={`flex items-center p-1 rounded-xl border self-start sm:self-auto ${
            isDark ? 'bg-[#0B101B] border-white/10' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('TICK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'TICK'
                ? 'bg-amber-500 text-black shadow-md'
                : isDark
                ? 'text-white/70 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Select by Tick</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MANUAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'MANUAL'
                ? 'bg-amber-500 text-black shadow-md'
                : isDark
                ? 'text-white/70 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Manually</span>
          </button>
        </div>
      </div>

      {/* Selected Amenities Pill Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold opacity-80 flex items-center gap-1.5">
            <span>Selected Amenities</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[11px] font-bold">
              {selectedAmenities.length}
            </span>
          </span>
          {selectedAmenities.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All ({selectedAmenities.length})</span>
            </button>
          )}
        </div>

        {selectedAmenities.length === 0 ? (
          <div
            className={`p-3 rounded-xl border border-dashed text-center text-xs opacity-60 ${
              isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
            }`}
          >
            No amenities selected yet. Tick options below or add custom features manually.
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 rounded-xl bg-current/5">
            {selectedAmenities.map((am) => (
              <span
                key={am.id}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  isDark
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}
              >
                <Check className="w-3 h-3 text-amber-500 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{am.name}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(am.id)}
                    className="p-0.5 rounded-full hover:bg-current/10 opacity-70 hover:opacity-100 cursor-pointer ml-0.5"
                    title={`Remove ${am.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SELECT BY TICK (PRESETS CHECKBOX GRID & CATEGORY TABS)             */}
      {/* ========================================================================= */}
      {activeTab === 'TICK' && (
        <div className="space-y-3 pt-2">
          {/* Search Bar & Quick Action Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            {/* Search Input */}
            <div
              className={`relative flex items-center flex-1 rounded-xl border px-3 py-1.5 text-xs ${
                isDark ? 'bg-[#0B101B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 opacity-50 mr-2 flex-shrink-0" />
              <input
                type="text"
                disabled={disabled}
                placeholder="Search amenities (e.g., Pool, Gym, EV, Cinema, Spa, Forest)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent focus:outline-none w-full text-xs placeholder:text-current placeholder:opacity-40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="opacity-60 hover:opacity-100 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Bulk Select Presets */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                disabled={disabled}
                onClick={handleSelectPopular}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  isDark
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                    : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
                title="Select Top 8 Popular Luxury Presets"
              >
                <Sparkles className="w-3 h-3" />
                <span>+ Top 8 Presets</span>
              </button>

              <button
                type="button"
                disabled={disabled}
                onClick={handleSelectAllVisible}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <CheckCheck className="w-3 h-3" />
                <span>Tick All ({filteredPresets.length})</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-black shadow-sm'
                      : isDark
                      ? 'bg-white/5 text-white/70 hover:text-white border border-white/5'
                      : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Ticking Grid (Checkbox Tiles) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto p-1">
            {filteredPresets.map((preset) => {
              const checked = isAmenitySelected(preset.id);
              return (
                <button
                  key={preset.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleTogglePresetAmenity(preset)}
                  className={`p-2.5 rounded-xl border text-left flex items-start justify-between text-xs transition-all cursor-pointer group ${
                    checked
                      ? isDark
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm'
                        : 'bg-amber-100/70 border-amber-400 text-slate-900 shadow-sm'
                      : isDark
                      ? 'bg-[#0B101B]/80 border-white/10 text-white/70 hover:border-white/20 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                  } disabled:opacity-40`}
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="font-semibold leading-tight group-hover:text-amber-400 transition-colors">
                      {preset.name}
                    </div>
                    <span className="text-[10px] font-mono opacity-50 block uppercase">
                      {preset.category}
                    </span>
                  </div>

                  {/* Tick Box Indicator */}
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                      checked
                        ? 'bg-amber-500 border-amber-500 text-black'
                        : isDark
                        ? 'border-white/20 bg-white/5'
                        : 'border-slate-300 bg-slate-100'
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: ADD AMENITIES MANUALLY (CUSTOM CREATION & BULK INPUT)               */}
      {/* ========================================================================= */}
      {activeTab === 'MANUAL' && (
        <div className="space-y-4 pt-2">
          {/* Single Custom Amenity Form */}
          <div
            className={`p-4 rounded-xl border space-y-3 ${
              isDark ? 'bg-[#0B101B]/90 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Create Custom Amenity</span>
              </span>
              <button
                type="button"
                onClick={() => setShowBulkInput(!showBulkInput)}
                className="text-[11px] text-amber-400 hover:underline cursor-pointer flex items-center gap-1 font-bold"
              >
                <ListPlus className="w-3 h-3" />
                <span>{showBulkInput ? 'Switch to Single Mode' : 'Bulk Paste Comma-Separated'}</span>
              </button>
            </div>

            {!showBulkInput ? (
              <form onSubmit={handleAddManualAmenity} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold opacity-75">Amenity Title / Feature Name *</label>
                    <input
                      type="text"
                      disabled={disabled}
                      placeholder="e.g. Private Plunge Pool on Viewing Deck, Italian Cigar Lounge..."
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border bg-current/5 border-current/15 text-xs focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold opacity-75">Category</label>
                    <select
                      disabled={disabled}
                      value={manualCategory}
                      onChange={(e) => setManualCategory(e.target.value as Amenity['category'])}
                      className="w-full px-3 py-2 rounded-xl border bg-current/5 border-current/15 text-xs focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    >
                      <option value="LIFESTYLE" className="bg-slate-900 text-white">Lifestyle & Luxury</option>
                      <option value="FITNESS" className="bg-slate-900 text-white">Fitness & Sports</option>
                      <option value="SECURITY" className="bg-slate-900 text-white">Security & Automation</option>
                      <option value="ENVIRONMENT" className="bg-slate-900 text-white">Environment & Greenery</option>
                      <option value="COMMUNITY" className="bg-slate-900 text-white">Community & Clubhouse</option>
                      <option value="BUSINESS" className="bg-slate-900 text-white">Business & Coworking</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold opacity-75">Highlight / Specification (Optional)</label>
                    <input
                      type="text"
                      disabled={disabled}
                      placeholder="e.g. 18th floor terrace with panoramic valley view"
                      value={manualDesc}
                      onChange={(e) => setManualDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border bg-current/5 border-current/15 text-xs focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0">
                    <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer select-none">
                      <input
                        type="checkbox"
                        disabled={disabled}
                        checked={manualFeatured}
                        onChange={(e) => setManualFeatured(e.target.checked)}
                        className="rounded border-current/30 text-amber-500 focus:ring-0"
                      />
                      <span className="text-[11px] opacity-80">Mark Featured</span>
                    </label>

                    <button
                      type="button"
                      disabled={disabled || !manualName.trim()}
                      onClick={() => handleAddManualAmenity()}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Feature</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Bulk Paste / Comma Separated Mode */
              <div className="space-y-3 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold opacity-75">
                    Paste or Type Multiple Amenities (Separated by commas or new lines)
                  </label>
                  <textarea
                    rows={3}
                    disabled={disabled}
                    placeholder="Private Elevator, Dual Heated Jacuzzi, Italian Marble Foyer, High-Speed EV Bay, Dolby Atmos Screening Room..."
                    value={manualBulkText}
                    onChange={(e) => setManualBulkText(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border bg-current/5 border-current/15 text-xs focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold opacity-75">Assign Category:</label>
                    <select
                      disabled={disabled}
                      value={manualCategory}
                      onChange={(e) => setManualCategory(e.target.value as Amenity['category'])}
                      className="px-2.5 py-1 rounded-lg border bg-current/5 border-current/15 text-[11px] focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    >
                      <option value="LIFESTYLE" className="bg-slate-900 text-white">Lifestyle</option>
                      <option value="FITNESS" className="bg-slate-900 text-white">Fitness</option>
                      <option value="SECURITY" className="bg-slate-900 text-white">Security</option>
                      <option value="ENVIRONMENT" className="bg-slate-900 text-white">Environment</option>
                      <option value="COMMUNITY" className="bg-slate-900 text-white">Community</option>
                      <option value="BUSINESS" className="bg-slate-900 text-white">Business</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    disabled={disabled || !manualBulkText.trim()}
                    onClick={handleAddBulkManual}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-sm"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Add All Manual Amenities</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
