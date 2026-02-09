'use client';

/**
 * ProjectCard Component
 *
 * Standard vertical card for secondary projects with hover overlay reveal.
 * Image on top (16:9), content below, overlay on hover/focus.
 *
 * Features:
 * - Overlay reveals on hover AND keyboard focus (accessible)
 * - GSAP microanimations for smooth hover transitions
 * - Scale, translate, and overlay fade animations
 * - Lazy-loaded images with Next.js Image
 * - Maintains aspect ratio
 * - Keyboard navigable with visible focus states
 */

import { forwardRef, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/scroll';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
}

const categoryLabels: Record<string, string> = {
  'full-stack': 'Full-Stack',
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
};

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  function ProjectCard({ project }, ref) {
    const internalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const linkRef = useRef<HTMLAnchorElement>(null);

    // Merge refs: use callback to sync internal and forwarded refs
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        // Set internal ref
        (internalRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;

        // Sync forwarded ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );

    useEffect(() => {
      if (typeof window === 'undefined') return;

      const card = internalRef.current;
      const overlay = overlayRef.current;
      const image = imageRef.current;
      const content = contentRef.current;
      const link = linkRef.current;

      if (!card || !overlay || !image || !content || !link) return;

      // Initial state: overlay hidden
      gsap.set(overlay, { autoAlpha: 0, y: 20 });

      // Hover animation timeline
      const showOverlay = gsap.timeline({ paused: true });
      showOverlay
        .to(overlay, {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
        .to(
          image,
          {
            scale: 1.1,
            duration: 0.5,
            ease: 'power2.out',
          },
          0
        )
        .to(
          content,
          {
            y: -5,
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        );

      // Mouse events
      const handleMouseEnter = () => showOverlay.play();
      const handleMouseLeave = () => showOverlay.reverse();

      // Keyboard events (for accessibility)
      const handleFocus = () => showOverlay.play();
      const handleBlur = (e: FocusEvent) => {
        // Don't hide if focus is moving to a child element
        if (!card.contains(e.relatedTarget as Node)) {
          showOverlay.reverse();
        }
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      link.addEventListener('focus', handleFocus);
      card.addEventListener('focusout', handleBlur);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
        link.removeEventListener('focus', handleFocus);
        card.removeEventListener('focusout', handleBlur);
        showOverlay.kill();
      };
    }, []);

    return (
      <article
        ref={setRefs}
        className="project-card group relative flex flex-col overflow-hidden rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-background-alt)] transition-all duration-300 hover:border-[var(--color-border-accent)] hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--color-shadow-accent)] focus-within:border-[var(--color-border-accent)] focus-within:-translate-y-2 focus-within:shadow-xl focus-within:shadow-[var(--color-shadow-accent)]"
        style={{ willChange: 'transform' }}
      >
        {/* ── Image Area ── */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-accent-secondary)]/10">
          <div ref={imageRef} className="absolute inset-0">
            <Image
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          </div>

          {/* Hover Overlay - reveals on hover/focus */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col justify-end p-6 gap-3"
            style={{ willChange: 'opacity, transform' }}
          >
            <h3 className="text-lg font-bold text-white leading-snug">
              {project.title}
            </h3>
            <p className="text-sm text-white/90 leading-relaxed line-clamp-3">
              {project.tagline || project.description}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                ref={linkRef}
                href={project.liveUrl ?? '#'}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50"
                aria-label={`View project: ${project.title}`}
                tabIndex={0}
              >
                View Project
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  className="inline-flex items-center justify-center w-10 h-10 text-white hover:text-white/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50 rounded-lg"
                  aria-label={`View ${project.title} repository`}
                  tabIndex={0}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Content Area ── */}
        <div ref={contentRef} className="flex flex-col flex-1 p-6 gap-3">
          {/* Category */}
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-accent-secondary)]">
            {categoryLabels[project.category] ?? project.category}
          </span>

          {/* Title */}
          <h3 className="text-lg font-bold text-[var(--color-foreground)] leading-snug group-hover:text-[var(--color-accent)] transition-colors duration-300">
            {project.title}
          </h3>

          {/* Outcome badge */}
          <span className="inline-block w-fit text-xs font-semibold gradient-text">
            {project.outcome}
          </span>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 text-[11px] font-medium rounded-full border border-[var(--color-border)] text-[var(--color-foreground-muted)] transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full border border-[var(--color-border)] text-[var(--color-foreground-muted)]">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }
);

export default ProjectCard;
