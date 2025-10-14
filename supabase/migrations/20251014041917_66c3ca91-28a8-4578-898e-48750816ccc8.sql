-- Add journal_entries column to characters table
ALTER TABLE characters 
ADD COLUMN journal_entries jsonb DEFAULT '[]'::jsonb;