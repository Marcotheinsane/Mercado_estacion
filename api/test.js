/**
 * Test endpoint - verify serverless functions work WITHOUT database
 */

module.exports = (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Serverless function is working',
        timestamp: new Date().toISOString(),
        environment: {
            nodeVersion: process.version,
            databaseConfigured: !!process.env.DATABASE_URL
        }
    });
};
