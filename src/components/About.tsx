'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/scroll';

/**
 * About Section Component
 *
 * A premium, modern About section featuring:
 * - Bento grid layout (asymmetric, not simple 2-column)
 * - Glassmorphic stats cards with animated counters
 * - Profile area with animated gradient border
 * - GSAP scroll-triggered animations
 * - Dark/light theme support via CSS variables
 *
 * Accessibility: Supports prefers-reduced-motion
 */

// Stats data
const stats = [
  { value: 2, suffix: '+', label: 'Years Experience' },
  { value: 10, suffix: '+', label: 'Projects Completed' },
  { value: 5, suffix: '+', label: 'Happy Clients' },
];

// Feature highlights
const features = [
  {
    title: 'Problem Solver',
    description:
      'Specializing in debugging complex architectural bottlenecks and optimizing for peak performance.',
  },
  {
    title: 'UI Enthusiast',
    description:
      'Crafting pixel-perfect designs with fluid motions and modern aesthetics that users love.',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bioRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        // Immediately show all elements without animation
        gsap.set(
          [
            profileRef.current,
            ...statsRefs.current,
            bioRef.current,
            ctaRef.current,
          ],
          { opacity: 1, y: 0 }
        );
        return;
      }

      // Profile area animation
      if (profileRef.current) {
        gsap.fromTo(
          profileRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: profileRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Stats cards staggered animation with counter
      statsRefs.current.forEach((stat, index) => {
        if (!stat) return;

        const valueEl = stat.querySelector('.stat-value');
        const targetValue = stats[index].value;

        gsap.fromTo(
          stat,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Counter animation
        if (valueEl) {
          const counter = { val: 0 };
          gsap.to(counter, {
            val: targetValue,
            duration: 2,
            delay: index * 0.1 + 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            onUpdate: () => {
              valueEl.textContent = Math.round(counter.val).toString();
            },
          });
        }
      });

      // Bio section animation
      if (bioRef.current) {
        gsap.fromTo(
          bioRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bioRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // CTA animation
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Social icons entrance animation
      const socialIcons = sectionRef.current?.querySelectorAll('.social-icon');
      if (socialIcons && socialIcons.length > 0) {
        gsap.fromTo(
          socialIcons,
          { opacity: 0, y: 15, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: socialIcons[0],
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-24 pt-32 overflow-hidden"
      style={{ background: 'var(--color-background-alt)' }}
    >
      {/* Floating gradient orbs - decorative background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float-slow"
          style={{
            background:
              'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 -right-48 w-80 h-80 rounded-full opacity-15 blur-3xl animate-float-delayed"
          style={{
            background:
              'radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-24 left-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl animate-float"
          style={{
            background:
              'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="section-heading">About Me</h2>

        {/* Bento Grid Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Profile Area - Large card spanning left side */}
            <div
              ref={profileRef}
              className="lg:col-span-5 lg:row-span-2 opacity-0"
            >
              <div className="relative h-full min-h-[400px] lg:min-h-full rounded-3xl p-8 flex flex-col items-center justify-center glass-card overflow-hidden">
                {/* Availability Badge - Moved to top */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                    <span className="text-[9px] font-bold tracking-widest text-[var(--color-accent)] uppercase">
                      Available for projects
                    </span>
                  </div>
                </div>

                {/* Animated gradient border ring */}
                <div className="relative mb-6 mt-8">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-[var(--color-accent)] opacity-75 blur-sm animate-gradient-rotate" />
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[var(--color-background)] bg-gradient-to-br from-[var(--color-accent)]/30 to-[var(--color-accent-secondary)]/30 flex items-center justify-center">
                    {/* Profile placeholder */}
                    <svg
                      className="w-20 h-20 text-[var(--color-foreground-muted)] opacity-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Name and title */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
                    Mohamed Amine Abid
                  </h3>

                  <div className="flex flex-col items-center gap-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border border-[var(--color-border)] bg-[var(--color-background)]/50 text-[var(--color-foreground-muted)] shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-secondary)] animate-pulse" />
                      Full-Stack Web Developer
                    </span>

                    {/* Social Media Icons */}
                    <div className="flex items-center gap-4">
                      {[
                        { icon: 'github', href: 'https://github.com/simoabid' },
                        { icon: 'twitter', href: 'https://twitter.com' },
                        {
                          icon: 'linkedin',
                          href: 'https://linkedin.com/in/mohamed-amine-abid-313262174/',
                        },
                      ].map((app, i) => (
                        <a
                          key={app.icon}
                          href={app.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon group w-11 h-11 rounded-full flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-background)]/50 text-[var(--color-foreground-muted)] hover:text-white hover:border-[var(--color-accent)] transition-all duration-300 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/80 to-[var(--color-accent-secondary)]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                          {app.icon === 'github' && (
                            <svg
                              className="w-5 h-5 relative z-10"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                          )}
                          {app.icon === 'twitter' && (
                            <svg
                              className="w-5 h-5 relative z-10"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                          )}
                          {app.icon === 'linkedin' && (
                            <svg
                              className="w-5 h-5 relative z-10"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative accent line */}
                <div className="mt-8 w-16 h-1 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)]" />
              </div>
            </div>

            {/* Stats Cards - Right side, top row */}
            <div className="lg:col-span-7 grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  ref={(el) => {
                    statsRefs.current[index] = el;
                  }}
                  className="opacity-0 glass-card rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span className="stat-value text-4xl lg:text-5xl font-bold gradient-text">
                      0
                    </span>
                    <span className="text-2xl lg:text-3xl font-bold gradient-text">
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Bio Content - Right side, bottom row */}
            <div
              ref={bioRef}
              className="lg:col-span-7 opacity-0 glass-card rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                Who I Am
              </h3>
              <p className="text-lg text-[var(--color-foreground-muted)] mb-4 leading-relaxed">
                I am a Full-Stack Developer obsessed with crafting scalable,
                high-performance web applications that merge technical
                excellence with immersive user experiences.
              </p>
              <p className="text-lg text-[var(--color-foreground-muted)] mb-6 leading-relaxed">
                My journey began with a curiosity for how the internet works,
                which evolved into a professional career focused on modern tech
                stacks like React, Node.js, and Cloud Architecture. I believe
                code is not just instructions for machines, but a medium for
                solving human problems.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/50"
                  >
                    <h4 className="text-sm font-semibold text-[var(--color-accent)] mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-[var(--color-foreground-muted)]">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 opacity-0"
          >
            <a
              href="/resume.pdf"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Resume
            </a>
            <Link
              href="#contact"
              className="btn-outline inline-flex items-center gap-2 px-8 py-4 text-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Let&apos;s Connect
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
