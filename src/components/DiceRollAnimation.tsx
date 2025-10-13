import { useEffect, useState } from "react";

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

// SVG Icons for each dice type
const DiceIcon = ({ type, className }: { type: string; className?: string }) => {
  const icons: Record<string, JSX.Element> = {
    d4: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 2L2 19.5h20L12 2z" />
        <text x="12" y="15" textAnchor="middle" fontSize="8" fill="currentColor">4</text>
      </svg>
    ),
    d6: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <circle cx="8" cy="8" r="1" fill="currentColor" />
        <circle cx="16" cy="8" r="1" fill="currentColor" />
        <circle cx="8" cy="16" r="1" fill="currentColor" />
        <circle cx="16" cy="16" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
    d8: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 2L2 12L12 22L22 12L12 2z" />
        <text x="12" y="14" textAnchor="middle" fontSize="8" fill="currentColor">8</text>
      </svg>
    ),
    d10: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 2L3 8v8l9 6l9-6V8l-9-6z" />
        <text x="12" y="14" textAnchor="middle" fontSize="7" fill="currentColor">10</text>
      </svg>
    ),
    d12: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 2l3.5 2.5L19 3l1.5 4.5L22 12l-2 4.5L18 21l-4.5-.5L12 22l-3.5-1.5L4 21l-1.5-4.5L2 12l2-4.5L6 3l4.5 1.5L12 2z" />
        <text x="12" y="14" textAnchor="middle" fontSize="7" fill="currentColor">12</text>
      </svg>
    ),
    d20: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 2l6 4v4l-6 10l-6-10V6l6-4z" />
        <path d="M12 2v8M6 6l6 4M18 6l-6 4M6 14l6 6M18 14l-6 6" />
        <text x="12" y="13" textAnchor="middle" fontSize="6" fill="currentColor">20</text>
      </svg>
    ),
  };
  
  return icons[type] || icons.d20;
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
      setShowResultBar(false);
      return;
    }

    // Stage 1: Rolling animation (2 seconds)
    const rollingInterval = setInterval(() => {
      const maxSides = parseInt(diceType.substring(1)) || 20;
      setCurrentNumber(Math.ceil(Math.random() * maxSides));
    }, 50);

    const rollingTimer = setTimeout(() => {
      clearInterval(rollingInterval);
      setCurrentNumber(result);
    }, 2000);

    // Stage 2: Settling phase (0.5 seconds after rolling stops)
    const settlingTimer = setTimeout(() => {
      setStage("result");
    }, 2500);

    // Stage 3: Show result bar and complete (0.3 seconds after result appears)
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
    }, 2800);

    return () => {
      clearInterval(rollingInterval);
      clearTimeout(rollingTimer);
      clearTimeout(settlingTimer);
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
              <DiceIcon type={diceType} className={`w-5 h-5 ${diceColor}`} />
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
              className={`relative w-32 h-32 flex items-center justify-center transition-all duration-500 ${
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

              {/* Dice Icon - Background Layer */}
              <div
                className={`relative z-10 transition-transform duration-500 ${
                  stage === "rolling" ? "animate-spin" : "scale-110"
                }`}
              >
                <DiceIcon
                  type={diceType}
                  className={`w-24 h-24 ${
                    isNatural20
                      ? "text-yellow-400"
                      : isNatural1
                      ? "text-red-400"
                      : diceColor
                  }`}
                />
              </div>

              {/* Number Display - Always on Top */}
              <div
                className={`absolute inset-0 z-[110] flex items-center justify-center transition-all duration-300 ${
                  stage === "rolling" ? "scale-75 opacity-80" : "scale-100 opacity-100"
                }`}
              >
                <span
                  className={`text-5xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ${
                    isNatural20
                      ? "text-yellow-400"
                      : isNatural1
                      ? "text-red-400"
                      : "text-primary-foreground"
                  } ${stage === "rolling" ? "blur-sm" : "blur-0"}`}
                >
                  {currentNumber}
                </span>
              </div>
            </div>

            {/* Dice Type Label with Specific Icon - Always on Top */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[110] bg-background/40 backdrop-blur-sm px-4 py-2 rounded-lg">
              <DiceIcon type={diceType} className={`w-8 h-8 ${diceColor}`} />
              <div className="text-sm font-semibold text-foreground">
                {diceType.toUpperCase()}
              </div>
            </div>

            {/* Rolling Text Overlay - Always on Top */}
            {stage === "rolling" && (
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-[110] bg-background/40 backdrop-blur-sm px-6 py-2 rounded-lg">
                <div className="text-lg font-medium text-primary animate-pulse">
                  Rolling...
                </div>
              </div>
            )}
          </div>

          {/* Result Display - Always on Top with backdrop */}
          {stage === "result" && (
            <div className="flex flex-col items-center gap-3 animate-fade-in z-[110] bg-background/40 backdrop-blur-sm px-8 py-4 rounded-xl">
              <div className="text-lg font-medium text-foreground">{statName}</div>
              <div
                className={`text-5xl font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] ${
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
                <div className="text-base text-muted-foreground font-medium">
                  ({result} {modifier > 0 ? "+" : ""} {modifier})
                </div>
              )}
              {isNatural20 && (
                <div className="text-yellow-400 text-lg font-semibold animate-bounce mt-2">
                  ✨ Natural 20! ✨
                </div>
              )}
              {isNatural1 && (
                <div className="text-red-400 text-lg font-semibold animate-bounce mt-2">
                  💀 Critical Fail! 💀
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
