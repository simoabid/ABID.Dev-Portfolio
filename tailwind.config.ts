import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  // Safelist dynamic grid classes used by Grid component
  safelist: [
    // Grid columns (responsive classes are automatically generated when base classes are used)
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    'grid-cols-7',
    'grid-cols-8',
    'grid-cols-9',
    'grid-cols-10',
    'grid-cols-11',
    'grid-cols-12',
    'md:grid-cols-1',
    'md:grid-cols-2',
    'md:grid-cols-3',
    'md:grid-cols-4',
    'md:grid-cols-5',
    'md:grid-cols-6',
    'lg:grid-cols-1',
    'lg:grid-cols-2',
    'lg:grid-cols-3',
    'lg:grid-cols-4',
    'lg:grid-cols-5',
    'lg:grid-cols-6',
    // Column spans
    'col-span-1',
    'col-span-2',
    'col-span-3',
    'col-span-4',
    'col-span-5',
    'col-span-6',
    'col-span-full',
    'md:col-span-2',
    'md:col-span-3',
    'lg:col-span-2',
    'lg:col-span-3',
    'lg:col-span-full',
    // Gap utilities
    'gap-0',
    'gap-1',
    'gap-2',
    'gap-3',
    'gap-4',
    'gap-5',
    'gap-6',
    'gap-8',
    'gap-10',
    'gap-12',
    'gap-16',
  ],
  theme: {
    extend: {
      colors: {
        // Token-based colors using CSS variables
        background: 'var(--color-background)',
        'background-alt': 'var(--color-background-alt)',
        'background-elevated': 'var(--color-background-elevated)',
        foreground: 'var(--color-foreground)',
        'foreground-muted': 'var(--color-foreground-muted)',
        'foreground-subtle': 'var(--color-foreground-subtle)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          secondary: 'var(--color-accent-secondary)',
          hover: 'var(--color-accent-hover)',
          muted: 'var(--color-accent-muted)',
        },
        border: 'var(--color-border)',
        'border-muted': 'var(--color-border-muted)',
        'border-accent': 'var(--color-border-accent)',

        // Legacy support - keep existing color definitions
        dark: {
          primary: '#1a1a2e',
          secondary: '#24243e',
        },
        light: {
          primary: '#f5f5f5',
          secondary: '#ffffff',
        },
        text: {
          primary: '#e0e0e0',
          secondary: '#c0c0ff',
          dark: '#333333',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
        '5xl': 'var(--font-size-5xl)',
        '6xl': 'var(--font-size-6xl)',
        '7xl': 'var(--font-size-7xl)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        accent: 'var(--shadow-accent)',
        glow: 'var(--shadow-glow)',
      },
      transitionDuration: {
        fast: 'var(--transition-duration-fast)',
        normal: 'var(--transition-duration-normal)',
        slow: 'var(--transition-duration-slow)',
      },
      transitionTimingFunction: {
        bounce: 'var(--transition-timing-bounce)',
        smooth: 'var(--transition-timing-smooth)',
      },
      backgroundImage: {
        'gradient-primary':
          'linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
