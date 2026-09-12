/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Layers,
  Building2,
  Home,
  SlidersHorizontal,
  IndianRupee,
  MapPin,
  Sparkles,
  ShieldCheck,
  Upload,
  Calendar,
  Phone,
  Check,
} from 'lucide-react';
import { TransactionType, PropertyCategory } from '../../services/universalListingSchemaService';

export interface HierarchyStageDef {
  step: number;
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const FORM_HIERARCHY_STAGES: HierarchyStageDef[] = [
  { step: 1, id: 'TRANSACTION_TYPE', title: 'Transaction Type', shortTitle: '1. Transaction', description: 'Sale, Rent, Lease, Pre-Lease, Auction, JV', icon: Layers },
  { step: 2, id: 'PROPERTY_CATEGORY', title: 'Property Category', shortTitle: '2. Category', description: 'Residential, Commercial, Land, Industrial, Hospitality', icon: Building2 },
  { step: 3, id: 'PROPERTY_SUB_TYPE', title: 'Property Sub-Type', shortTitle: '3. Sub-Type', description: 'Dynamic sub-types matching category strictly', icon: Home },
  { step: 4, id: 'PROPERTY_PURPOSE', title: 'Property Purpose', shortTitle: '4. Purpose', description: 'Self-use, High-yield investment, Redevelopment', icon: SlidersHorizontal },
  { step: 5, id: 'PROPERTY_DETAILS', title: 'Property Details', shortTitle: '5. Details', description: 'Strictly conditional specifications by category', icon: SlidersHorizontal },
  { step: 6, id: 'PRICING', title: 'Pricing & Terms', shortTitle: '6. Pricing', description: 'Calculated acquisition, rental yield, or auction terms', icon: IndianRupee },
  { step: 7, id: 'LOCATION', title: 'Location & Map', shortTitle: '7. Location', description: 'Micro-market, address, PIN & transit proximity', icon: MapPin },
  { step: 8, id: 'AMENITIES_PARKING', title: 'Amenities & Parking', shortTitle: '8. Amenities', description: 'Searchable lifestyle features & parking slots', icon: Sparkles },
  { step: 9, id: 'LEGAL_DOCS', title: 'Legal & Documentation', shortTitle: '9. Legal', description: 'MahaRERA ID, Title deeds, 7/12 extract, NOCs', icon: ShieldCheck },
  { step: 10, id: 'MEDIA_ASSETS', title: 'Media & Digital Assets', shortTitle: '10. Media', description: 'Cover photo, gallery, floor plans & brochure', icon: Upload },
  { step: 11, id: 'AVAILABILITY', title: 'Availability & Possession', shortTitle: '11. Availability', description: 'Possession date, property age, condition & status', icon: Calendar },
  { step: 12, id: 'CONTACT_LEADS', title: 'Contact & Lead Info', shortTitle: '12. Contact', description: 'Owner/Broker details & high-conversion CTAs', icon: Phone },
];

interface FormHierarchyBreadcrumbsProps {
  activeStep: number;
  onSelectStep: (step: number) => void;
  selectedCategory: PropertyCategory;
  selectedTransaction: TransactionType;
}

export const FormHierarchyBreadcrumbs: React.FC<FormHierarchyBreadcrumbsProps> = ({
  activeStep,
  onSelectStep,
  selectedCategory,
  selectedTransaction,
}) => {
  const progressPercent = Math.round((activeStep / FORM_HIERARCHY_STAGES.length) * 100);

  return (
    <div className="space-y-2.5">
      {/* Progress Bar & Context Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400">Core Hierarchy Progress:</span>
          <span className="text-white/80 font-mono">
            Stage {activeStep} of 12 ({progressPercent}%)
          </span>
          <span className="hidden sm:inline-block text-white/40">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 text-[11px]">
            <span className="text-amber-400 font-bold">{selectedTransaction.replace(/_/g, ' ')}</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-bold">{selectedCategory.replace(/_/g, ' ')}</span>
          </span>
        </div>

        <div className="text-[11px] text-white/50">
          Click any stage to navigate directly
        </div>
      </div>

      {/* Visual Progress Track */}
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 12-Stage Horizontal Stepper */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-white/20">
        {FORM_HIERARCHY_STAGES.map((s) => {
          const IconComp = s.icon;
          const isActive = activeStep === s.step;
          const isPassed = activeStep > s.step;

          return (
            <button
              key={s.step}
              type="button"
              onClick={() => onSelectStep(s.step)}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-black shadow-md font-bold scale-[1.02]'
                  : isPassed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
              title={`${s.title}: ${s.description}`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                  isActive
                    ? 'bg-black text-amber-400 font-bold'
                    : isPassed
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-white/10 text-white/80'
                }`}
              >
                {isPassed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : s.step}
              </span>
              <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-black' : isPassed ? 'text-emerald-400' : 'text-white/60'}`} />
              <span>{s.shortTitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
