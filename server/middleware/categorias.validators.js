const { param, body} = require ('express-validator');
const responderValidacion = require('./responder-validacion');

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

module.exports = {validarIdCategoria, validarDescripcionCategoria};
