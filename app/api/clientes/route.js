import { sql } from '@/lib/db';

export async function GET() {
    try {
        const result = await sql`
      SELECT * FROM cliente ORDER BY id DESC
    `;
        return Response.json(result);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { rut, nombre, apellido, direccion, tipo_persona, email, telefono, observaciones, formalizado } = body;

        const result = await sql`
      INSERT INTO cliente (rut, nombre, apellido, direccion, tipo_persona, email, telefono, observaciones, formalizado)
      VALUES (${rut}, ${nombre}, ${apellido}, ${direccion}, ${tipo_persona}, ${email}, ${telefono}, ${observaciones}, ${formalizado})
      RETURNING *
    `;

        return Response.json(result[0], { status: 201 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
