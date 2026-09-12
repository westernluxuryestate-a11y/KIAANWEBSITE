/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Car,
  Compass,
  Check,
  Plus,
  Trash2,
  Zap,
  Shield,
  Layers,
} from 'lucide-react';
import { UniversalListingFormData } from '../../services/universalListingSchemaService';

interface StageAmenitiesProps {
  formData: UniversalListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<UniversalListingFormData>>;
}

const POPULAR_AMENITIES = [
  'Clubhouse',
  'Swimming Pool',
  'Gymnasium',
  '24x7 Security',
  'CCTV Surveillance',
  'Gated Entry',
  'Power Backup',
  'Piped Gas Pipeline',
  'EV Charging Bays',
  'Visitor Parking',
  'Landscaped Garden',
  'Children Play Area',
  'Jogging Track',
  'Tennis / Squash Court',
  'Senior Citizen Pavilion',
  'Concierge Desk',
  'High-Speed Elevators',
  'Coworking Lounge / Business Centre',
  'Badminton Court',
  'Banquet & Party Hall',
  'Pet Friendly Zone',
  'Solar Rooftop Lighting',
  'Rainwater Harvesting',
  'Sewage Treatment Plant (STP)',
  'Rooftop Sky Lounge / Deck',
  'Infinity Edge Pool',
  'Indoor Games Room',
  'Yoga & Meditation Lawn',
  'Intercom Facility',
  'Fire Safety Sprinklers',
];

