import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dices } from "lucide-react";

const DiceRoller = () => {
  const [result, setResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  const rollDice = (sides: number) => {
    setRolling(true);
    
    // Animate the roll
    let count = 0;
    const interval = setInterval(() => {
      setResult(Math.floor(Math.random() * sides) + 1);
      count++;
      
      if (count >= 10) {
        clearInterval(interval);
        setResult(Math.floor(Math.random() * sides) + 1);
        setRolling(false);
      }
    }, 50);
  };

  return (
    <Card className="bg-card border-border shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Dices className="w-5 h-5 text-primary" />
          Dice Roller
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {result !== null && (
            <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-primary to-accent rounded-lg shadow-[var(--shadow-glow)]">
              <span className="text-5xl font-bold text-primary-foreground">
                {result}
              </span>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2 w-full">
            {[4, 6, 8, 10, 12, 20].map((sides) => (
              <Button
                key={sides}
                onClick={() => rollDice(sides)}
                disabled={rolling}
                variant="outline"
                className="hover:bg-primary/10 transition-all"
              >
                d{sides}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiceRoller;
