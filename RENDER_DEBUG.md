# Guía de Depuración para Render

## Problema: Servicio no inicia después de "Service waking up"

### Pasos para verificar:

1. **Ver los logs del servidor**:
   - Dashboard de Render → Selecciona tu servicio "psynet"
   - Haz clic en "Logs" en el menú superior
   - Busca mensajes de error en rojo

2. **Verificar variables de entorno**:
   - Dashboard de Render → Selecciona tu servicio "psynet"
   - Haz clic en "Environment" en el menú lateral
   - Verifica que estén configuradas:
     - `DATABASE_URL` = `postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-a652308v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`
     - `NODE_ENV` = `production`
     - `PORT` = `10000`
     - `VITE_WHATSAPP_PHONE_NUMBER` = `51987654321`
     - `MASTER_CODE` = `333`
     - `SESSION_SECRET` = (generado automáticamente)

3. **Errores comunes**:
   - ❌ `Cannot find module`: Falta instalar dependencias
   - ❌ `EADDRINUSE`: Puerto ya en uso (raro en Render)
   - ❌ `Connection timeout`: Problema con la base de datos
   - ❌ `Build failed`: Error al compilar el código

4. **Solución rápida si no funciona**:
   ```bash
   # En tu terminal local:
   cd /Users/m2dt/Downloads/psyco-2
   
   # Forzar un nuevo despliegue
   git commit --allow-empty -m "Trigger Render redeploy"
   git push origin main
   ```

5. **Verificar que el build funcionó**:
   - En los logs debe aparecer:
     ```
     ✓ Server built successfully
     ```
   - Y luego:
     ```
     serving on port 10000
     ```

## Si sigue sin funcionar:

Necesito que copies **TODO el contenido de la pestaña "Logs"** desde el inicio del build hasta el error.
