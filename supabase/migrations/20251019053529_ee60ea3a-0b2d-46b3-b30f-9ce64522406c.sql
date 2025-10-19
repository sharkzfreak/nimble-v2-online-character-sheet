-- Add DM-granted subclasses
INSERT INTO subclasses (name, class_id, description, complexity, source_page) VALUES
(
  'Beastmaster',
  (SELECT id FROM classes WHERE name = 'Hunter'),
  'Together, Unstoppable - Choose a Small, Medium, or Large animal as your companion. Instead of your first 2 Thrill of the Hunt (ToTH) abilities, you can select Go for the Throat! and Protect Me! to use with your companion.',
  3,
  81
),
(
  'Reaver',
  (SELECT id FROM classes WHERE name = 'Shadowmancer'),
  'Cast Aside, Born Anew - Cut off from your patron, you can no longer cast Shadow Blast and you can no longer cast tiered spells using Pilfered Power. However, as a parting token, you have stolen a secret from your patron: The magical Bonescythe, a weapon of sinew and bone, infused with shadowy magic.',
  3,
  79
),
(
  'Spellblade',
  (SELECT id FROM classes WHERE name = 'Commander'),
  'Steel Meets Spell - Your focus on the arcane causes you to lose access to Weapon Mastery and Combat Tactics, but you now gain INT mana when you roll Initiative (this mana is lost if unused when combat ends). Whenever you could choose a Combat Tactic or Weapon Mastery, instead choose another Commander''s Order or a tier 1 (or lower) spell from any spell school. Your Commander''s Orders are also empowered with magical power.',
  3,
  77
),
(
  'Oathbreaker',
  (SELECT id FROM classes WHERE name = 'Oathsworn'),
  'Fallen, Seeking Redemption - Fallen from the light, but not entirely. You lose access to the following Radiant spells: True Strike, Heal, and Warding Bond; and gain access to the following Necrotic spells: Entice, Shadowtrap, and Dread Visage. Whenever you can choose a Utility Spell, you may choose a Radiant or Necrotic one.',
  3,
  75
);