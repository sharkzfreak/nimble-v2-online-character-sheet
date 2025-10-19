import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Wand2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: any;
}

const FANTASY_NAMES = [
  "Aelindor", "Thrain", "Lyra", "Kael", "Zephyr", "Nyx", "Riven", "Elara",
  "Dorian", "Seraphine", "Garrick", "Aurelia", "Bran", "Isolde", "Fenris",
  "Morgana", "Calder", "Sylvara", "Tormund", "Valeria"
];

export const BuilderStep1Identity = ({ formData, setFormData }: BuilderStepProps) => {
  const [uploadingPortrait, setUploadingPortrait] = useState(false);
  const [generatingPortrait, setGeneratingPortrait] = useState(false);
  const [ancestries, setAncestries] = useState<any[]>([]);

  useEffect(() => {
    fetchAncestries();
  }, []);

  const fetchAncestries = async () => {
    const { data } = await supabase
      .from("ancestries")
      .select("*")
      .order("type, name");
    if (data) setAncestries(data);
  };

  const generateRandomName = () => {
    const name = FANTASY_NAMES[Math.floor(Math.random() * FANTASY_NAMES.length)];
    setFormData({ ...formData, name });
  };

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPortrait(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('character-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('character-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, portrait_url: data.publicUrl });
      toast({ title: "Portrait uploaded", description: "Your character portrait has been set" });
    } catch (error) {
      console.error("Error uploading portrait:", error);
      toast({ title: "Upload failed", description: "Failed to upload portrait", variant: "destructive" });
    } finally {
      setUploadingPortrait(false);
    }
  };

  const generateAIPortrait = async () => {
    if (!formData.name) {
      toast({ title: "Name required", description: "Please enter a character name first", variant: "destructive" });
      return;
    }

    setGeneratingPortrait(true);
    try {
      const prompt = `Fantasy RPG character portrait: ${formData.name}${formData.race ? `, ${formData.race}` : ""}${formData.class ? `, ${formData.class}` : ""}. High quality, detailed, digital art style.`;
      
      const { data, error } = await supabase.functions.invoke('generate-character-portrait', {
        body: { prompt }
      });

      if (error) throw error;
      if (data?.imageUrl) {
        setFormData({ ...formData, portrait_url: data.imageUrl });
        toast({ title: "Portrait generated!", description: "AI has created your character portrait" });
      }
    } catch (error) {
      console.error("Error generating portrait:", error);
      toast({ title: "Generation failed", description: "Failed to generate AI portrait", variant: "destructive" });
    } finally {
      setGeneratingPortrait(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Who are you?
        </h2>
        <p className="text-muted-foreground">
          Let's start with the basics of your character
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Name and background details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Character Name *</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter character name"
                required
              />
              <Button type="button" variant="outline" onClick={generateRandomName}>
                Random
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                type="number"
                min={1}
                max={20}
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign">Campaign</Label>
              <Input
                id="campaign"
                value={formData.campaign}
                onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="race">Race / Ancestry</Label>
            <Select value={formData.race} onValueChange={(value) => setFormData({ ...formData, race: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select ancestry" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {ancestries.map((ancestry) => (
                  <SelectItem key={ancestry.id} value={ancestry.name}>
                    {ancestry.name} ({ancestry.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="background">Background</Label>
            <Input
              id="background"
              value={formData.background}
              onChange={(e) => setFormData({ ...formData, background: e.target.value })}
              placeholder="e.g., Soldier, Scholar, Merchant"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portrait</CardTitle>
          <CardDescription>Upload or generate your character's portrait</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.portrait_url && (
            <div className="aspect-square w-48 mx-auto rounded-lg overflow-hidden border-2 border-primary">
              <img src={formData.portrait_url} alt="Character portrait" className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="flex gap-2">
            <label className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={uploadingPortrait}
                asChild
              >
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadingPortrait ? "Uploading..." : "Upload Image"}
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePortraitUpload}
              />
            </label>
            
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={generateAIPortrait}
              disabled={generatingPortrait || !formData.name}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {generatingPortrait ? "Generating..." : "AI Generate"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
