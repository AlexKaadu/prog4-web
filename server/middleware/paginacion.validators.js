import expressValidator from 'express-validator';
import responderValidacion from './responder-validacion.js';

const { query } = expressValidator;

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

export { validarPaginacion };