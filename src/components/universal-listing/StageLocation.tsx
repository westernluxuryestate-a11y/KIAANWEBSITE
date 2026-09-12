/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  Plus,
  Trash2,
  Train,
  GraduationCap,
  HeartPulse,
  Briefcase,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { UniversalListingFormData } from '../../services/universalListingSchemaService';
import { CanonicalLocationSelector } from '../location/CanonicalLocationSelector';
import { LocationCreationModal } from '../location/LocationCreationModal';
import {
  locationIntelligencePlatform,
  LocationMasterRecord,
} from '../../services/locationIntelligencePlatform';

interface StageLocationProps {
  formData: UniversalListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<UniversalListingFormData>>;
}

const POPULAR_PUNE_MICROMARKETS = [
  'Kharadi',
  'Baner',
  'Hinjewadi',
  'Wakad',
  'Koregaon Park',
  'Kalyani Nagar',
  'Viman Nagar',
  'Balewadi',
  'Bavdhan',
  'Hadapsar',
  'Magarpatta City',
  'Kothrud',
  'Aundh',
  'Pimple Saudagar',
  'Ravet',
  'NIBM Road',
];

const PRESET_NEARBY_LANDMARKS = [
  { category: 'TRANSPORT' as const, placeName: 'Metro Station Phase 1', distanceKm: 1.2, travelTimeMins: 4, transportMode: 'TRANSIT' as const },
  { category: 'EMPLOYMENT' as const, placeName: 'World Trade Centre / EON IT Park', distanceKm: 1.8, travelTimeMins: 6, transportMode: 'DRIVE' as const },
  { category: 'HEALTHCARE' as const, placeName: 'Manipal / Columbia Asia Multi-Specialty Hospital', distanceKm: 2.2, travelTimeMins: 7, transportMode: 'DRIVE' as const },
  { category: 'EDUCATION' as const, placeName: 'The Orbis International School', distanceKm: 1.5, travelTimeMins: 5, transportMode: 'DRIVE' as const },
  { category: 'LIFESTYLE' as const, placeName: 'Phoenix Marketcity Mall', distanceKm: 3.5, travelTimeMins: 10, transportMode: 'DRIVE' as const },
];

