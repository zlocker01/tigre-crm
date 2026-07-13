'use client';

import React from 'react';
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
      className="py-24 relative overflow-hidden bg-background text-foreground"
      id="events"
    >
      {/* --- Elementos decorativos: Orbes de color (Amarillo y Morado) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-[128px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-foreground drop-shadow-sm">
            Próximos <span className="text-primary">Eventos</span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full opacity-80"></div>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            No te pierdas nuestras próximas actividades, seminarios y
            competencias.
          </p>
        </div>

        {activeEvents.length === 0 ? (
          <div className="text-center py-16 bg-card/60 rounded-2xl backdrop-blur-sm border border-border max-w-2xl mx-auto shadow-sm">
            <p className="text-muted-foreground text-xl font-medium">
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
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(250,204,21,0.25)] transition-all duration-500 group border border-border bg-card">
                      <img
                        src={event.image_url}
                        alt="Próximo Evento"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                      {/* Overlay gradiente al hacer hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="inline-block px-3 py-1 bg-primary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-2 shadow-lg">
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
                  <CarouselPrevious className="static translate-y-0 hover:bg-primary hover:text-primary-foreground border-border text-muted-foreground bg-card/80 backdrop-blur-sm shadow-sm" />
                  <CarouselNext className="static translate-y-0 hover:bg-primary hover:text-primary-foreground border-border text-muted-foreground bg-card/80 backdrop-blur-sm shadow-sm" />
                </div>
              )}
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}
