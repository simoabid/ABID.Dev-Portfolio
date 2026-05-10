/**
 * Privacy-first analytics wrapper.
 *
 * GTM/GA4 scripts are loaded **only** after the user grants consent.
 * All dataLayer pushes are queued while consent is pending and
 * flushed once consent is granted.
 *
 * Consent is persisted in localStorage under `analytics-consent`.
 */

type ConsentStatus = 'granted' | 'denied' | 'pending';

interface AnalyticsEvent {
  readonly event: string;
  readonly [key: string]: unknown;
}

const CONSENT_KEY = 'analytics-consent' as const;
const CONSENT_EXPIRY_KEY = 'analytics-consent-expiry' as const;
const CONSENT_TTL_DAYS = 365;

/** Events queued before consent is granted. */
let eventQueue: AnalyticsEvent[] = [];
let isGtmLoaded = false;

/* ─── Consent Management ────────────────────────────────────────────── */

/** Read persisted consent. Returns 'pending' if never set or expired. */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') return 'pending';
  try {
    const expiry = localStorage.getItem(CONSENT_EXPIRY_KEY);
    if (expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem(CONSENT_KEY);
      localStorage.removeItem(CONSENT_EXPIRY_KEY);
      return 'pending';
    }
    const status = localStorage.getItem(CONSENT_KEY);
    if (status === 'granted' || status === 'denied') return status;
    return 'pending';
  } catch {
    return 'pending';
  }
}

/** Persist consent choice with expiry. */
export function setConsentStatus(status: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return;
  try {
    const expiry = Date.now() + CONSENT_TTL_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(CONSENT_KEY, status);
    localStorage.setItem(CONSENT_EXPIRY_KEY, String(expiry));
  } catch {
    /* localStorage blocked — consent remains per-session */
  }
  if (status === 'granted') {
    loadGtm();
    flushEventQueue();
  }
}

/** Revoke consent: remove cookie + stored status. */
export function revokeConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_KEY);
  localStorage.removeItem(CONSENT_EXPIRY_KEY);
  isGtmLoaded = false;
}

/* ─── GTM / GA4 Injection ───────────────────────────────────────────── */

/** Inject the GTM script into <head>. Called only when consent = granted. */
function loadGtm(): void {
  if (isGtmLoaded || typeof window === 'undefined') return;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return;
  isGtmLoaded = true;
  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });
  // Inject GTM script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  document.head.appendChild(script);
  // Push consent mode defaults
  window.dataLayer.push({
    event: 'consent_update',
    analytics_storage: 'granted',
    ad_storage: 'denied',
  });
}

/** Flush any events that were queued before consent was granted. */
function flushEventQueue(): void {
  if (!window.dataLayer) return;
  eventQueue.forEach((evt) => window.dataLayer!.push(evt));
  eventQueue = [];
}

/* ─── Event Tracking ────────────────────────────────────────────────── */

/** Push an event to the dataLayer. Queues if consent not yet granted. */
export function trackEvent(event: string, data?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const payload: AnalyticsEvent = { event, ...data };
  const consent = getConsentStatus();
  if (consent !== 'granted' || !isGtmLoaded) {
    eventQueue.push(payload);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/* ─── Convenience Event Helpers ─────────────────────────────────────── */

export function trackCtaClick(ctaName: string, destination?: string): void {
  trackEvent('cta_click', { cta_name: ctaName, destination });
}

export function trackProjectClick(projectTitle: string, url?: string): void {
  trackEvent('project_click', { project_title: projectTitle, click_url: url });
}

export function trackSectionView(sectionId: string): void {
  trackEvent('section_view', { section_id: sectionId });
}

/* ─── Auto-init on module load ──────────────────────────────────────── */

/** Call once from layout to check persisted consent and auto-load GTM. */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  const consent = getConsentStatus();
  if (consent === 'granted') {
    loadGtm();
    flushEventQueue();
  }
}

/* ─── TypeScript Global Augmentation ────────────────────────────────── */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
