'use client';

/**
 * SectionHeading Component
 *
 * Reusable animated section heading with text splitting
 * and scroll-triggered reveal animations.
 *
 * @component
 */

import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/scroll';

interface SectionHeadingProps {
  /** Heading text */
  children: string;
  /** HTML heading level */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Split mode */
  splitBy?: 'words' | 'chars';
  /** Additional CSS classes */
  className?: string;
  /** Stagger delay between elements */
  stagger?: number;
  /** Animation duration */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Whether to show gradient text effect */
  gradient?: boolean;
  /** Optional subtitle */
  subtitle?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
}

export default function SectionHeading({
  children,
  as: Tag = 'h2',
  splitBy = 'words',
  className = '',
  stagger = 0.08,
  duration = 0.7,
  delay = 0,
  gradient = true,
  subtitle,
  align = 'center',
}: SectionHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Split text into parts
  const parts =
    splitBy === 'words'
      ? children.split(/\s+/).filter(Boolean)
      : children.split('');

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !containerRef.current ||
      hasAnimated.current
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const elements = containerRef.current.querySelectorAll('.heading-part');
    const subtitleEl = containerRef.current.querySelector('.heading-subtitle');

    if (elements.length === 0) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(elements, {
        opacity: 0,
        y: 30,
        rotateX: -20,
      });

      if (subtitleEl) {
        gsap.set(subtitleEl, {
          opacity: 0,
          y: 20,
        });
      }

      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          onEnter: () => {
            hasAnimated.current = true;
          },
        },
      });

      // Animate heading parts
      tl.to(elements, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration,
        stagger,
        delay,
        ease: 'power3.out',
      });

      // Animate subtitle
      if (subtitleEl) {
        tl.to(
          subtitleEl,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.3'
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [stagger, duration, delay]);

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div
      ref={containerRef}
      className={`section-heading-wrapper ${alignmentClasses[align]} ${className}`}
    >
      <Tag className="relative inline-block">
        {/* Screen reader text */}
        <span className="sr-only">{children}</span>

        {/* Visual split text */}
        <span
          aria-hidden="true"
          className="inline-block"
          style={{ perspective: '1000px' }}
        >
          {parts.map((part, index) => (
            <span
              key={`${part}-${index}`}
              className={`heading-part inline-block ${gradient ? 'gradient-text' : ''}`}
              style={{
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d',
              }}
            >
              {splitBy === 'words' ? (
                <>
                  {part}
                  {index < parts.length - 1 && '\u00A0'}
                </>
              ) : part === ' ' ? (
                '\u00A0'
              ) : (
                part
              )}
            </span>
          ))}
        </span>
      </Tag>

      {subtitle && (
        <p className="heading-subtitle text-[var(--color-foreground-muted)] mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
