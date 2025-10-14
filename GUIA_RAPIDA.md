# 🚀 Guía Rápida - Activar Mejoras

## ⚡ Instalación Rápida (5 minutos)

### Opción 1: Script Automático
```bash
chmod +x scripts/setup-improvements.sh
./scripts/setup-improvements.sh
```

### Opción 2: Manual

#### 1. Instalar dependencias
```bash
npm install
```

#### 2. Ejecutar migración
```bash
tsx scripts/run-migration.ts
```

#### 3. Activar nuevos archivos
```bash
# Respaldar archivos originales
mv server/index.ts server/index-old.ts
mv server/auth.ts server/auth-old.ts

# Activar nuevos archivos
mv server/index-new.ts server/index.ts
mv server/auth-new.ts server/auth.ts
```

#### 4. Actualizar imports en server/routes.ts
Cambiar línea 4:
```typescript
// Antes:
import { createSession, deleteSession, requireAuth, createMasterSession, requireMasterAuth } from "./auth";

// Después:
import { createSession, deleteSession, requireAuth, createMasterSession, requireMasterAuth } from "./auth-new";
```

#### 5. Integrar i18n en App.tsx
Agregar al inicio del archivo:
```typescript
import './i18n/config';
```

#### 6. Registrar Service Worker
En `client/index.html`, agregar antes de `</body>`:
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

#### 7. Iniciar servidor
```bash
npm run dev
```

---

## 🎯 Funcionalidades Nuevas Disponibles

### Para Usuarios
- ✅ **Favoritos**: Guardar terapias favoritas
- ✅ **Reviews**: Calificar y comentar terapias
- ✅ **Búsqueda avanzada**: Filtros por precio, ubicación, categoría
- ✅ **Paginación**: Carga más rápida de resultados
- ✅ **PWA**: Instalar como app en móvil
- ✅ **Modo offline**: Funciona sin internet
- ✅ **Idiomas**: Español e Inglés

### Para Guías
- ✅ **Dashboard de analytics**: Ver vistas, clicks, conversión
- ✅ **Autoguardado**: No perder trabajo en formularios
- ✅ **Verificación**: Sistema de verificación de identidad
- ✅ **Notificaciones**: (próximamente)

### Para Administradores
- ✅ **Auditoría**: Ver historial de cambios
- ✅ **Logs estructurados**: Mejor debugging
- ✅ **Configuración dinámica**: Cambiar comisión sin código
- ✅ **Soft delete**: Recuperar elementos eliminados
- ✅ **Monitoreo**: Health check endpoint

---

## 🔧 Configuración Opcional

### Google Analytics
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Sentry (Error Tracking)
```env
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### Cambiar Código Master
```env
MASTER_CODE=tu_codigo_secreto_aqui
```

---

## 🧪 Testing

### Unit Tests
```bash
npm run test          # Ejecutar tests
npm run test:ui       # UI interactiva
npm run test:coverage # Ver cobertura
```

### E2E Tests
```bash
npm run test:e2e      # Ejecutar tests E2E
npm run test:e2e:ui   # UI interactiva
```

---

## 📊 Nuevos Endpoints API

### Favoritos
```
POST   /api/favorites/:therapyId     - Agregar favorito
DELETE /api/favorites/:therapyId     - Quitar favorito
GET    /api/favorites                - Listar favoritos
GET    /api/favorites/check/:id      - Verificar si es favorito
```

### Reviews
```
POST   /api/therapies/:id/reviews    - Crear review
GET    /api/therapies/:id/reviews    - Listar reviews
GET    /api/therapies/:id/rating     - Obtener rating promedio
```

### Analytics
```
POST   /api/therapies/:id/view              - Incrementar vistas
POST   /api/therapies/:id/whatsapp-click    - Incrementar clicks
GET    /api/guides/analytics                - Dashboard de guía
```

### Paginación
```
GET /api/therapies/published?page=1&limit=20&sortBy=price&sortOrder=asc
```

Parámetros:
- `page`: número de página (default: 1)
- `limit`: items por página (default: 20)
- `category`: filtrar por categoría
- `minPrice`, `maxPrice`: rango de precios
- `search`: búsqueda de texto
- `sortBy`: price | date | views | rating
- `sortOrder`: asc | desc

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'winston'"
```bash
npm install winston
```

### Error: "Port 5001 already in use"
Cambiar puerto en `.env`:
```env
PORT=5002
```

### Error en migración
```bash
# Verificar conexión a base de datos
echo $DATABASE_URL

