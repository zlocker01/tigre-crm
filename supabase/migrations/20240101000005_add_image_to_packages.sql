-- Migration to add image column to packages table
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS image text;
