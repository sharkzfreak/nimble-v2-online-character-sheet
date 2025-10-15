-- Add dice_presets column to characters table for storing saved dice rolls
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS dice_presets jsonb DEFAULT '[]'::jsonb;

-- Add draft column to characters table for saving wizard progress
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS is_draft boolean DEFAULT false;

-- Add custom fields for wizard (already partially exist but ensure they're nullable)
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS custom_features jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS custom_spells jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS custom_inventory jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.characters.dice_presets IS 'Saved dice roll presets like Initiative, Attack, Damage, etc.';
COMMENT ON COLUMN public.characters.is_draft IS 'Indicates if this character is a draft from the character builder wizard';
COMMENT ON COLUMN public.characters.custom_features IS 'Custom features added by the user';
COMMENT ON COLUMN public.characters.custom_spells IS 'Custom spells added by the user';
COMMENT ON COLUMN public.characters.custom_inventory IS 'Custom inventory items added by the user';