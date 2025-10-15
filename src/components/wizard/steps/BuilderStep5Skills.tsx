import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NimbleRuleset } from "@/hooks/useNimbleRuleset";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: NimbleRuleset | undefined;
}

type SkillName = 'skill_arcana' | 'skill_examination' | 'skill_finesse' | 'skill_influence' | 
                 'skill_insight' | 'skill_lore' | 'skill_might' | 'skill_naturecraft' | 
                 'skill_perception' | 'skill_stealth';

export const BuilderStep5Skills = ({ formData, setFormData, ruleset }: BuilderStepProps) => {
  const SKILL_POINTS = 4 + formData.level;
  
  const skillMapping: { [key: string]: SkillName } = {
    'Arcana': 'skill_arcana',
    'Examination': 'skill_examination',
    'Finesse': 'skill_finesse',
    'Influence': 'skill_influence',
    'Insight': 'skill_insight',
    'Lore': 'skill_lore',
    'Might': 'skill_might',
    'Naturecraft': 'skill_naturecraft',
    'Perception': 'skill_perception',
    'Stealth': 'skill_stealth',
  };

  const getTotalSkillPoints = () => {
    return Object.keys(skillMapping).reduce((total, key) => {
      const skillKey = skillMapping[key];
      return total + (formData[skillKey] || 0);
    }, 0);
  };

  const handleSkillChange = (skillName: SkillName, delta: number) => {
    const currentValue = formData[skillName] || 0;
    const newValue = Math.max(0, Math.min(3, currentValue + delta));
    const currentTotal = getTotalSkillPoints();
    const newTotal = currentTotal - currentValue + newValue;

    if (newTotal <= SKILL_POINTS) {
      setFormData({ ...formData, [skillName]: newValue });
    }
  };

  const skillsRemaining = SKILL_POINTS - getTotalSkillPoints();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Skills & Proficiencies
        </h2>
        <p className="text-muted-foreground">
          Allocate {SKILL_POINTS} points across your skills (max 3 per skill)
        </p>
        <Badge variant={skillsRemaining > 0 ? "default" : "secondary"} className="text-lg px-4 py-1">
          {skillsRemaining} points remaining
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ruleset?.skills.map((skill) => {
          const skillKey = skillMapping[skill.name];
          const skillValue = formData[skillKey] || 0;
          
          return (
            <Card key={skill.name} className={skillValue > 0 ? "border-primary/50" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{skill.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {skill.stat} • {skill.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{skill.stat}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Proficiency: {skillValue}</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSkillChange(skillKey, -1)}
                      disabled={skillValue === 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-bold">{skillValue}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSkillChange(skillKey, 1)}
                      disabled={skillValue >= 3 || skillsRemaining === 0}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!ruleset && (
        <div className="text-center text-muted-foreground">
          <p>Loading skills...</p>
        </div>
      )}
    </div>
  );
};
