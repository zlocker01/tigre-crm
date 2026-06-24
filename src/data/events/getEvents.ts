import { createClient } from '@/utils/supabase/server';
import type { EventItem } from '@/interfaces/events/EventItem';
import { unstable_noStore as noStore } from 'next/cache';

export const getEvents = async (
  landingId: string,
): Promise<{ data: EventItem[] | null; error: string | null }> => {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('landing_id', landingId)
    .order('created_at', { ascending: false });

  if (error) {
    if (error.message.includes("Could not find the table 'public.events'")) {
      console.warn(
        'La tabla public.events no existe todavia. Se devolvera una lista vacia.',
      );
      return { data: [], error: null };
    }

    console.error('Error fetching events:', error.message);
    return { data: null, error: error.message };
  }

  // Si no existe la columna is_active (por si acaso no se corrió la migración), asignar true por defecto
  const processedData = data?.map((event: any) => ({
    ...event,
    is_active: event.is_active ?? true,
  })) as EventItem[];

  return { data: processedData, error: null };
};
