import pool from '../db.js';

class ReportesRepository {
    listarIncidenciasDashboard = async () => {
        const sql = `
            SELECT
                i.id_incidencia,
                to_char(i.creado, 'DD-MM-YYYY HH24:MI') AS creado,
                a.descripcion AS articulo_descripcion,
                i.id_estado,
                i.prioridad,
                c.descripcion AS categoria
            FROM incidencias AS i
            INNER JOIN articulos AS a
                ON a.id_articulo = i.id_articulo
            INNER JOIN categorias AS c
                ON c.id_categoria = a.id_categoria
            ORDER BY i.creado
        `;

        const { rows } = await pool.query(sql);
        return rows;
    };
}

export default ReportesRepository;