import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { Appointment } from "@/interfaces/appointments/Appointment";

type CreateAppointmentData = Omit<Appointment, "id" | "created_at" | "user_id">;

export const createAppointment = async (
  data: CreateAppointmentData,
): Promise<Appointment> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    throw new Error("User ID not found, cannot create appointment.");
  }

  const appointmentData = {
    ...data,
    user_id: userId,
  };

  const { data: newAppointment, error } = await supabase
    .from("class_sessions")
    .insert([appointmentData])
    .select("*")
    .single();

  if (error) {
    console.error("Error creating appointment in DB:", error.message);
    throw new Error(`Supabase error: ${error.message}`);
  }

  if (!newAppointment) {
    throw new Error("Appointment data was not returned after creation.");
  }

  return newAppointment;
};
