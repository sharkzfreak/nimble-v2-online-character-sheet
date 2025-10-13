import { useEffect, useState } from "react";
import { Dices } from "lucide-react";

interface DiceRollAnimationProps {
  diceType: string;
  result: number;
  modifier: number;
  total: number;
  isVisible: boolean;
  onComplete: () => void;
  statName?: string;
  characterName?: string;
}

const diceColors: Record<string, string> = {
  d4: "text-teal-400",
  d6: "text-blue-400",
  d8: "text-violet-400",
  d10: "text-red-400",
  d12: "text-yellow-400",
  d20: "text-green-400",
};

export const DiceRollAnimation = ({
  diceType,
  result,
  modifier,
  total,
  isVisible,
  onComplete,
  statName = "Roll",
  characterName = "Player",
}: DiceRollAnimationProps) => {
  const [stage, setStage] = useState<"rolling" | "result" | "complete">("rolling");
  const [currentNumber, setCurrentNumber] = useState(1);
  const [showResultBar, setShowResultBar] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setStage("rolling");
      setCurrentNumber(1);
      return;
    }

    // Stage 1: Rolling animation (1 second)
    const rollingInterval = setInterval(() => {
      const maxSides = parseInt(diceType.substring(1)) || 20;
      setCurrentNumber(Math.ceil(Math.random() * maxSides));
    }, 50);

    const rollingTimer = setTimeout(() => {
      clearInterval(rollingInterval);
      setCurrentNumber(result);
      setStage("result");
    }, 1000);

    // Stage 2: Show result (1 second)
    const resultTimer = setTimeout(() => {
      setStage("complete");
      setShowResultBar(true);
      
      // Hide result bar after 3.5 seconds
      setTimeout(() => {
        setShowResultBar(false);
      }, 3500);
      
      setTimeout(() => {
        onComplete();
      }, 300);
    }, 2000);

    return () => {
      clearInterval(rollingInterval);
      clearTimeout(rollingTimer);
      clearTimeout(resultTimer);
    };
  }, [isVisible, result, diceType, onComplete]);

  if (!isVisible) return null;

  const isNatural1 = result === 1;
  const isNatural20 = result === 20 && diceType === "d20";
  const diceColor = diceColors[diceType] || "text-primary";
  const formula = `${diceType}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`;

  return (
    <>
      {/* Floating Result Bar */}
      {showResultBar && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[101] animate-slide-down">
          <div className="bg-background/70 backdrop-blur-md border border-primary/30 rounded-xl px-6 py-3 shadow-[var(--shadow-elegant)] animate-pulse-slow">
            <div className="flex items-center gap-3">
              <Dices className={`w-5 h-5 ${diceColor}`} />
              <span className="text-foreground font-semibold">
                {characterName} rolled{" "}
                <span className={`text-xl font-bold ${isNatural20 ? "text-yellow-400" : isNatural1 ? "text-red-400" : "text-primary"}`}>
                  {total}
                </span>
                {" "}
                <span className="text-muted-foreground text-sm">({formula})</span>
              </span>
              {isNatural20 && <span className="text-yellow-400">✨</span>}
              {isNatural1 && <span className="text-red-400">💀</span>}
            </div>
          </div>
        </div>
      )}

      {/* Main Animation Overlay */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in">
        <div className="relative flex flex-col items-center gap-6">
        {/* Rolling Tray */}
        <div className="relative">
          {/* Dice Container */}
          <div
            className={`relative w-32 h-32 flex items-center justify-center transition-all duration-300 ${
              stage === "rolling" ? "animate-bounce" : ""
            }`}
          >
            {/* Glow Effect */}
            <div
              className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
                isNatural20
                  ? "bg-yellow-500/50 animate-pulse"
                  : isNatural1
                  ? "bg-red-500/50 animate-pulse"
                  : "bg-primary/30"
              }`}
            />

            {/* Dice Icon */}
            <div
              className={`relative z-10 transition-transform duration-100 ${
                stage === "rolling" ? "animate-spin" : "scale-110"
              }`}
            >
              <Dices
                className={`w-24 h-24 ${
                  isNatural20
                    ? "text-yellow-400"
                    : isNatural1
                    ? "text-red-400"
                    : "text-primary"
                }`}
              />
            </div>

            {/* Number Display */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                stage === "rolling" ? "scale-75 opacity-80" : "scale-100 opacity-100"
              }`}
            >
              <span
                className={`text-5xl font-bold text-primary-foreground ${
                  stage === "rolling" ? "blur-sm" : "blur-0"
                }`}
              >
                {currentNumber}
              </span>
            </div>
          </div>

          {/* Dice Type Label with Icon */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            <Dices className={`w-6 h-6 ${diceColor}`} />
            <div className="text-sm font-semibold text-muted-foreground">
              {diceType.toUpperCase()}
            </div>
          </div>

          {/* Rolling Text Overlay */}
          {stage === "rolling" && (
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-lg font-medium text-primary animate-pulse">
              Rolling...
            </div>
          )}
        </div>

        {/* Result Display */}
        {stage === "result" && (
          <div className="flex flex-col items-center gap-2 animate-scale-in">
            <div className="text-lg font-medium text-muted-foreground">{statName}</div>
            <div
              className={`text-4xl font-bold ${
                isNatural20
                  ? "text-yellow-400 animate-pulse"
                  : isNatural1
                  ? "text-red-400 animate-pulse"
                  : "text-primary"
              }`}
            >
              {total}
            </div>
            {modifier !== 0 && (
              <div className="text-sm text-muted-foreground">
                ({result} {modifier > 0 ? "+" : ""} {modifier})
              </div>
            )}
            {isNatural20 && (
              <div className="text-yellow-400 font-semibold animate-bounce">
                ✨ Natural 20! ✨
              </div>
            )}
            {isNatural1 && (
              <div className="text-red-400 font-semibold animate-bounce">💀 Critical Fail! 💀</div>
            )}
          </div>
        )}
        </div>
      </div>
    </>
  );
};
