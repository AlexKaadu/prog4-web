import express from 'express';
import ctrl from '../controllers/categorias.controller.js';
import { validarIdCategoria, validarDescripcionCategoria } from '../middleware/categorias.validators.js';
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
 * /categorias:
 *   get:
 *     summary: Listar categorías activas
 *     tags: [Categorías]
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
 *         description: Cantidad de categorías por página
 *     responses:
 *       200:
 *         description: Categorías listadas correctamente
 *       400:
 *         description: Parámetros de paginación inválidos
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para listar categorías
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    '/',
    autenticar,
    autorizarAccion('categorias:listar'),
    validarPaginacion,
    cache('3 minutes'),
    ctrl.listar
);


/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Crear una categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: Periféricos
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *       400:
 *         description: Descripción inválida o no se pudo crear
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para crear categorías
 *       500:
 *         description: Error interno del servidor
 */
router.post(
    '/',
    autenticar,
    autorizarAccion('categorias:crear'),
    validarDescripcionCategoria,
    invalidarCache,
    ctrl.crear
);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Obtener una categoría por su ID
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para consultar categorías
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    '/:id',
    autenticar,
    autorizarAccion('categorias:obtener'),
    validarIdCategoria,
    cache('3 minutes'),
    ctrl.obtenerPorId
);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: Periféricos y accesorios
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *       400:
 *         description: ID o descripción inválidos
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para actualizar categorías
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put(
    '/:id',
    autenticar,
    autorizarAccion('categorias:actualizar'),
    validarIdCategoria,
    validarDescripcionCategoria,
    invalidarCache,
    ctrl.actualizar
);


/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Desactivar una categoría
 *     description: Realiza una baja lógica; la categoría no se borra físicamente.
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador de la categoría
 *     responses:
 *       200:
 *         description: Categoría desactivada correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para desactivar categorías
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
    '/:id',
    autenticar,
    autorizarAccion('categorias:eliminar'),
    validarIdCategoria,
    invalidarCache,
    ctrl.eliminar
);

export default router;
