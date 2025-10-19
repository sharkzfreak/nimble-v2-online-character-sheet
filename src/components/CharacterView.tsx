import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Zap, 
  Target, 
  Swords, 
  BookOpen, 
  Wand2, 
  FileText, 
  Activity,
  ChevronDown,
  Heart,
  Footprints,
  Sparkles,
  Package,
  Plus,
  X,
  TrendingUp,
  Sigma,
  Star,
  Maximize2,
  ArrowRight
} from "lucide-react";
import { ResizableCard } from "@/components/ResizableCard";
import { D20Icon } from "@/components/icons/D20Icon";
import { useFitToWindow } from "@/hooks/useFitToWindow";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DiceRollToast } from "./DiceRollToast";
import { useNimbleRuleset } from "@/hooks/useNimbleRuleset";
import { useDiceLog } from "@/contexts/DiceLogContext";
import { DiceLogPanel } from "./DiceLogPanel";
import { DiceRollAnimation } from "./DiceRollAnimation";
import { AnimatedStatContainer } from "./AnimatedStatContainer";
import { ProfileCard } from "./ProfileCard";
import { FavoritesCard } from "./FavoritesCard";
import { LevelUpWizard } from "./levelup/LevelUpWizard";
import { FeaturesTimeline } from "./FeaturesTimeline";
import { FormulaInspector, FormulaBreakdown } from "./FormulaInspector";
import { calculateHPFormula, calculateArmorFormula, calculateSpeedFormula } from "@/utils/formulaCalculations";
import { FeatureCard } from "./FeatureCard";
import { CollapsibleFeatureItem } from "./CollapsibleFeatureItem";
import { AbilityCircle } from "./AbilityCircle";
import { ActionBar } from "./ActionBar";
import { FavoriteItem, ActionSpec, AdvMode, FeatureLike, RollBinding } from "@/types/rollable";
import { rollAction, formatRollResult } from "@/utils/rollEngine";
import { getFeaturesAtLevel } from "@/config/classFeatures";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

interface CustomItem extends FeatureLike {
  rollFormula?: string;
}

interface CharacterViewProps {
  characterId?: string;
  formData: {
    name: string;
    player: string;
    campaign: string;
    description: string;
    level: number;
    str_mod: number;
    dex_mod: number;
    int_mod: number;
    will_mod: number;
    skill_arcana: number;
    skill_examination: number;
    skill_finesse: number;
    skill_influence: number;
    skill_insight: number;
    skill_might: number;
    skill_lore: number;
    skill_naturecraft: number;
    skill_perception: number;
    skill_stealth: number;
    background: string;
    race: string;
    class: string;
    abilities: string;
    spells: string;
    powers: string;
    notes: string;
    hp_current: number;
    hp_max: number;
    hp_temp: number;
    armor: number;
    speed?: number;
    hit_dice_remaining: number;
    hit_dice_total: number;
    portrait_url?: string;
    favorites?: FavoriteItem[];
    journal_entries?: JournalEntry[];
    custom_features?: CustomItem[];
    custom_spells?: CustomItem[];
    custom_inventory?: CustomItem[];
  };
  calculateHealth: () => number;
  calculateDefense: () => number;
  calculateInitiative: () => number;
  calculateCarryWeight: () => number;
  onFormDataChange?: (updates: Partial<CharacterViewProps['formData']>) => void;
  actionTracker?: boolean[];
  onActionTrackerChange?: (tracker: boolean[]) => void;
}

