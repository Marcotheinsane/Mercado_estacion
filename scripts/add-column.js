import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf-8');
    const lines = env.split('\n');
    lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}
const sql = neon(process.env.DATABASE_URL);

async function addFormalizadoColumn() {
    try {
        await sql`
      ALTER TABLE cliente 
      ADD COLUMN IF NOT EXISTS formalizado BOOLEAN DEFAULT false
    `;
        console.log('✓ Columna formalizado agregada exitosamente');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

addFormalizadoColumn();
