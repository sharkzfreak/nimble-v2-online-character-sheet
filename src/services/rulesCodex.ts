import { supabase } from "@/integrations/supabase/client";
import { NIMBLE_STAT_ARRAYS } from "@/config/nimbleArrays";
import { CLASS_FEATURES } from "@/config/classFeatures";
import type {
  CodexContent,
  CharacterOverlay,
  SearchIndex,
  RulesCodex,
  DerivedStats,
  FeatureChoiceDescriptor,
  FeatureDescriptor,
} from "@/types/codex";

// Normalize content: fill missing fields, ensure arrays
function normalizeContent(content: CodexContent): void {
  content.classes.forEach((cls) => {
    cls.featureTable = cls.featureTable || [];
    cls.featureTable.forEach((feature) => {
      feature.tags = feature.tags || [];
      feature.text = feature.text?.trim() || "";
      if (feature.options) {
        feature.options.forEach((opt) => {
          opt.text = opt.text?.trim() || "";
        });
      }
    });
  });
  content.items = content.items || [];
  content.powers = content.powers || [];
  content.glossary = content.glossary || [];
}

// Assert unique IDs
function assertUniqueIds(content: CodexContent): void {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  const check = (id: string, source: string) => {
    if (seen.has(id)) {
      duplicates.push(`${id} (${source})`);
    }
    seen.add(id);
  };

  content.statArrays.forEach((arr) => check(arr.id, "statArray"));
  content.classes.forEach((cls) => {
    check(cls.id, "class");
    cls.featureTable.forEach((f) => check(f.id, `class.${cls.name}.feature`));
  });
  content.items?.forEach((i) => check(i.id, "item"));
  content.powers?.forEach((p) => check(p.id, "power"));

  if (duplicates.length > 0) {
    console.warn("⚠️ Duplicate IDs found:", duplicates);
  }
}

// Convert character data to overlay
export function toCharacterOverlay(src: any): CharacterOverlay {
  return {
    characterId: src.id,
    name: src.name,
    level: src.level || 1,
    classId: src.class_id || src.class || "",
    stats_mod: {
      STR: src.str_mod ?? 0,
      DEX: src.dex_mod ?? 0,
      INT: src.int_mod ?? 0,
      WILL: src.will_mod ?? 0,
    },
    hp: {
      current: src.hp_current || 0,
      max: src.hp_max || 0,
      temp: src.hp_temp || 0,
    },
    armor: src.armor || 10,
    speed: src.speed || 30,
    choices: src.class_features || [],
    inventory: src.inventory || [],
    favorites: src.favorites || { featureIds: [], itemIds: [] },
    overrides: src.overrides || {},
    notes: src.notes || "",
  };
}

// Build ID map
function buildIdMap(content: CodexContent): Record<string, any> {
  const map: Record<string, any> = {};
  
  content.statArrays.forEach((arr) => {
    map[arr.id] = arr;
  });
  
  content.classes.forEach((cls) => {
    map[cls.id] = cls;
    cls.featureTable.forEach((f) => {
      map[f.id] = f;
      if (f.options) {
        f.options.forEach((opt) => {
          map[opt.id] = opt;
        });
      }
    });
  });
  
  (content.items || []).forEach((i) => {
    map[i.id] = i;
  });
  
  (content.powers || []).forEach((p) => {
    map[p.id] = p;
  });
  
  (content.glossary || []).forEach((g) => {
    map[g.id] = g;
  });
  
  return map;
}

// Build search index
function buildSearchIndex(content: CodexContent): SearchIndex {
  const entities: SearchIndex["entities"] = [];
  
  const push = (id: string, t: string, ty: string, lvl?: number, tags?: string[]) => {
    entities.push({ id, t, ty, lvl, tags });
  };

  content.classes.forEach((c) => {
    push(c.id, `${c.name} ${c.description || ""}`, "class", 1, []);
    c.featureTable.forEach((f) => {
      const optionText = (f.options || []).map((o) => o.name).join(" ");
      push(f.id, `${f.name} ${f.text} ${optionText}`, "feature", f.level, f.tags);
    });
  });

  (content.items || []).forEach((i) => {
    push(i.id, `${i.name} ${i.text || ""} ${(i.tags || []).join(" ")}`, "item");
  });

  (content.powers || []).forEach((p) => {
    push(p.id, `${p.name} ${p.text}`, "power");
  });

  const terms: Record<string, string[]> = {};
  entities.forEach((e) => {
    const words = e.t
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    new Set(words).forEach((w) => {
      (terms[w] ||= []).push(e.id);
    });
  });

  const search = (q: string, filter?: { type?: string[]; levelLE?: number }) => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    let ids = new Set<string>();
    
    words.forEach((w, i) => {
      const bucket = new Set(terms[w] || []);
      ids = i === 0 ? bucket : new Set([...ids].filter((x) => bucket.has(x)));
    });
    
    let out = [...ids];
    
    if (filter?.type?.length) {
      out = out.filter((id) =>
        filter!.type!.includes(entities.find((e) => e.id === id)?.ty || "")
      );
    }
    
    if (filter?.levelLE) {
      out = out.filter((id) => (entities.find((e) => e.id === id)?.lvl || 99) <= filter!.levelLE!);
    }
    
    return out;
  };

  return { terms, entities, search };
}

