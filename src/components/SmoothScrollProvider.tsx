'use client';

/**
 * SmoothScrollProvider Component
 *
 * Wraps the application to provide smooth inertial scrolling via Lenis.
 * Initializes on mount and properly cleans up on unmount.
 *
 * @component
 */

import { useEffect, useRef } from 'react';
import { initSmoothScroll, destroySmoothScroll, getLenis } from '@/lib/scroll';
import type Lenis from 'lenis';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  /** Optional Lenis configuration */
  options?: {
    lerp?: number;
    duration?: number;
    smoothTouch?: boolean;
  };
}

export default function SmoothScrollProvider({
  children,
  options,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize smooth scroll
    lenisRef.current = initSmoothScroll(options);

    // Handle anchor link clicks for smooth scroll to sections
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;

      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement && lenisRef.current) {
            lenisRef.current.scrollTo(targetElement, {
              offset: -100, // Account for fixed header
              duration: 1.5,
            });
          }
        }
      }
    };

    document.addEventListener('click', handleClick);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', handleClick);
      destroySmoothScroll();
    };
  }, [options]);

  return <>{children}</>;
}

/**
 * Hook to access Lenis instance
 *
 * @returns Current Lenis instance or null
 */
export function useLenis(): Lenis | null {
  return getLenis();
}
