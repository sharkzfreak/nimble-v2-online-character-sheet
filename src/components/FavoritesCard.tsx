import { useState } from "react";
import { Star, Swords, Wand2, Package, Dices, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface FavoriteItem {
  id: string;
  name: string;
  type: 'attack' | 'spell' | 'item';
  description?: string;
}

interface SkillData {
  name: string;
  value: number;
}

interface FavoritesCardProps {
  classColor: string;
  favorites?: FavoriteItem[];
  skills: SkillData[];
  onSkillRoll?: (skillName: string, skillValue: number) => void;
  onRemoveFavorite?: (itemId: string) => void;
}

export const FavoritesCard = ({
  classColor,
  favorites = [],
  skills,
  onSkillRoll,
  onRemoveFavorite,
}: FavoritesCardProps) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'skills'>('favorites');

  const getItemIcon = (type: FavoriteItem['type']) => {
    switch (type) {
      case 'attack':
        return Swords;
      case 'spell':
        return Wand2;
      case 'item':
        return Package;
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
      id="favoritesCard"
      className="absolute z-30 w-[280px] rounded-r-xl border-r-2 border-t-2 border-b-2 shadow-2xl backdrop-blur-sm md:block hidden"
      style={{
        left: '16px',
        top: '420px',
        background: `linear-gradient(135deg, hsl(${classColor} / 0.1), hsl(var(--card)))`,
        borderColor: `hsl(${classColor} / 0.4)`,
        boxShadow: `0 8px 32px hsl(${classColor} / 0.3)`,
      }}
    >
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'favorites' | 'skills')} className="w-full">
        {/* Header with Tabs */}
        <div
          className="px-4 py-3 border-b-2"
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
              <Dices className="w-3 h-3 mr-1" />
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
              favorites.map((item) => {
                const Icon = getItemIcon(item.type);
                return (
                  <TooltipProvider key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/40 transition-all duration-200 group relative"
                          style={{
                            borderLeft: `3px solid hsl(${classColor} / 0.5)`,
                          }}
                        >
                          <Icon
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: `hsl(${classColor})` }}
                          />
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
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Skills Content */}
        <TabsContent value="skills" className="m-0">
          <div className="p-3 space-y-1 max-h-[500px] overflow-y-auto">
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
                    <Dices 
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
