export const dynamic = 'force-static';

import { Title } from '@/components/navegation/Title';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso de Privacidad',
  description:
    'Consulta el aviso de privacidad y el tratamiento de datos personales de Brotherhood 33 AV.',
  alternates: {
    canonical: '/privacidad',
  },
};

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <Title text={'Aviso de Privacidad'} />
    </div>
  );
};

export default page;
