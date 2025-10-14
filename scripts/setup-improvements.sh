#!/bin/bash

echo "🚀 Configurando mejoras de Psynet..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Instalar dependencias
echo "${YELLOW}📦 Instalando dependencias...${NC}"
npm install --save redis express-session connect-redis cookie-parser csurf winston express-rate-limit compression helmet ioredis react-i18next i18next @sentry/node @sentry/react validator

npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @playwright/test

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi

echo ""

# 2. Crear directorio de logs
echo "${YELLOW}📁 Creando directorio de logs...${NC}"
mkdir -p logs
echo "${GREEN}✅ Directorio de logs creado${NC}"

echo ""

# 3. Ejecutar migración
echo "${YELLOW}🗄️  Ejecutando migración de base de datos...${NC}"
tsx scripts/run-migration.ts

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Migración completada${NC}"
else
    echo "${RED}❌ Error en migración${NC}"
    exit 1
fi

echo ""

# 4. Crear iconos PWA (placeholders)
echo "${YELLOW}🎨 Creando iconos PWA...${NC}"
mkdir -p client/public
# Aquí deberías crear los iconos reales, por ahora solo notificamos
echo "${YELLOW}⚠️  Recuerda crear icon-192.png y icon-512.png en client/public/${NC}"

echo ""

# 5. Instalar Playwright browsers
echo "${YELLOW}🌐 Instalando navegadores de Playwright...${NC}"
npx playwright install

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Navegadores instalados${NC}"
else
    echo "${YELLOW}⚠️  Error instalando navegadores (opcional)${NC}"
fi

echo ""

# 6. Verificar variables de entorno
echo "${YELLOW}🔐 Verificando variables de entorno...${NC}"
if [ ! -f .env ]; then
    echo "${RED}❌ Archivo .env no encontrado${NC}"
    exit 1
fi

# Verificar variables críticas
if ! grep -q "DATABASE_URL" .env; then
    echo "${RED}❌ DATABASE_URL no configurada${NC}"
    exit 1
fi

echo "${GREEN}✅ Variables de entorno verificadas${NC}"

echo ""
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}✨ ¡Configuración completada!${NC}"
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1. Actualizar imports en server/routes.ts:"
echo "   ${YELLOW}import { ... } from './auth-new'${NC}"
echo ""
echo "2. Reemplazar server/index.ts con server/index-new.ts:"
echo "   ${YELLOW}mv server/index.ts server/index-old.ts${NC}"
echo "   ${YELLOW}mv server/index-new.ts server/index.ts${NC}"
echo ""
echo "3. Configurar variables opcionales en .env:"
echo "   - SENTRY_DSN (error tracking)"
echo "   - VITE_GA_MEASUREMENT_ID (analytics)"
echo ""
echo "4. Iniciar el servidor:"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "5. Ejecutar tests:"
echo "   ${YELLOW}npm run test${NC}"
echo "   ${YELLOW}npm run test:e2e${NC}"
echo ""
echo "📖 Ver MEJORAS_IMPLEMENTADAS.md para más detalles"
echo ""
