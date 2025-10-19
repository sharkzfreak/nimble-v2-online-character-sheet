import { SubclassFeature } from './subclassFeatures';

export interface DirebeastForm {
  id: string;
  name: string;
  size: string;
  description: string;
}

export interface ChimericBoon {
  id: string;
  name: string;
  description: string;
}

export const DIREBEAST_FORMS: DirebeastForm[] = [
  {
    id: "fearsome_beast",
    name: "Fearsome Beast",
    size: "Large",
    description: "Transform into any Large beast. Gain DEX+LVL temp HP (until Beastshift ends), the Gore attack, and Fearsome. Gore. Action: 1d6+LVL damage, on hit: Gain LVL temp HP. Fearsome. Whenever you Interpose or Defend, you may spend 1 mana to force them to reroll the attack (you must choose either result).",
  },
  {
    id: "beast_of_the_pack",
    name: "Beast of the Pack",
    size: "Medium",
    description: "Transform into a Medium beast. Gain +DEX speed, Supercharge, and the Thunderfang attack. Thunderfang. Action: 1d4+LVL damage. Thunderfang deals an additional +1d4 lightning damage until combat ends. Thunderfang. Action: 1d4+LVL piercing damage. Supercharge. Spend up to WIL mana, and your next Thunderfang attack deals an additional 1d8 lightning damage per mana spent (you take this damage on a miss).",
  },
  {
    id: "beast_of_nightmares",
    name: "Beast of Nightmares",
    size: "Tiny",
    description: "Transform into any Tiny beast or insect (provided it is horrible). Gain the Sting attack and Silent But Deadly. Sting. (1/round) Action: Reach: 0. 1d4 piercing + 3×LVL acid damage (ignoring armor), on crit: 4×LVL damage instead. Silent But Deadly. Speed: 2. You cannot Defend or Interpose. Attackers cannot target you until you become conspicuous (e.g., being seen transforming or attacking).",
  },
];

export const CHIMERIC_BOONS: ChimericBoon[] = [
  {
    id: "beast_of_the_sea",
    name: "Beast of the Sea",
    description: "Can move, breathe, and fight underwater without penalty.",
  },
  {
    id: "climber",
    name: "Climber",
    description: "Can walk across walls and ceilings; ignores difficult terrain.",
  },
  {
    id: "fleet_footed",
    name: "Fleet Footed",
    description: "+2 speed. Advantage on Stealth checks and against the Grappled condition.",
  },
  {
    id: "earthwalker",
    name: "Earthwalker",
    description: "+2 armor. Can burrow through dirt and unworked rock at half speed (leaving a tunnel behind). Advantage against the Prone condition.",
  },
  {
    id: "keen_senses",
    name: "Keen Senses",
    description: "Advantage on Perception and Assess checks. Unaffected by Blinded.",
  },
  {
    id: "leader_of_the_pack",
    name: "Leader of the Pack",
    description: "Advantage against fear and charm effects for yourself and your party within a 6 space aura.",
  },
  {
    id: "phasebeast",
    name: "Phasebeast",
    description: "Whenever you shift between this form and your normal form at the start of your turn, you may port up to 6 spaces away to a place you can see.",
  },
  {
    id: "prehensile_tail",
    name: "Prehensile Tail",
    description: "Creatures you hit in melee that are your size or smaller are Grappled. If you hit a larger creature, you may move with it when it moves.",
  },
  {
    id: "winged",
    name: "Winged",
    description: "Gain a flying speed. Forced movement moves you twice as far while flying.",
  },
];

