'use client';

import React, { useId } from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash, Upload } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  landingPromotionEditorFormSchema,
  PromotionItemData,
  type LandingPromotionEditorFormData,
} from '@/schemas/promotionSchemas/promotionSchema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

interface LandingPromotionEditorProps {
  promotionContent: LandingPromotionEditorFormData;
  onChange: (data: LandingPromotionEditorFormData) => void;
  handleFileUpload: (file: File, callback: (value: string) => void) => void;
}

export default function LandingPromotionEditor({
  promotionContent,
  onChange,
  handleFileUpload,
}: LandingPromotionEditorProps) {
  const baseId = useId();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LandingPromotionEditorFormData>({
    resolver: zodResolver(landingPromotionEditorFormSchema),
    defaultValues: {
      title: promotionContent.title || '',
      description: promotionContent.description || '',
      items: promotionContent.items || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = (data: LandingPromotionEditorFormData) => {
    onChange(data);
  };

  const handleImageUpload = (file: File, index: number) => {
    handleFileUpload(file, (url) => {
      setValue(`items.${index}.image`, url, { shouldValidate: true });
    });
  };

  const addPromotion = () => {
    const newItem: PromotionItemData = {
      title: 'Nueva Promoción',
      description: 'Descripción de la nueva promoción',
      image: '',
      price: 0,
      discount_price: 0,
      valid_until: new Date().toISOString().split('T')[0],
    };
    append(newItem);
  };

  return (
    <AccordionItem
      value="promotion"
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
        Sección de Promociones
      </AccordionTrigger>
      <AccordionContent className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor={`${baseId}-promotion-title`}
              className="text-sm font-medium"
            >
              Título Principal
            </Label>
            <Input
              id={`${baseId}-promotion-title`}
              {...register('title')}
              className={`rounded-md border ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
            />
            {errors.title && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`${baseId}-promotion-description`}
              className="text-sm font-medium"
            >
              Descripción Principal
            </Label>
            <Textarea
              id={`${baseId}-promotion-description`}
              {...register('description')}
              className={`rounded-md border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
            />
            {errors.description && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Promociones</h3>
              <Button
                type="button"
                onClick={addPromotion}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Promoción
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 dark:border-gray-700 p-4 rounded-md space-y-3 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-purple-600 dark:text-purple-400">
                    Promoción {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8 rounded-full hover:bg-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`${baseId}-${field.id}-title`}>
                      Título
                    </Label>
                    <Input
                      id={`${baseId}-${field.id}-title`}
                      {...register(`items.${index}.title`)}
                      className={`rounded-md border ${
                        errors.items?.[index]?.title
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
                    />
                    {errors.items?.[index]?.title && (
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        {errors.items[index]?.title?.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor={`${baseId}-${field.id}-description`}>
                    Descripción
                  </Label>
                  <Textarea
                    id={`${baseId}-${field.id}-description`}
                    {...register(`items.${index}.description`)}
                    className={`rounded-md border ${
                      errors.items?.[index]?.description
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
                  />
                  {errors.items?.[index]?.description && (
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      {errors.items[index]?.description?.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <Label htmlFor={`${baseId}-${field.id}-price`}>
                      Precio
                    </Label>
                    <Input
                      id={`${baseId}-${field.id}-price`}
                      type="number"
                      {...register(`items.${index}.price`)}
                      className={`rounded-md border ${
                        errors.items?.[index]?.price
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
                    />
                    {errors.items?.[index]?.price && (
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        {errors.items[index]?.price?.message}
                      </p>
                    )}
                  </div>

                  {/* Discount Price */}
                  <div>
                    <Label htmlFor={`${baseId}-${field.id}-discount_price`}>
                      Precio de Descuento
                    </Label>
                    <Input
                      id={`${baseId}-${field.id}-discount_price`}
                      type="number"
                      {...register(`items.${index}.discount_price`)}
                      className={`rounded-md border ${
                        errors.items?.[index]?.discount_price
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
                    />
                    {errors.items?.[index]?.discount_price && (
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        {errors.items[index]?.discount_price?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`${baseId}-${field.id}-valid_until`}>
                      Válido Hasta
                    </Label>
                    <Input
                      id={`${baseId}-${field.id}-valid_until`}
                      type="date"
                      {...register(`items.${index}.valid_until`)}
                      className={`rounded-md border ${
                        errors.items?.[index]?.valid_until
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
                    />
                    {errors.items?.[index]?.valid_until && (
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        {errors.items[index]?.valid_until?.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <FormField
                  control={control}
                  name={`items.${index}.image`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <div className="relative w-full">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  const file = e.target.files[0];
                                  // You might want to upload the file here and get a URL
                                  // For now, we'll use a data URL for preview
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    field.onChange(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:bg-gray-800 dark:text-gray-200 rounded-md"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <Upload className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          {field.value && (
                            <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-300 dark:border-gray-700 shadow-sm">
                              <img
                                src={field.value}
                                alt={`Promoción ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? 'opacity-50' : ''
              } bg-green-600 hover:bg-green-700 text-white font-medium`}
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar Sección'}
            </Button>
          </div>
        </form>
      </AccordionContent>
    </AccordionItem>
  );
}
