import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { Appointment } from "@/interfaces/appointments/Appointment";

type UpdateAppointmentData = Partial<
  Omit<Appointment, "id" | "created_at" | "user_id">
>;

export const updateAppointment = async (
  id: string,
  data: UpdateAppointmentData,
): Promise<Appointment | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    console.error("User ID not found, cannot update appointment.");
    return undefined;
  }

  const { data: updatedAppointment, error } = await supabase
    .from("class_sessions")
    .update(data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating appointment:", error.message);
    return undefined;
  }

  return updatedAppointment as Appointment;
};
