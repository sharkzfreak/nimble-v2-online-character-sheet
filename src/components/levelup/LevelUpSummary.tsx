import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Sparkles, Heart } from "lucide-react";

interface LevelUpSummaryProps {
  character: any;
  draft: any;
}

export const LevelUpSummary = ({ character, draft }: LevelUpSummaryProps) => {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Level Advancement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-4 text-4xl font-bold">
            <span className="text-muted-foreground">Level {character.level}</span>
            <span className="text-primary">→</span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Level {draft.targetLevel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
                <Sparkles className="w-4 h-4" />
                New Features
              </div>
              <div className="text-2xl font-bold text-primary">
                {draft.newFeatures.length}
              </div>
            </div>

            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
                <Heart className="w-4 h-4" />
                HP Increase
              </div>
              <div className="text-2xl font-bold text-green-500">
                +{draft.hpIncrease}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {draft.newFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Features Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {draft.newFeatures.map((feature) => (
              <div key={feature.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                <Badge variant="outline" className="mt-0.5">L{feature.level}</Badge>
                <div className="flex-1">
                  <div className="font-medium">{feature.name}</div>
                  {feature.requires_choice && (
                    <div className="text-sm text-muted-foreground">
                      Requires choice: {feature.choice_type === 'multi' 
                        ? `Choose ${feature.choice_count}` 
                        : 'Choose 1'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-center text-muted-foreground">
            💡 Click Next to configure your new abilities and finalize your level up
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
