# 🚀 Instrucciones para Desplegar en Render - AHORA

## ✅ Repositorio Listo
Tu código está en: **https://github.com/thissendaniel/psynet-app**

---

## 📋 PASOS EXACTOS (5 minutos)

### 1. Abre Render Dashboard
Ve a: https://dashboard.render.com/

### 2. Conecta GitHub
1. Haz clic en tu foto de perfil (arriba derecha)
2. Settings → "Connect GitHub"
3. Autoriza Render para acceder a tus repositorios

### 3. Crear Nuevo Web Service
1. Haz clic en **"New +"** (botón azul arriba)
2. Selecciona **"Web Service"**
3. Busca y selecciona: **`thissendaniel/psynet-app`**
4. Haz clic en **"Connect"**

### 4. Configuración del Servicio

Completa el formulario con estos valores EXACTOS:

```
Name: psynet-app
Region: Oregon (US West)
Branch: main
Root Directory: (dejar vacío)
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
Plan: Free
```

### 5. Variables de Entorno

Haz clic en **"Advanced"** para expandir las opciones avanzadas.

Luego haz clic en **"Add Environment Variable"** y añade estas 6 variables **una por una**:

#### Variable 1:
```
Key: DATABASE_URL
Value: postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### Variable 2:
```
Key: VITE_WHATSAPP_PHONE_NUMBER
Value: 51987654321
```

#### Variable 3:
```
Key: MASTER_CODE
Value: 333
```

#### Variable 4:
```
Key: NODE_ENV
Value: production
```

#### Variable 5:
```
Key: PORT
Value: 10000
```

#### Variable 6:
```
Key: SESSION_SECRET
Value: psynet_secure_session_secret_2025_random_string
```

### 6. Crear y Desplegar
1. Revisa que todo esté correcto
2. Haz clic en **"Create Web Service"** (botón azul abajo)
3. Render comenzará a construir automáticamente
4. Espera 5-10 minutos ☕

---

## 🔍 Verificación

### Mientras se despliega:
- Verás los logs en tiempo real
- El build debería completarse sin errores
- Busca el mensaje: "Your service is live 🎉"

### Cuando termine:
Tu app estará en: **https://psynet-app.onrender.com** (o similar)

### Verificar que funciona:
1. Abre: `https://psynet-app.onrender.com/api/health`
   - Deberías ver: `{"status":"ok","database":"connected"}`

2. Abre: `https://psynet-app.onrender.com`
   - Deberías ver tu aplicación con TUS publicaciones REALES

---

## ⚠️ Notas Importantes

### Primera Carga
- La primera vez puede tardar 30-50 segundos
- Esto es normal en el plan gratuito
- Después será instantáneo

### Plan Gratuito
- Después de 15 min sin actividad, el servicio "duerme"
- Se despierta automáticamente cuando alguien accede
- Tienes 750 horas/mes (suficiente para 24/7)

### Auto-Deploy
- Cada vez que hagas `git push` a GitHub
- Render desplegará automáticamente
- No necesitas hacer nada más

---

## 🆘 Si Algo Sale Mal

### Error en Build
- Revisa los logs en Render
- Verifica que todas las variables estén configuradas
- Asegúrate de que Build Command sea: `npm install && npm run build`

### Error en Start
- Verifica que Start Command sea: `npm start`
- Revisa que PORT esté configurado como: `10000`

### Base de Datos No Conecta
- Verifica que DATABASE_URL esté correctamente copiado (toda la línea completa)
- No debe tener espacios al inicio o final

---

## ✅ Checklist

Antes de hacer clic en "Create Web Service", verifica:

- [ ] Name: psynet-app
- [ ] Runtime: Node
- [ ] Build Command: npm install && npm run build
- [ ] Start Command: npm start
- [ ] Plan: Free
- [ ] DATABASE_URL configurado
- [ ] VITE_WHATSAPP_PHONE_NUMBER configurado
- [ ] MASTER_CODE configurado
- [ ] NODE_ENV configurado
- [ ] PORT configurado
- [ ] SESSION_SECRET configurado

---

## 🎉 ¡Listo!

Cuando veas "Your service is live 🎉" en Render, tu app estará funcionando con la base de datos real y todas tus publicaciones.

**URL del Repo**: https://github.com/thissendaniel/psynet-app
**Render Dashboard**: https://dashboard.render.com/
