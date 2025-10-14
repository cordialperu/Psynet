# 🔄 Migración de Base de Datos

## 📅 Fecha: 2025-10-12 19:15

---

## ⚠️ IMPORTANTE: Migración Requerida

Los nuevos campos `availableTimes` y `fixedTime` han sido agregados al schema, pero la base de datos necesita ser actualizada.

---

## 🛠️ Pasos para Migrar

### Opción 1: Usando Drizzle Kit (Recomendado)

```bash
# 1. Generar migración
npm run db:generate

# 2. Aplicar migración
npm run db:push

# 3. Reiniciar servidor
npm run dev
```

### Opción 2: SQL Manual

Si no tienes Drizzle Kit configurado, ejecuta este SQL directamente en tu base de datos:

```sql
-- Agregar columna availableTimes (JSON)
ALTER TABLE therapies 
ADD COLUMN IF NOT EXISTS available_times JSON;

-- Agregar columna fixedTime (VARCHAR)
ALTER TABLE therapies 
ADD COLUMN IF NOT EXISTS fixed_time VARCHAR(10);

-- Verificar que se agregaron correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'therapies' 
AND column_name IN ('available_times', 'fixed_time');
```

---

## 🐛 Solución del Error 500

### Causa:
El servidor está intentando leer campos que no existen en la base de datos.

### Solución:
1. ✅ Ya corregimos los links anidados (warnings de React)
2. ⏳ Necesitas ejecutar la migración de arriba
3. ⏳ Reiniciar el servidor

---

## 📊 Estructura de Datos

### availableTimes (JSON)
```json
[
  {
    "date": "2025-01-15",
    "times": ["09:00", "14:00", "17:00"]
  },
  {
    "date": "2025-01-16",
    "times": ["10:00"]
  }
]
```

### fixedTime (VARCHAR)
```
"20:00"
```

---

## ✅ Verificación

Después de aplicar la migración, verifica que todo funciona:

```bash
# 1. Reinicia el servidor
npm run dev

# 2. Abre el navegador
http://localhost:5001/guia/dashboard

# 3. Intenta crear una nueva publicación
# - Debería ver los nuevos DateSelector y TimeSelector
# - No debería ver errores 500
```

---

## 📝 Notas

- Los campos son opcionales (nullable)
- Solo `terapias` usará `availableTimes`
- Solo `eventos` usará `fixedTime`
- `ceremonias` solo usará `availableDates` (ya existente)
- `productos`, `microdosis`, `medicina` no usan fechas/horas

---

## 🔧 Si sigues teniendo errores

### Error: "Column does not exist"
```bash
# Verifica que la migración se aplicó:
psql -d tu_base_de_datos -c "\d therapies"

# O en tu interfaz SQL favorita, ejecuta:
SELECT * FROM information_schema.columns WHERE table_name = 'therapies';
```

### Error: "Cannot read property of undefined"
```bash
# Reinicia el servidor completamente:
# 1. Ctrl+C para detener
# 2. npm run dev para reiniciar
```

---

**Estado:** ⏳ MIGRACIÓN PENDIENTE  
**Próximo paso:** Ejecutar migración y reiniciar servidor
