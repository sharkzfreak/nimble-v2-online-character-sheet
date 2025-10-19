import { ClassFeature } from './classFeatures';

// Mystic Marks - chosen at levels 4, 6, 9, 12, and 16
export const MYSTIC_MARKS = [
  {
    id: "bramble_mark",
    name: "Bramble Mark",
    text: "Action: Touch an ally and grant them an aura of mystical thorns (max 1 ally at a time). Attackers take damage equal to the ally's armor whenever they Defend. The thorns last for WIL attacks or 1 min.",
  },
  {
    id: "broom_flight",
    name: "Broom Flight",
    text: "Spend 1 mana to gain flying for 1 hour (or until you fall). When crit while flying, you fall, landing Prone.",
  },
  {
    id: "coven",
    name: "Coven",
    text: "Choose 1 spell school a close ally knows, you can cast tiered spells from that school (Healer of the Old Ways: non-Hexbinder healing spells cannot be Diminished).",
  },
  {
    id: "mark_of_protection",
    name: "Mark of Protection",
    text: "Creatures you heal can ignore 1 negative condition they would receive within the next minute.",
  },
  {
    id: "pact_of_enmity",
    name: "Pact of Enmity",
    text: "Whenever you would apply an Affliction, you may instead bind yourself to the creature with a pact of mutual destruction. Both of you deal MAX damage to each other (instead of rolling dice).",
  },
  {
    id: "sigil_of_journey",
    name: "Sigil of Journey",
    text: "Action: You (or another willing creature you touch) exchange places with an Afflicted creature within Reach 8 (provided the Afflicted creature is no more than 1 size larger).",
  },
  {
    id: "sigil_of_root",
    name: "Sigil of Root",
    text: "(1/encounter) Your Enfeebled affliction also Restrains for 1 round.",
  },
  {
    id: "word_of_decay",
    name: "Word of Decay",
    text: "Whenever you use a Futuresight Die against an Afflicted target, take the max value. When your Afflicted target dies, regain 1 spent Futuresight Die (roll it).",
  },
] as const;

// Afflictions - core mechanic
export const AFFLICTIONS = [
  {
    id: "brittle",
    name: "Brittle",
    text: "Target suffers 1 damage for each space it moves (or is moved). Level 10: 2 damage/space.",
  },
  {
    id: "dimmed",
    name: "Dimmed",
    text: "Target has disadvantage 2 when attacking beyond Reach 1.",
  },
  {
    id: "doomed",
    name: "Doomed",
    text: "(1/encounter) Maximize the next roll against Afflicted target.",
  },
  {
    id: "enfeebled",
    name: "Enfeebled",
    text: "Target falls Prone at the end of each of your turns.",
  },
  {
    id: "frenzied",
    name: "Frenzied",
    text: "Target's first attack each round MUST be against the nearest random creature (acts first amongst monsters).",
  },
  {
    id: "pestilent",
    name: "Pestilent",
    text: "On death of target, creatures within Reach 2 of it suffer LVL damage (ignoring armor).",
  },
  {
    id: "sundered",
    name: "Sundered",
    text: "Target's armor reduced 1 step.",
  },
  {
    id: "withered",
    name: "Withered",
    text: "Target's first attack each round against a friendly creature is made with disadvantage.",
  },
] as const;

