import expressValidator from 'express-validator';
import responderValidacion from './responder-validacion.js';

const { param, body } = expressValidator;

const validarFinalizarIncidencia = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID de la incidencia debe ser un entero positivo'),

    body('descripcion_resolucion')
        .isString()
        .withMessage('La resolución debe ser texto')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('La descripción de resolución es obligatoria')
        .bail()
        .isLength({ max: 250 })
        .withMessage('La resolución no puede superar los 250 caracteres'),

    responderValidacion
];

const validarComenzarIncidencia = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID de la incidencia debe ser un entero positivo'),
    responderValidacion
];

export { validarFinalizarIncidencia, validarComenzarIncidencia };