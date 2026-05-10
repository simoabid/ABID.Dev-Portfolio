'use client';

/**
 * CtaHoverEffect Component
 *
 * A premium CTA button wrapper that uses GSAP-powered
 * micro-animations on hover: magnetic pull, particle burst, and glow.
 * This replaces the need for Rive runtime while delivering
 * equivalent visual impact with zero additional dependencies.
 *
 * @component
 */

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from '@/lib/scroll';

interface CtaHoverEffectProps {
  children: React.ReactNode;
  className?: string;
  /** Enable magnetic pull effect toward cursor */
  magnetic?: boolean;
  /** Enable particle burst on click */
  particles?: boolean;
}

/** Number of particles for click burst */
const PARTICLE_COUNT = 8;

export default function CtaHoverEffect({
  children,
  className = '',
  magnetic = true,
  particles = true,
}: CtaHoverEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  /** Handle magnetic pull on mouse move */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!magnetic || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.15;
      const deltaY = (e.clientY - centerY) * 0.15;
      gsap.to(containerRef.current, {
        x: deltaX,
        y: deltaY,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [magnetic]
  );

  /** Reset magnetic position */
  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0,
        duration: 0.3,
        overwrite: 'auto',
      });
    }
  }, []);

  /** Update glow position */
  const handleGlowMove = useCallback((e: MouseEvent) => {
    if (!glowRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(glowRef.current, {
      opacity: 1,
      x: x - 60,
      y: y - 60,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  /** Trigger particle burst on click */
  const handleClick = useCallback(() => {
    if (!particles || !particlesRef.current) return;
    const container = particlesRef.current;
    // Create temporary particle elements
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.className = 'cta-particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--color-accent);
        top: 50%;
        left: 50%;
        pointer-events: none;
      `;
      container.appendChild(particle);
      const angle = (360 / PARTICLE_COUNT) * i * (Math.PI / 180);
      const distance = 30 + Math.random() * 40;
      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: 0.6 + Math.random() * 0.3,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove();
        },
      });
    }
  }, [particles]);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = containerRef.current;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mousemove', handleGlowMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('click', handleClick);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mousemove', handleGlowMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('click', handleClick);
    };
  }, [handleMouseMove, handleMouseLeave, handleGlowMove, handleClick]);

  return (
    <div
      ref={containerRef}
      className={`cta-hover-effect relative inline-block ${className}`}
      data-cursor="pointer"
    >
      {/* Glow follower */}
      <div
        ref={glowRef}
        className="absolute w-[120px] h-[120px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
          opacity: 0,
          filter: 'blur(20px)',
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      {/* Particle container */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none overflow-visible"
        aria-hidden="true"
      />
      {/* Children (the actual CTA content) */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
