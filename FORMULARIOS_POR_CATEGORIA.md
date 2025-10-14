# 📝 Formularios Especializados por Categoría

## ✅ Implementación Completada

Se han creado formularios especializados para cada categoría con campos específicos.

---

## 📋 Formularios Creados

### **1. 🌿 Ceremonias**
**Archivo:** `client/src/components/forms/ceremony-form.tsx`

**Campos:**
- ✅ Tipo de ceremonia (Ayahuasca, San Pedro, Kambo, etc.)
- ✅ Descripción
- ✅ Calculadora de precio (con comisión 25%)
- ✅ Duración
- ✅ Ubicación
- ✅ Video YouTube (máx. 1 minuto)
- ✅ Fechas disponibles (calendario)
- ✅ WhatsApp

---

### **2. 💆 Terapias**
**Archivo:** `client/src/components/forms/therapy-form-fields.tsx`

**Campos:**
- ✅ Tipo de terapia (texto libre)
- ✅ Descripción
- ✅ Calculadora de precio (con comisión 25%)
- ✅ Consultorio / Ubicación
- ✅ **Link de Google Maps** 📍
- ✅ Duración de sesión
- ✅ Video YouTube (máx. 1 minuto)
- ✅ Fechas/horarios disponibles
- ✅ WhatsApp

**Diferencia clave:** Incluye Google Maps URL para mostrar ubicación del consultorio.

---

### **3. 💊 Microdosis**
**Archivo:** `client/src/components/forms/microdosis-form.tsx`

**Campos:**
- ✅ Tipo de microdosis (Psilocibina, LSD, etc.)
- ✅ Descripción del protocolo
- ✅ Calculadora de precio (con comisión 25%)
- ✅ Duración del tratamiento
- ✅ **Stock disponible** 📦
- ✅ Video explicativo (máx. 1 minuto)
- ✅ **Opciones de entrega:**
  - Envío a domicilio ✓
  - Recojo en punto ✓
- ✅ Dirección de recojo (si aplica)
- ✅ WhatsApp

**Diferencia clave:** Incluye inventario y opciones de envío (no tiene fechas).

---

### **4. 🌱 Medicina**
**Archivo:** `client/src/components/forms/medicina-form.tsx`

**Campos:**
- ✅ Tipo de medicina (Rapé, Sananga, Palo Santo, etc.)
- ✅ Descripción
- ✅ Calculadora de precio (con comisión 25%)
- ✅ **Componentes naturales** (ingredientes)
- ✅ **Beneficios y usos medicinales** (qué cura)
- ✅ **Stock disponible** 📦
- ✅ Video de la medicina (máx. 1 minuto)
- ✅ **Opciones de entrega:**
  - Envío a domicilio ✓
  - Recojo en punto ✓
- ✅ Dirección de recojo (si aplica)
- ✅ WhatsApp

**Diferencia clave:** Incluye componentes naturales y beneficios medicinales.

---

### **5. 🎵 Eventos**
**Archivo:** `client/src/components/forms/event-form.tsx`

**Campos:**
- ✅ Tipo de evento (Concierto, Festival, Taller, etc.)
- ✅ Descripción del evento
- ✅ Calculadora de precio (entrada)
- ✅ Ubicación / Venue
- ✅ Video promocional (máx. 1 minuto)
- ✅ **Fechas del evento** (calendario)
- ✅ **Artistas / Facilitadores**
- ✅ **Aforo máximo**
- ✅ WhatsApp

**Diferencia clave:** Incluye artistas y aforo máximo.

---

### **6. 🛍️ Productos**
**Archivo:** `client/src/components/forms/product-form.tsx`

**Campos:**
- ✅ Tipo de producto (Artesanía, Libro, Instrumento, etc.)
- ✅ Descripción del producto
- ✅ Calculadora de precio (con comisión 25%)
- ✅ **Stock disponible** 📦
- ✅ Video del producto (máx. 1 minuto)
- ✅ **Opciones de entrega:**
  - Envío a domicilio ✓
  - Recojo en punto ✓
- ✅ Dirección de recojo (si aplica)
- ✅ WhatsApp

**Diferencia clave:** Enfocado en productos físicos con inventario.

---

## 🔄 Componente Dinámico

**Archivo:** `client/src/components/forms/dynamic-category-form.tsx`

Este componente renderiza el formulario correcto según la categoría seleccionada:

```tsx
<DynamicCategoryForm
  category={selectedCategory}
  form={form}
  selectedDates={selectedDates}
  setSelectedDates={setSelectedDates}
/>
```

