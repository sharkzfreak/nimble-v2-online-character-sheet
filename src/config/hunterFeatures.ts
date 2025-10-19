export const THRILL_OF_THE_HUNT_ABILITIES = [
  {
    id: 'adding-arrow',
    name: "Adding Arrow",
    description: "Action: Attack with a ranged weapon. The next attack the target makes must be Restrained. Choose before each attack.",
    category: "Thrill of the Hunt"
  },
  {
    id: 'come-get-some',
    name: "Come Get Some!",
    description: "Action: Attack a target. It is Taunted by you until the end of their next turn.",
    category: "Thrill of the Hunt"
  },
  {
    id: 'decoy',
    name: "Decoy",
    description: "When you Defend: The attack misses instead, and you may move 1 to your speed away (where you really were all along!).",
    category: "Thrill of the Hunt"
  },
  {
    id: 'fleet-feet',
    name: "Fleet Feet",
    description: "Move up to your speed for free, ignoring difficult terrain.",
    category: "Thrill of the Hunt"
  },
  {
    id: 'grease-trap',
    name: "Grease Trap",
    description: "(1/encounter) Reaction (when an enemy moves adjacent to you or an ally within 6 spaces): Target them for the attack. It is Vulnerable to the next damage it takes, and is treated as if it is Smoldering.",
    category: "Thrill of the Hunt"
  },
  {
    id: 'hail-of-arrows',
    name: "Hail of Arrows",
    description: "(Half range) 2 actions: Shoot all creatures within a 3×3 area. Their speed is halved until the end of their next turn.",
    category: "Thrill of the Hunt"
  },
  {
    id: 'heavy-shot',
    name: "Heavy Shot",
    description: "(Half range) Action: Attack with a ranged weapon and push your target: 4 spaces for a small creature, 2 for a medium creature, 1 for a large creature.",
    category: "Thrill of the Hunt"
  },
  {
    id: 'incendiary-shot',
    name: "Incendiary Shot",
    description: "(Half range) Action: Attack with a ranged weapon, add WIL d6 fire damage.",
    category: "Thrill of the Hunt"
  },
  {
    id: 'multishot',
    name: "Multishot",
    description: "(Half range) Action: Attack your quarry with a ranged weapon and extra projectile. Select a 2nd target within 2 spaces of them to take the same amount of damage.",
    category: "Thrill of the Hunt"
  },
  {
    id: 'pinning-shot',
    name: "Pinning Shot",
    description: "Spend 3 actions shooting your quarry. They are Restrained until they can escape (DC 10+WIL).",
    category: "Thrill of the Hunt"
  },
  {
    id: 'snare-trap',
    name: "Snare Trap",
    description: "(1/encounter) Reaction (when an enemy moves adjacent to you or an ally within 6 spaces): Move them back 1 space. They are Restrained until they can escape (DC 10+WIL).",
    category: "Thrill of the Hunt"
  },
  {
    id: 'sharpshooter',
    name: "Sharpshooter",
    description: "Action: If you have not moved this turn and your quarry is 4 or more spaces from you, attack them for double damage.",
    category: "Thrill of the Hunt"
  },
  {
    id: 'vital-shot',
    name: "Vital Shot",
    description: "(Half Range) Action: If your quarry is Hampered, your Ranged attacks ignore their armor. If they are unarmored, double your Hunter's Mark bonus damage.",
    category: "Thrill of the Hunt"
  },
  {
    id: 'wild-instinct',
    name: "Wild Instinct",
    description: "(1/round) If you have no TotH charges, assess for free, with advantage.",
    category: "Thrill of the Hunt"
  }
];

