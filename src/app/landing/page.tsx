import Hero from '@/components/landing-page/hero';
import Services from '@/components/landing-page/services';
import About from '@/components/landing-page/about';
import Gallery from '@/components/landing-page/gallery';
import Booking from '@/components/landing-page/booking';
import Testimonials from '@/components/landing-page/testimonials';
import Location from '@/components/landing-page/location';
import Faq from '@/components/landing-page/faq';
import Promotions from '@/components/landing-page/promotions';
import JobBanner from '@/components/landing-page/job-banner';
import Events from '@/components/landing-page/events';
import WhatsAppButton from '@/components/landing-page/whatsapp-button';
import { getLandingId } from '@/data/getLandingId';
import { getHeroSection } from '@/data/heroSection/getHeroSection';
import { getAboutSection } from '@/data/aboutSections/getAboutSection';
import { getGalleryItems } from '@/data/galleryItems/getGalleryItems';
import { getContactSections } from '@/data/contactSections/getContactSections';
import { getFaqItems } from '@/data/faqItems/getFaqItems';
import { getJobBannerSections } from '@/data/jobBannerSections/getJobBannerSections';
import NewsletterModal from '@/components/landing-page/newsletter-modal';
import CookiesModal from '@/components/landing-page/cookiesModal';
import { getEvents } from '@/data/events/getEvents';

export default async function Home() {
  const landingId = await getLandingId();
  if (!landingId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">
          Error: No se encontró el ID de la landing page
        </p>
      </div>
    );
  }

  const { data: heroData } = await getHeroSection(landingId);
  const { data: aboutData } = await getAboutSection(landingId);
  const galleryData = await getGalleryItems(landingId);
  const { data: eventsData } = await getEvents(landingId);
  // Corregido: Desestructurar para obtener el array de datos
  const { data: contactData } = await getContactSections(landingId);
  const faqData = await getFaqItems(landingId);
  const { data: jobBannerData } = await getJobBannerSections(landingId);

  if (
    !heroData?.[0] ||
    !aboutData?.[0] ||
    !galleryData ||
    !contactData?.[0] ||
    !faqData ||
    !jobBannerData?.[0]
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">
          Error: No se encontraron los datos de la landing page
        </p>
      </div>
    );
  }

  return (
    <main>
      <Hero data={heroData[0]} />
      <Services landingId={landingId} />
      <About data={aboutData[0]} />
      <Gallery data={galleryData} />
      <Promotions landingId={landingId} />
      <Booking landingId={landingId} />
      <Events data={eventsData || []} />
      <Testimonials />
      <Location data={contactData[0]} />
      <Faq data={faqData} />
      <JobBanner data={jobBannerData[0]} />
      <WhatsAppButton />
      <NewsletterModal landingId={landingId} />
      <CookiesModal />
    </main>
  );
}
