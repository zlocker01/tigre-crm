import Link from 'next/link';
import { Instagram, Facebook } from 'lucide-react';
import { getContactSections } from '@/data/contactSections/getContactSections';
import { getHeroSection } from '@/data/heroSection/getHeroSection';
import { getServices } from '@/data/services/getServices';
import { getLandingId } from '@/data/getLandingId';

export default async function Footer() {
  const landingId = await getLandingId();
  const [{ data: contactSections }, { data: heroSections }, services] =
    await Promise.all([
      getContactSections(landingId || ''),
      getHeroSection(landingId || ''),
      landingId ? getServices(landingId) : Promise.resolve([]),
    ]);

  const contactInfo = contactSections?.[0];
  const heroTitle = heroSections?.[0]?.title || 'JS BJJ Academy';
  // Tomar solo los primeros 6 servicios
  const displayedServices = services?.slice(0, 6) || [];

  return (
    <footer className="relative py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-blue-50/40 to-secondary/30 dark:from-blue-700/40 dark:via-transparent dark:to-white/20 -z-10" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{heroTitle}</h3>
            <p className="text-muted-foreground">
              Academia de Jiu Jitsu Brasileño en Apizaco, Tlaxcala, México.
              Entrena BJJ y MMA en un ambiente seguro, profesional y enfocado
              en el progreso real de cada alumno.
            </p>
            <div className="flex space-x-4">
              {contactInfo?.instagram && (
                <Link
                  href={contactInfo.instagram}
                  target="_blank"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              )}
              {contactInfo?.facebook && (
                <Link
                  href={contactInfo.facebook}
                  target="_blank"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#hero"
                  className="text-muted-foreground hover:text-primary"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="text-muted-foreground hover:text-primary"
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-muted-foreground hover:text-primary"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/#gallery"
                  className="text-muted-foreground hover:text-primary"
                >
                  Galería
                </Link>
              </li>
              <li>
                <Link
                  href="/#promotions"
                  className="text-muted-foreground hover:text-primary"
                >
                  Promociones
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/522461003603?text=Hola,%20me%20gustaría%20agendar%20una%20clase"
                  className="text-muted-foreground hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Agendar Clase
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Servicios</h3>
            <ul className="space-y-2">
              {displayedServices.map((service) => (
                <li key={service.id}>
                  <Link
                    href="#services"
                    className="text-muted-foreground hover:text-primary"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              {displayedServices.length === 0 && (
                <li className="text-muted-foreground">
                  No hay servicios disponibles
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <address className="not-italic text-muted-foreground space-y-2">
              {contactInfo?.address && <p>{contactInfo.address}</p>}
              {contactInfo?.phone && (
                <p>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                    className="hover:text-primary"
                  >
                    Tel: {contactInfo.phone}
                  </a>
                </p>
              )}
              {contactInfo?.email && (
                <p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="hover:text-primary"
                  >
                    {contactInfo.email}
                  </a>
                </p>
              )}
            </address>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            {' '}
            {new Date().getFullYear()} {heroTitle}. Todos los derechos
            reservados.
          </p>
          <div className="mt-2 space-x-4">
            <Link href="#" className="hover:text-primary">
              Aviso de Privacidad
            </Link>
            <Link href="#" className="hover:text-primary">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
