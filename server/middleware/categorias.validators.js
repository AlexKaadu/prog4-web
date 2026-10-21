import expressValidator from 'express-validator';
import responderValidacion from './responder-validacion.js';

const { param, body } = expressValidator;

const validarIdCategoria = [
    param('id')
        .isInt({min: 1})
        .withMessage('El ID debe ser un entero positivo'),
    responderValidacion
];

const validarDescripcionCategoria = [
    body('descripcion')
        .isString()
        .withMessage('La descripcion debe ser texto')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('La descripcion es obligatoria'),
    responderValidacion

];

export { validarIdCategoria, validarDescripcionCategoria };
