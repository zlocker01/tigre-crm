'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Promotion } from '@/interfaces/promotions/Promotion';
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
import { Loader2, CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { es } from 'date-fns/locale';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export const promotionFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0'),
  discount_price: z.coerce
    .number()
    .min(0, 'El precio con descuento debe ser mayor o igual a 0'),
  valid_until: z.date({
    required_error: 'La fecha de vencimiento es requerida',
  }),
});

type PromotionFormData = z.infer<typeof promotionFormSchema>;

interface EditPromotionModalProps {
  promotion: Promotion;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPromotionUpdated: () => void;
}

export function EditPromotionModal({
  promotion,
  isOpen,
  onOpenChange,
  onPromotionUpdated,
}: EditPromotionModalProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      title: promotion.title,
      description: promotion.description || '',
      price: promotion.price,
      discount_price: promotion.discount_price,
      valid_until: new Date(promotion.valid_until),
    },
  });

  // Watch for price changes to validate discount
  const price = form.watch('price');
  const discountPrice = form.watch('discount_price');

  useEffect(() => {
    // Reset form when promotion changes
    form.reset({
      title: promotion.title,
      description: promotion.description || '',
      price: promotion.price,
      discount_price: promotion.discount_price,
      valid_until: new Date(promotion.valid_until),
    });
  }, [promotion, form]);

  const onSubmit = async (data: PromotionFormData) => {
    if (data.discount_price >= data.price) {
      toast({
        title: 'Error',
        description:
          'El precio con descuento debe ser menor al precio original',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`/api/promotions/${promotion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          valid_until: data.valid_until.toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar la promoción');
      }

      toast({
        title: '¡Éxito!',
        description: 'La promoción se ha actualizado correctamente.',
        variant: 'success',
      });

      onPromotionUpdated();
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating promotion:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar la promoción',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Promoción</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Título de la promoción"
                      {...field}
                      className={
                        form.formState.errors.title ? 'border-red-500' : ''
                      }
                    />
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
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción de la promoción"
                      className="min-h-[100px]"
                      {...field}
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
                    <FormLabel>Precio Original ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        className={
                          form.formState.errors.price ? 'border-red-500' : ''
                        }
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
                    <FormLabel>Precio con Descuento ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        className={
                          form.formState.errors.discount_price
                            ? 'border-red-500'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                    {price > 0 && discountPrice > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        Ahorra{' '}
                        {Math.round(((price - discountPrice) / price) * 100)}%
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
                  <FormLabel>Válido hasta</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, 'PPP', { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
