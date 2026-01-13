# Sistema de Capacitación - LMS Multicentro

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd LMSMulticentro
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará las dependencias tanto del backend como del frontend automáticamente.

### 3. Configurar variables de entorno

#### Backend (.env en /backend):

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/lms_multicentro"
JWT_SECRET="tu-secreto-super-seguro-de-al-menos-32-caracteres"
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env en /frontend):

```bash
VITE_API_URL=http://localhost:5000/api
```

### 4. Configurar la base de datos

```bash
# Desde la carpeta backend
cd backend

# Generar el cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio para ver la base de datos
npm run prisma:studio
```

### 5. Crear usuario administrador

```bash
# Desde la carpeta backend
npm run create-admin

# O con credenciales personalizadas:
npm run create-admin admin mipassword admin@email.com
```

### 6. Iniciar el proyecto

Desde la raíz del proyecto:

```bash
npm run dev
```

Esto iniciará:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

## 📁 Estructura del Proyecto

```
LMSMulticentro/
├── backend/                 # API REST con Express + Prisma
│   ├── prisma/
│   │   └── schema.prisma   # Modelos de base de datos
│   ├── src/
│   │   ├── config/         # Configuración (database, etc.)
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Autenticación, validaciones
│   │   ├── routes/         # Definición de rutas
│   │   ├── scripts/        # Scripts útiles (crear admin)
│   │   └── index.ts        # Punto de entrada
│   └── package.json
│
├── frontend/                # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   │   ├── Admin/      # Gestión de contenido
│   │   │   ├── Auth/       # Autenticación
│   │   │   ├── Layout/     # Layout principal
│   │   │   └── VideoPlayer/# Reproductor de video
│   │   ├── pages/          # Páginas principales
│   │   ├── services/       # Llamadas a API
│   │   ├── store/          # Estado global (Zustand)
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Funciones auxiliares
│   │   └── App.tsx         # Configuración de rutas
│   └── package.json
│
├── package.json            # Scripts raíz
├── DEPLOYMENT.md           # Guía de despliegue
└── README.md               # Este archivo
```

## 🎯 Funcionalidades Principales

### Para Usuarios

- **🔍 Búsqueda Inteligente**: Encuentra información por código, título o tags de error
- **📚 Modo Curso**: Capacitación secuencial con progreso tracking
- **📖 Modo Biblioteca**: Acceso libre a todos los temas organizados por categorías
- **🎥 Reproductor de Video**: Salta directamente al timestamp del tema
- **✅ Evaluaciones**: Quizzes interactivos por tema

### Para Administradores

- **📂 Gestión de Categorías**: Organizar el contenido
- **🎬 Gestión de Videos**: Agregar videos de YouTube, Drive o Vimeo
- **📝 Gestión de Temas**: Crear temas con timestamps y descripciones
- **🏷️ Gestión de Tags**: Tags para errores y categorización
- **❓ Gestión de Quizzes**: Crear evaluaciones con múltiples opciones

## 🔐 Roles de Usuario

- **EMPLOYEE**: Acceso a búsqueda, cursos y biblioteca
- **SUPERVISOR**: Mismo que EMPLOYEE + acceso a reportes (futuro)
- **ADMIN**: Acceso completo + panel de administración

## 📊 Tecnologías Utilizadas

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT para autenticación
- bcryptjs para encriptación

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router v6
- React Player
- Zustand (state management)
- Axios

## 🛠️ Scripts Disponibles

### Raíz del proyecto

```bash
npm install          # Instalar todas las dependencias
npm run dev          # Iniciar backend y frontend en desarrollo
npm run build        # Compilar backend y frontend
npm start            # Iniciar en producción
```

### Backend

```bash
npm run dev                  # Desarrollo con hot-reload
npm run build                # Compilar TypeScript
npm start                    # Producción
npm run prisma:generate      # Generar cliente Prisma
npm run prisma:migrate       # Ejecutar migraciones
npm run prisma:studio        # Abrir Prisma Studio
npm run create-admin         # Crear usuario administrador
```

### Frontend

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
```

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Categorías
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:id` - Obtener categoría
- `POST /api/categories` - Crear categoría (Admin)
- `PUT /api/categories/:id` - Actualizar categoría (Admin)
- `DELETE /api/categories/:id` - Eliminar categoría (Admin)

### Videos
- `GET /api/videos` - Listar videos
- `GET /api/videos/:id` - Obtener video
- `POST /api/videos` - Crear video (Admin)
- `PUT /api/videos/:id` - Actualizar video (Admin)
- `DELETE /api/videos/:id` - Eliminar video (Admin)

### Temas
- `GET /api/topics` - Listar temas
- `GET /api/topics/:id` - Obtener tema
- `GET /api/topics/:id/navigate` - Obtener tema anterior/siguiente
- `POST /api/topics` - Crear tema (Admin)
- `PUT /api/topics/:id` - Actualizar tema (Admin)
- `DELETE /api/topics/:id` - Eliminar tema (Admin)

### Tags
- `GET /api/tags` - Listar tags
- `POST /api/tags` - Crear tag (Admin)
- `PUT /api/tags/:id` - Actualizar tag (Admin)
- `DELETE /api/tags/:id` - Eliminar tag (Admin)

### Quizzes
- `GET /api/quizzes` - Listar quizzes
- `GET /api/quizzes/:id` - Obtener quiz
- `POST /api/quizzes` - Crear quiz (Admin)
- `PUT /api/quizzes/:id` - Actualizar quiz (Admin)
- `DELETE /api/quizzes/:id` - Eliminar quiz (Admin)

### Búsqueda
- `GET /api/search?q=query` - Buscar temas

## 🚀 Despliegue

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones detalladas de despliegue en Railway.

## 📝 Casos de Uso

### Caso 1: Empleado con error en el sistema

1. Usuario busca el código de error (ej: "error_404")
2. Sistema muestra todos los temas relacionados con ese tag
3. Usuario hace clic en el tema
4. Video se carga automáticamente en el timestamp exacto
5. Usuario ve la solución y continúa trabajando

### Caso 2: Nuevo empleado - Capacitación completa

1. Usuario accede al modo "Curso"
2. Selecciona categoría "Facturación"
3. Sistema muestra todos los temas en orden secuencial
4. Usuario va completando tema por tema
5. Al finalizar cada tema, puede hacer el quiz
6. Sistema marca el progreso automáticamente

### Caso 3: Repaso de tema específico

1. Usuario accede a "Biblioteca"
2. Navega por el árbol: Categoría → Video → Tema
3. Hace clic en el tema específico que necesita repasar
4. Accede directamente al contenido sin seguir un orden

## 🔧 Troubleshooting

### Error: "Cannot connect to database"
- Verificar que PostgreSQL esté ejecutándose
- Revisar la DATABASE_URL en .env
- Verificar credenciales de base de datos

### Error: "JWT token invalid"
- Verificar que JWT_SECRET esté configurado
- Asegurarse de que sea el mismo en todos los entornos
- Limpiar localStorage del navegador

### Error: "CORS policy"
- Verificar CORS_ORIGIN en backend .env
- Asegurarse de que coincida con la URL del frontend

### Videos no se reproducen
- Verificar que las URLs sean accesibles públicamente
- Para Google Drive, asegurarse de que los videos sean públicos
- Para YouTube, verificar que los videos no estén bloqueados

## 📄 Licencia

Propiedad de Inversiones Multicentro.

## 👥 Contacto

Para soporte o consultas, contactar al equipo de desarrollo.
