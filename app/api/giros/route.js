import sql from '@/lib/db';

export async function GET() {
    try {
        const result = await sql`
      SELECT * FROM giro ORDER BY id DESC
    `;
        return Response.json(result);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { nombre, categoria } = body;

        const result = await sql`
      INSERT INTO giro (nombre, categoria)
      VALUES (${nombre}, ${categoria})
      RETURNING *
    `;

        return Response.json(result[0], { status: 201 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
