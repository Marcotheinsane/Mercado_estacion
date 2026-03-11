/**
 * Endpoint: GET /api/clientes/[rut]/giros - Obtener giros secundarios
 * Endpoint: POST /api/clientes/[rut]/giros - Asignar giro secundario
 */

import { query } from '../../../lib/database.js';
import { isValidRut, cleanRut, formatRut } from '../../../lib/rutValidator.js';
import { sendSuccess, sendError, handleCors } from '../../../middleware/response.js';

/**
 * GET /api/clientes/[rut]/giros
 * Obtener giros secundarios de un cliente
 */
async function handleGet(req, res) {
    const { rut } = req.query;

    if (!rut) {
        return sendError(res, 'Se requiere el parámetro rut', 400);
    }

    // Validar y limpiar RUT
    if (!isValidRut(rut)) {
        return sendError(res, 'El RUT ingresado no es válido', 400);
    }

    const rutLimpio = cleanRut(rut);
    const rutFormato = formatRut(rut);

    // Obtener cliente
    const clienteResult = await query('SELECT id, nombre FROM Cliente WHERE rut = $1', [rutLimpio]);
    if (clienteResult.rows.length === 0) {
        return sendError(res, 'Cliente no encontrado', 404);
    }

    const clienteId = clienteResult.rows[0].id;
    const nombreCliente = clienteResult.rows[0].nombre;

    // Obtener giros secundarios
    const girosResult = await query(
        `
    SELECT g.id, g.nombre, g.categoria
    FROM Giro g
    INNER JOIN Cliente_Giro cg ON g.id = cg.giro_id
    WHERE cg.cliente_id = $1
    ORDER BY g.nombre
    `,
        [clienteId]
    );

    sendSuccess(res, {
        rut: rutFormato,
        cliente: nombreCliente,
        giros_secundarios: girosResult.rows,
        total: girosResult.rows.length,
    });
}

/**
 * POST /api/clientes/[rut]/giros
 * Asignar un giro secundario a un cliente
 * Body: { giro_id }
 */
async function handlePost(req, res) {
    const { rut } = req.query;
    const { giro_id } = req.body;

    if (!rut) {
        return sendError(res, 'Se requiere el parámetro rut', 400);
    }

    if (!giro_id) {
        return sendError(res, 'Se requiere el campo giro_id', 400);
    }

    // Validar y limpiar RUT
    if (!isValidRut(rut)) {
        return sendError(res, 'El RUT ingresado no es válido', 400);
    }

    const rutLimpio = cleanRut(rut);
    const rutFormato = formatRut(rut);

    // Obtener cliente
    const clienteResult = await query('SELECT id, nombre FROM Cliente WHERE rut = $1', [rutLimpio]);
    if (clienteResult.rows.length === 0) {
        return sendError(res, 'Cliente no encontrado', 404);
    }

    const clienteId = clienteResult.rows[0].id;

    // Verificar que el giro existe
    const giroResult = await query('SELECT id, nombre, categoria FROM Giro WHERE id = $1', [giro_id]);
    if (giroResult.rows.length === 0) {
        return sendError(res, 'El giro especificado no existe', 404);
    }

    const giro = giroResult.rows[0];

    // Verificar que no es el giro principal del cliente
    const clienteGiroResult = await query('SELECT giro_principal_id FROM Cliente WHERE id = $1', [clienteId]);
    const clienteData = clienteGiroResult.rows[0];

    if (clienteData.giro_principal_id === giro_id) {
        return sendError(res, 'El giro ya es el giro principal del cliente', 409);
    }

    // Verificar que no ya existe como giro secundario
    const yaExisteResult = await query(
        'SELECT * FROM Cliente_Giro WHERE cliente_id = $1 AND giro_id = $2',
        [clienteId, giro_id]
    );

    if (yaExisteResult.rows.length > 0) {
        return sendError(res, 'El cliente ya tiene asignado este giro secundario', 409);
    }

    // Asignar giro secundario
    await query(
        'INSERT INTO Cliente_Giro (cliente_id, giro_id) VALUES ($1, $2)',
        [clienteId, giro_id]
    );

    sendSuccess(res, {
        mensaje: 'Giro secundario asignado correctamente',
        rut: rutFormato,
        giro: {
            id: giro.id,
            nombre: giro.nombre,
            categoria: giro.categoria,
        },
    }, 201);
}

/**
 * Handler principal - Compatible con Vercel Functions
 */
export default async function handler(req, res) {
    if (handleCors(req, res)) return;

    if (req.method === 'GET') {
        return await handleGet(req, res);
    } else if (req.method === 'POST') {
        return await handlePost(req, res);
    } else {
        return sendError(res, 'Método no permitido', 405);
    }
}
