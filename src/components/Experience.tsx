'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { MagicContainer, MagicCard } from './UI/MagicBento';

const experiences = [
  {
    title: 'Junior Full-Stack Developer',
    company: 'Self-Employed',
    date: 'Jan 2024 - Present',
    description:
      'Creating scalable web applications, focusing on microservices architecture and cloud integration. Developing full-stack solutions using React, Node.js, and MongoDB.',
    highlights: [
      'Built 5+ production-ready web applications',
      'Implemented RESTful APIs and microservices',
      'Optimized database performance by 40%',
    ],
  },
  {
    title: 'Front-End Developer',
    company: 'Self-Employed',
    date: 'Jun 2023 - Present',
    description:
      'Specialized in creating responsive, user-friendly interfaces with React and modern CSS. Focus on accessibility and performance optimization.',
    highlights: [
      'Developed pixel-perfect responsive designs',
      'Improved Core Web Vitals scores by 60%',
      'Created reusable component libraries',
    ],
  },
  {
    title: 'Web Development Student',
    company: 'Self-Learning',
    date: 'Jan 2023 - Jun 2023',
    description:
      'Intensive self-study period focused on mastering web development fundamentals and modern frameworks.',
    highlights: [
      'Completed 10+ online courses',
      'Built personal portfolio projects',
      'Contributed to open-source projects',
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

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
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20 relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight text-[var(--color-foreground)] font-mono">
            MY
            <br />
            <span className="gradient-text">EXPERIENCE</span>
          </h2>
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
                className="cursor-target ml-8 md:ml-0 bg-[var(--color-background)]/80 p-6 rounded-xl border border-[var(--color-border-muted)] hover:border-[var(--color-border-accent)] hover:shadow-lg hover:shadow-[var(--color-shadow-accent)] transition-all duration-300"
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
