# 🔍 AUDITORÍA COMPLETA DE PSYNET
**Fecha:** 16 de octubre de 2025
**Estado:** En progreso

---

## ✅ FUNCIONALIDADES VERIFICADAS

### 1. HOME PAGE (/)
- [ ] Las publicaciones cargan correctamente
- [ ] Selector de país funciona (PE/MX)
- [ ] Selector de categorías funciona
- [ ] Búsqueda funciona
- [ ] Cards se ven correctamente
- [ ] Modo oscuro funciona

### 2. DETALLE DE PUBLICACIÓN (/therapy/:slug)
- [ ] Carga el detalle completo
- [ ] Video de YouTube se muestra (si existe)
- [ ] Información del guía se muestra
- [ ] Botón de WhatsApp funciona
- [ ] Swipe navigation funciona
- [ ] Selector de fecha funciona (ceremonias/terapias)

### 3. REGISTRO DE GUÍAS (/admin/register)
- [ ] Formulario se muestra correctamente
- [ ] Validación funciona
- [ ] Se puede registrar exitosamente
- [ ] Redirecciona al login después

### 4. LOGIN DE GUÍAS (/admin/login)
- [ ] Formulario se muestra correctamente
- [ ] Login exitoso funciona
- [ ] Manejo de errores funciona
- [ ] Redirecciona al dashboard

### 5. DASHBOARD DE GUÍAS (/admin/dashboard)
- [ ] Se requiere autenticación
- [ ] Muestra publicaciones del guía
- [ ] Puede crear nueva publicación
- [ ] Puede editar publicaciones existentes
- [ ] Puede ver estadísticas

### 6. SUPER ADMIN LOGIN (/admin/master/login)
- [ ] Login funciona
- [ ] Redirecciona al dashboard

### 7. SUPER ADMIN DASHBOARD (/admin/master/dashboard)
- [ ] Estadísticas se muestran correctamente
- [ ] Colores de categorías correctos
- [ ] Selector de país funciona
- [ ] Filtros funcionan
- [ ] Búsqueda funciona
- [ ] Cambiar estado de publicación funciona (Published/Pending/Paused)
- [ ] Cambiar orden funciona (Mover arriba/abajo)
- [ ] Gestionar inventario/capacidad funciona
- [ ] Editar publicación funciona

---

## ❌ PROBLEMAS ENCONTRADOS

### 🔴 CRÍTICOS (Bloquean funcionalidad)
1. **[PENDIENTE]** Super Admin - Error al actualizar terapias (Drizzle ORM)

### 🟡 IMPORTANTES (Degradan experiencia)
1. **[PENDIENTE]** Videos de YouTube no se muestran en algunas publicaciones

### 🟢 MENORES (Mejoras estéticas/UX)
1. **[CORREGIDO]** Colores de categorías en Super Admin no coincidían con navbar

---

## 📝 NOTAS
- Servidor corriendo en http://localhost:5001
- Base de datos: Neon PostgreSQL
- Migrando de Drizzle ORM a consultas directas debido a incompatibilidades
