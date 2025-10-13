import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NimbleStat {
  name: string;
  abbreviation: string;
  description: string;
  color: string;
}

export interface NimbleSkill {
  name: string;
  stat: string;
  description: string;
}

export interface NimbleClass {
  name: string;
  complexity: number;
  description: string;
}

export interface NimbleDiceSystem {
  skill_check: {
    dice: string;
    description: string;
  };
  save: {
    dice: string;
    description: string;
  };
  difficulty_levels: {
    easy: number;
    medium: number;
    challenging: number;
    very_difficult: number;
    extremely_difficult: number;
  };
}

export interface NimbleRuleset {
  id: string;
  version: string;
  stats: NimbleStat[];
  skills: NimbleSkill[];
  classes: NimbleClass[];
  dice_system: NimbleDiceSystem;
}

export const useNimbleRuleset = () => {
  return useQuery({
    queryKey: ["nimble-ruleset"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nimble_ruleset")
        .select("*")
        .eq("version", "2.0")
        .single();

      if (error) throw error;
      
      // Cast and validate the JSONB data
      return {
        id: data.id,
        version: data.version,
        stats: data.stats as unknown as NimbleStat[],
        skills: data.skills as unknown as NimbleSkill[],
        classes: data.classes as unknown as NimbleClass[],
        dice_system: data.dice_system as unknown as NimbleDiceSystem,
      };
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};
