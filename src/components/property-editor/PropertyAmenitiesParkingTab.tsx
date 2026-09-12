import React, { useState, useMemo } from 'react';
import {
  Car,
  Sparkles,
  Zap,
  Search,
  Plus,
  CheckCircle2,
  X,
  Shield,
  Dumbbell,
  Leaf,
  Coffee,
} from 'lucide-react';
import { ParkingSpecsState } from './propertyEditorTypes';
import { formatINR } from '../../services/calculatorEngine';

interface PropertyAmenitiesParkingTabProps {
  canModify: boolean;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  parkingSpecs: ParkingSpecsState;
  setParkingSpecs: (specs: ParkingSpecsState) => void;
}

const PRESET_AMENITY_CATEGORIES = [
  {
    category: 'Lifestyle & Wellness',
    icon: Sparkles,
    items: [
      'Infinity Swimming Pool',
      'Heated Jacuzzi & Hydrotherapy',
      'Spa & Sauna Wellness Suite',
      'Private Screening Theatre / Mini Cinema',
      'Sky Lounge & Observatory Deck',
      'Banquet & Multipurpose Party Hall',
      'Private Dining Cabanas',
      'Library & Reading Salon',
      'Music Room & Soundproof Studio',
    ],
  },
  {
    category: 'Sports & Fitness',
    icon: Dumbbell,
    items: [
      'State-of-the-art TechnoGym Fitness Centre',
      'Full-size Squash Court',
      'Olympic-Length Lap Pool',
      'Synthetic Badminton Court',
      'Half Basketball & Multi-sport Court',
      'Yoga & Meditation Pavilion',
      'Indoor Games Arcade & Billiards',
      'Jogging & Acupressure Track',
      'Cricket Bowling Pitch with Net',
    ],
  },
  {
    category: 'Security & Automation',
    icon: Shield,
    items: [
      '7-Tier Perimeter & Biometric Security',
      'RFID Boom Barriers & License Plate Recognition',
      'Smart Home Video Door Phone (VDP)',
      '24x7 CCTV Campus Surveillance with AI Motion Sensing',
      'Fire Sprinklers & Gas Leak Detectors',
      'Access Controlled High-Speed Elevators',
      'Video Intercom Connected to Security Gate',
    ],
  },
  {
    category: 'Eco-Friendly & Green Living',
    icon: Leaf,
    items: [
      'IGBC Platinum / Gold Green Building Certified',
      'Rooftop Solar PV Panels for Common Areas',
      'Rainwater Harvesting & Recharge Pit',
      'Sewage Treatment Plant (STP) with Recycled Flushing',
      'Organic Waste Converter (OWC)',
      'EV Car Fast Charging Infrastructure',
      'Reflective Cool Roof Coating',
    ],
  },
  {
    category: 'Convenience & Work',
    icon: Coffee,
    items: [
      'Co-working Lounge with High-Speed Leased Line',
      'Private Meeting Pods & Video Conferencing',
      'Concierge & Valet Desk',
      '100% DG Power Backup for Units & Commons',
      'Automated Parcel Lockers & Delivery Hub',
      'On-site Pharmacy & Daily Convenience Store',
      'Pet Park with Washing Station',
    ],
  },
];

