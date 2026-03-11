/**
 * Middleware para CORS y respuestas consistentes
 */

/**
 * Configura CORS en la respuesta
 * @param {object} res - Objeto de respuesta de Vercel
 */
function enableCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');
}

/**
 * Maneja peticiones OPTIONS (preflight de CORS)
 * @param {object} req - Objeto de petición
 * @param {object} res - Objeto de respuesta
 * @returns {boolean} - True si fue una petición OPTIONS
 */
function handleCors(req, res) {
    enableCors(res);

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }

    return false;
}

/**
 * Envía una respuesta exitosa
 * @param {object} res - Objeto de respuesta
 * @param {any} data - Datos a devolver
 * @param {number} statusCode - Código HTTP (default: 200)
 */
function sendSuccess(res, data, statusCode = 200) {
    enableCors(res);
    res.status(statusCode).json({
        success: true,
        data,
        error: null,
    });
}

/**
 * Envía una respuesta de error
 * @param {object} res - Objeto de respuesta
 * @param {string|object} error - Mensaje de error
 * @param {number} statusCode - Código HTTP (default: 400)
 */
function sendError(res, error, statusCode = 400) {
    enableCors(res);

    let errorMessage = error;
    if (typeof error === 'object') {
        errorMessage = error.message || 'Error desconocido';
    }

    res.status(statusCode).json({
        success: false,
        data: null,
        error: errorMessage,
    });
}

/**
 * Wrapper para manejo automático de errores en funciones async
 * @param {function} fn - Función async a ejecutar
 * @returns {function} - Función envuelta
 */
function asyncHandler(fn) {
    return async (req, res) => {
        try {
            await fn(req, res);
        } catch (error) {
            console.error('Error en endpoint:', error);
            sendError(res, error.message || 'Error interno del servidor', 500);
        }
    };
}

export { handleCors, enableCors, sendSuccess, sendError, asyncHandler };
