-- Align inventory schema with the current frontend module and make policies explicit.

ALTER TABLE public.inventory
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS unit text,
  ADD COLUMN IF NOT EXISTS minimum_stock numeric,
  ADD COLUMN IF NOT EXISTS expiration_date date,
  ADD COLUMN IF NOT EXISTS batch_number text,
  ADD COLUMN IF NOT EXISTS supplier text,
  ADD COLUMN IF NOT EXISTS unit_cost numeric,
  ADD COLUMN IF NOT EXISTS estimated_price numeric,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS status text,
  ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now(),
  ADD COLUMN IF NOT EXISTS category text;

UPDATE public.inventory
SET
  name = COALESCE(name, item_name),
  item_name = COALESCE(item_name, name),
  minimum_stock = COALESCE(minimum_stock, reorder_level),
  unit_cost = COALESCE(unit_cost, unit_price),
  updated_at = COALESCE(updated_at, last_updated, now()),
  created_at = COALESCE(created_at, last_updated, now()),
  status = COALESCE(
    status,
    CASE
      WHEN COALESCE(quantity, 0) <= 0 THEN 'out_of_stock'
      ELSE 'available'
    END
  ),
  category = COALESCE(category, 'General'),
  location = COALESCE(location, 'Bodega');

UPDATE public.inventory
SET item_type = CASE item_type
  WHEN 'instrument' THEN 'equipment'
  WHEN 'cosmetic_product' THEN 'consumable'
  WHEN 'medication' THEN 'supplement'
  ELSE item_type
END
WHERE item_type IN ('instrument', 'cosmetic_product', 'medication');

ALTER TABLE public.inventory
  DROP CONSTRAINT IF EXISTS inventory_item_type_check;

ALTER TABLE public.inventory
  ADD CONSTRAINT inventory_item_type_check
  CHECK (item_type IN ('consumable', 'equipment', 'apparel', 'supplement'));

ALTER TABLE public.inventory
  DROP CONSTRAINT IF EXISTS inventory_status_check;

ALTER TABLE public.inventory
  ADD CONSTRAINT inventory_status_check
  CHECK (status IN ('available', 'out_of_stock', 'in_use', 'maintenance', 'expired'));

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.inventory;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.inventory;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.inventory;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.inventory;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.inventory;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.inventory;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.inventory;
DROP POLICY IF EXISTS "Policy with table joins" ON public.inventory;

CREATE POLICY "Inventory read for staff"
  ON public.inventory
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = ANY (ARRAY['admin', 'empleado'])
    )
  );

CREATE POLICY "Inventory insert for staff"
  ON public.inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = ANY (ARRAY['admin', 'empleado'])
    )
  );

CREATE POLICY "Inventory update for staff"
  ON public.inventory
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = ANY (ARRAY['admin', 'empleado'])
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = ANY (ARRAY['admin', 'empleado'])
    )
  );

CREATE POLICY "Inventory delete for admin"
  ON public.inventory
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = 'admin'
    )
  );
