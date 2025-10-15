#!/bin/bash

# Script para configurar variables de entorno en Vercel
# Uso: ./configure-vercel.sh

PROJECT_ID="prj_3iH245BRwg0ERrckRoS2pq2iSrR0"

echo "🚀 Configurando variables de entorno en Vercel..."
echo ""
echo "⚠️  IMPORTANTE: Necesitas proporcionar los valores reales para estas variables."
echo ""

# Variables críticas
echo "📌 Variables de Base de Datos:"
read -p "DATABASE_URL (PostgreSQL connection string): " DATABASE_URL

echo ""
echo "📌 Variables de Cloudinary:"
read -p "CLOUDINARY_CLOUD_NAME: " CLOUDINARY_CLOUD_NAME
read -p "CLOUDINARY_API_KEY: " CLOUDINARY_API_KEY
read -p "CLOUDINARY_API_SECRET: " CLOUDINARY_API_SECRET
read -p "CLOUDINARY_UPLOAD_PRESET: " CLOUDINARY_UPLOAD_PRESET

echo ""
echo "📌 Variables de WhatsApp:"
read -p "WHATSAPP_PHONE_NUMBER (ej: 51987654321): " WHATSAPP_PHONE_NUMBER

echo ""
echo "📌 Session Secret:"
read -p "SESSION_SECRET (un string aleatorio largo): " SESSION_SECRET

echo ""
echo "⚙️  Configurando variables en Vercel..."

# Configurar variables de entorno
if [ ! -z "$DATABASE_URL" ]; then
  npx vercel env add DATABASE_URL production <<< "$DATABASE_URL"
fi

if [ ! -z "$CLOUDINARY_CLOUD_NAME" ]; then
  npx vercel env add CLOUDINARY_CLOUD_NAME production <<< "$CLOUDINARY_CLOUD_NAME"
  npx vercel env add VITE_CLOUDINARY_CLOUD_NAME production <<< "$CLOUDINARY_CLOUD_NAME"
fi

if [ ! -z "$CLOUDINARY_API_KEY" ]; then
  npx vercel env add CLOUDINARY_API_KEY production <<< "$CLOUDINARY_API_KEY"
fi

if [ ! -z "$CLOUDINARY_API_SECRET" ]; then
  npx vercel env add CLOUDINARY_API_SECRET production <<< "$CLOUDINARY_API_SECRET"
fi

if [ ! -z "$CLOUDINARY_UPLOAD_PRESET" ]; then
  npx vercel env add CLOUDINARY_UPLOAD_PRESET production <<< "$CLOUDINARY_UPLOAD_PRESET"
  npx vercel env add VITE_CLOUDINARY_UPLOAD_PRESET production <<< "$CLOUDINARY_UPLOAD_PRESET"
fi

if [ ! -z "$WHATSAPP_PHONE_NUMBER" ]; then
  npx vercel env add WHATSAPP_PHONE_NUMBER production <<< "$WHATSAPP_PHONE_NUMBER"
  npx vercel env add VITE_WHATSAPP_PHONE_NUMBER production <<< "$WHATSAPP_PHONE_NUMBER"
fi

if [ ! -z "$SESSION_SECRET" ]; then
  npx vercel env add SESSION_SECRET production <<< "$SESSION_SECRET"
fi

echo ""
echo "✅ Variables configuradas. Ahora redesplegando..."
npx vercel --prod

echo ""
echo "🎉 ¡Listo! Tu app está desplegada en:"
echo "   https://psyco-2-cordials-projects-ce33abaf.vercel.app"
echo ""
echo "💡 Para configurar un dominio personalizado:"
echo "   1. Ve a https://vercel.com/cordials-projects-ce33abaf/psyco-2/settings/domains"
echo "   2. Agrega tu dominio (ej: psynet.vercel.app)"
echo ""