const CharacterView = ({
  characterId,
  formData,
  calculateHealth,
  calculateDefense,
  calculateInitiative,
  calculateCarryWeight,
  onFormDataChange,
  actionTracker = [true, true, true],
  onActionTrackerChange,
}: CharacterViewProps) => {
  const { data: ruleset, isLoading: rulesetLoading } = useNimbleRuleset();
  const { addLog, animationsEnabled } = useDiceLog();
  const [advMode, setAdvMode] = useState<AdvMode>('normal');
  const [situational, setSituational] = useState(0);
  
  const [diceRoll, setDiceRoll] = useState<{
    statName: string;
    roll: number;
    modifier: number;
    total: number;
    diceType?: string;
  } | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [pendingRoll, setPendingRoll] = useState<{
    characterName: string;
    formula: string;
    rawResult: number;
    modifier: number;
    total: number;
    rollType: string;
    individualRolls: Array<{ value: number; sides: number }>;
  } | null>(null);
  const [newJournalTitle, setNewJournalTitle] = useState("");
  const [newJournalContent, setNewJournalContent] = useState("");
  const [isJournalDialogOpen, setIsJournalDialogOpen] = useState(false);
  
  // Feature dialog state
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState("");
  const [newFeatureDescription, setNewFeatureDescription] = useState("");
  const [newFeatureFormula, setNewFeatureFormula] = useState("");
  
  // Spell dialog state
  const [isSpellDialogOpen, setIsSpellDialogOpen] = useState(false);
  const [spellViewMode, setSpellViewMode] = useState<'codex' | 'custom'>('codex');
  const [newSpellName, setNewSpellName] = useState("");
  const [newSpellDescription, setNewSpellDescription] = useState("");
  const [newSpellFormula, setNewSpellFormula] = useState("");
  const [spellSearchQuery, setSpellSearchQuery] = useState("");
  
  // Inventory dialog state
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [inventoryViewMode, setInventoryViewMode] = useState<'codex' | 'custom'>('codex');
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemFormula, setNewItemFormula] = useState("");
  const [inventorySearchQuery, setInventorySearchQuery] = useState("");
  
  // Level-up wizard state
  const [isLevelUpWizardOpen, setIsLevelUpWizardOpen] = useState(false);
  
  // Formula inspector state
  const [formulaInspectorOpen, setFormulaInspectorOpen] = useState(false);
  const [currentFormula, setCurrentFormula] = useState<FormulaBreakdown | null>(null);
  
  // Favorites tab state
  const [favoritesTabActive, setFavoritesTabActive] = useState(false);
  
  // Heroic reactions state
  const [heroicReactions, setHeroicReactions] = useState<Array<{ id: string; name: string; description: string }>>([]);
  
  // Available equipment and spells from codex
  const [availableEquipment, setAvailableEquipment] = useState<any[]>([]);
  const [availableSpells, setAvailableSpells] = useState<any[]>([]);
  const [showCodexItems, setShowCodexItems] = useState(false);
  const [showCodexSpells, setShowCodexSpells] = useState(false);


  // Fetch heroic reactions, equipment, and spells from rules codex
  useEffect(() => {
    const fetchCodexData = async () => {
      // Fetch heroic reactions
      const { data: heroicData } = await supabase
        .from('rules')
        .select('*')
        .eq('category', 'Core Rules')
        .ilike('name', '%heroic%');
      
      if (heroicData) {
        setHeroicReactions(heroicData.map(rule => ({
          id: rule.id,
          name: rule.name,
          description: rule.description
        })));
      }
      
      // Fetch equipment
      const { data: equipmentData } = await supabase
        .from('equipment')
        .select('*')
        .order('name');
      
      if (equipmentData) {
        setAvailableEquipment(equipmentData);
      }
      
      // Fetch spells
      const { data: spellsData } = await supabase
        .from('spells')
        .select('*')
        .order('name');
      
      if (spellsData) {
        setAvailableSpells(spellsData);
      }
    };
    
    fetchCodexData();
  }, []);

  // Build action tiles from favorites
  const actionTiles = (formData.favorites || []).map((fav: FavoriteItem) => ({
    id: fav.id,
    name: fav.name,
    actions: fav.actions || [],
    starred: true,
    type: fav.type as 'feature' | 'item' | 'spell' | 'class',
  }));


  const getModifierString = (mod: number): string => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const rollDice = (statName: string, modifier: number, diceType: string = "d20") => {
    if (isRolling) {
      console.log('Already rolling, skipping stat roll...');
      return;
    }
    
    console.log(`Initiating roll for ${statName}`);
    setIsRolling(true);
    const diceMax = parseInt(diceType.substring(1)) || 20;
    const roll = Math.ceil(Math.random() * diceMax);
    const total = roll + modifier;
    
    console.log(`Rolling ${statName}: ${roll} + ${modifier} = ${total} (${diceType})`);
    setDiceRoll({ statName, roll, modifier, total, diceType });
    
    const pendingRollData = {
      characterName: formData.name || 'Unknown',
      formula: `${diceType}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`,
      rawResult: roll,
      modifier,
      total,
      rollType: 'stat',
      individualRolls: [{ value: roll, sides: diceMax }],
    };

    if (animationsEnabled) {
      setShowAnimation(true);
      setPendingRoll(pendingRollData);
    } else {
      // No animation - log immediately
      addLog({
        character_name: pendingRollData.characterName,
        character_id: characterId,
        formula: pendingRollData.formula,
        raw_result: pendingRollData.rawResult,
        modifier: pendingRollData.modifier,
        total: pendingRollData.total,
        roll_type: pendingRollData.rollType,
        individual_rolls: pendingRollData.individualRolls,
      });
      setIsRolling(false);
    }
  };

  const rollSkillCheck = (skillName: string, skillValue: number) => {
    if (isRolling) {
      console.log('Already rolling, skipping skill check...');
      return;
    }
    
    console.log(`Initiating skill check for ${skillName}`);
    setIsRolling(true);
    const roll = Math.ceil(Math.random() * 20);
    const total = roll + skillValue;
    
    console.log(`Rolling ${skillName}: ${roll} + ${skillValue} = ${total} (d20 skill check)`);
    setDiceRoll({ statName: skillName, roll, modifier: skillValue, total, diceType: "d20" });
    
    const pendingRollData = {
      characterName: formData.name || 'Unknown',
      formula: `d20${skillValue !== 0 ? ` ${skillValue > 0 ? '+' : ''}${skillValue}` : ''}`,
      rawResult: roll,
      modifier: skillValue,
      total,
      rollType: 'skill',
      individualRolls: [{ value: roll, sides: 20 }],
    };

    if (animationsEnabled) {
      setShowAnimation(true);
      setPendingRoll(pendingRollData);
    } else {
      // No animation - log immediately
      addLog({
        character_name: pendingRollData.characterName,
        character_id: characterId,
        formula: pendingRollData.formula,
        raw_result: pendingRollData.rawResult,
        modifier: pendingRollData.modifier,
        total: pendingRollData.total,
        roll_type: pendingRollData.rollType,
        individual_rolls: pendingRollData.individualRolls,
      });
      setIsRolling(false);
    }
  };

  const handleAnimationComplete = () => {
    console.log('Animation complete, resetting isRolling state');
    setShowAnimation(false);
    setIsRolling(false);

    // Log the roll after animation
    if (pendingRoll) {
      addLog({
        character_name: pendingRoll.characterName,
        character_id: characterId,
        formula: pendingRoll.formula,
        raw_result: pendingRoll.rawResult,
        modifier: pendingRoll.modifier,
        total: pendingRoll.total,
        roll_type: pendingRoll.rollType,
        individual_rolls: pendingRoll.individualRolls,
      });
      setPendingRoll(null);
    }
  };

  const showFormulaInspector = (type: 'hp' | 'armor' | 'speed') => {
    let breakdown: FormulaBreakdown;
    
    const character = {
      level: formData.level,
      class: formData.class,
      str_mod: formData.str_mod,
      dex_mod: formData.dex_mod,
      int_mod: formData.int_mod,
      will_mod: formData.will_mod,
      hp_max: formData.hp_max,
      armor: formData.armor,
      equipment: undefined,
      custom_features: formData.custom_features,
    };
    
    switch (type) {
      case 'hp':
        breakdown = calculateHPFormula(character);
        break;
      case 'armor':
        breakdown = calculateArmorFormula(character);
        break;
      case 'speed':
        breakdown = calculateSpeedFormula(character);
        break;
    }
    
    setCurrentFormula(breakdown);
    setFormulaInspectorOpen(true);
  };

  const handleResetOverride = async () => {
    if (!currentFormula || !characterId) return;

    const updates: any = {};
    
    if (currentFormula.stat === 'HP Max') {
      updates.hp_max = currentFormula.computedValue;
    } else if (currentFormula.stat === 'Armor') {
      updates.armor = currentFormula.computedValue;
    }

    try {
      const { error} = await supabase
        .from('characters')
        .update(updates)
        .eq('id', characterId);

      if (error) throw error;

      toast({
        title: "Override Removed",
        description: `${currentFormula.stat} reset to computed value.`,
      });

      setFormulaInspectorOpen(false);
      
      // Update local form data
      onFormDataChange?.(updates);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle rollable action execution
  const handleRollAction = (
    action: ActionSpec,
    rollIndex: number,
    advMode: AdvMode,
    situational: number,
    itemName: string
  ) => {
    if (isRolling) return;
    setIsRolling(true);

    const binding = action.rolls[rollIndex];
    const character = {
      str_mod: formData.str_mod,
      dex_mod: formData.dex_mod,
      int_mod: formData.int_mod,
      will_mod: formData.will_mod,
    };

    const result = rollAction(binding, {
      character,
      advMode,
      situational,
    });

    const formattedLog = formatRollResult(action.label, binding, result);

    const pendingRollData = {
      characterName: formData.name || 'Unknown',
      formula: result.formula,
      rawResult: result.rawResult,
      modifier: result.modifier,
      total: result.total,
      rollType: binding.kind,
      individualRolls: result.rolls,
    };

    if (animationsEnabled) {
      setShowAnimation(true);
      setPendingRoll(pendingRollData);
    } else {
      addLog({
        character_name: pendingRollData.characterName,
        character_id: characterId,
        formula: pendingRollData.formula,
        raw_result: pendingRollData.rawResult,
        modifier: pendingRollData.modifier,
        total: pendingRollData.total,
        roll_type: pendingRollData.rollType,
        individual_rolls: pendingRollData.individualRolls,
      });
      setIsRolling(false);
    }

    // Show formatted result toast
    toast({
      title: `${itemName} — ${action.label}`,
      description: formattedLog,
      duration: 5000,
    });
  };

  const executeRoll = (binding: RollBinding, actionLabel: string, options?: { advMode?: AdvMode; situational?: number }) => {
    const result = rollAction(binding, {
      character: {
        str_mod: formData.str_mod || 0,
        dex_mod: formData.dex_mod || 0,
        int_mod: formData.int_mod || 0,
        will_mod: formData.will_mod || 0,
      },
      advMode: options?.advMode || advMode,
      situational: options?.situational || situational,
    });

    const formattedLog = formatRollResult(actionLabel, binding, result);
    
    // addLog expects a DiceLogEntry object, not a formatted string
    addLog({
      character_name: formData.name || 'Unknown',
      character_id: characterId,
      formula: result.formula,
      raw_result: result.rawResult,
      modifier: result.modifier,
      total: result.total,
      roll_type: binding.kind,
      individual_rolls: result.rolls,
    });
  };

  const handleRollInitiative = () => {
    const initBinding: RollBinding = {
      kind: 'check',
      ability: 'DEX',
      flat: 0,
    };
    executeRoll(initBinding, 'Initiative');
  };

  const handleHeal = () => {
    const amount = prompt('Enter HP to heal:');
    if (amount && !isNaN(Number(amount))) {
      const oldHP = formData.hp_current || 0;
      const newHP = Math.min(oldHP + Number(amount), formData.hp_max || 0);
      onFormDataChange?.({ hp_current: newHP });
      
      addLog({
        character_name: formData.name || 'Unknown',
        character_id: characterId,
        formula: `+${amount} HP`,
        raw_result: Number(amount),
        modifier: 0,
        total: newHP,
        roll_type: 'heal',
        individual_rolls: [],
      });
    }
  };

  const handleDamage = () => {
    const amount = prompt('Enter damage taken:');
    if (amount && !isNaN(Number(amount))) {
      const oldHP = formData.hp_current || 0;
      const newHP = Math.max(oldHP - Number(amount), 0);
      onFormDataChange?.({ hp_current: newHP });
      
      addLog({
        character_name: formData.name || 'Unknown',
        character_id: characterId,
        formula: `-${amount} HP`,
        raw_result: Number(amount),
        modifier: 0,
        total: newHP,
        roll_type: 'damage',
        individual_rolls: [],
      });
    }
  };

  const handleTempHP = () => {
    const amount = prompt('Enter temporary HP:');
    if (amount && !isNaN(Number(amount))) {
      onFormDataChange?.({ hp_temp: Number(amount) });
      
      addLog({
        character_name: formData.name || 'Unknown',
        character_id: characterId,
        formula: `Temp +${amount}`,
        raw_result: Number(amount),
        modifier: 0,
        total: Number(amount),
        roll_type: 'temp_hp',
        individual_rolls: [],
      });
    }
  };

  const handleRest = () => {
    const restored = formData.hp_max || 0;
    onFormDataChange?.({ hp_current: restored });
    
    addLog({
      character_name: formData.name || 'Unknown',
      character_id: characterId,
      formula: 'Rest',
      raw_result: restored,
      modifier: 0,
      total: restored,
      roll_type: 'rest',
      individual_rolls: [],
    });
  };

  // Get class features from config
  const classFeatures: FeatureLike[] = formData.class 
    ? getFeaturesAtLevel(formData.class, formData.level).map(cf => ({
        id: cf.id,
        name: cf.name,
        description: cf.description,
        actions: [], // Can be populated with rollable actions later
      }))
    : [];

  const customFeatures = (formData.custom_features as FeatureLike[]) || [];
  const customSpells = (formData.custom_spells as FeatureLike[]) || [];
  const customInventory = (formData.custom_inventory as FeatureLike[]) || [];

  // Toggle favorite
  const handleToggleFavorite = (featureId: string) => {
    const favorites = formData.favorites || [];
    const existingIndex = favorites.findIndex(fav => fav.id === featureId);

    // Find the item in all possible sources
    const allFeatures = [...classFeatures, ...customFeatures];
    const allSpells = customSpells;
    const allItems = customInventory;
    
    const foundFeature = allFeatures.find(f => f.id === featureId);
    const foundSpell = allSpells.find(s => s.id === featureId);
    const foundItem = allItems.find(i => i.id === featureId);
    
    const item = foundFeature || foundSpell || foundItem;
    const type = foundFeature ? 'feature' : foundSpell ? 'spell' : 'item';

    let updatedFavorites: FavoriteItem[];
    if (existingIndex >= 0) {
      // Remove from favorites
      updatedFavorites = favorites.filter(fav => fav.id !== featureId);
      toast({ title: "Removed from favorites", description: `${favorites[existingIndex].name} removed` });
    } else if (item) {
      // Add to favorites
      updatedFavorites = [
        ...favorites,
        {
          id: item.id,
          name: item.name,
          type: type as 'attack' | 'feature' | 'spell' | 'item',
          description: item.description,
          actions: item.actions,
        },
      ];
      toast({ title: "Added to favorites", description: `${item.name} added` });
    } else {
      return;
    }

    onFormDataChange?.({ favorites: updatedFavorites });
  };

  const isFavorited = (itemId: string): boolean => {
    return (formData.favorites || []).some(fav => fav.id === itemId);
  };

  // Get class theme color
  const getClassColor = (className: string): string => {
    const normalizedClass = className?.toLowerCase() || '';
    const classColorMap: Record<string, string> = {
      'fighter': 'var(--class-fighter)',
      'rogue': 'var(--class-rogue)',
      'wizard': 'var(--class-wizard)',
      'cleric': 'var(--class-cleric)',
      'ranger': 'var(--class-ranger)',
      'barbarian': 'var(--class-barbarian)',
      'bard': 'var(--class-bard)',
      'paladin': 'var(--class-paladin)',
    };
    return classColorMap[normalizedClass] || 'var(--class-default)';
  };

  const classThemeColor = getClassColor(formData.class);



  const SkillItem = ({ 
    name, 
    value, 
    proficient = false,
    statValue
  }: { 
    name: string; 
    value: number;
    proficient?: boolean;
    statValue: number;
  }) => {
    const handleRoll = () => {
      rollSkillCheck(name, value);
    };

    return (
      <div className="flex items-center justify-between py-2 px-4 hover:bg-muted/40 rounded-lg transition-all duration-200 group">
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-md border-2 transition-all ${proficient ? 'bg-primary/20 border-primary' : 'border-muted-foreground/30'}`}>
            {proficient && <div className="w-full h-full flex items-center justify-center text-xs font-bold text-primary">✓</div>}
          </div>
          <span className="text-base font-medium">{name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-foreground min-w-[3rem] text-right">
            {value >= 0 ? `+${value}` : value}
          </span>
          <button
            onClick={handleRoll}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-primary/20 rounded-md"
          >
            <D20Icon className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>
    );
  };

  const AbilityPanel = ({ 
    title, 
    color, 
    modifier, 
    skills,
    icon: Icon
  }: { 
    title: string; 
    color: string;
    modifier: string;
    skills: { name: string; value: number; proficient?: boolean }[];
    icon?: any;
  }) => (
    <div 
      className="rounded-xl border-2 overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl"
      style={{
        backgroundColor: `hsl(${color} / 0.05)`,
        borderColor: `hsl(${color} / 0.3)`,
        boxShadow: `0 8px 24px hsl(${color} / 0.15)`
      }}
    >
      <div 
        className="px-5 py-4 border-b-2 backdrop-blur-sm"
        style={{
          background: `linear-gradient(135deg, hsl(${color} / 0.2), hsl(${color} / 0.1))`,
          borderColor: `hsl(${color} / 0.4)`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5" style={{ color: `hsl(${color})` }} />}
            <h3 className="text-base font-bold uppercase tracking-wider font-cinzel" style={{ color: `hsl(${color})` }}>
              {title}
            </h3>
          </div>
          <span className="text-3xl font-bold font-cinzel" style={{ color: `hsl(${color})` }}>
            {modifier}
          </span>
        </div>
      </div>
      <div className="p-3 space-y-1">
        <div className="flex items-center justify-between py-2 px-4 text-xs font-semibold text-muted-foreground uppercase">
          <span>Saving Throw</span>
          <span>{modifier}</span>
        </div>
        <Separator className="my-1" style={{ backgroundColor: `hsl(${color} / 0.2)` }} />
        {skills.map((skill, idx) => (
          <SkillItem 
            key={idx} 
            {...skill}
            statValue={0}
          />
        ))}
      </div>
    </div>
  );

  const strengthMod = getModifierString(formData.str_mod);
  const dexterityMod = getModifierString(formData.dex_mod);
  const intelligenceMod = getModifierString(formData.int_mod);
  const willMod = getModifierString(formData.will_mod);


  // Prepare skills array for ProfileCard
  const profileSkills = [
    { name: 'Might', value: formData.skill_might },
    { name: 'Finesse', value: formData.skill_finesse },
    { name: 'Stealth', value: formData.skill_stealth },
    { name: 'Arcana', value: formData.skill_arcana },
    { name: 'Examination', value: formData.skill_examination },
    { name: 'Lore', value: formData.skill_lore },
    { name: 'Insight', value: formData.skill_insight },
    { name: 'Influence', value: formData.skill_influence },
    { name: 'Naturecraft', value: formData.skill_naturecraft },
    { name: 'Perception', value: formData.skill_perception },
  ];

  return (
    <div className="app-root">
      {/* Left Column - Fixed Profile Card */}
      <div className="profile-card" id="profileCard">
        <ProfileCard
        characterName={formData.name}
        className={formData.class}
        classColor={classThemeColor}
        level={formData.level}
        hp_current={formData.hp_current}
        hp_max={formData.hp_max}
        hp_temp={formData.hp_temp}
        armor={formData.armor}
        speed={formData.speed ?? 30}
        dex_mod={formData.dex_mod || 0}
        hit_dice_remaining={formData.hit_dice_remaining}
        hit_dice_total={formData.hit_dice_total}
        characterId={characterId}
        portraitUrl={formData.portrait_url}
        skills={profileSkills}
        favorites={formData.favorites || []}
        onHPChange={(current, temp) => {
          onFormDataChange?.({
            hp_current: current,
            hp_temp: temp ?? formData.hp_temp,
          });
        }}
        onMaxHPChange={(max) => {
          onFormDataChange?.({ hp_max: max });
        }}
        onArmorChange={(armor) => {
          onFormDataChange?.({ armor });
        }}
        onSpeedChange={(speed) => {
          onFormDataChange?.({ speed });
        }}
        onHitDiceChange={(remaining, total) => {
          onFormDataChange?.({
            hit_dice_remaining: remaining,
            hit_dice_total: total,
          });
        }}
        onPortraitChange={(url) => {
          onFormDataChange?.({ portrait_url: url });
        }}
        onRest={handleRest}
        onRollInitiative={handleRollInitiative}
        onLevelUp={() => setIsLevelUpWizardOpen(true)}
        onSkillRoll={(skillName, skillValue) => {
          rollSkillCheck(skillName, skillValue);
        }}
        onRemoveFavorite={(itemId) => {
          const updatedFavorites = (formData.favorites || []).filter(f => f.id !== itemId);
          onFormDataChange?.({ favorites: updatedFavorites });
        }}
      />
      </div>

      {/* Middle Column - Main Sheet */}
      <main className="main-column">
        {/* Character Header */}
        <Card
          className="border-2 shadow-2xl overflow-hidden backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, hsl(${classThemeColor} / 0.1), hsl(var(--card)) 50%)`,
            borderColor: `hsl(${classThemeColor} / 0.4)`,
            boxShadow: `0 0 40px hsl(${classThemeColor} / 0.2)`
          }}
        >
          <CardContent className="pt-6">
            {/* Character Identity Header */}
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex-1 flex flex-col justify-start gap-4">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <h1 
                      className="text-4xl md:text-5xl lg:text-6xl font-bold font-cinzel"
                      style={{
                        background: `linear-gradient(135deg, hsl(${classThemeColor}), hsl(var(--accent)))`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: `drop-shadow(0 0 20px hsl(${classThemeColor} / 0.4))`
                      }}
                    >
                      {formData.name || "Unnamed Character"}
                    </h1>
                    
                    {/* Action Tracker */}
                    <div className="flex items-center gap-1.5 ml-4">
                      {actionTracker.map((isActive, index) => {
                        const handleClick = () => {
                          const newTracker = [...actionTracker];
                          // Find leftmost active pip and deactivate it
                          const firstActive = newTracker.findIndex(val => val === true);
                          if (firstActive !== -1) {
                            newTracker[firstActive] = false;
                            onActionTrackerChange?.(newTracker);
                          }
                        };

                        const handleRightClick = (e: React.MouseEvent) => {
                          e.preventDefault();
                          const newTracker = [...actionTracker];
                          // Find leftmost inactive pip and activate it
                          const firstInactive = newTracker.findIndex(val => val === false);
                          if (firstInactive !== -1) {
                            newTracker[firstInactive] = true;
                            onActionTrackerChange?.(newTracker);
                          }
                        };

                        let holdTimeout: NodeJS.Timeout;
                        let holdInterval: NodeJS.Timeout;

                        const handleMouseDown = (e: React.MouseEvent) => {
                          if (e.button === 0) { // Left click
                            holdTimeout = setTimeout(() => {
                              const newTracker = [false, false, false];
                              onActionTrackerChange?.(newTracker);
                            }, 500);
                          } else if (e.button === 2) { // Right click
                            holdTimeout = setTimeout(() => {
                              const newTracker = [true, true, true];
                              onActionTrackerChange?.(newTracker);
                            }, 500);
                          }
                        };

                        const handleMouseUp = () => {
                          if (holdTimeout) clearTimeout(holdTimeout);
                          if (holdInterval) clearInterval(holdInterval);
                        };

                        return (
                          <button
                            key={index}
                            onClick={handleClick}
                            onContextMenu={handleRightClick}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            className="group relative transition-all duration-500 hover:scale-110"
                            style={{
                              width: '28px',
                              height: '28px',
                            }}
                          >
                            {/* Glowing background ring - reduced opacity */}
                            <div
                              className="absolute inset-0 rounded-lg transition-all duration-500 blur-sm"
                              style={{
                                background: isActive 
                                  ? 'linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 70%))' 
                                  : 'transparent',
                                opacity: isActive ? 0.4 : 0,
                                transform: isActive ? 'scale(1.2)' : 'scale(1)',
                              }}
                            />
                            
                            {/* Main arrow container with gradient */}
                            <div
                              className="absolute inset-0 rounded-lg transition-all duration-500 flex items-center justify-center"
                              style={{
                                background: isActive 
                                  ? 'linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 70%))' 
                                  : 'linear-gradient(135deg, hsl(0 0% 40%), hsl(0 0% 30%))',
                                boxShadow: isActive 
                                  ? '0 0 12px hsl(217 91% 60% / 0.4), inset 0 2px 4px rgba(255,255,255,0.2)' 
                                  : 'inset 0 2px 4px rgba(0,0,0,0.2)',
                                opacity: isActive ? 1 : 0.4,
                                transform: isActive ? 'scale(1)' : 'scale(0.75)',
                              }}
                            >
                              <ArrowRight 
                                size={16} 
                                strokeWidth={3}
                                style={{
                                  color: isActive ? 'white' : 'hsl(0 0% 60%)',
                                }}
                              />
                            </div>
                            
                            {/* Inner shine effect */}
                            {isActive && (
                              <div
                                className="absolute inset-0 rounded-lg transition-all duration-500 pointer-events-none"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)',
                                }}
                              />
                            )}
                            
                            {/* Border ring */}
                            <div
                              className="absolute inset-0 rounded-lg border-2 transition-all duration-500"
                              style={{
                                borderColor: isActive 
                                  ? 'hsl(217 91% 60% / 0.3)' 
                                  : 'hsl(0 0% 40% / 0.5)',
                                opacity: isActive ? 0 : 1,
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Single Identity Line */}
                  <div className="flex flex-wrap items-center gap-3 text-lg md:text-xl">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="secondary" 
                        className="text-base font-semibold px-3 py-1"
                        onClick={() => setIsLevelUpWizardOpen(true)}
                        style={{
                          backgroundColor: `hsl(${classThemeColor} / 0.15)`,
                          borderColor: `hsl(${classThemeColor} / 0.4)`,
                          color: `hsl(var(--foreground))`,
                          border: '1px solid'
                        }}
                      >
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Level {formData.level}
                      </Button>
                    </div>
                    
                    {formData.class && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Badge 
                          variant="outline"
                          className="text-base font-semibold px-3 py-1"
                          style={{
                            backgroundColor: `hsl(${classThemeColor} / 0.15)`,
                            borderColor: `hsl(${classThemeColor} / 0.4)`,
                            color: `hsl(var(--foreground))`,
                            border: '1px solid'
                          }}
                        >
                          {formData.class}
                        </Badge>
                      </>
                    )}
                    
                    {formData.race && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Badge 
                          variant="outline" 
                          className="text-base font-semibold px-3 py-1"
                          style={{
                            backgroundColor: `hsl(${classThemeColor} / 0.15)`,
                            borderColor: `hsl(${classThemeColor} / 0.4)`,
                            color: `hsl(var(--foreground))`,
                            border: '1px solid'
                          }}
                        >
                          {formData.race}
                        </Badge>
                      </>
                    )}
                    
                    {formData.background && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Badge 
                          variant="outline" 
                          className="text-base font-semibold px-3 py-1"
                          style={{
                            backgroundColor: `hsl(${classThemeColor} / 0.15)`,
                            borderColor: `hsl(${classThemeColor} / 0.4)`,
                            color: `hsl(var(--foreground))`,
                            border: '1px solid'
                          }}
                        >
                          {formData.background}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                
              </div>
            </div>

            {/* ROW 2: Core Ability Stats */}
            <Separator className="my-6" style={{ backgroundColor: `hsl(${classThemeColor} / 0.3)` }} />
            <div className="flex justify-between gap-2 md:gap-4 lg:gap-6 px-2 md:px-4">
              <AbilityCircle 
                name="Strength" 
                abbreviation="STR" 
                modifier={formData.str_mod} 
                color="var(--ability-str)"
                tooltip="Physical power and athletic prowess"
                onAbilityCheck={() => rollSkillCheck("Strength", formData.str_mod)}
                onSavingThrow={() => rollDice("Strength Save", formData.str_mod)}
              />
              <AbilityCircle 
                name="Dexterity" 
                abbreviation="DEX" 
                modifier={formData.dex_mod} 
                color="var(--ability-dex)"
                tooltip="Agility, reflexes, and coordination"
                onAbilityCheck={() => rollSkillCheck("Dexterity", formData.dex_mod)}
                onSavingThrow={() => rollDice("Dexterity Save", formData.dex_mod)}
              />
              <AbilityCircle 
                name="Intelligence" 
                abbreviation="INT" 
                modifier={formData.int_mod} 
                color="var(--ability-int)"
                tooltip="Reasoning, memory, and analytical ability"
                onAbilityCheck={() => rollSkillCheck("Intelligence", formData.int_mod)}
                onSavingThrow={() => rollDice("Intelligence Save", formData.int_mod)}
              />
              <AbilityCircle 
                name="Will" 
                abbreviation="WILL" 
                modifier={formData.will_mod} 
                color="var(--ability-wis)"
                tooltip="Mental fortitude and force of personality"
                onAbilityCheck={() => rollSkillCheck("Will", formData.will_mod)}
                onSavingThrow={() => rollDice("Will Save", formData.will_mod)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="actions" className="w-full">
          <TabsList 
            className="grid w-full grid-cols-5 h-14 border-2 p-1"
            style={{
              backgroundColor: `hsl(${classThemeColor} / 0.1)`,
              borderColor: `hsl(${classThemeColor} / 0.3)`
            }}
          >
            <TabsTrigger 
              value="actions" 
              className="font-semibold data-[state=active]:shadow-lg transition-all"
              style={{
                ['--tw-shadow-color' as any]: `hsl(${classThemeColor} / 0.3)`
              }}
            >
              <Swords className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Actions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="features"
              className="font-semibold data-[state=active]:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Features</span>
            </TabsTrigger>
            <TabsTrigger 
              value="inventory"
              className="font-semibold data-[state=active]:shadow-lg transition-all"
            >
              <Package className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger 
              value="spells"
              className="font-semibold data-[state=active]:shadow-lg transition-all"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Spells</span>
            </TabsTrigger>
            <TabsTrigger 
              value="journal"
              className="font-semibold data-[state=active]:shadow-lg transition-all"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Journal</span>
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="mt-6 space-y-4">
            {(formData.favorites || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(formData.favorites || []).map((fav) => (
                  <FeatureCard
                    key={fav.id}
                    feature={fav}
                    type={fav.type}
                    onRollAction={(action, rollIndex, advMode, situational) =>
                      handleRollAction(action, rollIndex, advMode, situational, fav.name)
                    }
                    onToggleFavorite={() => {
                      const updatedFavorites = (formData.favorites || []).filter(f => f.id !== fav.id);
                      onFormDataChange?.({ favorites: updatedFavorites });
                    }}
                    isFavorited={true}
                    showType={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                <CardContent className="py-16 text-center">
                  <Star className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: `hsl(${classThemeColor})` }} />
                  <p className="text-muted-foreground font-medium">No favorites yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Star ⭐ items from Features, Spells, or Inventory to quick-access them here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="mt-6 space-y-4">
            <Tabs defaultValue="action-tiles" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="action-tiles">Actions</TabsTrigger>
                <TabsTrigger value="reactions">Reactions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="action-tiles" className="mt-4">
                <ActionBar
                  tiles={actionTiles}
                  onRollAction={(binding, label, adv, sit) => executeRoll(binding, label, { advMode: adv, situational: sit })}
                  onToggleFavorite={handleToggleFavorite}
                  advMode={advMode}
                  situational={situational}
                />
              </TabsContent>
              
              <TabsContent value="reactions" className="mt-4 space-y-4">
                {heroicReactions.length > 0 ? (
                  <div className="grid gap-4">
                    {heroicReactions.map((reaction) => (
                      <Card key={reaction.id} className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                        <CardHeader>
                          <CardTitle className="text-lg" style={{ color: `hsl(${classThemeColor})` }}>
                            {reaction.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reaction.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                    <CardContent className="py-16 text-center">
                      <p className="text-muted-foreground">No heroic reactions available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="mt-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Class Features</h3>
              <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{
                      borderColor: `hsl(${classThemeColor})`,
                      color: `hsl(${classThemeColor})`,
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="font-cinzel" style={{ color: `hsl(${classThemeColor})` }}>
                      New Feature
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="feature-name" className="text-sm font-medium mb-2 block">
                        Name
                      </label>
                      <Input
                        id="feature-name"
                        value={newFeatureName}
                        onChange={(e) => setNewFeatureName(e.target.value)}
                        placeholder="Feature name..."
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="feature-description" className="text-sm font-medium mb-2 block">
                        Description
                      </label>
                      <Textarea
                        id="feature-description"
                        value={newFeatureDescription}
                        onChange={(e) => setNewFeatureDescription(e.target.value)}
                        placeholder="Describe the feature..."
                        className="min-h-[100px] w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="feature-formula" className="text-sm font-medium mb-2 block">
                        Roll Formula (optional)
                      </label>
                      <Input
                        id="feature-formula"
                        value={newFeatureFormula}
                        onChange={(e) => setNewFeatureFormula(e.target.value)}
                        placeholder="e.g., 2d6+3"
                        className="w-full font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Examples: 1d20+5, 3d6, 2d8+2</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsFeatureDialogOpen(false);
                          setNewFeatureName("");
                          setNewFeatureDescription("");
                          setNewFeatureFormula("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (newFeatureName.trim()) {
                            const newFeature: CustomItem = {
                              id: crypto.randomUUID(),
                              name: newFeatureName,
                              description: newFeatureDescription,
                              rollFormula: newFeatureFormula || undefined,
                            };
                            onFormDataChange?.({
                              custom_features: [...(formData.custom_features || []), newFeature],
                            });
                            setIsFeatureDialogOpen(false);
                            setNewFeatureName("");
                            setNewFeatureDescription("");
                            setNewFeatureFormula("");
                          }
                        }}
                        style={{
                          backgroundColor: `hsl(${classThemeColor})`,
                          color: 'hsl(var(--background))',
                        }}
                      >
                        Add Feature
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <FeaturesTimeline
              className={formData.class}
              currentLevel={formData.level}
              classFeatures={formData.custom_features?.map((f, i) => ({
                id: f.id,
                name: f.name,
                level: 1,
                description: f.description,
                requires_choice: false,
                selection: [],
              })) || []}
              onLevelUpClick={() => setIsLevelUpWizardOpen(true)}
              onToggleFavorite={handleToggleFavorite}
              isFavorited={isFavorited}
            />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="mt-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Inventory</h3>
              <Sheet open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{
                      borderColor: `hsl(${classThemeColor})`,
                      color: `hsl(${classThemeColor})`,
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[400px] sm:w-[540px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="font-cinzel" style={{ color: `hsl(${classThemeColor})` }}>
                      Add Item
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant={inventoryViewMode === 'codex' ? 'default' : 'outline'}
                        onClick={() => setInventoryViewMode('codex')}
                        className="flex-1"
                      >
                        From Codex
                      </Button>
                      <Button
                        variant={inventoryViewMode === 'custom' ? 'default' : 'outline'}
                        onClick={() => setInventoryViewMode('custom')}
                        className="flex-1"
                      >
                        Custom Item
                      </Button>
                    </div>

                    {inventoryViewMode === 'codex' ? (
                      <div className="space-y-4">
                        <Input
                          placeholder="Search items..."
                          value={inventorySearchQuery}
                          onChange={(e) => setInventorySearchQuery(e.target.value)}
                          className="w-full"
                        />
                        <div className="grid gap-2 max-h-[60vh] overflow-y-auto">
                          {availableEquipment
                            .filter((item) => 
                              item.name.toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
                              (item.description && item.description.toLowerCase().includes(inventorySearchQuery.toLowerCase()))
                            )
                            .map((item) => (
                            <Card 
                              key={item.id}
                              className="p-4 hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="font-medium">{item.name}</div>
                                  {item.description && (
                                    <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                                  )}
                                  {item.damage && (
                                    <div className="text-xs text-muted-foreground mt-1">Damage: {item.damage}</div>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                   onClick={() => {
                                     const itemDescription = [
                                       item.description,
                                       item.type && `Type: ${item.type}`,
                                       item.properties && `Properties: ${JSON.stringify(item.properties)}`,
                                       item.range_value && `Range: ${item.range_value}`,
                                     ].filter(Boolean).join('\n');
                                     
                                     const newItem: CustomItem = {
                                       id: crypto.randomUUID(),
                                       name: item.name,
                                       description: itemDescription || 'No description available',
                                       rollFormula: item.damage || undefined,
                                     };
                                     onFormDataChange?.({
                                       custom_inventory: [...(formData.custom_inventory || []), newItem],
                                     });
                                   }}
                                  style={{
                                    backgroundColor: `hsl(${classThemeColor})`,
                                    color: 'hsl(var(--background))',
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="item-name" className="text-sm font-medium mb-2 block">
                            Name
                          </label>
                          <Input
                            id="item-name"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Item name..."
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="item-description" className="text-sm font-medium mb-2 block">
                            Description
                          </label>
                          <Textarea
                            id="item-description"
                            value={newItemDescription}
                            onChange={(e) => setNewItemDescription(e.target.value)}
                            placeholder="Describe the item..."
                            className="min-h-[100px] w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="item-formula" className="text-sm font-medium mb-2 block">
                            Damage/Effect Roll (optional)
                          </label>
                          <Input
                            id="item-formula"
                            value={newItemFormula}
                            onChange={(e) => setNewItemFormula(e.target.value)}
                            placeholder="e.g., 1d8+3"
                            className="w-full font-mono"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Weapon damage or effect dice</p>
                        </div>
                        <Button
                          onClick={() => {
                            if (newItemName.trim()) {
                              const newItem: CustomItem = {
                                id: crypto.randomUUID(),
                                name: newItemName,
                                description: newItemDescription,
                                rollFormula: newItemFormula || undefined,
                              };
                              onFormDataChange?.({
                                custom_inventory: [...(formData.custom_inventory || []), newItem],
                              });
                              setNewItemName("");
                              setNewItemDescription("");
                              setNewItemFormula("");
                              setInventoryViewMode('codex');
                            }
                          }}
                          className="w-full"
                          style={{
                            backgroundColor: `hsl(${classThemeColor})`,
                            color: 'hsl(var(--background))',
                          }}
                        >
                          Add Custom Item
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {formData.custom_inventory && formData.custom_inventory.length > 0 ? (
              <div className="space-y-2">
                {formData.custom_inventory.map((item) => (
                  <Collapsible key={item.id} className="border rounded-lg">
                    <CollapsibleTrigger className="w-full p-3 text-left hover:bg-accent/50 transition-colors flex items-center justify-between group">
                      <div className="flex-1 flex items-center gap-3">
                        <span className="font-medium">{item.name}</span>
                        {item.rollFormula && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              const rollResult = rollAction(
                                {
                                  kind: 'damage',
                                  die: item.rollFormula,
                                  ability: 'STR',
                                },
                                {
                                  character: {
                                    str_mod: formData.str_mod || 0,
                                    dex_mod: formData.dex_mod || 0,
                                    int_mod: formData.int_mod || 0,
                                    will_mod: formData.will_mod || 0,
                                  },
                                }
                              );
                              const formatted = formatRollResult(item.name, { kind: 'damage', die: item.rollFormula }, rollResult);
                              toast({
                                title: 'Roll Result',
                                description: formatted,
                              });
                              addLog?.({
                                character_id: characterId,
                                character_name: formData.name || 'Unknown',
                                roll_type: 'damage',
                                formula: rollResult.formula,
                                individual_rolls: rollResult.rolls,
                                raw_result: rollResult.rawResult,
                                modifier: rollResult.modifier,
                                total: rollResult.total,
                              });
                            }}
                            className="cursor-pointer h-7 w-7 flex items-center justify-center rounded hover:bg-accent"
                            style={{
                              color: `hsl(${classThemeColor})`,
                            }}
                          >
                            <D20Icon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFormDataChange?.({
                              custom_inventory: formData.custom_inventory?.filter((i) => i.id !== item.id),
                            });
                          }}
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <ChevronDown className="w-4 h-4 transition-transform ui-open:rotate-180" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-3">
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {item.description}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                <CardContent className="py-16 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: `hsl(${classThemeColor})` }} />
                  <p className="text-muted-foreground font-medium">No items in inventory</p>
                  <p className="text-sm text-muted-foreground mt-2">Click the + button to add items</p>
                </CardContent>
              </Card>
            )}

          </TabsContent>

          {/* Spells Tab */}
          <TabsContent value="spells" className="mt-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Spells</h3>
              <Sheet open={isSpellDialogOpen} onOpenChange={setIsSpellDialogOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{
                      borderColor: `hsl(${classThemeColor})`,
                      color: `hsl(${classThemeColor})`,
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Spell
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[400px] sm:w-[540px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="font-cinzel" style={{ color: `hsl(${classThemeColor})` }}>
                      Add Spell
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant={spellViewMode === 'codex' ? 'default' : 'outline'}
                        onClick={() => setSpellViewMode('codex')}
                        className="flex-1"
                      >
                        From Codex
                      </Button>
                      <Button
                        variant={spellViewMode === 'custom' ? 'default' : 'outline'}
                        onClick={() => setSpellViewMode('custom')}
                        className="flex-1"
                      >
                        Custom Spell
                      </Button>
                    </div>

                    {spellViewMode === 'codex' ? (
                      <div className="space-y-4">
                        <Input
                          placeholder="Search spells..."
                          value={spellSearchQuery}
                          onChange={(e) => setSpellSearchQuery(e.target.value)}
                          className="w-full"
                        />
                        <div className="grid gap-2 max-h-[60vh] overflow-y-auto">
                          {availableSpells
                            .filter((spell) => 
                              spell.name.toLowerCase().includes(spellSearchQuery.toLowerCase()) ||
                              (spell.description && spell.description.toLowerCase().includes(spellSearchQuery.toLowerCase())) ||
                              (spell.element && spell.element.toLowerCase().includes(spellSearchQuery.toLowerCase()))
                            )
                            .map((spell) => (
                            <Card 
                              key={spell.id}
                              className="p-4 hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="font-medium">{spell.name}</div>
                                  {spell.element && (
                                    <Badge className="mt-1">{spell.element}</Badge>
                                  )}
                                  {spell.description && (
                                    <div className="text-sm text-muted-foreground mt-1">{spell.description}</div>
                                  )}
                                  {spell.damage && (
                                    <div className="text-xs text-muted-foreground mt-1">Damage: {spell.damage}</div>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const newSpell: CustomItem = {
                                      id: crypto.randomUUID(),
                                      name: spell.name,
                                      description: spell.description || '',
                                      rollFormula: spell.damage || undefined,
                                    };
                                    onFormDataChange?.({
                                      custom_spells: [...(formData.custom_spells || []), newSpell],
                                    });
                                  }}
                                  style={{
                                    backgroundColor: `hsl(${classThemeColor})`,
                                    color: 'hsl(var(--background))',
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="spell-name" className="text-sm font-medium mb-2 block">
                            Name
                          </label>
                          <Input
                            id="spell-name"
                            value={newSpellName}
                            onChange={(e) => setNewSpellName(e.target.value)}
                            placeholder="Spell name..."
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="spell-description" className="text-sm font-medium mb-2 block">
                            Description
                          </label>
                          <Textarea
                            id="spell-description"
                            value={newSpellDescription}
                            onChange={(e) => setNewSpellDescription(e.target.value)}
                            placeholder="Describe the spell effects..."
                            className="min-h-[100px] w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="spell-formula" className="text-sm font-medium mb-2 block">
                            Damage/Effect Roll (optional)
                          </label>
                          <Input
                            id="spell-formula"
                            value={newSpellFormula}
                            onChange={(e) => setNewSpellFormula(e.target.value)}
                            placeholder="e.g., 8d6"
                            className="w-full font-mono"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Damage dice or healing amount</p>
                        </div>
                        <Button
                          onClick={() => {
                            if (newSpellName.trim()) {
                              const newSpell: CustomItem = {
                                id: crypto.randomUUID(),
                                name: newSpellName,
                                description: newSpellDescription,
                                rollFormula: newSpellFormula || undefined,
                              };
                              onFormDataChange?.({
                                custom_spells: [...(formData.custom_spells || []), newSpell],
                              });
                              setNewSpellName("");
                              setNewSpellDescription("");
                              setNewSpellFormula("");
                              setSpellViewMode('codex');
                            }
                          }}
                          className="w-full"
                          style={{
                            backgroundColor: `hsl(${classThemeColor})`,
                            color: 'hsl(var(--background))',
                          }}
                        >
                          Add Custom Spell
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {formData.custom_spells && formData.custom_spells.length > 0 ? (
              <div className="space-y-2">
                {formData.custom_spells.map((spell) => (
                  <Collapsible key={spell.id} className="border rounded-lg">
                    <CollapsibleTrigger className="w-full p-3 text-left hover:bg-accent/50 transition-colors flex items-center justify-between group">
                      <div className="flex-1 flex items-center gap-3">
                        <span className="font-medium">{spell.name}</span>
                        {spell.rollFormula && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              const rollResult = rollAction(
                                {
                                  kind: 'damage',
                                  die: spell.rollFormula,
                                  ability: 'INT',
                                },
                                {
                                  character: {
                                    str_mod: formData.str_mod || 0,
                                    dex_mod: formData.dex_mod || 0,
                                    int_mod: formData.int_mod || 0,
                                    will_mod: formData.will_mod || 0,
                                  },
                                }
                              );
                              const formatted = formatRollResult(spell.name, { kind: 'damage', die: spell.rollFormula }, rollResult);
                              toast({
                                title: 'Roll Result',
                                description: formatted,
                              });
                              addLog?.({
                                character_id: characterId,
                                character_name: formData.name || 'Unknown',
                                roll_type: 'damage',
                                formula: rollResult.formula,
                                individual_rolls: rollResult.rolls,
                                raw_result: rollResult.rawResult,
                                modifier: rollResult.modifier,
                                total: rollResult.total,
                              });
                            }}
                            className="cursor-pointer h-7 w-7 flex items-center justify-center rounded hover:bg-accent"
                            style={{
                              color: `hsl(${classThemeColor})`,
                            }}
                          >
                            <D20Icon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFormDataChange?.({
                              custom_spells: formData.custom_spells?.filter((s) => s.id !== spell.id),
                            });
                          }}
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <ChevronDown className="w-4 h-4 transition-transform ui-open:rotate-180" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-3">
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {spell.description}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                <CardContent className="py-16 text-center">
                  <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: `hsl(${classThemeColor})` }} />
                  <p className="text-muted-foreground font-medium">No spells added yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Click the + button to add spells</p>
                </CardContent>
              </Card>
            )}

          </TabsContent>

          {/* Journal Tab */}
          <TabsContent value="journal" className="mt-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Journal</h3>
              <Dialog open={isJournalDialogOpen} onOpenChange={setIsJournalDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{
                      borderColor: `hsl(${classThemeColor})`,
                      color: `hsl(${classThemeColor})`,
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="font-cinzel" style={{ color: `hsl(${classThemeColor})` }}>
                      New Journal Entry
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="journal-title" className="text-sm font-medium mb-2 block">
                        Title
                      </label>
                      <Input
                        id="journal-title"
                        value={newJournalTitle}
                        onChange={(e) => setNewJournalTitle(e.target.value)}
                        placeholder="Entry title..."
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="journal-content" className="text-sm font-medium mb-2 block">
                        Content
                      </label>
                      <Textarea
                        id="journal-content"
                        value={newJournalContent}
                        onChange={(e) => setNewJournalContent(e.target.value)}
                        placeholder="Write your journal entry..."
                        className="min-h-[200px] w-full"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsJournalDialogOpen(false);
                          setNewJournalTitle("");
                          setNewJournalContent("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (newJournalTitle.trim() && newJournalContent.trim()) {
                            const newEntry: JournalEntry = {
                              id: crypto.randomUUID(),
                              title: newJournalTitle,
                              content: newJournalContent,
                              timestamp: new Date().toISOString(),
                            };
                            onFormDataChange?.({
                              journal_entries: [...(formData.journal_entries || []), newEntry],
                            });
                            setIsJournalDialogOpen(false);
                            setNewJournalTitle("");
                            setNewJournalContent("");
                          }
                        }}
                        style={{
                          backgroundColor: `hsl(${classThemeColor})`,
                          color: 'hsl(var(--background))',
                        }}
                      >
                        Add Entry
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {formData.journal_entries && formData.journal_entries.length > 0 ? (
              <div className="space-y-3">
                {formData.journal_entries.map((entry) => (
                  <Collapsible key={entry.id}>
                    <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3 flex-1">
                            <ChevronDown className="w-5 h-5 transition-transform duration-200 ui-expanded:rotate-180" />
                            <div className="text-left">
                              <CardTitle className="text-lg font-cinzel" style={{ color: `hsl(${classThemeColor})` }}>
                                {entry.title}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedEntries = (formData.journal_entries || []).filter(e => e.id !== entry.id);
                              onFormDataChange?.({ journal_entries: updatedEntries });
                            }}
                            className="p-2 hover:bg-destructive/20 rounded-md transition-colors"
                          >
                            <X className="w-4 h-4 text-destructive" />
                          </button>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <Separator className="mb-4" style={{ backgroundColor: `hsl(${classThemeColor} / 0.2)` }} />
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {entry.content}
                          </p>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                <CardContent className="py-16 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: `hsl(${classThemeColor})` }} />
                  <p className="text-muted-foreground font-medium">No journal entries yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Click the + button above to create your first entry</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Dice Roll Animation */}
        {diceRoll && (
          <DiceRollAnimation
            diceType={diceRoll.diceType || "d20"}
            result={diceRoll.roll}
            modifier={diceRoll.modifier}
            total={diceRoll.total}
            isVisible={showAnimation}
            onComplete={handleAnimationComplete}
            statName={diceRoll.statName}
            characterName={formData.name}
          />
        )}

        {/* Dice Roll Toast */}
        {diceRoll && !showAnimation && (
          <DiceRollToast
            {...diceRoll}
            onClose={() => setDiceRoll(null)}
          />
        )}

        {/* Level Up Wizard */}
        {characterId && (
          <LevelUpWizard
            open={isLevelUpWizardOpen}
            onOpenChange={setIsLevelUpWizardOpen}
            character={{
              id: characterId,
              level: formData.level,
              class: formData.class,
              str_mod: formData.str_mod,
              dex_mod: formData.dex_mod,
              hp_max: formData.hp_max,
              hp_current: formData.hp_current,
              class_features: formData.custom_features?.map((f, i) => ({
                id: f.id,
                name: f.name,
                level: 1,
                description: f.description,
                requires_choice: false,
                selection: [],
              })) || [],
            }}
            onLevelUpComplete={(updates) => {
              onFormDataChange?.({
                level: updates.level,
                hp_max: updates.hp_max,
                hp_current: updates.hp_current,
                custom_features: updates.class_features.map((f: any) => ({
                  id: f.id,
                  name: f.name,
                  description: f.description,
                  rollFormula: undefined,
                })),
              });
            }}
          />
        )}

        <FormulaInspector
          open={formulaInspectorOpen}
          onOpenChange={setFormulaInspectorOpen}
          breakdown={currentFormula}
          onResetOverride={handleResetOverride}
        />
      </main>

      {/* Right Column - Chat/Dice Log */}
      <div className="chat-panel">
        <DiceLogPanel />
      </div>
    </div>
  );
};

export default CharacterView;

