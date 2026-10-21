import express from 'express';
import ctrl from '../controllers/categorias.controller.js';
import { validarIdCategoria, validarDescripcionCategoria } from '../middleware/categorias.validators.js';
import { validarPaginacion } from '../middleware/paginacion.validators.js';

const router = express.Router();

router.get('/', validarPaginacion, ctrl.listar);
router.post('/', validarDescripcionCategoria, ctrl.crear)
router.get('/:id', validarIdCategoria, ctrl.obtenerPorId);
router.put('/:id', validarIdCategoria, validarDescripcionCategoria, ctrl.actualizar);
router.delete('/:id', validarIdCategoria, ctrl.eliminar);

export default router;
