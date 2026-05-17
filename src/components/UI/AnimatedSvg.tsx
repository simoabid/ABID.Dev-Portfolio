'use client';

/**
 * AnimatedSvg Component
 *
 * Wrapper that applies GSAP stroke-dasharray draw animation to inline SVGs.
 * Animates all <path>, <line>, <circle>, <rect>, <polyline>, and <polygon>
 * children via their stroke-dashoffset on scroll-trigger or hover.
 *
 * Usage:
 *   <AnimatedSvg trigger="scroll">
 *     <svg viewBox="0 0 100 100">
 *       <path d="M10 80 L50 10 L90 80 Z" stroke="currentColor" fill="none"/>
 *     </svg>
 *   </AnimatedSvg>
 *
 * @component
 */

import { useEffect, useRef, useCallback } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface AnimatedSvgProps {
  /** Inline SVG as children */
  children: React.ReactNode;
  /** When to play the animation */
  trigger?: 'scroll' | 'hover' | 'mount';
  /** Animation duration in seconds */
  duration?: number;
  /** Stagger between individual strokes */
  stagger?: number;
  /** Delay before animation starts */
  delay?: number;
  /** GSAP easing function name */
  ease?: string;
  /** Additional wrapper class names */
  className?: string;
  /** Repeat the animation infinitely */
  loop?: boolean;
}

/** CSS selector for all stroke-able SVG elements */
const STROKE_ELEMENTS = 'path, line, circle, rect, polyline, polygon, ellipse';

export default function AnimatedSvg({
  children,
  trigger = 'scroll',
  duration = 1.5,
  stagger = 0.15,
  delay = 0,
  ease = 'power2.inOut',
  className = '',
  loop = false,
}: AnimatedSvgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  /** Compute and set initial stroke-dasharray/offset for each element */
  const prepareStrokes = useCallback(
    (elements: NodeListOf<SVGGeometryElement>) => {
      elements.forEach((el) => {
        const length = el.getTotalLength();
        el.style.strokeDasharray = `${length}`;
        el.style.strokeDashoffset = `${length}`;
      });
    },
    []
  );

  /** Animate strokes in (draw) */
  const animateIn = useCallback(
    (elements: NodeListOf<SVGGeometryElement>) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      gsap.to(elements, {
        strokeDashoffset: 0,
        duration,
        stagger,
        delay,
        ease,
        repeat: loop ? -1 : 0,
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
    },
    [duration, stagger, delay, ease, loop]
  );

  /** Animate strokes out (undraw) */
  const animateOut = useCallback(
    (elements: NodeListOf<SVGGeometryElement>) => {
      elements.forEach((el) => {
        const length = el.getTotalLength();
        gsap.to(el, {
          strokeDashoffset: length,
          duration: duration * 0.6,
          ease: 'power2.in',
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        });
      });
    },
    [duration]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const container = containerRef.current;
    const elements =
      container.querySelectorAll<SVGGeometryElement>(STROKE_ELEMENTS);
    if (elements.length === 0) return;

    prepareStrokes(elements);

    let ctx: gsap.Context | undefined;

    if (trigger === 'scroll') {
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.to(elements, {
          strokeDashoffset: 0,
          duration,
          stagger,
          delay,
          ease,
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }, container);
    } else if (trigger === 'mount') {
      animateIn(elements);
    } else if (trigger === 'hover') {
      const handleEnter = () => animateIn(elements);
      const handleLeave = () => animateOut(elements);
      container.addEventListener('mouseenter', handleEnter);
      container.addEventListener('mouseleave', handleLeave);
      return () => {
        container.removeEventListener('mouseenter', handleEnter);
        container.removeEventListener('mouseleave', handleLeave);
      };
    }

    return () => {
      ctx?.revert();
    };
  }, [
    trigger,
    duration,
    stagger,
    delay,
    ease,
    prepareStrokes,
    animateIn,
    animateOut,
  ]);

  return (
    <div ref={containerRef} className={`animated-svg ${className}`}>
      {children}
    </div>
  );
}
