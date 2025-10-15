import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Heart, Sparkles, Check } from "lucide-react";

interface LevelUpReviewProps {
  character: any;
  draft: any;
}

export const LevelUpReview = ({ character, draft }: LevelUpReviewProps) => {
  const newMaxHP = character.hp_max + draft.hpIncrease;
  const newCurrentHP = draft.refillHP ? newMaxHP : character.hp_current;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Review & Confirm
        </h3>
        <p className="text-sm text-muted-foreground">
          Review all changes before applying your level up
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Level Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 text-4xl font-bold">
            <span className="text-muted-foreground">Level {character.level}</span>
            <span className="text-primary">→</span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Level {draft.targetLevel}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-green-500" />
            Hit Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Maximum HP</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{character.hp_max}</span>
              <span>→</span>
              <span className="font-bold text-green-500">{newMaxHP}</span>
              <Badge variant="outline" className="text-green-500 border-green-500/50">
                +{draft.hpIncrease}
              </Badge>
            </div>
          </div>
          
          {draft.refillHP && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current HP</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{character.hp_current}</span>
                <span>→</span>
                <span className="font-bold text-green-500">{newMaxHP}</span>
                <Badge className="bg-green-500">Refilled</Badge>
              </div>
            </div>
          )}

          {draft.hpCustomized && (
            <p className="text-xs text-orange-500 mt-2">
              ⚠️ Using custom HP value
            </p>
          )}
        </CardContent>
      </Card>

      {draft.newFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              New Features ({draft.newFeatures.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {draft.newFeatures.map((feature: any, index: number) => {
              const selections = draft.featureSelections[feature.id] || [];
              
              return (
                <div key={feature.id}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">L{feature.level}</Badge>
                      <div className="flex-1">
                        <div className="font-medium">{feature.name}</div>
                        {feature.requires_choice && selections.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="text-xs text-muted-foreground">Selected:</div>
                            {selections.map((selectionId: string) => {
                              const option = feature.options?.find((o: any) => o.id === selectionId);
                              return option ? (
                                <div key={selectionId} className="flex items-center gap-2 text-sm">
                                  <Check className="w-3 h-3 text-green-500" />
                                  <span>{option.name}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                        {!feature.requires_choice && (
                          <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                            <Check className="w-3 h-3" />
                            <span>Auto-gained</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-center text-muted-foreground">
            ✅ Click "Save & Apply" to finalize your level up
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
