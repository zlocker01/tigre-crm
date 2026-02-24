import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { Appointment } from "@/interfaces/appointments/Appointment";

export const getAppointments = async (): Promise<Appointment[] | undefined> => {
  const supabase = await createClient();
  // const userId = await getUserId(); // Permitir acceso público para ver disponibilidad

  const { data, error } = await supabase.from("class_sessions").select("*");

  if (error) {
    console.error("Error fetching appointments:", error.message);
    return undefined;
  }

  return data as Appointment[];
};
