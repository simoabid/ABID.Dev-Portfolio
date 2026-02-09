'use client';

/**
 * ProjectsGrid Component
 *
 * Responsive grid layout for displaying project cards.
 *
 * Features:
 * - 3 columns on desktop (lg)
 * - 2 columns on tablet (md)
 * - 1 column on mobile
 * - Consistent spacing and gap
 * - Accepts projects array and renders ProjectCard for each
 * - SEO-friendly with semantic HTML
 *
 * Usage:
 * <ProjectsGrid projects={projects} />
 */

import { forwardRef } from 'react';
import ProjectCard from './ProjectCard';
import type { Project } from '@/data/projects';

interface ProjectsGridProps {
  projects: Project[];
  /** Optional CSS class for the grid container */
  className?: string;
}

const ProjectsGrid = forwardRef<HTMLDivElement, ProjectsGridProps>(
  function ProjectsGrid({ projects, className = '' }, ref) {
    if (projects.length === 0) {
      return (
        <div className="text-center py-12 text-[var(--color-foreground-muted)]">
          <p>No projects found.</p>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 ${className}`}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    );
  }
);

export default ProjectsGrid;
