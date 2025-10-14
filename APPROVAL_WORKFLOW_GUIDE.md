# 📋 Guía del Flujo de Aprobación

## ✅ Cambios Implementados

### 1. **Base de Datos**
- ✅ Agregada columna `approval_status` a la tabla `therapies`
- ✅ Valores posibles: `pending`, `approved`, `rejected`
- ✅ Todas las terapias existentes marcadas como `approved`

### 2. **Backend - Flujo de Creación**
- ✅ Nuevas terapias creadas por guías tienen `approvalStatus: "pending"`
- ✅ Nuevas terapias tienen `published: false` por defecto
- ✅ Solo se publican cuando el admin las aprueba

### 3. **Rutas API Nuevas**
```
POST /api/master/therapies/:id/approve  - Aprobar una terapia
POST /api/master/therapies/:id/reject   - Rechazar una terapia
```

---

## 🔗 URLs Importantes

### **Panel de Guías** (Crear Evento)
```
http://localhost:5001/admin/therapies/new
```

**Flujo del Guía:**
1. Login en: `http://localhost:5001/admin/login`
2. Dashboard: `http://localhost:5001/admin/dashboard`
3. Click en "Add New Therapy"
4. Llenar formulario
5. Guardar → **Estado: PENDING (En Revisión)**

### **Panel Super Admin** (Aprobar/Rechazar)
```
http://localhost:5001/admin/master/login
Código: 333
```

**Flujo del Super Admin:**
1. Login con código `333`
2. Ver todas las ceremonias (incluidas las pendientes)
3. Identificar ceremonias con estado "Pending"
4. Editar ceremonia
5. Cambiar `approvalStatus` a "approved" o "rejected"
6. Si aprueba → Auto-publica la ceremonia

---

## 🔧 Problema Actual del Guardado

El formulario master tiene un problema con el guardado. **Solución temporal:**

1. Abre la consola del navegador (F12)
2. Revisa los errores que aparecen al guardar
3. Los logs mostrarán el error exacto

**Posibles causas:**
- Campo `approvalStatus` no está en el formulario
- Tipo de dato incorrecto
- Sesión master expirada

---

## 📱 Notificación WhatsApp (Pendiente)

### Configuración Necesaria:

1. **Servicio de WhatsApp API:**
   - Twilio WhatsApp API
   - WhatsApp Business API
   - O servicio alternativo (Wassenger, etc.)

2. **Variables de Entorno (.env):**
```env
# WhatsApp Admin Notification
ADMIN_WHATSAPP_NUMBER=51987654321
WHATSAPP_API_KEY=tu_api_key
WHATSAPP_API_URL=https://api.twilio.com/...
```

3. **Implementación:**
```typescript
// En server/routes.ts después de crear terapia
async function sendWhatsAppNotification(therapy: Therapy, guide: Guide) {
  const message = `
🔔 Nueva Ceremonia para Revisar

Guía: ${guide.fullName}
Ceremonia: ${therapy.title}
Tipo: ${therapy.type}

Revisa en: http://localhost:5001/admin/master/dashboard
  `;
  
  // Enviar vía API de WhatsApp
  await fetch(process.env.WHATSAPP_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: process.env.ADMIN_WHATSAPP_NUMBER,
      message: message
    })
  });
}
```

---

## 🎯 Estados de Aprobación

### **pending** (Amarillo)
- Ceremonia recién creada por el guía
- Esperando revisión del admin
- NO visible en la página pública
- NO publicada

### **approved** (Verde)
- Ceremonia aprobada por el admin
- AUTO-PUBLICADA
- Visible en la página pública
- Los guías pueden ver que fue aprobada

### **rejected** (Rojo)
- Ceremonia rechazada por el admin
- NO publicada
- NO visible en la página pública
- Los guías pueden ver que fue rechazada (opcional: agregar razón)

---

## 🔄 Flujo Completo

```
1. GUÍA CREA CEREMONIA
   ↓
   Estado: pending
   Publicado: false
   ↓
2. NOTIFICACIÓN WHATSAPP AL ADMIN
   ↓
3. ADMIN REVISA EN PANEL MASTER
   ↓
4. ADMIN APRUEBA O RECHAZA
   ↓
   Si APRUEBA:
   - Estado: approved
   - Publicado: true
   - Visible en página pública
   ↓
   Si RECHAZA:
   - Estado: rejected
   - Publicado: false
   - NO visible
```

---

## 📝 Tareas Pendientes

### Inmediato:
- [ ] Arreglar el guardado en el formulario master
- [ ] Agregar campo `approvalStatus` al formulario de edición master
- [ ] Agregar badges de estado en el dashboard master
- [ ] Agregar botones "Aprobar" y "Rechazar" en el dashboard

### Corto Plazo:
- [ ] Implementar notificación WhatsApp
- [ ] Agregar filtro por estado de aprobación en dashboard master
- [ ] Mostrar estado de aprobación en el dashboard del guía
- [ ] Agregar razón de rechazo (opcional)

### Mediano Plazo:
- [ ] Historial de cambios de estado
- [ ] Notificar al guía cuando su ceremonia es aprobada/rechazada
- [ ] Panel de estadísticas de aprobación

---

## 🐛 Debug del Problema de Guardado

**Pasos para identificar el error:**

1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Intenta guardar cambios
4. Busca estos logs:
   - "Form data:" → Datos del formulario
   - "Therapy ID:" → ID de la terapia
   - "Sending payload:" → Datos enviados al servidor
   - "Mutation error:" → Error específico

**Errores comunes:**
- `400 Bad Request` → Datos inválidos
- `401 Unauthorized` → Sesión expirada
- `403 Forbidden` → Sin permisos
- `500 Internal Server Error` → Error en el servidor

---

## 📞 Contacto y Soporte

Si necesitas ayuda adicional:
1. Revisa los logs en la consola
2. Verifica que la migración se ejecutó correctamente
3. Confirma que el servidor está corriendo
4. Revisa los logs del servidor en la terminal

---

**Última actualización:** 2025-10-05
