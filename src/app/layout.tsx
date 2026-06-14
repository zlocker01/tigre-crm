import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Cinzel, Poppins } from 'next/font/google';
import { branding } from '@/config/branding';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const cinzel = Cinzel({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(branding.siteUrl),
  title: {
    default: branding.ogTitle,
    template: `%s | ${branding.shortName}`,
  },
  description: branding.siteDescription,
  applicationName: branding.appName,
  keywords: [
    'BJJ',
    'Brazilian Jiu-Jitsu',
    'Jiu Jitsu',
    'MMA',
    'Artes marciales',
    'Academia de jiu jitsu',
    'Apizaco',
    'Tlaxcala',
    'México',
    'Clases de jiu jitsu',
  ],
  authors: [{ name: branding.legalName }],
  creator: branding.legalName,
  publisher: branding.legalName,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: '/',
    siteName: branding.appName,
    title: branding.ogTitle,
    description: branding.ogDescription,
    images: [
      {
        url: branding.ogImagePath,
        width: 1200,
        height: 630,
        alt: branding.ogTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: branding.ogTitle,
    description: branding.ogDescription,
    images: [branding.ogImagePath],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon512_rounded.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body
        suppressHydrationWarning
        className={cn(
          poppins.variable,
          cinzel.variable,
          'min-h-screen bg-background antialiased font-sans',
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
