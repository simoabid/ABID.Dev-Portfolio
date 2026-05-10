'use client';

/**
 * Contact Section Component
 *
 * Full contact section with:
 * - Left: heading, description, contact info cards, social links
 * - Right: ContactForm with serverless submission
 * - GSAP scroll-triggered entrance animations
 * - Decorative gradient background orbs
 * - prefers-reduced-motion support
 */

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/scroll';
import SectionHeading from './SectionHeading';
import ContactForm from './ContactForm';

const contactInfo = [
  {
    iconPath:
      'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    title: 'Email',
    value: 'seemooabid@gmail.com',
    href: 'mailto:seemooabid@gmail.com',
  },
  {
    iconPath:
      'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    title: 'Phone',
    value: '+212 6 76 22 61 20',
    href: 'tel:+212676226120',
  },
  {
    iconPath:
      'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
    secondPath: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    title: 'Location',
    value: 'Khenifra, Morocco',
    href: '#',
  },
];

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/simoabid',
    icon: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mohamed-amine-abidd',
    icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'Twitter/X',
    href: 'https://www.x.com/SeeMooAbid',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/simoabiid',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReducedMotion) {
        gsap.set([infoRef.current, formWrapperRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }
      // Info column slides in from left
      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current,
          { autoAlpha: 0, x: -40 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: infoRef.current,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        // Stagger contact cards
        const cards = infoRef.current.querySelectorAll('.contact-card');
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cards[0],
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        // Stagger social icons
        const socials = infoRef.current.querySelectorAll('.social-link');
        gsap.fromTo(
          socials,
          { autoAlpha: 0, y: 10, scale: 0.8 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: socials[0],
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
      // Form slides in from right
      if (formWrapperRef.current) {
        gsap.fromTo(
          formWrapperRef.current,
          { autoAlpha: 0, x: 40 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formWrapperRef.current,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 pt-32 overflow-hidden bg-[var(--color-background-alt)]"
      aria-label="Contact me"
    >
      {/* Decorative background orbs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          subtitle="Have a project in mind? Let's make something great together"
          gradient
        >
          Get in Touch
        </SectionHeading>

        <div className="max-w-5xl mx-auto mt-16">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* ── Left: Contact Info ── */}
            <div ref={infoRef} className="opacity-0">
              <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">
                Let&apos;s work together
              </h3>
              <p className="text-[var(--color-foreground-muted)] mb-8 leading-relaxed">
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision.
              </p>

              {/* Contact info cards */}
              <div className="space-y-4 mb-8">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.href}
                    className="contact-card flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-background-alt)]/60 hover:border-[var(--color-border-accent)] hover:bg-[var(--color-background-alt)] hover:-translate-x-1 transition-all duration-300 group"
                    aria-label={`${info.title}: ${info.value}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[var(--color-accent-muted)] flex items-center justify-center text-[var(--color-accent)] group-hover:gradient-bg group-hover:text-white transition-all duration-300 flex-shrink-0">
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
                          d={info.iconPath}
                        />
                        {info.secondPath && (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={info.secondPath}
                          />
                        )}
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-foreground)]">
                        {info.title}
                      </h4>
                      <p className="text-[var(--color-foreground-muted)] text-sm">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit my ${social.label} profile`}
                    className="social-link w-11 h-11 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-white hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Right: Contact Form ── */}
            <div ref={formWrapperRef} className="opacity-0">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
