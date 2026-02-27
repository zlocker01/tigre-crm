import { z } from 'zod';

export const eventSchema = z.object({
  image_url: z.string().url('La URL de la imagen no es válida'),
  is_active: z.boolean().default(true).optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;
