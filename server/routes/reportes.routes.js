import express from 'express';
import { dashboardPdf, dashboardDatos } from '../controllers/reportes.controller.js';
import autenticar from '../middleware/autenticacion.validator.js';
import autorizarAccion from '../middleware/autorizar-accion.js';

const router = express.Router();


router.post(
    '/dashboard',
    autenticar,
    autorizarAccion('reportes:dashboard'),
    dashboardPdf
);



router.get(
    '/dashboard',
    autenticar,
    autorizarAccion('reportes:dashboard'),
    dashboardDatos
);

export default router;