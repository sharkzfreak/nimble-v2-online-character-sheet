// Nimble v2 Class Features Configuration
// Fallback data structure when PDF parsing is unavailable

export interface FeatureOption {
  id: string;
  name: string;
  description?: string;
}

export interface ClassFeature {
  id: string;
  name: string;
  level: number;
  description: string;
  requires_choice: boolean;
  choice_type?: 'single' | 'multi';
  choice_count?: number;
  options?: FeatureOption[];
  selection?: string[];
}

export interface ClassFeaturesData {
  [className: string]: ClassFeature[];
}

import { CHEAT_CLASS_FEATURES } from "./cheatFeatures";
import { COMMANDER_CLASS_FEATURES } from "./commanderFeatures";
import { HUNTER_CLASS_FEATURES } from "./hunterFeatures";
import { MAGE_CLASS_FEATURES } from "./mageFeatures";

export const CLASS_FEATURES: ClassFeaturesData = {
  Cheat: CHEAT_CLASS_FEATURES,
  Commander: COMMANDER_CLASS_FEATURES,
  Hunter: HUNTER_CLASS_FEATURES,
  Mage: MAGE_CLASS_FEATURES,
  Berserker: [
    {
      id: "berserker_rage_1",
      name: "Rage",
      level: 1,
      description: "(1/turn) Action: Roll a Fury Die (1d4) and set it aside. Add it to every STR attack you make. You can have a max of KEY Fury Dice; they are lost when your Rage ends.\n\nThat all you got?! When you are attacked, you may expend 1 or more Fury Dice to reduce the damage taken by STR+DEX for each die spent.\n\nYour Rage Ends... If you leave combat, drop to 0 HP, or 1 round without attacking or Raging.\n\nTest: You can Rage and gain another Fury Die even if you are already Raging. If you are already at your max, roll as normal and choose one die to discard when calculating damage for monster armor.",
      requires_choice: false,
    },
    {
      id: "berserker_intensifying_fury_2",
      name: "Intensifying Fury",
      level: 2,
      description: "If you are Raging at the beginning of your turn, roll 1 Fury Die for free.",
      requires_choice: false,
    },
    {
      id: "berserker_one_with_ancients",
      name: "One with the Ancients",
      level: 2,
      description: "(1/Safe Rest) When faced with a decision about which direction or course of action to take, you can call upon your ancestors to guide you toward the most dangerous or challenging path.",
      requires_choice: false,
    },
    {
      id: "berserker_subclass",
      name: "Subclass",
      level: 3,
      description: "Choose a Berserker subclass.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "mountainheart", name: "Path of the Mountainheart", description: "Unyielding endurance and stone-like resilience" },
        { id: "red_mist", name: "Path of the Red Mist", description: "Savage awareness and blood-fueled frenzy" },
      ],
    },
    {
      id: "berserker_bloodlust",
      name: "Bloodlust",
      level: 3,
      description: "Expend 1 or more Fury Dice on your turn, move DEX spaces per die spent for free.",
      requires_choice: false,
    },
    {
      id: "berserker_enduring_rage",
      name: "Enduring Rage",
      level: 4,
      description: "While Dying, you Rage automatically for free at the beginning of your turn, have a max of 2 actions instead of 1, and ignore the STR saves to make attacks.",
      requires_choice: false,
    },
    {
      id: "berserker_key_stat_4",
      name: "Key Stat Increase",
      level: 4,
      description: "+1 STR or DEX.",
      requires_choice: false,
    },
    {
      id: "berserker_savage_arsenal_4",
      name: "Savage Arsenal",
      level: 4,
      description: "Choose 1 ability from the Savage Arsenal.\n\nWrath & Ruin: Whenever you perform a notable act of destruction or feat of strength during a Safe Rest, you may choose different Berserker options available to you.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "death_blow", name: "Death Blow", description: "After you deal damage from a crit, you may expend any number of Fury Dice, form the dice and deal double that amount of damage." },
        { id: "deathless_rage", name: "Deathless Rage", description: "(1/turn) While Dying, you may suffer 1 Wound to gain 1 action." },
        { id: "eager_for_battle", name: "Eager for Battle", description: "Gain advantage on Initiative. Move 2×DEX spaces for free on your first turn each encounter." },
        { id: "into_the_fray", name: "Into the Fray", description: "Action: Leap up to 2×DEX spaces toward an enemy. If you land adjacent to at least 2 enemies, make an attack against 1 of them for free." },
        { id: "mighty_endurance", name: "Mighty Endurance", description: "You can now survive an additional 4 Wounds before death." },
        { id: "more_blood", name: "MORE BLOOD!", description: "Whenever an enemy crits you, gain 1 Fury Die." },
        { id: "rampage", name: "Rampage", description: "(1/turn) After you land a hit, you may treat your next attack this turn as if you rolled that same amount instead of rolling again." },
        { id: "swift_fury", name: "Swift Fury", description: "Whenever you gain one or more Fury Dice, move up to DEX spaces for free. Ignore difficult terrain." },
        { id: "thunderous_steps", name: "Thunderous Steps", description: "After moving at least 4 spaces while Raging, you may deal STR Bludgeoning damage to all adjacent creatures where you stop." },
        { id: "unstoppable_force", name: "Unstoppable Force", description: "While Dying and Raging, taking damage causes 1 Wound (instead of 2) and critical hits inflict 2 Wounds (instead of 3)." },
        { id: "whirlwind", name: "Whirlwind", description: "2 actions: Attack ALL targets within your melee weapon's reach." },
        { id: "youre_next", name: "You're Next!", description: "Action: While Raging, you can make a Might skill check to demoralize an enemy within Reach 12 (DC: their current HP). On a success, they immediately flee the battle." },
      ],
    },
    {
      id: "berserker_rage_5",
      name: "Rage (2)",
      level: 5,
      description: "Whenever you Rage, gain 2 Fury Dice instead.",
      requires_choice: false,
    },
    {
      id: "berserker_secondary_stat_5",
      name: "Secondary Stat Increase",
      level: 5,
      description: "+1 INT or WIL.",
      requires_choice: false,
    },
    {
      id: "berserker_savage_arsenal_6",
      name: "Savage Arsenal (2)",
      level: 6,
      description: "Choose a 2nd Savage Arsenal ability.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "death_blow", name: "Death Blow", description: "After you deal damage from a crit, you may expend any number of Fury Dice, form the dice and deal double that amount of damage." },
        { id: "deathless_rage", name: "Deathless Rage", description: "(1/turn) While Dying, you may suffer 1 Wound to gain 1 action." },
        { id: "eager_for_battle", name: "Eager for Battle", description: "Gain advantage on Initiative. Move 2×DEX spaces for free on your first turn each encounter." },
        { id: "into_the_fray", name: "Into the Fray", description: "Action: Leap up to 2×DEX spaces toward an enemy. If you land adjacent to at least 2 enemies, make an attack against 1 of them for free." },
        { id: "mighty_endurance", name: "Mighty Endurance", description: "You can now survive an additional 4 Wounds before death." },
        { id: "more_blood", name: "MORE BLOOD!", description: "Whenever an enemy crits you, gain 1 Fury Die." },
        { id: "rampage", name: "Rampage", description: "(1/turn) After you land a hit, you may treat your next attack this turn as if you rolled that same amount instead of rolling again." },
        { id: "swift_fury", name: "Swift Fury", description: "Whenever you gain one or more Fury Dice, move up to DEX spaces for free. Ignore difficult terrain." },
        { id: "thunderous_steps", name: "Thunderous Steps", description: "After moving at least 4 spaces while Raging, you may deal STR Bludgeoning damage to all adjacent creatures where you stop." },
        { id: "unstoppable_force", name: "Unstoppable Force", description: "While Dying and Raging, taking damage causes 1 Wound (instead of 2) and critical hits inflict 2 Wounds (instead of 3)." },
        { id: "whirlwind", name: "Whirlwind", description: "2 actions: Attack ALL targets within your melee weapon's reach." },
        { id: "youre_next", name: "You're Next!", description: "Action: While Raging, you can make a Might skill check to demoralize an enemy within Reach 12 (DC: their current HP). On a success, they immediately flee the battle." },
      ],
    },
    {
      id: "berserker_intensifying_fury_6",
      name: "Intensifying Fury (2)",
      level: 6,
      description: "Your Fury Dice are now d6s.",
      requires_choice: false,
    },
    {
      id: "berserker_subclass_7",
      name: "Subclass",
      level: 7,
      description: "Gain your Berserker subclass feature.",
      requires_choice: false,
    },
    {
      id: "berserker_savage_arsenal_8",
      name: "Savage Arsenal (3)",
      level: 8,
      description: "Choose a 3rd Savage Arsenal ability.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "death_blow", name: "Death Blow", description: "After you deal damage from a crit, you may expend any number of Fury Dice, form the dice and deal double that amount of damage." },
        { id: "deathless_rage", name: "Deathless Rage", description: "(1/turn) While Dying, you may suffer 1 Wound to gain 1 action." },
        { id: "eager_for_battle", name: "Eager for Battle", description: "Gain advantage on Initiative. Move 2×DEX spaces for free on your first turn each encounter." },
        { id: "into_the_fray", name: "Into the Fray", description: "Action: Leap up to 2×DEX spaces toward an enemy. If you land adjacent to at least 2 enemies, make an attack against 1 of them for free." },
        { id: "mighty_endurance", name: "Mighty Endurance", description: "You can now survive an additional 4 Wounds before death." },
        { id: "more_blood", name: "MORE BLOOD!", description: "Whenever an enemy crits you, gain 1 Fury Die." },
        { id: "rampage", name: "Rampage", description: "(1/turn) After you land a hit, you may treat your next attack this turn as if you rolled that same amount instead of rolling again." },
        { id: "swift_fury", name: "Swift Fury", description: "Whenever you gain one or more Fury Dice, move up to DEX spaces for free. Ignore difficult terrain." },
        { id: "thunderous_steps", name: "Thunderous Steps", description: "After moving at least 4 spaces while Raging, you may deal STR Bludgeoning damage to all adjacent creatures where you stop." },
        { id: "unstoppable_force", name: "Unstoppable Force", description: "While Dying and Raging, taking damage causes 1 Wound (instead of 2) and critical hits inflict 2 Wounds (instead of 3)." },
        { id: "whirlwind", name: "Whirlwind", description: "2 actions: Attack ALL targets within your melee weapon's reach." },
        { id: "youre_next", name: "You're Next!", description: "Action: While Raging, you can make a Might skill check to demoralize an enemy within Reach 12 (DC: their current HP). On a success, they immediately flee the battle." },
      ],
    },
    {
      id: "berserker_key_stat_8",
      name: "Key Stat Increase",
      level: 8,
      description: "+1 STR or DEX.",
      requires_choice: false,
    },
    {
      id: "berserker_intensifying_fury_9",
      name: "Intensifying Fury (3)",
      level: 9,
      description: "Your Fury Dice are now d8s.",
      requires_choice: false,
    },
    {
      id: "berserker_secondary_stat_9",
      name: "Secondary Stat Increase",
      level: 9,
      description: "+1 INT or WIL.",
      requires_choice: false,
    },
    {
      id: "berserker_savage_arsenal_10",
      name: "Savage Arsenal (4)",
      level: 10,
      description: "Choose a 4th Savage Arsenal ability.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "death_blow", name: "Death Blow", description: "After you deal damage from a crit, you may expend any number of Fury Dice, form the dice and deal double that amount of damage." },
        { id: "deathless_rage", name: "Deathless Rage", description: "(1/turn) While Dying, you may suffer 1 Wound to gain 1 action." },
        { id: "eager_for_battle", name: "Eager for Battle", description: "Gain advantage on Initiative. Move 2×DEX spaces for free on your first turn each encounter." },
        { id: "into_the_fray", name: "Into the Fray", description: "Action: Leap up to 2×DEX spaces toward an enemy. If you land adjacent to at least 2 enemies, make an attack against 1 of them for free." },
        { id: "mighty_endurance", name: "Mighty Endurance", description: "You can now survive an additional 4 Wounds before death." },
        { id: "more_blood", name: "MORE BLOOD!", description: "Whenever an enemy crits you, gain 1 Fury Die." },
        { id: "rampage", name: "Rampage", description: "(1/turn) After you land a hit, you may treat your next attack this turn as if you rolled that same amount instead of rolling again." },
        { id: "swift_fury", name: "Swift Fury", description: "Whenever you gain one or more Fury Dice, move up to DEX spaces for free. Ignore difficult terrain." },
        { id: "thunderous_steps", name: "Thunderous Steps", description: "After moving at least 4 spaces while Raging, you may deal STR Bludgeoning damage to all adjacent creatures where you stop." },
        { id: "unstoppable_force", name: "Unstoppable Force", description: "While Dying and Raging, taking damage causes 1 Wound (instead of 2) and critical hits inflict 2 Wounds (instead of 3)." },
        { id: "whirlwind", name: "Whirlwind", description: "2 actions: Attack ALL targets within your melee weapon's reach." },
        { id: "youre_next", name: "You're Next!", description: "Action: While Raging, you can make a Might skill check to demoralize an enemy within Reach 12 (DC: their current HP). On a success, they immediately flee the battle." },
      ],
    },
    {
      id: "berserker_subclass_11",
      name: "Subclass",
      level: 11,
      description: "Gain your Berserker subclass feature.",
      requires_choice: false,
    },
    {
      id: "berserker_savage_arsenal_12",
      name: "Savage Arsenal (5)",
      level: 12,
      description: "Choose a 5th Savage Arsenal ability.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "death_blow", name: "Death Blow", description: "After you deal damage from a crit, you may expend any number of Fury Dice, form the dice and deal double that amount of damage." },
        { id: "deathless_rage", name: "Deathless Rage", description: "(1/turn) While Dying, you may suffer 1 Wound to gain 1 action." },
        { id: "eager_for_battle", name: "Eager for Battle", description: "Gain advantage on Initiative. Move 2×DEX spaces for free on your first turn each encounter." },
        { id: "into_the_fray", name: "Into the Fray", description: "Action: Leap up to 2×DEX spaces toward an enemy. If you land adjacent to at least 2 enemies, make an attack against 1 of them for free." },
        { id: "mighty_endurance", name: "Mighty Endurance", description: "You can now survive an additional 4 Wounds before death." },
        { id: "more_blood", name: "MORE BLOOD!", description: "Whenever an enemy crits you, gain 1 Fury Die." },
        { id: "rampage", name: "Rampage", description: "(1/turn) After you land a hit, you may treat your next attack this turn as if you rolled that same amount instead of rolling again." },
        { id: "swift_fury", name: "Swift Fury", description: "Whenever you gain one or more Fury Dice, move up to DEX spaces for free. Ignore difficult terrain." },
        { id: "thunderous_steps", name: "Thunderous Steps", description: "After moving at least 4 spaces while Raging, you may deal STR Bludgeoning damage to all adjacent creatures where you stop." },
        { id: "unstoppable_force", name: "Unstoppable Force", description: "While Dying and Raging, taking damage causes 1 Wound (instead of 2) and critical hits inflict 2 Wounds (instead of 3)." },
        { id: "whirlwind", name: "Whirlwind", description: "2 actions: Attack ALL targets within your melee weapon's reach." },
        { id: "youre_next", name: "You're Next!", description: "Action: While Raging, you can make a Might skill check to demoralize an enemy within Reach 12 (DC: their current HP). On a success, they immediately flee the battle." },
      ],
    },
    {
      id: "berserker_key_stat_12",
      name: "Key Stat Increase",
      level: 12,
      description: "+1 STR or DEX.",
      requires_choice: false,
    },
    {
      id: "berserker_intensifying_fury_13",
      name: "Intensifying Fury (4)",
      level: 13,
      description: "Your Fury Dice are now d10s.",
      requires_choice: false,
    },
    {
      id: "berserker_secondary_stat_13",
      name: "Secondary Stat Increase",
      level: 13,
      description: "+1 INT or WIL.",
      requires_choice: false,
    },
    {
      id: "berserker_savage_arsenal_14",
      name: "Savage Arsenal (6)",
      level: 14,
      description: "Choose a 6th Savage Arsenal ability.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "death_blow", name: "Death Blow", description: "After you deal damage from a crit, you may expend any number of Fury Dice, form the dice and deal double that amount of damage." },
        { id: "deathless_rage", name: "Deathless Rage", description: "(1/turn) While Dying, you may suffer 1 Wound to gain 1 action." },
        { id: "eager_for_battle", name: "Eager for Battle", description: "Gain advantage on Initiative. Move 2×DEX spaces for free on your first turn each encounter." },
        { id: "into_the_fray", name: "Into the Fray", description: "Action: Leap up to 2×DEX spaces toward an enemy. If you land adjacent to at least 2 enemies, make an attack against 1 of them for free." },
        { id: "mighty_endurance", name: "Mighty Endurance", description: "You can now survive an additional 4 Wounds before death." },
        { id: "more_blood", name: "MORE BLOOD!", description: "Whenever an enemy crits you, gain 1 Fury Die." },
        { id: "rampage", name: "Rampage", description: "(1/turn) After you land a hit, you may treat your next attack this turn as if you rolled that same amount instead of rolling again." },
        { id: "swift_fury", name: "Swift Fury", description: "Whenever you gain one or more Fury Dice, move up to DEX spaces for free. Ignore difficult terrain." },
        { id: "thunderous_steps", name: "Thunderous Steps", description: "After moving at least 4 spaces while Raging, you may deal STR Bludgeoning damage to all adjacent creatures where you stop." },
        { id: "unstoppable_force", name: "Unstoppable Force", description: "While Dying and Raging, taking damage causes 1 Wound (instead of 2) and critical hits inflict 2 Wounds (instead of 3)." },
        { id: "whirlwind", name: "Whirlwind", description: "2 actions: Attack ALL targets within your melee weapon's reach." },
        { id: "youre_next", name: "You're Next!", description: "Action: While Raging, you can make a Might skill check to demoralize an enemy within Reach 12 (DC: their current HP). On a success, they immediately flee the battle." },
      ],
    },
    {
      id: "berserker_subclass_15",
      name: "Subclass",
      level: 15,
      description: "Gain your Berserker subclass feature.",
      requires_choice: false,
    },
    {
      id: "berserker_savage_arsenal_16",
      name: "Savage Arsenal (7)",
      level: 16,
      description: "Choose a 7th Savage Arsenal ability.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "death_blow", name: "Death Blow", description: "After you deal damage from a crit, you may expend any number of Fury Dice, form the dice and deal double that amount of damage." },
        { id: "deathless_rage", name: "Deathless Rage", description: "(1/turn) While Dying, you may suffer 1 Wound to gain 1 action." },
        { id: "eager_for_battle", name: "Eager for Battle", description: "Gain advantage on Initiative. Move 2×DEX spaces for free on your first turn each encounter." },
        { id: "into_the_fray", name: "Into the Fray", description: "Action: Leap up to 2×DEX spaces toward an enemy. If you land adjacent to at least 2 enemies, make an attack against 1 of them for free." },
        { id: "mighty_endurance", name: "Mighty Endurance", description: "You can now survive an additional 4 Wounds before death." },
        { id: "more_blood", name: "MORE BLOOD!", description: "Whenever an enemy crits you, gain 1 Fury Die." },
        { id: "rampage", name: "Rampage", description: "(1/turn) After you land a hit, you may treat your next attack this turn as if you rolled that same amount instead of rolling again." },
        { id: "swift_fury", name: "Swift Fury", description: "Whenever you gain one or more Fury Dice, move up to DEX spaces for free. Ignore difficult terrain." },
        { id: "thunderous_steps", name: "Thunderous Steps", description: "After moving at least 4 spaces while Raging, you may deal STR Bludgeoning damage to all adjacent creatures where you stop." },
        { id: "unstoppable_force", name: "Unstoppable Force", description: "While Dying and Raging, taking damage causes 1 Wound (instead of 2) and critical hits inflict 2 Wounds (instead of 3)." },
        { id: "whirlwind", name: "Whirlwind", description: "2 actions: Attack ALL targets within your melee weapon's reach." },
        { id: "youre_next", name: "You're Next!", description: "Action: While Raging, you can make a Might skill check to demoralize an enemy within Reach 12 (DC: their current HP). On a success, they immediately flee the battle." },
      ],
    },
    {
      id: "berserker_key_stat_16",
      name: "Key Stat Increase",
      level: 16,
      description: "+1 STR or DEX.",
      requires_choice: false,
    },
    {
      id: "berserker_intensifying_fury_17",
      name: "Intensifying Fury (5)",
      level: 17,
      description: "Your Fury Dice are now d12s.",
      requires_choice: false,
    },
    {
      id: "berserker_secondary_stat_17",
      name: "Secondary Stat Increase",
      level: 17,
      description: "+1 INT or WIL.",
      requires_choice: false,
    },
    {
      id: "berserker_deep_rage",
      name: "DEEP RAGE",
      level: 18,
      description: "Dropping to 0 HP does not cause your Rage to end.",
      requires_choice: false,
    },
    {
      id: "berserker_epic_boon",
      name: "Epic Boon",
      level: 19,
      description: "Choose an Epic Boon (see pg. 23 of the GM's Guide).",
      requires_choice: false,
    },
    {
      id: "berserker_boundless_rage",
      name: "BOUNDLESS RAGE",
      level: 20,
      description: "+1 to any 2 of your stats. Anytime you roll less than 6 on a Fury Die, change it to 6 instead.",
      requires_choice: false,
    },
  ],
  Oathsworn: [
    {
      id: "oathsworn_lay_hands",
      name: "Lay on Hands",
      level: 1,
      description: "You have a pool of healing power equal to your level × 5. As an action, restore hit points from this pool. Refills on long rest.",
      requires_choice: false,
    },
    {
      id: "oathsworn_fighting_style",
      name: "Fighting Style",
      level: 1,
      description: "Choose your combat approach.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "defense", name: "Defense", description: "+1 to Armor while wearing armor" },
        { id: "dueling", name: "Dueling", description: "+2 damage when wielding a single one-handed weapon" },
        { id: "protection", name: "Protection", description: "Impose disadvantage on attacks against nearby allies" },
      ],
    },
    {
      id: "oathsworn_oath",
      name: "Sacred Oath",
      level: 3,
      description: "Swear an oath that defines your divine purpose.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "devotion", name: "Oath of Devotion", description: "Honesty, courage, and justice" },
        { id: "vengeance", name: "Oath of Vengeance", description: "Punish wickedness and avenge the innocent" },
        { id: "ancients", name: "Oath of the Ancients", description: "Preserve life, light, and joy" },
      ],
    },
  ],
  Shadowmancer: [
    {
      id: "shadowmancer_summon",
      name: "Shadow Minions",
      level: 1,
      description: "As an action, summon 1d4 shadow minions. They have 1 HP, +2 to hit, deal 1d4 damage, and vanish after 1 minute or when reduced to 0 HP.",
      requires_choice: false,
    },
    {
      id: "shadowmancer_darkness",
      name: "Eyes of Night",
      level: 1,
      description: "You have darkvision to 120 feet. As an action, you can create magical darkness in a 15-foot radius for 10 minutes.",
      requires_choice: false,
    },
    {
      id: "shadowmancer_path",
      name: "Shadow Path",
      level: 3,
      description: "Choose how you wield shadow magic.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "horde", name: "Path of the Horde", description: "Summon more and stronger minions" },
        { id: "veil", name: "Path of the Veil", description: "Master illusions and stealth" },
        { id: "void", name: "Path of the Void", description: "Drain life and deal necrotic damage" },
      ],
    },
  ],
  Shepherd: [
    {
      id: "shepherd_companion",
      name: "Faithful Companion",
      level: 1,
      description: "You have a loyal animal or spirit companion that fights alongside you.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "wolf", name: "Wolf", description: "Fast and fierce, pack tactics" },
        { id: "bear", name: "Bear", description: "Tough and strong, high HP" },
        { id: "hawk", name: "Hawk", description: "Flying scout, sharp senses" },
        { id: "panther", name: "Panther", description: "Stealthy ambush predator" },
      ],
    },
    {
      id: "shepherd_healing",
      name: "Healing Touch",
      level: 1,
      description: "You can restore 1d8 + WILL HP to a creature you touch. Usable a number of times equal to your WILL modifier per long rest.",
      requires_choice: false,
    },
    {
      id: "shepherd_circle",
      name: "Shepherd's Circle",
      level: 3,
      description: "Choose your role as a shepherd.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "life", name: "Circle of Life", description: "Enhanced healing and protection" },
        { id: "nature", name: "Circle of Nature", description: "Control plants and beasts" },
        { id: "spirits", name: "Circle of Spirits", description: "Commune with the dead and guide souls" },
      ],
    },
  ],
  Songweaver: [
    {
      id: "songweaver_inspiration",
      name: "Bardic Inspiration",
      level: 1,
      description: "Grant an ally a d6 that they can add to an attack, check, or save within the next 10 minutes. Usable a number of times equal to your WILL modifier per rest.",
      requires_choice: false,
    },
    {
      id: "songweaver_jack",
      name: "Jack of All Trades",
      level: 1,
      description: "Add half your proficiency bonus (rounded down) to any skill check you aren't proficient in.",
      requires_choice: false,
    },
    {
      id: "songweaver_college",
      name: "Bardic College",
      level: 3,
      description: "Choose your college, the style of your performances.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "valor", name: "College of Valor", description: "Inspire warriors with battle hymns" },
        { id: "lore", name: "College of Lore", description: "Keeper of secrets and ancient knowledge" },
        { id: "whispers", name: "College of Whispers", description: "Manipulate and deceive with words" },
      ],
    },
  ],
  Stormshifter: [
    {
      id: "stormshifter_wildshape",
      name: "Wild Shape",
      level: 1,
      description: "Transform into a beast with CR up to 1/4. You retain your mental stats but use the beast's physical stats. Lasts 1 hour or until you revert.",
      requires_choice: false,
    },
    {
      id: "stormshifter_primal",
      name: "Primal Strike",
      level: 1,
      description: "Your beast form attacks count as magical and deal +1d4 lightning or thunder damage (your choice on each hit).",
      requires_choice: false,
    },
    {
      id: "stormshifter_circle",
      name: "Druid Circle",
      level: 3,
      description: "Choose your connection to nature and storm.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "moon", name: "Circle of the Moon", description: "Enhanced wild shape forms and combat prowess" },
        { id: "storm", name: "Circle of the Storm", description: "Call lightning and control weather" },
        { id: "land", name: "Circle of the Land", description: "Deep connection to a specific terrain" },
      ],
    },
  ],
  Zephyr: [
    {
      id: "zephyr_martial_arts",
      name: "Martial Arts",
      level: 1,
      description: "Unarmed strikes deal 1d6 damage and use DEX for attack and damage. After an attack action, make one unarmed strike as a bonus action.",
      requires_choice: false,
    },
    {
      id: "zephyr_ki",
      name: "Ki Points",
      level: 1,
      description: "You have 3 ki points. Spend 1 ki to: Dodge/Dash/Disengage as bonus action, make 2 unarmed strikes as bonus action, or increase jump distance by 20 feet.",
      requires_choice: false,
    },
    {
      id: "zephyr_tradition",
      name: "Monastic Tradition",
      level: 3,
      description: "Choose your monastery's teachings.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "open_hand", name: "Way of the Open Hand", description: "Master of unarmed combat techniques" },
        { id: "shadow", name: "Way of Shadow", description: "Ninja-like stealth and deception" },
        { id: "elements", name: "Way of the Four Elements", description: "Bend fire, water, air, and earth" },
      ],
    },
  ],
};

// Helper to get features for a class by name
export const getClassFeatures = (className: string): ClassFeature[] => {
  return CLASS_FEATURES[className] || [];
};

// Helper to get only features available at a given level
export const getFeaturesAtLevel = (className: string, level: number): ClassFeature[] => {
  return getClassFeatures(className).filter(f => f.level <= level);
};

// Helper to get features unlocked between two levels
export const getFeaturesBetweenLevels = (className: string, fromLevel: number, toLevel: number): ClassFeature[] => {
  return getClassFeatures(className).filter(f => f.level > fromLevel && f.level <= toLevel);
};
