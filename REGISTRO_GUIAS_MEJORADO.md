# ✅ Sistema de Registro de Guías Mejorado

## 📋 Cambios Implementados

### **1. ✅ Campos Obligatorios en Registro**

**Formulario de Registro (`/admin/register`):**

**Campos Obligatorios:**
- ✅ **Full Name** - Nombre completo
- ✅ **Email** - Email válido (único en BD)
- ✅ **Phone** - Teléfono (mínimo 9 dígitos)
- ✅ **WhatsApp** - WhatsApp para contacto con clientes (mínimo 9 dígitos)
- ✅ **Password** - Contraseña (mínimo 6 caracteres)

**Redes Sociales (al menos una obligatoria):**
- **Instagram** - @usuario (opcional)
- **TikTok** - @usuario (opcional)

**Validación:**
```typescript
.refine((data) => data.instagram || data.tiktok, {
  message: "You must provide at least Instagram or TikTok",
  path: ["instagram"],
})
```

---

### **2. ✅ Esquema de Base de Datos Actualizado**

**Tabla `guides`:**
```sql
- id (UUID, PK)
- fullName (VARCHAR, NOT NULL)
- email (VARCHAR, NOT NULL, UNIQUE)
- phone (VARCHAR, NOT NULL)
- whatsapp (VARCHAR) -- Nuevo campo
- instagram (VARCHAR) -- Ahora opcional
- tiktok (VARCHAR) -- Nuevo campo
- passwordHash (VARCHAR, NOT NULL)
- primarySpecialty (VARCHAR)
- bio (TEXT)
- profilePhotoUrl (TEXT)
- verified (BOOLEAN, default: false)
- verificationStatus (VARCHAR, default: 'pending')
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

**Migración Ejecutada:**
```sql
ALTER TABLE guides 
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(50),
ADD COLUMN IF NOT EXISTS tiktok VARCHAR(100);

-- Instagram ahora es opcional (antes era NOT NULL)
```

---

### **3. ✅ Panel de Super Administrador**

**Nueva Ruta:** `/admin/master/guides`

**Características:**
- Lista completa de todos los guías registrados
- Información de contacto (email, teléfono, WhatsApp)
- Redes sociales (Instagram, TikTok) con links directos
- Estado de verificación
- Fecha de registro
- Botón "View Details" para cada guía

**Columnas de la Tabla:**
1. **Name** - Nombre y especialidad
2. **Contact** - Email, teléfono, WhatsApp (clickeable)
3. **Social Media** - Instagram y TikTok con íconos
4. **Status** - Verificado/Pendiente
5. **Registered** - Fecha de registro
6. **Actions** - Ver detalles

---

### **4. ✅ Navegación del Super Admin**

**Header Actualizado:**
```
Super Admin Panel
├── Listings (publicaciones)
└── Guides (guías registrados)
```

**Rutas:**
- `/admin/master/dashboard` - Ver todas las publicaciones
- `/admin/master/guides` - Ver todos los guías
- `/admin/master/login` - Login con código 333

---

### **5. ✅ API Endpoints**

**Nuevo Endpoint:**
```typescript
GET /api/admin/master/guides
```

**Autenticación:** Requiere master auth (código 333)

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+51 987 654 321",
    "whatsapp": "+51 987 654 321",
    "instagram": "@johndoe",
    "tiktok": "@johndoe",
    "verified": false,
    "verificationStatus": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

## 🎯 Flujo de Registro

### **Paso 1: Usuario accede a `/admin/register`**

### **Paso 2: Completa el formulario**
- Nombre completo
- Email (único)
- Teléfono
- WhatsApp (para clientes)
- Al menos Instagram O TikTok
- Contraseña

### **Paso 3: Validación**
```typescript
✅ Email válido
✅ Teléfono válido (formato internacional)
✅ WhatsApp válido (formato internacional)
✅ Al menos una red social (Instagram o TikTok)
✅ Contraseña mínimo 6 caracteres
```

### **Paso 4: Registro Exitoso**
- Guía creado en BD
- Estado: `pending` verification
- Redirect a `/admin/login`

### **Paso 5: Super Admin Revisa**
- Accede a `/admin/master/guides`
- Ve todos los guías registrados
- Puede verificar/aprobar

---

## 📱 Interfaz del Formulario

**Campos Visibles:**

```
┌─────────────────────────────────────┐
│ Full Name *                         │
│ [John Doe                        ]  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Email *                             │
│ [tu@email.com                    ]  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Teléfono *                          │
│ [+51 987 654 321                 ]  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ WhatsApp * (for customer contact)   │
│ [+51 987 654 321                 ]  │
└─────────────────────────────────────┘

