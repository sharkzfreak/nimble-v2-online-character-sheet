// Shepherd Class Features
import { ClassFeature } from './classFeatures';
import { SubclassFeature } from './subclassFeatures';

export interface ClassAbility {
  id: string;
  name: string;
  description: string;
}

// Sacred Graces - Core Shepherd Abilities
export const SACRED_GRACES: ClassAbility[] = [
  {
    id: "assist_me_my_friend",
    name: "Assist Me, My Friend!",
    description: "Whenever you make your first melee attack each round, you may add your Lifebinding Spirit's damage to your weapon attack instead.",
  },
  {
    id: "empowered_companion",
    name: "Empowered Companion",
    description: "Whenever you spend mana to call forth your Lifebinding Spirit, you cast it as if you spent 1 additional mana (ignoring the typical spell tier restrictions). The maximum die rolled is d20.",
  },
  {
    id: "guiding_spirit",
    name: "Guiding Spirit",
    description: "When your Lifebinding Spirit rolls a 6 or higher on its damage die, the target begins to glow with radiant light. The next attack against that target has advantage.",
  },
  {
    id: "hasty_companion",
    name: "Hasty Companion",
    description: "+4 Reach for your Lifebinding Spirit. It can also act for free when summoned.",
  },
  {
    id: "illuminate_soul",
    name: "Illuminate Soul",
    description: "Action: A creature within 6 spaces begins to glow with radiant light. For 1 Round, attacks against them are made with your weapon instead of against armor.",
  },
  {
    id: "light_bearer",
    name: "Light Bearer",
    description: "Regain 1 use of Searing Light when you roll Initiative (this expires if unspent at the end of combat).",
  },
  {
    id: "not_beyond_my_reach",
    name: "Not Beyond MY Reach",
    description: "You may target creatures who have been dead less than 1 round for healing. For every 10 HP a dead creature is healed this way, you may have them recover 1 Wound instead (you must heal at least 1 Wound to bring them back).",
  },
  {
    id: "vengeful_spirit",
    name: "Vengeful Spirit",
    description: "Action: Your Lifebinding Spirit sacrifices itself to transform into a being wreathed in radiant light. At the end of your turn, it damages all enemies within 3 spaces of you, ignoring armor and cover. This lasts for a number of rounds equal to the healing charges left on the Lifebinding Spirit. This effect ends early if you summon your spirit again.",
  },
];

