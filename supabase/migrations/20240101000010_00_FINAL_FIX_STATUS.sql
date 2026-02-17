-- ¡EJECUTA ESTE SCRIPT! ES LA SOLUCIÓN DEFINITIVA

-- 1. Añadir columna status (si no existe)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 2. Migrar datos de forma segura (convirtiendo cualquier tipo a texto primero)
-- Esto arregla el error "operator does not exist: text = boolean"
DO $$
BEGIN
    -- Solo intentamos migrar si existe la columna vieja is_active
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'is_active') THEN
        
        -- Caso: Activo (true, 'true', 1, etc.)
        UPDATE clients 
        SET status = 'active' 
        WHERE is_active::text IN ('true', '1', 't', 'y', 'yes');

        -- Caso: Inactivo (false, 'false', 0, etc.)
        UPDATE clients 
        SET status = 'inactive' 
        WHERE is_active::text IN ('false', '0', 'f', 'n', 'no');
        
    END IF;
END $$;

-- 3. Asegurar que la columna status tenga los valores correctos
ALTER TABLE clients DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE clients ADD CONSTRAINT valid_status 
CHECK (status IN ('active', 'pending_payment', 'suspended', 'paused', 'trial', 'injured', 'inactive'));

-- 4. (Opcional pero recomendado) Eliminar la columna vieja para evitar conflictos
-- Descomenta la siguiente línea si quieres borrar is_active para siempre
-- ALTER TABLE clients DROP COLUMN IF EXISTS is_active;
