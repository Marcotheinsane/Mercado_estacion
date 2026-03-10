/**
 * Clase personalizada para errores de API
 */

class ApiError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}

/**
 * Errores comunes de validación
 */
const ValidationErrors = {
    INVALID_RUT: 'El RUT ingresado no es válido',
    INVALID_TIPO_PERSONA: 'tipo_persona debe ser "N" (Natural) o "J" (Jurídica)',
    MISSING_REQUIRED_FIELD: (field) => `El campo ${field} es obligatorio`,
    INVALID_EMAIL: 'El email ingresado no es válido',
    INVALID_PHONE: 'El teléfono ingresado no es válido',
};

/**
 * Errores de recursos
 */
const NotFoundErrors = {
    CLIENTE_NOT_FOUND: 'Cliente no encontrado',
    GIRO_NOT_FOUND: 'Giro no encontrado',
    RESOURCE_NOT_FOUND: (resource) => `${resource} no encontrado`,
};

/**
 * Errores de conflicto
 */
const ConflictErrors = {
    DUPLICATE_RUT: 'El RUT ya existe en el sistema',
    DUPLICATE_GIRO: 'Ya existe un giro con ese nombre',
    GIRO_ALREADY_ASSIGNED: 'El cliente ya tiene asignado este giro secundario',
    SAME_MAIN_GIRO: 'El giro ya es el giro principal del cliente',
};

/**
 * Errores de base de datos
 */
const DatabaseErrors = {
    CONNECTION_ERROR: 'Error de conexión a la base de datos',
    QUERY_ERROR: 'Error al ejecutar la consulta',
    TRANSACTION_ERROR: 'Error en la transacción de base de datos',
};

module.exports = {
    ApiError,
    ValidationErrors,
    NotFoundErrors,
    ConflictErrors,
    DatabaseErrors,
};
