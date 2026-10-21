import express from 'express';
import ctrl from '../controllers/articulos.controller.js';
import { validarIdArticulo, validarDatosArticulo } from '../middleware/articulos.validators.js';
import { validarPaginacion } from '../middleware/paginacion.validators.js';

const router = express.Router();

router.get('/', validarPaginacion, ctrl.listar);
router.post('/', validarDatosArticulo, ctrl.crear);
router.get('/:id', validarIdArticulo, ctrl.obtenerPorId);
router.put('/:id', validarIdArticulo, validarDatosArticulo, ctrl.actualizar);
router.delete('/:id', validarIdArticulo, ctrl.eliminar);

export default router;

