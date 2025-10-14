# 🌙 Modo Oscuro - Implementación

## ✅ Funcionalidad Implementada

Se ha agregado un modo oscuro que se activa al hacer click en el logo "Psynet".

---

## 🎯 Cómo Funciona

### **Activación:**
```
Click en "Psynet" (logo) → Toggle modo oscuro
```

### **Comportamiento:**
- ✅ Click en el logo alterna entre modo claro y oscuro
- ✅ Transiciones suaves de 300ms
- ✅ Todos los elementos cambian de color automáticamente

---

## 🎨 Cambios de Color

### **Modo Claro → Modo Oscuro**

| Elemento | Claro | Oscuro |
|----------|-------|--------|
| **Fondo principal** | Blanco | Gris 900 (#111827) |
| **Navbar** | Blanco/80 | Gris 900/80 |
| **Logo "Psynet"** | Negro | Blanco |
| **Bordes** | Gris 200 | Gris 700 |
| **Tarjetas** | Blanco | Gris 800 |
| **Títulos** | Negro | Blanco |
| **Texto** | Gris 600 | Gris 300 |
| **Filtros activos** | Negro con texto blanco | Blanco con texto negro |
| **Filtros inactivos** | Gris 100 | Gris 800 |
| **Footer** | Gris 500 | Gris 400 |

---

## 🔧 Implementación Técnica

### **Estado:**
```typescript
const [darkMode, setDarkMode] = useState(false);

const toggleDarkMode = () => {
  setDarkMode(!darkMode);
};
```

### **Aplicación al DOM:**
```typescript
useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);
```

### **Clases Tailwind:**
```tsx
// Ejemplo de elemento con dark mode
<div className="bg-white dark:bg-gray-900 transition-colors duration-300">
```

---

## 🎨 Elementos con Dark Mode

### **1. Fondo Principal**
```tsx
<div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
```

### **2. Navbar**
```tsx
<nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
```

### **3. Logo (Clickeable)**
```tsx
<button onClick={toggleDarkMode}>
  <span className="text-gray-900 dark:text-white transition-colors duration-300">
    Psynet
  </span>
</button>
```

### **4. Filtros**
```tsx
// Filtro activo
className="bg-gray-900 dark:bg-white text-white dark:text-gray-900"

// Filtro inactivo
className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
```

### **5. Tarjetas de Ceremonias**
```tsx
// Fondo de tarjeta
className="bg-white dark:bg-gray-800"

// Título
className="text-gray-900 dark:text-white"

// Descripción
className="text-gray-600 dark:text-gray-300"

// Badge de tipo
className="bg-white/95 dark:bg-gray-900/95"
```

### **6. Footer**
```tsx
<footer className="border-t border-gray-200 dark:border-gray-700">
  <div className="text-gray-500 dark:text-gray-400">
    © 2025 Psynet
  </div>
</footer>
```

---

## ⚡ Transiciones

Todos los elementos tienen transiciones suaves:

```css
transition-colors duration-300
```

Esto hace que el cambio entre modo claro y oscuro sea suave y agradable.

---

## 🎯 Experiencia de Usuario

### **Modo Claro:**
```
┌─────────────────────────────────┐
│ Psynet [Filtros...]          👤│ ← Navbar blanco
├─────────────────────────────────┤
│                                 │
│ ┌─────────────┐ ┌─────────────┐│
│ │ Ceremonia 1 │ │ Ceremonia 2 ││ ← Tarjetas blancas
│ │ Fondo blanco│ │ Texto negro ││
│ └─────────────┘ └─────────────┘│
│                                 │
└─────────────────────────────────┘
```

### **Modo Oscuro:**
```
┌─────────────────────────────────┐
│ Psynet [Filtros...]          👤│ ← Navbar gris oscuro
├─────────────────────────────────┤
│                                 │
│ ┌─────────────┐ ┌─────────────┐│
│ │ Ceremonia 1 │ │ Ceremonia 2 ││ ← Tarjetas gris 800
│ │ Fondo oscuro│ │ Texto blanco││
│ └─────────────┘ └─────────────┘│
│                                 │
└─────────────────────────────────┘
```

---

## 🔄 Flujo Completo

```
1. Usuario ve la página (modo claro por defecto)
   ↓
2. Click en "Psynet"
   ↓
3. darkMode = true
   ↓
4. document.documentElement.classList.add('dark')
   ↓
5. Todas las clases dark:* se activan
   ↓
6. Transición suave de 300ms
   ↓
7. Página en modo oscuro
   ↓
8. Click en "Psynet" nuevamente
   ↓
9. darkMode = false
   ↓
10. Vuelve a modo claro
```

---

## 📱 Responsive

El modo oscuro funciona perfectamente en:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

Todos los elementos mantienen su diseño responsive en ambos modos.

---

## 🎨 Paleta de Colores Oscuros

### **Grises Utilizados:**
```
gray-900: #111827 (Fondo principal)
gray-800: #1F2937 (Tarjetas, filtros)
gray-700: #374151 (Bordes)
gray-400: #9CA3AF (Texto secundario)
gray-300: #D1D5DB (Texto principal)
white:    #FFFFFF (Logo, títulos)
```

---

## ✅ Checklist de Elementos

- [x] Fondo principal
- [x] Navbar
- [x] Logo "Psynet" (clickeable)
- [x] Filtros de ceremonias
- [x] Tarjetas de ceremonias
- [x] Títulos
- [x] Descripciones
- [x] Badges de tipo
- [x] Iconos (Infinity, MapPin, Clock)
- [x] Footer
- [x] Links del footer
- [x] Transiciones suaves

---

## 🎯 Resultado Final

El modo oscuro:
- ✅ **Se activa con un click** en el logo
- ✅ **Invierte todos los colores** (blanco ↔ negro)
- ✅ **Transiciones suaves** de 300ms
- ✅ **Mantiene la legibilidad** en ambos modos
- ✅ **Diseño consistente** en todos los elementos

**¡El modo oscuro está completamente funcional!** 🌙
