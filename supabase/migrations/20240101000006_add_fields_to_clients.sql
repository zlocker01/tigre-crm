-- Add is_active and package_id columns to clients table
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS package_id BIGINT REFERENCES packages(id);
