import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Lock, ChevronDown, Search, TrendingUp, Sparkles, Star } from "lucide-react";
import { getClassFeatures } from "@/config/classFeatures";
import { ClassFeature } from "@/config/classFeatures";

interface FeaturesTimelineProps {
  className: string;
  currentLevel: number;
  classFeatures: ClassFeature[];
  onLevelUpClick?: () => void;
  onToggleFavorite?: (featureId: string) => void;
  isFavorited?: (featureId: string) => boolean;
  onEditFeature?: (feature: ClassFeature) => void;
}

export const FeaturesTimeline = ({ 
  className, 
  currentLevel, 
  classFeatures,
  onLevelUpClick,
  onToggleFavorite,
  isFavorited,
  onEditFeature
}: FeaturesTimelineProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  // Get all features from class config
  const allFeatures = getClassFeatures(className);

  // Find the next level after current
  const nextLevel = currentLevel + 1;

  // Filter features to show only unlocked and next level
  const filteredFeatures = allFeatures.filter(feature => {
    // Show if unlocked OR if it's the next level
    const shouldShow = feature.level <= currentLevel || feature.level === nextLevel;
    
    if (!shouldShow) return false;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        feature.name.toLowerCase().includes(query) ||
        feature.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Group by level
  const featuresByLevel: Record<number, ClassFeature[]> = {};
  filteredFeatures.forEach(feature => {
    if (!featuresByLevel[feature.level]) {
      featuresByLevel[feature.level] = [];
    }
    featuresByLevel[feature.level].push(feature);
  });

  const toggleExpanded = (featureId: string) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featureId)) {
      newExpanded.delete(featureId);
    } else {
      newExpanded.add(featureId);
    }
    setExpandedFeatures(newExpanded);
  };

  const isUnlocked = (level: number) => currentLevel >= level;

  // Get user's selection for a feature
  const getFeatureSelection = (featureId: string): string[] => {
    const userFeature = classFeatures.find(f => f.id === featureId);
    return userFeature?.selection || [];
  };

  return (
    <div className="space-y-6">
      {/* Search Only */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search features..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Features Timeline */}
      <div className="space-y-4">
        {Object.keys(featuresByLevel)
          .map(Number)
          .sort((a, b) => a - b)
          .map(level => {
            const features = featuresByLevel[level];
            const levelUnlocked = isUnlocked(level);

            return (
              <div key={level} className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={levelUnlocked ? "default" : "outline"}
                    className={levelUnlocked ? "" : "opacity-50"}
                  >
                    Level {level}
                  </Badge>
                  {!levelUnlocked && (
                    <span className="text-sm text-muted-foreground">
                      {level - currentLevel} level{level - currentLevel !== 1 ? 's' : ''} away
                    </span>
                  )}
                </div>

                {features.map(feature => {
                  const featureUnlocked = isUnlocked(feature.level);
                  const selections = getFeatureSelection(feature.id);
                  const isExpanded = expandedFeatures.has(feature.id);

                  return (
                    <Card 
                      key={feature.id}
                      className={`transition-all ${
                        !featureUnlocked 
                          ? 'opacity-70 saturate-50' 
                          : ''
                      }`}
                    >
                      <Collapsible
                        open={isExpanded}
                        onOpenChange={() => toggleExpanded(feature.id)}
                      >
                        <CardHeader 
                          className="cursor-pointer hover:bg-accent/50 transition-colors"
                          onClick={() => toggleExpanded(feature.id)}
                          onContextMenu={(e) => {
                            if (featureUnlocked && onEditFeature) {
                              e.preventDefault();
                              onEditFeature(feature);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {!featureUnlocked && (
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                  )}
                                  {feature.name}
                                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </CardTitle>
                              </div>
                              {!featureUnlocked && (
                                <CardDescription className="mt-1">
                                  🔒 Unlocks at Level {feature.level}
                                </CardDescription>
                              )}
                              {feature.requires_choice && !featureUnlocked && (
                                <CardDescription className="mt-1">
                                  ({feature.choice_type === 'multi' 
                                    ? `Choose ${feature.choice_count}` 
                                    : 'Choose 1'} at L{feature.level})
                                </CardDescription>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {featureUnlocked && onToggleFavorite && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleFavorite(feature.id);
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Star 
                                    className={`w-4 h-4 ${isFavorited?.(feature.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                                  />
                                </Button>
                              )}
                              {!featureUnlocked && onLevelUpClick && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onLevelUpClick();
                                  }}
                                  disabled={feature.level > nextLevel}
                                >
                                  <TrendingUp className="w-4 h-4 mr-2" />
                                  Level Up
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CollapsibleContent>
                          <CardContent className="pt-0 space-y-4">
                            <p className="text-sm text-muted-foreground">{feature.description}</p>

                            {feature.requires_choice && feature.options && (
                              <div className="space-y-3 pt-2">
                                <div className="text-sm font-medium">
                                  {featureUnlocked ? 'Your Selection:' : 'Options (preview):'}
                                </div>

                                {feature.choice_type === 'single' ? (
                                  <RadioGroup value={selections[0] || ''} disabled={!featureUnlocked}>
                                    {feature.options.map(option => (
                                      <div key={option.id} className={`flex items-start space-x-2 p-3 rounded-lg border ${!featureUnlocked ? 'opacity-50' : 'bg-background/50'}`}>
                                        <RadioGroupItem 
                                          value={option.id} 
                                          id={`${feature.id}-${option.id}`} 
                                          disabled={!featureUnlocked}
                                          className="mt-1" 
                                        />
                                        <Label htmlFor={`${feature.id}-${option.id}`} className="flex-1">
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
                                    {feature.options.map(option => (
                                      <div key={option.id} className={`flex items-start space-x-2 p-3 rounded-lg border ${!featureUnlocked ? 'opacity-50' : 'bg-background/50'}`}>
                                        <Checkbox
                                          id={`${feature.id}-${option.id}`}
                                          checked={selections.includes(option.id)}
                                          disabled={!featureUnlocked}
                                          className="mt-1"
                                        />
                                        <Label htmlFor={`${feature.id}-${option.id}`} className="flex-1">
                                          <div className="font-medium">{option.name}</div>
                                          {option.description && (
                                            <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                                          )}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  );
                })}
              </div>
            );
          })}

        {filteredFeatures.length === 0 && (
          <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center text-muted-foreground">
              No features found matching your criteria
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
