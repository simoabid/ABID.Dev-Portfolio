'use client';

import { useEffect, useRef } from 'react';
import Container from './Container';
import { Grid, GridItem } from './Grid';
import { gsap, ScrollTrigger } from '@/lib/scroll';

const skills = [
  { name: 'HTML5', level: 95, icon: 'H' },
  { name: 'CSS3', level: 90, icon: 'C' },
  { name: 'JavaScript', level: 85, icon: 'JS' },
  { name: 'React', level: 85, icon: 'R' },
  { name: 'Node.js', level: 80, icon: 'N' },
  { name: 'MongoDB', level: 75, icon: 'M' },
  { name: 'TypeScript', level: 80, icon: 'TS' },
  { name: 'Python', level: 70, icon: 'Py' },
  { name: 'Git', level: 85, icon: 'G' },
  { name: 'PHP', level: 70, icon: 'P' },
  { name: 'Laravel', level: 65, icon: 'L' },
  { name: 'Linux', level: 75, icon: 'Li' },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      // Staggered card entrance with rotation
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 40, rotateY: -10, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Animate progress bar widths from 0
      cards.forEach((card, index) => {
        const bar = card.querySelector('.skill-bar-fill') as HTMLElement;
        if (!bar) return;
        gsap.fromTo(
          bar,
          { width: '0%' },
          {
            width: `${skills[index].level}%`,
            duration: 1.2,
            delay: index * 0.06,
            ease: 'power2.out',
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
      id="skills"
      className="min-h-screen py-24 pt-32 bg-[var(--color-background-alt)]"
      aria-label="Technical skills"
    >
      <Container size="xl">
        <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20 relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight text-[var(--color-foreground)] font-mono">
            MY
            <br />
            <span className="gradient-text">SKILLS</span>
          </h2>
        </div>
        <Grid
          cols={2}
          colsMd={3}
          colsLg={4}
          gap={6}
          className="max-w-5xl mx-auto"
        >
          {skills.map((skill, index) => (
            <GridItem key={skill.name}>
              <div
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="cursor-target group p-6 bg-[var(--color-background-alt)] rounded-xl border border-[var(--color-border-muted)] hover:border-[var(--color-border-accent)] hover:shadow-xl hover:shadow-[var(--color-shadow-accent)] transition-all duration-300 opacity-0"
                style={{ perspective: '600px' }}
                data-cursor="view"
              >
                {/* Icon */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--color-accent-muted)] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span
                    className="gradient-text text-xl font-bold"
                    aria-hidden="true"
                  >
                    {skill.icon}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-center text-lg font-semibold text-[var(--color-foreground)] mb-3">
                  {skill.name}
                </h3>

                {/* Progress Bar */}
                <div
                  className="relative h-2 bg-[var(--color-background)] rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={skill.level}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${skill.name} proficiency: ${skill.level}%`}
                >
                  <div
                    className="skill-bar-fill absolute inset-y-0 left-0 gradient-bg rounded-full"
                    style={{ width: 0 }}
                  />
                </div>

                {/* Percentage */}
                <p
                  className="text-center text-sm text-[var(--color-accent)] mt-2 font-medium"
                  aria-hidden="true"
                >
                  {skill.level}%
                </p>
              </div>
            </GridItem>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
