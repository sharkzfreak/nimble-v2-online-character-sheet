import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClassData {
  id: string;
  name: string;
  description: string;
  key_stats: string[];
  hit_die: string;
  starting_hp: number;
  saves: string[];
  armor: string;
  weapons: string;
  complexity: number;
  starting_gear: string[];
}

interface ClassSelectorProps {
  selectedClassId: string | null;
  onClassChange: (classId: string, classData: ClassData) => void;
}

export const ClassSelector = ({ selectedClassId, onClassChange }: ClassSelectorProps) => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId && classes.length > 0) {
      const classData = classes.find(c => c.id === selectedClassId);
      if (classData) {
        setSelectedClass(classData);
      }
    }
  }, [selectedClassId, classes]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("name");

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = (classId: string) => {
    const classData = classes.find(c => c.id === classId);
    if (classData) {
      setSelectedClass(classData);
      onClassChange(classId, classData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="class">Class (Archetype)</Label>
        <Select value={selectedClassId || undefined} onValueChange={handleClassSelect}>
          <SelectTrigger id="class" className="bg-input border-border">
            <SelectValue placeholder="Select a class..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border max-h-[400px]">
            {classes.map((classData) => (
              <SelectItem key={classData.id} value={classData.id}>
                {classData.name} {'♦'.repeat(classData.complexity)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedClass && (
        <Card className="bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {selectedClass.name}
              <Badge variant="outline" className="text-xs">
                Complexity: {'♦'.repeat(selectedClass.complexity)}
              </Badge>
            </CardTitle>
            <CardDescription>{selectedClass.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-semibold text-primary">Key Stats:</span>
                <p className="text-muted-foreground">{selectedClass.key_stats.join(', ')}</p>
              </div>
              <div>
                <span className="font-semibold text-primary">Hit Die:</span>
                <p className="text-muted-foreground">{selectedClass.hit_die} (Starting HP: {selectedClass.starting_hp})</p>
              </div>
              <div>
                <span className="font-semibold text-primary">Saves:</span>
                <p className="text-muted-foreground">{selectedClass.saves.join(', ')}</p>
              </div>
              <div>
                <span className="font-semibold text-primary">Armor:</span>
                <p className="text-muted-foreground">{selectedClass.armor || 'None'}</p>
              </div>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-primary">Weapons:</span>
              <p className="text-muted-foreground">{selectedClass.weapons}</p>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-primary">Starting Gear:</span>
              <p className="text-muted-foreground">{selectedClass.starting_gear.join(', ')}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
