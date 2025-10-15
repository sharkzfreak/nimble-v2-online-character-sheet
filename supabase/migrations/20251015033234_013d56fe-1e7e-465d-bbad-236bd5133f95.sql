-- Add level_history column to characters table
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS level_history jsonb DEFAULT '[]'::jsonb;

-- Add comment explaining the structure
COMMENT ON COLUMN public.characters.level_history IS 'Array of level-up history entries: [{ from: number, to: number, at: timestamp, changes: {...} }]';
