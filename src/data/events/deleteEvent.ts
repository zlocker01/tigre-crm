import { createClient } from "@/utils/supabase/server";

export const deleteEvent = async (
  eventId: string,
): Promise<{ error: string | null }> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) {
    console.error("Error deleting event:", error.message);
    return { error: error.message };
  }

  return { error: null };
};
