import { z } from 'zod';

export const serviceCategories = [
  'Clases',
  'Competencias',
  'Graduaciones',
  'Seminarios',
] as const;

export const promotionItemSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(100, 'El título no puede exceder los 100 caracteres'),
  image: z.string().min(1, 'La imagen es requerida'),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(500, 'La descripción no puede exceder los 500 caracteres'),
  price: z.number().positive('El precio debe ser un número positivo'),
  discount_price: z
    .number()
    .positive('El precio de descuento debe ser un número positivo'),
  valid_until: z.string().min(1, 'La fecha de vencimiento es requerida'),
  category: z.enum(serviceCategories, {
    required_error: 'Por favor selecciona una categoría',
  }),
  duration_minutes: z
    .number()
    .min(10, 'La duración debe ser de al menos 10 minutos')
    .max(1440, 'La duración no puede ser mayor a 24 horas')
    .optional()
    .nullable(),
});

export const PromotionFormSchema = z.object({
  items: z.array(promotionItemSchema),
});

export type PromotionFormData = z.infer<typeof PromotionFormSchema>;
export type PromotionItemData = z.infer<typeof promotionItemSchema>;

// New schema for the entire LandingPromotionEditor form
export const landingPromotionEditorFormSchema = z.object({
  title: z
    .string()
    .max(150, 'El título principal no puede exceder los 150 caracteres')
    .optional(),
  description: z
    .string()
    .max(500, 'La descripción principal no puede exceder los 500 caracteres')
    .optional(),
  items: z.array(promotionItemSchema), // Array of promotion items
});

export type LandingPromotionEditorFormData = z.infer<
  typeof landingPromotionEditorFormSchema
>;
