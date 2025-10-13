import { Heart, Shield, Footprints, Plus, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AnimatedStatContainerProps {
  type: "health" | "defense" | "speed";
  value: number | string;
  maxValue?: number;
  label: string;
  tooltip?: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export const AnimatedStatContainer = ({
  type,
  value,
  maxValue,
  label,
  tooltip,
  onIncrement,
  onDecrement,
}: AnimatedStatContainerProps) => {
  const getIconAndStyle = () => {
    switch (type) {
      case "health":
        return {
          Icon: Heart,
          color: "0 84% 60%", // Red for HP
        };
      case "defense":
        return {
          Icon: Shield,
          color: "217 91% 60%", // Blue for Defense
        };
      case "speed":
        return {
          Icon: Footprints,
          color: "142 71% 45%", // Green for Speed
        };
    }
  };

  const { Icon, color } = getIconAndStyle();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            {/* Icon Container (no box, icon IS the container) */}
            <div className="relative flex items-center justify-center">
              <Icon
                className="w-10 h-10 md:w-12 md:h-12 transition-all duration-300 hover:scale-110 cursor-pointer"
                style={{ color: `hsl(${color})`, fill: `hsl(${color} / 0.2)` }}
                strokeWidth={2}
              />
              
              {/* Value centered inside icon */}
              <div
                className="absolute text-sm md:text-base font-bold font-cinzel pointer-events-none"
                style={{
                  color: type === "health" ? "hsl(var(--background))" : `hsl(${color})`,
                  textShadow: type === "health" 
                    ? "0 0 4px rgba(0,0,0,0.5)" 
                    : `0 0 8px hsl(${color} / 0.5)`,
                }}
              >
                {typeof value === 'number' ? value : value.toString().split(' ')[0]}
              </div>
            </div>

            {/* HP Controls */}
            {type === "health" && maxValue && (
              <div className="flex items-center gap-1.5">
                <span className="text-sm md:text-base font-medium text-muted-foreground">
                  / {maxValue}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDecrement?.();
                  }}
                  className="p-1 rounded hover:bg-muted transition-colors"
                  style={{ color: `hsl(${color})` }}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onIncrement?.();
                  }}
                  className="p-1 rounded hover:bg-muted transition-colors"
                  style={{ color: `hsl(${color})` }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent className="bg-card border-border">
            <p className="text-sm font-medium">{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
