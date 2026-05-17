'use client';

/**
 * SvgDivider Component
 *
 * Animated section divider using SVG stroke-draw animation.
 * Plays on scroll-trigger when the divider enters the viewport.
 * Provides a premium visual separator between portfolio sections.
 *
 * @component
 */

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface SvgDividerProps {
  /** Divider style variant */
  variant?: 'wave' | 'circuit' | 'pulse';
  /** Additional CSS classes */
  className?: string;
  /** Stroke color (CSS variable or hex) */
  color?: string;
}

/** SVG path data for each variant */
const DIVIDER_PATHS: Record<string, string> = {
  wave: 'M0 20 Q 100 0, 200 20 T 400 20 T 600 20 T 800 20 T 1000 20 T 1200 20',
  circuit:
    'M0 20 L80 20 L100 10 L120 30 L140 10 L160 30 L180 20 L300 20 M320 20 L340 10 L360 20 L380 10 L400 20 L520 20 M540 20 L560 30 L580 10 L600 30 L620 20 L740 20 M760 20 L780 10 L800 20 L820 30 L840 20 L960 20 M980 20 L1000 10 L1020 30 L1040 10 L1060 20 L1200 20',
  pulse:
    'M0 20 L200 20 L220 5 L240 35 L260 10 L280 30 L300 20 L500 20 L520 5 L540 35 L560 10 L580 30 L600 20 L800 20 L820 5 L840 35 L860 10 L880 30 L900 20 L1200 20',
};

export default function SvgDivider({
  variant = 'circuit',
  className = '',
  color = 'var(--color-accent)',
}: SvgDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const paths = containerRef.current.querySelectorAll<SVGPathElement>('path');

    const ctx = gsap.context(() => {
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 2,
        stagger: 0.3,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef.current);

    return () => {
      ctx.revert();
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className={`svg-divider w-full overflow-hidden py-8 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-10"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main line */}
        <path
          d={DIVIDER_PATHS[variant]}
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.6}
        />
        {/* Glow duplicate */}
        <path
          d={DIVIDER_PATHS[variant]}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.15}
          filter="blur(4px)"
        />
      </svg>
    </div>
  );
}
