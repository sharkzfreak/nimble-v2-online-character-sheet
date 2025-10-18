import { useEffect, useState } from 'react';

export type LayoutPreset = 'compact' | 'standard' | 'spacious' | 'gm';

const PRESET_CLASSES = {
  compact: 'preset-compact',
  standard: 'preset-standard',
  spacious: 'preset-spacious',
  gm: 'preset-gm',
} as const;

const getPresetKey = (characterId?: string) => 
  `ui:preset:${characterId || 'default'}`;

export const useLayoutPreset = (characterId?: string) => {
  const [preset, setPresetState] = useState<LayoutPreset>(() => {
    const stored = localStorage.getItem(getPresetKey(characterId));
    return (stored as LayoutPreset) || 'standard';
  });

  useEffect(() => {
    // Apply preset class to body
    Object.values(PRESET_CLASSES).forEach(cls => {
      document.body.classList.remove(cls);
    });
    document.body.classList.add(PRESET_CLASSES[preset]);
  }, [preset]);

  const setPreset = (newPreset: LayoutPreset) => {
    setPresetState(newPreset);
    localStorage.setItem(getPresetKey(characterId), newPreset);
    
    // Optional: persist to Supabase if needed
    // Could be added later for cross-device sync
  };

  return { preset, setPreset };
};
