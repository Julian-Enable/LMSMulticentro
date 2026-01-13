# 🚀 Guía de Primer Uso - LMS Multicentro

## ⚡ Instalación Rápida (5 minutos)

### Prerequisitos
- ✅ Node.js 18 o superior instalado
- ✅ PostgreSQL 15 o superior instalado y ejecutándose
- ✅ Git instalado

### Paso 1: Clonar y configurar (2 min)

```bash
# Clonar el repositorio
git clone <tu-repo-url>
cd LMSMulticentro

# Ejecutar setup automático
# En Windows:
setup.bat

# En Linux/Mac:
chmod +x setup.sh
./setup.sh
```

El script automático hará:
- ✅ Instalar todas las dependencias
- ✅ Configurar archivos .env
- ✅ Generar Prisma Client
- ✅ Ejecutar migraciones de BD
- ✅ Crear usuario administrador

### Paso 2: Iniciar el sistema (1 min)

```bash
npm run dev
```

Esto iniciará:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

### Paso 3: Primer login (30 seg)

1. Abrir http://localhost:5173
2. Login con las credenciales que creaste:
   - Usuario: `admin` (o el que elegiste)
   - Contraseña: la que configuraste

¡Listo! Ya puedes usar el sistema 🎉

---

## 📚 Primeros Pasos - Configuración Inicial

### Como Administrador (Primera vez)

#### 1. Crear Categorías (1 min)
```
Panel Admin → Tab "Categorías" → Nueva Categoría
```
**Ejemplo:**
- Nombre: "Facturación"
- Descripción: "Proceso de facturación del ERP"
- Estado: Activa

**Sugerencias:**
- Facturación
- Inventario
- Compras
- Ventas
- Recursos Humanos
- Reportes

#### 2. Agregar Videos (2 min)
```
Panel Admin → Tab "Videos" → Nuevo Video
```
**Ejemplo:**
- Título: "Facturación - Tutorial Completo"
- URL: https://youtube.com/watch?v=xxxxx
- Plataforma: YouTube
- Categoría: Facturación
- Estado: Activo

**URLs soportadas:**
- YouTube: `https://youtube.com/watch?v=xxxxx`
- Google Drive: `https://drive.google.com/file/d/xxxxx/view`
- Vimeo: `https://vimeo.com/xxxxx`

#### 3. Crear Temas con Timestamps (3 min)
```
Panel Admin → Tab "Temas" → Nuevo Tema
```
**Ejemplo:**
- Código: `1.11`
- Título: "Crear nueva factura"
- Descripción: "Proceso paso a paso para crear una factura de venta"
- Timestamp: `3:45` (minuto 3, segundo 45)
- Video: Seleccionar el video correspondiente
- Tags: Seleccionar tags relevantes

**Convención de códigos:**
```
Categoría.Número
1.11, 1.12, 1.13 → Facturación
2.11, 2.12, 2.13 → Inventario
3.11, 3.12, 3.13 → Compras
```

#### 4. Crear Tags de Error (2 min)
```
Panel Admin → Tab "Tags" → Nuevo Tag
```
**Ejemplo:**
- `error_404`
- `error_conexion`
- `factura_anulada`
- `producto_no_encontrado`
- `saldo_insuficiente`

**Tip:** Usa snake_case para consistencia

#### 5. Crear Quizzes (5 min - opcional)
```
Panel Admin → Tab "Quizzes" → Nuevo Quiz
```
**Ejemplo:**
- Título: "Evaluación Facturación"
- Tema: Seleccionar tema específico
- Agregar preguntas con 2-4 opciones
- Marcar la opción correcta

---

## 🎯 Casos de Uso Comunes

### Caso 1: Empleado busca solución a un error

**Escenario:** Error "No se puede anular la factura"

