const { param, body} = require ('express-validator');
const responderValidacion = require('./responder-validacion');

const validarIdArticulo = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del articulo debe ser un entero positivo'),
    responderValidacion
];

const validarDatosArticulo = [
    body('id_area')
        .isInt({ min: 1 })
        .withMessage('El ID de area debe ser un positivo'),

    body('id_categoria')
        .isInt({ min: 1 })
        .withMessage('El ID de la categoria debe ser un positivo'),

    body('descripcion')
        .isString()
        .withMessage('La descripción debe ser texto')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('La descripción es obligatoria'),

    responderValidacion
        
];

module.exports = {validarIdArticulo, validarDatosArticulo};




