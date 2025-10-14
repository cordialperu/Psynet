# 🚀 Plan de Implementación - Sistema de Categorías

## ✅ Cambios Confirmados

### **Respuestas a Consideraciones:**
1. **Comisión 25%**: Se aplica a TODAS las categorías ✅
2. **Visibilidad de precios**: 
   - Guía ve: Precio base + Comisión + Precio final ✅
   - Usuario ve: Solo precio final ✅
3. **Campos específicos**:
   - Medicina: Sin aprobación especial ✅
   - Productos: Con sistema de inventario ✅
   - Microdosis: Sin receta requerida ✅
4. **Envíos**: Medicina, productos y microdosis solo tienen envíos ✅

---

## 📊 Nuevas Categorías

| Categoría | Tiene Fechas | Tiene Ubicación | Tiene Inventario | Tipo de Entrega |
|-----------|--------------|-----------------|------------------|-----------------|
| **Ceremonias** | ✅ Sí | ✅ Sí (lugar) | ❌ No | Presencial |
| **Terapias** | ✅ Sí | ✅ Sí (consultorio + Maps) | ❌ No | Presencial |
| **Microdosis** | ❌ No | ❌ No | ✅ Sí | Envío/Recojo |
| **Medicina** | ❌ No | ❌ No | ✅ Sí | Envío/Recojo |
| **Eventos** | ✅ Sí | ✅ Sí (venue) | ❌ No | Presencial |
| **Productos** | ❌ No | ⚠️ Opcional (recojo) | ✅ Sí | Envío/Recojo |

---

## 💰 Sistema de Precios con Comisión 25%

### **Cálculo Automático:**
```
Precio Base (ingresado por el guía): $100
Comisión Plataforma (25%):            + $25
────────────────────────────────────────────
Precio Final (publicado):             $125
```

### **Flujo en el Formulario:**
```
1. Guía ingresa: $100
   ↓
2. Calculadora muestra:
   - Tu precio base: $100
   - Comisión plataforma (+25%): $25
   - Precio publicado: $125
   ↓
3. Se guarda en DB:
   - base_price: 100
   - platform_fee: 25
   - price: 125
   ↓
4. Usuario final ve: $125
```

---

## 🗄️ Cambios en Base de Datos

### **Nuevas Columnas en `therapies`:**

```sql
-- Categoría principal
category VARCHAR(50) DEFAULT 'ceremonias'

-- Sistema de precios
base_price NUMERIC(10, 2)      -- Precio base del guía
platform_fee NUMERIC(10, 2)    -- 25% comisión
price NUMERIC(10, 2)           -- Precio final (ya existe, se actualiza)

-- Campos nuevos
google_maps_url TEXT           -- Para terapias
shipping_options JSONB         -- Para productos/medicina/microdosis
inventory INTEGER              -- Stock disponible
specific_fields JSONB          -- Campos flexibles por categoría
```

### **Migración de Datos Existentes:**
```sql
-- Todas las terapias actuales se marcan como 'ceremonias'
UPDATE therapies SET category = 'ceremonias';

-- Calcular precios con comisión retroactiva
UPDATE therapies SET 
  base_price = price,
  platform_fee = price * 0.25,
  price = price * 1.25;
```

---

## 📝 Campos por Categoría

### **1. CEREMONIAS** 🌿
```typescript
{
  category: "ceremonias",
  type: "ayahuasca" | "san-pedro" | "kambo" | ...,
  title: string,
  description: string,
  basePrice: number,
  duration: string,
  location: string,
  availableDates: Date[],
  videoUrl: string,
  whatsappNumber: string,
}
```

### **2. TERAPIAS** 💆
```typescript
{
  category: "terapias",
  type: string, // "Terapia Holística", "Reiki", etc.
  title: string,
  description: string,
  basePrice: number,
  location: string, // Consultorio
  googleMapsUrl: string, // 📍 Pin en Google Maps
  duration: string, // "1 hora", "90 minutos"
  availableDates: Date[],
  whatsappNumber: string,
}
```

