# 🔄 Flujo de Datos - Cómo Funciona la API

## Diagrama General de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE / FRONTEND                        │
│              (Navegador, Postman, Curl, App)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP Request
                       │ GET /api/clientes/12.345.678-9
                       │
                       ▼
        ┌──────────────────────────────────┐
        │   Vercel Edge (Global CDN)       │
        │  (Caching, Routing, Security)    │
        └──────────────┬───────────────────┘
                       │
                       │ Request body
                       │ RUT, Query params
                       │
                       ▼
        ┌──────────────────────────────────┐
        │   Vercel Serverless Function     │
        │   /api/clientes/[rut].js         │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  CORS Middleware Check           │
        │  ├─ Is OPTIONS? → 200            │
        │  └─ Continue → next              │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  Input Validation                │
        │  ├─ RUT valid?                   │
        │  ├─ Format correct?              │
        │  └─ Required fields?             │
        └──────────────┬───────────────────┘
                       │ ✓ Válido
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  lib/database.js                 │
        │  Obtener Pool de Conexiones      │
        │  ├─ Existe? → Reutilizar        │
        │  └─ No existe? → Crear          │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  PostgreSQL Query                │
        │  async query(sql, params)        │
        │  Prepared Statement              │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │   Neon PostgreSQL (Servidor)     │
        │   ├─ SELECT cliente WHERE rut=?  │
        │   ├─ SELECT giro WHERE id=?      │
        │   └─ SELECT cliente_giro ...     │
        └──────────────┬───────────────────┘
                       │
                       │ Resultados
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  Procesar Resultados             │
        │  ├─ Mapear filas                 │
        │  ├─ Enriquecer datos             │
        │  └─ Formatear respuesta          │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  middleware/response.js          │
        │  sendSuccess(res, data, 200)     │
        │  {                               │
        │    success: true,                │
        │    data: { ... },                │
        │    error: null                   │
        │  }                               │
        └──────────────┬───────────────────┘
                       │
                       │ HTTP Response
                       │ Content-Type: application/json
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                    CLIENTE RECIBE:                           │
│              Status: 200 OK                                 │
│              Content-Type: application/json                 │
│              Body: JSON con cliente y giros                │
└──────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ GET /api/clientes/:rut - Flujo Detallado

```
REQUEST:
═════════════════════════════════════════════════════════════

GET http://localhost:3000/api/clientes/12.345.678-9

Headers:
  Host: localhost:3000
  User-Agent: curl/7.64.1
  Accept: */*


PROCESSING:
═════════════════════════════════════════════════════════════

1. Vercel recibe request
   ├─ URL: /api/clientes/[rut].js
   ├─ Método: GET
   └─ RUT param: "12.345.678-9"

2. Ejecuta función: api/clientes/[rut].js
   ├─ req.method = "GET"
   ├─ req.query.rut = "12.345.678-9"
   └─ Llamar handleGet(req, res)

3. handleGet() executes:
   ├─ Validar RUT
   │  └─ isValidRut("12.345.678-9") → true
   ├─ Limpiar RUT
   │  └─ cleanRut("12.345.678-9") → "12345678-9"
   ├─ Query BD
   │  SQL: SELECT c.*, g.* FROM Cliente c 
   │       LEFT JOIN Giro g ON c.giro_principal_id = g.id
   │       WHERE c.rut = '12345678-9'
   │  ↓ Neon ejecuta
   │  ↓ Retorna 1 fila
   ├─ Query giros secundarios
   │  SQL: SELECT g.* FROM Giro g
   │       INNER JOIN Cliente_Giro cg ON g.id = cg.giro_id
   │       WHERE cg.cliente_id = 1
   │  ↓ Neon ejecuta
   │  ↓ Retorna 2 filas
   └─ Procesar resultados
      ├─ Mapear cliente (formatear RUT)
      ├─ Mapear giros
      └─ Construir respuesta

4. sendSuccess() genera response
   ├─ Status: 200
   ├─ Headers: CORS, Content-Type
   └─ Body: JSON

RESPONSE:
═════════════════════════════════════════════════════════════

HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *
Content-Length: 450

{
  "success": true,
  "data": {
    "id": 1,
    "rut": "12.345.678-9",
    "nombre": "Juan",
    "apellido": "Pérez",
    "direccion": "Calle 1 #123",
    "tipo_persona": "N",
    "observaciones": "Cliente VIP",
    "giro_principal": {
      "id": 1,
      "nombre": "Comercio",
      "categoria": "Retail"
    },
    "giros_secundarios": [
      {
        "id": 2,
        "nombre": "Servicios",
        "categoria": "Consultoría"
      },
      {
        "id": 3,
        "nombre": "Tecnología",
        "categoria": "Informática"
      }
    ]
  },
  "error": null
}
```

---

## 2️⃣ POST /api/clientes - Flujo Detallado

