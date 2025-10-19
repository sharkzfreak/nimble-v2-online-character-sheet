export const COMMANDERS_ORDERS = [
  {
    id: 'coordinated-strike',
    name: "Coordinated Strike!",
    description: "(1/round) Free action: you and an ally within 6 spaces both immediately use a weapon to attack a target in range for free. You can do this INT times/Safe Rest.",
    category: "Commander's Order"
  },
  {
    id: 'face-me',
    name: "Face Me!",
    description: "Reaction (after an ally is crit within 12 spaces): Taunt the creature and drop to 0 HP.",
    category: "Commander's Order"
  },
  {
    id: 'hold-the-line',
    name: "Hold the Line!",
    description: "(1/encounter) Reaction (when an ally starts to DROP to 0 HP): Their HP can't continue to drop until the fight! Set their HP to 3× your LVL.",
    category: "Commander's Order"
  },
  {
    id: 'i-can-do-this-all-day',
    name: "I Can Do This ALL DAY!",
    description: "(1/encounter) Reaction (when you would drop to 0 HP): You may expend any number of Hit Dice and set your HP to the sum rolled instead (do not add your STR).",
    category: "Commander's Order"
  },
  {
    id: 'move-it-move-it',
    name: "Move it! Move it!",
    description: "When you roll Initiative you may give yourself and an ally advantage on the roll for +3 speed until 1 round.",
    category: "Commander's Order"
  },
  {
    id: 'reposition',
    name: "Reposition!",
    description: "Action/Reaction (on an ally's turn): Command 1 ally to move up to their speed (or 2 allies up to half their speed) for free.",
    category: "Commander's Order"
  }
];

export const COMBAT_TACTICS = [
  {
    id: 'commanding-presence',
    name: "Commanding Presence",
    description: "Action: Shout a command up to 2 words long at an enemy. On a failed WIL save (DC 10+STR), they must spend their entire next turn obeying it to the best of their ability. If it is obviously harmful to themselves, they then become immune to this effect for 1 day.",
    category: "Combat Tactics"
  },
  {
    id: 'heavy-strike',
    name: "Heavy Strike",
    description: "When you hit, push a Medium creature STR spaces and deal extra damage equal to a roll of your Combat Die. A Small creature is pushed twice as far. A Large, pushed half as far (round down).",
    category: "Combat Tactics"
  },
  {
    id: 'inerrant-strike',
    name: "Inerrant Strike",
    description: "Reroll a missed attack, add 1 to the Primary Die, and deal extra damage equal to a roll of your Combat Die.",
    category: "Combat Tactics"
  },
  {
    id: 'lunging-strike',
    name: "Lunging Strike",
    description: "Gain +1 Reach on an attack and deal extra damage equal to 2× your Combat Die.",
    category: "Combat Tactics"
  },
  {
    id: 'sweeping-strike',
    name: "Sweeping Strike",
    description: "2 actions: Select any contiguous area within your weapon's Reach and damage ALL targets there. This attack does not miss on a 1.",
    category: "Combat Tactics"
  }
];

export const WEAPON_MASTERY_OPTIONS = [
  {
    id: 'slashing',
    name: "Slashing",
    description: "Your attacks with slashing weapons cannot miss Unarmored enemies.",
    category: "Weapon Mastery"
  },
  {
    id: 'bludgeoning',
    name: "Bludgeoning",
    description: "When your primary die rolls a 7 or higher with a bludgeoning weapon, ignore Heavy Armor.",
    category: "Weapon Mastery"
  },
  {
    id: 'piercing',
    name: "Piercing",
    description: "Your attacks with piercing weapons ignore Medium Armor.",
    category: "Weapon Mastery"
  }
];

