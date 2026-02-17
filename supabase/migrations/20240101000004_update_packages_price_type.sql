-- Migration to change price column type from text to numeric in packages table

-- First, we need to alter the column type
-- Using 'USING price::numeric' to convert existing text values to numeric
ALTER TABLE packages 
ALTER COLUMN price TYPE numeric USING price::numeric;
