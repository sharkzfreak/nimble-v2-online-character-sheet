import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting rulebook data seeding...')

    // Seed Classes
    const classes = [
      {
        name: 'Berserker',
        description: 'An unstoppable force of wrath and ruin. The Berserker is destruction incarnate—knowing not fatigue nor caution, fueled by endless Rage.',
        complexity: 2,
        key_stats: ['STR', 'DEX'],
        hit_die: '1d12',
        starting_hp: 20,
        saves: ['STR+', 'INT-'],
        armor: 'None',
        weapons: 'all STR weapons',
        starting_gear: ['Battleaxe', 'Rations (meat)', 'Rope (50 ft.)'],
        source_page: 6
      },
      {
        name: 'The Cheat',
        description: 'A sneaky, backstabbing, dirty-fighting rogue.',
        complexity: 1,
        key_stats: ['DEX', 'INT'],
        hit_die: '1d8',
        starting_hp: 16,
        saves: ['DEX+', 'STR-'],
        armor: 'Light',
        weapons: 'Finesse, ranged',
        starting_gear: ['Daggers (2)', 'Thieves Tools', 'Rope (50 ft.)'],
        source_page: 5
      },
      {
        name: 'Commander',
        description: 'A battlefield tactician, leader, and weapon master.',
        complexity: 2,
        key_stats: ['STR', 'WIL'],
        hit_die: '1d10',
        starting_hp: 18,
        saves: ['STR+', 'INT-'],
        armor: 'All',
        weapons: 'All',
        starting_gear: ['Longsword', 'Shield', 'Chainmail', 'Rope (50 ft.)'],
        source_page: 5
      },
      {
        name: 'Hunter',
        description: 'Resourceful survivalist, bowmaster, and skilled tracker.',
        complexity: 2,
        key_stats: ['DEX', 'WIL'],
        hit_die: '1d10',
        starting_hp: 18,
        saves: ['DEX+', 'INT-'],
        armor: 'Light, Medium',
        weapons: 'All',
        starting_gear: ['Longbow', 'Arrows (20)', 'Leather Armor', 'Rope (50 ft.)'],
        source_page: 5
      },
      {
        name: 'Mage',
        description: 'Wield and shape the elements of fire, ice, and lightning.',
        complexity: 3,
        key_stats: ['INT', 'WIL'],
        hit_die: '1d6',
        starting_hp: 14,
        saves: ['INT+', 'STR-'],
        armor: 'None',
        weapons: 'Simple weapons',
        starting_gear: ['Quarterstaff', 'Spell Focus', 'Spellbook', 'Rations'],
        source_page: 5
      },
      {
        name: 'Oathsworn',
        description: 'Faithful guardian, protector, and avenger of the weak.',
        complexity: 2,
        key_stats: ['STR', 'WIL'],
        hit_die: '1d10',
        starting_hp: 18,
        saves: ['WIL+', 'DEX-'],
        armor: 'All',
        weapons: 'All',
        starting_gear: ['Longsword', 'Shield', 'Chainmail', 'Holy Symbol'],
        source_page: 5
      },
      {
        name: 'Shadowmancer',
        description: 'Summon hordes of expendable shadow minions.',
        complexity: 3,
        key_stats: ['INT', 'WIL'],
        hit_die: '1d8',
        starting_hp: 16,
        saves: ['WIL+', 'STR-'],
        armor: 'Light',
        weapons: 'Simple weapons',
        starting_gear: ['Dagger', 'Arcane Focus', 'Dark Robes', 'Grimoire'],
        source_page: 6
      },
      {
        name: 'Shepherd',
        description: 'Master life and death. Lead a faithful companion.',
        complexity: 2,
        key_stats: ['WIL', 'INT'],
        hit_die: '1d8',
        starting_hp: 16,
        saves: ['WIL+', 'STR-'],
        armor: 'Light, Medium',
        weapons: 'Simple weapons',
        starting_gear: ['Quarterstaff', 'Holy Symbol', 'Healing Kit', 'Robes'],
        source_page: 6
      },
      {
        name: 'Songweaver',
        description: 'Inspiring presence, sharp wit, sharper tongue.',
        complexity: 3,
        key_stats: ['WIL', 'DEX'],
        hit_die: '1d8',
        starting_hp: 16,
        saves: ['WIL+', 'STR-'],
        armor: 'Light',
        weapons: 'Simple weapons, rapiers',
        starting_gear: ['Rapier', 'Lute', 'Leather Armor', 'Fine Clothes'],
        source_page: 6
      },
      {
        name: 'Stormshifter',
        description: 'Master of beast and nature.',
        complexity: 3,
        key_stats: ['WIL', 'STR'],
        hit_die: '1d8',
        starting_hp: 16,
        saves: ['WIL+', 'INT-'],
        armor: 'Light, Medium',
        weapons: 'Simple weapons, scimitars',
        starting_gear: ['Scimitar', 'Druidic Focus', 'Leather Armor', 'Herbalism Kit'],
        source_page: 6
      },
      {
        name: 'Zephyr',
        description: 'A disciplined martial artist with swift hands and swift feet.',
        complexity: 2,
        key_stats: ['DEX', 'WIL'],
        hit_die: '1d8',
        starting_hp: 16,
        saves: ['DEX+', 'INT-'],
        armor: 'None',
        weapons: 'Simple weapons, shortswords',
        starting_gear: ['Quarterstaff', 'Shortsword', 'Monk Robes', 'Prayer Beads'],
        source_page: 6
      }
    ]

    const { data: insertedClasses, error: classesError } = await supabaseClient
      .from('classes')
      .upsert(classes, { onConflict: 'name' })
      .select()

    if (classesError) {
      console.error('Error seeding classes:', classesError)
      throw classesError
    }

    console.log(`Seeded ${insertedClasses.length} classes`)

    // Seed Core Rules
    const coreRules = [
      {
        category: 'stats',
        name: 'Strength (STR)',
        description: 'Your raw physical power and resilience, endurance, and resistance to harm. Affects STR weapon damage, resistance to Wounds, HP recovery, Concentration, STR saves, carrying capacity, Grappling, and the Might skill.',
        source_page: 7
      },
      {
        category: 'stats',
        name: 'Intelligence (INT)',
        description: 'Your Intelligence reflects knowledge and reasoning across fields like the arcane, tactics, or street smarts. Affects languages, spellcasting, use of wands, spell scrolls, INT saves, as well as the Arcana, Examination, and Lore skills.',
        source_page: 7
      },
      {
        category: 'stats',
        name: 'Dexterity (DEX)',
        description: 'Your agility, reflexes, and precision with blades or bows. Affects DEX weapon damage, Initiative, DEX saves, Grappling, and can contribute to Armor, as well as the Stealth and Finesse skills.',
        source_page: 7
      },
      {
        category: 'stats',
        name: 'Will (WIL)',
        description: 'Your force of personality, courage, and wisdom. Will shapes your interactions with both nature and society. Affects spellcasting and WIL saves, as well as the Insight, Influence, Naturecraft, and Perception skills.',
        source_page: 7
      },
      {
        category: 'skills',
        name: 'Arcana',
        description: 'Your understanding of magical phenomena, spells, and enchantments. With Arcana, you can identify magical effects, decipher arcane symbols, and discern the properties of magical items.',
        source_page: 7
      },
      {
        category: 'skills',
        name: 'Insight',
        description: 'Your ability to understand people and situations beyond the obvious. Use Insight to sense motives, detect lies, read hidden emotions, make sense of clues, and when faced with uncertainty.',
        source_page: 7
      },
      {
        category: 'skills',
        name: 'Examination',
        description: 'Your aptitude for thorough analysis and deduction. Use Examination to diagnose injuries, determine causes of death, uncover clues, and unravel the workings of traps or mechanical devices.',
        source_page: 7
      },
      {
        category: 'skills',
        name: 'Finesse',
        description: 'Your ability to use your hands and feet in careful ways. Use Finesse for activities such as picking locks, disarming traps, piloting vehicles, tinkering, card tricks, stealing or planting items, climbing, or any task requiring precise, careful movement.',
        source_page: 7
      }
    ]

    const { data: insertedRules, error: rulesError } = await supabaseClient
      .from('rules')
      .upsert(coreRules, { onConflict: 'category,name' })
      .select()

    if (rulesError) {
      console.error('Error seeding rules:', rulesError)
      throw rulesError
    }

    console.log(`Seeded ${insertedRules.length} rules`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Rulebook data seeded successfully',
        stats: {
          classes: insertedClasses.length,
          rules: insertedRules.length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in seed-rulebook function:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})