/**
 * Endpoint: GET /api/clientes/[rut] - Obtener cliente por RUT
 * Endpoint: PUT /api/clientes/[rut] - Actualizar cliente
 * Endpoint: DELETE /api/clientes/[rut] - Eliminar cliente
 */

import { query } from '../../lib/database.js';
import { isValidRut, formatRut, cleanRut } from '../../lib/rutValidator.js';
import { sendSuccess, sendError, handleCors } from '../../middleware/response.js';

/**
 * GET /api/clientes/[rut]
 * Obtener cliente por RUT (con todos sus giros)
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
    const clienteResult = await query(
        `
    SELECT 
      c.id,
      c.rut,
      c.nombre,
      c.apellido,
      c.direccion,
      c.tipo_persona,
      c.observaciones,
      g.id as giro_principal_id,
      g.nombre as giro_principal_nombre,
      g.categoria as giro_principal_categoria
    FROM Cliente c
    LEFT JOIN Giro g ON c.giro_principal_id = g.id
    WHERE c.rut = $1
    `,
        [rutLimpio]
    );

    if (clienteResult.rows.length === 0) {
        return sendError(res, 'Cliente no encontrado', 404);
    }

    const cliente = clienteResult.rows[0];

    // Obtener giros secundarios
    const girosResult = await query(
        `
    SELECT g.id, g.nombre, g.categoria
    FROM Giro g
    INNER JOIN Cliente_Giro cg ON g.id = cg.giro_id
    WHERE cg.cliente_id = $1
    ORDER BY g.nombre
    `,
        [cliente.id]
    );

    const giro_principal = cliente.giro_principal_id ? {
        id: cliente.giro_principal_id,
        nombre: cliente.giro_principal_nombre,
        categoria: cliente.giro_principal_categoria,
    } : null;

    sendSuccess(res, {
        id: cliente.id,
        rut: rutFormato,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        direccion: cliente.direccion,
        tipo_persona: cliente.tipo_persona,
        observaciones: cliente.observaciones,
        giro_principal,
        giros_secundarios: girosResult.rows,
    });
}

/**
 * PUT /api/clientes/[rut]
 * Actualizar cliente
 * Body: { nombre?, apellido?, direccion?, giro_principal_id?, observaciones? }
 */
async function handlePut(req, res) {
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
    const { nombre, apellido, direccion, giro_principal_id, observaciones } = req.body;

    // Obtener cliente actual
    const clienteResult = await query('SELECT id FROM Cliente WHERE rut = $1', [rutLimpio]);
    if (clienteResult.rows.length === 0) {
        return sendError(res, 'Cliente no encontrado', 404);
    }

    const clienteId = clienteResult.rows[0].id;

    // Construir consulta dinámica
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (nombre !== undefined) {
        updates.push(`nombre = $${paramCount}`);
        values.push(nombre);
        paramCount++;
    }

    if (apellido !== undefined) {
        updates.push(`apellido = $${paramCount}`);
        values.push(apellido || null);
        paramCount++;
    }

    if (direccion !== undefined) {
        updates.push(`direccion = $${paramCount}`);
        values.push(direccion || null);
        paramCount++;
    }

    if (giro_principal_id !== undefined) {
        // Validar que el giro existe
        if (giro_principal_id !== null) {
            const giroResult = await query('SELECT id FROM Giro WHERE id = $1', [giro_principal_id]);
            if (giroResult.rows.length === 0) {
                return sendError(res, 'El giro principal especificado no existe', 404);
            }
        }
        updates.push(`giro_principal_id = $${paramCount}`);
        values.push(giro_principal_id);
        paramCount++;
    }

    if (observaciones !== undefined) {
        updates.push(`observaciones = $${paramCount}`);
        values.push(observaciones || null);
        paramCount++;
    }

    if (updates.length === 0) {
        return sendError(res, 'No hay campos para actualizar', 400);
    }

    // Agregar WHERE
    values.push(rutLimpio);
    const sql = `
    UPDATE Cliente
    SET ${updates.join(', ')}
    WHERE rut = $${paramCount}
    RETURNING id, rut, nombre, apellido, direccion, giro_principal_id, tipo_persona, observaciones
  `;

    const result = await query(sql, values);
    const cliente = result.rows[0];

    // Obtener giro principal actualizado
    let giro_principal = null;
    if (cliente.giro_principal_id) {
        const giroData = await query('SELECT id, nombre, categoria FROM Giro WHERE id = $1', [cliente.giro_principal_id]);
        giro_principal = giroData.rows[0] || null;
    }

    // Obtener giros secundarios
    const girosResult = await query(
        `
    SELECT g.id, g.nombre, g.categoria
    FROM Giro g
    INNER JOIN Cliente_Giro cg ON g.id = cg.giro_id
    WHERE cg.cliente_id = $1
    ORDER BY g.nombre
    `,
        [cliente.id]
    );

    sendSuccess(res, {
        id: cliente.id,
        rut: rutFormato,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        direccion: cliente.direccion,
        tipo_persona: cliente.tipo_persona,
        observaciones: cliente.observaciones,
        giro_principal,
        giros_secundarios: girosResult.rows,
    });
}

/**
 * DELETE /api/clientes/[rut]
 * Eliminar cliente (cascada elimina giros secundarios)
 */
async function handleDelete(req, res) {
    const { rut } = req.query;

    if (!rut) {
        return sendError(res, 'Se requiere el parámetro rut', 400);
    }

    // Validar y limpiar RUT
    if (!isValidRut(rut)) {
        return sendError(res, 'El RUT ingresado no es válido', 400);
    }

    const rutLimpio = cleanRut(rut);

    // Obtener cliente
    const clienteResult = await query('SELECT id, nombre FROM Cliente WHERE rut = $1', [rutLimpio]);
    if (clienteResult.rows.length === 0) {
        return sendError(res, 'Cliente no encontrado', 404);
    }

    const cliente = clienteResult.rows[0];

    // Eliminar cliente (CASCADE elimina entradas en Cliente_Giro)
    await query('DELETE FROM Cliente WHERE rut = $1', [rutLimpio]);

    sendSuccess(res, {
        mensaje: `Cliente ${cliente.nombre} eliminado correctamente`,
        rut: formatRut(rut),
    });
}

/**
 * Handler principal - Compatible con Vercel Functions
 */
export default async function handler(req, res) {
    if (handleCors(req, res)) return;

    if (req.method === 'GET') {
        return await handleGet(req, res);
    } else if (req.method === 'PUT') {
        return await handlePut(req, res);
    } else if (req.method === 'DELETE') {
        return await handleDelete(req, res);
    } else {
        return sendError(res, 'Método no permitido', 405);
    }
}
