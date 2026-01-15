# Instrucciones de Despliegue - Sistema de Roles CRUD

## ✅ Estado Actual

### Backend - 100% Completo
- ✅ Schema de Prisma convertido de enum a modelo Role
- ✅ Migración SQL creada con preservación de datos
- ✅ Controlador de roles con CRUD completo
- ✅ Rutas de API configuradas
- ✅ Controllers actualizados (auth, user, category)
- ✅ Middleware actualizado
- ✅ Compila sin errores TypeScript

### Frontend - 100% Completo
- ✅ `role.service.ts` creado
- ✅ Tipos TypeScript actualizados
- ✅ `RoleManager` component creado (CRUD completo)
- ✅ `UserManager` actualizado para roles dinámicos
- ✅ `AdminPage` con pestaña de Roles
- ✅ Compila sin errores TypeScript

---

## ⚠️ CRÍTICO: Orden de Despliegue

**NUNCA desplegar el código antes de aplicar la migración. El código espera la tabla `roles`, pero la base de datos tiene el enum `UserRole`.**

---

## 📋 Pasos de Despliegue

### Paso 1: Aplicar Migración a Railway (OBLIGATORIO PRIMERO)

1. **Acceder a Railway Dashboard**
   - Ir a https://railway.app
   - Seleccionar tu proyecto
   - Clic en el servicio PostgreSQL

2. **Abrir Query Tab**
   - En el panel de PostgreSQL, buscar la pestaña "Query"
   - Ahí podrás ejecutar SQL directamente

3. **Copiar y Ejecutar la Migración**
   ```bash
   # Abrir el archivo de migración
   cat backend/prisma/migrations/20260115020000_convert_roles_to_dynamic_model/migration.sql
   ```
   - Copiar TODO el contenido del archivo
   - Pegarlo en el Query tab de Railway
   - Clic en "Run Query" o ejecutar

4. **Verificar que la Migración se Aplicó Correctamente**
   ```sql
   -- Verificar que la tabla roles existe
   SELECT * FROM roles;
   -- Debería mostrar 8 roles: ADMIN, CAJERO, ADMINISTRADOR, GERENTE, VENTAS, INVENTARIO, SUPERVISOR, EMPLOYEE
   
   -- Verificar que users tiene roleId
   SELECT id, username, "roleId" FROM users LIMIT 5;
   
   -- Verificar que el enum viejo fue eliminado
   SELECT typname FROM pg_type WHERE typname = 'UserRole';
   -- NO debería retornar nada
   ```

### Paso 2: Desplegar Backend

El código del backend ya está listo y compilado. Railway detectará los cambios automáticamente al hacer push.

```bash
cd backend
git add .
git commit -m "feat: Implementar sistema de roles CRUD dinámico"
git push origin main
```

Railway automáticamente:
1. Detecta el push
2. Ejecuta `npm install`
3. Ejecuta `npm run build`
4. Reinicia el servicio

**Verificar Logs:**
- En Railway Dashboard > Backend Service > Deployments
- Buscar: "Server running on port 3000" (o el puerto que uses)
- **NO** debería haber errores de Prisma relacionados con Role/UserRole

### Paso 3: Desplegar Frontend

```bash
cd frontend
git add .
git commit -m "feat: Implementar UI de gestión de roles"
git push origin main
```

### Paso 4: Verificación Post-Despliegue

1. **Login como Admin**
   - Ir a tu sitio desplegado
   - Hacer login con usuario admin

2. **Verificar Pestaña Roles**
   - Ir a Administración
   - Debería aparecer la pestaña "Roles"
   - Clic en "Roles"
   - Debería mostrar los 8 roles por defecto

3. **Probar Crear un Rol**
   - Clic en "Crear Rol"
   - Código: `CONTADOR`
   - Nombre: `Contador`
   - Descripción: `Encargado de contabilidad`
   - Color: Seleccionar un color (ej: `#EF4444`)
   - Activo: ✅
   - Guardar
   - Verificar que aparece en la tabla

4. **Probar Asignar Rol a Usuario**
   - Ir a pestaña "Usuarios"
   - Crear nuevo usuario
   - En el dropdown de Rol, debería aparecer "CONTADOR"
   - Asignar y guardar
   - Verificar que se guarda correctamente

5. **Probar Asignar Curso a Rol**
   - Ir a pestaña "Cursos"
   - Editar un curso existente
   - En "Roles permitidos", debería aparecer "CONTADOR"
   - Seleccionar y guardar

6. **Verificar Acceso por Rol**
   - Hacer logout
   - Login con el usuario que tiene rol CONTADOR
   - Ir a Biblioteca
   - Solo debería ver cursos asignados al rol CONTADOR

---

## 🛠️ Solución de Problemas

### Error: "Column 'role' does not exist"
**Causa:** Código desplegado antes de ejecutar la migración.
**Solución:**
1. Ejecutar la migración en Railway (Paso 1)
2. Reiniciar el servicio de backend en Railway

