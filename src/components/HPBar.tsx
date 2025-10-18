import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useDiceLog } from "@/contexts/DiceLogContext";
import { Skull } from "lucide-react";

interface HPBarProps {
  hp_current: number;
  hp_max: number;
  hp_temp?: number;
  onHPChange: (current: number, temp?: number) => void;
  onMaxHPChange?: (max: number) => void;
  characterName?: string;
}

export const HPBar = ({ hp_current, hp_max, hp_temp = 0, onHPChange, onMaxHPChange, characterName = "Character" }: HPBarProps) => {
  const { addLog } = useDiceLog();
  const [showEditor, setShowEditor] = useState(false);
  const [hpInput, setHpInput] = useState("");
  const [tempInput, setTempInput] = useState(hp_temp.toString());
  const [maxInput, setMaxInput] = useState(hp_max.toString());
  const editorRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  
  // Track previous values for logging and flash detection
  const prevValuesRef = useRef({ hp_current, hp_max, hp_temp });
  
  // Calculate HP percentage and status
  const hpPercent = Math.max(0, Math.min(100, (100 * hp_current) / Math.max(1, hp_max)));
  const hpRatio = hp_current / Math.max(1, hp_max);
  
  // Determine HP status classes
  const isLowHP = hpRatio <= 0.25;
  const isWarnHP = hpRatio > 0.25 && hpRatio <= 0.5;
  
  // Calculate temp HP overlay - shows total (current + temp) as percentage
  const totalWithTemp = Math.min(hp_current + hp_temp, hp_max + hp_temp);
  const tempPercent = Math.min(140, Math.round((totalWithTemp / hp_max) * 100));
  const showTempOverlay = hp_temp > 0 && tempPercent > hpPercent;

  const flashHP = (type: 'damage' | 'heal') => {
    if (!barRef.current) return;
    const cls = type === 'damage' ? 'flash-damage' : 'flash-heal';
    barRef.current.classList.add(cls);
    setTimeout(() => barRef.current?.classList.remove(cls), 450);
  };

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
    
    // Flash effect
    if (delta !== 0) {
      flashHP(delta > 0 ? 'heal' : 'damage');
    }
    
    // Update previous values
    prevValuesRef.current = { hp_current: newCurrent, hp_max, hp_temp: newTemp };
  };

  const handleNudge = (delta: number) => {
    let newHP = hp_current;
    let newTemp = hp_temp;
    
    if (delta < 0) {
      // Taking damage - consume temp HP first
      const absDamage = Math.abs(delta);
      if (hp_temp > 0) {
        if (hp_temp >= absDamage) {
          // Temp HP absorbs all damage
          newTemp = hp_temp - absDamage;
        } else {
          // Temp HP absorbs some, rest goes to regular HP
          const remainingDamage = absDamage - hp_temp;
          newTemp = 0;
          newHP = Math.max(0, hp_current - remainingDamage);
        }
      } else {
        // No temp HP, damage goes directly to HP
        newHP = Math.max(0, hp_current + delta);
      }
    } else {
      // Healing - only affects regular HP
      newHP = Math.max(0, Math.min(hp_max, hp_current + delta));
    }
    
    logHPChange(newHP, newTemp);
    onHPChange(newHP, newTemp);
  };

  const handleApply = () => {
    const input = hpInput.trim();
    let newHP = hp_current;
    let newTemp = hp_temp;
    let newMax = hp_max;
    
    // Handle max HP change
    const inputMax = Number(maxInput);
    if (inputMax > 0 && inputMax !== hp_max && onMaxHPChange) {
      newMax = inputMax;
      onMaxHPChange(inputMax);
    }
    
    if (input) {
      if (/^[+\-]\d+$/.test(input)) {
        // Relative adjustment (+5, -3)
        const delta = Number(input);
        
        if (delta < 0) {
          // Taking damage - consume temp HP first
          const absDamage = Math.abs(delta);
          if (hp_temp > 0) {
            if (hp_temp >= absDamage) {
              newTemp = hp_temp - absDamage;
            } else {
              const remainingDamage = absDamage - hp_temp;
              newTemp = 0;
              newHP = Math.max(0, hp_current - remainingDamage);
            }
          } else {
            newHP = Math.max(0, hp_current + delta);
          }
        } else {
          // Healing
          newHP = Math.max(0, Math.min(newMax, hp_current + delta));
        }
      } else if (/^\d+$/.test(input)) {
        // Absolute value
        newHP = Math.max(0, Math.min(newMax, Number(input)));
      }
    }

    // Update temp HP if changed in the editor
    const inputTemp = tempInput === '' ? 0 : Math.max(0, Number(tempInput));
    if (inputTemp !== hp_temp) {
      newTemp = inputTemp;
    }
    
    logHPChange(newHP, newTemp);
    onHPChange(newHP, newTemp);
    setShowEditor(false);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setHpInput("");
    setTempInput(hp_temp.toString());
    setMaxInput(hp_max.toString());
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
    setMaxInput(hp_max.toString());
  }, [hp_temp, hp_max]);

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

  // Build class names for HP status
  const barClassName = `hp-bar ${isLowHP ? 'hp-low' : ''} ${isWarnHP ? 'hp-warn' : ''}`.trim();

  return (
    <div className="relative">
      <div 
        ref={barRef}
        className={barClassName}
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
        {/* Minus button on LEFT */}
        <button
          className="hp-nudge hp-nudge--minus"
          aria-label="Decrease HP by 1"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            handleNudge(-1);
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          −
        </button>

        <div className="hp-fill" style={{ width: `${hpPercent}%` }} />
        {showTempOverlay && (
          <div className="hp-temp" style={{ width: `${tempPercent}%` }} />
        )}
        
        {/* Hide HP text at zero, show skull instead */}
        {hp_current > 0 && <div className="hp-text">{displayText}</div>}
        
        {/* Pulsing skull at zero HP */}
        {hp_current === 0 && (
          <div className="hp-skull">
            <Skull className="w-6 h-6" />
          </div>
        )}

        {/* Plus button on RIGHT */}
        <button
          className="hp-nudge hp-nudge--plus"
          aria-label="Increase HP by 1"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            handleNudge(1);
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          +
        </button>
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

            <div className="hp-field">
              <Label htmlFor="max-input">Max HP</Label>
              <Input
                id="max-input"
                type="number"
                step="1"
                min="1"
                placeholder="Max HP"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
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
