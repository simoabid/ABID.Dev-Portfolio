'use client';

/**
 * Pointer-driven tilt for a group of cards.
 *
 * Attach the returned ref to a container and every descendant matching
 * `selector` tilts toward the pointer. Delegating from one container keeps a
 * single effect in charge of listener cleanup, rather than a ref per card.
 *
 * Uses GSAP's `transformPerspective` on the card itself, so no ancestor needs
 * a `perspective` value and no wrapper markup has to change.
 *
 * Opts out completely when the visitor prefers reduced motion, and on coarse
 * pointers, where there is no hover to respond to and the listeners would only
 * burn battery.
 */

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface TiltGroupOptions {
  /** Selector for the tiltable cards inside the container. */
  selector: string;
  /** Maximum rotation away from flat, in degrees. */
  maxTilt?: number;
  /** How far the card lifts toward the viewer, in pixels. */
  lift?: number;
}

export function useTiltGroup<T extends HTMLElement>({
  selector,
  maxTilt = 7,
  lift = 8,
}: TiltGroupOptions) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // A tilt that follows a pointer is meaningless without a hovering pointer.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>(selector)
    );
    if (cards.length === 0) return;

    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      gsap.set(card, { transformPerspective: 900 });

      const settings = { duration: 0.5, ease: 'power3.out' };
      const tiltX = gsap.quickTo(card, 'rotationX', settings);
      const tiltY = gsap.quickTo(card, 'rotationY', settings);
      const raise = gsap.quickTo(card, 'z', settings);

      const handlePointerMove = (event: PointerEvent) => {
        const bounds = card.getBoundingClientRect();
        if (bounds.width === 0 || bounds.height === 0) return;

        // -0.5 at one edge, 0.5 at the other.
        const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

        tiltY(offsetX * maxTilt * 2);
        tiltX(-offsetY * maxTilt * 2);
        raise(lift);
      };

      const handlePointerLeave = () => {
        tiltX(0);
        tiltY(0);
        raise(0);
      };

      card.addEventListener('pointermove', handlePointerMove);
      card.addEventListener('pointerleave', handlePointerLeave);

      cleanups.push(() => {
        card.removeEventListener('pointermove', handlePointerMove);
        card.removeEventListener('pointerleave', handlePointerLeave);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      gsap.killTweensOf(cards);
    };
  }, [selector, maxTilt, lift]);

  return containerRef;
}
