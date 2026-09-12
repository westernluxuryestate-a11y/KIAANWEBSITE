/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Property, UserSession } from '../types';
import { seoEngine } from '../services/seoAndMetadataEngine';
import { StandaloneVillaExperienceView } from './property-experience/StandaloneVillaExperienceView';
import { ResaleApartmentExperienceView } from './property-experience/ResaleApartmentExperienceView';
import { CommercialPreLeasedExperienceView } from './property-experience/CommercialPreLeasedExperienceView';
import { PlotLandExperienceView } from './property-experience/PlotLandExperienceView';
import { Home, Building2, TrendingUp, Trees, Layers } from 'lucide-react';

interface PropertyExperiencePageProps {
  property: Property;
  session?: UserSession | null;
  theme?: 'dark' | 'light';
  onBackToDiscovery: () => void;
  onOpenComparison?: () => void;
  onPropertyUpdated?: (prop: Property) => void;
}

export type PropertyExperienceArchetype = 'STANDALONE_VILLA' | 'RESALE_APARTMENT' | 'COMMERCIAL_PRELEASED' | 'PLOT_LAND';

export function detectPropertyArchetype(prop: Property): PropertyExperienceArchetype {
  const type = prop.propertyType;
  const category = prop.category;
  const subType = (prop.subType || '').toLowerCase();
  const title = (prop.title || '').toLowerCase();
  const config = (prop.configuration || '').toLowerCase();

  // 1. Standalone Villa / Bungalow / Freehold House
  if (
    type === 'VILLA' ||
    type === 'ROW_HOUSE' ||
    subType.includes('villa') ||
    subType.includes('bungalow') ||
    subType.includes('row house') ||
    subType.includes('estate') ||
    title.includes('villa') ||
    title.includes('bungalow') ||
    title.includes('glasshouse') ||
    config.includes('villa')
  ) {
    return 'STANDALONE_VILLA';
  }

  // 2. Commercial / Retail / Warehouse / Pre-Leased
  if (
    type === 'OFFICE' ||
    type === 'RETAIL' ||
    type === 'SHOWROOM' ||
    type === 'WAREHOUSE' ||
    (type as string) === 'COMMERCIAL_OFFICE' ||
    (type as string) === 'INDUSTRIAL' ||
    category === 'COMMERCIAL' ||
    category === 'INDUSTRIAL' ||
    prop.preLeasedData?.isPreLeased ||
    prop.preLeasedData?.isPreRented ||
    subType.includes('retail') ||
    subType.includes('warehouse') ||
    subType.includes('commercial') ||
    subType.includes('office') ||
    title.includes('retail') ||
    title.includes('logistics') ||
    title.includes('warehouse') ||
    title.includes('starbucks') ||
    title.includes('amazon')
  ) {
    return 'COMMERCIAL_PRELEASED';
  }

  // 3. Plot / Land Parcel
  if (
    type === 'LAND' ||
    category === 'PLOT' ||
    subType.includes('plot') ||
    subType.includes('land') ||
    title.includes('plot') ||
    title.includes('pavana valley') ||
    config.includes('plot') ||
    config.includes('guntha')
  ) {
    return 'PLOT_LAND';
  }

  // 4. Resale Apartment / Sky Penthouse / Condo
  return 'RESALE_APARTMENT';
}

