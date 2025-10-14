import { useRef, useCallback } from 'react';
import { hapticFeedback } from '@/lib/mobile-utils';

export interface SwipeConfig {
  minDistance?: number;
  maxTime?: number;
  preventDefaultMove?: boolean;
  velocityThreshold?: number;
  enableHaptic?: boolean;
  hapticIntensity?: 'light' | 'medium' | 'heavy';
}

export interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: (x: number, y: number) => void;
  onSwipeEnd?: () => void;
}

export interface SwipeOutput {
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
  onTouchEnd: () => void;
  isSwiping: boolean;
}

export function useSwipe(
  handlers: SwipeHandlers = {},
  config: SwipeConfig = {}
): SwipeOutput {
  const {
    minDistance = 50,
    maxTime = 1000,
    preventDefaultMove = false,
    velocityThreshold = 0.3,
    enableHaptic = true,
    hapticIntensity = 'light',
  } = config;

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onSwipeStart,
    onSwipeEnd,
  } = handlers;

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  const onTouchStart = useCallback(
    (event: React.TouchEvent) => {
      const touch = event.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      touchStartTime.current = Date.now();
      isSwiping.current = false;
      
      onSwipeStart?.(touch.clientX, touch.clientY);
    },
    [onSwipeStart]
  );

  const onTouchMove = useCallback(
    (event: React.TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;

      const touch = event.touches[0];
      touchEndX.current = touch.clientX;
      touchEndY.current = touch.clientY;

      const diffX = Math.abs(touchStartX.current - touchEndX.current);
      const diffY = Math.abs(touchStartY.current - touchEndY.current);

      // Detect if this is likely a swipe gesture
      // Requiere mayor movimiento antes de marcar como swipe
      if (diffX > 30 || diffY > 30) {
        isSwiping.current = true;
        
        // Prevent default solo para swipes horizontales claros
        if (preventDefaultMove && diffX > diffY * 2) {
          event.preventDefault();
        }
      }
    },
    [preventDefaultMove]
  );

  const onTouchEnd = useCallback(() => {
    if (!touchStartX.current || !touchStartY.current) {
      // Reset all values
      touchStartX.current = 0;
      touchStartY.current = 0;
      touchEndX.current = 0;
      touchEndY.current = 0;
      touchStartTime.current = 0;
      isSwiping.current = false;
      return;
    }

    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    const timeDiff = Date.now() - touchStartTime.current;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);
    const velocity = Math.max(absX, absY) / timeDiff;

    // Check if it's a valid swipe
    // Añadimos validación de dirección clara
    const isHorizontalSwipe = absX > absY * 1.5;
    const isVerticalSwipe = absY > absX * 1.5;
    const hasValidDirection = isHorizontalSwipe || isVerticalSwipe;
    
    const isValidSwipe =
      (absX > minDistance || absY > minDistance) &&
      timeDiff < maxTime &&
      velocity > velocityThreshold &&
      isSwiping.current &&
      hasValidDirection;

    if (isValidSwipe) {
      // Provide haptic feedback before executing swipe
      if (enableHaptic) {
        hapticFeedback(hapticIntensity);
      }
      
      // Determine swipe direction with stricter validation
      if (isHorizontalSwipe) {
        // Horizontal swipe
        if (diffX > 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (diffX < 0 && onSwipeRight) {
          onSwipeRight();
        }
      } else if (isVerticalSwipe) {
        // Vertical swipe
        if (diffY > 0 && onSwipeUp) {
          onSwipeUp();
        } else if (diffY < 0 && onSwipeDown) {
          onSwipeDown();
        }
      }
    }

    // Call onSwipeEnd if provided
    onSwipeEnd?.();

    // Reset all values
    touchStartX.current = 0;
    touchStartY.current = 0;
    touchEndX.current = 0;
    touchEndY.current = 0;
    touchStartTime.current = 0;
    isSwiping.current = false;
  }, [minDistance, maxTime, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onSwipeEnd]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping: isSwiping.current,
  };
}