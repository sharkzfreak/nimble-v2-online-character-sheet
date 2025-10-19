-- Fix range for self spells
UPDATE spells SET range_value = 'self' WHERE range_value = '0';