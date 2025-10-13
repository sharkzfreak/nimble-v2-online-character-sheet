import { Heart, Shield, Plus, Minus, Footprints } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AnimatedStatContainerProps {
  type: "health" | "armor" | "speed";
  value: number | string;
  maxValue?: number;
  label: string;
  tooltip?: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
  classColor?: string;
}

export const AnimatedStatContainer = ({
  type,
  value,
  maxValue,
  label,
  tooltip,
  onIncrement,
  onDecrement,
  classColor,
}: AnimatedStatContainerProps) => {
  const getIconAndStyle = () => {
    switch (type) {
      case "health":
        return {
          Icon: Heart,
          color: "0 84% 60%", // Red for HP
        };
      case "armor":
        return {
          Icon: Shield,
          color: "217 91% 60%", // Blue for Armor
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
          <div className="flex flex-col items-center gap-2 w-full">
            {/* Icon Container (no box, icon IS the container) */}
            <div className="relative flex items-center justify-center">
              <Icon
                className="w-16 h-16 md:w-20 md:h-20 transition-all duration-300 hover:scale-110 cursor-pointer"
                style={{ color: `hsl(${color})`, fill: `hsl(${color} / 0.2)` }}
                strokeWidth={2.5}
              />
              
              {/* Value centered inside icon */}
              <div
                className="absolute text-base md:text-lg font-bold font-cinzel pointer-events-none"
                style={{
                  color: type === "health" ? "hsl(var(--background))" : `hsl(${color})`,
                  textShadow: type === "health" 
                    ? "0 0 6px rgba(0,0,0,0.8)" 
                    : `0 0 10px hsl(${color} / 0.6)`,
                }}
              >
                {type === "health" && maxValue ? `${value}/${maxValue}` : value}
              </div>
            </div>

            {/* HP Controls */}
            {type === "health" && maxValue && (
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDecrement?.();
                  }}
                  className="p-1.5 rounded-md transition-all hover:scale-110"
                  style={{ 
                    backgroundColor: `hsl(${color} / 0.2)`,
                    color: `hsl(${color})`,
                    border: `1px solid hsl(${color} / 0.4)`
                  }}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onIncrement?.();
                  }}
                  className="p-1.5 rounded-md transition-all hover:scale-110"
                  style={{ 
                    backgroundColor: `hsl(${color} / 0.2)`,
                    color: `hsl(${color})`,
                    border: `1px solid hsl(${color} / 0.4)`
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {/* Label */}
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
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
