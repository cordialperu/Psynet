# 📱 Guía Rápida - Sistema de Navegación por Swipe

## ✅ Implementado y Funcionando

### 🏠 Página Principal (Home)
**Ubicación:** `/`

```
← Swipe Right          Swipe Left →
   Categoría              Categoría
   Anterior               Siguiente
   
         ↓ Swipe Down
      Volver a "All"
   (solo si estás en 
    categoría específica)
```

**Ejemplo de flujo:**
1. Estás en "Ceremonies"
2. Swipe Left → "Therapies"
3. Swipe Left → "Microdosing"
4. Swipe Right → "Therapies"
5. Swipe Down → "All Categories"

**Visual Feedback:**
- Barra vertical delgada en el borde (izquierdo/derecho)
- El botón de categoría se actualiza automáticamente
- Navegación circular (nunca termina)

---

### 📄 Página de Detalle de Publicación
**Ubicación:** `/therapy/:slug`

```
← Swipe Right          Swipe Left →
   Publicación            Publicación
   Anterior               Siguiente
   (misma categoría)      (misma categoría)
   
         ↓ Swipe Down
      Volver al Home
```

**Ejemplo de flujo:**
1. Estás viendo "Ayahuasca Ceremony"
2. Swipe Left → Siguiente ceremonia
3. Swipe Left → Otra ceremonia
4. Swipe Right → Volver a la anterior
5. Swipe Down → Regresar al home

**Visual Feedback:**
- Barra vertical delgada en el borde (izquierdo/derecho)
- Indicador de posición: "2 / 15" (abajo, centro)
- El botón de categoría se actualiza según la publicación actual
- Navegación circular dentro de la categoría

---

## 🎯 Características Clave

### ✨ Sincronización Automática
- El botón de categoría en el navbar **se actualiza automáticamente**
- Al navegar entre publicaciones, muestra la categoría actual
- Al hacer swipe en home, cambia inmediatamente

### 📊 Indicadores Visuales
- **Home:** Solo indicador de swipe (barra lateral)
- **Detalle:** Indicador de swipe + contador de posición
- Todos son minimalistas y no intrusivos

### 🔄 Navegación Circular
- En ambas páginas la navegación es infinita
- Al llegar al final, vuelve al principio
- Nunca te quedas sin opciones

### 📱 Solo Móvil
- Los swipes solo funcionan en pantallas táctiles
- En desktop: navegación normal con mouse

---

## ⚙️ Configuración Técnica

### Sensibilidad del Swipe

**Página Principal:**
- Distancia mínima: 80px
- Velocidad: 0.5
- Tiempo máximo: 600ms
- Haptic: Light

**Página de Detalle:**
- Distancia mínima: 80px
- Velocidad: 0.5
- Tiempo máximo: 600ms
- Haptic: Light

### Prevención de Conflictos
- ✅ Scroll vertical siempre permitido
- ✅ Solo detecta swipes con dirección clara
- ✅ Ratio horizontal vs vertical: 1.5x
- ✅ Movimiento inicial > 30px antes de activar

---

## 🧪 Cómo Probar

### En iPhone/Android:
1. Abre Safari/Chrome en tu móvil
2. Ve a: `http://192.168.1.49:5001`
3. Prueba los swipes en home y detalle

### En Simulador (Chrome DevTools):
1. Abre Chrome DevTools (F12)
2. Click en el ícono de móvil (Ctrl+Shift+M)
3. Selecciona un dispositivo móvil
4. Usa el mouse para simular toques

---

## ❌ Problemas Comunes

### "El swipe no funciona"
- ✅ Asegúrate de hacer un movimiento rápido y decidido
- ✅ Desliza al menos 80px
- ✅ No hagas movimientos diagonales

### "Se activa el swipe cuando hago scroll"
- ✅ Sistema automáticamente diferencia scroll de swipe
- ✅ Scroll vertical: movimiento predominantemente vertical
- ✅ Swipe horizontal: movimiento predominantemente horizontal

### "El botón de categoría no se actualiza"
- ✅ Verifica que estés en la página principal
- ✅ El sistema debe estar escuchando eventos
- ✅ Recarga la página si es necesario

---

## 📝 Comandos para Desarrollo

```bash
# Iniciar servidor
npm run dev

# Acceder desde iPhone en la red
http://[TU-IP-LOCAL]:5001

# Ver logs en tiempo real
# Los logs muestran las peticiones y eventos
```

---

## 🎨 Personalización Futura

Si quieres ajustar la sensibilidad, edita estos archivos:

**Home:** `client/src/pages/home-apple-v3.tsx`
```typescript
// Línea ~183
const swipeHandlers = useSwipe({...}, {
  minDistance: 80,      // ← Ajusta esto
  velocityThreshold: 0.5, // ← Y esto
  maxTime: 600,
});
```

**Detalle:** `client/src/pages/therapy-detail-new.tsx`
```typescript
// Línea ~131
const swipeHandlers = useSwipe({...}, {
  minDistance: 80,      // ← Ajusta esto
  velocityThreshold: 0.5, // ← Y esto
  maxTime: 600,
});
```

---

## ✅ Estado Actual

- [x] Swipe horizontal entre categorías (Home)
- [x] Swipe horizontal entre publicaciones (Detalle)
- [x] Swipe down para back navigation
- [x] Sincronización automática de categorías
- [x] Feedback visual minimalista
- [x] Haptic feedback
- [x] Indicador de posición
- [x] Navegación circular
- [x] Optimización iOS/Android

**Todo funcionando correctamente! 🎉**
