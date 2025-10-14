# 🎨 Plan de Refactorización - Panel de Guías

## 📅 Fecha: 2025-10-12 19:00

---

## ✅ Completado

### 1. Dashboard de Guías Modernizado
- ✅ Fondo adaptable (white/dark:bg-gray-900)
- ✅ Tipografía consistente con home (font-serif)
- ✅ Tarjetas de estadísticas con bordes de colores
- ✅ Tabla con dark mode y hover effects
- ✅ Botones con estilo Apple (rounded-xl)
- ✅ Estado vacío mejorado con emoji
- ✅ Transiciones suaves (duration-300)

**Archivo:** `/client/src/pages/guia/dashboard.tsx`

---

## 🚧 En Progreso

### 2. Formulario de Creación/Edición
**Archivo:** `/client/src/pages/admin/therapy-form.tsx`

#### Cambios necesarios:
- Actualizar diseño visual para coincidir con el resto de la app
- Mejorar cards con bordes redondeados y dark mode
- Modernizar inputs y selects
- Agregar transiciones

### 3. Sistema de Fechas y Horas

#### Requerimientos por Categoría:

| Categoría | Fechas | Horas | Comportamiento |
|-----------|--------|-------|----------------|
| **Ceremonias** | ✅ Múltiples | ❌ No | Selector de fechas disponibles |
| **Terapias** | ✅ Múltiples | ✅ Opcionales | Si 1 hora: informativa, Si múltiples: selector |
| **Eventos** | ✅ Múltiples | ✅ Fija | Hora fija por evento, solo informativa |
| **Productos** | ❌ No | ❌ No | No requieren fecha/hora |
| **Microdosis** | ❌ No | ❌ No | No requieren fecha/hora |
| **Medicina** | ❌ No | ❌ No | No requieren fecha/hora |

---

## 📋 Próximos Pasos

### Paso 1: Mejorar Selector de Fechas

#### Actual:
```typescript
<Calendar
  mode="multiple"
  selected={selectedDates}
  onSelect={(dates) => setSelectedDates(dates || [])}
  className="rounded-md border mt-2"
/>
```

#### Propuesta:
- Diseño más intuitivo
- Bordes redondeados (rounded-2xl)
- Dark mode completo
- Indicadores visuales claros de fechas seleccionadas
- Colores según categoría

---

### Paso 2: Implementar Selector de Horas

#### Estructura de datos:
```typescript
interface TimeSlot {
  date: string; // "2025-01-15"
  times: string[]; // ["09:00", "14:00", "17:00"]
}

// En Therapy schema:
availableTimes?: TimeSlot[];
```

#### Lógica:
1. **Terapias con hora única:**
   ```
   Mostrar: "Horario: 14:00 - 16:00" (informativo)
   No es selector, solo información
   ```

2. **Terapias con múltiples horas:**
   ```html
   <select>
     <option>09:00 - 11:00</option>
     <option>14:00 - 16:00</option>
     <option>17:00 - 19:00</option>
   </select>
   ```

3. **Eventos con hora fija:**
   ```
   Mostrar: "Inicio: 20:00" (informativo)
   No es selector
   ```

---

### Paso 3: Actualizar ceremony-form.tsx

Agregar campos condicionales:

```typescript
{/* Selector de fechas - Para ceremonias, terapias, eventos */}
{(category === 'ceremonias' || category === 'terapias' || category === 'eventos') && (
  <DateSelector
    selectedDates={selectedDates}
    onDatesChange={setSelectedDates}
    category={category}
  />
)}

{/* Selector de horas - Solo para terapias */}
{category === 'terapias' && (
  <TimeSelector
    selectedDates={selectedDates}
    selectedTimes={selectedTimes}
    onTimesChange={setSelectedTimes}
    mode={timesPerDate.length === 1 ? 'informative' : 'selector'}
  />
)}

{/* Hora fija - Solo para eventos */}
{category === 'eventos' && (
  <Input
    label="Event Start Time"
    type="time"
    value={eventTime}
    onChange={setEventTime}
  />
)}
```

---

### Paso 4: Actualizar Schema Backend

```typescript
// En shared/schema.ts
export const therapySchema = z.object({
  // ... campos existentes
  availableDates: z.array(z.string()).optional(),
  
  // Nuevo campo para horas
  availableTimes: z.array(z.object({
    date: z.string(), // ISO date
    times: z.array(z.string()) // ["09:00", "14:00"]
  })).optional(),
  
  // Para eventos con hora fija
  fixedTime: z.string().optional(), // "20:00"
});
```

---

## 🎨 Componentes a Crear

### 1. DateSelector Component
```typescript
interface DateSelectorProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  category: string;
  className?: string;
}

// Features:
// - Dark mode completo
// - Bordes redondeados
// - Colores por categoría
// - Múltiple selección visual
// - Responsive
```

### 2. TimeSelector Component
```typescript
interface TimeSelectorProps {
  selectedDates: Date[];
  selectedTimes: TimeSlot[];
  onTimesChange: (times: TimeSlot[]) => void;
  mode: 'informative' | 'selector';
}

// Features:
// - Agregar horas por fecha
// - Modo informativo vs selector
// - Validación de horas
// - Dark mode
```

---

## 📊 Estructura del Formulario Mejorado

```
┌─────────────────────────────────────────┐
│  New Listing / Edit Listing             │
│  ← Back to Dashboard                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📝 Basic Information                    │
│                                         │
│  Category *          [Dropdown ▼]       │
│  Title *             [Input___________] │
│                                         │
│  {Dynamic fields based on category}     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📅 Availability  (if applicable)        │
│                                         │
│  Select Dates:                          │
│  [Calendar with multiple selection]     │
│                                         │
│  ⏰ Time Slots:  (if therapy)           │
│  [Time management interface]            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ⚙️ Publishing Options                   │
│                                         │
│  [Switch] Publish listing               │
└─────────────────────────────────────────┘

[Save Listing]  [Cancel]
```

---

## 🔧 Mejoras Técnicas

### Performance:
- Lazy loading de componentes grandes
- Memoización de cálculos pesados
- Debounce en auto-traducción

### UX:
- Loading states claros
- Validación en tiempo real
- Mensajes de error descriptivos
- Confirmación antes de descartar cambios

### Accesibilidad:
- Labels correctos en todos los inputs
- Keyboard navigation
- ARIA labels
- Focus management

---

## 🧪 Testing

### Casos de prueba:
1. Crear ceremonia con múltiples fechas
2. Crear terapia con horarios múltiples
3. Crear terapia con horario único (informativo)
4. Crear evento con hora fija
5. Crear producto (sin fechas/horas)
6. Editar publicación existente
7. Cambiar categoría (limpiar campos)
8. Dark mode en todos los estados

---

## 📱 Responsive Design

- Mobile: Stack vertical de todos los campos
- Tablet: Grid 2 columnas para algunos campos
- Desktop: Layout optimizado con sidebar

---

## 🎯 Objetivos Finales

1. ✅ Dashboard visualmente consistente
2. ⏳ Formulario moderno y intuitivo
3. ⏳ Sistema de fechas/horas robusto
4. ⏳ Validación completa
5. ⏳ Experiencia fluida en mobile
6. ⏳ Dark mode perfecto
7. ⏳ Documentación completa

---

**Estado General:** 20% Completado  
**Próxima Sesión:** Implementar DateSelector y TimeSelector components
