# 🐛 iPhone Crash Debugging

## Problema Actual
La app carga por 1 segundo, luego se resetea y cuelga en iPhone.

---

## ✅ Optimizaciones Implementadas

### **1. Error Boundaries**
- Try-catch en funciones de swipe
- Try-catch en scroll de navbar
- Finally block para siempre resetear estado

### **2. Performance Optimizations**
- `requestAnimationFrame` en vez de `setTimeout` para animaciones
- `cancelAnimationFrame` en cleanup
- Network mode: 'online' para evitar requests offline

### **3. Query Client Hardening**
```typescript
{
  retry: 1,                    // Solo 1 reintento
  retryDelay: 1000,           // 1 segundo
  refetchOnWindowFocus: false, // No refetch al cambiar tab
  refetchOnReconnect: false,   // No refetch al reconectar
  networkMode: 'online',       // Solo cuando hay internet
  staleTime: 60000,           // Cache 1 minuto
  gcTime: 300000,             // Mantener 5 minutos
}
```

### **4. Fetch Timeout**
- 10 segundos máximo por request
- AbortController para cancelar
- Error handling con mensaje claro

### **5. Database Timeout**
- 8 segundos máximo por query
- Promise.race para timeout
- Fallback a error en vez de hang

---

## 🔍 Cómo Debuggear en iPhone

### **Opción 1: Safari Web Inspector**

1. En iPhone: Settings → Safari → Advanced → Web Inspector (ON)
2. Conecta iPhone a Mac con cable
3. En Mac: Safari → Develop → [Tu iPhone] → [La página]
4. Verás la consola con errores

### **Opción 2: Console Logs**

Agrega esto temporalmente en `home-apple-v3.tsx`:

```typescript
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounted');
}, []);

useEffect(() => {
  console.log('Therapies loaded:', therapies.length);
}, [therapies]);
```

### **Opción 3: Error Boundary**

Crea un error boundary para capturar crashes:

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('App crashed:', error, errorInfo);
    alert('App crashed: ' + error.message);
  }
  
  render() {
    return this.props.children;
  }
}
```

---

## 🎯 Posibles Causas del Crash

### **1. Loop Infinito en useEffect**
- ✅ **FIXED**: Agregado cleanup con cancelAnimationFrame
- ✅ **FIXED**: Dependencias correctas en useEffect

### **2. Memory Leak**
- ✅ **FIXED**: Cleanup de timers y RAF
- ✅ **FIXED**: Reset de refs en finally block

### **3. Fetch Hanging**
- ✅ **FIXED**: Timeout de 10 segundos
- ✅ **FIXED**: AbortController

### **4. Database Timeout**
- ✅ **FIXED**: Timeout de 8 segundos
- ✅ **FIXED**: Promise.race

### **5. localStorage Issues**
- ✅ **FIXED**: Movido a useEffect (no en render)
- ✅ **FIXED**: Try-catch en accesos

---

## 📱 Instrucciones para Probar

### **Desde tu iPhone:**

1. **Asegúrate de estar en la misma WiFi que tu Mac**

2. **Abre Safari (no Chrome)**

3. **Accede a:**
   ```
   http://192.168.1.49:5001
   ```

4. **Si se cuelga:**
   - Conecta iPhone a Mac con cable
   - Abre Safari en Mac
   - Develop → [Tu iPhone] → Inspeccionar
   - Ve los errores en la consola

5. **Si no carga:**
   - Verifica que el servidor esté corriendo
   - Verifica que estés en la misma WiFi
   - Prueba desactivar el firewall de Mac temporalmente

---

## 🔧 Comandos Útiles

### **Ver IP y estado del servidor:**
```bash
echo "📱 Accede desde iPhone:"
echo "http://$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1):5001"
echo ""
lsof -i :5001 | grep LISTEN
```

### **Ver logs en tiempo real:**
```bash
tail -f /tmp/psyco-dev.log
```

### **Reiniciar servidor:**
```bash
pkill -9 -f tsx
npm run dev > /tmp/psyco-dev.log 2>&1 &
```

---

## ✅ Cambios Realizados para Estabilidad

1. ✅ Eliminado console.log de debug en App.tsx
2. ✅ Try-catch en todas las funciones de touch
3. ✅ requestAnimationFrame para animaciones suaves
4. ✅ Cleanup apropiado de timers y RAF
5. ✅ Finally block para siempre resetear estado
6. ✅ localStorage movido a useEffect
7. ✅ Network mode: 'online'
8. ✅ Timeouts en fetch y DB

---

## 🚀 Próximos Pasos

Si sigue sin funcionar después de estos cambios:

1. **Conecta iPhone a Mac** y usa Safari Web Inspector
2. **Ve los errores** en la consola
3. **Comparte el error** específico que aparece
4. Podemos hacer un fix más específico

**Intenta acceder ahora a: http://192.168.1.49:5001** 📱
