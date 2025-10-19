-- Delete all existing spells to avoid duplicates
DELETE FROM spells;

-- Insert all spells from the rulebook images
INSERT INTO spells (name, element, damage, range_value, duration, description, properties, source_page) VALUES
-- Fire Spells (page 46)
('Flame Dart', 'Fire', '1d10', 'Single Target', 'Cantrip', 'RANGE: 4. DAMAGE: 1d10. On miss: the lightning fails to find ground, and strikes you instead. HIGH LEVELS: +5 damage every 5 levels.', '{"actions": "1 Action", "type": "Cantrip"}', 46),
('Heart''s Fire', 'Fire', NULL, 'Single Target', 'Cantrip', 'RANGE: 4. Give an ally within Range an extra action. Spend 1 mana to cast this when it is not your turn. HIGH LEVELS: +1 Range every 5 levels.', '{"actions": "1 Action", "type": "Cantrip"}', 46),
('Ignite', 'Fire', '4d10', 'Single Target', 'Tier 1', 'RANGE: 8. DAMAGE: 4d10 to a Smoldering target, ending the condition on hit. UPCAST: +10 damage.', '{"actions": "2 Actions", "type": "Tier 1"}', 46),
('Enchant Weapon', 'Fire', '+KEY', 'Single Target', 'Tier 2', 'CONCENTRATION: Up to 1 minute. A weapon you touch is enchanted until the spell ends. It deals +KEY damage and inflicts Smoldering on crit. UPCAST: +KEY damage.', '{"actions": "1 Action", "type": "Tier 2"}', 46),
('Flame Barrier', 'Fire', '+KEY', 'Self', 'Tier 3', 'REACTION: When attacked, Defend for free. Until the start of your next turn, melee attackers against you take KEY damage (ignoring armor) and gain Smoldering. UPCAST: +KEY damage.', '{"actions": "1 Action", "type": "Tier 3"}', 46),
('Pyroclasm', 'Fire', '2d20+10', 'AoE', 'Tier 4', 'REACH: 3. Others within Reach take 2d20+10 damage (ignoring armor) on a failed DEX save. Half damage on save. Smoldering creatures take +1 Reach, +2 damage.', '{"actions": "2 Actions", "type": "Tier 4"}', 46),
('Fiery Embrace', 'Fire', NULL, 'AoE', 'Tier 5', 'CONCENTRATION: Up to 1 minute. REACH: 8. While within Reach 1 ally gains the effects of Enchant Weapon. Enemies gain Smoldering, lose damage resistance, and their damage immunity is reduced to resistance. UPCAST: +1 ally.', '{"actions": "2 Actions", "type": "Tier 5"}', 46),
('Living Inferno', 'Fire', NULL, 'Self', 'Tier 7', 'Gain the effects of Flame Barrier for your next turn. At the end of this turn and your next turn, cast Pyroclasm for free. UPCAST: Upcast Flame Barrier and Pyroclasm.', '{"actions": "3 Actions", "type": "Tier 7"}', 46),
('Dragonform', 'Fire', '1d20+LVL', 'Self', 'Tier 9', 'Transform into a dragon. Gain 3 actions, fly speed 12, LVL Armor, 10×LVL temp HP. TOOTH & CLAW (Reach 2): 1d20+LVL damage, inflicts Smoldering. IMMOLATING BREATH (Cone 8): DC 20 DEX, KEY d20 damage, half on save.', '{"actions": "5 Actions", "type": "Tier 9"}', 46),

