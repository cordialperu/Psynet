# ✅ Checklist de Activación - Mejoras Psynet

## 📋 Pre-requisitos
- [ ] Node.js instalado (v18+)
- [ ] PostgreSQL corriendo
- [ ] DATABASE_URL configurada en .env
- [ ] Acceso a terminal

---

## 🚀 Fase 1: Instalación (10 minutos)

### Opción A: Automática (Recomendada)
```bash
chmod +x scripts/setup-improvements.sh
./scripts/setup-improvements.sh
```

- [ ] Script ejecutado sin errores
- [ ] Dependencias instaladas
- [ ] Migración completada
- [ ] Directorio `logs/` creado

### Opción B: Manual
```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar migración
tsx scripts/run-migration.ts

# 3. Crear directorio de logs
mkdir -p logs
```

- [ ] Comando 1 completado
- [ ] Comando 2 completado
- [ ] Comando 3 completado

---

## 🔧 Fase 2: Configuración (10 minutos)

### 1. Activar Nuevos Archivos
```bash
# Respaldar originales
mv server/index.ts server/index-old.ts
mv server/auth.ts server/auth-old.ts

# Activar nuevos
mv server/index-new.ts server/index.ts
mv server/auth-new.ts server/auth.ts
```

- [ ] Archivos respaldados
- [ ] Nuevos archivos activados

### 2. Actualizar Imports
Editar `server/routes.ts`, línea 4:

**Antes:**
```typescript
import { createSession, deleteSession, requireAuth, createMasterSession, requireMasterAuth } from "./auth";
```

**Después:**
```typescript
import { createSession, deleteSession, requireAuth, createMasterSession, requireMasterAuth } from "./auth-new";
```

- [ ] Import actualizado en routes.ts

### 3. Integrar i18n
Editar `client/src/App.tsx`, agregar al inicio:
```typescript
import './i18n/config';
```

- [ ] i18n importado en App.tsx

### 4. Registrar Service Worker
Editar `client/index.html`, agregar antes de `</body>`:
```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
</script>
<link rel="manifest" href="/manifest.json">
```

- [ ] Service Worker registrado
- [ ] Manifest linkeado

---

## 🎨 Fase 3: Assets (5 minutos)

### Crear Iconos PWA
Necesitas crear dos archivos:
- `client/public/icon-192.png` (192x192px)
- `client/public/icon-512.png` (512x512px)

Herramientas recomendadas:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/

- [ ] icon-192.png creado
- [ ] icon-512.png creado

---

## 🔐 Fase 4: Variables de Entorno (5 minutos)

### Obligatorias (Ya configuradas)
- [x] DATABASE_URL
- [x] PORT
- [x] NODE_ENV

### Opcionales (Configurar ahora o después)

#### Google Analytics (Recomendado)
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
- [ ] GA configurado (o marcado como "después")

#### Sentry Error Tracking (Recomendado)
```env
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```
- [ ] Sentry configurado (o marcado como "después")

#### Cambiar Código Master (Crítico para producción)
```env
MASTER_CODE=tu_codigo_secreto_aqui
```
- [ ] Código master cambiado (si es producción)

---

## 🧪 Fase 5: Verificación (5 minutos)

### 1. Iniciar Servidor
```bash
npm run dev
```

- [ ] Servidor inicia sin errores
- [ ] Puerto 5001 (o configurado) accesible

### 2. Health Check
```bash
curl http://localhost:5001/health
```

Debe retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...,
  "environment": "development"
}
```

- [ ] Health check responde OK

### 3. Verificar Base de Datos
Abrir http://localhost:5001 y verificar:
- [ ] Terapias se cargan correctamente
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en terminal del servidor

### 4. Verificar Logs
```bash
ls -la logs/
```

Debe mostrar:
- combined.log
- error.log
- exceptions.log

- [ ] Archivos de log se crean

### 5. Ejecutar Tests (Opcional pero recomendado)
```bash
# Unit tests
npm run test

