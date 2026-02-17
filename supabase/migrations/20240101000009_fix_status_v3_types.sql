-- SOLUCIÓN AL ERROR DE TIPOS (TEXT vs BOOLEAN)
-- Este script es seguro para ejecutar incluso si is_active es texto o booleano.

-- 1. Crear la columna 'status' si no existe
ALTER TABLE clients ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 2. Migrar datos con conversión explícita a texto (::text)
-- Esto soluciona el error "operator does not exist: text = boolean"
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'is_active') THEN
        -- Convertimos el valor a texto antes de comparar, cubriendo ambos casos ('true' texto o true booleano)
        UPDATE clients SET status = 'active' WHERE is_active::text = 'true';
        UPDATE clients SET status = 'inactive' WHERE is_active::text = 'false';
    END IF;
END $$;

-- 3. Definir los valores permitidos
ALTER TABLE clients DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE clients ADD CONSTRAINT valid_status 
CHECK (status IN ('active', 'pending_payment', 'suspended', 'paused', 'trial', 'injured', 'inactive'));

-- 4. (Opcional) Limpiar columna antigua
-- ALTER TABLE clients DROP COLUMN IF EXISTS is_active;
