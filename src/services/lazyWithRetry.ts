/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, ComponentType } from 'react';

/**
 * Resilient lazy loading wrapper that retries on dynamic import failures
 * and resolves both named and default exports seamlessly.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importer: () => Promise<any>,
  name?: string
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    const retryKey = 'chunk_retry_' + (name || 'component');
    const pageHasBeenForceRefreshed = typeof window !== 'undefined'
      ? sessionStorage.getItem(retryKey)
      : null;

    let lastError: any;
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const module = await importer();
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(retryKey);
        }
        const Component = (name && module?.[name]) || module?.default || module;
        if (!Component) {
          throw new Error(`Module does not export ${name || 'default'}`);
        }
        return { default: Component };
      } catch (error: any) {
        lastError = error;
        console.warn(`[lazyWithRetry] Attempt ${attempt + 1}/${maxRetries} failed for ${name || 'module'}:`, error);
        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
      }
    }

    // If dynamic import failed repeatedly due to stale chunk/build restart and hasn't reloaded yet
    if (
      !pageHasBeenForceRefreshed &&
      typeof window !== 'undefined' &&
      lastError?.message &&
      (lastError.message.includes('Failed to fetch dynamically imported module') ||
        lastError.message.includes('Loading chunk') ||
        lastError.message.includes('error loading dynamically imported module'))
    ) {
      sessionStorage.setItem(retryKey, 'true');
      console.info(`[lazyWithRetry] Stale module detected, reloading page for ${name || 'module'}...`);
      window.location.reload();
    }

    throw lastError;
  });
}
