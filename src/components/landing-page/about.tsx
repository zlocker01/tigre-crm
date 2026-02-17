import type { AboutSection } from '@/interfaces/aboutSections/AboutSection';
import AboutCarousel from './AboutCarousel';

export default function About({ data }: { data: AboutSection }) {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* images carusel */}
          <AboutCarousel />
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{data.title}</h2>
            <p className="text-muted-foreground">{data.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
