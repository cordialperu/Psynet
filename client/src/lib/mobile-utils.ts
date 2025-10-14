// Utilidades para dispositivos móviles y feedback haptic

/**
 * Genera feedback háptico si está disponible
 */
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light'): void {
  if ('navigator' in window && 'vibrate' in navigator) {
    // Fallback a vibración para dispositivos que no soportan Haptic Feedback API
    const vibrationPatterns = {
      light: [10],
      medium: [20],
      heavy: [50]
    };
    navigator.vibrate(vibrationPatterns[type]);
    return;
  }

  // Para dispositivos iOS con Haptic Feedback API
  if ('Haptics' in window) {
    try {
      switch (type) {
        case 'light':
          (window as any).Haptics.impact({ style: 'light' });
          break;
        case 'medium':
          (window as any).Haptics.impact({ style: 'medium' });
          break;
        case 'heavy':
          (window as any).Haptics.impact({ style: 'heavy' });
          break;
      }
    } catch (error) {
      console.debug('Haptic feedback not available:', error);
    }
  }
}

/**
 * Detecta si el dispositivo es móvil
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
}

/**
 * Detecta si el dispositivo soporta touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Previene el zoom en double-tap en iOS
 */
export function preventDoubleTabZoom(element: HTMLElement): () => void {
  let lastTouchEnd = 0;
  
  const handleTouchEnd = (event: TouchEvent) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  };

  element.addEventListener('touchend', handleTouchEnd, { passive: false });
  
  return () => {
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

/**
 * Mejora el scroll en iOS Safari
 */
export function improveIOSScrolling(): void {
  if (typeof window === 'undefined') return;
  
  // Aplica -webkit-overflow-scrolling: touch para mejor scroll
  const style = document.createElement('style');
  style.textContent = `
    .ios-momentum-scroll {
      -webkit-overflow-scrolling: touch;
      overflow-scrolling: touch;
    }
    
    /* Previene el bounce en iOS */
    .no-bounce {
      overscroll-behavior: contain;
      -webkit-scroll-behavior: auto;
    }
    
    /* Mejora la selección táctil */
    .touch-optimized {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
  `;
  document.head.appendChild(style);
  
  // Aplica la clase al body
  document.body.classList.add('ios-momentum-scroll', 'no-bounce');
}

/**
 * Crea un indicador visual de swipe
 */
export function createSwipeIndicator(
  direction: 'left' | 'right' | 'up' | 'down',
  message: string,
  duration = 1500
): void {
  const indicator = document.createElement('div');
  indicator.className = 'swipe-indicator';
  
  const positions = {
    left: 'left-4 top-1/2 -translate-y-1/2',
    right: 'right-4 top-1/2 -translate-y-1/2',
    up: 'top-20 left-1/2 -translate-x-1/2',
    down: 'top-4 left-1/2 -translate-x-1/2'
  };
  
  const arrows = {
    left: 'M15 19l-7-7 7-7',
    right: 'M9 5l7 7-7 7',
    up: 'M19 15l-7-7-7 7',
    down: 'M5 9l7 7 7-7'
  };
  
  const rotations = {
    left: '',
    right: 'rotate-180',
    up: 'rotate-90',
    down: '-rotate-90'
  };
  
  indicator.className = `fixed ${positions[direction]} z-50 pointer-events-none transition-all duration-300 animate-pulse`;
  indicator.innerHTML = `
    <div class="px-4 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-lg">
      <div class="flex items-center gap-2 text-sm text-gray-900 dark:text-white font-medium">
        <svg class="w-4 h-4 ${rotations[direction]}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${arrows[direction]}" />
        </svg>
        ${message}
      </div>
    </div>
  `;
  
  document.body.appendChild(indicator);
  
  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.style.opacity = '0';
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }, 300);
    }
  }, duration);
}