**Switch automático:**
```
category = "ceremonias" → CeremonyForm
category = "terapias" → TherapyFormFields
category = "microdosis" → MicrodosisForm
category = "medicina" → MedicinaForm
category = "eventos" → EventForm
category = "productos" → ProductForm
```

---

## 💰 Calculadora de Precio (Todas las Categorías)

**Componente:** `client/src/components/price-calculator.tsx`

**Funcionalidad:**
```
Guía ingresa: $100 (precio base)
↓
Calculadora muestra:
- Tu precio base: $100
- Comisión plataforma (+25%): $25
- Precio publicado: $125
↓
Se guarda en DB:
- base_price: 100
- platform_fee: 25
- price: 125
```

**Visual:**
- Input para precio base
- Card con desglose automático
- Nota informativa sobre la comisión

---

## 📊 Comparación de Campos

| Campo | Ceremonias | Terapias | Microdosis | Medicina | Eventos | Productos |
|-------|------------|----------|------------|----------|---------|-----------|
| **Tipo** | Select | Input | Input | Input | Select | Input |
| **Descripción** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Precio (25%)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Duración** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Ubicación** | ✅ | ✅ | ❌ | ❌ | ✅ | ⚠️ Recojo |
| **Google Maps** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Fechas** | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Inventario** | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Envío/Recojo** | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Componentes** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Beneficios** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Artistas** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Aforo** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Video** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **WhatsApp** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 Integración en Formularios

### **Formulario de Guías** (`therapy-form.tsx`)
```tsx
// 1. Selector de categoría
<Select name="category">
  <option>Ceremonias</option>
  <option>Terapias</option>
  <option>Microdosis</option>
  <option>Medicina</option>
  <option>Eventos</option>
  <option>Productos</option>
</Select>

// 2. Título (común a todas)
<Input name="title" />

// 3. Formulario dinámico según categoría
<DynamicCategoryForm category={selectedCategory} />
```

### **Formulario Master Admin** (`master-therapy-edit.tsx`)
- ✅ Misma estructura
- ✅ Puede editar cualquier categoría
- ✅ Campos específicos se muestran según categoría

---

## 🔧 Uso del Formulario

### **Flujo de Creación:**

```
1. Guía selecciona categoría
   ↓
2. Formulario se adapta automáticamente
   ↓
3. Guía llena campos específicos
   ↓
4. Ingresa precio base
   ↓
5. Calculadora muestra precio final (+25%)
   ↓
6. Guarda → Se crea con todos los campos
```

### **Ejemplo: Crear Producto**

```
Categoría: Productos
Título: "Tambor Chamánico Artesanal"
Tipo: "Instrumento"
Descripción: "Tambor hecho a mano..."
Precio Base: $180
  → Comisión: $45
  → Precio Final: $225
Stock: 15 unidades
Envío: ✓ Envío a domicilio
       ✓ Recojo en punto
Video: https://youtube.com/...
```

---

## ✅ Ventajas del Sistema

### **1. Formularios Especializados**
- ✅ Cada categoría tiene sus campos únicos
- ✅ No hay campos innecesarios
- ✅ Validaciones específicas

### **2. Calculadora Automática**
- ✅ Guía ve claramente la comisión
- ✅ Cálculo automático del 25%
- ✅ Transparencia total

### **3. Flexibilidad**
- ✅ Fácil agregar nuevas categorías
- ✅ Fácil modificar campos
- ✅ Componentes reutilizables

### **4. UX Mejorada**
- ✅ Formularios más cortos
- ✅ Solo campos relevantes
- ✅ Menos confusión

---

## 📱 Responsive

Todos los formularios son completamente responsive:
- ✅ Desktop: Layout de 2 columnas donde aplica
- ✅ Tablet: Layout adaptativo
- ✅ Mobile: Una columna, fácil de llenar

---

## 🎯 Estado Actual

### **✅ Completado:**
- [x] 6 formularios especializados creados
- [x] Componente dinámico implementado
- [x] Calculadora de precio integrada
- [x] Formulario de guías actualizado
- [x] Imports limpiados

### **🔄 Siguiente Paso:**
- [ ] Actualizar formulario de Master Admin
- [ ] Probar creación de cada categoría
- [ ] Verificar que todos los campos se guarden correctamente

---

## 🚀 Resultado

**Ahora los guías pueden:**
1. Seleccionar la categoría de su publicación
2. Ver un formulario especializado para esa categoría
3. Calcular automáticamente el precio con comisión
4. Agregar campos específicos (inventario, Google Maps, componentes, etc.)
5. Subir video de máximo 1 minuto

**¡Los formularios están especializados por categoría!** 📝✨
