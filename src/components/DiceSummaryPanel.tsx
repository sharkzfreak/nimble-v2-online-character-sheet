interface DiceSummaryPanelProps {
  diceType: string;
  rolls: number[];
  diceColor: string;
}

const diceColors: Record<string, string> = {
  d4: "text-teal-400",
  d6: "text-blue-400",
  d8: "text-violet-400",
  d10: "text-red-400",
  d12: "text-yellow-400",
  d20: "text-green-400",
};

export const DiceSummaryPanel = ({ diceType, rolls, diceColor }: DiceSummaryPanelProps) => {
  const maxSides = parseInt(diceType.substring(1)) || 20;
  
  return (
    <div className="bg-background/40 backdrop-blur-sm px-6 py-4 rounded-xl border border-primary/20">
      <div className="flex flex-wrap gap-3 justify-center items-center">
        {rolls.map((roll, index) => {
          const isCritSuccess = roll === maxSides;
          const isCritFail = roll === 1;
          
          return (
            <div
              key={index}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                isCritSuccess
                  ? "bg-yellow-500/20 ring-2 ring-yellow-400"
                  : isCritFail
                  ? "bg-red-500/20 ring-2 ring-red-400"
                  : "bg-background/60"
              }`}
            >
              {/* Individual die result */}
              <div
                className={`text-2xl font-bold ${
                  isCritSuccess
                    ? "text-yellow-400"
                    : isCritFail
                    ? "text-red-400"
                    : diceColor
                }`}
              >
                {roll}
              </div>
              
              {/* Critical indicator */}
              {isCritSuccess && (
                <div className="text-xs text-yellow-400 font-semibold">✨ Max</div>
              )}
              {isCritFail && (
                <div className="text-xs text-red-400 font-semibold">💀 Fail</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
