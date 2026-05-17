'use client';

import { useEffect, useState } from 'react';
import { getLenis } from '@/lib/scroll';

const SCROLL_THRESHOLD = 640;

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setPrefersReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener('change', updateMotion);

    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      motionQuery.removeEventListener('change', updateMotion);
    };
  }, []);

  const handleBackToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, {
        duration: prefersReducedMotion ? 0 : 1.1,
      });
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleBackToTop}
      aria-label="Back to top"
      className="back-to-top cursor-target fixed bottom-6 right-6 z-[55] flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-accent)] bg-[var(--color-background-overlay)] text-[var(--color-foreground)] shadow-lg shadow-[var(--color-shadow-accent)] backdrop-blur-md transition-[transform,opacity,box-shadow] duration-300 hover:scale-105 hover:shadow-[var(--color-shadow-glow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
