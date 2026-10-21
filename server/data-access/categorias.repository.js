import pool from '../db.js';

class CategoriasRepository {
    listar = async (limite, offset) => {
        const sql = `
            SELECT id_categoria, descripcion, activo
            FROM categorias
            WHERE activo = 1
            ORDER BY id_categoria
            LIMIT $1 OFFSET $2
        `;
        const { rows } = await pool.query(sql, [limite, offset]);

        const sqlConteo = `
            SELECT COUNT(*)::int AS total
            FROM categorias
            WHERE activo = 1
        `;
        const { rows: conteo } = await pool.query(sqlConteo);

        return { datos: rows, total: conteo[0].total };
    };

    obtenerPorId = async (id) => {
        const sql = `
            SELECT id_categoria, descripcion, activo
            FROM categorias
            WHERE id_categoria = $1
                AND activo = 1
        `;
        const { rowCount, rows } = await pool.query(sql, [id]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };

    actualizar = async (id, descripcion) => {
        const sql = `
            UPDATE categorias
            SET descripcion = $2
            WHERE id_categoria = $1
                AND activo = 1
            RETURNING id_categoria, descripcion, activo
        `;
        const { rowCount, rows } = await pool.query(sql, [id, descripcion]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };

    crear = async (descripcion) => {
        const sql = `
            INSERT INTO categorias (descripcion, activo)
            VALUES ($1, 1)
            RETURNING id_categoria, descripcion, activo
        `;
        const { rowCount, rows } = await pool.query(sql, [descripcion]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };

    eliminar = async (id) => {
        const sql = `
            UPDATE categorias
            SET activo = 0
            WHERE id_categoria = $1
                AND activo = 1
            RETURNING id_categoria, descripcion, activo
        `;
        const { rowCount, rows } = await pool.query(sql, [id]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };
}

export default CategoriasRepository;