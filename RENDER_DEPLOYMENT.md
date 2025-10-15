# 🚀 Guía de Despliegue en Render.com

## ¿Por qué Render?

Render.com es la mejor opción para este proyecto porque:

- ✅ **Plan gratuito REAL**: 750 horas/mes sin necesidad de tarjeta
- ✅ **Soporta Node.js completo**: Sin limitaciones de serverless
- ✅ **Base de datos externa**: Conecta directamente a Neon PostgreSQL
- ✅ **SSL automático**: HTTPS incluido
- ✅ **Despliegue automático**: Desde GitHub/GitLab
- ✅ **Mejor que Railway**: No requiere pago obligatorio
- ✅ **Mejor que Vercel**: Soporta aplicaciones completas de Node.js

## 🎯 Opciones de Despliegue

### Opción 1: Despliegue Rápido (Recomendado) 

**Desde la Web UI - 5 minutos**

1. **Crear cuenta en Render**
   - Ve a: https://render.com/
   - Haz clic en "Get Started for Free"
   - Inicia sesión con GitHub (recomendado)

2. **Conectar repositorio**
   - Haz clic en "New +" en el dashboard
   - Selecciona "Web Service"
   - Conecta tu cuenta de GitHub si aún no lo has hecho
   - Busca y selecciona el repositorio: `cordialperu/Psynet`

3. **Configurar el servicio**
   ```
   Name: psynet
   Runtime: Node
   Branch: main
   Root Directory: (dejar vacío)
   Build Command: npm install && npm run build
   Start Command: npm start
   Plan: Free
   ```

4. **Variables de Entorno**
   
   Haz clic en "Advanced" y añade estas variables:
   
   ```
   DATABASE_URL = postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   
   VITE_WHATSAPP_PHONE_NUMBER = 51987654321
   
   MASTER_CODE = 333
   
   NODE_ENV = production
   
   PORT = 10000
   
   SESSION_SECRET = (genera uno aleatorio o déjalo en blanco para que Render lo genere)
   ```

5. **Desplegar**
   - Haz clic en "Create Web Service"
   - Espera 5-10 minutos mientras se construye y despliega
   - ¡Listo! Tu app estará en: `https://psynet.onrender.com`

### Opción 2: Configuración Automática

**Usando el archivo render.yaml**

1. **Asegúrate de que tu código esté en GitHub**
   ```bash
   git add render.yaml
   git commit -m "Add Render configuration"
   git push origin main
   ```

2. **Crear servicio desde Blueprint**
   - Ve a: https://dashboard.render.com/select-repo?type=web
   - Selecciona el repositorio `Psynet`
   - Render detectará automáticamente `render.yaml`
   - Revisa la configuración
   - Añade las variables de entorno manualmente (sync: false en yaml)
   - Haz clic en "Apply"

### Opción 3: Script Automatizado

**Usa el script incluido**

```bash
./deploy-render.sh
```

Este script:
- Te guía paso a paso
- Muestra todas las configuraciones necesarias
- Abre el navegador en la página correcta
- Incluye verificaciones post-despliegue

## 📋 Configuración Completa

### Variables de Entorno Requeridas

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require` | Conexión a Neon PostgreSQL |
| `VITE_WHATSAPP_PHONE_NUMBER` | `51987654321` | Número de WhatsApp para contacto |
| `MASTER_CODE` | `333` | Código maestro para super admin |
| `NODE_ENV` | `production` | Modo de producción |
| `PORT` | `10000` | Puerto (Render usa 10000 por defecto) |
| `SESSION_SECRET` | (autogenerado) | Secreto para sesiones |

### Comandos de Build y Start

```json
{
  "buildCommand": "npm install && npm run build",
  "startCommand": "npm start"
}
```

Estos comandos:
1. Instalan todas las dependencias
2. Compilan TypeScript a JavaScript (`dist/`)
3. Inician el servidor Express

## 🔍 Verificación Post-Despliegue

### 1. Verificar Health Check

```bash
curl https://psynet.onrender.com/api/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-10-15T..."
}
```

### 2. Verificar Publicaciones

```bash
curl https://psynet.onrender.com/api/therapies/published?country=MX
```

Deberías ver tus publicaciones REALES, no los datos de demostración.

### 3. Verificar en el Navegador

1. Abre: `https://psynet.onrender.com`
2. Ve a la sección de terapias
3. Confirma que aparecen TUS publicaciones (no las 5 de demostración)

## ⚠️ Consideraciones Importantes

### Plan Gratuito - "Spin Down"

El plan gratuito de Render tiene una característica llamada "spin down":
- Después de **15 minutos de inactividad**, el servicio se "duerme"
- La primera carga después del spin down tomará **~30-50 segundos**
- Las siguientes cargas serán instantáneas
- Esto es normal y esperado en el plan gratuito

