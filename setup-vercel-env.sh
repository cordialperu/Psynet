#!/bin/bash

# Script para configurar variables de entorno en Vercel
# Uso: ./setup-vercel-env.sh

echo "🔧 Configurando variables de entorno en Vercel..."

# Leer el archivo .env
if [ ! -f .env ]; then
    echo "❌ Error: Archivo .env no encontrado"
    exit 1
fi

# Función para agregar variable de entorno
add_env() {
    local key=$1
    local value=$2
    echo "$value" | vercel env add "$key" production --yes 2>/dev/null || echo "⚠️  $key ya existe o hubo un error"
}

# Extraer y agregar variables del .env
while IFS='=' read -r key value; do
    # Ignorar comentarios y líneas vacías
    if [[ ! "$key" =~ ^# ]] && [[ -n "$key" ]]; then
        # Remover espacios en blanco
        key=$(echo "$key" | xargs)
        value=$(echo "$value" | xargs)
        
        if [[ -n "$value" ]] && [[ "$value" != "your_"* ]]; then
            echo "📝 Agregando $key..."
            add_env "$key" "$value"
        fi
    fi
done < .env

echo "✅ Configuración completada!"
echo ""
echo "🚀 Para aplicar los cambios, ejecuta:"
echo "   vercel --prod"
