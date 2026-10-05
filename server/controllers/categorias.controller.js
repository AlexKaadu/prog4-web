
const categoriasService = require('../services/categorias.service');
const { obtenerPaginacion, armarRespuesta } = require('../utils/paginacion');


exports.listar = async (req, res) => {
    try {
        const { pagina, limite, offset } = obtenerPaginacion(req);
        const { datos, total } = await categoriasService.listar(limite, offset);

        res.status(200).json(
            armarRespuesta(datos, total, pagina, limite)
        );
    } catch (error) {
        console.error('Error al listar categorias:', error);
        res.status(500).json({ error: 'Error al obtener las categorias' });
    }
};

exports.obtenerPorId = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const categoria = await categoriasService.obtenerPorId(id);

        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.status(200).json(categoria);
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        res.status(500).json({ error: 'Error al obtener la categoría' });
    }
};

exports.actualizar = async (req, res) => {
    const id = Number(req.params.id);
    const descripcion = req.body.descripcion;

    try {
        const categoria = await categoriasService.actualizar(id, descripcion);

        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.status(200).json(categoria);
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
};


exports.crear = async(req, res) => {
    const descripcion = req.body.descripcion;

    try {
        const categoria = await categoriasService.crear(descripcion);

        if(!categoria) {
            return res.status(400).json({error: 'No se pudo crear la categoria'});

        }
        res.status(201).json(categoria);
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(500).json({error: 'Error al crear la categoría'});
    }
};


exports.eliminar = async(req,res) => {
    const id = Number(req.params.id);

    try {
        const categoria = await categoriasService.eliminar(id);

        if(!categoria) {
            return res.status(404).json({error: 'Categoría no encontrada'});
        }
        res.status(200).json({
            mensaje: 'Categoría desactivada',
            categoria
        });

    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({error: 'Error al eliminar la categoría'});

    }
};