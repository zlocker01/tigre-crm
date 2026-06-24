import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Política de uso y privacidad de Tigre Fitness & MMA: condiciones de uso, tratamiento de datos y seguridad.",
  alternates: {
    canonical: "/politica-de-uso-y-privacidad",
  },
};

export default function PoliticaDeUsoYPrivacidad() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <section className="shadow-xl rounded-xl p-8 border border-goldHover">
        <h1 className="text-3xl font-bold text-gold mb-6 text-center">Política de Uso y Privacidad</h1>
        <div className="space-y-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gold">1. Introducción</h2>
            <p className="text-gray-700">
              Bienvenido a <span className="font-semibold">Tigre Fitness & MMA App</span>. Al utilizar nuestra aplicación, aceptas cumplir con los términos y condiciones establecidos en esta política.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gold">2. Uso de la Aplicación</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>El usuario se compromete a hacer un uso adecuado y lícito de la app.</li>
              <li>No está permitido el uso de la app para fines ilegales o no autorizados.</li>
              <li>Nos reservamos el derecho de suspender cuentas que incumplan estas normas.</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gold">3. Privacidad y Protección de Datos</h2>
            <p className="text-gray-700">
              Recopilamos y tratamos datos personales de acuerdo con la normativa vigente y únicamente para fines relacionados con la prestación de nuestros servicios.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
              <li>No compartimos tus datos con terceros sin tu consentimiento, salvo obligación legal.</li>
              <li>Puedes ejercer tus derechos de acceso, rectificación y supresión contactándonos.</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gold mb-2">4. Seguridad</h2>
            <p className="text-gray-700">
              Implementamos medidas técnicas y organizativas para proteger tus datos contra accesos no autorizados, pérdida o alteración.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gold mb-2">5. Cambios en la Política</h2>
            <p className="text-gray-700">
              Nos reservamos el derecho de modificar esta política en cualquier momento. Los cambios serán efectivos desde su publicación en la app.
            </p>
            <p className="text-xs text-gray-400 mt-2">Última actualización: 30 de junio de 2025</p>
          </div>
        </div>
      </section>
    </main>
  );
}

