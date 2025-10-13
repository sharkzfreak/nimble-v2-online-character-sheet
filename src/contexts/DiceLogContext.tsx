import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DiceLogEntry {
  id: string;
  character_id?: string | null;
  character_name: string;
  formula: string;
  raw_result: number;
  modifier: number;
  total: number;
  roll_type: string;
  created_at: string;
}

interface DiceLogContextType {
  logs: DiceLogEntry[];
  addLog: (entry: Omit<DiceLogEntry, "id" | "created_at">) => Promise<void>;
  clearLogs: () => Promise<void>;
  isLoading: boolean;
}

const DiceLogContext = createContext<DiceLogContextType | undefined>(undefined);

export function DiceLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<DiceLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch recent logs on mount
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("dice_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching dice logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addLog = async (entry: Omit<DiceLogEntry, "id" | "created_at">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("dice_logs")
        .insert({
          user_id: user.id,
          ...entry,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setLogs(prev => [data, ...prev].slice(0, 50)); // Keep only recent 50
      }
    } catch (error) {
      console.error("Error adding dice log:", error);
      toast({
        title: "Error",
        description: "Failed to log dice roll",
        variant: "destructive",
      });
    }
  };

  const clearLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("dice_logs")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
      setLogs([]);
      
      toast({
        title: "Dice log cleared",
        description: "All dice rolls have been cleared",
      });
    } catch (error) {
      console.error("Error clearing dice logs:", error);
      toast({
        title: "Error",
        description: "Failed to clear dice log",
        variant: "destructive",
      });
    }
  };

  return (
    <DiceLogContext.Provider value={{ logs, addLog, clearLogs, isLoading }}>
      {children}
    </DiceLogContext.Provider>
  );
}

export function useDiceLog() {
  const context = useContext(DiceLogContext);
  if (context === undefined) {
    throw new Error("useDiceLog must be used within a DiceLogProvider");
  }
  return context;
}
