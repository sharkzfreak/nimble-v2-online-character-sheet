import { SubclassFeature } from './subclassFeatures';

export interface LyricalWeapon {
  id: string;
  name: string;
  description: string;
}

export interface PeoplePerson {
  id: string;
  name: string;
  description: string;
}

export const LYRICAL_WEAPONRY: LyricalWeapon[] = [
  {
    id: "heroic_ballad",
    name: "Heroic Ballad",
    description: "+2 max Songweaver's Inspiration charges. When used to reroll an attack, your Songweaver's Inspiration also grants them +WIL damage on the attack.",
  },
  {
    id: "rhapsody_of_the_normal",
    name: "Rhapsody of the Normal",
    description: "When you roll 4 or more on your Vicious Mockery, you may have the Songweaver's Inspiration charge to temporarily suppress any special abilities they have until the end of their next turn. They can do only what an untrained average human can do, attack once for 1d4 damage and move up to 6 spaces (no armor, spellcasting, flying, regeneration, other inherent or trained features).",
  },
  {
    id: "not_my_beautiful_faasace",
    name: "Not My Beautiful Faasace!",
    description: "(1/encounter) When you Defend, force the attacker to choose another target within range on a failed WIL save (if there is none, the attack fails). If they fail by 5 or more, they attack themselves as punishment for even thinking they could achieve such advantage.",
  },
  {
    id: "song_of_domination",
    name: "Song of Domination",
    description: "(1/encounter) 2 actions: Play a bewitching tune, and all enemies within 6 spaces who hear it must make a WIL save. If they fail, you move them up to 6 spaces in any direction, and they cannot move on their next turn.",
  },
];

export const A_PEOPLE_PERSON: PeoplePerson[] = [
  {
    id: "stompy",
    name: "Stompy",
    description: "3 actions: Summon a huge hill giant for 1 round (benefits if you ask him to do something he would find mischievous or fun; with disadvantage if something he would find good or menial).",
  },
  {
    id: "gran_gran_not_a_hex",
    name: "Gran Gran (NOT a hex)",
    description: "Free Reaction when grappling, you may summon her for 1 hour to soothe your wounds (and hassle you for not eating enough). She bakes and hands out pastries to whoever's within +INT HP during recovery while they're warm! Then she's gone for 10 minutes.",
  },
  {
    id: "mal_the_malevolent_imp",
    name: "Mal, the Malevolent Imp",
    description: "Summon a tiny fiend for 1 night. Exceptionally dangerous information demon; have no right to know! Or 'take care' of a problem with who with extremely low chance of things going wrong. Make an Influence check to convince him to help you.",
  },
  {
    id: "linos_the_everfriendly",
    name: "Linos, the Everfriendly",
    description: "Summon a legendary flying (but friendly) creature to take you and your party wherever you need to go. He may request a very large amount of food as payment.",
  },
];

