import Hero from '@/components/Hero';
import ProjectsGrid from '@/components/ProjectsGrid';

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* About Section Placeholder */}
      <section id="about" className="py-24 bg-dark-secondary">
        <div className="container mx-auto px-4">
          <h2 className="section-heading">About Me</h2>
          <div className="max-w-3xl mx-auto text-center text-text-secondary">
            <p className="text-lg mb-6">
              I&apos;m a passionate Full-Stack Developer with a knack for
              creating robust, scalable web applications. My expertise spans
              both front-end and back-end technologies, ensuring seamless user
              experiences from concept to deployment.
            </p>
            <p className="text-lg">
              Beyond coding, I&apos;m a tech enthusiast who thrives on learning
              cutting-edge tools and frameworks. My goal is to build solutions
              that not only solve problems but also inspire and delight users.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section Placeholder */}
      <section id="skills" className="py-24 bg-dark-primary">
        <div className="container mx-auto px-4">
          <h2 className="section-heading">My Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              'HTML5',
              'CSS3',
              'JavaScript',
              'React',
              'Node.js',
              'MongoDB',
              'TypeScript',
              'Python',
              'Git',
              'PHP',
              'Laravel',
              'Linux',
            ].map((skill) => (
              <div
                key={skill}
                className="p-4 bg-dark-secondary rounded-xl border border-accent-primary/20 text-center hover:border-accent-primary/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent-primary/20 flex items-center justify-center">
                  <span className="gradient-text text-2xl font-bold">
                    {skill[0]}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-text-primary">
                  {skill}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section Placeholder */}
      <section id="experience" className="py-24 bg-dark-secondary">
        <div className="container mx-auto px-4">
          <h2 className="section-heading">Experience</h2>
          <div className="max-w-3xl mx-auto">
            {[
              {
                title: 'Junior Full-Stack Developer',
                company: 'Self-Employed',
                date: 'Jan 2024 - Present',
                description:
                  'Creating scalable web applications, focusing on microservices architecture and cloud integration.',
              },
              {
                title: 'Front-End Developer',
                company: 'Self-Employed',
                date: 'Jun 2023 - Present',
                description:
                  'Specialized in creating responsive, user-friendly interfaces with React and Redux.',
              },
            ].map((exp, index) => (
              <div
                key={index}
                className="relative pl-8 pb-8 border-l-2 border-accent-primary/30 last:pb-0"
              >
                <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-dark-secondary border-4 border-accent-primary" />
                <div className="bg-dark-primary/60 p-6 rounded-xl border border-accent-primary/20">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {exp.title}
                  </h3>
                  <p className="text-accent-primary text-sm mb-2">
                    {exp.company}
                  </p>
                  <span className="inline-block px-3 py-1 gradient-bg text-white text-xs rounded-full mb-3">
                    {exp.date}
                  </span>
                  <p className="text-text-secondary text-sm">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectsGrid />

      {/* Contact Section Placeholder */}
      <section id="contact" className="py-24 bg-dark-primary">
        <div className="container mx-auto px-4">
          <h2 className="section-heading">Get in Touch</h2>
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: '✉️', title: 'Email', value: 'seemooabid@gmail.com' },
                { icon: '📞', title: 'Phone', value: '+212 6 76 22 61 20' },
                { icon: '📍', title: 'Location', value: 'Khenifra, Morocco' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 bg-dark-secondary rounded-xl border border-accent-primary/20 text-center hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Contact Form Placeholder */}
            <form className="bg-dark-secondary p-8 rounded-xl border border-accent-primary/20">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-dark-primary border border-accent-primary/30 rounded-lg text-text-primary focus:border-accent-primary focus:outline-none transition-colors"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-dark-primary border border-accent-primary/30 rounded-lg text-text-primary focus:border-accent-primary focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 bg-dark-primary border border-accent-primary/30 rounded-lg text-text-primary focus:border-accent-primary focus:outline-none transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 gradient-bg text-white font-semibold rounded-full shadow-lg shadow-accent-primary/30 hover:shadow-xl hover:shadow-accent-primary/50 hover:scale-[1.02] transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
