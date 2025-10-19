import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Skull } from "lucide-react";

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
      // Fetch the DM-granted subclasses (Beastmaster, Reaver, Spellblade, Oathbreaker)
      const { data: subclassData, error: subError } = await supabase
        .from("subclasses")
        .select("*, classes(*)")
        .in("name", ["Beastmaster", "Reaver", "Spellblade", "Oathbreaker"])
        .order("source_page", { ascending: false });

      if (subError) throw subError;
      if (subclassData) setSubclasses(subclassData);
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button onClick={() => navigate("/codex")} variant="ghost" size="sm" className="hover-scale">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Codex
          </Button>
        </div>
        
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Skull className="h-8 w-8 text-destructive" />
            <h1 className="text-4xl font-bold text-foreground">DM-Granted Subclasses</h1>
          </div>
          <p className="text-muted-foreground">Special subclasses that can only be granted by the Dungeon Master</p>
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-sm text-destructive font-semibold">
              ⚠️ These subclasses are not available during standard character creation and require special circumstances or DM approval.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {subclasses.map((subclass: any) => (
            <Card 
              key={subclass.id} 
              className="overflow-hidden bg-gradient-to-br from-card via-card/90 to-destructive/10 border-destructive/20 hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <CardHeader className="border-b border-destructive/20">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      {subclass.classes?.name}
                    </div>
                    <CardTitle className="text-2xl font-bold italic uppercase tracking-wide">
                      {subclass.name}
                    </CardTitle>
                  </div>
                  <Skull className="h-6 w-6 text-destructive" />
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {subclass.description}
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Complexity:</span>
                    <span className="text-destructive font-bold">
                      {'♦'.repeat(subclass.complexity)}
                    </span>
                  </div>
                  {subclass.source_page && (
                    <span className="text-xs text-muted-foreground">
                      Page {subclass.source_page}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DMSubclasses;
