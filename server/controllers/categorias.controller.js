import categoriasService from '../services/categorias.service.js';
import { obtenerPaginacion, armarRespuesta } from '../utils/paginacion.js';

class CategoriasController {
    constructor(servicio = categoriasService) {
        this.categoria = servicio;
    }

    listar = async (req, res) => {
        try {
            const { pagina, limite, offset } = obtenerPaginacion(req);
            const { datos, total } = await this.categoria.listar(limite, offset);

            res.status(200).json(
                armarRespuesta(datos, total, pagina, limite)
            );
        } catch (error) {
            console.error('Error al listar categorias:', error);
            res.status(500).json({ error: 'Error al obtener las categorias' });
        }
    };

    obtenerPorId = async (req, res) => {
        const { id } = req.params;

        try {
            const categoria = await this.categoria.obtenerPorId(id);

            if (!categoria) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }

            res.status(200).json(categoria);
        } catch (error) {
            console.error('Error al obtener la categoría:', error);
            res.status(500).json({ error: 'Error al obtener la categoría' });
        }
    };

    actualizar = async (req, res) => {
        const { id } = req.params;
        const descripcion = req.body.descripcion;

        try {
            const categoria = await this.categoria.actualizar(id, descripcion);

            if (!categoria) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }

            res.status(200).json(categoria);
        } catch (error) {
            console.error('Error al actualizar la categoría:', error);
            res.status(500).json({ error: 'Error al actualizar la categoría' });
        }
    };

    crear = async (req, res) => {
        const descripcion = req.body.descripcion;

        try {
            const categoria = await this.categoria.crear(descripcion);

            if (!categoria) {
                return res.status(400).json({ error: 'No se pudo crear la categoria' });
            }

            res.status(201).json(categoria);
        } catch (error) {
            console.error('Error al crear la categoría:', error);
            res.status(500).json({ error: 'Error al crear la categoría' });
        }
    };

    eliminar = async (req, res) => {
        const { id } = req.params;

        try {
            const categoria = await this.categoria.eliminar(id);

            if (!categoria) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }

            res.status(200).json({
                mensaje: 'Categoría desactivada',
                categoria
            });
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            res.status(500).json({ error: 'Error al eliminar la categoría' });
        }
    };
}

export default new CategoriasController();
