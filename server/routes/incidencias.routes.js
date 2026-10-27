import express from 'express';
import ctrl from '../controllers/incidencias.controller.js';
import autenticar from '../middleware/autenticacion.validator.js';
import autorizarAccion from '../middleware/autorizar-accion.js';
import { validarFinalizarIncidencia, validarComenzarIncidencia } from '../middleware/incidencias.validators.js';
import { validarPaginacion } from '../middleware/paginacion.validators.js';

const router = express.Router();

router.get(
    '/asignadas',
    autenticar,
    autorizarAccion('incidencias:listar-asignadas'),
    validarPaginacion,
    ctrl.listarAsignadas
);

router.patch(
        '/:id/comenzar',
        autenticar,
        autorizarAccion('incidencias:comenzar'),
        validarComenzarIncidencia,
        ctrl.comenzarAsignada
)

router.patch(
    '/:id/finalizar',
    autenticar,
    autorizarAccion('incidencias:finalizar'),
    validarFinalizarIncidencia,
    ctrl.finalizarAsignada
);


router.get(
    '/',
    autenticar,
    autorizarAccion('incidencias:listar'),
    validarPaginacion,
    ctrl.listarTodas
);

export default router;