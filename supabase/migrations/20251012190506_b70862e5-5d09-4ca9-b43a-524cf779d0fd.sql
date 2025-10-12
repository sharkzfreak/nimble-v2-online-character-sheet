-- Create characters table for Nimble V2 RPG
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Basic Info
  name TEXT NOT NULL,
  player TEXT,
  campaign TEXT,
  description TEXT,
  
  -- Core Stats
  strength INT NOT NULL DEFAULT 10,
  dexterity INT NOT NULL DEFAULT 10,
  intelligence INT NOT NULL DEFAULT 10,
  will INT NOT NULL DEFAULT 10,
  
  -- Skills
  skill_arcana INT DEFAULT 0,
  skill_examination INT DEFAULT 0,
  skill_finesse INT DEFAULT 0,
  skill_influence INT DEFAULT 0,
  skill_insight INT DEFAULT 0,
  skill_might INT DEFAULT 0,
  skill_lore INT DEFAULT 0,
  skill_naturecraft INT DEFAULT 0,
  skill_perception INT DEFAULT 0,
  skill_stealth INT DEFAULT 0,
  
  -- Traits
  background TEXT,
  race TEXT,
  class TEXT,
  abilities TEXT,
  
  -- Equipment
  equipment JSONB DEFAULT '{"weapons": [], "armor": [], "items": []}'::jsonb,
  
  -- Optional Sections
  spells TEXT,
  powers TEXT,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own characters" 
ON public.characters 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own characters" 
ON public.characters 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters" 
ON public.characters 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters" 
ON public.characters 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_characters_updated_at
BEFORE UPDATE ON public.characters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();