"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Trash } from "lucide-react";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { galleryFormSchema } from "@/interfaces/landing";
import type {
  GalleryFormData,
  GalleryItem,
} from "@/interfaces/landing";

interface LandingGalleryEditorProps {
  galleryContent: GalleryFormData;
  onChange: (data: GalleryFormData) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, fieldName: any) => void;
}

export function LandingGalleryEditor({
  galleryContent,
  onChange,
  handleFileUpload,
}: LandingGalleryEditorProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<GalleryFormData>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: galleryContent,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: GalleryFormData) => {
    try {
      onChange(data);
      console.log("Formulario enviado:", data);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const onError = (errors: any) => {
    console.log("Errores de validación:", errors);
  };

  const addGalleryItem = () => {
    const newItem: GalleryItem = {
      title: "Nuevo Título de Galería",
      description: "Nueva Descripción de Galería",
      image: "",
      category: "General",
      is_before_after: false,
    };
    append(newItem);
  };

  const removeGalleryItem = (index: number) => {
    remove(index);
  };

  return (
    <AccordionItem
      value="gallery"
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
        Sección de Galería
      </AccordionTrigger>
      <AccordionContent className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30">
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Elemento de Galería {index + 1}</h4>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeGalleryItem(index)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`items[${index}].title`}>Título</Label>
                  <Input
                    id={`items[${index}].title`}
                    {...register(`items.${index}.title` as const)}
                    placeholder="Ej. Corte de Pelo Moderno"
                  />
                  {errors.items?.[index]?.title && (
                    <p className="text-sm text-red-500">{errors.items[index]?.title?.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`items[${index}].category`}>Categoría</Label>
                  <Input
                    id={`items[${index}].category`}
                    {...register(`items.${index}.category` as const)}
                    placeholder="Ej. Cabello"
                  />
                  {errors.items?.[index]?.category && (
                    <p className="text-sm text-red-500">{errors.items[index]?.category?.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items[${index}].description`}>Descripción</Label>
                <Textarea
                  id={`items[${index}].description`}
                  {...register(`items.${index}.description` as const)}
                  placeholder="Describe el trabajo realizado..."
                  className="min-h-[100px]"
                />
                {errors.items?.[index]?.description && (
                  <p className="text-sm text-red-500">{errors.items[index]?.description?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items[${index}].image`}>Imagen</Label>
                <Input
                  id={`items[${index}].image`}
                  type="file"
                  onChange={(e) => handleFileUpload(e, `items.${index}.image`)}
                />
                {errors.items?.[index]?.image && (
                  <p className="text-sm text-red-500">{errors.items[index]?.image?.message}</p>
                )}
              </div>

            </div>
          ))}

          <div className="flex justify-between mt-4">
            <Button type="button" onClick={addGalleryItem} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Añadir Elemento a la Galería
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios en Galería
            </Button>
          </div>
        </form>
      </AccordionContent>
    </AccordionItem>
  );
}
