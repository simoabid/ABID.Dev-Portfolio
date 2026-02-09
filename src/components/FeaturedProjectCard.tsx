'use client';

/**
 * FeaturedProjectCard Component
 *
 * Large cinematic card for the #1 project — full-width with
 * a ~60:40 golden ratio split (image left, content right).
 *
 * - Solid elevated surface (intentionally NOT glass)
 * - Layered box-shadows with accent glow on hover
 * - GSAP-ready refs for parent animation orchestration
 * - next/image for optimized project screenshots
 * - Responsive: stacks on mobile (image on top)
 */

import { forwardRef } from 'react';
import Image from 'next/image';
import type { Project } from '@/data/projects';

interface FeaturedProjectCardProps {
  project: Project;
}

const FeaturedProjectCard = forwardRef<
  HTMLDivElement,
  FeaturedProjectCardProps
>(function FeaturedProjectCard({ project }, ref) {
  return (
    <div
      ref={ref}
      className="featured-card group relative grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-2xl border border-[var(--color-border-muted)] bg-[var(--color-background-alt)] transition-all duration-500 hover:border-[var(--color-border-accent)] hover:shadow-2xl hover:shadow-[var(--color-shadow-accent)]"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Accent gradient border-bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

      {/* ── Image Area (Left 7/12 ≈ 58%) ── */}
      <div className="relative lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden">
        {/* Project screenshot */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent-secondary)]/20">
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 58vw"
            priority
          />
        </div>

        {/* Blending overlay from right */}
        <div className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--color-background-alt)] to-transparent" />

        {/* Blending overlay from bottom (mobile) */}
        <div className="lg:hidden absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--color-background-alt)] to-transparent" />
      </div>

      {/* ── Content Area (Right 5/12 ≈ 42%) ── */}
      <div className="lg:col-span-5 flex flex-col justify-center p-8 lg:p-10 xl:p-12 gap-5">
        {/* Category label */}
        <span className="inline-block w-fit text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-secondary)]">
          Featured Project
        </span>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl xl:text-4xl font-bold text-[var(--color-foreground)] leading-tight group-hover:gradient-text transition-all duration-300">
          {project.title}
        </h3>

        {/* Tagline */}
        <p className="text-base text-[var(--color-foreground-muted)] italic leading-relaxed">
          &ldquo;{project.tagline}&rdquo;
        </p>

        {/* Challenge */}
        <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
          {project.challenge}
        </p>

        {/* Outcome stat */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold gradient-text">
            {project.outcome}
          </span>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-medium rounded-full border border-[var(--color-border)] text-[var(--color-foreground-muted)] bg-[var(--color-background)]/50 transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              className="btn-primary px-6 py-2.5 text-sm font-semibold"
              aria-label={`View live demo of ${project.title}`}
            >
              View Case Study
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              className="btn-outline px-6 py-2.5 text-sm font-semibold"
              aria-label={`View source code of ${project.title}`}
            >
              Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

export default FeaturedProjectCard;
