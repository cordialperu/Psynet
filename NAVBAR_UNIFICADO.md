# ✅ Navbar Unificado - Landing Page

## 🎯 Cambios Implementados

Se ha unificado el navbar eliminando el botón "Portal de Guías" y integrando los filtros de ceremonias en una sola barra.

---

## 📐 Estructura Anterior

### **Dos Barras Separadas:**

```
┌─────────────────────────────────────────┐
│ Psynet    Ceremonias  Cómo Funciona    │
│                      [Portal de Guías]  │ ← Barra 1
├─────────────────────────────────────────┤
│ [Todas] [Ayahuasca] [San Pedro] ...    │ ← Barra 2
└─────────────────────────────────────────┘
```

**Problemas:**
- ❌ Dos encabezados ocupan mucho espacio
- ❌ Botón "Portal de Guías" muy prominente
- ❌ Filtros en barra separada

---

## 📐 Estructura Nueva

### **Una Sola Barra:**

```
┌─────────────────────────────────────────────────────────┐
│ Psynet  [Todas] [Ayahuasca] [San Pedro] [Kambo] ...  👤│
└─────────────────────────────────────────────────────────┘
```

**Ventajas:**
- ✅ Todo en una sola línea
- ✅ Más espacio para contenido
- ✅ Filtros inmediatamente visibles
- ✅ Avatar solo si está logueado

---

## 🎨 Elementos del Navbar

### **1. Logo (Izquierda)**
```tsx
<span className="text-xl font-serif font-bold text-gray-900">
  Psynet
</span>
```
- Tamaño: `text-xl` (moderado)
- Font: Serif (elegante)
- Color: Negro

### **2. Filtros (Centro)**
```tsx
<div className="flex-1 mx-8 overflow-x-auto scrollbar-hide">
  <div className="flex gap-2 justify-center">
    [Todas] [Ayahuasca] [San Pedro] ...
  </div>
</div>
```
- Posición: Centro con `flex-1` y `justify-center`
- Scroll horizontal en mobile
- Pills con `rounded-full`
- Padding reducido: `px-4 py-1.5`

### **3. Avatar (Derecha)**
```tsx
<div className="flex items-center">
  {/* Avatar solo si está logueado */}
</div>
```
- Solo visible si el usuario está logueado
- Dropdown con opciones del perfil

---

## 📱 "Portal de Guías" Movido al Footer

### **Ubicación Nueva:**
```
Footer (abajo de todo):
Ceremonias | Cómo Funciona | Portal de Guías
```

### **Características:**
- ✅ Tamaño muy pequeño: `text-xs`
- ✅ Color discreto: `text-gray-500`
- ✅ Link a: `/guia/dashboard`
- ✅ Hover: `hover:text-gray-900`

---

## 🎨 Estilos de los Filtros

### **Botón No Seleccionado:**
```css
bg-gray-100
text-gray-900
hover:bg-gray-200
```

### **Botón Seleccionado:**
```css
bg-gray-900
text-white
```

### **Características:**
- Border radius: `rounded-full`
- Padding: `px-4 py-1.5` (compacto)
- Font size: `text-sm`
- Transición suave: `transition-all duration-200`

---

## 📱 Responsive

### **Desktop:**
```
┌──────────────────────────────────────────────────┐
│ Psynet  [Todas] [Ayahuasca] [San Pedro] ...  👤 │
└──────────────────────────────────────────────────┘
```

### **Mobile:**
```
┌────────────────────────────────┐
│ Psynet  [Todas] [Ayah...] →  👤│
└────────────────────────────────┘
```
- Scroll horizontal para los filtros
- `overflow-x-auto`
- `scrollbar-hide` para ocultar scrollbar

---

## 🔄 Flujo de Acceso para Guías

### **Antes:**
```
1. Usuario ve botón "Portal de Guías" en navbar
2. Click → Abre dialog de login
3. Login → Redirige a dashboard
```

### **Después:**
```
1. Usuario navega hasta el footer
2. Click en "Portal de Guías" (texto pequeño)
3. Redirige a /guia/dashboard
4. Si no está logueado → Muestra mensaje de login
```

---

## 📊 Comparación Visual

### **Antes (Dos Barras):**
```
┌─────────────────────────────────────────┐
│ Logo  Links            [Portal Guías]   │ 64px
├─────────────────────────────────────────┤
│ [Todas] [Ayahuasca] [San Pedro] ...    │ 64px
├─────────────────────────────────────────┤
│                                         │
│         Contenido                       │
│                                         │
└─────────────────────────────────────────┘
Total header: 128px
```

### **Después (Una Barra):**
```
┌─────────────────────────────────────────┐
│ Logo [Todas] [Ayahuasca] [San Pedro] 👤│ 64px
├─────────────────────────────────────────┤
│                                         │
│         Contenido                       │
│                                         │
│                                         │
└─────────────────────────────────────────┘
Total header: 64px
```

**Ahorro:** 64px de altura (50% menos)

---

## ✅ Checklist de Cambios

- [x] Eliminado botón "Portal de Guías" del navbar
- [x] Eliminado links "Ceremonias" y "Cómo Funciona" del navbar
- [x] Integrados filtros en el navbar principal
- [x] Logo más pequeño (text-xl)
- [x] Filtros centrados con flex-1
- [x] Avatar solo si está logueado
- [x] "Portal de Guías" movido al footer
- [x] Footer con texto muy pequeño (text-xs)
- [x] Una sola barra en lugar de dos
- [x] Removido import de MainNavbar no usado

---

## 🎯 Resultado Final

El navbar ahora:
- ✅ **Ocupa menos espacio** - 64px en lugar de 128px
- ✅ **Más limpio** - Sin botones innecesarios
- ✅ **Filtros visibles** - Inmediatamente accesibles
- ✅ **Portal discreto** - En el footer, muy pequeño
- ✅ **Una sola línea** - Todo integrado

**¡El navbar está unificado y optimizado!** 🎉
