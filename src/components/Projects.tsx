'use client';

/**
 * Projects Section Component
 *
 * Premium projects showcase with:
 * - Animated SectionHeading (word-reveal on scroll)
 * - Category filter pills with active state
 * - Featured hero card (large, cinematic, 60:40 split)
 * - Secondary cards in a responsive 3-column grid
 * - Full GSAP ScrollTrigger animation system
 * - Decorative background gradient orbs
 * - prefers-reduced-motion support
 *
 * Layout: Heading → Filters → Featured Card → 3-col Grid
 * Section sits on --color-background-alt for contrast with Hero above
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import Container from './Container';
import FeaturedProjectCard from './FeaturedProjectCard';
import ProjectCard from './ProjectCard';
import ProjectFilter from './ProjectFilter';
import LogoLoop from './UI/LogoLoop';
import {
  projects,
  getFeaturedProject,
  getSecondaryProjects,
  getCategories,
} from '@/data/projects';
import { gsap, ScrollTrigger } from '@/lib/scroll';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiMongodb,
  SiPython,
  SiLaravel,
  SiGit,
  SiLinux,
} from 'react-icons/si';

const techLogos = [
  { node: <SiHtml5 style={{ color: '#e34f26' }} />, title: 'HTML5' },
  { node: <SiCss style={{ color: '#1572b6' }} />, title: 'CSS3' },
  { node: <SiJavascript style={{ color: '#f7df1e' }} />, title: 'JavaScript' },
  { node: <SiTypescript style={{ color: '#3178c6' }} />, title: 'TypeScript' },
  { node: <SiReact style={{ color: '#61dafb' }} />, title: 'React' },
  { node: <SiNextdotjs />, title: 'Next.js' },
  { node: <SiNodedotjs style={{ color: '#5fa04e' }} />, title: 'Node.js' },
  { node: <SiMongodb style={{ color: '#47a248' }} />, title: 'MongoDB' },
  { node: <SiPython style={{ color: '#3776ab' }} />, title: 'Python' },
  { node: <SiLaravel style={{ color: '#ff2d20' }} />, title: 'Laravel' },
  { node: <SiGit style={{ color: '#f05032' }} />, title: 'Git' },
  { node: <SiLinux />, title: 'Linux' },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const decorRef1 = useRef<HTMLDivElement>(null);
  const decorRef2 = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState('all');

  const featured = getFeaturedProject();
  const categories = getCategories();

  // Get filtered secondary projects
  const secondaryProjects =
    activeCategory === 'all'
      ? getSecondaryProjects()
      : projects.filter((p) => p.category === activeCategory && !p.featured)
            .length > 0
        ? projects.filter((p) => p.category === activeCategory && !p.featured)
        : getSecondaryProjects();

  // Show featured card only when "all" or its category is active
  const showFeatured =
    activeCategory === 'all' || activeCategory === featured.category;

  // ─── Filter change with GSAP transition ───
  const handleCategoryChange = useCallback(
    (category: string) => {
      if (category === activeCategory) return;

      // Animate cards out
      const cards = cardRefs.current.filter(Boolean);
      const tl = gsap.timeline({
        onComplete: () => {
          setActiveCategory(category);
          // Animate new cards in after state update
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const newCards = cardRefs.current.filter(Boolean);
              gsap.fromTo(
                newCards,
                { autoAlpha: 0, y: 30, scale: 0.96 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: 'power3.out',
                }
              );
            });
          });
        },
      });

      tl.to(cards, {
        autoAlpha: 0,
        y: -20,
        scale: 0.96,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
      });
    },
    [activeCategory]
  );

  // ─── GSAP Scroll Animations ───
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Check reduced motion
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        // Show everything immediately
        gsap.set(
          [
            filterRef.current,
            featuredRef.current,
            ...cardRefs.current.filter(Boolean),
            decorRef1.current,
            decorRef2.current,
          ],
          { opacity: 1, y: 0 }
        );
        return;
      }

      // ── Filter pills entrance ──
      if (filterRef.current) {
        gsap.fromTo(
          filterRef.current,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: filterRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // ── Featured card entrance ──
      if (featuredRef.current) {
        gsap.fromTo(
          featuredRef.current,
          { autoAlpha: 0, y: 60, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: featuredRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // ── Secondary cards staggered entrance ──
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 50, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // ── Decorative orbs parallax ──
      if (decorRef1.current) {
        gsap.to(decorRef1.current, {
          y: -80,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      if (decorRef2.current) {
        gsap.to(decorRef2.current, {
          y: 60,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-24 pt-32 bg-[var(--color-background)] overflow-hidden"
      aria-label="Selected projects"
    >
      {/* ── Decorative Background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Subtle top gradient fade from hero */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-background)] to-transparent" />

        {/* Floating gradient orbs */}
        <div
          ref={decorRef1}
          className="absolute -top-20 -left-40 w-[500px] h-[500px] rounded-full bg-[var(--color-accent)]/5 blur-3xl"
        />
        <div
          ref={decorRef2}
          className="absolute -bottom-20 -right-40 w-[400px] h-[400px] rounded-full bg-[var(--color-accent-secondary)]/5 blur-3xl"
        />

        {/* Subtle dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <Container size="xl" className="relative z-10">
        {/* ── Section Heading ── */}
        <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20 relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight text-[var(--color-foreground)] font-mono">
            SELECTED
            <br />
            <span className="gradient-text">WORK</span>
          </h2>
          <p className="text-[var(--color-foreground-muted)] mt-6 text-lg md:text-xl max-w-2xl mx-auto">
            Handpicked projects that showcase real impact, not just code
          </p>
        </div>

        {/* ── Filter Pills ── */}
        <div className="mt-10 mb-14">
          <ProjectFilter
            ref={filterRef}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* ── Featured Project Card ── */}
        {showFeatured && (
          <div className="mb-10">
            <FeaturedProjectCard ref={featuredRef} project={featured} />
          </div>
        )}

        {/* ── Secondary Projects Grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {secondaryProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              project={project}
            />
          ))}
        </div>

        {/* ── Tech-stack marquee ── */}
        <div className="mt-20 overflow-hidden">
          <p className="text-center text-xs uppercase tracking-widest text-[var(--color-foreground-subtle)] mb-8 font-mono">
            Technologies I work with
          </p>
          <LogoLoop
            logos={techLogos}
            speed={80}
            direction="left"
            logoHeight={32}
            gap={48}
            hoverSpeed={20}
            fadeOut
            ariaLabel="Technology stack: HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Node.js, MongoDB, Python, Laravel, Git, Linux"
            renderItem={(item) => {
              const logo = item as (typeof techLogos)[number];
              return (
                <div className="flex flex-col items-center gap-2">
                  <span
                    className="text-[var(--color-foreground-muted)] transition-colors duration-300 hover:text-[var(--color-foreground)]"
                    style={{ fontSize: 32 }}
                  >
                    {logo.node}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-foreground-subtle)]">
                    {logo.title}
                  </span>
                </div>
              );
            }}
          />
        </div>
      </Container>
    </section>
  );
}
