import type { MetadataRoute } from 'next';

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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/session', '/api'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
