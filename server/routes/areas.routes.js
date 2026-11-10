import express from 'express';
import ctrl from '../controllers/areas.controller.js';
import { validarIdArea, validarDescripcionArea } from '../middleware/areas.validators.js';
import autenticar from '../middleware/autenticacion.validator.js';
import autorizarAccion from '../middleware/autorizar-accion.js';

const router = express.Router();


/**
 * @swagger
 * /areas:
 *   get:
 *     summary: Listar áreas activas
 *     tags: [Áreas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de áreas activas
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para listar áreas
 *       500:
 *         description: Error interno al obtener las áreas
 */
router.get(
    '/',
    autenticar,
    autorizarAccion('areas:listar'),
    ctrl.listarActivas
);

/**
 * @swagger
 * /areas:
 *   post:
 *     summary: Crear un área
 *     tags: [Áreas]
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
 *                 example: Sistemas
 *     responses:
 *       201:
 *         description: Área creada correctamente
 *       400:
 *         description: Descripción inválida
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para crear áreas
 *       500:
 *         description: Error interno al crear el área
 */
router.post(
    '/',
    autenticar,
    autorizarAccion('areas:crear'),
    validarDescripcionArea,
    ctrl.crear
);

/**
 * @swagger
 * /areas/{id}:
 *   get:
 *     summary: Obtener un área por su ID
 *     tags: [Áreas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador del área
 *     responses:
 *       200:
 *         description: Área encontrada
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para consultar áreas
 *       404:
 *         description: Área no encontrada
 *       500:
 *         description: Error interno al obtener el área
 */
router.get(
    '/:id',
    autenticar,
    autorizarAccion('areas:obtener'),
    validarIdArea,
    ctrl.obtenerPorId
);

/**
 * @swagger
 * /areas/{id}:
 *   put:
 *     summary: Actualizar un área
 *     tags: [Áreas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador del área
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
 *                 example: Infraestructura
 *     responses:
 *       200:
 *         description: Área actualizada correctamente
 *       400:
 *         description: ID o descripción inválidos
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para actualizar áreas
 *       404:
 *         description: Área no encontrada
 *       500:
 *         description: Error interno al actualizar el área
 */
router.put(
    '/:id',
    autenticar,
    autorizarAccion('areas:actualizar'),
    validarIdArea,
    validarDescripcionArea,
    ctrl.actualizar
);

/**
 * @swagger
 * /areas/{id}:
 *   delete:
 *     summary: Desactivar un área
 *     description: Realiza una baja lógica; el área no se borra físicamente. No se puede desactivar si tiene artículos activos.
 *     tags: [Áreas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador del área
 *     responses:
 *       200:
 *         description: Área desactivada correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para desactivar áreas
 *       404:
 *         description: Área no encontrada
 *       409:
 *         description: El área tiene artículos activos y no puede desactivarse
 *       500:
 *         description: Error interno al desactivar el área
 */
router.delete(
    '/:id',
    autenticar,
    autorizarAccion('areas:eliminar'),
    validarIdArea,
    ctrl.eliminar
);

export default router;