-- Ice Spells (page 47)
('Ice Lance', 'Ice', '1d6', 'Single Target', 'Cantrip', 'RANGE: 12. DAMAGE: 1d6 cold or piercing damage. On hit: Slowed. HIGH LEVELS: +3 damage every 5 levels.', '{"actions": "1 Action", "type": "Cantrip"}', 47),
('Snowblind', 'Ice', '1d6', 'Single Target', 'Cantrip', 'REACH: 1. DAMAGE: 1d6. On hit: Blinded until the end of their next turn. HIGH LEVELS: +3 damage every 5 levels.', '{"actions": "1 Action", "type": "Cantrip"}', 47),
('Frost Shield', 'Ice', '+2×KEY temp HP', 'Self', 'Tier 1', 'REACTION: When attacked, Defend and gain +2×KEY temp HP and Defend for free. Ice melts at start of your next turn. UPCAST: +2×KEY temp HP.', '{"actions": "1 Action", "type": "Tier 1"}', 47),
('Shatter', 'Ice', '3d6', 'Single Target', 'Tier 2', 'RANGE: 12. DAMAGE: 3d6. If any die rolls max against Hampered target, counts as crit. On crit: +20 damage. UPCAST: +1 to ANY die, +5 crit damage.', '{"actions": "2 Actions", "type": "Tier 2"}', 47),
('Cryosleep', 'Ice', NULL, 'AoE', 'Tier 3', 'REACH: 12. Creatures in 2×2 area are Dazed. Failed STR save: fall asleep, Incapacitated for 2 turns or until damaged/woken. UPCAST: +1 area, +1 turn.', '{"actions": "2 Actions", "type": "Tier 3"}', 47),
('Rimeblades', 'Ice', '1d6', 'AoE', 'Tier 4', 'CONCENTRATION: 1 minute. REACH: 12. Conjure icy spikes in 5 contiguous spaces. Creatures entering take 1d6 damage. UPCAST: +1 space, +1 damage.', '{"actions": "3 Actions", "type": "Tier 4"}', 47),
('Arctic Blast', 'Ice', '4d6+10', 'Cone 4', 'Tier 5', 'REACH: Cone 4. DAMAGE: 4d6+10. Area becomes difficult terrain. Failed STR save: frozen in place (Restrained). UPCAST: +1 area, +1 Reach.', '{"actions": "2 Actions", "type": "Tier 5"}', 47),
('Glacier Strike', 'Ice', 'd66', 'AoE', 'Tier 8', 'RANGE: 12. DAMAGE: d66 bludgeoning in 3×3 area. Adjacent creatures take half. Area becomes permanent difficult terrain.', '{"actions": "3 Actions", "type": "Tier 8"}', 47),
('Arctic Annihilation', 'Ice', 'd66', 'AoE', 'Tier 9', 'REACH: 12. Choose creatures to encase in ice (Incapacitated, immune to damage). Others take d66 damage. Failed STR: Incapacitated 1 round. Must Safe Rest 1 week after.', '{"actions": "3 Actions", "type": "Tier 9"}', 47),

