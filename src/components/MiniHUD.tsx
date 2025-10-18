import { Shield, Zap, Moon } from "lucide-react";
import { D20Icon } from "./icons/D20Icon";
import { Button } from "./ui/button";
import { HPBar } from "./HPBar";
import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface MiniHUDProps {
  name: string;
  className: string;
  level: number;
  hp_current: number;
  hp_max: number;
  hp_temp?: number;
  armor: number;
  speed: number;
  dex_mod: number;
  onHPChange: (current: number, temp?: number) => void;
  onArmorChange?: (armor: number) => void;
  onSpeedChange?: (speed: number) => void;
  onRest: () => void;
  onRollInitiative: () => void;
}

export const MiniHUD = ({
  name,
  className,
  level,
  hp_current,
  hp_max,
  hp_temp = 0,
  armor,
  speed,
  dex_mod,
  onHPChange,
  onArmorChange,
  onSpeedChange,
  onRest,
  onRollInitiative,
}: MiniHUDProps) => {
  const initMod = dex_mod >= 0 ? `+${dex_mod}` : `${dex_mod}`;

  const [showArmorEditor, setShowArmorEditor] = useState(false);
  const [armorInput, setArmorInput] = useState("");
  const armorEditorRef = useRef<HTMLDivElement>(null);
  const armorButtonRef = useRef<HTMLButtonElement>(null);

  const [showSpeedEditor, setShowSpeedEditor] = useState(false);
  const [speedInput, setSpeedInput] = useState("");
  const speedEditorRef = useRef<HTMLDivElement>(null);
  const speedButtonRef = useRef<HTMLButtonElement>(null);

  // Handle armor editor
  const handleArmorApply = () => {
    const input = armorInput.trim();
    if (input && /^\d+$/.test(input)) {
      const newArmor = Math.max(0, Number(input));
      onArmorChange?.(newArmor);
    }
    setShowArmorEditor(false);
    setArmorInput("");
  };

  const handleArmorCancel = () => {
    setShowArmorEditor(false);
    setArmorInput("");
  };

  // Handle speed editor
  const handleSpeedApply = () => {
    const input = speedInput.trim();
    if (input && /^\d+$/.test(input)) {
      const newSpeed = Math.max(0, Number(input));
      onSpeedChange?.(newSpeed);
    }
    setShowSpeedEditor(false);
    setSpeedInput("");
  };

  const handleSpeedCancel = () => {
    setShowSpeedEditor(false);
    setSpeedInput("");
  };

  // Click outside handlers
  useEffect(() => {
    if (showArmorEditor) {
      const handleClickOutside = (e: MouseEvent) => {
        if (armorEditorRef.current && !armorEditorRef.current.contains(e.target as Node) &&
            armorButtonRef.current && !armorButtonRef.current.contains(e.target as Node)) {
          handleArmorCancel();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showArmorEditor]);

  useEffect(() => {
    if (showSpeedEditor) {
      const handleClickOutside = (e: MouseEvent) => {
        if (speedEditorRef.current && !speedEditorRef.current.contains(e.target as Node) &&
            speedButtonRef.current && !speedButtonRef.current.contains(e.target as Node)) {
          handleSpeedCancel();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSpeedEditor]);

  return (
    <div className="mini-hud" role="region" aria-label="Character HUD">
      <div className="hud-left">
        <div className="hud-name">
          <span className="font-semibold">{name}</span> • <span>{className}</span> L{level}
        </div>
      </div>
      
      {/* HP Bar - Full Width */}
      <div className="hud-hp-section">
        <HPBar 
          hp_current={hp_current}
          hp_max={hp_max}
          hp_temp={hp_temp}
          onHPChange={onHPChange}
          characterName={name}
        />
      </div>

      {/* Two Column Grid - Shield, Speed, Initiative, Rest */}
      <div className="hud-metrics-grid">
        <div className="relative">
          <Button
            ref={armorButtonRef}
            variant="outline"
            size="sm"
            className="hud-pill ac w-full"
            onClick={() => setShowArmorEditor(true)}
            title="Armor Class"
          >
            <Shield className="w-4 h-4" />
            <span>{armor}</span>
          </Button>

          {showArmorEditor && (
            <div ref={armorEditorRef} className="stat-editor">
              <div className="stat-editor-inner">
                <div className="stat-field">
                  <Label htmlFor="armor-input">Armor</Label>
                  <Input
                    id="armor-input"
                    type="number"
                    min="0"
                    placeholder={armor.toString()}
                    value={armorInput}
                    onChange={(e) => setArmorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleArmorApply();
                      if (e.key === 'Escape') handleArmorCancel();
                    }}
                    autoFocus
                  />
                </div>
                <div className="stat-editor-actions">
                  <Button onClick={handleArmorApply} size="sm" variant="default">
                    Apply
                  </Button>
                  <Button onClick={handleArmorCancel} size="sm" variant="ghost">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <Button
            ref={speedButtonRef}
            variant="outline"
            size="sm"
            className="hud-pill spd w-full"
            onClick={() => setShowSpeedEditor(true)}
            title="Speed"
          >
            <Zap className="w-4 h-4" />
            <span>{speed}</span>
          </Button>

          {showSpeedEditor && (
            <div ref={speedEditorRef} className="stat-editor">
              <div className="stat-editor-inner">
                <div className="stat-field">
                  <Label htmlFor="speed-input">Speed</Label>
                  <Input
                    id="speed-input"
                    type="number"
                    min="0"
                    placeholder={speed.toString()}
                    value={speedInput}
                    onChange={(e) => setSpeedInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSpeedApply();
                      if (e.key === 'Escape') handleSpeedCancel();
                    }}
                    autoFocus
                  />
                </div>
                <div className="stat-editor-actions">
                  <Button onClick={handleSpeedApply} size="sm" variant="default">
                    Apply
                  </Button>
                  <Button onClick={handleSpeedCancel} size="sm" variant="ghost">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="hud-pill init"
          onClick={onRollInitiative}
          title="Roll Initiative"
        >
          <D20Icon className="w-4 h-4" />
          <span>{initMod}</span>
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRest}
          className="hud-pill rest"
        >
          <Moon className="w-4 h-4" />
          Rest
        </Button>
      </div>
    </div>
  );
};
