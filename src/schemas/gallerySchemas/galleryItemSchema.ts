import * as z from 'zod';

export const galleryItemFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.enum([
    'Clases',
    'Competencias',
    'Graduaciones',
    'Seminarios',
    'Instalaciones',
  ]),
  image: z.string().min(1, 'La imagen es requerida').optional(),
  landing_page_id: z
    .string()
    .min(1, 'El ID de la página es requerido')
    .optional(),
});

export type GalleryFormData = z.infer<typeof galleryItemFormSchema>;
