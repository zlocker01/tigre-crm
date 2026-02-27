import { createClient } from "@/utils/supabase/server";
import type { EventItem } from "@/interfaces/events/EventItem";

export const createEvent = async (
  eventData: Omit<EventItem, "id" | "created_at">,
): Promise<{ data: EventItem | null; error: string | null }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .insert([eventData])
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error.message);
    return { data: null, error: error.message };
  }

  return { data: data as EventItem, error: null };
};
