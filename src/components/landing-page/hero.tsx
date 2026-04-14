import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { HeroSection } from '@/interfaces/heroSection/Interface';
import Image from 'next/image';
import GraduationCarousel from './graduationCarousel';

export default function Hero({ data }: { data: HeroSection }) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden mt-24 md:mt-20 bg-background"
    >
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="block text-primary">{data.title}</span>
              <span className="block mt-2">{data.subtitle}</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              {data.text}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              {/* promotions button for graduation session
              <Button size="lg" asChild>
                <Link href="#promotions">Ver Promociones de Graduación
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-mortarboard-fill ml-2" viewBox="0 0 16 16">
                    <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917z" />
                    <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466z" />
                  </svg></Link>
              </Button> */}
              <Button size="lg" asChild>
                <Link href="/citas">Agenda tu cita</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#services">Ver clases</Link>
              </Button>
            </div>
          </div>
          <div className="relative w-full max-w-sm mx-auto lg:max-w-md lg:ml-auto h-72 md:h-80 lg:h-[380px] rounded-2xl overflow-hidden flex items-center justify-center bg-background">
            <Image
              src={data.image || '/placeholder.svg'}
              alt={data.title || 'Imagen principal de JSBJJ MX'}
              width={800}
              height={800}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="max-h-full w-auto object-contain"
            />
            {/* <GraduationCarousel /> */}
          </div>
        </div>
      </div>
    </section>
  );
}
