import { createClient } from '@/utils/supabase/server';
import type { InventoryItem } from '@/interfaces/inventory/InventoryItem';

export type CreateInventoryItemInput = Omit<
  InventoryItem,
  'id' | 'created_at' | 'updated_at'
>;

export const createInventoryItem = async (
  payload: CreateInventoryItemInput,
): Promise<{ data: InventoryItem | null; error?: string; code?: string }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inventory')
    .insert({
      ...payload,
      item_name: payload.name,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating inventory item:', error.message);
    return { data: null, error: error.message, code: (error as any).code };
  }

  return { data: data as InventoryItem };
};
