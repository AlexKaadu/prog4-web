const router = require('express').Router();
const ctrl = require('../controllers/categorias.controller');
const { validarIdCategoria, validarDescripcionCategoria } = require('../middleware/categorias.validators');
const { validarPaginacion } = require('../middleware/paginacion.validators');

router.get('/', validarPaginacion, ctrl.listar);
router.post('/', validarDescripcionCategoria, ctrl.crear)
router.get('/:id', validarIdCategoria, ctrl.obtenerPorId);
router.put('/:id', validarIdCategoria, validarDescripcionCategoria, ctrl.actualizar);
router.delete('/:id', validarIdCategoria, ctrl.eliminar);

module.exports = router;
