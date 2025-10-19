import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { CLASS_FEATURES } from "@/config/classFeatures";
import { BERSERKER_SUBCLASS_FEATURES, CHEAT_SUBCLASS_FEATURES, COMMANDER_SUBCLASS_FEATURES, HUNTER_SUBCLASS_FEATURES } from "@/config/subclassFeatures";
import { Loader2, ArrowLeft, Sparkles, ChevronDown } from "lucide-react";

const ClassDetail = () => {
  const { className } = useParams<{ className: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<any>(null);
  const [abilities, setAbilities] = useState<any[]>([]);
  const [spells, setSpells] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchClassData();
  }, [className]);

  const fetchClassData = async () => {
    setLoading(true);
    try {
      // Fetch class info
      const { data: classInfo } = await supabase
        .from("classes")
        .select("*")
        .eq("name", className)
        .single();

      if (classInfo) {
        setClassData(classInfo);

        // Fetch class abilities
        const { data: classAbilities } = await supabase
          .from("abilities")
          .select("*")
          .eq("class_id", classInfo.id)
          .order("level_requirement");

        if (classAbilities) {
          setAbilities(classAbilities);
        }

        // Fetch spells if applicable
        const { data: classSpells } = await supabase
          .from("spells")
          .select("*");

        if (classSpells) {
          setSpells(classSpells);
        }
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getClassFeatures = () => {
    if (!className) return [];
    return CLASS_FEATURES[className] || [];
  };

  const groupFeaturesByLevel = () => {
    const features = getClassFeatures();
    const grouped: Record<number, any[]> = {};

    features.forEach((feature) => {
      if (!grouped[feature.level]) {
        grouped[feature.level] = [];
      }
      grouped[feature.level].push(feature);
    });

    abilities.forEach((ability) => {
      const level = ability.level_requirement || 1;
      if (!grouped[level]) {
        grouped[level] = [];
      }
      grouped[level].push({
        ...ability,
        isAbility: true,
      });
    });

    return grouped;
  };

  const getSubclassFeaturesByLevel = () => {
    const grouped: Record<number, Record<string, any[]>> = {};

    if (className === 'Berserker') {
      BERSERKER_SUBCLASS_FEATURES.forEach(subclassFeature => {
        const level = subclassFeature.level;
        if (!grouped[level]) {
          grouped[level] = {};
        }
        if (!grouped[level][subclassFeature.subclassName]) {
          grouped[level][subclassFeature.subclassName] = [];
        }
        grouped[level][subclassFeature.subclassName].push({
          ...subclassFeature,
          isSubclass: true,
        });
      });
    }

    if (className === 'Cheat') {
      CHEAT_SUBCLASS_FEATURES.forEach(subclassFeature => {
        const level = subclassFeature.level;
        if (!grouped[level]) {
          grouped[level] = {};
        }
        if (!grouped[level][subclassFeature.subclassName]) {
          grouped[level][subclassFeature.subclassName] = [];
        }
        grouped[level][subclassFeature.subclassName].push({
          ...subclassFeature,
          isSubclass: true,
        });
      });
    }

    if (className === 'Commander') {
      COMMANDER_SUBCLASS_FEATURES.forEach(subclassFeature => {
        const level = subclassFeature.level;
        if (!grouped[level]) {
          grouped[level] = {};
        }
        if (!grouped[level][subclassFeature.subclassName]) {
          grouped[level][subclassFeature.subclassName] = [];
        }
        grouped[level][subclassFeature.subclassName].push({
          ...subclassFeature,
          isSubclass: true,
        });
      });
    }

    if (className === 'Hunter') {
      HUNTER_SUBCLASS_FEATURES.forEach(subclassFeature => {
        const level = subclassFeature.level;
        if (!grouped[level]) {
          grouped[level] = {};
        }
        if (!grouped[level][subclassFeature.subclassName]) {
          grouped[level][subclassFeature.subclassName] = [];
        }
        grouped[level][subclassFeature.subclassName].push({
          ...subclassFeature,
          isSubclass: true,
        });
      });
    }

    return grouped;
  };

  const toggleFeature = (featureId: string) => {
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Class not found</h2>
          <Button onClick={() => navigate("/codex")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Codex
          </Button>
        </div>
      </div>
    );
  }

  const featuresByLevel = groupFeaturesByLevel();
  const subclassFeaturesByLevel = getSubclassFeaturesByLevel();
  const maxLevel = Math.max(...Object.keys(featuresByLevel).map(Number), 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button onClick={() => navigate("/codex")} variant="ghost" size="sm" className="hover-scale">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Codex
          </Button>
        </div>

        {/* Class Header */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-4xl mb-2">{classData.name}</CardTitle>
                <CardDescription className="text-lg">
                  {classData.description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {'♦'.repeat(classData.complexity)} Complexity
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <strong>Hit Die:</strong> {classData.hit_die}
              </div>
              <div>
                <strong>Starting HP:</strong> {classData.starting_hp}
              </div>
              <div>
                <strong>Key Stats:</strong> {classData.key_stats.join(', ')}
              </div>
              <div>
                <strong>Saves:</strong> {classData.saves.join(', ')}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Armor:</strong> {classData.armor || 'None'}
              </div>
              <div>
                <strong>Weapons:</strong> {classData.weapons}
              </div>
            </div>
            {classData.starting_gear && (
              <>
                <Separator className="my-4" />
                <div className="text-sm">
                  <strong>Starting Gear:</strong>
                  <p className="text-muted-foreground mt-1">{classData.starting_gear.join(', ')}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Features by Level */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Class Features & Abilities
          </h2>
          
          <div className="space-y-6">
            {Array.from({ length: maxLevel }, (_, i) => i + 1).map((level) => {
                const levelFeatures = featuresByLevel[level] || [];
                
                if (levelFeatures.length === 0) return null;

                return (
                  <Card key={level} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="default" className="text-lg px-3 py-1">
                          Level {level}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {levelFeatures.map((feature, idx) => {
                          const featureKey = `${feature.id || idx}-${level}`;
                          const isExpanded = expandedFeatures.has(featureKey);
                          
                          return (
                            <Collapsible
                              key={featureKey}
                              open={isExpanded}
                              onOpenChange={() => toggleFeature(featureKey)}
                            >
                              <div className={`${idx !== 0 ? 'border-t' : ''}`}>
                                <CollapsibleTrigger className="w-full py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                  <div className="flex items-center gap-3 flex-1">
                                    <h4 className="font-bold text-lg">{feature.name}</h4>
                                    <Badge variant="outline" className="shrink-0">
                                      Level {feature.level}
                                    </Badge>
                                    {feature.isAbility && (
                                      <Badge variant="secondary" className="shrink-0">Ability</Badge>
                                    )}
                                    {feature.requires_choice && (
                                      <Badge variant="outline" className="shrink-0">Choice Required</Badge>
                                    )}
                                  </div>
                                  <ChevronDown 
                                    className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ml-2 ${
                                      isExpanded ? 'rotate-180' : ''
                                    }`}
                                  />
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent>
                                  <div className="pb-3 pl-4">
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-3">
                                      {feature.description || feature.text}
                                    </p>
                                    
                                    {feature.options && feature.options.length > 0 && (
                                      <div className="mt-3 pl-4 border-l-2 border-primary/30">
                                        <p className="text-xs font-semibold mb-2">Options:</p>
                                        <div className="space-y-2">
                                          {feature.options.map((option: any) => (
                                            <div key={option.id} className="text-sm">
                                              <strong>{option.name}:</strong>{" "}
                                              <span className="text-muted-foreground">
                                                {option.description}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {feature.category && (
                                      <div className="mt-2">
                                        <Badge variant="outline" className="text-xs">
                                          {feature.category}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          );
                        })}

                        {/* Render subclass features grouped by subclass */}
                        {subclassFeaturesByLevel[level] && Object.entries(subclassFeaturesByLevel[level]).map(([subclassName, subclassFeatures], subclassIdx) => {
                          const subclassKey = `subclass-${subclassName}-${level}`;
                          const isSubclassExpanded = expandedFeatures.has(subclassKey);
                          
                          return (
                            <Collapsible
                              key={subclassKey}
                              open={isSubclassExpanded}
                              onOpenChange={() => toggleFeature(subclassKey)}
                            >
                              <div className={`${levelFeatures.length > 0 || subclassIdx > 0 ? 'border-t' : ''}`}>
                                <CollapsibleTrigger className="w-full py-3 flex items-center justify-between hover:bg-muted/30 transition-colors bg-primary/5">
                                  <div className="flex items-center gap-3 flex-1">
                                    <h4 className="font-bold text-lg">{subclassName}</h4>
                                    <Badge variant="secondary" className="shrink-0">Subclass</Badge>
                                  </div>
                                  <ChevronDown 
                                    className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ml-2 ${
                                      isSubclassExpanded ? 'rotate-180' : ''
                                    }`}
                                  />
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent>
                                  <div className="pl-6 space-y-3 pb-3">
                                    {subclassFeatures.map((feature: any, featureIdx: number) => {
                                      const nestedFeatureKey = `${feature.id || featureIdx}-${subclassName}-${level}`;
                                      const isNestedExpanded = expandedFeatures.has(nestedFeatureKey);
                                      
                                      return (
                                        <Collapsible
                                          key={nestedFeatureKey}
                                          open={isNestedExpanded}
                                          onOpenChange={() => toggleFeature(nestedFeatureKey)}
                                        >
                                          <div className={`${featureIdx !== 0 ? 'border-t border-muted' : ''}`}>
                                            <CollapsibleTrigger className="w-full py-2 flex items-center justify-between hover:bg-muted/20 transition-colors">
                                              <div className="flex items-center gap-2 flex-1">
                                                <h5 className="font-semibold text-base">{feature.name}</h5>
                                                {feature.requires_choice && (
                                                  <Badge variant="outline" className="text-xs shrink-0">Choice Required</Badge>
                                                )}
                                              </div>
                                              <ChevronDown 
                                                className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ml-2 ${
                                                  isNestedExpanded ? 'rotate-180' : ''
                                                }`}
                                              />
                                            </CollapsibleTrigger>
                                            
                                            <CollapsibleContent>
                                              <div className="pb-2 pl-4">
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                  {feature.description || feature.text}
                                                </p>
                                                
                                                {feature.options && feature.options.length > 0 && (
                                                  <div className="mt-2 pl-3 border-l-2 border-primary/20">
                                                    <p className="text-xs font-semibold mb-1">Options:</p>
                                                    <div className="space-y-1">
                                                      {feature.options.map((option: any) => (
                                                        <div key={option.id} className="text-sm">
                                                          <strong>{option.name}:</strong>{" "}
                                                          <span className="text-muted-foreground">
                                                            {option.description}
                                                          </span>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}

                                                {feature.category && (
                                                  <div className="mt-2">
                                                    <Badge variant="outline" className="text-xs">
                                                      {feature.category}
                                                    </Badge>
                                                  </div>
                                                )}
                                              </div>
                                            </CollapsibleContent>
                                          </div>
                                        </Collapsible>
                                      );
                                    })}
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClassDetail;
