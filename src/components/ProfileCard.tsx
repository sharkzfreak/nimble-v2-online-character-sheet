import { useState } from "react";
import { Shield, Upload, Sparkles, Sigma } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


interface ProfileCardProps {
  characterName: string;
  classColor: string;
  hp_current: number;
  hp_max: number;
  hp_temp: number;
  armor: number;
  hit_dice_remaining: number;
  hit_dice_total: number;
  characterId?: string;
  portraitUrl?: string;
  onHPChange?: (current: number, max: number, temp: number) => void;
  onArmorChange?: (armor: number) => void;
  onHitDiceChange?: (remaining: number, total: number) => void;
  onPortraitChange?: (url: string) => void;
  onHPFormulaClick?: () => void;
  onArmorFormulaClick?: () => void;
  onSpeedFormulaClick?: () => void;
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
  characterId,
  portraitUrl,
  onHPChange,
  onArmorChange,
  onHitDiceChange,
  onPortraitChange,
  onHPFormulaClick,
  onArmorFormulaClick,
  onSpeedFormulaClick,
}: ProfileCardProps) => {
  const [editingHP, setEditingHP] = useState(false);
  const [tempHPCurrent, setTempHPCurrent] = useState(hp_current);
  const [tempHPMax, setTempHPMax] = useState(hp_max);
  const [tempHPTemp, setTempHPTemp] = useState(hp_temp);
  const [spendingDie, setSpendingDie] = useState<number | null>(null);
  const [editingHD, setEditingHD] = useState(false);
  const [tempHDRemaining, setTempHDRemaining] = useState(hit_dice_remaining);
  const [tempHDTotal, setTempHDTotal] = useState(hit_dice_total);
  const [editingArmor, setEditingArmor] = useState(false);
  const [tempArmor, setTempArmor] = useState(armor);
  const [imageDialog, setImageDialog] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleArmorSave = () => {
    onArmorChange?.(tempArmor);
    setEditingArmor(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !characterId) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${characterId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('character-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('character-images')
        .getPublicUrl(filePath);

      // Add cache-busting to force browser reload
      const urlWithCacheBust = `${data.publicUrl}?t=${Date.now()}`;
      onPortraitChange?.(urlWithCacheBust);
      setImageDialog(false);
      toast.success('Portrait uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-portrait', {
        body: { prompt: aiPrompt }
      });

      if (error) throw error;
      
      if (data.error) {
        if (data.error.includes('Rate limits')) {
          toast.error('Rate limits exceeded, please try again later.');
        } else if (data.error.includes('Payment required')) {
          toast.error('Payment required, please add funds to your workspace.');
        } else {
          toast.error(data.error);
        }
        return;
      }

      if (data.imageUrl && characterId) {
        // Convert base64 to blob
        const response = await fetch(data.imageUrl);
        const blob = await response.blob();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const filePath = `${user.id}/${characterId}.png`;

        const { error: uploadError } = await supabase.storage
          .from('character-images')
          .upload(filePath, blob, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('character-images')
          .getPublicUrl(filePath);

        // Add cache-busting to force browser reload
        const urlWithCacheBust = `${publicUrlData.publicUrl}?t=${Date.now()}`;
        onPortraitChange?.(urlWithCacheBust);
        setImageDialog(false);
        setAiPrompt("");
        toast.success('Portrait generated successfully!');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
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
        <Dialog open={imageDialog} onOpenChange={setImageDialog}>
          <DialogTrigger asChild>
            <div
              className="relative w-full h-[220px] sm:h-[180px] rounded-md overflow-hidden border-4 transition-all duration-300 cursor-pointer group"
              style={{
                backgroundColor: `hsl(${classColor})`,
                borderColor: `hsl(${classColor} / 0.8)`,
                boxShadow: `0 8px 32px hsl(${classColor} / 0.4), inset 0 0 60px rgba(255,255,255,0.1)`,
              }}
              aria-label="Character portrait"
            >
              {/* Portrait image or placeholder */}
              {portraitUrl ? (
                <>
                  <img 
                    src={portraitUrl} 
                    alt={characterName}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Upload className="w-6 h-6 text-white" />
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </>
              ) : (
                <>
                  {/* Gradient overlay for faded center */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at center, hsl(${classColor} / 0.4) 0%, hsl(${classColor} / 0.7) 60%, hsl(${classColor}) 100%)`,
                    }}
                  />
                  {/* Placeholder */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-8xl font-bold font-cinzel opacity-40 mb-2">
                      {characterName?.[0] || "?"}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 text-white">
                      <Upload className="w-5 h-5" />
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Character Portrait</DialogTitle>
              <DialogDescription>
                Upload your own image or generate one with AI
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-2">Upload Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="cursor-pointer"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              {/* AI Generation Section */}
              <div>
                <label className="block text-sm font-medium mb-2">Generate with AI</label>
                <Textarea
                  placeholder="Describe your character (e.g., 'A brave elven warrior with silver hair and blue eyes')"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="min-h-[100px]"
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full mt-2"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Portrait
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                    {/* HP Text & Formula Icon - shows on hover */}
                    <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-bold text-foreground drop-shadow-md">
                        {hp_current}/{hp_max}
                      </span>
                      {onHPFormulaClick && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onHPFormulaClick();
                          }}
                          className="hover:scale-110 transition-transform"
                        >
                          <Sigma className="w-3 h-3 text-foreground drop-shadow-md" />
                        </button>
                      )}
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
                  <Popover open={editingArmor} onOpenChange={setEditingArmor}>
                    <PopoverTrigger asChild>
                      <div className="relative z-10 cursor-pointer">
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
                          className="absolute inset-0 flex flex-col items-center justify-center z-20"
                          style={{
                            color: 'hsl(0 0% 100%)',
                            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                          }}
                        >
                          <div className="text-3xl font-bold font-cinzel">
                            {armor}
                          </div>
                          {onArmorFormulaClick && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onArmorFormulaClick();
                              }}
                              className="mt-1 hover:scale-110 transition-transform pointer-events-auto"
                            >
                              <Sigma className="w-3 h-3" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }} />
                            </button>
                          )}
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm">Edit Armor</h3>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Armor Value</label>
                          <Input
                            type="number"
                            value={tempArmor}
                            onChange={(e) => setTempArmor(parseInt(e.target.value) || 0)}
                            className="h-8"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleArmorSave} size="sm" className="flex-1">
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingArmor(false);
                              setTempArmor(armor);
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
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
