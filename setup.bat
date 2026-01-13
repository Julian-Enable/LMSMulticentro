@echo off
setlocal enabledelayedexpansion

echo ========================================
echo 🚀 Setup LMS Multicentro
echo ========================================
echo.

REM 1. Verificar Node.js
echo 📦 Verificando Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 18 o superior.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detectado
echo.

REM 2. Instalar dependencias raíz
echo 📥 Instalando dependencias del proyecto...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas
echo.

REM 3. Configurar backend
echo ⚙️  Configurando backend...
cd backend

REM Crear .env si no existe
if not exist .env (
    echo 📝 Creando archivo .env para el backend...
    (
        echo DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lms_multicentro"
        echo JWT_SECRET="change-this-super-secret-key-in-production-min-32-chars"
        echo PORT=5000
        echo NODE_ENV=development
        echo CORS_ORIGIN=http://localhost:5173
    ) > .env
    echo ✅ Archivo .env creado
    echo ⚠️  Por favor revisa y ajusta la DATABASE_URL si es necesario
) else (
    echo ✅ Archivo .env ya existe
)

REM Generar Prisma Client
echo 🔧 Generando Prisma Client...
call npm run prisma:generate
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error generando Prisma Client
    cd ..
    pause
    exit /b 1
)
echo ✅ Prisma Client generado
echo.

REM Ejecutar migraciones
echo 🗄️  Ejecutando migraciones de base de datos...
echo ⚠️  Asegúrate de que PostgreSQL esté ejecutándose
set /p MIGRATE="¿Deseas ejecutar las migraciones ahora? (S/N): "
if /i "!MIGRATE!"=="S" (
    call npm run prisma:migrate
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Error ejecutando migraciones
        echo 💡 Verifica tu conexión a PostgreSQL y la DATABASE_URL
    ) else (
        echo ✅ Migraciones ejecutadas
    )
)

cd ..

REM 4. Configurar frontend
echo.
echo ⚙️  Configurando frontend...
cd frontend

if not exist .env (
    echo 📝 Creando archivo .env para el frontend...
    echo VITE_API_URL=http://localhost:5000/api > .env
    echo ✅ Archivo .env creado
) else (
    echo ✅ Archivo .env ya existe
)

cd ..

REM 5. Crear usuario admin
echo.
set /p CREATE_ADMIN="👤 ¿Deseas crear un usuario administrador? (S/N): "
if /i "!CREATE_ADMIN!"=="S" (
    cd backend
    
    set /p USERNAME="Nombre de usuario (default: admin): "
    if "!USERNAME!"=="" set USERNAME=admin
    
    set /p PASSWORD="Contraseña (default: admin123): "
    if "!PASSWORD!"=="" set PASSWORD=admin123
    
    set /p EMAIL="Email (default: admin@multicentro.com): "
    if "!EMAIL!"=="" set EMAIL=admin@multicentro.com
    
    call npm run create-admin !USERNAME! !PASSWORD! !EMAIL!
    cd ..
)

REM 6. Resumen final
echo.
echo ========================================
echo ✅ ¡Setup completado exitosamente!
echo ========================================
echo.
echo 📋 Próximos pasos:
echo.
echo   1. Revisa los archivos .env en /backend y /frontend
echo   2. Ajusta la DATABASE_URL si es necesario
echo   3. Ejecuta: npm run dev para iniciar el proyecto
echo   4. Accede a:
echo      - Frontend: http://localhost:5173
echo      - Backend:  http://localhost:5000
echo      - API Docs: http://localhost:5000/api
echo.
echo 🔐 Credenciales de acceso:
echo   - Usuario: !USERNAME!
echo   - Contraseña: (la que configuraste)
echo.
echo 📚 Comandos útiles:
echo   - npm run dev              - Iniciar desarrollo
echo   - npm run build            - Compilar para producción
echo   - cd backend ^&^& npm run prisma:studio - Abrir Prisma Studio
echo.
echo ¡Listo para comenzar! 🎉
echo.
pause
