# SGA - Sistema de Gestion Automotriz

Aplicacion web para la gestion de mantenimiento vehicular. Permite administrar usuarios, propietarios, vehiculos, mantenimientos, documentos adjuntos y actividad del sistema desde un panel privado.

## Caracteristicas

- Autenticacion con JWT.
- Roles de usuario: `admin` y `mecanico`.
- Gestion de usuarios administrativos.
- Registro y consulta de propietarios.
- Registro de vehiculos con propietario, kilometraje y estado.
- Programacion y seguimiento de mantenimientos.
- Historial de mantenimientos por vehiculo.
- Carga, visualizacion y descarga de documentos o facturas asociadas a mantenimientos.
- Vista de auditoria para administradores.
- Interfaz responsive con tema oscuro.

## Tecnologias

### Backend

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT
- Zod
- Multer
- bcryptjs

### Frontend

- Vue 3
- Vite
- Pinia
- Vue Router
- Axios

## Estructura Del Proyecto

```text
.
|-- backend
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   |-- schemas
|   |   |-- seeders
|   |   `-- app.js
|   `-- package.json
|-- frontend
|   |-- src
|   |   |-- api
|   |   |-- components
|   |   |-- router
|   |   |-- store
|   |   `-- views
|   `-- package.json
`-- README.md
```

## Requisitos

- Node.js compatible con el frontend: `^22.18.0` o `>=24.12.0`.
- PostgreSQL instalado y en ejecucion.
- npm.

## Configuracion Del Backend

Crear un archivo `.env` dentro de `backend` con las variables necesarias:

```env
PORT=5000
DB_HOST=localhost
DB_NAME=sga_db
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_clave_secreta
```

Tambien puedes copiar el archivo de ejemplo:

```bash
cp .env.example .env
```

Luego instalar dependencias y ejecutar el servidor:

```bash
cd backend
npm install
npm run dev
```

El backend queda disponible por defecto en:

```text
http://localhost:5000
```

La API usa el prefijo:

```text
http://localhost:5000/api
```

## Configuracion Del Frontend

Crear un archivo `.env` dentro de `frontend` para indicar la URL publica del backend:

```env
VITE_API_URL=http://localhost:5000/api
```

En produccion, cambiar este valor por la URL real del backend:

```env
VITE_API_URL=https://tu-backend.com/api
```

Instalar dependencias y ejecutar Vite:

```bash
cd frontend
npm install
npm run dev
```

El frontend se ejecuta con Vite y consume la API definida por `VITE_API_URL`. Si no existe esa variable, usa el backend local por defecto:

```text
http://localhost:5000/api
```

## Usuarios Demo

Al iniciar el backend se verifican usuarios demo mediante el seeder `backend/src/seeders/defaultUsers.js`:

| Rol | Email | Password |
| --- | --- | --- |
| Admin | `admin@admin.com` | `admin123` |
| Mecanico | `mecanico@mecanico.com` | `admin123` |

Cambiar estas credenciales antes de usar el sistema en un entorno real.

## Modulos Principales

### Autenticacion

Gestiona login, perfil de usuario y validacion de tokens JWT.

### Usuarios

Modulo administrativo para crear, editar, listar, activar o desactivar usuarios del sistema.

### Propietarios

Permite registrar datos de propietarios, incluyendo nombre, apellido, documento, telefono, email y direccion.

### Vehiculos

Permite registrar vehiculos con placa, marca, modelo, ano, color, kilometraje, estado y propietario asociado.

### Mantenimientos

Permite crear y actualizar mantenimientos preventivos, correctivos, inspecciones o mantenimientos generales. Tambien sincroniza el estado del vehiculo cuando un mantenimiento esta en progreso.

### Documentos

Permite subir archivos asociados a mantenimientos, como facturas, imagenes o documentos de soporte. El limite actual de subida es de 10 MB.

Formatos permitidos:

- PDF
- JPG/JPEG
- PNG
- GIF
- DOC
- DOCX

### Auditoria

Vista administrativa que resume actividad reciente de vehiculos, mantenimientos y documentos.

## Rutas Principales De La API

| Recurso | Ruta Base |
| --- | --- |
| Autenticacion | `/api/auth` |
| Usuarios | `/api/usuarios` |
| Propietarios | `/api/owners` |
| Vehiculos | `/api/vehicles` |
| Mantenimientos | `/api/maintenances` |
| Documentos | `/api/documents` |
| Auditoria | `/api/audit` |

## Scripts Disponibles

### Backend

```bash
npm run dev
npm start
```

Nota: el script `test` del backend no ejecuta pruebas reales actualmente.

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Notas Importantes

- El backend usa `sequelize.sync({ alter: true })`, por lo que los cambios en modelos pueden modificar el esquema de la base de datos al iniciar la aplicacion.
- No subir archivos `.env` al repositorio.
- No subir archivos sensibles ni uploads reales de produccion.
- Cambiar `JWT_SECRET` y credenciales demo antes de desplegar.

## Estado Del Proyecto

Proyecto full stack funcional para gestion automotriz, orientado a talleres, flotas o equipos que necesiten llevar control de vehiculos, mantenimientos y documentacion asociada.
