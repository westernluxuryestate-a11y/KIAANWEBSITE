import React from 'react';
import { Sparkles, Tag, Layers, CheckCircle2, Sliders, Calendar, Hash, Building } from 'lucide-react';
import { PROPERTY_CATEGORIES, PropertyCategory, TRANSACTION_TYPES, TransactionType } from '../../services/universalListingSchemaService';

interface PropertyBasicInfoTabProps {
  canModify: boolean;
  title: string;
  setTitle: (v: string) => void;
  headline: string;
  setHeadline: (v: string) => void;
  category: PropertyCategory;
  setCategory: (v: PropertyCategory) => void;
  subType: string;
  setSubType: (v: string) => void;
  transactionType: TransactionType;
  setTransactionType: (v: TransactionType) => void;
  listingPurpose: 'SELF_USE' | 'HIGH_YIELD_INVESTMENT' | 'DEVELOPMENT' | 'REDEVELOPMENT' | 'MIXED';
  setListingPurpose: (v: 'SELF_USE' | 'HIGH_YIELD_INVESTMENT' | 'DEVELOPMENT' | 'REDEVELOPMENT' | 'MIXED') => void;
  propertyStatus: 'NEW' | 'RESALE';
  setPropertyStatus: (v: 'NEW' | 'RESALE') => void;
  constructionStatus: 'READY_TO_MOVE' | 'UNDER_CONSTRUCTION';
  setConstructionStatus: (v: 'READY_TO_MOVE' | 'UNDER_CONSTRUCTION') => void;
  ageOfPropertyYears: string;
  setAgeOfPropertyYears: (v: string) => void;
  yearBuilt: string;
  setYearBuilt: (v: string) => void;
  yearRenovated: string;
  setYearRenovated: (v: string) => void;
  possessionStatus: 'READY_POSSESSION' | 'UNDER_CONSTRUCTION' | 'PRE_LAUNCH';
  setPossessionStatus: (v: 'READY_POSSESSION' | 'UNDER_CONSTRUCTION' | 'PRE_LAUNCH') => void;
  possessionDate: string;
  setPossessionDate: (v: string) => void;
  availabilityStatus: 'AVAILABLE' | 'HOLD' | 'RESERVED' | 'SOLD' | 'LEASED' | 'OFF_MARKET';
  setAvailabilityStatus: (v: 'AVAILABLE' | 'HOLD' | 'RESERVED' | 'SOLD' | 'LEASED' | 'OFF_MARKET') => void;
  propertyIdCode: string;
  setPropertyIdCode: (v: string) => void;
  internalRefId: string;
  setInternalRefId: (v: string) => void;
  // Dynamic helpers for headline generator
  bedroomsNumeric?: number | string;
  microMarket?: string;
  city?: string;
  facing?: string;
}