**Solución**: Si necesitas que la app esté siempre activa:
- Actualiza al plan de $7/mes
- O usa un servicio de "ping" gratuito como UptimeRobot para mantenerla activa

### Límites del Plan Gratuito

- ✅ 750 horas/mes (suficiente para 1 proyecto 24/7)
- ✅ SSL automático
- ✅ Despliegues ilimitados
- ✅ 100 GB de ancho de banda/mes
- ⚠️ Spin down después de 15 min de inactividad
- ⚠️ 512 MB RAM (suficiente para esta app)

## 🔧 Solución de Problemas

### Error: "Build Failed"

**Causa**: Problemas durante `npm install` o `npm run build`

**Solución**:
1. Verifica que `package.json` tiene todas las dependencias
2. Asegúrate de que el build funciona localmente:
   ```bash
   npm run build
   ```
3. Revisa los logs en: https://dashboard.render.com

### Error: "Health Check Failed"

**Causa**: El servidor no responde en el puerto correcto

**Solución**:
1. Verifica que `server/index.ts` usa `process.env.PORT`
2. Confirma que la variable `PORT=10000` está configurada
3. Revisa el health check endpoint: `/api/health`

### Error: "Database Connection Failed"

**Causa**: Problema con `DATABASE_URL` o la base de datos Neon

**Solución**:
1. Verifica que `DATABASE_URL` está correctamente configurada
2. Prueba la conexión desde tu máquina local:
   ```bash
   psql "postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```
3. Confirma que Neon PostgreSQL está activo

### Solo se ven datos de demostración

**Causa**: La app está usando el fallback porque no puede conectar a la BD

**Solución**:
1. Revisa los logs en Render para ver errores de conexión
2. Verifica que `DATABASE_URL` tiene el valor correcto
3. Asegúrate de que Neon PostgreSQL permite conexiones externas
4. Reinicia el servicio después de configurar variables

## 📊 Comparación de Plataformas

| Característica | Render | Railway | Vercel |
|---------------|--------|---------|--------|
| Plan gratuito | ✅ 750h/mes | ❌ Requiere pago | ✅ Limitado |
| Node.js completo | ✅ Sí | ✅ Sí | ❌ Serverless |
| Base de datos externa | ✅ Sí | ✅ Sí | ⚠️ Limitado |
| Spin down | ⚠️ 15 min | ❌ No | ✅ No |
| SSL | ✅ Incluido | ✅ Incluido | ✅ Incluido |
| Build time | 5-10 min | 3-5 min | 2-3 min |
| **Mejor para** | Apps completas | Apps profesionales | Static + API simples |

## 🎯 Siguientes Pasos

Después del despliegue exitoso:

1. **Configurar dominio personalizado** (opcional)
   - Ve a Settings > Custom Domains
   - Añade tu dominio
   - Actualiza DNS según instrucciones

2. **Configurar alertas**
   - Ve a Settings > Notifications
   - Configura alertas de error por email

3. **Monitorear uso**
   - Dashboard muestra uso de horas
   - Revisa si necesitas actualizar al plan de pago

4. **Auto-deploy desde Git**
   - Cada push a `main` desplegará automáticamente
   - Configura ramas de staging si es necesario

## 🔗 Enlaces Útiles

- **Dashboard**: https://dashboard.render.com/
- **Tu servicio**: https://dashboard.render.com/ (busca "psynet")
- **Documentación**: https://render.com/docs
- **Soporte**: https://render.com/docs/support
- **Status**: https://status.render.com/

## 💰 Costos

### Plan Gratuito (Actual)
- **Costo**: $0/mes
- **Ideal para**: Desarrollo, pruebas, proyectos personales
- **Limitación**: Spin down después de inactividad

### Plan Starter ($7/mes)
- **Sin spin down**: Siempre activo
- **Más recursos**: 1 GB RAM
- **Mejor para**: Producción real

## ✅ Checklist de Despliegue

- [ ] Cuenta de Render creada
- [ ] Repositorio conectado
- [ ] Servicio configurado (build + start commands)
- [ ] Variables de entorno añadidas
- [ ] Despliegue completado (5-10 min)
- [ ] Health check respondiendo (`/api/health`)
- [ ] Base de datos conectada
- [ ] Publicaciones reales visibles en la app
- [ ] SSL funcionando (HTTPS)
- [ ] Dominio personalizado (opcional)

## 🎉 ¡Éxito!

Si todo funciona correctamente:

1. Tu app está en: `https://psynet.onrender.com`
2. La base de datos Neon PostgreSQL está conectada
3. Tus publicaciones reales son visibles
4. Cada push a GitHub desplegará automáticamente
5. SSL/HTTPS está activo

**¡Tu app está lista para usar!** 🚀

---

**Última actualización**: 15 de octubre de 2025
**Proyecto**: Psynet - Red de Terapeutas Psicodélicos
**Plataforma**: Render.com
