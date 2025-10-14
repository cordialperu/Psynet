# Sistema de Navegación por Swipe

## Descripción

El aplicativo móvil ahora incluye un sistema completo de navegación por gestos de swipe, optimizado para dispositivos táctiles (móviles y tablets).

## Funcionalidades Implementadas

### 1. Navegación Horizontal entre Categorías (Página Principal)

**Ubicación:** `HomeAppleV3` (`/`)

- **Swipe Left (→):** Navega a la siguiente categoría
- **Swipe Right (←):** Navega a la categoría anterior
- **Orden circular:** Las categorías forman un ciclo, permitiendo navegación infinita

**Configuración:**
- Distancia mínima: 80px
- Velocidad requerida: 0.5
- Tiempo máximo: 600ms
- Feedback: Indicador visual minimalista + haptic feedback ligero

### 2. Navegación Horizontal entre Publicaciones (Detalle)

**Ubicación:** `TherapyDetailNew` (`/therapy/:slug`)

- **Swipe Left (→):** Siguiente publicación de la misma categoría
- **Swipe Right (←):** Publicación anterior de la misma categoría
- **Navegación circular:** Las publicaciones forman un ciclo dentro de la categoría
- **Indicador de posición:** Muestra "X / Total" en la parte inferior (solo móvil)
- **Actualización automática:** El selector de categoría en el navbar se actualiza automáticamente

**Configuración:**
- Distancia mínima: 80px
- Velocidad requerida: 0.5
- Tiempo máximo: 600ms
- Feedback: Indicador visual minimalista + haptic feedback ligero

### 3. Navegación Vertical hacia Abajo (Back Navigation)

#### a) Desde Página Principal
**Acción:** Swipe Down (↓)
**Resultado:** Si estás en una categoría específica, vuelve a "All Categories"

#### b) Desde Detalle de Publicación
**Acción:** Swipe Down (↓)
**Resultado:** Regresa a la página anterior (home)

**Configuración:**
- Distancia mínima: 100px
- Velocidad requerida: 0.6
- Tiempo máximo: 500ms
- Feedback: Indicador visual minimalista + haptic feedback medio

## Características Técnicas

### Hook useSwipe

Ubicación: `client/src/hooks/use-swipe.ts`

**Parámetros configurables:**
```typescript
{
  minDistance: number;        // Distancia mínima en px
  maxTime: number;           // Tiempo máximo en ms
  preventDefaultMove: boolean; // Prevenir scroll nativo
  velocityThreshold: number;  // Velocidad mínima
  enableHaptic: boolean;     // Activar feedback háptico
  hapticIntensity: 'light' | 'medium' | 'heavy';
}
```

**Callbacks disponibles:**
```typescript
{
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: (x: number, y: number) => void;
  onSwipeEnd?: () => void;
}
```

### Validación de Dirección

El sistema implementa validación estricta de dirección para evitar activaciones accidentales:

- **Swipe Horizontal:** `absX > absY * 1.5`
- **Swipe Vertical:** `absY > absX * 1.5`

Esto asegura que solo se detecten swipes con una dirección clara e intencional.

### Prevención de Conflictos con Scroll

- **Movimiento inicial:** Se requiere > 30px antes de marcar como swipe
- **Scroll vertical:** Permitido por defecto (excepto en carousel)
- **Prevent Default:** Solo se activa para swipes horizontales claros (diffX > diffY * 2)

## Feedback Visual

Todos los indicadores son minimalistas y no intrusivos:

- **Indicador horizontal:** Barra vertical delgada (2px × 48px) semi-transparente
- **Indicador vertical:** Barra horizontal delgada (64px × 6px) semi-transparente
- **Duración:** 150-300ms con fade-out automático
- **Posición:** En los bordes de la pantalla

## Feedback Háptico

Sistema de vibración para mejorar la experiencia táctil:

- **Light:** Navegación horizontal entre categorías/publicaciones
- **Medium:** Navegación back desde página principal
- **Heavy:** No utilizado (reservado para acciones críticas)

Compatible con:
- API de Vibración del navegador
- iOS Haptic Feedback API (cuando disponible)

## Optimizaciones para iOS

Archivo: `client/src/lib/mobile-utils.ts`

Funciones aplicadas automáticamente:
- `-webkit-overflow-scrolling: touch` para scroll suave
- `overscroll-behavior: contain` para prevenir bounce
- `-webkit-tap-highlight-color: transparent` para mejor UX táctil

## Comportamiento Responsive

**Móvil (< 768px):**
- Grid de 1 columna con tarjetas completas
- Swipe entre categorías activo
- Swipe down para back navigation

**Desktop (> 768px):**
- Grid de 2 columnas
- Los swipes no están activos
- Navegación tradicional con mouse/teclado

## Recomendaciones de Uso

1. **Swipes rápidos y decididos:** Los movimientos deben ser claros e intencionales
2. **Dirección definida:** Evitar movimientos diagonales
3. **Distancia suficiente:** Completar el gesto con movimiento amplio
4. **No confundir con scroll:** El sistema diferencia automáticamente

## Testing

Para probar en diferentes dispositivos:
- **iOS Safari:** Soporta haptic feedback completo
- **Android Chrome:** Usa vibración API como fallback
- **Simulador móvil:** Usar Chrome DevTools (modo táctil)
- **iPhone local:** Acceder a `http://[IP]:5001` desde la red

## Archivos Modificados

```
client/src/
├── hooks/
│   └── use-swipe.ts                 (nuevo)
├── lib/
│   └── mobile-utils.ts              (nuevo)
├── pages/
│   ├── home-apple-v3.tsx           (modificado)
│   └── therapy-detail-new.tsx       (modificado)
```

## Sincronización de Categorías

El sistema mantiene sincronizado el selector de categorías del navbar con la publicación actual:

**Eventos personalizados:**
- `psynet:therapy-category`: Emitido cuando se carga o navega a una publicación
- `psynet:category`: Emitido cuando se selecciona una categoría en el navbar
- `psynet:search`: Emitido cuando se busca en el navbar

**Flujo:**
1. Usuario navega por swipe entre publicaciones
2. Se emite evento `psynet:therapy-category` con la categoría de la nueva publicación
3. El navbar escucha el evento y actualiza el selector
4. El botón de categoría muestra la categoría actual con su color distintivo

## Notas de Implementación
### Decisión de Diseño: Sin Carousel en Home

Se decidió **NO implementar** un carousel de publicaciones en la página principal por las siguientes razones:

1. **Mejor visibilidad:** El grid permite ver múltiples publicaciones a la vez
2. **Scroll nativo:** Los usuarios están más familiarizados con scroll vertical
3. **Menos conflictos:** Evita confusión entre swipe horizontal y scroll vertical
4. **Accesibilidad:** Todas las publicaciones son inmediatamente accesibles

### Decisión de Diseño: Swipe en Detalle

SIN EMBARGO, en la **página de detalle** sí se implementa swipe horizontal porque:

1. **Contexto claro:** El usuario ya está viendo una publicación específica
2. **Navegación rápida:** Permite explorar publicaciones relacionadas sin volver atrás
3. **Sin conflictos:** En detalle no hay scroll horizontal, solo vertical
4. **UX intuitiva:** Similar a galerías de fotos o historias en redes sociales

## Próximas Mejoras

- [ ] Animaciones de transición entre categorías
- [ ] Gestos personalizables por usuario
- [ ] Preload de contenido al hacer swipe
- [ ] Animaciones de entrada mejoradas
