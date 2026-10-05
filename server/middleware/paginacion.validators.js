const { query } = require('express-validator');
const responderValidacion = require('./responder-validacion');

const validarPaginacion = [
    query('pagina')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un entero positivo'),
    query('limite')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe estar entre 1 y 100'),
    responderValidacion
];

module.exports = { validarPaginacion };