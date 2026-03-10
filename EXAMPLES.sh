#!/bin/bash

# EXAMPLES.sh - Ejemplos de requests a la API
# Reemplaza la URL base con tu dominio de Vercel

API_URL="http://localhost:3000"  # Para desarrollo local
# API_URL="https://tu-proyecto.vercel.app"  # Para producción

echo "=========================================="
echo "EJEMPLOS DE API - Mercado Estación"
echo "=========================================="
echo ""

# ========== GIROS ==========

echo "1. CREAR UN GIRO"
echo "=================="
curl -X POST "$API_URL/api/giros" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Comercio",
    "categoria": "Retail"
  }'
echo -e "\n\n"

echo "2. LISTAR GIROS"
echo "==============="
curl "$API_URL/api/giros?page=1&limit=20"
echo -e "\n\n"

echo "3. OBTENER GIRO POR ID"
echo "======================"
curl "$API_URL/api/giros/1"
echo -e "\n\n"

# ========== CLIENTES ==========

echo "4. CREAR UN CLIENTE"
echo "==================="
curl -X POST "$API_URL/api/clientes" \
  -H "Content-Type: application/json" \
  -d '{
    "rut": "12.345.678-9",
    "nombre": "Juan",
    "apellido": "Pérez",
    "direccion": "Calle 1 #123",
    "tipo_persona": "N",
    "giro_principal_id": 1,
    "observaciones": "Cliente importante"
  }'
echo -e "\n\n"

echo "5. LISTAR CLIENTES"
echo "=================="
curl "$API_URL/api/clientes?page=1&limit=10"
echo -e "\n\n"

echo "6. OBTENER CLIENTE POR RUT"
echo "=========================="
curl "$API_URL/api/clientes/12.345.678-9"
echo -e "\n\n"

echo "7. ACTUALIZAR CLIENTE"
echo "====================="
curl -X PUT "$API_URL/api/clientes/12.345.678-9" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "direccion": "Nueva dirección #456"
  }'
echo -e "\n\n"

# ========== GIROS SECUNDARIOS ==========

echo "8. LISTAR GIROS SECUNDARIOS DE UN CLIENTE"
echo "=========================================="
curl "$API_URL/api/clientes/12.345.678-9/giros"
echo -e "\n\n"

echo "9. ASIGNAR GIRO SECUNDARIO A CLIENTE"
echo "===================================="
curl -X POST "$API_URL/api/clientes/12.345.678-9/giros" \
  -H "Content-Type: application/json" \
  -d '{
    "giro_id": 2
  }'
echo -e "\n\n"

echo "10. ELIMINAR CLIENTE"
echo "==================="
curl -X DELETE "$API_URL/api/clientes/12.345.678-9"
echo -e "\n\n"

echo "=========================================="
echo "Fin de ejemplos"
echo "=========================================="
