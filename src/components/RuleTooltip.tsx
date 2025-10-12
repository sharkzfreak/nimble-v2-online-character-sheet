import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface RuleTooltipProps {
  ruleName: string;
  category?: string;
}

export const RuleTooltip = ({ ruleName, category }: RuleTooltipProps) => {
  const [ruleText, setRuleText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRule();
  }, [ruleName, category]);

  const fetchRule = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("rules")
        .select("description")
        .ilike("name", `%${ruleName}%`);

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query.limit(1).maybeSingle();

      if (error) throw error;
      if (data) {
        setRuleText(data.description);
      } else {
        setRuleText("");
      }
    } catch (error) {
      console.error("Error fetching rule:", error);
      setRuleText("");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !ruleText) return null;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex ml-1">
            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm bg-popover border-border">
          <p className="text-sm">{ruleText || "Loading rule information..."}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
