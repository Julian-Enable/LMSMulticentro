# Sistema LMS + Knowledge Base - Multicentro

Sistema de Gestión de Capacitación y Base de Conocimiento para Inversiones Multicentro.

## 🎯 Características Principales

- **Búsqueda Inteligente**: Buscar por código, título, tags o descripción
- **Timestamps en Videos**: Saltar directamente al minuto exacto del tema
- **Modo Curso**: Contenido secuencial para capacitación completa
- **Modo Biblioteca**: Acceso directo a temas específicos
- **Panel de Administración**: Gestión completa de contenido
- **Soporte Multi-plataforma**: YouTube, Google Drive, Vimeo

## 🚀 Stack Tecnológico

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- React Router
- React Player
- Axios

### Backend
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Helmet + CORS

## 📋 Requisitos Previos

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd LMSMulticentro
```

### 2. Instalar dependencias raíz

```bash
npm install
```

### 3. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lms_multicentro"
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Ejecutar migraciones:

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Configurar Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Ejecución en Desarrollo

### Opción 1: Ejecutar todo desde la raíz

```bash
npm run dev
```

### Opción 2: Ejecutar por separado

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Acceder a:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Prisma Studio: `npx prisma studio`

## 📦 Build para Producción

```bash
npm run build
```

## 🚢 Deployment en Railway

### 1. Preparar el proyecto

Asegúrate de tener los archivos de configuración:
- `railway.json` (si es necesario)
- Variables de entorno configuradas en Railway

### 2. Crear servicios en Railway

1. **Base de Datos PostgreSQL**
   - Crear nuevo servicio PostgreSQL
   - Copiar DATABASE_URL

2. **Backend**
   - Conectar repositorio
   - Configurar variables de entorno
   - Configurar comando de inicio: `npm start`

3. **Frontend**
   - Conectar repositorio
   - Configurar VITE_API_URL
   - Build automático

### Variables de Entorno en Railway

**Backend:**
```
DATABASE_URL=<postgresql-connection-string>
PORT=5000
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
CORS_ORIGIN=<frontend-url>
```

**Frontend:**
```
VITE_API_URL=<backend-url>/api
```

## 📖 Documentación de la API

### Autenticación

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

### Categorías

```http
GET    /api/categories           # Listar todas
GET    /api/categories/:id       # Obtener una
POST   /api/categories           # Crear
PUT    /api/categories/:id       # Actualizar
DELETE /api/categories/:id       # Eliminar
```

### Videos

```http
GET    /api/videos               # Listar todos
GET    /api/videos/:id           # Obtener uno
POST   /api/videos               # Crear
PUT    /api/videos/:id           # Actualizar
DELETE /api/videos/:id           # Eliminar
```

### Temas

```http
GET    /api/topics               # Listar todos
GET    /api/topics/:id           # Obtener uno
POST   /api/topics               # Crear
PUT    /api/topics/:id           # Actualizar
DELETE /api/topics/:id           # Eliminar
GET    /api/topics/:id/next      # Siguiente tema
GET    /api/topics/:id/previous  # Tema anterior
```

### Búsqueda

```http
GET    /api/search?q=<query>&category=<id>&page=<num>
```

## 📁 Estructura del Proyecto

```
LMSMulticentro/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuraciones
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middlewares
│   │   ├── routes/         # Rutas API
│   │   ├── services/       # Lógica de negocio
│   │   ├── types/          # Tipos TypeScript
│   │   └── index.ts        # Entrada principal
│   ├── prisma/
│   │   └── schema.prisma   # Schema de BD
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas
│   │   ├── services/       # API calls
│   │   ├── types/          # Tipos TypeScript
│   │   ├── utils/          # Utilidades
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── package.json
└── README.md
```

## 🎓 Casos de Uso

### Caso 1: Buscar Información de Error

1. Empleado encuentra error en el sistema
2. Ingresa código o descripción en buscador
3. Sistema muestra temas con timestamp
4. Video inicia en punto exacto
5. Empleado resuelve el problema

### Caso 2: Capacitación de Nuevo Empleado

1. Supervisor asigna categoría
2. Empleado accede a modo "Curso"
3. Ve temas secuencialmente
4. Completa quizzes
5. Supervisor verifica progreso

### Caso 3: Administrar Contenido

1. Admin accede al panel
2. Crea/edita categorías, videos, temas
3. Asigna tags para búsqueda
4. Publica contenido

## 🔒 Seguridad

- Conexión HTTPS en producción
- Autenticación JWT
- Protección CSRF
- Headers de seguridad (Helmet)
- Validación de inputs
- Rate limiting

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es propiedad de Inversiones Multicentro.

## 👤 Autor

**Julián González Merchán**
- Desarrollador Principal
- Fecha: Enero 2026

## 📞 Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo.
