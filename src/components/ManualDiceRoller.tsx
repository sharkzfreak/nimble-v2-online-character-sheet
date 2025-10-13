import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dices } from "lucide-react";
import { useDiceLog } from "@/contexts/DiceLogContext";
import { DiceRollToast } from "./DiceRollToast";

interface ManualDiceRollerProps {
  characterName?: string;
  characterId?: string;
}

export const ManualDiceRoller = ({ characterName = "Manual Roll", characterId }: ManualDiceRollerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numDice, setNumDice] = useState(1);
  const [diceType, setDiceType] = useState("d20");
  const [modifier, setModifier] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [lastRoll, setLastRoll] = useState({ roll: 0, total: 0 });
  const { addLog } = useDiceLog();

  const diceTypes = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"];

  const handleRoll = () => {
    const sides = parseInt(diceType.substring(1));
    let total = 0;
    
    // Roll multiple dice if needed
    for (let i = 0; i < numDice; i++) {
      total += Math.ceil(Math.random() * sides);
    }
    
    const finalTotal = total + modifier;
    const formula = `${numDice}${diceType}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}`;

    setLastRoll({ roll: total, total: finalTotal });
    setShowToast(true);

    // Log the roll
    addLog({
      character_name: characterName,
      character_id: characterId || null,
      formula,
      raw_result: total,
      modifier,
      total: finalTotal,
      roll_type: 'manual',
    });

    console.log(`Manual roll: ${formula} = ${total} + ${modifier} = ${finalTotal}`);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-4 left-4 z-40 h-14 w-14 rounded-full shadow-[var(--shadow-glow)] bg-gradient-to-br from-primary to-accent hover:scale-110 transition-transform"
          >
            <Dices className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-cinzel">
              <Dices className="w-5 h-5 text-primary" />
              Roll Dice
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numDice">Number of Dice</Label>
                <Input
                  id="numDice"
                  type="number"
                  min="1"
                  max="10"
                  value={numDice}
                  onChange={(e) => setNumDice(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diceType">Dice Type</Label>
                <Select value={diceType} onValueChange={setDiceType}>
                  <SelectTrigger id="diceType" className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {diceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modifier">Modifier</Label>
              <Input
                id="modifier"
                type="number"
                value={modifier}
                onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="bg-background/50"
              />
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-background/40 to-background/60 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Formula:</p>
              <p className="text-lg font-bold text-primary font-mono">
                {numDice}{diceType}{modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}
              </p>
            </div>
            <Button
              onClick={handleRoll}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              size="lg"
            >
              <Dices className="w-5 h-5 mr-2" />
              Roll!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showToast && (
        <DiceRollToast
          statName="Manual Roll"
          roll={lastRoll.roll}
          modifier={modifier}
          total={lastRoll.total}
          diceType={`${numDice}${diceType}`}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};
