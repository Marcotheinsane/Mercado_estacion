/**
 * Endpoint: GET /api/giros - Listar todos los giros
 * Endpoint: POST /api/giros - Crear nuevo giro
 * 
 * v1.2 - Fixed for Vercel serverless
 */

const { query } = require('../lib/database');
const { handleCors, sendSuccess, sendError, asyncHandler } = require('../middleware/response');

/**
 * GET /api/giros?page=1&limit=20
 * Listar todos los giros con paginación
 */
async function handleGet(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Obtener total de giros
    const countResult = await query('SELECT COUNT(*) as total FROM Giro');
    const total = parseInt(countResult.rows[0].total);

    // Obtener giros
    const result = await query(
        `
    SELECT id, nombre, categoria
    FROM Giro
    ORDER BY nombre ASC
    LIMIT $1 OFFSET $2
    `,
        [limit, offset]
    );

    sendSuccess(res, {
        giros: result.rows,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
}

/**
 * POST /api/giros
 * Crear nuevo giro
 * Body: { nombre, categoria? }
 */
async function handlePost(req, res) {
    const { nombre, categoria } = req.body;

    // Validar datos obligatorios
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return sendError(res, 'El campo nombre es obligatorio', 400);
    }

    const nombreLimpio = nombre.trim();

    // Verificar que no exista un giro con el mismo nombre
    const existeResult = await query('SELECT id FROM Giro WHERE nombre = $1', [nombreLimpio]);
    if (existeResult.rows.length > 0) {
        return sendError(res, 'Ya existe un giro con ese nombre', 409);
    }

    // Crear giro
    const result = await query(
        `
    INSERT INTO Giro (nombre, categoria)
    VALUES ($1, $2)
    RETURNING id, nombre, categoria
    `,
        [nombreLimpio, categoria || null]
    );

    const giro = result.rows[0];

    sendSuccess(res, {
        id: giro.id,
        nombre: giro.nombre,
        categoria: giro.categoria,
    }, 201);
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