export const StageAmenities: React.FC<StageAmenitiesProps> = ({
  formData,
  setFormData,
}) => {
  const [customAmenityInput, setCustomAmenityInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const amenities = formData.amenities || [];
  const parking = formData.parking || ({} as any);
  const vastu = formData.vastu || ({} as any);

  const toggleAmenity = (amenity: string) => {
    const isSelected = amenities.includes(amenity);
    const updated = isSelected
      ? amenities.filter((a) => a !== amenity)
      : [...amenities, amenity];
    setFormData((prev) => ({ ...prev, amenities: updated }));
  };

  const handleAddCustomAmenity = () => {
    const trimmed = customAmenityInput.trim();
    if (!trimmed) return;
    if (!amenities.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...(prev.amenities || []), trimmed],
        customAmenities: [...(prev.customAmenities || []), trimmed],
      }));
    }
    setCustomAmenityInput('');
  };

  const filteredAmenities = POPULAR_AMENITIES.filter((a) =>
    a.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-6">
      <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            8. Lifestyle Amenities, Parking Allocations & Vastu
          </h3>
          <p className="text-xs opacity-70">
            Rich searchable amenity tags, dedicated vehicular parking bays, and orientation parameters.
          </p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
          High Search Filter Relevance
        </span>
      </div>

      {/* Amenities Multi-Select Section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-white">
              Searchable Amenities & Club Facilities
            </label>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
              {formData.amenities.length} Selected
            </span>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search amenities..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Quick Multi-select Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs max-h-64 overflow-y-auto pr-1">
          {filteredAmenities.map((amenity) => {
            const isSelected = formData.amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 font-semibold shadow-sm'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="truncate pr-1">{amenity}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Add Custom Amenity Input */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Add custom amenity (e.g. Squash Court with Glass Backing)"
            value={customAmenityInput}
            onChange={(e) => setCustomAmenityInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomAmenity();
              }
            }}
            className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleAddCustomAmenity}
            disabled={!customAmenityInput.trim()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      {/* Parking Breakdown Card */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-2">
            <Car className="w-4 h-4 text-amber-400" />
            Vehicular Parking Allocations & EV Infrastructure
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">Total Car Slots</span>
            <input
              type="number"
              min="0"
              value={parking.totalSlots || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking: { ...(prev.parking || {}), totalSlots: parseInt(e.target.value) || 0 } as any,
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">Covered Car Slots</span>
            <input
              type="number"
              min="0"
              value={parking.coveredSlots || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking: { ...(prev.parking || {}), coveredSlots: parseInt(e.target.value) || 0 } as any,
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">Open Car Slots</span>
            <input
              type="number"
              min="0"
              value={parking.openSlots || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking: { ...(prev.parking || {}), openSlots: parseInt(e.target.value) || 0 } as any,
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">Two-Wheeler Slots</span>
            <input
              type="number"
              min="0"
              value={parking.twoWheelerSlots || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking: { ...(prev.parking || {}), twoWheelerSlots: parseInt(e.target.value) || 0 } as any,
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <label className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/10 cursor-pointer text-white/90">
            <input
              type="checkbox"
              checked={Boolean(parking.hasEvChargingBay)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking: { ...(prev.parking || {}), hasEvChargingBay: e.target.checked } as any,
                }))
              }
              className="rounded text-amber-500"
            />
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Dedicated EV Charging Bay
            </span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/10 cursor-pointer text-white/90">
            <input
              type="checkbox"
              checked={Boolean(parking.hasVisitorParking)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking: { ...(prev.parking || {}), hasVisitorParking: e.target.checked } as any,
                }))
              }
              className="rounded text-amber-500"
            />
            <span>Ample Visitor Parking</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/10 cursor-pointer text-white/90">
            <input
              type="checkbox"
              checked={Boolean(parking.isParkingIncludedInPrice)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking: { ...(prev.parking || {}), isParkingIncludedInPrice: e.target.checked } as any,
                }))
              }
              className="rounded text-amber-500"
            />
            <span>Parking Included in Asking Price</span>
          </label>
        </div>
      </div>

      {/* Vastu & Orientation Card (Section 19: Non-intrusive & completely optional) */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300">
              Vastu & Orientation (Section 19)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Optional — Skip if not applicable
            </span>
          </div>

          {/* Quick Facing Tags */}
          <div className="flex flex-wrap items-center gap-1 text-[10px]">
            {[
              { label: 'East Facing', dir: 'EAST' },
              { label: 'North Facing', dir: 'NORTH' },
              { label: 'North-East Entry', dir: 'NORTH_EAST' },
              { label: 'West Facing', dir: 'WEST' },
              { label: 'South Facing', dir: 'SOUTH' },
            ].map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    vastu: {
                      ...(prev.vastu || {}),
                      mainEntranceDirection: tag.dir as any,
                      propertyFacing: tag.dir as any,
                    } as any,
                  }))
                }
                className={`px-2 py-0.5 rounded-md border transition-all ${
                  vastu.mainEntranceDirection === tag.dir
                    ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">Main Entrance Direction</span>
            <select
              value={vastu.mainEntranceDirection || 'NOT_SPECIFIED'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  vastu: { ...(prev.vastu || {}), mainEntranceDirection: e.target.value as any } as any,
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="NOT_SPECIFIED">Not Specified (Skip)</option>
              <option value="EAST">East Facing (Auspicious Sunrise)</option>
              <option value="NORTH">North Facing (Kubera Corner)</option>
              <option value="NORTH_EAST">North-East (Ishanya)</option>
              <option value="NORTH_WEST">North-West (Vayu)</option>
              <option value="WEST">West Facing (Varuna)</option>
              <option value="SOUTH">South Facing</option>
              <option value="SOUTH_EAST">South-East (Agneya)</option>
              <option value="SOUTH_WEST">South-West (Nirruthi)</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">Overall Property Facing</span>
            <select
              value={vastu.propertyFacing || 'NOT_SPECIFIED'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  vastu: { ...(prev.vastu || {}), propertyFacing: e.target.value as any } as any,
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="NOT_SPECIFIED">Not Specified (Skip)</option>
              <option value="EAST">East</option>
              <option value="NORTH">North</option>
              <option value="NORTH_EAST">North-East</option>
              <option value="NORTH_WEST">North-West</option>
              <option value="WEST">West</option>
              <option value="SOUTH">South</option>
              <option value="SOUTH_EAST">South-East</option>
              <option value="SOUTH_WEST">South-West</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">Balcony Direction</span>
            <select
              value={vastu.balconyDirection || 'NOT_SPECIFIED'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  vastu: { ...(prev.vastu || {}), balconyDirection: e.target.value as any } as any,
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="NOT_SPECIFIED">Not Specified</option>
              <option value="EAST">East (Morning Sun)</option>
              <option value="NORTH">North (Cool breeze)</option>
              <option value="NORTH_EAST">North-East</option>
              <option value="WEST">West (Sunset View)</option>
              <option value="SOUTH">South</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">Kitchen Direction</span>
            <select
              value={vastu.kitchenDirection || 'NOT_SPECIFIED'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  vastu: { ...(prev.vastu || {}), kitchenDirection: e.target.value as any } as any,
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="NOT_SPECIFIED">Not Specified</option>
              <option value="SOUTH_EAST">South-East (Agneya - Ideal Fire Element)</option>
              <option value="NORTH_WEST">North-West (Vayu - Second Best)</option>
              <option value="EAST">East</option>
              <option value="NORTH">North</option>
              <option value="WEST">West</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">Master Bedroom Direction</span>
            <select
              value={vastu.masterBedroomDirection || 'NOT_SPECIFIED'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  vastu: { ...(prev.vastu || {}), masterBedroomDirection: e.target.value as any } as any,
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="NOT_SPECIFIED">Not Specified</option>
              <option value="SOUTH_WEST">South-West (Nirruthi - Ideal Earth Element)</option>
              <option value="SOUTH">South</option>
              <option value="WEST">West</option>
              <option value="NORTH_WEST">North-West</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">Plot / Unit Configuration</span>
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-white/90">
                <input
                  type="checkbox"
                  checked={Boolean(vastu.isCornerProperty || (vastu as any).cornerProperty)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vastu: { ...(prev.vastu || {}), isCornerProperty: e.target.checked } as any,
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="font-semibold text-amber-200">Corner Property (2+ Open Sides)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Certifications & Badges */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-white/90">
            <input
              type="checkbox"
              checked={Boolean(vastu.vastuCompliant)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  vastu: { ...(prev.vastu || {}), vastuCompliant: e.target.checked } as any,
                }))
              }
              className="rounded text-amber-500"
            />
            <span className="font-semibold text-amber-300">100% Vastu Compliant Layout</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-white/90">
            <input
              type="checkbox"
              checked={Boolean(vastu.vastuConsultantCertified)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  vastu: { ...(prev.vastu || {}), vastuConsultantCertified: e.target.checked } as any,
                }))
              }
              className="rounded text-amber-500"
            />
            <span className="text-white/80">Certified by Professional Vastu Consultant</span>
          </label>
        </div>
      </div>
    </div>
  );
};
