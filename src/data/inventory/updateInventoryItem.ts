import { createClient } from '@/utils/supabase/server';
import type { InventoryItem } from '@/interfaces/inventory/InventoryItem';

export type UpdateInventoryItemInput = Partial<
  Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>
>;

export const updateInventoryItem = async (
  id: number,
  payload: UpdateInventoryItemInput,
): Promise<{ data: InventoryItem | null; error?: string; code?: string }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inventory')
    .update({
      ...payload,
      ...(payload.name ? { item_name: payload.name } : {}),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating inventory item:', error.message);
    return { data: null, error: error.message, code: (error as any).code };
  }

  return { data: data as InventoryItem };
};