export const COMMANDER_CLASS_FEATURES = [
  {
    id: 'commander-coordinated-strike-1',
    level: 1,
    name: "Coordinated Strike!",
    description: "Gain the Coordinated Strike! Commander's Order.",
    requires_choice: false
  },
  {
    id: 'commander-orders-2',
    level: 2,
    name: "Commander's Orders",
    description: "Choose 2 Commander's Orders.",
    requires_choice: true,
    options: COMMANDERS_ORDERS
  },
  {
    id: 'field-medic',
    level: 2,
    name: "Field Medic",
    description: "Roll 1 additional die for any health potion you administer. Whenever you or an ally spends any number of Hit Dice to recover HP, if you spent at least ten minutes examining their wounds, they can add your Examination bonus to the HP recovered.",
    requires_choice: false
  },
  {
    id: 'commander-subclass-3',
    level: 3,
    name: "Subclass",
    description: "Choose a Commander subclass.",
    requires_choice: true
  },
  {
    id: 'fit-for-any-battlefield-4',
    level: 4,
    name: "Fit for Any Battlefield",
    description: "Choose a Combat Tactic. When you roll Initiative, gain STR Combat Dice, each a d6. (1/attack) You may expend a Combat Die to perform a special maneuver. Combat Dice are lost when combat ends.",
    requires_choice: true,
    options: COMBAT_TACTICS
  },
  {
    id: 'key-stat-increase-4',
    level: 4,
    name: "Key Stat Increase",
    description: "+1 STR or INT.",
    requires_choice: true
  },
  {
    id: 'master-commander-5',
    level: 5,
    name: "Master Commander",
    description: "When you roll Initiative, regain 1 spent use of Coordinated Strike (it is lost if not spent during that encounter). Attacks made from your Coordinated Strikes also now ignore disadvantage.",
    requires_choice: false
  },
  {
    id: 'combat-tactics-5',
    level: 5,
    name: "Combat Tactics",
    description: "Your Combat Dice are now d8s.",
    requires_choice: false
  },
  {
    id: 'secondary-stat-increase-5',
    level: 5,
    name: "Secondary Stat Increase",
    description: "+1 DEX or WIL.",
    requires_choice: true
  },
  {
    id: 'fit-for-any-battlefield-6',
    level: 6,
    name: "Fit for Any Battlefield (2)",
    description: "Choose another Combat Ability or gain +1 max Combat Dice.",
    requires_choice: true,
    options: COMBAT_TACTICS
  },
  {
    id: 'weapon-mastery-6',
    level: 6,
    name: "Weapon Mastery",
    description: "You may sheathe a weapon and draw a different one 2×/round for free. Choose a weapon type to specialize in.",
    requires_choice: true,
    options: WEAPON_MASTERY_OPTIONS
  },
  {
    id: 'commander-subclass-7',
    level: 7,
    name: "Subclass",
    description: "Gain your Commander subclass feature.",
    requires_choice: false
  },
  {
    id: 'fit-for-any-battlefield-8',
    level: 8,
    name: "Fit for Any Battlefield (3)",
    description: "Choose another Combat Ability or gain +1 max Combat Dice.",
    requires_choice: true,
    options: COMBAT_TACTICS
  },
  {
    id: 'key-stat-increase-8',
    level: 8,
    name: "Key Stat Increase",
    description: "+1 STR or INT.",
    requires_choice: true
  },
  {
    id: 'master-commander-9',
    level: 9,
    name: "Master Commander (2)",
    description: "+1 use of Coordinated Strike/Safe Rest.",
    requires_choice: false
  },
  {
    id: 'combat-tactics-9',
    level: 9,
    name: "Combat Tactics (2)",
    description: "Your Combat Dice are now d10s.",
    requires_choice: false
  },
  {
    id: 'secondary-stat-increase-9',
    level: 9,
    name: "Secondary Stat Increase",
    description: "+1 DEX or WIL.",
    requires_choice: true
  },
  {
    id: 'fit-for-any-battlefield-10',
    level: 10,
    name: "Fit for Any Battlefield (4)",
    description: "Choose another Combat Ability or gain +1 max Combat Dice.",
    requires_choice: true,
    options: COMBAT_TACTICS
  },
  {
    id: 'weapon-mastery-10',
    level: 10,
    name: "Weapon Mastery (2)",
    description: "Choose a 2nd weapon type to specialize in.",
    requires_choice: true,
    options: WEAPON_MASTERY_OPTIONS
  },
  {
    id: 'commander-subclass-11',
    level: 11,
    name: "Subclass",
    description: "Gain your Commander subclass feature.",
    requires_choice: false
  },
  {
    id: 'fit-for-any-battlefield-12',
    level: 12,
    name: "Fit for Any Battlefield (5)",
    description: "Choose another Combat Ability or gain +1 max Combat Dice.",
    requires_choice: true,
    options: COMBAT_TACTICS
  },
  {
    id: 'key-stat-increase-12',
    level: 12,
    name: "Key Stat Increase",
    description: "+1 STR or INT.",
    requires_choice: true
  },
  {
    id: 'master-commander-13',
    level: 13,
    name: "Master Commander (3)",
    description: "+1 use of Coordinated Strike/Safe Rest.",
    requires_choice: false
  },
  {
    id: 'combat-tactics-13',
    level: 13,
    name: "Combat Tactics (3)",
    description: "Your Combat Dice are now d12s.",
    requires_choice: false
  },
  {
    id: 'secondary-stat-increase-13',
    level: 13,
    name: "Secondary Stat Increase",
    description: "+1 DEX or WIL.",
    requires_choice: true
  },
  {
    id: 'weapon-mastery-14',
    level: 14,
    name: "Weapon Mastery (3)",
    description: "You have complete mastery of all weapon types.",
    requires_choice: false
  },
  {
    id: 'commander-subclass-15',
    level: 15,
    name: "Subclass",
    description: "Gain your Commander subclass feature.",
    requires_choice: false
  },
  {
    id: 'fit-for-any-battlefield-16',
    level: 16,
    name: "Fit for Any Battlefield (6)",
    description: "Choose another Combat Ability or gain +1 max Combat Dice.",
    requires_choice: true,
    options: COMBAT_TACTICS
  },
  {
    id: 'key-stat-increase-16',
    level: 16,
    name: "Key Stat Increase",
    description: "+1 STR or INT.",
    requires_choice: true
  },
  {
    id: 'master-commander-17',
    level: 17,
    name: "Master Commander (4)",
    description: "+1 use of Coordinated Strike/Safe Rest.",
    requires_choice: false
  },
  {
    id: 'combat-tactics-17',
    level: 17,
    name: "Combat Tactics (4)",
    description: "Your Combat Dice are now d20s.",
    requires_choice: false
  },
  {
    id: 'secondary-stat-increase-17',
    level: 17,
    name: "Secondary Stat Increase",
    description: "+1 DEX or WIL.",
    requires_choice: true
  },
  {
    id: 'unparalleled-tactics',
    level: 18,
    name: "Unparalleled Tactics",
    description: "The first time each encounter you use Coordinated Strike, an ally who can hear you also gains 1 action to use on their next turn.",
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
    id: 'captain-of-legions',
    level: 20,
    name: "Captain of Legions",
    description: "+1 to any 2 of your stats. The first time each encounter you use Coordinated Strike, EVERY ally within 12 spaces gains +1 action (replaces Unparalleled Tactics).",
    requires_choice: false
  }
];

