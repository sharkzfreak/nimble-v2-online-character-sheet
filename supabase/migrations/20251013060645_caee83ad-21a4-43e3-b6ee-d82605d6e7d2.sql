-- Create table for storing Nimble V2 ruleset data
CREATE TABLE IF NOT EXISTS public.nimble_ruleset (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version text NOT NULL DEFAULT '2.0',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Stat definitions
  stats jsonb NOT NULL DEFAULT '[
    {"name": "Strength", "abbreviation": "STR", "description": "Your raw physical power and resilience, endurance, and resistance to harm", "color": "var(--ability-str)"},
    {"name": "Dexterity", "abbreviation": "DEX", "description": "Your agility, reflexes, and precision with blades or bows", "color": "var(--ability-dex)"},
    {"name": "Intelligence", "abbreviation": "INT", "description": "Your Intelligence reflects knowledge and reasoning across fields", "color": "var(--ability-int)"},
    {"name": "Will", "abbreviation": "WILL", "description": "Your force of personality, courage, and wisdom", "color": "var(--ability-wis)"}
  ]'::jsonb,
  
  -- Skill definitions with associated stats
  skills jsonb NOT NULL DEFAULT '[
    {"name": "Might", "stat": "STR", "description": "Your ability to apply strength effectively"},
    {"name": "Finesse", "stat": "DEX", "description": "Your ability to use your hands and feet in careful ways"},
    {"name": "Stealth", "stat": "DEX", "description": "Your proficiency in staying unseen and moving quietly"},
    {"name": "Arcana", "stat": "INT", "description": "Your understanding of magical phenomena, spells, and enchantments"},
    {"name": "Examination", "stat": "INT", "description": "Your aptitude for thorough analysis and deduction"},
    {"name": "Lore", "stat": "INT", "description": "Your understanding of the history of civilization, kingdoms, and religions"},
    {"name": "Insight", "stat": "WILL", "description": "Your ability to understand people and situations beyond the obvious"},
    {"name": "Influence", "stat": "WILL", "description": "Your ability to persuade, deceive, intimidate, and perform"},
    {"name": "Naturecraft", "stat": "WILL", "description": "Your expertise in wilderness survival, navigation, tracking, and handling animals"},
    {"name": "Perception", "stat": "WILL", "description": "Your overall ability to notice subtle details in your surroundings"}
  ]'::jsonb,
  
  -- Class definitions
  classes jsonb NOT NULL DEFAULT '[
    {"name": "Berserker", "complexity": 2, "description": "An unstoppable force of wrath and ruin"},
    {"name": "Cheat", "complexity": 1, "description": "A sneaky, backstabbing, dirty-fighting rogue"},
    {"name": "Commander", "complexity": 2, "description": "A battlefield tactician, leader, and weapon master"},
    {"name": "Hunter", "complexity": 2, "description": "Resourceful survivalist, bowmaster, and skilled tracker"},
    {"name": "Mage", "complexity": 3, "description": "Wield and shape the elements of fire, ice, and lightning"},
    {"name": "Oathsworn", "complexity": 2, "description": "Faithful guardian, protector, and avenger of the weak"},
    {"name": "Shadowmancer", "complexity": 3, "description": "Summon hordes of expendable shadow minions"},
    {"name": "Shepherd", "complexity": 2, "description": "Master life and death. Lead a faithful companion"},
    {"name": "Songweaver", "complexity": 3, "description": "Inspiring presence, sharp wit, sharper tongue"},
    {"name": "Stormshifter", "complexity": 3, "description": "Master of beast and nature"},
    {"name": "Zephyr", "complexity": 2, "description": "A disciplined martial artist with swift hands and swift feet"}
  ]'::jsonb,
  
  -- Dice mechanics
  dice_system jsonb NOT NULL DEFAULT '{
    "skill_check": {"dice": "d20", "description": "Roll 1d20 + skill modifier"},
    "save": {"dice": "d20", "description": "Roll 1d20 + stat modifier"},
    "difficulty_levels": {
      "easy": 8,
      "medium": 12,
      "challenging": 15,
      "very_difficult": 18,
      "extremely_difficult": 20
    }
  }'::jsonb
);

-- Enable RLS
ALTER TABLE public.nimble_ruleset ENABLE ROW LEVEL SECURITY;

-- Allow public read access to ruleset
CREATE POLICY "Public read access for nimble_ruleset"
  ON public.nimble_ruleset
  FOR SELECT
  USING (true);

-- Insert default Nimble V2 ruleset
INSERT INTO public.nimble_ruleset (version) VALUES ('2.0')
ON CONFLICT DO NOTHING;

-- Add trigger for updated_at
CREATE TRIGGER update_nimble_ruleset_updated_at
  BEFORE UPDATE ON public.nimble_ruleset
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();