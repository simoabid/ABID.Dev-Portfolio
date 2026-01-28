import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/context/ThemeProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
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
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1a1a2e" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider defaultTheme="dark">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
