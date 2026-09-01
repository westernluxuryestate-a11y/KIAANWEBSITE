/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  StructuredAnalyticsEvent,
  StructuredEventName,
  WebsiteAnalyticsDashboardMetrics,
  UserSession,
} from '../types';
import {
  SEED_ADMIN_ANALYTICS_METRICS,
  SEED_STRUCTURED_ANALYTICS_EVENTS,
} from '../data/experienceData';

const LOCAL_STORAGE_KEY_EVENTS = 'kiaan_structured_analytics_events_v1';

class AnalyticsEngineService {
  private events: StructuredAnalyticsEvent[] = [];
  private metrics: WebsiteAnalyticsDashboardMetrics;
  private listeners: ((events: StructuredAnalyticsEvent[]) => void)[] = [];

  constructor() {
    this.metrics = { ...SEED_ADMIN_ANALYTICS_METRICS };
    this.loadEvents();
  }

  private loadEvents() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_EVENTS);
      if (stored) {
        this.events = JSON.parse(stored);
      } else {
        this.events = [...SEED_STRUCTURED_ANALYTICS_EVENTS];
        this.saveEvents();
      }
    } catch {
      this.events = [...SEED_STRUCTURED_ANALYTICS_EVENTS];
    }
  }

  private saveEvents() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(this.events));
    } catch (e) {
      console.warn('Analytics storage quota exceeded', e);
    }
  }

  public subscribe(listener: (events: StructuredAnalyticsEvent[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l([...this.events]));
  }

  public trackEvent(
    eventName: StructuredEventName,
    entity?: { type: any; id: string; name: string; valueINR?: number },
    metadata: Record<string, any> = {},
    userSession?: UserSession
  ): StructuredAnalyticsEvent {
    const newEvent: StructuredAnalyticsEvent = {
      event_id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      eventName,
      timestamp: new Date().toISOString(),
      user_session: {
        sessionId: userSession?.userId ? `sess_${userSession.userId}` : 'sess_anon_' + Math.random().toString(36).substring(2, 6),
        userId: userSession?.userId,
        userName: userSession?.name,
        userRole: userSession?.role || 'CUSTOMER',
        consentState: 'ANALYTICS_CONSENT_GRANTED',
      },
      entity,
      metadata,
      source: window.innerWidth < 768 ? 'MOBILE_BROWSER' : 'WEB_DESKTOP',
      consent_context: 'STATUTORY_FIRST_PARTY_SESSION_TELEMETRY',
    };

    this.events.unshift(newEvent);
    // Keep max 100 recent events
    if (this.events.length > 100) {
      this.events = this.events.slice(0, 100);
    }

    this.updateMetricsFromEvent(newEvent);
    this.saveEvents();
    this.notify();
    return newEvent;
  }

  private updateMetricsFromEvent(event: StructuredAnalyticsEvent) {
    switch (event.eventName) {
      case 'page_view':
        this.metrics.engagement.totalPageViews += 1;
        break;
      case 'search_completed':
        this.metrics.discovery.totalSearchesCount += 1;
        break;
      case 'ai_query':
        this.metrics.discovery.aiNaturalLanguageSearchesCount += 1;
        break;
      case 'property_saved':
        this.metrics.engagement.propertiesSavedCount += 1;
        break;
      case 'comparison_created':
        this.metrics.engagement.comparisonsCreatedCount += 1;
        break;
      case 'pdf_downloaded':
        this.metrics.engagement.pdfDossiersDownloadedCount += 1;
        break;
      case 'collection_shared':
        this.metrics.engagement.sharesOmnichannelCount += 1;
        break;
      case 'visit_requested':
        this.metrics.intent.vipSiteVisitsRequestedCount += 1;
        break;
      case 'offer_created':
        this.metrics.intent.formalOffersSubmittedCount += 1;
        break;
      case 'unit_selected':
        this.metrics.intent.unitsSelectedCount += 1;
        break;
      case 'unit_held':
        this.metrics.intent.activeHoldsCount += 1;
        break;
      case 'booking_started':
        this.metrics.transaction.bookingsInitiatedCount += 1;
        break;
      case 'booking_completed':
        this.metrics.transaction.bookingsCompletedCount += 1;
        if (event.entity?.valueINR) {
          this.metrics.transaction.totalBookingValueINR += event.entity.valueINR;
        }
        this.metrics.transaction.paymentEventsCount += 1;
        break;
    }
  }

  public getEvents(): StructuredAnalyticsEvent[] {
    return [...this.events];
  }

  public getMetrics(): WebsiteAnalyticsDashboardMetrics {
    return { ...this.metrics };
  }

  public clearEvents() {
    this.events = [...SEED_STRUCTURED_ANALYTICS_EVENTS];
    this.metrics = { ...SEED_ADMIN_ANALYTICS_METRICS };
    this.saveEvents();
    this.notify();
  }
}

export const analyticsEngine = new AnalyticsEngineService();
