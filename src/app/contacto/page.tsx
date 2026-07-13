import { Title } from '@/components/navegation/Title';
import ContactForm from '@/components/landing-page/ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contáctanos para información de horarios, clases y precios en Brotherhood 33 AV (Apizaco, Tlaxcala).',
  alternates: {
    canonical: '/contacto',
  },
};

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <Title text={'Contacto'} />
      <ContactForm />
    </div>
  );
};

export default page;