// Compute derived stats
function computeDerived(c: CharacterOverlay, ct: CodexContent): DerivedStats {
  const cls = ct.classes.find((x) => x.id === c.classId);
  
  if (!cls) {
    return {
      hpMax: c.hp.max,
      armor: c.armor,
      speed: 30,
    };
  }

  const hpMax = c.overrides?.hpMax ?? (cls.baseHPPerLevel * c.level);
  const armor = c.overrides?.armor ?? (cls.baseArmor + c.stats_mod.DEX);
  const speed = c.overrides?.speed ?? cls.baseSpeed;

  return { hpMax, armor, speed };
}

// Get available choices for a level
function getAvailableChoices(
  character: CharacterOverlay,
  content: CodexContent,
  targetLevel: number
): FeatureChoiceDescriptor[] {
  const cls = content.classes.find((x) => x.id === character.classId);
  if (!cls) return [];

  return cls.featureTable
    .filter((f) => f.level <= targetLevel && f.requiresChoice)
    .map((f) => ({
      featureId: f.id,
      name: f.name,
      level: f.level,
      requiresChoice: f.requiresChoice,
      choiceCount: f.choiceCount,
      options: f.options,
    }));
}

// Validate choice
function validateChoice(
  character: CharacterOverlay,
  content: CodexContent,
  pick: { featureId: string; optionIds: string[] }
): boolean {
  const cls = content.classes.find((x) => x.id === character.classId);
  if (!cls) return false;

  const feature = cls.featureTable.find((f) => f.id === pick.featureId);
  if (!feature) return false;

  if (!feature.requiresChoice) return true;

  const validOptionIds = (feature.options || []).map((o) => o.id);
  return pick.optionIds.every((id) => validOptionIds.includes(id));
}

// Load Nimble content from cache/fallback
async function loadNimbleContent(): Promise<CodexContent> {
  try {
    // Try to load from Supabase
    const [classesRes, equipmentRes, spellsRes] = await Promise.all([
      supabase.from("classes").select("*"),
      supabase.from("equipment").select("*"),
      supabase.from("spells").select("*"),
    ]);

    const classes = (classesRes.data || []).map((cls) => ({
      id: cls.id,
      name: cls.name,
      color: "hsl(var(--primary))",
      baseHPPerLevel: cls.starting_hp || 8,
      baseArmor: 10,
      baseSpeed: 30,
      description: cls.description,
      featureTable: (CLASS_FEATURES[cls.name] || []).map((f) => ({
        id: f.id,
        level: f.level,
        name: f.name,
        text: f.description,
        requiresChoice: f.requires_choice || false,
        choiceType: "single" as const,
        choiceCount: 1,
        options: f.options,
        tags: [],
      })) as FeatureDescriptor[],
    }));

    const items = (equipmentRes.data || []).map((item) => ({
      id: item.id,
      name: item.name,
      type: (item.category?.toLowerCase() || "gear") as "weapon" | "armor" | "gear",
      props: {
        damage: item.damage || undefined,
        range: item.range_value || undefined,
        armorBonus: item.defense || undefined,
      },
      text: item.description || "",
      tags: [],
    }));

    const powers = (spellsRes.data || []).map((spell) => ({
      id: spell.id,
      name: spell.name,
      text: spell.description,
      tags: [spell.element],
    }));

    return {
      version: "2.0",
      system: "Nimble v2",
      modsOnly: true,
      statArrays: NIMBLE_STAT_ARRAYS.map((arr) => ({
        id: arr.id,
        label: arr.name,
        mods: arr.modifiers as [number, number, number, number],
        description: arr.description,
      })),
      classes,
      items,
      powers,
      glossary: [],
    };
  } catch (error) {
    console.error("Error loading content:", error);
    // Return minimal fallback
    return {
      version: "2.0",
      system: "Nimble v2",
      modsOnly: true,
      statArrays: NIMBLE_STAT_ARRAYS.map((arr) => ({
        id: arr.id,
        label: arr.name,
        mods: arr.modifiers as [number, number, number, number],
        description: arr.description,
      })),
      classes: [],
      items: [],
      powers: [],
      glossary: [],
    };
  }
}

// Build the complete codex
export async function buildRulesCodex(characterData: any): Promise<RulesCodex> {
  const content = await loadNimbleContent();
  normalizeContent(content);
  assertUniqueIds(content);

  const character = toCharacterOverlay(characterData);
  const index = buildSearchIndex(content);
  const byId = buildIdMap(content);

  return {
    content,
    character,
    index,
    byId,
    compute: {
      derived: (c, ct) => computeDerived(c, ct),
      availableChoices: (level) => getAvailableChoices(character, content, level),
      legal: (pick) => validateChoice(character, content, pick),
    },
  };
}
