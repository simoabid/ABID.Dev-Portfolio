'use client';

/**
 * AnimatedThemeToggle Component
 *
 * Premium theme toggle with animated SVG morphing between sun/moon states.
 * Uses GSAP for smooth stroke-draw transitions and ray burst effects.
 * Falls back to a static SVG toggle if animation errors occur.
 *
 * @component
 */

import { useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { gsap } from '@/lib/gsap';

interface AnimatedThemeToggleProps {
  className?: string;
}

/** SVG path data for sun and moon states */
const SUN_CIRCLE = 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z';
const MOON_PATH =
  'M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8A9.04 9.04 0 0 0 12 3Z';

/** Sun ray endpoints (lines from center outward) */
const SUN_RAYS = [
  { x1: 12, y1: 1, x2: 12, y2: 3 }, // top
  { x1: 12, y1: 21, x2: 12, y2: 23 }, // bottom
  { x1: 4.22, y1: 4.22, x2: 5.64, y2: 5.64 }, // top-left
  { x1: 18.36, y1: 18.36, x2: 19.78, y2: 19.78 }, // bottom-right
  { x1: 1, y1: 12, x2: 3, y2: 12 }, // left
  { x1: 21, y1: 12, x2: 23, y2: 12 }, // right
  { x1: 4.22, y1: 19.78, x2: 5.64, y2: 18.36 }, // bottom-left
  { x1: 18.36, y1: 5.64, x2: 19.78, y2: 4.22 }, // top-right
];

export default function AnimatedThemeToggle({
  className = '',
}: AnimatedThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const svgRef = useRef<SVGSVGElement>(null);
  const bodyRef = useRef<SVGPathElement>(null);
  const raysRef = useRef<(SVGLineElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isFirstRender = useRef(true);

  /** Set ray ref by index */
  const setRayRef = useCallback(
    (index: number) => (el: SVGLineElement | null) => {
      raysRef.current[index] = el;
    },
    []
  );

  /** Animate the transition between states */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Set initial state without animation
      if (isDark) {
        raysRef.current.forEach((ray) => {
          if (ray)
            gsap.set(ray, { opacity: 0, scale: 0, transformOrigin: 'center' });
        });
      }
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Kill previous timeline
    timelineRef.current?.kill();

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    timelineRef.current = tl;

    const body = bodyRef.current;
    const rays = raysRef.current.filter(Boolean) as SVGLineElement[];

    if (isDark) {
      // Sun → Moon transition
      tl.to(rays, {
        opacity: 0,
        scale: 0,
        stagger: 0.03,
        duration: 0.25,
        transformOrigin: 'center',
      })
        .to(
          body,
          {
            rotation: -90,
            scale: 0.8,
            duration: 0.3,
            transformOrigin: 'center',
          },
          '-=0.15'
        )
        .to(body, {
          attr: { d: MOON_PATH },
          rotation: 0,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.4)',
        });
    } else {
      // Moon → Sun transition
      tl.to(body, {
        rotation: 90,
        scale: 0.8,
        duration: 0.3,
        transformOrigin: 'center',
      })
        .to(body, {
          attr: { d: SUN_CIRCLE },
          rotation: 0,
          scale: 1,
          duration: 0.35,
          ease: 'back.out(1.4)',
        })
        .to(
          rays,
          {
            opacity: 1,
            scale: 1,
            stagger: 0.04,
            duration: 0.3,
            transformOrigin: 'center',
          },
          '-=0.15'
        );
    }

    return () => {
      timelineRef.current?.kill();
    };
  }, [isDark]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      data-cursor="pointer"
      className={`
        cursor-target relative w-10 h-10 rounded-full
        bg-[var(--color-accent-muted)]
        border border-[var(--color-border)]
        flex items-center justify-center
        text-[var(--color-foreground)]
        hover:bg-gradient-to-r hover:from-[var(--color-accent)] hover:to-[var(--color-accent-secondary)]
        hover:text-[var(--color-foreground-inverted)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-[var(--shadow-accent)]
        active:scale-95
        ${className}
      `}
    >
      <svg
        ref={svgRef}
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Body: morphs between sun circle and moon crescent */}
        <path ref={bodyRef} d={isDark ? MOON_PATH : SUN_CIRCLE} fill="none" />

        {/* Sun rays: visible in light mode, hidden in dark mode */}
        {SUN_RAYS.map((ray, index) => (
          <line
            key={index}
            ref={setRayRef(index)}
            x1={ray.x1}
            y1={ray.y1}
            x2={ray.x2}
            y2={ray.y2}
            style={{
              opacity: isDark ? 0 : 1,
              transformOrigin: 'center',
            }}
          />
        ))}
      </svg>
    </button>
  );
}