export const BULWARK_SUBCLASS_FEATURES = [
  {
    id: 'armor-master',
    level: 3,
    name: "Armor Master",
    subclassId: "bulwark",
    subclassName: "Champion of the Bulwark",
    description: "You are proficient with plate armor.\n\nShield Bash. While wearing a shield, you may Defend 2× each round. The first time each round you block all of the damage from an attack, you may make an opportunity attack against the attacker for free."
  },
  {
    id: 'juggernaut',
    level: 7,
    name: "Juggernaut",
    subclassId: "bulwark",
    subclassName: "Champion of the Bulwark",
    description: "When you use Coordinated Strike, you deal extra damage equal to your armor, and you can add 1 to your primary die."
  },
  {
    id: 'taunting-strike',
    level: 11,
    name: "Taunting Strike",
    subclassId: "bulwark",
    subclassName: "Champion of the Bulwark",
    description: "(1/turn) You may Taunt a creature you hit until the end of their next turn."
  },
  {
    id: 'shield-wall',
    level: 15,
    name: "Shield Wall",
    subclassId: "bulwark",
    subclassName: "Champion of the Bulwark",
    description: "Allies within 2 spaces gain ALL the benefits of the shield you have equipped."
  }
];

export const VANGUARD_SUBCLASS_FEATURES = [
  {
    id: 'advance',
    level: 3,
    name: "Advance!",
    subclassId: "vanguard",
    subclassName: "Champion of the Vanguard",
    description: "(1/round) After you move toward an enemy, gain advantage on the first melee attack you make against it. When you use your Coordinated Strike, you and all allies within 12 spaces can first move up to half their speed for free."
  },
  {
    id: 'experienced-commander',
    level: 7,
    name: "Experienced Commander",
    subclassId: "vanguard",
    subclassName: "Champion of the Vanguard",
    description: "Your Coordinated Strike may target 1 additional ally. Gain +1 use of Coordinated Strike/Safe Rest."
  },
  {
    id: 'survey-the-battlefield',
    level: 11,
    name: "Survey the Battlefield",
    subclassId: "vanguard",
    subclassName: "Champion of the Vanguard",
    description: "When you roll Initiative, regain 1 use of Coordinated Strike. +1 max Combat Dice."
  },
  {
    id: 'as-one',
    level: 15,
    name: "As One!",
    subclassId: "vanguard",
    subclassName: "Champion of the Vanguard",
    description: "Attacks made with your Coordinated Strike also grant advantage and ignore all disadvantage. Your chosen allies gain 1 additional action to use on their next turn."
  }
];

export const COMMANDER_SUBCLASS_FEATURES = [
  ...BULWARK_SUBCLASS_FEATURES,
  ...VANGUARD_SUBCLASS_FEATURES
];
