import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Lock, ChevronDown, Search, TrendingUp, Sparkles } from "lucide-react";
import { getClassFeatures } from "@/config/classFeatures";
import { ClassFeature } from "@/config/classFeatures";

interface FeaturesTimelineProps {
  className: string;
  currentLevel: number;
  classFeatures: ClassFeature[];
  onLevelUpClick?: () => void;
}

export const FeaturesTimeline = ({ 
  className, 
  currentLevel, 
  classFeatures,
  onLevelUpClick 
}: FeaturesTimelineProps) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  // Get all features from class config
  const allFeatures = getClassFeatures(className);

  // Filter features
  const filteredFeatures = allFeatures.filter(feature => {
    // Filter by lock status
    if (filter === 'unlocked' && feature.level > currentLevel) return false;
    if (filter === 'locked' && feature.level <= currentLevel) return false;

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
      {/* Filters and Search */}
      <div className="space-y-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Features</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg flex items-center gap-2">
                                {!featureUnlocked && (
                                  <Lock className="w-4 h-4 text-muted-foreground" />
                                )}
                                {feature.name}
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

                          {!featureUnlocked && onLevelUpClick && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={onLevelUpClick}
                              disabled={level > currentLevel + 1}
                            >
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Level Up
                            </Button>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <Collapsible
                          open={isExpanded}
                          onOpenChange={() => toggleExpanded(feature.id)}
                        >
                          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            {isExpanded ? 'Hide' : 'Show'} description
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-2">
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </CollapsibleContent>
                        </Collapsible>

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

                        {!feature.requires_choice && featureUnlocked && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Sparkles className="w-4 h-4" />
                            <span>Active</span>
                          </div>
                        )}
                      </CardContent>
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