export const PropertyExperiencePage: React.FC<PropertyExperiencePageProps> = ({
  property: initialProperty,
  session,
  theme = 'dark',
  onBackToDiscovery,
  onOpenComparison,
  onPropertyUpdated,
}) => {
  const [property, setProperty] = useState<Property>(initialProperty);
  const detectedType = detectPropertyArchetype(property);
  const [activeArchetype, setActiveArchetype] = useState<PropertyExperienceArchetype>(detectedType);

  // Sync state if initialProperty changes
  useEffect(() => {
    setProperty(initialProperty);
    setActiveArchetype(detectPropertyArchetype(initialProperty));
  }, [initialProperty]);

  // Automated SEO & Schema.org ImageObject Injection for Property Listing
  useEffect(() => {
    if (property) {
      const seoPayload = seoEngine.getPropertySeo(property);
      seoEngine.applyToDocument(seoPayload);
      seoEngine.injectMediaSeoMetadata({
        images: (property.media || []).map((m) => ({
          url: m.url,
          title: m.title || property.title,
          caption: m.caption,
          category: m.category || 'RESIDENCE',
          isCover: m.isCover,
        })),
        context: {
          entityType: 'PROPERTY',
          entityTitle: property.title,
          locality: property.location.microMarket || 'Pune',
          city: property.location.city || 'Pune',
          configuration: property.configuration,
          carpetAreaSqFt: property.carpetAreaSqFt,
          reraNumber: property.reraRecord?.registrationNumber,
        },
      });
    }
  }, [property]);

  const handlePropertyUpdated = (updated: Property) => {
    setProperty(updated);
    if (onPropertyUpdated) onPropertyUpdated(updated);
  };

  const isDark = theme === 'dark';

  return (
    <div className="relative">
      {/* ARCHETYPE SELECTOR BAR: Visual confirmation of tailored UI/UX */}
      <div className={`border-b py-2 px-4 sm:px-8 text-xs flex flex-wrap items-center justify-between gap-2.5 ${
        isDark ? 'bg-[#06080E] border-white/10 text-white/70' : 'bg-stone-50 border-stone-200 text-stone-700'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 font-mono">
            Bespoke UI/UX:
          </span>
          <span className="font-semibold text-xs text-current">
            {activeArchetype === 'STANDALONE_VILLA' && '🏰 Standalone Villa & Private Grounds Experience'}
            {activeArchetype === 'RESALE_APARTMENT' && '🏙️ Resale Apartment & Skyline Suite Experience'}
            {activeArchetype === 'COMMERCIAL_PRELEASED' && '📈 Institutional Commercial & Yield Terminal'}
            {activeArchetype === 'PLOT_LAND' && '📐 Collector NA Plot & Cadastral Dossier Experience'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          <span className="text-white/40 mr-1 hidden md:inline text-[10px]">Preview UI:</span>
          <button
            onClick={() => setActiveArchetype('STANDALONE_VILLA')}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
              activeArchetype === 'STANDALONE_VILLA'
                ? 'bg-amber-500/25 border-amber-500 text-amber-400 font-bold'
                : 'border-current/10 opacity-70 hover:opacity-100'
            }`}
          >
            <Home className="w-3 h-3" />
            <span>Villa UX</span>
          </button>
          <button
            onClick={() => setActiveArchetype('RESALE_APARTMENT')}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
              activeArchetype === 'RESALE_APARTMENT'
                ? 'bg-blue-500/25 border-blue-500 text-blue-400 font-bold'
                : 'border-current/10 opacity-70 hover:opacity-100'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Apartment UX</span>
          </button>
          <button
            onClick={() => setActiveArchetype('COMMERCIAL_PRELEASED')}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
              activeArchetype === 'COMMERCIAL_PRELEASED'
                ? 'bg-emerald-500/25 border-emerald-500 text-emerald-400 font-bold'
                : 'border-current/10 opacity-70 hover:opacity-100'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>Commercial UX</span>
          </button>
          <button
            onClick={() => setActiveArchetype('PLOT_LAND')}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
              activeArchetype === 'PLOT_LAND'
                ? 'bg-emerald-600/25 border-emerald-600 text-emerald-300 font-bold'
                : 'border-current/10 opacity-70 hover:opacity-100'
            }`}
          >
            <Trees className="w-3 h-3" />
            <span>Plot UX</span>
          </button>
        </div>
      </div>

      {/* RENDER SPECIFIC BESPOKE ARCHETYPE */}
      {activeArchetype === 'STANDALONE_VILLA' && (
        <StandaloneVillaExperienceView
          property={property}
          session={session}
          theme={theme}
          onBackToDiscovery={onBackToDiscovery}
          onOpenComparison={onOpenComparison}
          onPropertyUpdated={handlePropertyUpdated}
        />
      )}

      {activeArchetype === 'RESALE_APARTMENT' && (
        <ResaleApartmentExperienceView
          property={property}
          session={session}
          theme={theme}
          onBackToDiscovery={onBackToDiscovery}
          onOpenComparison={onOpenComparison}
          onPropertyUpdated={handlePropertyUpdated}
        />
      )}

      {activeArchetype === 'COMMERCIAL_PRELEASED' && (
        <CommercialPreLeasedExperienceView
          property={property}
          session={session}
          theme={theme}
          onBackToDiscovery={onBackToDiscovery}
          onOpenComparison={onOpenComparison}
          onPropertyUpdated={handlePropertyUpdated}
        />
      )}

      {activeArchetype === 'PLOT_LAND' && (
        <PlotLandExperienceView
          property={property}
          session={session}
          theme={theme}
          onBackToDiscovery={onBackToDiscovery}
          onOpenComparison={onOpenComparison}
          onPropertyUpdated={handlePropertyUpdated}
        />
      )}
    </div>
  );
};
