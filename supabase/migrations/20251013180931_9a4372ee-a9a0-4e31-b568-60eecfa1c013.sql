-- Add HP temp and hit dice fields to characters table
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS hp_current integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS hp_max integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS hp_temp integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS hit_dice_remaining integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS hit_dice_total integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS armor integer DEFAULT 10;