import { Heart, Shield, Footprints, LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AnimatedStatContainerProps {
  type: "health" | "defense" | "speed";
  value: number | string;
  label: string;
  tooltip?: string;
}

export const AnimatedStatContainer = ({
  type,
  value,
  label,
  tooltip,
}: AnimatedStatContainerProps) => {
  const getIconAndStyle = () => {
    switch (type) {
      case "health":
        return {
          Icon: Heart,
          color: "220 70% 50%",
          animationClass: "animate-[pulse_3s_ease-in-out_infinite]",
          glowAnimation: "animate-[pulse_3s_ease-in-out_infinite]",
        };
      case "defense":
        return {
          Icon: Shield,
          color: "200 80% 50%",
          animationClass: "animate-[shimmer_4s_ease-in-out_infinite]",
          glowAnimation: "animate-[shimmer_4s_ease-in-out_infinite]",
        };
      case "speed":
        return {
          Icon: Footprints,
          color: "150 60% 50%",
          animationClass: "animate-[bounce_2s_ease-in-out_infinite]",
          glowAnimation: "animate-[bounce_2s_ease-in-out_infinite]",
        };
    }
  };

  const { Icon, color, animationClass, glowAnimation } = getIconAndStyle();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center group cursor-pointer">
            {/* Container with icon background */}
            <div
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center border-3 transition-all duration-500 hover:scale-110 overflow-hidden"
              style={{
                backgroundColor: `hsl(${color} / 0.1)`,
                borderColor: `hsl(${color})`,
                boxShadow: `0 0 30px hsl(${color} / 0.5), inset 0 0 20px hsl(${color} / 0.15)`,
              }}
            >
              {/* Animated background glow */}
              <div
                className={`absolute inset-0 ${glowAnimation} opacity-30`}
                style={{
                  background: `radial-gradient(circle at 50% 50%, hsl(${color} / 0.4), transparent 70%)`,
                }}
              />

              {/* Icon as large background element */}
              <Icon
                className={`w-14 h-14 md:w-18 md:h-18 opacity-20 absolute ${animationClass}`}
                style={{ color: `hsl(${color})` }}
                strokeWidth={1.5}
              />

              {/* Value */}
              <div
                className="text-3xl md:text-4xl font-bold font-cinzel relative z-10 drop-shadow-lg"
                style={{
                  color: `hsl(${color})`,
                  textShadow: `0 0 20px hsl(${color} / 0.8), 0 2px 4px rgba(0,0,0,0.5)`,
                }}
              >
                {value}
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-500 rounded-2xl" />
            </div>

            {/* Label */}
            <span
              className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-semibold mt-1.5 font-cinzel"
              style={{
                textShadow: `0 0 10px hsl(${color} / 0.3)`,
              }}
            >
              {label}
            </span>
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
