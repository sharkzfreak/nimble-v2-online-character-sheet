import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, ArrowLeft, BookOpen, Trash2, CheckCircle2, Cloud, CloudOff, Edit3, Eye } from "lucide-react";
import { ClassSelector } from "@/components/ClassSelector";
import { RuleTooltip } from "@/components/RuleTooltip";
import CharacterView from "@/components/CharacterView";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CharacterFormProps {
  characterId?: string;
}

const CharacterForm = ({ characterId }: CharacterFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(!characterId); // New characters start in edit mode
  const [isOwner, setIsOwner] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDataRef = useRef<string>("");
  
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

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track form changes and start auto-save timer
  useEffect(() => {
    const currentData = JSON.stringify(formData);
    const hasChanged = initialDataRef.current !== "" && currentData !== initialDataRef.current;
    setIsDirty(hasChanged);

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new auto-save timer if there are changes and we're editing an existing character
    if (hasChanged && characterId && isOnline) {
      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave();
      }, 10000); // 10 seconds
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData, characterId, isOnline]);

  useEffect(() => {
    if (characterId) {
      fetchCharacter();
    }
  }, [characterId]);

  const fetchCharacter = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", characterId)
        .single();

      if (error) throw error;
      if (data) {
        setFormData(data);
        initialDataRef.current = JSON.stringify(data);
        
        // Check if current user is the owner
        if (user) {
          setIsOwner(data.user_id === user.id);
        }
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

  const handleAutoSave = async () => {
    if (!characterId || !isDirty) return;
    
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const characterData = {
        ...formData,
        user_id: user.id,
      };

      const { error } = await supabase
        .from("characters")
        .update(characterData)
        .eq("id", characterId);

      if (error) throw error;
      
      initialDataRef.current = JSON.stringify(formData);
      setIsDirty(false);
    } catch (error) {
      console.error("Error auto-saving character:", error);
      // Silently fail for auto-save, don't show error toast
    } finally {
      setIsSaving(false);
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
        initialDataRef.current = JSON.stringify(formData);
        setIsDirty(false);
        toast({ 
          title: "Success", 
          description: "Character updated successfully ✅" 
        });
      } else {
        const { error } = await supabase
          .from("characters")
          .insert([characterData]);

        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "Character created successfully ✅" 
        });
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

  const handleNavigateAway = (path: string) => {
    if (isDirty && characterId) {
      setPendingNavigation(path);
      setShowUnsavedDialog(true);
    } else {
      navigate(path);
    }
  };

  const handleSaveAndLeave = async () => {
    if (!characterId) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const characterData = {
        ...formData,
        user_id: user.id,
      };

      const { error } = await supabase
        .from("characters")
        .update(characterData)
        .eq("id", characterId);

      if (error) throw error;
      
      initialDataRef.current = JSON.stringify(formData);
      setIsDirty(false);
      setShowUnsavedDialog(false);
      if (pendingNavigation) {
        navigate(pendingNavigation);
      }
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

  const handleLeaveWithoutSaving = () => {
    setShowUnsavedDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  const handleDelete = async () => {
    if (!characterId) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("characters")
        .delete()
        .eq("id", characterId);

      if (error) throw error;
      
      toast({ 
        title: "Success", 
        description: "Character deleted successfully" 
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting character:", error);
      toast({
        title: "Error",
        description: "Failed to delete character",
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

  const handleToggleMode = () => {
    if (isEditing && isDirty && characterId) {
      // Auto-save when switching from edit to view mode
      handleAutoSave();
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    if (isDirty) {
      // Revert changes
      fetchCharacter();
      setIsDirty(false);
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.05),transparent_50%)]" />
      
      <div className="container mx-auto max-w-4xl relative">
        {/* Save Status Indicator - Only show in edit mode */}
        {isEditing && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg animate-fade-in">
            {!isOnline ? (
              <>
                <CloudOff className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">Offline</span>
              </>
            ) : isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Saving...</span>
              </>
            ) : isDirty ? (
              <>
                <Cloud className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Unsaved changes</span>
              </>
            ) : characterId ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">All changes saved</span>
              </>
            ) : null}
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button onClick={() => handleNavigateAway("/dashboard")} variant="ghost" size="sm" className="hover-scale">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-wrap gap-2">
            {/* Mode Toggle - Only show for existing characters */}
            {characterId && isOwner && (
              <Button
                onClick={handleToggleMode}
                variant={isEditing ? "default" : "outline"}
                size="sm"
                className="hover-scale"
              >
                {isEditing ? (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    View Mode
                  </>
                ) : (
                  <>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Mode
                  </>
                )}
              </Button>
            )}
            
            {/* Delete Button */}
            {characterId && isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="hover-scale">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Character?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{formData.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Confirm Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* View Mode */}
        {!isEditing && characterId && (
          <CharacterView
            formData={formData}
            calculateHealth={calculateHealth}
            calculateDefense={calculateDefense}
            calculateInitiative={calculateInitiative}
            calculateCarryWeight={calculateCarryWeight}
          />
        )}

        {/* Edit Mode */}
        {isEditing && (
          <form onSubmit={handleSubmit} className="animate-fade-in">
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
                  onClick={() => handleNavigateAway("/codex")}
                  size="lg"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Rules Codex
                </Button>
                <Button
                  type="submit"
                  disabled={loading || isSaving}
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
                  onClick={() => handleNavigateAway("/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
        )}

        {/* Unsaved Changes Dialog */}
        <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Unsaved Changes</DialogTitle>
              <DialogDescription>
                You have unsaved changes. Would you like to save before leaving?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowUnsavedDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={handleLeaveWithoutSaving}
              >
                Leave Without Saving
              </Button>
              <Button
                onClick={handleSaveAndLeave}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save & Leave"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CharacterForm;
