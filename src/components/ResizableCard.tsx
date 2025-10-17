import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useResizableCard } from '@/hooks/useResizableCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResizableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  characterId: string;
  cardId: string;
  children: React.ReactNode;
  className?: string;
}

export function ResizableCard({ 
  characterId, 
  cardId, 
  children, 
  className,
  ...props 
}: ResizableCardProps) {
  const { cardRef, size, isResizing, onResizeStart } = useResizableCard(characterId, cardId);
  const isMobile = useIsMobile();

  return (
    <Card
      ref={cardRef}
      className={cn(
        "relative overflow-visible",
        isResizing && "outline outline-2 outline-primary outline-offset-2",
        className
      )}
      style={{
        width: size.width ? `${size.width}px` : undefined,
        height: size.height ? `${size.height}px` : undefined,
        minWidth: `${260}px`,
        minHeight: `${180}px`,
        maxWidth: '100%',
        maxHeight: '80vh',
      }}
      {...props}
    >
      {children}
      {!isMobile && (
        <button
          className="absolute right-1.5 bottom-1.5 w-4 h-4 cursor-nwse-resize rounded-sm opacity-50 hover:opacity-100 transition-opacity"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0.1))',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)',
          }}
          onMouseDown={onResizeStart}
          aria-label="Resize card"
          tabIndex={0}
        />
      )}
    </Card>
  );
}
