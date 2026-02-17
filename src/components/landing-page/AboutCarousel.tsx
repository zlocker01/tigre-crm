'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const aboutImages = [
  {
    src: '/landing-page/about.webp',
    alt: 'servicios de barbería Tlaxcala'
 },
  {
    src: '/landing-page/recepcion.jpg',
    alt: 'tratamientos capilares Tlaxcala',
  },
];

export default function AboutCarousel() {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % aboutImages.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + aboutImages.length) % aboutImages.length
    );
  };

  useEffect(() => {
    const timer = setTimeout(nextImage, 4000);
    return () => clearTimeout(timer);
  }, [currentImage]);

  return (
    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          className="w-full h-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={aboutImages[currentImage].src}
            alt={aboutImages[currentImage].alt}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <button
        type="button"
        onClick={prevImage}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Imagen anterior"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={nextImage}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Siguiente imagen"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
