import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { ActionSpec, RollBinding, Ability } from "@/types/rollable";

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    name: string;
    description?: string;
    actions?: ActionSpec[];
  };
  onSave: (updates: {
    name: string;
    description?: string;
    actions?: ActionSpec[];
  }) => void;
  classColor?: string;
}

export const EditItemDialog = ({ open, onOpenChange, item, onSave, classColor }: EditItemDialogProps) => {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description || "");
  const [actions, setActions] = useState<ActionSpec[]>(item.actions || []);

  // Update state when item changes
  useEffect(() => {
    setName(item.name);
    setDescription(item.description || "");
    setActions(item.actions || []);
  }, [item, open]);

  const handleAddAction = () => {
    const newAction: ActionSpec = {
      id: crypto.randomUUID(),
      label: "New Action",
      rolls: [],
    };
    setActions([...actions, newAction]);
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleUpdateAction = (index: number, updates: Partial<ActionSpec>) => {
    const updated = [...actions];
    updated[index] = { ...updated[index], ...updates };
    setActions(updated);
  };

  const handleAddRoll = (actionIndex: number) => {
    const updated = [...actions];
    const newRoll: RollBinding = {
      kind: 'damage',
      die: '1d6',
    };
    updated[actionIndex].rolls = [...(updated[actionIndex].rolls || []), newRoll];
    setActions(updated);
  };

  const handleRemoveRoll = (actionIndex: number, rollIndex: number) => {
    const updated = [...actions];
    updated[actionIndex].rolls = updated[actionIndex].rolls.filter((_, i) => i !== rollIndex);
    setActions(updated);
  };

  const handleUpdateRoll = (actionIndex: number, rollIndex: number, updates: Partial<RollBinding>) => {
    const updated = [...actions];
    updated[actionIndex].rolls[rollIndex] = { ...updated[actionIndex].rolls[rollIndex], ...updates };
    setActions(updated);
  };

  const handleSave = () => {
    onSave({ name, description, actions });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-cinzel" style={{ color: classColor ? `hsl(${classColor})` : undefined }}>
            Edit Item
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-name">Name</Label>
              <Input
                id="item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Item name..."
              />
            </div>
            <div>
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the item..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Roll Actions</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAction}
                style={{ borderColor: classColor ? `hsl(${classColor})` : undefined }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Action
              </Button>
            </div>

            {actions.map((action, actionIdx) => (
              <div key={action.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={action.label}
                    onChange={(e) => handleUpdateAction(actionIdx, { label: e.target.value })}
                    placeholder="Action label (e.g., Attack, Damage)..."
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAction(actionIdx)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>

                {/* Rolls */}
                <div className="space-y-2 pl-4 border-l-2">
                  {action.rolls.map((roll, rollIdx) => (
                    <div key={rollIdx} className="flex items-center gap-2 text-sm">
                      <select
                        value={roll.kind}
                        onChange={(e) => handleUpdateRoll(actionIdx, rollIdx, { kind: e.target.value as RollBinding['kind'] })}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="attack">Attack</option>
                        <option value="damage">Damage</option>
                        <option value="save">Save</option>
                        <option value="check">Check</option>
                        <option value="healing">Healing</option>
                      </select>

                      <Input
                        value={roll.die || ""}
                        onChange={(e) => handleUpdateRoll(actionIdx, rollIdx, { die: e.target.value })}
                        placeholder="e.g., 1d10"
                        className="w-24 font-mono"
                      />

                      <select
                        value={roll.ability || ""}
                        onChange={(e) => handleUpdateRoll(actionIdx, rollIdx, { ability: (e.target.value || undefined) as Ability })}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="">No Ability</option>
                        <option value="STR">+ STR</option>
                        <option value="DEX">+ DEX</option>
                        <option value="INT">+ INT</option>
                        <option value="WILL">+ WILL</option>
                      </select>

                      <Input
                        type="number"
                        value={roll.flat || ""}
                        onChange={(e) => handleUpdateRoll(actionIdx, rollIdx, { flat: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="Flat mod"
                        className="w-20"
                      />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRoll(actionIdx, rollIdx)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddRoll(actionIdx)}
                    className="mt-2"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Roll
                  </Button>
                </div>
              </div>
            ))}

            {actions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No actions defined. Click "Add Action" to create roll formulas.
              </p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              style={{
                backgroundColor: classColor ? `hsl(${classColor})` : undefined,
                color: 'hsl(var(--background))',
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
