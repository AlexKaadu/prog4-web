const router = require('express').Router();
const ctrl = require('../controllers/articulos.controller');
const {validarIdArticulo, validarDatosArticulo} = require('../middleware/articulos.validators');
const { validarPaginacion } = require('../middleware/paginacion.validators');


router.get('/', validarPaginacion, ctrl.listar);
router.post('/', validarDatosArticulo, ctrl.crear);
router.get('/:id', validarIdArticulo, ctrl.obtenerPorId);
router.put('/:id', validarIdArticulo, validarDatosArticulo, ctrl.actualizar);
router.delete('/:id', validarIdArticulo, ctrl.eliminar);

module.exports = router;


