import sql from '@/lib/db';

export async function GET(req, { params }) {
    try {
        const { id } = params;
        const result = await sql`
      SELECT * FROM cliente WHERE id = ${id}
    `;

        if (result.length === 0) {
            return Response.json({ error: 'Cliente no encontrado' }, { status: 404 });
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
        const { rut, nombre, apellido, direccion, tipo_persona, email, telefono, observaciones, formalizado } = body;

        const result = await sql`
      UPDATE cliente 
      SET rut = ${rut}, nombre = ${nombre}, apellido = ${apellido}, direccion = ${direccion},
          tipo_persona = ${tipo_persona}, email = ${email}, telefono = ${telefono}, observaciones = ${observaciones}, formalizado = ${formalizado}
      WHERE id = ${id}
      RETURNING *
    `;

        if (result.length === 0) {
            return Response.json({ error: 'Cliente no encontrado' }, { status: 404 });
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
      DELETE FROM cliente WHERE id = ${id} RETURNING *
    `;

        if (result.length === 0) {
            return Response.json({ error: 'Cliente no encontrado' }, { status: 404 });
        }

        return Response.json({ message: 'Cliente eliminado' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
