'use client';

/**
 * CustomCursor Component
 *
 * Dynamic custom cursor that morphs when hovering interactive elements.
 * Features a smooth GSAP-driven follow with magnetic snapping, and a
 * secondary ring for visual depth.
 *
 * Accessibility:
 * - Automatically disabled for touch devices and reduced-motion preference
 * - Controlled via data-cursor attributes (no JS required to opt-in elements)
 * - Can be toggled off entirely via the `disabled` prop
 *
 * @component
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from '@/lib/scroll';

interface CustomCursorProps {
  /** Disable the custom cursor entirely */
  disabled?: boolean;
}

/** Cursor visual states mapped from data-cursor attributes */
const CURSOR_STATES = {
  default: { scale: 1, ringScale: 1, mixBlendMode: 'difference' as const },
  pointer: { scale: 1.5, ringScale: 1.8, mixBlendMode: 'difference' as const },
  text: { scale: 2.5, ringScale: 0, mixBlendMode: 'difference' as const },
  view: { scale: 3.5, ringScale: 0, mixBlendMode: 'normal' as const },
  hidden: { scale: 0, ringScale: 0, mixBlendMode: 'difference' as const },
} as const;

type CursorState = keyof typeof CURSOR_STATES;

export default function CustomCursor({ disabled = false }: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);
  const [isTouch, setIsTouch] = useState(false);

  /** Detect touch device or reduced-motion preference */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    setIsTouch(isTouchDevice || prefersReducedMotion);
  }, []);

  /** Apply a cursor state to the dot and ring */
  const setCursorState = useCallback((state: CursorState) => {
    if (!dotRef.current || !ringRef.current) return;
    const config = CURSOR_STATES[state];
    gsap.to(dotRef.current, {
      scale: config.scale,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    gsap.to(ringRef.current, {
      scale: config.ringScale,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    dotRef.current.style.mixBlendMode = config.mixBlendMode;
  }, []);

  /** Main effect: track mouse position, listen for hover targets */
  useEffect(() => {
    if (disabled || isTouch || typeof window === 'undefined') return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Mouse move: update tracked position
    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        gsap.to([dot, ring], {
          opacity: 1,
          duration: 0.3,
          overwrite: 'auto',
        });
      }
    };

    // GSAP ticker: smooth follow
    const ticker = () => {
      const { x, y } = positionRef.current;
      gsap.set(dot, { x, y });
      gsap.to(ring, {
        x,
        y,
        duration: 0.15,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    // Detect interactive elements and set cursor state
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorAttr = target.closest<HTMLElement>('[data-cursor]');
      if (cursorAttr) {
        const state = cursorAttr.getAttribute('data-cursor') as CursorState;
        if (state in CURSOR_STATES) {
          setCursorState(state);
          return;
        }
      }
      // Auto-detect interactive elements
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, label'
      );
      setCursorState(interactive ? 'pointer' : 'default');
    };

    // Hide on mouse leave
    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      gsap.to([dot, ring], {
        opacity: 0,
        duration: 0.3,
        overwrite: 'auto',
      });
    };

    // Mouse down / up: press effect
    const handleMouseDown = () => {
      gsap.to(dot, { scale: 0.8, duration: 0.15 });
    };
    const handleMouseUp = () => {
      setCursorState('default');
    };

    // Bind events
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    gsap.ticker.add(ticker);

    // Hide native cursor globally
    document.documentElement.style.cursor = 'none';
    document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
      (el as HTMLElement).style.cursor = 'none';
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      gsap.ticker.remove(ticker);
      document.documentElement.style.cursor = '';
      document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        (el as HTMLElement).style.cursor = '';
      });
    };
  }, [disabled, isTouch, setCursorState]);

  // Don't render anything for touch devices or when disabled
  if (disabled || isTouch) return null;

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--color-accent)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid var(--color-accent)',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
