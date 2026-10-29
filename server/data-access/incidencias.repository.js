
import pool from '../db.js';

class IncidenciasRepository {

    // EMPLEADO SISTEMAS 
    listarAsignadas = async(idUsuario, limite, offset) => {
        
        const sql = `
            SELECT
                i.id_incidencia,
                to_char(i.creado, 'DD-MM-YYYY HH24:MI') AS creado,
                a.descripcion AS articulo_descripcion,
                c.descripcion AS categoria,
                i.descripcion_pedido,
                i.descripcion_resolucion,
                i.prioridad,
                i.id_estado,
                e.descripcion AS estado
            
            FROM incidencias AS i
            JOIN articulos AS a
                ON a.id_articulo = i.id_articulo
            JOIN categorias AS c
                ON c.id_categoria = a.id_categoria
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


    finalizarAsignada = async (incidencia) => {

        const  {
            idIncidencia,
            idUsuario,
            descripcionResolucion
        } = incidencia;

        const client = await pool.connect();

        try{
            await client.query('BEGIN');

            const sqlActualizar = `
                UPDATE incidencias
                SET
                    id_estado = 3,
                    descripcion_resolucion = $1
                WHERE id_incidencia = $2
                    AND asignado_a = $3
                    AND id_estado = 2
                RETURNING id_incidencia, id_estado
            `;

            const { rowCount, rows } = await client.query(sqlActualizar, [
                descripcionResolucion,
                idIncidencia,
                idUsuario
            ]);

            if (rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const sqlHistorial = `
                INSERT INTO incidencias_estados (
                    id_incidencia,
                    id_estado

                )
                VALUES ($1, $2)
            `;
            await client.query(sqlHistorial,[
                rows[0].id_incidencia,
                rows[0].id_estado
            ]);

            const sqlRespuesta = `
                SELECT
                    i.id_incidencia,
                    to_char(i.creado, 'DD-MM-YYYY HH24:MI') AS creado,
                    a.descripcion AS articulo_descripcion,
                    c.descripcion AS categoria,
                    i.descripcion_pedido,
                    i.prioridad,
                    i.id_estado,
                    e.descripcion AS estado,
                    i.descripcion_resolucion
                FROM incidencias AS i
                JOIN articulos AS a
                    ON a.id_articulo = i.id_articulo
                JOIN categorias AS c
                    ON c.id_categoria = a.id_categoria
                JOIN estados AS e
                    ON e.id_estado = i.id_estado
                WHERE i.id_incidencia = $1
            `;
            
            const { rows: incidencias } = await client.query(sqlRespuesta, [idIncidencia]);

            if (incidencias.length === 0) {
                throw new Error('No se pudo recuperar la incidencia finalizada.');
            }

            await client.query('COMMIT');
            return incidencias[0];

        } catch(error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    };

    listarTodas = async(limite, offset) => {
        const sql = `
        SELECT
            i.id_incidencia,
            to_char(i.creado, 'DD-MM-YYYY HH24:MI') AS creado,
            a.descripcion AS articulo_descripcion,
            c.descripcion AS categoria_descripcion,
            i.descripcion_pedido,
            i.prioridad,
            i.id_estado,
            e.descripcion AS estado,
            i.asignado_a,
            CONCAT(u.nombres, ' ', u.apellidos) AS tecnico_asignado
            

        FROM incidencias AS i
        JOIN articulos AS a
            ON a.id_articulo = i.id_articulo
        JOIN categorias AS c
            ON c.id_categoria = a.id_categoria
        JOIN estados AS e
            ON e.id_estado = i.id_estado
        JOIN usuarios AS u
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

    asignarA = async(incidencia) => {

        const { id_incidencia, asignado_a } = incidencia;
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
             
            const sqlActualizar = `
                UPDATE incidencias AS i
                SET
                    asignado_a = $1,
                    id_estado = 2
                WHERE i.id_incidencia = $2
                    AND i.id_estado = 1
                    AND EXISTS (
                        SELECT 1
                        FROM USUARIOS AS u
                        WHERE u.id_usuario = $1
                            AND u.activo = 1
                            AND u.rol = 2
                    )
                RETURNING *
            `;
            const { rowCount, rows } = await client.query(sqlActualizar, [
                asignado_a,
                id_incidencia
            ]);

            if (rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }
            
            const  incidenciaActualizada = rows[0];

            const sqlHistorial = `
                INSERT INTO incidencias_estados (
                    id_incidencia,
                    id_estado
                )
                VALUES ($1, $2)
            `;

            await client.query(sqlHistorial, [
                incidenciaActualizada.id_incidencia,
                incidenciaActualizada.id_estado
            ]);

            await client.query('COMMIT')
            return incidenciaActualizada;



        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    };

    cancelarPendiente = async (incidencia) => {

        const {id_incidencia } = incidencia;
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const sqlActualizar = `
                UPDATE incidencias
                SET id_estado = 4
                WHERE id_incidencia = $1
                    AND id_estado = 1
                RETURNING id_incidencia, id_estado
            `;

            const { rowCount, rows } = await client.query(sqlActualizar, [
                id_incidencia
            ]);

            if (rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const sqlHistorial = `
                INSERT INTO incidencias_estados (
                    id_incidencia,
                    id_estado
                )
                VALUES ($1, $2)
            `;
            
            await client.query(sqlHistorial, [
                rows[0].id_incidencia,
                rows[0].id_estado
            ]);

            await client.query('COMMIT');
            return rows[0];

        } catch(error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    };


    // EMPLEADO MUNICIPAL
    crear = async (incidencia) => {

        const {
            id_articulo,
            creado_por,
            prioridad,
            descripcion_pedido
        } = incidencia;

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const sqlCrear = `
                INSERT INTO incidencias (
                    id_articulo,
                    id_estado,
                    creado_por,
                    asignado_a,
                    creado,
                    prioridad,
                    descripcion_pedido
                )
                SELECT
                    $1,
                    1,
                    $2,
                    1,
                    CURRENT_TIMESTAMP,
                    $3,
                    $4
                FROM articulos AS a
                WHERE a.id_articulo = $1
                    AND a.activo = 1
                RETURNING
                    id_incidencia,
                    id_articulo,
                    id_estado,
                    to_char(creado, 'DD-MM-YYYY HH24:MI') AS creado,
                    creado_por,
                    asignado_a,
                    prioridad,
                    descripcion_pedido
            `;

            const { rowCount, rows } = await client.query(sqlCrear, [
                id_articulo,
                creado_por,
                prioridad,
                descripcion_pedido
            ]);

            if (rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const incidenciaCreada = rows[0];

            const sqlHistorial = `
                INSERT INTO incidencias_estados (
                    id_incidencia,
                    id_estado
                )
                VALUES ($1, $2)
            `;

            await client.query(sqlHistorial, [
                incidenciaCreada.id_incidencia,
                incidenciaCreada.id_estado
            ]);

            await client.query('COMMIT');
            return incidenciaCreada;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    };

    listarCreadasPor = async (idUsuario, limite, offset) => {
        const sql = `
            SELECT
                i.id_incidencia,
                i.descripcion_pedido,
                i.descripcion_resolucion,
                to_char(i.creado, 'DD-MM-YYYY HH24:MI') AS creado,
                a.descripcion AS articulo_descripcion,
                i.prioridad,
                c.descripcion AS categoria,
                CONCAT(u.apellidos, ' ', u.nombres) AS asignado_a,
                e.descripcion AS estado,
                i.id_estado
            FROM incidencias AS i
            JOIN articulos AS a
                ON a.id_articulo = i.id_articulo
            JOIN categorias AS c
                ON c.id_categoria = a.id_categoria
            JOIN usuarios AS u
                ON u.id_usuario = i.asignado_a
            JOIN estados AS e
                ON e.id_estado = i.id_estado
            WHERE i.creado_por = $1
            ORDER BY i.creado DESC, i.id_incidencia DESC
            LIMIT $2 OFFSET $3
        `;

        const { rows } = await pool.query(sql, [idUsuario, limite, offset]);

        const sqlConteo = `
            SELECT COUNT(*)::int AS total
            FROM incidencias
            WHERE creado_por = $1
        `;

        const { rows: conteo } = await pool.query(sqlConteo, [idUsuario]);

        return {
            datos: rows,
            total: conteo[0].total
        };
    };

    cancelarPropiaPendiente = async (incidencia) => {
        const { id_incidencia, creado_por } = incidencia;
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const sqlActualizar = `
                UPDATE incidencias
                SET id_estado = 4
                WHERE id_incidencia = $1
                    AND creado_por = $2
                    AND id_estado = 1
                RETURNING id_incidencia, id_estado
            `;

            const { rowCount, rows } = await client.query(sqlActualizar, [
                id_incidencia,
                creado_por
            ]);

            if (rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const sqlHistorial = `
                INSERT INTO incidencias_estados (
                    id_incidencia,
                    id_estado
                )
                VALUES ($1, $2)
            `;

            await client.query(sqlHistorial, [
                rows[0].id_incidencia,
                rows[0].id_estado
            ]);

            await client.query('COMMIT');
            return rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    };


    






    







}
   

export default IncidenciasRepository;
