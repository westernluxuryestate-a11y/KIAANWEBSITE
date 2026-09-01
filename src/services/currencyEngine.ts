/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCY_REGISTRY: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    label: 'Indian Rupee',
    ratePerINR: 1,
    inrPerUnit: 1,
    locale: 'en-IN',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'US Dollar',
    ratePerINR: 0.0116, // ~ 1 USD = 86.2 INR
    inrPerUnit: 86.2,
    locale: 'en-US',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    label: 'British Pound',
    ratePerINR: 0.0091, // ~ 1 GBP = 109.8 INR
    inrPerUnit: 109.8,
    locale: 'en-GB',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: 'Euro',
    ratePerINR: 0.0108, // ~ 1 EUR = 92.5 INR
    inrPerUnit: 92.5,
    locale: 'de-DE',
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    label: 'UAE Dirham',
    ratePerINR: 0.0426, // ~ 1 AED = 23.47 INR
    inrPerUnit: 23.47,
    locale: 'en-AE',
  },
};

/**
 * Statutory Currency Disclaimer as strictly required:
 * Official Indian property price remains INR. Converted currency should be labelled as an estimate.
 */
export const STATUTORY_CURRENCY_DISCLAIMER =
  'Official Indian property prices and statutory agreements remain strictly in INR (₹). Converted foreign currency values are indicative estimates calculated for reference based on prevailing benchmark exchange rates.';

/**
 * Convert INR amount into target currency with luxury formatting
 */
export function convertCurrency(
  amountINR: number,
  targetCurrency: CurrencyCode = 'INR'
): {
  targetCode: CurrencyCode;
  amount: number;
  formatted: string;
  inrOriginal: number;
  inrFormatted: string;
  isEstimate: boolean;
  disclaimer: string;
} {
  const config = CURRENCY_REGISTRY[targetCurrency] || CURRENCY_REGISTRY.INR;
  const convertedAmount = amountINR * config.ratePerINR;

  let formatted = '';
  if (targetCurrency === 'INR') {
    formatted = formatINR(amountINR);
  } else {
    // Format foreign currency nicely (e.g. $1.42M or $185K)
    if (convertedAmount >= 1_000_000) {
      formatted = `${config.symbol} ${(convertedAmount / 1_000_000).toFixed(2)}M`;
    } else if (convertedAmount >= 1_000) {
      formatted = `${config.symbol} ${Math.round(convertedAmount).toLocaleString(config.locale)}`;
    } else {
      formatted = `${config.symbol} ${convertedAmount.toFixed(2)}`;
    }
  }

  return {
    targetCode: targetCurrency,
    amount: convertedAmount,
    formatted,
    inrOriginal: amountINR,
    inrFormatted: formatINR(amountINR),
    isEstimate: targetCurrency !== 'INR',
    disclaimer: STATUTORY_CURRENCY_DISCLAIMER,
  };
}

/**
 * Indian currency format helper (Lakh / Crore)
 */
export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹${cr.replace(/\.00$/, '')} Cr`;
  }
  if (amount >= 100000) {
    const lk = (amount / 100000).toFixed(2);
    return `₹${lk.replace(/\.00$/, '')} L`;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}
