export type InventoryItemType =
  | 'consumable'
  | 'instrument'
  | 'equipment'
  | 'apparel';

export type InventoryItemStatus =
  | 'available'
  | 'out_of_stock'
  | 'in_use'
  | 'maintenance'
  | 'expired';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  description?: string;
  item_type: InventoryItemType;
  quantity: number;
  unit?: string;
  minimum_stock?: number;
  expiration_date?: string;
  batch_number?: string;
  supplier?: string;
  unit_cost?: number;
  estimated_price?: number;
  location?: string;
  status: InventoryItemStatus;
  created_at?: string;
  updated_at?: string;
}