export const PropertyBasicInfoTab: React.FC<PropertyBasicInfoTabProps> = ({
  canModify,
  title,
  setTitle,
  headline,
  setHeadline,
  category,
  setCategory,
  subType,
  setSubType,
  transactionType,
  setTransactionType,
  listingPurpose,
  setListingPurpose,
  propertyStatus,
  setPropertyStatus,
  constructionStatus,
  setConstructionStatus,
  ageOfPropertyYears,
  setAgeOfPropertyYears,
  yearBuilt,
  setYearBuilt,
  yearRenovated,
  setYearRenovated,
  possessionStatus,
  setPossessionStatus,
  possessionDate,
  setPossessionDate,
  availabilityStatus,
  setAvailabilityStatus,
  propertyIdCode,
  setPropertyIdCode,
  internalRefId,
  setInternalRefId,
  bedroomsNumeric = '3',
  microMarket = 'Baner',
  city = 'Pune',
  facing = 'East-Facing',
}) => {
  const currentCategoryMeta = PROPERTY_CATEGORIES.find((c) => c.id === category) || PROPERTY_CATEGORIES[0];

  // Automatic generation of customer-friendly headline
  const handleAutoGenerateHeadline = () => {
    let generated = '';
    const cleanFacing = facing ? `${facing} ` : '';
    const loc = `${microMarket ? microMarket : 'Prime Area'}, ${city ? city : 'Pune'}`;

    if (category === 'RESIDENTIAL') {
      const bhk = bedroomsNumeric ? `${bedroomsNumeric} BHK ` : '';
      const txLabel = transactionType === 'RENT' ? 'for Rent' : transactionType === 'PRE_LEASE' ? 'Pre-Leased for Investment' : 'for Sale';
      generated = `Ultra-Luxury ${cleanFacing}${bhk}${subType} ${txLabel} in ${loc}`;
    } else if (category === 'COMMERCIAL') {
      const txLabel = transactionType === 'RENT' || transactionType === 'LEASE' ? 'for Corporate Lease' : transactionType === 'PRE_LEASE' ? 'High-Yield Pre-Leased Investment' : 'for Sale';
      generated = `Grade-A ${subType} ${txLabel} in ${loc}`;
    } else if (category === 'LAND_AND_PLOTS') {
      generated = `Clear Title Freehold ${subType} Available for Acquisition in ${loc}`;
    } else if (category === 'INDUSTRIAL') {
      generated = `Heavy-Duty Industrial ${subType} with High Eaves & Power in ${loc}`;
    } else if (category === 'HOSPITALITY') {
      generated = `Premium Turnkey ${subType} Operational Hospitality Asset in ${loc}`;
    } else {
      generated = `Prime ${subType} Strategic Asset in ${loc}`;
    }

    setHeadline(generated);
    if (!title.trim()) {
      setTitle(generated);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TITLE & AUTO-GENERATED HEADLINE */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
            <Tag className="w-3.5 h-3.5" />
            <span>Listing Title &amp; Customer-Friendly Headline</span>
          </span>
          <button
            type="button"
            onClick={handleAutoGenerateHeadline}
            disabled={!canModify}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Generate Headline</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white/90 block">
            Property Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            disabled={!canModify}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 4 BHK Imperial Sky Penthouse with Infinity Terrace"
            className="w-full px-4 py-2.5 rounded-xl border bg-black/40 border-white/10 text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white/90 block">
              Listing Headline (Customer-Friendly Marketing Headline)
            </label>
            <span className="text-[10px] text-white/50">Auto-generated based on specs, facing &amp; micro-market</span>
          </div>
          <div className="relative">
            <input
              type="text"
              disabled={!canModify}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Premium 3.5 BHK East-Facing Apartment for Sale in Baner, Pune"
              className="w-full px-4 py-2.5 rounded-xl border bg-black/40 border-amber-500/30 text-sm text-amber-200 focus:outline-none focus:border-amber-400 font-medium"
            />
          </div>
        </div>
      </div>

      {/* 2. CATEGORY, SUB-TYPE, TRANSACTION TYPE & LISTING PURPOSE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white/90 block">
            Property Category <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={!canModify}
            value={category}
            onChange={(e) => {
              const newCat = e.target.value as PropertyCategory;
              setCategory(newCat);
              const available = PROPERTY_CATEGORIES.find((c) => c.id === newCat)?.subTypes || [];
              if (available.length > 0) {
                setSubType(available[0]);
              }
            }}
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
          >
            {PROPERTY_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                {cat.name} ({cat.subTypes.length} sub-types)
              </option>
            ))}
          </select>
        </div>

        {/* Sub-Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white/90 flex items-center justify-between">
            <span>Property Sub-Type *</span>
            <span className="text-[10px] text-amber-400 font-mono">
              {currentCategoryMeta.subTypes.length} types
            </span>
          </label>
          <select
            disabled={!canModify}
            value={subType}
            onChange={(e) => setSubType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
          >
            {currentCategoryMeta.subTypes.map((sub) => (
              <option key={sub} value={sub} className="bg-slate-900 text-white">
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Transaction Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white/90 block">
            Transaction Type <span className="text-rose-400">*</span>
          </label>
          <select
            disabled={!canModify}
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as TransactionType)}
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
          >
            {TRANSACTION_TYPES.map((tx) => (
              <option key={tx.id} value={tx.id} className="bg-slate-900 text-white">
                {tx.label} ({tx.category})
              </option>
            ))}
          </select>
        </div>

        {/* Listing Purpose */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white/90 block">Listing Purpose</label>
          <select
            disabled={!canModify}
            value={listingPurpose}
            onChange={(e) => setListingPurpose(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="SELF_USE" className="bg-slate-900 text-white">End-User / Self Use</option>
            <option value="HIGH_YIELD_INVESTMENT" className="bg-slate-900 text-white">High-Yield Investment</option>
            <option value="DEVELOPMENT" className="bg-slate-900 text-white">Greenfield Development</option>
            <option value="REDEVELOPMENT" className="bg-slate-900 text-white">Society Redevelopment</option>
            <option value="MIXED" className="bg-slate-900 text-white">Mixed Strategic Use</option>
          </select>
        </div>
      </div>

      {/* 3. PROPERTY STATUS, NEW/RESALE, CONSTRUCTION STATUS & AGE */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <span className="text-xs font-bold text-white/70 block uppercase tracking-wide">
          Construction Stage, Age &amp; Possession Timeline
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">New vs Resale</label>
            <select
              disabled={!canModify}
              value={propertyStatus}
              onChange={(e) => setPropertyStatus(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="NEW" className="bg-slate-900 text-white">Brand New (Developer Fresh)</option>
              <option value="RESALE" className="bg-slate-900 text-white">Resale (Secondary Market)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Physical Stage</label>
            <select
              disabled={!canModify}
              value={constructionStatus}
              onChange={(e) => setConstructionStatus(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="READY_TO_MOVE" className="bg-slate-900 text-white">Ready to Move (OC Received)</option>
              <option value="UNDER_CONSTRUCTION" className="bg-slate-900 text-white">Under Construction</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Age of Property</label>
            <input
              type="text"
              disabled={!canModify}
              value={ageOfPropertyYears}
              onChange={(e) => setAgeOfPropertyYears(e.target.value)}
              placeholder="e.g. 0-1 Yr / 3 Yrs / Under Construction"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Year Built / Completed</label>
            <input
              type="text"
              disabled={!canModify}
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value)}
              placeholder="e.g. 2024"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Year Renovated (if any)</label>
            <input
              type="text"
              disabled={!canModify}
              value={yearRenovated}
              onChange={(e) => setYearRenovated(e.target.value)}
              placeholder="e.g. 2023"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Possession Status</label>
            <select
              disabled={!canModify}
              value={possessionStatus}
              onChange={(e) => setPossessionStatus(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="READY_POSSESSION" className="bg-slate-900 text-white">Immediate Ready Possession</option>
              <option value="UNDER_CONSTRUCTION" className="bg-slate-900 text-white">Under Active Construction</option>
              <option value="PRE_LAUNCH" className="bg-slate-900 text-white">Pre-Launch Early Booking</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Possession Date</label>
            <input
              type="text"
              disabled={!canModify}
              value={possessionDate}
              onChange={(e) => setPossessionDate(e.target.value)}
              placeholder="e.g. Immediate / Ready OC or Dec 2026"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Availability Status</label>
            <select
              disabled={!canModify}
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-bold"
            >
              <option value="AVAILABLE" className="bg-slate-900 text-white">AVAILABLE for Acquisition</option>
              <option value="HOLD" className="bg-slate-900 text-white">HOLD (Token Lock)</option>
              <option value="RESERVED" className="bg-slate-900 text-white">RESERVED (Under Agreement)</option>
              <option value="SOLD" className="bg-slate-900 text-white">SOLD / Fully Executed</option>
              <option value="LEASED" className="bg-slate-900 text-white">LEASED Out</option>
              <option value="OFF_MARKET" className="bg-slate-900 text-white">OFF-MARKET / Private</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. CODES & IDENTIFIERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white/90 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-amber-400" />
            <span>Property ID / Listing Code</span>
          </label>
          <input
            type="text"
            disabled={!canModify}
            value={propertyIdCode}
            onChange={(e) => setPropertyIdCode(e.target.value)}
            placeholder="e.g. KIAAN-PUN-BAN-9201"
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono font-bold text-amber-300"
          />
          <span className="text-[10px] text-white/50">Unique public alpha-numeric identification code</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white/90 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>Internal ERP / CRM Reference ID</span>
          </label>
          <input
            type="text"
            disabled={!canModify}
            value={internalRefId}
            onChange={(e) => setInternalRefId(e.target.value)}
            placeholder="e.g. SAP-ASSET-008291"
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-white/80"
          />
          <span className="text-[10px] text-white/50">Internal brokerage docket reference code</span>
        </div>
      </div>
    </div>
  );
};
