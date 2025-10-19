// Oathsworn Class Features
import { ClassFeature } from './classFeatures';
import { SubclassFeature } from './subclassFeatures';

export interface ClassAbility {
  id: string;
  name: string;
  description: string;
}

// Sacred Decrees - Core Oathsworn Abilities
export const SACRED_DECREES: ClassAbility[] = [
  {
    id: "blinding_aura",
    name: "Blinding Aura",
    description: "(1/Safe Rest) Action: Enemies in your aura are Blinded until the end of their next turn.\n\nDice, roll with advantage (roll one extra and drop the lowest).",
  },
  {
    id: "courage",
    name: "Courage!",
    description: "(1/encounter) When you or an ally in your aura would drop to 0 HP, set their HP to 1 instead.",
  },
  {
    id: "explosive_judgment",
    name: "Explosive Judgment",
    description: "(1/encounter) 2 actions: Expend your Judgment Dice, deal that much radiant damage to all enemies in your aura.",
  },
  {
    id: "improved_aura",
    name: "Improved Aura",
    description: "+2 aura Reach.",
  },
  {
    id: "radiant_aura",
    name: "Radiant Aura",
    description: "Action: End any single harmful condition or effect on yourself or another willing creature within your aura. You may use this ability WIL times/Safe Rest.\n\nHarmful Conditions: Ending 'Dying' grants 1 HP, ending 'Dazed' grants 1 action, etc.",
  },
  {
    id: "reliable_justice",
    name: "Reliable Justice",
    description: "Whenever you roll Judgment Dice, roll with advantage (roll one extra and drop the lowest).",
  },
  {
    id: "shining_mandate",
    name: "Shining Mandate",
    description: "The first time each round you are attacked while you already have Judgment Dice, select an ally within your aura to roll one and apply it to their next attack. You have advantage on skill checks to see through illusions.",
  },
  {
    id: "stand_fast_friends",
    name: "Stand Fast, Friends!",
    description: "When you roll Initiative, grant allies temp HP equal to your STR+WIL. You and allies within your aura have advantage against fear and effects that would move you or knock Prone.",
  },
  {
    id: "unstoppable_protector",
    name: "Unstoppable Protector",
    description: "Gain +1 speed. You may Interpose even if you are restrained, stunned, or otherwise incapacitated. If you Interpose for a non-combatant NPC, you may Interpose again this round.",
  },
  {
    id: "well_armored",
    name: "Well Armored",
    description: "Whenever you Interpose, gain temp HP equal to your STR.",
  },
];

