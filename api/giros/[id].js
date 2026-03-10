/**
 * Endpoint: GET /api/giros/[id] - Obtener giro por ID
 */

const { query } = require('../../lib/database');
const { handleCors, sendSuccess, sendError, asyncHandler } = require('../../middleware/response');

/**
 * GET /api/giros/[id]
 * Obtener un giro específico por ID con estadísticas
 */
async function handleGet(req, res) {
    const { id } = req.query;

    if (!id || isNaN(id)) {
        return sendError(res, 'Se requiere un ID numérico válido', 400);
    }

    // Obtener giro
    const giroResult = await query('SELECT id, nombre, categoria FROM Giro WHERE id = $1', [id]);

    if (giroResult.rows.length === 0) {
        return sendError(res, 'Giro no encontrado', 404);
    }

    const giro = giroResult.rows[0];

    // Obtener métrica: clientes que tienen este giro como principal
    const clientesPrincipalResult = await query(
        'SELECT COUNT(*) as count FROM Cliente WHERE giro_principal_id = $1',
        [id]
    );
    const clientes_principal = parseInt(clientesPrincipalResult.rows[0].count);

    // Obtener métrica: clientes que tienen este giro como secundario
    const clientesSecundarioResult = await query(
        `
    SELECT COUNT(*) as count FROM Cliente c
    INNER JOIN Cliente_Giro cg ON c.id = cg.cliente_id
    WHERE cg.giro_id = $1
    `,
        [id]
    );
    const clientes_secundario = parseInt(clientesSecundarioResult.rows[0].count);

    sendSuccess(res, {
        id: giro.id,
        nombre: giro.nombre,
        categoria: giro.categoria,
        estadisticas: {
            clientes_como_principal: clientes_principal,
            clientes_como_secundario: clientes_secundario,
            total_clientes: clientes_principal + clientes_secundario,
        },
    });
}

module.exports = asyncHandler(async (req, res) => {
    if (handleCors(req, res)) return;

    if (req.method === 'GET') {
        return await handleGet(req, res);
    } else {
        sendError(res, 'Método no permitido', 405);
    }
});
