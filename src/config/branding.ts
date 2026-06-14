const fallbackSiteUrl = (() => {
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

export const branding = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'JSBJJ MX',
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || 'JSBJJ MX',
  shortName: process.env.NEXT_PUBLIC_SHORT_NAME || 'JSBJJ MX',
  adminDescription:
    process.env.NEXT_PUBLIC_ADMIN_DESCRIPTION ||
    'Panel de administracion interno del negocio.',
  employeeDescription:
    process.env.NEXT_PUBLIC_EMPLOYEE_DESCRIPTION ||
    'Dashboard interno para empleados del negocio.',
  siteUrl: fallbackSiteUrl,
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Academia profesional de Brazilian Jiu-Jitsu (BJJ) y MMA en Apizaco, Tlaxcala. Clases para todos los niveles, ambiente seguro y coaches certificados.',
  ogTitle:
    process.env.NEXT_PUBLIC_OG_TITLE ||
    'JSBJJ MX | Academia de Brazilian Jiu-Jitsu',
  ogDescription:
    process.env.NEXT_PUBLIC_OG_DESCRIPTION ||
    'Academia profesional de Brazilian Jiu-Jitsu (BJJ) y MMA en Apizaco, Tlaxcala.',
  ogImagePath:
    process.env.NEXT_PUBLIC_OG_IMAGE || '/landing-page/recepcion.jpg',
  landingLogoPath:
    process.env.NEXT_PUBLIC_LANDING_LOGO || '/landing-page/logo.png',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '522461003603',
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    'Hola, me gustaria agendar una clase',
  businessCity: process.env.NEXT_PUBLIC_BUSINESS_CITY || 'Apizaco',
  businessRegion: process.env.NEXT_PUBLIC_BUSINESS_REGION || 'Tlaxcala',
  businessCountry: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY || 'MX',
} as const;

export function buildWhatsAppUrl() {
  const encodedMessage = encodeURIComponent(branding.whatsappMessage);
  return `https://wa.me/${branding.whatsappNumber}?text=${encodedMessage}`;
}
