import areasService from '../services/areas.service.js';

class AreasController {
    constructor(servicio = areasService) {
        this.area = servicio;
    }

    listarActivas = async (req, res) => {
        try {
            const areas = await this.area.listarActivas();
            return res.status(200).json(areas);
        } catch (error) {
            console.error('Error al listar las áreas:', error);
            return res.status(500).json({
                error: 'Error al obtener las áreas'
            });
        }
    };

    obtenerPorId = async (req, res) => {
        const { id } = req.params;

        try {
            const area = await this.area.obtenerPorId(id);

            if (!area) {
                return res.status(404).json({ error: 'Área no encontrada' });
            }

            return res.status(200).json(area);
        } catch (error) {
            console.error('Error al obtener el área:', error);
            return res.status(500).json({ error: 'Error al obtener el área' });
        }
    };

    crear = async (req, res) => {
        try {
            const area = await this.area.crear(req.body.descripcion);
            return res.status(201).json(area);
        } catch (error) {
            console.error('Error al crear el área:', error);
            return res.status(500).json({ error: 'Error al crear el área' });
        }
    };

    actualizar = async (req, res) => {
        const { id } = req.params;

        try {
            const area = await this.area.actualizar(id, req.body.descripcion);

            if (!area) {
                return res.status(404).json({ error: 'Área no encontrada' });
            }

            return res.status(200).json(area);
        } catch (error) {
            console.error('Error al actualizar el área:', error);
            return res.status(500).json({ error: 'Error al actualizar el área' });
        }
    };

    eliminar = async (req, res) => {
        const { id } = req.params;

        try {
            const area = await this.area.eliminar(id);

            if (!area) {
                return res.status(404).json({ error: 'Área no encontrada' });
            }

            return res.status(200).json({
                mensaje: 'Área desactivada',
                area
            });
        } catch (error) {
            if (error.code === 'AREA_CON_ARTICULOS') {
                return res.status(409).json({ error: error.message });
            }

            console.error('Error al eliminar el área:', error);
            return res.status(500).json({ error: 'Error al desactivar el área' });
        }
    };
}

export default new AreasController();
