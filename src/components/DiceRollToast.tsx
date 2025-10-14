import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Dices, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiceRollToastProps {
  statName: string;
  roll: number;
  modifier: number;
  total: number;
  diceType?: string; // e.g., "d20", "d10"
  onClose: () => void;
}

// Clean dice icon shapes without internal lines
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
      return <Dices className={baseClass} />;
  }
};

// Render dice face with pips for d6, numbers for others
const DiceFace = ({ value, sides }: { value: number; sides: number }) => {
  if (sides === 6 && value >= 1 && value <= 6) {
    // D6 with traditional pip layout
    const pipPositions: Record<number, string[]> = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
    };

    const positions = pipPositions[value] || [];
    const pipCoords: Record<string, { cx: number; cy: number }> = {
      'top-left': { cx: 8, cy: 8 },
      'top-right': { cx: 16, cy: 8 },
      'middle-left': { cx: 8, cy: 12 },
      'center': { cx: 12, cy: 12 },
      'middle-right': { cx: 16, cy: 12 },
      'bottom-left': { cx: 8, cy: 16 },
      'bottom-right': { cx: 16, cy: 16 },
    };

    return (
      <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full pointer-events-none">
        {positions.map((pos, idx) => (
          <circle
            key={idx}
            cx={pipCoords[pos].cx}
            cy={pipCoords[pos].cy}
            r="1.5"
            fill="currentColor"
          />
        ))}
      </svg>
    );
  }

  // For all other dice, show the number
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span className="text-base font-bold font-cinzel drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {value}
      </span>
    </div>
  );
};

export const DiceRollToast = ({ statName, roll, modifier, total, diceType = "d20", onClose }: DiceRollToastProps) => {
  const sides = parseInt(diceType.substring(1)) || 20;
  const isCrit = sides === 20 && roll === 20;
  const isFail = sides === 20 && roll === 1;
  const diceColor = isCrit ? 'text-green-400' : isFail ? 'text-red-400' : 'text-primary';
  const bgGradient = isCrit 
    ? 'from-green-500/20 to-green-600/20 border-green-500/50' 
    : isFail 
    ? 'from-red-500/20 to-red-600/20 border-red-500/50'
    : 'from-primary/20 to-accent/20 border-primary/50';

  useEffect(() => {
    // Auto-close after 4 seconds
    const timeout = setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <Card className={`fixed top-20 right-6 z-50 p-6 bg-gradient-to-br ${bgGradient} border-2 shadow-2xl backdrop-blur-md animate-scale-in`}>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive/20"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-4">
        {/* Dice Icon with Face Value */}
        <div className="relative flex-shrink-0">
          <div className={`w-16 h-16 ${diceColor}`}>
            <DiceIcon type={diceType} />
          </div>
          <DiceFace value={roll} sides={sides} />
        </div>
        
        <div>
          <h3 className="font-bold text-lg font-cinzel text-foreground flex items-center gap-2">
            {statName} Roll
            <span className="text-sm text-muted-foreground font-normal">({diceType})</span>
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {modifier !== 0 && (
              <>
                <span className="text-2xl font-semibold text-muted-foreground">
                  {modifier > 0 ? '+' : ''}{modifier}
                </span>
                <span className="text-xl text-muted-foreground">=</span>
              </>
            )}
            <span className="text-3xl font-bold text-foreground font-cinzel">
              {total}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
