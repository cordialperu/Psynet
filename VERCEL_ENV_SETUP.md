# Configuración de Variables de Entorno en Vercel

## ⚠️ IMPORTANTE: Configurar Variables de Entorno

Para que la aplicación funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno:

### Método 1: Desde el Dashboard de Vercel (Recomendado)

1. Ve a https://vercel.com/cordials-projects-ce33abaf/psynet/settings/environment-variables
2. Agrega las siguientes variables para **Production**:

```
DATABASE_URL=postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET=<genera_un_secreto_aleatorio_seguro>
MASTER_CODE=333
VITE_WHATSAPP_PHONE_NUMBER=51987654321
NODE_ENV=production
```

### Método 2: Usando Vercel CLI

```bash
# Desde la terminal, ejecuta:
vercel env pull .env.production
# Luego edita el archivo y ejecuta:
vercel env add
```

### Variables Opcionales

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
SENTRY_DSN=
VITE_GA_MEASUREMENT_ID=
LOG_LEVEL=info
```

## Después de Configurar

1. Las variables se aplicarán automáticamente en el próximo despliegue
2. O puedes forzar un redespliegue con: `vercel --prod`

## URLs de la Aplicación

- **Principal**: https://psynet.vercel.app
- **Alternativa 1**: https://psynet-cordials-projects-ce33abaf.vercel.app
- **Alternativa 2**: https://psynet-cordialperu-7818-cordials-projects-ce33abaf.vercel.app

## Verificar el Estado

```bash
vercel env ls
vercel inspect https://psynet.vercel.app
```
