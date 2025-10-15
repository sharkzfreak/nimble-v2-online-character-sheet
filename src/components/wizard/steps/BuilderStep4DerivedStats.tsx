import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Heart, Shield } from "lucide-react";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: any;
}

export const BuilderStep4DerivedStats = ({ formData, setFormData }: BuilderStepProps) => {
  const statMod = (stat: number) => Math.floor((stat - 10) / 2);
  const baseHP = 10 + statMod(formData.strength) + (formData.level * 5);
  const baseArmor = 10 + statMod(formData.dexterity);

  // Auto-calculate on component mount/update
  if (formData.hp_max !== baseHP) {
    setFormData({ ...formData, hp_max: baseHP, hp_current: baseHP });
  }
  if (formData.armor !== baseArmor) {
    setFormData({ ...formData, armor: baseArmor });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Derived Stats
        </h2>
        <p className="text-muted-foreground">
          These are calculated from your ability scores
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-destructive" />
              Hit Points
            </CardTitle>
            <CardDescription>Your character's health and vitality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Maximum HP</Label>
              <Input
                type="number"
                value={formData.hp_max}
                onChange={(e) => setFormData({
                  ...formData,
                  hp_max: parseInt(e.target.value) || 0,
                  hp_current: parseInt(e.target.value) || 0
                })}
              />
              <p className="text-xs text-muted-foreground">
                Base: 10 + STR mod ({statMod(formData.strength)}) + Level × 5 = {baseHP}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Armor Class
            </CardTitle>
            <CardDescription>Your character's defense rating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Armor</Label>
              <Input
                type="number"
                value={formData.armor}
                onChange={(e) => setFormData({ ...formData, armor: parseInt(e.target.value) || 10 })}
              />
              <p className="text-xs text-muted-foreground">
                Base: 10 + DEX mod ({statMod(formData.dexterity)}) = {baseArmor}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground mb-1">STR Mod</div>
              <div className="text-2xl font-bold text-primary">
                {statMod(formData.strength) >= 0 ? '+' : ''}{statMod(formData.strength)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">DEX Mod</div>
              <div className="text-2xl font-bold text-primary">
                {statMod(formData.dexterity) >= 0 ? '+' : ''}{statMod(formData.dexterity)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">INT Mod</div>
              <div className="text-2xl font-bold text-primary">
                {statMod(formData.intelligence) >= 0 ? '+' : ''}{statMod(formData.intelligence)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">WILL Mod</div>
              <div className="text-2xl font-bold text-primary">
                {statMod(formData.will) >= 0 ? '+' : ''}{statMod(formData.will)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
