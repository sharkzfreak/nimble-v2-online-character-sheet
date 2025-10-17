import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CardSize {
  width?: number;
  height?: number;
}

const MIN_WIDTH = 260;
const MIN_HEIGHT = 180;
const MAX_HEIGHT_VH = 0.8;

export function useResizableCard(characterId: string, cardId: string) {
  const [size, setSize] = useState<CardSize>({});
  const [isResizing, setIsResizing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Load saved size from Supabase
  useEffect(() => {
    async function loadSize() {
      try {
        const { data, error } = await supabase
          .from('ui_state')
          .select('width, height')
          .eq('character_id', characterId)
          .eq('card_id', cardId)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setSize({ width: data.width || undefined, height: data.height || undefined });
        }
      } catch (error) {
        console.error('Error loading card size:', error);
        // Fallback to localStorage
        const localSize = localStorage.getItem(`cardSize:${characterId}:${cardId}`);
        if (localSize) {
          setSize(JSON.parse(localSize));
        }
      }
    }
    loadSize();
  }, [characterId, cardId]);

  // Save size to Supabase
  const saveSize = useCallback(async (newSize: CardSize) => {
    try {
      const { error } = await supabase
        .from('ui_state')
        .upsert({
          character_id: characterId,
          card_id: cardId,
          width: newSize.width || null,
          height: newSize.height || null,
        }, {
          onConflict: 'character_id,card_id'
        });

      if (error) throw error;
      
      // Also save to localStorage as backup
      localStorage.setItem(`cardSize:${characterId}:${cardId}`, JSON.stringify(newSize));
    } catch (error) {
      console.error('Error saving card size:', error);
      // Fallback to localStorage only
      localStorage.setItem(`cardSize:${characterId}:${cardId}`, JSON.stringify(newSize));
    }
  }, [characterId, cardId]);

  // Reset size
  const resetSize = useCallback(async () => {
    setSize({});
    await saveSize({});
  }, [saveSize]);

  // Handle resize
  const handleResize = useCallback((startX: number, startY: number, startW: number, startH: number) => {
    const onMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      const parentWidth = cardRef.current.parentElement?.clientWidth || window.innerWidth;
      const maxHeight = window.innerHeight * MAX_HEIGHT_VH;
      
      const newWidth = Math.max(MIN_WIDTH, Math.min(startW + dx, parentWidth));
      const newHeight = Math.max(MIN_HEIGHT, Math.min(startH + dy, maxHeight));
      
      setSize({ width: newWidth, height: newHeight });
    };

    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      
      const finalSize = { ...size };
      saveSize(finalSize);
    };

    setIsResizing(true);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [size, saveSize]);

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    handleResize(e.clientX, e.clientY, rect.width, rect.height);
  }, [handleResize]);

  return {
    cardRef,
    size,
    isResizing,
    onResizeStart,
    resetSize,
  };
}
