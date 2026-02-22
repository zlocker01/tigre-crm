import { createClient } from "@/utils/supabase/server";
import type { Promotion } from "@/interfaces/promotions/Promotion";

export async function updatePromotion(
  id: number,
  promotionData: Partial<Omit<Promotion, "id" | "user_id">>,
): Promise<string | null> {
  try {
    // Validar que el ID sea un número válido
    if (!id || isNaN(Number(id))) {
      console.error("ID de promoción no válido:", id);
      return "ID de promoción no válido";
    }

    // Validar campos requeridos
    if (promotionData.title && !promotionData.title.trim()) {
      return "El título no puede estar vacío";
    }

    const supabase = await createClient();

    // Verificar si el usuario está autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error(
        "Error de autenticación:",
        authError?.message || "Usuario no autenticado",
      );
      return "No autorizado para actualizar el servicio";
    }

    // Create an update object with only the fields that are provided
    const updateObject: any = {};
    
    // Only include fields that are explicitly provided in promotionData
    if (promotionData.title !== undefined) updateObject.title = promotionData.title;
    if (promotionData.description !== undefined) updateObject.description = promotionData.description;
    if (promotionData.price !== undefined) updateObject.price = Number(promotionData.price);
    if (promotionData.discount_price !== undefined) updateObject.discount_price = Number(promotionData.discount_price);
    if (promotionData.valid_until !== undefined) updateObject.valid_until = promotionData.valid_until;
    if (promotionData.active !== undefined) updateObject.active = promotionData.active;
    
    // Check if we have any fields to update
    if (Object.keys(updateObject).length === 0) {
      return "No se proporcionaron campos para actualizar";
    }
    
    const { data, error } = await supabase
      .from("promotions")
      .update(updateObject)
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      return `Error al actualizar la promoción: ${error.message}`;
    }

    if (!data) {
      return "No se encontró la promoción o no se pudo actualizar";
    }

    return data.id.toString();
  } catch (error) {
    console.error("Error inesperado al actualizar la promoción:", error);
    return "Error inesperado al actualizar la promoción";
  }
}
