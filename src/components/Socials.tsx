'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import HoverRollText from './UI/HoverRollText';

/* ─── Mobile grid card tilts ────────────────────────────────────────────────── */
/** Slight alternating tilts so the grid still feels organic on mobile */
const MOBILE_ROTATIONS = [-3, 2, -2, 3, -1, 2, -3] as const;

/* ─── Motion tuning ────────────────────────────────────────────────────────── */

/** How far the whole deck turns to follow the cursor, in degrees. */
const POINTER_YAW = 12;
const POINTER_PITCH = 7;
/** How far the deck is tipped back before it scrolls into place. */
const ENTRY_PITCH = 16;
/** Sibling spread when a card is hovered, by distance from that card. */
const SPREAD_BY_DISTANCE = [34, 22, 10] as const;

/* ─── Social Media Links ────────────────────────────────────────────────────── */

interface SocialLink {
  readonly label: string;
  readonly href: string;
}

const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'GITHUB', href: 'https://github.com/simoabid' },
  {
    label: 'LINKEDIN',
    href: 'https://www.linkedin.com/in/mohamed-amine-abidd',
  },
  { label: 'X', href: 'https://www.x.com/SeeMooAbid' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/simoabiid' },
] as const;

/* ─── Card Data ─────────────────────────────────────────────────────────────── */

interface SocialCard {
  readonly src: string;
  readonly alt: string;
  readonly href: string;
  readonly platform: string;
}

const SOCIAL_CARDS: readonly SocialCard[] = [
  {
    src: '/instagram/post1_img1.jpg',
    alt: 'Instagram Post - 🌆✨',
    href: 'https://www.instagram.com/p/DJ0Cyt7K1_Z/',
    platform: 'Instagram',
  },
  {
    src: '/instagram/post2_img1.jpg',
    alt: 'Instagram Post - The Blue City 🥶🩵',
    href: 'https://www.instagram.com/p/DGd5iQGuOL2/',
    platform: 'Instagram',
  },
  {
    src: '/instagram/post3_img1.jpg',
    alt: 'Instagram Post - 🖤🖇',
    href: 'https://www.instagram.com/p/DDb_3D_tSTc/',
    platform: 'Instagram',
  },
  {
    src: '/instagram/post2_img2.jpg',
    alt: 'Instagram Post - The Blue City 🥶🩵',
    href: 'https://www.instagram.com/p/DGd5iQGuOL2/',
    platform: 'Instagram',
  },
  {
    src: '/instagram/post1_img2.jpg',
    alt: 'Instagram Post - 🌆✨',
    href: 'https://www.instagram.com/p/DJ0Cyt7K1_Z/',
    platform: 'Instagram',
  },
  {
    src: '/instagram/post2_img3.jpg',
    alt: 'Instagram Post - The Blue City 🥶🩵',
    href: 'https://www.instagram.com/p/DGd5iQGuOL2/',
    platform: 'Instagram',
  },
  {
    src: '/instagram/post3_img2.jpg',
    alt: 'Instagram Post - 🖤🖇',
    href: 'https://www.instagram.com/p/DDb_3D_tSTc/',
    platform: 'Instagram',
  },
] as const;

/* ─── Fan Layout Types & Constants ──────────────────────────────────────────── */

interface FanPosition {
  readonly x: number;
  readonly rotate: number;
  readonly y: number;
  readonly z: number;
  /** Rotation about the vertical axis, in degrees. Turns each card to face
   *  the centre so the fan reads as a curved arc rather than a flat spread. */
  readonly rotateY: number;
  /** Depth offset in px. Outer cards sit further back. */
  readonly depth: number;
}

/**
 * Each card has a fixed translateX (px), rotation (deg), translateY (px),
 * and z-index. These are the RESTING positions and they NEVER change on hover.
 * The values are hand-tuned to match the Lando Norris fan-spread.
 *
 * rotateY and depth curve the arc into the screen. They are mirrored about
 * the centre card, which stays at zero for both.
 *
 * Note: these transforms are written inline from React state. Do not point the
 * useTiltGroup hook at these cards — GSAP writes the same inline transform
 * property and the two would fight on every pointer move. The pointer and
 * scroll motion live on the wrapper groups instead, which nothing else writes.
 */