# Ejecutar migración manualmente
psql $DATABASE_URL < migrations/0001_add_sessions_favorites_reviews.sql
```

### Service Worker no se registra
Verificar que el archivo existe:
```bash
ls -la client/public/sw.js
```

### Tests fallan
```bash
# Reinstalar dependencias de testing
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom
```

---

## 📈 Monitoreo

### Health Check
```bash
curl http://localhost:5001/health
```

Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2025-10-06T05:46:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### Ver Logs
```bash
# Logs combinados
tail -f logs/combined.log

# Solo errores
tail -f logs/error.log

# Excepciones
tail -f logs/exceptions.log
```

---

## 🔐 Seguridad

### Cambios Importantes

1. **Sesiones persistentes**: Ya no se pierden al reiniciar
2. **Contraseñas seguras**: Requisitos mínimos aplicados
3. **Rate limiting**: Protección contra ataques
4. **Cookies httpOnly**: Protección contra XSS
5. **Helmet.js**: Headers de seguridad

### Recomendaciones

- ✅ Cambiar `MASTER_CODE` en producción
- ✅ Usar HTTPS en producción
- ✅ Configurar `SESSION_SECRET` único
- ✅ Habilitar Sentry para monitoreo
- ✅ Revisar logs regularmente

---

## 📱 PWA

### Verificar Instalación
1. Abrir app en Chrome/Edge
2. Ver ícono de instalación en barra de direcciones
3. Instalar como app
4. Probar modo offline

### Crear Iconos
Necesitas crear dos iconos:
- `client/public/icon-192.png` (192x192px)
- `client/public/icon-512.png` (512x512px)

Herramientas recomendadas:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/

---

## 🎨 Componentes Nuevos

### LoadingButton
```tsx
import { LoadingButton } from '@/components/ui/loading-button';

<LoadingButton 
  loading={isLoading} 
  loadingText="Guardando..."
>
  Guardar
</LoadingButton>
```

### ConfirmDialog
```tsx
import { ConfirmDialog } from '@/components/confirm-dialog';

<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  onConfirm={handleDelete}
  title="¿Eliminar terapia?"
  description="Esta acción no se puede deshacer"
  variant="destructive"
/>
```

### FavoriteButton
```tsx
import { FavoriteButton } from '@/components/favorite-button';

<FavoriteButton therapyId={therapy.id} />
```

### ReviewsSection
```tsx
import { ReviewsSection } from '@/components/reviews-section';

<ReviewsSection therapyId={therapy.id} />
```

### Breadcrumbs
```tsx
import { Breadcrumbs } from '@/components/breadcrumbs';

<Breadcrumbs items={[
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Terapias', href: '/admin/therapies' },
  { label: 'Editar' }
]} />
```

### LanguageSelector
```tsx
import { LanguageSelector } from '@/components/language-selector';

<LanguageSelector />
```

---

## 🎣 Hooks Nuevos

### useAnalytics
```tsx
import { useAnalytics } from '@/hooks/use-analytics';

const { trackTherapyView, trackWhatsAppClick } = useAnalytics();

// Trackear vista
trackTherapyView(therapy.id, therapy.title);

// Trackear click en WhatsApp
trackWhatsAppClick(therapy.id, therapy.title);
```

### useAutoSave
```tsx
import { useAutoSave } from '@/hooks/use-auto-save';

const { hasSavedData, restoreSaved, clearSaved } = useAutoSave({
  key: 'therapy-form',
  data: formData,
  interval: 30000, // 30 segundos
});

// Al cargar el componente
useEffect(() => {
  if (hasSavedData()) {
    const saved = restoreSaved();
    if (saved) {
      setFormData(saved);
    }
  }
}, []);

// Al enviar exitosamente
const handleSubmit = async () => {
  await saveTherapy();
  clearSaved(); // Limpiar borrador
};
```

---

## 🌐 Internacionalización

### Usar traducciones
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('common.loading')}</p>
    </div>
  );
}
```

### Cambiar idioma
```tsx
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
i18n.changeLanguage('en'); // o 'es'
```

---

## ✅ Checklist de Activación

- [ ] Dependencias instaladas
- [ ] Migración ejecutada
- [ ] Archivos reemplazados
- [ ] Imports actualizados
- [ ] i18n integrado
- [ ] Service Worker registrado
- [ ] Variables de entorno configuradas
- [ ] Iconos PWA creados
- [ ] Tests ejecutados
- [ ] Servidor iniciado correctamente
- [ ] Health check funciona
- [ ] Logs se generan correctamente

---

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs en `logs/error.log`
2. Verificar variables de entorno
3. Consultar `MEJORAS_IMPLEMENTADAS.md`
4. Revisar código de ejemplo en componentes

---

**¡Listo para usar todas las mejoras!** 🎉
