import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dices, Plus, Minus } from "lucide-react";
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
  position: { x: number; y: number };
}

const diceTypes: DiceType[] = [
  { sides: 20, label: "d20", position: { x: 0, y: -140 } },
  { sides: 12, label: "d12", position: { x: -120, y: -70 } },
  { sides: 10, label: "d10", position: { x: 120, y: -70 } },
  { sides: 8, label: "d8", position: { x: -120, y: 70 } },
  { sides: 6, label: "d6", position: { x: 120, y: 70 } },
  { sides: 4, label: "d4", position: { x: 0, y: 140 } },
];

export const ManualDiceRoller = ({ characterName = "Manual Roll", characterId }: ManualDiceRollerProps) => {
  const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(false);
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        setIsOpen(prev => !prev);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen]);

  const handleRoll = (sides: number, diceLabel: string) => {
    if (isRolling) return;
    
    setIsRolling(true);
    const roll = Math.ceil(Math.random() * sides);
    const total = roll + modifier;
    const formula = `${diceLabel}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`;

    setLastRoll({ roll, total, diceType: diceLabel, statName: "Manual Roll" });
    setIsOpen(false);
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

  return (
    <>
      <div 
        ref={containerRef}
        className="fixed bottom-6 left-6 z-50"
      >
        {/* Modifier Display */}
        {modifier !== 0 && (
          <div 
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm shadow-[var(--shadow-glow)] animate-scale-in"
          >
            {modifier > 0 ? '+' : ''}{modifier}
          </div>
        )}

        {/* Modifier Controls */}
        <div className="absolute -top-6 -right-20 flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => adjustModifier(-1)}
            className="h-10 w-10 rounded-full border-2 border-primary/30 bg-background/80 backdrop-blur-md hover:bg-primary/20 hover:border-primary transition-all"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => adjustModifier(1)}
            className="h-10 w-10 rounded-full border-2 border-primary/30 bg-background/80 backdrop-blur-md hover:bg-primary/20 hover:border-primary transition-all"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Dice Pop-out Icons */}
        {isOpen && diceTypes.map((dice, index) => (
          <button
            key={dice.label}
            onClick={() => handleRoll(dice.sides, dice.label)}
            className="absolute h-16 w-16 rounded-full bg-gradient-to-br from-primary/90 to-accent/90 backdrop-blur-md border-2 border-primary/50 shadow-[var(--shadow-glow)] hover:scale-110 transition-all duration-300 flex flex-col items-center justify-center group animate-scale-in"
            style={{
              left: `calc(50% + ${dice.position.x}px - 2rem)`,
              top: `calc(50% + ${dice.position.y}px - 2rem)`,
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <Dices className="h-6 w-6 mb-1 text-primary-foreground group-hover:animate-spin" />
            <span className="text-xs font-bold text-primary-foreground">{dice.label}</span>
          </button>
        ))}

        {/* Main Floating Button */}
        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isRolling}
          className={`h-20 w-20 rounded-full shadow-[var(--shadow-glow)] bg-gradient-to-br from-primary via-primary to-accent hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-primary-foreground/20 ${
            isOpen ? 'rotate-180' : ''
          } ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            boxShadow: '0 0 40px hsl(var(--primary) / 0.6), 0 10px 30px hsl(var(--primary) / 0.4)',
          }}
        >
          <Dices className="h-8 w-8 text-primary-foreground" />
        </Button>

        {/* Keyboard Hint */}
        {!isOpen && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Press R
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
