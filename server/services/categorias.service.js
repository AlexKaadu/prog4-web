const { pipe } = require('pdfkit');
const pool = require('../db');

async function listar(limite, offset) {
    const { rows } = await pool.query(`
    SELECT id_categoria, descripcion, activo
    FROM categorias
    WHERE activo = 1
    ORDER BY id_categoria
    LIMIT $1 OFFSET $2
  `, [limite, offset]);

  const { rows: conteo } = await pool.query(`
        SELECT COUNT(*)::int AS total
        FROM categorias
        WHERE activo = 1
    `);

    return { datos: rows , total: conteo[0].total };
    
}


async function obtenerPorId(id) {
    const { rows } = await pool.query(`
        SELECT id_categoria, descripcion, activo
        FROM categorias
        WHERE id_categoria = $1
            AND activo = 1
    `, [id]);

    return rows[0] || null;
    
}


async function actualizar(id, descripcion) {
    const { rows } = await pool.query(`
        UPDATE categorias
        SET descripcion = $2
        WHERE id_categoria = $1
            AND activo = 1
        RETURNING id_categoria, descripcion, activo
        `, [id, descripcion]);
    
    return rows[0] || null;

    
}

async function crear (descripcion) {
    const { rows } = await pool.query(`
        INSERT INTO categorias (descripcion, activo)
        VALUES ($1, 1)
        RETURNING id_categoria, descripcion, activo
        `, [descripcion]);
        

        return rows[0] || null;
    
}

async function eliminar(id) {
    const { rows } = await pool.query(`
        UPDATE categorias
        SET activo = 0
        WHERE id_categoria = $1
            AND activo = 1
        RETURNING id_categoria, descripcion, activo
        `, [id]);

        return rows[0] || null;
    
}
module.exports = { listar, obtenerPorId, actualizar, crear, eliminar };