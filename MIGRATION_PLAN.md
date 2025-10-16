# 📋 PLAN DE CORRECCIÓN SISTEMÁTICA - PSYNET
**Fecha:** 16 de octubre de 2025  
**Estado:** Identificación de problemas completada

---

## 🎯 PROBLEMA RAÍZ IDENTIFICADO

**Drizzle ORM es INCOMPATIBLE con @neondatabase/serverless**

Todas las consultas deben migrarse a PostgreSQL directo usando `pg` Pool.

---

## ✅ FUNCIONES YA MIGRADAS (5 commits locales)

1. ✅ `getPublishedTherapies()` - Lista de terapias públicas
2. ✅ `getAllTherapies()` - Lista completa para admin
3. ✅ `getGuideByEmail()` - Login de guías
4. ✅ `createGuide()` - Registro de guías
5. ✅ `getTherapyBySlug()` - Detalle de terapia
6. ✅ `updateTherapy()` - Actualización de terapias (Super Admin)
7. ✅ `getAdminSettings()` - Configuración pública

---

## ❌ FUNCIONES QUE AÚN USAN DRIZZLE (DEBEN CORREGIRSE)

### 🔴 CRÍTICAS (Bloquean funcionalidades clave)

#### 1. `getTherapy(id)` - Line 129
**Dónde se usa:**
- `/api/therapies/:id` - Ver detalle de terapia (con autenticación)
- Dashboard de guías

**Error actual:** Drizzle ORM
```typescript
async getTherapy(id: string): Promise<Therapy | undefined> {
  const [therapy] = await db.select().from(therapies).where(eq(therapies.id, id));
  return therapy;
}
```

**Solución:** Crear `queryTherapyById()` en db-direct.ts

---

#### 2. `getTherapiesByGuideId(guideId)` - Line 148
**Dónde se usa:**
- `/api/therapies/my-therapies` - Dashboard de guías
- Ver todas las publicaciones de un guía

**Error actual:** Drizzle ORM
```typescript
async getTherapiesByGuideId(guideId: string): Promise<Therapy[]> {
  return await db.select().from(therapies).where(eq(therapies.guideId, guideId));
}
```

**Solución:** Crear `queryTherapiesByGuideId()` en db-direct.ts

---

#### 3. `getGuide(id)` - Line 32
**Dónde se usa:**
- `/api/auth/me` - Obtener perfil del guía logueado
- `/api/guides/:id` - Ver perfil de guía

**Error actual:** Drizzle ORM
```typescript
async getGuide(id: string): Promise<Guide | undefined> {
  const [guide] = await db.select().from(guides).where(eq(guides.id, id));
  return guide;
}
```

**Solución:** Crear `queryGuideById()` en db-direct.ts

---

#### 4. `getAllGuides()` - Line 118
**Dónde se usa:**
- `/api/master/guides` - Super Admin gestión de guías

**Error actual:** Drizzle ORM
```typescript
async getAllGuides(): Promise<Guide[]> {
  return await db.select().from(guides).orderBy(sql`${guides.createdAt} DESC`);
}
```

**Solución:** Crear `queryAllGuides()` en db-direct.ts

---

#### 5. `updateGuide(id, data)` - Line 120
**Dónde se usa:**
- `/api/guides/me` - Actualizar perfil del guía
- Editar información personal

**Error actual:** Drizzle ORM
```typescript
async updateGuide(id: string, updateData: Partial<InsertGuide>): Promise<Guide> {
  const [guide] = await db.update(guides).set({ ...updateData }).where(eq(guides.id, id)).returning();
  return guide;
}
```

**Solución:** Crear `updateGuideDirectly()` en db-direct.ts

---

#### 6. `getFeaturedTherapies(limit)` - Line 157
**Dónde se usa:**
- Home page - Terapias destacadas (si se implementa)

**Error actual:** Drizzle ORM
```typescript
async getFeaturedTherapies(limit: number = 6): Promise<Therapy[]> {
  return await db.select().from(therapies)...
}
```

**Solución:** Crear `queryFeaturedTherapies()` en db-direct.ts

---

