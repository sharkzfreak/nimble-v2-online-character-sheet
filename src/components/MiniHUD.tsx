import { Heart, Shield, Zap } from "lucide-react";
import { D20Icon } from "./icons/D20Icon";
import { Button } from "./ui/button";

interface MiniHUDProps {
  name: string;
  className: string;
  level: number;
  hp_current: number;
  hp_max: number;
  armor: number;
  speed: number;
  dex_mod: number;
  onHeal: () => void;
  onDamage: () => void;
  onTempHP: () => void;
  onRest: () => void;
  onRollInitiative: () => void;
}

export const MiniHUD = ({
  name,
  className,
  level,
  hp_current,
  hp_max,
  armor,
  speed,
  dex_mod,
  onHeal,
  onDamage,
  onTempHP,
  onRest,
  onRollInitiative,
}: MiniHUDProps) => {
  const hpPercent = Math.max(0, Math.min(100, (100 * hp_current) / Math.max(1, hp_max)));
  const initMod = dex_mod >= 0 ? `+${dex_mod}` : `${dex_mod}`;

  return (
    <div className="mini-hud" role="region" aria-label="Character HUD">
      <div className="hud-left">
        <div className="hud-name">
          <span className="font-semibold">{name}</span> • <span>{className}</span> L{level}
        </div>
      </div>
      
      <div className="hud-metrics">
        <div className="hud-pill hp">
          <Heart className="w-4 h-4" />
          <span>{hp_current}/{hp_max}</span>
        </div>
        <div className="hud-hp-bar">
          <div className="hud-hp-fill" style={{ width: `${hpPercent}%` }} />
        </div>

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
        <Button variant="outline" size="sm" onClick={onHeal}>+HP</Button>
        <Button variant="outline" size="sm" onClick={onDamage}>−HP</Button>
        <Button variant="outline" size="sm" onClick={onTempHP}>Temp</Button>
        <Button variant="outline" size="sm" onClick={onRest}>Rest</Button>
      </div>
    </div>
  );
};
