'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useTiltGroup } from '@/hooks/useTiltGroup';
import { MagicContainer, MagicCard } from './UI/MagicBento';

/**
 * Note on the highlights below: they describe the work, not measured
 * outcomes. Earlier revisions carried figures such as "database performance
 * improved by 40%" that came from the project scaffold rather than from any
 * measurement. Precise unverifiable numbers are the first thing an
 * interviewer probes, so they are gone. Replace any of these with real
 * figures whenever you have them.
 */
const experiences = [
  {
    title: 'Junior Full-Stack Developer',
    company: 'Self-Employed',
    date: 'Jan 2024 - Present',
    description:
      'Building web applications end to end — data modelling, API design, and the interfaces sitting on top of them. Mostly React, Node.js and MongoDB.',
    highlights: [
      'Shipped production applications from schema to interface',
      'Designed REST APIs with clear service boundaries',
      'Tuned queries and indexes for read-heavy workloads',
    ],
  },
  {
    title: 'Front-End Developer',
    company: 'Self-Employed',
    date: 'Jun 2023 - Present',
    description:
      'Browser-side work: responsive layouts, accessible components, and keeping interaction smooth on hardware that is not a developer laptop.',
    highlights: [
      'Built layouts that hold their shape across breakpoints',
      'Treated Core Web Vitals as a budget, not an afterthought',
      'Extracted repeated patterns into reusable components',
    ],
  },
  {
    title: 'Web Development Student',
    company: 'Self-Learning',
    date: 'Jan 2023 - Jun 2023',
    description:
      'A deliberate stretch of self-teaching. Fundamentals first, then the frameworks built on top of them.',
    highlights: [
      'Worked through structured courses in HTML, CSS and JavaScript',
      'Built projects to apply each concept rather than only reading',
      'Read and contributed to open-source codebases',
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const tiltRef = useTiltGroup<HTMLDivElement>({ selector: '.tilt-card' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(cardRefs.current.filter(Boolean), { opacity: 1, x: 0 });
        return;
      }

      // Draw timeline line on scroll
      if (timelineRef.current) {
        gsap.fromTo(
          timelineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 80%',
              scrub: 1,
            },
          }
        );
      }

      // Cards: alternate slide direction
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const isLeft = index % 2 === 0;
        gsap.fromTo(
          card,
          {
            autoAlpha: 0,
            x: isLeft ? -60 : 60,
            rotateY: isLeft ? 5 : -5,
          },
          {
            autoAlpha: 1,
            x: 0,
            rotateY: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="min-h-screen py-24 pt-32 bg-[var(--color-background)]"
      aria-label="Work experience"
    >
      <div ref={tiltRef} className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20 relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight text-[var(--color-foreground)] font-mono">
            HOW I GOT
            <br />
            <span className="gradient-text">HERE</span>
          </h2>
          <p className="mt-6 text-lg text-[var(--color-foreground-muted)] max-w-2xl mx-auto">
            Self-taught, then self-employed. The short version of a longer
            habit of taking things apart to see how they work.
          </p>
        </div>
        <MagicContainer className="max-w-3xl mx-auto relative">
          {/* Timeline line */}
          <div
            ref={timelineRef}
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-secondary)] transform md:-translate-x-1/2"
            aria-hidden="true"
          />

          {experiences.map((exp, index) => (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`relative mb-12 last:mb-0 opacity-0 ${
                index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto'
              } md:w-1/2`}
              style={{ perspective: '800px' }}
            >
              {/* Timeline dot */}
              <div
                className={`absolute top-0 w-4 h-4 rounded-full bg-[var(--color-background)] border-4 border-[var(--color-accent)] shadow-lg shadow-[var(--color-shadow-accent)] ${
                  index % 2 === 0
                    ? 'left-0 md:left-auto md:-right-2 md:translate-x-1/2'
                    : 'left-0 md:-left-2 md:-translate-x-1/2'
                }`}
                aria-hidden="true"
              />

              {/* Content card */}
              <MagicCard
                className="tilt-card cursor-target ml-8 md:ml-0 bg-[var(--color-background)]/80 p-6 rounded-xl border border-[var(--color-border-muted)] hover:border-[var(--color-border-accent)] hover:shadow-lg hover:shadow-[var(--color-shadow-accent)] transition-all duration-300"
                data-cursor="pointer"
              >
                <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-1">
                  {exp.title}
                </h3>
                <p className="text-[var(--color-accent)] font-medium mb-2">
                  {exp.company}
                </p>
                <span className="inline-block px-3 py-1 gradient-bg text-[var(--color-foreground-inverted)] text-xs rounded-full mb-4">
                  {exp.date}
                </span>
                <p className="text-[var(--color-foreground-muted)] text-sm mb-4 md:text-left">
                  {exp.description}
                </p>
                <ul className="space-y-1 md:text-left">
                  {exp.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="text-sm text-[var(--color-foreground-muted)] flex items-center gap-2"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-secondary)] flex-shrink-0"
                        aria-hidden="true"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </MagicCard>
            </div>
          ))}
        </MagicContainer>
      </div>
    </section>
  );
}
