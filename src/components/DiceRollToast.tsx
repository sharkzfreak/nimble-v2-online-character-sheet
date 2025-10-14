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

export const DiceRollToast = ({ statName, roll, modifier, total, diceType = "d20", onClose }: DiceRollToastProps) => {
  const [isRolling, setIsRolling] = useState(true);
  const [currentRoll, setCurrentRoll] = useState(0);
  
  // Extract dice max value from diceType (e.g., "d20" -> 20)
  const diceMax = parseInt(diceType.substring(1)) || 20;

  useEffect(() => {
    // Animate the dice roll
    const animationDuration = 800;
    const intervalTime = 50;
    const steps = animationDuration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps) {
        setCurrentRoll(Math.ceil(Math.random() * diceMax));
        currentStep++;
      } else {
        setCurrentRoll(roll);
        setIsRolling(false);
        clearInterval(interval);
      }
    }, intervalTime);

    // Auto-close after 4 seconds
    const timeout = setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [roll, onClose]);

  return (
    <Card className="fixed top-20 right-6 z-50 p-6 bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50 shadow-2xl backdrop-blur-md animate-scale-in">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive/20"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-4">
        <Dices 
          className={`w-10 h-10 text-primary ${isRolling ? 'animate-spin' : ''}`} 
        />
        <div>
          <h3 className="font-bold text-lg font-cinzel text-foreground flex items-center gap-2">
            {statName} Roll
            <span className="text-sm text-muted-foreground font-normal">({diceType})</span>
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-bold text-primary font-cinzel">
              {isRolling ? currentRoll : roll}
            </span>
            {modifier !== 0 && (
              <>
                <span className="text-xl text-muted-foreground">+</span>
                <span className="text-2xl font-semibold text-accent">{modifier}</span>
                <span className="text-xl text-muted-foreground">=</span>
                <span className="text-3xl font-bold text-foreground font-cinzel">
                  {isRolling ? '?' : total}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
