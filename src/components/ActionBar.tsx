import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Star } from "lucide-react";
import { ActionSpec, RollBinding, AdvMode } from "@/types/rollable";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ActionTile {
  id: string;
  name: string;
  actions: ActionSpec[];
  starred: boolean;
  type: 'feature' | 'item' | 'spell' | 'class';
}

interface ActionBarProps {
  tiles: ActionTile[];
  onRollAction: (binding: RollBinding, actionLabel: string, advMode: AdvMode, situational: number) => void;
  advMode?: AdvMode;
  situational?: number;
}

const getChipIcon = (kind: RollBinding['kind']): string => {
  const icons = {
    attack: '🗡️',
    damage: '💥',
    save: '🛡️',
    check: '🎯',
    healing: '💚',
  };
  return icons[kind] || '🎲';
};

const getChipColor = (kind: RollBinding['kind']): string => {
  const colors = {
    attack: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30',
    damage: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30',
    save: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30',
    check: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30',
    healing: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/30',
  };
  return colors[kind] || 'bg-muted hover:bg-muted/80';
};

const formatBinding = (binding: RollBinding): string => {
  let parts: string[] = [];
  
  if (binding.kind === 'attack' || binding.kind === 'check' || binding.kind === 'save') {
    if (binding.ability) parts.push(binding.ability);
    if (binding.flat) parts.push(`${binding.flat >= 0 ? '+' : ''}${binding.flat}`);
  } else if (binding.kind === 'damage' || binding.kind === 'healing') {
    if (binding.die) parts.push(binding.die);
    if (binding.ability) parts.push(`+${binding.ability}`);
  }
  
  return parts.join(' ') || binding.kind;
};

export const ActionBar = ({ tiles, onRollAction, advMode = 'normal', situational = 0 }: ActionBarProps) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredTiles = tiles.filter(tile => {
    if (filter === 'all') return true;
    if (filter === 'favorites') return tile.starred;
    return tile.type === filter;
  });

  return (
    <Card className="card--actions">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Action Bar</CardTitle>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="favorites">Favorites</SelectItem>
            <SelectItem value="class">Class</SelectItem>
            <SelectItem value="feature">Features</SelectItem>
            <SelectItem value="item">Items</SelectItem>
            <SelectItem value="spell">Spells</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="actions-grid">
          {filteredTiles.map(tile => (
            <div key={tile.id} className="action-tile">
              <div className="action-tile-header">
                <span className="font-semibold">{tile.name}</span>
                {tile.starred && <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tile.actions.map((action, actionIdx) =>
                  action.rolls.map((binding, bindingIdx) => (
                    <TooltipProvider key={`${actionIdx}-${bindingIdx}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`action-chip ${getChipColor(binding.kind)}`}
                            onClick={() => onRollAction(binding, `${tile.name} - ${action.label}`, advMode, situational)}
                          >
                            <span>{getChipIcon(binding.kind)}</span>
                            <span className="text-xs">{formatBinding(binding)}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{action.label} - {binding.kind}</p>
                          {binding.notes && <p className="text-xs text-muted-foreground">{binding.notes}</p>}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))
                )}
              </div>
            </div>
          ))}
          
          {filteredTiles.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">
              No actions found. Add favorites or select a different filter.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
