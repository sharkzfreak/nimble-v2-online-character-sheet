export const SPELLSHAPER_ABILITIES = [
  {
    id: 'dimensional-compression',
    name: "Dimensional Compression",
    description: "(1 or more mana) +4 range to a spell for each additional mana spent.",
    category: "Spellshaper"
  },
  {
    id: 'echo-casting',
    name: "Echo Casting",
    description: "(2× mana, min. 1 mana) When you cast a tiered, single-target spell, you may cast a copy of that spell on a 2nd target for free.",
    category: "Spellshaper"
  },
  {
    id: 'elemental-destruction',
    name: "Elemental Destruction",
    description: "(1 or more mana) After you hit with a spell, you may spend 1 or more mana (up to your WIL) to reroll 1 die per mana spent.",
    category: "Spellshaper"
  },
  {
    id: 'elemental-transmutation',
    name: "Elemental Transmutation",
    description: "(1 mana) Change the damage type of a spell to: Fire, Ice, Lightning, Necrotic, or Radiant.",
    category: "Spellshaper"
  },
  {
    id: 'extra-dimensional-vision',
    name: "Extra-Dimensional Vision",
    description: "(2 mana) You may ignore the line of sight requirement at tier 4. Your spell will phase through barriers and obstacles to reach a target you know of within range.",
    category: "Spellshaper"
  },
  {
    id: 'methodical-spellweaver',
    name: "Methodical Spellweaver",
    description: "(-2 mana) Spend 1 additional action to reduce the mana cost of a spell by 2 (min 1).",
    category: "Spellshaper"
  },
  {
    id: 'precise-casting',
    name: "Precise Casting",
    description: "(1+ mana) Choose 1 creature per mana spent to be unaffected by a spell you cast.",
    category: "Spellshaper"
  },
  {
    id: 'stretch-time',
    name: "Stretch Time",
    description: "(2 mana) Reduce the action cost of a spell by 1 (min 1).",
    category: "Spellshaper"
  }
];

export const CONTROL_TABLE = [
  {
    id: 'i-insist',
    name: "I INSIST",
    description: "Cast a cantrip for free, ignoring all disadvantage; it cannot miss."
  },
  {
    id: 'elemental-affliction',
    name: "ELEMENTAL AFFLICTION",
    description: "A creature of your choice within 12 spaces gains the Charged, Smoldering, or Slowed condition."
  },
  {
    id: 'no',
    name: "NO",
    description: "Choose a creature; it cannot harm a creature of your choice during its next turn."
  },
  {
    id: 'lose-control',
    name: "LOSE CONTROL",
    description: "Do ALL of the above, but the GM chooses each time."
  }
];

