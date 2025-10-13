import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dices, Trash2, ChevronLeft, ChevronRight, Zap, AlertTriangle, Star, MessageSquare, Target } from "lucide-react";
import { useDiceLog } from "@/contexts/DiceLogContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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

  const getRollTypeInfo = (type: string, result: number, total: number) => {
    // Check for critical success/fail on d20 rolls
    const isCrit20 = result === 20;
    const isCrit1 = result === 1;
    
    if (isCrit20) {
      return {
        label: 'CRIT SUCCESS',
        icon: Star,
        variant: 'default' as const,
        className: 'bg-green-500/20 text-green-400 border-green-500/40'
      };
    }
    
    if (isCrit1) {
      return {
        label: 'CRIT FAIL',
        icon: AlertTriangle,
        variant: 'destructive' as const,
        className: 'bg-red-500/20 text-red-400 border-red-500/40'
      };
    }
    
    switch (type) {
      case 'stat':
        return {
          label: 'STAT ROLL',
          icon: Zap,
          variant: 'default' as const,
          className: 'bg-primary/20 text-primary border-primary/40'
        };
      case 'skill':
        return {
          label: 'SKILL ROLL',
          icon: Target,
          variant: 'secondary' as const,
          className: 'bg-accent/20 text-accent border-accent/40'
        };
      case 'manual':
        return {
          label: 'DICE ROLL',
          icon: Dices,
          variant: 'outline' as const,
          className: 'bg-muted/20 text-muted-foreground border-muted-foreground/40'
        };
      default:
        return {
          label: 'ROLL',
          icon: Dices,
          variant: 'outline' as const,
          className: 'bg-muted/20 text-muted-foreground border-muted-foreground/40'
        };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isCollapsed) {
    return (
      <div className="fixed right-0 top-0 bottom-0 z-40 flex items-center">
        <Button
          onClick={() => setIsCollapsed(false)}
          variant="ghost"
          size="sm"
          className="h-24 w-10 rounded-l-lg rounded-r-none bg-card/95 backdrop-blur-md border border-r-0 border-primary/30 shadow-lg hover:bg-card flex flex-col gap-2 items-center justify-center transition-all hover:w-12"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
          <div className="[writing-mode:vertical-lr] text-xs text-muted-foreground font-cinzel tracking-wider">
            CHAT
          </div>
          {logs.length > 0 && (
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold animate-pulse">
              {logs.length > 99 ? '99+' : logs.length}
            </div>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 z-40 w-64 lg:w-72 bg-card/95 backdrop-blur-md border-l border-primary/30 shadow-2xl flex flex-col">
      <CardHeader className="p-3 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground font-cinzel text-sm">
            <Dices className="w-4 h-4 text-primary" />
            Chat Log
          </CardTitle>
          <div className="flex items-center gap-1">
            {logs.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearLogs}
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(true)}
              className="h-7 w-7"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="p-2 space-y-2">
            {isLoading ? (
              <>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </>
            ) : logs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Dices className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-xs">No dice rolls yet</p>
                <p className="text-xs mt-1 opacity-70">Start rolling!</p>
              </div>
            ) : (
              logs.map((log, index) => {
                const rollInfo = getRollTypeInfo(log.roll_type, log.raw_result, log.total);
                const RollIcon = rollInfo.icon;
                
                return (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-gradient-to-br from-background/60 to-background/80 border border-border/40 hover:border-primary/30 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    {/* Header with Avatar, Name, Time */}
                    <div className="flex items-center gap-2 mb-2">
                      {/* Avatar */}
                      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-primary">
                          {getInitials(log.character_name)}
                        </span>
                      </div>
                      
                      {/* Name & Time */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">
                          {log.character_name}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {formatTime(log.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* Roll Type Badge */}
                    <div className="mb-2">
                      <Badge 
                        variant={rollInfo.variant}
                        className={`text-[10px] px-2 py-0.5 font-bold tracking-wide ${rollInfo.className}`}
                      >
                        <RollIcon className="w-3 h-3 mr-1" />
                        {rollInfo.label}
                      </Badge>
                    </div>

                    {/* Formula */}
                    <div className="text-xs text-muted-foreground mb-1.5 font-mono">
                      {log.formula}
                    </div>

                    {/* Result */}
                    <div className="flex items-center gap-2 p-2 rounded bg-background/40 border border-border/20">
                      <Dices className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-lg font-bold text-primary font-cinzel">
                          {log.raw_result}
                        </span>
                        {log.modifier !== 0 && (
                          <>
                            <span className="text-xs text-muted-foreground font-medium">
                              {log.modifier > 0 ? '+' : ''}{log.modifier}
                            </span>
                            <span className="text-xs text-muted-foreground">=</span>
                            <span className="text-base font-bold text-foreground font-cinzel">
                              {log.total}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
