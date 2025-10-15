import { RollBinding, RollResult, AdvMode, Ability } from '@/types/rollable';

interface Character {
  str_mod: number;
  dex_mod: number;
  int_mod: number;
  will_mod: number;
}

interface RollContext {
  character: Character;
  advMode?: AdvMode;
  situational?: number;
  compareDC?: number;
}

const parseDiceFormula = (formula: string): { count: number; sides: number } => {
  const match = formula.match(/(\d+)?d(\d+)/i);
  if (!match) return { count: 1, sides: 20 };
  return {
    count: parseInt(match[1] || '1'),
    sides: parseInt(match[2])
  };
};

const rollDie = (sides: number): number => {
  return Math.floor(Math.random() * sides) + 1;
};

const getAbilityMod = (character: Character, ability?: Ability): number => {
  if (!ability) return 0;
  const modMap: Record<Ability, number> = {
    STR: character.str_mod,
    DEX: character.dex_mod,
    INT: character.int_mod,
    WILL: character.will_mod,
  };
  return modMap[ability] || 0;
};

export const rollAction = (
  binding: RollBinding,
  ctx: RollContext
): RollResult => {
  const abilityMod = getAbilityMod(ctx.character, binding.ability);
  const flatBonus = binding.flat || 0;
  const situationalBonus = ctx.situational || 0;
  const totalModifier = abilityMod + flatBonus + situationalBonus;

  const advMode = ctx.advMode || 'normal';
  
  // Parse die formula
  const die = binding.die || (binding.kind === 'damage' || binding.kind === 'healing' ? '1d6' : '1d20');
  const { count, sides } = parseDiceFormula(die);

  // Roll dice
  const rolls: Array<{ value: number; sides: number }> = [];
  let rawResult = 0;

  if (binding.kind === 'attack' || binding.kind === 'check' || binding.kind === 'save') {
    // For d20 rolls, handle advantage/disadvantage
    if (advMode === 'adv') {
      const roll1 = rollDie(20);
      const roll2 = rollDie(20);
      rawResult = Math.max(roll1, roll2);
      rolls.push({ value: roll1, sides: 20 }, { value: roll2, sides: 20 });
    } else if (advMode === 'dis') {
      const roll1 = rollDie(20);
      const roll2 = rollDie(20);
      rawResult = Math.min(roll1, roll2);
      rolls.push({ value: roll1, sides: 20 }, { value: roll2, sides: 20 });
    } else {
      rawResult = rollDie(20);
      rolls.push({ value: rawResult, sides: 20 });
    }
  } else {
    // For damage/healing, roll multiple dice
    for (let i = 0; i < count; i++) {
      const roll = rollDie(sides);
      rawResult += roll;
      rolls.push({ value: roll, sides });
    }
  }

  const total = rawResult + totalModifier;

  // Check for crit
  let crit: 'success' | 'fail' | undefined;
  if (binding.kind === 'attack' || binding.kind === 'save' || binding.kind === 'check') {
    if (rawResult === 20 || (binding.crit && rawResult >= (binding.crit.on || 20))) {
      crit = 'success';
    } else if (rawResult === 1) {
      crit = 'fail';
    }
  }

  // Check DC if provided
  let passedDC: boolean | undefined;
  let margin: number | undefined;
  const dc = ctx.compareDC || (typeof binding.dc === 'number' ? binding.dc : binding.dc?.value);
  
  if (dc !== undefined) {
    passedDC = total >= dc;
    margin = total - dc;
  }

  // Build formula string
  let formulaParts = [`${die}`];
  if (abilityMod !== 0) {
    formulaParts.push(`${binding.ability}(${abilityMod >= 0 ? '+' : ''}${abilityMod})`);
  }
  if (flatBonus !== 0) {
    formulaParts.push(`${flatBonus >= 0 ? '+' : ''}${flatBonus}`);
  }
  if (situationalBonus !== 0) {
    formulaParts.push(`sit(${situationalBonus >= 0 ? '+' : ''}${situationalBonus})`);
  }

  return {
    formula: formulaParts.join(' '),
    rawResult,
    modifier: totalModifier,
    total,
    rolls,
    advantage: advMode === 'adv',
    disadvantage: advMode === 'dis',
    crit,
    dc,
    passedDC,
    margin,
  };
};

export const formatRollResult = (
  actionLabel: string,
  binding: RollBinding,
  result: RollResult
): string => {
  const kindIcon: Record<typeof binding.kind, string> = {
    attack: '🗡️',
    save: '🛡️',
    check: '🎲',
    damage: '💥',
    healing: '💚',
  };

  const icon = kindIcon[binding.kind] || '🎲';
  let output = `${icon} ${actionLabel} — ${binding.kind.toUpperCase()}`;
  
  if (result.advantage) output += ' (Adv)';
  if (result.disadvantage) output += ' (Dis)';
  output += '\n';

  if (result.rolls.length > 1 && (result.advantage || result.disadvantage)) {
    const rollValues = result.rolls.map(r => r.value).join(', ');
    const kept = result.advantage ? Math.max(...result.rolls.map(r => r.value)) : Math.min(...result.rolls.map(r => r.value));
    output += `Rolled: ${rollValues} → Kept: ${kept}\n`;
  } else if (result.rolls.length > 1) {
    output += `Rolled: ${result.rolls.map(r => r.value).join(', ')}\n`;
  } else {
    output += `Rolled: ${result.rawResult}\n`;
  }

  output += `Formula: ${result.formula} = ${result.total}\n`;

  if (result.crit === 'success') {
    output += `✨ CRITICAL SUCCESS!\n`;
  } else if (result.crit === 'fail') {
    output += `💀 CRITICAL FAILURE!\n`;
  }

  if (result.dc !== undefined && result.passedDC !== undefined) {
    const passIcon = result.passedDC ? '✅' : '❌';
    const verb = result.passedDC ? 'Pass' : 'Fail';
    output += `${passIcon} ${verb} DC ${result.dc} by ${Math.abs(result.margin || 0)}`;
  } else {
    output += `Result: ${result.total}`;
  }

  return output;
};
