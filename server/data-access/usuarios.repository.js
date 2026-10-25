import pool from '../db.js';

class UsuariosRepository {


    buscarPorUsuarioContrasenia = async (usuario, contrasenia) => {
    
            const sql = `
                SELECT id_usuario, nombres, apellidos, rol
                FROM usuarios AS u
                WHERE u.activo = 1 AND u.usuario = $1 AND
                    u.contrasenia = encode(digest($2, 'sha256'), 'hex')`;
    
            
            const { rowCount, rows } = await pool.query(sql, [usuario, contrasenia]);
    
            if(rowCount === 0){
                return null;
            }
    
            return rows[0];
        };


    listar = async (limite, offset) => {
        const sql = `
            SELECT
                id_usuario,
                id_area,
                nombres,
                apellidos,
                usuario,
                rol,
                activo
            FROM usuarios
            WHERE activo = 1
            ORDER BY id_usuario
            LIMIT $1 OFFSET $2

            `;
            
            const { rows } = await pool.query(sql, [limite, offset]);

            const sqlConteo = `
                SELECT COUNT(*)::int AS total
                FROM usuarios
                WHERE activo = 1
            `;

            const { rows: conteo } = await pool.query(sqlConteo);

            return {
                datos: rows,
                total: conteo[0].total
            };
    };

    obtenerPorId = async (id) => {
        const sql = `
            SELECT
                id_usuario,
                id_area,
                nombres,
                apellidos,
                usuario,
                rol,
                activo
            FROM usuarios
            WHERE id_usuario = $1
                AND activo = 1
        `;

        const { rowCount, rows } = await pool.query(sql, [id]);

        if(rowCount === 0) {
            return null;

        }

        return rows[0];
    };

    crear = async ({
        id_area,
        nombres,
        apellidos,
        usuario,
        contrasenia,
        rol
    }) => {
        const sql = `
            INSERT INTO usuarios (
                id_area,
                nombres,
                apellidos,
                usuario,
                contrasenia,
                avatar,
                rol,
                activo
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                encode(digest($5, 'sha256'), 'hex'),
                '',
                $6,
                1
            )
            RETURNING
                id_usuario,
                id_area,
                nombres,
                apellidos,
                usuario,
                rol,
                activo
        `;
        const valores = [
            id_area,
            nombres,
            apellidos,
            usuario,
            contrasenia,
            rol
        ];
        const { rowCount, rows } = await pool.query(sql, valores);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };



    actualizar = async (id, {
        id_area,
        nombres,
        apellidos,
        usuario,
        rol
    }) => {
        const sql = `
            UPDATE usuarios
            SET
                id_area = $2,
                nombres = $3,
                apellidos = $4,
                usuario = $5,
                rol = $6
            WHERE id_usuario = $1
                AND activo = 1
            RETURNING
                id_usuario,
                id_area,
                nombres,
                apellidos,
                usuario,
                rol,
                activo
        `;
        const valores = [
            id,
            id_area,
            nombres,
            apellidos,
            usuario,
            rol
        ];
        const { rowCount, rows } = await pool.query(sql, valores);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };



    eliminar = async (id) => {
        const sql = `
            UPDATE usuarios
            SET activo = 0
            WHERE id_usuario = $1
                AND activo = 1
            RETURNING
                id_usuario,
                id_area,
                nombres,
                apellidos,
                usuario,
                rol,
                activo
        `;
        const { rowCount, rows } = await pool.query(sql, [id]);

        if (rowCount === 0) {
            return null;
        }

        return rows[0];
    };

}

export default UsuariosRepository;