export const HUNTER_CLASS_FEATURES = [
  {
    id: 'hunters-mark',
    level: 1,
    name: "Hunter's Mark",
    description: "Action: A creature you can see is marked as your quarry for 1 day (or until you mark another creature). It can't be hidden from you, and your attacks against it gain your choice of advantage OR +1d6 damage (choose before each attack).\n\nForager. Gain advantage on skill checks to find food and water in the wild.",
    requires_choice: false
  },
  {
    id: 'thrill-of-the-hunt-2',
    level: 2,
    name: "Thrill of the Hunt",
    description: "Choose 2 Thrill of the Hunt (TotH) abilities. Gain a charge to use these abilities during that encounter whenever:\n• Your quarry dies.\n• You hit your quarry in melee or crit your quarry at range.",
    requires_choice: true,
    options: THRILL_OF_THE_HUNT_ABILITIES
  },
  {
    id: 'roll-and-strike',
    level: 2,
    name: "Roll & Strike",
    description: "Action: If you have no Thrill of the Hunt charges, move up to your speed toward your quarry. If you can end adjacent to them, make a melee attack against them for free.\n\nRemember the Wild. Whenever you spend a day in the wilderness during a Safe Rest, you may choose different Hunter options available to you.",
    requires_choice: false
  },
  {
    id: 'hunter-subclass-3',
    level: 3,
    name: "Subclass",
    description: "Choose a Hunter subclass.",
    requires_choice: true
  },
  {
    id: 'trackers-intuition',
    level: 3,
    name: "Tracker's Intuition",
    description: "You can discern the events of a past encounter by studying tracks and other subtle environmental clues, accurately determining the Kind and amount of creatures, their direction, key actions, and passage of time.",
    requires_choice: false
  },
  {
    id: 'thrill-of-the-hunt-4',
    level: 4,
    name: "Thrill of the Hunt (2)",
    description: "Choose a 3rd Thrill of the Hunt ability.",
    requires_choice: true,
    options: THRILL_OF_THE_HUNT_ABILITIES
  },
  {
    id: 'key-stat-increase-4',
    level: 4,
    name: "Key Stat Increase",
    description: "+1 DEX or WIL.",
    requires_choice: true
  },
  {
    id: 'explorer-of-the-wilds',
    level: 4,
    name: "Explorer of the Wilds",
    description: "+2 speed; gain a climbing speed.",
    requires_choice: false
  },
  {
    id: 'hunters-resolve',
    level: 5,
    name: "Hunter's Resolve",
    description: "Whenever you have no Thrill of the Hunt charges, gain Hunter's Resolve until out of combat: All creatures as your quarry for the purposes of movement and melee attacks.",
    requires_choice: false
  },
  {
    id: 'final-takedown',
    level: 5,
    name: "Final Takedown",
    description: "Action: Spend 1 Thrill of the Hunt charge to make a melee attack against your Bloodied quarry. Turn it into a crit and double the damage of your Hunter's Mark. If they survive, they crit you back.",
    requires_choice: false
  },
  {
    id: 'secondary-stat-increase-5',
    level: 5,
    name: "Secondary Stat Increase",
    description: "+1 STR or INT.",
    requires_choice: true
  },
  {
    id: 'versatile-bowmaster',
    level: 6,
    name: "Versatile Bowmaster",
    description: "Whenever you attack with a Longbow, you may roll 2d4 instead of 1d8, or with a Crossbow, 2d8 instead of 4d4.",
    requires_choice: false
  },
  {
    id: 'thrill-of-the-hunt-6',
    level: 6,
    name: "Thrill of the Hunt (3)",
    description: "Choose a 4th Thrill of the Hunt ability.",
    requires_choice: true,
    options: THRILL_OF_THE_HUNT_ABILITIES
  },
  {
    id: 'hunter-subclass-7',
    level: 7,
    name: "Subclass",
    description: "Gain your Hunter subclass feature.",
    requires_choice: false
  },
  {
    id: 'thrill-of-the-hunt-8',
    level: 8,
    name: "Thrill of the Hunt (4)",
    description: "Choose a 5th Thrill of the Hunt ability.",
    requires_choice: true,
    options: THRILL_OF_THE_HUNT_ABILITIES
  },
  {
    id: 'key-stat-increase-8',
    level: 8,
    name: "Key Stat Increase",
    description: "+1 DEX or WIL.",
    requires_choice: true
  },
  {
    id: 'no-escape',
    level: 9,
    name: "No Escape",
    description: "Whenever you see one or more allies make an opportunity attack, you may also make a ranged opportunity attack against the same target.",
    requires_choice: false
  },
  {
    id: 'secondary-stat-increase-9',
    level: 9,
    name: "Secondary Stat Increase",
    description: "+1 STR or INT.",
    requires_choice: true
  },
  {
    id: 'veteran-stalker',
    level: 10,
    name: "Veteran Stalker",
    description: "Gain a Thrill of the Hunt charge whenever you are first Bloodied in an encounter and for every Wound you gain.",
    requires_choice: false
  },
  {
    id: 'keen-eye-steady-hand',
    level: 10,
    name: "Keen Eye, Steady Hand",
    description: "Add WIL to your ranged weapon damage.",
    requires_choice: false
  },
  {
    id: 'hunter-subclass-11',
    level: 11,
    name: "Subclass",
    description: "Gain your Hunter subclass feature.",
    requires_choice: false
  },
  {
    id: 'thrill-of-the-hunt-12',
    level: 12,
    name: "Thrill of the Hunt (5)",
    description: "Choose a 6th Thrill of the Hunt ability.",
    requires_choice: true,
    options: THRILL_OF_THE_HUNT_ABILITIES
  },
  {
    id: 'key-stat-increase-12',
    level: 12,
    name: "Key Stat Increase",
    description: "+1 DEX or WIL.",
    requires_choice: true
  },
  {
    id: 'keen-sight',
    level: 13,
    name: "Keen Sight",
    description: "Advantage on Perception checks.",
    requires_choice: false
  },
  {
    id: 'secondary-stat-increase-13',
    level: 13,
    name: "Secondary Stat Increase",
    description: "+1 STR or INT.",
    requires_choice: true
  },
  {
    id: 'thrill-of-the-hunt-14',
    level: 14,
    name: "Thrill of the Hunt (6)",
    description: "Choose a 7th Thrill of the Hunt ability.",
    requires_choice: true,
    options: THRILL_OF_THE_HUNT_ABILITIES
  },
  {
    id: 'hunter-subclass-15',
    level: 15,
    name: "Subclass",
    description: "Gain your Hunter subclass feature.",
    requires_choice: false
  },
  {
    id: 'key-stat-increase-16',
    level: 16,
    name: "Key Stat Increase",
    description: "+1 DEX or WIL.",
    requires_choice: true
  },
  {
    id: 'peerless-hunter',
    level: 17,
    name: "Peerless Hunter",
    description: "You can Defend against your quarry for free.",
    requires_choice: false
  },
  {
    id: 'secondary-stat-increase-17',
    level: 17,
    name: "Secondary Stat Increase",
    description: "+1 STR or INT.",
    requires_choice: true
  },
  {
    id: 'wild-endurance',
    level: 18,
    name: "Wild Endurance",
    description: "Gain 1 Thrill of the Hunt charge at the start of your turns.",
    requires_choice: false
  },
  {
    id: 'epic-boon-19',
    level: 19,
    name: "Epic Boon",
    description: "Choose an Epic Boon (see pg. 23 of the GM's Guide).",
    requires_choice: true
  },
  {
    id: 'nemesis',
    level: 20,
    name: "Nemesis",
    description: "+1 to any 2 of your stats. Your Hunter's Mark can target any number of creatures simultaneously.",
    requires_choice: false
  }
];

