import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
