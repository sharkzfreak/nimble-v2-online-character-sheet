import { ClassFeature } from './classFeatures';

// Underhanded Abilities - Choice options for the Cheat class
export const UNDERHANDED_ABILITIES = [
  {
    id: 'creative_accounting',
    name: '"Creative" Accounting',
    description: 'Steal up to INT actions from your next turn (Gain up to INT actions now. The next time you would gain actions, subtract the number already used). You can use this 2/LR in a row.',
  },
  {
    id: 'exploit_weakness',
    name: 'Exploit Weakness',
    description: 'Action: Make a contested INT check against an enemy. If you win, you can use Vicious Opportunist against them, even if they are not Distracted. Lasts for 1 minute or until you use this ability against another target.',
  },
  {
    id: 'feinting_attack',
    name: 'Feinting Attack',
    description: 'If you miss for the 2nd time in a single round, you may change the primary die roll on the 2nd result to whatever you like.',
  },
  {
    id: 'howd_you_get_here',
    name: "How'd YOU get here?!",
    description: '2 actions: "Teleport" up to 4 spaces away, adjacent to a Distracted target, and make a melee attack against them. If you crit, you may "teleport" again.',
  },
  {
    id: 'im_outta_here',
    name: "I'm Outta Here!",
    description: 'When an ally within 4 spaces is crit, you may turn invisible until the end of your next turn.',
  },
  {
    id: 'misdirection',
    name: 'Misdirection',
    description: 'Gain INT armor. Whenever you Defend, you may halve the damage instead.',
  },
  {
    id: 'steal_tempo',
    name: 'Steal Tempo',
    description: 'When you land a critical hit for the second time on a turn, your target loses 1 action and you gain 1 action.',
  },
  {
    id: 'sunder_armor_medium',
    name: 'Sunder Armor (Medium)',
    description: 'Action: When you crit an enemy with medium armor, sunder their armor. Until the start of your next turn, ALL melee attacks against that target ignore its armor.',
  },
  {
    id: 'sunder_armor_heavy',
    name: 'Sunder Armor (Heavy)',
    description: 'Req. Sunder Armor (Medium). Your Sunder Armor ability now also applies to enemies wearing heavy armor.',
  },
  {
    id: 'trickshot',
    name: 'Trickshot',
    description: 'When you throw a dagger, it returns back to your hand at the end of your turn. On a hit, it ricochets to another creature within 2 spaces, dealing half as much damage to them.',
  },
];