const FAN_LAYOUT: readonly FanPosition[] = [
  { x: -520, rotate: -18, y: 50, z: 1, rotateY: 15, depth: -70 },
  { x: -345, rotate: -12, y: 25, z: 2, rotateY: 10, depth: -38 },
  { x: -178, rotate: -6, y: 7, z: 3, rotateY: 5, depth: -12 },
  { x: 0, rotate: 0, y: 0, z: 4, rotateY: 0, depth: 0 }, // center
  { x: 178, rotate: 6, y: 7, z: 3, rotateY: -5, depth: -12 },
  { x: 345, rotate: 12, y: 25, z: 2, rotateY: -10, depth: -38 },
  { x: 520, rotate: 18, y: 50, z: 1, rotateY: -15, depth: -70 },
] as const;

/* Mobile-scaled versions */
const FAN_LAYOUT_SM: readonly FanPosition[] = [
  { x: -240, rotate: -18, y: 34, z: 1, rotateY: 12, depth: -40 },
  { x: -160, rotate: -12, y: 17, z: 2, rotateY: 8, depth: -22 },
  { x: -82, rotate: -6, y: 5, z: 3, rotateY: 4, depth: -8 },
  { x: 0, rotate: 0, y: 0, z: 4, rotateY: 0, depth: 0 },
  { x: 82, rotate: 6, y: 5, z: 3, rotateY: -4, depth: -8 },
  { x: 160, rotate: 12, y: 17, z: 2, rotateY: -8, depth: -22 },
  { x: 240, rotate: 18, y: 34, z: 1, rotateY: -12, depth: -40 },
] as const;

const FAN_LAYOUT_MD: readonly FanPosition[] = [
  { x: -390, rotate: -18, y: 42, z: 1, rotateY: 14, depth: -55 },
  { x: -260, rotate: -12, y: 22, z: 2, rotateY: 9, depth: -30 },
  { x: -133, rotate: -6, y: 6, z: 3, rotateY: 5, depth: -10 },
  { x: 0, rotate: 0, y: 0, z: 4, rotateY: 0, depth: 0 },
  { x: 133, rotate: 6, y: 6, z: 3, rotateY: -5, depth: -10 },
  { x: 260, rotate: 12, y: 22, z: 2, rotateY: -9, depth: -30 },
  { x: 390, rotate: 18, y: 42, z: 1, rotateY: -14, depth: -55 },
] as const;

/**
 * How far a card slides aside when a sibling is hovered. Immediate
 * neighbours move most, and the effect dies out three cards away, so the
 * deck opens around the pointer instead of every card jumping at once.
 */
