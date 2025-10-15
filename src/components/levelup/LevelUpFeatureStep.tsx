import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Sparkles, AlertCircle } from "lucide-react";
import { useState } from "react";

interface LevelUpFeatureStepProps {
  draft: any;
  setDraft: (draft: any) => void;
}

export const LevelUpFeatureStep = ({ draft, setDraft }: LevelUpFeatureStepProps) => {
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  const toggleFeatureExpanded = (featureId: string) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featureId)) {
      newExpanded.delete(featureId);
    } else {
      newExpanded.add(featureId);
    }
    setExpandedFeatures(newExpanded);
  };

  const handleFeatureChoice = (featureId: string, optionId: string, isMulti: boolean) => {
    const currentSelections = draft.featureSelections[featureId] || [];
    
    let newSelections: string[];
    if (isMulti) {
      // Multi-choice: toggle
      if (currentSelections.includes(optionId)) {
        newSelections = currentSelections.filter((id: string) => id !== optionId);
      } else {
        newSelections = [...currentSelections, optionId];
      }
    } else {
      // Single choice: replace
      newSelections = [optionId];
    }

    setDraft({
      ...draft,
      featureSelections: {
        ...draft.featureSelections,
        [featureId]: newSelections,
      },
    });
  };

  const isFeatureComplete = (feature: any): boolean => {
    if (!feature.requires_choice) return true;
    const selections = draft.featureSelections[feature.id] || [];
    const required = feature.choice_count || 1;
    return selections.length === required;
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2 pb-4">
        <h3 className="text-xl font-bold">New Class Features</h3>
        <p className="text-sm text-muted-foreground">
          Configure your new abilities unlocked at level {draft.targetLevel}
        </p>
      </div>

      {/* Unresolved Tray */}
      {draft.newFeatures.some((f: any) => !isFeatureComplete(f)) && (
        <Card className="border-orange-500/50 bg-orange-500/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <div className="font-medium text-orange-500">Incomplete Choices</div>
                <div className="text-sm text-muted-foreground">
                  {draft.newFeatures.filter((f: any) => !isFeatureComplete(f)).length} feature(s) need your attention
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {draft.newFeatures.map((feature: any) => {
        const isComplete = isFeatureComplete(feature);
        const selections = draft.featureSelections[feature.id] || [];
        const required = feature.choice_count || 1;

        return (
          <Card key={feature.id} className={!isComplete ? "border-orange-500/50" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">L{feature.level}</Badge>
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                    {isComplete && <Badge className="bg-green-500">Complete</Badge>}
                  </div>
                  {feature.requires_choice && (
                    <CardDescription className="mt-1">
                      {feature.choice_type === 'multi' 
                        ? `Choose ${selections.length}/${required}` 
                        : 'Choose 1 option'}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Collapsible 
                open={expandedFeatures.has(feature.id)}
                onOpenChange={() => toggleFeatureExpanded(feature.id)}
              >
                <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedFeatures.has(feature.id) ? 'rotate-180' : ''}`} />
                  {expandedFeatures.has(feature.id) ? 'Hide' : 'Show'} description
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CollapsibleContent>
              </Collapsible>

              {feature.requires_choice && feature.options && (
                <div className="space-y-3 pt-2">
                  {feature.choice_type === 'single' ? (
                    <RadioGroup
                      value={selections[0] || ''}
                      onValueChange={(value) => handleFeatureChoice(feature.id, value, false)}
                    >
                      {feature.options.map((option: any) => (
                        <div key={option.id} className="flex items-start space-x-2 p-3 rounded-lg border bg-background/50 hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value={option.id} id={`${feature.id}-${option.id}`} className="mt-1" />
                          <Label htmlFor={`${feature.id}-${option.id}`} className="flex-1 cursor-pointer">
                            <div className="font-medium">{option.name}</div>
                            {option.description && (
                              <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-2">
                      {feature.options.map((option: any) => {
                        const isChecked = selections.includes(option.id);
                        const maxReached = selections.length >= required;
                        const isDisabled = !isChecked && maxReached;

                        return (
                          <div key={option.id} className={`flex items-start space-x-2 p-3 rounded-lg border bg-background/50 hover:bg-accent/50 transition-colors ${isDisabled ? 'opacity-50' : ''}`}>
                            <Checkbox
                              id={`${feature.id}-${option.id}`}
                              checked={isChecked}
                              onCheckedChange={() => handleFeatureChoice(feature.id, option.id, true)}
                              disabled={isDisabled}
                              className="mt-1"
                            />
                            <Label htmlFor={`${feature.id}-${option.id}`} className="flex-1 cursor-pointer">
                              <div className="font-medium">{option.name}</div>
                              {option.description && (
                                <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                              )}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {!feature.requires_choice && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Sparkles className="w-4 h-4" />
                  <span>Automatically gained at level {feature.level}</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
