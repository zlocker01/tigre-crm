'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import {
  Scissors,
  Sparkles,
  Droplet,
  Brush,
  Clock,
  Loader2,
  AlertCircle,
  EyeClosed,
  Layers,
  Users,
  ShieldCheck,
  Activity,
  Baby,
  HeartPulse,
  Siren,
  Stethoscope,
  Smile,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import type { Service } from '@/interfaces/services/Service';
import { LevelBadge } from '../services/LevelBadge';

const ToothIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 2c-2.76 0-5 2.24-5 5 0 2.2 1.5 4.08 3.5 4.74.5 1.76.5 4.26.5 6.26 0 2.2 1.8 4 4 4s2-.5 2-2c0-1 1-1 1 0s-.2 2 2 2 2.2-1.8 2.2-4c0-2 0-4.5.5-6.26C19.5 11.08 21 9.2 21 7c0-2.76-2.24-5-5-5-1.5 0-2.83.67-3.79 1.73-.24.26-.6.26-.84 0C10.43 2.67 9.1 2 7.6 2h-.6z" />
  </svg>
);

const serviceLevels = [
  { id: 'all', label: 'Todos' },
  {
    id: 'Principiantes',
    label: 'Principiantes',
    icon: <Baby className="h-4 w-4" />,
  },
  { id: 'Avanzado', label: 'Avanzado', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'Niños', label: 'Niños', icon: <Smile className="h-4 w-4" /> },
  { id: 'Mujeres', label: 'Mujeres', icon: <HeartPulse className="h-4 w-4" /> },
  { id: 'Mixto', label: 'Mixto', icon: <Users className="h-4 w-4" /> },
  {
    id: 'Competencia',
    label: 'Competencia',
    icon: <Siren className="h-4 w-4" />,
  },
];

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch services');
    }
    return res.json();
  });

export default function Services({ landingId }: { landingId: string }) {
  const [level, setLevel] = useState('all');

  const { data, error, isLoading } = useSWR<{ services: Service[] }>(
    `/api/services?landingPageId=${landingId}`,
    fetcher,
  );

  const normalizeBenefits = (benefits: unknown): string[] => {
    if (Array.isArray(benefits)) {
      return benefits
        .map((b) => String(b).trim())
        .filter((b) => b.length > 0);
    }
    if (typeof benefits === 'string') {
      const raw = benefits.trim();
      try {
        if (
          (raw.startsWith('"') && raw.endsWith('"')) ||
          (raw.startsWith('[') && raw.endsWith(']'))
        ) {
          const parsed = JSON.parse(raw);
          if (typeof parsed === 'string') {
            return [parsed];
          }
          if (Array.isArray(parsed)) {
            return parsed
              .map((b) => String(b).trim())
              .filter((b) => b.length > 0);
          }
        }
      } catch {}
      return raw
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return [];
  };

  const filteredServices =
    level === 'all'
      ? data?.services || []
      : data?.services.filter((service) => service.level === level) || [];

  if (isLoading) {
    return (
      <section id="services" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4">Cargando clases...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      // eslint-disable-next-line biomelint/nursery/useUniqueElementIds
      <section id="services" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <p className="mt-4 text-destructive">
            Error al cargar las clases. Intente nuevamente.
          </p>
        </div>
      </section>
    );
  }

  return (
    // eslint-disable-next-line biomelint/nursery/useUniqueElementIds
    <section id="services" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nuestras Clases
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos una amplia gama de clases para todos los niveles. Todas
            nuestras clases son impartidas por profesionales certificados.
          </p>
        </div>

        <Tabs
          defaultValue="all"
          value={level}
          onValueChange={setLevel}
          className="w-full"
        >
          <div className="flex justify-center mb-28 md:mb-14">
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full max-w-3xl">
              {serviceLevels.map((lvl) => (
                <TabsTrigger
                  key={lvl.id}
                  value={lvl.id}
                  className="flex flex-col items-center justify-center py-2 px-1 text-xs sm:text-sm"
                >
                  {lvl.icon}
                  <span className="mt-1">{lvl.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={level} className="mt-6">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay clases disponibles en este nivel.
                </p>
              </div>
            ) : (
              <Carousel
                opts={{
                  align: 'start',
                  loop: filteredServices.length > 3, // Loop only if there are enough items
                }}
                className="w-full max-w-sm md:max-w-xl lg:max-w-6xl mx-auto"
              >
                <CarouselContent>
                  {filteredServices.map((service) => {
                    const benefitsArray = normalizeBenefits(service.benefits);
                    return (
                      <CarouselItem
                        key={service.id}
                        className="md:basis-1/2 lg:basis-1/3 mt-10"
                      >
                        <div className="p-1 h-full">
                          <div className="p-1 min-h-96">
                            <Card className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/40 bg-background shadow-sm transition-all hover:shadow-lg">
                              <div className="relative overflow-hidden">
                                <div className="relative h-52 w-full">
                                  <Image
                                    src={service.image || '/placeholder.svg'}
                                    alt={`${service.title} | Clase en Tigre Fitness & MMA`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover object-center"
                                  />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                                <div className="absolute right-4 top-4">
                                  <LevelBadge level={service.level} />
                                </div>
                              </div>
                              <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                                <CardHeader className="mb-3 p-0">
                                  <CardTitle className="text-xl font-bold text-foreground">
                                    {service.title}
                                  </CardTitle>
                                  <CardDescription className="mt-1 text-sm text-muted-foreground">
                                    {service.description}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 p-0">
                                  {benefitsArray.length > 0 && (
                                    <ul className="mt-3 space-y-2 text-sm text-foreground">
                                      {benefitsArray.map((benefit, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start gap-2"
                                        >
                                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                                          <span>{benefit}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </CardContent>
                                <CardFooter className="mt-5 p-0">
                                  <Button
                                    asChild
                                    className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                                  >
                                    <Link
                                      href="/citas"
                                      className="flex items-center justify-center gap-2"
                                    >
                                      <Layers className="h-4 w-4" />
                                      <span>Ver paquetes</span>
                                    </Link>
                                  </Button>
                                </CardFooter>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-x-4" />
                <CarouselNext className="right-0 translate-x-4" />
              </Carousel>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