export const CHEAT_CLASS_FEATURES: ClassFeature[] = [
  // Level 1
  {
    id: 'cheat_sneak_attack_1',
    level: 1,
    name: 'Sneak Attack',
    description: '(1/turn) When you crit, deal +1d6 damage.',
    requires_choice: false,
  },
  {
    id: 'cheat_vicious_opportunist',
    level: 1,
    name: 'Vicious Opportunist',
    description: '(1/turn) When you hit a Distracted target with a melee attack, you may change the Primary Die roll to whatever you like (changing it to the max value counts as a crit).\n\nDistracted: A target is Distracted if it is adjacent to or Taunted by an ally, or if it cannot see you.',
    requires_choice: false,
  },
  
  // Level 2
  {
    id: 'cheat_ability',
    level: 2,
    name: 'Cheat',
    description: "You're a well-rounded cheater. Gain the following abilities:\n• (1/round) You may either Move or Hide for free.\n• (1/day) You may change any skill check to 10+INT.\n• If you roll less than 10 on Initiative, you may change it to 10 instead.\n• You may gain advantage on skill checks while playing games, competitions, or placing wagers. If you're caught though...",
    requires_choice: false,
  },
  
  // Level 3
  {
    id: 'cheat_subclass_3',
    level: 3,
    name: 'Subclass',
    description: 'Choose a Cheat subclass.',
    requires_choice: true,
    choice_type: 'single',
    options: [
      {
        id: 'silent_blade',
        name: 'Tools of the Silent Blade',
        description: 'Master of stealth and assassination',
      },
      {
        id: 'scoundrel',
        name: 'Tools of the Scoundrel',
        description: 'Cunning trickster and social manipulator',
      },
    ],
  },
  {
    id: 'cheat_sneak_attack_2',
    level: 3,
    name: 'Sneak Attack (2)',
    description: 'Your Sneak Attack becomes 1d8.',
    requires_choice: false,
  },
  {
    id: 'cheat_thieves_cant',
    level: 3,
    name: "Thieves' Cant",
    description: 'You learn the secret language of rogues and scoundrels.',
    requires_choice: false,
  },
  
  // Level 4
  {
    id: 'cheat_key_stat_increase_4',
    level: 4,
    name: 'Key Stat Increase',
    description: '+1 DEX or INT.',
    requires_choice: false,
  },
  {
    id: 'cheat_underhanded_ability_1',
    level: 4,
    name: 'Underhanded Ability',
    description: 'Choose an Underhanded Ability.',
    requires_choice: true,
    choice_type: 'single',
    options: UNDERHANDED_ABILITIES,
  },
  
  // Level 5
  {
    id: 'cheat_twist_the_blade',
    level: 5,
    name: 'Twist the Blade',
    description: 'Action: Change one of your Sneak Attack dice to whatever you like.',
    requires_choice: false,
  },
  {
    id: 'cheat_quick_read',
    level: 5,
    name: 'Quick Read',
    description: '• (1/encounter) Gain advantage on an Assess check.\n• (1/day) Gain advantage on an Examination check.',
    requires_choice: false,
  },
  {
    id: 'cheat_secondary_stat_increase_5',
    level: 5,
    name: 'Secondary Stat Increase',
    description: '+1 WIL or STR.',
    requires_choice: false,
  },
  
  // Level 6
  {
    id: 'cheat_underhanded_ability_2',
    level: 6,
    name: 'Underhanded Ability (2)',
    description: 'Choose a 2nd Underhanded Ability.',
    requires_choice: true,
    choice_type: 'single',
    options: UNDERHANDED_ABILITIES,
  },
  {
    id: 'cheat_thats_not_what_happened',
    level: 6,
    name: "THAT'S Not What Happened!",
    description: '(1/Safe Rest) Action: After a Distracted enemy attacks you, you may change the Primary Die roll to whatever you like (changing the die to the minimum value counts as a miss).',
    requires_choice: false,
  },
  
  // Level 7
  {
    id: 'cheat_subclass_7',
    level: 7,
    name: 'Subclass',
    description: 'Gain your Cheat subclass feature.',
    requires_choice: false,
  },
  {
    id: 'cheat_sneak_attack_3',
    level: 7,
    name: 'Sneak Attack (3)',
    description: 'Your Sneak Attack becomes 2d8.',
    requires_choice: false,
  },
  
  // Level 8
  {
    id: 'cheat_underhanded_ability_3',
    level: 8,
    name: 'Underhanded Ability (3)',
    description: 'Choose a 3rd Underhanded Ability.',
    requires_choice: true,
    choice_type: 'single',
    options: UNDERHANDED_ABILITIES,
  },
  {
    id: 'cheat_key_stat_increase_8',
    level: 8,
    name: 'Key Stat Increase',
    description: '+1 DEX or INT.',
    requires_choice: false,
  },
  
  // Level 9
  {
    id: 'cheat_sneak_attack_4',
    level: 9,
    name: 'Sneak Attack (4)',
    description: 'Your Sneak Attack becomes 2d10.',
    requires_choice: false,
  },
  {
    id: 'cheat_secondary_stat_increase_9',
    level: 9,
    name: 'Secondary Stat Increase',
    description: '+1 WIL or STR.',
    requires_choice: false,
  },
  
  // Level 10
  {
    id: 'cheat_underhanded_ability_4',
    level: 10,
    name: 'Underhanded Ability (4)',
    description: 'Choose a 4th Underhanded Ability.',
    requires_choice: true,
    choice_type: 'single',
    options: UNDERHANDED_ABILITIES,
  },
  
  // Level 11
  {
    id: 'cheat_subclass_11',
    level: 11,
    name: 'Subclass',
    description: 'Gain your Cheat subclass feature.',
    requires_choice: false,
  },
  {
    id: 'cheat_sneak_attack_5',
    level: 11,
    name: 'Sneak Attack (5)',
    description: 'Your Sneak Attack becomes 2d12.',
    requires_choice: false,
  },
  
  // Level 12
  {
    id: 'cheat_underhanded_ability_5',
    level: 12,
    name: 'Underhanded Ability (5)',
    description: 'Choose a 5th Underhanded Ability.',
    requires_choice: true,
    choice_type: 'single',
    options: UNDERHANDED_ABILITIES,
  },
  {
    id: 'cheat_key_stat_increase_12',
    level: 12,
    name: 'Key Stat Increase',
    description: '+1 DEX or INT.',
    requires_choice: false,
  },
  
  // Level 13
  {
    id: 'cheat_twist_the_blade_2',
    level: 13,
    name: 'Twist the Blade (2)',
    description: '(1/turn) You can Twist the Blade for free.',
    requires_choice: false,
  },
  {
    id: 'cheat_secondary_stat_increase_13',
    level: 13,
    name: 'Secondary Stat Increase',
    description: '+1 WIL or STR.',
    requires_choice: false,
  },
  
  // Level 14
  {
    id: 'cheat_underhanded_ability_6',
    level: 14,
    name: 'Underhanded Ability (6)',
    description: 'Choose a 6th Underhanded Ability.',
    requires_choice: true,
    choice_type: 'single',
    options: UNDERHANDED_ABILITIES,
  },
  
  // Level 15
  {
    id: 'cheat_subclass_15',
    level: 15,
    name: 'Subclass',
    description: 'Gain your Cheat subclass feature.',
    requires_choice: false,
  },
  {
    id: 'cheat_sneak_attack_6',
    level: 15,
    name: 'Sneak Attack (6)',
    description: 'Your Sneak Attack becomes 2d20.',
    requires_choice: false,
  },
  
  // Level 16
  {
    id: 'cheat_underhanded_ability_7',
    level: 16,
    name: 'Underhanded Ability (7)',
    description: 'Choose a 7th Underhanded Ability.',
    requires_choice: true,
    choice_type: 'single',
    options: UNDERHANDED_ABILITIES,
  },
  {
    id: 'cheat_key_stat_increase_16',
    level: 16,
    name: 'Key Stat Increase',
    description: '+1 DEX or INT.',
    requires_choice: false,
  },
  
  // Level 17
  {
    id: 'cheat_sneak_attack_7',
    level: 17,
    name: 'Sneak Attack (7)',
    description: 'Your Sneak Attack becomes 3d20.',
    requires_choice: false,
  },
  {
    id: 'cheat_secondary_stat_increase_17',
    level: 17,
    name: 'Secondary Stat Increase',
    description: '+1 WIL or STR.',
    requires_choice: false,
  },
  
  // Level 18
  {
    id: 'cheat_underhanded_ability_8',
    level: 18,
    name: 'Underhanded Ability (8)',
    description: 'Choose an 8th Underhanded Ability.',
    requires_choice: true,
    choice_type: 'single',
    options: UNDERHANDED_ABILITIES,
  },
  
  // Level 19
  {
    id: 'cheat_epic_boon',
    level: 19,
    name: 'Epic Boon',
    description: "Choose an Epic Boon (see pg. 23 of the GM's Guide).",
    requires_choice: false,
  },
  
  // Level 20
  {
    id: 'cheat_supreme_execution',
    level: 20,
    name: 'Supreme Execution',
    description: '+1 to any 2 of your stats. When you attack with a blade, you do not require targets to be Distracted to trigger Vicious Opportunist.',
    requires_choice: false,
  },
];

