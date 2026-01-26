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
    <section id="projects" className="py-24 bg-dark-secondary relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(108,99,255,0.05),rgba(0,212,255,0.05))] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="section-heading">Recent Projects</h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filterButtons.map((filter, index) => (
            <button
              key={filter}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                index === 0
                  ? 'gradient-bg text-white shadow-lg shadow-accent-primary/30'
                  : 'bg-accent-primary/20 text-text-primary border border-accent-primary/30 hover:bg-accent-primary/40'
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
              className="bg-dark-primary/80 rounded-xl overflow-hidden border border-accent-primary/20 hover:border-accent-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent-primary/20 group"
            >
              {/* Project Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
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
                <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/80 to-transparent" />
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-accent-primary/20 text-text-primary text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="flex-1 py-2 text-center border-2 border-accent-primary text-accent-primary rounded-full text-sm font-medium hover:bg-accent-primary/20 transition-all duration-300"
                  >
                    Live Demo
                  </a>
                  <a
                    href="#"
                    className="flex-1 py-2 text-center border-2 border-accent-primary text-accent-primary rounded-full text-sm font-medium hover:bg-accent-primary/20 transition-all duration-300"
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
          <button className="px-8 py-3 gradient-bg text-white font-semibold rounded-full shadow-lg shadow-accent-primary/30 hover:shadow-xl hover:shadow-accent-primary/50 hover:scale-105 transition-all duration-300">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
}