// Hexbinder Spells
export const HEXBINDER_SPELLS = [
  {
    id: "misery",
    name: "Misery",
    tier: 1,
    text: "Single Target. 2 Actions.\nReach: 8. Damage: 1d8+LVL. On hit: apply an Affliction. On crit: apply 2 instead.",
  },
  {
    id: "life_bloom",
    name: "Life Bloom",
    tier: 1,
    text: "Single Target +. 1 Action.\nReach: 8. Consume 1 of your own Hit Dice, and 1 more Hit Dice for each additional target and another creature within Reach the sum of those dice.",
  },
  {
    id: "twitch_curse",
    name: "Twitch Curse",
    tier: 2,
    text: "Single Target. 1 Action.\nReach: 8. Reaction: When attacked by a creature within Reach, the attacker takes -1 damage (attacker 1 space [+1 space for each Affliction they have]). Opportunity attacks triggered this way are made with advantage instead of disadvantage.",
  },
  {
    id: "bloodcurse",
    name: "Bloodcurse",
    tier: 2,
    text: "Single Target. 2 Actions.\nReach: 8. Damage: 1d4+LVL (increment the die size for each Affliction they have), on hit: Target becomes secretly Bloodcursed, suffering 2x the next damage they deal (ignoring armor).",
  },
  {
    id: "wyrding_strands",
    name: "Wyrding Strands",
    tier: 3,
    text: "AoE. 2 Actions.\nReach: 8. Move creatures in a 4x4 area a total of 2d6 spaces, divided among them as you choose. Large or larger creatures move half as far.",
  },
  {
    id: "frogify",
    name: "Frogify",
    tier: 3,
    text: "Single Target. 2 Actions.\nReach: 8. On a failed WIL save, turn a creature into a harmless, armorless, tiny, FROG for up to 1 min. They can still move but can't attack. On a save, they are partially transformed, only reducing their armor to none instead. Damaging or grappling the again ends the effect.",
  },
  {
    id: "malediction",
    name: "Malediction",
    tier: 4,
    text: "Multi-target. 2 Actions.\nReach: 4. Attack up to KEY creatures for 1d4 each. On hit, deal LVL damage instead of using armor.",
  },
  {
    id: "circle_of_thorns",
    name: "Circle of Thorns",
    tier: 4,
    text: "AoE. 2 Actions.\nReach: 8. Fill every empty adjacent space around creature with a growth of thorns. Creatures who enter the area must make a DEX save or take KEY d6 damage and become Restrained; on save, half damage only. lasts up to 1 min or until it has dealt damage 3 times.",
  },
  {
    id: "terror",
    name: "Terror",
    tier: 5,
    text: "Single Target. 2 Actions.\nReach: 8. Damage: LVL ×1d4 (ignoring armor). Advantage for each Affliction on the target.",
  },
] as const;

