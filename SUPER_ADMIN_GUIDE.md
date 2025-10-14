# 🔐 Guía del Panel Super Admin

## Resumen

Se ha implementado un panel de **Super Administrador** con código de acceso **333** que permite editar cualquier ceremonia/terapia de la plataforma.

---

## 🚀 Acceso al Panel

### URL de Login
```
http://localhost:5001/admin/master/login
```

### Código de Acceso
```
333
```

---

## ✨ Funcionalidades Implementadas

### 1. **Login Master**
- Página de login especial con diseño distintivo
- Autenticación con código numérico simple (333)
- Sesión separada con permisos elevados
- Redirección automática al dashboard

### 2. **Dashboard Master**
- **Vista completa** de todas las ceremonias (sin filtro por guía)
- **Estadísticas** en tiempo real:
  - Total de ceremonias
  - Ceremonias publicadas
  - Borradores
- **Filtros avanzados**:
  - Búsqueda por texto (título, guía, descripción)
  - Filtro por tipo de ceremonia
- **Tabla completa** con información:
  - Título
  - Guía (nombre + foto)
  - Tipo de ceremonia
  - Ubicación
  - Precio
  - Estado (publicado/borrador)
  - Botón de edición

### 3. **Formulario de Edición Master**
- **Información del guía** (solo lectura)
- **Todos los campos editables**:
  - ✏️ Título
  - ✏️ Descripción
  - ✏️ Tipo de ceremonia
  - ✏️ Precio y moneda
  - ✏️ Duración
  - ✏️ Ubicación
  - ✏️ URL del video (YouTube)
  - ✏️ Número de WhatsApp
  - ✏️ Fechas disponibles (calendario)
  - ✏️ Estado publicado/borrador
- **Guardado directo** sin validación de permisos de guía

---

## 🏗️ Arquitectura Técnica

### Backend

#### **Archivos Modificados:**

1. **`server/auth.ts`**
   - Agregado `createMasterSession()`: Crea sesión con flag `isMaster: true`
   - Agregado `requireMasterAuth()`: Middleware de autenticación master

2. **`server/storage.ts`**
   - Agregado `getAllTherapies()`: Obtiene todas las terapias sin filtro de guía
   - Soporta filtros opcionales: tipo, ubicación, búsqueda, guideId

3. **`server/routes.ts`**
   - `POST /api/auth/master-login`: Login con código 333
   - `GET /api/master/therapies`: Obtener todas las terapias
   - `GET /api/master/therapies/:id`: Obtener una terapia específica
   - `PATCH /api/master/therapies/:id`: Actualizar cualquier terapia

### Frontend

#### **Archivos Creados:**

1. **`client/src/pages/admin/master-login.tsx`**
   - Página de login con diseño especial (gradiente amarillo-naranja)
   - Input de código con máscara de password
   - Validación contra código 333

2. **`client/src/pages/admin/master-dashboard.tsx`**
   - Dashboard completo con estadísticas
   - Tabla de todas las ceremonias
   - Filtros de búsqueda y tipo
   - Diseño limpio y profesional

3. **`client/src/pages/admin/master-therapy-edit.tsx`**
   - Formulario completo de edición
   - Card informativa del guía
   - Todos los campos editables
   - Calendario para fechas disponibles

#### **Archivos Modificados:**

4. **`client/src/App.tsx`**
   - Agregadas 3 rutas nuevas:
     - `/admin/master/login`
     - `/admin/master/dashboard`
     - `/admin/master/therapies/edit/:id`

---

## 🔒 Seguridad

- **Código hardcodeado**: El código 333 está en el backend, no se puede cambiar desde el frontend
- **Sesión separada**: Las sesiones master tienen un flag especial `isMaster: true`
- **Middleware protegido**: Todas las rutas master requieren `requireMasterAuth()`
- **Sin acceso a DB de usuarios**: No necesita usuario en la base de datos

---

## 📋 Flujo de Uso

1. **Acceder al login master**: `http://localhost:5001/admin/master/login`
2. **Ingresar código**: `333`
3. **Ver dashboard**: Lista completa de todas las ceremonias
4. **Buscar/Filtrar**: Encontrar la ceremonia a editar
5. **Editar**: Click en el botón de edición
6. **Modificar campos**: Cambiar cualquier información
7. **Guardar**: Los cambios se aplican inmediatamente
8. **Volver**: Regresar al dashboard para editar otra ceremonia

---

## 🎨 Diseño Visual

### Login Master
- Fondo oscuro con gradiente
- Icono de escudo (Shield)
- Input centrado con texto grande
- Botón con gradiente amarillo-naranja

### Dashboard Master
- Header con icono de escudo y badge "Super Admin"
- Cards de estadísticas en la parte superior
- Barra de búsqueda y filtros
- Tabla responsive con toda la información
- Badges de estado (publicado/borrador)

### Formulario de Edición
- Header con badge "Super Admin"
- Card azul con información del guía
- Formulario organizado en secciones (cards)
- Calendario para fechas
- Switch para publicar/despublicar
- Botón de guardado con gradiente distintivo

---

## 🧪 Testing

### Probar el Login
```bash
# Acceder a:
http://localhost:5001/admin/master/login

# Ingresar código: 333
# Debería redirigir a: /admin/master/dashboard
```

### Probar el Dashboard
```bash
# Verificar que se muestren todas las ceremonias
# Probar búsqueda por texto
# Probar filtro por tipo
# Click en editar una ceremonia
```

### Probar la Edición
```bash
# Modificar cualquier campo
# Guardar cambios
# Verificar que se actualizó en el dashboard
# Verificar que se ve reflejado en la página pública
```

---

## 🔧 Mantenimiento

### Cambiar el Código de Acceso
Editar en `server/routes.ts` línea 266:
```typescript
if (code === "333") {  // Cambiar "333" por el nuevo código
```

### Agregar Más Funcionalidades Master
1. Agregar nuevas rutas en `server/routes.ts` con `requireMasterAuth`
2. Crear nuevos componentes en `client/src/pages/admin/`
3. Agregar rutas en `client/src/App.tsx`

---

## 📝 Notas Importantes

- ⚠️ Los errores de TypeScript en `storage.ts` son pre-existentes del código original
- ✅ El panel master NO afecta el flujo normal de los guías
- ✅ Los guías siguen teniendo su propio dashboard independiente
- ✅ El código 333 solo funciona en la ruta `/admin/master/login`
- ✅ Las sesiones master y de guías son completamente separadas

---

## 🎯 Casos de Uso

### Corrección de Errores Tipográficos
1. Buscar la ceremonia con el error
2. Editar el campo con el error
3. Guardar cambios

### Moderación de Contenido
1. Revisar ceremonias publicadas
2. Despublicar si es necesario (switch)
3. Editar contenido inapropiado
4. Volver a publicar

### Actualización de Precios
1. Filtrar por tipo de ceremonia
2. Editar precio de cada una
3. Guardar cambios

### Gestión de Videos
1. Buscar ceremonias sin video
2. Agregar URL de YouTube
3. Verificar que se muestre correctamente

---

## ✅ Checklist de Implementación

- [x] Backend: Autenticación master
- [x] Backend: Middleware de seguridad
- [x] Backend: Rutas API master
- [x] Backend: Función getAllTherapies
- [x] Frontend: Página de login master
- [x] Frontend: Dashboard master
- [x] Frontend: Formulario de edición master
- [x] Frontend: Rutas en App.tsx
- [x] Documentación completa

---

**¡El panel Super Admin está listo para usar!** 🎉
