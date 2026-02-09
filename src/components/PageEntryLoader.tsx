'use client';

import { useEffect, useState } from 'react';

interface PageEntryLoaderProps {
  children: React.ReactNode;
  minDurationMs?: number;
}

const OVERLAY_EXIT_MS = 420;
const FALLBACK_FINISH_MS = 1500;

export default function PageEntryLoader({
  children,
  minDurationMs = 1100,
}: PageEntryLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const startedAt = performance.now();
    let finishTimerId: number | null = null;
    let overlayTimerId: number | null = null;
    let fallbackTimerId: number | null = null;

    const finishLoading = () => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, minDurationMs - elapsed);

      if (finishTimerId) {
        window.clearTimeout(finishTimerId);
      }
      finishTimerId = window.setTimeout(() => {
        setIsLoading(false);
        overlayTimerId = window.setTimeout(() => {
          setShowOverlay(false);
        }, OVERLAY_EXIT_MS);
      }, remaining);
    };

    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      const onLoaded = () => finishLoading();
      window.addEventListener('load', onLoaded, { once: true });
      fallbackTimerId = window.setTimeout(() => {
        finishLoading();
      }, FALLBACK_FINISH_MS);

      return () => {
        window.removeEventListener('load', onLoaded);
        if (fallbackTimerId) {
          window.clearTimeout(fallbackTimerId);
        }
        if (finishTimerId) {
          window.clearTimeout(finishTimerId);
        }
        if (overlayTimerId) {
          window.clearTimeout(overlayTimerId);
        }
      };
    }

    return () => {
      if (finishTimerId) {
        window.clearTimeout(finishTimerId);
      }
      if (overlayTimerId) {
        window.clearTimeout(overlayTimerId);
      }
    };
  }, [minDurationMs]);

  useEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showOverlay]);

  return (
    <>
      <div
        className={`transition-opacity duration-700 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>

      {showOverlay && (
        <div
          className={`fixed inset-0 z-[300] flex items-center justify-center px-6 transition-opacity duration-700 ${
            isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ background: 'var(--color-background)' }}
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="entry-loader-orb entry-loader-orb-left" />
            <div className="entry-loader-orb entry-loader-orb-right" />
          </div>

          <div className="glass-card relative z-10 w-full max-w-xl rounded-[2rem] p-8 md:p-10">
            <div className="flex flex-col items-center gap-8">
              <div className="entry-loader-perspective">
                <div className="entry-loader-cube" aria-hidden="true">
                  <span className="entry-loader-face entry-loader-face-front" />
                  <span className="entry-loader-face entry-loader-face-back" />
                  <span className="entry-loader-face entry-loader-face-right" />
                  <span className="entry-loader-face entry-loader-face-left" />
                  <span className="entry-loader-face entry-loader-face-top" />
                  <span className="entry-loader-face entry-loader-face-bottom" />
                </div>
              </div>

              <div className="w-full max-w-sm space-y-3">
                <div className="entry-loader-skeleton h-3 w-40 rounded-full" />
                <div className="entry-loader-skeleton h-2.5 w-full rounded-full" />
                <div className="entry-loader-skeleton h-2.5 w-4/5 rounded-full" />
              </div>

              <p className="text-center text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)]">
                Building your immersive portfolio experience
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