-- Lightning Spells (page 48)
('Zap', 'Lightning', '2d8', 'Single Target', 'Cantrip', 'RANGE: 12. DAMAGE: 2d8. On miss: strikes you instead. HIGH LEVELS: +6 damage every 5 levels.', '{"actions": "1 Action", "type": "Cantrip"}', 48),
('Overload', 'Lightning', '2d8', 'AoE', 'Cantrip', 'REACH: 2. DAMAGE: 2d8 to others within Reach. HIGH LEVELS: +4 damage every 5 levels.', '{"actions": "1 Action", "type": "Cantrip"}', 48),
('Arc Lightning', 'Lightning', '3d8', '2 Targets', 'Tier 1', 'RANGE: 12. DAMAGE: 3d8. Bolt strikes next closest creature. On miss: strikes you. UPCAST: +4 damage.', '{"actions": "2 Actions", "type": "Tier 1"}', 48),
('Alacrity', 'Lightning', NULL, 'Self', 'Tier 2', 'RANGE: 4. REACTION: When attacked. Defend for free. If Charged, teleport within Range. UPCAST: +4 Range.', '{"actions": "1 Action", "type": "Tier 2"}', 48),
('Stormlash', 'Lightning', '3d8+4', 'Line 12', 'Tier 3', 'LINE: 12. DAMAGE: 3d8+4 (ignoring metal armor). Failed STR: Dazed (or Incapacitated if fail by 5+). UPCAST: +4 damage.', '{"actions": "2 Actions", "type": "Tier 3"}', 48),
('Electrickery', 'Lightning', NULL, '2 Targets', 'Tier 4', 'RANGE: 8. REACTION: When ally attacked. Swap ally with another creature. Costs 1 Action if Charged. UPCAST: +2 Range.', '{"actions": "3 Actions", "type": "Tier 4"}', 48),
('Electrocharge', 'Lightning', '+5 armor', 'Single Target', 'Tier 5', 'CONCENTRATION: 1 minute. Touch creature gains Charged, +1 action, +5 armor, +2 speed, advantage on DEX saves. UPCAST: +4 Range.', '{"actions": "2 Actions", "type": "Tier 5"}', 48),
('Ride the Lightning', 'Lightning', 'd88', 'AoE', 'Tier 6', 'Teleport 12 spaces. Adjacent creatures take d88 damage. Failed STR: knocked back 3 spaces, Prone, deafened 1 day. UPCAST: +1 DC.', '{"actions": "3 Actions", "type": "Tier 6"}', 48),
('Seething Storm', 'Lightning', 'd88', 'Reach 4', 'Tier 9', 'CONCENTRATION: 1 minute. REACH: 4. Become storm cloud, fly, move free, attacks with disadvantage. Strike 4 creatures for d88 each turn. Must Safe Rest 1 week after.', '{"actions": "3 Actions", "type": "Tier 9"}', 48),

-- Wind Spells (page 49)
('Razor Wind', 'Wind', '1d2', 'Single Target', 'Cantrip', 'RANGE: 12. DAMAGE: 1d2 slashing (reroll 1s on crit). HIGH LEVELS: +2 damage every 5 levels.', '{"actions": "1 Action", "type": "Cantrip"}', 49),
('Breath of Life', 'Wind', '1 HP', 'Single Target', 'Cantrip', 'RANGE: 6. Restore 1 HP to Dying creature. HIGH LEVELS: +2 healing every 5 levels.', '{"actions": "1 Action", "type": "Cantrip"}', 49),
('Blustery Gale', 'Wind', '3d4', 'Single Target', 'Tier 1', 'RANGE: 12. DAMAGE: 3d4 bludgeoning (advantage vs flying/Small/Tiny). Move target 2 spaces. UPCAST: +1 movement.', '{"actions": "2 Actions", "type": "Tier 1"}', 49),
('Barrier of Wind', 'Wind', '+3 Armor', 'Self', 'Tier 2', 'REACTION: When attacked at Range. Defend free. Ranged attacks have disadvantage this round. UPCAST: +3 Armor.', '{"actions": "1 Action", "type": "Tier 2"}', 49),
('Fly', 'Wind', NULL, 'Single Target+', 'Tier 3', 'CONCENTRATION: 10 minutes. Touch creature, grant flying speed 12. UPCAST: +1 target.', '{"actions": "1 Action", "type": "Tier 3"}', 49),
('Eye of the Storm', 'Wind', '4d4+10', 'AoE', 'Tier 4', 'REACH: 3. DAMAGE: 4d4+10 bludgeoning. Failed STR: place creatures within 1 space of Reach. UPCAST: +1 Reach.', '{"actions": "2 Actions", "type": "Tier 4"}', 49),
('Updraft', 'Wind', '1d6', 'AoE', 'Tier 5', 'REACH: 12. 5×5 area. Enemies repeat DEX save until succeed. 1d6 falling damage per fail. UPCAST: +2 Range, +1 area.', '{"actions": "3 Actions", "type": "Tier 5"}', 49),
('Thousand Cuts', 'Wind', 'd44', 'AoE', 'Tier 6', 'RANGE: 12. DAMAGE: d44 slashing (with advantage). Reach 1 of target. UPCAST: +1 Reach.', '{"actions": "3 Actions", "type": "Tier 6"}', 49),
('Boisterous Winds', 'Wind', NULL, 'Reach 12', 'Tier 7', 'CONCENTRATION: 1 minute. You and 9 allies gain: ranged attacks vs you have disadvantage, flying speed 9, move free 1/round. UPCAST: +1 minute or +2 targets. SONGWEAVER ONLY', '{"actions": "2 Actions", "type": "Tier 7"}', 49),
('Vicious Mockery', 'Wind', '1d4+INT', 'Single Target', 'Cantrip', 'RANGE: 12. DAMAGE: 1d4+INT psychic (ignoring armor). On hit: taunted next turn. HIGH LEVELS: +2 damage every 5 levels. SONGWEAVER ONLY', '{"actions": "1 Action", "type": "Cantrip"}', 49),

