import { Star, Swords, Wand2, Package } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FavoriteItem {
  id: string;
  name: string;
  type: 'attack' | 'spell' | 'item';
  description?: string;
}

interface FavoritesCardProps {
  classColor: string;
  favorites?: FavoriteItem[];
}

export const FavoritesCard = ({
  classColor,
  favorites = [],
}: FavoritesCardProps) => {
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
      {/* Header */}
      <div
        className="px-4 py-3 border-b-2 flex items-center gap-2"
        style={{
          background: `linear-gradient(135deg, hsl(${classColor} / 0.15), hsl(${classColor} / 0.05))`,
          borderColor: `hsl(${classColor} / 0.3)`,
        }}
      >
        <Star
          className="w-5 h-5"
          style={{ color: `hsl(${classColor})`, fill: `hsl(${classColor} / 0.3)` }}
        />
        <h3
          className="text-sm font-bold uppercase tracking-wider font-cinzel"
          style={{ color: `hsl(${classColor})` }}
        >
          Favorites
        </h3>
      </div>

      {/* Favorites List */}
      <div className="p-3 space-y-1 max-h-[300px] overflow-y-auto">
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
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/40 transition-all duration-200 text-left group"
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
                      <Star
                        className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ 
                          color: `hsl(${classColor})`,
                          fill: `hsl(${classColor})`
                        }}
                      />
                    </button>
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
    </aside>
  );
};
