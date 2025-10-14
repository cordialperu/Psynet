# 🎯 Guía del Flujo Integrado para Guías

## ✅ Nueva Estructura Implementada

### 🏠 **Página Principal con Login Integrado**

La página principal (`http://localhost:5001`) ahora incluye:
- ✅ **Navbar con botón "Portal de Guías"**
- ✅ **Dialog de Login/Registro** (sin salir de la página)
- ✅ **Menú de usuario** cuando está logueado
- ✅ **Acceso directo al dashboard** desde el navbar

---

## 🔄 Flujo Completo del Guía

### 1. **Registro** (Primera vez)

```
Usuario en página principal (/)
  ↓
Click en "Portal de Guías" (navbar)
  ↓
Se abre Dialog con tabs Login/Registro
  ↓
Click en tab "Registrarse"
  ↓
Llenar formulario:
  - Nombre Completo
  - Email
  - Contraseña
  - Confirmar Contraseña
  ↓
Click "Crear Cuenta"
  ↓
Cuenta creada → Tab cambia automáticamente a "Iniciar Sesión"
```

### 2. **Login**

```
Usuario en página principal (/)
  ↓
Click en "Portal de Guías" (navbar)
  ↓
Se abre Dialog
  ↓
Llenar formulario:
  - Email
  - Contraseña
  ↓
Click "Iniciar Sesión"
  ↓
Redirige a: /guia/dashboard
```

### 3. **Dashboard del Guía**

```
URL: http://localhost:5001/guia/dashboard

Muestra:
  ✅ Navbar con avatar del guía
  ✅ Estadísticas:
     - Total de ceremonias
     - Publicadas
     - En revisión
     - Borradores
  ✅ Tabla de ceremonias con:
     - Título
     - Tipo
     - Ubicación
     - Estado (badge con color)
     - Acciones (Ver/Editar)
  ✅ Botón "Nueva Ceremonia"
```

### 4. **Crear Ceremonia**

```
Desde dashboard → Click "Nueva Ceremonia"
  ↓
Redirige a: /guia/ceremonias/nueva
  ↓
Formulario completo:
  - Título
  - Tipo de ceremonia
  - Descripción
  - Precio y moneda
  - Duración
  - Ubicación
  - Video URL
  - WhatsApp
  - Fechas disponibles
  ↓
Click "Guardar"
  ↓
Estado automático: "pending" (En Revisión)
Publicado: false
  ↓
Vuelve a dashboard
  ↓
Ceremonia aparece con badge "⏳ En Revisión"
```

### 5. **Editar Ceremonia**

```
Desde dashboard → Click en icono "Editar"
  ↓
Redirige a: /guia/ceremonias/editar/:id
  ↓
Mismo formulario con datos pre-cargados
  ↓
Modificar campos necesarios
  ↓
Guardar cambios
  ↓
Vuelve a dashboard
```

---

## 🎨 Estados Visuales de las Ceremonias

En el dashboard del guía, cada ceremonia muestra un badge de estado:

| Estado | Badge | Significado |
|--------|-------|-------------|
| **pending** | ⏳ En Revisión (amarillo) | Esperando aprobación del admin |
| **approved + published** | ✅ Publicada (verde) | Aprobada y visible en la web |
| **approved + !published** | 📝 Borrador (gris) | Aprobada pero no publicada |
| **rejected** | ❌ Rechazada (rojo) | Rechazada por el admin |

---

## 🔐 Navbar Dinámico

### Cuando NO está logueado:
```
Logo | Ceremonias | Cómo Funciona | [Portal de Guías]
```

### Cuando SÍ está logueado:
```
Logo | Ceremonias | Cómo Funciona | [Avatar con menú]
                                      ↓
                                   Dropdown:
                                   - Mi Panel
                                   - Mi Perfil
                                   - Cerrar Sesión
```

---

## 📍 URLs del Sistema

### Públicas:
- `/` - Página principal con ceremonias
- `/therapy/:slug` - Detalle de ceremonia
- `/how-it-works` - Cómo funciona

### Guías (requiere login):
- `/guia/dashboard` - Panel principal del guía
- `/guia/perfil` - Editar perfil del guía
- `/guia/ceremonias/nueva` - Crear nueva ceremonia
- `/guia/ceremonias/editar/:id` - Editar ceremonia existente

### Admin (rutas antiguas, aún funcionan):
- `/admin/login` - Login antiguo
- `/admin/register` - Registro antiguo
- `/admin/dashboard` - Dashboard antiguo

