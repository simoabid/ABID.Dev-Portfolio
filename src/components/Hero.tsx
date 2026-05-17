'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import CodeSnippet from './CodeSnippet';
import AnimatedCodeBrackets from './UI/AnimatedCodeBrackets';
import CtaHoverEffect from './UI/CtaHoverEffect';
import HoverRollText from './UI/HoverRollText';
import StarBorder from './UI/StarBorder';
import TextType from './UI/TextType';
import { MagicContainer } from './UI/MagicBento';
import { gsap, ScrollTrigger } from '@/lib/scroll';

// Three.js portrait is client-only and lazy-loaded so the WebGL bundle stays
// out of the initial critical path.
const HeroPortrait3D = dynamic(() => import('./UI/HeroPortrait3D'), {
  ssr: false,
});

const AuroraBackground = dynamic(() => import('./UI/Aurora'), {
  ssr: false,
});

const ASCIIText = dynamic(() => import('./UI/ASCIIText'), {
  ssr: false,
});

/**
 * Hero Section Component
 *
 * Full-width layout taking advantage of edge margins:
 * - Left: Name, title, tagline, and CTAs (aligned to left edge)
 * - Center: Hero portrait image
 * - Right: Code snippet widget (aligned to right edge)
 *
 * Features:
 * - GSAP ScrollTrigger animations for scroll-driven effects
 * - Typographic reveal animations with staggered text
 * - Parallax floating elements
 * - Fade/translate out on scroll
 *
 * Responsive: Stacks on mobile, side-by-side on desktop
 */

