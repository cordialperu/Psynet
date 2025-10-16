# 🚀 CONFIGURAR RENDER - PASO FINAL

## ✅ VERIFICADO: Tu base de datos tiene 74 terapias

Probamos la conexión y funciona perfectamente:
- ✅ Retiro de Bufo Alvarius (5-MeO-DMT)
- ✅ Dieta Amazónica con Plantas Maestras
- ✅ Downtown Ayahuasca Therapy
- ✅ Y 71 terapias más...

## 🎯 AHORA CONFIGURA RENDER

### Opción 1: Manual (5 minutos)

1. **Ve a Render Dashboard**: https://dashboard.render.com
2. **Selecciona tu servicio**: `psynet`
3. **Click en "Environment"** (menú izquierdo)
4. **Click "Add Environment Variable"**
5. **Agrega esta variable**:
   ```
   Key: DATABASE_URL
   Value: postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
6. **Click "Save Changes"**
7. **Click "Manual Deploy" → "Deploy latest commit"**
8. **Espera 2-3 minutos**

### Opción 2: Usando Render CLI (Más rápido)

Si tienes instalado el CLI de Render, corre:

```bash
render env set DATABASE_URL="postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" --service psynet
render deploy --service psynet
```

## 🔍 VERIFICAR QUE TODO FUNCIONE

Después del deploy:

1. **Health Check**: https://psynet.onrender.com/api/health
   - Deberías ver: `"database": "connected"`
   - Deberías ver: `"therapyCount": 74`

2. **App Principal**: https://psynet.onrender.com
   - Deberías ver tus 74 terapias reales
   - NO los 5 eventos de demostración

## 📊 TUS DATOS

Terapias encontradas en la base de datos:
- Total: **74 terapias**
- Países: Perú (PE)
- Categorías: ceremonias, terapias

Ejemplos:
- Retiro de Bufo Alvarius (5-MeO-DMT)
- Dieta Amazónica con Plantas Maestras
- Downtown Ayahuasca Therapy
- Ceremonia de Kambo - Medicina de la Rana
- Retiro de Rapé y Sananga

## ⚠️ IMPORTANTE

La URL de conexión DEBE incluir:
- ✅ `.c-2` en el host (ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech)
- ✅ `sslmode=require`
- ✅ `channel_binding=require`

Sin estos parámetros, la conexión fallará.

## 🎉 DESPUÉS DEL DEPLOY

Una vez que termine el deploy:
1. Abre https://psynet.onrender.com
2. Deberías ver todas tus 74 terapias
3. ¡Listo! Tu app está en producción con todos los datos

---

**Última actualización**: 15 de octubre de 2025
**Estado**: Base de datos verificada ✅
**Acción requerida**: Agregar DATABASE_URL a Render
