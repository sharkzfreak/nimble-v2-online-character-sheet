import { useState, useEffect } from "react";
import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, RotateCcw, Sparkles } from "lucide-react";
import { NIMBLE_STAT_ARRAYS, StatName } from "@/config/nimbleArrays";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { toast } from "@/hooks/use-toast";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: any;
}

const STAT_LABELS: { key: StatName; label: string; color: string }[] = [
  { key: 'str_mod', label: 'STR', color: 'var(--ability-str)' },
  { key: 'dex_mod', label: 'DEX', color: 'var(--ability-dex)' },
  { key: 'int_mod', label: 'INT', color: 'var(--ability-int)' },
  { key: 'will_mod', label: 'WILL', color: 'var(--ability-wis)' },
];

interface ModChip {
  value: number;
  id: string;
}

export const BuilderStep3AbilityScores = ({ formData, setFormData }: BuilderStepProps) => {
  const [selectedArrayId, setSelectedArrayId] = useState<string | null>(formData.stat_array_id);
  const [availableChips, setAvailableChips] = useState<ModChip[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (formData.stat_array_id && formData.stat_array_values.length > 0) {
      setSelectedArrayId(formData.stat_array_id);
      const assignedMods = [formData.str_mod, formData.dex_mod, formData.int_mod, formData.will_mod];
      const allMods = [...formData.stat_array_values];
      const unassigned: number[] = [];
      
      allMods.forEach(mod => {
        const idx = assignedMods.indexOf(mod);
        if (idx === -1) {
          unassigned.push(mod);
        } else {
          assignedMods[idx] = NaN;
        }
      });
      
      setAvailableChips(unassigned.map((value, idx) => ({ value, id: `chip-${idx}` })));
    }
  }, []);

  const handleArraySelect = (arrayId: string) => {
    const array = NIMBLE_STAT_ARRAYS.find(a => a.id === arrayId);
    if (!array) return;

    setSelectedArrayId(arrayId);
    const chips = array.modifiers.map((value, idx) => ({ value, id: `chip-${idx}` }));
    setAvailableChips(chips);
    
    setFormData({
      ...formData,
      stat_array_id: arrayId,
      stat_array_values: array.modifiers,
      str_mod: 0,
      dex_mod: 0,
      int_mod: 0,
      will_mod: 0,
    });
  };

  const handleReset = () => {
    if (!selectedArrayId) return;
    const array = NIMBLE_STAT_ARRAYS.find(a => a.id === selectedArrayId);
    if (!array) return;

    const chips = array.modifiers.map((value, idx) => ({ value, id: `chip-reset-${idx}` }));
    setAvailableChips(chips);
    
    setFormData({
      ...formData,
      str_mod: 0,
      dex_mod: 0,
      int_mod: 0,
      will_mod: 0,
    });

    toast({ title: "Reset", description: "All assignments cleared" });
  };

  const handleSuggest = () => {
    if (!selectedArrayId || !formData.class) {
      toast({ title: "Missing info", description: "Select a class and array first", variant: "destructive" });
      return;
    }

    const array = NIMBLE_STAT_ARRAYS.find(a => a.id === selectedArrayId);
    if (!array) return;

    const sortedMods = [...array.modifiers].sort((a, b) => b - a);
    let str = 0, dex = 0, int = 0, will = 0;

    const className = formData.class.toLowerCase();

    if (className.includes("berserker") || className.includes("commander")) {
      [str, will, dex, int] = sortedMods;
    } else if (className.includes("cheat") || className.includes("zephyr")) {
      [dex, will, str, int] = sortedMods;
    } else if (className.includes("mage") || className.includes("shadowmancer")) {
      [int, will, dex, str] = sortedMods;
    } else if (className.includes("hunter") || className.includes("stormshifter")) {
      [dex, will, int, str] = sortedMods;
    } else if (className.includes("oathsworn") || className.includes("shepherd")) {
      [will, str, dex, int] = sortedMods;
    } else if (className.includes("songweaver")) {
      [will, dex, int, str] = sortedMods;
    } else {
      [str, dex, int, will] = sortedMods;
    }

    setAvailableChips([]);
    setFormData({
      ...formData,
      str_mod: str,
      dex_mod: dex,
      int_mod: int,
      will_mod: will,
    });

    toast({ title: "Suggested!", description: `Applied ${formData.class} recommendation` });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const chipId = active.id as string;
    const targetStat = over.id as StatName;

    if (!STAT_LABELS.find(s => s.key === targetStat)) return;

    const chip = availableChips.find(c => c.id === chipId);
    if (!chip) {
      const currentStatEntry = STAT_LABELS.find(s => formData[s.key] !== 0);
      if (currentStatEntry) {
        const oldValue = formData[targetStat];
        const newValue = formData[currentStatEntry.key];
        
        setFormData({
          ...formData,
          [targetStat]: newValue,
          [currentStatEntry.key]: oldValue,
        });
        return;
      }
      return;
    }

    const newAvailable = availableChips.filter(c => c.id !== chipId);

    const currentValue = formData[targetStat];
    if (currentValue !== 0) {
      newAvailable.push({ value: currentValue, id: `returned-${Date.now()}` });
    }

    setAvailableChips(newAvailable);
    setFormData({
      ...formData,
      [targetStat]: chip.value,
    });
  };

  const formatMod = (mod: number) => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const isArrayComplete = () => {
    return availableChips.length === 0 && selectedArrayId !== null &&
           formData.str_mod !== 0 && formData.dex_mod !== 0 &&
           formData.int_mod !== 0 && formData.will_mod !== 0;
  };

  const DraggableChip = ({ chip }: { chip: ModChip }) => {
    return (
      <div
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-lg cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg transition-shadow"
        role="button"
        aria-grabbed="false"
        tabIndex={0}
      >
        {formatMod(chip.value)}
      </div>
    );
  };

  const StatDropZone = ({ stat }: { stat: typeof STAT_LABELS[0] }) => {
    const value = formData[stat.key];
    const hasValue = value !== 0;

    return (
      <div className="flex flex-col items-center gap-2">
        <Label className="text-sm font-medium text-muted-foreground">{stat.label}</Label>
        <div
          className={`w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${
            hasValue
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50'
          }`}
          aria-dropeffect="move"
          role="button"
          tabIndex={0}
        >
          {hasValue ? (
            <span className="text-3xl font-bold text-primary">{formatMod(value)}</span>
          ) : (
            <span className="text-muted-foreground text-xs">Drop here</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Choose Stat Array (Mods Only)
          </h2>
          <p className="text-muted-foreground">
            Select one of the three official Nimble arrays, then drag modifiers to your stats
          </p>
        </div>

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

        {selectedArrayId && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assign Modifiers to Stats</CardTitle>
                  <CardDescription>
                    Drag chips from the pool to your stats
                    {availableChips.length > 0 && (
                      <span className="ml-2 text-primary font-medium">
                        ({availableChips.length} remaining)
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={availableChips.length === 4}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSuggest}
                    disabled={!formData.class}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Suggest
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {availableChips.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Available Modifiers:</Label>
                  <div className="flex gap-3 flex-wrap p-4 bg-muted/30 rounded-lg min-h-[80px]">
                    {availableChips.map((chip) => (
                      <div
                        key={chip.id}
                        draggable
                        onDragStart={() => setActiveId(chip.id)}
                      >
                        <DraggableChip chip={chip} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Your Stats:</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/10 rounded-lg">
                  {STAT_LABELS.map((stat) => (
                    <div
                      key={stat.key}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {}}
                    >
                      <StatDropZone stat={stat} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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

      <DragOverlay>
        {activeId && availableChips.find(c => c.id === activeId) && (
          <DraggableChip chip={availableChips.find(c => c.id === activeId)!} />
        )}
      </DragOverlay>
    </DndContext>
  );
};

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);
