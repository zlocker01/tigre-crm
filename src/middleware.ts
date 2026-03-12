import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// Middleware unificado para Next.js y Supabase
export async function middleware(request: NextRequest) {
  // Creamos una respuesta base
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Inicializamos Supabase con manejo correcto de cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Actualizamos las cookies tanto en la solicitud como en la respuesta
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );
  
  // Verificamos la sesión sin importar en qué URL estemos
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  
  // Si estamos en una ruta protegida y no hay sesión, redirigimos al login
  if (request.nextUrl.pathname.startsWith('/session') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si todo está bien, devolvemos la respuesta con las cookies actualizadas
  return response;
}

export const config = {
  matcher: [
    '/session/:path*',
  ],
};
