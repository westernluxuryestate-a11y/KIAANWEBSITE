/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Star,
  Building,
  ShieldCheck,
  Award,
  ThumbsUp,
  UserCheck,
  MessageSquare,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { PropertyReviewItem } from '../types';
import { SEED_CUSTOMER_REVIEWS } from '../data/experienceData';

interface CustomerReviewsSectionProps {
  theme?: 'dark' | 'light';
  reviews?: PropertyReviewItem[];
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  theme = 'dark',
  reviews = SEED_CUSTOMER_REVIEWS,
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'PROPERTY_EXPERIENCE' | 'KIAAN_SERVICE'>('PROPERTY_EXPERIENCE');
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, number>>({});

  const filteredReviews = reviews.filter((r) => r.reviewType === activeTab);

  const handleLike = (id: string, initialCount: number) => {
    setHelpfulLikes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialCount) + 1,
    }));
  };

  return (
    <div
      className={`p-6 sm:p-10 rounded-3xl border space-y-8 animate-fade-in ${
        isDark ? 'bg-[#0B101C] border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
      }`}
    >
      {/* 1. HEADER & SEGREGATED TABS (ITEM 118) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 border-current/10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs font-bold font-mono">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>VERIFIED BUYER & CLIENT EXPERIENCES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">Audited Customer Reviews</h2>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
            To maintain strict objectivity, Kiaan separates reviews of the <strong>Physical Property / Project</strong> from reviews of the <strong>Kiaan Advisory & Concierge Service</strong>.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          className={`p-1.5 rounded-2xl border inline-flex ${
            isDark ? 'bg-[#070A11] border-white/10' : 'bg-slate-100 border-slate-300'
          }`}
        >
          <button
            onClick={() => setActiveTab('PROPERTY_EXPERIENCE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'PROPERTY_EXPERIENCE'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Property & Living (4.9★)</span>
          </button>

          <button
            onClick={() => setActiveTab('KIAAN_SERVICE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'KIAAN_SERVICE'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Kiaan Advisory Service (5.0★)</span>
          </button>
        </div>
      </div>

      {/* 2. REVIEWS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => {
          const currentHelpful = helpfulLikes[rev.id] ?? rev.helpfulCount;
          return (
            <div
              key={rev.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${
                isDark ? 'bg-[#070A11] border-white/10' : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                {/* Rating & Verified Buyer Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(rev.ratingOverall)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-current/20'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-mono font-bold ml-1 text-amber-500">{rev.ratingOverall}.0</span>
                  </div>

                  {rev.verifiedBuyerBadge && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-sm leading-snug">"{rev.title}"</h3>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-white/75' : 'text-slate-600'}`}>
                  {rev.commentary}
                </p>

                {/* Aspect Ratings breakdown */}
                {rev.propertyAspectRatings && (
                  <div className="pt-2 border-t border-current/10 grid grid-cols-2 gap-1.5 text-[10px] font-mono opacity-80">
                    <div>Quality: {rev.propertyAspectRatings.constructionQuality}★</div>
                    <div>Acoustics: {rev.propertyAspectRatings.soundInsulationAndQuietness}★</div>
                    <div>Daylight: {rev.propertyAspectRatings.daylightAndVentilation}★</div>
                    <div>Upkeep: {rev.propertyAspectRatings.amenitiesUpkeep}★</div>
                  </div>
                )}

                {rev.serviceAspectRatings && (
                  <div className="pt-2 border-t border-current/10 grid grid-cols-2 gap-1.5 text-[10px] font-mono opacity-80">
                    <div>No-Brokerage: {rev.serviceAspectRatings.transparencyAndNoBrokerage}★</div>
                    <div>Maybach Visit: {rev.serviceAspectRatings.maybachSiteVisitHospitality}★</div>
                    <div>RERA Clarity: {rev.serviceAspectRatings.paperworkAndReraClarity}★</div>
                    <div>Twin Fidelity: {rev.serviceAspectRatings.digitalTwinAccuracy}★</div>
                  </div>
                )}
              </div>

              {/* Author & Helpful counter */}
              <div className="pt-4 border-t border-current/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold block truncate">{rev.authorName}</span>
                  <span className="text-[10px] opacity-50 block truncate">{rev.authorDesignation}</span>
                </div>

                <button
                  onClick={() => handleLike(rev.id, rev.helpfulCount)}
                  className="px-2.5 py-1 rounded-lg bg-current/5 border border-current/10 hover:bg-current/10 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ThumbsUp className="w-3 h-3 text-amber-500" />
                  <span>{currentHelpful}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
