// Shadowmancer Class Features
import { ClassFeature } from './classFeatures';
import { SubclassFeature } from './subclassFeatures';

export interface ClassAbility {
  id: string;
  name: string;
  description: string;
}

// Lesser Shadow Invocations
export const LESSER_INVOCATIONS: ClassAbility[] = [
  {
    id: "abhorrent_speech",
    name: "Abhorrent Speech",
    description: "You can communicate with horrible creatures (aberrations, etc.).",
  },
  {
    id: "beguiling_influence",
    name: "Beguiling Influence",
    description: "(1/day) You may reroll an Influence check.",
  },
  {
    id: "blood_sight",
    name: "Blood Sight",
    description: "(1/day) You may reroll an Examination check. Additionally, you can detect traces of blood on a surface, even after it has been cleaned.",
  },
  {
    id: "devoted_acolyte",
    name: "Devoted Acolyte",
    description: "Learn 2 of the following languages: Abyssal, Draconic, Deep Speech, Infernal, or Primordial. Advantage on Lore checks related to those 2 languages.",
  },
  {
    id: "eldritch_sense",
    name: "Eldritch Sense",
    description: "You can sense the presence of any shapechanger or creature concealed by magic while within 6 spaces of them.",
  },
  {
    id: "gaze_of_two_minds",
    name: "Gaze of Two Minds",
    description: "Touch a willing creature and perceive through its senses for as long as you hold concentration.",
  },
  {
    id: "knowledge_from_beyond",
    name: "Knowledge from Beyond",
    description: "Whenever you fail an Insight or Arcana check, you may suffer 1 Wound to succeed instead.",
  },
  {
    id: "my_favored_pet",
    name: "My Favored Pet",
    description: "One shadow minion can beguilingly tolerate you outside of combat. It can (very creepily) do any menial task a below average commoner could.",
  },
  {
    id: "voice_of_the_dark",
    name: "Voice of the Dark",
    description: "You can communicate telepathically with a humanoid within 6 spaces.",
  },
  {
    id: "whispers_of_the_grave",
    name: "Whispers of the Grave",
    description: "(1/day) You can ask a dead creature 3 yes/no questions. It can never be questioned this way again.",
  },
];

// Greater Shadow Invocations
export const GREATER_INVOCATIONS: ClassAbility[] = [
  {
    id: "armor_of_shadows",
    name: "Armor of Shadows",
    description: "Reduce all damage you receive by an amount equal to the number of minions you have.",
  },
  {
    id: "fiendish_boon",
    name: "Fiendish Boon",
    description: "Increase your DEX or INT by 1. You have 1 fewer maximum HP.",
  },
  {
    id: "hungering_shadows",
    name: "Hungering Shadows",
    description: "Whenever one of your shadows would crit, you may roll instead of rolling damage, you may have any of them deal the maximum. This encounter does not cost a use of Pilfered Power.",
  },
  {
    id: "one_with_shadows",
    name: "One with Shadows",
    description: "Action: When you are in an area of dim light or darkness, you become Invisible until you move or attack.",
  },
  {
    id: "repelling_blast",
    name: "Repelling Blast",
    description: "When you hit a Medium or smaller creature with Shadow Blast, you can push the creature up to 2 spaces away from yourself.",
  },
  {
    id: "shadow_magus",
    name: "Shadow Magus",
    description: "Your minions gain +4 Reach and deal d10 damage instead.",
  },
  {
    id: "shadow_spear",
    name: "Shadow Spear",
    description: "Your Shadow Blast can target creatures twice as far away. When you attack Prone targets with advantage with it (instead of disadvantage).",
  },
  {
    id: "shadow_rush",
    name: "Shadow Rush",
    description: "When your shadow minions attack, instead of rolling damage, you may have any of them deal the maximum, then die.",
  },
  {
    id: "shadow_warp",
    name: "Shadow Warp",
    description: "Action: Switch places with a creature within 12 spaces, both dealt necrotic damage this turn.",
  },
  {
    id: "swarming_shadows",
    name: "Swarming Shadows",
    description: "Whenever one of your shadows would crit, summon another shadow minion adjacent to the target.",
  },
  {
    id: "vengeful_blast",
    name: "Vengeful Blast",
    description: "Whenever a minion dies, you may cast Shadow Blast as a reaction (even if you already cast it this turn).",
  },
];

