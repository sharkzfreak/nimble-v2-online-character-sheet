import { useState } from "react";
import { Shield, Plus, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [tempHPCurrent, setTempHPCurrent] = useState(hp_current);
  const [tempHPMax, setTempHPMax] = useState(hp_max);
  const [tempHPTemp, setTempHPTemp] = useState(hp_temp);
  const [spendingDie, setSpendingDie] = useState<number | null>(null);

  const hpPercentage = Math.min((hp_current / hp_max) * 100, 100);
  const tempHPPercentage = Math.min((hp_temp / hp_max) * 100, 100);
  const isLowHP = hp_current < hp_max * 0.25;

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

  const handleSpendHitDie = (index: number) => {
    if (index < hit_dice_remaining) {
      setSpendingDie(index);
      setTimeout(() => {
        onHitDiceChange?.(hit_dice_remaining - 1, hit_dice_total);
        setSpendingDie(null);
      }, 300);
    }
  };

  const handleRestoreHitDie = (e: React.MouseEvent, index: number) => {
    if (e.altKey && index >= hit_dice_remaining && hit_dice_remaining < hit_dice_total) {
      onHitDiceChange?.(hit_dice_remaining + 1, hit_dice_total);
    }
  };

  const renderHitDicePips = () => {
    const pips = [];
    const pipHeight = 160 / hit_dice_total;
    
    for (let i = 0; i < hit_dice_total; i++) {
      const isAvailable = i < hit_dice_remaining;
      const isSpending = spendingDie === i;
      
      pips.push(
        <div
          key={i}
          className={`absolute left-0 right-0 border-b transition-all duration-300 cursor-pointer ${
            isSpending ? 'opacity-0 scale-50' : 'opacity-100'
          }`}
          style={{
            bottom: `${i * pipHeight}px`,
            height: `${pipHeight}px`,
            backgroundColor: isAvailable ? 'hsl(142 71% 45%)' : 'hsl(var(--muted))',
            borderColor: isAvailable ? 'hsl(142 71% 35%)' : 'hsl(var(--muted-foreground) / 0.3)',
          }}
          onClick={() => handleSpendHitDie(i)}
          onContextMenu={(e) => {
            e.preventDefault();
            handleRestoreHitDie(e, i);
          }}
          role="button"
          aria-label={`Hit die ${i + 1} ${isAvailable ? 'available' : 'spent'}`}
        />
      );
    }
    
    return pips;
  };

  return (
    <aside
      className="sticky top-4 min-w-[320px] w-[340px] max-w-[360px] rounded-xl border-2 shadow-2xl backdrop-blur-sm overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(${classColor} / 0.1), hsl(var(--card)))`,
        borderColor: `hsl(${classColor} / 0.4)`,
        boxShadow: `0 8px 32px hsl(${classColor} / 0.3)`,
      }}
    >
      {/* Portrait */}
      <div className="p-5">
        <div
          className="relative w-full h-[220px] sm:h-[180px] rounded-md overflow-hidden border-4 transition-all duration-300"
          style={{
            backgroundColor: `hsl(${classColor})`,
            borderColor: `hsl(${classColor} / 0.8)`,
            boxShadow: `0 8px 32px hsl(${classColor} / 0.4), inset 0 0 60px rgba(255,255,255,0.1)`,
          }}
          aria-label="Character portrait"
        >
          {/* Gradient overlay for faded center */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, hsl(${classColor} / 0.4) 0%, hsl(${classColor} / 0.7) 60%, hsl(${classColor}) 100%)`,
            }}
          />
          {/* Placeholder for portrait image */}
          <div className="absolute inset-0 flex items-center justify-center text-8xl font-bold font-cinzel opacity-40">
            {characterName?.[0] || "?"}
          </div>
        </div>
      </div>

      {/* Vitals HUD */}
      <div className="px-5 pb-5">
        <div className="vitals-row grid grid-cols-3 items-center gap-5 mt-4">
          {/* HP Bar Column (Left) */}
          <div className="hp-col flex flex-col items-center">
            <div className="flex items-center gap-2">
              {/* HP Bar */}
              <Popover open={editingHP} onOpenChange={setEditingHP}>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="relative w-[26px] h-[160px] sm:h-[130px] bg-muted/30 rounded-sm overflow-hidden border-2"
                            style={{ borderColor: `hsl(${classColor} / 0.3)` }}
                            role="button"
                            aria-label="HP bar"
                          >
                            {/* Base HP fill */}
                            <div
                              className="absolute bottom-0 left-0 w-full transition-all duration-300"
                              style={{
                                height: `${hpPercentage}%`,
                                backgroundColor: isLowHP ? 'hsl(0 84% 60%)' : `hsl(${classColor})`,
                              }}
                            />
                            {/* Temp HP overlay */}
                            {hp_temp > 0 && (
                              <div
                                className="absolute left-0 w-full transition-all duration-300"
                                style={{
                                  bottom: `${hpPercentage}%`,
                                  height: `${tempHPPercentage}%`,
                                  backgroundColor: 'hsl(45 93% 47%)',
                                }}
                              />
                            )}
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
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Edit HP</h3>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Current HP</label>
                      <Input
                        type="number"
                        value={tempHPCurrent}
                        onChange={(e) => setTempHPCurrent(parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Max HP</label>
                      <Input
                        type="number"
                        value={tempHPMax}
                        onChange={(e) => setTempHPMax(parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Temp HP</label>
                      <Input
                        type="number"
                        value={tempHPTemp}
                        onChange={(e) => setTempHPTemp(parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleHPSave} size="sm" className="flex-1">
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
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
                </PopoverContent>
              </Popover>

              {/* HP +/- Buttons */}
              <div className="hp-buttons flex flex-col gap-1">
                <button
                  onClick={handleHPIncrement}
                  className="w-6 h-6 flex items-center justify-center rounded border transition-all hover:scale-110"
                  style={{
                    borderColor: `hsl(${classColor} / 0.4)`,
                    backgroundColor: `hsl(${classColor} / 0.1)`,
                    color: `hsl(${classColor})`,
                  }}
                  aria-label="Increase HP"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={handleHPDecrement}
                  className="w-6 h-6 flex items-center justify-center rounded border transition-all hover:scale-110"
                  style={{
                    borderColor: `hsl(${classColor} / 0.4)`,
                    backgroundColor: `hsl(${classColor} / 0.1)`,
                    color: `hsl(${classColor})`,
                  }}
                  aria-label="Decrease HP"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="text-xs font-bold text-center mt-2 uppercase tracking-wide text-muted-foreground">
              HP
            </div>
          </div>

          {/* Armor Shield (Center) */}
          <div className="armor-col flex flex-col items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Shield
                      className="w-24 h-24 transition-all duration-300 hover:scale-110"
                      style={{
                        color: `hsl(${classColor})`,
                        fill: `hsl(${classColor} / 0.15)`,
                      }}
                      strokeWidth={2.5}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center text-3xl font-bold font-cinzel pointer-events-none"
                      style={{
                        color: `hsl(${classColor})`,
                        textShadow: `0 0 10px hsl(${classColor} / 0.6)`,
                      }}
                    >
                      {armor}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">Armor: {armor}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="text-xs font-bold text-center mt-2 uppercase tracking-wide text-muted-foreground">
              ARMOR
            </div>
          </div>

          {/* Hit Dice Bar (Right) */}
          <div className="hitdice-col flex flex-col items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="relative w-[26px] h-[160px] sm:h-[130px] bg-muted/30 rounded-sm overflow-hidden border-2"
                    style={{ borderColor: `hsl(${classColor} / 0.3)` }}
                    role="button"
                    aria-label="Hit dice bar"
                  >
                    {renderHitDicePips()}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">
                    Hit Dice: {hit_dice_remaining}/{hit_dice_total}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click to spend • Alt+Click to restore
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="text-xs font-bold text-center mt-2 uppercase tracking-wide text-muted-foreground">
              HIT DICE
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
