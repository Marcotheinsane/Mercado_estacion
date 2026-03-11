import { sql } from '@/lib/db';

export async function GET(req, { params }) {
    try {
        const { id } = params;
        const result = await sql`
      SELECT * FROM giro WHERE id = ${id}
    `;

        if (result.length === 0) {
            return Response.json({ error: 'Giro no encontrado' }, { status: 404 });
        }

        return Response.json(result[0]);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();
        const { nombre, categoria } = body;

        const result = await sql`
      UPDATE giro 
      SET nombre = ${nombre}, categoria = ${categoria}
      WHERE id = ${id}
      RETURNING *
    `;

        if (result.length === 0) {
            return Response.json({ error: 'Giro no encontrado' }, { status: 404 });
        }

        return Response.json(result[0]);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        const result = await sql`
      DELETE FROM giro WHERE id = ${id} RETURNING *
    `;

        if (result.length === 0) {
            return Response.json({ error: 'Giro no encontrado' }, { status: 404 });
        }

        return Response.json({ message: 'Giro eliminado' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
