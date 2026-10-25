import express from 'express';
import usuariosController from '../controllers/usuarios.controller.js';
import {
    validarIdUsuario,
    validarDatosCrearUsuario,
    validarDatosActualizarUsuario
} from '../middleware/usuarios.validators.js';
import { validarPaginacion } from '../middleware/paginacion.validators.js';
import autenticar from '../middleware/autenticacion.validator.js';

const router = express.Router();

router.get('/', validarPaginacion, usuariosController.listar);
router.post('/', validarDatosCrearUsuario, usuariosController.crear);
router.get('/:id', autenticar, validarIdUsuario, usuariosController.obtenerPorId);
router.put('/:id', validarIdUsuario, validarDatosActualizarUsuario, usuariosController.actualizar);
router.delete('/:id', validarIdUsuario, usuariosController.eliminar);

export default router;