import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, ChevronDown, Crown } from "lucide-react";

const DMSubclasses = () => {
  const navigate = useNavigate();
  const [subclasses, setSubclasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDMSubclasses();
  }, []);

  const fetchDMSubclasses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subclasses")
        .select(`
          *,
          classes (
            name
          )
        `)
        .in("name", ["Beastmaster", "Reaver", "Spellblade", "Oathbreaker"])
        .order("source_page");

      if (error) throw error;
      if (data) setSubclasses(data);
    } catch (error) {
      console.error("Error fetching DM subclasses:", error);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button onClick={() => navigate("/codex")} variant="ghost" size="sm" className="hover-scale">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Codex
          </Button>
        </div>
        
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-8 w-8 text-amber-500" />
            <h1 className="text-4xl font-bold text-foreground">DM-Granted Subclasses</h1>
          </div>
          <p className="text-muted-foreground">
            Special subclasses that can only be granted by the Dungeon Master
          </p>
          <Badge className="mt-2 bg-amber-500/20 text-amber-600 border-amber-500/50">
            Requires DM Approval
          </Badge>
        </div>

        <div className="grid gap-6">
          {subclasses.map((subclass: any) => (
            <Card key={subclass.id} className="overflow-hidden border-2 border-amber-500/30 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 to-transparent border-b border-amber-500/20">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl font-bold italic uppercase tracking-wide">
                        {subclass.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {subclass.classes?.name}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm font-medium">
                      {subclass.description.split(' - ')[0]}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Complexity:</span>
                    <span className="text-amber-500 font-bold text-lg">
                      {'♦'.repeat(subclass.complexity)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <Collapsible>
                  <div className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {subclass.description.split(' - ').slice(1).join(' - ')}
                      </p>
                    </div>
                    
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full" size="sm">
                        <ChevronDown className="h-4 w-4 mr-2" />
                        View Subclass Features
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="space-y-4 pt-4">
                      <div className="bg-accent/30 p-4 rounded-lg border border-border/50">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Crown className="h-4 w-4 text-amber-500" />
                          Special Features
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Detailed subclass features would be displayed here based on the abilities table linked to this subclass.
                        </p>
                      </div>
                      
                      {subclass.source_page && (
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                          <span>Source: Nimble V2 Rulebook</span>
                          <span>Page {subclass.source_page}</span>
                        </div>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-2 border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• These subclasses can only be granted by the Dungeon Master</p>
            <p>• They represent unique story moments or special character developments</p>
            <p>• Each subclass modifies core class features in significant ways</p>
            <p>• Discuss with your DM before considering these options</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DMSubclasses;
