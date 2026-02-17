-- Agregar columnas a la tabla services
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS sessions_count integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS target_audience text DEFAULT 'Para todos';

-- Agregar columnas a la tabla promotions
ALTER TABLE promotions 
ADD COLUMN IF NOT EXISTS sessions_count integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS target_audience text DEFAULT 'Para todos';