```
REQUEST:
═════════════════════════════════════════════════════════════

POST http://localhost:3000/api/clientes
Content-Type: application/json

Body:
{
  "rut": "12.345.678-9",
  "nombre": "Juan",
  "apellido": "Pérez",
  "direccion": "Calle 1 #123",
  "tipo_persona": "N",
  "giro_principal_id": 1,
  "observaciones": "Cliente nuevo"
}


PROCESSING:
═════════════════════════════════════════════════════════════

1. Vercel recibe request
   ├─ URL: /api/clientes.js
   ├─ Método: POST
   └─ Body está en req.body

2. Ejecuta función: api/clientes.js
   ├─ req.method = "POST"
   └─ Llamar handlePost(req, res)

3. handlePost() executes:
   ├─ Extraer campos del body
   │  ├─ rut = "12.345.678-9"
   │  ├─ nombre = "Juan"
   │  ├─ tipo_persona = "N"
   │  └─ ... más campos
   ├─ Validar campos obligatorios
   │  ├─ ¿rut? → YES
   │  ├─ ¿nombre? → YES
   │  ├─ ¿tipo_persona? → YES
   │  └─ OK → continuar
   ├─ Validar RUT
   │  ├─ isValidRut("12.345.678-9") → true
   │  └─ OK → continuar
   ├─ Validar tipo_persona
   │  ├─ ¿Es 'N' o 'J'? → YES ('N')
   │  └─ OK → continuar
   ├─ Limpiar RUT
   │  └─ rutLimpio = "12345678-9"
   ├─ Verificar si RUT ya existe
   │  SQL: SELECT id FROM Cliente WHERE rut = '12345678-9'
   │  ↓ Retorna: [vacío]
   │  └─ OK → no existe
   ├─ Verificar giro existe
   │  SQL: SELECT id FROM Giro WHERE id = 1
   │  ↓ Retorna: [{id: 1}]
   │  └─ OK → existe
   ├─ INSERT a base de datos
   │  SQL: INSERT INTO Cliente (rut, nombre, ...) 
   │       VALUES ('12345678-9', 'Juan', ...)
   │       RETURNING *
   │  ↓ Neon ejecuta
   │  ↓ Retorna: cliente creado
   └─ Enriquecer respuesta con giro

4. sendSuccess() genera response
   ├─ Status: 201 (Created)
   ├─ Headers: CORS, Content-Type
   └─ Body: JSON con cliente

RESPONSE:
═════════════════════════════════════════════════════════════

HTTP/1.1 201 Created
Content-Type: application/json
Access-Control-Allow-Origin: *

{
  "success": true,
  "data": {
    "id": 1,
    "rut": "12.345.678-9",
    "nombre": "Juan",
    "giro_principal": {...},
    ...
  },
  "error": null
}
```

---

## 3️⃣ Error Path - RUT Duplicado

```
REQUEST:
═════════════════════════════════════════════════════════════

POST /api/clientes
Body: {
  "rut": "12.345.678-9",  ← Ya existe en BD
  "nombre": "Otro",
  "tipo_persona": "N"
}


PROCESSING:
═════════════════════════════════════════════════════════════

handlePost() executes:
├─ Validar campos → OK
├─ Validar RUT → OK
├─ Verificar si RUT ya existe
│  SQL: SELECT id FROM Cliente WHERE rut = '12345678-9'
│  ↓ Retorna: [{id: 1}]  ← EXISTE!
│  └─ ERROR: RUT duplicado
└─ sendError(res, "El RUT ya existe...", 409)

RESPONSE:
═════════════════════════════════════════════════════════════

HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "success": false,
  "data": null,
  "error": "El RUT ya existe en el sistema"
}

Nota: Status 409 = Conflict (recurso ya existe)
```

---

## 4️⃣ Connection Flow - Pool Reutilización

```
Primera invocación:
═════════════════════════════════════════════════════════════

function getPool() {
  if (!pool) {  ← pool = null
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 1  ← Solo 1 conexión para serverless
    })
  }
  return pool  ← Retorna: NEW pool
}


Segunda invocación (mismo proceso):
═════════════════════════════════════════════════════════════

function getPool() {
  if (!pool) {  ← pool = {Pool object}
    ├─ Este if se SALTA
    └─ pool se mantiene
  }
  return pool  ← Retorna: EXISTING pool
}

Beneficio:
├─ Conexión reutilizada (sin overhead)
├─ Más rápido
└─ Optimizado para serverless


Validación de RUT Flow:
═════════════════════════════════════════════════════════════

isValidRut("12.345.678-9")
├─ Limpiar: "12345678-9"
├─ Validar formato: /^\d{8}[0-9K]$/
│  └─ Match: ✓
├─ Extraer dígitos: "1234567"
├─ Calcular checksum (módulo 11)
│  Posición: 1 2 3 4 5 6 7 8
│  Dígito:   1 2 3 4 5 6 7 8
│  Factor:   2 3 4 5 6 7 2 3
│  
│  Suma = (1×2) + (2×3) + (3×4) + ... + (8×3) = X
│  Verificador = 11 - (X mod 11)
│  
│  Si resultado = 11 → Digito = '0'
│  Si resultado = 10 → Digito = 'K'
│  Otro → Digito = resultado
├─ Comparar: "9" === "9" ✓
└─ Return: true
```

---

## 5️⃣ Database Interaction - Query Execution