export const SHADOWPATH_SUBCLASS_FEATURES = [
  {
    id: 'ambusher',
    level: 3,
    name: "Ambusher",
    subclassName: "Keeper of the Shadowpath",
    description: "When you roll Initiative, you may use Hunter's Mark for free. Gain advantage on the first attack you make each encounter.\n\nSkilled Tracker. You have advantage on skill checks to track creatures.\n\nSkilled Navigator. You cannot become lost by nonmagical means."
  },
  {
    id: 'primal-predator',
    level: 7,
    name: "Primal Predator",
    subclassName: "Keeper of the Shadowpath",
    description: "(1/encounter) Your weapon attacks ignore cover and armor this turn."
  },
  {
    id: 'pack-hunter',
    level: 11,
    name: "Pack Hunter",
    subclassName: "Keeper of the Shadowpath",
    description: "Whenever you mark a creature, you may also mark another creature within 6 spaces of them for free."
  },
  {
    id: 'apex-predator',
    level: 15,
    name: "Apex Predator",
    subclassName: "Keeper of the Shadowpath",
    description: "You may use your Primal Predator ability twice each encounter. Gain 1 Thrill of the Hunt charge when you roll Initiative."
  }
];

export const WILDHEART_SUBCLASS_FEATURES = [
  {
    id: 'impressive-form',
    level: 3,
    name: "Impressive Form",
    subclassName: "Keeper of the Wildheart",
    description: "+5 max HP. Upgrade your Hit Dice to d10s.\n\nI Keep the High Ground. When you roll Initiative or gain one or more Thrill of the Hunt charges, move up to half your speed for free, ignoring difficult terrain."
  },
  {
    id: 'resourceful-herbalist',
    level: 7,
    name: "Resourceful Herbalist",
    subclassName: "Keeper of the Wildheart",
    description: "Whenever you Safe Rest in a location near where plants or fungi can grow, you may spend a day collecting healing herbs to craft a number of Healing Salves equal to 1+ your Naturecraft.\n\nHealing Salve. Action: Heal yourself or an adjacent creature WIL d6 HP. Only you or another experienced Herbalist may administer these, and they expire whenever you Safe Rest."
  },
  {
    id: 'ha-im-over-here',
    level: 11,
    name: "Ha! I'm Over Here!",
    subclassName: "Keeper of the Wildheart",
    description: "(1/Safe Rest) If an attack would cause you to drop to 0 HP, you instead move up to your speed away and take no damage."
  },
  {
    id: 'unparalleled-survivalist',
    level: 15,
    name: "Unparalleled Survivalist",
    subclassName: "Keeper of the Wildheart",
    description: "Gain +WIL armor. When you attack with a ranged weapon, you may first move half your speed for free."
  }
];

export const HUNTER_SUBCLASS_FEATURES = [
  ...SHADOWPATH_SUBCLASS_FEATURES,
  ...WILDHEART_SUBCLASS_FEATURES
];
