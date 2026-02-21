import { createClient } from '@/utils/supabase/server';
import type { InventoryItem } from '@/interfaces/inventory/InventoryItem';

export const getInventoryItems = async (): Promise<{
  data: InventoryItem[] | null;
  error?: string;
  code?: string;
}> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching inventory items:', error.message);
    return { data: null, error: error.message, code: (error as any).code };
  }

  return { data: data as InventoryItem[] };
};
