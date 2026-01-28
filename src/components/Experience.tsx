const experiences = [
  {
    title: 'Junior Full-Stack Developer',
    company: 'Self-Employed',
    date: 'Jan 2024 - Present',
    description:
      'Creating scalable web applications, focusing on microservices architecture and cloud integration. Developing full-stack solutions using React, Node.js, and MongoDB.',
    highlights: [
      'Built 5+ production-ready web applications',
      'Implemented RESTful APIs and microservices',
      'Optimized database performance by 40%',
    ],
  },
  {
    title: 'Front-End Developer',
    company: 'Self-Employed',
    date: 'Jun 2023 - Present',
    description:
      'Specialized in creating responsive, user-friendly interfaces with React and modern CSS. Focus on accessibility and performance optimization.',
    highlights: [
      'Developed pixel-perfect responsive designs',
      'Improved Core Web Vitals scores by 60%',
      'Created reusable component libraries',
    ],
  },
  {
    title: 'Web Development Student',
    company: 'Self-Learning',
    date: 'Jan 2023 - Jun 2023',
    description:
      'Intensive self-study period focused on mastering web development fundamentals and modern frameworks.',
    highlights: [
      'Completed 10+ online courses',
      'Built personal portfolio projects',
      'Contributed to open-source projects',
    ],
  },
];

export default function Experience() {
  return (
    <section className="min-h-screen py-24 pt-32 bg-[var(--color-background-alt)]">
      <div className="container mx-auto px-4">
        <h2 className="section-heading">Experience</h2>
        <div className="max-w-3xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-secondary)] transform md:-translate-x-1/2" />

          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`relative mb-12 last:mb-0 ${
                index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto'
              } md:w-1/2`}
            >
              {/* Timeline dot */}
              <div
                className={`absolute top-0 w-4 h-4 rounded-full bg-[var(--color-background-alt)] border-4 border-[var(--color-accent)] shadow-lg shadow-[var(--color-shadow-accent)] ${
                  index % 2 === 0
                    ? 'left-0 md:left-auto md:-right-2 md:translate-x-1/2'
                    : 'left-0 md:-left-2 md:-translate-x-1/2'
                }`}
              />

              {/* Content card */}
              <div className="ml-8 md:ml-0 bg-[var(--color-background)]/80 p-6 rounded-xl border border-[var(--color-border-muted)] hover:border-[var(--color-border-accent)] hover:shadow-lg hover:shadow-[var(--color-shadow-accent)] transition-all duration-300">
                <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-1">
                  {exp.title}
                </h3>
                <p className="text-[var(--color-accent)] font-medium mb-2">
                  {exp.company}
                </p>
                <span className="inline-block px-3 py-1 gradient-bg text-white text-xs rounded-full mb-4">
                  {exp.date}
                </span>
                <p className="text-[var(--color-foreground-muted)] text-sm mb-4 md:text-left">
                  {exp.description}
                </p>
                <ul className="space-y-1 md:text-left">
                  {exp.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="text-sm text-[var(--color-foreground-muted)] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-secondary)] flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
