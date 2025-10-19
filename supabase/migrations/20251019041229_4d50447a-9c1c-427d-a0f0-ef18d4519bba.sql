-- Remove duplicate skills entries with lowercase category
DELETE FROM rules WHERE category = 'skills';