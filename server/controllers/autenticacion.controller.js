import jwt from 'jsonwebtoken';
import usuariosService from '../services/usuarios.service.js';


class AutenticacionController {

    constructor(usuario = usuariosService){
        this.usuario = usuario;
    }


    login = async(req, res) => {
        try{
            const { usuario, contrasenia } = req.body;

            const usuarioBD = await this.usuario.buscarPorUsuarioContrasenia (usuario, contrasenia);

            if(!usuarioBD) {
                return res.status(401).json({mensaje: 'Nombre de usuario y/o contraseña incorrectos.'});
            }

            // CREAR EL TOKEN
            const token = jwt.sign(usuarioBD, process.env.JWT_SECRET, {expiresIn: '1h'});

            res.status(200).json({token: token});

        } catch (error) {
            console.error('Error al obtener usuario/login', error.message);
            return res.status(500).json({
                estado: false,
                error: 'Error interno del servidor'
            });
        }
    }
}

export default new AutenticacionController();
