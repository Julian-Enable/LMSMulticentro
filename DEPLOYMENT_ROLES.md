# Sistema de Roles Dinámicos - Guía de Implementación

## ⚠️ ESTADO ACTUAL
Backend completado (50%) - Frontend pendiente (50%)

### ✅ Completado (Backend):
1. Schema Prisma actualizado (Role model, relaciones User-Role, Category-Role)
2. Migración SQL creada (20260115020000_convert_roles_to_dynamic_model)
3. Controlador de roles CRUD (role.controller.ts)
4. Rutas API /api/roles
5. Actualización de controladores: auth, user, category
6. Middleware de autenticación actualizado

### ❌ Pendiente (Frontend):
1. Componente RoleManager (CRUD de roles)
2. Servicio role.service.ts
3. Actualizar tipos TypeScript (types/index.ts)
4. Actualizar UserManager para cargar roles desde API
5. Actualizar CategoryManager para selección de roles desde API

## 🚨 INSTRUCCIONES DE DEPLOYMENT

### PASO 1: Aplicar Migración en Railway (CRÍTICO)
**ANTES de hacer push a GitHub**, ejecuta la migración en Railway:

1. Ve a Railway → Tu proyecto → Database → Query
2. Copia y pega el contenido de:
   `backend/prisma/migrations/20260115020000_convert_roles_to_dynamic_model/migration.sql`
3. Ejecuta la migración
4. Verifica que se crearon:
   - Tabla `roles` con 8 registros
   - Tabla `category_roles`
   - Campo `roleId` en tabla `users`
   - Se eliminaron: campo `role` en `users`, campo `allowedRoles` en `categories`, enum `UserRole`

### PASO 2: Deploy del Backend
Una vez aplicada la migración:
```bash
git commit -m "WIP: Backend for dynamic roles system (frontend pending)"
git push
```

### PASO 3: Completar Frontend (PENDIENTE)
Crear los siguientes archivos y actualizaciones:

**A. frontend/src/services/role.service.ts**
```typescript
import api from '../lib/api';

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export const roleService = {
  getAll: async (isActive?: boolean) => {
    const params = isActive !== undefined ? `?isActive=${isActive}` : '';
    const res = await api.get(`/roles${params}`);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/roles/${id}`);
    return res.data;
  },

  create: async (data: Partial<Role>) => {
    const res = await api.post('/roles', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Role>) => {
    const res = await api.put(`/roles/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/roles/${id}`);
    return res.data;
  }
};
```

**B. Actualizar frontend/src/types/index.ts**
```typescript
export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  isSystem: boolean;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  roleId: string;
  role?: Role;  // Populated when included
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  order?: number;
  isActive: boolean;
  allowedRoles?: string[]; // Array of role codes for backward compat
  categoryRoles?: Array<{
    id: string;
    role: Role;
  }>;
  videos?: Video[];
}
```

**C. Componente RoleManager**
Crear `frontend/src/components/Admin/RoleManager.tsx` similar a CategoryManager/UserManager pero para CRUD de roles con:
- Tabla con roles
- Botón crear nuevo rol
- Campos: code, name, description, color (color picker), isActive
- Protección: roles isSystem=true no se pueden eliminar
- Validación: no eliminar roles con usuarios asignados

**D. Actualizar UserManager**
- Reemplazar AVAILABLE_ROLES array por llamada a roleService.getAll()
- Usar role.id en lugar de role code
- Actualizar formData.role por formData.roleId
- Enviar roleId al backend en lugar de role

**E. Actualizar CategoryManager**
- Cargar roles desde roleService.getAll()
- Cambiar allowedRoles de string[] a roleIds string[]
- Al guardar, enviar array de role IDs
- Al editar, popular con category.categoryRoles.map(cr => cr.roleId)

**F. Actualizar AdminPage**
Agregar opción "Gestión de Roles" en el menú admin

### PASO 4: Testing
1. Crear un nuevo rol desde RoleManager
2. Asignar ese rol a un usuario
3. Asignar un curso a ese rol
4. Verificar que el usuario solo ve cursos de su rol

## 📝 Cambios de Base de Datos

### Antes:
```sql
users.role ENUM('ADMIN', 'EMPLOYEE', ...)
categories.allowedRoles TEXT[]
```

### Después:
```sql
roles (nueva tabla)
  id, code, name, description, color, isActive, isSystem

users.roleId → roles.id

category_roles (nueva tabla many-to-many)
  categoryId → categories.id
  roleId → roles.id
```

## 🎯 Beneficios del Sistema
1. ✅ Roles configurables sin cambiar código
2. ✅ Colores personalizables para cada rol
3. ✅ Agregar/eliminar roles desde UI
4. ✅ Protección de roles del sistema (ADMIN)
5. ✅ Auditoría (createdAt, updatedAt)
6. ✅ Roles inactivos (soft delete)

## ⚠️ Advertencias
- NO hacer push antes de aplicar la migración en Railway
- Los roles con isSystem=true no se pueden eliminar
- No se puede eliminar un rol con usuarios asignados
- La migración es irreversible (elimina enum y campos)
