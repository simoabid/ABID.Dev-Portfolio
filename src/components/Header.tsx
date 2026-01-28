'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/skills', label: 'Skills' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-normal ${
        isScrolled
          ? 'bg-[var(--color-background-alt)]/95 backdrop-blur-sm shadow-lg shadow-[var(--color-shadow-accent)]'
          : 'bg-[var(--color-background)]/95'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex items-center text-xl md:text-2xl font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-secondary)] transition-colors duration-normal"
          >
            <span className="absolute -left-3 w-1 h-6 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-secondary)] rounded-full" />
            &lt; ABID.Dev/&gt;
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative py-2 transition-colors duration-normal group ${
                    isActiveLink(link.href)
                      ? 'text-[var(--color-accent)] font-medium'
                      : 'text-[var(--color-foreground)] hover:text-[var(--color-accent)]'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)] transition-all duration-normal ${
                      isActiveLink(link.href)
                        ? 'w-full'
                        : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex flex-col gap-1.5 p-2 hover:scale-110 transition-transform"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span
                className={`w-6 h-0.5 bg-[var(--color-foreground)] transition-all duration-normal ${
                  isMobileMenuOpen
                    ? 'rotate-45 translate-y-2 bg-[var(--color-accent)]'
                    : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-[var(--color-foreground)] transition-all duration-normal ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-[var(--color-foreground)] transition-all duration-normal ${
                  isMobileMenuOpen
                    ? '-rotate-45 -translate-y-2 bg-[var(--color-accent)]'
                    : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-normal ${
            isMobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
        >
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`block py-3 px-4 rounded-lg transition-all duration-normal ${
                    isActiveLink(link.href)
                      ? 'text-[var(--color-accent)] bg-[var(--color-accent-muted)] font-medium'
                      : 'text-[var(--color-foreground)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-muted)]'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