### Super Admin:
- `/admin/master/login` - Login con código 333
- `/admin/master/dashboard` - Ver todas las ceremonias
- `/admin/master/therapies/edit/:id` - Editar cualquier ceremonia

---

## 🎯 Diferencias entre Rutas

### `/admin/*` vs `/guia/*`

**Rutas `/admin/*`** (Antiguas):
- Login en página separada
- Diseño más técnico
- Aún funcionan pero no se usan en el flujo principal

**Rutas `/guia/*`** (Nuevas):
- Login integrado en la página principal
- Diseño moderno y limpio
- Navbar siempre visible
- Mejor experiencia de usuario

---

## 🔧 Componentes Nuevos Creados

### 1. `AuthDialog.tsx`
- Dialog modal para login/registro
- Tabs para cambiar entre login y registro
- Validación con Zod
- Manejo de errores

### 2. `MainNavbar.tsx`
- Navbar sticky en la parte superior
- Botón "Portal de Guías" cuando no está logueado
- Avatar con dropdown cuando está logueado
- Links a ceremonias y cómo funciona

### 3. `GuiaDashboard.tsx`
- Dashboard principal del guía
- Estadísticas de ceremonias
- Tabla con todas las ceremonias
- Badges de estado
- Botones de acción

---

## 🚀 Flujo de Aprobación Integrado

```
1. GUÍA CREA CEREMONIA
   ↓
   Estado: pending
   Badge: ⏳ En Revisión
   Visible en: Dashboard del guía
   NO visible en: Página pública
   
2. ADMIN REVISA
   ↓
   Login: /admin/master/login (código 333)
   Dashboard: Ve TODAS las ceremonias
   Identifica: Ceremonias con estado "pending"
   
3. ADMIN APRUEBA
   ↓
   Edita ceremonia
   Cambia estado a: "approved"
   Activa: "Publicar Ceremonia"
   Guarda
   
4. CEREMONIA PUBLICADA
   ↓
   Estado: approved
   Badge en dashboard guía: ✅ Publicada
   Visible en: Página pública
   Guía puede: Ver en página pública (botón ojo)
```

---

## 💡 Ventajas del Nuevo Flujo

### Para el Guía:
✅ No necesita salir de la página principal para registrarse
✅ Login rápido con dialog modal
✅ Dashboard limpio y fácil de usar
✅ Ve el estado de sus ceremonias en tiempo real
✅ Puede ver cómo se ve su ceremonia en la página pública

### Para el Usuario Final:
✅ Navbar siempre visible
✅ Puede navegar fácilmente
✅ Experiencia consistente en toda la plataforma

### Para el Admin:
✅ Panel separado y seguro
✅ Código de acceso simple (333)
✅ Ve todas las ceremonias de todos los guías
✅ Puede aprobar/rechazar fácilmente

---

## 🧪 Prueba el Flujo Completo

### Test 1: Registro y creación de ceremonia
```bash
1. Ir a: http://localhost:5001
2. Click en "Portal de Guías"
3. Tab "Registrarse"
4. Llenar formulario
5. Crear cuenta
6. Iniciar sesión
7. Verificar redirección a /guia/dashboard
8. Click "Nueva Ceremonia"
9. Llenar formulario
10. Guardar
11. Verificar que aparece con badge "⏳ En Revisión"
```

### Test 2: Aprobación por admin
```bash
1. Abrir nueva pestaña
2. Ir a: http://localhost:5001/admin/master/login
3. Ingresar código: 333
4. Ver ceremonia creada en el paso anterior
5. Click "Editar"
6. Cambiar estado a "Aprobada"
7. Activar "Publicar Ceremonia"
8. Guardar
9. Volver a la pestaña del guía
10. Refrescar dashboard
11. Verificar badge cambió a "✅ Publicada"
12. Click en icono "ojo" para ver en página pública
```

---

## 📝 Notas Importantes

- ✅ El navbar se muestra en TODAS las páginas públicas y del guía
- ✅ El dialog de login/registro se puede cerrar con ESC o click fuera
- ✅ El avatar del guía muestra sus iniciales si no tiene foto
- ✅ El dropdown del avatar se cierra al hacer click fuera
- ✅ Las rutas `/admin/*` antiguas siguen funcionando para compatibilidad
- ✅ El sistema de aprobación funciona igual que antes

---

**¡El flujo integrado está completo y listo para usar!** 🎉
