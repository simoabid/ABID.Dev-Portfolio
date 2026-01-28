'use client';

import { useTheme } from '@/context/ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Accessible theme toggle button with animated sun/moon icons.
 * Supports keyboard navigation (Enter/Space to toggle).
 */
export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className={`
        relative w-10 h-10 rounded-full
        bg-[var(--color-accent-muted)]
        border border-[var(--color-border)]
        flex items-center justify-center
        text-[var(--color-foreground)]
        hover:bg-gradient-to-r hover:from-[var(--color-accent)] hover:to-[var(--color-accent-secondary)]
        hover:text-[var(--color-foreground-inverted)]
        focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-[var(--shadow-accent)]
        active:scale-95
        ${className}
      `}
    >
      {/* Sun Icon */}
      <svg
        className={`
          absolute w-5 h-5
          transition-all duration-500 ease-out
          ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-0'
          }
        `}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon Icon */}
      <svg
        className={`
          absolute w-5 h-5
          transition-all duration-500 ease-out
          ${
            isDark
              ? 'opacity-0 -rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100'
          }
        `}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
