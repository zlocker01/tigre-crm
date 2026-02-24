import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { Appointment } from "@/interfaces/appointments/Appointment";

export const getAppointmentById = async (
  id: string,
): Promise<Appointment | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    console.error("User ID not found, cannot fetch appointment.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("class_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching appointment:", error.message);
    return undefined;
  }

  return data as Appointment;
};
