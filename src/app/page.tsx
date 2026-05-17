import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';

/**
 * Below-fold sections use `next/dynamic` with `ssr: false` so GSAP-heavy client
 * bundles stay off the server render path. Only Hero is static for LCP.
 * Loading fallbacks reserve min-height to prevent CLS.
 */
function deferBelowFold<P = Record<string, never>>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  placeholderClassName: string
) {
  return dynamic(loader, {
    ssr: false,
    loading: () => <div className={placeholderClassName} aria-hidden="true" />,
  });
}

const Projects = deferBelowFold(
  () => import('@/components/Projects'),
  'min-h-screen bg-[var(--color-background-alt)]'
);

const About = deferBelowFold(
  () => import('@/components/About'),
  'min-h-screen bg-[var(--color-background)]'
);

const Skills = deferBelowFold(
  () => import('@/components/Skills'),
  'min-h-screen bg-[var(--color-background-alt)]'
);

const Experience = deferBelowFold(
  () => import('@/components/Experience'),
  'min-h-screen bg-[var(--color-background)]'
);

const Contact = deferBelowFold(
  () => import('@/components/Contact'),
  'min-h-screen bg-[var(--color-background-alt)]'
);

const Socials = deferBelowFold(
  () => import('@/components/Socials'),
  'min-h-[600px] bg-[var(--color-background)]'
);

/** Animated SVG section dividers — decorative, zero-impact when offscreen */
const SvgDivider = dynamic(() => import('@/components/UI/SvgDivider'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <SvgDivider variant="circuit" />
      <About />
      <SvgDivider variant="pulse" />
      <Projects />
      <Skills />
      <SvgDivider variant="wave" />
      <Experience />
      <Socials />
      <SvgDivider variant="circuit" />
      <Contact />
    </>
  );
}
