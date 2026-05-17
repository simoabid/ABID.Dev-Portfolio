'use client';

/**
 * AnimatedCodeBrackets Component
 *
 * Premium code-bracket SVG animation for the Hero section.
 * Draws code brackets with a typing cursor effect using
 * GSAP stroke-dasharray animation on scroll/mount.
 *
 * @component
 */

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

interface AnimatedCodeBracketsProps {
  className?: string;
  /** Width of the SVG */
  size?: number;
  /** Stroke color */
  color?: string;
}

export default function AnimatedCodeBrackets({
  className = '',
  size = 80,
  color = 'var(--color-accent)',
}: AnimatedCodeBracketsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !svgRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const svg = svgRef.current;
    const paths = svg.querySelectorAll<SVGPathElement>('.bracket-path');
    const cursor = svg.querySelector<SVGRectElement>('.typing-cursor');

    // Prepare strokes
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    if (cursor) {
      gsap.set(cursor, { opacity: 0 });
    }

    const tl = gsap.timeline({ delay: 0.5 });
    timelineRef.current = tl;

    // Draw left bracket
    tl.to(paths[0], {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    });

    // Draw right bracket
    tl.to(
      paths[1],
      {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      '-=0.4'
    );

    // Draw slash
    if (paths[2]) {
      tl.to(
        paths[2],
        {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        },
        '-=0.3'
      );
    }

    // Blinking cursor
    if (cursor) {
      tl.to(cursor, {
        opacity: 1,
        duration: 0.1,
      });
      tl.to(cursor, {
        opacity: 0,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)',
      });
    }

    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left bracket < */}
      <path
        className="bracket-path"
        d="M35 25 L15 50 L35 75"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right bracket > */}
      <path
        className="bracket-path"
        d="M65 25 L85 50 L65 75"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Forward slash / */}
      <path
        className="bracket-path"
        d="M55 30 L45 70"
        stroke="var(--color-accent-secondary)"
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.7}
      />
      {/* Typing cursor */}
      <rect
        className="typing-cursor"
        x={48}
        y={48}
        width={4}
        height={14}
        rx={1}
        fill={color}
        opacity={0}
      />
    </svg>
  );
}
