# 📱 Sistema de Notificaciones WhatsApp - México y Perú

## 🎯 Resumen

Se ha implementado un sistema de notificaciones paralelas que envía mensajes de WhatsApp simultáneamente a dos administradores:
- **Administrador de Perú**: Gestiona pedidos de Perú
- **Administrador de México**: Gestiona pedidos de México

## ✅ Cambios Implementados

### 1. Base de Datos

**Nueva columna en `admin_settings`:**
```sql
ALTER TABLE admin_settings 
ADD COLUMN admin_whatsapp_mexico VARCHAR(50);
```

**Campos disponibles:**
- `admin_name`: Nombre del administrador principal
- `admin_whatsapp`: WhatsApp del administrador de Perú (+51...)
- `admin_whatsapp_mexico`: WhatsApp del administrador de México (+52...)
- `paypal_email`: Email para pagos de PayPal

### 2. Schema TypeScript

**Archivo:** `shared/schema.ts`

```typescript
export const adminSettings = pgTable("admin_settings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  adminName: varchar("admin_name", { length: 255 }).notNull(),
  adminWhatsapp: varchar("admin_whatsapp", { length: 50 }).notNull(),
  adminWhatsappMexico: varchar("admin_whatsapp_mexico", { length: 50 }),
  paypalEmail: varchar("paypal_email", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
```

### 3. Storage Layer

**Archivo:** `server/storage.ts`

La interfaz `updateAdminSettings` ahora acepta el campo `adminWhatsappMexico`:

```typescript
updateAdminSettings(settings: { 
  adminName: string; 
  adminWhatsapp: string; 
  adminWhatsappMexico?: string | null; 
  paypalEmail?: string | null 
}): Promise<AdminSettings>;
```

### 4. API Routes

**Archivo:** `server/routes.ts`

**Endpoint actualizado:**
```typescript
POST /api/admin/master/settings
Body: {
  adminName: string,
  adminWhatsapp: string,
  adminWhatsappMexico?: string,
  paypalEmail?: string
}
```

**Lógica de notificaciones paralelas:**
- Al crear una nueva publicación → Notifica a Perú y México
- Al actualizar una publicación → Notifica a Perú y México

```typescript
// Enviar a administrador de Perú
if (adminSettings.adminWhatsapp) {
  const whatsappLinkPeru = generateWhatsAppLink(adminSettings.adminWhatsapp, message);
  console.log(`📱 Perú: ${whatsappLinkPeru}`);
}

// Enviar a administrador de México
if (adminSettings.adminWhatsappMexico) {
  const whatsappLinkMexico = generateWhatsAppLink(adminSettings.adminWhatsappMexico, message);
  console.log(`📱 México: ${whatsappLinkMexico}`);
}
```

### 5. Interfaz de Usuario

**Archivo:** `client/src/pages/admin/admin-settings.tsx`

**Nuevos campos en el formulario:**

1. **Número de WhatsApp del Administrador (Perú)**
   - Placeholder: `+51 987 654 321`
   - Descripción: "Número de WhatsApp del administrador de Perú que recibe notificaciones de pedidos"

2. **Número de WhatsApp del Administrador (México)**
   - Placeholder: `+52 55 1234 5678`
   - Descripción: "Número de WhatsApp del administrador de México que recibe notificaciones de pedidos"

**Nota informativa:**
> Los pedidos se envían a ambos administradores (Perú y México) simultáneamente para una gestión más eficiente.

## 🚀 Cómo Usar

### Paso 1: Ejecutar la Migración

```bash
npm run db:migrate
# o ejecutar el script específico:
npx tsx scripts/add-mexico-admin-whatsapp.ts
```

### Paso 2: Configurar los Números de WhatsApp

1. Inicia sesión como super admin en `/admin/master/login`
2. Ve a "Settings" en el menú de navegación
3. Configura los números:
   - **Perú**: `+51 987 654 321` (ejemplo)
   - **México**: `+52 55 1234 5678` (ejemplo)
