import type { MetadataRoute } from 'next';
import { branding } from '@/config/branding';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/session', '/api'],
      },
    ],
    sitemap: `${branding.siteUrl}/sitemap.xml`,
  };
}
