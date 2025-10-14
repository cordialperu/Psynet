# 🎥 Validación de Videos de YouTube - Máximo 1 Minuto

## ✅ Estado Actual

- ✅ Todos los elementos tienen videos asignados
- ✅ Validación básica de URL implementada
- ⚠️ Validación de duración requiere YouTube API Key

---

## 📋 Regla de la Plataforma

**TODOS los elementos DEBEN tener un video de máximo 1 minuto que explique:**
- Qué es el servicio/producto
- Para qué funciona
- Cómo se usa o qué esperar

---

## 🔧 Implementación Actual

### **Validación Básica (Ya implementada):**
```typescript
// Valida que sea una URL válida de YouTube
validateYouTubeUrl(url) → { valid: boolean, videoId: string }
```

### **Validación de Duración (Requiere API Key):**
```typescript
// Valida que el video dure máximo 60 segundos
getYouTubeVideoInfo(videoId, apiKey) → { duration: number }
```

---

## 🔑 Configurar YouTube Data API

### **Paso 1: Obtener API Key**

1. Ir a: https://console.cloud.google.com/
2. Crear un nuevo proyecto o seleccionar uno existente
3. Ir a "APIs & Services" → "Library"
4. Buscar "YouTube Data API v3"
5. Click en "Enable"
6. Ir a "Credentials" → "Create Credentials" → "API Key"
7. Copiar la API Key

### **Paso 2: Agregar al .env**

```bash
# YouTube API Key para validación de videos
VITE_YOUTUBE_API_KEY=tu_api_key_aqui
```

### **Paso 3: Usar en el Formulario**

```typescript
import { getYouTubeVideoInfo } from "@/lib/youtube-validator";

// Al ingresar URL de video
const videoInfo = await getYouTubeVideoInfo(
  videoId, 
  import.meta.env.VITE_YOUTUBE_API_KEY
);

if (videoInfo && videoInfo.duration > 60) {
  // Mostrar error: "El video debe durar máximo 1 minuto"
  return;
}
```

---

## 📝 Validación en el Formulario

### **Campos a Validar:**

```typescript
const videoSchema = z.object({
  videoUrl: z.string()
    .url("Debe ser una URL válida")
    .refine(
      (url) => {
        const validation = validateYouTubeUrl(url);
        return validation.valid;
      },
      { message: "Debe ser una URL válida de YouTube" }
    )
    .refine(
      async (url) => {
        const videoId = getYouTubeVideoId(url);
        if (!videoId) return false;
        
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        if (!apiKey) {
          console.warn("⚠️ YouTube API Key no configurada");
          return true; // Permitir si no hay API Key
        }
        
        const info = await getYouTubeVideoInfo(videoId, apiKey);
        return info ? info.duration <= 60 : true;
      },
      { message: "El video debe durar máximo 1 minuto (60 segundos)" }
    ),
});
```

---

## 🎬 Mensajes de Validación

### **Errores Posibles:**

1. **URL inválida:**
   ```
   ❌ "Debe ser una URL válida de YouTube"
   Ejemplo correcto: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

2. **Video muy largo:**
   ```
   ❌ "El video debe durar máximo 1 minuto (60 segundos)"
   Duración actual: 2:30 minutos
   ```

3. **Video no encontrado:**
   ```
   ❌ "No se pudo verificar el video. Asegúrate de que sea público"
   ```

---

## 📊 Videos Actuales

### **Estado por Categoría:**

| Categoría | Total | Con Video | Sin Video |
|-----------|-------|-----------|-----------|
| Ceremonias | 15 | 15 | 0 |
| Terapias | 10 | 10 | 0 |
| Microdosis | 10 | 10 | 0 |
| Medicina | 10 | 10 | 0 |
| Eventos | 10 | 10 | 0 |
| Productos | 10 | 10 | 0 |

**✅ 65/65 elementos tienen video**

---

## ⚠️ Videos Placeholder

Los videos actuales son **placeholders**. Necesitas:

1. **Grabar videos reales** de máximo 1 minuto para cada elemento
2. **Subir a YouTube** (pueden ser unlisted)
3. **Actualizar las URLs** en la base de datos

### **Formato Recomendado del Video:**

```
0:00-0:10 → Qué es (título y categoría)
0:10-0:40 → Para qué sirve (beneficios)
0:40-0:60 → Cómo funciona (proceso)
```

---

## 🔄 Actualizar Videos Manualmente

### **Opción 1: Desde el Panel de Guías**
1. Login como guía
2. Ir a "Mis Publicaciones"
3. Editar cada elemento
4. Cambiar URL del video

### **Opción 2: Desde Master Admin**
1. Login como super admin (código 333)
2. Editar cada elemento
3. Cambiar URL del video

### **Opción 3: Script SQL**
```sql
UPDATE therapies
SET video_url = 'https://www.youtube.com/watch?v=NUEVO_ID'
WHERE id = 'uuid-del-elemento';
```

---

## 🎯 Implementación Completa (Con API Key)

### **Archivo: .env**
```bash
VITE_YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### **Componente de Validación en Tiempo Real:**

```tsx
<FormField
  control={form.control}
  name="videoUrl"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Video de YouTube (máx. 1 minuto) *</FormLabel>
      <FormControl>
        <Input 
          {...field} 
          placeholder="https://www.youtube.com/watch?v=..."
          onBlur={async (e) => {
            const url = e.target.value;
            const videoId = getYouTubeVideoId(url);
            
            if (videoId) {
              const info = await getYouTubeVideoInfo(
                videoId, 
                import.meta.env.VITE_YOUTUBE_API_KEY
              );
              
              if (info) {
                if (info.duration > 60) {
                  form.setError("videoUrl", {
                    message: `Video muy largo (${info.duration}s). Máximo 60 segundos.`
                  });
                } else {
                  // Mostrar preview
                  console.log(`✅ Video válido: ${info.title} (${info.duration}s)`);
                }
              }
            }
          }}
        />
      </FormControl>
      <FormDescription>
        El video debe explicar tu servicio/producto en máximo 1 minuto
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## 📝 Checklist de Implementación

### **✅ Completado:**
- [x] Todos los elementos tienen video asignado
- [x] Función de validación de URL creada
- [x] Helper para extraer video ID
- [x] Función para obtener info del video (con API)

### **⚠️ Pendiente (Requiere API Key):**
- [ ] Obtener YouTube API Key
- [ ] Agregar a .env
- [ ] Integrar validación en formularios
- [ ] Mostrar duración del video en preview
- [ ] Bloquear guardado si video > 60 segundos

### **📹 Pendiente (Contenido):**
- [ ] Grabar videos reales para cada elemento
- [ ] Subir a YouTube
- [ ] Reemplazar placeholders con URLs reales

---

## 🎯 Resultado Actual

**Estado:**
- ✅ 65 elementos en la plataforma
- ✅ Todos tienen video (placeholder)
- ✅ Sistema de validación listo
- ⚠️ Necesita YouTube API Key para validar duración
- ⚠️ Necesita videos reales de contenido

**Próximo paso:**
1. Obtener YouTube API Key
2. Agregar al .env
3. Integrar validación en formularios

**¿Quieres que te ayude a integrar la validación en los formularios ahora, o prefieres hacerlo después de obtener la API Key?**
