import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Sparkles, ChevronDown, Skull } from "lucide-react";

// Import class images
import berserkerImg from "@/assets/class-berserker.jpg";
import cheatImg from "@/assets/class-cheat.jpg";
import commanderImg from "@/assets/class-commander.jpg";
import hexbinderImg from "@/assets/class-hexbinder.jpg";
import hunterImg from "@/assets/class-hunter.jpg";
import mageImg from "@/assets/class-mage.jpg";
import oathswornImg from "@/assets/class-oathsworn.jpg";
import shadowmancerImg from "@/assets/class-shadowmancer.jpg";
import shepherdImg from "@/assets/class-shepherd.jpg";
import songweaverImg from "@/assets/class-songweaver.jpg";
import stormshifterImg from "@/assets/class-stormshifter.jpg";
import zephyrImg from "@/assets/class-zephyr.jpg";

const CLASS_IMAGES: Record<string, string> = {
  "Berserker": berserkerImg,
  "Cheat": cheatImg,
  "Commander": commanderImg,
  "Hexbinder": hexbinderImg,
  "Hunter": hunterImg,
  "Mage": mageImg,
  "Oathsworn": oathswornImg,
  "Shadowmancer": shadowmancerImg,
  "Shepherd": shepherdImg,
  "Songweaver": songweaverImg,
  "Stormshifter": stormshifterImg,
  "Zephyr": zephyrImg,
};

// Custom/homebrew classes that should be marked
const CUSTOM_CLASSES = ["Hexbinder"];

