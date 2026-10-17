const router = require('express').Router();
const ctrl = require('../controllers/areas.controller');
const { validarIdArea, validarDescripcionArea} = require('../middleware/areas.validators');

router.get('/', ctrl.listarActivas);
router.post('/', validarDescripcionArea, ctrl.crear);
router.get('/:id', validarIdArea, ctrl.obtenerPorId);
router.put('/:id', validarIdArea, validarDescripcionArea, ctrl.actualizar);
router.delete('/:id', validarIdArea, ctrl.eliminar);

module.exports = router;