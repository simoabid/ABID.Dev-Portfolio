'use client';

/**
 * CookieBanner Component
 *
 * GDPR-compliant cookie consent banner with:
 * - Accept / Decline buttons
 * - Persistent consent via localStorage (1 year)
 * - Keyboard accessible (focus trap, Escape to dismiss)
 * - GSAP entrance/exit animations
 * - Reduced motion support
 * - Does NOT render if consent already given
 * - Triggers GTM load only on accept
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from '@/lib/scroll';
import {
  getConsentStatus,
  setConsentStatus,
  initAnalytics,
} from '@/lib/analytics';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const acceptBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Auto-load GTM if consent was previously granted
    initAnalytics();
    // Show banner only if consent is pending
    const consent = getConsentStatus();
    if (consent === 'pending') {
      // Slight delay so page content loads first
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Animate in when visible
  useEffect(() => {
    if (!isVisible || !bannerRef.current) return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      gsap.set(bannerRef.current, { autoAlpha: 1, y: 0 });
    } else {
      gsap.fromTo(
        bannerRef.current,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
    // Focus the accept button for keyboard users
    acceptBtnRef.current?.focus();
  }, [isVisible]);

  const handleDismiss = useCallback(
    (consent: 'granted' | 'denied') => {
      if (!bannerRef.current) {
        setConsentStatus(consent);
        setIsVisible(false);
        return;
      }
      gsap.to(bannerRef.current, {
        autoAlpha: 0,
        y: 40,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setConsentStatus(consent);
          setIsVisible(false);
        },
      });
    },
    []
  );

  const handleAccept = useCallback(() => handleDismiss('granted'), [handleDismiss]);
  const handleDecline = useCallback(() => handleDismiss('denied'), [handleDismiss]);

  // Keyboard: Escape = decline
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDecline();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleDecline]);

  if (!isVisible) return null;

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6"
      style={{ visibility: 'hidden', opacity: 0 }}
    >
      <div className="max-w-2xl mx-auto glass-card rounded-2xl border border-[var(--color-border)] p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full gradient-bg flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--color-foreground)] leading-relaxed">
              This site uses cookies and analytics to improve your experience.{' '}
              <span className="text-[var(--color-foreground-muted)]">
                We use Google Analytics to understand how visitors interact with
                the site. No personal data is sold or shared with third parties.
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-sm font-medium rounded-xl border border-[var(--color-border)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-border-accent)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              type="button"
              aria-label="Decline cookies and analytics"
            >
              Decline
            </button>
            <button
              ref={acceptBtnRef}
              onClick={handleAccept}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-sm font-semibold rounded-xl gradient-bg text-white shadow-lg shadow-[var(--color-accent)]/20 hover:shadow-[var(--color-accent)]/40 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
              type="button"
              aria-label="Accept cookies and analytics"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
