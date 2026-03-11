# Mercado Estación

![Project banner](./public/example.png)

Aplicación web construida con **Next.js 14** que permite gestionar clientes y giros comerciales utilizando **PostgreSQL en Neon** como base de datos.

---

# Descripción general

Este repositorio contiene una aplicación web desarrollada con **Next.js 14** que implementa una API interna mediante **Route Handlers** para gestionar información de clientes y sus giros comerciales.

La aplicación funciona como una solución full-stack ligera donde:

- **Next.js** maneja la interfaz y los endpoints API
- **PostgreSQL en Neon** almacena la información
- **Tailwind CSS** gestiona el estilo visual

El objetivo del proyecto es ofrecer una estructura clara para gestionar datos relacionales mediante un CRUD completo.

---

# Alcance del proyecto

## Incluye

- Interfaz web construida con Next.js
- API REST interna mediante `app/api`
- Operaciones CRUD para clientes y giros
- Conexión a base de datos PostgreSQL (Neon)
- Validación básica de datos
- Estilizado con Tailwind CSS

## No incluye

- Sistema de autenticación
- Control de roles o permisos
- Lógica de negocio compleja
- Microservicios externos

---

# Arquitectura

El proyecto utiliza la arquitectura **App Router de Next.js 14**, donde:

- La **UI** se encuentra en `/app`
- Los **endpoints API** se encuentran en `/app/api`
- La **conexión a base de datos** se centraliza en `/lib/db.js`

Flujo básico:

```
UI (Next.js)
      ↓
API Routes (/app/api)
      ↓
Neon PostgreSQL
```

---

# Tecnologías utilizadas

- Next.js 14
- React
- PostgreSQL
- Neon Database
- Tailwind CSS
- Node.js
- npm
- vercel 
---

# Configuración del entorno

## Requisitos previos

- Node.js (versión LTS recomendada)
- npm
- Base de datos en Neon

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone <repo-url>
cd mercado-estacion
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y configura la conexión a la base de datos:

```
DATABASE_URL=postgresql://user:password@host/database
```

---

# Ejecución en desarrollo

```bash
npm run dev
```

La aplicación esta disponible en:

```
https://mercado-estacion.vercel.app/
```

---

# Estructura del proyecto

```
app/
 ├─ api/
 │   ├─ clientes/
 │   │   ├─ route.js
 │   │   └─ [id]/route.js
 │   ├─ giros/
 │   │   ├─ route.js
 │   │   └─ [id]/route.js
 │
 ├─ layout.js
 └─ page.js

lib/
 └─ db.js

public/
 └─ example.png

tailwind.config.js
package.json
```

Descripción:

- `/app/page.js` → Página principal  
- `/app/layout.js` → Layout global  
- `/app/api/clientes` → CRUD de clientes  
- `/app/api/giros` → CRUD de giros  
- `/lib/db.js` → Conexión a Neon PostgreSQL  
- `/public` → Archivos estáticos (imágenes)

---

# Licencia

Este proyecto se distribuye bajo la licencia **MIT**.