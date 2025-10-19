// Berserker Subclass Features
import { CHEAT_SUBCLASS_FEATURES } from './cheatFeatures';
import { COMMANDER_SUBCLASS_FEATURES } from './commanderFeatures';

export interface SubclassFeature {
  id: string;
  name: string;
  level: number;
  description: string;
  subclassId: string;
  subclassName: string;
}

export const BERSERKER_SUBCLASS_FEATURES: SubclassFeature[] = [
  // Path of the Mountainheart
  {
    id: "mountainheart_stones_resilience",
    name: "Stone's Resilience",
    level: 3,
    subclassId: "mountainheart",
    subclassName: "Path of the Mountainheart",
    description: "Whenever you expend Fury Dice to reduce incoming damage, add the value of the die to the amount reduced.\n\nMountainous Tenacity: Whenever you expend your Hit Dice to recover HP, for every 10 HP you would recover, you may heal 1 Wound instead.",
  },
  {
    id: "mountainheart_unbreakable",
    name: "Unbreakable",
    level: 7,
    subclassId: "mountainheart",
    subclassName: "Path of the Mountainheart",
    description: "(1/encounter) While Raging, if you would suffer your last Wound or other negative condition of your choice, you don't.",
  },
  {
    id: "mountainheart_titans_fury",
    name: "Titan's Fury",
    level: 11,
    subclassId: "mountainheart",
    subclassName: "Path of the Mountainheart",
    description: "After you miss an attack or are crit by an enemy, Rage for free.",
  },
  {
    id: "mountainheart_mountains_endurance",
    name: "Mountain's Endurance",
    level: 15,
    subclassId: "mountainheart",
    subclassName: "Path of the Mountainheart",
    description: "While Dying, if an attack against you would be a crit, the attack is rerolled instead (when-crit abilities, such as Titan's Fury, still trigger).",
  },
  
  // Path of the Red Mist
  {
    id: "red_mist_blood_frenzy",
    name: "Blood Frenzy",
    level: 3,
    subclassId: "red_mist",
    subclassName: "Path of the Red Mist",
    description: "(1/turn) While Raging, whenever you crit or kill an enemy, change 1 Fury Die to the maximum.\n\nSavage Awareness: Advantage on Perception checks to notice or track down blood. Blindsight 2 while Raging; you ignore the blinded condition and can see through darkness and invisibility within that range.",
  },
  {
    id: "red_mist_unstoppable_brutality",
    name: "Unstoppable Brutality",
    level: 7,
    subclassId: "red_mist",
    subclassName: "Path of the Red Mist",
    description: "While Raging, you may gain 1 Wound to reroll any attack or save.",
  },
  {
    id: "red_mist_opportunistic_frenzy",
    name: "Opportunistic Frenzy",
    level: 11,
    subclassId: "red_mist",
    subclassName: "Path of the Red Mist",
    description: "While Raging, you can make opportunity attacks without disadvantage, and you may make them whenever an enemy enters your melee weapon's reach.",
  },
  {
    id: "red_mist_onslaught",
    name: "Onslaught",
    level: 15,
    subclassId: "red_mist",
    subclassName: "Path of the Red Mist",
    description: "While Raging, gain +2 speed. (1/round) you may move for free.",
  },
];

export function getSubclassFeatures(subclassId: string): SubclassFeature[] {
  return BERSERKER_SUBCLASS_FEATURES.filter(f => f.subclassId === subclassId);
}

export function getSubclassFeaturesAtLevel(subclassId: string, level: number): SubclassFeature[] {
  return BERSERKER_SUBCLASS_FEATURES.filter(
    f => f.subclassId === subclassId && f.level === level
  );
}

export { CHEAT_SUBCLASS_FEATURES, COMMANDER_SUBCLASS_FEATURES };
