import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, ChevronLeft, ChevronRight, Zap, AlertTriangle, Star, MessageSquare, Target, Plus, Minus, TrendingUp, TrendingDown, Lock, LockOpen } from "lucide-react";
import { D20Icon } from "@/components/icons/D20Icon";
import { useDiceLog } from "@/contexts/DiceLogContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DiceRollAnimation } from "./DiceRollAnimation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DiceType {
  sides: number;
  label: string;
}

type RollMode = 'normal' | 'advantage' | 'disadvantage';

const diceTypes: DiceType[] = [
  { sides: 4, label: "d4" },
  { sides: 6, label: "d6" },
  { sides: 8, label: "d8" },
  { sides: 10, label: "d10" },
  { sides: 12, label: "d12" },
  { sides: 20, label: "d20" },
];

export const DiceLogPanel = () => {
  const { logs, clearLogs, isLoading, addLog, animationsEnabled, toggleAnimations } = useDiceLog();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevLogsLengthRef = useRef(logs.length);

  // Dice dock state
  const [modifier, setModifier] = useState(0);
  const [rollMode, setRollMode] = useState<RollMode>('normal');
  const [dicePool, setDicePool] = useState<Record<string, number>>({
    d4: 0,
    d6: 0,
    d8: 0,
    d10: 0,
    d12: 0,
    d20: 0,
  });
  const [isRolling, setIsRolling] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [lastRoll, setLastRoll] = useState({ 
    roll: 0, 
    total: 0, 
    diceType: "d20", 
    statName: "Manual Roll", 
    formula: "",
    allRolls: [] as number[],
    keptRolls: [] as number[]
  });

  // Auto-scroll to top when new messages arrive
  useEffect(() => {
    if (logs.length > prevLogsLengthRef.current && scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }
    }
    prevLogsLengthRef.current = logs.length;
  }, [logs]);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCollapsed || isLocked) return; // Don't do anything if already collapsed or locked
      
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCollapsed, isLocked]);

  // Apply dock inset padding to prevent overlap
  useEffect(() => {
    const applyDockInset = () => {
      if (dockRef.current && scrollRef.current) {
        const dockHeight = dockRef.current.offsetHeight;
        const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (scrollContainer) {
          scrollContainer.style.paddingBottom = `${dockHeight + 8}px`;
        }
      }
    };

    applyDockInset();
    window.addEventListener('resize', applyDockInset);
    return () => window.removeEventListener('resize', applyDockInset);
  }, []);

  // Dice functions
  const addToPool = (diceLabel: string) => {
    setDicePool(prev => ({
      ...prev,
      [diceLabel]: prev[diceLabel] + 1
    }));
  };

  const removeFromPool = (diceLabel: string) => {
    setDicePool(prev => ({
      ...prev,
      [diceLabel]: Math.max(0, prev[diceLabel] - 1)
    }));
  };

  const clearPool = () => {
    setDicePool({
      d4: 0,
      d6: 0,
      d8: 0,
      d10: 0,
      d12: 0,
      d20: 0,
    });
    setModifier(0);
  };

  const adjustModifier = (delta: number) => {
    setModifier(prev => Math.max(-10, Math.min(10, prev + delta)));
  };

  const totalDiceInPool = Object.values(dicePool).reduce((sum, count) => sum + count, 0);

  const rollDice = (sides: number, count: number = 1): number[] => {
    return Array.from({ length: count }, () => Math.ceil(Math.random() * sides));
  };

  const rollPool = () => {
    if (isRolling) {
      console.log('Already rolling, skipping...');
      return;
    }
    
    const poolEntries = Object.entries(dicePool).filter(([_, count]) => count > 0);
    if (poolEntries.length === 0) {
      console.log('No dice in pool, cannot roll');
      return;
    }

    console.log('Rolling dice pool:', poolEntries);
    setIsRolling(true);
    
    let allRolls: number[] = [];
    let keptRolls: number[] = [];
    let individualRolls: Array<{ value: number; sides: number }> = [];
    let formulaParts: string[] = [];
    let modePrefix = '';
    
    if (rollMode === 'normal') {
      poolEntries.forEach(([diceType, count]) => {
        const sides = parseInt(diceType.substring(1));
        const rolls = rollDice(sides, count);
        allRolls.push(...rolls);
        keptRolls.push(...rolls);
        rolls.forEach(value => individualRolls.push({ value, sides }));
        formulaParts.push(`${count}${diceType}`);
      });
    } else {
      modePrefix = rollMode === 'advantage' ? ' (Advantage)' : ' (Disadvantage)';
      
      const firstSet: number[] = [];
      const secondSet: number[] = [];
      
      poolEntries.forEach(([diceType, count]) => {
        const sides = parseInt(diceType.substring(1));
        const rolls1 = rollDice(sides, count);
        const rolls2 = rollDice(sides, count);
        firstSet.push(...rolls1);
        secondSet.push(...rolls2);
        formulaParts.push(`${count}${diceType}`);
      });
      
      const total1 = firstSet.reduce((sum, roll) => sum + roll, 0);
      const total2 = secondSet.reduce((sum, roll) => sum + roll, 0);
      
      allRolls = [...firstSet, ...secondSet];
      
      if (rollMode === 'advantage') {
        keptRolls = total1 >= total2 ? firstSet : secondSet;
      } else {
        keptRolls = total1 <= total2 ? firstSet : secondSet;
      }
      
      // Store only the kept rolls as individual rolls
      poolEntries.forEach(([diceType], idx) => {
        const sides = parseInt(diceType.substring(1));
        const startIdx = poolEntries.slice(0, idx).reduce((sum, [_, c]) => sum + c, 0);
        const count = poolEntries[idx][1];
        for (let i = 0; i < count; i++) {
          individualRolls.push({ value: keptRolls[startIdx + i], sides });
        }
      });
    }

    const rawTotal = keptRolls.reduce((sum, roll) => sum + roll, 0);
    const total = rawTotal + modifier;
    const formula = formulaParts.join(' + ') + modePrefix + (modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : '');
    
    const displayDiceType = poolEntries[0][0];

    setLastRoll({ 
      roll: rawTotal, 
      total, 
      diceType: displayDiceType, 
      statName: rollMode === 'normal' ? "Manual Roll" : `Manual Roll${modePrefix}`,
      formula,
      allRolls,
      keptRolls
    });
    
    if (animationsEnabled) {
      setShowAnimation(true);
    } else {
      // No animation - log immediately
      addLog({
        character_name: "Manual Roll",
        character_id: null,
        formula,
        raw_result: rawTotal,
        modifier,
        total,
        roll_type: 'manual',
        individual_rolls: individualRolls,
      });
      setIsRolling(false);
      clearPool();
    }
  };

  const handleAnimationComplete = () => {
    console.log('Dice pool animation complete, resetting state');
    setShowAnimation(false);
    setIsRolling(false);

    // Build individual rolls from keptRolls
    const poolEntries = Object.entries(dicePool).filter(([_, count]) => count > 0);
    const individualRolls: Array<{ value: number; sides: number }> = [];
    poolEntries.forEach(([diceType, count]) => {
      const sides = parseInt(diceType.substring(1));
      for (let i = 0; i < count; i++) {
        const idx = poolEntries.slice(0, poolEntries.findIndex(([dt]) => dt === diceType)).reduce((sum, [_, c]) => sum + c, 0) + i;
        if (lastRoll.keptRolls[idx] !== undefined) {
          individualRolls.push({ value: lastRoll.keptRolls[idx], sides });
        }
      }
    });

    addLog({
      character_name: "Manual Roll",
      character_id: null,
      formula: lastRoll.formula,
      raw_result: lastRoll.roll,
      modifier,
      total: lastRoll.total,
      roll_type: 'manual',
      individual_rolls: individualRolls,
    });
    
    clearPool();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent if typing in input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

      const key = event.key;
      const isShift = event.shiftKey;

      // 1-6 for d4-d20
      const diceMap: Record<string, string> = {
        '1': 'd4',
        '2': 'd6',
        '3': 'd8',
        '4': 'd10',
        '5': 'd12',
        '6': 'd20',
      };

      if (diceMap[key]) {
        event.preventDefault();
        if (isShift) {
          removeFromPool(diceMap[key]);
        } else {
          addToPool(diceMap[key]);
        }
      }

      // Modifier controls
      if (key === '-' || key === '_') {
        event.preventDefault();
        adjustModifier(-1);
      }
      if (key === '=' || key === '+') {
        event.preventDefault();
        adjustModifier(1);
      }

      // Enter to roll
      if (key === 'Enter' && totalDiceInPool > 0) {
        event.preventDefault();
        rollPool();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [dicePool, modifier, totalDiceInPool]);


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
          icon: D20Icon,
          variant: 'outline' as const,
          className: 'bg-muted/20 text-muted-foreground border-muted-foreground/40'
        };
      default:
        return {
          label: 'ROLL',
          icon: D20Icon,
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

  const poolText = Object.entries(dicePool)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => `${count}${type}`)
    .join(' + ') || '—';

  // Dice icon SVG components - clean shapes without internal lines
  const DiceIcon = ({ type }: { type: string }) => {
    const baseClass = "w-full h-full transition-all";
    switch (type) {
      case 'd4':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass}>
            <path d="M12 2 L22 20 L2 20 Z" />
          </svg>
        );
      case 'd6':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass}>
            <rect x="4" y="4" width="16" height="16" rx="1" />
          </svg>
        );
      case 'd8':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass}>
            <path d="M12 2 L22 12 L12 22 L2 12 Z" />
          </svg>
        );
      case 'd10':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass}>
            <path d="M12 2 L20 8 L18 18 L6 18 L4 8 Z" />
          </svg>
        );
      case 'd12':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass}>
            <path d="M12 2 L19 6 L21 13 L16 20 L8 20 L3 13 L5 6 Z" />
          </svg>
        );
      case 'd20':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass}>
            <path d="M12 2 L22 9 L19 18 L5 18 L2 9 Z M5 18 L12 22 M19 18 L12 22" />
          </svg>
        );
      default:
        return <D20Icon className={baseClass} />;
    }
  };

  // Render dice face with numbers
  const DiceFace = ({ value, sides }: { value: number; sides: number }) => {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xs font-bold font-cinzel drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {value}
        </span>
      </div>
    );
  };

  return (
    <>
      <div ref={panelRef} className="fixed right-0 top-0 bottom-0 z-40 w-72 lg:w-80 bg-card/95 backdrop-blur-md border-l border-primary/30 shadow-2xl flex flex-col">
        <CardHeader className="p-3 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground font-cinzel text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggleAnimations}
                      className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                    >
                      <D20Icon className={`w-4 h-4 ${animationsEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                      Chat Log
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to {animationsEnabled ? 'disable' : 'enable'} animations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsLocked(!isLocked)}
                      className="h-7 w-7"
                    >
                      {isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <LockOpen className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isLocked ? 'Unlock to auto-close' : 'Lock to keep open'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                  <D20Icon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-xs">No dice rolls yet</p>
                  <p className="text-xs mt-1 opacity-70">Start rolling!</p>
                </div>
              ) : (
                [...logs].reverse().map((log, index) => {
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

                      {/* Individual Dice Rolls */}
                      {log.individual_rolls && log.individual_rolls.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {log.individual_rolls.map((die, idx) => {
                              const isCrit = die.sides === 20 && die.value === 20;
                              const isFail = die.sides === 20 && die.value === 1;
                              const diceColor = isCrit ? 'text-green-400' : isFail ? 'text-red-400' : 'text-primary/80';
                              const bgColor = isCrit ? 'bg-green-500/10' : isFail ? 'bg-red-500/10' : 'bg-background/40';
                              const borderColor = isCrit ? 'border-green-500/30' : isFail ? 'border-red-500/30' : 'border-border/20';
                              
                              return (
                                <div key={idx} className={`relative flex-shrink-0 p-1.5 rounded ${bgColor} border ${borderColor}`}>
                                  <div className={`w-10 h-10 ${diceColor}`}>
                                    <DiceIcon type={`d${die.sides}`} />
                                  </div>
                                  <DiceFace value={die.value} sides={die.sides} />
                                </div>
                              );
                            })}
                            
                            {/* Modifier and Total */}
                            {log.modifier !== 0 && (
                              <div className="flex items-baseline gap-1.5 ml-1">
                                <span className="text-base font-bold text-muted-foreground font-cinzel">
                                  {log.modifier > 0 ? '+' : ''}{log.modifier}
                                </span>
                                <span className="text-xs text-muted-foreground">=</span>
                                <span className="text-lg font-bold text-foreground font-cinzel">
                                  {log.total}
                                </span>
                              </div>
                            )}
                            
                            {log.modifier === 0 && log.individual_rolls.length > 1 && (
                              <div className="flex items-baseline gap-1.5 ml-1">
                                <span className="text-xs text-muted-foreground">=</span>
                                <span className="text-lg font-bold text-foreground font-cinzel">
                                  {log.total}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Fallback for old logs without individual_rolls */
                        <div className="flex items-center gap-3 p-2 rounded bg-background/40 border border-border/20">
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 text-primary/80">
                              <DiceIcon type={log.formula.match(/d\d+/)?.[0] || 'd20'} />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary font-cinzel drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                {log.raw_result}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-baseline gap-2 flex-wrap">
                            {log.modifier !== 0 && (
                              <>
                                <span className="text-lg font-bold text-muted-foreground font-cinzel">
                                  {log.modifier > 0 ? '+' : ''}{log.modifier}
                                </span>
                                <span className="text-sm text-muted-foreground">=</span>
                              </>
                            )}
                            <span className="text-xl font-bold text-foreground font-cinzel">
                              {log.total}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Dice Dock - Fixed to bottom with two rows */}
        <footer 
          ref={dockRef}
          id="diceDock"
          className="sticky bottom-0 w-full border-t border-primary/30 bg-card/95 backdrop-blur-md px-2 py-2 flex-shrink-0"
        >
          {/* Row 1: Dice Icons */}
          <div className="dice-row flex items-center justify-between gap-1 mb-2">
            {diceTypes.map((dice) => (
              <TooltipProvider key={dice.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => addToPool(dice.label)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        removeFromPool(dice.label);
                      }}
                      className="relative w-8 h-8 inline-flex items-center justify-center text-primary hover:text-primary/80 transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
                      aria-label={`Add ${dice.label}`}
                    >
                      <DiceIcon type={dice.label} />
                      {dicePool[dice.label] > 0 && (
                        <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-accent text-primary-foreground text-[8px] flex items-center justify-center font-bold border border-background">
                          {dicePool[dice.label]}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">L-click: add | R-click: remove | Key: {diceTypes.indexOf(dice) + 1}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {/* Row 2: Controls */}
          <div className="controls-row flex items-center gap-2">
            {/* Modifier */}
            <div className="modifier flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => adjustModifier(-1)}
                className="h-6 w-6 rounded hover:bg-primary/20"
                id="modDec"
                aria-label="Decrease modifier"
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <div 
                id="modVal"
                className="mod-value w-10 px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold text-center"
              >
                {modifier > 0 ? '+' : ''}{modifier}
              </div>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={() => adjustModifier(1)}
                className="h-6 w-6 rounded hover:bg-primary/20"
                id="modInc"
                aria-label="Increase modifier"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Roll Mode Toggles */}
            <div className="roll-mode flex items-center gap-0.5">
              <Button
                size="sm"
                variant={rollMode === 'normal' ? 'default' : 'ghost'}
                onClick={() => setRollMode('normal')}
                className="h-6 px-2 text-[10px] rounded"
                data-mode="normal"
                aria-pressed={rollMode === 'normal'}
                aria-label="Normal roll mode"
              >
                Normal
              </Button>
              <Button
                size="sm"
                variant={rollMode === 'advantage' ? 'default' : 'ghost'}
                onClick={() => setRollMode('advantage')}
                className="h-6 px-2 text-[10px] rounded"
                data-mode="advantage"
                aria-pressed={rollMode === 'advantage'}
                aria-label="Advantage roll mode"
              >
                Adv
              </Button>
              <Button
                size="sm"
                variant={rollMode === 'disadvantage' ? 'default' : 'ghost'}
                onClick={() => setRollMode('disadvantage')}
                className="h-6 px-2 text-[10px] rounded"
                data-mode="disadvantage"
                aria-pressed={rollMode === 'disadvantage'}
                aria-label="Disadvantage roll mode"
              >
                Dis
              </Button>
            </div>

            {/* Pool Summary */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    id="dicePoolText"
                    className="pool flex-1 truncate text-[10px] opacity-80 ml-1 cursor-pointer min-w-0"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      clearPool();
                    }}
                  >
                    {poolText}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Right-click to clear pool</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* ROLL Button */}
            <Button
              id="rollBtn"
              onClick={rollPool}
              disabled={totalDiceInPool === 0 || isRolling}
              size="sm"
              className="h-7 px-4 text-xs font-bold"
              aria-label="Roll dice"
            >
              ROLL
            </Button>
          </div>
        </footer>
      </div>

      <DiceRollAnimation
        diceType={lastRoll.diceType}
        result={lastRoll.roll}
        modifier={modifier}
        total={lastRoll.total}
        isVisible={showAnimation}
        onComplete={handleAnimationComplete}
        statName={lastRoll.statName}
        characterName="Manual Roll"
        rollMode={rollMode}
        allRolls={lastRoll.allRolls}
        keptRolls={lastRoll.keptRolls}
      />
    </>
  );
};
