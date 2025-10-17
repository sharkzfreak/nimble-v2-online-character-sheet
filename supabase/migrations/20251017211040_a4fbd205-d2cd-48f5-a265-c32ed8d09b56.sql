-- Create table for storing UI state per character
CREATE TABLE IF NOT EXISTS public.ui_state (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id uuid NOT NULL,
  card_id text NOT NULL,
  width integer,
  height integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(character_id, card_id)
);

-- Enable RLS
ALTER TABLE public.ui_state ENABLE ROW LEVEL SECURITY;

-- Users can view their own UI state
CREATE POLICY "Users can view their own UI state"
ON public.ui_state
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = ui_state.character_id
    AND characters.user_id = auth.uid()
  )
);

-- Users can insert their own UI state
CREATE POLICY "Users can insert their own UI state"
ON public.ui_state
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = ui_state.character_id
    AND characters.user_id = auth.uid()
  )
);

-- Users can update their own UI state
CREATE POLICY "Users can update their own UI state"
ON public.ui_state
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = ui_state.character_id
    AND characters.user_id = auth.uid()
  )
);

-- Users can delete their own UI state
CREATE POLICY "Users can delete their own UI state"
ON public.ui_state
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = ui_state.character_id
    AND characters.user_id = auth.uid()
  )
);

-- Add trigger for updating updated_at
CREATE TRIGGER update_ui_state_updated_at
BEFORE UPDATE ON public.ui_state
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();