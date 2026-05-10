import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';

/**
 * Below-fold sections are dynamically imported to reduce the initial JS bundle.
 * Only the Hero (LCP element) is statically imported for fastest paint.
 *
 * Loading fallbacks use empty divs with min-height to prevent CLS.
 */
const Projects = dynamic(() => import('@/components/Projects'), {
  loading: () => (
    <div
      className="min-h-screen bg-[var(--color-background-alt)]"
      aria-hidden="true"
    />
  ),
});

const About = dynamic(() => import('@/components/About'), {
  loading: () => (
    <div
      className="min-h-screen bg-[var(--color-background)]"
      aria-hidden="true"
    />
  ),
});

const Skills = dynamic(() => import('@/components/Skills'), {
  loading: () => (
    <div
      className="min-h-screen bg-[var(--color-background)]"
      aria-hidden="true"
    />
  ),
});

const Experience = dynamic(() => import('@/components/Experience'), {
  loading: () => (
    <div
      className="min-h-screen bg-[var(--color-background-alt)]"
      aria-hidden="true"
    />
  ),
});

const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => (
    <div
      className="min-h-screen bg-[var(--color-background)]"
      aria-hidden="true"
    />
  ),
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <About />
      <Skills />
      <Experience />
      <Contact />
    </>
  );
}