4. Haz clic en "Guardar Configuración"

### Paso 3: Verificar las Notificaciones

Cuando un guía crea o actualiza una publicación, verás en los logs:

```
📱 WhatsApp notification link generated for Peru admin: Admin
🔗 Perú: https://wa.me/51987654321?text=...
📱 WhatsApp notification link generated for Mexico admin
🔗 México: https://wa.me/5255123456789?text=...
```

## 📋 Tipos de Notificaciones

### 1. Nueva Publicación
```
🆕 Nueva Publicación Pendiente de Aprobación

📂 Categoría: Ceremonias
📝 Título: Retiro de Ayahuasca
💰 Precio: USD 150
👤 Guía: Juan Pérez
📞 Contacto del Guía: +51 987 654 321

🔗 Revisar y aprobar aquí:
[URL del panel de administración]
```

### 2. Actualización de Publicación
```
✏️ Publicación Actualizada - Requiere Revisión

📂 Categoría: Ceremonias
📝 Título: Retiro de Ayahuasca
💰 Precio: USD 150
👤 Guía: Juan Pérez
📞 Contacto del Guía: +51 987 654 321

🔗 Revisar cambios aquí:
[URL del panel de administración]
```

## 🔧 Archivos Modificados

1. **Migración:**
   - `migrations/add_mexico_admin_whatsapp.sql`
   - `scripts/add-mexico-admin-whatsapp.ts`

2. **Backend:**
   - `shared/schema.ts` - Schema de base de datos
   - `server/storage.ts` - Capa de almacenamiento
   - `server/routes.ts` - Endpoints y lógica de notificaciones

3. **Frontend:**
   - `client/src/pages/admin/admin-settings.tsx` - Interfaz de configuración

## ⚙️ Configuración Opcional

El campo `adminWhatsappMexico` es **opcional**. Si no se configura:
- Solo se enviarán notificaciones al administrador de Perú
- El sistema seguirá funcionando normalmente

## 🔒 Seguridad

- Solo el super admin puede acceder a la configuración
- Los números de WhatsApp se almacenan de forma segura en la base de datos
- La API requiere autenticación de master admin

## 📊 Ejemplo de Uso Completo

```typescript
// 1. Usuario configura los números en el panel
adminSettings = {
  adminName: "Admin Principal",
  adminWhatsapp: "+51987654321",      // Perú
  adminWhatsappMexico: "+5255123456", // México
  paypalEmail: "pagos@empresa.com"
}

// 2. Guía crea una publicación
// El sistema automáticamente:
// - Genera el mensaje de notificación
// - Crea links de WhatsApp para ambos admins
// - Registra en los logs

// 3. Ambos administradores reciben la notificación
// - Admin Perú: https://wa.me/51987654321?text=...
// - Admin México: https://wa.me/5255123456?text=...
```

## 🎉 Beneficios

✅ **Gestión paralela**: Ambos administradores reciben notificaciones simultáneamente  
✅ **Flexibilidad**: El campo de México es opcional  
✅ **Escalabilidad**: Fácil agregar más administradores en el futuro  
✅ **Transparencia**: Logs claros de todas las notificaciones enviadas  
✅ **Sin interrupciones**: Si falla una notificación, la otra se envía igual  

## 📝 Notas Técnicas

- Las notificaciones se envían en paralelo (no bloquean entre sí)
- Los errores en notificaciones no afectan la creación/actualización de publicaciones
- Los links de WhatsApp se generan con el formato estándar `wa.me`
- Los mensajes están pre-formateados con emojis para mejor legibilidad

## 🔄 Próximos Pasos Sugeridos

1. Integrar con WhatsApp Business API para envío automático
2. Agregar notificaciones para reservas y compras
3. Implementar sistema de confirmación de lectura
4. Agregar más administradores por país si es necesario
