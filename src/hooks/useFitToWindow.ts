import { useEffect, useRef } from 'react';

interface UseFitToWindowOptions {
  profileCardId?: string;
  chatPanelSelector?: string;
  maxScale?: number;
  gutterLeft?: number;
  gutterRight?: number;
  gutterTop?: number;
  gutterBottom?: number;
}

export function useFitToWindow({
  profileCardId = 'profileCard',
  chatPanelSelector = '.dice-log-panel',
  maxScale = 1.35,
  gutterLeft = 16,
  gutterRight = 16,
  gutterTop = 16,
  gutterBottom = 16,
}: UseFitToWindowOptions = {}) {
  const fitRootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fitRoot = fitRootRef.current;
    const canvas = canvasRef.current;

    if (!fitRoot || !canvas) return;

    const layoutFit = () => {
      const profileCard = document.getElementById(profileCardId);
      const chatPanel = document.querySelector(chatPanelSelector);

      // Get design sizes from CSS variables
      const computedStyle = getComputedStyle(canvas);
      const designW = parseFloat(computedStyle.getPropertyValue('width')) || 1400;
      const designH = parseFloat(computedStyle.getPropertyValue('height')) || 900;

      const vpW = window.innerWidth;
      const vpH = window.innerHeight;

      const profileW = (profileCard as HTMLElement)?.offsetWidth || 0;
      const chatW = (chatPanel as HTMLElement)?.offsetWidth || 0;

      // Calculate available space
      const availW = Math.max(320, vpW - profileW - chatW - gutterLeft - gutterRight);
      const availH = Math.max(360, vpH - gutterTop - gutterBottom);

      // Position the fit root - use relative positioning for natural page scroll
      fitRoot.style.position = 'relative';
      fitRoot.style.overflow = 'visible';
      fitRoot.style.height = 'auto';
      fitRoot.style.marginLeft = `0px`;
      fitRoot.style.marginRight = `0px`;
      fitRoot.style.paddingLeft = `${profileW + gutterLeft}px`;
      fitRoot.style.paddingRight = `${chatW + gutterRight}px`;

      // Calculate scale to fit both width and height
      const scaleW = availW / designW;
      const scaleH = availH / designH;

      // Use the smaller scale and cap at maxScale
      const scale = Math.min(scaleW, scaleH, maxScale);

      canvas.style.transform = `scale(${scale})`;

      // Center the canvas horizontally
      const scaledW = designW * scale;
      const leftoverW = Math.max(0, availW - scaledW);
      canvas.style.marginLeft = `${leftoverW / 2}px`;

      // No vertical centering - let page scroll naturally
      canvas.style.marginTop = '0px';
    };

    // Run layout on load and resize
    layoutFit();
    
    window.addEventListener('resize', layoutFit);

    // Observe profile card and chat panel for size changes
    const resizeObserver = new ResizeObserver(layoutFit);
    
    const profileCard = document.getElementById(profileCardId);
    const chatPanel = document.querySelector(chatPanelSelector);
    
    if (profileCard) resizeObserver.observe(profileCard);
    if (chatPanel) resizeObserver.observe(chatPanel);

    return () => {
      window.removeEventListener('resize', layoutFit);
      resizeObserver.disconnect();
    };
  }, [profileCardId, chatPanelSelector, maxScale, gutterLeft, gutterRight, gutterTop, gutterBottom]);

  return { fitRootRef, canvasRef };
}
