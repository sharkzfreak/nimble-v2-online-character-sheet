import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WizardFormData } from "./CharacterBuilder";
import { NimbleRuleset } from "@/hooks/useNimbleRuleset";
import { Shield, Heart, User } from "lucide-react";

interface BuilderLivePreviewProps {
  formData: WizardFormData;
  ruleset: NimbleRuleset | undefined;
}

export const BuilderLivePreview = ({ formData, ruleset }: BuilderLivePreviewProps) => {
  const statMod = (stat: number) => Math.floor((stat - 10) / 2);
  
  const classColor = ruleset?.classes.find(c => c.name === formData.class)?.name 
    ? `var(--class-${formData.class.toLowerCase()})` 
    : "var(--primary)";

  return (
    <div className="p-6 space-y-4 sticky top-20">
      <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
      
      {/* Portrait */}
      <Card className="border-2" style={{ borderColor: classColor }}>
        <CardContent className="p-4">
          <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-3">
            {formData.portrait_url ? (
              <img src={formData.portrait_url} alt="Portrait" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <User className="w-16 h-16 text-muted-foreground/50" />
            )}
          </div>
          <div className="text-center space-y-1">
            <h4 className="font-bold text-lg">{formData.name || "Unnamed Character"}</h4>
            <p className="text-sm text-muted-foreground">
              {formData.race && `${formData.race} `}
              {formData.class || "No Class"}
            </p>
            <p className="text-xs text-muted-foreground">Level {formData.level}</p>
          </div>
        </CardContent>
      </Card>

      {/* Core Stats */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="font-semibold text-sm">Core Stats</h4>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <StatCircle label="STR" value={formData.strength} mod={statMod(formData.strength)} />
          <StatCircle label="DEX" value={formData.dexterity} mod={statMod(formData.dexterity)} />
          <StatCircle label="INT" value={formData.intelligence} mod={statMod(formData.intelligence)} />
          <StatCircle label="WILL" value={formData.will} mod={statMod(formData.will)} />
        </CardContent>
      </Card>

      {/* Derived Stats */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="font-semibold text-sm">Derived Stats</h4>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-destructive" />
              <span className="text-sm">HP</span>
            </div>
            <span className="font-semibold">{formData.hp_max || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm">Armor</span>
            </div>
            <span className="font-semibold">{formData.armor}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCircle = ({ label, value, mod }: { label: string; value: number; mod: number }) => (
  <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
    <span className="text-xs text-muted-foreground mb-1">{label}</span>
    <span className="text-2xl font-bold">{value}</span>
    <span className="text-xs text-primary">
      {mod >= 0 ? "+" : ""}{mod}
    </span>
  </div>
);
