import { useState } from "react";
import { Heart, Shield, Dices } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  characterName: string;
  classColor: string;
  hp_current: number;
  hp_max: number;
  hp_temp: number;
  armor: number;
  hit_dice_remaining: number;
  hit_dice_total: number;
  onHPChange?: (current: number, max: number, temp: number) => void;
  onArmorChange?: (armor: number) => void;
  onHitDiceChange?: (remaining: number, total: number) => void;
}

export const ProfileCard = ({
  characterName,
  classColor,
  hp_current,
  hp_max,
  hp_temp,
  armor,
  hit_dice_remaining,
  hit_dice_total,
  onHPChange,
  onArmorChange,
  onHitDiceChange,
}: ProfileCardProps) => {
  const [editingHP, setEditingHP] = useState(false);
  const [editingHitDice, setEditingHitDice] = useState(false);
  const [tempHPCurrent, setTempHPCurrent] = useState(hp_current);
  const [tempHPMax, setTempHPMax] = useState(hp_max);
  const [tempHPTemp, setTempHPTemp] = useState(hp_temp);
  const [tempHDRemaining, setTempHDRemaining] = useState(hit_dice_remaining);
  const [tempHDTotal, setTempHDTotal] = useState(hit_dice_total);

  const hpPercentage = Math.min((hp_current / hp_max) * 100, 100);
  const tempHPPercentage = Math.min((hp_temp / hp_max) * 100, 100);
  const hitDicePercentage = (hit_dice_remaining / hit_dice_total) * 100;

  const handleHPIncrement = () => {
    const newCurrent = Math.min(hp_current + 1, hp_max);
    onHPChange?.(newCurrent, hp_max, hp_temp);
  };

  const handleHPDecrement = () => {
    if (hp_temp > 0) {
      onHPChange?.(hp_current, hp_max, hp_temp - 1);
    } else {
      const newCurrent = Math.max(hp_current - 1, 0);
      onHPChange?.(newCurrent, hp_max, hp_temp);
    }
  };

  const handleHPSave = () => {
    onHPChange?.(tempHPCurrent, tempHPMax, tempHPTemp);
    setEditingHP(false);
  };

  const handleHitDiceSave = () => {
    onHitDiceChange?.(tempHDRemaining, tempHDTotal);
    setEditingHitDice(false);
  };

  const handleHitDiceSpend = () => {
    if (hit_dice_remaining > 0) {
      onHitDiceChange?.(hit_dice_remaining - 1, hit_dice_total);
    }
  };

  return (
    <aside
      className="sticky top-4 w-[280px] rounded-xl border-2 shadow-2xl backdrop-blur-sm overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(${classColor} / 0.1), hsl(var(--card)))`,
        borderColor: `hsl(${classColor} / 0.4)`,
        boxShadow: `0 8px 32px hsl(${classColor} / 0.3)`,
      }}
    >
      {/* Portrait */}
      <div className="p-4">
        <div
          className="relative w-full aspect-square rounded-lg overflow-hidden border-4 transition-all duration-300"
          style={{
            backgroundColor: `hsl(${classColor})`,
            borderColor: `hsl(${classColor} / 0.8)`,
            boxShadow: `0 8px 32px hsl(${classColor} / 0.4), inset 0 0 60px rgba(255,255,255,0.1)`,
          }}
        >
          {/* Gradient overlay for faded center */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle, transparent 30%, hsl(${classColor} / 0.3) 70%, hsl(${classColor}) 100%)`,
            }}
          />
          {/* Placeholder for portrait image */}
          <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold font-cinzel opacity-40">
            {characterName?.[0] || "?"}
          </div>
        </div>
      </div>

      {/* Vitals HUD */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-3">
          {/* HP Bar (Left) */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="relative cursor-pointer"
                  onClick={() => setEditingHP(true)}
                >
                  <div className="h-32 w-6 bg-muted/30 rounded-full overflow-hidden border-2"
                    style={{ borderColor: `hsl(${classColor} / 0.3)` }}
                  >
                    {/* Base HP fill */}
                    <div
                      className="absolute bottom-0 w-full transition-all duration-300"
                      style={{
                        height: `${hpPercentage}%`,
                        backgroundColor: `hsl(${classColor})`,
                        opacity: hp_current < hp_max * 0.25 ? 0.7 : 1,
                      }}
                    />
                    {/* Temp HP overlay */}
                    {hp_temp > 0 && (
                      <div
                        className="absolute w-full transition-all duration-300"
                        style={{
                          bottom: `${hpPercentage}%`,
                          height: `${tempHPPercentage}%`,
                          backgroundColor: 'hsl(45 93% 47%)', // Gold/cyan for temp HP
                        }}
                      />
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-center mt-1 uppercase tracking-wide text-muted-foreground">
                    HP
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  HP: {hp_current}/{hp_max}
                  {hp_temp > 0 && ` • Temp: ${hp_temp}`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Armor Shield (Center) */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <Shield
                      className="w-20 h-20 transition-all duration-300 hover:scale-110"
                      style={{
                        color: `hsl(${classColor})`,
                        fill: `hsl(${classColor} / 0.15)`,
                      }}
                      strokeWidth={2.5}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center text-2xl font-bold font-cinzel pointer-events-none"
                      style={{
                        color: `hsl(${classColor})`,
                        textShadow: `0 0 10px hsl(${classColor} / 0.6)`,
                      }}
                    >
                      {armor}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    ARMOR
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">Armor: {armor}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Hit Dice Bar (Right) */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="relative cursor-pointer"
                  onClick={() => setEditingHitDice(true)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleHitDiceSpend();
                  }}
                >
                  <div className="h-32 w-6 bg-muted/30 rounded-full overflow-hidden border-2"
                    style={{ borderColor: `hsl(${classColor} / 0.3)` }}
                  >
                    <div
                      className="absolute bottom-0 w-full transition-all duration-300"
                      style={{
                        height: `${hitDicePercentage}%`,
                        backgroundColor: 'hsl(142 71% 45%)',
                      }}
                    />
                  </div>
                  <div className="text-[10px] font-bold text-center mt-1 uppercase tracking-wide text-muted-foreground">
                    DICE
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  Hit Dice: {hit_dice_remaining}/{hit_dice_total}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* HP Controls */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={handleHPDecrement}
            className="w-8 h-8 p-0"
            style={{
              borderColor: `hsl(${classColor} / 0.4)`,
              color: `hsl(${classColor})`,
            }}
          >
            −
          </Button>
          <div className="text-sm font-bold min-w-[60px] text-center">
            {hp_current}/{hp_max}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleHPIncrement}
            className="w-8 h-8 p-0"
            style={{
              borderColor: `hsl(${classColor} / 0.4)`,
              color: `hsl(${classColor})`,
            }}
          >
            +
          </Button>
        </div>
      </div>

      {/* HP Edit Modal */}
      {editingHP && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm p-4 flex flex-col justify-center gap-4">
          <h3 className="text-lg font-bold text-center">Edit HP</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Current HP</label>
            <Input
              type="number"
              value={tempHPCurrent}
              onChange={(e) => setTempHPCurrent(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Max HP</label>
            <Input
              type="number"
              value={tempHPMax}
              onChange={(e) => setTempHPMax(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Temp HP</label>
            <Input
              type="number"
              value={tempHPTemp}
              onChange={(e) => setTempHPTemp(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleHPSave} className="flex-1">
              Save
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingHP(false);
                setTempHPCurrent(hp_current);
                setTempHPMax(hp_max);
                setTempHPTemp(hp_temp);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Hit Dice Edit Modal */}
      {editingHitDice && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm p-4 flex flex-col justify-center gap-4">
          <h3 className="text-lg font-bold text-center">Edit Hit Dice</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Remaining</label>
            <Input
              type="number"
              value={tempHDRemaining}
              onChange={(e) => setTempHDRemaining(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Total</label>
            <Input
              type="number"
              value={tempHDTotal}
              onChange={(e) => setTempHDTotal(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleHitDiceSave} className="flex-1">
              Save
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingHitDice(false);
                setTempHDRemaining(hit_dice_remaining);
                setTempHDTotal(hit_dice_total);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
};
