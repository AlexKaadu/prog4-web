const pool = require('../db');

async function listarActivas() {
    const { rows } = await  pool.query(`
        SELECT id_area, descripcion
        FROM areas
        WHERE activo = 1
        ORDER BY id_area
    `);

    return rows;
}

async function obtenerPorId(id) {
    const { rows } = await pool.query(`
        SELECT id_area, descripcion, activo
        FROM areas
        WHERE id_area = $1
          AND activo = 1
    `, [id]);

    return rows[0] || null;
}

async function crear(descripcion) {
    const { rows } = await pool.query(`
        INSERT INTO areas (descripcion, activo)
        VALUES ($1, 1)
        RETURNING id_area, descripcion, activo
    `, [descripcion]);

    return rows[0] || null;
}

async function actualizar(id, descripcion) {
    const { rows } = await pool.query(`
        UPDATE areas
        SET descripcion = $2
        WHERE id_area = $1
          AND activo = 1
        RETURNING id_area, descripcion, activo
    `, [id, descripcion]);

    return rows[0] || null;
}

async function eliminar(id) {
    const { rows: articulosActivos } = await pool.query(`
        SELECT EXISTS (
            SELECT 1
            FROM articulos
            WHERE id_area = $1
              AND activo = 1
        ) AS tiene_articulos
    `, [id]);

    if (articulosActivos[0].tiene_articulos) {
        const error = new Error('No se puede desactivar el área porque tiene artículos activos.');
        error.code = 'AREA_CON_ARTICULOS';
        throw error;
    }

    const { rows } = await pool.query(`
        UPDATE areas
        SET activo = 0
        WHERE id_area = $1
          AND activo = 1
        RETURNING id_area, descripcion, activo
    `, [id]);

    return rows[0] || null;
}


module.exports = { listarActivas, obtenerPorId, crear, actualizar, eliminar};
