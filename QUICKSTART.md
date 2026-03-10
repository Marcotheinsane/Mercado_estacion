# 🚀 INICIO RÁPIDO - Mercado Estación API

## En 5 Minutos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar .env.local - Agregar tu URL de Neon
# DATABASE_URL=postgresql://...
```

### 3. Obtener URL de Neon
1. Ve a https://console.neon.tech
2. Selecciona tu proyecto
3. Click "Connect" → "PostgreSQL"
4. Copia la cadena completa (incluir `?sslmode=require`)
5. Pega en `.env.local`

### 4. Crear tablas en Neon (si no existen)
En el SQL Editor de Neon Console:

```sql
CREATE TABLE IF NOT EXISTS Giro (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    categoria VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Cliente (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rut VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255),
    direccion VARCHAR(255),
    giro_principal_id INTEGER REFERENCES Giro(id),
    tipo_persona CHAR(1) CHECK (tipo_persona IN ('N', 'J')),
    observaciones TEXT
);

CREATE TABLE IF NOT EXISTS Cliente_Giro (
    cliente_id INTEGER REFERENCES Cliente(id) ON DELETE CASCADE,
    giro_id INTEGER REFERENCES Giro(id) ON DELETE CASCADE,
    PRIMARY KEY (cliente_id, giro_id)
);
```

### 5. Ejecutar localmente
```bash
npm run dev
```

API está en `http://localhost:3000`

### 6. Testear un endpoint
```bash
curl -X POST http://localhost:3000/api/giros \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Comercio","categoria":"Retail"}'
```

## Desplegar en Vercel

### 1. Crear repositorio Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Push a GitHub
```bash
git remote add origin https://github.com/tu-usuario/mercado-estacion
git branch -M main
git push -u origin main
```

### 3. Conectar a Vercel
1. Ve a https://vercel.com
2. "New Project"
3. Selecciona tu repo
4. Deploy

### 4. Agregar variable de entorno
En Vercel Dashboard:
- Settings → Environment Variables
- Agregar `DATABASE_URL` con tu URL de Neon
- Click "Save"

### 5. Redeploy
- Deployments → Click en despliegue fallido
- "Redeploy"

¡Listo! Tu API está online 🎉

## URLs Útiles

| Recurso | URL |
|---------|-----|
| Neon Console | https://console.neon.tech |
| Vercel Dashboard | https://vercel.com/dashboard |
| Postman Collection | `/postman-collection.json` |
| Documentación Completa | `/README.md` |
| Guía de Despliegue | `/DEPLOY.md` |
| Arquitectura | `/ARCHITECTURE.md` |
| Base de Datos | `/DATABASE.md` |

## Primeras Acciones

### Crear un giro
```bash
curl -X POST http://localhost:3000/api/giros \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Comercio",
    "categoria": "Retail"
  }'
```

### Crear un cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "rut": "12.345.678-9",
    "nombre": "Juan",
    "apellido": "Pérez",
    "tipo_persona": "N",
    "direccion": "Calle 1 #123",
    "giro_principal_id": 1
  }'
```

### Listar clientes
```bash
curl http://localhost:3000/api/clientes
```

## Estructura
```
api/                    ← Endpoints
lib/                    ← Librerías compartidas
middleware/             ← Middleware
├── README.md           ← Documentación principal
├── DEPLOY.md           ← Guía de despliegue
├── ARCHITECTURE.md     ← Arquitectura técnica
├── DATABASE.md         ← Esquema de BD
├── EXAMPLES.sh         ← Ejemplos de curl
├── test-api.js         ← Tests automáticos
└── package.json        ← Dependencias
```

## Troubleshooting

### ❌ "DATABASE_URL no está definido"
✅ Verificar `.env.local` existe y tiene DATABASE_URL

### ❌ "Error de conexión"
✅ Verificar URL es completa (con `?sslmode=require`)
✅ Copiar directamente desde Neon Console

### ❌ "RUT inválido"
✅ Verificar formato: XX.XXX.XXX-X
✅ Validar dígito verificador

### ❌ "Puerto 3000 en uso"
✅ `npx kill-port 3000` o usar otro puerto

## Documentación

| Archivo | Contenido |
|---------|-----------|
| `README.md` | Documentación completa de endpoints |
| `DEPLOY.md` | Guía paso-a-paso de despliegue |
| `ARCHITECTURE.md` | Explicación técnica profunda |
| `DATABASE.md` | Schema y queries comunes |

## Soporte

- 📚 Ver README.md para más detalles
- 🔧 Ver DEPLOY.md para despliegue
- 🏗️ Ver ARCHITECTURE.md para técnica
- 🗄️ Ver DATABASE.md para BD

---

¡Estás listo para crear giros y gestionar clientes! 🎊
