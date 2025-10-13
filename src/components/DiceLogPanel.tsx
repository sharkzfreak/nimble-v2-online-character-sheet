import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dices, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useDiceLog } from "@/contexts/DiceLogContext";
import { Skeleton } from "@/components/ui/skeleton";

export const DiceLogPanel = () => {
  const { logs, clearLogs, isLoading } = useDiceLog();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRollTypeColor = (type: string) => {
    switch (type) {
      case 'stat': return 'text-primary';
      case 'skill': return 'text-accent';
      case 'manual': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  if (isCollapsed) {
    return (
      <Card className="fixed bottom-4 right-4 z-40 w-80 bg-card/95 backdrop-blur-md border-primary/30 shadow-[var(--shadow-glow)]">
        <CardHeader className="p-3 cursor-pointer" onClick={() => setIsCollapsed(false)}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm text-foreground font-cinzel">
              <Dices className="w-4 h-4 text-primary" />
              Dice Log ({logs.length})
            </CardTitle>
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-40 w-96 bg-card/95 backdrop-blur-md border-primary/30 shadow-[var(--shadow-glow)]">
      <CardHeader className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground font-cinzel">
            <Dices className="w-5 h-5 text-primary" />
            Dice Log
          </CardTitle>
          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearLogs}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(true)}
              className="h-8 w-8"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="p-4 space-y-2">
            {isLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Dices className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No dice rolls yet</p>
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-gradient-to-br from-background/40 to-background/60 border border-border/30 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatTime(log.created_at)}
                    </span>
                    <span className={`text-xs font-medium ${getRollTypeColor(log.roll_type)}`}>
                      {log.roll_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {log.character_name}
                    </span>
                    <span className="text-xs text-muted-foreground">rolls</span>
                    <span className="text-xs font-mono text-accent">
                      {log.formula}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Dices className="w-4 h-4 text-primary" />
                    <span className="text-lg font-bold text-primary font-cinzel">
                      {log.raw_result}
                    </span>
                    {log.modifier !== 0 && (
                      <>
                        <span className="text-sm text-muted-foreground">
                          {log.modifier > 0 ? '+' : ''}{log.modifier}
                        </span>
                        <span className="text-sm text-muted-foreground">=</span>
                        <span className="text-lg font-bold text-foreground font-cinzel">
                          {log.total}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
