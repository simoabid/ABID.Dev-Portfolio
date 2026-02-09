'use client';

/**
 * ProjectFilter Component
 *
 * Horizontal row of pill-shaped category filter buttons.
 *
 * - Active pill gets gradient background
 * - Inactive pills have subtle border, hover feedback
 * - GSAP-ready via forwardRef on container
 * - Accessible: uses role="tablist" / role="tab" pattern
 */

import { forwardRef } from 'react';

interface ProjectFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryLabels: Record<string, string> = {
  all: 'All',
  'full-stack': 'Full-Stack',
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
};

const ProjectFilter = forwardRef<HTMLDivElement, ProjectFilterProps>(
  function ProjectFilter(
    { categories, activeCategory, onCategoryChange },
    ref
  ) {
    return (
      <div
        ref={ref}
        role="tablist"
        aria-label="Filter projects by category"
        className="flex flex-wrap justify-center gap-2 md:gap-3"
      >
        {categories.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(category)}
              className={`
                relative px-5 py-2 rounded-full text-sm font-semibold
                transition-all duration-300 outline-none
                focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]
                ${
                  isActive
                    ? 'gradient-bg text-white shadow-lg shadow-[var(--color-shadow-accent)]'
                    : 'bg-transparent text-[var(--color-foreground-muted)] border border-[var(--color-border)] hover:border-[var(--color-border-accent)] hover:text-[var(--color-foreground)]'
                }
              `}
            >
              {categoryLabels[category] ?? category}
            </button>
          );
        })}
      </div>
    );
  }
);

export default ProjectFilter;