export const StageLocation: React.FC<StageLocationProps> = ({
  formData,
  setFormData,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalInitialName, setCreateModalInitialName] = useState('');

  const [newPlace, setNewPlace] = useState<{
    category: 'TRANSPORT' | 'EDUCATION' | 'HEALTHCARE' | 'EMPLOYMENT' | 'LIFESTYLE';
    placeName: string;
    distanceKm: number;
    travelTimeMins: number;
    transportMode: 'DRIVE' | 'WALK' | 'TRANSIT';
  }>({
    category: 'TRANSPORT',
    placeName: '',
    distanceKm: 1.0,
    travelTimeMins: 5,
    transportMode: 'DRIVE',
  });

  const handleSelectCanonicalLocation = (loc: LocationMasterRecord) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        locationMasterId: loc.id,
        city: loc.district || 'Pune',
        district: loc.district || 'Pune',
        microMarket: loc.nameEn,
        locality: loc.nameEn,
        pinCode: loc.pincode,
        latitude: loc.latitude,
        longitude: loc.longitude,
        canonicalHierarchyPath: loc.hierarchyPath,
        canonicalCorporation: loc.municipalCorporation,
        canonicalWard: loc.ward,
      },
    }));
  };

  const handleQuickMicroMarketClick = (mm: string) => {
    const loc = locationIntelligencePlatform.resolveToCanonicalLocation(mm);
    if (loc) {
      handleSelectCanonicalLocation(loc);
    } else {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          microMarket: mm,
          locality: mm,
        },
      }));
    }
  };

  const handleAddCustomNearby = () => {
    if (!newPlace.placeName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        nearbyPlaces: [...prev.location.nearbyPlaces, { ...newPlace }],
      },
    }));
    setNewPlace({
      category: 'TRANSPORT',
      placeName: '',
      distanceKm: 1.0,
      travelTimeMins: 5,
      transportMode: 'DRIVE',
    });
  };

  const handleLoadPresetLandmarks = () => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        nearbyPlaces: [...PRESET_NEARBY_LANDMARKS],
      },
    }));
  };

  const handleRemoveNearby = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        nearbyPlaces: prev.location.nearbyPlaces.filter((_, i) => i !== index),
      },
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'TRANSPORT':
        return <Train className="w-3.5 h-3.5 text-blue-400" />;
      case 'EDUCATION':
        return <GraduationCap className="w-3.5 h-3.5 text-amber-400" />;
      case 'HEALTHCARE':
        return <HeartPulse className="w-3.5 h-3.5 text-rose-400" />;
      case 'EMPLOYMENT':
        return <Briefcase className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-6">
      <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            7. Structured Location, Micro-Market & Transit Intelligence
          </h3>
          <p className="text-xs opacity-70">
            Pinpoint exact geographic location, micro-market hierarchy, and commute distance matrix.
          </p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
          Level 1 Mandatory
        </span>
      </div>

      {/* STEP 1: MANDATORY CANONICAL LOCATION SELECTOR */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
        <CanonicalLocationSelector
          selectedLocationId={formData.location.locationMasterId}
          onSelectLocation={handleSelectCanonicalLocation}
          onOpenCreateLocationModal={(initialName) => {
            setCreateModalInitialName(initialName || '');
            setIsCreateModalOpen(true);
          }}
          label="Step 1: Canonical Location Master Selection (Mandatory SSOT)"
          helperText="Select an approved locality from the Location Master. Free-text entries are restricted to enforce spatial data integrity."
        />

        {/* Quick Micro-Market Resolvers */}
        <div className="space-y-1.5 pt-2 border-t border-amber-500/20">
          <span className="text-[11px] text-white/60">Quick-Resolve Popular Pune Localities:</span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_PUNE_MICROMARKETS.map((mm) => {
              const isSelected =
                formData.location.microMarket?.toLowerCase() === mm.toLowerCase() ||
                formData.location.locationMasterId?.toLowerCase().includes(mm.toLowerCase());

              return (
                <button
                  key={mm}
                  type="button"
                  onClick={() => handleQuickMicroMarketClick(mm)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-black font-bold shadow-sm'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {mm}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Locality and Society / Building specific details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/90 block">
            Sub-Locality / Sector / Pocket
          </label>
          <input
            type="text"
            placeholder="e.g. Near World Trade Centre / EON Free Zone"
            value={formData.location.subLocality || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, subLocality: e.target.value },
              }))
            }
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/90 block">
            Parent Administrative City
          </label>
          <input
            type="text"
            readOnly
            value={formData.location.city || 'Pune'}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 cursor-not-allowed font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/90 block">
            Official Postal Pincode
          </label>
          <input
            type="text"
            readOnly
            value={formData.location.pinCode || 'Auto-resolved from Master'}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-300/80 font-mono cursor-not-allowed"
          />
        </div>
      </div>

      {/* Society / Project Name & Address */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/90 block">
            Project / Society Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Panchshil Towers"
            value={formData.location.societyOrProjectName || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, societyOrProjectName: e.target.value },
              }))
            }
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/90 block">
            Street Address & Landmark <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Near EON Free Zone, Kharadi"
            value={formData.location.streetAddress}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, streetAddress: e.target.value },
              }))
            }
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/90 block">
            PIN Code <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 411014"
            maxLength={6}
            value={formData.location.pinCode}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, pinCode: e.target.value },
              }))
            }
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Lat/Long Coordinates Matrix */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            Precise GPS Coordinates (Powers Radius Search & Interactive Map)
          </label>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  latitude: 18.5529,
                  longitude: 73.9352,
                },
              }))
            }
            className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
          >
            Auto-fill Pune Kharadi GPS
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <span className="text-[11px] text-white/60 block">Latitude</span>
            <input
              type="number"
              step="0.0001"
              value={formData.location.latitude ?? 18.5529}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, latitude: parseFloat(e.target.value) || 0 },
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-white/60 block">Longitude</span>
            <input
              type="number"
              step="0.0001"
              value={formData.location.longitude ?? 73.9352}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, longitude: parseFloat(e.target.value) || 0 },
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-white/60 block">GPS Accuracy</span>
            <div className="px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-xs text-emerald-400 font-mono flex items-center gap-1">
              <Navigation className="w-3 h-3" /> Pinpoint (&lt; 5m radius)
            </div>
          </div>
        </div>
      </div>

      {/* Structured "What's Nearby" Landmarks Table */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              Structured "What's Nearby" Distance & Travel-Time Matrix
            </label>
            <p className="text-[11px] text-white/60">
              Crucial for buyer commute decisions. Adds +5% to listing quality score.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLoadPresetLandmarks}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3 h-3" /> Quick-Populate Landmarks Preset
          </button>
        </div>

        {/* Existing Nearby Landmarks List */}
        <div className="space-y-2">
          {formData.location.nearbyPlaces.map((place, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs gap-3"
            >
              <div className="flex items-center gap-2.5">
                {getCategoryIcon(place.category)}
                <span className="px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono text-amber-300">
                  {place.category}
                </span>
                <span className="font-medium text-white">{place.placeName}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-white/80">
                <span>{place.distanceKm} km</span>
                <span className="text-white/40">·</span>
                <span>
                  {place.travelTimeMins} mins ({place.transportMode.toLowerCase()})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveNearby(idx)}
                  className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer transition-colors"
                  title="Remove landmark"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Nearby Landmark Row */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 grid grid-cols-1 sm:grid-cols-6 gap-2 text-xs">
          <div className="sm:col-span-1">
            <select
              value={newPlace.category}
              onChange={(e) => setNewPlace({ ...newPlace, category: e.target.value as any })}
              className="w-full px-2 py-1.5 rounded-lg bg-black border border-white/10 text-white text-[11px]"
            >
              <option value="TRANSPORT">Transit / Metro</option>
              <option value="EMPLOYMENT">IT Park / Tech</option>
              <option value="HEALTHCARE">Hospital / Clinic</option>
              <option value="EDUCATION">School / College</option>
              <option value="LIFESTYLE">Mall / Retail</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Landmark name (e.g. Kalyani Nagar Bridge)"
              value={newPlace.placeName}
              onChange={(e) => setNewPlace({ ...newPlace, placeName: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/10 text-white text-xs"
            />
          </div>
          <div className="sm:col-span-1">
            <input
              type="number"
              step="0.1"
              placeholder="Km"
              value={newPlace.distanceKm}
              onChange={(e) => setNewPlace({ ...newPlace, distanceKm: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1.5 rounded-lg bg-black border border-white/10 text-white text-xs font-mono"
            />
          </div>
          <div className="sm:col-span-1">
            <input
              type="number"
              placeholder="Mins"
              value={newPlace.travelTimeMins}
              onChange={(e) => setNewPlace({ ...newPlace, travelTimeMins: parseInt(e.target.value) || 0 })}
              className="w-full px-2 py-1.5 rounded-lg bg-black border border-white/10 text-white text-xs font-mono"
            />
          </div>
          <div className="sm:col-span-1 flex items-center gap-1">
            <button
              type="button"
              onClick={handleAddCustomNearby}
              disabled={!newPlace.placeName.trim()}
              className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Location Creation & Approval Modal */}
      {isCreateModalOpen && (
        <LocationCreationModal
          isOpen={isCreateModalOpen}
          initialName={createModalInitialName}
          onClose={() => setIsCreateModalOpen(false)}
          onLocationCreated={(newLoc) => {
            handleSelectCanonicalLocation(newLoc);
          }}
        />
      )}
    </div>
  );
};
