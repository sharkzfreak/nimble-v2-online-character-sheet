import { useState } from "react";
import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dices } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: any;
}

type StatName = 'strength' | 'dexterity' | 'intelligence' | 'will';

const POINT_BUY_POINTS = 27;
const POINT_BUY_COSTS: { [key: number]: number } = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export const BuilderStep3AbilityScores = ({ formData, setFormData }: BuilderStepProps) => {
  const [method, setMethod] = useState<'point-buy' | 'array' | 'roll'>('point-buy');
  const [availablePoints, setAvailablePoints] = useState(POINT_BUY_POINTS);
  const [arrayValues, setArrayValues] = useState([...STANDARD_ARRAY]);
  const [rolledValues, setRolledValues] = useState<number[]>([]);

  const statMod = (stat: number) => Math.floor((stat - 10) / 2);

  const calculatePointsUsed = () => {
    const stats = [formData.strength, formData.dexterity, formData.intelligence, formData.will];
    return stats.reduce((total, stat) => total + (POINT_BUY_COSTS[stat] || 0), 0);
  };

  const handlePointBuyChange = (stat: StatName, value: number) => {
    const newValue = Math.max(8, Math.min(15, value));
    const currentPoints = calculatePointsUsed();
    const currentCost = POINT_BUY_COSTS[formData[stat]] || 0;
    const newCost = POINT_BUY_COSTS[newValue] || 0;
    const pointDiff = newCost - currentCost;

    if (currentPoints - currentCost + newCost <= POINT_BUY_POINTS) {
      setFormData({ ...formData, [stat]: newValue });
      setAvailablePoints(POINT_BUY_POINTS - (currentPoints + pointDiff));
    } else {
      toast({ title: "Not enough points", description: "You don't have enough points for this increase", variant: "destructive" });
    }
  };

  const handleArrayAssign = (stat: StatName, index: number) => {
    const value = arrayValues[index];
    setFormData({ ...formData, [stat]: value });
    setArrayValues(arrayValues.filter((_, i) => i !== index));
  };

  const rollDice = (count: number, sides: number, dropLowest: boolean = false): number => {
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    if (dropLowest) {
      rolls.sort((a, b) => a - b);
      rolls.shift();
    }
    return rolls.reduce((a, b) => a + b, 0);
  };

  const handleRoll = () => {
    const rolls = Array.from({ length: 4 }, () => rollDice(4, 6, true));
    setRolledValues(rolls);
    toast({ title: "Rolled!", description: "Assign these values to your stats" });
  };

  const handleRolledAssign = (stat: StatName, value: number) => {
    setFormData({ ...formData, [stat]: value });
    setRolledValues(rolledValues.filter(v => v !== value));
  };

  const stats: { name: StatName; label: string; color: string }[] = [
    { name: 'strength', label: 'STR', color: 'var(--ability-str)' },
    { name: 'dexterity', label: 'DEX', color: 'var(--ability-dex)' },
    { name: 'intelligence', label: 'INT', color: 'var(--ability-int)' },
    { name: 'will', label: 'WILL', color: 'var(--ability-wis)' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Ability Scores
        </h2>
        <p className="text-muted-foreground">
          Determine your character's core attributes
        </p>
      </div>

      <Tabs value={method} onValueChange={(v) => setMethod(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="point-buy">Point Buy</TabsTrigger>
          <TabsTrigger value="array">Standard Array</TabsTrigger>
          <TabsTrigger value="roll">Roll</TabsTrigger>
        </TabsList>

        <TabsContent value="point-buy" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Point Buy ({POINT_BUY_POINTS - calculatePointsUsed()} points remaining)</CardTitle>
              <CardDescription>Customize your stats with {POINT_BUY_POINTS} points (8-15 range)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.name} className="flex items-center gap-4">
                  <Label className="w-16">{stat.label}</Label>
                  <Input
                    type="number"
                    min={8}
                    max={15}
                    value={formData[stat.name]}
                    onChange={(e) => handlePointBuyChange(stat.name, parseInt(e.target.value) || 8)}
                    className="w-20"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePointBuyChange(stat.name, formData[stat.name] - 1)}
                    >
                      -
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePointBuyChange(stat.name, formData[stat.name] + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Mod: {statMod(formData[stat.name]) >= 0 ? '+' : ''}{statMod(formData[stat.name])}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="array" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Standard Array</CardTitle>
              <CardDescription>Assign these values: {arrayValues.join(', ')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.name} className="flex items-center gap-4">
                  <Label className="w-16">{stat.label}</Label>
                  <div className="text-2xl font-bold w-12">{formData[stat.name]}</div>
                  <div className="flex gap-2 flex-wrap">
                    {arrayValues.map((value, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleArrayAssign(stat.name, index)}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roll" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Roll for Stats</CardTitle>
              <CardDescription>Roll 4d6 drop lowest for each stat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" onClick={handleRoll} className="w-full">
                <Dices className="mr-2 h-4 w-4" />
                Roll Stats
              </Button>

              {rolledValues.length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Rolled values: {rolledValues.join(', ')}</p>
                </div>
              )}

              {stats.map((stat) => (
                <div key={stat.name} className="flex items-center gap-4">
                  <Label className="w-16">{stat.label}</Label>
                  <div className="text-2xl font-bold w-12">{formData[stat.name]}</div>
                  <div className="flex gap-2 flex-wrap">
                    {rolledValues.map((value, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRolledAssign(stat.name, value)}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Current Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.name} className="text-center p-4 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
              <div className="text-3xl font-bold">{formData[stat.name]}</div>
              <div className="text-sm text-primary">
                {statMod(formData[stat.name]) >= 0 ? '+' : ''}{statMod(formData[stat.name])}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
