'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import useSWR from 'swr';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarPlus, Loader2, AlertCircle, Clock } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch promotions');
    }
    return res.json();
  });

export default function Promotions({ landingId }: { landingId: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const { data, error, isLoading } = useSWR<{ promotions: any[] }>(
    `/api/promotions?landingPageId=${landingId}`,
    fetcher,
  );

  const promotions = data?.promotions || [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading) {
    return (
      <section
        id="promotions"
        className="py-16 md:py-24 bg-gradient-to-r from-gold to-amber-50 dark:from-gold-950/10 dark:to-amber-950/20"
      >
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4">Cargando promociones...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="promotions"
        className="py-16 md:py-24 bg-gradient-to-r  from-gold to-amber-50 dark:from-gold-950/10 dark:to-amber-950/20"
      >
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <p className="mt-4 text-destructive">
            Error al cargar las promociones. Intente nuevamente.
          </p>
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <section
      id="promotions"
      className="py-16 md:py-24 bg-gradient-to-r from-gold to-amber-50 dark:from-gold-950/10 dark:to-amber-950/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Promociones Especiales
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aprovecha nuestras promociones por tiempo limitado. ¡No dejes pasar
            estas increíbles ofertas!
          </p>
        </div>

        {isMounted && (
          <Carousel
            opts={{
              align: 'center',
              loop: promotions.length > 1,
            }}
            className="w-full relative"
          >
            <CarouselContent
              className={cn(
                '-ml-1',
                promotions.length === 1 && 'justify-center',
              )}
            >
              {promotions.map((promo) => (
                <CarouselItem
                  key={promo.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1 h-full">
                    <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col relative h-[500px] border-0 shadow-md dark:border dark:border-border/50">
                      {/* Imagen */}
                      <div className="relative h-[45%] w-full dark:absolute dark:inset-0 dark:h-full dark:z-0">
                        <img
                          src={promo.image || '/placeholder.svg'}
                          alt={promo.title}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                        {/* Overlay solo en Dark Mode */}
                        <div className="hidden dark:block absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      </div>

                      {/* Badge (siempre visible) */}
                      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 items-end">
                        <Badge
                          variant="destructive"
                          className="text-sm px-3 py-1 shadow-sm"
                        >
                          {Math.round(
                            ((parseFloat(promo.price) -
                              parseFloat(promo.discount_price)) /
                              parseFloat(promo.price)) *
                              100,
                          )}
                          % OFF
                        </Badge>
                      </div>

                      {/* Contenido */}
                      <div className="relative z-20 flex flex-col h-[55%] justify-between p-6 bg-white dark:bg-transparent dark:h-full dark:justify-end">
                        <div className="space-y-2">
                          <CardHeader className="p-0">
                            <CardTitle className="font-bold text-lg md:text-xl lg:text-2xl text-gray-900 dark:text-white dark:drop-shadow-lg">
                              {promo.title}
                            </CardTitle>
                            <CardDescription className="mb-2 text-gray-600 dark:text-white/90 dark:drop-shadow-md line-clamp-3">
                              {promo.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2 p-0 mt-4">
                            {/* Prices */}
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-bold text-primary dark:drop-shadow-md">
                                ${promo.discount_price}
                              </p>
                              <p className="text-md font-normal text-gray-400 line-through dark:text-white/80 dark:drop-shadow-sm">
                                ${promo.price}
                              </p>
                            </div>

                            {/* Validity */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/80 dark:drop-shadow-sm">
                              <CalendarPlus className="h-4 w-4" />
                              <span>
                                Válido hasta{' '}
                                {new Date(promo.valid_until).toLocaleDateString(
                                  'es-ES',
                                  {
                                    day: 'numeric',
                                    month: 'long',
                                  },
                                )}
                              </span>
                            </div>
                          </CardContent>
                        </div>
                        <CardFooter className="p-0 pt-4 mt-auto">
                          <Button asChild className="w-full shadow-sm">
                            <Link
                              href="/citas"
                              className="flex items-center gap-2"
                            >
                              <CalendarPlus className="h-4 w-4" />
                              <span>Reservar ahora</span>
                            </Link>
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 -translate-x-4" />
            <CarouselNext className="right-0 translate-x-4" />
          </Carousel>
        )}
      </div>
    </section>
  );
}
