'use client';

import Link from 'next/link';

const socialLinks = [
  {
    href: 'https://github.com/simoabid',
    label: 'GitHub',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/in/mohamed-amine-abidd',
    label: 'LinkedIn',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: 'https://www.x.com/SeeMooAbid',
    label: 'Twitter',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/simoabiid',
    label: 'Instagram',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

const navigationLinks = [
  {
    title: 'System',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Projects',
    links: [
      { label: 'All Projects', href: '/projects' },
      { label: 'Open Source', href: 'https://github.com/simoabid' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
];

const codeSnippet = `const deploy = async () => { 
  await docker.push(image);
  return "Future Built";
};`;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 pb-8 px-4 sm:px-8 overflow-hidden font-sans">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--color-accent)]/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Glass Container */}
      <div className="relative max-w-7xl mx-auto bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 rounded-[3rem] p-6 md:p-10 overflow-hidden shadow-2xl shadow-black/5">
        {/* Decorative Grid Background (Subtle) */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
          {/* Left Column: Brand, Desc, Code, Socials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <h2 className="text-3xl font-bold tracking-tighter">
                  ABID<span className="text-[var(--color-accent)]">.Dev</span>
                </h2>
              </Link>
              <p className="text-[var(--color-foreground-muted)] max-w-sm leading-relaxed text-sm">
                Architecting robust end-to-end solutions where aesthetic form
                meets functional performance.
              </p>
            </div>

            {/* Code Snippet Card */}
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-xs text-blue-300 overflow-x-auto shadow-inner transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex gap-1.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <pre>
                <code>{codeSnippet}</code>
              </pre>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-foreground)] hover:bg-[var(--color-accent)] hover:text-white hover:border-transparent hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Headline, Links, Terminal */}
          <div className="lg:col-span-7 flex flex-col gap-8 md:gap-2">
            {/* Top: Navigation Links */}
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {navigationLinks.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-foreground-muted)]">
                    {section.title}
                  </h3>
                  <ul className="space-y-2 md:space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-2 text-sm text-[var(--color-foreground)]/80 hover:text-[var(--color-accent)] transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom: Headline & Terminal */}
            {/* Bottom: Terminal & Headline */}
            <div className="flex flex-col gap-6">
              {/* Terminal Box - Right Aligned */}
              <div className="w-full md:w-[55%] ml-auto font-mono text-xs space-y-3 p-4 rounded-xl bg-black/40 border border-white/5 text-[var(--color-foreground-muted)] shadow-inner transform hover:scale-[1.01] transition-transform duration-300">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <span className="text-green-500">root@developer:~#</span>
                    <span className="text-white">contact</span>
                  </div>
                  <div className="pl-4 text-[var(--color-accent-secondary)]">
                    <a
                      href="mailto:contact@abid.dev"
                      className="hover:underline hover:text-[var(--color-accent)] transition-colors"
                    >
                      dev@stack.engineer
                    </a>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <span className="text-green-500">root@developer:~#</span>
                    <span className="text-white">location</span>
                  </div>
                  <div className="pl-4 text-[var(--color-accent-secondary)]">
                    <span>Distributed / Global</span>
                  </div>
                </div>
              </div>

              {/* Headline */}
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                Building the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)]">
                  Full Stack future.
                </span>
              </h2>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="col-span-1 lg:col-span-12 mt-4 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--color-foreground-muted)]">
            <p>© {currentYear} ABID.Dev. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
