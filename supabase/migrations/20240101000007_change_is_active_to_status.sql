-- Migration to replace is_active boolean with status text

-- 1. Add new status column
ALTER TABLE clients ADD COLUMN status TEXT DEFAULT 'active';

-- 2. Migrate existing data
-- is_active = true -> 'active'
-- is_active = false -> 'inactive' (or 'suspended' depending on interpretation, but 'inactive' matches "Baja definitiva" which is the closest boolean false equivalent usually)
UPDATE clients SET status = 'active' WHERE is_active = true;
UPDATE clients SET status = 'inactive' WHERE is_active = false;

-- 3. Drop old column
ALTER TABLE clients DROP COLUMN is_active;

-- 4. Add check constraint to ensure valid values (optional but recommended)
ALTER TABLE clients ADD CONSTRAINT valid_status CHECK (status IN ('active', 'pending_payment', 'suspended', 'paused', 'trial', 'injured', 'inactive'));
