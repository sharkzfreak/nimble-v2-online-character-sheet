import { useState, useRef, useEffect } from "react";
import { Heart, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface HPBarProps {
  hp_current: number;
  hp_max: number;
  hp_temp?: number;
  onHPChange: (current: number, temp?: number) => void;
}

export const HPBar = ({ hp_current, hp_max, hp_temp = 0, onHPChange }: HPBarProps) => {
  const [showEditor, setShowEditor] = useState(false);
  const [hpInput, setHpInput] = useState("");
  const [tempInput, setTempInput] = useState(hp_temp.toString());
  const editorRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const hpPercent = Math.max(0, Math.min(100, (100 * hp_current) / Math.max(1, hp_max)));

  const handleNudge = (delta: number) => {
    const newHP = Math.max(0, Math.min(hp_max, hp_current + delta));
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
  
  // Calculate temp HP overlay width - extends beyond current HP
  const tempPercent = Math.max(0, Math.min(100, (100 * (hp_current + hp_temp)) / Math.max(1, hp_max)));

  return (
    <div className="relative">
      <div 
        ref={barRef}
        className="hp-bar"
        role="button"
        aria-label="Hit Points"
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
        {hp_temp > 0 && (
          <div className="hp-temp-fill" style={{ width: `${tempPercent}%` }} />
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