-- Radiant Spells (page 50)
('Rebuke', 'Radiant', '2× vs undead', 'Single Target', 'Cantrip', 'REACH: 4. DAMAGE: CHK (ignoring armor), does not miss. 2× vs undead/cowardly. HIGH LEVELS: +2 damage every 5 levels.', '{"actions": "1 Action", "type": "Cantrip"}', 50),
('True Strike', 'Radiant', NULL, 'Single Target', 'Cantrip', 'REACH: 2. Give creature advantage on next attack (until end of their next turn). UPCAST: +1 Reach, +4 levels.', '{"actions": "1 Action", "type": "Cantrip"}', 50),
('Heal', 'Radiant', '1+KEY HP', 'Single Target+', 'Tier 1', 'REACH: 1. Heal 1+KEY HP. UPCAST: +1 target, +4 Reach, or +1d6 healing. Can cure 1 condition if 5+ below max. ', '{"actions": "1 Action", "type": "Tier 1"}', 50),
('Warding Bond', 'Radiant', 'Half damage', 'Single Target', 'Tier 2', 'Ally takes half damage for 1 minute; you take the other half. UPCAST: +1 Creature.', '{"actions": "1 Action", "type": "Tier 2"}', 50),
('Shield of Justice', 'Radiant', 'Reflect', 'Self', 'Tier 3', 'REACTION: When attacked. Defend free, reflect Radiant damage equal to damage taken. UPCAST: +5 Armor.', '{"actions": "1 Action", "type": "Tier 3"}', 50),
('Condemn', 'Radiant', '1d4', 'Single Target', 'Tier 4', 'REACH: 4. Mark enemy that crit you/ally. Attacks vs them have advantage. UPCAST: +1 Reach, +1 advantage.', '{"actions": "2 Actions", "type": "Tier 4"}', 50),
('Vengeance', 'Radiant', '1d4', 'Single Target', 'Tier 5', 'REACH: 1. DAMAGE: 1d4 vs creature that attacked Dying ally or reduced one to 0 HP. UPCAST: +1 Reach, advantage.', '{"actions": "2 Actions", "type": "Tier 5"}', 50),
('Sacrifice', 'Radiant', 'Max HP', 'Special', 'Tier 6', 'REACH: 4. Reduce self to 0 HP. Heal others equal to your max HP. Can revive dead (last minute) with 20+ HP. UPCAST: +4 Reach.', '{"actions": "1 Action", "type": "Tier 6"}', 50),
('Redeem', 'Radiant', NULL, 'AoE', 'Tier 9', 'CASTING TIME: 24 hours. REQUIRES: 10,000 gp diamond. Revive any number of dead within 1 mile (died within past year, not old age). SHEPHERD ONLY', '{"actions": "Special", "type": "Tier 9"}', 50),
('Lifebinding Spirit', 'Radiant', '1d6+WILL', 'Companion', 'Tier 1', 'Summon spirit companion permanently bound to you. ACTION: Reach 4 attack (1d6+WILL radiant) or heal same. UPCAST: +1 die size (max d12), +1 heal use. SHEPHERD ONLY', '{"actions": "1 Action", "type": "Tier 1"}', 50),

