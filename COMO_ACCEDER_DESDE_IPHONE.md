# 📱 Cómo Acceder desde iPhone

## ⚠️ Problema: localhost no funciona en iPhone

`localhost:5001` solo funciona en tu computadora. Para acceder desde iPhone necesitas usar la IP local de tu Mac.

---

## ✅ Solución: Usar IP Local

### **Paso 1: Obtener tu IP Local**

Ejecuta en terminal:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

O busca en:
**System Settings → Network → WiFi → Details → IP Address**

Ejemplo de IP: `192.168.1.100`

---

### **Paso 2: Verificar que Mac e iPhone estén en la misma WiFi**

- Mac: Conectado a tu WiFi
- iPhone: Conectado al MISMO WiFi

---

### **Paso 3: Acceder desde iPhone**

En Safari en tu iPhone, abre:
```
http://TU_IP_LOCAL:5001
```

Ejemplo:
```
http://192.168.1.100:5001
```

---

## 🔧 Si aún no carga

### **Opción 1: Verificar Firewall**

El firewall de Mac puede estar bloqueando conexiones. Desactívalo temporalmente:

```bash
# Ver estado del firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Desactivar temporalmente (para testing)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
```

---

### **Opción 2: Usar ngrok (Túnel Público)**

Si no funciona con IP local, usa ngrok para crear un túnel público:

```bash
# Instalar ngrok
brew install ngrok

# Crear túnel
ngrok http 5001
```

Ngrok te dará una URL pública como:
```
https://abc123.ngrok.io
```

Abre esa URL en tu iPhone.

---

### **Opción 3: Desplegar en Producción**

Para testing real en iPhone, despliega en:
- **Vercel** (frontend)
- **Railway** o **Render** (backend)
- **Neon** (database - ya configurado)

---

## 🎯 Comando Rápido

Ejecuta esto para ver tu IP y el estado del servidor:

```bash
echo "🌐 Tu IP Local:"
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
echo "\n📡 Servidor corriendo en:"
lsof -i :5001 | grep LISTEN
echo "\n📱 Accede desde iPhone en:"
echo "http://$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1):5001"
```

---

## ✅ Checklist de Troubleshooting

- [ ] Mac e iPhone en la misma WiFi
- [ ] Servidor corriendo en puerto 5001
- [ ] Firewall de Mac permite conexiones
- [ ] Usar IP local (no localhost)
- [ ] Probar en Safari (no Chrome si da problemas)
- [ ] Limpiar cache del navegador en iPhone

---

## 🚀 Alternativa: Deploy Rápido

Si quieres testing real sin complicaciones:

### **Deploy en Vercel (5 minutos):**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Vercel te dará una URL pública que funciona en cualquier dispositivo.

---

## 📝 Notas Importantes

1. **localhost = solo tu computadora**
2. **IP local = otros dispositivos en tu WiFi**
3. **ngrok/Vercel = acceso desde cualquier lugar**

**Usa la IP local de tu Mac para acceder desde iPhone en la misma red WiFi.**
