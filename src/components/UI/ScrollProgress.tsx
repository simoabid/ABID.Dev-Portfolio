'use client';

import { useEffect, useState } from 'react';

/**
 * Thin top progress bar — scroll depth at a glance.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setIsHidden(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener('change', updateMotion);

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const maxScroll = scrollHeight - clientHeight;
      setProgress(maxScroll > 0 ? scrollTop / maxScroll : 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      motionQuery.removeEventListener('change', updateMotion);
    };
  }, []);

  if (isHidden) {
    return null;
  }

  const percent = Math.round(progress * 100);

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[2px] w-full origin-left"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
      style={{
        transform: `scaleX(${progress})`,
        background:
          'linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary))',
        boxShadow: '0 0 14px var(--color-shadow-glow)',
      }}
    />
  );
}
