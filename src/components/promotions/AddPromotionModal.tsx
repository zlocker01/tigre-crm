'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2, Upload, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { promotionItemSchema } from '@/schemas/promotionSchemas/promotionSchema';
import type { Promotion } from '@/interfaces/promotions/Promotion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// Eliminamos las importaciones de funciones de servidor y usaremos fetch API

export type PromotionFormData = z.infer<typeof promotionItemSchema>;

interface AddPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion?: Promotion;
  landingId?: string;
  onPromotionAdded?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function AddPromotionModal({
  isOpen,
  onClose,
  promotion,
  landingId,
  onPromotionAdded,
  onOpenChange,
}: AddPromotionModalProps) {
  const isEditing = !!promotion;
  const { toast } = useToast();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionItemSchema),
    defaultValues: isEditing
      ? {
          title: promotion.title,
          description: promotion.description,
          price: promotion.price,
          discount_price: promotion.discount_price,
          valid_until: new Date(promotion.valid_until).toISOString(),
          image: promotion.image,
        }
      : {
          title: '',
          description: '',
          price: 0,
          discount_price: 0,
          valid_until: new Date().toISOString(),
          image: '',
        },
  });

  const price = form.watch('price') || 0;
  const discountPrice = form.watch('discount_price') || 0;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      // Crear un nombre de archivo limpio para evitar problemas
      const cleanName = file.name.replace(/\s+/g, '-').toLowerCase();
      const fileName = `landing/${landingId}/promotions/${Date.now()}-${cleanName}`;

      // Subir el archivo al bucket 'landing-images' en Supabase
      const { error: uploadError } = await supabase.storage
        .from('landing-images')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obtener la URL pública del archivo
      const { data: urlData } = supabase.storage
        .from('landing-images')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Establecer la URL en el formulario
      form.setValue('image', publicUrl, { shouldValidate: true });

      toast({
        title: 'Imagen subida',
        description: 'La imagen se ha subido correctamente.',
        variant: 'success',
      });

      return publicUrl;
    } catch (error) {
      setPreviewUrl(null);
      form.setValue('image', '', { shouldValidate: true });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast({
        title: 'Error de carga',
        description: `Error al subir la imagen: ${
          error instanceof Error ? error.message : 'Error desconocido'
        }`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      form.setValue('image', '', { shouldValidate: true });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // En lugar de usar startUpload, usamos nuestra función personalizada
    await handleFileUpload(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    form.setValue('image', '', { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: PromotionFormData) => {
    try {
      if (!data.image) {
        toast({
          title: 'Error de validación',
          description: 'Por favor, sube una imagen para la promoción.',
          variant: 'destructive',
        });
        return;
      }

      const promotionData = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        discount_price: Number(data.discount_price),
        valid_until: new Date(data.valid_until).toISOString(),
        image: data.image,
        landing_page_id: landingId,
      };

      if (isEditing && promotion) {
        // Actualizar usando la API
        const response = await fetch(`/api/promotions/${promotion.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(promotionData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Error al actualizar la promoción',
          );
        }

        toast({
          title: 'Promoción actualizada',
          description: 'La promoción se ha actualizado con éxito.',
          variant: 'success',
        });
      } else {
        // Crear usando la API
        const response = await fetch('/api/promotions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(promotionData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al crear la promoción');
        }

        toast({
          title: 'Promoción añadida',
          description: 'La promoción se ha añadido con éxito.',
          variant: 'success',
        });
      }

      if (onPromotionAdded) {
        onPromotionAdded();
      }

      form.reset({
        title: '',
        description: '',
        price: 0,
        discount_price: 0,
        valid_until: new Date().toISOString(),
        image: '',
      });
      setPreviewUrl(null);
      onClose();
    } catch (error) {
      toast({
        title: 'Error al guardar',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo guardar la promoción.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (promotion) {
      form.reset({
        title: promotion.title,
        description: promotion.description,
        price: promotion.price,
        discount_price: promotion.discount_price,
        valid_until: new Date(promotion.valid_until).toISOString(),
        image: promotion.image,
      });
      setPreviewUrl(promotion.image || null);
    } else {
      form.reset({
        title: '',
        description: '',
        price: 0,
        discount_price: 0,
        valid_until: new Date().toISOString(),
        image: '',
      });
      setPreviewUrl(null);
    }
  }, [promotion, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange || onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Promoción' : 'Añadir Nueva Promoción'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edita los detalles de la promoción.'
              : 'Añade una nueva promoción a tu lista.'}
          </DialogDescription>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form
              id="promotion-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Corte de Verano" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe la promoción"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio Original</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          value={field.value ?? 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio con Descuento</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          value={field.value ?? 0}
                        />
                      </FormControl>
                      <FormMessage />
                      {price > 0 &&
                        discountPrice > 0 &&
                        discountPrice < price && (
                          <p className="text-sm text-green-600 mt-1">
                            Descuento:{' '}
                            {Math.round(
                              ((price - discountPrice) / price) * 100,
                            )}
                            %
                          </p>
                        )}
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="valid_until"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Vencimiento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Elige una fecha</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen</FormLabel>
                    <FormControl>
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        {previewUrl ? (
                          <div className="relative mt-2 w-full h-48">
                            <img
                              src={previewUrl}
                              alt="Vista previa"
                              className="absolute inset-0 h-full w-full rounded-md object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 rounded-full h-8 w-8"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="mt-2 w-full border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors flex flex-col items-center justify-center space-y-2 min-h-[12rem]"
                            onClick={triggerFileInput}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">
                                  Subiendo imagen...
                                </p>
                              </>
                            ) : (
                              <>
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Haz clic para subir una imagen
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG, JPEG (máx. 5MB)
                                </p>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="mt-4 flex justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={form.formState.isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="promotion-form"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : isEditing ? (
              'Actualizar Promoción'
            ) : (
              'Crear Promoción'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
