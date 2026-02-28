"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Search,
  Home,
  ArrowLeft,
  Compass,
  Mail,
  Phone,
  HelpCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const [redirectSeconds, setRedirectSeconds] = useState(30);
  const [showSupport, setShowSupport] = useState(false);

  // Contador de redirección automática
  useEffect(() => {
    if (redirectSeconds > 0) {
      const timer = setTimeout(() => {
        setRedirectSeconds(redirectSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = "/session";
    }
  }, [redirectSeconds]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4 text-center">
      <div className="mx-auto max-w-md space-y-6 sm:max-w-lg">
        {/* Número 404 estilizado con animación */}
        <div className="relative mx-auto w-full max-w-[280px]">
          <div className="text-[10rem] font-extrabold tracking-tighter text-primary/20 animate-pulse">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-2">
              <div className="h-16 w-16 rounded-full bg-primary/10 p-3 mx-auto animate-bounce">
                <Compass className="h-full w-full text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                JSBJJMX - Página no encontrada
              </h1>
            </div>
          </div>
        </div>

        {/* Mensaje explicativo */}
        <p className="text-muted-foreground">
          Lo sentimos, la página que estás buscando no existe o ha sido movida a
          otra ubicación.
        </p>

        {/* Buscador */}
        <div className="relative mt-8">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar en el sitio..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Buscar</Button>
          </div>
        </div>

        {/* Opciones de navegación */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2"
            asChild
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>Ir al inicio</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto gap-2"
            asChild
          >
            <Link href="javascript:history.back()">
              <ArrowLeft className="h-4 w-4" />
              <span>Volver atrás</span>
            </Link>
          </Button>
        </div>

        {/* Contador de redirección */}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">
            Redirección automática a la página principal en {redirectSeconds}{" "}
            segundos
          </p>
          <Progress value={(redirectSeconds / 30) * 100} className="h-2" />
        </div>

        {/* Sugerencias */}
        <div className="mt-8 rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-medium">Páginas populares</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-primary hover:underline">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/session" className="text-primary hover:underline">
                Perfil
              </Link>
            </li>
          </ul>
        </div>

        {/* Botón de soporte */}
        <div className="mt-4">
          <Button
            variant="link"
            onClick={() => setShowSupport(!showSupport)}
            className="text-sm"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            {showSupport
              ? "Ocultar información de soporte"
              : "¿Necesitas ayuda?"}
          </Button>

          {showSupport && (
            <Alert className="mt-2">
              <AlertDescription>
                <div className="flex flex-col space-y-2 text-sm">
                  <p>Si necesitas asistencia, puedes contactarnos:</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a
                      href="mailto:contacto@larochellestetica.com"
                      className="text-primary hover:underline"
                    >
                      contacto@ortoestetik.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a
                      href="tel:2461003603"
                      className="text-primary hover:underline"
                    >
                      924610036
                    </a>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
