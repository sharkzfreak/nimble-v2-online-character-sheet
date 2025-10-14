import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dices, Plus, Minus, TrendingUp, TrendingDown } from "lucide-react";
import { useDiceLog } from "@/contexts/DiceLogContext";
import { DiceRollToast } from "./DiceRollToast";
import { DiceRollAnimation } from "./DiceRollAnimation";
import { toast } from "@/hooks/use-toast";

interface ManualDiceRollerProps {
  characterName?: string;
  characterId?: string;
}

interface DiceType {
  sides: number;
  label: string;
}

type RollMode = 'normal' | 'advantage' | 'disadvantage';

const diceTypes: DiceType[] = [
  { sides: 20, label: "d20" },
  { sides: 12, label: "d12" },
  { sides: 10, label: "d10" },
  { sides: 8, label: "d8" },
  { sides: 6, label: "d6" },
  { sides: 4, label: "d4" },
];

export const ManualDiceRoller = ({ characterName = "Manual Roll", characterId }: ManualDiceRollerProps) => {
  const [isDiceOpen, setIsDiceOpen] = useState(false);
  const [modifier, setModifier] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [rollMode, setRollMode] = useState<RollMode>('normal');
  const [lastRoll, setLastRoll] = useState({ 
    roll: 0, 
    total: 0, 
    diceType: "d20", 
    statName: "Manual Roll", 
    formula: "",
    allRolls: [] as number[],
    keptRolls: [] as number[]
  });
  const [dicePool, setDicePool] = useState<Record<string, number>>({
    d20: 0,
    d12: 0,
    d10: 0,
    d8: 0,
    d6: 0,
    d4: 0,
  });
  const { addLog, animationsEnabled } = useDiceLog();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDiceOpen(false);
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        setIsDiceOpen(prev => !prev);
      }
      if (event.key === 'Escape') {
        setIsDiceOpen(false);
      }
    };

    if (isDiceOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isDiceOpen]);

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
      d20: 0,
      d12: 0,
      d10: 0,
      d8: 0,
      d6: 0,
      d4: 0,
    });
    setModifier(0);
    setIsDiceOpen(false);
    toast({
      title: "Dice pool cleared",
      duration: 1500,
    });
  };

  const rollDice = (sides: number, count: number = 1): number[] => {
    return Array.from({ length: count }, () => Math.ceil(Math.random() * sides));
  };

  const rollPool = () => {
    if (isRolling) return;
    
    const poolEntries = Object.entries(dicePool).filter(([_, count]) => count > 0);
    if (poolEntries.length === 0) return;

    setIsRolling(true);
    
    let allRolls: number[] = [];
    let keptRolls: number[] = [];
    let formulaParts: string[] = [];
    let modePrefix = '';
    
    if (rollMode === 'normal') {
      // Normal roll - roll each die once
      poolEntries.forEach(([diceType, count]) => {
        const sides = parseInt(diceType.substring(1));
        const rolls = rollDice(sides, count);
        allRolls.push(...rolls);
        keptRolls.push(...rolls);
        formulaParts.push(`${count}${diceType}`);
      });
    } else {
      // Advantage/Disadvantage - roll each die type twice and keep highest/lowest total
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
    }

    const rawTotal = keptRolls.reduce((sum, roll) => sum + roll, 0);
    const total = rawTotal + modifier;
    const formula = formulaParts.join(' + ') + modePrefix + (modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : '');
    
    // Use first dice type for display, or d20 as fallback
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
    setIsDiceOpen(false);
    setShowAnimation(animationsEnabled);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setShowToast(true);
    setIsRolling(false);

    // Log the roll after animation
    addLog({
      character_name: characterName,
      character_id: characterId || null,
      formula: lastRoll.formula,
      raw_result: lastRoll.roll,
      modifier,
      total: lastRoll.total,
      roll_type: 'manual',
    });

    console.log(`Manual roll: ${lastRoll.formula} = ${lastRoll.roll} + ${modifier} = ${lastRoll.total}`);
    
    // Clear pool after roll
    clearPool();
  };

  const adjustModifier = (delta: number) => {
    setModifier(prev => Math.max(-10, Math.min(10, prev + delta)));
  };

  const toggleDice = () => {
    setIsDiceOpen(!isDiceOpen);
  };

  const handleMainButtonClick = () => {
    if (totalDiceInPool > 0) {
      rollPool();
    } else {
      toggleDice();
    }
  };

  const handleMainButtonRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clearPool();
  };

  const totalDiceInPool = Object.values(dicePool).reduce((sum, count) => sum + count, 0);
  const poolEntries = Object.entries(dicePool).filter(([_, count]) => count > 0);

  return (
    <>
      <div 
        ref={containerRef}
        className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-3"
      >
        {/* Dice Options - Expand Upward */}
        {isDiceOpen && (
          <div className="flex flex-col gap-3 items-center">
            {/* Roll Mode Selector */}
            <div className="flex items-center gap-2 bg-background/90 backdrop-blur-md border-2 border-primary/40 rounded-full px-2 py-2 shadow-lg animate-scale-in">
              <Button
                size="sm"
                variant={rollMode === 'normal' ? 'default' : 'ghost'}
                onClick={() => setRollMode('normal')}
                className="h-8 px-3 rounded-full text-xs"
                aria-label="Normal roll"
              >
                Normal
              </Button>
              <Button
                size="sm"
                variant={rollMode === 'advantage' ? 'default' : 'ghost'}
                onClick={() => setRollMode('advantage')}
                className="h-8 px-3 rounded-full text-xs"
                aria-label="Advantage - roll twice, keep highest"
                title="Roll twice, keep highest"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Adv
              </Button>
              <Button
                size="sm"
                variant={rollMode === 'disadvantage' ? 'default' : 'ghost'}
                onClick={() => setRollMode('disadvantage')}
                className="h-8 px-3 rounded-full text-xs"
                aria-label="Disadvantage - roll twice, keep lowest"
                title="Roll twice, keep lowest"
              >
                <TrendingDown className="h-3 w-3 mr-1" />
                Dis
              </Button>
            </div>

            {/* Modifier Controls */}
            <div className="flex items-center gap-2 bg-background/90 backdrop-blur-md border-2 border-primary/40 rounded-full px-3 py-2 shadow-lg animate-scale-in">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => adjustModifier(-1)}
                className="h-8 w-8 rounded-full hover:bg-primary/20"
                aria-label="Decrease modifier"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm min-w-[2.5rem] text-center">
                {modifier > 0 ? '+' : ''}{modifier}
              </div>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={() => adjustModifier(1)}
                className="h-8 w-8 rounded-full hover:bg-primary/20"
                aria-label="Increase modifier"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Dice Icons */}
            {diceTypes.map((dice, index) => (
              <button
                key={dice.label}
                onClick={() => addToPool(dice.label)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  removeFromPool(dice.label);
                }}
                className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/90 to-accent/90 backdrop-blur-md border-2 border-primary/50 shadow-[var(--shadow-glow)] hover:scale-110 transition-all duration-300 flex flex-col items-center justify-center group animate-scale-in relative"
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
                aria-label={`Left-click to add ${dice.label}, right-click to remove`}
                title="Left-click to add, right-click to remove"
              >
                <Dices className="h-5 w-5 text-primary-foreground group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-bold text-primary-foreground mt-0.5">{dice.label}</span>
                {dicePool[dice.label] > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-primary-foreground text-xs flex items-center justify-center font-bold border-2 border-background animate-scale-in">
                    {dicePool[dice.label]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Dice Pool Display - Show when pool has dice and menu is closed */}
        {poolEntries.length > 0 && !isDiceOpen && (
          <div className="bg-background/90 backdrop-blur-md border-2 border-primary/40 rounded-2xl p-4 shadow-[var(--shadow-glow)] animate-scale-in min-w-[200px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-foreground">Dice Pool</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={clearPool}
                className="h-6 w-6"
                aria-label="Clear pool"
              >
                <span className="text-xs">✕</span>
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {poolEntries.map(([diceType, count]) => (
                <div key={diceType} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">{count}{diceType}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => removeFromPool(diceType)}
                    className="h-6 w-6 rounded-full"
                    aria-label={`Remove ${diceType}`}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {modifier !== 0 && (
                <div className="text-sm font-medium text-muted-foreground border-t border-primary/20 pt-2">
                  Modifier: {modifier > 0 ? '+' : ''}{modifier}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Dice Button */}
        <Button
          size="icon"
          onClick={handleMainButtonClick}
          onContextMenu={handleMainButtonRightClick}
          disabled={isRolling}
          className={`h-20 w-20 rounded-full shadow-[var(--shadow-glow)] bg-gradient-to-br from-primary via-primary to-accent hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-primary-foreground/20 ${
            isDiceOpen ? 'ring-2 ring-accent' : ''
          } ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            boxShadow: '0 0 40px hsl(var(--primary) / 0.6), 0 10px 30px hsl(var(--primary) / 0.4)',
          }}
          aria-label={totalDiceInPool > 0 ? "Left-click to roll, right-click to clear" : "Toggle dice menu"}
          title={totalDiceInPool > 0 ? "Left-click: Roll | Right-click: Clear pool" : "Open dice menu"}
        >
          <Dices className={`h-8 w-8 text-primary-foreground transition-transform ${isDiceOpen ? 'rotate-180' : ''}`} />
          {totalDiceInPool > 0 && (
            <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-accent text-primary-foreground text-sm flex items-center justify-center font-bold border-2 border-background">
              {totalDiceInPool}
            </span>
          )}
        </Button>

        {/* Keyboard Hints */}
        {!isDiceOpen && !isRolling && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap pointer-events-none">
            Press <kbd className="px-1 py-0.5 bg-muted rounded">R</kbd>
          </div>
        )}
      </div>

      <DiceRollAnimation
        diceType={lastRoll.diceType}
        result={lastRoll.roll}
        modifier={modifier}
        total={lastRoll.total}
        isVisible={showAnimation}
        onComplete={handleAnimationComplete}
        statName={lastRoll.statName}
        characterName={characterName}
        rollMode={rollMode}
        allRolls={lastRoll.allRolls}
        keptRolls={lastRoll.keptRolls}
      />

      {showToast && lastRoll.formula && (
        <DiceRollToast
          statName={lastRoll.formula}
          roll={lastRoll.roll}
          modifier={modifier}
          total={lastRoll.total}
          diceType={lastRoll.diceType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};
