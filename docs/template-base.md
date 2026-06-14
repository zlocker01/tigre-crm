# Template Base

Este repo queda preparado para dos objetivos al mismo tiempo:

1. Conservar el proyecto real actual sin tocar su base de datos.
2. Servir como base reutilizable para crear un nuevo negocio con otro Supabase.

## Que Se Conserva Del Proyecto Real

- `src/data`
- `src/app/api`
- `src/components` funcionales
- `src/hooks`
- `src/interfaces`
- `src/schemas`
- `supabase/migrations`
- `supabase/seed.sql`

Nada de esto debe borrarse para convertir el repo en template. Es el core del sistema.

## Que Se Volvio Configurable

La configuracion reusable de branding y SEO ahora vive en:

- `src/config/branding.ts`
- `.env.example`

Desde ahi se parametriza:

- nombre comercial
- nombre corto
- descripcion del sitio
- SEO principal
- URL publica
- logo de landing
- numero y mensaje de WhatsApp
- ciudad, estado y pais

## Archivos Ya Conectados A La Configuracion

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/components/landing-page/header.tsx`
- `src/components/landing-page/whatsapp-button.tsx`
- `src/app/session/admin/layout.tsx`
- `src/app/session/employee/layout.tsx`

## Pendientes De Branding Para El Siguiente Proyecto

Todavia existen textos e imagenes especificas del negocio actual en archivos como:

- landing pages y metadatos secundarios en `src/app`
- componentes de `src/components/landing-page`
- assets en `public/app` y `public/landing-page`
- `public/manifest.json`

Eso no rompe el template. Solo indica que el siguiente paso sera rebrandizar contenido visual y legal.

## Flujo Seguro Recomendado

1. Mantener este repo como base maestra.
2. Crear una copia del repo para el nuevo negocio.
3. Cambiar variables en `.env.local` usando `.env.example`.
4. Crear un proyecto nuevo de Supabase.
5. Aplicar migraciones en el nuevo proyecto.
6. Reemplazar branding, textos e imagenes en la copia.
