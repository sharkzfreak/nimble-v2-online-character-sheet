import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AbilityCircleProps {
  name: string;
  abbreviation: string;
  modifier: number;
  color: string;
  tooltip?: string;
  onAbilityCheck: () => void;
  onSavingThrow: () => void;
}

export const AbilityCircle = ({
  name,
  abbreviation,
  modifier,
  color,
  tooltip,
  onAbilityCheck,
  onSavingThrow,
}: AbilityCircleProps) => {
  const [showAdvantage, setShowAdvantage] = useState(false);
  const [showDisadvantage, setShowDisadvantage] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const getModifierString = (mod: number): string => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const modString = getModifierString(modifier);

  const handleCircleClick = () => {
    setShowDialog(true);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center group relative">
              {/* Advantage/Disadvantage Arrows */}
              <div className="absolute -top-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAdvantage(!showAdvantage);
                    setShowDisadvantage(false);
                  }}
                  className={`p-1 rounded transition-colors ${
                    showAdvantage ? 'bg-green-500/20 text-green-500' : 'hover:bg-accent'
                  }`}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDisadvantage(!showDisadvantage);
                    setShowAdvantage(false);
                  }}
                  className={`p-1 rounded transition-colors ${
                    showDisadvantage ? 'bg-red-500/20 text-red-500' : 'hover:bg-accent'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Main Circle */}
              <div 
                onClick={handleCircleClick}
                className="relative w-28 h-28 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-300 hover:scale-110 cursor-pointer"
                style={{
                  backgroundColor: `hsl(${color} / 0.15)`,
                  borderColor: `hsl(${color})`,
                  boxShadow: `0 0 30px hsl(${color} / 0.5), inset 0 0 20px hsl(${color} / 0.15)`
                }}
              >
                <div className="text-xs font-bold uppercase tracking-wider opacity-80 font-cinzel">{abbreviation}</div>
                <div className="text-5xl md:text-6xl font-bold" style={{ color: `hsl(${color})` }}>{modString}</div>
                
                {/* Advantage/Disadvantage Indicator */}
                {(showAdvantage || showDisadvantage) && (
                  <div className="absolute -bottom-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{
                    backgroundColor: showAdvantage ? 'hsl(142 76% 36%)' : 'hsl(0 84% 60%)',
                    color: 'white'
                  }}>
                    {showAdvantage ? 'ADV' : 'DIS'}
                  </div>
                )}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-card border-border max-w-xs">
            <p className="font-semibold font-cinzel">{name}</p>
            <p className="text-xs text-muted-foreground">Modifier: {modString}</p>
            <p className="text-xs text-muted-foreground mt-1">Click for ability check or saving throw</p>
            {tooltip && <p className="text-xs text-muted-foreground mt-1">{tooltip}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Roll Type Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>
              Choose the type of roll to make
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => {
                onAbilityCheck();
                setShowDialog(false);
              }}
              size="lg"
              className="w-full"
            >
              Ability Check
            </Button>
            <Button
              onClick={() => {
                onSavingThrow();
                setShowDialog(false);
              }}
              size="lg"
              variant="outline"
              className="w-full"
            >
              Saving Throw
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
