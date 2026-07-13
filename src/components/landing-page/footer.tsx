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
      {/* Elementos decorativos con morado y amarillo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 -z-10">
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-secondary rounded-full blur-[100px]" />
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-primary rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-secondary">{heroTitle}</h3>
            <p className="text-muted-foreground">
              Academia de MMA, Boxeo, BJJ y Strength &amp; Conditioning en
              Ciudad de México. Entrena en un ambiente profesional, seguro y
              enfocado en resultados reales.
            </p>
            <div className="flex space-x-4">
              {contactInfo?.instagram && (
                <Link
                  href={contactInfo.instagram}
                  target="_blank"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              )}
              {contactInfo?.facebook && (
                <Link
                  href={contactInfo.facebook}
                  target="_blank"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#hero"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/#gallery"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  Galería
                </Link>
              </li>
              <li>
                <Link
                  href="/#promotions"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  Promociones
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/522461003603?text=Hola,%20me%20gustaría%20agendar%20una%20clase"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Agendar Clase
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">Servicios</h3>
            <ul className="space-y-2">
              {displayedServices.map((service) => (
                <li key={service.id}>
                  <Link
                    href="#services"
                    className="text-muted-foreground hover:text-secondary transition-colors"
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
            <h3 className="text-lg font-bold mb-4 text-secondary">Contacto</h3>
            <address className="not-italic text-muted-foreground space-y-2">
              {contactInfo?.address && <p>{contactInfo.address}</p>}
              {contactInfo?.phone && (
                <p>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                    className="hover:text-secondary transition-colors"
                  >
                    Tel: {contactInfo.phone}
                  </a>
                </p>
              )}
              {contactInfo?.email && (
                <p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="hover:text-secondary transition-colors"
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
            <Link
              href="/privacidad"
              className="hover:text-secondary transition-colors"
            >
              Aviso de Privacidad
            </Link>
            <Link
              href="/politica-de-uso-y-privacidad"
              className="hover:text-secondary transition-colors"
            >
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
