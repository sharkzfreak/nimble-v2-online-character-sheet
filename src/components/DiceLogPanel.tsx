import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dices, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useDiceLog } from "@/contexts/DiceLogContext";
import { Skeleton } from "@/components/ui/skeleton";

export const DiceLogPanel = () => {
  const { logs, clearLogs, isLoading } = useDiceLog();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLogsLengthRef = useRef(logs.length);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (logs.length > prevLogsLengthRef.current && scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
    prevLogsLengthRef.current = logs.length;
  }, [logs]);

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
      <div className="fixed right-0 top-0 bottom-0 z-40 flex items-center">
        <Button
          onClick={() => setIsCollapsed(false)}
          variant="ghost"
          size="sm"
          className="h-20 w-8 rounded-l-lg rounded-r-none bg-card/95 backdrop-blur-md border border-r-0 border-primary/30 shadow-[var(--shadow-glow)] hover:bg-card flex flex-col gap-1 items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4 text-primary" />
          <div className="writing-mode-vertical text-xs text-muted-foreground font-cinzel">
            Chat
          </div>
          {logs.length > 0 && (
            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {logs.length}
            </div>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 z-40 w-80 md:w-96 bg-card/95 backdrop-blur-md border-l border-primary/30 shadow-[var(--shadow-glow)] flex flex-col">
      <CardHeader className="p-4 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground font-cinzel">
            <Dices className="w-5 h-5 text-primary" />
            Chat Log
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
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
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
      </div>
    </div>
  );
};
