import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";

const RulesCodex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [classes, setClasses] = useState<any[]>([]);
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
      const [classesData, rulesData, equipmentData, spellsData] = await Promise.all([
        supabase.from("classes").select("*").order("name"),
        supabase.from("rules").select("*").order("category, name"),
        supabase.from("equipment").select("*").order("category, name"),
        supabase.from("spells").select("*").order("element, name")
      ]);

      if (classesData.data) setClasses(classesData.data);
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
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-6">
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="rules">Core Rules</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="spells">Spells</TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <ScrollArea className="h-[600px]">
              <div className="grid gap-4 md:grid-cols-2">
                {filterItems(classes, ['name', 'description']).map((classData: any) => (
                  <Card 
                    key={classData.id} 
                    className="hover:shadow-lg transition-all cursor-pointer hover-scale"
                    onClick={() => navigate(`/codex/class/${classData.name}`)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {classData.name}
                        <span className="text-sm text-muted-foreground">
                          {'♦'.repeat(classData.complexity)}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        Key Stats: {classData.key_stats.join(', ')} | Hit Die: {classData.hit_die}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{classData.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><strong>Starting HP:</strong> {classData.starting_hp}</div>
                        <div><strong>Saves:</strong> {classData.saves.join(', ')}</div>
                        <div><strong>Armor:</strong> {classData.armor || 'None'}</div>
                        <div><strong>Weapons:</strong> {classData.weapons}</div>
                      </div>
                      {classData.starting_gear && (
                        <div className="mt-3">
                          <strong className="text-xs">Starting Gear:</strong>
                          <p className="text-xs text-muted-foreground">{classData.starting_gear.join(', ')}</p>
                        </div>
                      )}
                      <div className="mt-4 text-xs text-primary font-medium">
                        Click to view all features →
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="rules">
            <ScrollArea className="h-[600px]">
              <div className="grid gap-4">
                {Object.entries(
                  filterItems(rules, ['name', 'description', 'category']).reduce((acc, rule) => {
                    if (!acc[rule.category]) acc[rule.category] = [];
                    acc[rule.category].push(rule);
                    return acc;
                  }, {} as Record<string, any[]>)
                 ).map(([category, categoryRules]: [string, any[]]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="capitalize">{category.replace('_', ' ')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {categoryRules.map((rule: any) => (
                          <div key={rule.id} className="pb-3 border-b last:border-0">
                            <h4 className="font-semibold text-sm mb-1">{rule.name}</h4>
                            <p className="text-sm text-muted-foreground">{rule.description}</p>
                            {rule.source_page && (
                              <span className="text-xs text-muted-foreground">Page {rule.source_page}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="equipment">
            <ScrollArea className="h-[600px]">
              <div className="grid gap-4">
                {Object.entries(
                  filterItems(equipment, ['name', 'description', 'category']).reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, any[]>)
                ).map(([category, items]: [string, any[]]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="capitalize">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        {items.map((item: any) => (
                          <div key={item.id} className="flex justify-between items-start p-2 hover:bg-accent rounded">
                            <div>
                              <h4 className="font-semibold text-sm">{item.name}</h4>
                              {item.description && (
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              )}
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              {item.damage && <div>Damage: {item.damage}</div>}
                              {item.defense && <div>Defense: +{item.defense}</div>}
                              {item.cost && <div>Cost: {item.cost}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="spells">
            <ScrollArea className="h-[600px]">
              <div className="grid gap-4">
                {Object.entries(
                  filterItems(spells, ['name', 'description', 'element']).reduce((acc, spell) => {
                    if (!acc[spell.element]) acc[spell.element] = [];
                    acc[spell.element].push(spell);
                    return acc;
                  }, {} as Record<string, any[]>)
                ).map(([element, elementSpells]: [string, any[]]) => (
                  <Card key={element}>
                    <CardHeader>
                      <CardTitle className="capitalize">{element} Spells</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {elementSpells.map((spell: any) => (
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
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RulesCodex;