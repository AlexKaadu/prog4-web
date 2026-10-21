import pool from '../db.js';

class AreasRepository {
    listarActivas = async () => {
        const sql = `
            SELECT id_area, descripcion
            FROM areas
            WHERE activo = 1
            ORDER BY id_area
        `;
        const { rows } = await pool.query(sql);

        return rows;
    };

    obtenerPorId = async (id) => {
        const sql = `
            SELECT id_area, descripcion, activo
            FROM areas
            WHERE id_area = $1
                AND activo = 1
        `;
        const { rowCount, rows } = await pool.query(sql, [id]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };

    crear = async (descripcion) => {
        const sql = `
            INSERT INTO areas (descripcion, activo)
            VALUES ($1, 1)
            RETURNING id_area, descripcion, activo
        `;
        const { rowCount, rows } = await pool.query(sql, [descripcion]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };

    actualizar = async (id, descripcion) => {
        const sql = `
            UPDATE areas
            SET descripcion = $2
            WHERE id_area = $1
                AND activo = 1
            RETURNING id_area, descripcion, activo
        `;
        const { rowCount, rows } = await pool.query(sql, [id, descripcion]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };

    tieneArticulosActivos = async (id) => {
        const sql = `
            SELECT EXISTS (
                SELECT 1
                FROM articulos
                WHERE id_area = $1
                    AND activo = 1
            ) AS tiene_articulos
        `;
        const { rows } = await pool.query(sql, [id]);

        return rows[0].tiene_articulos;
    };

    eliminar = async (id) => {
        const sql = `
            UPDATE areas
            SET activo = 0
            WHERE id_area = $1
                AND activo = 1
            RETURNING id_area, descripcion, activo
        `;
        const { rowCount, rows } = await pool.query(sql, [id]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };
}

export default AreasRepository;