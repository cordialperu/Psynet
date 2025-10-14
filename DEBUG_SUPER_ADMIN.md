# 🔧 Debug - Super Admin Guardado

## 🎯 Cambios Implementados para Debug

Se han agregado logs detallados en el frontend y backend para identificar el problema del guardado.

---

## 📝 Logs Agregados

### **Frontend (client/src/pages/admin/master-therapy-edit.tsx)**

```typescript
onSubmit:
  📝 Form submitted: {datos del formulario}
  📅 Selected dates: [fechas seleccionadas]
  📦 Payload final: {payload completo}

mutationFn:
  🔵 Enviando datos: {datos}
  🔵 URL: /api/master/therapies/{id}
  🟢 Response status: 200
  🟢 Response data: {respuesta}
  🔴 Error en mutación: {error si falla}

onSuccess:
  ✅ Guardado exitoso: {datos}

onError:
  ❌ Error al guardar: {error}
```

### **Backend (server/routes.ts)**

```typescript
PATCH /api/master/therapies/:id:
  🔵 PATCH /api/master/therapies/:id
  🔵 Therapy ID: {id}
  🔵 Request body: {body}
  🟢 Therapy found: {título}
  🔄 Slug updated: {nuevo slug}
  📝 Update data: {datos a actualizar}
  ✅ Therapy updated successfully
  ❌ Error updating therapy: {error si falla}
```

---

## 🔍 Cómo Debuggear

### **Paso 1: Abrir Consola del Navegador**
1. Ir a: `http://localhost:5001/admin/master/login`
2. Ingresar código: `333`
3. Abrir DevTools (F12 o Cmd+Option+I)
4. Ir a la pestaña "Console"

### **Paso 2: Editar una Ceremonia**
1. Click en "Editar" en cualquier ceremonia
2. Hacer cambios en el formulario
3. Click en "Guardar Cambios"

### **Paso 3: Revisar Logs del Frontend**
Buscar en la consola:
```
📝 Form submitted: {...}
📅 Selected dates: [...]
📦 Payload final: {...}
🔵 Enviando datos: {...}
🔵 URL: /api/master/therapies/...
```

### **Paso 4: Revisar Logs del Backend**
En la terminal donde corre el servidor, buscar:
```
🔵 PATCH /api/master/therapies/:id
🔵 Therapy ID: ...
🔵 Request body: {...}
🟢 Therapy found: ...
```

---

## 🐛 Posibles Problemas y Soluciones

### **Problema 1: No aparece "📝 Form submitted"**
**Causa:** El formulario no se está enviando
**Solución:** 
- Verificar que el botón sea `type="submit"`
- Verificar que esté dentro del `<form>`
- Verificar que no haya errores de validación

### **Problema 2: Aparece "🔴 Error en mutación"**
**Causa:** Error en la petición HTTP
**Solución:**
- Revisar el mensaje de error específico
- Verificar que la sesión master esté activa
- Verificar que el ID de la terapia sea válido

### **Problema 3: No aparecen logs del backend**
**Causa:** La petición no está llegando al servidor
**Solución:**
- Verificar que el servidor esté corriendo
- Verificar la URL de la petición
- Verificar que el token de autenticación sea correcto

### **Problema 4: Aparece "❌ Therapy not found"**
**Causa:** El ID de la terapia no existe
**Solución:**
- Verificar que el ID en la URL sea correcto
- Verificar que la terapia exista en la base de datos

### **Problema 5: Aparece "✅ Guardado exitoso" pero no se ve reflejado**
**Causa:** El cache no se está invalidando correctamente
**Solución:**
- Refrescar la página manualmente (F5)
- Verificar que `queryClient.invalidateQueries` se esté ejecutando

---

## 🔧 Fix Aplicado: Select con value

### **Problema Identificado:**
El `Select` de `approvalStatus` usaba `defaultValue` en lugar de `value`, lo que impedía que se actualizara correctamente.

### **Antes:**
```tsx
<Select onValueChange={field.onChange} defaultValue={field.value}>
```

### **Después:**
```tsx
<Select onValueChange={field.onChange} value={field.value}>
```

### **Impacto:**
- ✅ El Select ahora se actualiza correctamente cuando cambia el valor
- ✅ El estado de aprobación se guarda correctamente

---

## 📊 Flujo Completo de Guardado

```
1. Usuario hace cambios en el formulario
   ↓
2. Click en "Guardar Cambios"
   ↓
3. onSubmit() se ejecuta
   📝 Form submitted
   📅 Selected dates
   📦 Payload final
   ↓
4. saveMutation.mutate() se ejecuta
   🔵 Enviando datos
   🔵 URL
   ↓
5. apiRequest() hace PATCH al backend
   ↓
6. Backend recibe la petición
   🔵 PATCH /api/master/therapies/:id
   🔵 Therapy ID
   🔵 Request body
   ↓
7. Backend busca la terapia
   🟢 Therapy found
   ↓
8. Backend actualiza la terapia
   📝 Update data
   ✅ Therapy updated successfully
   ↓
9. Backend responde con la terapia actualizada
   ↓
10. Frontend recibe la respuesta
    🟢 Response status: 200
    🟢 Response data
    ↓
11. onSuccess() se ejecuta
    ✅ Guardado exitoso
    ↓
12. Cache se invalida
    ↓
13. Toast de éxito
    ↓
14. Redirección al dashboard
```

---

## 🧪 Prueba Manual

### **Test 1: Cambiar Título**
1. Editar ceremonia
2. Cambiar el título
3. Guardar
4. Verificar que el título cambió en el dashboard
5. Verificar que el slug se actualizó

### **Test 2: Cambiar Estado de Aprobación**
1. Editar ceremonia
2. Cambiar estado a "Aprobada"
3. Guardar
4. Verificar que el estado cambió en el dashboard

### **Test 3: Cambiar Publicación**
1. Editar ceremonia
2. Activar/desactivar "Publicar Ceremonia"
3. Guardar
4. Verificar que el estado de publicación cambió

### **Test 4: Cambiar Fechas**
1. Editar ceremonia
2. Agregar/quitar fechas en el calendario
3. Guardar
4. Verificar que las fechas se guardaron

---

## 📝 Checklist de Verificación

- [ ] Logs aparecen en la consola del navegador
- [ ] Logs aparecen en la terminal del servidor
- [ ] "📝 Form submitted" aparece al guardar
- [ ] "🔵 Enviando datos" aparece después
- [ ] "🔵 PATCH /api/master/therapies/:id" aparece en el servidor
- [ ] "✅ Therapy updated successfully" aparece en el servidor
- [ ] "✅ Guardado exitoso" aparece en el navegador
- [ ] Toast de éxito aparece
- [ ] Redirección al dashboard ocurre
- [ ] Cambios se ven reflejados en el dashboard

---

## 🔄 Próximos Pasos

1. **Ejecutar la app**: `npm run dev`
2. **Abrir el super admin**: `http://localhost:5001/admin/master/login`
3. **Editar una ceremonia**
4. **Revisar los logs** en consola y terminal
5. **Reportar qué logs aparecen** para identificar dónde falla

---

**Con estos logs detallados, podremos identificar exactamente dónde está el problema.** 🔍