export const HEXBINDER_CLASS_FEATURES: ClassFeature[] = [
  {
    id: "hexbinder_hex",
    level: 1,
    name: "Hex",
    description: "Reach 4, Action: 1d4+LVL damage, OR apply an Affliction on hit instead. On crit: do both.\n\nAfflictions. You know the Withered and Frenzied Afflictions.",
    requires_choice: false,
  },
  {
    id: "hexbinder_mana_tier1",
    level: 2,
    name: "Mana and Tier 1 Spells",
    description: "You unlock tier 1 Hexbinder spells and a mana pool to cast them. Your mana pool is always equal to WIL+LVL and recharges on a Safe Rest.\n\nDiminution. Reduce the mana cost of spells by 1 for each condition chosen.\n• Humble. The Range/Reach of the spell is halved.\n• Vex. Roll with disadvantage (or enemies save with advantage).\n• Slow. Spend 1 additional action (can't be used with Reaction spells).\n\nYou can choose each condition only once per spell, and can't choose an effect that a spell does not have (e.g., Humble on a spell with no Range/Reach).",
    requires_choice: false,
  },
  {
    id: "hexbinder_subclass",
    level: 3,
    name: "Hexbinder Subclass",
    description: "Choose a Hexbinder subclass.\n\nConsult the BONES. 1/Safe Rest. Spend 10 minutes performing a ceremony to obtain information not otherwise available to you on a successful Insight check, rolled with disadvantage.\n\nAfflictions (3). Choose a 3rd Affliction.",
    requires_choice: true,
    choice_type: "single",
    choice_count: 1,
    options: [
      { id: "hunt", name: "Coven of the Hunt" },
      { id: "hex", name: "Coven of the Hex" },
    ],
  },
  {
    id: "hexbinder_mystic_mark_1",
    level: 4,
    name: "Mystic Mark",
    description: "Choose 1 Mystic Mark.\n\nTier 2 Spells. You may now cast tier 2 Hexbinder spells.\n\nKey Stat Increase. +1 INT or WIL.",
    requires_choice: true,
    choice_type: "single",
    choice_count: 1,
    options: MYSTIC_MARKS.map(m => ({ id: m.id, name: m.name, description: m.text })),
  },
  {
    id: "hexbinder_soothsayer_1",
    level: 5,
    name: "Soothsayer",
    description: "Whenever combat begins, roll a Futuresight Die (1d6). Expend it to add or subtract the rolled value from any die a creature within Reach 4 rolls during this encounter.\n\nChanging Dice. As usual, if a Primary Die is reduced to 1, it misses; if increased to its max value, it crits.",
    requires_choice: false,
  },
  {
    id: "hexbinder_blightwielder_touch",
    level: 5,
    name: "Blightwielder's Touch",
    description: "Gain advantage with Hex at Reach 1.\n\nSecondary Stat Increase. +1 STR or DEX.",
    requires_choice: false,
  },
  {
    id: "hexbinder_mystic_mark_2",
    level: 6,
    name: "Mystic Mark (2)",
    description: "Choose a 2nd Mystic Mark.\n\nTier 3 Spells. You may now cast tier 3 Hexbinder spells.",
    requires_choice: true,
    choice_type: "single",
    choice_count: 1,
    options: MYSTIC_MARKS.map(m => ({ id: m.id, name: m.name, description: m.text })),
  },
  {
    id: "hexbinder_subclass_feature_7",
    level: 7,
    name: "Subclass",
    description: "Gain your Hexbinder subclass feature.\n\nAfflictions (4). Choose a 4th Affliction.",
    requires_choice: false,
  },
  {
    id: "hexbinder_tier4_spells",
    level: 8,
    name: "Tier 4 Spells",
    description: "You may now cast tier 4 Hexbinder spells.\n\nKey Stat Increase. +1 INT or WIL.",
    requires_choice: false,
  },
  {
    id: "hexbinder_mystic_mark_3",
    level: 9,
    name: "Mystic Mark (3)",
    description: "Choose a 3rd Mystic Mark.\n\nSecondary Stat Increase. +1 STR or DEX.",
    requires_choice: true,
    choice_type: "single",
    choice_count: 1,
    options: MYSTIC_MARKS.map(m => ({ id: m.id, name: m.name, description: m.text })),
  },
  {
    id: "hexbinder_soothsayer_2",
    level: 10,
    name: "Soothsayer (2)",
    description: "Roll 2 Futuresight Dice instead, they have Reach 8.\n\nTier 5 Spells. You may now cast tier 5 Hexbinder spells.",
    requires_choice: false,
  },
  {
    id: "hexbinder_subclass_feature_11",
    level: 11,
    name: "Subclass",
    description: "Gain your Hexbinder subclass feature.",
    requires_choice: false,
  },
  {
    id: "hexbinder_mystic_mark_4",
    level: 12,
    name: "Mystic Mark (4)",
    description: "Choose a 4th Mystic Mark.\n\nAfflictions (5). Choose a 5th Affliction.\n\nKey Stat Increase. +1 INT or WIL.",
    requires_choice: true,
    choice_type: "single",
    choice_count: 1,
    options: MYSTIC_MARKS.map(m => ({ id: m.id, name: m.name, description: m.text })),
  },
  {
    id: "hexbinder_misery_maker",
    level: 13,
    name: "Misery Maker",
    description: "Increase the max number of Afflictions you can apply by 1.\n\nSecondary Stat Increase. +1 STR or DEX.",
    requires_choice: false,
  },
  {
    id: "hexbinder_soothsayer_3",
    level: 14,
    name: "Soothsayer (3)",
    description: "Roll your Futuresight Dice with advantage.",
    requires_choice: false,
  },
  {
    id: "hexbinder_subclass_feature_15",
    level: 15,
    name: "Subclass",
    description: "Gain your Hexbinder subclass feature.",
    requires_choice: false,
  },
  {
    id: "hexbinder_mystic_mark_5",
    level: 16,
    name: "Mystic Mark (5)",
    description: "Choose a 5th Mystic Mark.\n\nKey Stat Increase. +1 INT or WIL.",
    requires_choice: true,
    choice_type: "single",
    choice_count: 1,
    options: MYSTIC_MARKS.map(m => ({ id: m.id, name: m.name, description: m.text })),
  },
  {
    id: "hexbinder_soothsayer_4",
    level: 17,
    name: "Soothsayer (4)",
    description: "Increase your Futuresight Dice to d8s.\n\nSecondary Stat Increase. +1 STR or DEX.",
    requires_choice: false,
  },
  {
    id: "hexbinder_doombringer",
    level: 18,
    name: "Doombringer",
    description: "You may spend 1 mana to ignore the Doomed Affliction's encounter limit.",
    requires_choice: false,
  },
  {
    id: "hexbinder_epic_boon",
    level: 19,
    name: "Epic Boon",
    description: "Choose an Epic Boon (see pg. 23 of the GM's Guide).",
    requires_choice: false,
  },
  {
    id: "hexbinder_sage_of_banes",
    level: 20,
    name: "Sage of Banes",
    description: "Increase any 2 stats by 1. Hex and Misery apply 1 additional Affliction.",
    requires_choice: false,
  },
];

