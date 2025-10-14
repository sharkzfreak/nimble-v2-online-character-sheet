-- Add favorites column to characters table
ALTER TABLE characters 
ADD COLUMN favorites jsonb DEFAULT '[]'::jsonb;