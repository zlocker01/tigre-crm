const fallbackSiteUrl = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) {
    return fromEnv;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return 'http://localhost:3000';
})();

export const branding = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Brotherhood 33 AV',
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || 'Brotherhood 33 AV',
  shortName: process.env.NEXT_PUBLIC_SHORT_NAME || 'Brotherhood 33 AV',
  adminDescription:
    process.env.NEXT_PUBLIC_ADMIN_DESCRIPTION ||
    'Panel de administracion interno de Brotherhood 33 AV.',
  employeeDescription:
    process.env.NEXT_PUBLIC_EMPLOYEE_DESCRIPTION ||
    'Dashboard interno para empleados de Brotherhood 33 AV.',
  siteUrl: fallbackSiteUrl,
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Academia de MMA, Boxing, BJJ y Strength & Conditioning en Ciudad de México. Entrena en un ambiente profesional y enfocado en resultados.',
  ogTitle:
    process.env.NEXT_PUBLIC_OG_TITLE ||
    'Brotherhood 33 AV | MMA, Boxing, BJJ & Training',
  ogDescription:
    process.env.NEXT_PUBLIC_OG_DESCRIPTION ||
    'Academia de MMA, Boxing, BJJ y Strength & Conditioning en Circuito Melchor Ocampo 228, Mexico City.',
  ogImagePath:
    process.env.NEXT_PUBLIC_OG_IMAGE || '/landing-page/recepcion.jpg',
  landingLogoPath: process.env.NEXT_PUBLIC_LANDING_LOGO || '/app/logo.png',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '522461003603',
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    'Hola, me gustaria recibir informacion sobre clases y entrenamientos en Brotherhood 33 AV',
  businessCity: process.env.NEXT_PUBLIC_BUSINESS_CITY || 'Mexico City',
  businessRegion: process.env.NEXT_PUBLIC_BUSINESS_REGION || 'CDMX',
  businessCountry: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY || 'MX',
} as const;

export function buildWhatsAppUrl() {
  const encodedMessage = encodeURIComponent(branding.whatsappMessage);
  return `https://wa.me/${branding.whatsappNumber}?text=${encodedMessage}`;
}