export const MAGE_CLASS_FEATURES = [
  {
    id: 'elemental-spellcasting',
    level: 1,
    name: "Elemental Spellcasting",
    description: "You know Fire, Ice, and Lightning cantrips.",
    requires_choice: false
  },
  {
    id: 'mana-and-tier-1-spells',
    level: 2,
    name: "Mana and Unlock Tier 1 Spells",
    description: "You unlock tier 1 Fire, Ice, and Lightning spells and gain a mana pool to cast these spells. This mana pool's maximum is always equal to (INT×3)+LVL and recharges on a Safe Rest.",
    requires_choice: false
  },
  {
    id: 'talented-researcher',
    level: 2,
    name: "Talented Researcher",
    description: "Gain advantage on Arcana or Lore checks when you have access to a large amount of books and time to study them.",
    requires_choice: false
  },
  {
    id: 'mage-subclass-3',
    level: 3,
    name: "Subclass",
    description: "Choose a Mage subclass.",
    requires_choice: true
  },
  {
    id: 'elemental-mastery',
    level: 3,
    name: "Elemental Mastery",
    description: "Learn the Utility Spells from 1 spell school you know.\n\nStudy! Whenever you study arcane books or are tutored by a higher level Mage during a Safe Rest, you may choose different Mage options available to you.",
    requires_choice: false
  },
  {
    id: 'spellshaper-4',
    level: 4,
    name: "Spellshaper",
    description: "You gain the ability to enhance your spells with powerful effects by spending additional mana. Choose 2 Spellshaper abilities.",
    requires_choice: true,
    options: SPELLSHAPER_ABILITIES
  },
  {
    id: 'tier-2-spells',
    level: 4,
    name: "Tier 2 Spells",
    description: "You may now cast tier 2 spells and upcast spells at tier 2.",
    requires_choice: false
  },
  {
    id: 'key-stat-increase-4',
    level: 4,
    name: "Key Stat Increase",
    description: "+1 INT or WIL.",
    requires_choice: true
  },
  {
    id: 'elemental-surge',
    level: 5,
    name: "Elemental Surge",
    description: "A surge of adrenaline and your attunement with the elements grants you additional power as combat begins. When you roll Initiative, regain WIL mana (this expires at the end of combat if unused).",
    requires_choice: false
  },
  {
    id: 'secondary-stat-increase-5',
    level: 5,
    name: "Secondary Stat Increase",
    description: "+1 STR or DEX.",
    requires_choice: true
  },
  {
    id: 'upgraded-cantrips-5',
    level: 5,
    name: "Upgraded Cantrips",
    description: "Your cantrips grow stronger.",
    requires_choice: false
  },
  {
    id: 'tier-3-spells',
    level: 6,
    name: "Tier 3 Spells",
    description: "You may now cast tier 3 spells and upcast spells at tier 3.",
    requires_choice: false
  },
  {
    id: 'elemental-mastery-6',
    level: 6,
    name: "Elemental Mastery (2)",
    description: "Learn the Utility Spells from a 2nd spell school you know.",
    requires_choice: false
  },
  {
    id: 'mage-subclass-7',
    level: 7,
    name: "Subclass",
    description: "Gain your Mage subclass feature.",
    requires_choice: false
  },
  {
    id: 'tier-4-spells',
    level: 8,
    name: "Tier 4 Spells",
    description: "You may now cast tier 4 spells and upcast spells at tier 4.",
    requires_choice: false
  },
  {
    id: 'key-stat-increase-8',
    level: 8,
    name: "Key Stat Increase",
    description: "+1 INT or WIL.",
    requires_choice: true
  },
  {
    id: 'spellshaper-9',
    level: 9,
    name: "Spellshaper (2)",
    description: "Choose 1 additional Spellshaper ability.",
    requires_choice: true,
    options: SPELLSHAPER_ABILITIES
  },
  {
    id: 'secondary-stat-increase-9',
    level: 9,
    name: "Secondary Stat Increase",
    description: "+1 STR or DEX.",
    requires_choice: true
  },
  {
    id: 'elemental-surge-10',
    level: 10,
    name: "Elemental Surge (2)",
    description: "Your Elemental Surge ability now regains WIL+1d4 mana.",
    requires_choice: false
  },
  {
    id: 'tier-5-spells',
    level: 10,
    name: "Tier 5 Spells",
    description: "You may now cast tier 5 spells and upcast spells at tier 5.",
    requires_choice: false
  },
  {
    id: 'upgraded-cantrips-10',
    level: 10,
    name: "Upgraded Cantrips",
    description: "Your cantrips grow stronger.",
    requires_choice: false
  },
  {
    id: 'mage-subclass-11',
    level: 11,
    name: "Subclass",
    description: "Gain your Mage subclass feature.",
    requires_choice: false
  },
  {
    id: 'tier-6-spells',
    level: 12,
    name: "Tier 6 Spells",
    description: "You may now cast tier 6 spells and upcast spells at tier 6.",
    requires_choice: false
  },
  {
    id: 'key-stat-increase-12',
    level: 12,
    name: "Key Stat Increase",
    description: "+1 INT or WIL.",
    requires_choice: true
  },
  {
    id: 'spellshaper-13',
    level: 13,
    name: "Spellshaper (3)",
    description: "Choose 1 additional Spellshaper ability.",
    requires_choice: true,
    options: SPELLSHAPER_ABILITIES
  },
  {
    id: 'secondary-stat-increase-13',
    level: 13,
    name: "Secondary Stat Increase",
    description: "+1 STR or DEX.",
    requires_choice: true
  },
  {
    id: 'tier-7-spells',
    level: 14,
    name: "Tier 7 Spells",
    description: "You may now cast tier 7 spells and upcast spells at tier 7.",
    requires_choice: false
  },
  {
    id: 'elemental-mastery-14',
    level: 14,
    name: "Elemental Mastery (3)",
    description: "Learn the Utility Spells from a 3rd spell school you know.",
    requires_choice: false
  },
  {
    id: 'mage-subclass-15',
    level: 15,
    name: "Subclass",
    description: "Gain your Mage subclass feature.",
    requires_choice: false
  },
  {
    id: 'upgraded-cantrips-15',
    level: 15,
    name: "Upgraded Cantrips",
    description: "Your cantrips grow stronger.",
    requires_choice: false
  },
  {
    id: 'tier-8-spells',
    level: 16,
    name: "Tier 8 Spells",
    description: "You may now cast tier 8 spells and upcast spells at tier 8.",
    requires_choice: false
  },
  {
    id: 'key-stat-increase-16',
    level: 16,
    name: "Key Stat Increase",
    description: "+1 INT or WIL.",
    requires_choice: true
  },
  {
    id: 'elemental-surge-17',
    level: 17,
    name: "Elemental Surge (3)",
    description: "Your Elemental Surge ability now regains WIL+2d4 mana.",
    requires_choice: false
  },
  {
    id: 'secondary-stat-increase-17',
    level: 17,
    name: "Secondary Stat Increase",
    description: "+1 STR or DEX.",
    requires_choice: true
  },
  {
    id: 'tier-9-spells',
    level: 18,
    name: "Tier 9 Spells",
    description: "You may now cast tier 9 spells and upcast spells at tier 9.",
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
    id: 'archmage',
    level: 20,
    name: "Archmage",
    description: "+1 to any 2 of your stats. The first tiered spell you cast each encounter costs 1 action less and 5 fewer mana.",
    requires_choice: false
  },
  {
    id: 'upgraded-cantrips-20',
    level: 20,
    name: "Upgraded Cantrips",
    description: "Your cantrips grow stronger.",
    requires_choice: false
  }
];

