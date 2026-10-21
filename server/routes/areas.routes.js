import express from 'express';
import ctrl from '../controllers/areas.controller.js';
import { validarIdArea, validarDescripcionArea } from '../middleware/areas.validators.js';

const router = express.Router();

router.get('/', ctrl.listarActivas);
router.post('/', validarDescripcionArea, ctrl.crear);
router.get('/:id', validarIdArea, ctrl.obtenerPorId);
router.put('/:id', validarIdArea, validarDescripcionArea, ctrl.actualizar);
router.delete('/:id', validarIdArea, ctrl.eliminar);

export default router;