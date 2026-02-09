/**
 * Project data and types for the Projects section.
 *
 * Each project follows a narrative structure:
 * tagline (hook) → challenge (problem) → outcome (result with metrics)
 *
 * Update this file with real project content.
 */

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  challenge: string;
  outcome: string;
  role: string;
  technologies: string[];
  category: 'full-stack' | 'frontend' | 'backend' | 'mobile';
  image: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform Redesign',
    slug: 'ecommerce-platform',
    tagline: 'Transforming checkout abandonment into seamless conversions',
    description:
      'A complete overhaul of a legacy e-commerce storefront — from product discovery to payment confirmation. Built with Next.js, server-side rendering for SEO, and Stripe integration for secure payments.',
    challenge:
      'The existing platform suffered from a 68% cart abandonment rate. Slow page loads, confusing navigation, and a multi-step checkout were driving users away before completing purchases.',
    outcome: '42% increase in completed transactions',
    role: 'Lead Full-Stack Developer',
    technologies: [
      'Next.js',
      'TypeScript',
      'Stripe',
      'PostgreSQL',
      'Tailwind CSS',
      'Redis',
    ],
    category: 'full-stack',
    image: '/images/projects/ecommerce.png',
    liveUrl: '#',
    repoUrl: '#',
    featured: true,
  },
  {
    id: 'ai-dashboard',
    title: 'AI Analytics Dashboard',
    slug: 'ai-dashboard',
    tagline:
      'Making machine learning metrics accessible to non-technical teams',
    description:
      'Real-time dashboard for monitoring ML model performance, data drift, and prediction accuracy. Features interactive charts, anomaly alerts, and automated reporting.',
    challenge:
      'Data scientists needed a way to communicate model health to stakeholders without writing custom reports every week.',
    outcome: '3x faster model issue detection',
    role: 'Frontend Engineer',
    technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'WebSocket'],
    category: 'frontend',
    image: '/images/projects/ai-dashboard.png',
    liveUrl: '#',
    repoUrl: '#',
    featured: false,
  },
  {
    id: 'realtime-chat',
    title: 'Real-Time Collaboration Hub',
    slug: 'realtime-chat',
    tagline: 'Slack-inspired workspace for distributed development teams',
    description:
      'A real-time messaging platform with channels, threads, file sharing, and presence indicators. Built for teams that need instant, organized communication.',
    challenge:
      'Remote teams were losing context switching between email, chat, and project tools. Needed a unified communication layer with search.',
    outcome: '85% daily active user retention',
    role: 'Full-Stack Developer',
    technologies: ['Node.js', 'Socket.io', 'React', 'MongoDB', 'Docker'],
    category: 'full-stack',
    image: '/images/projects/chat-app.png',
    liveUrl: '#',
    repoUrl: '#',
    featured: false,
  },
  {
    id: 'design-system',
    title: 'Component Design System',
    slug: 'design-system',
    tagline:
      'One source of truth for consistent, accessible UI across 12 products',
    description:
      'A comprehensive design system with 40+ React components, Storybook documentation, automated accessibility testing, and theme customization.',
    challenge:
      'Twelve product teams were building identical components independently, leading to visual inconsistency and duplicated effort across the organization.',
    outcome: '60% reduction in UI development time',
    role: 'Design Systems Engineer',
    technologies: [
      'React',
      'TypeScript',
      'Storybook',
      'Testing Library',
      'CSS Modules',
    ],
    category: 'frontend',
    image: '/images/projects/design-system.png',
    liveUrl: '#',
    repoUrl: '#',
    featured: false,
  },
];

/** Get the single featured project */
export function getFeaturedProject(): Project {
  return projects.find((p) => p.featured) ?? projects[0];
}

/** Get non-featured projects */
export function getSecondaryProjects(): Project[] {
  return projects.filter((p) => !p.featured);
}

/** Get all unique categories */
export function getCategories(): string[] {
  const cats = new Set(projects.map((p) => p.category));
  return ['all', ...Array.from(cats)];
}

/** Filter projects by category */
export function filterProjects(category: string): Project[] {
  if (category === 'all') return projects;
  return projects.filter((p) => p.category === category);
}
