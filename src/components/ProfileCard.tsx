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
  const [editingHD, setEditingHD] = useState(false);
  const [tempHDRemaining, setTempHDRemaining] = useState(hit_dice_remaining);
  const [tempHDTotal, setTempHDTotal] = useState(hit_dice_total);

  const hpPercentage = Math.min((hp_current / hp_max) * 100, 100);
  const tempHPPercentage = Math.min((hp_temp / hp_max) * 100, 100);
  
  // Dynamic HP color based on percentage
  const getHPColor = () => {
    if (hpPercentage >= 75) {
      return 'hsl(142 76% 36%)'; // Green
    } else if (hpPercentage >= 50) {
      return 'hsl(84 81% 44%)'; // Yellow-green
    } else if (hpPercentage >= 25) {
      return 'hsl(45 93% 47%)'; // Yellow/orange
    } else {
      return 'hsl(0 84% 60%)'; // Red
    }
  };

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

  const handleSpendHitDie = () => {
    if (hit_dice_remaining > 0) {
      onHitDiceChange?.(hit_dice_remaining - 1, hit_dice_total);
    }
  };

  const handleHDSave = () => {
    onHitDiceChange?.(tempHDRemaining, tempHDTotal);
    setEditingHD(false);
  };

  const handleHDRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditingHD(true);
  };

  const renderHitDicePips = () => {
    const pips = [];
    const pipWidth = 100 / hit_dice_total;
    
    for (let i = 0; i < hit_dice_total; i++) {
      const isAvailable = i < hit_dice_remaining;
      
      pips.push(
        <div
          key={i}
          className="absolute top-0 bottom-0 transition-all duration-300 rounded-full"
          style={{
            left: `${i * pipWidth}%`,
            width: `${pipWidth - 2}%`,
            backgroundColor: isAvailable ? 'hsl(0 84% 60%)' : 'hsl(var(--muted))',
          }}
          aria-label={`Hit die ${i + 1} ${isAvailable ? 'available' : 'spent'}`}
          aria-pressed={isAvailable}
        />
      );
    }
    
    return pips;
  };

  return (
    <aside
      id="profileCard"
      className="absolute z-30 w-[280px] rounded-r-xl border-r-2 border-t-2 border-b-2 shadow-2xl backdrop-blur-sm md:block hidden mt-4"
      style={{
        left: '16px',
        top: '0',
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

      {/* Vitals HUD - Centered Shield with Horizontal Bars */}
      <div className="px-5 pb-5 overflow-hidden">
        <div className="relative mt-4">
          {/* 3-column grid: HP | Shield | HD */}
          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-3">
            
            {/* HP Bar (Left) */}
            <div className="relative flex justify-end items-center mt-2">
              {/* HP Track (slides under shield) */}
              <Popover open={editingHP} onOpenChange={setEditingHP}>
                <PopoverTrigger asChild>
                  <div
                    className="relative h-[18px] w-full max-w-[140px] rounded-full bg-muted/30 overflow-hidden border cursor-pointer group mr-[-14px] z-0"
                    style={{ 
                      borderColor: `hsl(${classColor} / 0.3)`,
                    }}
                    role="button"
                    aria-label="HP bar"
                  >
                    {/* Base HP fill */}
                    <div
                      className="absolute left-0 top-0 h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${hpPercentage}%`,
                        backgroundColor: getHPColor(),
                      }}
                    />
                    {/* Temp HP overlay */}
                    {hp_temp > 0 && (
                      <div
                        className="absolute top-0 h-full transition-all duration-300"
                        style={{
                          left: `${hpPercentage}%`,
                          width: `${tempHPPercentage}%`,
                          backgroundColor: 'hsl(45 93% 47%)',
                        }}
                      />
                    )}
                    {/* HP Text - shows on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-bold text-foreground drop-shadow-md">
                        {hp_current}/{hp_max}
                      </span>
                    </div>
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
            </div>

            {/* SHIELD (Center) */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative z-10">
                    {/* Shield-shaped solid background */}
                    <Shield
                      className="w-28 h-28 absolute inset-0"
                      style={{
                        color: 'hsl(var(--card))',
                        fill: 'hsl(var(--card))',
                      }}
                      strokeWidth={0}
                    />
                    <Shield
                      className="w-28 h-28 transition-all duration-300 hover:scale-110 relative z-10"
                      style={{
                        color: 'hsl(0 0% 100%)',
                        fill: `hsl(${classColor} / 0.15)`,
                      }}
                      strokeWidth={1.5}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center text-3xl font-bold font-cinzel pointer-events-none z-20"
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

            {/* Hit Dice Bar (Right) */}
            <div className="relative flex justify-start items-center mt-2">
              <Popover open={editingHD} onOpenChange={setEditingHD}>
                <PopoverTrigger asChild>
                  <div
                    className="relative h-[18px] w-full max-w-[140px] rounded-full bg-muted/30 overflow-hidden border cursor-pointer group ml-[-14px] z-0"
                    style={{ borderColor: `hsl(${classColor} / 0.3)` }}
                    role="button"
                    aria-label="Hit dice bar"
                    onClick={handleSpendHitDie}
                    onContextMenu={handleHDRightClick}
                  >
                    {renderHitDicePips()}
                    {/* HD Text - shows on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-[9px] font-bold text-foreground drop-shadow-md">
                        {hit_dice_remaining}/{hit_dice_total}
                      </span>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Edit Hit Dice</h3>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Current Hit Dice</label>
                      <Input
                        type="number"
                        value={tempHDRemaining}
                        onChange={(e) => setTempHDRemaining(parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Max Hit Dice</label>
                      <Input
                        type="number"
                        value={tempHDTotal}
                        onChange={(e) => setTempHDTotal(parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleHDSave} size="sm" className="flex-1">
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingHD(false);
                          setTempHDRemaining(hit_dice_remaining);
                          setTempHDTotal(hit_dice_total);
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
