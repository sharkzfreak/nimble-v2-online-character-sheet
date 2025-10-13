-- Create dice_logs table for storing all dice rolls
CREATE TABLE public.dice_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id uuid REFERENCES public.characters(id) ON DELETE CASCADE,
  character_name text NOT NULL,
  formula text NOT NULL,
  raw_result integer NOT NULL,
  modifier integer NOT NULL DEFAULT 0,
  total integer NOT NULL,
  roll_type text NOT NULL, -- 'stat', 'skill', 'manual', etc.
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dice_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own dice logs
CREATE POLICY "Users can view their own dice logs"
ON public.dice_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own dice logs
CREATE POLICY "Users can insert their own dice logs"
ON public.dice_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own dice logs
CREATE POLICY "Users can delete their own dice logs"
ON public.dice_logs
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_dice_logs_user_id ON public.dice_logs(user_id);
CREATE INDEX idx_dice_logs_character_id ON public.dice_logs(character_id);
CREATE INDEX idx_dice_logs_created_at ON public.dice_logs(created_at DESC);