-- Necrotic Spells (page 51)
('Entice', 'Necrotic', '1d4', 'Single Target', 'Cantrip', 'RANGE: 8. DAMAGE: 1d4 (ignoring armor). On hit: target moves 2 spaces closer. HIGH LEVELS: +1 die size up to 1d12.', '{"actions": "1 Action", "type": "Cantrip"}', 51),
('Withering Touch', 'Necrotic', '1d12', 'Single Target', 'Cantrip', 'REACH: 1. DAMAGE: 1d12. On hit: considered undead for 1 round. HIGH LEVELS: +6 damage every 5 levels.', '{"actions": "1 Action", "type": "Cantrip"}', 51),
('Shadow Trap', 'Necrotic', '3d12', 'Single Target', 'Tier 1', 'CONCENTRATION: 1 minute. Next creature adjacent suffers 3d12, if Small/Medium: Grappled until escape. UPCAST: +1d6 damage, +1d12 on escape.', '{"actions": "2 Actions", "type": "Tier 1"}', 51),
('Dread Visage', 'Necrotic', '1d12', 'Self', 'Tier 2', 'REACTION: When attacked, Defend free. Melee attackers Frightened, suffer 1d12 if attack. Costs 2 less mana when dying. UPCAST: +2 armor.', '{"actions": "1 Action", "type": "Tier 2"}', 51),
('Vampiric Greed', 'Necrotic', '4d12', 'AoE', 'Tier 3', 'Gain 1 Wound. Deal 4d12 to adjacent, heal half total. Gain 1 Wound per failed STR save. UPCAST: +1 DC.', '{"actions": "2 Actions", "type": "Tier 3"}', 51),
('Greater Shadow', 'Necrotic', '5d12', 'Summon', 'Tier 4', 'Summon 5d12 Greater Shadow (max 1). When dies: explodes into 5 shadow minions. UPCAST: +1d12 damage, +1 minion.', '{"actions": "2 Actions", "type": "Tier 4"}', 51),
('Cangenous Burst', 'Necrotic', '3d20', 'AoE', 'Tier 5', 'REACH: 8. Others in Reach take 3d20 (ignoring armor), half on STR save. Disadvantage if Bloodied. UPCAST: +10 damage.', '{"actions": "2 Actions", "type": "Tier 5"}', 51),
('Unspeakable Word', 'Necrotic', 'd66', 'Special', 'Tier 6', 'REACH: 8. DAMAGE: d66 (advantage, ignoring armor, no miss, crit on 66). Disadvantage if Bloodied/Frightened. Success: both take half. UPCAST: +1 DC, +1d6.', '{"actions": "2 Actions", "type": "Tier 6"}', 51),
('Creeping Death', 'Necrotic', '4d20', 'AoE', 'Tier 7', 'REACH: 8. DAMAGE: 4d20. If kills: erupts, Summon Shadow equal to damage to next creature in 8 spaces. Repeat until survives. UPCAST: +1d20.', '{"actions": "3 Actions", "type": "Tier 7"}', 51),
('Shadow Blast', 'Necrotic', '1d12+KEY', 'Single Target', 'Cantrip', 'RANGE: 8. DAMAGE: 1d12+KEY. 1/round. HIGH LEVELS: +1d12 every 5 levels. SHADOWMANCER ONLY', '{"actions": "1 Action", "type": "Cantrip"}', 51),
('Summon Shadow', 'Necrotic', NULL, 'Summon', 'Cantrip', 'Summon shadow minion within INT (max INT or LVL). KEYWORD: Command ALL minions move 8 then attack (Reach 1, d12). HIGH LEVELS: +1 Reach every 5 levels. SHADOWMANCER ONLY', '{"actions": "1 Action", "type": "Cantrip"}', 51);