// Main Class Features
export const SHADOWMANCER_CLASS_FEATURES: ClassFeature[] = [
  {
    id: "shadowmancer_level_1_conduit",
    name: "Conduit of Shadow",
    level: 1,
    description: "Your Patron grants you knowledge of:\n\nShadow Blast. (Necrotic cantrip) Action: (1/turn) Range: 8. Damage: 1d12+KEY. High Levels: +1d12 damage every 5 levels.\n\nSummon Shadows. (Necrotic cantrip) High Levels: +1 Reach every 5 levels.\n• Action: Summon a shadow minion within Reach 1 (you can summon a max of INT or LVL minions this way, whichever is lower).\n• Action: (1/turn) Command ALL of your minions to move 6 then attack (Reach 1, 1d12 each).\n\nShadow Minions. Your shadow minions follow the normal minion rules: they have 1 HP, no damage bonus, and do not make saves. You and your minions are different creatures, so you can attack once and command them to attack without suffering the Rushed Attack penalty! (see pg. 13 of the Core Rules)",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_2_master_of_darkness",
    name: "Master of Darkness",
    level: 2,
    description: "Your Patron grants you knowledge of Necrotic cantrips and tier 1 spells.\n\nPilfered Power. You may steal power from your patron to cast tiered spells, always casting them at the highest tier unlocked. You can do this DEX times/Safe Rest; your patron takes notice. Each time you exceed this limit, your patron damages you for half your max HP as recompense. This limit resets when you commune with your patron during a Safe Rest.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_3_pact",
    name: "THE PACT IS SEALED",
    level: 3,
    description: "Choose a subclass and 1 Lesser Shadow Invocation.\n\nSupplicate. Whenever you commune with your Patron on a Safe Rest, you may beg them to allow you to choose different Shadowmancer options (they may ask for something in return).",
    requires_choice: true,
    choice_type: 'single',
    choice_count: 1,
    options: [
      { id: "red_dragon", name: "Pact of the Red Dragon", description: "Knowledge of Fire spells and draconic power" },
      { id: "abyssal_depths", name: "Pact of the Abyssal Depths", description: "Knowledge of Ice spells and underwater breathing" },
    ],
  },
  {
    id: "shadowmancer_level_4_key_stat",
    name: "Key Stat Increase",
    level: 4,
    description: "+1 INT or DEX.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_4_gift_1",
    name: "A Gift from the Master",
    level: 4,
    description: "Choose 1 Greater Shadow Invocation.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_5_tier_2",
    name: "Tier 2 Spells",
    level: 5,
    description: "You may now cast tier 2 spells; all of your spells are cast at this tier.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_5_cantrips",
    name: "Upgraded Cantrips",
    level: 5,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_5_secondary",
    name: "Secondary Stat Increase",
    level: 5,
    description: "+1 STR or WIL.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_6_gift_2",
    name: "A Gift from the Master (2)",
    level: 6,
    description: "Choose a 2nd Greater Shadow Invocation.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_6_shadowmastery",
    name: "Shadowmastery",
    level: 6,
    description: "Choose 1 Necrotic Utility Spell.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_7_subclass",
    name: "Subclass",
    level: 7,
    description: "Gain your Shadowmancer subclass feature.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_7_tier_3",
    name: "Tier 3 Spells",
    level: 7,
    description: "You may now cast tier 3 spells; all of your spells are cast at this tier.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_8_key_stat",
    name: "Key Stat Increase",
    level: 8,
    description: "+1 INT or DEX.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_8_lesser",
    name: "Lesser Invocation",
    level: 8,
    description: "Choose a 2nd Lesser Shadow Invocation.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_8_shadowmastery_2",
    name: "Shadowmastery (2)",
    level: 8,
    description: "Choose a 2nd Necrotic Utility Spell.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_9_gift_3",
    name: "A Gift from the Master (3)",
    level: 9,
    description: "Choose a 3rd Greater Shadow Invocation.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_9_secondary",
    name: "Secondary Stat Increase",
    level: 9,
    description: "+1 STR or WIL.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_10_tier_4",
    name: "Tier 4 Spells",
    level: 10,
    description: "You may now cast tier 4 spells; all of your spells are cast at this tier.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_10_cantrips",
    name: "Upgraded Cantrips",
    level: 10,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_11_subclass",
    name: "Subclass",
    level: 11,
    description: "Gain your Shadowmancer subclass feature.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_11_lesser_2",
    name: "Lesser Invocation (2)",
    level: 11,
    description: "Choose a 3rd Lesser Shadow Invocation.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_12_greedy_pact",
    name: "Greedy Pact",
    level: 12,
    description: "When you would take damage from Pilfer Power, make a STR save:\n• 1-9: Suffer damage as normal.\n• 10-19: Suffer only 10 HP of damage.\n• 20+: Suffer no damage and cast the spell as if it were 1 tier higher.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_12_key_stat",
    name: "Key Stat Increase",
    level: 12,
    description: "+1 INT or DEX.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_13_tier_5",
    name: "Tier 5 Spells",
    level: 13,
    description: "You may now cast tier 5 spells; all of your spells are cast at this tier.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_13_secondary",
    name: "Secondary Stat Increase",
    level: 13,
    description: "+1 STR or WIL.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_14_gift_4",
    name: "A Gift from the Master (4)",
    level: 14,
    description: "Choose a 4th Greater Shadow Invocation.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_14_shadowmastery_3",
    name: "Shadowmastery (3)",
    level: 14,
    description: "You know all Necrotic Utility Spells.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_15_subclass",
    name: "Subclass",
    level: 15,
    description: "Gain your Shadowmancer subclass feature.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_15_cantrips",
    name: "Upgraded Cantrips",
    level: 15,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_16_tier_6",
    name: "Tier 6 Spells",
    level: 16,
    description: "You may now cast tier 6 spells; all of your spells are cast at this tier.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_16_key_stat",
    name: "Key Stat Increase",
    level: 16,
    description: "+1 INT or DEX.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_17_dire_shadows",
    name: "Dire Shadows",
    level: 17,
    description: "Attacks against your shadow minions are made with disadvantage. They take no damage from successful saves.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_17_secondary",
    name: "Secondary Stat Increase",
    level: 17,
    description: "+1 STR or WIL.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_18_gift_5",
    name: "A Gift from the Master (5)",
    level: 18,
    description: "Choose a 5th Greater Shadow Invocation.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_19_epic_boon",
    name: "Epic Boon",
    level: 19,
    description: "Choose an Epic Boon (see pg. 23 of the GM's Guide).",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_19_tier_7",
    name: "Tier 7 Spells",
    level: 19,
    description: "You may now cast tier 7 spells; all of your spells are cast at this tier.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_20_eldritch_usurper",
    name: "Eldritch Usurper",
    level: 20,
    description: "+1 to any 2 of your stats. Whenever you summon a single shadow minion, summon 2 instead. They die only when they receive 12 or more damage at one time.",
    requires_choice: false,
  },
  {
    id: "shadowmancer_level_20_cantrips",
    name: "Upgraded Cantrips",
    level: 20,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
];

// Pact of the Red Dragon Subclass Features
export const RED_DRAGON_SUBCLASS_FEATURES: SubclassFeature[] = [
  {
    id: "red_dragon_draconic_rite",
    name: "Draconic Crimson Rite",
    level: 3,
    subclassId: "red_dragon",
    subclassName: "Pact of the Red Dragon",
    description: "Your Patron grants you knowledge of Fire spells. Your shadow minions are burning dragon wyrmling shadows. Your Shadow Blast and minions can deal fire or necrotic damage and inflict Smoldering whenever they would crit.",
  },
  {
    id: "red_dragon_well_all_burn",
    name: "We'll ALL Burn!",
    level: 7,
    subclassId: "red_dragon",
    subclassName: "Pact of the Red Dragon",
    description: "You may cast Pyroclasm without Pilfering Power by including yourself in the damage. You have advantage on the save. Choose 1 Fire Utility Spell.",
  },
  {
    id: "red_dragon_heart_of_fire",
    name: "Heart of Burning Fire",
    level: 11,
    subclassId: "red_dragon",
    subclassName: "Pact of the Red Dragon",
    description: "Regain 1 use of Pilfered Power each time you roll Initiative. This expires at the end of combat if unused.",
  },
  {
    id: "red_dragon_enveloped",
    name: "Enveloped by the Master",
    level: 15,
    subclassId: "red_dragon",
    subclassName: "Pact of the Red Dragon",
    description: "Gain 1d4 Wounds to cast Dragonform.",
  },
];

// Pact of the Abyssal Depths Subclass Features
export const ABYSSAL_DEPTHS_SUBCLASS_FEATURES: SubclassFeature[] = [
  {
    id: "abyssal_depths_nightfrost",
    name: "Master of Nightfrost",
    level: 3,
    subclassId: "abyssal_depths",
    subclassName: "Pact of the Abyssal Depths",
    description: "Your Patron grants you knowledge of Ice spells. Gain the ability to breathe underwater. Your shadow minions become beings of nightfrost. Your shadow blast and minions can deal cold or necrotic damage, and whenever they would crit, you gain INT temp HP.",
  },
  {
    id: "abyssal_depths_shadowfrost",
    name: "Shadowfrost",
    level: 7,
    subclassId: "abyssal_depths",
    subclassName: "Pact of the Abyssal Depths",
    description: "Your Shadow Blast also Slows. You can cast Cryosleep or Rimeblades without Pilfering Power by expending 10 temp HP. Choose 1 Ice Utility Spell.",
  },
  {
    id: "abyssal_depths_glacial_resilience",
    name: "Glacial Resilience",
    level: 11,
    subclassId: "abyssal_depths",
    subclassName: "Pact of the Abyssal Depths",
    description: "(1/Safe Rest) Reaction (whenever you are attacked or would gain a condition): gain 10×LVL temp HP and end ALL negative conditions on yourself. At the start of your next turn, any remaining temp HP are lost.",
  },
  {
    id: "abyssal_depths_cryomancers_reprisal",
    name: "Cryomancer's Reprisal",
    level: 15,
    subclassId: "abyssal_depths",
    subclassName: "Pact of the Abyssal Depths",
    description: "Pay half your max HP to cast ANY Ice spell. After casting an Ice spell in this way, you gain an invisible aura. The next creature that hits you with a melee attack this encounter takes cold damage equal to half the HP you spent on this casting.",
  },
];

export const SHADOWMANCER_SUBCLASS_FEATURES = [
  ...RED_DRAGON_SUBCLASS_FEATURES,
  ...ABYSSAL_DEPTHS_SUBCLASS_FEATURES,
];
