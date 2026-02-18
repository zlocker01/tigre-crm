'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import type { Category } from '@/interfaces/landingPages/Category';
import { Loader2 } from 'lucide-react';
import { galleryItemFormSchema } from '@/schemas/gallerySchemas/galleryItemSchema';
import type { GalleryFormData } from '@/interfaces/galleryItems/GalleryFormData';
import type { GalleryItem } from '@/interfaces/galleryItems/GalleryItem';
import { useEffect, useState } from 'react';

const categories: Category[] = [
  'Clases',
  'Competencias',
  'Graduaciones',
  'Seminarios',
  'Instalaciones',
];

interface EditGalleryItemModalProps {
  item: GalleryItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onItemUpdated: () => void;
}

export default function EditGalleryItemModal({
  item,
  isOpen,
  onOpenChange,
  onItemUpdated,
}: EditGalleryItemModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(galleryItemFormSchema) as any,
    defaultValues: {
      title: item.title,
      description: item.description || '',
      category: item.category as Category,
    },
  });

  useEffect(() => {
    setIsMounted(true);
    // Reset form when item changes
    reset({
      title: item.title,
      description: item.description || '',
      category: item.category as Category,
    });
  }, [item, reset]);

  const onSubmit = async (data: GalleryFormData) => {
    try {
      const response = await fetch(`/api/galleryItems/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
        }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          responseData.error || 'Error al actualizar el ítem',
        );
      }

      toast({
        title: '¡Éxito!',
        description: 'El ítem se ha actualizado correctamente.',
        variant: 'success',
      });

      onItemUpdated();
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Error al actualizar el ítem:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error al actualizar el ítem',
        variant: 'destructive',
      });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar ítem de la galería</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Título (opcional)
            </label>
            <Input
              id="title"
              {...register('title')}
              className={`mt-1 block w-full ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Título del ítem"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción (opcional)
            </label>
            <Textarea
              id="description"
              {...register('description')}
              className="mt-1 block w-full"
              rows={3}
              placeholder="Descripción del ítem"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Categoría
            </label>
            <select
              id="category"
              {...register('category')}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