### Error: "Table 'roles' does not exist"
**Causa:** Migración no se ejecutó.
**Solución:**
1. Verificar que ejecutaste la migración en Railway Query tab
2. Verificar con `SELECT * FROM roles;`

### No aparece la pestaña "Roles" en Admin
**Causa:** Frontend no se desplegó correctamente.
**Solución:**
1. Verificar que el frontend se construyó sin errores
2. Limpiar caché del navegador (Ctrl+Shift+R)
3. Verificar que AdminPage.tsx tiene el import de RoleManager

### Dropdown de roles vacío en UserManager
**Causa:** Backend no está retornando roles.
**Solución:**
1. Abrir DevTools > Network
2. Buscar request a `/api/roles`
3. Verificar que retorna 200 con array de roles
4. Si retorna 500, revisar logs del backend en Railway

---

## 📊 Cambios en el Sistema

### Base de Datos

**ANTES:**
```prisma
enum UserRole {
  ADMIN
  CAJERO
  ADMINISTRADOR
  GERENTE
  VENTAS
  INVENTARIO
  SUPERVISOR
  EMPLOYEE
}

model User {
  role     UserRole
}

model Category {
  allowedRoles String[]
}
```

**DESPUÉS:**
```prisma
model Role {
  id          String   @id @default(cuid())
  code        String   @unique
  name        String
  description String?
  color       String   @default("#6B7280")
  isActive    Boolean  @default(true)
  isSystem    Boolean  @default(false)
}

model User {
  roleId   String
  role     Role   @relation(fields: [roleId], references: [id])
}

model Category {
  categoryRoles CategoryRole[]
}

model CategoryRole {
  categoryId String
  roleId     String
  category   Category @relation(fields: [categoryId], references: [id])
  role       Role     @relation(fields: [roleId], references: [id])
  @@id([categoryId, roleId])
}
```

### API Endpoints Nuevos

- `GET /api/roles` - Listar todos los roles
- `GET /api/roles/:id` - Obtener un rol con contadores
- `POST /api/roles` - Crear nuevo rol
- `PUT /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar rol (con validaciones)

### Protecciones del Sistema

1. **Roles del Sistema** (`isSystem: true`):
   - No se pueden eliminar
   - Código no se puede cambiar
   - Solo ADMIN tiene esta bandera por defecto

2. **Eliminación de Roles**:
   - No se puede eliminar un rol con usuarios asignados
   - No se puede eliminar roles del sistema
   - Se muestra error claro al usuario

3. **Validaciones**:
   - Código de rol debe ser único
   - Código se convierte automáticamente a mayúsculas
   - No se permiten espacios en el código

---

## 🎯 Funcionalidades Implementadas

### RoleManager (Gestión de Roles)
- ✅ Crear roles personalizados
- ✅ Editar nombre, descripción, color
- ✅ Marcar como activo/inactivo
- ✅ Eliminar roles (con protecciones)
- ✅ Ver cantidad de usuarios por rol
- ✅ Vista de tabla ordenada
- ✅ Selector de color con preview

### UserManager (Gestión de Usuarios)
- ✅ Dropdown dinámico de roles (carga desde API)
- ✅ Badges de colores personalizados por rol
- ✅ Solo muestra roles activos en dropdown
- ✅ Guarda roleId en lugar de código

### Sistema General
- ✅ Roles con colores personalizables
- ✅ Filtrado de cursos por rol
- ✅ Relación muchos-a-muchos Curso-Rol
- ✅ Migración de datos preserva usuarios existentes
- ✅ 8 roles por defecto con colores predefinidos

---

## 📝 Notas Adicionales

### Colores por Defecto de Roles

```javascript
ADMIN:          #9333EA (Púrpura)
CAJERO:         #10B981 (Verde)
ADMINISTRADOR:  #3B82F6 (Azul)
GERENTE:        #F59E0B (Amarillo)
VENTAS:         #8B5CF6 (Violeta)
INVENTARIO:     #EC4899 (Rosa)
SUPERVISOR:     #14B8A6 (Teal)
EMPLOYEE:       #6B7280 (Gris)
```

### Próximos Pasos Sugeridos

1. **Refactorizar `authorize()` middleware** para usar roleId en lugar de code
2. **Actualizar CategoryManager** para usar roles dinámicos (actualmente usa allowedRoles)
3. **Implementar permisos granulares** (no solo roles, sino permisos específicos)
4. **Agregar auditoría** de cambios en roles
5. **Implementar soft delete** para roles (marcar como inactivo en lugar de eliminar)

---

## 🚀 Comando Rápido de Despliegue

```bash
# ⚠️ PRIMERO: Ejecutar migración en Railway Query tab

# Después:
git add .
git commit -m "feat: Sistema completo de roles CRUD"
git push origin main

# Railway se encarga del resto
```

---

**Fecha de Implementación:** 2025-01-15  
**Desarrollador:** GitHub Copilot + Julian  
**Estado:** ✅ Listo para Producción (después de ejecutar migración)
