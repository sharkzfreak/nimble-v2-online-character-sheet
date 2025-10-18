import { LayoutPreset } from "@/hooks/useLayoutPreset";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Maximize2, Minimize2, Square, Eye } from "lucide-react";

interface LayoutPresetSelectorProps {
  value: LayoutPreset;
  onChange: (preset: LayoutPreset) => void;
  className?: string;
}

const PRESET_LABELS = {
  compact: 'Compact',
  standard: 'Standard',
  spacious: 'Spacious',
  gm: 'GM View',
} as const;

const PRESET_ICONS = {
  compact: Minimize2,
  standard: Square,
  spacious: Maximize2,
  gm: Eye,
} as const;

export const LayoutPresetSelector = ({ value, onChange, className }: LayoutPresetSelectorProps) => {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as LayoutPreset)}>
      <SelectTrigger className={className}>
        <SelectValue>
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = PRESET_ICONS[value];
              return <Icon className="w-4 h-4" />;
            })()}
            <span>{PRESET_LABELS[value]}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(PRESET_LABELS) as LayoutPreset[]).map((preset) => {
          const Icon = PRESET_ICONS[preset];
          return (
            <SelectItem key={preset} value={preset}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{PRESET_LABELS[preset]}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
