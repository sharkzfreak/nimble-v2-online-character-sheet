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

    // Seed Equipment
    const equipment = [
      { name: 'Longsword', category: 'Weapon', damage: '1d8', type: 'Melee', cost: '15 gp', weight: 3, properties: { versatile: '1d10' } },
      { name: 'Shortsword', category: 'Weapon', damage: '1d6', type: 'Melee', cost: '10 gp', weight: 2, properties: { light: true, finesse: true } },
      { name: 'Greatsword', category: 'Weapon', damage: '2d6', type: 'Melee', cost: '50 gp', weight: 6, properties: { two_handed: true } },
      { name: 'Battleaxe', category: 'Weapon', damage: '1d8', type: 'Melee', cost: '10 gp', weight: 4, properties: { versatile: '1d10' } },
      { name: 'Warhammer', category: 'Weapon', damage: '1d8', type: 'Melee', cost: '15 gp', weight: 2, properties: { versatile: '1d10' } },
      { name: 'Dagger', category: 'Weapon', damage: '1d4', type: 'Melee', cost: '2 gp', weight: 1, properties: { light: true, finesse: true, thrown: '20/60' } },
      { name: 'Rapier', category: 'Weapon', damage: '1d8', type: 'Melee', cost: '25 gp', weight: 2, properties: { finesse: true } },
      { name: 'Quarterstaff', category: 'Weapon', damage: '1d6', type: 'Melee', cost: '2 sp', weight: 4, properties: { versatile: '1d8' } },
      { name: 'Scimitar', category: 'Weapon', damage: '1d6', type: 'Melee', cost: '25 gp', weight: 3, properties: { finesse: true, light: true } },
      { name: 'Longbow', category: 'Weapon', damage: '1d8', type: 'Ranged', range_value: '150/600', cost: '50 gp', weight: 2, properties: { two_handed: true } },
      { name: 'Shortbow', category: 'Weapon', damage: '1d6', type: 'Ranged', range_value: '80/320', cost: '25 gp', weight: 2, properties: { two_handed: true } },
      { name: 'Light Crossbow', category: 'Weapon', damage: '1d8', type: 'Ranged', range_value: '80/320', cost: '25 gp', weight: 5, properties: { two_handed: true, loading: true } },
      { name: 'Leather Armor', category: 'Armor', defense: 1, cost: '10 gp', weight: 10, description: 'Light armor made of hardened leather' },
      { name: 'Chainmail', category: 'Armor', defense: 3, cost: '75 gp', weight: 55, description: 'Heavy armor of interlocking metal rings' },
      { name: 'Plate Armor', category: 'Armor', defense: 4, cost: '1500 gp', weight: 65, description: 'Heavy armor of shaped metal plates' },
      { name: 'Shield', category: 'Armor', defense: 1, cost: '10 gp', weight: 6, description: 'Increases defense when wielded' },
      { name: 'Backpack', category: 'Gear', cost: '2 gp', weight: 5, description: 'Holds gear and equipment' },
      { name: 'Rope (50 ft.)', category: 'Gear', cost: '1 gp', weight: 10, description: 'Hemp rope' },
      { name: 'Rations', category: 'Gear', cost: '5 sp', weight: 2, description: 'Dried food for travel' },
      { name: 'Thieves Tools', category: 'Gear', cost: '25 gp', weight: 1, description: 'Required for lockpicking' },
      { name: 'Spell Focus', category: 'Gear', cost: '25 gp', weight: 1, description: 'Required for casting spells' },
      { name: 'Spellbook', category: 'Gear', cost: '50 gp', weight: 3, description: 'Contains prepared spells' },
      { name: 'Holy Symbol', category: 'Gear', cost: '5 gp', weight: 0, description: 'Symbol of divine faith' }
    ]

    const { data: insertedEquipment, error: equipmentError } = await supabaseClient
      .from('equipment')
      .upsert(equipment, { onConflict: 'name' })
      .select()

    if (equipmentError) {
      console.error('Error seeding equipment:', equipmentError)
      throw equipmentError
    }

    console.log(`Seeded ${insertedEquipment.length} equipment items`)

    // Seed Spells
    const spells = [
      { name: 'Fireball', element: 'Fire', damage: '8d6', range_value: '150 ft', duration: 'Instant', description: 'A bright streak flashes to explode in a fiery burst. 20-foot radius.', properties: { save: 'DEX', area: '20ft radius' } },
      { name: 'Burning Hands', element: 'Fire', damage: '3d6', range_value: 'Self (15ft cone)', duration: 'Instant', description: 'Flames shoot from your fingers in a fiery cone.', properties: { save: 'DEX', area: '15ft cone' } },
      { name: 'Ice Storm', element: 'Ice', damage: '4d8', range_value: '300 ft', duration: 'Instant', description: 'Hail falls in a 20-foot radius. Targets must save or take damage and be slowed.', properties: { save: 'DEX', area: '20ft radius' } },
      { name: 'Cone of Cold', element: 'Ice', damage: '8d8', range_value: 'Self (60ft cone)', duration: 'Instant', description: 'Blast of cold air erupts from your hands.', properties: { save: 'WIL', area: '60ft cone' } },
      { name: 'Lightning Bolt', element: 'Lightning', damage: '8d6', range_value: '100 ft', duration: 'Instant', description: 'A stroke of lightning forms a 100-foot line, 5 feet wide.', properties: { save: 'DEX', area: '100ft line' } },
      { name: 'Chain Lightning', element: 'Lightning', damage: '10d8', range_value: '150 ft', duration: 'Instant', description: 'Lightning arcs to multiple targets within 30 feet of each other.', properties: { save: 'DEX', targets: '1 primary + 3 secondary' } },
      { name: 'Healing Word', element: 'Divine', damage: null, range_value: '60 ft', duration: 'Instant', description: 'A creature regains 1d4 + WIL HP.', properties: { healing: '1d4 + WIL' } },
      { name: 'Shield of Faith', element: 'Divine', damage: null, range_value: '60 ft', duration: '10 minutes', description: 'A shimmering field grants +2 Defense.', properties: { duration: '10 minutes', bonus: '+2 Defense' } },
      { name: 'Bless', element: 'Divine', damage: null, range_value: '30 ft', duration: '1 minute', description: 'Up to three creatures gain +1d4 to attack and saves.', properties: { duration: '1 minute', targets: 3 } },
      { name: 'Shadow Bolt', element: 'Shadow', damage: '2d8', range_value: '60 ft', duration: 'Instant', description: 'A bolt of dark energy strikes your foe.', properties: { save: 'WIL' } },
      { name: 'Summon Shadow', element: 'Shadow', damage: null, range_value: '30 ft', duration: '1 hour', description: 'Summon a shadow minion to fight for you.', properties: { duration: '1 hour', minion: true } }
    ]

    const { data: insertedSpells, error: spellsError } = await supabaseClient
      .from('spells')
      .upsert(spells, { onConflict: 'name' })
      .select()

    if (spellsError) {
      console.error('Error seeding spells:', spellsError)
      throw spellsError
    }

    console.log(`Seeded ${insertedSpells.length} spells`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Rulebook data seeded successfully',
        stats: {
          classes: insertedClasses.length,
          rules: insertedRules.length,
          equipment: insertedEquipment.length,
          spells: insertedSpells.length
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