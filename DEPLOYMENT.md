    # 🚀 Guía de Despliegue

## Backend en Railway + Frontend en Netlify

Esta configuración despliega:
- **Backend + PostgreSQL** → Railway (backend API)
- **Frontend** → Netlify (aplicación React)

---

## 📦 PARTE 1: Desplegar Backend en Railway (10 min)

### Paso 1: Crear cuenta en Railway

1. Ve a https://railway.app
2. Click en **"Start a New Project"**
3. Conecta con tu cuenta de GitHub
4. Autoriza Railway a acceder a tus repositorios

### Paso 2: Crear Base de Datos PostgreSQL

1. En tu proyecto Railway, click en **"+ New"**
2. Selecciona **"Database"** → **"PostgreSQL"**
3. Railway crea automáticamente la base de datos
4. En la pestaña **"Variables"**, copia el valor de `DATABASE_URL`

### Paso 3: Desplegar el Backend

1. Click en **"+ New"** → **"GitHub Repo"**
2. Selecciona tu repositorio: `Julian-Enable/LMSMulticentro`
3. Railway detectará automáticamente el proyecto

**Configurar el servicio:**

1. Click en el servicio creado
2. Ve a **"Settings"**:
   - **Root Directory**: `backend`
   - **Build Command**: (dejar en blanco, usará railway.json)
   - **Start Command**: (dejar en blanco, usará railway.json)
   - **Watch Paths**: `backend/**`

3. Ve a **"Variables"** y agrega:
   ```
   DATABASE_URL=postgresql://postgres:... (copia de PostgreSQL service)
   JWT_SECRET=genera-un-secreto-aleatorio-de-32-caracteres
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://tu-app.netlify.app
   ```

4. **Importante:** Por ahora deja `CORS_ORIGIN` vacío, lo actualizaremos después

5. Click en **"Deploy"**

6. Una vez desplegado, copia la URL pública del backend:
   - Va a **"Settings"** → **"Networking"** → **"Public Networking"**
   - Copia la URL (ejemplo: `https://lmsmulticentro-backend.up.railway.app`)

---

## 🌐 PARTE 2: Desplegar Frontend en Netlify (5 min)

### Paso 1: Crear cuenta en Netlify

1. Ve a https://netlify.com
2. Click en **"Sign up"** y conecta con GitHub
3. Autoriza Netlify

### Paso 2: Importar Proyecto

1. Click en **"Add new site"** → **"Import an existing project"**
2. Selecciona **"GitHub"**
3. Busca y selecciona: `Julian-Enable/LMSMulticentro`

### Paso 3: Configurar Build

En la pantalla de configuración:

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`
- **Environment variables**: Click en **"Show advanced"** → **"New variable"**
  ```
  VITE_API_URL=https://tu-backend.railway.app/api
  ```
  (Reemplaza con la URL que copiaste de Railway)

4. Click en **"Deploy site"**

5. Espera 2-3 minutos mientras Netlify construye tu app

6. Una vez terminado, copia tu URL de Netlify (ejemplo: `https://lms-multicentro.netlify.app`)

---

## 🔗 PARTE 3: Conectar Backend con Frontend (2 min)

### Actualizar CORS en Railway

1. Vuelve a **Railway**
2. Ve a tu servicio de **Backend** → **"Variables"**
3. Edita `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://tu-app.netlify.app
   ```
   (Usa la URL exacta que te dio Netlify)

4. Railway redesplegará automáticamente el backend

---

## 👤 PARTE 4: Crear Usuario Administrador (3 min)

### Opción A: Desde Prisma Studio (Recomendado)

1. En Railway, abre una terminal del backend:
   - Click en tu servicio backend
   - Ve a **"Deployments"** → **"View Logs"**
   - O usa Railway CLI

2. Ejecuta:
   ```bash
   npm run create-admin admin tupassword admin@tuempresa.com
   ```

### Opción B: Directamente en la Base de Datos

1. En Railway, click en tu **PostgreSQL database**
2. Ve a **"Data"** o conecta con una herramienta SQL
3. Ejecuta:
   ```sql
   -- Primero hashea tu contraseña con bcrypt (10 rounds)
   -- Puedes usar: https://bcrypt-generator.com/
   -- Ejemplo: "admin123" → "$2a$10$..."
   
   INSERT INTO "User" (id, username, email, password, "firstName", "lastName", role, "isActive")
   VALUES (
     gen_random_uuid(),
     'admin',
     'admin@tuempresa.com',
     '$2a$10$TU_PASSWORD_HASHEADO_AQUI',
     'Admin',
     'Sistema',
     'ADMIN',
     true
   );
   ```

---

## ✅ VERIFICACIÓN FINAL

### Prueba que todo funcione:

1. **Abre tu app en Netlify**: `https://tu-app.netlify.app`

2. **Haz login** con:
   - Usuario: `admin`
   - Contraseña: la que configuraste