// Main Class Features
export const OATHSWORN_CLASS_FEATURES: ClassFeature[] = [
  {
    id: "oathsworn_level_1_radiant_judgment",
    name: "Radiant Judgment",
    level: 1,
    description: "Whenever an enemy attacks you, if you have no Judgment Dice, roll your Judgment dice (2d6). On your next melee attack this encounter, if you hit, deal that much additional radiant damage. The dice are expended whether you hit or miss.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_1_lay_on_hands",
    name: "Lay on Hands",
    level: 1,
    description: "Gain a magical pool of healing power. This pool's maximum is always equal to 5×LVL and recharges on a Safe Rest. Action: Touch a target and spend any amount of remaining healing power to restore that many HP.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_2_mana_spellcasting",
    name: "Mana and Radiant Spellcasting",
    level: 2,
    description: "You know Radiant cantrips, tier 1 Radiant spells, and gain a mana pool. Your mana pool is equal to WIL + LVL and recharges on a Safe Rest.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_2_zealot",
    name: "Zealot",
    level: 2,
    description: "Whenever you attack with a melee weapon, you may spend mana (up to your highest unlocked spell tier) to choose one for each mana spent:\n\n• Overwhelming Strike. Deal +5 radiant damage.\n• Blessed Aim. Decrease your target's armor by 1 step for this attack.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_2_paragon_of_virtue",
    name: "Paragon of Virtue",
    level: 2,
    description: "Advantage on Influence checks to convince someone when you are forthrightly telling the truth, disadvantage when misleading.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_3_subclass",
    name: "Subclass",
    level: 3,
    description: "Commit yourself to an Oath and gain its benefits.\n\nServe Selflessly. Whenever you perform a notable selfless act during a Safe Rest, you may choose different Oathsworn options available to you.",
    requires_choice: true,
    choice_type: 'single',
    choice_count: 1,
    options: [
      { id: "vengeance", name: "Oath of Vengeance", description: "Aura of Zeal - Roll more Judgment Dice and trigger on allies being attacked" },
      { id: "refuge", name: "Oath of Refuge", description: "Aura of Refuge - Shield gains +WIL armor and you can Interpose anywhere in aura" },
    ],
  },
  {
    id: "oathsworn_level_3_radiant_judgment_2",
    name: "Radiant Judgment (2)",
    level: 3,
    description: "Your Judgment Dice are d8s.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_3_sacred_decree",
    name: "Sacred Decree",
    level: 3,
    description: "Learn 1 Sacred Decree.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_4_my_life_for_friends",
    name: "My Life, for My Friends",
    level: 4,
    description: "You can Interpose for free.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_4_tier_2_spells",
    name: "Tier 2 Spells",
    level: 4,
    description: "You may now cast tier 2 spells and upcast spells at tier 2.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_5",
    name: "Level 5 Advancement",
    level: 5,
    description: "Key Stat Increase. +1 STR or WIL.\n\nRadiant Judgment (3). Your Judgment Dice are d10s.\n\nUpgraded Cantrips. Your cantrips grow stronger.\n\nSecondary Stat Increase. +1 DEX or INT.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_6",
    name: "Level 6 Advancement",
    level: 6,
    description: "Tier 3 Spells. You may now cast tier 3 spells and upcast spells at tier 3.\n\nSacred Decree (2). Learn a 2nd Sacred Decree.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_7",
    name: "Level 7 Advancement",
    level: 7,
    description: "Subclass. Gain your Oathsworn subclass feature.\n\nMaster of Radiance. Choose 1 Radiant Utility Spell.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_8",
    name: "Level 8 Advancement",
    level: 8,
    description: "Tier 4 Spells. You may now cast tier 4 spells and upcast spells at tier 4.\n\nRadiant Judgment (4). Your Judgment Dice are d12s.\n\nKey Stat Increase. +1 STR or WIL.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_9",
    name: "Level 9 Advancement",
    level: 9,
    description: "Sacred Decree (3). Learn a 3rd Sacred Decree.\n\nSecondary Stat Increase. +1 DEX or INT.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_10",
    name: "Level 10 Advancement",
    level: 10,
    description: "Tier 5 Spells. You may now cast tier 5 spells and upcast spells at tier 5.\n\nUpgraded Cantrips. Your cantrips grow stronger.\n\nRadiant Judgment (5). Your Judgment Dice are d20s.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_11",
    name: "Level 11 Advancement",
    level: 11,
    description: "Subclass. Gain your Oathsworn subclass feature.\n\nMaster of Radiance (2). Choose a 2nd Radiant Utility Spell.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_12",
    name: "Level 12 Advancement",
    level: 12,
    description: "Sacred Decree (4). Learn a 4th Sacred Decree.\n\nKey Stat Increase. +1 STR or WIL.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_13",
    name: "Level 13 Advancement",
    level: 13,
    description: "Tier 6 Spells. You may now cast tier 6 spells and upcast spells at tier 6.\n\nSecondary Stat Increase. +1 DEX or INT.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_14",
    name: "Level 14 Advancement",
    level: 14,
    description: "Sacred Decree (5). Learn a 5th Sacred Decree.\n\nRadiant Judgment (6). Whenever you roll Judgment Dice, roll 1 more.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_15",
    name: "Level 15 Advancement",
    level: 15,
    description: "Subclass. Gain your Oathsworn subclass feature.\n\nUpgraded Cantrips. Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_16",
    name: "Level 16 Advancement",
    level: 16,
    description: "Sacred Decree (6). Learn a 6th Sacred Decree.\n\nKey Stat Increase. +1 STR or WIL.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_17",
    name: "Level 17 Advancement",
    level: 17,
    description: "Tier 7 Spells. You may now cast tier 7 spells and upcast spells at tier 7.\n\nSecondary Stat Increase. +1 DEX or INT.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_18",
    name: "Level 18 Advancement",
    level: 18,
    description: "Unending Judgment. While you have no Judgment Dice, gain +5 damage to melee attacks.",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_19",
    name: "Level 19 Advancement",
    level: 19,
    description: "Epic Boon. Choose an Epic Boon (see pg. 23 of the GM's Guide).",
    requires_choice: false,
  },
  {
    id: "oathsworn_level_20",
    name: "Level 20 Advancement",
    level: 20,
    description: "Glorious Paragon. +1 to any 2 of your stats. Defend for free whenever you Interpose.\n\nUpgraded Cantrips. Your cantrips grow stronger.",
    requires_choice: false,
  },
];

