import express from 'express';
import ctrl from '../controllers/categorias.controller.js';
import { validarIdCategoria, validarDescripcionCategoria } from '../middleware/categorias.validators.js';
import { validarPaginacion } from '../middleware/paginacion.validators.js';
import autenticar from '../middleware/autenticacion.validator.js';
import autorizarAccion from '../middleware/autorizar-accion.js';

const router = express.Router();

router.get(
    '/',
    autenticar,
    autorizarAccion('categorias:listar'),
    validarPaginacion,
    ctrl.listar
);

router.post(
    '/',
    autenticar,
    autorizarAccion('categorias:crear'),
    validarDescripcionCategoria,
    ctrl.crear
);

router.get(
    '/:id',
    autenticar,
    autorizarAccion('categorias:obtener'),
    validarIdCategoria,
    ctrl.obtenerPorId
);

router.put(
    '/:id',
    autenticar,
    autorizarAccion('categorias:actualizar'),
    validarIdCategoria,
    validarDescripcionCategoria,
    ctrl.actualizar
);

router.delete(
    '/:id',
    autenticar,
    autorizarAccion('categorias:eliminar'),
    validarIdCategoria,
    ctrl.eliminar
);

export default router;
