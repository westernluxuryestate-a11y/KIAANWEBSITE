/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  Store,
  Warehouse,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Zap,
  Truck,
  Eye,
  Layers,
  ArrowUpRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Share2,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { CurrencyCode, Property } from '../types';
import { convertCurrency, formatINR } from '../services/currencyEngine';

interface CommercialExperienceViewProps {
  properties: Property[];
  currency?: CurrencyCode;
  onSelectProperty?: (prop: Property) => void;
  onOpenDocCenter?: (prop: Property) => void;
  onOpenShare?: (prop: Property) => void;
  onOpenReport?: (prop: Property) => void;
  theme?: 'dark' | 'light';
}

export const CommercialExperienceView: React.FC<CommercialExperienceViewProps> = ({
  properties,
  currency = 'INR',
  onSelectProperty,
  onOpenDocCenter,
  onOpenShare,
  onOpenReport,
  theme = 'dark',
}) => {
  const [commercialTypeFilter, setCommercialTypeFilter] = useState<'ALL' | 'OFFICE' | 'RETAIL' | 'WAREHOUSE'>('ALL');

  const isDark = theme === 'dark';

  // Filter commercial properties
  const commercialProps = properties.filter((p) => {
    const isCommercial = ['COMMERCIAL_OFFICE', 'RETAIL', 'WAREHOUSE', 'INDUSTRIAL'].includes(p.propertyType);
    if (!isCommercial) return false;
    if (commercialTypeFilter === 'ALL') return true;
    if (commercialTypeFilter === 'OFFICE' && p.propertyType === 'COMMERCIAL_OFFICE') return true;
    if (commercialTypeFilter === 'RETAIL' && p.propertyType === 'RETAIL') return true;
    if (commercialTypeFilter === 'WAREHOUSE' && ['WAREHOUSE', 'INDUSTRIAL'].includes(p.propertyType)) return true;
    return false;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* COMMERCIAL HEADER BANNER */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          isDark
            ? 'bg-gradient-to-r from-[#0C1222] via-[#090F1C] to-[#040810] border-amber-500/30 text-white'
            : 'bg-gradient-to-r from-slate-50 via-white to-slate-100 border-slate-200 text-slate-900 shadow-lg'
        }`}
      >
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
              Institutional & Commercial Intelligence™
            </span>
            <span className="text-[10px] font-mono opacity-60">Items 108 & 109</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
            Grade-A Commercial Offices, Flagship Retail & Logistics Parks
          </h2>
          <p className="text-xs opacity-75 leading-relaxed">
            Evaluated by specialized institutional metrics: main-road frontage, pedestrian footfall density, dock levelers, truck turning aprons, clear ceiling heights & pre-leased rental yields.
          </p>
        </div>

        {/* TYPE FILTER PILLS */}
        <div className="flex flex-wrap gap-2 flex-shrink-0">
          {[
            { key: 'ALL', label: 'All Commercial Assets', icon: Layers },
            { key: 'RETAIL', label: 'High-Street Retail', icon: Store },
            { key: 'WAREHOUSE', label: 'Logistics & Warehousing', icon: Warehouse },
            { key: 'OFFICE', label: 'Grade-A IT Offices', icon: Building2 },
          ].map((tab) => {
            const isSelected = commercialTypeFilter === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setCommercialTypeFilter(tab.key as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : isDark
                    ? 'bg-white/5 hover:bg-white/10 text-white/70'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* COMMERCIAL ASSETS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {commercialProps.map((prop) => {
          const isRetail = prop.propertyType === 'RETAIL';
          const isWarehouse = ['WAREHOUSE', 'INDUSTRIAL'].includes(prop.propertyType);
          const isOffice = prop.propertyType === 'COMMERCIAL_OFFICE';

          const priceConv = convertCurrency(prop.pricing?.basePrice || 48000000, (currency || 'INR') as CurrencyCode);

          return (
            <div
              key={prop.id}
              className={`rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col group ${
                isDark
                  ? 'bg-[#090E1B] border-white/10 hover:border-amber-500/50 text-white shadow-xl'
                  : 'bg-white border-slate-200 hover:border-amber-400 text-slate-900 shadow-md'
              }`}
            >
              {/* IMAGE & BADGES */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={prop.media?.[0]?.url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                    {isRetail && <Store className="w-3 h-3" />}
                    {isWarehouse && <Warehouse className="w-3 h-3" />}
                    {isOffice && <Building2 className="w-3 h-3" />}
                    <span>{prop.propertyType.replace('_', ' ')}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-emerald-500/90 text-black font-bold">
                    MahaRERA: {prop.reraRecord?.registrationNumber}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs text-amber-300 font-medium">{prop.location?.microMarket}, {prop.location?.city}</span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold line-clamp-1">{prop.title}</h3>
                </div>
              </div>

              {/* SPECIFICATION CARD BODY */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                {/* SPECIALIZED COMMERCIAL SPECS (ITEM 109) */}
                <div
                  className={`p-4 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block">
                    Institutional Specification Metrics
                  </span>

                  {isRetail && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase">Main Frontage</span>
                        <strong className="text-sm font-bold text-amber-400">72 Feet Continuous</strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase">Pedestrian Footfall</span>
                        <strong className="text-sm font-bold">18,500 / Day</strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase">Ceiling Height</span>
                        <strong className="text-sm font-bold">18.5 Ft Clear</strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase">Signage Rights</span>
                        <strong className="text-sm font-bold text-emerald-400">Exclusive Pylon</strong>
                      </div>
                    </div>
                  )}

                  {isWarehouse && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase">Clear Height</span>
                        <strong className="text-sm font-bold text-amber-400">38 Feet Hook</strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase">Dock Levelers</span>
                        <strong className="text-sm font-bold">12 Motorized</strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase">Turning Apron</span>
                        <strong className="text-sm font-bold">42m Multi-Axle</strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase">Floor Capacity</span>
                        <strong className="text-sm font-bold text-emerald-400">FM-2 (8T/sq.m)</strong>
                      </div>
                    </div>
                  )}

                  {isOffice && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase">Floorplate</span>
                        <strong className="text-sm font-bold text-amber-400">18,500 sq.ft</strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase">Efficiency</span>
                        <strong className="text-sm font-bold">84% Super-to-Carpet</strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase">Elevators</span>
                        <strong className="text-sm font-bold">8 High-Speed</strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase">Power Backup</span>
                        <strong className="text-sm font-bold text-emerald-400">100% Dual DG</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* PRICING & YIELD */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">
                      Acquisition Value
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-xl font-bold text-amber-400">
                        {priceConv.inrFormatted}
                      </span>
                      {priceConv.isEstimate && (
                        <span className="text-xs opacity-60">
                          (~{priceConv.formatted})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">
                      Target Rental Yield
                    </span>
                    <span className="text-sm font-bold text-emerald-400">
                      {isRetail ? '7.8% - 8.4% p.a.' : isWarehouse ? '8.9% - 9.6% p.a.' : '7.2% - 7.6% p.a.'}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-current/10">
                  <button
                    onClick={() => onOpenDocCenter && onOpenDocCenter(prop)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="View MahaRERA Sanctions & Title"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Documents</span>
                  </button>

                  <button
                    onClick={() => onOpenReport && onOpenReport(prop)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Generate Institutional Dossier"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>

                  <button
                    onClick={() => onOpenShare && onOpenShare(prop)}
                    className="py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black shadow-md cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