```
Query en handleGet():
═════════════════════════════════════════════════════════════

const result = await query(
  `SELECT c.id, c.rut, c.nombre, ... 
   FROM Cliente c
   LEFT JOIN Giro g ON c.giro_principal_id = g.id
   WHERE c.rut = $1`,
  ['12345678-9']  ← Parámetros separados (seguridad)
)

query() function:
├─ Obtener conexión del pool
│  connection = getPool().connect()
├─ Ejecutar query con parámetros
│  result = await connection.query(sql, params)
│  
│  PostgreSQL:
│  - Prepara statement: SELECT ... WHERE c.rut = $1
│  - Bind param 1 = '12345678-9'
│  - Ejecuta
│  - Retorna rows
├─ Liberar conexión
│  connection.release()
│  
│  (Conexión vuelve al pool)
└─ Return: result {rows: [...], rowCount: 1}


Resultado en Application:
═════════════════════════════════════════════════════════════

result.rows = [
  {
    id: 1,
    rut: '12345678-9',
    nombre: 'Juan',
    apellido: 'Pérez',
    ...,
    giro_id: 1,
    giro_nombre: 'Comercio',
    giro_categoria: 'Retail'
  }
]

Mapea a:
{
  id: 1,
  rut: '12.345.678-9',  ← Re-formatea con puntos
  nombre: 'Juan',
  ...,
  giro_principal: {
    id: 1,
    nombre: 'Comercio',
    categoria: 'Retail'
  }
}
```

---

## 6️⃣ Complete Request-Response Cycle

```
TIME: 0ms
┌─────────────────────────────────────────┐
│ Cliente envía HTTP GET                  │
└─────────────────────────────────────────┘

TIME: 10ms
┌─────────────────────────────────────────┐
│ Vercel Edge recibe y rutea              │
│ → /api/clientes/[rut].js                │
└─────────────────────────────────────────┘

TIME: 20ms
┌─────────────────────────────────────────┐
│ Función Node.js se inicia               │
│ handleGet(req, res) called              │
└─────────────────────────────────────────┘

TIME: 30ms
┌─────────────────────────────────────────┐
│ Validación de RUT                       │
│ isValidRut() → true                     │
└─────────────────────────────────────────┘

TIME: 40ms
┌─────────────────────────────────────────┐
│ Obtener conexión de pool                │
│ (reutiliza existente)                   │
└─────────────────────────────────────────┘

TIME: 50ms
┌─────────────────────────────────────────┐
│ Query 1: SELECT Cliente + Giro principal│
│ network latency a Neon: ~50ms           │
│ database processing: ~10ms              │
└─────────────────────────────────────────┘

TIME: 110ms
┌─────────────────────────────────────────┐
│ Query 2: SELECT giros secundarios       │
│ network latency: ~50ms                  │
│ database processing: ~5ms               │
└─────────────────────────────────────────┘

TIME: 165ms
┌─────────────────────────────────────────┐
│ Mapear y procesar resultados            │
│ Construir respuesta JSON                │
└─────────────────────────────────────────┘

TIME: 170ms
┌─────────────────────────────────────────┐
│ sendSuccess() prepara response          │
│ {                                       │
│   success: true,                        │
│   data: {...},                          │
│   error: null                           │
│ }                                       │
└─────────────────────────────────────────┘

TIME: 175ms
┌─────────────────────────────────────────┐
│ HTTP Response enviado al cliente        │
│ Status: 200 OK                          │
│ Content-Type: application/json          │
└─────────────────────────────────────────┘

TOTAL TIME: ~175ms (0.175 segundos)
```

---

## Error Handling Path

```
Si ocurre un error:
═════════════════════════════════════════════════════════════

try {
  // ... código
  await query(sql, params)  ← ERROR de base de datos
} catch (error) {
  console.error('Error:', error)
  sendError(res, error.message, 500)
  
  Response:
  {
    "success": false,
    "data": null,
    "error": "Error message aquí"
  }
  Status: 500
}
```

---

## CORS Handling

```
Cliente envía preflight (OPTIONS):
═════════════════════════════════════════════════════════════

OPTIONS /api/clientes HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type


Función handleCors():
├─ enableCors(res)
│  ├─ SET: Access-Control-Allow-Origin: *
│  ├─ SET: Access-Control-Allow-Methods: GET, POST, PUT, DELETE
│  ├─ SET: Access-Control-Allow-Headers: Content-Type
│  └─ SET: Content-Type: application/json
├─ if (req.method === 'OPTIONS')
│  ├─ res.status(200).end()
│  └─ return true
└─ Continuar con GET, POST, etc.


Respuesta CORS:
═════════════════════════════════════════════════════════════

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type


Cliente entonces envía request real:
═════════════════════════════════════════════════════════════

POST /api/clientes HTTP/1.1
Content-Type: application/json
Origin: http://localhost:3000

{...body...}

Vercel:
├─ enableCors(res)
├─ handlePost(req, res)  ← Procesa normalmente
└─ sendSuccess(res, data, 201)
```

---

Este documento te muestra exactamente cómo fluyen los datos desde que haces un request hasta que recibes la respuesta.

**¡Ahora sabes cómo funciona tu API! 🚀**
