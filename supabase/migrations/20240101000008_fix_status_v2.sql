-- IMPORTANTE: Copia y ejecuta este código en el Editor SQL de Supabase Dashboard

-- 1. Añadir columna 'status' si no existe
ALTER TABLE clients ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 2. Migrar datos de la columna antigua 'is_active' a la nueva 'status'
-- (Esto asume que is_active=true es 'active' y false es 'inactive')
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'is_active') THEN
        UPDATE clients SET status = 'active' WHERE is_active = true;
        UPDATE clients SET status = 'inactive' WHERE is_active = false;
    END IF;
END $$;

-- 3. Definir los valores permitidos (Constraint)
ALTER TABLE clients DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE clients ADD CONSTRAINT valid_status 
CHECK (status IN ('active', 'pending_payment', 'suspended', 'paused', 'trial', 'injured', 'inactive'));

-- 4. (Opcional) Limpiar columna antigua para evitar confusiones futuras
-- Descomenta la siguiente línea si quieres borrar is_active permanentemente
-- ALTER TABLE clients DROP COLUMN IF EXISTS is_active;
