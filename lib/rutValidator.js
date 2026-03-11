/**
 * Validación y formato de RUT chileno
 * Formato esperado: 12.345.678-9
 */

/**
 * Valida que un RUT sea válido según el dígito verificador chileno
 * @param {string} rut - RUT a validar (con o sin formato)
 * @returns {boolean} - True si es válido, false en caso contrario
 */
function isValidRut(rut) {
    if (!rut || typeof rut !== 'string') return false;

    // Limpiar el RUT
    const cleanRut = rut.replace(/[.-]/g, '').trim();

    // Validar formato (dígitos - dígito verificador)
    if (!/^\d{7,8}[0-9K]$/.test(cleanRut)) return false;

    // Separar números del dígito verificador
    const numeros = cleanRut.slice(0, -1);
    const digitoIngresado = cleanRut.slice(-1).toUpperCase();

    // Calcular dígito verificador
    let sum = 0;
    let multiplier = 2;

    for (let i = numeros.length - 1; i >= 0; i--) {
        sum += parseInt(numeros[i]) * multiplier;
        multiplier++;
        if (multiplier > 7) multiplier = 2;
    }

    const remainder = 11 - (sum % 11);
    let digitoCalculado = 'K'; // Por defecto K

    if (remainder === 11) {
        digitoCalculado = '0';
    } else if (remainder === 10) {
        digitoCalculado = 'K';
    } else {
        digitoCalculado = remainder.toString();
    }

    return digitoIngresado === digitoCalculado;
}

/**
 * Formatea un RUT al formato estándar chileno: XX.XXX.XXX-X
 * @param {string} rut - RUT a formatear
 * @returns {string|null} - RUT formateado o null si es inválido
 */
function formatRut(rut) {
    if (!rut || typeof rut !== 'string') return null;

    // Limpiar el RUT
    const cleanRut = rut.replace(/[.-]/g, '').trim().toUpperCase();

    // Validar que sea un formato válido
    if (!/^\d{7,8}[0-9K]$/.test(cleanRut)) return null;

    // Extraer dígitos y verificador
    const numeros = cleanRut.slice(0, -1);
    const digito = cleanRut.slice(-1);

    // Formatear
    if (numeros.length === 7) {
        return `${numeros.slice(0, 1)}.${numeros.slice(1, 4)}.${numeros.slice(4)}-${digito}`;
    } else if (numeros.length === 8) {
        return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}-${digito}`;
    }

    return null;
}

/**
 * Limpia un RUT (sin formato)
 * @param {string} rut - RUT a limpiar
 * @returns {string} - RUT sin formato
 */
function cleanRut(rut) {
    if (!rut) return '';
    return rut.replace(/[.-]/g, '').trim().toUpperCase();
}

export { isValidRut, formatRut, cleanRut };
