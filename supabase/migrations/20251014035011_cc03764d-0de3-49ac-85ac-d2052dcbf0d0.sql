-- Add column to store individual dice rolls
ALTER TABLE dice_logs 
ADD COLUMN individual_rolls jsonb DEFAULT '[]'::jsonb;