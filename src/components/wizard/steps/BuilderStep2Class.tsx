import { useState } from "react";
import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NimbleRuleset } from "@/hooks/useNimbleRuleset";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getClassFeatures, ClassFeature } from "@/config/classFeatures";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: NimbleRuleset | undefined;
}

export const BuilderStep2Class = ({ formData, setFormData, ruleset }: BuilderStepProps) => {
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  const handleClassSelect = (classData: any) => {
    // Load features for the selected class
    const features = getClassFeatures(classData.name).filter(f => f.level <= formData.level);
    
    setFormData({
      ...formData,
      class: classData.name,
      class_id: null,
      class_features: features,
    });
  };

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
    const updatedFeatures = formData.class_features.map(f => {
      if (f.id !== featureId) return f;

      if (isMulti) {
        const currentSelection = f.selection || [];
        const newSelection = currentSelection.includes(optionId)
          ? currentSelection.filter(id => id !== optionId)
          : [...currentSelection, optionId];
        return { ...f, selection: newSelection };
      } else {
        return { ...f, selection: [optionId] };
      }
    });

    setFormData({ ...formData, class_features: updatedFeatures });
  };

  const getFeatureChoiceStatus = (feature: ClassFeature): string => {
    if (!feature.requires_choice) return "";
    const selected = feature.selection?.length || 0;
    const required = feature.choice_count || 1;
    if (selected === 0) return `Choose ${required}`;
    if (selected < required) return `${selected}/${required} chosen`;
    return "Complete";
  };

  const isFeatureComplete = (feature: ClassFeature): boolean => {
    if (!feature.requires_choice) return true;
    const selected = feature.selection?.length || 0;
    const required = feature.choice_count || 1;
    return selected === required;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Choose Your Path
        </h2>
        <p className="text-muted-foreground">
          Select a class that defines your combat style and abilities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ruleset?.classes.map((classOption) => (
          <Card
            key={classOption.name}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              formData.class === classOption.name
                ? "border-primary border-2 shadow-[var(--shadow-glow)]"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleClassSelect(classOption)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{classOption.name}</CardTitle>
                <Badge variant={classOption.complexity === 1 ? "default" : classOption.complexity === 2 ? "secondary" : "destructive"}>
                  {classOption.complexity === 1 ? "Simple" : classOption.complexity === 2 ? "Moderate" : "Complex"}
                </Badge>
              </div>
              <CardDescription className="text-sm line-clamp-2">
                {classOption.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Features Panel */}
      {formData.class && formData.class_features.length > 0 && (
        <Card className="mt-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-primary">{formData.class}</span> Features
            </CardTitle>
            <CardDescription>
              Class abilities and choices available at level {formData.level}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.class_features.map((feature) => {
              const isExpanded = expandedFeatures.has(feature.id);
              const status = getFeatureChoiceStatus(feature);
              const isComplete = isFeatureComplete(feature);

              return (
                <div key={feature.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          L{feature.level}
                        </Badge>
                        <h4 className="font-semibold">{feature.name}</h4>
                        {feature.requires_choice && (
                          <Badge 
                            variant={isComplete ? "default" : "secondary"}
                            className="text-xs ml-auto"
                          >
                            {status}
                          </Badge>
                        )}
                      </div>
                      
                      <Collapsible open={isExpanded} onOpenChange={() => toggleFeatureExpanded(feature.id)}>
                        <CollapsibleTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-3 w-3 mr-1" />
                                Hide details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3 mr-1" />
                                Show details
                              </>
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>

                  {/* Feature Options */}
                  {feature.requires_choice && feature.options && (
                    <div className="pt-2 border-t space-y-2">
                      {feature.choice_type === 'single' ? (
                        <RadioGroup
                          value={feature.selection?.[0] || ""}
                          onValueChange={(value) => handleFeatureChoice(feature.id, value, false)}
                        >
                          {feature.options.map((option) => (
                            <div key={option.id} className="flex items-start space-x-2 p-2 rounded hover:bg-muted/50">
                              <RadioGroupItem value={option.id} id={`${feature.id}-${option.id}`} />
                              <div className="flex-1">
                                <Label 
                                  htmlFor={`${feature.id}-${option.id}`}
                                  className="font-medium cursor-pointer"
                                >
                                  {option.name}
                                </Label>
                                {option.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {option.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        <div className="space-y-2">
                          {feature.options.map((option) => {
                            const isChecked = feature.selection?.includes(option.id) || false;
                            const isDisabled = 
                              !isChecked && 
                              (feature.selection?.length || 0) >= (feature.choice_count || 1);

                            return (
                              <div key={option.id} className="flex items-start space-x-2 p-2 rounded hover:bg-muted/50">
                                <Checkbox
                                  id={`${feature.id}-${option.id}`}
                                  checked={isChecked}
                                  disabled={isDisabled}
                                  onCheckedChange={() => handleFeatureChoice(feature.id, option.id, true)}
                                />
                                <div className="flex-1">
                                  <Label 
                                    htmlFor={`${feature.id}-${option.id}`}
                                    className={`font-medium cursor-pointer ${isDisabled ? 'opacity-50' : ''}`}
                                  >
                                    {option.name}
                                  </Label>
                                  {option.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {option.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {!ruleset && (
        <div className="text-center text-muted-foreground">
          <p>Loading class options...</p>
        </div>
      )}
    </div>
  );
};
