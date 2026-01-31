'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/skills', label: 'Skills' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    <>
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 flex justify-center ${
          isScrolled ? 'top-4' : 'top-6'
        }`}
      >
        <nav
          className={`
            relative flex items-center justify-between 
            w-[92%] max-w-6xl 
            rounded-full 
            border border-white/20 dark:border-white/10 
            bg-white/10 dark:bg-black/20 
            backdrop-blur-lg 
            shadow-lg shadow-black/5 
            transition-all duration-300
            ${isScrolled ? 'py-2.5 px-6' : 'py-3.5 px-8'}
          `}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
              {/* Use a simple text fallback if image fails, or keep the Image component */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center text-white text-xs">
                AB
              </div>
            </div>
            <span className="tracking-tight">
              ABID<span className="text-[var(--color-accent)]">.Dev</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`
                      relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                      ${
                        active
                          ? 'text-white bg-[var(--color-accent)] shadow-md shadow-[var(--color-accent)]/20'
                          : 'text-[var(--color-foreground)] hover:text-[var(--color-accent)] hover:bg-white/5 dark:hover:bg-white/5'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-semibold text-[var(--color-foreground)] border border-[var(--color-border)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] transition-all duration-300"
            >
              Hire Me
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-transform duration-300 origin-left ${isMobileMenuOpen ? 'rotate-45 translate-x-1' : ''}`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-transform duration-300 origin-left ${isMobileMenuOpen ? '-rotate-45 translate-x-1' : ''}`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xl transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      >
        <div
          className={`absolute top-24 left-4 right-4 bg-[var(--color-background-alt)] rounded-2xl border border-white/10 p-4 transition-transform duration-300 ${
            isMobileMenuOpen
              ? 'translate-y-0 scale-100'
              : '-translate-y-4 scale-95'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`
                    block px-4 py-3 rounded-xl transition-all
                    ${
                      isActiveLink(link.href)
                        ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20'
                        : 'hover:bg-white/5 text-[var(--color-foreground)]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-white/10 mt-2">
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-xl text-center font-bold bg-[var(--color-foreground)] text-[var(--color-background)]"
              >
                Hire Me
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
