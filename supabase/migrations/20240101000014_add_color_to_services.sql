-- Agregar columna color a la tabla services
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS color text DEFAULT '#3b82f6';
-- Azul por defecto;
