import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { RollableActionChips } from './RollableActionChips';
import { ActionSpec, AdvMode, FeatureLike } from '@/types/rollable';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface FeatureCardProps {
  feature: FeatureLike;
  type: 'attack' | 'feature' | 'spell' | 'item';
  onRollAction: (action: ActionSpec, rollIndex: number, advMode: AdvMode, situational: number) => void;
  onToggleFavorite?: (featureId: string) => void;
  isFavorited?: boolean;
  showType?: boolean;
}

export const FeatureCard = ({
  feature,
  type,
  onRollAction,
  onToggleFavorite,
  isFavorited = false,
  showType = false,
}: FeatureCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getTypeIcon = () => {
    if (type === 'spell') return '✨';
    if (type === 'item') return '📦';
    return '⚡';
  };

  const getTypeColor = () => {
    if (type === 'spell') return 'hsl(280 70% 65%)';
    if (type === 'item') return 'hsl(25 95% 53%)';
    return 'hsl(220 80% 60%)';
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${getTypeColor()} 0%, transparent 100%)`,
        }}
      />

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{getTypeIcon()}</span>
                <CardTitle className="text-base font-semibold truncate">
                  {feature.name}
                </CardTitle>
                {showType && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {type}
                  </Badge>
                )}
              </div>
              
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  {isOpen ? (
                    <>
                      Hide Details <ChevronUp className="ml-1 h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Show Details <ChevronDown className="ml-1 h-3 w-3" />
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(feature.id);
                }}
                className="flex-shrink-0 h-8 w-8 p-0 hover:bg-accent"
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star
                  className={`h-4 w-4 transition-all ${
                    isFavorited
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-muted-foreground hover:text-yellow-500'
                  }`}
                />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <CollapsibleContent>
            {feature.description && (
              <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
                {feature.description}
              </p>
            )}
          </CollapsibleContent>

          {feature.actions && feature.actions.length > 0 && (
            <RollableActionChips
              actions={feature.actions}
              onRollAction={onRollAction}
            />
          )}
        </CardContent>
      </Collapsible>
    </Card>
  );
};
