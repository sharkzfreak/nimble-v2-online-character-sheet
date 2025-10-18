import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useDiceLog } from "@/contexts/DiceLogContext";

interface HPBarProps {
  hp_current: number;
  hp_max: number;
  hp_temp?: number;
  onHPChange: (current: number, temp?: number) => void;
  characterName?: string;
}

export const HPBar = ({ hp_current, hp_max, hp_temp = 0, onHPChange, characterName = "Character" }: HPBarProps) => {
  const { addLog } = useDiceLog();
  const [showEditor, setShowEditor] = useState(false);
  const [hpInput, setHpInput] = useState("");
  const [tempInput, setTempInput] = useState(hp_temp.toString());
  const editorRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  
  // Track previous values for logging
  const prevValuesRef = useRef({ hp_current, hp_max, hp_temp });

  const hpPercent = Math.max(0, Math.min(100, (100 * hp_current) / Math.max(1, hp_max)));
  
  // Calculate temp HP overlay - shows total (current + temp) as percentage
  const totalWithTemp = Math.min(hp_current + hp_temp, hp_max + hp_temp);
  const tempPercent = Math.min(140, Math.round((totalWithTemp / hp_max) * 100));
  const showTempOverlay = hp_temp > 0 && tempPercent > hpPercent;

  const logHPChange = (newCurrent: number, newTemp: number) => {
    const prevCur = prevValuesRef.current.hp_current;
    const prevMax = prevValuesRef.current.hp_max;
    const prevTmp = prevValuesRef.current.hp_temp;
    
    const delta = newCurrent - prevCur;
    const sign = delta === 0 ? '±0' : (delta > 0 ? `+${delta}` : `${delta}`);
    const hpStr = `${prevCur}/${prevMax} → ${newCurrent}/${hp_max}`;
    const tmpStr = (prevTmp !== newTemp) ? `, Temp: ${prevTmp} → ${newTemp}` : (newTemp ? `, Temp: ${newTemp}` : '');
    const emoji = delta > 0 ? '🩹' : (delta < 0 ? '💥' : '⚖️');
    
    addLog({
      character_name: characterName,
      formula: `HP Change`,
      raw_result: newCurrent,
      modifier: delta,
      total: newCurrent,
      roll_type: `${emoji} HP ${hpStr} (${sign})${tmpStr}`,
      individual_rolls: [],
    });
    
    // Update previous values
    prevValuesRef.current = { hp_current: newCurrent, hp_max, hp_temp: newTemp };
  };

  const handleNudge = (delta: number) => {
    const newHP = Math.max(0, Math.min(hp_max, hp_current + delta));
    logHPChange(newHP, hp_temp);
    onHPChange(newHP, hp_temp);
  };

  const handleApply = () => {
    const input = hpInput.trim();
    let newHP = hp_current;
    
    if (input) {
      if (/^[+\-]\d+$/.test(input)) {
        // Relative adjustment (+5, -3)
        newHP = hp_current + Number(input);
      } else if (/^\d+$/.test(input)) {
        // Absolute value
        newHP = Number(input);
      }
      newHP = Math.max(0, Math.min(hp_max, newHP));
    }

    const newTemp = tempInput === '' ? 0 : Math.max(0, Number(tempInput));
    logHPChange(newHP, newTemp);
    onHPChange(newHP, newTemp);
    setShowEditor(false);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setHpInput("");
    setTempInput(hp_temp.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  useEffect(() => {
    setTempInput(hp_temp.toString());
  }, [hp_temp]);

  useEffect(() => {
    if (showEditor) {
      const handleClickOutside = (e: MouseEvent) => {
        if (editorRef.current && !editorRef.current.contains(e.target as Node) &&
            barRef.current && !barRef.current.contains(e.target as Node)) {
          handleCancel();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEditor]);

  const displayText = hp_temp > 0 ? `${hp_current}/${hp_max} (${hp_temp})` : `${hp_current}/${hp_max}`;

  return (
    <div className="relative">
      <div 
        ref={barRef}
        className="hp-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={hp_max}
        aria-valuenow={hp_current}
        aria-label={displayText}
        tabIndex={0}
        onClick={() => setShowEditor(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setShowEditor(true);
          }
        }}
      >
        <div className="hp-fill" style={{ width: `${hpPercent}%` }} />
        {showTempOverlay && (
          <div className="hp-temp" style={{ width: `${tempPercent}%` }} />
        )}
        <div className="hp-text">{displayText}</div>
        <div className="hp-arrows" onClick={(e) => e.stopPropagation()}>
          <button 
            className="hp-arrow up" 
            aria-label="Increase HP by 1"
            onClick={(e) => {
              e.stopPropagation();
              handleNudge(1);
            }}
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button 
            className="hp-arrow down" 
            aria-label="Decrease HP by 1"
            onClick={(e) => {
              e.stopPropagation();
              handleNudge(-1);
            }}
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {showEditor && (
        <div ref={editorRef} className="hp-editor">
          <div className="hp-editor-inner">
            <div className="hp-field">
              <Label htmlFor="hp-input">HP</Label>
              <Input
                id="hp-input"
                type="text"
                inputMode="numeric"
                placeholder="+/- or number"
                value={hpInput}
                onChange={(e) => setHpInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>

            <div className="hp-field">
              <Label htmlFor="temp-input">Temp</Label>
              <Input
                id="temp-input"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                value={tempInput}
                onChange={(e) => setTempInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="hp-editor-actions">
              <Button onClick={handleApply} size="sm" variant="default">
                Apply
              </Button>
              <Button onClick={handleCancel} size="sm" variant="ghost">
                Cancel
              </Button>
            </div>

            <div className="hp-hints">
              <small>
                Tip: use <b>+5</b> / <b>-3</b> to adjust, or a number to set absolute HP.
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
