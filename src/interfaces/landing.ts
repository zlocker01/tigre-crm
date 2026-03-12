import { z } from "zod";

export const galleryItemSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  image: z.string().url("Debe ser una URL válida"),
  category: z.string().min(1, "La categoría es obligatoria"),
  is_before_after: z.boolean().optional(),
  landing_page_id: z.number().optional(),
});

export const galleryFormSchema = z.object({
  items: z.array(galleryItemSchema),
});

export type GalleryItem = z.infer<typeof galleryItemSchema>;
export type GalleryFormData = z.infer<typeof galleryFormSchema>;

export interface PromotionsContent {}
export interface FaqContent {}
export interface FeatureItem {}
export interface HeroContent {}
export interface AboutContent {}
export interface GalleryContent {}
export interface ContactContent {}
