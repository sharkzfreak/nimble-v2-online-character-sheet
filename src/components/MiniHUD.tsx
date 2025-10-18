import { Shield, Zap } from "lucide-react";
import { D20Icon } from "./icons/D20Icon";
import { Button } from "./ui/button";
import { HPBar } from "./HPBar";

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
  onRest,
  onRollInitiative,
}: MiniHUDProps) => {
  const initMod = dex_mod >= 0 ? `+${dex_mod}` : `${dex_mod}`;

  return (
    <div className="mini-hud" role="region" aria-label="Character HUD">
      <div className="hud-left">
        <div className="hud-name">
          <span className="font-semibold">{name}</span> • <span>{className}</span> L{level}
        </div>
      </div>
      
      <div className="hud-metrics">
        <HPBar 
          hp_current={hp_current}
          hp_max={hp_max}
          hp_temp={hp_temp}
          onHPChange={onHPChange}
        />

        <div className="hud-pill ac">
          <Shield className="w-4 h-4" />
          <span>{armor}</span>
        </div>

        <div className="hud-pill spd">
          <Zap className="w-4 h-4" />
          <span>{speed}</span>
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
      </div>

      <div className="hud-actions">
        <Button variant="outline" size="sm" onClick={onRest} className="w-full">Rest</Button>
      </div>
    </div>
  );
};
