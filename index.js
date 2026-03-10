/**
 * Minimal entry point - handles root path only
 * All /api/* routes should NOT be handled here - they go to serverless functions
 */
const http = require('http');
const url = require('url');

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // If it's an /api/* request, it should have been routed to serverless functions
    // This should not execute, but just in case:
    if (pathname.startsWith('/api/')) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            error: 'API route handler error',
            message: 'This should be handled by serverless functions, not the entry point'
        }));
        return;
    }

    // Handle root path
    message: 'Mercado Estación API',
        version: '1.0.0',
            status: 'running',
                endpoints: {
        giros: { get: 'GET /api/giros', post: 'POST /api/giros' },
        clientes: { get: 'GET /api/clientes', post: 'POST /api/clientes' }
    }
}));
});

module.exports = server;
