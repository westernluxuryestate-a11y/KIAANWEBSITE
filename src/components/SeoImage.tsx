/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { seoEngine, MediaAltContext } from '../services/seoAndMetadataEngine';
import { Image as ImageIcon } from 'lucide-react';

export interface SeoImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  context?: MediaAltContext;
  fallbackSrc?: string;
  priority?: boolean;
  className?: string;
  aspectRatio?: string;
  showSeoBadge?: boolean;
  onImageLoad?: () => void;
}

export const SeoImage: React.FC<SeoImageProps> = ({
  src,
  alt,
  context,
  fallbackSrc = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
  priority = false,
  className = '',
  aspectRatio,
  showSeoBadge = false,
  onImageLoad,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Compute automated descriptive ALT text if not supplied directly
  const computedAlt = alt && alt.trim().length > 10
    ? alt
    : context
    ? seoEngine.generateMediaAltText(context)
    : alt || 'Kiaan Properties Luxury Real Estate Media Asset';

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
    if (onImageLoad) onImageLoad();
  };

  return (
    <div
      className={`relative overflow-hidden ${aspectRatio || ''}`}
      itemScope
      itemType="https://schema.org/ImageObject"
    >
      <meta itemProp="contentUrl" content={imgSrc} />
      <meta itemProp="name" content={computedAlt} />
      <meta itemProp="description" content={computedAlt} />

      <img
        src={imgSrc}
        alt={computedAlt}
        title={computedAlt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        itemProp="image"
        data-seo-enriched="true"
        data-seo-alt={computedAlt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...rest}
      />

      {/* Subtle loader shimmer before image arrives */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center pointer-events-none">
          <ImageIcon className="w-5 h-5 text-white/20" />
        </div>
      )}

      {/* Optional SEO inspector pill badge */}
      {showSeoBadge && isLoaded && (
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[9px] text-amber-300 font-mono tracking-tight pointer-events-none">
          SEO Alt Injected
        </div>
      )}
    </div>
  );
};
