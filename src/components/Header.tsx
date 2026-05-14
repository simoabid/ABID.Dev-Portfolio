'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AnimatedThemeToggle from './UI/AnimatedThemeToggle';
import Image from 'next/image';
import HoverRollText from './UI/HoverRollText';
import StarBorder from './UI/StarBorder';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#projects', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Detect active section based on scroll position
      const sections = ['home', 'projects', 'about', 'skills', 'contact'];
      const scrollPosition = window.scrollY + 100; // Offset for header

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, closeMobileMenu]);

  const isActiveLink = (href: string) => {
    return activeSection === href;
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      setActiveSection(href);
      closeMobileMenu();
    }
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 flex justify-center ${
          isScrolled ? 'top-4' : 'top-6'
        }`}
      >
        <nav
          aria-label="Main navigation"
          className={`
            relative flex items-center justify-between 
            w-[92%] max-w-6xl 
            rounded-full 
            border border-[var(--color-border-muted)] 
            bg-[var(--color-background-overlay)] 
            backdrop-blur-lg 
            shadow-lg shadow-[var(--color-shadow)] 
            transition-all duration-300
            ${isScrolled ? 'py-2.5 px-6' : 'py-3.5 px-8'}
          `}
        >
          {/* Logo */}
          <Link
            href="/"
            className="cursor-target flex items-center gap-2 text-xl font-bold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--color-border-muted)]">
              <Image
                src="/images/logo.png"
                alt="ABID.Dev Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="tracking-tight">
              ABID<span className="text-[var(--color-accent)]">.Dev</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    aria-current={active ? 'page' : undefined}
                    className={`
                      cursor-target group relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                      focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] focus:outline-none
                      ${
                        active
                          ? 'text-[var(--color-foreground-inverted)] bg-[var(--color-accent)] shadow-md shadow-[var(--color-shadow-accent)]'
                          : 'text-[var(--color-foreground)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-muted)]'
                      }
                    `}
                  >
                    <HoverRollText text={link.label} />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <AnimatedThemeToggle />

            <StarBorder
              as={Link}
              href="#contact"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                handleNavClick(e, '#contact')
              }
              className="cursor-target group hidden md:inline-flex rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
              innerClassName="px-5 py-2 text-sm font-semibold text-[var(--color-foreground)] bg-[var(--color-background)] border border-[var(--color-border)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] transition-all duration-300"
              color="var(--color-accent)"
              speed="5s"
              thickness={1.5}
            >
              <HoverRollText text="Let's Talk" />
            </StarBorder>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="cursor-target md:hidden p-2 rounded-full hover:bg-[var(--color-accent-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              aria-label={
                isMobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
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
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[var(--color-background-overlay)] backdrop-blur-xl md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        >
          <nav
            id="mobile-nav-menu"
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal="true"
            className="absolute top-24 left-4 right-4 bg-[var(--color-background-alt)] rounded-2xl border border-[var(--color-border-muted)] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col gap-2" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    aria-current={isActiveLink(link.href) ? 'page' : undefined}
                    className={`
                      group block px-4 py-3 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]
                      ${
                        isActiveLink(link.href)
                          ? 'bg-[var(--color-accent)] text-[var(--color-foreground-inverted)] shadow-lg shadow-[var(--color-shadow-accent)]'
                          : 'hover:bg-[var(--color-accent-muted)] text-[var(--color-foreground)]'
                      }
                    `}
                  >
                    <HoverRollText
                      text={link.label}
                      className="w-full justify-start"
                    />
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-[var(--color-border-muted)] mt-2">
                <StarBorder
                  as={Link}
                  href="#contact"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    handleNavClick(e, '#contact')
                  }
                  className="group block w-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  innerClassName="px-4 py-3 text-center font-bold bg-[var(--color-foreground)] text-[var(--color-background)] transition-all"
                  color="var(--color-accent)"
                  speed="5s"
                  thickness={1.5}
                >
                  <HoverRollText text="Let's Talk" />
                </StarBorder>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
