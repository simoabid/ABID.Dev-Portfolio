'use client';

import { useEffect, useRef } from 'react';
import Container from './Container';
import { Grid, GridItem } from './Grid';
import { MagicContainer, MagicCard } from './UI/MagicBento';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import CurvedLoop from './UI/CurvedLoop';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiPhp,
  SiLaravel,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiLinux,
  SiDocker,
  SiFigma,
} from 'react-icons/si';

const skillCategories = [
  {
    title: 'Frontend Architecture',
    description: 'Building responsive, accessible, and performant interfaces.',
    spanLg: 2 as const,
    skills: [
      { name: 'React', Icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', Icon: SiNextdotjs, color: '#ffffff' },
      { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
      { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'HTML5', Icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS3', Icon: SiCss, color: '#1572B6' },
    ],
  },
  {
    title: 'Backend Systems',
    description: 'Developing scalable APIs and robust server logic.',
    spanLg: 1 as const,
    skills: [
      { name: 'Node.js', Icon: SiNodedotjs, color: '#339933' },
      { name: 'Python', Icon: SiPython, color: '#3776AB' },
      { name: 'PHP', Icon: SiPhp, color: '#777BB4' },
      { name: 'Laravel', Icon: SiLaravel, color: '#FF2D20' },
    ],
  },
  {
    title: 'Database & Infrastructure',
    description: 'Managing data persistence and deployment pipelines.',
    spanLg: 3 as const,
    skills: [
      { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
      { name: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1' },
      { name: 'Git', Icon: SiGit, color: '#F05032' },
      { name: 'Linux', Icon: SiLinux, color: '#FCC624' },
      { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
      { name: 'Figma', Icon: SiFigma, color: '#F24E1E' },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      if (cards.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      // Staggered card entrance
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 50, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Animate individual skill badges inside each card
      cards.forEach((card, cardIndex) => {
        const badges = card.querySelectorAll('.skill-badge');
        if (badges.length === 0) return;

        gsap.fromTo(
          badges,
          { autoAlpha: 0, scale: 0.8, y: 20 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'back.out(1.5)',
            delay: 0.2 + cardIndex * 0.15,
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
      className="min-h-screen py-24 pt-32 bg-[var(--color-background-alt)] overflow-hidden"
      aria-label="Technical skills"
    >
      <Container size="xl">
        <div className="max-w-7xl mx-auto text-center mb-16 md:mb-24 relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight text-[var(--color-foreground)] font-mono">
            MY
            <br />
            <span className="gradient-text">SKILLS</span>
          </h2>
          <p className="mt-6 text-lg text-[var(--color-foreground-muted)] max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise, spanning
            frontend architecture, backend systems, and modern development
            tooling.
          </p>
        </div>

        <MagicContainer>
          <Grid
            cols={1}
            colsMd={2}
            colsLg={3}
            gap={6}
            className="max-w-6xl mx-auto"
          >
            {skillCategories.map((category, index) => (
              <GridItem key={category.title} spanLg={category.spanLg}>
                <MagicCard
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="group relative h-full p-8 md:p-10 bg-[var(--color-background-alt)] rounded-2xl border border-[var(--color-border-muted)] hover:border-[var(--color-border-accent)] transition-all duration-500 opacity-0 overflow-hidden flex flex-col"
                  style={{ perspective: '1000px' }}
                >
                  {/* Background Accents */}
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-[var(--color-accent)] to-transparent opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>

                  {/* Header */}
                  <div className="relative z-10 mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)] mb-3 tracking-tight">
                      {category.title}
                    </h3>
                    <p className="text-[var(--color-foreground-muted)] text-base md:text-lg leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div className="relative z-10 flex flex-wrap gap-3 md:gap-4 mt-auto">
                    {category.skills.map((skill) => {
                      const { Icon } = skill;
                      return (
                        <div
                          key={skill.name}
                          className="skill-badge cursor-target flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--color-background)]/80 border border-[var(--color-border-muted)] hover:border-[var(--color-accent-muted)] hover:bg-[var(--color-accent-muted)]/10 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                          style={{
                            boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)',
                          }}
                          data-cursor="view"
                        >
                          <Icon
                            className="text-xl md:text-2xl transition-transform duration-300 group-hover/badge:scale-110"
                            style={{ color: skill.color }}
                          />
                          <span className="font-medium text-sm md:text-base text-[var(--color-foreground)]">
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </MagicCard>
              </GridItem>
            ))}
          </Grid>
        </MagicContainer>
      </Container>

      {/* Decorative infinite scroll at bottom */}
      <div className="w-full overflow-hidden text-[var(--color-foreground)] mt-32 opacity-40 hover:opacity-100 transition-opacity duration-500">
        <CurvedLoop
          marqueeText="FRONTEND ✦ BACKEND ✦ SYSTEM DESIGN ✦ FULL STACK ✦ "
          speed={2.3}
          curveAmount={170}
          direction="right"
          interactive={true}
          className="text-[var(--color-accent)]"
        />
      </div>
    </section>
  );
}
