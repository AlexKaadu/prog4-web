const pool = require('../db');

async function listar(limite, offset) {
    const { rows } = await pool.query (`
        SELECT
            a.id_articulo,
            a.id_area, 
            a.id_categoria,
            a.descripcion,
            ar.descripcion AS area,
            c.descripcion AS categoria
        FROM articulos AS a
        JOIN areas AS ar
            ON ar.id_area = a.id_area
        JOIN categorias AS c
            ON c.id_categoria = a.id_categoria
        WHERE a.activo = 1
        ORDER BY a.id_articulo
        LIMIT $1 OFFSET $2

    `, [limite, offset]);

     const { rows: conteo } = await pool.query(`
        SELECT COUNT(*)::int AS total
        FROM articulos
        WHERE activo = 1
    `);

    return { datos: rows , total: conteo[0].total }; 
}


async function obtenerPorId(id) {
    const { rows } = await pool.query (`

        SELECT
            a.id_articulo,
            a.id_area, 
            a.id_categoria,
            a.descripcion,
            ar.descripcion AS area,
            c.descripcion AS categoria
        FROM articulos AS a
        JOIN areas AS ar
            ON ar.id_area = a.id_area
        JOIN categorias AS c
            ON c.id_categoria = a.id_categoria
        WHERE a.id_articulo = $1
            AND a.activo = 1
    `, [id]);

    return rows[0] || null;
}


async function actualizar(id, id_area, id_categoria, descripcion) {
    await validarRelacionesActivas(id_area,id_categoria);
    const { rows } = await pool.query(`
        UPDATE articulos
        SET
            id_area = $2,
            id_categoria = $3,
            descripcion = $4
        WHERE id_articulo = $1
            AND activo = 1
        RETURNING id_articulo, id_area, id_categoria, descripcion
        `, [id, id_area, id_categoria, descripcion]);
    
    return rows[0] || null;
}


async function crear (id_area, id_categoria, descripcion) {
    await validarRelacionesActivas(id_area, id_categoria);
    const { rows } = await pool.query(`
        INSERT INTO articulos (id_area, id_categoria, descripcion, activo)
        VALUES ($1, $2, $3, 1)
        RETURNING id_articulo, id_area, id_categoria, descripcion, activo
        `, [id_area, id_categoria, descripcion]);
        

        return rows[0] || null;
}


async function eliminar(id) {
    const { rows } = await pool.query(`
        UPDATE articulos
        SET activo = 0
        WHERE id_articulo = $1
            AND activo = 1
        RETURNING id_articulo, descripcion, activo
        `, [id]);

        return rows[0] || null;
    
}

async function validarRelacionesActivas(id_area, id_categoria) {
    const { rows } = await pool.query(`
        SELECT
            EXISTS (
                SELECT 1 FROM areas
                WHERE id_area = $1 AND activo = 1
            ) AS area_activa,
            EXISTS (
                SELECT 1 FROM categorias
                WHERE id_categoria = $2 AND activo = 1
            ) AS categoria_activa
    `, [id_area, id_categoria]);

    if (!rows[0].area_activa) {
        const error = new Error('El área no existe o está inactiva.');
        error.code = 'AREA_INACTIVA';
        throw error;
    }

    if (!rows[0].categoria_activa) {
        const error = new Error('La categoría no existe o está inactiva.');
        error.code = 'CATEGORIA_INACTIVA';
        throw error;
    }
}

module.exports = {listar, obtenerPorId, actualizar, crear, eliminar};











