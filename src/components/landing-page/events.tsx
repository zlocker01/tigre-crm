'use client';

import React from 'react';
import Image from 'next/image';
import { EventItem } from '@/interfaces/events/EventItem';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface EventsProps {
  data: EventItem[];
}

export default function Events({ data }: EventsProps) {
  // Asegurar que data es un array
  const safeData = Array.isArray(data) ? data : [];
  const activeEvents = safeData.filter((event) => event.is_active !== false);

  // Si no hay eventos, mostramos la sección vacía temporalmente para confirmar que carga
  // En producción podríamos querer ocultarla con: if (activeEvents.length === 0) return null;

  return (
    <section
      className="py-24 relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-black text-gray-900 dark:text-white"
      id="events"
    >
      {/* --- MODO CLARO: Diseño "Paper Cut" (Ondas Rojas/Blancas) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none dark:hidden">
        {/* Fondo base */}
        <div className="absolute inset-0 bg-slate-50" />

        {/* Ondas SVG superpuestas */}
        <div className="absolute bottom-0 left-0 w-full h-[40%] min-h-[300px]">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            {/* Capa 1 (Más clara/atrás) */}
            <path
              fill="#ef4444" // red-500
              fillOpacity="0.1"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
            {/* Capa 2 (Media) */}
            <path
              fill="#dc2626" // red-600
              fillOpacity="0.4"
              d="M0,256L48,245.3C96,235,192,213,288,192C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
            {/* Capa 3 (Principal/Frente) */}
            <path
              fill="#b91c1c" // red-700
              fillOpacity="0.8"
              d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,234.7C672,256,768,288,864,282.7C960,277,1056,235,1152,213.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* --- MODO OSCURO: Elementos decorativos (Orbes) --- */}
      <div className="hidden dark:block absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-[128px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
            Próximos{' '}
            <span className="text-primary dark:text-primary">Eventos</span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-red-500 to-transparent dark:via-gold mx-auto rounded-full opacity-80"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            No te pierdas nuestras próximas actividades, seminarios y
            competencias.
          </p>
        </div>

        {activeEvents.length === 0 ? (
          <div className="text-center py-16 bg-white/60 dark:bg-white/5 rounded-2xl backdrop-blur-sm border border-red-100 dark:border-white/10 max-w-2xl mx-auto shadow-sm">
            <p className="text-gray-600 dark:text-gray-400 text-xl font-medium">
              Pronto anunciaremos nuevos eventos.
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 pb-12 md:pb-0">
            <Carousel
              opts={{
                align: 'center',
                loop: activeEvents.length > 1,
              }}
              className="w-full"
            >
              <CarouselContent
                className={cn(
                  '-ml-6',
                  activeEvents.length === 1 && 'justify-center',
                )}
              >
                {activeEvents.map((event) => (
                  <CarouselItem
                    key={event.id}
                    className="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/3"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group border border-red-100 dark:border-white/10 bg-white dark:bg-transparent">
                      <Image
                        src={event.image_url}
                        alt="Próximo Evento"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                      {/* Overlay gradiente al hacer hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-transparent to-transparent dark:from-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="inline-block px-3 py-1 bg-white text-red-600 dark:bg-primary dark:text-white text-xs font-bold uppercase tracking-wider rounded-full mb-2 shadow-lg">
                            Evento
                          </span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {activeEvents.length > 1 && (
                <div className="hidden md:flex justify-center gap-4 mt-12">
                  <CarouselPrevious className="static translate-y-0 hover:bg-red-600 hover:text-white border-red-200 dark:border-white/20 text-red-800 dark:text-white bg-white/80 dark:bg-white/10 backdrop-blur-sm shadow-sm" />
                  <CarouselNext className="static translate-y-0 hover:bg-red-600 hover:text-white border-red-200 dark:border-white/20 text-red-800 dark:text-white bg-white/80 dark:bg-white/10 backdrop-blur-sm shadow-sm" />
                </div>
              )}
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}
