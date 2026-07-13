import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description:
    'Información sobre el uso de cookies en Brotherhood 33 AV: tipos de cookies, finalidad y gestión.',
  alternates: {
    canonical: '/politica-de-cookies',
  },
};

export default function PoliticaDeCookies() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <section className="shadow-xl rounded-xl p-8 border border-goldHover">
        <h1 className="text-3xl font-bold text-gold mb-6 text-center">
          Política de Cookies
        </h1>
        <div className="space-y-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <p className="text-gray-700">
              En <span className="font-semibold">Brotherhood 33 AV App</span>{' '}
              utilizamos cookies para mejorar la experiencia del usuario,
              analizar el tráfico y personalizar el contenido. Al continuar
              navegando por nuestro sitio, aceptas el uso de cookies según lo
              establecido en esta política.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gold mb-2">
              ¿Qué son las cookies?
            </h2>
            <p className="text-gray-700">
              Las cookies son pequeños archivos de texto que los sitios web
              almacenan en tu dispositivo para recordar información sobre tu
              visita, como tus preferencias y actividad.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gold mb-2">
              ¿Qué tipo de cookies utilizamos?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>
                <span className="font-semibold">Cookies esenciales:</span>{' '}
                necesarias para el funcionamiento básico de la app.
              </li>
              <li>
                <span className="font-semibold">Cookies de análisis:</span> nos
                ayudan a entender cómo interactúas con la app y mejorar nuestros
                servicios.
              </li>
              <li>
                <span className="font-semibold">Cookies de preferencias:</span>{' '}
                recuerdan tus configuraciones y preferencias.
              </li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gold mb-2">
              ¿Cómo puedes gestionar las cookies?
            </h2>
            <p className="text-gray-700">
              Puedes configurar tu navegador para rechazar o eliminar cookies.
              Sin embargo, algunas funcionalidades de la app pueden verse
              afectadas.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gold mb-2">
              Actualizaciones
            </h2>
            <p className="text-gray-700">
              Nos reservamos el derecho de modificar esta política en cualquier
              momento. Te recomendamos revisarla periódicamente.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Última actualización: 30 de junio de 2025
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
