import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageEntryLoader from '@/components/PageEntryLoader';

/** Non-critical: deferred until after hydration */
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), {
  ssr: false,
});

/** Client-only: defers gsap + lenis from the SSR critical path */
const SmoothScrollProvider = dynamic(
  () => import('@/components/SmoothScrollProvider'),
  { ssr: false }
);

/** Defers heavy global interactive effects until the browser is idle */
const GlobalEffects = dynamic(() => import('@/components/GlobalEffects'), {
  ssr: false,
});

const ScrollProgress = dynamic(() => import('@/components/UI/ScrollProgress'), {
  ssr: false,
});

const BackToTop = dynamic(() => import('@/components/UI/BackToTop'), {
  ssr: false,
});

/**
 * Persistent WebGL backdrop. Client-only so the three.js bundle never enters
 * the SSR critical path, and mounted once here so scrolling between sections
 * never tears down the GL context.
 */
const SceneCanvas = dynamic(() => import('@/components/Three/SceneCanvas'), {
  ssr: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Mohamed Amine Abid | Full-Stack Developer',
  description:
    'Full-Stack Developer specializing in React, Node.js, and modern web technologies. View my portfolio of projects and get in touch.',
  keywords: [
    'Full-Stack Developer',
    'Web Developer',
    'React',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'Portfolio',
    'Morocco',
  ],
  authors: [{ name: 'Mohamed Amine Abid' }],
  creator: 'Mohamed Amine Abid',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://abid.dev',
    title: 'Mohamed Amine Abid | Full-Stack Developer',
    description:
      'Full-Stack Developer specializing in React, Node.js, and modern web technologies.',
    siteName: 'ABID.Dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohamed Amine Abid | Full-Stack Developer',
    description:
      'Full-Stack Developer specializing in React, Node.js, and modern web technologies.',
    creator: '@SeeMooAbid',
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    title: 'ABID.Dev',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        <meta name="theme-color" content="#0f0f1a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SceneCanvas />
        <PageEntryLoader>
          <SmoothScrollProvider>
            <ScrollProgress />
            <Header />
            <main id="main-content" className="flex-grow" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <BackToTop />
          </SmoothScrollProvider>
        </PageEntryLoader>
        <CookieBanner />
        <GlobalEffects />
      </body>
    </html>
  );
}
