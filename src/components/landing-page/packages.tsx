'use client';

import useSWR from 'swr';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, XCircle, Layers } from 'lucide-react';
import Link from 'next/link';
import type { Package } from '@/interfaces/packages/Package';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch packages');
    }
    return res.json();
  });

export default function Packages({ landingId }: { landingId: string }) {
  const { data, error, isLoading } = useSWR<{ packages: Package[] }>(
    `/api/packages?landingPageId=${landingId}`,
    fetcher,
  );

  const normalizeList = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map((v) => String(v).trim()).filter((v) => v.length > 0);
    }
    if (typeof value === 'string') {
      const raw = value.trim();
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
              .map((v) => String(v).trim())
              .filter((v) => v.length > 0);
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

  if (isLoading) {
    return (
      <section id="packages" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Cargando paquetes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section id="packages" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive">Error al cargar los paquetes.</p>
          </div>
        </div>
      </section>
    );
  }

  const pkgs = data.packages || [];

  return (
    <section id="packages" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Paquetes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus objetivos.
          </p>
        </div>

        {pkgs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay paquetes disponibles por ahora.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pkgs.map((pkg) => {
              const benefits = normalizeList(pkg.benefits);
              const restrictions = normalizeList(pkg.restrictions);

              return (
                <Card
                  key={pkg.id}
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/40 bg-background shadow-sm transition-all hover:shadow-lg"
                >
                  {pkg.image && (
                    <div className="relative h-52 overflow-hidden bg-background">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                    </div>
                  )}
                  <CardHeader className="p-6 pb-3">
                    <div className="flex items-baseline justify-between">
                      <CardTitle className="text-xl font-bold text-foreground">
                        {pkg.name}
                      </CardTitle>
                      <span className="text-2xl font-extrabold">
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN',
                          minimumFractionDigits: 0,
                        }).format(pkg.price)}
                        <span className="ml-1 text-sm font-medium text-muted-foreground">
                          / mes
                        </span>
                      </span>
                    </div>
                    {pkg.subtitle && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {pkg.subtitle}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 p-6 pt-0">
                    {benefits.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Beneficios
                        </p>
                        <ul className="space-y-2">
                          {benefits.map((benefit, i) => (
                            <li
                              key={i}
                              className="text-sm flex items-start gap-2"
                            >
                              <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {restrictions.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Restricciones
                        </p>
                        <ul className="space-y-2">
                          {restrictions.map((restriction, i) => (
                            <li
                              key={i}
                              className="text-sm flex items-start gap-2 text-muted-foreground"
                            >
                              <XCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>{restriction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button
                      asChild
                      className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Link
                        href="/citas"
                        className="flex items-center justify-center gap-2"
                      >
                        <Layers className="h-4 w-4" />
                        <span>Agendar Clase Gratis</span>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