// Main Class Features
export const SHEPHERD_CLASS_FEATURES: ClassFeature[] = [
  {
    id: "shepherd_level_1_keeper",
    name: "Keeper of Life & Death",
    level: 1,
    description: "You know Radiant and Necrotic cantrips.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_1_searing_light",
    name: "Searing Light",
    level: 1,
    description: "(WIL times/Safe Rest) Action: Heal or inflict grievous injuries:\n• Heal d8 HP to a Dying creature within Reach 6, OR:\n• Inflict WIL d8 radiant damage to an undead or Bloodied enemy within Reach 6.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_2_mana",
    name: "Mana and Unlock Tier 1 Spells",
    level: 2,
    description: "You unlock tier 1 Radiant and Necrotic spells and gain a mana pool. Spell uses per day is maximized at (WIL×3)+LVL and recharges on a Safe Rest.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_2_lifebinding_spirit",
    name: "Lifebinding Spirit",
    level: 2,
    description: "(Radiant Spell, Tier 1)\n\n• Action: Summon a spirit companion that follows you and is immune to harm. It lasts until you cast this spell again, take a Safe Rest, or it heals a number of times equal to the mana you spent summoning it.\n• Action: It attacks or heals a creature within Reach 4. It attacks for 1d6+WIL radiant damage (ignoring armor), or heals for the same amount.\n• Upcasting: Increment its die size by 1 (max d12), +1 healing use.\n\nFlavor is Free: Your Lifebinding Spirit can take the form of any small/tiny friendly animal or similar creature (dog, lamb, rabbit, sparrow, etc.). Make sure you give your little buddy a name, too! Outside of combat, your companion is a cute 'lil pet it can sit on your shoulders harmlessly and briefly move away from you (though it cannot speak).\n\nRushed Attacks and My Companion? You and your companion use the same action pool, but count as different creatures. So you can each attack once without Rushed Attacks every round. Teamwork! (see pg. 13 of the Core Rules)",
    requires_choice: false,
  },
  {
    id: "shepherd_level_3_subclass",
    name: "Subclass",
    level: 3,
    description: "Choose a Shepherd subclass.\n\nServe: After spending a day tending to a sacred place or serving others during a Safe Rest, you may choose different Shepherd options available to you.",
    requires_choice: true,
    choice_type: 'single',
    choice_count: 1,
    options: [
      { id: "mercy", name: "Luminary of Mercy", description: "Enhanced healing and protection for allies" },
      { id: "malice", name: "Luminary of Malice", description: "Powerful offensive abilities and life draining" },
    ],
  },
  {
    id: "shepherd_level_3_master_of_twilight",
    name: "Master of Twilight",
    level: 3,
    description: "Choose 1 Necrotic and 1 Radiant Utility Spell.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_4_tier_2",
    name: "Tier 2 Spells",
    level: 4,
    description: "You may now cast tier 2 spells and upcast spells at tier 2.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_4_key_stat",
    name: "Key Stat Increase",
    level: 4,
    description: "+1 WIL or STR.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_5_secondary",
    name: "Secondary Stat Increase",
    level: 5,
    description: "+1 INT or DEX.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_5_cantrips",
    name: "Upgraded Cantrips",
    level: 5,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_5_sacred_grace",
    name: "Sacred Grace",
    level: 5,
    description: "Choose 2 Sacred Graces.\n\nServe: After spending a day tending to a sacred place or serving others during a Safe Rest, you may choose different Shepherd options available to you.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_6_tier_3",
    name: "Tier 3 Spells",
    level: 6,
    description: "You may now cast tier 3 spells and upcast spells at tier 3.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_6_master_2",
    name: "Master of Twilight (2)",
    level: 6,
    description: "Choose a 2nd Necrotic and Radiant Utility Spell.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_7_subclass",
    name: "Subclass",
    level: 7,
    description: "Gain your Shepherd subclass feature.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_8_tier_4",
    name: "Tier 4 Spells",
    level: 8,
    description: "You may now cast tier 4 spells and upcast spells at tier 4.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_8_key_stat",
    name: "Key Stat Increase",
    level: 8,
    description: "+1 WIL or STR.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_9_sacred_grace_2",
    name: "Sacred Grace (2)",
    level: 9,
    description: "Choose a 3rd Sacred Grace.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_9_secondary",
    name: "Secondary Stat Increase",
    level: 9,
    description: "+1 INT or DEX.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_10_tier_5",
    name: "Tier 5 Spells",
    level: 10,
    description: "You may now cast tier 5 spells and upcast spells at tier 5.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_10_cantrips",
    name: "Upgraded Cantrips",
    level: 10,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_11_subclass",
    name: "Subclass",
    level: 11,
    description: "Gain your Shepherd subclass feature.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_11_master_3",
    name: "Master of Twilight (3)",
    level: 11,
    description: "You know all Necrotic and Radiant Utility Spells.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_12_tier_6",
    name: "Tier 6 Spells",
    level: 12,
    description: "You may now cast tier 6 spells and upcast spells at tier 6.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_12_key_stat",
    name: "Key Stat Increase",
    level: 12,
    description: "+1 WIL or STR.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_13_sacred_grace_3",
    name: "Sacred Grace (3)",
    level: 13,
    description: "Choose a 4th Sacred Grace.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_13_secondary",
    name: "Secondary Stat Increase",
    level: 13,
    description: "+1 INT or DEX.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_14_tier_7",
    name: "Tier 7 Spells",
    level: 14,
    description: "You may now cast tier 7 spells and upcast spells at tier 7.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_15_subclass",
    name: "Subclass",
    level: 15,
    description: "Gain your Shepherd subclass feature.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_15_cantrips",
    name: "Upgraded Cantrips",
    level: 15,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_16_tier_8",
    name: "Tier 8 Spells",
    level: 16,
    description: "You may now cast tier 8 spells and upcast spells at tier 8.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_16_key_stat",
    name: "Key Stat Increase",
    level: 16,
    description: "+1 WIL or STR.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_17_revitalizing",
    name: "Revitalizing Blessing",
    level: 17,
    description: "(1/round) Whenever you roll a 6 or higher on one or more healing die, the target may recover one Wound.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_17_secondary",
    name: "Secondary Stat Increase",
    level: 17,
    description: "+1 INT or DEX.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_18_tier_9",
    name: "Tier 9 Spells",
    level: 18,
    description: "You may now cast tier 9 spells and upcast spells at tier 9.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_19_epic_boon",
    name: "Epic Boon",
    level: 19,
    description: "Choose an Epic Boon (see pg. 23 of the GM's Guide).",
    requires_choice: false,
  },
  {
    id: "shepherd_level_20_twilight_sage",
    name: "Twilight Sage",
    level: 20,
    description: "+1 to any 2 of your stats. Your Lifebinding Spirit rolls twice as many dice.",
    requires_choice: false,
  },
  {
    id: "shepherd_level_20_cantrips",
    name: "Upgraded Cantrips",
    level: 20,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
];

// Luminary of Mercy Subclass Features
export const MERCY_SUBCLASS_FEATURES: SubclassFeature[] = [
  {
    id: "mercy_merciful_healing",
    name: "Merciful Healing",
    level: 3,
    subclassId: "mercy",
    subclassName: "Luminary of Mercy",
    description: "When an effect caused by you heals a Dying creature, they are healed for an additional 1d6 HP (bound lifebinding Spirit can act for free while you are Dying).\n\nLife is Beautiful: Harmless and lovely creatures such as butterflies and charming lights are attracted to your presence and often follow you. Flowers bloom more vibrantly in your presence.",
  },
  {
    id: "mercy_conduit_of_light",
    name: "Conduit of Light",
    level: 7,
    subclassId: "mercy",
    subclassName: "Luminary of Mercy",
    description: "When an effect caused by you would heal HP, you may expend 1 use of Searing Light to heal (or damage, ignoring armor) another target within 6 spaces for the same amount.",
  },
  {
    id: "mercy_powerful_healer",
    name: "Powerful Healer",
    level: 11,
    subclassId: "mercy",
    subclassName: "Luminary of Mercy",
    description: "(WIL times/Safe Rest) Whenever you would roll dice to heal damage, you may instead heal the max amount you could roll, or give that many temp HP.",
  },
  {
    id: "mercy_empowered_conduit",
    name: "Empowered Conduit",
    level: 15,
    subclassId: "mercy",
    subclassName: "Luminary of Mercy",
    description: "Your Conduit of Light may target 1 additional creature. Regain 1 charge of Searing Light when you roll Initiative (this expires if unspent at the end of combat).",
  },
];

// Luminary of Malice Subclass Features
export const MALICE_SUBCLASS_FEATURES: SubclassFeature[] = [
  {
    id: "malice_soul_reaper",
    name: "Soul Reaper",
    level: 3,
    subclassId: "malice",
    subclassName: "Luminary of Malice",
    description: "When you use Searing Light to harm an enemy, make a 2nd enemy within range take the same amount of damage (ignoring armor).\n\nHarbinger of Decay: Vibrant colors and lovely smells are suppressed near you. Foods spoil more quickly while in your presence, and you frequently awaken to flies circling you. You may have your Lifebinding Spirit shift into a deathly version of itself (a zombie dog, a devious imp, etc.) and have its damage type become necrotic.",
  },
  {
    id: "malice_veilwalkers_blessing",
    name: "Veilwalker's Blessing",
    level: 7,
    subclassId: "malice",
    subclassName: "Luminary of Malice",
    description: "(1/Safe Rest) Reaction (when you would drop to 0 HP): Drop to 1 HP instead and force an enemy within 6 spaces to make a STR save. On a failure, they become Bloodied, or if they are already Bloodied, they drop to 0 HP.",
  },
  {
    id: "malice_deathbringers_touch",
    name: "Deathbringer's Touch",
    level: 11,
    subclassId: "malice",
    subclassName: "Luminary of Malice",
    description: "Your first melee attack each round against a Bloodied creature is an automatic critical hit. Your Lifebinding Spirit deals additional damage equal to your STR.",
  },
  {
    id: "malice_conduit_of_death",
    name: "Conduit of Death",
    level: 15,
    subclassId: "malice",
    subclassName: "Luminary of Malice",
    description: "Your Veilwalker's Blessing ability recharges when you roll Initiative. This charge is lost if unspent at the end of combat.",
  },
];

export const SHEPHERD_SUBCLASS_FEATURES = [
  ...MERCY_SUBCLASS_FEATURES,
  ...MALICE_SUBCLASS_FEATURES,
];
