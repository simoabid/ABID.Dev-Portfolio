'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-secondary/95 backdrop-blur-sm shadow-lg shadow-accent-primary/20'
          : 'bg-dark-primary/95'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex items-center text-xl md:text-2xl font-bold text-accent-primary hover:text-accent-secondary transition-colors duration-300"
          >
            <span className="absolute -left-3 w-1 h-6 bg-gradient-to-b from-accent-primary to-accent-secondary rounded-full" />
            &lt; ABID.Dev/&gt;
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative text-text-primary hover:text-accent-primary transition-colors duration-300 py-2 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button (placeholder) */}
            <button
              className="w-10 h-10 rounded-full bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center text-text-primary hover:bg-gradient-to-r hover:from-accent-primary hover:to-accent-secondary hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent-primary/30"
              aria-label="Toggle theme"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex flex-col gap-1.5 p-2 hover:scale-110 transition-transform"
              aria-label="Toggle mobile menu"
            >
              <span
                className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${
                  isMobileMenuOpen
                    ? 'rotate-45 translate-y-2 bg-accent-primary'
                    : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${
                  isMobileMenuOpen
                    ? '-rotate-45 -translate-y-2 bg-accent-primary'
                    : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
        >
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 text-text-primary hover:text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-all duration-300"
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
