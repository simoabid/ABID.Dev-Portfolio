'use client';

import { useEffect } from 'react';

import { setPointer, setScrollMetrics } from '@/lib/scrollState';

/**
 * Feeds native scroll and pointer events into the module level scroll store.
 *
 * Lenis drives real window scrolling, so listening to the native `scroll`
 * event stays in sync with the smooth scrolling without coupling this file to
 * the Lenis instance.
 */
export default function ScrollBridge() {
  useEffect(() => {
    const handleScroll = (): void => {
      setScrollMetrics(window.scrollY);
    };

    const handlePointerMove = (event: PointerEvent): void => {
      setPointer(event.clientX, event.clientY);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return null;
}
