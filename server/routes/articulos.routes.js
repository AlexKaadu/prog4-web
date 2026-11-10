import express from 'express';
import ctrl from '../controllers/articulos.controller.js';
import { validarIdArticulo, validarDatosArticulo } from '../middleware/articulos.validators.js';
import { validarPaginacion } from '../middleware/paginacion.validators.js';
import autenticar from '../middleware/autenticacion.validator.js';
import autorizarAccion from '../middleware/autorizar-accion.js';
import apicache from 'apicache';

const router = express.Router();
const cache = apicache.middleware;
const invalidarCache = (req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode < 400) {
            apicache.clear();
        }
    });
    next();
};


/**
 * @swagger
 * /articulos:
 *   get:
 *     summary: Listar artículos
 *     tags: [Artículos]
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
 *         description: Artículos por página
 *     responses:
 *       200:
 *         description: Lista paginada de artículos
 *       400:
 *         description: Parámetros de paginación inválidos
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para listar artículos
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    '/',
    autenticar,
    autorizarAccion('articulos:listar'),
    validarPaginacion,
    cache('3 minutes'),
    ctrl.listar
);

/**
 * @swagger
 * /articulos:
 *   post:
 *     summary: Crear un artículo
 *     tags: [Artículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_area
 *               - id_categoria
 *               - descripcion
 *             properties:
 *               id_area:
 *                 type: integer
 *                 example: 1
 *               id_categoria:
 *                 type: integer
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: Notebook HP
 *     responses:
 *       201:
 *         description: Artículo creado correctamente
 *       400:
 *         description: Datos inválidos o área/categoría inactiva
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para crear artículos
 *       500:
 *         description: Error interno del servidor
 */
router.post(
    '/',
    autenticar,
    autorizarAccion('articulos:crear'),
    validarDatosArticulo,
    invalidarCache,
    ctrl.crear
);

/**
 * @swagger
 * /articulos/{id}:
 *   get:
 *     summary: Obtener un artículo por su ID
 *     tags: [Artículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador del artículo
 *     responses:
 *       200:
 *         description: Artículo encontrado
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para consultar artículos
 *       404:
 *         description: Artículo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    '/:id',
    autenticar,
    autorizarAccion('articulos:obtener'),
    validarIdArticulo,
    cache('3 minutes'),
    ctrl.obtenerPorId
);

/**
 * @swagger
 * /articulos/{id}:
 *   put:
 *     summary: Actualizar un artículo
 *     tags: [Artículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador del artículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_area
 *               - id_categoria
 *               - descripcion
 *             properties:
 *               id_area:
 *                 type: integer
 *                 example: 1
 *               id_categoria:
 *                 type: integer
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: Notebook HP
 *     responses:
 *       200:
 *         description: Artículo actualizado correctamente
 *       400:
 *         description: Datos inválidos o área/categoría inactiva
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para actualizar artículos
 *       404:
 *         description: Artículo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
    '/:id',
    autenticar,
    autorizarAccion('articulos:actualizar'),
    validarIdArticulo,
    validarDatosArticulo,
    invalidarCache,
    ctrl.actualizar
);

/**
 * @swagger
 * /articulos/{id}:
 *   delete:
 *     summary: Desactivar un artículo
 *     description: Realiza una baja lógica; el artículo no se borra físicamente.
 *     tags: [Artículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador del artículo
 *     responses:
 *       200:
 *         description: Artículo desactivado correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para desactivar artículos
 *       404:
 *         description: Artículo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
    '/:id',
    autenticar,
    autorizarAccion('articulos:eliminar'),
    validarIdArticulo,
    invalidarCache,
    ctrl.eliminar
);

export default router;
