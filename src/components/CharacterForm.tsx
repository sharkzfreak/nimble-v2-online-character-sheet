import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, ArrowLeft, BookOpen } from "lucide-react";
import { ClassSelector } from "@/components/ClassSelector";
import { RuleTooltip } from "@/components/RuleTooltip";

interface CharacterFormProps {
  characterId?: string;
}

const CharacterForm = ({ characterId }: CharacterFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    player: "",
    campaign: "",
    description: "",
    level: 1,
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    will: 10,
    skill_arcana: 0,
    skill_examination: 0,
    skill_finesse: 0,
    skill_influence: 0,
    skill_insight: 0,
    skill_might: 0,
    skill_lore: 0,
    skill_naturecraft: 0,
    skill_perception: 0,
    skill_stealth: 0,
    background: "",
    race: "",
    class: "",
    class_id: null as string | null,
    subclass_id: null as string | null,
    abilities: "",
    spells: "",
    powers: "",
    notes: "",
  });

  const handleClassChange = (classId: string, classData: any) => {
    setFormData({
      ...formData,
      class_id: classId,
      class: classData.name,
    });
  };

  useEffect(() => {
    if (characterId) {
      fetchCharacter();
    }
  }, [characterId]);

  const fetchCharacter = async () => {
    try {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", characterId)
        .single();

      if (error) throw error;
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error("Error fetching character:", error);
      toast({
        title: "Error",
        description: "Failed to load character",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const characterData = {
        ...formData,
        user_id: user.id,
      };

      if (characterId) {
        const { error } = await supabase
          .from("characters")
          .update(characterData)
          .eq("id", characterId);

        if (error) throw error;
        toast({ title: "Success", description: "Character updated!" });
      } else {
        const { error } = await supabase
          .from("characters")
          .insert([characterData]);

        if (error) throw error;
        toast({ title: "Success", description: "Character created!" });
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving character:", error);
      toast({
        title: "Error",
        description: "Failed to save character",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateHealth = () => formData.strength * 5;
  const calculateDefense = () => Math.floor((formData.dexterity + formData.will) / 2);
  const calculateInitiative = () => formData.dexterity;
  const calculateCarryWeight = () => formData.strength * 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.05),transparent_50%)]" />
      
      <div className="container mx-auto max-w-4xl relative">
        <div className="mb-6">
          <Button onClick={() => navigate("/dashboard")} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-card border-border shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {characterId ? "Edit Character" : "Create Character"}
              </CardTitle>
              <CardDescription>
                Fill in your character details for Nimble V2 RPG
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="stats">Stats & Skills</TabsTrigger>
                  <TabsTrigger value="traits">Traits</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Character Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="player">Player Name</Label>
                      <Input
                        id="player"
                        value={formData.player}
                        onChange={(e) => setFormData({ ...formData, player: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign">Campaign</Label>
                    <Input
                      id="campaign"
                      value={formData.campaign}
                      onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="bg-input border-border"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary flex items-center">
                      Core Stats
                      <RuleTooltip ruleName="Core Stats" category="character_creation" />
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["strength", "dexterity", "intelligence", "will"].map((stat) => (
                        <div key={stat} className="space-y-2">
                          <Label htmlFor={stat} className="capitalize">{stat}</Label>
                          <Input
                            id={stat}
                            type="number"
                            value={formData[stat as keyof typeof formData]}
                            onChange={(e) => setFormData({ ...formData, [stat]: parseInt(e.target.value) || 0 })}
                            className="bg-input border-border"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--stat-card-bg)] p-4 rounded border border-[var(--stat-card-border)]">
                    <h3 className="text-lg font-semibold mb-4 text-accent">Derived Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          Health
                          <RuleTooltip ruleName="Health Points" category="combat" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">{calculateHealth()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          Defense
                          <RuleTooltip ruleName="Defense" category="combat" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">{calculateDefense()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          Initiative
                          <RuleTooltip ruleName="Initiative" category="combat" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">{calculateInitiative()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          Carry Weight
                          <RuleTooltip ruleName="Carry Weight" category="equipment" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">{calculateCarryWeight()}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary flex items-center">
                      Skills
                      <RuleTooltip ruleName="Skills" category="character_creation" />
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        "arcana", "examination", "finesse", "influence", "insight",
                        "might", "lore", "naturecraft", "perception", "stealth"
                      ].map((skill) => (
                        <div key={skill} className="space-y-2">
                          <Label htmlFor={`skill_${skill}`} className="capitalize">{skill}</Label>
                          <Input
                            id={`skill_${skill}`}
                            type="number"
                            value={formData[`skill_${skill}` as keyof typeof formData]}
                            onChange={(e) => setFormData({ ...formData, [`skill_${skill}`]: parseInt(e.target.value) || 0 })}
                            className="bg-input border-border"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="traits" className="space-y-4">
                  <div className="mb-4">
                    <ClassSelector
                      selectedClassId={formData.class_id}
                      onClassChange={handleClassChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="race">Ancestry</Label>
                      <Input
                        id="race"
                        value={formData.race}
                        onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                        className="bg-input border-border"
                        placeholder="e.g., Human, Elf, Dwarf"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Input
                        id="level"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="background">Background</Label>
                    <Textarea
                      id="background"
                      value={formData.background}
                      onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                      rows={3}
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="abilities">Abilities</Label>
                    <Textarea
                      id="abilities"
                      value={formData.abilities}
                      onChange={(e) => setFormData({ ...formData, abilities: e.target.value })}
                      rows={4}
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spells">Spells</Label>
                    <Textarea
                      id="spells"
                      value={formData.spells}
                      onChange={(e) => setFormData({ ...formData, spells: e.target.value })}
                      rows={4}
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="powers">Powers</Label>
                    <Textarea
                      id="powers"
                      value={formData.powers}
                      onChange={(e) => setFormData({ ...formData, powers: e.target.value })}
                      rows={4}
                      className="bg-input border-border"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={12}
                      placeholder="Add any additional notes about your character here..."
                      className="bg-input border-border"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/codex")}
                  size="lg"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Rules Codex
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="hero"
                  size="lg"
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {characterId ? "Update Character" : "Create Character"}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default CharacterForm;