### **3. MICRODOSIS** 💊
```typescript
{
  category: "microdosis",
  type: string, // "Psilocibina", "LSD"
  title: string,
  description: string,
  basePrice: number,
  duration: string, // "30 días", "3 meses"
  inventory: number, // Stock
  shippingOptions: {
    envio: boolean,
    recojo: boolean,
    address?: string, // Punto de recojo
  },
  specificFields: {
    dosis: string,
    frecuencia: string,
    instrucciones: string,
  }
}
```

### **4. MEDICINA** 🌱
```typescript
{
  category: "medicina",
  type: string, // "Rapé", "Sananga", "Kambo"
  title: string,
  description: string,
  basePrice: number,
  inventory: number,
  shippingOptions: {
    envio: boolean,
    recojo: boolean,
    address?: string,
  },
  specificFields: {
    componentes: string[], // Ingredientes naturales
    beneficios: string[], // Qué cura
    usoMedicinal: string,
  }
}
```

### **5. EVENTOS** 🎵
```typescript
{
  category: "eventos",
  type: "concierto" | "cafe-concierto" | "musica-aire-libre" | "festival",
  title: string,
  description: string,
  basePrice: number,
  location: string, // Venue
  availableDates: Date[], // Fechas del evento
  videoUrl: string, // Promo video
  specificFields: {
    artistas: string[],
    genero: string,
    aforoMaximo: number,
  }
}
```

### **6. PRODUCTOS** 🛍️
```typescript
{
  category: "productos",
  type: string, // "Artesanía", "Libro", "Instrumento"
  title: string,
  description: string,
  basePrice: number,
  inventory: number,
  shippingOptions: {
    envio: boolean,
    recojo: boolean,
    address?: string,
  },
  specificFields: {
    dimensiones: string,
    peso: string,
    materiales: string[],
  }
}
```

---

## 🎨 Filtros del Landing Page

### **Antes:**
```
[Todas] [Ayahuasca] [San Pedro] [Kambo] ...
```

### **Después:**
```
[Todas] [Ceremonias] [Terapias] [Microdosis] [Medicina] [Eventos] [Productos]
```

---

## 📋 Pasos de Implementación

### **✅ PASO 1: Base de Datos (COMPLETADO)**
- [x] Actualizar schema.ts con nuevos campos
- [x] Crear migración SQL
- [x] Crear script de migración TypeScript

### **✅ PASO 2: Componentes (COMPLETADO)**
- [x] Crear PriceCalculator component
- [x] Crear CategoryFormFields component
- [x] Actualizar filtros en landing page

### **🔄 PASO 3: Ejecutar Migración (SIGUIENTE)**
```bash
npm run tsx scripts/migrate-categories.ts
```

### **🔄 PASO 4: Actualizar Formularios**
- [ ] Integrar PriceCalculator en formulario de guías
- [ ] Integrar CategoryFormFields en formulario de guías
- [ ] Actualizar formulario de master admin

### **🔄 PASO 5: Actualizar Páginas de Detalle**
- [ ] Crear componentes específicos por categoría
- [ ] Actualizar therapy-detail-new.tsx para mostrar campos según categoría

### **🔄 PASO 6: Testing**
- [ ] Probar creación de cada categoría
- [ ] Verificar cálculos de comisión
- [ ] Probar filtros en landing
- [ ] Verificar inventario para productos

---

## 🔧 Archivos Creados

1. **`migrations/ADD_CATEGORIES_AND_PRICING.sql`**
   - Migración SQL para agregar columnas

2. **`scripts/migrate-categories.ts`**
   - Script para ejecutar migración y verificar

3. **`client/src/components/price-calculator.tsx`**
   - Calculadora visual de comisión 25%

4. **`client/src/components/category-form-fields.tsx`**
   - Campos dinámicos según categoría

5. **`shared/schema.ts`** (actualizado)
   - Nuevas categorías y tipos

6. **`client/src/pages/home-apple-v3.tsx`** (actualizado)
   - Filtros por categoría

---

## 🎯 Próximo Paso Inmediato

**Ejecutar la migración:**

```bash
cd /Users/m2dt/Downloads/psyco
npm run tsx scripts/migrate-categories.ts
```

Esto:
1. ✅ Agregará las nuevas columnas
2. ✅ Migrará los datos existentes
3. ✅ Calculará los precios con comisión
4. ✅ Mostrará estadísticas

**¿Quieres que ejecute la migración ahora?**