export const CONTROL_SUBCLASS_FEATURES = [
  {
    id: 'force-of-will',
    level: 3,
    name: "Force of Will",
    subclassName: "Invoker of Control",
    description: "(1/round) On your turn, you may Demand Control: Choose 1 option from the Control Table which you haven't chosen yet, resets when you roll Initiative, or when you have chosen each at least once.\n\nDeny Fate. Whenever you miss with a spell or an effect you cause is saved against, you MUST Demand Control."
  },
  {
    id: 'at-any-cost',
    level: 7,
    name: "At Any Cost",
    subclassName: "Invoker of Control",
    description: "Learn 1 cantrip and 1 tiered spell from the Necrotic school.\n\nNullify. (1/encounter) Ignore all disadvantage and other negative effects on your next action this turn, then Demand Control."
  },
  {
    id: 'steel-will',
    level: 11,
    name: "Steel Will",
    subclassName: "Invoker of Control",
    description: "(1/Safe Rest) Whenever you would fail a save, you may succeed instead. Whenever you roll a 1 on an Elemental Surge die, you may reroll it once."
  },
  {
    id: 'supreme-control',
    level: 15,
    name: "Supreme Control",
    subclassName: "Invoker of Control",
    description: "Whenever you Demand Control, you may choose to trigger the selected option twice. You may Demand Control as a Reaction."
  }
];

export const CHAOS_SUBCLASS_FEATURES = [
  {
    id: 'force-of-chaos',
    level: 3,
    name: "Force of Chaos",
    subclassName: "Invoker of Chaos",
    description: "Whenever you cast a spell, you can choose to spend 1 less mana. Whenever you roll a crit, Invoke Chaos: Roll on the Chaos Table.\n\nWhere's the Chaos Table? It's a secret for the GM only! Suffice it to say, rolling a 1 is really bad, but rolling a 20 is AWESOME--but if you're sure you want to spell it, you can find it on the back inside cover of the GM's Guide. Let chaos reign!"
  },
  {
    id: 'tempest-mage',
    level: 7,
    name: "Tempest Mage",
    subclassName: "Invoker of Chaos",
    description: "Learn 1 cantrip and 1 tiered spell from the Wind school.\n\nChaos Lash. (1/encounter) Reaction (when an enemy moves adjacent to you): They are pushed back 2 spaces, and on a failed WIL save, knocked Prone as well. Invoke Chaos."
  },
  {
    id: 'thrive-in-chaos',
    level: 11,
    name: "Thrive in Chaos",
    subclassName: "Invoker of Chaos",
    description: "Whenever you Invoke Chaos, you may roll twice and cause both effects. (1/Safe Rest) You may choose which roll to use instead."
  },
  {
    id: 'master-of-chaos',
    level: 15,
    name: "Master of Chaos",
    subclassName: "Invoker of Chaos",
    description: "Whenever you Invoke Chaos, roll with advantage."
  }
];

export const MAGE_SUBCLASS_FEATURES = [
  ...CONTROL_SUBCLASS_FEATURES,
  ...CHAOS_SUBCLASS_FEATURES
];
