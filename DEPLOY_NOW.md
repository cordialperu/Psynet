# 🚀 LISTO PARA DESPLEGAR EN RAILWAY

## ✅ Todo Configurado

Se crearon estos archivos:
- ✅ `railway.json` - Configuración de Railway
- ✅ `Procfile` - Comando de inicio
- ✅ `deploy-railway.sh` - Script automático
- ✅ `RAILWAY_DEPLOYMENT.md` - Guía completa
- ✅ `package.json` - Scripts corregidos

---

## 🎯 Desplegar AHORA (3 opciones)

### Opción 1: Script Automático (MÁS FÁCIL) ⭐
```bash
./deploy-railway.sh
```
**Hace TODO por ti en 5-10 minutos**

### Opción 2: Comandos Manuales
```bash
# 1. Instalar CLI
npm install -g @railway/cli

# 2. Login (abre navegador)
railway login

# 3. Crear proyecto
railway init

# 4. Configurar variables (Railway las detecta de .env)
railway variables set DATABASE_URL="postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
railway variables set VITE_WHATSAPP_PHONE_NUMBER="51987654321"
railway variables set SESSION_SECRET="your_random_session_secret_change_this_in_production"
railway variables set MASTER_CODE="333"

# 5. Desplegar
railway up

# 6. Abrir tu app
railway open
```

### Opción 3: Desde GitHub (Auto-Deploy)
1. Push a GitHub: `git push origin main`
2. Ve a https://railway.app/dashboard
3. "New Project" → "Deploy from GitHub"
4. Selecciona `cordialperu/Psynet`
5. Configura variables en el dashboard
6. ¡Listo! Auto-deploy en cada push

---

## 🎁 Lo que Obtendrás

Después del deployment:
- ✅ URL pública: `https://psynet-production-XXXX.up.railway.app`
- ✅ HTTPS automático
- ✅ **TODAS tus publicaciones visibles**
- ✅ Base de datos Neon conectada
- ✅ Uptime 24/7
- ✅ Logs en tiempo real
- ✅ $0 costo (plan gratuito)

---

## 📊 Verificar que Funciona

Una vez desplegado:

```bash
# Ver logs
railway logs

# Health check
curl https://tu-app.railway.app/api/health

# Ver terapias (VERÁS TUS DATOS REALES)
curl https://tu-app.railway.app/api/therapies/published?country=MX

# Abrir en navegador
railway open
```

---

## 🆘 Si Algo Sale Mal

Ver logs:
```bash
railway logs
```

O revisa la guía completa: `RAILWAY_DEPLOYMENT.md`

---

## 🎉 ¡Ejecuta el Script Ahora!

```bash
./deploy-railway.sh
```

En 5-10 minutos verás **TODAS tus publicaciones** funcionando en producción. 🚀

---

*Setup completado: 15 octubre 2025*  
*Ready to deploy: ✅*  
*Tiempo estimado: 5-10 minutos*