function getSpreadOffset(index: number, hoveredIndex: number | null): number {
  if (hoveredIndex === null || index === hoveredIndex) return 0;

  const distance = Math.abs(index - hoveredIndex);
  const magnitude = SPREAD_BY_DISTANCE[distance - 1] ?? 0;

  return index > hoveredIndex ? magnitude : -magnitude;
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

export default function Socials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const perspectiveRef = useRef<HTMLDivElement>(null);
  const scrollGroupRef = useRef<HTMLDivElement>(null);
  const pointerGroupRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [layout, setLayout] = useState<FanPosition[]>([...FAN_LAYOUT]);
  const [isMobile, setIsMobile] = useState(false);

  /** Pick layout breakpoint based on viewport width */
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      if (width < 640) {
        setLayout([...FAN_LAYOUT_SM]);
      } else if (width < 1024) {
        setLayout([...FAN_LAYOUT_MD]);
      } else {
        setLayout([...FAN_LAYOUT]);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /** Scroll-triggered entrance animation */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length === 0) return;
      gsap.fromTo(
        validCards,
        { y: 120, opacity: 0, scale: 0.85 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 0.8,
          },
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.06,
          ease: 'power3.out',
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /**
   * The deck tips upright as it scrolls into view.
   *
   * This lives on its own wrapper because the pointer parallax below writes
   * to a transform too, and two tweens on one element would overwrite each
   * other. Nesting them keeps both, and the browser composes the result.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isMobile) return;

    const group = scrollGroupRef.current;
    if (!group) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        group,
        { rotationX: ENTRY_PITCH },
        {
          rotationX: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  /** The deck turns to follow the cursor across the section. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isMobile) return;

    const frame = perspectiveRef.current;
    const group = pointerGroupRef.current;
    if (!frame || !group) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    const settings = { duration: 0.9, ease: 'power3.out' };
    const yaw = gsap.quickTo(group, 'rotationY', settings);
    const pitch = gsap.quickTo(group, 'rotationX', settings);

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = frame.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;

      const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

      yaw(offsetX * POINTER_YAW * 2);
      pitch(-offsetY * POINTER_PITCH * 2);
    };

    const handlePointerLeave = () => {
      yaw(0);
      pitch(0);
    };

    frame.addEventListener('pointermove', handlePointerMove);
    frame.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      frame.removeEventListener('pointermove', handlePointerMove);
      frame.removeEventListener('pointerleave', handlePointerLeave);
      gsap.killTweensOf(group);
    };
  }, [isMobile]);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 px-4 overflow-hidden bg-[var(--color-background-alt)] relative"
      id="socials"
      aria-label="Social media gallery"
    >
      {/* Heading */}
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20 relative z-10">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight text-[var(--color-foreground)] font-mono">
          OUTSIDE
          <br />
          <span className="gradient-text">THE EDITOR</span>
        </h2>
        <p className="mt-6 text-lg text-[var(--color-foreground-muted)] max-w-2xl mx-auto">
          Cities, light, and whatever caught my eye that week.
        </p>
      </div>

      {/* ─── Mobile grid layout (< 640 px) ───────────────────────────────────── */}
      {isMobile && (
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-2 gap-3 px-2 mx-auto w-full max-w-sm"
        >
          {SOCIAL_CARDS.map((card, index) => {
            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;
            const isSiblingDimmed = isAnyHovered && !isHovered;
            const rotate = MOBILE_ROTATIONS[index] ?? 0;
            /* Make the first card span both columns as a hero image */
            const isHero = index === 0;

            return (
              <a
                key={`${card.platform}-${index}`}
                href={card.href}
                target="_blank"
                rel="noreferrer"
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onFocus={() => handleMouseEnter(index)}
                onBlur={handleMouseLeave}
                aria-label={`View ${card.platform} — ${card.alt}`}
                className={`cursor-target relative rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-lg will-change-transform${
                  isHero ? ' col-span-2' : ''
                }`}
                style={{
                  height: isHero ? '220px' : '160px',
                  transform: `rotate(${rotate}deg) scale(${isHovered ? 1.04 : 1})`,
                  zIndex: isHovered ? 10 : 1,
                  transition:
                    'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease',
                  boxShadow: isHovered
                    ? '0 20px 40px -8px rgba(0,0,0,0.55), 0 0 0 1.5px var(--color-accent)'
                    : '0 6px 20px -4px rgba(0,0,0,0.35)',
                }}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 200px"
                  className="object-cover pointer-events-none select-none"
                  style={{
                    transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                  loading="lazy"
                  draggable={false}
                />

                {/* Dark overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: isHovered
                      ? 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)'
                      : isSiblingDimmed
                        ? 'rgba(0,0,0,0.45)'
                        : 'rgba(0,0,0,0.18)',
                    transition: 'background 0.5s ease',
                  }}
                />

                {/* Platform label — always visible on mobile */}
                <div className="absolute bottom-0 left-0 right-0 p-2 pointer-events-none">
                  <span className="text-white text-[10px] font-semibold tracking-widest uppercase drop-shadow-lg">
                    {card.platform}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* ─── Desktop / tablet fan layout (≥ 640 px) ──────────────────────────── */}
      {!isMobile && (
        <div
          ref={perspectiveRef}
          className="relative mx-auto"
          style={{
            height: 'clamp(420px, 58vw, 680px)',
            perspective: '1600px',
          }}
        >
          {/* Tips upright on scroll. */}
          <div
            ref={scrollGroupRef}
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Turns to follow the cursor. */}
            <div
              ref={pointerGroupRef}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {SOCIAL_CARDS.map((card, index) => {
                const pos = layout[index];
                const isHovered = hoveredIndex === index;
                const isAnyHovered = hoveredIndex !== null;
                const isSiblingDimmed = isAnyHovered && !isHovered;

                /* On hover the card straightens up and comes forward, so the
                   image can be read flat instead of at an angle. */
                const restingRotateY = isHovered ? 0 : pos.rotateY;
                const restingDepth = isHovered ? 60 : pos.depth;
                /* Neighbours slide aside to open a gap around it. */
                const spread = getSpreadOffset(index, hoveredIndex);

                return (
                  <a
                    key={`${card.platform}-${index}`}
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    ref={(el) => {
                      cardsRef.current[index] = el;
                    }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onFocus={() => handleMouseEnter(index)}
                    onBlur={handleMouseLeave}
                    aria-label={`View ${card.platform} — ${card.alt}`}
                    className="cursor-target absolute origin-bottom rounded-[28px] overflow-hidden border border-[var(--color-border)] shadow-xl will-change-transform"
                    style={{
                      width: 'clamp(155px, 22vw, 310px)',
                      height: 'clamp(220px, 32vw, 460px)',
                      transform: `
                        translateX(${pos.x + spread}px)
                        translateY(${pos.y}px)
                        translateZ(${restingDepth}px)
                        rotateY(${restingRotateY}deg)
                        rotate(${pos.rotate}deg)
                        scale(${isHovered ? 1.12 : 1})
                      `,
                      zIndex: isHovered ? 100 : pos.z,
                      transition:
                        'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), z-index 0s, box-shadow 0.8s ease',
                      boxShadow: isHovered
                        ? '0 40px 80px -16px rgba(0,0,0,0.6), 0 0 0 1.5px var(--color-accent)'
                        : '0 10px 30px -8px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Image
                      src={card.src}
                      alt={card.alt}
                      fill
                      sizes="(min-width: 640px) 310px, 50vw"
                      className="object-cover pointer-events-none select-none"
                      style={{
                        transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                        transition:
                          'transform 0.9s cubic-bezier(0.25, 1, 0.5, 1)',
                      }}
                      loading="lazy"
                      draggable={false}
                    />

                    {/* Dark overlay — lifts on hover to reveal full image */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: isHovered
                          ? 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)'
                          : isSiblingDimmed
                            ? 'rgba(0,0,0,0.5)'
                            : 'rgba(0,0,0,0.25)',
                        transition: 'background 0.8s ease',
                      }}
                    />

                    {/* Platform label — appears on hover */}
                    <div
                      className="absolute bottom-0 left-0 right-0 p-3 md:p-4 pointer-events-none"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered
                          ? 'translateY(0)'
                          : 'translateY(8px)',
                        transition:
                          'opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s',
                      }}
                    >
                      <span className="text-white text-xs md:text-sm font-semibold tracking-wider uppercase drop-shadow-lg">
                        {card.platform}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Follow section — social links with roll animation */}
      <div className="max-w-4xl mx-auto text-center mt-16 md:mt-24 relative z-10">
        <p
          className="text-2xl sm:text-3xl md:text-4xl font-light italic text-[var(--color-foreground)] mb-8 md:mb-10"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Find me elsewhere
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Follow on ${link.label}`}
              className="cursor-target group text-xs sm:text-sm md:text-base font-bold tracking-[0.15em] text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors duration-300"
            >
              <HoverRollText text={link.label} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
