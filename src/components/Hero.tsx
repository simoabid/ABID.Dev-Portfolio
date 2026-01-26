export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-dark-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(108,99,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(0,212,255,0.1),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-4 animate-fade-in">
          Hi, I&apos;m <span className="gradient-text">Mohamed Amine Abid</span>
        </h1>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-6 animate-slide-up">
          <span className="gradient-text">Full-Stack Developer</span>
          <span className="ml-1 animate-pulse">|</span>
        </h2>

        <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto animate-slide-up">
          Turning complex problems into elegant solutions with cutting-edge
          technology.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-10 animate-slide-up">
          <a
            href="#contact"
            className="px-8 py-4 gradient-bg text-white font-semibold rounded-full shadow-lg shadow-accent-primary/30 hover:shadow-xl hover:shadow-accent-primary/50 hover:scale-105 transition-all duration-300"
          >
            Hire Me
          </a>
          <a
            href="#projects"
            className="px-8 py-4 bg-transparent border-2 border-accent-primary text-white font-semibold rounded-full hover:bg-accent-primary/20 hover:scale-105 transition-all duration-300"
          >
            View Projects
          </a>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 justify-center animate-slide-up">
          {[
            { href: 'https://github.com/simoabid', label: 'GitHub' },
            {
              href: 'https://www.linkedin.com/in/mohamed-amine-abidd',
              label: 'LinkedIn',
            },
            { href: 'https://www.x.com/SeeMooAbid', label: 'Twitter' },
            { href: 'https://www.instagram.com/simoabiid', label: 'Instagram' },
          ].map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="w-10 h-10 rounded-full bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center text-text-primary hover:bg-gradient-to-r hover:from-accent-primary hover:to-accent-secondary hover:text-white transition-all duration-300 hover:-translate-y-1 hover:rotate-[360deg]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.1,118.92,150.17,94.45,321.39,56.44Z"
            className="fill-dark-secondary opacity-30"
          />
        </svg>
      </div>
    </section>
  );
}
