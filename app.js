/**
 * Entry point for root path /
 * All /api/* routes are handled by serverless functions in /api folder
 */

const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'Mercado Estación API',
        version: '1.0.0',
        endpoints: {
            clientes: 'GET /api/clientes',
            giros: 'GET /api/giros',
            docs: 'See README.md for full API documentation'
        }
    }));
});

module.exports = server;
