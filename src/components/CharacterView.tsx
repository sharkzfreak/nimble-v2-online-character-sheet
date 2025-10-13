import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RuleTooltip } from "@/components/RuleTooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const StatCard = ({ label, value, tooltip }: { label: string; value: number; tooltip?: string }) => (
    <div className="bg-[var(--stat-card-bg)] p-4 rounded-lg border border-[var(--stat-card-border)] text-center hover-scale">
      <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
        {label}
        {tooltip && <RuleTooltip ruleName={tooltip} category="character_creation" />}
      </div>
      <div className="text-3xl font-bold text-foreground">{value}</div>
    </div>
  );

  const DerivedStatCard = ({ label, value, tooltip }: { label: string; value: number; tooltip: string }) => (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20 text-center hover-scale">
      <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
        {label}
        <RuleTooltip ruleName={tooltip} category="combat" />
      </div>
      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        {value}
      </div>
    </div>
  );

  const SkillCard = ({ name, value }: { name: string; value: number }) => (
    <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
      <span className="text-sm font-medium capitalize">{name}</span>
      <Badge variant="secondary" className="text-base font-bold min-w-[3rem] justify-center">
        {value > 0 ? `+${value}` : value}
      </Badge>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-border shadow-[var(--shadow-card)]">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {formData.name || "Unnamed Character"}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                {formData.class && <Badge variant="default" className="text-sm">{formData.class}</Badge>}
                {formData.race && <Badge variant="outline" className="text-sm">{formData.race}</Badge>}
                <Badge variant="secondary" className="text-sm">Level {formData.level}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
          {formData.description && (
            <>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground leading-relaxed">{formData.description}</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Core Stats */}
      <Card className="bg-card border-border shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            Core Statistics
            <RuleTooltip ruleName="Core Stats" category="character_creation" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Strength" value={formData.strength} tooltip="Strength" />
            <StatCard label="Dexterity" value={formData.dexterity} tooltip="Dexterity" />
            <StatCard label="Intelligence" value={formData.intelligence} tooltip="Intelligence" />
            <StatCard label="Will" value={formData.will} tooltip="Will" />
          </div>
        </CardContent>
      </Card>

      {/* Derived Stats */}
      <Card className="bg-card border-border shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-accent">Derived Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DerivedStatCard label="Health" value={calculateHealth()} tooltip="Health Points" />
            <DerivedStatCard label="Defense" value={calculateDefense()} tooltip="Defense" />
            <DerivedStatCard label="Initiative" value={calculateInitiative()} tooltip="Initiative" />
            <DerivedStatCard label="Carry Weight" value={calculateCarryWeight()} tooltip="Carry Weight" />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-card border-border shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            Skills
            <RuleTooltip ruleName="Skills" category="character_creation" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <SkillCard name="Arcana" value={formData.skill_arcana} />
            <SkillCard name="Examination" value={formData.skill_examination} />
            <SkillCard name="Finesse" value={formData.skill_finesse} />
            <SkillCard name="Influence" value={formData.skill_influence} />
            <SkillCard name="Insight" value={formData.skill_insight} />
            <SkillCard name="Might" value={formData.skill_might} />
            <SkillCard name="Lore" value={formData.skill_lore} />
            <SkillCard name="Naturecraft" value={formData.skill_naturecraft} />
            <SkillCard name="Perception" value={formData.skill_perception} />
            <SkillCard name="Stealth" value={formData.skill_stealth} />
          </div>
        </CardContent>
      </Card>

      {/* Background & Traits */}
      {(formData.background || formData.abilities || formData.spells || formData.powers) && (
        <Card className="bg-card border-border shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-primary">Traits & Abilities</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {formData.background && (
                <AccordionItem value="background">
                  <AccordionTrigger className="text-base font-semibold">Background</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {formData.background}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}
              {formData.abilities && (
                <AccordionItem value="abilities">
                  <AccordionTrigger className="text-base font-semibold">Abilities</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {formData.abilities}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}
              {formData.spells && (
                <AccordionItem value="spells">
                  <AccordionTrigger className="text-base font-semibold">Spells</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {formData.spells}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}
              {formData.powers && (
                <AccordionItem value="powers">
                  <AccordionTrigger className="text-base font-semibold">Powers</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {formData.powers}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {formData.notes && (
        <Card className="bg-card border-border shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-primary">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {formData.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CharacterView;
