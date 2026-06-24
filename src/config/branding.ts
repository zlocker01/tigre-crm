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
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Tigre Fitness & MMA',
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || 'Tigre Fitness & MMA',
  shortName: process.env.NEXT_PUBLIC_SHORT_NAME || 'Tigre Fitness & MMA',
  adminDescription:
    process.env.NEXT_PUBLIC_ADMIN_DESCRIPTION ||
    'Panel de administracion interno de Tigre Fitness & MMA.',
  employeeDescription:
    process.env.NEXT_PUBLIC_EMPLOYEE_DESCRIPTION ||
    'Dashboard interno para empleados de Tigre Fitness & MMA.',
  siteUrl: fallbackSiteUrl,
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Academia de MMA y fitness en Santa Fe. Entrena con clases para todos los niveles en un ambiente profesional, seguro y enfocado en resultados.',
  ogTitle:
    process.env.NEXT_PUBLIC_OG_TITLE ||
    'Tigre Fitness & MMA | Academia de MMA y Fitness en Santa Fe',
  ogDescription:
    process.env.NEXT_PUBLIC_OG_DESCRIPTION ||
    'Academia de MMA y fitness en Santa Fe con entrenamiento funcional, clases guiadas y una experiencia profesional para todos los niveles.',
  ogImagePath:
    process.env.NEXT_PUBLIC_OG_IMAGE || '/landing-page/recepcion.jpg',
  landingLogoPath:
    process.env.NEXT_PUBLIC_LANDING_LOGO || '/app/logo.png',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '522461003603',
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    'Hola, me gustaria recibir informacion sobre clases y entrenamientos en Tigre Fitness & MMA',
  businessCity: process.env.NEXT_PUBLIC_BUSINESS_CITY || 'Santa Fe',
  businessRegion: process.env.NEXT_PUBLIC_BUSINESS_REGION || 'CDMX',
  businessCountry: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY || 'MX',
} as const;

export function buildWhatsAppUrl() {
  const encodedMessage = encodeURIComponent(branding.whatsappMessage);
  return `https://wa.me/${branding.whatsappNumber}?text=${encodedMessage}`;
}
