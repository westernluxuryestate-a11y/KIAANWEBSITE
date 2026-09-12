/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Video,
  Eye,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Layers,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Shield,
  Compass,
} from 'lucide-react';
import { UniversalListingFormData } from '../../services/universalListingSchemaService';

interface StageMediaProps {
  formData: UniversalListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<UniversalListingFormData>>;
}

const SAMPLE_MEDIA_PACK = {
  coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  galleryPhotos: [
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      category: 'EXTERIOR' as const,
      caption: 'Main Tower Elevation & Landscaped Entrance',
      altText: 'Modern architectural elevation and grand entrance lobby',
      isCover: true,
    },
    {
      url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
      category: 'LIVING' as const,
      caption: 'Expansive Double-Height Living Room with Italian Marble',
      altText: 'Spacious living room area with daylight and high ceiling',
    },
    {
      url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      category: 'BEDROOM' as const,
      caption: 'Master Suite with Wooden Flooring & Private Sundeck',
      altText: 'Master bedroom with premium finishes',
    },
    {
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      category: 'KITCHEN' as const,
      caption: 'German Modular Island Kitchen with Quartz Countertops',
      altText: 'Modular kitchen with fitted appliances',
    },
    {
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      category: 'AMENITIES' as const,
      caption: 'Infinity-Edge Temperature-Controlled Swimming Pool',
      altText: 'Rooftop clubhouse and swimming pool',
    },
    {
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      category: 'BALCONY' as const,
      caption: 'Private Sundeck with Panoramic Unblocked Hills View',
      altText: 'Spacious open sundeck overlooking nature',
    },
  ],
  floorPlanUrls: [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  ],
  masterPlanUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
  sitePlanUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
  brochurePdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  costSheetPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  priceSheetPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  videoWalkthroughUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  virtualTour360Url: 'https://my.matterport.com/show/?m=sample',
  droneVideoUrl: 'https://www.youtube.com/watch?v=sample_drone',
  constructionUpdateVideoUrl: 'https://www.youtube.com/watch?v=sample_construction',
  sampleFlatVideoUrl: 'https://www.youtube.com/watch?v=sample_flat',
};

const PHOTO_CATEGORIES = [
  { value: 'EXTERIOR', label: 'Exterior Elevation' },
  { value: 'INTERIOR', label: 'General Interior' },
  { value: 'LIVING', label: 'Living Room' },
  { value: 'BEDROOM', label: 'Bedroom' },
  { value: 'BATHROOM', label: 'Bathroom' },
  { value: 'KITCHEN', label: 'Kitchen' },
  { value: 'BALCONY', label: 'Balcony / Deck' },
  { value: 'GARDEN', label: 'Garden / Lawn' },
  { value: 'AMENITIES', label: 'Amenities / Club' },
  { value: 'BUILDING', label: 'Building Lobby' },
  { value: 'PARKING', label: 'Parking Area' },
  { value: 'STREET', label: 'Street View' },
  { value: 'LOCATION', label: 'Neighborhood View' },
  { value: 'FLOOR_PLAN', label: 'Floor Plan' },
] as const;