#### 7. `createTherapy(therapy)` - Line 165
**Dónde se usa:**
- `/api/therapies` POST - Crear nueva publicación
- Dashboard de guías - Publicar nueva terapia

**Error actual:** Drizzle ORM
```typescript
async createTherapy(insertTherapy: InsertTherapy): Promise<Therapy> {
  const [therapy] = await db.insert(therapies).values(insertTherapy).returning();
  return therapy;
}
```

**Solución:** Crear `createTherapyDirectly()` en db-direct.ts

---

#### 8. `deleteTherapy(id)` - Line 221
**Dónde se usa:**
- `/api/therapies/:id` DELETE - Eliminar publicación
- Dashboard de guías

**Error actual:** Drizzle ORM
```typescript
async deleteTherapy(id: string): Promise<void> {
  await db.delete(therapies).where(eq(therapies.id, id));
}
```

**Solución:** Crear `deleteTherapyDirectly()` en db-direct.ts

---

#### 9. `updateAdminSettings(data)` - Line 236
**Dónde se usa:**
- `/api/master/settings` PUT - Configuración del Super Admin
- Actualizar WhatsApp, PayPal, etc.

**Error actual:** Drizzle ORM (UPDATE/INSERT)
```typescript
async updateAdminSettings(data: {...}): Promise<AdminSettings> {
  // Usa db.update() o db.insert()
}
```

**Solución:** Crear `updateAdminSettingsDirectly()` y `createAdminSettingsDirectly()` en db-direct.ts

---

## 📊 RESUMEN DE ACCIONES

### Total de funciones a migrar: **9**

**Orden de prioridad (por impacto):**

1. 🔴 **ALTA PRIORIDAD** (Sin estas, la app no funciona):
   - `getTherapy()` - Detalle individual
   - `getTherapiesByGuideId()` - Dashboard guías
   - `getGuide()` - Perfil usuario
   - `createTherapy()` - Crear publicación

2. 🟡 **MEDIA PRIORIDAD** (Funcionalidades importantes):
   - `updateGuide()` - Editar perfil
   - `deleteTherapy()` - Eliminar publicación
   - `getAllGuides()` - Admin de guías

3. 🟢 **BAJA PRIORIDAD** (Mejoras futuras):
   - `getFeaturedTherapies()` - Si se usa
   - `updateAdminSettings()` - Admin config

---

## 🛠️ PATRÓN DE SOLUCIÓN

Para cada función, seguir estos pasos:

### 1. Crear función en `server/db-direct.ts`:
```typescript
export async function queryNombreFuncion(params) {
  const query = 'SELECT * FROM tabla WHERE condicion = $1';
  console.log('🔍 Buscando...', params);
  const result = await pool.query(query, [params]);
  if (result.rows.length > 0) {
    console.log('✅ Encontrado');
    return result.rows[0]; // o result.rows
  }
  return null; // o []
}
```

### 2. Importar en `server/storage.ts`:
```typescript
import { ..., queryNombreFuncion } from "./db-direct";
```

### 3. Reemplazar función en `server/storage.ts`:
```typescript
async nombreFuncion(params): Promise<Type> {
  try {
    const result = await queryNombreFuncion(params);
    return result as any;
  } catch (error) {
    console.error('Error:', error);
    return undefined; // o throw error
  }
}
```

### 4. Commit:
```bash
git add -A && git commit -m "Fix: NombreFuncion - use direct PostgreSQL query"
```

---

## 🎯 SIGUIENTE PASO

Empezar con las funciones de **ALTA PRIORIDAD** en orden:

1. ✅ `getTherapy(id)` 
2. ✅ `getTherapiesByGuideId(guideId)`
3. ✅ `getGuide(id)`
4. ✅ `createTherapy(therapy)`

Luego continuar con MEDIA y BAJA prioridad.

---

## 📝 NOTAS ADICIONALES

- **Videos de YouTube:** Verificar campo `video_url` en base de datos
- **Colores categorías:** Ya corregidos ✅
- **Estadísticas Super Admin:** Ya mejoradas ✅
- **Tests:** Probar cada función después de migrar

