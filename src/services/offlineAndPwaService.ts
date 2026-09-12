/**
 * Kiaan Properties - PWA, Service Worker & Low-Network Offline Resilience Service
 * Implements Items 141 & 142
 */

import { Project, Property } from '../types';

export interface NetworkHealthState {
  isOnline: boolean;
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | 'offline';
  downlinkSpeedMbps: number;
  isLowNetwork: boolean;
  lastOnlineTimestamp: number;
}

export class OfflineAndPwaService {
  private static instance: OfflineAndPwaService;
  private deferredPrompt: any = null;
  private networkListeners: ((state: NetworkHealthState) => void)[] = [];
  private cachedRecentlyViewedKey = 'kiaan_recent_views_offline_cache';
  private cachedSavedPropertiesKey = 'kiaan_saved_properties_offline_cache';

  private currentState: NetworkHealthState = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    effectiveType: '4g',
    downlinkSpeedMbps: 10,
    isLowNetwork: false,
    lastOnlineTimestamp: Date.now(),
  };

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initNetworkMonitoring();
      this.initPwaEvents();
    }
  }

  public static getInstance(): OfflineAndPwaService {
    if (!OfflineAndPwaService.instance) {
      OfflineAndPwaService.instance = new OfflineAndPwaService();
    }
    return OfflineAndPwaService.instance;
  }

  /**
   * Register the Service Worker
   */
  public registerServiceWorker(): void {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const isDev = Boolean((import.meta as any).env?.DEV || window.location.hostname === 'localhost' || window.location.hostname.includes('ais-dev'));
      if (isDev) {
        // In Vite development mode, unregister any active service worker to prevent cached module conflicts
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        });
        if ('caches' in window) {
          caches.keys().then((names) => {
            names.forEach((name) => {
              if (name.includes('kiaan-cache')) {
                caches.delete(name);
              }
            });
          });
        }
        return;
      }

      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[PWA] Service Worker registration failed:', error);
          });
      });
    }
  }

  private initPwaEvents(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      window.dispatchEvent(new CustomEvent('kiaan_pwa_installable'));
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      console.log('[PWA] App successfully installed');
    });
  }

  /**
   * Prompt user to install PWA (Item 141)
   */
  public async promptInstall(): Promise<'ACCEPTED' | 'DISMISSED' | 'UNAVAILABLE'> {
    if (!this.deferredPrompt) {
      return 'UNAVAILABLE';
    }
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    return outcome === 'accepted' ? 'ACCEPTED' : 'DISMISSED';
  }

  public isInstallable(): boolean {
    return this.deferredPrompt !== null;
  }

  /**
   * Request Push Notification Permission (Item 141)
   */
  public async requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      return 'denied';
    }
  }

  /**
   * Network connection listener & low bandwidth detector
   */
  private initNetworkMonitoring(): void {
    const updateState = () => {
      const isOnline = navigator.onLine;
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

      let effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | 'offline' = isOnline ? '4g' : 'offline';
      let downlink = 10;

      if (conn) {
        effectiveType = isOnline ? conn.effectiveType || '4g' : 'offline';
        downlink = conn.downlink || 10;
      }

      const isLowNetwork = !isOnline || effectiveType === '2g' || effectiveType === 'slow-2g' || downlink < 1.0;

      this.currentState = {
        isOnline,
        effectiveType,
        downlinkSpeedMbps: downlink,
        isLowNetwork,
        lastOnlineTimestamp: isOnline ? Date.now() : this.currentState.lastOnlineTimestamp,
      };

      this.networkListeners.forEach((fn) => fn(this.currentState));
    };

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);

    const conn = (navigator as any).connection;
    if (conn) {
      conn.addEventListener('change', updateState);
    }

    updateState();
  }

  public subscribeNetworkStatus(callback: (state: NetworkHealthState) => void): () => void {
    this.networkListeners.push(callback);
    callback(this.currentState);
    return () => {
      this.networkListeners = this.networkListeners.filter((cb) => cb !== callback);
    };
  }

  public getNetworkState(): NetworkHealthState {
    return this.currentState;
  }

  /**
   * Cache recently viewed projects/properties in local storage (Item 142)
   */
  public cacheRecentView(item: { id: string; type: 'PROJECT' | 'PROPERTY'; title: string; subtitle: string; imageUrl: string; priceINR?: number }): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const existing = this.getCachedRecentViews();
      const filtered = existing.filter((x) => x.id !== item.id);
      const updated = [item, ...filtered].slice(0, 15);
      localStorage.setItem(this.cachedRecentlyViewedKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to cache recent view:', e);
    }
  }

  public getCachedRecentViews(): Array<{ id: string; type: 'PROJECT' | 'PROPERTY'; title: string; subtitle: string; imageUrl: string; priceINR?: number }> {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.cachedRecentlyViewedKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Cache saved properties for full offline access (Item 142)
   */
  public cacheSavedProperties(properties: Property[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.cachedSavedPropertiesKey, JSON.stringify(properties));
    } catch (e) {
      console.warn('Failed to cache saved properties:', e);
    }
  }

  public getCachedSavedProperties(): Property[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.cachedSavedPropertiesKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Retry failed network requests with exponential backoff (Item 142)
   */
  public async retryFetch<T>(
    fetcher: () => Promise<T>,
    maxRetries = 3,
    baseDelayMs = 800
  ): Promise<T> {
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        return await fetcher();
      } catch (err) {
        attempts++;
        if (attempts >= maxRetries) {
          throw err;
        }
        const delay = baseDelayMs * Math.pow(2, attempts - 1) + Math.random() * 200;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error('Network request failed after maximum retries');
  }
}

export const offlineAndPwaService = OfflineAndPwaService.getInstance();