// Subclass Features
export const CHEAT_SUBCLASS_FEATURES = [
  // Silent Blade - Level 3
  {
    id: 'silent_blade_amidst_commotion',
    level: 3,
    name: 'Amidst All This Commotion...',
    description: 'If a creature dies while you Sneak Attack them, you may turn Invisible until you attack again or until the beginning of your next turn.',
    subclassName: 'Silent Blade',
  },
  {
    id: 'silent_blade_leave_no_trace',
    level: 3,
    name: 'Leave No Trace',
    description: 'Advantage on Stealth checks when you are at full health.',
    subclassName: 'Silent Blade',
  },
  
  // Silent Blade - Level 7
  {
    id: 'silent_blade_cunning_strike',
    level: 7,
    name: 'Cunning Strike',
    description: '(2/encounter) When you land a Sneak Attack, you may force the target to make a STR save (DC 10+INT). On a failure, instead of rolling your Sneak Attack dice, they deal the maximum amount of damage (if your target saves, regain 1 use).',
    subclassName: 'Silent Blade',
  },
  
  // Silent Blade - Level 11
  {
    id: 'silent_blade_professional_skulker',
    level: 11,
    name: 'Professional Skulker',
    description: 'Gain a climbing speed and advantage on Stealth checks (replaces Leave No Trace).',
    subclassName: 'Silent Blade',
  },
  
  // Silent Blade - Level 15
  {
    id: 'silent_blade_kill',
    level: 15,
    name: 'KILL',
    description: 'When you crit an enemy with fewer max HP than you, it dies.',
    subclassName: 'Silent Blade',
  },
  
  // Scoundrel - Level 3
  {
    id: 'scoundrel_low_blow',
    level: 3,
    name: 'Low Blow',
    description: 'When you Sneak Attack, you may spend 2 additional actions to Incapacitate your target for their next turn on a failed STR save (DC 10+INT). Save or fail, they are Tainted by you and take 2d10 HP.',
    subclassName: 'Scoundrel',
  },
  {
    id: 'scoundrel_sweet_talk',
    level: 3,
    name: 'Sweet Talk',
    description: "You may gain advantage on all Influence checks with NPCs you've just met for the first time. This lasts until you fail an Influence check with them or until you meet a 2nd time. You have disadvantage on Influence checks with them after you use this ability (until you get back on their good side).",
    subclassName: 'Scoundrel',
  },
  
  // Scoundrel - Level 7
  {
    id: 'scoundrel_pocket_sand',
    level: 7,
    name: 'Pocket Sand',
    description: "(2/encounter-you've got to collect more sand!) When you Defend against a melee attack, Blind the attacker until the start of their next turn and force them to reroll the attack (Blinded creatures attack with disadvantage).",
    subclassName: 'Scoundrel',
  },
  
  // Scoundrel - Level 11
  {
    id: 'scoundrel_escape_plan',
    level: 11,
    name: 'Escape Plan',
    description: "(1/Safe Rest) When you would drop to 0 HP or gain a Wound, you don't. Instead, you turn Invisible for 1 minute or until you attack.",
    subclassName: 'Scoundrel',
  },
  
  // Scoundrel - Level 15
  {
    id: 'scoundrel_heads_i_win',
    level: 15,
    name: 'Heads I Win, Tails You Lose',
    description: "(1/encounter) Attacks you make this round don't miss; you crit on 1 less than normally needed, and you gain LVL temp HP.",
    subclassName: 'Scoundrel',
  },
];
