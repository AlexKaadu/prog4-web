import pool from '../db.js';

class IncidenciasRepository {

    listarAsignadas = async(idUsuario, limite, offset) => {
        
        const sql = `
            SELECT
                i.id_incidencia,
                i.creado,
                a.descripcion AS articulo_descripcion,
                i.descripcion_pedido,
                i.prioridad,
                i.id_estado,
                e.descripcion AS estado
            
            FROM incidencias AS i
            JOIN articulos AS a
                ON a.id_articulo = i.id_articulo
            JOIN estados AS e
                ON e.id_estado = i.id_estado
            
            WHERE i.asignado_a = $1
            ORDER BY i.creado DESC, i.id_incidencia DESC
            LIMIT $2 OFFSET $3
        `;

        const { rows } = await pool.query(sql, [idUsuario, limite, offset]);

        const sqlConteo = `
            SELECT COUNT(*)::int AS total
            FROM incidencias
            WHERE asignado_a =$1
            `;

        const { rows: conteo } = await pool.query(sqlConteo,[idUsuario]);

        return {
            datos: rows,
            total: conteo[0].total
        };
       
    };


    finalizarAsignada = async (idIncidencia, idUsuario, descripcionResolucion) => {
        const sql = `
            WITH actualizada AS (
                UPDATE incidencias
                SET
                    id_estado = 3,
                    descripcion_resolucion = $3
                WHERE id_incidencia = $1
                    AND asignado_a = $2
                    AND id_estado = 2
                RETURNING
                    id_incidencia,
                    creado,
                    id_articulo,
                    descripcion_pedido,
                    prioridad,
                    id_estado,
                    descripcion_resolucion
            ),
           historial AS (
              INSERT INTO incidencias_estados (
                id_incidencia,
                id_estado
              )
              SELECT
                id_incidencia,
                id_estado
              FROM actualizada
            )
            SELECT
                i.id_incidencia,
                i.creado,
                a.descripcion AS articulo_descripcion,
                i.descripcion_pedido,
                i.prioridad,
                i.id_estado,
                e.descripcion AS estado,
                i.descripcion_resolucion
            FROM actualizada AS i
            JOIN articulos AS a ON a.id_articulo = i.id_articulo
            JOIN estados AS e ON e.id_estado = i.id_estado
        `;

        const { rows } = await pool.query(sql, [
            idIncidencia,
            idUsuario,
            descripcionResolucion
        ]);

        return rows[0] ?? null;
    };

    comenzarAsignada = async(idIncidencia, idUsuario) => {
        const sql = `
            WITH actualizada AS (
                UPDATE incidencias
                SET id_estado = 2
                WHERE id_incidencia =$1
                    AND asignado_a = $2
                    AND id_estado = 1
                RETURNING
                    id_incidencia,
                    creado,
                    id_articulo,
                    descripcion_pedido,
                    prioridad,
                    id_estado
            ),
            historial AS (
                INSERT INTO incidencias_estados(
                    id_incidencia,
                    id_estado
                )
                SELECT
                    id_incidencia,
                    id_estado
                FROM actualizada
            )
            SELECT
                i.id_incidencia,
                i.creado,
                a.descripcion AS articulo_descripcion,
                i.descripcion_pedido,
                i.prioridad,
                i.id_estado,
                e.descripcion AS estado
            FROM actualizada AS i
            JOIN articulos AS a ON a.id_articulo = i.id_articulo
            JOIN estados AS e ON e.id_estado = i.id_estado
        `;
        const { rows } = await pool.query(sql, [idIncidencia, idUsuario]);
        return rows[0] ?? null;
 
    };


    listarTodas = async(limite, offset) => {
        const sql = `
        SELECT
            i.id_incidencia,
            i.creado,
            a.descripcion AS articulo_descripcion,
            i.descripcion_pedido,
            i.prioridad,
            i.id_estado,
            e.descripcion AS estado,
            i.asignado_a,
            COALESCE(
                NULLIF(CONCAT_WS(' ', u.nombres, u.apellidos), ''),
                'Sin asignar'
            ) AS tecnico_asignado
            

        FROM incidencias AS i
        JOIN articulos AS a
            ON a.id_articulo = i.id_articulo
        JOIN estados AS e
            ON e.id_estado = i.id_estado
        LEFT JOIN usuarios AS u
            ON u.id_usuario = i.asignado_a
        ORDER BY
            (i.asignado_a IS NULL) DESC,
            i.prioridad DESC,
            i.creado ASC,
            i.id_incidencia ASC
        LIMIT $1 OFFSET $2
        `;

        const { rows } = await pool.query(sql, [limite, offset]);

        const sqlConteo = `
            SELECT COUNT(*)::int AS total
            FROM incidencias
        `;

        const { rows: conteo } = await pool.query(sqlConteo);

        return {
            datos: rows,
            total: conteo[0].total
        };
    
    };





}
   

export default IncidenciasRepository;



