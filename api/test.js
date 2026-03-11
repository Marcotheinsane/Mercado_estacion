/**
 * Test endpoint - verify serverless functions work WITHOUT database
 */

export default async function handler(req, res) {
    res.status(200).json({
        status: 'ok',
        message: 'Serverless function is working',
        timestamp: new Date().toISOString(),
        environment: {
            nodeVersion: process.version,
            databaseConfigured: !!process.env.DATABASE_URL
        }
    });
}
