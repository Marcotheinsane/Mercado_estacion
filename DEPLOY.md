# 🚀 Guía Completa de Despliegue en Vercel

Esta guía te ayudará a desplegar tu API RESTful en Vercel paso a paso.

## Requisitos Previos

- ✅ Cuenta en Vercel (gratuita)
- ✅ Cuenta en Neon PostgreSQL
- ✅ Base de datos ya creada en Neon con las tablas
- ✅ Git instalado
- ✅ Node.js 18+ instalado

## PASO 1: Preparar tu Repositorio Git

### 1.1 Inicializar repositorio (si no lo has hecho)

```bash
cd "tu-directorio/Mercado Estacion"
git init
git config user.name "Tu Nombre"
git config user.email "tu@email.com"
```

### 1.2 Agregar todos los archivos

```bash
git add .
```

### 1.3 Crear commit inicial

```bash
git commit -m "Initial commit: API RESTful para clientes y giros"
```

### 1.4 Crear repositorio remoto

Ve a https://github.com/new y crea un nuevo repositorio llamado `mercado-estacion-api`

### 1.5 Conectar repositorio remoto

```bash
git remote add origin https://github.com/TU-USUARIO/mercado-estacion-api.git
git branch -M main
git push -u origin main
```

## PASO 2: Obtener URL de Conexión de Neon

### 2.1 Ve a tu proyecto en Neon

1. Abre https://console.neon.tech
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto

### 2.2 Copiar la URL de conexión

1. En el panel izquierdo, selecciona tu base de datos
2. Haz clic en el botón "Connection string" o "Connect"
3. Selecciona "PostgreSQL" como tipo de conexión
4. Copia la cadena completa que comienza con `postgresql://`

Debería verse así:
```
postgresql://user:password@ep-xxxxx.neon.tech/dbname?sslmode=require
```

### 2.3 Verifica que tu BD tenga las tablas

Ejecuta esto en el editor SQL de Neon:

```sql
-- Crear tablas si no existen
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

## PASO 3: Configurar Vercel

### 3.1 Crear cuenta en Vercel

1. Ve a https://vercel.com
2. Haz clic en "Sign Up"
3. Elige "Continue with GitHub"
4. Autoriza a Vercel acceder a tu GitHub

### 3.2 Importar proyecto

1. En el dashboard de Vercel, haz clic en "New Project"
2. Selecciona tu repositorio `mercado-estacion-api`
3. Vercel detectará automáticamente que es un proyecto Node.js
4. Haz clic en "Deploy" (sin cambiar settings por ahora)

**Nota:** El despliegue inicial fallará porque falta la variable de entorno. Eso es normal.

### 3.3 Configurar variables de entorno

1. Ve a **Settings** del proyecto en Vercel
2. Selecciona **Environment Variables**
3. Agrega una nueva variable:
   - **Name:** `DATABASE_URL`
   - **Value:** Tu URL de Neon copiada en el paso 2.2
   - **Environments:** Selecciona `Production`, `Preview`, y `Development`
4. Haz clic en "Save"

### 3.4 Redeploy

1. Ve a la pestaña **Deployments**
2. Haz clic en el "..." del despliegue fallido
3. Selecciona "Redeploy"
4. Espera a que termine el despliegue

¡Tu API ya está en vivo! 🎉

## PASO 4: Testear tu API

### 4.1 Obtener URL base

En el dashboard de Vercel, en la parte superior verás tu URL:
```
https://mercado-estacion-api-xxxxx.vercel.app
```

### 4.2 Crear un giro

```bash
curl -X POST https://mercado-estacion-api-xxxxx.vercel.app/api/giros \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Comercio",
    "categoria": "Retail"
  }'
```

Deberías recibir:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Comercio",
    "categoria": "Retail"
  },
  "error": null
}
```

### 4.3 Crear un cliente

```bash
curl -X POST https://mercado-estacion-api-xxxxx.vercel.app/api/clientes \
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

### 4.4 Obtener cliente

```bash
curl https://mercado-estacion-api-xxxxx.vercel.app/api/clientes/12.345.678-9
```

### 4.5 Listar clientes

```bash
curl https://mercado-estacion-api-xxxxx.vercel.app/api/clientes?page=1&limit=10
```

## PASO 5: Desarrollo Futuro

Cada vez que hagas cambios:

```bash
# Hacer cambios en los archivos

# Agregar cambios
git add .

# Crear commit
git commit -m "Descripción de los cambios"

# Subir cambios
git push origin main
```

Vercel se redeploy automáticamente cuando detecte cambios en `main`.

## 🔍 Monitorear tu API

### Ver logs en Vercel

1. Ve a tu proyecto en Vercel
2. Selecciona la pestaña **Functions**
3. Verás los logs de ejecución de cada endpoint

### Ver errores en base de datos

1. Ve a https://console.neon.tech
2. Selecciona tu proyecto
3. En la pestaña **Monitoring** puedes ver queries lentas

## 📊 Optimizaciones para Producción

### 1. Aumentar pool de conexiones

Si tu API tiene muchos usuarios, edita `lib/database.js`:

```javascript
pool = new Pool({
  connectionString,
  max: 5,  // Cambiar de 1 a 5
});
```

### 2. Agregar caché de respuestas

Puedes agregar headers de caché en `middleware/response.js`:

```javascript
res.setHeader('Cache-Control', 'public, max-age=60');
```

### 3. Monitoreo y alertas

1. En Vercel, ve a **Monitoring**
2. Crea alertas para:
   - Error rate > 1%
   - Response time > 2s

## 📝 Checklist de Despliegue

- ✅ Repositorio Git creado y commiteado
- ✅ Variables de entorno configuradas en Vercel
- ✅ Base de datos Neon con tablas creadas
- ✅ Despliegue exitoso en Vercel
- ✅ Endpoints testeados y funcionando
- ✅ Logs revisados en Vercel

## 🆘 Troubleshooting

### "Error: connect ECONNREFUSED"

**Problema:** No puede conectar a la base de datos

**Soluciones:**
1. Verifica que `DATABASE_URL` está correctamente en Vercel
2. Copia la URL completa de Neon (con `?sslmode=require` al final)
3. Espera 1-2 minutos después de agregar la variable

### "500 Internal Server Error"

**Problema:** Error en la ejecución de la función

**Soluciones:**
1. Ve a **Deployments** → **Functions** en Vercel
2. Revisa los logs de la función que falló
3. Asegúrate que la consulta SQL es válida

### "RUT no es válido"

**Problema:** El validador rechaza el RUT

**Soluciones:**
1. Verifica el formato: debe ser XX.XXX.XXX-X
2. Valida que el dígito verificador sea correcto
3. Usa un RUT válido para testing

## 🎯 Próximos Pasos

1. **Agreagar autenticación:** Implementa JWT
2. **Agregar validaciones adicionales:** Email, teléfono
3. **Documentación interactiva:** Usa Swagger/OpenAPI
4. **Tests automatizados:** Agrega Jest
5. **CI/CD mejorado:** Eslint, pruebas antes de deploy

---

¡Tu API está lista para producción! 🚀

Para preguntas, revisa el README.md o la documentación de Neon/Vercel.
