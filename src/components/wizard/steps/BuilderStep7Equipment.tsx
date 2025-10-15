import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sword } from "lucide-react";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: any;
}

export const BuilderStep7Equipment = ({ formData, setFormData }: BuilderStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Equipment & Gear
        </h2>
        <p className="text-muted-foreground">
          Note your character's weapons, armor, and other equipment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sword className="w-5 h-5 text-primary" />
            Equipment List
          </CardTitle>
          <CardDescription>
            List all weapons, armor, and adventuring gear
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="equipment-notes">Equipment Notes</Label>
            <Textarea
              id="equipment-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g., Longsword, Chain Mail, Backpack, 50ft Rope, 10 Torches..."
              rows={8}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            💡 Tip: You can add custom inventory items with details later using the + button in the Inventory tab
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
