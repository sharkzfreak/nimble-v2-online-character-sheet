-- Update spell names to include tier
UPDATE spells SET name = name || ' (Cantrip)' WHERE duration = 'Cantrip';
UPDATE spells SET name = name || ' (Tier 1)' WHERE duration = 'Tier 1';
UPDATE spells SET name = name || ' (Tier 2)' WHERE duration = 'Tier 2';
UPDATE spells SET name = name || ' (Tier 3)' WHERE duration = 'Tier 3';
UPDATE spells SET name = name || ' (Tier 4)' WHERE duration = 'Tier 4';
UPDATE spells SET name = name || ' (Tier 5)' WHERE duration = 'Tier 5';
UPDATE spells SET name = name || ' (Tier 6)' WHERE duration = 'Tier 6';
UPDATE spells SET name = name || ' (Tier 7)' WHERE duration = 'Tier 7';
UPDATE spells SET name = name || ' (Tier 8)' WHERE duration = 'Tier 8';
UPDATE spells SET name = name || ' (Tier 9)' WHERE duration = 'Tier 9';

-- Update duration to show actions instead of tier
UPDATE spells SET duration = '1 action' WHERE properties->>'actions' = '1 Action';
UPDATE spells SET duration = '2 actions' WHERE properties->>'actions' = '2 Actions';
UPDATE spells SET duration = '3 actions' WHERE properties->>'actions' = '3 Actions';
UPDATE spells SET duration = '5 actions' WHERE properties->>'actions' = '5 Actions';

-- Update range to be single number (extracting numbers from existing ranges)
UPDATE spells SET range_value = '0' WHERE range_value IN ('Self', 'Summon');
UPDATE spells SET range_value = '4' WHERE range_value = 'Single Target';
UPDATE spells SET range_value = '8' WHERE range_value = 'AoE';
UPDATE spells SET range_value = '2' WHERE range_value = '2 Targets';
UPDATE spells SET range_value = '4' WHERE range_value LIKE 'Cone%';
UPDATE spells SET range_value = '12' WHERE range_value LIKE 'Line%';
UPDATE spells SET range_value = '4' WHERE range_value LIKE 'Reach%';