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

export const CLASS_FEATURES: ClassFeaturesData = {
  Berserker: [
    {
      id: "berserker_rage",
      name: "Rage",
      level: 1,
      description: "Enter a battle rage as a swift action. While raging, you gain +2 to STR-based attacks and damage, and resistance to physical damage. Rage lasts until end of combat or 1 minute.",
      requires_choice: false,
    },
    {
      id: "berserker_reckless",
      name: "Reckless Attack",
      level: 1,
      description: "When you make your first attack on your turn, you can choose to attack recklessly. Gain advantage on STR attacks this turn, but attacks against you have advantage until your next turn.",
      requires_choice: false,
    },
    {
      id: "berserker_path",
      name: "Berserker Path",
      level: 3,
      description: "Choose your path of rage that defines your combat style.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "path_fury", name: "Path of Fury", description: "Pure destructive power and devastating attacks" },
        { id: "path_champion", name: "Path of the Champion", description: "Tactical battlefield control and leadership" },
        { id: "path_wild", name: "Path of the Wild", description: "Primal instincts and bestial transformations" },
      ],
    },
  ],
  Cheat: [
    {
      id: "cheat_sneak",
      name: "Sneak Attack",
      level: 1,
      description: "Once per turn, deal +1d6 extra damage when you attack with advantage or when an ally is adjacent to your target.",
      requires_choice: false,
    },
    {
      id: "cheat_expertise",
      name: "Expertise",
      level: 1,
      description: "Choose two skills. Double your proficiency bonus for those skills.",
      requires_choice: true,
      choice_type: 'multi',
      choice_count: 2,
      options: [
        { id: "stealth", name: "Stealth" },
        { id: "finesse", name: "Finesse" },
        { id: "perception", name: "Perception" },
        { id: "examination", name: "Examination" },
        { id: "influence", name: "Influence" },
        { id: "insight", name: "Insight" },
      ],
    },
    {
      id: "cheat_archetype",
      name: "Roguish Archetype",
      level: 3,
      description: "Choose your specialty as a cheat and scoundrel.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "thief", name: "Thief", description: "Master of infiltration and quick hands" },
        { id: "assassin", name: "Assassin", description: "Deadly precision and poisoned blades" },
        { id: "arcane_trickster", name: "Arcane Trickster", description: "Magic-enhanced deception and illusions" },
      ],
    },
  ],
  Commander: [
    {
      id: "commander_rally",
      name: "Rally",
      level: 1,
      description: "As an action, grant an ally within 30 feet a bonus action to move or attack. Usable a number of times equal to your WILL modifier per short rest.",
      requires_choice: false,
    },
    {
      id: "commander_fighting_style",
      name: "Fighting Style",
      level: 1,
      description: "Choose your preferred combat style.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "defense", name: "Defense", description: "+1 to Armor while wearing armor" },
        { id: "dueling", name: "Dueling", description: "+2 damage when wielding a single one-handed weapon" },
        { id: "great_weapon", name: "Great Weapon", description: "Reroll 1s and 2s on damage dice with two-handed weapons" },
        { id: "protection", name: "Protection", description: "Impose disadvantage on attacks against nearby allies" },
      ],
    },
    {
      id: "commander_tactics",
      name: "Tactical Superiority",
      level: 3,
      description: "Learn maneuvers that enhance your battlefield control.",
      requires_choice: true,
      choice_type: 'multi',
      choice_count: 2,
      options: [
        { id: "disarm", name: "Disarming Strike", description: "Force target to drop one item" },
        { id: "trip", name: "Trip Attack", description: "Knock target prone on hit" },
        { id: "riposte", name: "Riposte", description: "Make a counterattack when missed" },
        { id: "precision", name: "Precision Attack", description: "Add bonus to attack roll" },
      ],
    },
  ],
  Hunter: [
    {
      id: "hunter_favored_enemy",
      name: "Favored Enemy",
      level: 1,
      description: "Choose a type of creature. Gain +2 to tracking and damage against that enemy type.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "beasts", name: "Beasts" },
        { id: "humanoids", name: "Humanoids" },
        { id: "undead", name: "Undead" },
        { id: "aberrations", name: "Aberrations" },
      ],
    },
    {
      id: "hunter_marksman",
      name: "Marksman",
      level: 1,
      description: "You ignore half and three-quarters cover with ranged attacks, and your ranged attacks have +10 feet range.",
      requires_choice: false,
    },
    {
      id: "hunter_archetype",
      name: "Hunter Archetype",
      level: 3,
      description: "Choose your hunting specialty.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "beast_master", name: "Beast Master", description: "Bond with a loyal animal companion" },
        { id: "stalker", name: "Stalker", description: "Master of ambush and stealth kills" },
        { id: "warden", name: "Warden", description: "Protector of the wild and natural balance" },
      ],
    },
  ],
  Mage: [
    {
      id: "mage_spellcasting",
      name: "Spellcasting",
      level: 1,
      description: "You can cast mage spells using INT as your spellcasting modifier. You know 3 cantrips and 4 level-1 spells.",
      requires_choice: false,
    },
    {
      id: "mage_element",
      name: "Elemental Specialization",
      level: 1,
      description: "Choose your primary element. Spells of that element deal +1 damage per spell level.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "fire", name: "Fire", description: "Flames, explosions, and burning damage" },
        { id: "ice", name: "Ice", description: "Freezing, slowing, and cold damage" },
        { id: "lightning", name: "Lightning", description: "Shocking speed and electric damage" },
      ],
    },
    {
      id: "mage_school",
      name: "Arcane School",
      level: 3,
      description: "Choose your school of magic mastery.",
      requires_choice: true,
      choice_type: 'single',
      choice_count: 1,
      options: [
        { id: "evocation", name: "Evocation", description: "Destructive elemental power" },
        { id: "abjuration", name: "Abjuration", description: "Protective wards and shields" },
        { id: "conjuration", name: "Conjuration", description: "Summoning and teleportation" },
      ],
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
