/**
 * Endpoint: GET /api/clientes - Listar todos con paginación
 * Endpoint: POST /api/clientes - Crear nuevo cliente
 */

const { query } = require('../../lib/database');
const { isValidRut, formatRut, cleanRut } = require('../../lib/rutValidator');
const { handleCors, sendSuccess, sendError, asyncHandler } = require('../../middleware/response');

/**
 * GET /api/clientes?page=1&limit=10
 * Listar todos los clientes con paginación
 */
async function handleGet(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Obtener total de registros
    const countResult = await query('SELECT COUNT(*) as total FROM Cliente');
    const total = parseInt(countResult.rows[0].total);

    // Obtener clientes con su giro principal
    const result = await query(
        `
    SELECT 
      c.id,
      c.rut,
      c.nombre,
      c.apellido,
      c.direccion,
      c.tipo_persona,
      c.observaciones,
      g.id as giro_id,
      g.nombre as giro_nombre,
      g.categoria as giro_categoria
    FROM Cliente c
    LEFT JOIN Giro g ON c.giro_principal_id = g.id
    ORDER BY c.rut ASC
    LIMIT $1 OFFSET $2
    `,
        [limit, offset]
    );

    const clientes = result.rows.map(row => ({
        id: row.id,
        rut: row.rut,
        nombre: row.nombre,
        apellido: row.apellido,
        direccion: row.direccion,
        tipo_persona: row.tipo_persona,
        observaciones: row.observaciones,
        giro_principal: row.giro_id ? {
            id: row.giro_id,
            nombre: row.giro_nombre,
            categoria: row.giro_categoria,
        } : null,
    }));

    sendSuccess(res, {
        clientes,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
}

/**
 * POST /api/clientes
 * Crear nuevo cliente
 * Body: { rut, nombre, apellido, direccion, giro_principal_id?, tipo_persona, observaciones? }
 */
async function handlePost(req, res) {
    const { rut, nombre, apellido, direccion, giro_principal_id, tipo_persona, observaciones } = req.body;

    // Validar datos obligatorios
    if (!rut || !nombre || !tipo_persona) {
        return sendError(res, 'Los campos rut, nombre y tipo_persona son obligatorios', 400);
    }

    // Validar RUT
    if (!isValidRut(rut)) {
        return sendError(res, 'El RUT ingresado no es válido', 400);
    }

    // Validar tipo_persona
    if (!['N', 'J'].includes(tipo_persona)) {
        return sendError(res, 'tipo_persona debe ser "N" (Natural) o "J" (Jurídica)', 400);
    }

    const rutLimpio = cleanRut(rut);
    const rutFormato = formatRut(rut);

    try {
        // Verificar si el RUT ya existe
        const existeResult = await query('SELECT id FROM Cliente WHERE rut = $1', [rutLimpio]);
        if (existeResult.rows.length > 0) {
            return sendError(res, 'El RUT ya existe en el sistema', 409);
        }

        // Validar que el giro existe (si se proporciona)
        if (giro_principal_id) {
            const giroResult = await query('SELECT id FROM Giro WHERE id = $1', [giro_principal_id]);
            if (giroResult.rows.length === 0) {
                return sendError(res, 'El giro principal especificado no existe', 404);
            }
        }

        // Crear cliente
        const result = await query(
            `
      INSERT INTO Cliente (rut, nombre, apellido, direccion, giro_principal_id, tipo_persona, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, rut, nombre, apellido, direccion, giro_principal_id, tipo_persona, observaciones
      `,
            [rutLimpio, nombre, apellido || null, direccion || null, giro_principal_id || null, tipo_persona, observaciones || null]
        );

        const cliente = result.rows[0];

        // Enriquecer con giro principal si existe
        let giro_principal = null;
        if (cliente.giro_principal_id) {
            const giroData = await query('SELECT id, nombre, categoria FROM Giro WHERE id = $1', [cliente.giro_principal_id]);
            giro_principal = giroData.rows[0] || null;
        }

        sendSuccess(res, {
            id: cliente.id,
            rut: rutFormato,
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            direccion: cliente.direccion,
            tipo_persona: cliente.tipo_persona,
            observaciones: cliente.observaciones,
            giro_principal,
        }, 201);
    } catch (error) {
        console.error('Error al crear cliente:', error);
        throw error;
    }
}

module.exports = asyncHandler(async (req, res) => {
    if (handleCors(req, res)) return;

    if (req.method === 'GET') {
        return await handleGet(req, res);
    } else if (req.method === 'POST') {
        return await handlePost(req, res);
    } else {
        sendError(res, 'Método no permitido', 405);
    }
});
