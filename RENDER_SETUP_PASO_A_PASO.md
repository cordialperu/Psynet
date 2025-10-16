# Configuración de Render - Paso a Paso

## El problema detectado:
El servicio en Render está creado pero NO está conectado al repositorio de GitHub, por eso no hay logs y no carga.

## Solución - Sigue estos pasos exactamente:

### Paso 1: Eliminar el servicio actual (que no funciona)
1. Ve a: https://dashboard.render.com
2. Haz clic en tu servicio "psynet"
3. Ve a **Settings** (en el menú lateral izquierdo)
4. Baja hasta el final y haz clic en **"Delete Service"**
5. Confirma la eliminación

### Paso 2: Crear un nuevo servicio conectado a GitHub
1. Ve a: https://dashboard.render.com
2. Haz clic en **"New +"** en la esquina superior derecha
3. Selecciona **"Web Service"**
4. En la sección "Connect a repository", haz clic en **"Connect account"** si es necesario
5. **Autoriza a Render** a acceder a tu GitHub
6. Busca y selecciona el repositorio: **cordialperu/Psynet**
7. Haz clic en **"Connect"**

### Paso 3: Configurar el servicio
Usa EXACTAMENTE estos valores:

**Información básica:**
- Name: `psynet`
- Region: `Oregon (US West)` o el más cercano
- Branch: `main`
- Runtime: `Node`

**Build & Deploy:**
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

**Plan:**
- Instance Type: Selecciona **"Free"** ($0/month)

### Paso 4: Configurar variables de entorno
Haz clic en **"Add Environment Variable"** para cada una:

```
DATABASE_URL
postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-a652308v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

NODE_ENV
production

PORT
10000

VITE_WHATSAPP_PHONE_NUMBER
51987654321

MASTER_CODE
333

SESSION_SECRET
(deja que Render lo genere automáticamente)
```

### Paso 5: Crear y desplegar
1. Haz clic en **"Create Web Service"** al final de la página
2. **ESPERA 5-10 minutos** - verás los logs en tiempo real:
   ```
   ==> Cloning from GitHub...
   ==> Installing dependencies...
   ==> Building...
   ==> Starting server...
   ==> Your service is live 🎉
   ```

### Paso 6: Verificar
1. Una vez que veas "Your service is live 🎉"
2. Abre: https://psynet.onrender.com
3. Deberías ver tu aplicación con TODAS tus publicaciones

## ¿Por qué no funcionó antes?
El servicio se creó manualmente pero sin conectar al repositorio de GitHub, por eso nunca hubo un "build" ni "deploy" real.

## Tiempo estimado:
- Configuración: 5 minutos
- Primer despliegue: 5-10 minutos
- **Total: 10-15 minutos**

---

**¡IMPORTANTE!** No cierres la ventana durante el despliegue, los logs te dirán si hay algún error.
