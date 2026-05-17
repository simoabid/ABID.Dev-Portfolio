import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/context/ThemeProvider';
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

// Inline script to prevent flash of incorrect theme (FOIT)
// This runs before React hydrates, ensuring the correct theme is applied immediately
const themeInitScript = `
  (function() {
    try {
      var theme = localStorage.getItem('portfolio-theme');
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      document.documentElement.classList.add(theme);
      document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1a1a2e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider defaultTheme="dark">
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
        </ThemeProvider>
      </body>
    </html>
  );
}
