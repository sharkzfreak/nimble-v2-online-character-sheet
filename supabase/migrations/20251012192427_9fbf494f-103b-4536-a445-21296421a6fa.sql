-- Create tables for Nimble V2 rulebook data

-- Classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  complexity INTEGER NOT NULL DEFAULT 1, -- 1-3 diamonds
  key_stats TEXT[] NOT NULL, -- e.g., ['STR', 'DEX']
  hit_die TEXT NOT NULL, -- e.g., '1d12'
  starting_hp INTEGER NOT NULL,
  saves TEXT[] NOT NULL, -- e.g., ['STR+', 'INT-']
  armor TEXT,
  weapons TEXT,
  starting_gear TEXT[] NOT NULL,
  source_page INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Subclasses table
CREATE TABLE IF NOT EXISTS public.subclasses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  complexity INTEGER NOT NULL DEFAULT 1,
  source_page INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(class_id, name)
);

-- Abilities table (class abilities, traits, etc.)
CREATE TABLE IF NOT EXISTS public.abilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'class_ability', 'racial_trait', 'background_trait'
  description TEXT NOT NULL,
  level_requirement INTEGER,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  subclass_id UUID REFERENCES public.subclasses(id) ON DELETE CASCADE,
  source_page INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Equipment table
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'weapon', 'armor', 'item', 'magical'
  type TEXT, -- weapon_type, armor_type, etc.
  damage TEXT, -- for weapons
  range_value TEXT, -- for ranged weapons
  defense INTEGER, -- for armor
  weight INTEGER,
  cost TEXT,
  properties JSONB, -- additional properties
  description TEXT,
  source_page INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Spells table
CREATE TABLE IF NOT EXISTS public.spells (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  element TEXT NOT NULL, -- 'fire', 'ice', 'lightning', 'wind', 'radiant', 'necrotic', 'utility'
  description TEXT NOT NULL,
  damage TEXT,
  range_value TEXT,
  duration TEXT,
  properties JSONB,
  source_page INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rules codex table
CREATE TABLE IF NOT EXISTS public.rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'combat', 'skills', 'conditions', 'character_creation', etc.
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  source_page INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category, name)
);

-- Ancestries (races) table
CREATE TABLE IF NOT EXISTS public.ancestries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- 'common', 'exotic'
  description TEXT NOT NULL,
  traits JSONB NOT NULL,
  stat_bonuses JSONB,
  source_page INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Backgrounds table
CREATE TABLE IF NOT EXISTS public.backgrounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  skill_bonus TEXT,
  starting_equipment TEXT[],
  source_page INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables (public read access for game content)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subclasses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ancestries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backgrounds ENABLE ROW LEVEL SECURITY;

-- Create public read policies (anyone can read game content)
CREATE POLICY "Public read access for classes"
  ON public.classes FOR SELECT
  USING (true);

CREATE POLICY "Public read access for subclasses"
  ON public.subclasses FOR SELECT
  USING (true);

CREATE POLICY "Public read access for abilities"
  ON public.abilities FOR SELECT
  USING (true);

CREATE POLICY "Public read access for equipment"
  ON public.equipment FOR SELECT
  USING (true);

CREATE POLICY "Public read access for spells"
  ON public.spells FOR SELECT
  USING (true);

CREATE POLICY "Public read access for rules"
  ON public.rules FOR SELECT
  USING (true);

CREATE POLICY "Public read access for ancestries"
  ON public.ancestries FOR SELECT
  USING (true);

CREATE POLICY "Public read access for backgrounds"
  ON public.backgrounds FOR SELECT
  USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subclasses_updated_at
  BEFORE UPDATE ON public.subclasses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_abilities_updated_at
  BEFORE UPDATE ON public.abilities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_spells_updated_at
  BEFORE UPDATE ON public.spells
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rules_updated_at
  BEFORE UPDATE ON public.rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ancestries_updated_at
  BEFORE UPDATE ON public.ancestries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_backgrounds_updated_at
  BEFORE UPDATE ON public.backgrounds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update characters table to add level and class/subclass references
ALTER TABLE public.characters 
  ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES public.classes(id),
  ADD COLUMN IF NOT EXISTS subclass_id UUID REFERENCES public.subclasses(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_abilities_class ON public.abilities(class_id);
CREATE INDEX IF NOT EXISTS idx_abilities_subclass ON public.abilities(subclass_id);
CREATE INDEX IF NOT EXISTS idx_subclasses_class ON public.subclasses(class_id);
CREATE INDEX IF NOT EXISTS idx_equipment_category ON public.equipment(category);
CREATE INDEX IF NOT EXISTS idx_spells_element ON public.spells(element);
CREATE INDEX IF NOT EXISTS idx_rules_category ON public.rules(category);