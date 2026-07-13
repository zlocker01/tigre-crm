# Brotherhood 33 AV CRM

CRM en Next.js + Supabase para Brotherhood 33 AV, con backend local preparado para funcionar como base reproducible.

## Requisitos

- Node.js 20+
- pnpm
- Docker Desktop activo para Supabase local
- Supabase CLI

## Levantar el proyecto

1. Instala dependencias:

```bash
pnpm install
```

2. Configura tus variables en `.env.local`.

3. Levanta Supabase local:

```bash
pnpm supabase:start
```

4. Resetea la base con todas las migraciones:

```bash
pnpm supabase:reset
```

5. Inicia la app:

```bash
pnpm dev
```

## Backend Template

La fuente de verdad del backend queda en:

- `supabase/migrations`: historial completo de esquema, RLS, triggers y funciones RPC
- `supabase/seed.sql`: seed base para que `db reset` funcione en clones limpios
- `supabase/config.toml`: config local del stack de Supabase

## Proyecto Real Y Template Base

- El proyecto real actual se conserva: no necesitas borrar su DB para reutilizar la arquitectura.
- El repo tambien queda estabilizado como base: la configuracion reutilizable vive en `src/config/branding.ts`.
- Usa `.env.example` para crear el `.env.local` del siguiente negocio.
- Revisa `docs/template-base.md` para el flujo seguro de clonacion.

## Clonar Este Backend En Otro Proyecto

1. Copia la carpeta `supabase/`.
2. Cambia `project_id` en `supabase/config.toml` para evitar colisiones locales entre proyectos.
3. Ejecuta:

```bash
pnpm install
pnpm supabase:start
pnpm supabase:reset
```

4. Si vas a conectar un proyecto remoto nuevo:

```bash
pnpm exec supabase link
pnpm supabase:migrations
```

## Scripts Utiles

```bash
pnpm supabase:start
pnpm supabase:stop
pnpm supabase:status
pnpm supabase:reset
pnpm supabase:migrations
```

## Notas

- Los metadatos locales generados por Supabase (`supabase/.temp` y `supabase/.branches`) no deben versionarse.
- Si `pnpm supabase:start` falla, normalmente Docker Desktop no esta iniciado.
- El template incluye migraciones nuevas para alinear `class_sessions`, `working_hours`, triggers de `auth.users` y funciones RPC de dashboard con el estado actual del proyecto.
