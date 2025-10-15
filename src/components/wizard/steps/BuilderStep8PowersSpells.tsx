import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2 } from "lucide-react";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: any;
}

export const BuilderStep8PowersSpells = ({ formData, setFormData }: BuilderStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Powers & Spells
        </h2>
        <p className="text-muted-foreground">
          Note your character's magical abilities and powers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Spells
            </CardTitle>
            <CardDescription>
              List your prepared spells and spell-like abilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="spells">Spell List</Label>
              <Textarea
                id="spells"
                value={formData.spells}
                onChange={(e) => setFormData({ ...formData, spells: e.target.value })}
                placeholder="e.g., Fireball, Magic Missile, Shield..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Powers</CardTitle>
            <CardDescription>
              Special powers, class abilities, or supernatural effects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="powers">Power List</Label>
              <Textarea
                id="powers"
                value={formData.powers}
                onChange={(e) => setFormData({ ...formData, powers: e.target.value })}
                placeholder="e.g., Channel Divinity, Ki Points, Wild Shape..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            💡 Tip: Add custom spells with damage dice and roll formulas later using the + button in the Spells tab
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
