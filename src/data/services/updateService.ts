import { createClient } from '@/utils/supabase/server';
import type { Service } from '@/interfaces/services/Service';

export async function updateService(
  id: number,
  serviceData: Partial<Omit<Service, 'id' | 'user_id'>>,
): Promise<string | null> {
  try {
    // Validar que el ID sea un número válido
    if (!id || isNaN(Number(id))) {
      console.error('ID de servicio no válido:', id);
      return 'ID de servicio no válido';
    }

    // Validar campos requeridos
    if (serviceData.title && !serviceData.title.trim()) {
      return 'El título no puede estar vacío';
    }

    const supabase = await createClient();

    // Verificar si el usuario está autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error(
        'Error de autenticación:',
        authError?.message || 'Usuario no autenticado',
      );
      return 'No autorizado para actualizar el servicio';
    }

    const { data, error } = await supabase
      .from('services')
      .update({
        title: serviceData.title,
        description: serviceData.description || null,
        image: serviceData.image || null,
        level: serviceData.level,
        benefits: serviceData.benefits || [],
      })
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) {
      return `Error al actualizar el servicio: ${error.message}`;
    }

    if (!data) {
      return 'No se encontró el servicio o no se pudo actualizar';
    }

    return data.id.toString();
  } catch (error) {
    console.error('Error inesperado al actualizar el servicio:', error);
    return 'Error inesperado al actualizar el servicio';
  }
}
