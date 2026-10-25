import jwt from 'jsonwebtoken';
import usuariosService from '../services/usuarios.service.js';

const autenticar = async (req, res, next) => {

    try{
        const [scheme, token] = (req.headers.authorization ?? '').split(' ');

        if (scheme !=='Bearer' || !token) {
            return res.status(401).json({mensaje: 'Token requerido.'});
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await usuariosService.obtenerPorId(payload.id_usuario);

        if (!usuario) {
            return res.status(401).json({mensaje: 'Token incorrecto.'});
        }

        req.usuario = usuario;
        return next();

    } catch (error){
        if (
            error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError'
        ) {
            return res.status(401).json({mensaje: 'Token incorrecto2'})
        }
        return next(error);
    }
};

export default autenticar;