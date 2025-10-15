import { ActionSpec, RollBinding, AdvMode } from '@/types/rollable';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface RollableActionChipsProps {
  actions: ActionSpec[];
  onRollAction: (action: ActionSpec, rollIndex: number, advMode: AdvMode, situational: number) => void;
  className?: string;
}

export const RollableActionChips = ({ actions, onRollAction, className = '' }: RollableActionChipsProps) => {
  const [advMode, setAdvMode] = useState<AdvMode>('normal');
  const [situational, setSituational] = useState(0);

  if (!actions || actions.length === 0) return null;

  const formatChipLabel = (action: ActionSpec, roll: RollBinding): string => {
    const parts = [action.label];
    
    if (roll.ability) {
      parts.push(`+${roll.ability}`);
    }
    
    if (roll.die && (roll.kind === 'damage' || roll.kind === 'healing')) {
      parts.push(roll.die);
    }
    
    if (typeof roll.dc === 'number') {
      parts.push(`DC ${roll.dc}`);
    } else if (roll.dc?.value) {
      parts.push(`DC ${roll.dc.value}`);
    }

    return parts.join(' ');
  };

  const getChipColor = (kind: RollBinding['kind']): string => {
    const colorMap: Record<RollBinding['kind'], string> = {
      attack: 'hsl(0 70% 55%)',
      save: 'hsl(220 80% 60%)',
      check: 'hsl(280 70% 65%)',
      damage: 'hsl(25 95% 53%)',
      healing: 'hsl(120 60% 50%)',
    };
    return colorMap[kind] || 'hsl(var(--primary))';
  };

  return (
    <div className={`flex flex-wrap gap-2 mt-2 ${className}`}>
      {actions.map((action) =>
        action.rolls.map((roll, rollIndex) => {
          const chipLabel = formatChipLabel(action, roll);
          const chipColor = getChipColor(roll.kind);

          return (
            <TooltipProvider key={`${action.id}-${rollIndex}`}>
              <Tooltip>
                <div className="flex items-center gap-1">
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRollAction(action, rollIndex, advMode, situational)}
                      className="h-7 text-xs font-medium px-2 border-2 hover:scale-105 transition-transform"
                      style={{
                        borderColor: chipColor,
                        color: chipColor,
                      }}
                      aria-label={`Roll ${chipLabel}`}
                    >
                      {chipLabel}
                    </Button>
                  </TooltipTrigger>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-5 p-0"
                        aria-label="Roll options"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setAdvMode('adv')}>
                        {advMode === 'adv' && '✓ '}Advantage
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setAdvMode('dis')}>
                        {advMode === 'dis' && '✓ '}Disadvantage
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setAdvMode('normal')}>
                        {advMode === 'normal' && '✓ '}Normal
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSituational(0)}>
                        {situational === 0 && '✓ '}No Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSituational(2)}>
                        {situational === 2 && '✓ '}+2
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSituational(1)}>
                        {situational === 1 && '✓ '}+1
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSituational(-1)}>
                        {situational === -1 && '✓ '}-1
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSituational(-2)}>
                        {situational === -2 && '✓ '}-2
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <TooltipContent>
                  <div className="text-xs max-w-xs">
                    <p className="font-semibold">{action.label}</p>
                    <p className="text-muted-foreground">
                      {roll.die || '1d20'} {roll.ability ? `+ ${roll.ability}` : ''}
                      {roll.flat ? ` ${roll.flat >= 0 ? '+' : ''}${roll.flat}` : ''}
                    </p>
                    {roll.notes && <p className="mt-1 italic">{roll.notes}</p>}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })
      )}
    </div>
  );
};
