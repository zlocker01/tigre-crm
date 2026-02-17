-- Eliminar la restricción existente
ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_item_type_check;

-- Actualizar registros existentes (si hay 'medication' cambiarlo a 'cosmetic_product')
UPDATE inventory SET item_type = 'cosmetic_product' WHERE item_type = 'medication';

-- Agregar la nueva restricción
ALTER TABLE inventory ADD CONSTRAINT inventory_item_type_check 
CHECK (item_type IN ('consumable', 'instrument', 'equipment', 'cosmetic_product'));
