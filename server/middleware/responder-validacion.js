import expressValidator from 'express-validator';

const { validationResult } = expressValidator;

function responderValidacion(req, res, next) {
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() });

    }

    next();

}

export default responderValidacion;