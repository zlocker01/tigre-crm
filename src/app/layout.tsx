import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Cinzel, Poppins } from 'next/font/google';
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

const siteUrl = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) {
    return fromEnv;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return 'https://jsbjjmx-crm-zlocker01s-projects.vercel.app';
})();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'JSBJJ MX | Academia de Brazilian Jiu-Jitsu en Apizaco, Tlaxcala',
    template: '%s | JSBJJ MX',
  },
  description:
    'Academia profesional de Brazilian Jiu-Jitsu (BJJ) y MMA en Apizaco, Tlaxcala. Clases para todos los niveles, ambiente seguro y coaches certificados.',
  applicationName: 'JSBJJ MX',
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
  authors: [{ name: 'JSBJJ MX' }],
  creator: 'JSBJJ MX',
  publisher: 'JSBJJ MX',
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
    siteName: 'JSBJJ MX',
    title: 'JSBJJ MX | Academia de Brazilian Jiu-Jitsu',
    description:
      'Academia profesional de Brazilian Jiu-Jitsu (BJJ) y MMA en Apizaco, Tlaxcala.',
    images: [
      {
        url: '/landing-page/recepcion.jpg',
        width: 1200,
        height: 630,
        alt: 'JSBJJ MX | Academia de Brazilian Jiu-Jitsu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSBJJ MX | Academia de Brazilian Jiu-Jitsu',
    description:
      'Clases de Brazilian Jiu-Jitsu (BJJ) y MMA en Apizaco, Tlaxcala.',
    images: ['/landing-page/recepcion.jpg'],
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