const RulesCodex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [classes, setClasses] = useState<any[]>([]);
  const [ancestries, setAncestries] = useState<any[]>([]);
  const [backgrounds, setBackgrounds] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [spells, setSpells] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [classesData, ancestriesData, backgroundsData, rulesData, equipmentData, spellsData] = await Promise.all([
        supabase.from("classes").select("*").order("name"),
        supabase.from("ancestries").select("*").order("type, name"),
        supabase.from("backgrounds").select("*").order("name"),
        supabase.from("rules").select("*").order("category, name"),
        supabase.from("equipment").select("*").order("category, name"),
        supabase.from("spells").select("*").order("element, name")
      ]);

      if (classesData.data) setClasses(classesData.data);
      if (ancestriesData.data) setAncestries(ancestriesData.data);
      if (backgroundsData.data) setBackgrounds(backgroundsData.data);
      if (rulesData.data) setRules(rulesData.data);
      if (equipmentData.data) setEquipment(equipmentData.data);
      if (spellsData.data) setSpells(spellsData.data);
    } catch (error) {
      console.error("Error fetching codex data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = (items: any[], searchFields: string[]) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      searchFields.some(field =>
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button onClick={() => navigate("/dashboard")} variant="ghost" size="sm" className="hover-scale">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Nimble V2 Rules Codex</h1>
          <p className="text-muted-foreground">Comprehensive rulebook reference for Nimble V2</p>
        </div>

        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search rules, classes, equipment, spells..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full grid-cols-6 max-w-4xl mb-6">
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="ancestries">Ancestries</TabsTrigger>
            <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
            <TabsTrigger value="rules">Core Rules</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="spells">Spells</TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <div className="grid gap-6 md:grid-cols-2">
              {filterItems(classes, ['name', 'description']).map((classData: any) => (
                <Card 
                  key={classData.id} 
                  className="hover:shadow-xl transition-all cursor-pointer group overflow-hidden bg-gradient-to-r from-card to-card/50"
                  onClick={() => navigate(`/codex/class/${classData.name}`)}
                >
                  <div className="flex">
                    {/* Class Image */}
                    <div className="w-48 h-48 flex-shrink-0 overflow-hidden relative">
                      <img 
                        src={CLASS_IMAGES[classData.name] || berserkerImg}
                        alt={classData.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/30" />
                    </div>
                    
                    {/* Class Info */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-2xl font-bold italic uppercase tracking-wide">
                            {classData.name}
                          </h3>
                          {CUSTOM_CLASSES.includes(classData.name) && (
                            <Badge className="bg-amber-500/90 text-amber-950 border-amber-600 ml-2">
                              <Sparkles className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                          {classData.description}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">Class Complexity:</span>
                          <span className="text-primary font-bold">
                            {'♦'.repeat(classData.complexity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* DM-Granted Subclasses Card */}
            <Card 
              className="mt-8 hover:shadow-xl transition-all cursor-pointer group overflow-hidden bg-gradient-to-r from-destructive/10 via-card to-destructive/10 border-destructive/30"
              onClick={() => navigate('/codex/dm-subclasses')}
            >
              <CardHeader className="text-center border-b border-destructive/20">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Skull className="h-6 w-6 text-destructive group-hover:animate-pulse" />
                  <CardTitle className="text-2xl font-bold uppercase tracking-wider">
                    DM-Granted Subclasses
                  </CardTitle>
                  <Skull className="h-6 w-6 text-destructive group-hover:animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Special subclasses that require DM approval
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-8 text-center">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">Beastmaster</h4>
                    <p className="text-xs text-muted-foreground">Hunter • Page 81</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">Reaver</h4>
                    <p className="text-xs text-muted-foreground">Shadowmancer • Page 79</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">Spellblade</h4>
                    <p className="text-xs text-muted-foreground">Commander • Page 77</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">Oathbreaker</h4>
                    <p className="text-xs text-muted-foreground">Oathsworn • Page 75</p>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-destructive font-semibold">
                  Click to view details →
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backgrounds">
            <div className="grid md:grid-cols-2 gap-6">
              {filterItems(backgrounds, ['name', 'description']).map((background: any) => (
                <Card key={background.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{background.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{background.description}</p>
                    
                    {background.skill_bonus && (
                      <div className="bg-accent/50 p-3 rounded">
                        <h5 className="font-semibold text-sm mb-1">Skill Bonus</h5>
                        <p className="text-xs text-muted-foreground">{background.skill_bonus}</p>
                      </div>
                    )}
                    
                    {background.starting_equipment && background.starting_equipment.length > 0 && (
                      <div className="bg-accent/50 p-3 rounded">
                        <h5 className="font-semibold text-sm mb-1">Starting Equipment</h5>
                        <ul className="text-xs text-muted-foreground list-disc list-inside">
                          {background.starting_equipment.map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {background.source_page && (
                      <span className="text-xs text-muted-foreground">Page {background.source_page}</span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rules">
            <div className="grid gap-4">
              {Object.entries(
                filterItems(rules, ['name', 'description', 'category']).reduce((acc, rule) => {
                  if (!acc[rule.category]) acc[rule.category] = [];
                  acc[rule.category].push(rule);
                  return acc;
                }, {} as Record<string, any[]>)
                ).map(([category, categoryRules]: [string, any[]]) => (
                <Collapsible key={category} defaultOpen>
                  <Card>
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="capitalize">{category.replace('_', ' ')}</CardTitle>
                        <ChevronDown className="h-5 w-5 transition-transform ui-open:rotate-180" />
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-2">
                          {categoryRules.map((rule: any) => (
                            <Collapsible key={rule.id}>
                              <CollapsibleTrigger className="w-full flex items-center justify-between p-3 hover:bg-accent rounded transition-colors">
                                <h4 className="font-semibold text-sm">{rule.name}</h4>
                                <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="px-3 pb-3">
                                <p className="text-sm text-muted-foreground whitespace-pre-line">{rule.description}</p>
                                {rule.source_page && (
                                  <span className="text-xs text-muted-foreground mt-2 block">Page {rule.source_page}</span>
                                )}
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="equipment">
            <div className="space-y-8">
              {/* Weapons Section */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Weapons</h3>
                {Object.entries(
                  filterItems(equipment.filter((e: any) => e.category === 'Weapons'), ['name', 'type']).reduce((acc: any, item: any) => {
                    if (!acc[item.type]) acc[item.type] = [];
                    acc[item.type].push(item);
                    return acc;
                  }, {})
                ).map(([type, items]: [string, any]) => (
                  <Card key={type} className="mb-6">
                    <CardHeader>
                      <CardTitle>{type} Weapons</CardTitle>
                    </CardHeader>
                     <CardContent>
                       <div className="overflow-x-auto">
                         <table className="w-full text-sm">
                           <thead>
                             <tr className="border-b border-border/50">
                               <th className="text-left py-2 px-3 font-semibold uppercase tracking-wide">Item</th>
                               <th className="text-left py-2 px-3 font-semibold uppercase tracking-wide">Damage</th>
                               <th className="text-left py-2 px-3 font-semibold uppercase tracking-wide">Properties</th>
                               <th className="text-left py-2 px-3 font-semibold uppercase tracking-wide">Cost</th>
                             </tr>
                           </thead>
                           <tbody>
                             {items.map((item: any) => (
                               <tr key={item.id} className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-colors">
                                 <td className="py-2 px-3">{item.name}</td>
                                 <td className="py-2 px-3 text-muted-foreground">{item.damage}</td>
                                 <td className="py-2 px-3 text-muted-foreground">{item.properties?.properties || '—'}</td>
                                 <td className="py-2 px-3 text-muted-foreground">{item.cost}</td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     </CardContent>
                  </Card>
                ))}
              </div>

              {/* Armor Section */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Armor</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(
                    filterItems(equipment.filter((e: any) => e.category === 'Armor'), ['name', 'type']).reduce((acc: any, item: any) => {
                      if (!acc[item.type]) acc[item.type] = [];
                      acc[item.type].push(item);
                      return acc;
                    }, {})
                  ).map(([type, items]: [string, any]) => (
                    <Card key={type}>
                      <CardHeader>
                        <CardTitle>{type}</CardTitle>
                      </CardHeader>
                     <CardContent>
                       <div className="overflow-x-auto">
                         <table className="w-full text-sm">
                           <thead>
                             <tr className="border-b border-border/50">
                               <th className="text-left py-2 px-3 font-semibold uppercase tracking-wide">Item</th>
                               <th className="text-left py-2 px-3 font-semibold uppercase tracking-wide">Armor</th>
                               <th className="text-left py-2 px-3 font-semibold uppercase tracking-wide">Cost</th>
                             </tr>
                           </thead>
                           <tbody>
                             {items.map((item: any) => (
                               <tr key={item.id} className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-colors">
                                 <td className="py-2 px-3">{item.name}</td>
                                 <td className="py-2 px-3 text-muted-foreground">
                                   {item.defense}
                                   {item.properties?.armor_bonus ? ` ${item.properties.armor_bonus}` : ''}
                                 </td>
                                 <td className="py-2 px-3 text-muted-foreground">{item.cost}</td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Gear Section */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Gear</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left py-2 px-3 font-semibold uppercase tracking-wide">Item</th>
                            <th className="text-left py-2 px-3 font-semibold uppercase tracking-wide">Properties</th>
                            <th className="text-left py-2 px-3 font-semibold uppercase tracking-wide">Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filterItems(equipment.filter((e: any) => e.category === 'Gear'), ['name', 'description']).map((item: any) => (
                            <tr key={item.id} className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-colors">
                              <td className="py-2 px-3">{item.name}</td>
                              <td className="py-2 px-3 text-muted-foreground">
                                {item.properties && typeof item.properties === 'object' && 'notes' in item.properties
                                  ? (item.properties.notes as string[]).join(', ')
                                  : item.properties && typeof item.properties === 'object' && 'effects' in item.properties
                                  ? (item.properties.effects as string[]).join(', ')
                                  : item.description || '—'}
                              </td>
                              <td className="py-2 px-3 text-muted-foreground">{item.cost || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spells">
            <div className="grid gap-4">
              {Object.entries(
                filterItems(spells, ['name', 'description', 'element']).reduce((acc, spell) => {
                  if (!acc[spell.element]) acc[spell.element] = [];
                  acc[spell.element].push(spell);
                  return acc;
                }, {} as Record<string, any[]>)
              ).map(([element, elementSpells]: [string, any[]]) => {
                // Sort spells by tier within each element
                const sortedSpells = [...elementSpells].sort((a, b) => {
                  const getTier = (name: string) => {
                    if (name.includes('Cantrip')) return 0;
                    const match = name.match(/Tier (\d+)/);
                    return match ? parseInt(match[1]) : 0;
                  };
                  return getTier(a.name) - getTier(b.name);
                });
                
                return (
                  <Card key={element}>
                    <CardHeader>
                      <CardTitle className="capitalize">{element} Spells</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {sortedSpells.map((spell: any) => (
                          <div key={spell.id} className="pb-3 border-b last:border-0">
                            <h4 className="font-semibold text-sm mb-1">{spell.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{spell.description}</p>
                            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                              {spell.damage && <div><strong>Damage:</strong> {spell.damage}</div>}
                              {spell.range_value && <div><strong>Range:</strong> {spell.range_value}</div>}
                              {spell.duration && <div><strong>Duration:</strong> {spell.duration}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RulesCodex;