/**
 * Conexión a Neon PostgreSQL optimizada para serverless
 * Usa @neondatabase/serverless para máximo rendimiento
 */

import { Pool } from '@neondatabase/serverless';

// Crear un único pool de conexiones (reutilizado en todas las llamadas)
let pool = null;

/**
 * Obtiene o crea el pool de conexiones
 * @returns {Pool} - Pool de conexiones
 */
function getPool() {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            throw new Error('DATABASE_URL no está definido en variables de entorno');
        }

        pool = new Pool({
            connectionString,
            max: 1, // Usar mínimo de conexiones en serverless
        });
    }

    return pool;
}

/**
 * Ejecuta una consulta SQL
 * @param {string} sql - Consulta SQL
 * @param {array} params - Parámetros para la consulta
 * @returns {Promise<object>} - Resultado de la consulta
 */
async function query(sql, params = []) {
    const connection = await getPool().connect();
    try {
        const result = await connection.query(sql, params);
        return result;
    } finally {
        connection.release();
    }
}

/**
 * Ejecuta múltiples consultas en una transacción
 * @param {function} callback - Función que ejecuta las consultas
 * @returns {Promise<any>} - Resultado de la transacción
 */
async function transaction(callback) {
    const connection = await getPool().connect();
    try {
        await connection.query('BEGIN');
        const result = await callback(connection);
        await connection.query('COMMIT');
        return result;
    } catch (error) {
        await connection.query('ROLLBACK');
        throw error;
    } finally {
        connection.release();
    }
}

export { query, transaction, getPool };