Social Media * (at least one required)

┌─────────────────────────────────────┐
│ Instagram                           │
│ [@yourusername                   ]  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ TikTok                              │
│ [@yourusername                   ]  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Contraseña *                        │
│ [••••••••                        ]  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Confirmar Contraseña *              │
│ [••••••••                        ]  │
└─────────────────────────────────────┘

        [ Crear Cuenta ]
```

---

## 🔐 Panel del Super Administrador

**Vista de Guías:**

```
┌──────────────────────────────────────────────────────────────┐
│ Registered Guides & Brands                                   │
│ Total: 15 guides registered                                  │
├──────────────────────────────────────────────────────────────┤
│ Name          Contact              Social    Status  Actions │
├──────────────────────────────────────────────────────────────┤
│ John Doe      ✉ john@email.com    📷 @john  ⏳ Pending      │
│ Ceremonies    ☎ +51 987 654 321   🎵 @john  [View Details]  │
│               💬 +51 987 654 321                             │
├──────────────────────────────────────────────────────────────┤
│ Jane Smith    ✉ jane@email.com    📷 @jane  ✅ Verified     │
│ Therapies     ☎ +51 987 111 222              [View Details]  │
│               💬 +51 987 111 222                             │
└──────────────────────────────────────────────────────────────┘
```

**Íconos:**
- 📧 Email (clickeable - abre mailto:)
- ☎️ Phone
- 💬 WhatsApp (clickeable - abre wa.me)
- 📷 Instagram (clickeable - abre perfil)
- 🎵 TikTok (clickeable - abre perfil)

---

## ✅ Validaciones Implementadas

### **Email:**
```typescript
z.string().email("Invalid email")
```

### **Phone:**
```typescript
z.string()
  .min(9, "Phone must be at least 9 digits")
  .regex(/^[+]?[\d\s-()]+$/, "Invalid phone format")
```

### **WhatsApp:**
```typescript
z.string()
  .min(9, "WhatsApp must be at least 9 digits")
  .regex(/^[+]?[\d\s-()]+$/, "Invalid WhatsApp format")
```

### **Instagram/TikTok:**
```typescript
instagram: z.string().optional()
tiktok: z.string().optional()

// Al menos uno requerido:
.refine((data) => data.instagram || data.tiktok, {
  message: "You must provide at least Instagram or TikTok"
})
```

---

## 🚀 Cómo Usar

### **Para Guías:**
1. Ir a `/admin/register`
2. Completar todos los campos obligatorios
3. Agregar al menos Instagram o TikTok
4. Crear cuenta
5. Iniciar sesión en `/admin/login`

### **Para Super Admin:**
1. Login en `/admin/master/login` con código `333`
2. Click en "Guides" en el navbar
3. Ver lista completa de guías
4. Click "View Details" para más información

---

## 📊 Estadísticas Disponibles

En el panel de guías se puede ver:
- Total de guías registrados
- Guías verificados vs pendientes
- Información de contacto completa
- Redes sociales activas
- Fecha de registro

---

## ✅ Estado Final

**Completado:**
- ✅ WhatsApp obligatorio
- ✅ Instagram o TikTok (al menos uno)
- ✅ Email y teléfono obligatorios
- ✅ Panel de super admin con lista de guías
- ✅ Links directos a redes sociales
- ✅ Links a WhatsApp y email
- ✅ Estado de verificación visible
- ✅ Migración de base de datos ejecutada

**Todo funcionando correctamente!** 🎉