// Subclass: Coven of the Hunt
export const HUNT_SUBCLASS_FEATURES = [
  {
    id: "hunt_familiar",
    name: "Hexbinder's Familiar",
    level: 3,
    subclassId: "hunt",
    subclassName: "Coven of the Hunt",
    description: "Choose any small animal to become your familiar (owl, cat, rooster, fox, etc.) Your familiar retains any abilities the animal has, can speak to you, and will generally obey your commands (though it may refuse instructions that would put it in danger). Choose 1 Familiar Boon that it grants to you:\n\n• Protective. Acts as a shield that grants +WIL armor.\n• Resourceful. +INT max Hit Dice, these can be given to any ally.\n• Sly. +WIL Initiative. When you roll Initiative, regain 2 mana (this expires at the end of combat if unused).\n• Scavenger. Gain 3xWIL temp HP when you roll Initiative.\n• Mystical. You can cast spells from an ally's position INT times/encounter.\n• Swift. You may move WIL spaces for free on each of your turns.",
  },
  {
    id: "hunt_bind_malady",
    name: "Bind Malady",
    level: 7,
    subclassId: "hunt",
    subclassName: "Coven of the Hunt",
    description: "Reaction. INT/Safe Rest. Command your familiar to remove any single harmful condition from a creature within Reach 8.\n\nHarmful Conditions. Ending 'Dying' grants 1 HP, ending 'Dazed' grants 1 action, etc.",
  },
  {
    id: "hunt_empowered_familiar",
    name: "Empowered Familiar",
    level: 11,
    subclassId: "hunt",
    subclassName: "Coven of the Hunt",
    description: "Choose a 2nd Familiar Boon.",
  },
  {
    id: "hunt_mighty_familiar",
    name: "Mighty Familiar",
    level: 15,
    subclassId: "hunt",
    subclassName: "Coven of the Hunt",
    description: "Choose a 3rd Familiar Boon.",
  },
];

// Subclass: Coven of the Hex
export const HEX_SUBCLASS_FEATURES = [
  {
    id: "hex_haunted",
    name: "Haunted",
    level: 3,
    subclassId: "hex",
    subclassName: "Coven of the Hex",
    description: "When an Afflicted creature dies, apply all of their Afflictions to another enemy within Reach 8 of them.",
  },
  {
    id: "hex_spitecurse",
    name: "Spitecurse",
    level: 7,
    subclassId: "hex",
    subclassName: "Coven of the Hex",
    description: "When an Afflicted creature misses an attack, they suffer the damage instead.",
  },
  {
    id: "hex_cursespitter",
    name: "Cursespitter",
    level: 11,
    subclassId: "hex",
    subclassName: "Coven of the Hex",
    description: "Learn the Pestilent Affliction, double its Reach.",
  },
  {
    id: "hex_hexcaster",
    name: "Hexcaster",
    level: 15,
    subclassId: "hex",
    subclassName: "Coven of the Hex",
    description: "Your Enfeebled Affliction also Dazes the target. You can inflict Doomed 2/encounter.",
  },
];

export const HEXBINDER_SUBCLASS_FEATURES = [
  ...HUNT_SUBCLASS_FEATURES,
  ...HEX_SUBCLASS_FEATURES,
];
