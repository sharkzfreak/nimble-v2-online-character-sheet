import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dices, Plus, Minus, Settings2 } from "lucide-react";
import { useDiceLog } from "@/contexts/DiceLogContext";
import { DiceRollToast } from "./DiceRollToast";
import { DiceRollAnimation } from "./DiceRollAnimation";

interface ManualDiceRollerProps {
  characterName?: string;
  characterId?: string;
}

interface DiceType {
  sides: number;
  label: string;
}

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
  const [isModifierOpen, setIsModifierOpen] = useState(false);
  const [modifier, setModifier] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState({ roll: 0, total: 0, diceType: "d20", statName: "Manual Roll" });
  const { addLog } = useDiceLog();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDiceOpen(false);
        setIsModifierOpen(false);
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        setIsDiceOpen(prev => !prev);
        setIsModifierOpen(false);
      }
      if (event.key === 'm' || event.key === 'M') {
        setIsModifierOpen(prev => !prev);
        setIsDiceOpen(false);
      }
      if (event.key === 'Escape') {
        setIsDiceOpen(false);
        setIsModifierOpen(false);
      }
    };

    if (isDiceOpen || isModifierOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isDiceOpen, isModifierOpen]);

  const handleRoll = (sides: number, diceLabel: string) => {
    if (isRolling) return;
    
    setIsRolling(true);
    const roll = Math.ceil(Math.random() * sides);
    const total = roll + modifier;
    const formula = `${diceLabel}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`;

    setLastRoll({ roll, total, diceType: diceLabel, statName: "Manual Roll" });
    setIsDiceOpen(false);
    setIsModifierOpen(false);
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setShowToast(true);
    setIsRolling(false);

    // Log the roll after animation
    const formula = `${lastRoll.diceType}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`;
    addLog({
      character_name: characterName,
      character_id: characterId || null,
      formula,
      raw_result: lastRoll.roll,
      modifier,
      total: lastRoll.total,
      roll_type: 'manual',
    });

    console.log(`Manual roll: ${formula} = ${lastRoll.roll} + ${modifier} = ${lastRoll.total}`);
  };

  const adjustModifier = (delta: number) => {
    setModifier(prev => Math.max(-10, Math.min(10, prev + delta)));
  };

  const toggleDice = () => {
    setIsDiceOpen(!isDiceOpen);
    setIsModifierOpen(false);
  };

  const toggleModifier = () => {
    setIsModifierOpen(!isModifierOpen);
    setIsDiceOpen(false);
  };

  return (
    <>
      <div 
        ref={containerRef}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3"
      >
        {/* Modifier Controls - Expand Upward */}
        {isModifierOpen && (
          <div className="flex flex-col gap-2 items-center animate-scale-in">
            <Button
              size="icon"
              variant="outline"
              onClick={() => adjustModifier(1)}
              className="h-12 w-12 rounded-full border-2 border-primary/40 bg-background/90 backdrop-blur-md hover:bg-primary/20 hover:border-primary transition-all shadow-lg"
              aria-label="Increase modifier"
            >
              <Plus className="h-5 w-5" />
            </Button>
            
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-lg shadow-[var(--shadow-glow)] min-w-[3rem] text-center">
              {modifier > 0 ? '+' : ''}{modifier}
            </div>
            
            <Button
              size="icon"
              variant="outline"
              onClick={() => adjustModifier(-1)}
              className="h-12 w-12 rounded-full border-2 border-primary/40 bg-background/90 backdrop-blur-md hover:bg-primary/20 hover:border-primary transition-all shadow-lg"
              aria-label="Decrease modifier"
            >
              <Minus className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Dice Options - Expand Upward */}
        {isDiceOpen && (
          <div className="flex flex-col gap-2 items-center">
            {diceTypes.map((dice, index) => (
              <button
                key={dice.label}
                onClick={() => handleRoll(dice.sides, dice.label)}
                className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/90 to-accent/90 backdrop-blur-md border-2 border-primary/50 shadow-[var(--shadow-glow)] hover:scale-110 transition-all duration-300 flex flex-col items-center justify-center group animate-scale-in"
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
                aria-label={`Roll ${dice.label}`}
              >
                <Dices className="h-5 w-5 text-primary-foreground group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-bold text-primary-foreground mt-0.5">{dice.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Button Row */}
        <div className="flex gap-3 items-center">
          {/* Modifier Button */}
          <Button
            size="icon"
            onClick={toggleModifier}
            disabled={isRolling}
            className={`h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-accent/80 to-accent hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-primary-foreground/20 ${
              isModifierOpen ? 'ring-2 ring-primary' : ''
            } ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Toggle modifier controls"
          >
            <Settings2 className={`h-5 w-5 text-primary-foreground transition-transform ${isModifierOpen ? 'rotate-90' : ''}`} />
            {modifier !== 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold border-2 border-background">
                {Math.abs(modifier)}
              </span>
            )}
          </Button>

          {/* Main Dice Button */}
          <Button
            size="icon"
            onClick={toggleDice}
            disabled={isRolling}
            className={`h-20 w-20 rounded-full shadow-[var(--shadow-glow)] bg-gradient-to-br from-primary via-primary to-accent hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-primary-foreground/20 ${
              isDiceOpen ? 'ring-2 ring-accent' : ''
            } ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              boxShadow: '0 0 40px hsl(var(--primary) / 0.6), 0 10px 30px hsl(var(--primary) / 0.4)',
            }}
            aria-label="Toggle dice menu"
          >
            <Dices className={`h-8 w-8 text-primary-foreground transition-transform ${isDiceOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Keyboard Hints */}
        {!isDiceOpen && !isModifierOpen && !isRolling && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap pointer-events-none">
            Press <kbd className="px-1 py-0.5 bg-muted rounded">R</kbd> or <kbd className="px-1 py-0.5 bg-muted rounded">M</kbd>
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
      />

      {showToast && (
        <DiceRollToast
          statName="Manual Roll"
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