// Name split into parts for animation
const nameFirstPart = ['Mohamed', 'Amine'];
const nameLastPart = ['Abid'];
const titleWords = ['Full-Stack', 'Web', 'Developer'];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const codeSnippetRef = useRef<HTMLDivElement>(null);
  const floatingRef1 = useRef<HTMLDivElement>(null);
  const floatingRef2 = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const greetingRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  const [isSplashCursorEnabled, setIsSplashCursorEnabled] = useState(false);
  const [showAsciiGreeting, setShowAsciiGreeting] = useState(false);

  useEffect(() => {
    // Check initial state from local storage so it reflects correctly
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('splashCursorEnabled');
      if (saved !== null) {
        setIsSplashCursorEnabled(saved === 'true');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setShowAsciiGreeting(false);
      return;
    }

    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => {
        setShowAsciiGreeting(true);
      });
    } else {
      timeoutId = setTimeout(() => {
        setShowAsciiGreeting(true);
      }, 250);
    }

    return () => {
      if (idleId !== null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const toggleSplashCursor = () => {
    const newState = !isSplashCursorEnabled;
    setIsSplashCursorEnabled(newState);
    localStorage.setItem('splashCursorEnabled', String(newState));
    window.dispatchEvent(
      new CustomEvent('splashCursorToggle', { detail: { enabled: newState } })
    );
  };

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Create GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // ========================================
      // INTRO ANIMATIONS (on page load)
      // ========================================

      const introTl = gsap.timeline({ delay: 0.3 });

      // Greeting fade in
      if (greetingRef.current) {
        gsap.set(greetingRef.current, { opacity: 0, y: 20 });
        introTl.to(greetingRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      }

      // Name words staggered reveal
      if (nameRef.current) {
        const nameWords = nameRef.current.querySelectorAll('.name-word');
        gsap.set(nameWords, {
          opacity: 0,
          y: 50,
          rotateX: -30,
        });
        introTl.to(
          nameWords,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
          },
          '-=0.2'
        );
      }

      // Title words staggered reveal
      if (titleRef.current) {
        const titleParts = titleRef.current.querySelectorAll('.title-word');
        gsap.set(titleParts, {
          opacity: 0,
          y: 30,
          rotateX: -20,
        });
        introTl.to(
          titleParts,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.4'
        );
      }

      // Tagline fade in
      if (taglineRef.current) {
        gsap.set(taglineRef.current, { opacity: 0, y: 20 });
        introTl.to(
          taglineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.3'
        );
      }

      // CTAs fade in
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, y: 20 });
        introTl.to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.2'
        );
      }

      // Socials fade in
      if (socialsRef.current) {
        const socialLinks = socialsRef.current.querySelectorAll('a');
        gsap.set(socialLinks, { opacity: 0, scale: 0.5 });
        introTl.to(
          socialLinks,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: 'back.out(1.7)',
          },
          '-=0.2'
        );
      }

      // ========================================
      // SCROLL ANIMATIONS (on scroll)
      // ========================================

      // Hero content fades out and translates up as user scrolls
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
          y: -80,
          opacity: 0,
          ease: 'none',
        });
      }

      // Portrait has a slight parallax effect
      if (portraitRef.current) {
        gsap.to(portraitRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
          y: -50,
          scale: 0.95,
          opacity: 0.5,
          ease: 'none',
        });
      }

      // Code snippet slides out with different timing
      if (codeSnippetRef.current) {
        gsap.to(codeSnippetRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'center top',
            scrub: 1.2,
          },
          y: -60,
          x: 30,
          opacity: 0,
          ease: 'none',
        });
      }

      // Floating elements with faster parallax
      if (floatingRef1.current) {
        gsap.to(floatingRef1.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
          y: -120,
          x: 20,
          rotation: 180,
          ease: 'none',
        });
      }

      if (floatingRef2.current) {
        gsap.to(floatingRef2.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
          y: -100,
          x: -15,
          rotation: -90,
          ease: 'none',
        });
      }
    }, sectionRef);

    // Cleanup on unmount
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center pt-32 md:pt-28 lg:pt-20 pb-12 overflow-hidden"
      aria-label="Hero section - Introduction"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[var(--color-background)]">
        <div className="absolute inset-0 opacity-40 mix-blend-screen">
          <AuroraBackground
            colorStops={['#677cff', '#B497CF', '#5227FF']}
            blend={0.67}
            amplitude={1.0}
            speed={0.5}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_30%,rgba(108,99,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_70%,rgba(0,212,255,0.1),transparent_50%)]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(var(--color-accent) 1px, transparent 1px),
                              linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Full-width layout with edge alignment */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[calc(100vh-10rem)]">
          {/* Left Column - Info & CTAs (spans 4 columns, left-aligned) */}
          <div
            ref={contentRef}
            className="lg:col-span-4 text-center lg:text-left order-2 lg:order-1"
          >
            {/* Greeting */}
            <div
              ref={greetingRef}
              className="relative h-12 md:h-16 lg:h-20 w-40 md:w-56 lg:w-64 mx-auto lg:mx-0 mb-0 md:mb-2 opacity-0 lg:-ml-4"
            >
              {showAsciiGreeting ? (
                <ASCIIText
                  text="Hi, I'm"
                  enableWaves={false}
                  asciiFontSize={2}
                  maxFps={24}
                />
              ) : (
                <span className="inline-flex h-full items-center text-sm font-medium text-[var(--color-accent)]/80">
                  Hi, I&apos;m
                </span>
              )}
            </div>

            {/* Name with split text animation */}
            <h1
              ref={nameRef}
              className="text-4xl md:text-5xl xl:text-6xl font-bold mb-4 font-mono"
              style={{ perspective: '1000px' }}
            >
              {/* Screen reader text */}
              <span className="sr-only">Mohamed Amine Abid</span>

              {/* Visual split text */}
              <span aria-hidden="true">
                {nameFirstPart.map((word, index) => (
                  <span
                    key={word}
                    className="group name-word inline-block text-[var(--color-foreground)]"
                    style={{
                      willChange: 'transform',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <HoverRollText text={word} />
                    {index < nameFirstPart.length - 1 && '\u00A0'}
                  </span>
                ))}
                {'\u00A0'}
                {nameLastPart.map((word) => (
                  <span
                    key={word}
                    className="group name-word inline-block"
                    style={{
                      willChange: 'transform',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <HoverRollText>
                      <span className="gradient-text">{word}</span>
                    </HoverRollText>
                  </span>
                ))}
              </span>
            </h1>

            {/* Title with split text animation */}
            <h2
              ref={titleRef}
              className="text-xl md:text-2xl xl:text-3xl font-semibold text-[var(--color-accent)] mb-6"
              style={{ perspective: '800px' }}
            >
              {/* Screen reader text */}
              <span className="sr-only">Full-Stack Web Developer</span>

              {/* Visual split text */}
              <span aria-hidden="true">
                {titleWords.map((word, index) => (
                  <span
                    key={word}
                    className="group title-word inline-block"
                    style={{
                      willChange: 'transform, opacity',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <HoverRollText text={word} />
                    {index < titleWords.length - 1 && '\u00A0'}
                  </span>
                ))}
              </span>
            </h2>

            {/* Tagline */}
            <p
              ref={taglineRef}
              className="text-[var(--color-foreground-muted)] text-base md:text-lg max-w-sm mb-8 min-h-[4rem]"
            >
              <TextType
                as="span"
                text={[
                  'Building modern web applications with clean code and elegant solutions.',
                  'Crafting scalable and maintainable architectures.',
                  'Delivering seamless digital experiences.',
                ]}
                typingSpeed={50}
                pauseDuration={3000}
                deletingSpeed={20}
                showCursor={true}
                cursorCharacter="|"
              />
            </p>

            {/* CTAs */}
            <div
              ref={ctaRef}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <CtaHoverEffect>
                <StarBorder
                  as={Link}
                  href="#contact"
                  className="cursor-target group inline-block rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
                  innerClassName="btn-primary px-8 py-4"
                  aria-label="Contact me to discuss hiring opportunities"
                  color="var(--color-background)"
                  thickness={2}
                >
                  <HoverRollText text="Contact Me" />
                </StarBorder>
              </CtaHoverEffect>
              <CtaHoverEffect>
                <Link
                  href="#projects"
                  className="cursor-target group btn-outline px-8 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
                  aria-label="View Projects — browse my portfolio"
                >
                  <HoverRollText text="View Projects" />
                </Link>
              </CtaHoverEffect>
            </div>

            {/* Social Links */}
            <div
              ref={socialsRef}
              className="flex gap-4 justify-center lg:justify-start mt-8"
            >
              {[
                {
                  href: 'https://github.com/simoabid',
                  label: 'GitHub',
                  icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
                },
                {
                  href: 'https://www.linkedin.com/in/mohamed-amine-abidd',
                  label: 'LinkedIn',
                  icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                },
                {
                  href: 'https://www.x.com/SeeMooAbid',
                  label: 'Twitter/X',
                  icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                },
                {
                  href: 'https://www.instagram.com/simoabiid',
                  label: 'Instagram',
                  icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                },
              ].map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit my ${social.label} profile`}
                  className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-muted)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Center Column - Portrait Image (spans 4 columns) */}
          <div
            ref={portraitRef}
            className="lg:col-span-4 relative flex justify-center order-1 lg:order-2 pt-2 lg:pt-0"
          >
            {/* Glow effect behind image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 md:w-60 md:h-60 lg:w-[22rem] lg:h-[22rem] xl:w-[26rem] xl:h-[26rem] rounded-full bg-gradient-to-br from-[var(--color-accent)]/30 to-[var(--color-accent-secondary)]/30 blur-3xl" />
            </div>

            {/* Portrait */}
            <div className="cursor-target relative w-48 h-48 md:w-60 md:h-60 lg:w-[22rem] lg:h-[22rem] xl:w-[26rem] xl:h-[26rem] rounded-full overflow-hidden border-4 border-[var(--color-border-accent)] shadow-2xl shadow-[var(--color-shadow-accent)] animate-fade-in">
              <Image
                src="/images/hero-portrait.png"
                alt="Mohamed Amine Abid - Full-Stack Developer"
                fill
                sizes="(max-width: 768px) 192px, (max-width: 1024px) 240px, (max-width: 1280px) 352px, 416px"
                className="object-cover object-center"
                priority
              />
              <HeroPortrait3D
                textureA="/images/hero-portrait.png"
                textureB="/images/hero-portrait-2.png"
              />
            </div>

            {/* Floating decorative elements with parallax */}
            <div
              ref={floatingRef1}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-[var(--color-accent)] animate-pulse-slow opacity-60"
            />
            <div
              ref={floatingRef2}
              className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-[var(--color-accent-secondary)] animate-pulse-slow opacity-60"
            />

            {/* Animated code brackets decoration */}
            <div className="absolute -bottom-10 right-0 opacity-40 hidden lg:block">
              <AnimatedCodeBrackets size={56} />
            </div>
          </div>

          {/* Right Column - Code Snippet (spans 4 columns, right-aligned) */}
          <MagicContainer
            ref={codeSnippetRef}
            className="lg:col-span-4 hidden lg:flex justify-end order-3 animate-slide-up"
          >
            <CodeSnippet />
          </MagicContainer>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <svg
            className="w-6 h-6 text-[var(--color-foreground-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>

        {/* SplashCursor Toggle */}
        <div
          className="hidden lg:block absolute bottom-8 right-6 md:right-12 lg:right-16 xl:right-24 z-20 animate-fade-in"
          style={{ animationDelay: '1s' }}
        >
          <button
            onClick={toggleSplashCursor}
            className="cursor-target flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[var(--color-surface)]/80 backdrop-blur-sm border border-[var(--color-border)] text-xs md:text-sm font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-muted)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] shadow-lg"
            aria-label={
              isSplashCursorEnabled
                ? 'Disable magic cursor'
                : 'Enable magic cursor'
            }
            title="Toggle interactive fluid cursor"
          >
            <span
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-colors duration-300 ${isSplashCursorEnabled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-400/80'}`}
            />
            Magic Cursor
          </button>
        </div>
      </div>
    </section>
  );
}
