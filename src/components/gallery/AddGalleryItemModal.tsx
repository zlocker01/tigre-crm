'use client';

import type { ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import type { Category } from '@/interfaces/landingPages/Category';
import { Loader2, Upload } from 'lucide-react';
import { galleryItemFormSchema } from '@/schemas/gallerySchemas/galleryItemSchema';
import type { GalleryFormData } from '@/interfaces/galleryItems/GalleryFormData';

const categories: Category[] = [
  'Clases',
  'Competencias',
  'Graduaciones',
  'Seminarios',
  'Instalaciones',
];

export default function AddGalleryItemModal({
  landingId,
}: {
  landingId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(galleryItemFormSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      image: '',
      category: categories[0],
      landing_page_id: landingId,
    },
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Mostrar vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir el archivo a Supabase Storage
    try {
      setIsUploading(true);

      const cleanName = file.name.replace(/\s+/g, '-').toLowerCase();
      const fileName = `landing/${landingId}/gallery/${Date.now()}-${cleanName}`;

      // Subir el archivo al bucket 'landing-images'
      const { error: uploadError } = await supabase.storage
        .from('landing-images')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obtener la URL pública
      const { data: urlData } = supabase.storage
        .from('landing-images')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Establecer la URL en el formulario
      setValue('image', publicUrl);

      toast({
        title: 'Imagen cargada',
        description: 'La imagen se ha subido correctamente.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (formData: GalleryFormData) => {
    try {
      console.log('Enviando datos:', formData);

      const response = await fetch('/api/galleryItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          landing_page_id: landingId,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Error al crear el ítem');
      }

      toast({
        title: '¡Éxito!',
        description: 'El ítem se ha creado correctamente.',
        variant: 'success',
      });

      // Resetear el formulario
      reset();
      setPreviewUrl(null);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error al guardar el ítem:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo crear el ítem. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Agregar Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar nuevo item a la galería</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Título (opcional)
            </label>
            <Input id="title" {...register('title')} className="mt-1" />
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
              className="mt-1"
              rows={3}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      className="mx-auto h-40 w-auto object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={triggerFileInput}
                      disabled={isUploading}
                    >
                      Cambiar imagen
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <Button
                        type="button"
                        variant="link"
                        className="font-medium text-blue-600 hover:text-blue-500"
                        onClick={triggerFileInput}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Subiendo...
                          </>
                        ) : (
                          'Sube una imagen'
                        )}
                      </Button>
                      <p className="pl-1">o arrástrala aquí</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF hasta 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.image.message}
              </p>
            )}
            <input type="hidden" {...register('image')} />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting || isUploading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
