/**
 * Entry point for root path /
 * All /api/* routes are handled by serverless functions in /api folder
 */

module.exports = (req, res) => {
  res.status(200).json({
    message: 'Mercado Estación API',
    version: '1.0.0',
    endpoints: {
      clientes: 'GET /api/clientes',
      giros: 'GET /api/giros',
      docs: 'See README.md for full API documentation'
    }
  });
};
