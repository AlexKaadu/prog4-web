import express from 'express';
import ctrl from '../controllers/incidencias.controller.js';
import autenticar from '../middleware/autenticacion.validator.js';
import autorizarAccion from '../middleware/autorizar-accion.js';
import { 
    validarFinalizarIncidencia,
    validarAsignarIncidencia,
    validarCancelarIncidencia,
    validarCrearIncidencia
} from '../middleware/incidencias.validators.js';
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

router.patch(
    '/:id/asignar',
    autenticar,
    autorizarAccion('incidencias:asignar'),
    validarAsignarIncidencia,
    ctrl.asignarA
);

router.patch(
    '/:id/cancelar',
    autenticar,
    autorizarAccion('incidencias:cancelar'),
    validarCancelarIncidencia,
    ctrl.cancelarPendiente
);

router.post(
    '/',
    autenticar,
    autorizarAccion('incidencias:crear'),
    validarCrearIncidencia,
    ctrl.crear
);

router.get(
    '/propias',
    autenticar,
    autorizarAccion('incidencias:listar-propias'),
    validarPaginacion,
    ctrl.listarPropias
);

router.patch(
    '/:id/cancelar-propia',
    autenticar,
    autorizarAccion('incidencias:cancelar-propia'),
    validarCancelarIncidencia,
    ctrl.cancelarPropiaPendiente
);

export default router;