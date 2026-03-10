/**
 * Punto de entrada para Vercel
 * Las APIs se sirven desde la carpeta /api (serverless functions)
 */

export default function handler(req, res) {
    res.status(200).json({
        success: true,
        message: 'Mercado Estación API - Serverless',
        endpoints: {
            clientes: 'GET /api/clientes',
            giros: 'GET /api/giros',
            docs: 'Ver README.md'
        }
    });
}

