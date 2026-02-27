'use client';

import { Accordion } from '@/components/ui/accordion';
import { LandingContactEditor } from './landing-contact-editor';
import { LandingFaqEditor } from './landing-faq-editor';
import { LandingHeroEditor } from './landing-hero-editor';
import { LandingAboutEditor } from './landing-about-editor';
import { LandingGalleryEditor } from './landing-gallery-editor';
import { LandingEventsEditor } from './landing-events-editor';
import { LandingJobBannerEditor } from './landing-job-banner-editor';

interface LandingEditorProps {
  content: any; // El objeto content completo recibido del cliente
  onChange: (content: any) => void;
  landing_id: string;
}

export function LandingEditor({
  content,
  onChange,
  landing_id,
}: LandingEditorProps) {
  if (!landing_id) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-xl shadow-lg">
        <p>Error: Por favor, recarga la página o vuelve a intentarlo.</p>
      </div>
    );
  }

  const handleHeroChange = (
    field: string,
    value: string | File | undefined,
  ) => {
    onChange({
      ...content, // Mantener el resto del contenido
      hero: {
        ...content.hero,
        [field]: value,
      },
    });
  };

  // Función para manejar la carga de archivos (puede ser genérica si se usa en varios editores)
  const handleFileUpload = (file: File, callback: (value: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        callback(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="dark:to-black rounded-xl shadow-lg">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {/* Hero Section */}
        <LandingHeroEditor
          heroContent={content.hero}
          onChange={handleHeroChange}
          handleFileUpload={handleFileUpload}
          landing_id={landing_id}
        />

        {/* About Section */}
        <LandingAboutEditor
          aboutContent={content.about}
          landing_id={landing_id}
        />

        {/* Events Section */}
        <LandingEventsEditor landing_id={landing_id} />

        {/* Job Banner Section */}
        <LandingJobBannerEditor
          jobBannerContent={content.jobBanner}
          landing_id={landing_id}
        />

        {/* Contact Section */}
        <LandingContactEditor
          contactContent={content.contact}
          landing_id={landing_id}
        />

        <LandingFaqEditor
          faqContent={content.faq?.items}
          onChange={(newFaqContent) =>
            onChange({
              ...content,
              faq: { ...content.faq, items: newFaqContent },
            })
          }
          landing_id={landing_id}
        />
      </Accordion>
    </div>
  );
}
