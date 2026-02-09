'use client';

/**
 * ProjectCard Component
 *
 * Standard vertical card for secondary projects.
 * Image on top (16:9), content below.
 *
 * - Solid elevated surface with subtle border
 * - Hover: lift, border glow, image zoom
 * - GSAP-ready via forwardRef
 * - Accessible with proper alt text and link labels
 */

import { forwardRef } from 'react';
import Image from 'next/image';
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
    return (
      <div
        ref={ref}
        className="project-card group relative flex flex-col overflow-hidden rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-background-alt)] transition-all duration-500 hover:border-[var(--color-border-accent)] hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--color-shadow-accent)]"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* ── Image Area ── */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-accent-secondary)]/10">
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--color-background-alt)] to-transparent" />
        </div>

        {/* ── Content Area ── */}
        <div className="flex flex-col flex-1 p-6 gap-3">
          {/* Category */}
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-accent-secondary)]">
            {categoryLabels[project.category] ?? project.category}
          </span>

          {/* Title */}
          <h3 className="text-lg font-bold text-[var(--color-foreground)] leading-snug group-hover:text-[var(--color-accent)] transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed line-clamp-2">
            {project.description}
          </p>

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

          {/* View link */}
          <div className="pt-3 mt-auto border-t border-[var(--color-border-muted)]">
            <a
              href={project.liveUrl ?? '#'}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-secondary)] transition-colors duration-200 group/link"
              aria-label={`View project: ${project.title}`}
            >
              View Project
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1"
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
          </div>
        </div>
      </div>
    );
  }
);

export default ProjectCard;
