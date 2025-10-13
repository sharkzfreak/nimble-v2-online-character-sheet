import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RuleTooltip } from "@/components/RuleTooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Zap, Target, Sword, Book, Package, FileText } from "lucide-react";

interface CharacterViewProps {
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
  formData,
  calculateHealth,
  calculateDefense,
  calculateInitiative,
  calculateCarryWeight,
}: CharacterViewProps) => {
  
  const getModifier = (stat: number): string => {
    const mod = Math.floor((stat - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const AbilityBadge = ({ 
    name, 
    value, 
    color 
  }: { 
    name: string; 
    value: number; 
    color: string;
  }) => {
    const modifier = getModifier(value);
    return (
      <div className="flex flex-col items-center group hover-scale">
        <div 
          className="relative w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-300"
          style={{
            backgroundColor: `hsl(${color} / 0.1)`,
            borderColor: `hsl(${color})`,
            boxShadow: `0 0 20px hsl(${color} / 0.3)`
          }}
        >
          <div className="text-xs font-bold uppercase tracking-wider opacity-70">{name}</div>
          <div className="text-2xl font-bold" style={{ color: `hsl(${color})` }}>{modifier}</div>
          <div className="text-xs opacity-60">{value}</div>
        </div>
      </div>
    );
  };

  const QuickStat = ({ 
    icon: Icon, 
    label, 
    value 
  }: { 
    icon: any; 
    label: string; 
    value: number | string;
  }) => (
    <div className="flex items-center gap-2 px-4 py-2 bg-[var(--stat-card-bg)] border border-[var(--stat-card-border)] rounded-lg hover-scale">
      <Icon className="w-5 h-5 text-primary" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
        <span className="text-xl font-bold text-foreground">{value}</span>
      </div>
    </div>
  );

  const SkillItem = ({ 
    name, 
    value, 
    proficient = false 
  }: { 
    name: string; 
    value: number;
    proficient?: boolean;
  }) => (
    <div className="flex items-center justify-between py-2 px-3 hover:bg-muted/30 rounded transition-colors">
      <div className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded-sm border ${proficient ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
          {proficient && <div className="w-full h-full flex items-center justify-center text-xs">✓</div>}
        </div>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <span className="text-sm font-bold text-muted-foreground">
        {value >= 0 ? `+${value}` : value}
      </span>
    </div>
  );

  const AbilityPanel = ({ 
    title, 
    color, 
    modifier, 
    skills 
  }: { 
    title: string; 
    color: string;
    modifier: string;
    skills: { name: string; value: number; proficient?: boolean }[];
  }) => (
    <div className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden shadow-lg">
      <div 
        className="px-4 py-3 border-b"
        style={{
          backgroundColor: `hsl(${color} / 0.15)`,
          borderColor: `hsl(${color} / 0.3)`
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: `hsl(${color})` }}>
            {title}
          </h3>
          <span className="text-lg font-bold" style={{ color: `hsl(${color})` }}>
            {modifier}
          </span>
        </div>
      </div>
      <div className="p-2 space-y-1">
        {skills.map((skill, idx) => (
          <SkillItem key={idx} {...skill} />
        ))}
      </div>
    </div>
  );

  const strengthMod = getModifier(formData.strength);
  const dexterityMod = getModifier(formData.dexterity);
  const intelligenceMod = getModifier(formData.intelligence);
  const willMod = getModifier(formData.will);

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Character Header */}
      <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-border shadow-[var(--shadow-card)]">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="text-4xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
                {formData.name || "Unnamed Character"}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                {formData.class && <Badge variant="default" className="text-sm">{formData.class}</Badge>}
                {formData.race && <Badge variant="outline" className="text-sm">{formData.race}</Badge>}
                <Badge variant="secondary" className="text-sm">Level {formData.level}</Badge>
              </div>
            </div>
            
            {(formData.player || formData.campaign) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {formData.player && (
                  <div>
                    <span className="text-muted-foreground">Player:</span>
                    <span className="ml-2 font-medium">{formData.player}</span>
                  </div>
                )}
                {formData.campaign && (
                  <div>
                    <span className="text-muted-foreground">Campaign:</span>
                    <span className="ml-2 font-medium">{formData.campaign}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        {/* Quick Stats Bar */}
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <QuickStat icon={Shield} label="Defense" value={calculateDefense()} />
            <QuickStat icon={Zap} label="Speed" value={30} />
            <QuickStat icon={Target} label="Initiative" value={`+${calculateInitiative()}`} />
            <QuickStat icon={Sword} label="Health" value={calculateHealth()} />
          </div>

          {/* Ability Scores */}
          <Separator className="my-4" />
          <div className="flex justify-center gap-4 md:gap-6 flex-wrap py-4">
            <AbilityBadge name="STR" value={formData.strength} color="var(--ability-str)" />
            <AbilityBadge name="DEX" value={formData.dexterity} color="var(--ability-dex)" />
            <AbilityBadge name="INT" value={formData.intelligence} color="var(--ability-int)" />
            <AbilityBadge name="WILL" value={formData.will} color="var(--ability-will)" />
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="abilities" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/50 border border-border">
          <TabsTrigger value="abilities" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Book className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Abilities</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Target className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="spells" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Zap className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Spells</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AbilityPanel
              title="Strength"
              color="var(--ability-str)"
              modifier={strengthMod}
              skills={[
                { name: "Might", value: formData.skill_might, proficient: formData.skill_might > 0 }
              ]}
            />
            <AbilityPanel
              title="Dexterity"
              color="var(--ability-dex)"
              modifier={dexterityMod}
              skills={[
                { name: "Finesse", value: formData.skill_finesse, proficient: formData.skill_finesse > 0 },
                { name: "Stealth", value: formData.skill_stealth, proficient: formData.skill_stealth > 0 }
              ]}
            />
            <AbilityPanel
              title="Intelligence"
              color="var(--ability-int)"
              modifier={intelligenceMod}
              skills={[
                { name: "Arcana", value: formData.skill_arcana, proficient: formData.skill_arcana > 0 },
                { name: "Examination", value: formData.skill_examination, proficient: formData.skill_examination > 0 },
                { name: "Lore", value: formData.skill_lore, proficient: formData.skill_lore > 0 }
              ]}
            />
            <AbilityPanel
              title="Will"
              color="var(--ability-will)"
              modifier={willMod}
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
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Background</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {formData.background}
                </p>
              </CardContent>
            </Card>
          )}
          
          {formData.abilities && (
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Class Abilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {formData.abilities}
                </p>
              </CardContent>
            </Card>
          )}

          {formData.powers && (
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Powers</CardTitle>
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
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Spell List</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {formData.spells}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/50 border-border">
              <CardContent className="py-12 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No spells recorded</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-6 space-y-4">
          {formData.description && (
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {formData.description}
                </p>
              </CardContent>
            </Card>
          )}

          {formData.notes && (
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {formData.notes}
                </p>
              </CardContent>
            </Card>
          )}
          
          {!formData.description && !formData.notes && (
            <Card className="bg-card/50 border-border">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No notes recorded</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CharacterView;
