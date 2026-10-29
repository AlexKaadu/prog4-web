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

const validarAsignarIncidencia = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID de la incidencia debe ser un entero positivo'),

    body('asignado_a')
        .isInt({ min: 1 })
        .withMessage('El ID del técnico debe ser un entero positivo'),

    responderValidacion
];

const validarCancelarIncidencia = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID de la incidencia debe ser un entero positivo'),

    responderValidacion
];

const validarCrearIncidencia = [
    body('id_articulo')
        .isInt({ min: 1 })
        .withMessage('El ID del artículo debe ser un entero positivo'),

    body('prioridad')
        .isInt({ min: 1, max: 3 })
        .withMessage('La prioridad debe ser 1 (Baja), 2 (Media) o 3 (Alta)'),

    body('descripcion_pedido')
        .isString()
        .withMessage('La descripción debe ser texto')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('La descripción del pedido es obligatoria'),

    responderValidacion
];

export { 
    validarFinalizarIncidencia,
    validarAsignarIncidencia,
    validarCancelarIncidencia,
    validarCrearIncidencia 
};