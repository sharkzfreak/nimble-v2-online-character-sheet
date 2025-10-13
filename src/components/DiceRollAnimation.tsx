import { useEffect, useState, useMemo } from "react";
import { DiceSummaryPanel } from "./DiceSummaryPanel";

interface DiceRollAnimationProps {
  diceType: string;
  result: number | number[]; // Support single or multiple dice
  modifier: number;
  total: number;
  isVisible: boolean;
  onComplete: () => void;
  statName?: string;
  characterName?: string;
  diceCount?: number; // Number of dice rolled (for multi-dice)
}

const diceColors: Record<string, string> = {
  d4: "text-teal-400",
  d6: "text-blue-400",
  d8: "text-violet-400",
  d10: "text-red-400",
  d12: "text-yellow-400",
  d20: "text-green-400",
};

// SVG Icons for each dice type - accurate geometric representations
const DiceIcon = ({ type, className }: { type: string; className?: string }) => {
  const icons: Record<string, JSX.Element> = {
    d4: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        {/* Tetrahedron - triangular pyramid */}
        <path d="M12 3 L21 19 L3 19 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M12 3 L21 19 M12 3 L3 19 M3 19 L21 19" />
      </svg>
    ),
    d6: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        {/* Cube - standard die */}
        <path d="M4 8 L12 4 L20 8 L20 16 L12 20 L4 16 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M4 8 L12 4 L20 8 M4 8 L4 16 M20 8 L20 16 M4 16 L12 20 M20 16 L12 20 M12 4 L12 12 M4 8 L12 12 M20 8 L12 12" />
      </svg>
    ),
    d8: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        {/* Octahedron - diamond shape */}
        <path d="M12 2 L20 12 L12 22 L4 12 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M12 2 L20 12 L12 22 L4 12 L12 2 M12 2 L12 22 M4 12 L20 12" />
      </svg>
    ),
    d10: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        {/* Pentagonal trapezohedron */}
        <path d="M12 2 L18 7 L20 13 L15 20 L9 20 L4 13 L6 7 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M12 2 L18 7 M18 7 L20 13 M20 13 L15 20 M15 20 L9 20 M9 20 L4 13 M4 13 L6 7 M6 7 L12 2 M12 2 L12 22 M6 7 L15 20 M18 7 L9 20" />
      </svg>
    ),
    d12: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        {/* Dodecahedron - 12 sided */}
        <path d="M12 2 L17 5 L21 9 L21 15 L17 19 L12 22 L7 19 L3 15 L3 9 L7 5 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M12 2 L17 5 L21 9 L21 15 L17 19 L12 22 L7 19 L3 15 L3 9 L7 5 L12 2 M12 2 L12 8 M17 5 L15 11 M21 9 L15 11 M21 15 L15 13 M17 19 L15 13 M12 22 L12 16 M7 19 L9 13 M3 15 L9 13 M3 9 L9 11 M7 5 L9 11 M9 11 L15 11 M15 11 L15 13 M15 13 L9 13 M9 13 L9 11 M12 8 L15 11 M12 8 L9 11 M12 16 L15 13 M12 16 L9 13" />
      </svg>
    ),
    d20: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        {/* Icosahedron - true 20-sided die */}
        <path d="M12 2 L19 6 L22 12 L19 18 L12 22 L5 18 L2 12 L5 6 Z" fill="currentColor" fillOpacity="0.1" />
        {/* Top pentagon */}
        <path d="M12 2 L19 6 L16 10 L8 10 L5 6 Z" />
        {/* Bottom pentagon */}
        <path d="M12 22 L19 18 L16 14 L8 14 L5 18 Z" />
        {/* Connecting edges */}
        <path d="M12 2 L12 10 M19 6 L16 10 M22 12 L16 10 M22 12 L16 14 M19 18 L16 14 M12 22 L12 14 M5 18 L8 14 M2 12 L8 14 M2 12 L8 10 M5 6 L8 10 M8 10 L16 10 M8 14 L16 14 M12 10 L12 14" />
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
  diceCount = 1,
}: DiceRollAnimationProps) => {
  const [stage, setStage] = useState<"rolling" | "result" | "complete">("rolling");
  const [currentNumber, setCurrentNumber] = useState(1);
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([]);
  const [showResultBar, setShowResultBar] = useState(false);
  
  // Memoize derived values to prevent infinite loops
  const isMultiDice = useMemo(() => Array.isArray(result), [result]);
  const results = useMemo(() => (isMultiDice ? result as number[] : [result as number]), [result, isMultiDice]);
  const maxSides = useMemo(() => parseInt(diceType.substring(1)) || 20, [diceType]);

  useEffect(() => {
    if (!isVisible) {
      setStage("rolling");
      setCurrentNumber(1);
      setCurrentNumbers([]);
      setShowResultBar(false);
      return;
    }

    console.log("Starting dice animation...");
    let isCleanedUp = false;

    // Initialize multi-dice numbers
    if (isMultiDice) {
      setCurrentNumbers(Array(results.length).fill(1));
    }

    // Stage 1: Rolling animation (1.3 seconds - faster!)
    const rollingInterval = setInterval(() => {
      if (isCleanedUp) return;
      
      if (isMultiDice) {
        setCurrentNumbers(Array(results.length).fill(0).map(() => Math.ceil(Math.random() * maxSides)));
      } else {
        setCurrentNumber(Math.ceil(Math.random() * maxSides));
      }
    }, 50);

    // Stage 2: Stop rolling and show final numbers (after 1.3s)
    const rollingTimer = setTimeout(() => {
      if (isCleanedUp) return;
      clearInterval(rollingInterval);
      
      if (isMultiDice) {
        setCurrentNumbers(results);
      } else {
        setCurrentNumber(results[0]);
      }
      console.log("Dice stopped rolling, showing result...");
    }, 1300);

    // Stage 3: Settle phase - transition to result display (after 1.5s total)
    const settlingTimer = setTimeout(() => {
      if (isCleanedUp) return;
      setStage("result");
      console.log("Showing result display...");
    }, 1500);

    // Failsafe: Force completion after maximum time
    const failsafeTimer = setTimeout(() => {
      if (isCleanedUp) return;
      console.log("Failsafe triggered - forcing animation end");
      clearInterval(rollingInterval);
      setStage("complete");
      onComplete();
    }, 6000);

    // Cleanup function
    return () => {
      isCleanedUp = true;
      clearInterval(rollingInterval);
      clearTimeout(rollingTimer);
      clearTimeout(settlingTimer);
      clearTimeout(failsafeTimer);
    };
  }, [isVisible, diceType, onComplete]);

  if (!isVisible) return null;

  const diceColor = diceColors[diceType] || "text-primary";
  const formula = isMultiDice 
    ? `${results.length}${diceType}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`
    : `${diceType}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`;
  
  // For single die
  const singleResult = isMultiDice ? 0 : results[0];
  const isCriticalFail = !isMultiDice && singleResult === 1;
  const isCriticalSuccess = !isMultiDice && singleResult === maxSides;
  
  // Check if any die in multi-roll is critical
  const hasCriticals = isMultiDice && results.some(r => r === 1 || r === maxSides);
  const critSuccessCount = isMultiDice ? results.filter(r => r === maxSides).length : 0;
  const critFailCount = isMultiDice ? results.filter(r => r === 1).length : 0;
  
  const handleContinue = () => {
    console.log("Continue button clicked - ending animation");
    setShowResultBar(true);
    setStage("complete");
    
    // Hide result bar after 3.5 seconds
    setTimeout(() => {
      setShowResultBar(false);
    }, 3500);
    
    // Complete the animation
    setTimeout(() => {
      onComplete();
    }, 300);
  };

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
                <span className={`text-xl font-bold ${isCriticalSuccess ? "text-yellow-400" : isCriticalFail ? "text-red-400" : "text-primary"}`}>
                  {total}
                </span>
                {" "}
                <span className="text-muted-foreground text-sm">({formula})</span>
              </span>
              {isCriticalSuccess && <span className="text-yellow-400">✨</span>}
              {isCriticalFail && <span className="text-red-400">💀</span>}
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
              className={`relative w-32 h-32 flex items-center justify-center transition-all duration-500 ease-out ${
                stage === "rolling" ? "animate-bounce" : stage === "result" ? "scale-105" : ""
              }`}
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ease-out ${
                  isCriticalSuccess
                    ? "bg-yellow-500/50 animate-pulse"
                    : isCriticalFail
                    ? "bg-red-500/50 animate-pulse"
                    : "bg-primary/30"
                }`}
              />

              {/* Dice Icon - Background Layer */}
              <div
                className={`relative z-10 transition-all duration-700 ease-[cubic-bezier(0.15,0.85,0.35,1.0)] ${
                  stage === "rolling" ? "animate-spin" : stage === "result" ? "scale-110" : "scale-100"
                }`}
              >
                <DiceIcon
                  type={diceType}
                  className={`w-24 h-24 ${
                    isCriticalSuccess
                      ? "text-yellow-400"
                      : isCriticalFail
                      ? "text-red-400"
                      : diceColor
                  }`}
                />
              </div>

              {/* Number Display - Always on Top */}
              <div
                className={`absolute inset-0 z-[110] flex items-center justify-center transition-all duration-500 ease-out ${
                  stage === "rolling" ? "scale-75 opacity-80" : stage === "result" ? "scale-110 opacity-100" : "scale-100 opacity-100"
                }`}
              >
                <span
                  className={`text-5xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ${
                    isCriticalSuccess
                      ? "text-yellow-400"
                      : isCriticalFail
                      ? "text-red-400"
                      : "text-primary-foreground"
                  } transition-all duration-500 ${stage === "rolling" ? "blur-sm" : "blur-0"}`}
                >
                  {isMultiDice ? (currentNumbers[0] || 1) : currentNumber}
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
            <div className="flex flex-col items-center gap-4 animate-fade-in z-[110]">
              <div className="bg-background/40 backdrop-blur-sm px-8 py-4 rounded-xl">
                <div className="text-lg font-medium text-foreground mb-2">{statName}</div>
                
                {/* Multi-Dice Summary Panel */}
                {isMultiDice && (
                  <div className="mb-4">
                    <DiceSummaryPanel 
                      diceType={diceType}
                      rolls={results}
                      diceColor={diceColor}
                    />
                  </div>
                )}
                
                {/* Total Result */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`text-5xl font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] ${
                      isCriticalSuccess
                        ? "text-yellow-400 animate-pulse"
                        : isCriticalFail
                        ? "text-red-400 animate-pulse"
                        : hasCriticals
                        ? "text-primary animate-pulse"
                        : "text-primary"
                    }`}
                  >
                    {total}
                  </div>
                  
                  {modifier !== 0 && (
                    <div className="text-base text-muted-foreground font-medium">
                      ({isMultiDice ? results.reduce((a, b) => a + b, 0) : results[0]} {modifier > 0 ? "+" : ""} {modifier})
                    </div>
                  )}
                  
                  {/* Critical messages */}
                  {isCriticalSuccess && (
                    <div className="text-yellow-400 text-lg font-semibold animate-bounce mt-2">
                      ✨ Critical Success! ({diceType.toUpperCase()} max roll) ✨
                    </div>
                  )}
                  {isCriticalFail && (
                    <div className="text-red-400 text-lg font-semibold animate-bounce mt-2">
                      💀 Critical Fail! 💀
                    </div>
                  )}
                  
                  {/* Multi-dice critical summary */}
                  {isMultiDice && hasCriticals && (
                    <div className="text-sm font-medium mt-2">
                      {critSuccessCount > 0 && (
                        <span className="text-yellow-400">
                          ✨ {critSuccessCount} Critical Success{critSuccessCount > 1 ? 'es' : ''}
                        </span>
                      )}
                      {critSuccessCount > 0 && critFailCount > 0 && <span className="text-muted-foreground"> • </span>}
                      {critFailCount > 0 && (
                        <span className="text-red-400">
                          💀 {critFailCount} Critical Fail{critFailCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="mt-4 px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
