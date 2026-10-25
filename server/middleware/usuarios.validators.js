
import expressValidator from 'express-validator';
import responderValidacion from './responder-validacion.js';

const { param, body } = expressValidator;

const validarIdUsuario = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del usuario debe ser un entero positivo'),
    responderValidacion
];

const validarDatosCrearUsuario = [
    body('id_area')
        .isInt({ min: 1 })
        .withMessage('El ID del área debe ser un entero positivo'),

    body('nombres')
        .isString()
        .withMessage('Los nombres deben ser texto')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Los nombres son obligatorios')
        .bail()
        .isLength({ max: 250 })
        .withMessage('Los nombres no pueden superar los 250 caracteres'),

    body('apellidos')
        .isString()
        .withMessage('Los apellidos deben ser texto')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Los apellidos son obligatorios')
        .bail()
        .isLength({ max: 250 })
        .withMessage('Los apellidos no pueden superar los 250 caracteres'),

    body('usuario')
        .isString()
        .withMessage('El usuario debe ser texto')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('El usuario es obligatorio')
        .bail()
        .isLength({ max: 255 })
        .withMessage('El usuario no puede superar los 255 caracteres'),

    body('contrasenia')
        .isString()
        .withMessage('La contraseña debe ser texto')
        .bail()
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),

    body('rol')
        .isInt({ min: 1 })
        .withMessage('El rol debe ser un entero positivo'),

    responderValidacion
];

const validarDatosActualizarUsuario = [
    body('id_area')
        .isInt({ min: 1 })
        .withMessage('El ID del área debe ser un entero positivo'),

    body('nombres')
        .isString()
        .withMessage('Los nombres deben ser texto')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Los nombres son obligatorios')
        .bail()
        .isLength({ max: 250 })
        .withMessage('Los nombres no pueden superar los 250 caracteres'),

    body('apellidos')
        .isString()
        .withMessage('Los apellidos deben ser texto')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Los apellidos son obligatorios')
        .bail()
        .isLength({ max: 250 })
        .withMessage('Los apellidos no pueden superar los 250 caracteres'),

    body('usuario')
        .isString()
        .withMessage('El usuario debe ser texto')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('El usuario es obligatorio')
        .bail()
        .isLength({ max: 255 })
        .withMessage('El usuario no puede superar los 255 caracteres'),

    body('rol')
        .isInt({ min: 1 })
        .withMessage('El rol debe ser un entero positivo'),

    responderValidacion
];

export {
    validarIdUsuario,
    validarDatosCrearUsuario,
    validarDatosActualizarUsuario
};