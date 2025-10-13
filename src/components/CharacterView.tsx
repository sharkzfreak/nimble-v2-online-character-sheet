import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Zap, 
  Target, 
  Swords, 
  BookOpen, 
  Wand2, 
  FileText, 
  Dices,
  Activity
} from "lucide-react";
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
import { ManualDiceRoller } from "./ManualDiceRoller";
import { DiceRollAnimation } from "./DiceRollAnimation";

interface CharacterViewProps {
  characterId?: string;
  formData: {
    name: string;
    player: string;
    campaign: string;
    description: string;
    level: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    will: number;
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
  };
  calculateHealth: () => number;
  calculateDefense: () => number;
  calculateInitiative: () => number;
  calculateCarryWeight: () => number;
}

const CharacterView = ({
  characterId,
  formData,
  calculateHealth,
  calculateDefense,
  calculateInitiative,
  calculateCarryWeight,
}: CharacterViewProps) => {
  const { data: ruleset, isLoading: rulesetLoading } = useNimbleRuleset();
  const { addLog } = useDiceLog();
  
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
  } | null>(null);

  const getModifier = (stat: number): number => {
    return Math.floor((stat - 10) / 2);
  };

  const getModifierString = (stat: number): string => {
    const mod = getModifier(stat);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const rollDice = (statName: string, statValue: number, diceType: string = "d20") => {
    if (isRolling) return;
    
    setIsRolling(true);
    const modifier = getModifier(statValue);
    const diceMax = parseInt(diceType.substring(1)) || 20;
    const roll = Math.ceil(Math.random() * diceMax);
    const total = roll + modifier;
    
    console.log(`Rolling ${statName}: ${roll} + ${modifier} = ${total} (${diceType})`);
    setDiceRoll({ statName, roll, modifier, total, diceType });
    setShowAnimation(true);

    // Store pending log data
    setPendingRoll({
      characterName: formData.name || 'Unknown',
      formula: `${diceType}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`,
      rawResult: roll,
      modifier,
      total,
      rollType: 'stat',
    });
  };

  const rollSkillCheck = (skillName: string, skillValue: number) => {
    if (isRolling) return;
    
    setIsRolling(true);
    const roll = Math.ceil(Math.random() * 20);
    const total = roll + skillValue;
    
    console.log(`Rolling ${skillName}: ${roll} + ${skillValue} = ${total} (d20 skill check)`);
    setDiceRoll({ statName: skillName, roll, modifier: skillValue, total, diceType: "d20" });
    setShowAnimation(true);

    // Store pending log data
    setPendingRoll({
      characterName: formData.name || 'Unknown',
      formula: `d20${skillValue !== 0 ? ` ${skillValue > 0 ? '+' : ''}${skillValue}` : ''}`,
      rawResult: roll,
      modifier: skillValue,
      total,
      rollType: 'skill',
    });
  };

  const handleAnimationComplete = () => {
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
      });
      setPendingRoll(null);
    }
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

  const AbilityBadge = ({ 
    name, 
    value, 
    color,
    abbreviation,
    tooltip 
  }: { 
    name: string; 
    value: number; 
    color: string;
    abbreviation: string;
    tooltip?: string;
  }) => {
    const modifier = getModifierString(value);
    const diceType = ruleset?.dice_system?.save?.dice || "d20";
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center group">
              <div 
                className="relative w-32 h-32 rounded-full flex flex-col items-center justify-center border-3 transition-all duration-300 hover:scale-110 cursor-pointer"
                style={{
                  backgroundColor: `hsl(${color} / 0.15)`,
                  borderColor: `hsl(${color})`,
                  borderWidth: '3px',
                  boxShadow: `0 0 25px hsl(${color} / 0.4), inset 0 0 15px hsl(${color} / 0.1)`
                }}
              >
                <div className="text-sm font-bold uppercase tracking-wider opacity-80 font-cinzel">{abbreviation}</div>
                <div className="text-5xl font-bold my-2" style={{ color: `hsl(${color})` }}>{modifier}</div>
                <div className="text-base opacity-70 font-medium">{value}</div>
                
                {/* Dice Roll Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    rollDice(name, value, diceType);
                  }}
                  className="absolute -bottom-2 -right-2 p-2 rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: `hsl(${color})`,
                    boxShadow: `0 4px 12px hsl(${color} / 0.5)`
                  }}
                >
                  <Dices className="w-4 h-4 text-background" />
                </button>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-card border-border max-w-xs">
            <p className="font-semibold font-cinzel">{name}</p>
            <p className="text-xs text-muted-foreground">Base: {value} | Modifier: {modifier}</p>
            <p className="text-xs text-muted-foreground mt-1">Roll: {diceType} + {modifier} for saves</p>
            {tooltip && <p className="text-xs text-muted-foreground mt-1">{tooltip}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const QuickStat = ({ 
    icon: Icon, 
    label, 
    value,
    tooltip 
  }: { 
    icon: any; 
    label: string; 
    value: number | string;
    tooltip?: string;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex items-center gap-3 px-5 py-3 rounded-xl border-2 hover-scale cursor-pointer transition-all duration-300"
            style={{
              backgroundColor: `hsl(${classThemeColor} / 0.1)`,
              borderColor: `hsl(${classThemeColor} / 0.4)`,
              boxShadow: `0 4px 12px hsl(${classThemeColor} / 0.2)`
            }}
          >
            <Icon className="w-6 h-6" style={{ color: `hsl(${classThemeColor})` }} />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{label}</span>
              <span className="text-3xl font-bold text-foreground font-cinzel">{value}</span>
            </div>
          </div>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent className="bg-card border-border">
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

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
            <Dices className="w-5 h-5 text-primary" />
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
    icon: Icon,
    statValue
  }: { 
    title: string; 
    color: string;
    modifier: string;
    skills: { name: string; value: number; proficient?: boolean }[];
    icon?: any;
    statValue: number;
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
            statValue={statValue}
          />
        ))}
      </div>
    </div>
  );

  const strengthMod = getModifierString(formData.strength);
  const dexterityMod = getModifierString(formData.dexterity);
  const intelligenceMod = getModifierString(formData.intelligence);
  const willMod = getModifierString(formData.will);

  return (
    <div 
      className="min-h-screen pb-12 pr-64 lg:pr-72 relative"
      style={{
        background: `radial-gradient(ellipse at top, hsl(${classThemeColor} / 0.15), transparent 50%), 
                     radial-gradient(ellipse at bottom, hsl(${classThemeColor} / 0.1), transparent 50%),
                     hsl(var(--background))`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        {/* Character Header */}
        <Card 
          className="border-2 shadow-2xl overflow-hidden backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, hsl(${classThemeColor} / 0.1), hsl(var(--card)) 50%)`,
            borderColor: `hsl(${classThemeColor} / 0.4)`,
            boxShadow: `0 0 40px hsl(${classThemeColor} / 0.2)`
          }}
        >
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle 
                  className="text-5xl font-bold font-cinzel mb-3"
                  style={{
                    background: `linear-gradient(135deg, hsl(${classThemeColor}), hsl(var(--accent)))`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: `0 0 30px hsl(${classThemeColor} / 0.3)`
                  }}
                >
                  {formData.name || "Unnamed Character"}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {formData.class && (
                    <Badge 
                      className="text-sm font-semibold px-3 py-1"
                      style={{
                        backgroundColor: `hsl(${classThemeColor} / 0.2)`,
                        borderColor: `hsl(${classThemeColor})`,
                        color: `hsl(${classThemeColor})`,
                        border: '2px solid'
                      }}
                    >
                      {formData.class}
                    </Badge>
                  )}
                  {formData.race && <Badge variant="outline" className="text-sm font-semibold">{formData.race}</Badge>}
                  <Badge variant="secondary" className="text-sm font-semibold">Level {formData.level}</Badge>
                </div>
              </div>
              
              {(formData.player || formData.campaign) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {formData.player && (
                    <div>
                      <span className="text-muted-foreground font-medium">Player:</span>
                      <span className="ml-2 font-semibold">{formData.player}</span>
                    </div>
                  )}
                  {formData.campaign && (
                    <div>
                      <span className="text-muted-foreground font-medium">Campaign:</span>
                      <span className="ml-2 font-semibold">{formData.campaign}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardHeader>

          {/* Quick Stats Bar */}
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <QuickStat 
                icon={Shield} 
                label="AC" 
                value={calculateDefense()} 
                tooltip="Armor Class - Your defense against attacks"
              />
              <QuickStat 
                icon={Activity} 
                label="Speed" 
                value={30} 
                tooltip="Movement speed in feet per turn"
              />
              <QuickStat 
                icon={Target} 
                label="Initiative" 
                value={`+${calculateInitiative()}`} 
                tooltip="Initiative bonus - determines turn order in combat"
              />
              <QuickStat 
                icon={Swords} 
                label="HP" 
                value={calculateHealth()} 
                tooltip="Hit Points - Your character's health"
              />
            </div>

            {/* Ability Scores - Nimble V2 Stats */}
            <Separator className="my-6" style={{ backgroundColor: `hsl(${classThemeColor} / 0.3)` }} />
            <div className="flex justify-center gap-4 md:gap-8 flex-wrap py-6">
              <AbilityBadge 
                name="Strength" 
                abbreviation="STR" 
                value={formData.strength} 
                color="var(--ability-str)"
                tooltip="Physical power and athletic prowess"
              />
              <AbilityBadge 
                name="Dexterity" 
                abbreviation="DEX" 
                value={formData.dexterity} 
                color="var(--ability-dex)"
                tooltip="Agility, reflexes, and coordination"
              />
              <AbilityBadge 
                name="Intelligence" 
                abbreviation="INT" 
                value={formData.intelligence} 
                color="var(--ability-int)"
                tooltip="Reasoning, memory, and analytical ability"
              />
              <AbilityBadge 
                name="Will" 
                abbreviation="WILL" 
                value={formData.will} 
                color="var(--ability-wis)"
                tooltip="Mental fortitude and force of personality"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="skills" className="w-full">
          <TabsList 
            className="grid w-full grid-cols-4 h-14 border-2 p-1"
            style={{
              backgroundColor: `hsl(${classThemeColor} / 0.1)`,
              borderColor: `hsl(${classThemeColor} / 0.3)`
            }}
          >
            <TabsTrigger 
              value="skills" 
              className="font-semibold data-[state=active]:shadow-lg transition-all"
              style={{
                ['--tw-shadow-color' as any]: `hsl(${classThemeColor} / 0.3)`
              }}
            >
              <Swords className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger 
              value="abilities"
              className="font-semibold data-[state=active]:shadow-lg transition-all"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Abilities</span>
            </TabsTrigger>
            <TabsTrigger 
              value="spells"
              className="font-semibold data-[state=active]:shadow-lg transition-all"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Spells</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notes"
              className="font-semibold data-[state=active]:shadow-lg transition-all"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
          </TabsList>

          {/* Skills Tab - Nimble V2 Skills */}
          <TabsContent value="skills" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AbilityPanel
                title="Strength"
                color="var(--ability-str)"
                modifier={strengthMod}
                icon={Swords}
                statValue={formData.strength}
                skills={[
                  { name: "Might", value: formData.skill_might, proficient: formData.skill_might > 0 }
                ]}
              />
              <AbilityPanel
                title="Dexterity"
                color="var(--ability-dex)"
                modifier={dexterityMod}
                icon={Target}
                statValue={formData.dexterity}
                skills={[
                  { name: "Finesse", value: formData.skill_finesse, proficient: formData.skill_finesse > 0 },
                  { name: "Stealth", value: formData.skill_stealth, proficient: formData.skill_stealth > 0 }
                ]}
              />
              <AbilityPanel
                title="Intelligence"
                color="var(--ability-int)"
                modifier={intelligenceMod}
                icon={BookOpen}
                statValue={formData.intelligence}
                skills={[
                  { name: "Arcana", value: formData.skill_arcana, proficient: formData.skill_arcana > 0 },
                  { name: "Examination", value: formData.skill_examination, proficient: formData.skill_examination > 0 },
                  { name: "Lore", value: formData.skill_lore, proficient: formData.skill_lore > 0 }
                ]}
              />
              <AbilityPanel
                title="Will"
                color="var(--ability-wis)"
                modifier={willMod}
                icon={Wand2}
                statValue={formData.will}
                skills={[
                  { name: "Insight", value: formData.skill_insight, proficient: formData.skill_insight > 0 },
                  { name: "Influence", value: formData.skill_influence, proficient: formData.skill_influence > 0 },
                  { name: "Naturecraft", value: formData.skill_naturecraft, proficient: formData.skill_naturecraft > 0 },
                  { name: "Perception", value: formData.skill_perception, proficient: formData.skill_perception > 0 }
                ]}
              />
            </div>
          </TabsContent>

          {/* Abilities Tab */}
          <TabsContent value="abilities" className="mt-6 space-y-4">
            {formData.background && (
              <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                <CardHeader>
                  <CardTitle className="text-xl font-cinzel" style={{ color: `hsl(${classThemeColor})` }}>
                    Background
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {formData.background}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {formData.abilities && (
              <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                <CardHeader>
                  <CardTitle className="text-xl font-cinzel" style={{ color: `hsl(${classThemeColor})` }}>
                    Class Abilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {formData.abilities}
                  </p>
                </CardContent>
              </Card>
            )}

            {formData.powers && (
              <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                <CardHeader>
                  <CardTitle className="text-xl font-cinzel" style={{ color: `hsl(${classThemeColor})` }}>
                    Powers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {formData.powers}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Spells Tab */}
          <TabsContent value="spells" className="mt-6">
            {formData.spells ? (
              <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                <CardHeader>
                  <CardTitle className="text-xl font-cinzel" style={{ color: `hsl(${classThemeColor})` }}>
                    Spell List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {formData.spells}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                <CardContent className="py-16 text-center">
                  <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: `hsl(${classThemeColor})` }} />
                  <p className="text-muted-foreground font-medium">No spells recorded</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="mt-6 space-y-4">
            {formData.description && (
              <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                <CardHeader>
                  <CardTitle className="text-xl font-cinzel" style={{ color: `hsl(${classThemeColor})` }}>
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {formData.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {formData.notes && (
              <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                <CardHeader>
                  <CardTitle className="text-xl font-cinzel" style={{ color: `hsl(${classThemeColor})` }}>
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {formData.notes}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {!formData.description && !formData.notes && (
              <Card className="bg-card/70 border-2 backdrop-blur-sm" style={{ borderColor: `hsl(${classThemeColor} / 0.3)` }}>
                <CardContent className="py-16 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: `hsl(${classThemeColor})` }} />
                  <p className="text-muted-foreground font-medium">No notes recorded</p>
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
      </div>

      <DiceLogPanel />
      <ManualDiceRoller 
        characterName={formData.name} 
        characterId={characterId}
      />
    </div>
  );
};

export default CharacterView;

