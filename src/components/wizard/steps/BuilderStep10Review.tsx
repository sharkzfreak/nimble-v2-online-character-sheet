import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: any;
}

export const BuilderStep10Review = ({ formData }: BuilderStepProps) => {
  const statMod = (stat: number) => Math.floor((stat - 10) / 2);
  
  const validations = [
    { label: "Character Name", valid: !!formData.name, value: formData.name || "Not set" },
    { label: "Class", valid: !!formData.class, value: formData.class || "Not set" },
    { label: "Ability Scores", valid: formData.strength >= 3 && formData.dexterity >= 3 && formData.intelligence >= 3 && formData.will >= 3, value: "Set" },
    { label: "HP & Armor", valid: formData.hp_max > 0 && formData.armor > 0, value: `${formData.hp_max} HP, ${formData.armor} AC` },
  ];

  const allValid = validations.every(v => v.valid);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Review & Confirm
        </h2>
        <p className="text-muted-foreground">
          Verify your character details before creating
        </p>
      </div>

      {/* Validation Status */}
      <Card className={allValid ? "border-green-500 bg-green-500/5" : "border-yellow-500 bg-yellow-500/5"}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            {allValid ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="font-semibold text-green-500">Ready to create!</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                <span className="font-semibold text-yellow-500">Please check required fields</span>
              </>
            )}
          </div>
          <div className="space-y-2">
            {validations.map((validation, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{validation.label}</span>
                <div className="flex items-center gap-2">
                  <span>{validation.value}</span>
                  {validation.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Character Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-semibold">{formData.name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Level:</span>
              <span className="font-semibold">{formData.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Race:</span>
              <span className="font-semibold">{formData.race || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Class:</span>
              <span className="font-semibold">{formData.class || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Background:</span>
              <span className="font-semibold">{formData.background || "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Core Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-xs text-muted-foreground">STR</div>
              <div className="text-2xl font-bold">{formData.strength}</div>
              <div className="text-xs text-primary">
                {statMod(formData.strength) >= 0 ? '+' : ''}{statMod(formData.strength)}
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-xs text-muted-foreground">DEX</div>
              <div className="text-2xl font-bold">{formData.dexterity}</div>
              <div className="text-xs text-primary">
                {statMod(formData.dexterity) >= 0 ? '+' : ''}{statMod(formData.dexterity)}
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-xs text-muted-foreground">INT</div>
              <div className="text-2xl font-bold">{formData.intelligence}</div>
              <div className="text-xs text-primary">
                {statMod(formData.intelligence) >= 0 ? '+' : ''}{statMod(formData.intelligence)}
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-xs text-muted-foreground">WILL</div>
              <div className="text-2xl font-bold">{formData.will}</div>
              <div className="text-xs text-primary">
                {statMod(formData.will) >= 0 ? '+' : ''}{statMod(formData.will)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Derived Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">HP:</span>
              <span className="font-semibold">{formData.hp_max}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Armor:</span>
              <span className="font-semibold">{formData.armor}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {Object.entries({
              'Arcana': formData.skill_arcana,
              'Examination': formData.skill_examination,
              'Finesse': formData.skill_finesse,
              'Influence': formData.skill_influence,
              'Insight': formData.skill_insight,
              'Lore': formData.skill_lore,
              'Might': formData.skill_might,
              'Naturecraft': formData.skill_naturecraft,
              'Perception': formData.skill_perception,
              'Stealth': formData.skill_stealth,
            }).filter(([_, value]) => value > 0).map(([skill, value]) => (
              <div key={skill} className="flex justify-between">
                <span className="text-muted-foreground">{skill}:</span>
                <Badge variant="secondary">+{value}</Badge>
              </div>
            ))}
            {Object.values({
              arcana: formData.skill_arcana,
              examination: formData.skill_examination,
              finesse: formData.skill_finesse,
              influence: formData.skill_influence,
              insight: formData.skill_insight,
              lore: formData.skill_lore,
              might: formData.skill_might,
              naturecraft: formData.skill_naturecraft,
              perception: formData.skill_perception,
              stealth: formData.skill_stealth,
            }).every(v => v === 0) && (
              <p className="text-muted-foreground text-center py-2">No skills selected</p>
            )}
          </CardContent>
        </Card>
      </div>

      {formData.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{formData.description}</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6 text-center">
          <p className="text-sm font-medium mb-2">Ready to begin your adventure?</p>
          <p className="text-xs text-muted-foreground">
            Click "Create Character" below to save your character and open the character sheet
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