3. **Verifica funcionalidades**:
   - ✅ Login funciona
   - ✅ Puedes ver la página principal
   - ✅ El panel de Admin es accesible
   - ✅ Puedes crear categorías, videos, temas

---

## 🔧 Variables de Entorno - Resumen

### Railway (Backend)
```bash
DATABASE_URL=postgresql://postgres:... (automático de Railway)
JWT_SECRET=un-secreto-super-seguro-de-32-caracteres-minimo
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://tu-app.netlify.app
```

### Netlify (Frontend)
```bash
VITE_API_URL=https://tu-backend.railway.app/api
```

---

## 🎯 URLs Finales

Anota tus URLs aquí:

- **Frontend (Netlify)**: `https://___________.netlify.app`
- **Backend (Railway)**: `https://___________.up.railway.app`
- **API Endpoint**: `https://___________.up.railway.app/api`

---

## 📱 BONUS: Dominios Personalizados (Opcional)

### Netlify - Dominio Custom

1. En Netlify → **"Domain settings"**
2. Click en **"Add custom domain"**
3. Sigue las instrucciones para configurar tu dominio

### Railway - Dominio Custom

1. En Railway → Backend service → **"Settings"** → **"Networking"**
2. Click en **"Custom Domain"**
3. Agrega tu dominio y sigue instrucciones

---

## 🐛 Solución de Problemas

### Error: "Network Error" en el frontend

**Causa**: Frontend no puede conectarse al backend

**Solución**:
1. Verifica que `VITE_API_URL` en Netlify tenga la URL correcta
2. Verifica que `CORS_ORIGIN` en Railway tenga la URL de Netlify
3. Redespliega ambos servicios

### Error: "Failed to load Prisma Client"

**Causa**: Prisma no se generó correctamente

**Solución**:
1. En Railway, ve a tu backend → **"Settings"**
2. Verifica que el **Build Command** sea:
   ```
   npm install && npx prisma generate && npm run build
   ```
3. Redespliega

### Error: "Database connection failed"

**Causa**: DATABASE_URL incorrecta

**Solución**:
1. En Railway, verifica que el servicio backend tenga acceso a PostgreSQL
2. En **"Variables"**, verifica que `DATABASE_URL` esté correcta
3. Debe empezar con `postgresql://`

### Frontend muestra página en blanco

**Causa**: Rutas de React Router no configuradas

**Solución**:
El archivo `netlify.toml` ya tiene la configuración correcta de redirects.
Si persiste, verifica que esté en la raíz del proyecto.

---

## 📊 Monitoreo y Logs

### Ver logs del Backend (Railway)

1. Ve a tu servicio backend en Railway
2. Click en **"Deployments"**
3. Click en el último deployment → **"View Logs"**

### Ver logs del Frontend (Netlify)

1. Ve a tu sitio en Netlify
2. Click en **"Deploys"**
3. Click en el último deploy → Ver logs de build

---

## 🔄 Actualizaciones Futuras

### Para actualizar el código:

1. **Haz push a GitHub**:
   ```bash
   git add .
   git commit -m "Actualización del sistema"
   git push
   ```

2. **Railway y Netlify se actualizan automáticamente**
   - Railway redespliega el backend automáticamente
   - Netlify reconstruye el frontend automáticamente

3. **Para forzar un redespliegue manual**:
   - **Railway**: Click en el servicio → **"Deployments"** → **"Redeploy"**
   - **Netlify**: **"Deploys"** → **"Trigger deploy"**

---

## 📋 Checklist Post-Deployment

- [ ] ✅ Backend desplegado en Railway
- [ ] ✅ PostgreSQL funcionando en Railway
- [ ] ✅ Frontend desplegado en Netlify
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ CORS configurado correctamente
- [ ] ✅ Migraciones de BD ejecutadas
- [ ] ✅ Usuario administrador creado
- [ ] ✅ Login funciona desde el frontend
- [ ] ✅ Panel de Admin accesible
- [ ] ✅ Crear/editar contenido funciona
- [ ] ✅ Búsqueda funciona
- [ ] ✅ Reproductor de video funciona

---

## 🎉 ¡Listo!

Tu aplicación está ahora en producción:

- **Frontend**: Accesible desde cualquier navegador
- **Backend**: API REST funcionando 24/7
- **Base de Datos**: PostgreSQL gestionada por Railway
- **Actualizaciones**: Automáticas con cada push a GitHub

**Costos**:
- Railway: Gratis hasta 500 horas/mes (suficiente para desarrollo)
- Netlify: Gratis para proyectos open source

---

## 📞 Recursos Útiles

- **Railway Docs**: https://docs.railway.app
- **Netlify Docs**: https://docs.netlify.com
- **Prisma Docs**: https://www.prisma.io/docs
- **React Router**: https://reactrouter.com

---

**¿Problemas?** Revisa los logs en Railway y Netlify para identificar errores específicos.
