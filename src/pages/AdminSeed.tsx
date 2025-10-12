import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminSeed = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('seed-rulebook');
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: `Seeded: ${data.stats.classes} classes, ${data.stats.rules} rules, ${data.stats.equipment} equipment, ${data.stats.spells} spells`,
      });
    } catch (error: any) {
      console.error('Error seeding data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to seed rulebook data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Seed Rulebook Data</CardTitle>
            <CardDescription>
              Populate the database with Nimble V2 classes, rules, equipment, and spells from the parsed PDFs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSeed} 
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Seeding Data..." : "Seed Rulebook Data"}
            </Button>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2"><strong>This will populate:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>11 Character Classes from Nimble V2</li>
                <li>Core Rules (Stats, Skills, Combat mechanics)</li>
                <li>Equipment (Weapons, Armor, Gear)</li>
                <li>Spells (Fire, Ice, Lightning, Divine, Shadow)</li>
              </ul>
              <p className="mt-4 text-xs opacity-75">
                All data is extracted from the Heroes 2.0 and Core Rules 2.0 PDFs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSeed;