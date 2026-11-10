import express from 'express';
import ctrl from '../controllers/autenticacion.controller.js';



const router = express.Router();

/**
 * @swagger
 * /autenticacion/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - contrasenia
 *             properties:
 *               usuario:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Usuario o contraseña incorrectos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login', ctrl.login);

export default router;
