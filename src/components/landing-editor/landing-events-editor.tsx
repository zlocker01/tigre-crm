'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, EventFormData } from '@/schemas/eventSchemas/eventSchema';
import { toast } from '../ui/use-toast';
import { createClient } from '@/utils/supabase/client';
import { EventItem } from '@/interfaces/events/EventItem';
import Image from 'next/image';
import { ToggleEventButton } from './toggle-event-button';

interface LandingEventsEditorProps {
  landing_id: string;
}

export function LandingEventsEditor({ landing_id }: LandingEventsEditorProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const imageUrl = watch('image_url');

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/events?landingPageId=${landing_id}`);
      const data = await response.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [landing_id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const cleanName = file.name.replace(/\s+/g, '-').toLowerCase();
      const fileName = `landing/${landing_id}/events/${Date.now()}-${cleanName}`;

      const { error: uploadError } = await supabase.storage
        .from('landing-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('landing-images')
        .getPublicUrl(fileName);

      setValue('image_url', urlData.publicUrl);

      toast({
        title: 'Imagen subida',
        description: 'La imagen está lista para ser guardada.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landing_id,
          image_url: data.image_url,
        }),
      });

      if (!response.ok) throw new Error('Error creating event');

      toast({
        title: 'Evento agregado',
        description: 'El evento se ha agregado correctamente.',
        variant: 'success',
      });

      reset();
      fetchEvents();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el evento.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error deleting event');

      toast({
        title: 'Evento eliminado',
        description: 'El evento se ha eliminado correctamente.',
        variant: 'success',
      });

      fetchEvents();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el evento.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AccordionItem
      value="events"
      className="border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
    >
      <AccordionTrigger className="dark:text-white border px-4 py-3 bg-gold dark:bg-black dark:hover:bg-goldHover transition-colors font-medium">
        Eventos
      </AccordionTrigger>
      <AccordionContent className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Subir Imagen del Evento</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isUploading || isSubmitting || !imageUrl}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Agregar
              </Button>
            </div>
            {isUploading && (
              <p className="text-sm text-blue-500">Subiendo imagen...</p>
            )}
            {errors.image_url && (
              <p className="text-sm text-red-500">{errors.image_url.message}</p>
            )}
          </div>
        </form>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="relative group aspect-[4/5] rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800"
              >
                <Image
                  src={event.image_url}
                  alt="Evento"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No hay eventos cargados aún.
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
