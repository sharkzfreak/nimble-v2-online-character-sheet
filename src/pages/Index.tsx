import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Scroll, Sparkles, Sword, Shield, Wand2 } from "lucide-react";
import DiceRoller from "@/components/DiceRoller";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_50%)]" />

      <div className="container mx-auto px-4 py-16 relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Scroll className="w-16 h-16 text-primary animate-pulse" />
            <Sparkles className="w-8 h-8 text-accent animate-bounce" />
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Nimble Adventurer
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The ultimate character management platform for Nimble V2 RPG
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button onClick={() => navigate("/auth")} variant="hero" size="lg">
              <Sword className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button onClick={() => navigate("/auth")} variant="outline" size="lg">
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card p-6 rounded-lg border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Scroll className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Manage Characters</h3>
            </div>
            <p className="text-muted-foreground">
              Create and manage multiple Nimble V2 characters with ease. All your stats, skills, and equipment in one
              place.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-accent" />
              <h3 className="text-xl font-semibold text-foreground">Auto-Calculations</h3>
            </div>
            <p className="text-muted-foreground">
              Health, Defense, Initiative, and Carry Weight are automatically calculated based on your core stats.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Wand2 className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Track Everything</h3>
            </div>
            <p className="text-muted-foreground">
              Skills, traits, equipment, spells, and custom notes - all organized and accessible.
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <DiceRoller />
        </div>
      </div>
    </div>
  );
};

export default Index;
