import React, { createContext, useContext, useState, useEffect } from "react";
import { buildRulesCodex, toCharacterOverlay } from "@/services/rulesCodex";
import { supabase } from "@/integrations/supabase/client";
import type { RulesCodex } from "@/types/codex";
import { useToast } from "@/hooks/use-toast";

interface CodexContextType {
  codex: RulesCodex | null;
  loading: boolean;
  importCharacter: (characterId: string) => Promise<void>;
  refreshCodex: () => Promise<void>;
}

const CodexContext = createContext<CodexContextType | undefined>(undefined);

export function CodexProvider({ children }: { children: React.ReactNode }) {
  const [codex, setCodex] = useState<RulesCodex | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const importCharacter = async (characterId: string) => {
    try {
      setLoading(true);
      
      const { data: characterData, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", characterId)
        .single();

      if (error) throw error;
      if (!characterData) throw new Error("Character not found");

      const newCodex = await buildRulesCodex(characterData);
      setCodex(newCodex);

      // Store globally for legacy access
      (window as any).rulesCodex = newCodex;

      toast({
        title: "Character imported into Rules Codex ✓",
        description: `${characterData.name} is ready to use`,
      });
    } catch (error) {
      console.error("Error importing character:", error);
      toast({
        title: "Import failed",
        description: "Could not load character into codex",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshCodex = async () => {
    if (codex?.character.characterId) {
      await importCharacter(codex.character.characterId);
    }
  };

  return (
    <CodexContext.Provider value={{ codex, loading, importCharacter, refreshCodex }}>
      {children}
    </CodexContext.Provider>
  );
}

export function useCodex() {
  const context = useContext(CodexContext);
  if (context === undefined) {
    throw new Error("useCodex must be used within a CodexProvider");
  }
  return context;
}
