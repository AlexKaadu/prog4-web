import expressValidator from 'express-validator';
import responderValidacion from './responder-validacion.js';

const { param, body } = expressValidator;

const validarIdArea = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del área debe ser un entero positivo'),
    responderValidacion
];

const validarDescripcionArea = [
    body('descripcion')
        .isString()
        .withMessage('La descripción debe ser texto')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('La descripción es obligatoria'),
    responderValidacion
];

export { validarIdArea, validarDescripcionArea };