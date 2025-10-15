// Rollable action types for features, spells, items
export type RollKind = 'attack' | 'save' | 'check' | 'damage' | 'healing';
export type Ability = 'STR' | 'DEX' | 'INT' | 'WILL';

export interface RollBinding {
  kind: RollKind;
  ability?: Ability;
  prof?: boolean;
  flat?: number;
  die?: string;
  crit?: {
    on: number;
    effect?: 'max' | 'extraDie' | 'double';
  };
  dc?: number | {
    source: 'fixed' | 'calc';
    value?: number;
    formula?: string;
  };
  saveTargetAbility?: Ability;
  notes?: string;
}

export interface ActionSpec {
  id: string;
  label: string;
  rolls: RollBinding[];
}

export interface FeatureLike {
  id: string;
  name: string;
  description?: string;
  actions?: ActionSpec[];
}

export interface FavoriteItem {
  id: string;
  name: string;
  type: 'attack' | 'feature' | 'spell' | 'item';
  description?: string;
  actions?: ActionSpec[];
}

export interface RollResult {
  formula: string;
  rawResult: number;
  modifier: number;
  total: number;
  rolls: Array<{ value: number; sides: number }>;
  advantage?: boolean;
  disadvantage?: boolean;
  crit?: 'success' | 'fail';
  dc?: number;
  passedDC?: boolean;
  margin?: number;
}

export type AdvMode = 'normal' | 'adv' | 'dis';
