import Image from 'next/image';
import Link from 'next/link';
import CodeSnippet from './CodeSnippet';

/**
 * Hero Section Component
 *
 * Full-width layout taking advantage of edge margins:
 * - Left: Name, title, tagline, and CTAs (aligned to left edge)
 * - Center: Hero portrait image
 * - Right: Code snippet widget (aligned to right edge)
 *
 * Responsive: Stacks on mobile, side-by-side on desktop
 */
export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden"
      aria-label="Hero section - Introduction"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[var(--color-background)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_30%,rgba(108,99,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_70%,rgba(0,212,255,0.1),transparent_50%)]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(var(--color-accent) 1px, transparent 1px),
                              linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Full-width layout with edge alignment */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[calc(100vh-10rem)]">
          {/* Left Column - Info & CTAs (spans 4 columns, left-aligned) */}
          <div className="lg:col-span-4 text-center lg:text-left order-2 lg:order-1">
            {/* Greeting */}
            <p className="text-[var(--color-foreground-muted)] text-xl md:text-2xl mb-2 animate-fade-in">
              Hi, I&apos;m
            </p>
            {/* Name */}
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-4 animate-slide-up font-mono">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Mohamed Amine{' '}
              </span>
              <span className="gradient-text">Abid</span>
            </h1>

            {/* Title */}
            <h2 className="text-xl md:text-2xl xl:text-3xl font-semibold text-[var(--color-accent)] mb-6 animate-slide-up">
              Full-Stack Web Developer
            </h2>

            {/* Tagline */}
            <p className="text-[var(--color-foreground-muted)] text-base md:text-lg max-w-sm mb-8 animate-slide-up">
              Building modern web applications with clean code and elegant
              solutions.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-slide-up">
              <Link
                href="/contact"
                className="btn-primary px-8 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
                aria-label="Contact me to discuss hiring opportunities"
              >
                Contact Me
              </Link>
              <Link
                href="/projects"
                className="btn-outline px-8 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
                aria-label="View my portfolio projects"
              >
                View Projects
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start mt-8 animate-slide-up">
              {[
                {
                  href: 'https://github.com/simoabid',
                  label: 'GitHub',
                  icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
                },
                {
                  href: 'https://www.linkedin.com/in/mohamed-amine-abidd',
                  label: 'LinkedIn',
                  icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                },
                {
                  href: 'https://www.x.com/SeeMooAbid',
                  label: 'Twitter/X',
                  icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                },
                {
                  href: 'https://www.instagram.com/simoabiid',
                  label: 'Instagram',
                  icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                },
              ].map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit my ${social.label} profile`}
                  className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-muted)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Center Column - Portrait Image (spans 4 columns) */}
          <div className="lg:col-span-4 relative flex justify-center order-1 lg:order-2">
            {/* Glow effect behind image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] xl:w-[26rem] xl:h-[26rem] rounded-full bg-gradient-to-br from-[var(--color-accent)]/30 to-[var(--color-accent-secondary)]/30 blur-3xl" />
            </div>

            {/* Portrait */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] xl:w-[26rem] xl:h-[26rem] rounded-full overflow-hidden border-4 border-[var(--color-border-accent)] shadow-2xl shadow-[var(--color-shadow-accent)] animate-fade-in">
              <Image
                src="/images/hero-portrait.png"
                alt="Mohamed Amine Abid - Full-Stack Developer"
                fill
                sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, (max-width: 1280px) 352px, 416px"
                className="object-cover object-center"
                priority
              />
            </div>

            {/* Floating decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-[var(--color-accent)] animate-pulse-slow opacity-60" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-[var(--color-accent-secondary)] animate-pulse-slow opacity-60" />
          </div>

          {/* Right Column - Code Snippet (spans 4 columns, right-aligned) */}
          <div className="lg:col-span-4 hidden lg:flex justify-end order-3 animate-slide-up">
            <CodeSnippet />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <svg
            className="w-6 h-6 text-[var(--color-foreground-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
