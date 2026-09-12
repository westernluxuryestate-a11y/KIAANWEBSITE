/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Compass,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Navigation,
  Layers,
  Copy,
  Check,
  Building2,
  Milestone,
  Route,
} from 'lucide-react';
import { Locality, LocationHierarchyNode, PuneZoneId } from '../../types';
import { PUNE_LOCATION_HIERARCHY_TREE, PUNE_ZONES } from '../../data/puneLocationHierarchy';

interface PuneLocationHierarchyViewProps {
  localities: Locality[];
  onSelectLocality: (locality: Locality) => void;
  onFocusCoordinates?: (coords: { lat: number; lng: number; name: string }) => void;
  theme?: 'dark' | 'light';
}

export const PuneLocationHierarchyView: React.FC<PuneLocationHierarchyViewProps> = ({
  localities,
  onSelectLocality,
  onFocusCoordinates,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    zone_central_pune: true,
    zone_east_pune: true,
    zone_north_pune_pcmc: true,
    zone_west_pune: true,
    zone_south_pune: true,
    zone_pune_outer: true,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Toggle node expansion
  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    const traverse = (node: LocationHierarchyNode) => {
      all[node.id] = true;
      if (node.children) node.children.forEach(traverse);
    };
    traverse(PUNE_LOCATION_HIERARCHY_TREE);
    setExpandedNodes(all);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  // Copy coordinates helper
  const copyCoordinates = (lat: number, lng: number, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Locality lookup dictionary
  const localityMap = useMemo(() => {
    const map = new Map<string, Locality>();
    localities.forEach((l) => {
      map.set(l.id, l);
      map.set(l.slug, l);
      map.set(l.name.toLowerCase(), l);
    });
    return map;
  }, [localities]);

  const zonesList = useMemo(() => {
    return PUNE_LOCATION_HIERARCHY_TREE.children || [];
  }, []);

  // Filter tree based on search query and selected zone
  const filteredZones = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return zonesList
      .filter((zone) => {
        if (selectedZone !== 'ALL' && zone.id !== selectedZone) {
          return false;
        }
        return true;
      })
      .map((zone) => {
        if (!q) return zone;

        // Filter localities and their children
        const matchingLocalities = (zone.children || []).filter((loc) => {
          const locMatch =
            loc.name.toLowerCase().includes(q) ||
            (loc.pincode && loc.pincode.includes(q)) ||
            (loc.slug && loc.slug.toLowerCase().includes(q));

          const childMatch = (loc.children || []).some(
            (c) => c.name.toLowerCase().includes(q) || (c.slug && c.slug.toLowerCase().includes(q))
          );

          return locMatch || childMatch;
        });

        if (matchingLocalities.length > 0 || zone.name.toLowerCase().includes(q)) {
          return {
            ...zone,
            children: matchingLocalities.length > 0 ? matchingLocalities : zone.children,
          };
        }
        return null;
      })
      .filter(Boolean) as LocationHierarchyNode[];
  }, [zonesList, selectedZone, searchQuery]);

  return (
    <div
      id="pune-location-hierarchy-section"
      className={`w-full rounded-2xl border transition-all ${
        isDark
          ? 'bg-[#090D16] border-white/10 shadow-2xl text-white'
          : 'bg-white border-slate-200 shadow-xl text-slate-900'
      }`}
    >
      {/* Header Bar */}
      <div
        className={`px-6 py-5 border-b ${
          isDark ? 'bg-slate-950/80 border-white/10' : 'bg-slate-50 border-slate-200'
        } flex flex-col md:flex-row md:items-center justify-between gap-4`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold tracking-tight">
              Pune Location Hierarchy & Coordinates
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Latitude • Longitude
            </span>
          </div>
          <p className="text-xs text-white/60">
            Structured geographic tree: Zone → Locality → Sub-Locality → Road / Micro-Location
          </p>
        </div>

        {/* Global Expand/Collapse & Direct Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Filter and Zone Tabs Bar */}
      <div className={`p-4 border-b ${isDark ? 'border-white/10 bg-slate-900/40' : 'border-slate-200 bg-slate-50/60'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search in Hierarchy */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locality, sub-locality, or road (e.g. Ashoka Nagar, Kharadi, Hinjewadi)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-black/30 border border-white/10 focus:border-amber-400 focus:outline-none text-white placeholder:text-white/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Zone Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedZone('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedZone === 'ALL'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-white/70'
              }`}
            >
              All Zones ({zonesList.length})
            </button>
            {zonesList.map((zone) => {
              const isActive = selectedZone === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-white/70'
                  }`}
                >
                  {zone.name.replace(' Pune', '')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hierarchical Tree Body */}
      <div className="p-6 space-y-6 font-sans">
        {/* City Root Node Badge */}
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">Pune Metropolitan Region</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/10 text-white/80">
                18.5204° N, 73.8567° E
              </span>
            </div>
            <span className="text-xs text-white/50">
              Total 6 Primary Zones • {localities.length} Registered Localities
            </span>
          </div>
        </div>

        {/* Zones Container */}
        <div className="space-y-4">
          {filteredZones.map((zone) => {
            const isZoneExpanded = expandedNodes[zone.id] !== false;
            const localitiesCount = zone.children?.length || 0;

            return (
              <div
                key={zone.id}
                className="rounded-xl border border-white/10 bg-slate-950/40 overflow-hidden"
              >
                {/* Zone Header */}
                <div
                  onClick={() => toggleNode(zone.id)}
                  className="flex items-center justify-between px-4 py-3 bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-amber-400">
                      {isZoneExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white tracking-wide">
                          {zone.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          ZONE
                        </span>
                      </div>
                      {zone.coordinates && (
                        <span className="text-[11px] font-mono text-white/40">
                          Center: {zone.coordinates.lat.toFixed(4)}° N, {zone.coordinates.lng.toFixed(4)}° E
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 font-medium">
                      {localitiesCount} {localitiesCount === 1 ? 'Locality' : 'Localities'}
                    </span>
                    {zone.coordinates && onFocusCoordinates && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFocusCoordinates({
                            lat: zone.coordinates!.lat,
                            lng: zone.coordinates!.lng,
                            name: zone.name,
                          });
                        }}
                        title="Focus on Map"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Zone Children (Localities) */}
                {isZoneExpanded && (
                  <div className="px-4 py-3 border-t border-white/5 space-y-3">
                    {zone.children && zone.children.length > 0 ? (
                      zone.children.map((locNode) => {
                        const isLocExpanded = expandedNodes[locNode.id] !== false;
                        const fullLoc =
                          localityMap.get(locNode.id) ||
                          localityMap.get(locNode.slug) ||
                          localityMap.get(locNode.name.toLowerCase());
                        const hasSubChildren = locNode.children && locNode.children.length > 0;

                        return (
                          <div
                            key={locNode.id}
                            className="ml-2 sm:ml-4 pl-3 sm:pl-4 border-l-2 border-amber-500/20 space-y-2"
                          >
                            {/* Locality Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                              <div className="flex items-center gap-2.5">
                                {hasSubChildren ? (
                                  <button
                                    onClick={() => toggleNode(locNode.id)}
                                    className="p-0.5 text-amber-400/80 hover:text-amber-400 cursor-pointer"
                                  >
                                    {isLocExpanded ? (
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                ) : (
                                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                                  </div>
                                )}

                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-white">
                                      {locNode.name}
                                    </span>
                                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                      LOCALITY
                                    </span>
                                    {locNode.pincode && (
                                      <span className="text-xs font-mono text-white/50">
                                        PIN {locNode.pincode}
                                      </span>
                                    )}
                                  </div>

                                  {/* Latitude & Longitude Tag */}
                                  {locNode.coordinates && (
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400/90">
                                        <MapPin className="w-3 h-3 text-amber-400" />
                                        {locNode.coordinates.lat.toFixed(4)}° N, {locNode.coordinates.lng.toFixed(4)}° E
                                      </span>
                                      <button
                                        onClick={(e) =>
                                          copyCoordinates(
                                            locNode.coordinates!.lat,
                                            locNode.coordinates!.lng,
                                            locNode.id,
                                            e
                                          )
                                        }
                                        title="Copy Coordinates"
                                        className="text-[10px] text-white/40 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                                      >
                                        {copiedId === locNode.id ? (
                                          <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Locality Actions */}
                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                {locNode.coordinates && onFocusCoordinates && (
                                  <button
                                    onClick={() =>
                                      onFocusCoordinates({
                                        lat: locNode.coordinates!.lat,
                                        lng: locNode.coordinates!.lng,
                                        name: locNode.name,
                                      })
                                    }
                                    title="View on Map"
                                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Navigation className="w-3 h-3 text-amber-400" />
                                    <span>Map Pin</span>
                                  </button>
                                )}

                                {fullLoc && (
                                  <button
                                    onClick={() => onSelectLocality(fullLoc)}
                                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                                  >
                                    <span>Open Page</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Sub-Localities & Micro Locations */}
                            {isLocExpanded && hasSubChildren && (
                              <div className="ml-4 sm:ml-6 pl-3 sm:pl-4 border-l-2 border-white/10 space-y-1.5 py-1">
                                {locNode.children!.map((subNode) => {
                                  const isSubLoc = subNode.level === 'SUB_LOCALITY';
                                  const isRoad = subNode.level === 'MICRO_LOCATION';

                                  return (
                                    <div
                                      key={subNode.id}
                                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2 rounded-lg bg-white/[0.015] hover:bg-white/[0.04] transition-colors"
                                    >
                                      <div className="flex items-center gap-2">
                                        {isSubLoc ? (
                                          <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        ) : (
                                          <Route className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        )}
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-xs font-semibold text-white/90">
                                            {subNode.name}
                                          </span>
                                          <span
                                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                              isSubLoc
                                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                            }`}
                                          >
                                            {isSubLoc ? 'SUB-LOCALITY' : 'ROAD / MICRO'}
                                          </span>
                                          {subNode.pincode && (
                                            <span className="text-[10px] font-mono text-white/40">
                                              PIN {subNode.pincode}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Sub-node Coordinates */}
                                      {subNode.coordinates && (
                                        <div className="flex items-center gap-2 self-end sm:self-auto">
                                          <span className="text-[10px] font-mono text-white/60 bg-black/30 px-2 py-0.5 rounded border border-white/5">
                                            {subNode.coordinates.lat.toFixed(4)}° N,{' '}
                                            {subNode.coordinates.lng.toFixed(4)}° E
                                          </span>
                                          <button
                                            onClick={(e) =>
                                              copyCoordinates(
                                                subNode.coordinates!.lat,
                                                subNode.coordinates!.lng,
                                                subNode.id,
                                                e
                                              )
                                            }
                                            title="Copy Lat/Lng"
                                            className="p-1 rounded text-white/40 hover:text-white cursor-pointer"
                                          >
                                            {copiedId === subNode.id ? (
                                              <Check className="w-3 h-3 text-emerald-400" />
                                            ) : (
                                              <Copy className="w-3 h-3" />
                                            )}
                                          </button>
                                          {onFocusCoordinates && (
                                            <button
                                              onClick={() =>
                                                onFocusCoordinates({
                                                  lat: subNode.coordinates!.lat,
                                                  lng: subNode.coordinates!.lng,
                                                  name: `${subNode.name} (${locNode.name})`,
                                                })
                                              }
                                              title="Focus Micro Location on Map"
                                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-amber-400 cursor-pointer"
                                            >
                                              <Navigation className="w-3 h-3" />
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-white/40 italic py-2 pl-4">
                        No localities registered under this zone yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