// Oath of Vengeance Subclass Features
export const VENGEANCE_SUBCLASS_FEATURES: SubclassFeature[] = [
  {
    id: "vengeance_aura_of_zeal",
    name: "Aura of Zeal",
    level: 3,
    subclassId: "vengeance",
    subclassName: "Oath of Vengeance",
    description: "Whenever you roll Judgment Dice, roll 1 more. Gain an aura with a Reach of 4. Your Radiant Judgment also triggers when an ally within your aura is attacked while you have no Judgment Dice.",
  },
  {
    id: "vengeance_avenger",
    name: "Avenger",
    level: 7,
    subclassId: "vengeance",
    subclassName: "Oath of Vengeance",
    description: "Whenever you or an ally within your aura gain any Wounds, set up to that many Judgment Dice to their max. Then, move up to half your speed for free.",
  },
  {
    id: "vengeance_unerring_judgment",
    name: "Unerring Judgment",
    level: 11,
    subclassId: "vengeance",
    subclassName: "Oath of Vengeance",
    description: "Increase your primary die rolls on melee attacks by 1 whenever you have Judgment Dice.",
  },
  {
    id: "vengeance_maximum_judgment",
    name: "Maximum Judgment",
    level: 15,
    subclassId: "vengeance",
    subclassName: "Oath of Vengeance",
    description: "Whenever you are attacked, set a Judgment Die to its max.",
  },
];

// Oath of Refuge Subclass Features
export const REFUGE_SUBCLASS_FEATURES: SubclassFeature[] = [
  {
    id: "refuge_aura_of_refuge",
    name: "Aura of Refuge",
    level: 3,
    subclassId: "refuge",
    subclassName: "Oath of Refuge",
    description: "Your shields gain +WIL armor and count as your spellcasting focus. Gain an aura with a Reach of 4; you can Interpose for an ally anywhere within your aura.",
  },
  {
    id: "refuge_face_me",
    name: "Face Me, Foul Creature!",
    level: 7,
    subclassId: "refuge",
    subclassName: "Oath of Refuge",
    description: "When you Interpose, the attacking enemy is also Taunted by you until the end of their next turn.",
  },
  {
    id: "refuge_glorious_reprieve",
    name: "Glorious Reprieve",
    level: 11,
    subclassId: "refuge",
    subclassName: "Oath of Refuge",
    description: "You and allies in your aura cannot drop below 1 HP. Whenever this triggers, they gain 1 Wound instead (heroes still die at max Wounds).",
  },
  {
    id: "refuge_divine_grace",
    name: "Divine Grace",
    level: 15,
    subclassId: "refuge",
    subclassName: "Oath of Refuge",
    description: "You are resistant to all damage while Interposing.",
  },
];