export const SONGWEAVER_CLASS_FEATURES = [
  {
    id: "songweaver_wind_spellcasting",
    name: "Wind Spellcasting and...",
    level: 1,
    description: "You know cantrips from the Wind school and 1 other school of choice. Learn Vicious Mockery:\n\nVicious Mockery. (Wind cantrip) Action: Range: 12. Damage: 1d4+INT psychic (ignoring armor). You insult and belittle an enemy during your next turn. High levels: +2 damage every 5 levels.",
    requires_choice: false,
  },
  {
    id: "songweaver_inspiration",
    name: "Songweaver's Inspiration",
    level: 1,
    description: "(2×WIL times/Safe Rest) Free Reaction: Allow an ally to reroll a single die related to an attack or save (must keep either result).",
    requires_choice: false,
  },
  {
    id: "songweaver_mana_tier1",
    name: "Mana and Unlock Tier 1 Spells",
    level: 2,
    description: "You unlock tier 1 spells in the schools you know and gain a mana pool. This mana pool's maximum is always equal to (INT×3)+LVL and recharges on a Safe Rest.",
    requires_choice: false,
  },
  {
    id: "songweaver_jack_of_all_trades",
    name: "Jack of All Trades",
    level: 2,
    description: "When you Safe Rest, you may move a skill point as if you just leveled up.",
    requires_choice: false,
  },
  {
    id: "songweaver_song_of_rest",
    name: "Song of Rest",
    level: 2,
    description: "(1/day) Whenever you Field Rest, you may play a song and allow anyone who spends Hit Dice to heal additional HP equal to your INT.",
    requires_choice: false,
  },
  {
    id: "songweaver_subclass",
    name: "Subclass",
    level: 3,
    description: "Choose a Songweaver subclass.",
    requires_choice: true,
    choice_type: "single" as const,
    options: [
      { id: "snark", name: "Herald of Snark" },
      { id: "courage", name: "Herald of Courage" },
    ],
  },
  {
    id: "songweaver_quick_wit",
    name: "Quick Wit",
    level: 3,
    description: "When you roll Initiative, you may regain 2 spent uses of your Songweaver's Inspiration (these expire at the end of combat if left unused).",
    requires_choice: false,
  },
  {
    id: "songweaver_windbag",
    name: "Windbag",
    level: 3,
    description: "Choose 1 Utility Spell from each spell school you know.",
    requires_choice: false,
  },
  {
    id: "songweaver_tier2",
    name: "Tier 2 Spells",
    level: 4,
    description: "You may now cast tier 2 spells and upcast spells at tier 2.",
    requires_choice: false,
  },
  {
    id: "songweaver_key_stat_increase_4",
    name: "Key Stat Increase",
    level: 4,
    description: "+1 WIL or INT.",
    requires_choice: false,
  },
  {
    id: "songweaver_lyrical_weaponry",
    name: "Lyrical Weaponry",
    level: 4,
    description: "Choose 1 ability from the Lyrical Weaponry list.",
    requires_choice: true,
    choice_type: "single" as const,
    options: LYRICAL_WEAPONRY.map(w => ({ id: w.id, name: w.name, text: w.description })),
  },
  {
    id: "songweaver_a_people_person",
    name: "A \"People\" Person",
    level: 5,
    description: "You've met many people in your travels; some have even agreed to come to you and should you need it. Choose 2 friends you know: you can temporarily summon them via song (1/Safe Rest each).",
    requires_choice: true,
    choice_type: "multi" as const,
    choice_count: 2,
    options: A_PEOPLE_PERSON.map(p => ({ id: p.id, name: p.name, text: p.description })),
  },
  {
    id: "songweaver_upgraded_cantrips_5",
    name: "Upgraded Cantrips",
    level: 5,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "songweaver_secondary_stat_increase_5",
    name: "Secondary Stat Increase",
    level: 5,
    description: "+1 STR or DEX.",
    requires_choice: false,
  },
  {
    id: "songweaver_tier3",
    name: "Tier 3 Spells",
    level: 6,
    description: "You may now cast tier 3 spells and upcast spells at tier 3.",
    requires_choice: false,
  },
  {
    id: "songweaver_windbag_2",
    name: "Windbag (2)",
    level: 6,
    description: "Choose a 2nd Utility Spell from each spell school you know.",
    requires_choice: false,
  },
  {
    id: "songweaver_subclass_7",
    name: "Subclass",
    level: 7,
    description: "Gain your Songweaver subclass feature.",
    requires_choice: false,
  },
  {
    id: "songweaver_tier4",
    name: "Tier 4 Spells",
    level: 8,
    description: "You may now cast tier 4 spells and upcast spells at tier 4.",
    requires_choice: false,
  },
  {
    id: "songweaver_key_stat_increase_8",
    name: "Key Stat Increase",
    level: 8,
    description: "+1 WIL or INT.",
    requires_choice: false,
  },
  {
    id: "songweaver_lyrical_weaponry_2",
    name: "Lyrical Weaponry (2)",
    level: 9,
    description: "Choose a 2nd ability from the Lyrical Weapons list.",
    requires_choice: true,
    choice_type: "single" as const,
    options: LYRICAL_WEAPONRY.map(w => ({ id: w.id, name: w.name, text: w.description })),
  },
  {
    id: "songweaver_secondary_stat_increase_9",
    name: "Secondary Stat Increase",
    level: 9,
    description: "+1 STR or DEX.",
    requires_choice: false,
  },
  {
    id: "songweaver_tier5",
    name: "Tier 5 Spells",
    level: 10,
    description: "You may now cast tier 5 spells and upcast spells at tier 5.",
    requires_choice: false,
  },
  {
    id: "songweaver_upgraded_cantrips_10",
    name: "Upgraded Cantrips",
    level: 10,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "songweaver_subclass_11",
    name: "Subclass",
    level: 11,
    description: "Gain your Songweaver subclass feature.",
    requires_choice: false,
  },
  {
    id: "songweaver_tier6",
    name: "Tier 6 Spells",
    level: 12,
    description: "You may now cast tier 6 spells and upcast spells at tier 6.",
    requires_choice: false,
  },
  {
    id: "songweaver_key_stat_increase_12",
    name: "Key Stat Increase",
    level: 12,
    description: "+1 WIL or INT.",
    requires_choice: false,
  },
  {
    id: "songweaver_lyrical_weaponry_3",
    name: "Lyrical Weaponry (3)",
    level: 13,
    description: "Choose a 3rd ability from the Lyrical Weapons list.",
    requires_choice: true,
    choice_type: "single" as const,
    options: LYRICAL_WEAPONRY.map(w => ({ id: w.id, name: w.name, text: w.description })),
  },
  {
    id: "songweaver_secondary_stat_increase_13",
    name: "Secondary Stat Increase",
    level: 13,
    description: "+1 STR or DEX.",
    requires_choice: false,
  },
  {
    id: "songweaver_tier7",
    name: "Tier 7 Spells",
    level: 14,
    description: "You may now cast tier 7 spells and upcast spells at tier 7.",
    requires_choice: false,
  },
  {
    id: "songweaver_windbag_3",
    name: "Windbag (3)",
    level: 14,
    description: "You know all Utility Spells from the spell schools you know.",
    requires_choice: false,
  },
  {
    id: "songweaver_subclass_15",
    name: "Subclass",
    level: 15,
    description: "Gain your Songweaver subclass feature.",
    requires_choice: false,
  },
  {
    id: "songweaver_upgraded_cantrips_15",
    name: "Upgraded Cantrips",
    level: 15,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
  {
    id: "songweaver_tier8",
    name: "Tier 8 Spells",
    level: 16,
    description: "You may now cast tier 8 spells and upcast spells at tier 8.",
    requires_choice: false,
  },
  {
    id: "songweaver_key_stat_increase_16",
    name: "Key Stat Increase",
    level: 16,
    description: "+1 WIL or INT.",
    requires_choice: false,
  },
  {
    id: "songweaver_lyrical_weaponry_4",
    name: "Lyrical Weaponry (4)",
    level: 17,
    description: "Choose a 4th ability from the Lyrical Weapons list.",
    requires_choice: true,
    choice_type: "single" as const,
    options: LYRICAL_WEAPONRY.map(w => ({ id: w.id, name: w.name, text: w.description })),
  },
  {
    id: "songweaver_secondary_stat_increase_17",
    name: "Secondary Stat Increase",
    level: 17,
    description: "+1 STR or DEX.",
    requires_choice: false,
  },
  {
    id: "songweaver_tier9",
    name: "Tier 9 Spells",
    level: 18,
    description: "You may now cast tier 9 spells and upcast spells at tier 9.",
    requires_choice: false,
  },
  {
    id: "songweaver_epic_boon",
    name: "Epic Boon",
    level: 19,
    description: "Choose an Epic Boon (see pg. 23 of the GM's Guide).",
    requires_choice: false,
  },
  {
    id: "songweaver_im_so_famous",
    name: "I'm So Famous!",
    level: 20,
    description: "+1 to any 2 of your stats. Your Songweaver's Inspiration cannot fail (your target succeeds).",
    requires_choice: false,
  },
  {
    id: "songweaver_upgraded_cantrips_20",
    name: "Upgraded Cantrips",
    level: 20,
    description: "Your cantrips grow stronger.",
    requires_choice: false,
  },
];

export const SNARK_SUBCLASS_FEATURES: SubclassFeature[] = [
  {
    id: "snark_opportunistic_snark",
    name: "Opportunistic Snark",
    level: 3,
    subclassId: "snark",
    subclassName: "Herald of Snark",
    description: "Reaction (when an enemy within Range 12 misses an attack): You may cast Vicious Mockery at them; it deals double damage when cast this way.",
  },
  {
    id: "snark_fight_picker",
    name: "Fight Picker",
    level: 7,
    subclassId: "snark",
    subclassName: "Herald of Snark",
    description: "(1/turn) When an enemy is damaged by your Vicious Mockery, you may have one of your allies Taunt them until the end of the enemy's turn instead.",
  },
  {
    id: "snark_chord_of_chaos",
    name: "Chord of Chaos",
    level: 11,
    subclassId: "snark",
    subclassName: "Herald of Snark",
    description: "(1/encounter) Action: You may move ALL creatures within hearing of your song up to 3 spaces as long as they do not move into an obviously dangerous place.",
  },
  {
    id: "snark_words_like_swords",
    name: "Words Like Swords",
    level: 15,
    subclassId: "snark",
    subclassName: "Herald of Snark",
    description: "Your Vicious Mockery damage becomes 1d6+INT+ WIL.",
  },
];

export const COURAGE_SUBCLASS_FEATURES: SubclassFeature[] = [
  {
    id: "courage_inspiring_presence",
    name: "Inspiring Presence",
    level: 3,
    subclassId: "courage",
    subclassName: "Herald of Courage",
    description: "Whenever you use Songweaver's Inspiration, your allies within 12 spaces who can see you gain +WIL temp HP.",
  },
  {
    id: "courage_unfailing_courage",
    name: "Unfailing Courage",
    level: 7,
    subclassId: "courage",
    subclassName: "Herald of Courage",
    description: "Your presence inspires others to feats of heroism and courage heard of only in legend. Your Songweaver's Inspiration allows your target to roll with advantage.",
  },
  {
    id: "courage_fire_in_my_bones",
    name: "Fire in my Bones",
    level: 11,
    subclassId: "courage",
    subclassName: "Herald of Courage",
    description: "Your Songweaver's Inspiration also grants your target 1 additional action.",
  },
  {
    id: "courage_chorus_of_champions",
    name: "Chorus of Champions",
    level: 15,
    subclassId: "courage",
    subclassName: "Herald of Courage",
    description: "(1/encounter) Free Reaction: Give all party members 1 action.",
  },
];

export const SONGWEAVER_SUBCLASS_FEATURES = [
  ...SNARK_SUBCLASS_FEATURES,
  ...COURAGE_SUBCLASS_FEATURES,
];
