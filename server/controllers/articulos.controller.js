const articulosService = require('../services/articulos.service');
const { obtenerPaginacion, armarRespuesta } = require('../utils/paginacion');

exports.listar = async(req, res) => {
    try {
        const { pagina, limite, offset } = obtenerPaginacion(req);
        const { datos, total } = await articulosService.listar(limite, offset);

         res.status(200).json(
            armarRespuesta(datos, total, pagina, limite)
        );
    } catch(error){
        console.error('Error al listar articulos:', error);
        res.status(500).json({ error: 'Error al obtener los articulos' });
    }
};


exports.obtenerPorId = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const articulo = await articulosService.obtenerPorId(id);

        if (!articulo) {
            return res.status(404).json({ error: 'articulo no encontrada' });
        }

        res.status(200).json(articulo);
    } catch (error) {
        console.error('Error al obtener el articulo', error);
        res.status(500).json({ error: 'Error al obtener el articulo' });
    }
};


exports.actualizar = async (req, res) => {
    const id = Number(req.params.id);
    const idArea = req.body.id_area;
    const idCategoria = req.body.id_categoria;
    const descripcion = req.body.descripcion;

    try {
        const articulo = await articulosService.actualizar(id, idArea, idCategoria, descripcion);

        if (!articulo) {
            return res.status(404).json({ error: 'Articulo no encontrado' });
        }

        res.status(200).json(articulo);
    } catch (error) {

        if(error.code === 'AREA_INACTIVA') {
            return res.status(400).json({error: error.message});
        }

        if(error.code === 'CATEGORIA_INACTIVA') {
            return res.status(400).json({error: error.message});
        }

        console.error('Error al actualizar el articulo:', error);
        res.status(500).json({ error: 'Error al actualizar el articulo' });
    }
};


exports.crear = async(req, res) => {
    const idArea = req.body.id_area;
    const idCategoria = req.body.id_categoria;
    const descripcion = req.body.descripcion;

    try {
        const articulo = await articulosService.crear(idArea, idCategoria, descripcion);

        if(!articulo) {
            return res.status(400).json({error: 'No se pudo crear el articulo'});

        }
        res.status(201).json(articulo);
    } catch (error) {
        
        if(error.code === 'AREA_INACTIVA'){
            return res.status(400).json({error: error.message});
        }

        if(error.code === 'CATEGORIA_INACTIVA') {
            return res.status(400).json({error: error.message});
        }

    
        console.error('Error al crear el articulo:', error);
        res.status(500).json({error: 'Error al crear el articulo'});
    }
};


exports.eliminar = async(req,res) => {
    const id = Number(req.params.id);

    try {
        const articulo = await articulosService.eliminar(id);

        if(!articulo) {
            return res.status(404).json({error: 'Articulo no encontrado'});
        }
        res.status(200).json({
            mensaje: 'Articulo desactivado',
            articulo
        });

    } catch (error) {
        console.error('Error al eliminar el articulo:', error);
        res.status(500).json({error: 'Error al eliminar el articulo'});

    }
};








