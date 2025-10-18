import { useState } from "react";
import { Upload, Sparkles, Star, X, Heart, Shield, Zap } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { D20Icon } from "@/components/icons/D20Icon";
import { FavoriteItem } from '@/types/rollable';

interface SkillData {
  name: string;
  value: number;
}


interface ProfileCardProps {
  characterName: string;
  classColor: string;
  hp_current: number;
  hp_max: number;
  hp_temp: number;
  armor: number;
  speed: number;
  dex_mod: number;
  hit_dice_remaining: number;
  hit_dice_total: number;
  characterId?: string;
  portraitUrl?: string;
  favorites?: FavoriteItem[];
  skills?: SkillData[];
  onHPChange?: (current: number, max: number, temp: number) => void;
  onArmorChange?: (armor: number) => void;
  onHitDiceChange?: (remaining: number, total: number) => void;
  onPortraitChange?: (url: string) => void;
  onHeal?: () => void;
  onDamage?: () => void;
  onTempHP?: () => void;
  onRest?: () => void;
  onRollInitiative?: () => void;
  onSkillRoll?: (skillName: string, skillValue: number) => void;
  onRemoveFavorite?: (itemId: string) => void;
}

export const ProfileCard = ({
  characterName,
  classColor,
  hp_current,
  hp_max,
  hp_temp,
  armor,
  speed,
  dex_mod,
  hit_dice_remaining,
  hit_dice_total,
  characterId,
  portraitUrl,
  favorites = [],
  skills = [],
  onHPChange,
  onArmorChange,
  onHitDiceChange,
  onPortraitChange,
  onHeal,
  onDamage,
  onTempHP,
  onRest,
  onRollInitiative,
  onSkillRoll,
  onRemoveFavorite,
}: ProfileCardProps) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'skills'>('favorites');
  const [imageDialog, setImageDialog] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const hpPercentage = Math.max(0, Math.min(100, (100 * hp_current) / Math.max(1, hp_max)));
  const initMod = dex_mod >= 0 ? `+${dex_mod}` : `${dex_mod}`;

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


  // Map skills to their corresponding stat colors
  const getSkillStatColor = (skillName: string): string => {
    const skillColorMap: Record<string, string> = {
      'Might': '0 70% 55%',
      'Finesse': '120 60% 50%',
      'Stealth': '120 60% 50%',
      'Arcana': '220 80% 60%',
      'Examination': '220 80% 60%',
      'Lore': '220 80% 60%',
      'Insight': '280 70% 65%',
      'Influence': '280 70% 65%',
      'Naturecraft': '280 70% 65%',
      'Perception': '280 70% 65%',
    };
    return skillColorMap[skillName] || classColor;
  };

  return (
    <aside
      id="profileCard"
      className="rounded-xl border-2 shadow-2xl backdrop-blur-sm h-fit sticky top-4"
      style={{
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

      {/* NEW: Mini-HUD (left column) */}
      <div className="mini-hud-left px-5 pb-5" role="region" aria-label="Character HUD">
        <div className="hud-row">
          <button className="hud-pill hp" title="HP">
            <Heart className="w-4 h-4" />
            <span>{hp_current}/{hp_max}</span>
          </button>
          <button className="hud-pill ac" title="Armor">
            <Shield className="w-4 h-4" />
            <span>{armor}</span>
          </button>
        </div>

        <div className="hud-row">
          <button className="hud-pill spd" title="Speed">
            <Zap className="w-4 h-4" />
            <span>{speed}</span>
          </button>
          <button 
            className="hud-pill init" 
            title="Roll Initiative"
            onClick={onRollInitiative}
          >
            <D20Icon className="w-4 h-4" />
            <span>{initMod}</span>
          </button>
        </div>

        <div className="hud-actions">
          <button className="btn-mini" title="Heal" onClick={onHeal}>+HP</button>
          <button className="btn-mini" title="Damage" onClick={onDamage}>−HP</button>
          <button className="btn-mini" title="Temp HP" onClick={onTempHP}>Temp</button>
          <button className="btn-mini" title="Rest" onClick={onRest}>Rest</button>
        </div>
      </div>

      {/* Skills & Favorites Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'favorites' | 'skills')} className="w-full">
        {/* Header with Tabs */}
        <div
          className="px-4 py-3 border-t-2"
          style={{
            background: `linear-gradient(135deg, hsl(${classColor} / 0.15), hsl(${classColor} / 0.05))`,
            borderColor: `hsl(${classColor} / 0.3)`,
          }}
        >
          <TabsList className="w-full grid grid-cols-2 h-8">
            <TabsTrigger value="favorites" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-xs">
              <D20Icon className="w-3 h-3 mr-1" />
              Skills
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Favorites Content */}
        <TabsContent value="favorites" className="m-0">
          <div className="p-3 space-y-1 max-h-[400px] overflow-y-auto">
            {favorites.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No favorites yet</p>
                <p className="text-xs mt-1">Star items to add them here</p>
              </div>
            ) : (
              favorites.map((item) => (
                <TooltipProvider key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/40 transition-all duration-200 group relative"
                        style={{
                          borderLeft: `3px solid hsl(${classColor} / 0.5)`,
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFavorite?.(item.id);
                          }}
                          className="flex-shrink-0 p-1 rounded hover:bg-destructive/20 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Remove from favorites"
                        >
                          <X className="w-3 h-3 text-destructive" />
                        </button>
                      </div>
                    </TooltipTrigger>
                    {item.description && (
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">{item.description}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))
            )}
          </div>
        </TabsContent>

        {/* Skills Content */}
        <TabsContent value="skills" className="m-0">
          <div className="p-3 space-y-1 max-h-[400px] overflow-y-auto">
            {skills.map((skill) => {
              const skillColor = getSkillStatColor(skill.name);
              return (
                <button
                  key={skill.name}
                  onClick={() => onSkillRoll?.(skill.name, skill.value)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group hover:brightness-110"
                  style={{
                    background: `linear-gradient(90deg, hsl(${skillColor} / 0.15), transparent)`,
                    borderLeft: `3px solid hsl(${skillColor})`,
                    boxShadow: `inset 0 0 20px hsl(${skillColor} / 0.1)`,
                  }}
                >
                  <span className="text-sm font-medium">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm font-bold min-w-[2rem] text-right"
                      style={{ color: `hsl(${skillColor})` }}
                    >
                      {skill.value >= 0 ? `+${skill.value}` : skill.value}
                    </span>
                    <D20Icon 
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: `hsl(${skillColor})` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
};
