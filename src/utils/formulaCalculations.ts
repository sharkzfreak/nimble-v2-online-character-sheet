import { FormulaBreakdown, FormulaContributor } from "@/components/FormulaInspector";

interface Character {
  level: number;
  class: string;
  str_mod: number;
  dex_mod: number;
  int_mod: number;
  will_mod: number;
  hp_max?: number;
  armor?: number;
  equipment?: {
    armor?: Array<{ name: string; defense?: number }>;
    items?: Array<{ name: string; properties?: any }>;
  };
  custom_features?: Array<{ name: string; effects?: any }>;
}

// Helper to calculate HP based on class
const getClassHPPerLevel = (className: string): number => {
  const hpMap: Record<string, number> = {
    'Berserker': 8,
    'Commander': 7,
    'Oathsworn': 7,
    'Hunter': 6,
    'Cheat': 6,
    'Zephyr': 6,
    'Shepherd': 6,
    'Mage': 5,
    'Shadowmancer': 5,
    'Songweaver': 5,
    'Stormshifter': 5,
  };
  return hpMap[className] || 6;
};

// Helper to get primary stat modifier for HP (typically STR or WILL)
const getPrimaryHPModifier = (className: string, character: Character): number => {
  const primaryStatMap: Record<string, keyof Pick<Character, 'str_mod' | 'dex_mod' | 'int_mod' | 'will_mod'>> = {
    'Berserker': 'str_mod',
    'Commander': 'str_mod',
    'Oathsworn': 'str_mod',
    'Hunter': 'dex_mod',
    'Cheat': 'dex_mod',
    'Zephyr': 'dex_mod',
    'Shepherd': 'will_mod',
    'Mage': 'int_mod',
    'Shadowmancer': 'int_mod',
    'Songweaver': 'will_mod',
    'Stormshifter': 'will_mod',
  };
  
  const statKey = primaryStatMap[className] || 'str_mod';
  return character[statKey];
};

export const calculateHPFormula = (character: Character): FormulaBreakdown => {
  const contributors: FormulaContributor[] = [];
  const hpPerLevel = getClassHPPerLevel(character.class);
  const primaryMod = getPrimaryHPModifier(character.class, character);
  
  // Base HP from class and level
  const baseHP = hpPerLevel * character.level;
  contributors.push({
    source: `${character.class} Base`,
    value: baseHP,
    formula: `${hpPerLevel}/level × ${character.level}`,
  });

  // Modifier from primary stat
  const modBonus = primaryMod * character.level;
  if (modBonus !== 0) {
    contributors.push({
      source: 'Stat Modifier',
      value: modBonus,
      formula: `${primaryMod} × ${character.level}`,
    });
  }

  // Check for custom features that might boost HP
  if (character.custom_features) {
    character.custom_features.forEach(feature => {
      if (feature.effects?.hp_bonus) {
        contributors.push({
          source: `Feature: ${feature.name}`,
          value: feature.effects.hp_bonus,
        });
      }
    });
  }

  const computedTotal = contributors.reduce((sum, c) => sum + c.value, 0);
  const actualHP = character.hp_max || computedTotal;
  const isOverridden = actualHP !== computedTotal;

  return {
    stat: 'HP Max',
    contributors,
    total: actualHP,
    computedValue: computedTotal,
    isOverridden,
    overrideNote: isOverridden ? 'HP has been manually customized' : undefined,
  };
};

export const calculateArmorFormula = (character: Character): FormulaBreakdown => {
  const contributors: FormulaContributor[] = [];

  // Base armor (10 + DEX mod by default)
  contributors.push({
    source: 'Base',
    value: 10,
  });

  contributors.push({
    source: 'DEX Modifier',
    value: character.dex_mod,
  });

  // Equipped armor
  if (character.equipment?.armor && character.equipment.armor.length > 0) {
    character.equipment.armor.forEach(armor => {
      if (armor.defense) {
        contributors.push({
          source: `Armor: ${armor.name}`,
          value: armor.defense,
        });
      }
    });
  }

  // Custom features
  if (character.custom_features) {
    character.custom_features.forEach(feature => {
      if (feature.effects?.armor_bonus) {
        contributors.push({
          source: `Feature: ${feature.name}`,
          value: feature.effects.armor_bonus,
        });
      }
    });
  }

  const computedTotal = contributors.reduce((sum, c) => sum + c.value, 0);
  const actualArmor = character.armor || computedTotal;
  const isOverridden = actualArmor !== computedTotal;

  return {
    stat: 'Armor',
    contributors,
    total: actualArmor,
    computedValue: computedTotal,
    isOverridden,
    overrideNote: isOverridden ? 'Armor has been manually customized' : undefined,
  };
};

export const calculateSpeedFormula = (character: Character): FormulaBreakdown => {
  const contributors: FormulaContributor[] = [];

  // Base speed (30 for most races/classes in Nimble)
  contributors.push({
    source: 'Base Speed',
    value: 30,
  });

  // Equipment effects (heavy armor might reduce speed)
  if (character.equipment?.armor) {
    character.equipment.armor.forEach(armor => {
      if (armor.name.toLowerCase().includes('heavy')) {
        contributors.push({
          source: `Heavy Armor: ${armor.name}`,
          value: -5,
        });
      }
    });
  }

  // Custom features
  if (character.custom_features) {
    character.custom_features.forEach(feature => {
      if (feature.effects?.speed_bonus) {
        contributors.push({
          source: `Feature: ${feature.name}`,
          value: feature.effects.speed_bonus,
        });
      }
    });
  }

  const computedTotal = contributors.reduce((sum, c) => sum + c.value, 0);
  
  // For speed, we don't have a direct override field yet, so it's always computed
  return {
    stat: 'Speed',
    contributors,
    total: computedTotal,
    computedValue: computedTotal,
    isOverridden: false,
  };
};
