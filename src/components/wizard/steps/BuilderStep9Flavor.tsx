import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: any;
}

export const BuilderStep9Flavor = ({ formData, setFormData }: BuilderStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Flavor & Personality
        </h2>
        <p className="text-muted-foreground">
          Bring your character to life with backstory and personality
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Character Description
          </CardTitle>
          <CardDescription>
            Describe your character's appearance, personality, and backstory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="description">Description & Backstory</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your character's appearance, personality traits, backstory, motivations, fears, and goals..."
              rows={12}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Need inspiration? Consider:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Physical appearance (height, build, distinctive features)</li>
            <li>• Personality traits (brave, cautious, optimistic, cynical)</li>
            <li>• Background and origin (where they're from, their upbringing)</li>
            <li>• Motivations and goals (what drives them forward)</li>
            <li>• Fears and flaws (what holds them back)</li>
            <li>• Relationships (family, friends, rivals, enemies)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