1. **Ir a Búsqueda** (http://localhost:5173/search)
2. **Buscar:** `factura_anulada` o `anular factura`
3. **Resultados:** Sistema muestra temas con ese tag/keyword
4. **Click en tema:** Video se abre en el timestamp exacto
5. **Ver solución:** Empleado ve los pasos para resolver el error
6. **Quiz (opcional):** Completar quiz para verificar comprensión

**Tiempo estimado:** 2-3 minutos

---

### Caso 2: Nuevo empleado - Capacitación completa

**Escenario:** Empleado nuevo necesita aprender facturación

1. **Ir a Home** (http://localhost:5173)
2. **Seleccionar categoría:** Click en "Facturación"
3. **Modo Curso:** Sistema muestra todos los temas ordenados (1.11 → 1.12 → ...)
4. **Seguir secuencia:**
   - Ver video de cada tema
   - Marcar como completado
   - Hacer quiz
   - Continuar al siguiente
5. **Progreso:** Sistema guarda avance automáticamente

**Tiempo estimado:** 2-3 horas (dependiendo del contenido)

---

### Caso 3: Repaso de tema específico

**Escenario:** Empleado necesita repasar "Crear factura"

1. **Ir a Biblioteca** (http://localhost:5173/library)
2. **Navegar árbol:**
   - Expandir "Facturación"
   - Expandir video correspondiente
   - Click en "1.11 - Crear nueva factura"
3. **Ver contenido:** Acceso directo sin seguir orden

**Tiempo estimado:** 5 minutos

---

## 🔧 Configuración Avanzada

### Ajustar configuración de base de datos

Editar `backend/.env`:
```bash
DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_db"
```

### Cambiar puerto del backend

Editar `backend/.env`:
```bash
PORT=8000  # En lugar de 5000
```

**No olvides actualizar `frontend/.env`:**
```bash
VITE_API_URL=http://localhost:8000/api
```

### Habilitar registro de usuarios

Por defecto, el registro está deshabilitado. Para habilitarlo:

1. En `backend/src/routes/auth.routes.ts`, descomentar:
```typescript
router.post('/register', register);
```

2. **Importante:** Todos los usuarios registrados empiezan como EMPLOYEE. Para crear ADMIN, usar el script:
```bash
cd backend
npm run create-admin nombreusuario password email@example.com
```

---

## 📊 Comandos Útiles

### Ver base de datos visualmente
```bash
cd backend
npm run prisma:studio
```
Abre una interfaz web en http://localhost:5555

### Ver logs del backend
El backend muestra logs automáticamente en consola con Morgan

### Limpiar y reinstalar
```bash
# Limpiar node_modules
rm -rf node_modules backend/node_modules frontend/node_modules

# Reinstalar
npm install
```

### Resetear base de datos (⚠️ Pierde todos los datos)
```bash
cd backend
npx prisma migrate reset
npm run create-admin
```

---

## 🐛 Solución de Problemas Comunes

### "Cannot connect to database"

**Solución:**
```bash
# 1. Verificar que PostgreSQL está corriendo
# Windows:
services.msc → PostgreSQL

# Linux:
sudo systemctl status postgresql

# 2. Verificar DATABASE_URL en backend/.env
# 3. Probar conexión:
cd backend
npx prisma db push
```

---

### "Port 5000 already in use"

**Solución:**
```bash
# Opción 1: Cambiar puerto en backend/.env
PORT=8000

# Opción 2: Matar proceso en puerto 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux:
lsof -ti:5000 | xargs kill -9
```

---

### "JWT token invalid" al hacer login

**Solución:**
```bash
# 1. Verificar JWT_SECRET en backend/.env
# 2. Limpiar localStorage del navegador:
#    F12 → Application → Local Storage → Clear

# 3. Reiniciar backend
```

---

### Videos no se reproducen

**Causas comunes:**

1. **Video privado:** Asegúrate de que el video sea público
2. **URL incorrecta:** Verifica el formato de la URL
3. **Plataforma bloqueada:** Algunos firewalls bloquean YouTube

**Solución:**
```bash
# Para Google Drive, usar URLs como:
https://drive.google.com/file/d/ID_DEL_ARCHIVO/view

# Para YouTube:
https://www.youtube.com/watch?v=ID_DEL_VIDEO

# Verificar en Panel Admin → Videos
```

---

### Migraciones fallan

**Solución:**
```bash
cd backend

# 1. Generar cliente
npm run prisma:generate

# 2. Si persiste, resetear migraciones
npx prisma migrate reset

# 3. Crear admin nuevamente
npm run create-admin
```

---

## 📱 Acceso desde otros dispositivos

Para acceder desde otros dispositivos en la red local:

1. Obtener IP del servidor:
```bash
# Windows:
ipconfig

# Linux/Mac:
ifconfig
```

2. Actualizar CORS en `backend/.env`:
```bash
CORS_ORIGIN=http://192.168.1.XXX:5173
```

3. Acceder desde otro dispositivo:
```
http://192.168.1.XXX:5173
```

---

## 🎓 Mejores Prácticas

### Para Administradores

✅ **DO:**
- Usar códigos consistentes (1.11, 1.12, etc.)
- Timestamps precisos al segundo
- Tags descriptivos en snake_case
- Descripciones claras en temas
- Videos con buena calidad de audio

❌ **DON'T:**
- Cambiar códigos de temas ya publicados
- Eliminar categorías con contenido
- Usar videos privados
- Timestamps incorrectos

### Para Usuarios

✅ **DO:**
- Buscar por keywords específicos
- Usar biblioteca para acceso rápido
- Completar quizzes para validar conocimiento
- Seguir modo curso secuencialmente

---

## 📞 Soporte

Si encuentras problemas no cubiertos aquí:

1. Revisa los logs del backend en la terminal
2. Revisa la consola del navegador (F12)
3. Consulta los archivos de documentación:
   - `README_FULL.md` - Documentación completa
   - `DEPLOYMENT.md` - Guía de despliegue
   - `PROJECT_SUMMARY.md` - Resumen del proyecto

---

## 🎉 ¡Todo listo!

Ahora tienes un sistema de capacitación completo funcionando. 

**Próximos pasos:**
1. ✅ Agregar contenido (categorías, videos, temas)
2. ✅ Crear usuarios adicionales
3. ✅ Capacitar al equipo en el uso del sistema
4. ✅ Considerar despliegue en producción (ver DEPLOYMENT.md)

**¡Feliz capacitación!** 🚀📚
