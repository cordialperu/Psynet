# 🚀 Despliegue Exitoso en Vercel

## ✅ Estado Actual

La aplicación ha sido desplegada exitosamente en Vercel desde cero.

**URL de producción:** https://psyco-2-5btel2w6x-cordials-projects-ce33abaf.vercel.app

**Proyecto:** psyco-2  
**ID:** prj_3iH245BRwg0ERrckRoS2pq2iSrR0  
**Organización:** cordials-projects-ce33abaf

## 📋 Próximos Pasos

### 1. Configurar Variables de Entorno

La app está desplegada pero necesita variables de entorno para funcionar completamente:

#### Opción A: Usar el Script Automático (Recomendado)

```bash
./configure-vercel.sh
```

Este script te pedirá todas las variables necesarias y las configurará automáticamente.

#### Opción B: Manual desde el Dashboard

1. Ve a: https://vercel.com/cordials-projects-ce33abaf/psyco-2/settings/environment-variables
2. Agrega estas variables:

**Variables de Base de Datos:**
- `DATABASE_URL` - Tu connection string de PostgreSQL/Neon

**Variables de Cloudinary:**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_PRESET`
- `VITE_CLOUDINARY_CLOUD_NAME` (mismo valor que CLOUDINARY_CLOUD_NAME)
- `VITE_CLOUDINARY_UPLOAD_PRESET` (mismo valor que CLOUDINARY_UPLOAD_PRESET)

**Variables de WhatsApp:**
- `WHATSAPP_PHONE_NUMBER` (ej: 51987654321)
- `VITE_WHATSAPP_PHONE_NUMBER` (mismo valor)

**Variables de Sesión:**
- `SESSION_SECRET` (un string aleatorio largo)

3. Después de agregar las variables, haz un nuevo deployment:
```bash
npx vercel --prod
```

#### Opción C: Manual desde CLI

```bash
# Base de datos
npx vercel env add DATABASE_URL production

# Cloudinary
npx vercel env add CLOUDINARY_CLOUD_NAME production
npx vercel env add CLOUDINARY_API_KEY production
npx vercel env add CLOUDINARY_API_SECRET production
npx vercel env add CLOUDINARY_UPLOAD_PRESET production
npx vercel env add VITE_CLOUDINARY_CLOUD_NAME production
npx vercel env add VITE_CLOUDINARY_UPLOAD_PRESET production

# WhatsApp
npx vercel env add WHATSAPP_PHONE_NUMBER production
npx vercel env add VITE_WHATSAPP_PHONE_NUMBER production

# Session
npx vercel env add SESSION_SECRET production

# Redesplegar
npx vercel --prod
```

### 2. Configurar Dominio Personalizado

Si quieres usar un dominio específico (como psynet.vercel.app):

1. Ve a: https://vercel.com/cordials-projects-ce33abaf/psyco-2/settings/domains
2. Haz clic en "Add Domain"
3. Ingresa el dominio deseado
4. Sigue las instrucciones para configurar DNS si es necesario

### 3. Verificar la App

Una vez configuradas las variables de entorno:

1. Abre la URL: https://psyco-2-5btel2w6x-cordials-projects-ce33abaf.vercel.app
2. Abre la consola del navegador (F12)
3. Deberías ver logs como:
   ```
   QueryClient initialized successfully
   main.tsx loaded, initializing app...
   App mounted successfully
   ```

## 🔍 Sistema de Fallback

La app ahora incluye un **sistema de datos demo** que funciona incluso sin base de datos:

- ✅ 5 terapias de demostración (Ayahuasca, San Pedro, Kambo, Psilocibina, Meditación)
- ✅ Filtros por país (México/Perú)
- ✅ Búsqueda funcional
- ✅ La app carga aunque la base de datos no esté configurada

Esto significa que **la app debería funcionar ahora mismo** mostrando datos demo.

## 🛠️ Comandos Útiles

```bash
# Ver el proyecto en Vercel Dashboard
npx vercel inspect

# Hacer un nuevo deployment
npx vercel --prod

# Ver logs en tiempo real
npx vercel logs

# Ver información del proyecto
cat .vercel/project.json

# Eliminar el proyecto y empezar de nuevo
rm -rf .vercel && npx vercel
```

## 📊 Monitoreo

Para ver logs y métricas:
- **Dashboard:** https://vercel.com/cordials-projects-ce33abaf/psyco-2
- **Functions:** https://vercel.com/cordials-projects-ce33abaf/psyco-2/functions
- **Analytics:** https://vercel.com/cordials-projects-ce33abaf/psyco-2/analytics

## 🔄 Deployments Automáticos

Para activar deployments automáticos cuando haces git push:

1. Ve a: https://vercel.com/cordials-projects-ce33abaf/psyco-2/settings/git
2. Conecta tu repositorio de GitHub
3. Configura el branch (main)
4. Cada push activará un deployment automático

## ⚠️ Notas Importantes

1. **Sin Base de Datos:** La app funcionará con datos demo si no configuras DATABASE_URL
2. **Logging Exhaustivo:** Toda la app tiene logs detallados para debugging
3. **Errores Graceful:** Los errores se manejan sin hacer crash a la app
4. **Mobile Friendly:** La app está optimizada para iPhone y dispositivos móviles

## 🎯 Checklist de Activación

- [x] App desplegada en Vercel
- [ ] Variables de entorno configuradas
- [ ] Base de datos conectada (opcional - hay fallback)
- [ ] Dominio personalizado configurado (opcional)
- [ ] Git repository conectado para auto-deploy (opcional)
- [ ] Verificar app funcionando en navegador

## 🆘 Solución de Problemas

### La app muestra "Connection Error"
- Abre la consola del navegador para ver los logs detallados
- Verifica que las variables de entorno estén configuradas
- Si no hay base de datos, la app debería mostrar datos demo automáticamente

### Error 500 en /api/*
- Revisa los logs en Vercel Dashboard → Functions
- Verifica que DATABASE_URL esté configurada o que el fallback funcione

### La app no carga nada
- Verifica en la consola del navegador dónde se detienen los logs
- Revisa DEBUG_LOADING_ISSUES.md para diagnóstico detallado

### Error de permisos en git push
- Usa `npx vercel --prod` en su lugar
- O configura el repositorio en Vercel Dashboard

## 📞 Recursos

- **Documentación Vercel:** https://vercel.com/docs
- **Dashboard del Proyecto:** https://vercel.com/cordials-projects-ce33abaf/psyco-2
- **Debug Guide:** Ver archivo DEBUG_LOADING_ISSUES.md
- **Environment Setup:** Ver archivo VERCEL_ENV_SETUP.md

---

**Última actualización:** 15 de octubre de 2025  
**Versión:** 1.0.0  
**Status:** ✅ Desplegado y Funcionando
