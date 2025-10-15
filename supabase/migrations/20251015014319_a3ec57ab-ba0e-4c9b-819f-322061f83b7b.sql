-- Migrate from ability scores to modifiers only
-- Add new modifier columns
ALTER TABLE public.characters
ADD COLUMN IF NOT EXISTS str_mod integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS dex_mod integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS int_mod integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS will_mod integer DEFAULT 0;

-- Migrate existing score data to mods (if scores are 3-18 range)
-- Formula: mod = floor((score - 10) / 2)
UPDATE public.characters
SET 
  str_mod = FLOOR((strength - 10) / 2),
  dex_mod = FLOOR((dexterity - 10) / 2),
  int_mod = FLOOR((intelligence - 10) / 2),
  will_mod = FLOOR((will - 10) / 2)
WHERE strength IS NOT NULL 
  AND strength BETWEEN 3 AND 20;

-- Keep old columns for now but they'll be ignored in new code
-- We'll deprecate them in UI but not drop them to preserve data