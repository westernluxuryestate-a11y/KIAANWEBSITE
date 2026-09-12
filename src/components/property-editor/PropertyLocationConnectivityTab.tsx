import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Train,
  GraduationCap,
  Hospital,
  Briefcase,
  Coffee,
  Plus,
  Trash2,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { LocationConnectivityState } from './propertyEditorTypes';
import { CanonicalLocationSelector } from '../location/CanonicalLocationSelector';
import { LocationCreationModal } from '../location/LocationCreationModal';
import { LocationMasterRecord } from '../../services/locationIntelligencePlatform';

interface PropertyLocationConnectivityTabProps {
  canModify: boolean;
  data: LocationConnectivityState;
  onChange: (updated: LocationConnectivityState) => void;
}

export const PropertyLocationConnectivityTab: React.FC<PropertyLocationConnectivityTabProps> = ({
  canModify,
  data,
  onChange,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalInitialName, setCreateModalInitialName] = useState('');

  const [newPoiName, setNewPoiName] = useState('');
  const [newPoiCategory, setNewPoiCategory] = useState<'TRANSIT' | 'EDUCATION' | 'HEALTHCARE' | 'EMPLOYMENT' | 'LIFESTYLE'>('TRANSIT');
  const [newPoiDist, setNewPoiDist] = useState('2.5');
  const [newPoiTime, setNewPoiTime] = useState('5');
  const [newPoiMode, setNewPoiMode] = useState<'DRIVE' | 'WALK' | 'METRO'>('DRIVE');

  const updateField = <K extends keyof LocationConnectivityState>(field: K, val: LocationConnectivityState[K]) => {
    onChange({ ...data, [field]: val });
  };

  const handleSelectCanonicalLocation = (loc: LocationMasterRecord) => {
    onChange({
      ...data,
      locationMasterId: loc.id,
      city: loc.district || 'Pune',
      district: loc.district || 'Pune',
      microMarket: loc.nameEn,
      pincode: loc.pincode,
      latitude: loc.latitude,
      longitude: loc.longitude,
      canonicalHierarchyPath: loc.hierarchyPath,
      canonicalCorporation: loc.municipalCorporation,
      canonicalWard: loc.ward,
    });
  };

  const handleAddPoi = () => {
    if (!newPoiName.trim()) return;
    const newPoi = {
      id: `poi_${Date.now()}`,
      name: newPoiName.trim(),
      category: newPoiCategory,
      distanceKm: parseFloat(newPoiDist) || 1,
      timeMins: parseInt(newPoiTime) || 5,
      mode: newPoiMode,
    };
    onChange({
      ...data,
      pois: [...data.pois, newPoi],
    });
    setNewPoiName('');
  };

  const handleRemovePoi = (id: string) => {
    onChange({
      ...data,
      pois: data.pois.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* 0. MANDATORY STEP 1: CANONICAL LOCATION MASTER SELECTOR */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
        <CanonicalLocationSelector
          selectedLocationId={data.locationMasterId}
          onSelectLocation={handleSelectCanonicalLocation}
          onOpenCreateLocationModal={(initialName) => {
            setCreateModalInitialName(initialName || '');
            setIsCreateModalOpen(true);
          }}
          disabled={!canModify}
          label="Canonical Location Master Selection (Mandatory SSOT)"
          helperText="Every project, resale asset, and builder record must strictly link to an approved Location Master ID. Free-text entries are restricted."
        />
      </div>

      {/* 1. STRUCTURED ADDRESS HIERARCHY */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
            <MapPin className="w-3.5 h-3.5" />
            <span>Structured Address &amp; Micro-Market Hierarchy</span>
          </span>
          <span className="text-[10px] text-white/50">Geographic Spatial Classification</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Parent City</label>
            <input
              type="text"
              readOnly
              value={data.city || 'Pune'}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white/70 font-medium cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-amber-300 block">Micro-Market (Canonical)</label>
            <input
              type="text"
              readOnly
              value={data.microMarket || 'Select from Master above'}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-amber-500/30 text-xs text-amber-200 font-bold cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Sub-Locality / Sector</label>
            <input
              type="text"
              disabled={!canModify}
              value={data.subLocality}
              onChange={(e) => updateField('subLocality', e.target.value)}
              placeholder="e.g. High Street / Pancard Club Road"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Postal Pincode</label>
            <input
              type="text"
              readOnly
              value={data.pincode || 'Auto-resolved'}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-amber-300/80 font-mono cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-semibold text-white/70 block">Society / Building / Campus Name</label>
            <input
              type="text"
              disabled={!canModify}
              value={data.societyBuildingName}
              onChange={(e) => updateField('societyBuildingName', e.target.value)}
              placeholder="e.g. The Balmoral Riverside / Amar Landmark"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Landmark</label>
            <input
              type="text"
              disabled={!canModify}
              value={data.landmark}
              onChange={(e) => updateField('landmark', e.target.value)}
              placeholder="e.g. Near Jupiter Hospital"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Taluka / District</label>
            <input
              type="text"
              disabled={!canModify}
              value={data.taluka}
              onChange={(e) => updateField('taluka', e.target.value)}
              placeholder="e.g. Haveli / Pune"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>
        </div>

        {/* GPS Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 flex items-center gap-1">
              <Navigation className="w-3 h-3 text-amber-400" />
              <span>Latitude Coordinates</span>
            </label>
            <input
              type="number"
              step="0.0001"
              disabled={!canModify}
              value={data.latitude}
              onChange={(e) => updateField('latitude', parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 flex items-center gap-1">
              <Navigation className="w-3 h-3 text-amber-400" />
              <span>Longitude Coordinates</span>
            </label>
            <input
              type="number"
              step="0.0001"
              disabled={!canModify}
              value={data.longitude}
              onChange={(e) => updateField('longitude', parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* 2. "WHAT'S NEARBY?" CONNECTIVITY MATRIX */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white/90 flex items-center gap-1.5 uppercase tracking-wide">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>"What's Nearby?" Connectivity &amp; Infrastructure Matrix ({data.pois.length} POIs)</span>
          </span>
          <span className="text-[10px] text-white/50">Transit, Education, Healthcare &amp; Lifestyle POIs</span>
        </div>

        {/* POI List */}
        <div className="space-y-2">
          {data.pois.map((poi) => {
            const getIcon = () => {
              switch (poi.category) {
                case 'TRANSIT': return Train;
                case 'EDUCATION': return GraduationCap;
                case 'HEALTHCARE': return Hospital;
                case 'EMPLOYMENT': return Briefcase;
                default: return Coffee;
              }
            };
            const Icon = getIcon();

            return (
              <div
                key={poi.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white/10 text-amber-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">{poi.name}</span>
                    <span className="text-[10px] text-white/50 ml-2 font-mono uppercase">
                      ({poi.category})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-amber-300 font-mono font-bold">{poi.distanceKm} km</span>
                  <span className="text-white/60">({poi.timeMins} mins via {poi.mode.toLowerCase()})</span>
                  {canModify && (
                    <button
                      type="button"
                      onClick={() => handleRemovePoi(poi.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add POI Form */}
        {canModify && (
          <div className="p-3 rounded-xl bg-black/40 border border-dashed border-white/20 space-y-2.5">
            <span className="text-[11px] font-bold text-amber-300 block">Add Nearby Landmark / Hub</span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <input
                type="text"
                value={newPoiName}
                onChange={(e) => setNewPoiName(e.target.value)}
                placeholder="Landmark name (e.g. Hinjawadi IT Park / Metro)"
                className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white sm:col-span-2"
              />
              <select
                value={newPoiCategory}
                onChange={(e) => setNewPoiCategory(e.target.value as any)}
                className="px-2 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
              >
                <option value="TRANSIT">Transit / Metro</option>
                <option value="EMPLOYMENT">IT Park / SEZ</option>
                <option value="HEALTHCARE">Hospital / Healthcare</option>
                <option value="EDUCATION">School / University</option>
                <option value="LIFESTYLE">Mall / High Street</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={newPoiDist}
                  onChange={(e) => setNewPoiDist(e.target.value)}
                  placeholder="KM"
                  className="w-16 px-2 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white font-mono"
                />
                <input
                  type="number"
                  value={newPoiTime}
                  onChange={(e) => setNewPoiTime(e.target.value)}
                  placeholder="Mins"
                  className="w-16 px-2 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleAddPoi}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add POI</span>
              </button>
            </div>
          </div>
        )}
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