# E2E tests (requiere Playwright instalado)
npm run test:e2e
```

- [ ] Tests unitarios pasan
- [ ] Tests E2E pasan (o marcado como "después")

---

## 🎯 Fase 6: Pruebas Funcionales (10 minutos)

### Probar Nuevas Funcionalidades

#### 1. Sistema de Favoritos
- [ ] Click en botón de corazón en una terapia
- [ ] Verificar que se marca como favorito
- [ ] Recargar página y verificar que persiste

#### 2. Sistema de Reviews
- [ ] Ir a detalle de una terapia
- [ ] Scroll hasta sección de reviews
- [ ] Dejar una calificación y comentario
- [ ] Verificar que aparece en la lista

#### 3. Búsqueda Avanzada
- [ ] Usar filtros de categoría
- [ ] Filtrar por rango de precios
- [ ] Buscar por texto
- [ ] Verificar paginación (si hay >20 resultados)

#### 4. PWA
- [ ] Abrir en Chrome/Edge
- [ ] Verificar ícono de instalación en barra
- [ ] Instalar como app
- [ ] Probar modo offline (desconectar internet)

#### 5. Idiomas
- [ ] Click en selector de idioma (ícono de globo)
- [ ] Cambiar a inglés
- [ ] Verificar que textos cambian
- [ ] Recargar y verificar que persiste

#### 6. Autoguardado
- [ ] Ir a crear nueva terapia
- [ ] Llenar algunos campos
- [ ] Cerrar pestaña sin guardar
- [ ] Volver a abrir formulario
- [ ] Verificar que se recupera el borrador

---

## 📊 Fase 7: Monitoreo (Continuo)

### Verificar Logs Regularmente
```bash
# Ver logs en tiempo real
tail -f logs/combined.log

# Ver solo errores
tail -f logs/error.log
```

- [ ] Comando de monitoreo guardado

### Configurar Alertas (Opcional)
Si configuraste Sentry:
- [ ] Verificar que errores llegan a Sentry
- [ ] Configurar alertas por email

---

## 🎉 Completado

### Resumen Final
- [ ] Todas las fases completadas
- [ ] Servidor corriendo sin errores
- [ ] Funcionalidades nuevas probadas
- [ ] Logs generándose correctamente
- [ ] Documentación revisada

### Próximos Pasos
1. [ ] Revisar `MEJORAS_IMPLEMENTADAS.md` para detalles técnicos
2. [ ] Revisar `GUIA_RAPIDA.md` para referencia rápida
3. [ ] Configurar backups de base de datos
4. [ ] Planear deployment a producción

---

## 🆘 Si Algo Falla

### Errores Comunes

#### "Cannot find module 'winston'"
```bash
npm install winston express-rate-limit compression helmet
```

#### "Port already in use"
Cambiar puerto en `.env`:
```env
PORT=5002
```

#### "Migration failed"
```bash
# Verificar conexión
echo $DATABASE_URL

# Ejecutar manualmente
psql $DATABASE_URL < migrations/0001_add_sessions_favorites_reviews.sql
```

#### "Service Worker not registering"
```bash
# Verificar archivo existe
ls -la client/public/sw.js

# Verificar en DevTools > Application > Service Workers
```

### Rollback (Si es necesario)
```bash
# Restaurar archivos originales
mv server/index-old.ts server/index.ts
mv server/auth-old.ts server/auth.ts

# Revertir migración (si es necesario)
# Contactar soporte para script de rollback
```

---

## 📞 Recursos

- 📖 Documentación completa: `MEJORAS_IMPLEMENTADAS.md`
- ⚡ Guía rápida: `GUIA_RAPIDA.md`
- 📊 Resumen ejecutivo: `RESUMEN_EJECUTIVO.md`
- 🔧 Script de instalación: `scripts/setup-improvements.sh`

---

**Tiempo estimado total: 25-45 minutos**

**¡Éxito en la activación!** 🚀