export const StageMedia: React.FC<StageMediaProps> = ({
  formData,
  setFormData,
}) => {
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<string>('LIVING');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoAltText, setNewPhotoAltText] = useState('');

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        galleryPhotos: [
          ...(prev.media.galleryPhotos || []),
          {
            url: newPhotoUrl.trim(),
            category: newPhotoCategory as any,
            caption: newPhotoCaption.trim() || undefined,
            altText: newPhotoAltText.trim() || undefined,
          },
        ],
      },
    }));
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setNewPhotoAltText('');
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        galleryPhotos: prev.media.galleryPhotos.filter((_, i) => i !== index),
      },
    }));
  };

  const handleMovePhoto = (fromIdx: number, toIdx: number) => {
    setFormData((prev) => {
      const photos = [...(prev.media.galleryPhotos || [])];
      if (toIdx < 0 || toIdx >= photos.length) return prev;
      const [moved] = photos.splice(fromIdx, 1);
      photos.splice(toIdx, 0, moved);
      return {
        ...prev,
        media: {
          ...prev.media,
          galleryPhotos: photos,
        },
      };
    });
  };

  const handleSetCover = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        coverImageUrl: url,
      },
    }));
  };

  const handleLoadSamplePack = () => {
    setFormData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        ...SAMPLE_MEDIA_PACK,
      },
    }));
  };

  return (
    <div className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-6">
      <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-400" />
            21. Rich Media, Architectural Plans, Video Walkthroughs & Asset Branding
          </h3>
          <p className="text-xs opacity-70">
            Photos across all rooms, 360° tours, drone shots, plans, alt text, watermark, and copyright protections.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLoadSamplePack}
          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" /> Auto-Load HD Media Pack
        </button>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/90 flex items-center justify-between">
          <span>
            Primary Cover Image URL <span className="text-rose-400">*</span>
          </span>
          <span className="text-[10px] text-white/40">First image seen on search results & cards</span>
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={formData.media.coverImageUrl}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                media: { ...prev.media, coverImageUrl: e.target.value },
              }))
            }
            className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>

        {formData.media.coverImageUrl && (
          <div className="relative w-full sm:w-72 h-40 rounded-xl overflow-hidden border border-white/20 mt-2 group">
            <img
              src={formData.media.coverImageUrl}
              alt="Cover Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="px-2 py-1 rounded bg-amber-500 text-black font-bold text-[11px]">
                Active Cover Image
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Photo Gallery with Ordering & Alt text */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            Property Photo Gallery ({formData.media.galleryPhotos?.length || 0} Photos)
          </label>
          <span className="text-[10px] text-emerald-400 font-mono">+10% Quality Score (5+ Photos)</span>
        </div>

        {/* Gallery Thumbnails Grid with Order Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {(formData.media.galleryPhotos || []).map((photo, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden border border-white/10 group bg-black/40 flex flex-col justify-between"
            >
              <div className="h-28 overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.altText || photo.caption || 'Gallery photo'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-amber-300">
                  #{idx + 1} • {photo.category}
                </span>
              </div>
              <div className="p-2 space-y-1 bg-black/60">
                {photo.caption && (
                  <p className="text-[10px] text-white/90 truncate font-medium">{photo.caption}</p>
                )}
                {photo.altText && (
                  <p className="text-[9px] text-white/50 truncate">Alt: {photo.altText}</p>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMovePhoto(idx, idx - 1)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white/70"
                      title="Move Up / Earlier"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (formData.media.galleryPhotos?.length || 0) - 1}
                      onClick={() => handleMovePhoto(idx, idx + 1)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white/70"
                      title="Move Down / Later"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {formData.media.coverImageUrl !== photo.url && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(photo.url)}
                        className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-amber-500 hover:text-black text-white/80 transition-colors"
                      >
                        Make Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Gallery Photo Form */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
            <div className="sm:col-span-3">
              <input
                type="url"
                placeholder="Photo Image URL (https://...)"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/10 text-white text-xs font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <select
                value={newPhotoCategory}
                onChange={(e) => setNewPhotoCategory(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-black border border-white/10 text-white text-[11px]"
              >
                {PHOTO_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-1">
              <button
                type="button"
                onClick={handleAddPhoto}
                disabled={!newPhotoUrl.trim()}
                className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Caption (e.g., Sundeck overlooking Baner hills)"
              value={newPhotoCaption}
              onChange={(e) => setNewPhotoCaption(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/10 text-white text-xs"
            />
            <input
              type="text"
              placeholder="Alt Text for Accessibility & SEO"
              value={newPhotoAltText}
              onChange={(e) => setNewPhotoAltText(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/10 text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* Floor Plans, Master Plan & Site Plan */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <label className="text-xs font-bold text-amber-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          Architectural Floor Plans, Master Plan & Site Plan
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">
              Unit Floor Plan URL (2D / 3D Layout)
            </span>
            <input
              type="url"
              placeholder="https://..."
              value={formData.media.floorPlanUrls[0] || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  media: {
                    ...prev.media,
                    floorPlanUrls: e.target.value ? [e.target.value] : [],
                  },
                }))
              }
              className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">
              Master Plan / Cluster Layout URL
            </span>
            <input
              type="url"
              placeholder="https://..."
              value={formData.media.masterPlanUrl || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  media: { ...prev.media, masterPlanUrl: e.target.value },
                }))
              }
              className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-white/70 block">
              Site / Landscape Plan URL
            </span>
            <input
              type="url"
              placeholder="https://..."
              value={formData.media.sitePlanUrl || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  media: { ...prev.media, sitePlanUrl: e.target.value },
                }))
              }
              className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Videos, Drone & 360° Tours */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <label className="text-xs font-bold text-white flex items-center gap-2">
          <Video className="w-4 h-4 text-rose-400" />
          Cinematic Videos, Drone Aerials & 360° Virtual Tours
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-white/80 block">Video Walkthrough (YouTube / Vimeo)</label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.media.videoWalkthroughUrl || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  media: { ...prev.media, videoWalkthroughUrl: e.target.value },
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-white/80 block">360° Virtual Tour / Matterport</label>
            <input
              type="url"
              placeholder="https://my.matterport.com/show/?m=..."
              value={formData.media.virtualTour360Url || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  media: { ...prev.media, virtualTour360Url: e.target.value },
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-white/80 block">Drone Aerial Video URL</label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=drone_..."
              value={formData.media.droneVideoUrl || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  media: { ...prev.media, droneVideoUrl: e.target.value },
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-white/80 block">Construction Update Video</label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=progress_..."
              value={formData.media.constructionUpdateVideoUrl || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  media: { ...prev.media, constructionUpdateVideoUrl: e.target.value },
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-white/80 block">Sample Flat Video Tour</label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=sample_flat_..."
              value={formData.media.sampleFlatVideoUrl || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  media: { ...prev.media, sampleFlatVideoUrl: e.target.value },
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Brochure, Cost Sheet & Price Sheet Downloads */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-400" /> Official Brochure PDF
          </label>
          <input
            type="url"
            placeholder="https://.../brochure.pdf"
            value={formData.media.brochurePdfUrl || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                media: { ...prev.media, brochurePdfUrl: e.target.value },
              }))
            }
            className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" /> Cost Sheet Breakdown PDF
          </label>
          <input
            type="url"
            placeholder="https://.../cost-sheet.pdf"
            value={formData.media.costSheetPdfUrl || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                media: { ...prev.media, costSheetPdfUrl: e.target.value },
              }))
            }
            className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-400" /> Price List / Payment Matrix PDF
          </label>
          <input
            type="url"
            placeholder="https://.../price-sheet.pdf"
            value={formData.media.priceSheetPdfUrl || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                media: { ...prev.media, priceSheetPdfUrl: e.target.value },
              }))
            }
            className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
          />
        </div>
      </div>

      {/* Watermark, Copyright & Attribution Branding */}
      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <label className="flex items-center gap-2 cursor-pointer text-white/90">
          <input
            type="checkbox"
            checked={(formData.media as any)?.applyWatermark ?? true}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                media: { ...(prev.media || {}), applyWatermark: e.target.checked } as any,
              }))
            }
            className="rounded text-amber-500"
          />
          <span className="font-semibold text-amber-300">
            Apply Official Kiaan Properties Watermark to Media
          </span>
        </label>

        <div className="flex items-center gap-2 min-w-[280px]">
          <Shield className="w-3.5 h-3.5 text-white/50" />
          <input
            type="text"
            placeholder="Copyright / Attribution (e.g. © 2026 Kiaan Properties)"
            value={(formData.media as any)?.copyrightInfo || '© 2026 Kiaan Properties. All rights reserved.'}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                media: { ...(prev.media || {}), copyrightInfo: e.target.value } as any,
              }))
            }
            className="flex-1 px-2.5 py-1 rounded bg-black/50 border border-white/10 text-white text-[11px]"
          />
        </div>
      </div>
    </div>
  );
};

