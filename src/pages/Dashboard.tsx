import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Session } from "@supabase/supabase-js";
import { Plus, LogOut, Scroll, BookOpen, Eye, Pencil, Copy, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  will: number;
  created_at: string;
  portrait_url?: string;
  background?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [confirmName, setConfirmName] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchCharacters();
    }
  }, [user]);

  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      console.error("Error fetching characters:", error);
      toast({
        title: "Error",
        description: "Failed to load characters",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleDeleteClick = (e: React.MouseEvent, character: Character) => {
    e.stopPropagation();
    setCharacterToDelete(character);
    setDeleteDialogOpen(true);
  };

  const handleCopy = async (e: React.MouseEvent, character: Character) => {
    e.stopPropagation();
    try {
      const { id, created_at, ...characterData } = character as any;
      const { data, error } = await supabase
        .from("characters")
        .insert({
          ...characterData,
          name: `${character.name} (Copy)`,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Character copied",
        description: `Created a copy of ${character.name}`,
      });

      fetchCharacters();
    } catch (error) {
      console.error("Error copying character:", error);
      toast({
        title: "Error",
        description: "Failed to copy character",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!characterToDelete || confirmName !== characterToDelete.name) {
      toast({
        title: "Name doesn't match",
        description: "Please enter the exact character name to confirm deletion.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("characters")
        .delete()
        .eq("id", characterToDelete.id);

      if (error) throw error;

      toast({
        title: "Character deleted",
        description: `${characterToDelete.name} has been removed.`,
      });

      setCharacters(characters.filter(c => c.id !== characterToDelete.id));
      setDeleteDialogOpen(false);
      setCharacterToDelete(null);
      setConfirmName("");
    } catch (error) {
      console.error("Error deleting character:", error);
      toast({
        title: "Error",
        description: "Failed to delete character",
        variant: "destructive",
      });
    }
  };

  const calculateHealth = (str: number) => str * 5;
  const calculateDefense = (dex: number, will: number) => Math.floor((dex + will) / 2);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.05),transparent_50%)]" />
      
      <div className="container mx-auto p-6 relative">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
              <Scroll className="w-8 h-8 text-primary" />
              Your Characters
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your Nimble V2 RPG characters
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/codex")} variant="outline" size="sm" className="hover-scale">
              <BookOpen className="mr-2 h-4 w-4" />
              Rules Codex
            </Button>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="hover-scale">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {characters.length === 0 ? (
          <Card className="bg-card border-border shadow-[var(--shadow-card)]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Scroll className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No characters yet</h3>
              <p className="text-muted-foreground mb-6 text-center">
                Start your adventure by creating your first character
              </p>
              <Button onClick={() => navigate("/character/builder")} variant="hero" size="lg" className="hover-scale animate-scale-in">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Character
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <Button onClick={() => navigate("/character/builder")} variant="hero" className="hover-scale">
                <Plus className="mr-2 h-4 w-4" />
                Create New Character
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {characters.map((character) => (
                <Card
                  key={character.id}
                  className="bg-card border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 overflow-hidden animate-fade-in"
                >
                  <div className="flex flex-col">
                    {/* Header with portrait and info */}
                    <div 
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted/50 to-transparent"
                      style={{
                        backgroundImage: character.portrait_url 
                          ? `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${character.portrait_url})`
                          : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border-2 border-border">
                        {character.portrait_url ? (
                          <img 
                            src={character.portrait_url} 
                            alt={character.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                            <span className="text-2xl font-bold text-primary">
                              {character.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-foreground truncate">
                          {character.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Level {character.level || 1} | {character.class || 'Adventurer'} {character.background ? `| ${character.background}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-4 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-none border-r border-border hover:bg-accent/10"
                        onClick={() => navigate(`/character/${character.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs">VIEW</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-none border-r border-border hover:bg-accent/10"
                        onClick={() => navigate(`/character/${character.id}/edit`)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        <span className="text-xs">EDIT</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-none border-r border-border hover:bg-accent/10"
                        onClick={(e) => handleCopy(e, character)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        <span className="text-xs">COPY</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-none hover:bg-destructive/10 text-destructive hover:text-destructive"
                        onClick={(e) => handleDeleteClick(e, character)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span className="text-xs">DELETE</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Character</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Please enter the character's name to confirm deletion.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2 py-4">
              <Label htmlFor="confirm-name">
                Character Name: <span className="font-bold">{characterToDelete?.name}</span>
              </Label>
              <Input
                id="confirm-name"
                placeholder="Enter character name"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setConfirmName("");
                setCharacterToDelete(null);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Dashboard;
