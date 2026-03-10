# Mercado Estación - API RESTful Serverless

API RESTful serverless deploada en Vercel para gestionar clientes y giros comerciales, conectada a una base de datos Neon PostgreSQL.

## 📋 Contenido

- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración Local](#configuración-local)
- [Endpoints API](#endpoints-api)
- [Instalación en Vercel](#instalación-en-vercel)
- [Validación de RUT Chileno](#validación-de-rut-chileno)
- [Formato de Respuestas](#formato-de-respuestas)
- [Ejemplos de Uso](#ejemplos-de-uso)

## ✨ Características

✅ **Endpoints RESTful completos** para clientes y giros  
✅ **Validación de RUT chileno** con dígito verificador  
✅ **Serverless optimizado** para Vercel  
✅ **Pool de conexiones** optimizado para PostgreSQL serverless  
✅ **Manejo de transacciones** para operaciones críticas  
✅ **CORS habilitado** por defecto  
✅ **Paginación** en listados  
✅ **Respuestas consistentes** en formato JSON  
✅ **Manejo de errores** robusto  

## 📁 Estructura del Proyecto

```
.
├── api/
│   ├── clientes.js                 # GET/POST clientes
│   ├── clientes/
│   │   ├── [rut].js               # GET/PUT/DELETE cliente por RUT
│   │   └── [rut]/
│   │       └── giros.js           # GET/POST giros secundarios
│   └── giros/
│       ├── index.js               # GET/POST giros
│       └── [id].js                # GET giro por ID
├── lib/
│   ├── database.js                # Conexión a Neon
│   └── rutValidator.js            # Validación de RUT
├── middleware/
│   └── response.js                # CORS y respuestas
├── .env.example                   # Variables de entorno
├── .env.local                     # Variables locales (NO commitear)
├── vercel.json                    # Configuración de Vercel
└── package.json                   # Dependencias
```

## 🚀 Configuración Local

### 1. Clonar el repositorio

```bash
cd tu-directorio
git init
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar `.env.example` a `.env.local` y reemplazar con tus credenciales:

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
DATABASE_URL=postgresql://user:password@ep-xxxxx.neon.tech/dbname?sslmode=require
```

Para obtener la URL:
1. Ve a https://console.neon.tech
2. Selecciona tu proyecto
3. Copia la cadena de conexión PostgreSQL
4. Reemplaza `[user]` y `[password]` si es necesario

### 4. Desarrollar localmente

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`

## 📚 Endpoints API

### Clientes

#### GET `/api/clientes` - Listar todos
**Parámetros query:**
- `page` (number): Número de página (default: 1)
- `limit` (number): Registros por página (default: 10)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "clientes": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  },
  "error": null
}
```

#### GET `/api/clientes/:rut` - Obtener por RUT
**Parámetros path:**
- `rut` (string): RUT del cliente (ej: 12.345.678-9)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "rut": "12.345.678-9",
    "nombre": "Juan",
    "apellido": "Pérez",
    "direccion": "Calle 1 #123",
    "tipo_persona": "N",
    "observaciones": "Cliente frecuente",
    "giro_principal": {
      "id": 1,
      "nombre": "Comercio",
      "categoria": "Retail"
    },
    "giros_secundarios": [...]
  },
  "error": null
}
```

#### POST `/api/clientes` - Crear cliente
**Body:**
```json
{
  "rut": "12.345.678-9",
  "nombre": "Juan",
  "apellido": "Pérez",
  "direccion": "Calle 1 #123",
  "tipo_persona": "N",
  "giro_principal_id": 1,
  "observaciones": "Cliente nuevo"
}
```

#### PUT `/api/clientes/:rut` - Actualizar cliente
**Parámetros path:**
- `rut` (string): RUT del cliente

**Body:** (todos los campos son opcionales)
```json
{
  "nombre": "Juan Actualizado",
  "direccion": "Nueva dirección",
  "giro_principal_id": 2
}
```

#### DELETE `/api/clientes/:rut` - Eliminar cliente
**Parámetros path:**
- `rut` (string): RUT del cliente

### Giros

#### GET `/api/giros` - Listar todos
**Parámetros query:**
- `page` (number): Número de página (default: 1)
- `limit` (number): Registros por página (default: 20)

#### GET `/api/giros/:id` - Obtener por ID
**Parámetros path:**
- `id` (number): ID del giro

**Respuesta incluye:**
- Información del giro
- Estadísticas de clientes asociados

#### POST `/api/giros` - Crear giro
**Body:**
```json
{
  "nombre": "Tecnología",
  "categoria": "Servicios"
}
```

### Giros Secundarios del Cliente

#### GET `/api/clientes/:rut/giros` - Listar giros secundarios
**Parámetros path:**
- `rut` (string): RUT del cliente

#### POST `/api/clientes/:rut/giros` - Asignar giro secundario
**Parámetros path:**
- `rut` (string): RUT del cliente

**Body:**
```json
{
  "giro_id": 2
}
```

## 🔧 Instalación en Vercel

### 1. Preparar el código

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Conectar a Vercel

a) Opción 1: CLI de Vercel
```bash
npm install -g vercel
vercel login
vercel
```

b) Opción 2: Web
- Ve a https://vercel.com
- Conecta tu repositorio Git
- Selecciona este proyecto

### 3. Configurar variables de entorno

En el dashboard de Vercel:
1. Ve a **Settings** → **Environment Variables**
2. Agrega `DATABASE_URL` con tu URL de Neon
3. Deploy automático

```
DATABASE_URL = postgresql://user:password@ep-xxxxx.neon.tech/dbname?sslmode=require
```

### 4. Desplegar

```bash
vercel --prod
```

Tu API estará disponible en `https://tu-proyecto.vercel.app`

## ✔️ Validación de RUT Chileno

La validación de RUT se implementa en `lib/rutValidator.js`:

- **`isValidRut(rut)`**: Valida RUT con dígito verificador
- **`formatRut(rut)`**: Formatea a formato estándar (XX.XXX.XXX-X)
- **`cleanRut(rut)`**: Limpia el RUT (sin formato)

### Algoritmo de validación:
1. El RUT se limpia de puntos y guiones
2. Se valida con el algoritmo módulo 11
3. El dígito verificador puede ser 0-9 o K

### Ejemplos válidos:
- `12.345.678-9`
- `12345678-9` (sin puntos)
- `1.234.567-K`

## 📦 Formato de Respuestas

Todas las respuestas siguen este formato consistente:

**Éxito (2xx):**
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

**Error (4xx, 5xx):**
```json
{
  "success": false,
  "data": null,
  "error": "Descripción del error"
}
```

## 💡 Ejemplos de Uso

### Crear un cliente

```bash
curl -X POST https://api.vercel.app/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "rut": "12.345.678-9",
    "nombre": "Juan",
    "apellido": "Pérez",
    "tipo_persona": "N",
    "giro_principal_id": 1
  }'
```

### Obtener cliente por RUT

```bash
curl https://api.vercel.app/api/clientes/12.345.678-9
```

### Asignar giro secundario

```bash
curl -X POST https://api.vercel.app/api/clientes/12.345.678-9/giros \
  -H "Content-Type: application/json" \
  -d '{"giro_id": 2}'
```

### Actualizar cliente

```bash
curl -X PUT https://api.vercel.app/api/clientes/12.345.678-9 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "direccion": "Nueva dirección"
  }'
```

### Listar giros

```bash
curl "https://api.vercel.app/api/giros?page=1&limit=20"
```

## 📋 Estructura de la Base de Datos

Las tablas ya deben estar creadas en Neon:

```sql
CREATE TABLE Giro (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    categoria VARCHAR(100)
);

CREATE TABLE Cliente (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rut VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255),
    direccion VARCHAR(255),
    giro_principal_id INTEGER REFERENCES Giro(id),
    tipo_persona CHAR(1) CHECK (tipo_persona IN ('N', 'J')),
    observaciones TEXT
);

CREATE TABLE Cliente_Giro (
    cliente_id INTEGER REFERENCES Cliente(id) ON DELETE CASCADE,
    giro_id INTEGER REFERENCES Giro(id) ON DELETE CASCADE,
    PRIMARY KEY (cliente_id, giro_id)
);
```

## 🔐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Conexión a Neon PostgreSQL | `postgresql://...` |

## 🚨 Troubleshooting

### Error: "DATABASE_URL no está definido"
- Verifica que `.env.local` existe en la raíz del proyecto
- Verifica que `DATABASE_URL` está correctamente configurada

### Error: "Cliente no encontrado"
- Asegúrate que el RUT es válido
- El RUT debe existir en la base de datos

### Error: "El RUT ingresado no es válido"
- Verifica el formato del RUT (ej: 12.345.678-9)
- Valida que el dígito verificador sea correcto

### Conexión lenta
- El pool está optimizado para serverless con máximo 1 conexión
- Acceptable para API serverless con bajo concurrencia
- Para alto tráfico, considera aumentar `max: 5`

## 📝 Notas Importantes

1. **Serverless Optimization**: El pool usa `max: 1` para optimizar para funciones serverless. Cada invocación es independiente.

2. **RUT Storage**: Los RUTs se almacenan sin formato en la BD (sin puntos ni guiones) para normalización.

3. **Cascading Deletes**: Al eliminar un cliente, se eliminan automáticamente sus giros secundarios.

4. **CORS**: Habilitado por defecto para todas las rutas. Modifica en `middleware/response.js` si necesitas restringir.

## 📄 Licencia

MIT

---

**Creado para Mercado Estación** | Marzo 2026
#   M e r c a d o _ e s t a c i o n  
 