export const STORMSHIFTER_CLASS_FEATURES = [
  {
    id: "stormshifter_master_of_storms",
    name: "Master of Storms",
    level: 1,
    description: "You know cantrips from the Lightning and Wind schools.\n\nBeastshift. Action: You can transform into a harmless beast (squirrel, pigeon, etc.). While transformed, you can speak with animals. This form lasts until you drop to 0 HP, cast a spell, or if you end it on your turn for free. You have DEX Beastshift charges; they reset on a Safe Rest.",
    requires_choice: false,
  },
  {
    id: "stormshifter_direbeast_form",
    name: "Direbeast Form",
    level: 2,
    description: "You can Beastshift into a Fearsome Beast.",
    requires_choice: false,
  },
  {
    id: "stormshifter_mana_tier1",
    name: "Mana and Unlock Tier 1 Spells",
    level: 2,
    description: "You unlock tier 1 Wind and Lightning spells and gain a mana pool to cast these spells. This mana pool's maximum is always equal to (WIL×3)+LVL and recharges on a Safe Rest.",
    requires_choice: false,
  },
  {
    id: "stormshifter_subclass",
    name: "Subclass",
    level: 3,
    description: "Choose a Stormshifter subclass.",
    requires_choice: true,
    choice_type: "single" as const,
    options: [
      { id: "sky_storm", name: "Circle of Sky & Storm" },
      { id: "fang_claw", name: "Circle of Fang & Claw" },
    ],
  },
  {
    id: "stormshifter_direbeast_form_2",
    name: "Direbeast Form (2)",
    level: 3,
    description: "You can Beastshift into a Beast of the Pack.",
    requires_choice: false,
  },
  {
    id: "stormshifter_tier2",
    name: "Tier 2 Spells",
    level: 4,
    description: "You may now cast tier 2 spells and upcast spells at tier 2.",
    requires_choice: false,
  },
  {
    id: "stormshifter_key_stat_increase_4",
    name: "Key Stat Increase",
    level: 4,
    description: "+1 WIL or DEX.",
    requires_choice: false,
  },
  {
    id: "stormshifter_stormcaller",
    name: "Stormcaller",
    level: 4,
    description: "Learn a Utility Spell from each spell school you know.",
    requires_choice: false,
  },
  {
    id: "stormshifter_direbeast_form_3",
    name: "Direbeast Form (3)",
    level: 5,
    description: "You can Beastshift into a Beast of Nightmares.",
    requires_choice: false,
  },
  {
    id: "stormshifter_upgraded_cantrips_5",
    name: "Upgraded Cantrips",
    level: 5,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "stormshifter_secondary_stat_increase_5",
    name: "Secondary Stat Increase",
    level: 5,
    description: "+1 STR or INT.",
    requires_choice: false,
  },
  {
    id: "stormshifter_chimeric_boon",
    name: "Chimeric Boon",
    level: 6,
    description: "Choose 2 Chimeric Boons. Whenever you shapeshift into a Direbeast form, you may modify it with 1 Chimeric Boon you know.",
    requires_choice: true,
    choice_type: "multi" as const,
    choice_count: 2,
    options: CHIMERIC_BOONS.map(b => ({ id: b.id, name: b.name, text: b.description })),
  },
  {
    id: "stormshifter_expert_shifter",
    name: "Expert Shifter",
    level: 6,
    description: "Gain 1 additional use of Beastshift per Safe Rest.",
    requires_choice: false,
  },
  {
    id: "stormshifter_tier3",
    name: "Tier 3 Spells",
    level: 6,
    description: "You may now cast tier 3 spells and upcast spells at tier 3.",
    requires_choice: false,
  },
  {
    id: "stormshifter_subclass_7",
    name: "Subclass",
    level: 7,
    description: "Gain your Stormshifter subclass feature.",
    requires_choice: false,
  },
  {
    id: "stormshifter_stormcaller_2",
    name: "Stormcaller (2)",
    level: 7,
    description: "Learn a 2nd Utility Spell from each spell school you know.",
    requires_choice: false,
  },
  {
    id: "stormshifter_tier4",
    name: "Tier 4 Spells",
    level: 8,
    description: "You may now cast tier 4 spells and upcast spells at tier 4.",
    requires_choice: false,
  },
  {
    id: "stormshifter_key_stat_increase_8",
    name: "Key Stat Increase",
    level: 8,
    description: "+1 WIL or DEX.",
    requires_choice: false,
  },
  {
    id: "stormshifter_stormborn",
    name: "Stormborn",
    level: 8,
    description: "Gain resistance to lightning damage. (1/day) You may gain advantage on a Naturecraft check or Concentration check.",
    requires_choice: false,
  },
  {
    id: "stormshifter_chimeric_boon_2",
    name: "Chimeric Boon (2)",
    level: 9,
    description: "Choose a 3rd Chimeric Boon.",
    requires_choice: true,
    choice_type: "single" as const,
    options: CHIMERIC_BOONS.map(b => ({ id: b.id, name: b.name, text: b.description })),
  },
  {
    id: "stormshifter_expert_shifter_2",
    name: "Expert Shifter (2)",
    level: 9,
    description: "Gain 1 additional use of Beastshift per Safe Rest.",
    requires_choice: false,
  },
  {
    id: "stormshifter_secondary_stat_increase_9",
    name: "Secondary Stat Increase",
    level: 9,
    description: "+1 STR or INT.",
    requires_choice: false,
  },
  {
    id: "stormshifter_tier5",
    name: "Tier 5 Spells",
    level: 10,
    description: "You may now cast tier 5 spells and upcast spells at tier 5.",
    requires_choice: false,
  },
  {
    id: "stormshifter_upgraded_cantrips_10",
    name: "Upgraded Cantrips",
    level: 10,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "stormshifter_subclass_11",
    name: "Subclass",
    level: 11,
    description: "Gain your Stormshifter subclass feature.",
    requires_choice: false,
  },
  {
    id: "stormshifter_tier6",
    name: "Tier 6 Spells",
    level: 12,
    description: "You may now cast tier 6 spells and upcast spells at tier 6.",
    requires_choice: false,
  },
  {
    id: "stormshifter_key_stat_increase_12",
    name: "Key Stat Increase",
    level: 12,
    description: "+1 WIL or DEX.",
    requires_choice: false,
  },
  {
    id: "stormshifter_chimeric_boon_3",
    name: "Chimeric Boon (3)",
    level: 12,
    description: "Select a 4th Chimeric Boon.",
    requires_choice: true,
    choice_type: "single" as const,
    options: CHIMERIC_BOONS.map(b => ({ id: b.id, name: b.name, text: b.description })),
  },
  {
    id: "stormshifter_expert_shifter_3",
    name: "Expert Shifter (3)",
    level: 12,
    description: "Gain 1 additional use of Beastshift per Safe Rest.",
    requires_choice: false,
  },
  {
    id: "stormshifter_secondary_stat_increase_13",
    name: "Secondary Stat Increase",
    level: 13,
    description: "+1 STR or INT.",
    requires_choice: false,
  },
  {
    id: "stormshifter_stormborn_2",
    name: "Stormborn (2)",
    level: 13,
    description: "Instead of rolling dice, deal the max damage of a Wind spell by spending a charge of your Beastshift feature. Whenever you end Beastshift, you may cast a cantrip for free.",
    requires_choice: false,
  },
  {
    id: "stormshifter_tier7",
    name: "Tier 7 Spells",
    level: 14,
    description: "You may now cast tier 7 spells and upcast spells at tier 7.",
    requires_choice: false,
  },
  {
    id: "stormshifter_subclass_15",
    name: "Subclass",
    level: 15,
    description: "Gain your Stormshifter subclass feature.",
    requires_choice: false,
  },
  {
    id: "stormshifter_upgraded_cantrips_15",
    name: "Upgraded Cantrips",
    level: 15,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "stormshifter_tier8",
    name: "Tier 8 Spells",
    level: 16,
    description: "You may now cast tier 8 spells and upcast spells at tier 8.",
    requires_choice: false,
  },
  {
    id: "stormshifter_key_stat_increase_16",
    name: "Key Stat Increase",
    level: 16,
    description: "+1 WIL or DEX.",
    requires_choice: false,
  },
  {
    id: "stormshifter_chimeric_boon_4",
    name: "Chimeric Boon (4)",
    level: 17,
    description: "Select a 5th Chimeric Boon.",
    requires_choice: true,
    choice_type: "single" as const,
    options: CHIMERIC_BOONS.map(b => ({ id: b.id, name: b.name, text: b.description })),
  },
  {
    id: "stormshifter_secondary_stat_increase_17",
    name: "Secondary Stat Increase",
    level: 17,
    description: "+1 STR or INT.",
    requires_choice: false,
  },
  {
    id: "stormshifter_tier9",
    name: "Tier 9 Spells",
    level: 18,
    description: "You may now cast tier 9 spells and upcast spells at tier 9.",
    requires_choice: false,
  },
  {
    id: "stormshifter_epic_boon",
    name: "Epic Boon",
    level: 19,
    description: "Choose an Epic Boon (see pg. 23 of the GM's Guide).",
    requires_choice: false,
  },
  {
    id: "stormshifter_archdruid",
    name: "Archdruid",
    level: 20,
    description: "+1 to any 2 of your stats. (1/encounter) Cast a spell up to tier 4 for free when you enter or leave a Beastshift form.",
    requires_choice: false,
  },
  {
    id: "stormshifter_upgraded_cantrips_20",
    name: "Upgraded Cantrips",
    level: 20,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
];

export const SKY_STORM_SUBCLASS_FEATURES: SubclassFeature[] = [
  {
    id: "sky_storm_deepening_study",
    name: "Deepening Study",
    level: 3,
    subclassId: "sky_storm",
    subclassName: "Circle of Sky & Storm",
    description: "Choose the Ice or Radiant school to learn.\n\nCreature of the Fey. You may cast spells while Beastshifted.\n\nAttuned to Nature. Add WIL to any skill check related to nature or weather.",
  },
  {
    id: "sky_storm_raging_tempest",
    name: "Raging Tempest",
    level: 7,
    subclassId: "sky_storm",
    subclassName: "Circle of Sky & Storm",
    description: "Whenever you crit with a tiered spell, you may cast a cantrip for free from a school you know and haven't cast any spells from this turn (at the same level of disadvantage).",
  },
  {
    id: "sky_storm_primordial_force",
    name: "Primordial Force",
    level: 11,
    subclassId: "sky_storm",
    subclassName: "Circle of Sky & Storm",
    description: "Spending 2+ mana on a spell grants an additional effect:\n• Ice. Gain WIL temp HP.\n• Lightning. Deal additional damage equal to your WIL.\n• Radiant. You may heal a creature within 6 spaces WIL HP.\n• Wind. Gain a flying speed this turn. Move up to 6 spaces for free.",
  },
  {
    id: "sky_storm_master_of_storm",
    name: "Master of Storm",
    level: 15,
    subclassId: "sky_storm",
    subclassName: "Circle of Sky & Storm",
    description: "You can concentrate on 1 lightning spell and 1 wind spell at the same time. (1/Safe Rest) You can cast Ride the Lightning for 0 mana.",
  },
];

export const FANG_CLAW_SUBCLASS_FEATURES: SubclassFeature[] = [
  {
    id: "fang_claw_swiftshift",
    name: "Swiftshift",
    level: 3,
    subclassId: "fang_claw",
    subclassName: "Circle of Fang & Claw",
    description: "Whenever you Beastshift or move for free: While transformed, you may shift between different Direbeast forms for free (and as a reaction to an enemy's attack: spend 2 mana to shift into a Fearsome Beast. Then you may Interpose from up to 12 spaces away and Defend with every stat, but note this round).\n\nMirrorstrike. (1/encounter) Reaction: when an enemy attacks, spend 2 mana to shift into a Fearsome Beast. Then you may Interpose from up to 12 spaces away and Defend with disadvantage and must reroll until they save or can move no further). If they end up in the same space as you, you may Sting them for free.\n\nFriend of Beasts. Beasts will not attack you until you first harm them. You may transform into domestic beasts without spending a Beastshift charge.",
  },
  {
    id: "fang_claw_unleash_the_beast",
    name: "Unleash the Beast",
    level: 7,
    subclassId: "fang_claw",
    subclassName: "Circle of Fang & Claw",
    description: "(1/encounter) When you miss, you can crit instead.\n\nStorm Wake. (1/encounter) Action: Spend 3 mana to shift into a Beast of the Pack, then teleport in a straight line up to 12 spaces away, unerringly dealing WIL d8 lightning damage to any creatures you choose adjacent to your path.",
  },
  {
    id: "fang_claw_master_of_forms",
    name: "Master of Forms",
    level: 11,
    subclassId: "fang_claw",
    subclassName: "Circle of Fang & Claw",
    description: "Your shapeshift forms can have 2 Chimeric Boons at a time.\n\nVenomous Gaze. (1/encounter) Action: Spend 2 mana to shift into a Beast of Nightmares. Then entice a creature within 12 spaces to move 2×WIL spaces closer to you on a failed WIL save (they roll with disadvantage and must reroll until they save or can move no further). If they end up in the same space as you, you may Sting them for free.",
  },
  {
    id: "fang_claw_master_of_forms_2",
    name: "Master of Forms (2)",
    level: 15,
    subclassId: "fang_claw",
    subclassName: "Circle of Fang & Claw",
    description: "You can Beastshift 2 additional times per Safe Rest. Choose 2 additional Chimeric Boons. Your Direbeast forms can have 3 at a time.",
  },
];

export const STORMSHIFTER_SUBCLASS_FEATURES = [
  ...SKY_STORM_SUBCLASS_FEATURES,
  ...FANG_CLAW_SUBCLASS_FEATURES,
];
