import express from 'express';
import usuariosController from '../controllers/usuarios.controller.js';
import {
    validarIdUsuario,
    validarDatosCrearUsuario,
    validarDatosActualizarUsuario
} from '../middleware/usuarios.validators.js';
import { validarPaginacion } from '../middleware/paginacion.validators.js';
import autenticar from '../middleware/autenticacion.validator.js';
import autorizarAccion from '../middleware/autorizar-accion.js';

const router = express.Router();


/**
 * @swagger
 * /usuarios/tecnicos:
 *   get:
 *     summary: Listar técnicos
 *     description: Devuelve los técnicos disponibles para asignar incidencias.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de técnicos
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para listar técnicos
 *       500:
 *         description: Error interno al obtener los técnicos
 */
router.get(
    '/tecnicos',
    autenticar,
    autorizarAccion('usuarios:listar-tecnicos'),
    usuariosController.listarTecnicos
);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar usuarios
 *     description: Devuelve una lista paginada de usuarios. Requiere permisos del Director.
 *     tags: [Usuarios]
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
 *         description: Cantidad de usuarios por página
 *     responses:
 *       200:
 *         description: Lista paginada de usuarios
 *       400:
 *         description: Parámetros de paginación inválidos
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para listar usuarios
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    '/',
    autenticar,
    autorizarAccion('usuarios:listar'),
    validarPaginacion,
    usuariosController.listar
);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un usuario
 *     description: Requiere permisos del Director.
 *     tags: [Usuarios]
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
 *               - nombres
 *               - apellidos
 *               - usuario
 *               - contrasenia
 *               - rol
 *             properties:
 *               id_area:
 *                 type: integer
 *                 example: 1
 *               nombres:
 *                 type: string
 *                 example: Ana
 *               apellidos:
 *                 type: string
 *                 example: Pérez
 *               usuario:
 *                 type: string
 *                 example: ana.perez
 *               contrasenia:
 *                 type: string
 *                 format: password
 *               rol:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 description: "1 = Director, 2 = Sistemas, 3 = Municipal"
 *                 example: 3
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos o no se pudo crear el usuario
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para crear usuarios
 *       500:
 *         description: Error interno del servidor
 */
router.post(
    '/',
    autenticar,
    autorizarAccion('usuarios:crear'),
    validarDatosCrearUsuario,
    usuariosController.crear
);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     description: Requiere permisos del Director.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para consultar usuarios
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    '/:id',
    autenticar,
    autorizarAccion('usuarios:obtener'),
    validarIdUsuario,
    usuariosController.obtenerPorId
);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     description: Requiere permisos del Director. No se modifica la contraseña con esta operación.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_area
 *               - nombres
 *               - apellidos
 *               - usuario
 *               - rol
 *             properties:
 *               id_area:
 *                 type: integer
 *                 example: 1
 *               nombres:
 *                 type: string
 *                 example: Ana
 *               apellidos:
 *                 type: string
 *                 example: Pérez
 *               usuario:
 *                 type: string
 *                 example: ana.perez
 *               rol:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 description: "1 = Director, 2 = Sistemas, 3 = Municipal"
 *                 example: 3
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para actualizar usuarios
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
    '/:id',
    autenticar,
    autorizarAccion('usuarios:actualizar'),
    validarIdUsuario,
    validarDatosActualizarUsuario,
    usuariosController.actualizar
);



/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Desactivar un usuario
 *     description: Realiza una baja lógica; el usuario no se borra físicamente. Requiere permisos del Director.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador del usuario
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Falta un token válido
 *       403:
 *         description: No tenés permiso para desactivar usuarios
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
    '/:id',
    autenticar,
    autorizarAccion('usuarios:eliminar'),
    validarIdUsuario,
    usuariosController.eliminar
);

export default router;