# 📝 Cambios en Categorías y Botones

## 📅 Fecha: 2025-10-12 18:40

---

## 🎯 Resumen de Cambios por Categoría

### 1. **Productos** 🛒
- **Botón:** "Buy Product"
- **Selector de fecha:** ❌ No disponible
- **Botón activo:** ✅ Siempre (no requiere fecha)
- **Mensaje WhatsApp:** "PURCHASE REQUEST - Product"

---

### 2. **Microdosis** 💊
- **Botón:** "Buy Microdosis"
- **Selector de fecha:** ❌ No disponible
- **Botón activo:** ✅ Siempre (no requiere fecha)
- **Mensaje WhatsApp:** "PURCHASE REQUEST - Microdosis"

---

### 3. **Medicina** 🌿
- **Botón:** "Buy Medicine"
- **Selector de fecha:** ❌ No disponible
- **Botón activo:** ✅ Siempre (no requiere fecha)
- **Mensaje WhatsApp:** "PURCHASE REQUEST - Medicine"

---

### 4. **Eventos** 🎫
- **Botón:** "Register for Event"
- **Selector de fecha:** ✅ Disponible
  - Label: "Select event date"
  - Placeholder: "Choose event date"
- **Botón activo:** Solo si se selecciona fecha
- **Mensaje WhatsApp:** "EVENT REGISTRATION" con fecha seleccionada

---

### 5. **Ceremonias** 🔮
- **Botón:** "Book Ceremony"
- **Selector de fecha:** ✅ Disponible
  - Label: "Select a date"
  - Placeholder: "Choose a date"
- **Botón activo:** Solo si se selecciona fecha
- **Mensaje WhatsApp:** "CEREMONY BOOKING" con fecha seleccionada

---

### 6. **Terapias** 🧘
- **Botón:** "Book Therapy"
- **Selector de fecha:** ✅ Disponible
  - Label: "Select a date"
  - Placeholder: "Choose a date"
- **Hora (opcional):** Puede incluirse en el sistema de disponibilidad
- **Botón activo:** Solo si se selecciona fecha
- **Mensaje WhatsApp:** "THERAPY BOOKING" con fecha seleccionada

---

## 🔧 Lógica Implementada

### Selector de Fecha
```typescript
// Solo aparece para ceremonias, terapias y eventos
{(therapy.category === 'ceremonias' || 
  therapy.category === 'terapias' || 
  therapy.category === 'eventos') && 
  therapy.availableDates && 
  therapy.availableDates.length > 0 && (
  <select>
    {/* Desplegable con fechas disponibles */}
  </select>
)}
```

### Botón Deshabilitado
```typescript
// El botón se deshabilita si:
disabled={
  (therapy.category === 'ceremonias' || 
   therapy.category === 'terapias' || 
   therapy.category === 'eventos') && 
  !selectedDate
}
```

### Textos Dinámicos
```typescript
const getButtonText = () => {
  switch(category) {
    case 'productos': return 'Buy Product';
    case 'microdosis': return 'Buy Microdosis';
    case 'medicina': return 'Buy Medicine';
    case 'eventos': return 'Register for Event';
    case 'ceremonias': return 'Book Ceremony';
    case 'terapias': return 'Book Therapy';
    default: return 'Book via WhatsApp';
  }
}
```

---

## 📊 Tabla Comparativa

| Categoría | Botón | Requiere Fecha | Selector Activo | Mensaje WhatsApp |
|-----------|-------|----------------|-----------------|------------------|
| Productos | Buy Product | ❌ No | ❌ | PURCHASE REQUEST |
| Microdosis | Buy Microdosis | ❌ No | ❌ | PURCHASE REQUEST |
| Medicina | Buy Medicine | ❌ No | ❌ | PURCHASE REQUEST |
| Eventos | Register for Event | ✅ Sí | ✅ | EVENT REGISTRATION |
| Ceremonias | Book Ceremony | ✅ Sí | ✅ | CEREMONY BOOKING |
| Terapias | Book Therapy | ✅ Sí | ✅ | THERAPY BOOKING |

---

## 🎨 Ejemplos de Mensajes WhatsApp

### Productos / Microdosis / Medicina:
```
*PURCHASE REQUEST*

Product: [Título]
Price: $[Precio] [Moneda]
Seller: [Guía]
Location: [Ubicación]

I am interested in purchasing this product.
```

### Eventos:
```
*EVENT REGISTRATION*

Event: [Título]
Selected Date: [Fecha seleccionada]
Price: $[Precio] [Moneda]
Organizer: [Guía]
Location: [Ubicación]

I would like to register for this event.
```

### Ceremonias / Terapias:
```
*CEREMONY BOOKING* (o THERAPY BOOKING)

Service: [Título]
Requested Date: [Fecha seleccionada]
Price: $[Precio] [Moneda]
Guide: [Guía]
Location: [Ubicación]
Duration: [Duración]

I would like to make a reservation for the indicated date.
```

---

## ⏰ Nota sobre Horarios en Terapias

Actualmente el selector de hora para terapias no está implementado, pero la estructura está preparada para agregarlo:

### Implementación sugerida:
```typescript
// En el estado:
const [selectedTime, setSelectedTime] = useState<string>("");

// Después del selector de fecha para terapias:
{therapy.category === 'terapias' && therapy.availableTimes && (
  <div className="mb-4">
    <label>Select time</label>
    <select 
      value={selectedTime} 
      onChange={(e) => setSelectedTime(e.target.value)}
    >
      <option value="">Choose a time</option>
      {therapy.availableTimes.map((time, idx) => (
        <option key={idx} value={time}>{time}</option>
      ))}
    </select>
  </div>
)}

// Modificar el mensaje para incluir hora:
mensaje += `Time: ${selectedTime}\n`;
```

---

## 🧪 Cómo Probar

### Test 1: Productos, Microdosis, Medicina
1. Abrir cualquier publicación de estas categorías
2. **Verificar:** No aparece selector de fecha
3. **Verificar:** Botón "Buy" está activo inmediatamente
4. Click en botón
5. **Verificar:** Abre WhatsApp con mensaje de compra

### Test 2: Eventos
1. Abrir un evento
2. **Verificar:** Selector muestra "Select event date"
3. **Verificar:** Botón "Register for Event" está deshabilitado
4. Seleccionar fecha
5. **Verificar:** Botón se activa
6. Click en botón
7. **Verificar:** Mensaje incluye fecha del evento

### Test 3: Ceremonias y Terapias
1. Abrir ceremonia o terapia
2. **Verificar:** Selector muestra "Select a date"
3. **Verificar:** Botón está deshabilitado
4. Seleccionar fecha
5. **Verificar:** Botón se activa
6. Click en botón
7. **Verificar:** Mensaje incluye fecha seleccionada

---

## ✅ Estado de Implementación

- ✅ Botones con texto dinámico por categoría
- ✅ Lógica de fecha según categoría
- ✅ Mensajes WhatsApp personalizados
- ✅ Validación de fecha para eventos, ceremonias y terapias
- ✅ Productos, microdosis y medicina sin requerir fecha
- ⏸️ Selector de hora para terapias (pendiente)

---

**Estado:** ✅ COMPLETADO  
**Última actualización:** 2025-10-12 18:40:00
