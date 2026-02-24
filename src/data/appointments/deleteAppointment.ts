import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";

export const deleteAppointment = async (id: string): Promise<boolean> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    console.error("User ID not found, cannot delete appointment.");
    return false;
  }

  const { error } = await supabase.from("class_sessions").delete().eq("id", id);

  if (error) {
    console.error("Error deleting appointment:", error.message);
    return false;
  }

  return true;
};
