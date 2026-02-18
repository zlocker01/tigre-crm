import { z } from "zod";

const galleryItemSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder los 500 caracteres"),
  image: z
    .string()
    .min(1, "La imagen es requerida")
    .url("La imagen debe ser una URL válida"),
  category: z.enum(["Clases", "Competencias", "Graduaciones", "Seminarios"], {
    errorMap: () => ({ message: "Categoría inválida" }),
  }),
});

export const gallerySchema = z.object({
  items: z
    .array(galleryItemSchema)
    .min(1, "Debe agregar al menos una imagen a la galería"),
});
