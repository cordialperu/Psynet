# 🚂 Deployment en Railway - Guía Completa

## ✅ Preparación Completa

Todo está listo para desplegar en Railway:
- ✅ `railway.json` - Configuración de Railway
- ✅ `Procfile` - Comando de inicio
- ✅ `deploy-railway.sh` - Script automático de deployment
- ✅ `package.json` - Scripts corregidos

---

## 🚀 Opción 1: Deployment Automático (RECOMENDADO)

### Paso 1: Ejecutar el Script
```bash
./deploy-railway.sh
```

Este script hará **TODO automáticamente**:
1. ✅ Instala Railway CLI (si no lo tienes)
2. ✅ Te autentica (abre navegador)
3. ✅ Crea el proyecto
4. ✅ Configura variables de entorno desde tu `.env`
5. ✅ Despliega la app
6. ✅ Te da la URL final

**Tiempo estimado:** 5-10 minutos

---

## 🛠️ Opción 2: Deployment Manual

### Paso 1: Instalar Railway CLI
```bash
npm install -g @railway/cli
```

### Paso 2: Login
```bash
railway login
```
Se abrirá tu navegador para autenticarte.

### Paso 3: Crear Proyecto
```bash
railway init
```
- Nombre sugerido: `psynet`
- Selecciona: "Empty Project"

### Paso 4: Configurar Variables de Entorno
```bash
# Base de datos
railway variables set DATABASE_URL="postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# WhatsApp
railway variables set VITE_WHATSAPP_PHONE_NUMBER="51987654321"

# Seguridad
railway variables set SESSION_SECRET="your_random_session_secret_change_this_in_production"
railway variables set MASTER_CODE="333"

# Configuración
railway variables set PORT="5001"
railway variables set NODE_ENV="production"
```

### Paso 5: Desplegar
```bash
railway up
```

### Paso 6: Abrir tu App
```bash
railway open
```

---

## 🌐 Opción 3: Deployment desde GitHub

Railway puede desplegar directamente desde GitHub (auto-deploy):

### Paso 1: Push a GitHub
```bash
git add -A
git commit -m "Ready for Railway deployment"
git push origin main
```

### Paso 2: Conectar en Railway Dashboard
1. Ve a https://railway.app/dashboard
2. Click "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza Railway a acceder a tus repos
5. Selecciona `cordialperu/Psynet`

### Paso 3: Configurar Variables
En el dashboard de Railway:
1. Ve a "Variables"
2. Agrega las mismas variables del Paso 4 de la Opción 2

✅ **Ventaja:** Cada push a `main` desplegará automáticamente

---

## 📊 Después del Deployment

### Ver tu App
```bash
railway open
```

### Ver Logs en Tiempo Real
```bash
railway logs
```

### Ver Estado
```bash
railway status
```

### Agregar Dominio Personalizado
```bash
railway domain
```
O desde el dashboard: Settings → Domains → Generate Domain

---

## 🔧 Configuración de Railway

### Variables de Entorno Incluidas
```env
DATABASE_URL=<tu-database-neon>
VITE_WHATSAPP_PHONE_NUMBER=51987654321
SESSION_SECRET=<tu-secret>
MASTER_CODE=333
PORT=5001
NODE_ENV=production
```

### Build Settings
- **Build Command:** `npm run build`
- **Start Command:** `node dist/index.js`
- **Node Version:** Detectado automáticamente (20.x)

### Resources
- **RAM:** 512MB (plan gratuito)
- **CPU:** Compartido
- **Uptime:** 24/7
- **HTTPS:** ✅ Incluido automáticamente

---

## ✨ Ventajas de Railway

1. **Plan Gratuito:**
   - $5 de crédito gratis/mes
   - Suficiente para ~500 horas de uptime
   - Sin tarjeta de crédito requerida inicialmente

2. **Facilidad de Uso:**
   - Deploy en 1 comando
   - Auto-detección de framework
   - Logs en tiempo real

3. **Características:**
   - ✅ HTTPS automático
   - ✅ Dominio gratis (.railway.app)
   - ✅ Variables de entorno seguras
   - ✅ Auto-scaling
   - ✅ Deploy automático desde GitHub

4. **Compatible con tu Stack:**
   - ✅ Node.js
   - ✅ PostgreSQL externo (Neon)
   - ✅ Express
   - ✅ Vite

---

## 🎯 Verificación Post-Deployment

### 1. Health Check
```bash
curl https://tu-app.railway.app/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2025-10-15T...",
  "environment": "production",
  "database": "connected"
}
```

### 2. Ver Terapias
```bash
curl https://tu-app.railway.app/api/therapies/published?country=MX
```

Deberías ver **TUS publicaciones reales** de la base de datos.

### 3. Abrir en Navegador
Tu app estará en: `https://psynet-production-XXXX.up.railway.app`

---

## 🐛 Troubleshooting

### Error: "Build failed"
**Solución:**
```bash
# Verificar que el build funciona localmente
npm run build

# Si falla, revisar logs
railway logs
```

### Error: "Cannot connect to database"
**Solución:**
```bash
# Verificar DATABASE_URL
railway variables

# Re-set si es necesario
railway variables set DATABASE_URL="<tu-url>"
```

### Error: "Port already in use"
**Solución:** Railway asigna el puerto automáticamente mediante `process.env.PORT`

Verifica en `server/index.ts`:
```typescript
const PORT = process.env.PORT || 5001;
```

### App no responde
**Solución:**
```bash
# Ver logs
railway logs

# Restart
railway restart
```

---

## 📈 Monitoreo

### Dashboard
https://railway.app/dashboard
- Ver deployments
- Métricas de uso
- Logs históricos
- Variables de entorno

### CLI
```bash
# Logs en vivo
railway logs -f

# Métricas
railway status

# Variables
railway variables
```

---

## 🔄 Actualizar la App

### Método 1: Desde Local
```bash
git add -A
git commit -m "Update app"
railway up
```

### Método 2: Auto-Deploy (GitHub)
```bash
git push origin main
# Railway desplegará automáticamente
```

---

## 💰 Costos

**Plan Gratuito (Starter):**
- $5 USD gratis cada mes
- ~500 horas de ejecución
- 512MB RAM
- Suficiente para desarrollo y apps pequeñas

**Si necesitas más:**
- **Hobby:** $5/mes por servicio adicional
- **Pro:** $20/mes con más recursos

**Tu app debería costar $0/mes** con el plan gratuito para tráfico moderado.

---

## 🎉 Resultado Final

Después del deployment tendrás:

1. ✅ **URL pública:** `https://psynet-production-XXXX.up.railway.app`
2. ✅ **HTTPS automático** (certificado SSL)
3. ✅ **Todas tus publicaciones** visibles
4. ✅ **Base de datos conectada** (Neon)
5. ✅ **Uptime 24/7**
6. ✅ **Auto-restart** si hay errores
7. ✅ **Logs accesibles**

---

## 📞 Siguiente Paso

**Ejecuta ahora:**
```bash
./deploy-railway.sh
```

O si prefieres manual:
```bash
railway login
railway init
railway up
```

¡En 5-10 minutos tu app estará en vivo con TODAS tus publicaciones! 🚀

---

*Guía creada: 15 octubre 2025*  
*Railway Version: Latest*  
*Costo: $0 (Plan Gratuito)*
