import { ActionSpec, RollBinding } from './rollable';

export type CodexContent = {
  version: string;
  system: "Nimble v2";
  modsOnly: boolean;
  statArrays: Array<{
    id: string;
    label: string;
    mods: [number, number, number, number];
    description?: string;
  }>;
  classes: Array<{
    id: string;
    name: string;
    color: string;
    baseHPPerLevel: number;
    baseArmor: number;
    baseSpeed: number;
    description?: string;
    featureTable: FeatureDescriptor[];
  }>;
  items?: Item[];
  powers?: FeatureLike[];
  glossary?: Array<{
    id: string;
    term: string;
    text: string;
    page?: number;
  }>;
};

export type FeatureDescriptor = {
  id: string;
  level: number;
  name: string;
  text: string;
  requiresChoice: boolean;
  choiceType?: "single" | "multi";
  choiceCount?: number;
  options?: Array<{
    id: string;
    name: string;
    text?: string;
  }>;
  actions?: ActionSpec[];
  tags?: string[];
  page?: number;
  prereq?: {
    level?: number;
    featureIds?: string[];
  };
};

export type Item = {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'gear';
  props?: {
    damage?: string;
    range?: string;
    armorBonus?: number;
    hands?: 1 | 2;
    slotCost?: number;
  };
  uses?: {
    current: number;
    max: number;
  };
  tags?: string[];
  text?: string;
  page?: number;
};

export type FeatureLike = {
  id: string;
  name: string;
  text: string;
  actions?: ActionSpec[];
  tags?: string[];
  page?: number;
};

export type CharacterOverlay = {
  characterId: string;
  name: string;
  level: number;
  classId: string;
  stats_mod: {
    STR: number;
    DEX: number;
    INT: number;
    WILL: number;
  };
  hp: {
    current: number;
    max: number;
    temp: number;
  };
  armor: number;
  speed: number;
  choices: Array<{
    featureId: string;
    optionIds: string[];
    atLevel: number;
  }>;
  inventory: Array<{
    itemId: string;
    equipped?: boolean;
    quantity?: number;
  }>;
  favorites?: {
    featureIds: string[];
    itemIds: string[];
    powerIds?: string[];
  };
  overrides?: Partial<{
    armor: number;
    speed: number;
    hpMax: number;
  }>;
  notes?: string;
};

export type FeatureChoiceDescriptor = {
  featureId: string;
  name: string;
  level: number;
  requiresChoice: boolean;
  choiceCount?: number;
  options?: Array<{
    id: string;
    name: string;
  }>;
};

export type SearchIndex = {
  terms: Record<string, string[]>;
  entities: Array<{
    id: string;
    t: string;
    ty: string;
    lvl?: number;
    tags?: string[];
  }>;
  search: (q: string, filter?: { type?: string[]; levelLE?: number }) => string[];
};

export type DerivedStats = {
  hpMax: number;
  armor: number;
  speed: number;
};

export type RulesCodex = {
  content: CodexContent;
  character: CharacterOverlay;
  index: SearchIndex;
  byId: Record<string, any>;
  compute: {
    derived: (c: CharacterOverlay, content: CodexContent) => DerivedStats;
    availableChoices: (level: number) => FeatureChoiceDescriptor[];
    legal: (pick: { featureId: string; optionIds: string[] }) => boolean;
  };
};
