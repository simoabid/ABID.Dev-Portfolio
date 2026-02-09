'use client';

/**
 * Text Splitting Utility
 *
 * Splits text into words or characters for GSAP animations
 * while maintaining accessibility for screen readers.
 *
 * @module lib/textSplit
 */

import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { gsap, ScrollTrigger } from './scroll';

/**
 * Split text into words
 */
export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/**
 * Split text into characters (preserving spaces as separate items)
 */
export function splitChars(text: string): string[] {
  return text.split('');
}

/**
 * Props for SplitText component
 */
export interface SplitTextProps {
  /** Text content to split and animate */
  children: string;
  /** Split mode: 'words' or 'chars' */
  splitBy?: 'words' | 'chars';
  /** CSS class for the wrapper */
  className?: string;
  /** CSS class for each split element */
  elementClassName?: string;
  /** Whether to animate on scroll */
  animate?: boolean;
  /** Animation stagger delay (seconds) */
  stagger?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Animation delay before starting (seconds) */
  delay?: number;
  /** ScrollTrigger start position */
  triggerStart?: string;
  /** Initial Y offset for animation */
  fromY?: number;
  /** Initial rotation for animation */
  fromRotation?: number;
  /** Tag to use for wrapper (default: span) */
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface SplitTextRef {
  /** Replay the animation */
  replay: () => void;
  /** Get the GSAP timeline */
  getTimeline: () => gsap.core.Timeline | null;
}

/**
 * SplitText Component
 *
 * Splits text into words or characters with accessible markup
 * and optional GSAP scroll-triggered animations.
 *
 * @example
 * ```tsx
 * <SplitText
 *   splitBy="words"
 *   animate
 *   stagger={0.1}
 * >
 *   Mohamed Amine Abid
 * </SplitText>
 * ```
 */
export const SplitText = forwardRef<SplitTextRef, SplitTextProps>(
  function SplitTextComponent(
    {
      children,
      splitBy = 'words',
      className = '',
      elementClassName = '',
      animate = false,
      stagger = 0.05,
      duration = 0.6,
      delay = 0,
      triggerStart = 'top 85%',
      fromY = 40,
      fromRotation = 0,
      as: Wrapper = 'span',
    },
    ref
  ) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    // Split the text
    const parts =
      splitBy === 'words' ? splitWords(children) : splitChars(children);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      replay: () => {
        if (timelineRef.current) {
          timelineRef.current.restart();
        }
      },
      getTimeline: () => timelineRef.current,
    }));

    useEffect(() => {
      // SSR guard
      if (typeof window === 'undefined' || !animate || !containerRef.current) {
        return;
      }

      // Register ScrollTrigger
      gsap.registerPlugin(ScrollTrigger);

      const elements = containerRef.current.querySelectorAll('.split-element');

      if (elements.length === 0) return;

      // Create animation context for cleanup
      const ctx = gsap.context(() => {
        // Create timeline
        timelineRef.current = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: triggerStart,
            toggleActions: 'play none none reverse',
          },
        });

        // Set initial state
        gsap.set(elements, {
          opacity: 0,
          y: fromY,
          rotationX: fromRotation,
        });

        // Animate in
        timelineRef.current.to(elements, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration,
          stagger,
          delay,
          ease: 'power3.out',
        });
      }, containerRef);

      // Cleanup
      return () => {
        ctx.revert();
        timelineRef.current = null;
      };
    }, [animate, stagger, duration, delay, triggerStart, fromY, fromRotation]);

    // Render split word content
    const renderWordContent = (part: string, index: number) => {
      return (
        <>
          {part}
          {index < parts.length - 1 && '\u00A0'}
        </>
      );
    };

    // Render split char content
    const renderCharContent = (part: string) => {
      if (part === ' ') {
        return '\u00A0';
      }
      return part;
    };

    return (
      <Wrapper
        className={`split-text-wrapper ${className}`}
        style={{ display: 'inline' }}
      >
        {/* Screen reader text - visually hidden but accessible */}
        <span className="sr-only">{children}</span>

        {/* Visual split text - hidden from screen readers */}
        <span
          ref={containerRef}
          aria-hidden="true"
          style={{ display: 'inline' }}
        >
          {parts.map((part, index) => (
            <span
              key={`${part}-${index}`}
              className={`split-element ${elementClassName}`}
              style={{
                display: 'inline-block',
                willChange: animate ? 'transform, opacity' : 'auto',
              }}
            >
              {splitBy === 'words'
                ? renderWordContent(part, index)
                : renderCharContent(part)}
            </span>
          ))}
        </span>
      </Wrapper>
    );
  }
);

SplitText.displayName = 'SplitText';

/**
 * Hook for manual text splitting and animation
 *
 * @param containerRef - Ref to the container element
 * @param options - Animation options
 * @returns Object with timeline and replay function
 */
export function useTextReveal(
  containerRef: React.RefObject<HTMLElement>,
  options: {
    selector?: string;
    stagger?: number;
    duration?: number;
    delay?: number;
    triggerStart?: string;
    fromY?: number;
    enabled?: boolean;
  } = {}
) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const {
    selector = '.reveal-text',
    stagger = 0.05,
    duration = 0.6,
    delay = 0,
    triggerStart = 'top 85%',
    fromY = 40,
    enabled = true,
  } = options;

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled || !containerRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const elements = containerRef.current.querySelectorAll(selector);
    if (elements.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(elements, {
        opacity: 0,
        y: fromY,
      });

      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: triggerStart,
          toggleActions: 'play none none reverse',
        },
      });

      timelineRef.current.to(elements, {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        delay,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => {
      ctx.revert();
      timelineRef.current = null;
    };
  }, [
    containerRef,
    selector,
    stagger,
    duration,
    delay,
    triggerStart,
    fromY,
    enabled,
  ]);

  return {
    timeline: timelineRef.current,
    replay: () => timelineRef.current?.restart(),
  };
}

// Re-export gsap and ScrollTrigger for convenience
export { gsap, ScrollTrigger };

export default SplitText;
