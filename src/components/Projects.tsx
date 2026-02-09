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
import SectionHeading from './SectionHeading';
import FeaturedProjectCard from './FeaturedProjectCard';
import ProjectCard from './ProjectCard';
import ProjectFilter from './ProjectFilter';
import HelmetContainer from './Three/HelmetContainer';
import {
  projects,
  getFeaturedProject,
  getSecondaryProjects,
  getCategories,
} from '@/data/projects';
import { gsap, ScrollTrigger } from '@/lib/scroll';

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
      className="relative py-24 pt-32 bg-[var(--color-background-alt)] overflow-hidden"
    >
      {/* ── Decorative Background ── */}
      <div className="absolute inset-0 pointer-events-none">
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
        <SectionHeading
          subtitle="Handpicked projects that showcase real impact, not just code"
          gradient
        >
          Selected Work
        </SectionHeading>

        {/* ── Phase 9: 3D Viewer Skeleton Preview ── */}
        <div className="mt-10 mb-14">
          <HelmetContainer />
        </div>

        {/* ── Filter Pills ── */}
        <div className="mb-14">
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
      </Container>
    </section>
  );
}
