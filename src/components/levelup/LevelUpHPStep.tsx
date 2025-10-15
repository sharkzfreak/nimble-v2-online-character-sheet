import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp } from "lucide-react";

interface LevelUpHPStepProps {
  character: any;
  draft: any;
  setDraft: (draft: any) => void;
}

export const LevelUpHPStep = ({ character, draft, setDraft }: LevelUpHPStepProps) => {
  const newMaxHP = character.hp_max + draft.hpIncrease;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 pb-4">
        <h3 className="text-xl font-bold">Hit Points</h3>
        <p className="text-sm text-muted-foreground">
          Your hit points increase as you grow stronger
        </p>
      </div>

      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-green-500" />
            HP Increase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-4 text-3xl font-bold">
            <span className="text-muted-foreground">{character.hp_max} HP</span>
            <TrendingUp className="w-6 h-6 text-green-500" />
            <span className="text-green-500">{newMaxHP} HP</span>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <Badge variant="outline" className="text-green-500 border-green-500/50">
              +{draft.hpIncrease} HP
            </Badge>
          </div>

          {!draft.hpCustomized && (
            <div className="text-sm text-center text-muted-foreground bg-background/50 p-3 rounded-lg">
              Base increase: 6 + STR modifier ({character.str_mod >= 0 ? '+' : ''}{character.str_mod})
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customize HP Increase</CardTitle>
          <CardDescription>
            Override the automatic calculation if needed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="customize-hp">Use custom value</Label>
            <Switch
              id="customize-hp"
              checked={draft.hpCustomized}
              onCheckedChange={(checked) => setDraft({ ...draft, hpCustomized: checked })}
            />
          </div>

          {draft.hpCustomized && (
            <div className="space-y-2">
              <Label htmlFor="hp-increase">Custom HP Increase</Label>
              <Input
                id="hp-increase"
                type="number"
                value={draft.hpIncrease}
                onChange={(e) => setDraft({ ...draft, hpIncrease: parseInt(e.target.value) || 0 })}
                min={1}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Restore HP</CardTitle>
          <CardDescription>
            Do you want to refill your HP to maximum?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="refill-hp">Refill to full HP</Label>
              <p className="text-sm text-muted-foreground">
                Current: {character.hp_current}/{character.hp_max}
                {draft.refillHP && ` → ${newMaxHP}/${newMaxHP}`}
              </p>
            </div>
            <Switch
              id="refill-hp"
              checked={draft.refillHP}
              onCheckedChange={(checked) => setDraft({ ...draft, refillHP: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
