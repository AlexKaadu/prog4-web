import pool from '../db.js';

class ArticulosRepository {
    listar = async (limite, offset) => {
        const sql = `
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
        `;
        const { rows } = await pool.query(sql, [limite, offset]);

        const sqlConteo = `
            SELECT COUNT(*)::int AS total
            FROM articulos
            WHERE activo = 1
        `;
        const { rows: conteo } = await pool.query(sqlConteo);

        return { datos: rows, total: conteo[0].total };
    };

    obtenerPorId = async (id) => {
        const sql = `
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
        `;
        const { rowCount, rows } = await pool.query(sql, [id]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };

    obtenerEstadoRelaciones = async (idArea, idCategoria) => {
        const sql = `
            SELECT
                EXISTS (
                    SELECT 1 FROM areas
                    WHERE id_area = $1 AND activo = 1
                ) AS area_activa,
                EXISTS (
                    SELECT 1 FROM categorias
                    WHERE id_categoria = $2 AND activo = 1
                ) AS categoria_activa
        `;
        const { rowCount, rows } = await pool.query(sql, [idArea, idCategoria]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };

    actualizar = async (id, idArea, idCategoria, descripcion) => {
        const sql = `
            UPDATE articulos
            SET
                id_area = $2,
                id_categoria = $3,
                descripcion = $4
            WHERE id_articulo = $1
                AND activo = 1
            RETURNING id_articulo, id_area, id_categoria, descripcion
        `;
        const { rowCount, rows } = await pool.query(sql, [id, idArea, idCategoria, descripcion]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };

    crear = async (idArea, idCategoria, descripcion) => {
        const sql = `
            INSERT INTO articulos (id_area, id_categoria, descripcion, activo)
            VALUES ($1, $2, $3, 1)
            RETURNING id_articulo, id_area, id_categoria, descripcion, activo
        `;
        const { rowCount, rows } = await pool.query(sql, [idArea, idCategoria, descripcion]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };

    eliminar = async (id) => {
        const sql = `
            UPDATE articulos
            SET activo = 0
            WHERE id_articulo = $1
                AND activo = 1
            RETURNING id_articulo, descripcion, activo
        `;
        const { rowCount, rows } = await pool.query(sql, [id]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };
}

export default ArticulosRepository;