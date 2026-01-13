#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando setup del proyecto LMS Multicentro${NC}\n"

# 1. Verificar Node.js
echo -e "${YELLOW}📦 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado. Por favor instala Node.js 18 o superior.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) detectado${NC}\n"

# 2. Verificar PostgreSQL
echo -e "${YELLOW}🐘 Verificando PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}⚠️  PostgreSQL no detectado. Asegúrate de tenerlo instalado y ejecutándose.${NC}"
fi
echo ""

# 3. Instalar dependencias raíz
echo -e "${YELLOW}📥 Instalando dependencias del proyecto...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencias instaladas${NC}\n"

# 4. Configurar backend
echo -e "${YELLOW}⚙️  Configurando backend...${NC}"
cd backend

# Crear .env si no existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creando archivo .env para el backend...${NC}"
    cat > .env << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lms_multicentro"
JWT_SECRET="$(openssl rand -base64 32)"
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
EOF
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
    echo -e "${YELLOW}⚠️  Por favor revisa y ajusta la DATABASE_URL si es necesario${NC}"
else
    echo -e "${GREEN}✅ Archivo .env ya existe${NC}"
fi

# Generar Prisma Client
echo -e "${YELLOW}🔧 Generando Prisma Client...${NC}"
npm run prisma:generate
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error generando Prisma Client${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Prisma Client generado${NC}\n"

# Ejecutar migraciones
echo -e "${YELLOW}🗄️  Ejecutando migraciones de base de datos...${NC}"
echo -e "${YELLOW}⚠️  Asegúrate de que PostgreSQL esté ejecutándose${NC}"
read -p "¿Deseas ejecutar las migraciones ahora? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run prisma:migrate
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error ejecutando migraciones${NC}"
        echo -e "${YELLOW}💡 Verifica tu conexión a PostgreSQL y la DATABASE_URL${NC}"
    else
        echo -e "${GREEN}✅ Migraciones ejecutadas${NC}"
    fi
fi

cd ..

# 5. Configurar frontend
echo -e "\n${YELLOW}⚙️  Configurando frontend...${NC}"
cd frontend

# Crear .env si no existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creando archivo .env para el frontend...${NC}"
    cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
else
    echo -e "${GREEN}✅ Archivo .env ya existe${NC}"
fi

cd ..

# 6. Crear usuario admin
echo -e "\n${YELLOW}👤 ¿Deseas crear un usuario administrador?${NC}"
read -p "Presiona Y para crear el usuario admin (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd backend
    read -p "Nombre de usuario (default: admin): " username
    username=${username:-admin}
    
    read -s -p "Contraseña (default: admin123): " password
    echo
    password=${password:-admin123}
    
    read -p "Email (default: admin@multicentro.com): " email
    email=${email:-admin@multicentro.com}
    
    npm run create-admin "$username" "$password" "$email"
    cd ..
fi

# 7. Resumen final
echo -e "\n${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ ¡Setup completado exitosamente!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}📋 Próximos pasos:${NC}\n"
echo -e "  1. Revisa los archivos .env en /backend y /frontend"
echo -e "  2. Ajusta la DATABASE_URL si es necesario"
echo -e "  3. Ejecuta: ${GREEN}npm run dev${NC} para iniciar el proyecto"
echo -e "  4. Accede a:"
echo -e "     - Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "     - Backend:  ${GREEN}http://localhost:5000${NC}"
echo -e "     - API Docs: ${GREEN}http://localhost:5000/api${NC}\n"

echo -e "${YELLOW}🔐 Credenciales de acceso:${NC}"
echo -e "  - Usuario: ${GREEN}$username${NC}"
echo -e "  - Contraseña: ${GREEN}(la que configuraste)${NC}\n"

echo -e "${YELLOW}📚 Comandos útiles:${NC}"
echo -e "  - ${GREEN}npm run dev${NC}              - Iniciar desarrollo"
echo -e "  - ${GREEN}npm run build${NC}            - Compilar para producción"
echo -e "  - ${GREEN}cd backend && npm run prisma:studio${NC} - Abrir Prisma Studio\n"

echo -e "${GREEN}¡Listo para comenzar! 🎉${NC}\n"
