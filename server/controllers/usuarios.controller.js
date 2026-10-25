import usuariosService from '../services/usuarios.service.js';
import { obtenerPaginacion, armarRespuesta } from '../utils/paginacion.js';

class UsuariosController {
    constructor(servicio = usuariosService) {
        this.usuario = servicio;
    }

    listar = async (req, res) => {
        try {
            const { pagina, limite, offset } = obtenerPaginacion(req);
            const { datos, total } = await this.usuario.listar(limite, offset);

            return res.status(200).json(
                armarRespuesta(datos, total, pagina, limite)
            );
        } catch (error) {
            console.error('Error al listar usuarios:', error);
            return res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
    };

    obtenerPorId = async (req, res) => {
        const { id } = req.params;

        try {
            const usuario = await this.usuario.obtenerPorId(id);

            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            return res.status(200).json(usuario);
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            return res.status(500).json({ error: 'Error al obtener el usuario' });
        }
    };

    crear = async (req, res) => {
        try {
            const usuario = await this.usuario.crear(req.body);

            if (!usuario) {
                return res.status(400).json({ error: 'No se pudo crear el usuario' });
            }

            return res.status(201).json(usuario);
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            return res.status(500).json({ error: 'Error al crear el usuario' });
        }
    };

    actualizar = async (req, res) => {
        const { id } = req.params;

        try {
            const usuario = await this.usuario.actualizar(id, req.body);

            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            return res.status(200).json(usuario);
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            return res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
    };

    eliminar = async (req, res) => {
        const { id } = req.params;

        try {
            const usuario = await this.usuario.eliminar(id);

            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            return res.status(200).json({
                mensaje: 'Usuario desactivado',
                usuario
            });
        } catch (error) {
            console.error('Error al desactivar el usuario:', error);
            return res.status(500).json({ error: 'Error al desactivar el usuario' });
        }
    };
}

export default new UsuariosController();