import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Moon, Sun, Dices } from "lucide-react";
import { toast } from "sonner";

interface RestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hp_current: number;
  hp_max: number;
  hit_dice_remaining: number;
  hit_dice_total: number;
  onHPChange: (current: number, temp?: number) => void;
  onHitDiceChange?: (remaining: number, total: number) => void;
  onRest?: () => void;
}

export const RestDialog = ({
  open,
  onOpenChange,
  hp_current,
  hp_max,
  hit_dice_remaining,
  hit_dice_total,
  onHPChange,
  onHitDiceChange,
  onRest,
}: RestDialogProps) => {
  const [isRolling, setIsRolling] = useState(false);

  const rollD8 = () => Math.floor(Math.random() * 8) + 1;

  const handleShortRest = () => {
    if (hit_dice_remaining <= 0) {
      toast.error("No hit dice remaining!");
      return;
    }

    setIsRolling(true);
    
    // Simulate dice roll animation
    setTimeout(() => {
      const roll = rollD8();
      const healing = roll; // In D&D 5e, you can add CON modifier, but keeping simple
      const newHP = Math.min(hp_current + healing, hp_max);
      const newHitDice = hit_dice_remaining - 1;

      onHPChange(newHP);
      onHitDiceChange?.(newHitDice, hit_dice_total);
      
      toast.success(`Short Rest: Rolled ${roll} on Hit Die!`, {
        description: `Healed ${healing} HP (${hp_current} → ${newHP})`,
      });
      
      setIsRolling(false);
    }, 500);
  };

  const handleLongRest = () => {
    // Long rest: restore full HP and half of spent hit dice (minimum 1)
    const spentHitDice = hit_dice_total - hit_dice_remaining;
    const restoredHitDice = Math.max(1, Math.floor(spentHitDice / 2));
    const newHitDice = Math.min(hit_dice_remaining + restoredHitDice, hit_dice_total);
    
    onHPChange(hp_max, 0); // Full HP, clear temp HP
    onHitDiceChange?.(newHitDice, hit_dice_total);
    onRest?.();
    
    toast.success("Long Rest Complete!", {
      description: `Restored to full HP and regained ${restoredHitDice} hit dice`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rest</DialogTitle>
          <DialogDescription>
            Choose how to rest and recover your strength
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Short Rest */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Short Rest</h3>
              </div>
              <Badge variant="secondary">
                {hit_dice_remaining}/{hit_dice_total} Hit Dice
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Spend a hit die to roll 1d8 and recover HP. Takes 1 hour.
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleShortRest}
                disabled={hit_dice_remaining <= 0 || isRolling}
                className="flex-1"
                variant="outline"
              >
                <Dices className="w-4 h-4 mr-2" />
                {isRolling ? "Rolling..." : "Roll Hit Die"}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Long Rest */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Long Rest</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Restore all HP, clear exhaustion, and regain half your spent hit dice (minimum 1). Takes 8 hours.
            </p>
            
            <Button
              onClick={handleLongRest}
              className="w-full"
            >
              <Moon className="w-4 h-4 mr-2" />
              Take Long Rest
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
