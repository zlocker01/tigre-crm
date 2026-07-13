'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { branding } from '@/config/branding';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Inicio', href: '/#hero' },
    { name: 'Servicios', href: '/#services' },
    { name: 'Nosotros', href: '/#about' },
    { name: 'Galería', href: '/#gallery' },
    { name: 'Promociones', href: '/#promotions' },
    { name: 'Contacto', href: '/#location' },
    { name: 'FAQ', href: '/#faq' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent',
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <Image
              src={branding.landingLogoPath}
              alt={`Logo ${branding.appName}`}
              width={240}
              height={80}
              priority
              sizes="(max-width: 768px) 160px, 240px"
              className="h-14 md:h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium hover:text-secondary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <ThemeToggle />
            <Button asChild>
              <Link href="/citas">Agendar Clase</Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menú</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-background z-50 md:hidden h-screen w-full overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-8">
              <Link href="/" className="flex items-center" onClick={closeMenu}>
                <Image
                  src={branding.landingLogoPath}
                  alt={`Logo ${branding.appName}`}
                  width={240}
                  height={80}
                  sizes="240px"
                  className="h-16 w-auto"
                />
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={closeMenu}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Cerrar menú</span>
              </Button>
            </div>
            <nav className="flex flex-col space-y-4 py-4 border-t border-border">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="py-3 px-4 rounded-lg text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors text-base font-medium"
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button asChild size="lg" className="w-full">
                  <Link href="/citas" onClick={closeMenu}>
                    Agendar Clase
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  <Link href="#services" onClick={closeMenu}>
                    Ver Clases
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
