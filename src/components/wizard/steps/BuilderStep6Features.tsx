import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: any;
}

export const BuilderStep6Features = ({ formData, setFormData }: BuilderStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Features & Abilities
        </h2>
        <p className="text-muted-foreground">
          Describe your character's special features and class abilities
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Class Features & Abilities
          </CardTitle>
          <CardDescription>
            List your character's special abilities, features, and talents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="abilities">Abilities & Features</Label>
            <Textarea
              id="abilities"
              value={formData.abilities}
              onChange={(e) => setFormData({ ...formData, abilities: e.target.value })}
              placeholder="e.g., Rage, Second Wind, Action Surge..."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            💡 Tip: You can add custom features with roll formulas in the Character View later using the + buttons
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
