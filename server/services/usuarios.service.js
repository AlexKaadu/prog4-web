import UsuariosRepository from '../data-access/usuarios.repository.js';
import UsuarioResponseDTO from '../dtos/usuario.response.dto.js';

class UsuariosService {
    constructor(repository = new UsuariosRepository()) {
        this.repository = repository;
    }

    buscarPorUsuarioContrasenia(usuario, contrasenia) {
    return this.repository.buscarPorUsuarioContrasenia(usuario, contrasenia);
    }

    async listar(limite, offset) {
    const resultado = await this.repository.listar(limite, offset);

    return {
        ...resultado,
        datos: resultado.datos.map(usuario => new UsuarioResponseDTO(usuario))
    };
    }

    async obtenerPorId(id) {
        const usuarioBD = await this.repository.obtenerPorId(id);
        return usuarioBD ? new UsuarioResponseDTO(usuarioBD) : null;
    }

    async crear(usuario) {
        const usuarioBD = await this.repository.crear(usuario);
        return usuarioBD ? new UsuarioResponseDTO(usuarioBD) : null;
    }

    async actualizar(id, usuario) {
        const usuarioBD = await this.repository.actualizar(id, usuario);
        return usuarioBD ? new UsuarioResponseDTO(usuarioBD) : null;
    }

    async eliminar(id) {
        const usuarioBD = await this.repository.eliminar(id);
        return usuarioBD ? new UsuarioResponseDTO(usuarioBD) : null;
    }
}

export default new UsuariosService();