interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  category: string;
}

const placeholderProjects: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description:
      'A full-featured online shopping platform with cart functionality, user authentication, and payment integration.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    category: 'react',
  },
  {
    id: 2,
    title: 'Task Management App',
    description:
      'A collaborative task management application with real-time updates, team collaboration features, and drag-and-drop interface.',
    technologies: ['React', 'Firebase', 'Material UI'],
    category: 'nodejs',
  },
  {
    id: 3,
    title: 'Social Media Dashboard',
    description:
      'A dashboard for managing multiple social media accounts with analytics, scheduling capabilities, and sentiment analysis.',
    technologies: ['Vue.js', 'Express', 'Chart.js'],
    category: 'web',
  },
];

const filterButtons = ['All', 'React', 'Node.js', 'Web Apps'];

export default function ProjectsGrid() {
  return (
    <section
      id="projects"
      className="min-h-screen py-24 pt-32 bg-[var(--color-background-alt)] relative"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,var(--color-accent-muted),transparent)] opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="section-heading">Recent Projects</h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filterButtons.map((filter, index) => (
            <button
              key={filter}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                index === 0
                  ? 'gradient-bg text-white shadow-lg shadow-[var(--color-shadow-accent)]'
                  : 'bg-[var(--color-accent-muted)] text-[var(--color-foreground)] border border-[var(--color-border)] hover:bg-[var(--color-accent)]/40'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {placeholderProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[var(--color-background)]/80 rounded-xl overflow-hidden border border-[var(--color-border-muted)] hover:border-[var(--color-border-accent)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--color-shadow-accent)] group"
            >
              {/* Project Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-[var(--color-accent)]/30 to-[var(--color-accent-secondary)]/30 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-[var(--color-foreground-muted)]">
                  <svg
                    className="w-16 h-16 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/80 to-transparent" />
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[var(--color-foreground-muted)] text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-[var(--color-accent-muted)] text-[var(--color-foreground)] text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="flex-1 py-2 text-center border-2 border-[var(--color-accent)] text-[var(--color-accent)] rounded-full text-sm font-medium hover:bg-[var(--color-accent-muted)] transition-all duration-300"
                  >
                    Live Demo
                  </a>
                  <a
                    href="#"
                    className="flex-1 py-2 text-center border-2 border-[var(--color-accent)] text-[var(--color-accent)] rounded-full text-sm font-medium hover:bg-[var(--color-accent-muted)] transition-all duration-300"
                  >
                    View Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="btn-primary px-8 py-3">View All Projects</button>
        </div>
      </div>
    </section>
  );
}
