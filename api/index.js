/**
 * Single entry point API route handler
 * Routes all /api/* requests to the correct handler
 */

const url = require('url');
const path = require('path');

module.exports = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Route handler
  if (pathname === '/api/' || pathname === '/api') {
    return res.status(200).json({
      status: 'ok',
      message: 'Mercado Estación API',
      version: '1.0.0',
      endpoints: {
        test: 'GET /api/test',
        giros: 'GET /api/giros',
        clientes: 'GET /api/clientes'
      }
    });
  }

  if (pathname === '/api/test') {
    return res.status(200).json({
      status: 'ok',
      message: 'API is running',
      timestamp: new Date().toISOString(),
      databaseUrl: !!process.env.DATABASE_URL
    });
  }

  if (pathname === '/api/giros') {
    try {
      const { query } = require('../lib/database');
      const page = parseInt(parsedUrl.query.page) || 1;
      const limit = parseInt(parsedUrl.query.limit) || 20;
      const offset = (page - 1) * limit;

      const countResult = await query('SELECT COUNT(*) as total FROM Giro');
      const total = parseInt(countResult.rows[0].total);

      const result = await query(
        'SELECT id, nombre, categoria FROM Giro ORDER BY nombre ASC LIMIT $1 OFFSET $2',
        [limit, offset]
      );

      return res.status(200).json({
        success: true,
        data: {
          giros: result.rows,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
        error: null,
      });
    } catch (error) {
      console.error('Error fetching giros:', error);
      return res.status(500).json({
        success: false,
        data: null,
        error: error.message,
      });
    }
  }

  res.status(404).json({
    success: false,
    data: null,
    error: 'Route not found',
  });
};