export const PropertyAmenitiesParkingTab: React.FC<PropertyAmenitiesParkingTabProps> = ({
  canModify,
  selectedAmenities,
  setSelectedAmenities,
  parkingSpecs,
  setParkingSpecs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customAmenityName, setCustomAmenityName] = useState('');

  const updateParking = <K extends keyof ParkingSpecsState>(field: K, val: ParkingSpecsState[K]) => {
    setParkingSpecs({ ...parkingSpecs, [field]: val });
  };

  const toggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  const handleAddCustomAmenity = () => {
    const trimmed = customAmenityName.trim();
    if (!trimmed) return;
    if (!selectedAmenities.includes(trimmed)) {
      setSelectedAmenities([...selectedAmenities, trimmed]);
    }
    setCustomAmenityName('');
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return PRESET_AMENITY_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return PRESET_AMENITY_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.toLowerCase().includes(q)),
    })).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. PARKING ARCHITECTURE & INFRASTRUCTURE */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              Dedicated Parking Architecture &amp; EV Mobility
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
            {parkingSpecs.totalSlots} Total Slots
          </span>
        </div>

        {/* Master Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white/90">
            <input
              type="checkbox"
              disabled={!canModify}
              checked={parkingSpecs.parkingAvailable}
              onChange={(e) => updateParking('parkingAvailable', e.target.checked)}
              className="rounded border-amber-500 text-amber-500 focus:ring-0"
            />
            <span>Dedicated Parking Available</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white/90">
            <input
              type="checkbox"
              disabled={!canModify}
              checked={parkingSpecs.evChargingAvailable}
              onChange={(e) => updateParking('evChargingAvailable', e.target.checked)}
              className="rounded border-emerald-500 text-emerald-500 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>EV Fast Charging Station</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white/90">
            <input
              type="checkbox"
              disabled={!canModify}
              checked={parkingSpecs.dedicatedVisitorParking}
              onChange={(e) => updateParking('dedicatedVisitorParking', e.target.checked)}
              className="rounded border-amber-500 text-amber-500 focus:ring-0"
            />
            <span>Dedicated Visitor Parking Bays</span>
          </label>
        </div>

        {/* Breakdown of slots */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-amber-300 block">Total Car Slots</label>
            <input
              type="number"
              disabled={!canModify}
              value={parkingSpecs.totalSlots}
              onChange={(e) => updateParking('totalSlots', parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-amber-500/30 text-xs text-amber-300 font-mono font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Covered Slots</label>
            <input
              type="number"
              disabled={!canModify}
              value={parkingSpecs.coveredSlots}
              onChange={(e) => updateParking('coveredSlots', parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Basement Slots</label>
            <input
              type="number"
              disabled={!canModify}
              value={parkingSpecs.basementSlots}
              onChange={(e) => updateParking('basementSlots', parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Mechanical Stack</label>
            <input
              type="number"
              disabled={!canModify}
              value={parkingSpecs.mechanicalStackSlots}
              onChange={(e) => updateParking('mechanicalStackSlots', parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Podium / Stilt</label>
            <input
              type="number"
              disabled={!canModify}
              value={parkingSpecs.podiumSlots}
              onChange={(e) => updateParking('podiumSlots', parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Two-Wheeler Slots</label>
            <input
              type="number"
              disabled={!canModify}
              value={parkingSpecs.twoWheelerSlots}
              onChange={(e) => updateParking('twoWheelerSlots', parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Commercial Cost Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Commercial Parking Terms</label>
            <select
              disabled={!canModify}
              value={parkingSpecs.includedInAgreementValue ? 'INCLUDED' : 'ADDITIONAL'}
              onChange={(e) => updateParking('includedInAgreementValue', e.target.value === 'INCLUDED')}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="INCLUDED" className="bg-slate-900 text-white">Included in Base Agreement Value</option>
              <option value="ADDITIONAL" className="bg-slate-900 text-white">Additional Cost Over Agreement Value</option>
            </select>
          </div>

          {!parkingSpecs.includedInAgreementValue && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-amber-300 block">Additional Parking Cost (INR)</label>
              <input
                type="number"
                disabled={!canModify}
                value={parkingSpecs.additionalCostINR}
                onChange={(e) => updateParking('additionalCostINR', parseFloat(e.target.value) || 0)}
                placeholder="e.g. 500000"
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-amber-500/30 text-xs text-white font-mono"
              />
              <span className="text-[10px] text-white/50">{formatINR(parkingSpecs.additionalCostINR)}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. SEARCHABLE MULTI-SELECT AMENITIES SYSTEM */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                Comprehensive Amenities &amp; Features ({selectedAmenities.length} Selected)
              </h3>
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              Instant multi-select system with live search filter and custom amenity adder.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search amenities..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Selected Amenities Chips */}
        {selectedAmenities.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-amber-300 block uppercase tracking-wider">
              Active Selected Amenities:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-xl bg-black/30 border border-white/5">
              {selectedAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1.5"
                >
                  <span>{amenity}</span>
                  {canModify && (
                    <button
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className="hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Custom Amenity Adder */}
        {canModify && (
          <div className="flex gap-2 p-2.5 rounded-xl bg-black/40 border border-dashed border-white/20">
            <input
              type="text"
              value={customAmenityName}
              onChange={(e) => setCustomAmenityName(e.target.value)}
              placeholder="Add custom bespoke amenity (e.g. Private Wine Cellar / Helipad)..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomAmenity();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddCustomAmenity}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom</span>
            </button>
          </div>
        )}

        {/* Categorized Grid */}
        <div className="space-y-4">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.category} className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white/80">
                  <Icon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{cat.category}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {cat.items.map((item) => {
                    const isSelected = selectedAmenities.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        disabled={!canModify}
                        onClick={() => toggleAmenity(item)}
                        className={`px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between gap-2 border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                            : 'bg-black/30 border-white/5 text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{item}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
