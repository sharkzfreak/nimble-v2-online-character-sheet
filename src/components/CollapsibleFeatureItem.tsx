import { useState } from "react";
import { ChevronDown, Star, X, Edit2 } from "lucide-react";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { RollableActionChips } from "./RollableActionChips";
import { FeatureLike, ActionSpec, AdvMode } from "@/types/rollable";

interface CollapsibleFeatureItemProps {
  feature: FeatureLike;
  type: 'attack' | 'feature' | 'spell' | 'item';
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onRollAction?: (action: ActionSpec, rollIndex: number, advMode: AdvMode, situational: number) => void;
  canDelete?: boolean;
  canEdit?: boolean;
}

export const CollapsibleFeatureItem = ({
  feature,
  type,
  isFavorited,
  onToggleFavorite,
  onDelete,
  onEdit,
  onRollAction,
  canDelete = true,
  canEdit = true,
}: CollapsibleFeatureItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getTypeColor = () => {
    switch (type) {
      case 'attack':
        return '0 84% 60%';
      case 'feature':
        return '142 76% 36%';
      case 'spell':
        return '262 83% 58%';
      case 'item':
        return '45 93% 47%';
      default:
        return '217 91% 60%';
    }
  };

  const color = getTypeColor();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div 
        className="rounded-lg border-2 transition-all duration-200 hover:shadow-md"
        style={{
          backgroundColor: `hsl(${color} / 0.05)`,
          borderColor: `hsl(${color} / 0.3)`,
        }}
      >
        <CollapsibleTrigger asChild>
          <div className="p-3 cursor-pointer flex items-center justify-between group">
            <div className="flex items-center gap-3 flex-1">
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                style={{ color: `hsl(${color})` }}
              />
              <span className="font-semibold">{feature.name}</span>
            </div>
            
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onToggleFavorite}
              >
                <Star 
                  className="w-4 h-4" 
                  fill={isFavorited ? 'currentColor' : 'none'}
                  style={{ color: `hsl(${color})` }}
                />
              </Button>
              
              {canEdit && onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={onEdit}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
              
              {canDelete && onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  onClick={onDelete}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-3 pb-3 space-y-3">
            {feature.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            )}
            
            {feature.actions && feature.actions.length > 0 && onRollAction && (
              <RollableActionChips
                actions={feature.actions}
                onRollAction={(action, rollIndex, advMode, situational) => 
                  onRollAction(action, rollIndex, advMode, situational)
                }
              />
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
