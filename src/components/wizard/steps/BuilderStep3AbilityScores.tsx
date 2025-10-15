import { useState } from "react";
import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { NIMBLE_STAT_ARRAYS, StatName } from "@/config/nimbleArrays";
import { toast } from "@/hooks/use-toast";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: any;
}

const STAT_LABELS: { key: 'str_mod' | 'dex_mod' | 'int_mod' | 'will_mod'; label: string; color: string }[] = [
  { key: 'str_mod', label: 'STR', color: 'var(--ability-str)' },
  { key: 'dex_mod', label: 'DEX', color: 'var(--ability-dex)' },
  { key: 'int_mod', label: 'INT', color: 'var(--ability-int)' },
  { key: 'will_mod', label: 'WILL', color: 'var(--ability-wis)' },
];

export const BuilderStep3AbilityScores = ({ formData, setFormData }: BuilderStepProps) => {
  const [selectedArrayId, setSelectedArrayId] = useState<string | null>(null);
  const [availableMods, setAvailableMods] = useState<number[]>([]);

  const handleArraySelect = (arrayId: string) => {
    const array = NIMBLE_STAT_ARRAYS.find(a => a.id === arrayId);
    if (!array) return;

    setSelectedArrayId(arrayId);
    setAvailableMods([...array.modifiers]);
    
    // Reset all assignments
    setFormData({
      ...formData,
      str_mod: 0,
      dex_mod: 0,
      int_mod: 0,
      will_mod: 0,
    });
  };

  const handleModAssign = (statKey: StatName, modValue: number) => {
    // Check if this mod is available
    if (!availableMods.includes(modValue)) {
      toast({ 
        title: "Modifier not available", 
        description: "This modifier has already been assigned",
        variant: "destructive" 
      });
      return;
    }

    // Remove the current stat's value from available if it had one
    const currentValue = formData[statKey];
    let newAvailable = [...availableMods];
    
    if (currentValue !== 0) {
      newAvailable.push(currentValue);
    }
    
    // Remove the new value from available
    const modIndex = newAvailable.indexOf(modValue);
    if (modIndex > -1) {
      newAvailable.splice(modIndex, 1);
    }

    setAvailableMods(newAvailable);
    setFormData({
      ...formData,
      [statKey]: modValue,
    });
  };

  const formatMod = (mod: number) => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const isArrayComplete = () => {
    return availableMods.length === 0 && selectedArrayId !== null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Choose Stat Array (Mods Only)
        </h2>
        <p className="text-muted-foreground">
          Select one of the three official Nimble arrays, then assign each modifier
        </p>
      </div>

      {/* Array Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {NIMBLE_STAT_ARRAYS.map((array) => (
          <Card
            key={array.id}
            className={`cursor-pointer transition-all ${
              selectedArrayId === array.id
                ? "ring-2 ring-primary bg-primary/5"
                : "hover:bg-muted/50"
            }`}
            onClick={() => handleArraySelect(array.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {array.name}
                {selectedArrayId === array.id && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </CardTitle>
              <CardDescription>{array.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-center flex-wrap">
                {array.modifiers.map((mod, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-lg font-bold px-3 py-1"
                  >
                    {formatMod(mod)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assignment Section */}
      {selectedArrayId && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Assign Modifiers to Stats</CardTitle>
            <CardDescription>
              Click a modifier below each stat to assign it
              {availableMods.length > 0 && (
                <span className="ml-2 text-primary font-medium">
                  ({availableMods.length} remaining)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {STAT_LABELS.map((stat) => (
              <div key={stat.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">{stat.label}</Label>
                  <div className="text-3xl font-bold text-primary">
                    {formData[stat.key] !== 0 ? formatMod(formData[stat.key]) : "—"}
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {selectedArrayId && NIMBLE_STAT_ARRAYS
                    .find(a => a.id === selectedArrayId)
                    ?.modifiers.map((mod, idx) => {
                      const isAssigned = formData[stat.key] === mod;
                      const isAvailable = availableMods.includes(mod) || isAssigned;
                      
                      return (
                        <Button
                          key={idx}
                          type="button"
                          variant={isAssigned ? "default" : "outline"}
                          size="sm"
                          disabled={!isAvailable && !isAssigned}
                          onClick={() => handleModAssign(stat.key, mod)}
                          className={isAssigned ? "ring-2 ring-primary" : ""}
                        >
                          {formatMod(mod)}
                        </Button>
                      );
                    })
                  }
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {selectedArrayId && (
        <Card className={isArrayComplete() ? "bg-primary/5 border-primary/20" : ""}>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Current Assignment:
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                {STAT_LABELS.map((stat) => (
                  <div key={stat.key} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold text-primary">
                      {formData[stat.key] !== 0 ? formatMod(formData[stat.key]) : "—"}
                    </div>
                  </div>
                ))}
              </div>
              
              {isArrayComplete() && (
                <div className="mt-4 text-center">
                  <Badge variant="default" className="text-sm">
                    <Check className="w-4 h-4 mr-1" />
                    Array Complete
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
