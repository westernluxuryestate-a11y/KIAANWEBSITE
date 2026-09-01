/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShareEntityType, SharePackage, ShareablePropertyCardData } from '../types';
import { convertCurrency, formatINR } from './currencyEngine';

export function createSharePackage(params: {
  entityType: ShareEntityType;
  entityId: string;
  title: string;
  subtitle: string;
  priceINR: number;
  locationName: string;
  configuration: string;
  matchScorePercent?: number;
  heroImageUrl: string;
  deepLinkPath: string;
}): {
  sharePackage: SharePackage;
  cardData: ShareablePropertyCardData;
} {
  const {
    entityType,
    entityId,
    title,
    subtitle,
    priceINR,
    locationName,
    configuration,
    matchScorePercent = 94,
    heroImageUrl,
    deepLinkPath,
  } = params;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kiaanproperties.com';
  const fullUrl = `${origin}/#${deepLinkPath.replace(/^#?\/?/, '')}`;
  const priceFormatted = formatINR(priceINR);
  const usdConverted = convertCurrency(priceINR, 'USD');

  // WhatsApp rich formatted text
  const whatsappMessageText = `✨ *${title}* — ${subtitle}
📍 *Location*: ${locationName}
📐 *Configuration*: ${configuration}
💰 *Price*: ${priceFormatted} (${usdConverted.formatted} approx)
⭐ *AI Match Score*: ${matchScorePercent}%

Explore full 3D Digital Twin, floorplans & MahaRERA compliance:
👉 ${fullUrl}

_Discovered on Kiaan Luxury Real Estate Experience_`;

  // Social share snippet
  const socialShareSnippet = `Exploring ${title} in ${locationName} (${configuration}, ${priceFormatted}) on Kiaan Estates. Features 3D architectural digital twin & verified MahaRERA escrow data: ${fullUrl}`;

  // Email subject & body HTML
  const emailSubject = `Kiaan Luxury Property Discovery: ${title} (${locationName})`;
  const emailBodyHtml = `
Hello,

I wanted to share this luxury property on Kiaan Estates:

Residence: ${title}
Location: ${locationName}
Configuration: ${configuration}
Acquisition Price: ${priceFormatted} (${usdConverted.formatted} approx)
Match Confidence: ${matchScorePercent}%

View the interactive 3D digital experience and architectural floorplans here:
${fullUrl}

Kiaan Financial Intelligence™ Suite
  `.trim();

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(fullUrl)}`;

  const sharePackage: SharePackage = {
    entityType,
    entityId,
    title,
    subtitle,
    priceINR,
    priceFormatted,
    locationName,
    configuration,
    matchScorePercent,
    heroImageUrl,
    shareableUrl: fullUrl,
    whatsappMessageText,
    socialShareSnippet,
    emailSubject,
    emailBodyHtml,
  };

  const cardData: ShareablePropertyCardData = {
    appName: 'Kiaan',
    headline: 'I found this on Kiaan',
    configuration: `${configuration} • ${locationName}`,
    priceDisplay: priceFormatted,
    convertedPriceDisplay: usdConverted.formatted,
    matchScore: matchScorePercent,
    imageUrl: heroImageUrl,
    qrCodeUrl,
    exploreLink: fullUrl,
  };

  return { sharePackage, cardData };
}

/**
 * Trigger native mobile/browser share or copy to clipboard
 */
export async function executeShare(
  sharePkg: SharePackage,
  channel: 'WHATSAPP' | 'EMAIL' | 'NATIVE_OR_CLIPBOARD' | 'TWITTER' | 'LINKEDIN'
): Promise<{ success: boolean; message: string }> {
  if (channel === 'WHATSAPP') {
    const encoded = encodeURIComponent(sharePkg.whatsappMessageText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    return { success: true, message: 'Opening WhatsApp...' };
  }

  if (channel === 'EMAIL') {
    const subject = encodeURIComponent(sharePkg.emailSubject);
    const body = encodeURIComponent(sharePkg.whatsappMessageText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    return { success: true, message: 'Opening email client...' };
  }

  if (channel === 'TWITTER') {
    const text = encodeURIComponent(sharePkg.socialShareSnippet);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    return { success: true, message: 'Opening X/Twitter...' };
  }

  if (channel === 'LINKEDIN') {
    const url = encodeURIComponent(sharePkg.shareableUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    return { success: true, message: 'Opening LinkedIn...' };
  }

  // Native share or clipboard
  if (navigator.share) {
    try {
      await navigator.share({
        title: sharePkg.title,
        text: sharePkg.whatsappMessageText,
        url: sharePkg.shareableUrl,
      });
      return { success: true, message: 'Shared successfully!' };
    } catch (e) {
      // User cancelled or fallback
    }
  }

  // Fallback: clipboard copy
  try {
    await navigator.clipboard.writeText(sharePkg.shareableUrl);
    return { success: true, message: 'Link copied to clipboard!' };
  } catch (e) {
    return { success: false, message: 'Could not copy link to clipboard.' };
  }
}
