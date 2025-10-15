#!/bin/bash

# Script para deployment automático en Vercel
echo "🚀 Iniciando deployment automático en Vercel..."

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta este script desde el directorio raíz del proyecto."
    exit 1
fi

# 2. Verificar que vercel.json existe
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: No se encontró vercel.json"
    exit 1
fi

echo "✅ Archivos de configuración encontrados"

# 3. Hacer build para verificar que todo funciona
echo "🔨 Verificando build..."
if ! npm run build; then
    echo "❌ Error: El build falló. Revisa los errores arriba."
    exit 1
fi

echo "✅ Build exitoso"

# 4. Intentar deployment
echo "🌐 Iniciando deployment en Vercel..."
echo "📝 Se abrirá una ventana de autenticación en tu navegador"
echo "🔐 Después de autenticar, el deployment continuará automáticamente"
echo ""

# 5. Ejecutar deployment (requiere interacción del usuario)
vercel --prod

echo ""
echo "🎉 ¡Deployment completado!"
echo "🌐 Tu aplicación debería estar disponible en: https://psynet.vercel.app"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura las variables de entorno en el dashboard de Vercel"
echo "2. Cambia la base de datos a PostgreSQL para producción"
echo "3. ¡Disfruta tu aplicación en vivo!"
