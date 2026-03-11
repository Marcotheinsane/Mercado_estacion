# Mercado Estación

Aplicación Next.js 14 con conexión a Neon PostgreSQL.

## Setup Rápido

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.local.example .env.local
```
Edita `.env.local` y asegúrate de que DATABASE_URL esté correctamente configurado.

3. **Ejecutar en desarrollo:**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura de Archivos

- `/app/page.js` - Página principal con UI
- `/app/layout.js` - Layout global
- `/app/api/clientes/route.js` - GET/POST clientes
- `/app/api/clientes/[id]/route.js` - GET/PUT/DELETE cliente
- `/app/api/giros/route.js` - GET/POST giros
- `/app/api/giros/[id]/route.js` - GET/PUT/DELETE giro
- `/lib/db.js` - Conexión a Neon
- `package.json` - Dependencias
- `tailwind.config.js` - Config de Tailwind

## Deploy en Vercel

1. Crea un repositorio en GitHub
2. Conecta tu repositorio a Vercel
3. Agrega las variables de entorno en Vercel (DATABASE_URL)
4. Deploy automático en cada push a main

## Tablas de la Base de Datos

### cliente
- id (integer)
- rut (varchar)
- nombre (varchar)
- apellido (varchar)
- direccion (varchar)
- giro_principal_id (integer)
- tipo_persona (char)
- email (varchar)
- telefono (varchar)
- observaciones (text)
- created_at (timestamp)

### giro
- id (integer)
- nombre (varchar)
- categoria (varchar)
- created_at (timestamp)

### cliente_giro
- cliente_id (integer)
- giro_id (integer)
