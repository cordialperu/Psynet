#!/bin/bash

echo "🚀 Desplegando Psynet en Render.com"
echo "===================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json no encontrado${NC}"
    echo "Por favor ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

echo -e "\n${YELLOW}📋 INSTRUCCIONES PARA RENDER.COM${NC}"
echo "=================================="
echo ""
echo "Render.com ofrece despliegue GRATUITO para proyectos Node.js:"
echo "• 750 horas/mes gratis (suficiente para un proyecto)"
echo "• Base de datos incluida"
echo "• SSL automático"
echo "• No requiere tarjeta de crédito"
echo ""
echo -e "${GREEN}Opción 1: Despliegue Manual desde la Web UI${NC}"
echo "-------------------------------------------"
echo "1. Ve a: https://render.com/"
echo "2. Haz clic en 'Get Started for Free'"
echo "3. Inicia sesión con GitHub"
echo "4. Haz clic en 'New +' > 'Web Service'"
echo "5. Conecta este repositorio: https://github.com/cordialperu/Psynet"
echo "6. Configura:"
echo "   - Name: psynet"
echo "   - Runtime: Node"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm start"
echo "   - Plan: Free"
echo ""
echo "7. En 'Environment Variables', añade:"
echo "   DATABASE_URL=postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
echo "   VITE_WHATSAPP_PHONE_NUMBER=51987654321"
echo "   MASTER_CODE=333"
echo "   NODE_ENV=production"
echo ""
echo "8. Haz clic en 'Create Web Service'"
echo "9. Espera 5-10 minutos mientras se despliega"
echo ""
echo -e "${GREEN}Opción 2: Despliegue desde Git${NC}"
echo "--------------------------------"
echo "1. Asegúrate de que tu código esté en GitHub"
echo "2. Ve a: https://dashboard.render.com/select-repo?type=web"
echo "3. Selecciona el repositorio 'Psynet'"
echo "4. Render detectará automáticamente el archivo render.yaml"
echo "5. Revisa la configuración y haz clic en 'Apply'"
echo ""
echo -e "${YELLOW}📝 IMPORTANTE:${NC}"
echo "• El plan gratuito tiene un 'spin down' después de 15 min de inactividad"
echo "• La primera carga después del spin down tomará ~30 segundos"
echo "• Para evitar esto, considera el plan de $7/mes"
echo ""
echo -e "${GREEN}🔍 Verificación después del despliegue:${NC}"
echo "1. Abre la URL proporcionada por Render (ej: https://psynet.onrender.com)"
echo "2. Verifica que /api/health muestre 'database: connected'"
echo "3. Confirma que tus publicaciones reales aparecen en la app"
echo ""
echo -e "${YELLOW}⚠️  Si necesitas actualizar variables de entorno:${NC}"
echo "1. Ve a tu servicio en: https://dashboard.render.com/"
echo "2. Haz clic en 'Environment' en el menú lateral"
echo "3. Añade/edita las variables necesarias"
echo "4. Guarda (esto reiniciará el servicio automáticamente)"
echo ""
echo -e "${GREEN}✅ Ventajas de Render vs Railway/Vercel:${NC}"
echo "• ✅ Plan gratuito REAL sin necesidad de tarjeta"
echo "• ✅ Soporta aplicaciones Node.js completas"
echo "• ✅ Conexión directa a base de datos externa"
echo "• ✅ 750 horas/mes (más que suficiente)"
echo "• ✅ SSL automático incluido"
echo "• ✅ Despliegue automático desde Git"
echo ""
echo -e "${YELLOW}🔗 Enlaces útiles:${NC}"
echo "• Dashboard: https://dashboard.render.com/"
echo "• Documentación: https://render.com/docs"
echo "• GitHub Repo: https://github.com/cordialperu/Psynet"
echo ""
echo -e "${GREEN}🎉 ¡Listo para desplegar!${NC}"
echo ""
read -p "¿Quieres que abra el navegador en Render.com? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://dashboard.render.com/select-repo?type=web"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://dashboard.render.com/select-repo?type=web"
    else
        echo "Por favor abre manualmente: https://dashboard.render.com/select-repo?type=web"
    fi
fi

echo ""
echo -e "${GREEN}✨ Recursos guardados:${NC}"
echo "• render.yaml - Configuración automática"
echo "• Este script - Guía de despliegue"
echo "• Ver RENDER_DEPLOYMENT.md para más detalles"
