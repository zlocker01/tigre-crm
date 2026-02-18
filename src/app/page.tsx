import About from '@/components/landing-page/about';
import { Team } from '@/components/landing-page/team';
import Booking from '@/components/landing-page/booking';
import Faq from '@/components/landing-page/faq';
import Gallery from '@/components/landing-page/gallery';
import Hero from '@/components/landing-page/hero';
import JobBanner from '@/components/landing-page/job-banner';
import Promotions from '@/components/landing-page/promotions';
import Location from '@/components/landing-page/location';
import Services from '@/components/landing-page/services';
import WhatsAppButton from '@/components/landing-page/whatsapp-button';
import Header from '@/components/landing-page/header';
import NewsletterModal from '@/components/landing-page/newsletter-modal';
import Footer from '@/components/landing-page/footer';
import { getHeroSection } from '@/data/heroSection/getHeroSection';
import { getLandingId } from '@/data/getLandingId';
import { getAboutSection } from '@/data/aboutSections/getAboutSection';
import { getGalleryItems } from '@/data/galleryItems/getGalleryItems';
import { getContactSections } from '@/data/contactSections/getContactSections';
import { getFaqItems } from '@/data/faqItems/getFaqItems';
import { getJobBannerSections } from '@/data/jobBannerSections/getJobBannerSections';
import { getEmployees } from '@/data/employees/getEmployees';
import { LandingPage } from '@/interfaces/landingPages/LandingPage';
import CookiesModal from '@/components/landing-page/cookiesModal';

export default async function Home() {
  const landingId: string | null = await getLandingId();

  if (!landingId) {
    return (
      <div>
        <p>No se encontró la landing page</p>
      </div>
    );
  }
  // Obtener datos de las secciones (las que devuelven { data, error })
  const [
    { data: heroSection, error: heroError },
    { data: aboutSection, error: aboutError },
    { data: contactSection, error: locationError },
    faqs,
    { data: jobBanner, error: jobBannerError },
    employees,
  ] = await Promise.all([
    getHeroSection(landingId),
    getAboutSection(landingId),
    getContactSections(landingId),
    getFaqItems(landingId),
    getJobBannerSections(landingId),
    getEmployees(),
  ]);

  // Obtener ítems de galería (devuelve solo los datos)
  const galleryItems = await getGalleryItems(landingId);

  // Log de errores
  const errors = [
    { error: heroError, section: 'Hero' },
    { error: aboutError, section: 'About' },
    { error: locationError, section: 'Location' },
    { error: jobBannerError, section: 'JobBanner' },
  ].filter((item) => item.error);

  if (errors.length > 0) {
    console.error('Errores al cargar las secciones:', errors);
  }

  return (
    <>
      <Header />
      <main className="overflow-x-hidden">
        {heroSection && <Hero data={heroSection[0]} />}
        <Services landingId={landingId} />
        {aboutSection && <About data={aboutSection[0]} />}
        <Team data={employees ?? []} />
        <Gallery data={galleryItems ?? []} />
        <Promotions landingId={landingId} />
        <Booking landingId={landingId} />
        {contactSection && <Location data={contactSection[0]} />}
        {faqs && faqs.length > 0 && <Faq data={faqs} />}
        {/* {jobBanner && <JobBanner data={jobBanner[0]} />} */}
        <WhatsAppButton />
        <Footer />
      </main>
      <NewsletterModal landingId={landingId} />
      <CookiesModal />
    </>
  );
}
