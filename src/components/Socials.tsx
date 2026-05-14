'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '@/lib/scroll';
import HoverRollText from './UI/HoverRollText';

/* ─── Mobile grid card tilts ────────────────────────────────────────────────── */
/** Slight alternating tilts so the grid still feels organic on mobile */
const MOBILE_ROTATIONS = [-3, 2, -2, 3, -1, 2, -3] as const;

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
}

/**
 * Each card has a fixed translateX (px), rotation (deg), translateY (px),
 * and z-index. These are the RESTING positions and they NEVER change on hover.
 * The values are hand-tuned to match the Lando Norris fan-spread.
 */
const FAN_LAYOUT = [
  { x: -520, rotate: -18, y: 50, z: 1 },
  { x: -345, rotate: -12, y: 25, z: 2 },
  { x: -178, rotate: -6, y: 7, z: 3 },
  { x: 0, rotate: 0, y: 0, z: 4 }, // center
  { x: 178, rotate: 6, y: 7, z: 3 },
  { x: 345, rotate: 12, y: 25, z: 2 },
  { x: 520, rotate: 18, y: 50, z: 1 },
] as const;

/* Mobile-scaled versions */
const FAN_LAYOUT_SM = [
  { x: -240, rotate: -18, y: 34, z: 1 },
  { x: -160, rotate: -12, y: 17, z: 2 },
  { x: -82, rotate: -6, y: 5, z: 3 },
  { x: 0, rotate: 0, y: 0, z: 4 },
  { x: 82, rotate: 6, y: 5, z: 3 },
  { x: 160, rotate: 12, y: 17, z: 2 },
  { x: 240, rotate: 18, y: 34, z: 1 },
] as const;

const FAN_LAYOUT_MD = [
  { x: -390, rotate: -18, y: 42, z: 1 },
  { x: -260, rotate: -12, y: 22, z: 2 },
  { x: -133, rotate: -6, y: 6, z: 3 },
  { x: 0, rotate: 0, y: 0, z: 4 },
  { x: 133, rotate: 6, y: 6, z: 3 },
  { x: 260, rotate: 12, y: 22, z: 2 },
  { x: 390, rotate: 18, y: 42, z: 1 },
] as const;

/* ─── Component ─────────────────────────────────────────────────────────────── */

export default function Socials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
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
          WHAT&apos;S UP
          <br />
          <span className="gradient-text">ON SOCIALS</span>
        </h2>
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
                {/* Image */}
                <img
                  src={card.src}
                  alt={card.alt}
                  className="w-full h-full object-cover pointer-events-none select-none"
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
          ref={cardsContainerRef}
          className="relative mx-auto flex items-center justify-center"
          style={{ height: 'clamp(420px, 58vw, 680px)' }}
        >
          {SOCIAL_CARDS.map((card, index) => {
            const pos = layout[index];
            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;
            const isSiblingDimmed = isAnyHovered && !isHovered;

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
                aria-label={`View ${card.platform} — ${card.alt}`}
                className="cursor-target absolute origin-bottom rounded-[28px] overflow-hidden border border-[var(--color-border)] shadow-xl will-change-transform"
                style={{
                  width: 'clamp(155px, 22vw, 310px)',
                  height: 'clamp(220px, 32vw, 460px)',
                  transform: `
                    translateX(${pos.x}px)
                    translateY(${pos.y}px)
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
                {/* Image */}
                <img
                  src={card.src}
                  alt={card.alt}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  style={{
                    transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                    transition: 'transform 0.9s cubic-bezier(0.25, 1, 0.5, 1)',
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
                    transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
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
      )}

      {/* Follow section — social links with roll animation */}
      <div className="max-w-4xl mx-auto text-center mt-16 md:mt-24 relative z-10">
        <p
          className="text-2xl sm:text-3xl md:text-4xl font-light italic text-[var(--color-foreground)] mb-8 md:mb-10"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Follow me on social media
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
