// Nimble v2 Official Stat Arrays
// Source: Nimble v2 Core Rulebook
// These are the three official arrays players must choose from

export interface NimbleArray {
  id: string;
  name: string;
  modifiers: number[];
  description: string;
}

export const NIMBLE_STAT_ARRAYS: NimbleArray[] = [
  {
    id: "balanced",
    name: "Balanced",
    modifiers: [2, 2, 1, 0],
    description: "Well-rounded hero with two strong abilities"
  },
  {
    id: "specialist",
    name: "Specialist", 
    modifiers: [3, 1, 0, 0],
    description: "Exceptional in one area, moderate in another"
  },
  {
    id: "versatile",
    name: "Versatile",
    modifiers: [2, 1, 1, 1],
    description: "Good at one thing, competent across the board"
  }
];

export type StatName = 'str_mod' | 'dex_mod' | 'int_mod' | 'will_mod';

export interface StatAssignment {
  str_mod: number | null;
  dex_mod: number | null;
  int_mod: number | null;
  will_mod: number | null;
}
