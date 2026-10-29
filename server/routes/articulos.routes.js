import express from 'express';
import ctrl from '../controllers/articulos.controller.js';
import { validarIdArticulo, validarDatosArticulo } from '../middleware/articulos.validators.js';
import { validarPaginacion } from '../middleware/paginacion.validators.js';
import autenticar from '../middleware/autenticacion.validator.js';
import autorizarAccion from '../middleware/autorizar-accion.js';

const router = express.Router();

router.get(
    '/',
    autenticar,
    autorizarAccion('articulos:listar'),
    validarPaginacion,
    ctrl.listar
);

router.post(
    '/',
    autenticar,
    autorizarAccion('articulos:crear'),
    validarDatosArticulo,
    ctrl.crear
);

router.get(
    '/:id',
    autenticar,
    autorizarAccion('articulos:obtener'),
    validarIdArticulo,
    ctrl.obtenerPorId
);

router.put(
    '/:id',
    autenticar,
    autorizarAccion('articulos:actualizar'),
    validarIdArticulo,
    validarDatosArticulo,
    ctrl.actualizar
);

router.delete(
    '/:id',
    autenticar,
    autorizarAccion('articulos:eliminar'),
    validarIdArticulo,
    ctrl.eliminar
);

export default router;

