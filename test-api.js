/**
 * test-api.js - Script para probar la API localmente
 * Uso: node test-api.js
 */

const http = require('http');
const https = require('https');

// Cambiar estos valores según tu entorno
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const USE_HTTPS = BASE_URL.startsWith('https');
const client = USE_HTTPS ? https : http;

/**
 * Hacer un request HTTP/HTTPS
 */
function makeRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + path);
        const options = {
            hostname: url.hostname,
            port: url.port || (USE_HTTPS ? 443 : 80),
            path: url.pathname + url.search,
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (body) {
            const bodyString = JSON.stringify(body);
            options.headers['Content-Length'] = Buffer.byteLength(bodyString);
        }

        const req = client.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = {
                        status: res.statusCode,
                        body: JSON.parse(data),
                    };
                    resolve(response);
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        body: data,
                    });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

/**
 * Tests
 */
const tests = [];
let testsPassed = 0;
let testsFailed = 0;

async function test(name, fn) {
    try {
        console.log(`\n✓ ${name}`);
        await fn();
        testsPassed++;
    } catch (error) {
        console.error(`✗ ${name}`);
        console.error(`  Error: ${error.message}`);
        testsFailed++;
    }
}

async function expect(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

async function runTests() {
    console.log(`
╔════════════════════════════════════════════════╗
║       Pruebas de API - Mercado Estación        ║
╚════════════════════════════════════════════════╝

Base URL: ${BASE_URL}
\n`);

    // ========== TESTS DE GIROS ==========

    let giro1Id = null;

    await test('POST /api/giros - Crear giro', async () => {
        const res = await makeRequest('POST', '/api/giros', {
            nombre: 'Comercio ' + Date.now(),
            categoria: 'Retail',
        });
        await expect(res.status === 201, `Status debe ser 201, recibido ${res.status}`);
        await expect(res.body.success === true, 'success debe ser true');
        await expect(res.body.data.id, 'debe tener id');
        giro1Id = res.body.data.id;
    });

    await test('GET /api/giros - Listar giros', async () => {
        const res = await makeRequest('GET', '/api/giros?page=1&limit=20');
        await expect(res.status === 200, `Status debe ser 200, recibido ${res.status}`);
        await expect(res.body.success === true, 'success debe ser true');
        await expect(Array.isArray(res.body.data.giros), 'data.giros debe ser array');
    });

    await test('GET /api/giros/:id - Obtener giro por ID', async () => {
        if (!giro1Id) return;
        const res = await makeRequest('GET', `/api/giros/${giro1Id}`);
        await expect(res.status === 200, `Status debe ser 200, recibido ${res.status}`);
        await expect(res.body.success === true, 'success debe ser true');
        await expect(res.body.data.id === giro1Id, 'ID debe coincidir');
    });

    // ========== TESTS DE CLIENTES ==========

    let testRut = '12.345.678-9';

    await test('POST /api/clientes - Crear cliente', async () => {
        const res = await makeRequest('POST', '/api/clientes', {
            rut: testRut,
            nombre: 'Juan',
            apellido: 'Pérez',
            direccion: 'Calle 1 #123',
            tipo_persona: 'N',
            giro_principal_id: giro1Id,
            observaciones: 'Cliente de prueba',
        });
        await expect(res.status === 201, `Status debe ser 201, recibido ${res.status}`);
        await expect(res.body.success === true, 'success debe ser true');
        await expect(res.body.data.rut === testRut, 'RUT debe coincidir');
    });

    await test('GET /api/clientes - Listar clientes', async () => {
        const res = await makeRequest('GET', '/api/clientes?page=1&limit=10');
        await expect(res.status === 200, `Status debe ser 200, recibido ${res.status}`);
        await expect(res.body.success === true, 'success debe ser true');
        await expect(Array.isArray(res.body.data.clientes), 'data.clientes debe ser array');
    });

    await test('GET /api/clientes/:rut - Obtener cliente por RUT', async () => {
        const res = await makeRequest('GET', `/api/clientes/${testRut}`);
        await expect(res.status === 200, `Status debe ser 200, recibido ${res.status}`);
        await expect(res.body.success === true, 'success debe ser true');
        await expect(res.body.data.rut === testRut, 'RUT debe coincidir');
    });

    await test('PUT /api/clientes/:rut - Actualizar cliente', async () => {
        const res = await makeRequest('PUT', `/api/clientes/${testRut}`, {
            nombre: 'Juan Carlos',
            direccion: 'Nueva calle #456',
        });
        await expect(res.status === 200, `Status debe ser 200, recibido ${res.status}`);
        await expect(res.body.success === true, 'success debe ser true');
        await expect(res.body.data.nombre === 'Juan Carlos', 'Nombre debe ser actualizado');
    });

    // ========== TESTS DE GIROS SECUNDARIOS ==========

    let giro2Id = null;

    await test('POST /api/giros - Crear segundo giro', async () => {
        const res = await makeRequest('POST', '/api/giros', {
            nombre: 'Tecnología ' + Date.now(),
            categoria: 'Servicios',
        });
        await expect(res.status === 201, `Status debe ser 201, recibido ${res.status}`);
        giro2Id = res.body.data.id;
    });

    await test('POST /api/clientes/:rut/giros - Asignar giro secundario', async () => {
        if (!giro2Id) return;
        const res = await makeRequest('POST', `/api/clientes/${testRut}/giros`, {
            giro_id: giro2Id,
        });
        await expect(res.status === 201, `Status debe ser 201, recibido ${res.status}`);
        await expect(res.body.success === true, 'success debe ser true');
    });

    await test('GET /api/clientes/:rut/giros - Listar giros secundarios', async () => {
        const res = await makeRequest('GET', `/api/clientes/${testRut}/giros`);
        await expect(res.status === 200, `Status debe ser 200, recibido ${res.status}`);
        await expect(res.body.success === true, 'success debe ser true');
        await expect(Array.isArray(res.body.data.giros_secundarios), 'debe ser array');
    });

    // ========== TESTS DE ERROR ==========

    await test('POST /api/clientes - RUT duplicado (error esperado)', async () => {
        const res = await makeRequest('POST', '/api/clientes', {
            rut: testRut,
            nombre: 'Otro',
            tipo_persona: 'N',
        });
        await expect(res.status === 409, `Status debe ser 409, recibido ${res.status}`);
        await expect(res.body.success === false, 'success debe ser false');
    });

    await test('GET /api/clientes/:rut - RUT inválido (error esperado)', async () => {
        const res = await makeRequest('GET', '/api/clientes/123456');
        await expect(res.status === 400, `Status debe ser 400, recibido ${res.status}`);
        await expect(res.body.success === false, 'success debe ser false');
    });

    // ========== TESTS FINALES ==========

    await test('DELETE /api/clientes/:rut - Eliminar cliente', async () => {
        const res = await makeRequest('DELETE', `/api/clientes/${testRut}`);
        await expect(res.status === 200, `Status debe ser 200, recibido ${res.status}`);
        await expect(res.body.success === true, 'success debe ser true');
    });

    // ========== RESULTADOS ==========

    console.log(`
╔════════════════════════════════════════════════╗
║                   RESULTADOS                   ║
╚════════════════════════════════════════════════╝

✓ Pruebas pasadas: ${testsPassed}
✗ Pruebas fallidas: ${testsFailed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${testsFailed === 0 ? '✓ ¡Todas las pruebas pasaron!' : '✗ Algunas pruebas fallaron'}
\n`);

    process.exit(testsFailed > 0 ? 1 : 0);
}

runTests().catch(console.error);
