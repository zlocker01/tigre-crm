import { createClient } from "@/utils/supabase/server";
import type { Package } from "@/interfaces/packages/Package";

interface CreatePackageResult {
  id?: number;
  error?: string;
}

export const createPackage = async (
  packageData: Omit<Package, "id" | "created_at">,
): Promise<CreatePackageResult> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("packages")
      .insert([packageData])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating package:", error);
      return { error: error.message || "No se pudo crear el paquete." };
    }

    if (!data || typeof data.id !== "number") {
      console.error("Unexpected insert response when creating package:", data);
      return { error: "Respuesta inválida al crear el paquete." };
    }

    return { id: data.id };
  } catch (error) {
    console.error("Unexpected error creating package:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Error inesperado al crear el paquete.",
    };
  }
};
