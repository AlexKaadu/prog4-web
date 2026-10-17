const { param, body } = require('express-validator');
const responderValidacion = require('./responder-validacion');

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

module.exports = { validarIdArea, validarDescripcionArea };