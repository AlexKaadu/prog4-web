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
import apicache from 'apicache';

const cache = apicache.middleware;

const router = express.Router();
const invalidarCache = (req, res, next) => {
    res.on('finish', () => apicache.clear());
    next();
};


/**
 * @swagger
 * /incidencias/asignadas:
 *   get:
 *     summary: Listar incidencias asignadas al empleado
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de incidencias por página
 *     responses:
 *       200:
 *         description: Lista paginada de incidencias asignadas al usuario autenticado
 *       400:
 *         description: Parámetros de paginación inválidos
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para listar incidencias asignadas
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    '/asignadas',
    autenticar,
    autorizarAccion('incidencias:listar-asignadas'),
    validarPaginacion,
    ctrl.listarAsignadas
);

/**
 * @swagger
 * /incidencias/{id}/finalizar:
 *   patch:
 *     summary: Finalizar una incidencia asignada
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador de la incidencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion_resolucion
 *             properties:
 *               descripcion_resolucion:
 *                 type: string
 *                 maxLength: 250
 *                 example: Se reemplazó el componente defectuoso.
 *     responses:
 *       200:
 *         description: Incidencia finalizada correctamente
 *       400:
 *         description: ID o descripción de resolución inválidos
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para finalizar incidencias
 *       409:
 *         description: La incidencia no está asignada al usuario o no se puede finalizar
 *       502:
 *         description: La incidencia se actualizó, pero falló el envío del correo
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
    '/:id/finalizar',
    autenticar,
    autorizarAccion('incidencias:finalizar'),
    validarFinalizarIncidencia,
    invalidarCache,
    ctrl.finalizarAsignada
);

/**
 * @swagger
 * /incidencias:
 *   get:
 *     summary: Listar incidencias
 *     description: Devuelve una lista paginada de incidencias. Requiere permisos de director.
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de incidencias por página
 *     responses:
 *       200:
 *         description: Lista paginada de incidencias
 *       400:
 *         description: Parámetros de paginación inválidos
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para listar incidencias
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    '/',
    autenticar,
    autorizarAccion('incidencias:listar'),
    validarPaginacion,
    cache('3 minutes'),
    ctrl.listarTodas
);

/**
 * @swagger
 * /incidencias/{id}/asignar:
 *   patch:
 *     summary: Asignar una incidencia a un técnico
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador de la incidencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - asignado_a
 *             properties:
 *               asignado_a:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *                 description: ID del empleado de Sistemas que recibirá la incidencia
 *     responses:
 *       200:
 *         description: Incidencia asignada correctamente
 *       400:
 *         description: ID de incidencia o técnico inválido
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para asignar incidencias
 *       409:
 *         description: La incidencia no está pendiente o el usuario no es un técnico activo
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
    '/:id/asignar',
    autenticar,
    autorizarAccion('incidencias:asignar'),
    validarAsignarIncidencia,
    invalidarCache,
    ctrl.asignarA
);

/**
 * @swagger
 * /incidencias/{id}/cancelar:
 *   patch:
 *     summary: Cancelar una incidencia pendiente
 *     description: Permite al director cancelar una incidencia que todavía está pendiente.
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador de la incidencia
 *     responses:
 *       200:
 *         description: Incidencia cancelada correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para cancelar incidencias
 *       409:
 *         description: La incidencia no está pendiente y no se puede cancelar
 *       502:
 *         description: Falló el envío del correo de notificación
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
    '/:id/cancelar',
    autenticar,
    autorizarAccion('incidencias:cancelar'),
    validarCancelarIncidencia,
    invalidarCache,
    ctrl.cancelarPendiente
);

/**
 * @swagger
 * /incidencias:
 *   post:
 *     summary: Crear una incidencia
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_articulo
 *               - prioridad
 *               - descripcion_pedido
 *             properties:
 *               id_articulo:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *               prioridad:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 description: "1 = Baja, 2 = Media, 3 = Alta"
 *                 example: 3
 *               descripcion_pedido:
 *                 type: string
 *                 example: La computadora no enciende.
 *     responses:
 *       201:
 *         description: Incidencia creada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para crear incidencias
 *       404:
 *         description: El artículo no existe o no está activo
 *       500:
 *         description: Error interno del servidor
 */
router.post(
    '/',
    autenticar,
    autorizarAccion('incidencias:crear'),
    validarCrearIncidencia,
    invalidarCache,
    ctrl.crear
);

/**
 * @swagger
 * /incidencias/propias:
 *   get:
 *     summary: Listar mis incidencias
 *     description: Devuelve las incidencias creadas por el usuario autenticado.
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de incidencias por página
 *     responses:
 *       200:
 *         description: Lista paginada de incidencias propias
 *       400:
 *         description: Parámetros de paginación inválidos
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para listar tus incidencias
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    '/propias',
    autenticar,
    autorizarAccion('incidencias:listar-propias'),
    validarPaginacion,
    ctrl.listarPropias
);

/**
 * @swagger
 * /incidencias/{id}/cancelar-propia:
 *   patch:
 *     summary: Cancelar una incidencia propia pendiente
 *     description: Solo permite cancelar incidencias creadas por el usuario autenticado que continúen pendientes.
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador de la incidencia
 *     responses:
 *       200:
 *         description: Incidencia cancelada correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para cancelar incidencias propias
 *       409:
 *         description: La incidencia no es propia o no está pendiente
 *       502:
 *         description: Falló el envío del correo de notificación
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
    '/:id/cancelar-propia',
    autenticar,
    autorizarAccion('incidencias:cancelar-propia'),
    validarCancelarIncidencia,
    invalidarCache,
    ctrl.cancelarPropiaPendiente
);

export default router;