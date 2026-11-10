import UsuariosRepository from '../data-access/usuarios.repository.js';
import UsuarioResponseDTO from '../dtos/usuario.response.dto.js';

class UsuariosService {
    constructor(repository = new UsuariosRepository()) {
        this.repository = repository;
    }

    // Busca credenciales para que el controlador procese el inicio de sesión.
    buscarPorUsuarioContrasenia(usuario, contrasenia) {
    return this.repository.buscarPorUsuarioContrasenia(usuario, contrasenia);
    }

    // Lista usuarios paginados y transforma cada registro a DTO.
    async listar(limite, offset) {
    const resultado = await this.repository.listar(limite, offset);

    return {
        ...resultado,
        datos: resultado.datos.map(usuario => new UsuarioResponseDTO(usuario))
    };
    }

    // Devuelve los técnicos disponibles para asignar incidencias.
    async listarTecnicos() {
        return this.repository.listarTecnicos();
    }

    // Busca un usuario por ID y devuelve su DTO o null.
    async obtenerPorId(id) {
        const usuarioBD = await this.repository.obtenerPorId(id);
        return usuarioBD ? new UsuarioResponseDTO(usuarioBD) : null;
    }

    // Crea un usuario y devuelve su DTO o null si no se creó.
    async crear(usuario) {
        const usuarioBD = await this.repository.crear(usuario);
        return usuarioBD ? new UsuarioResponseDTO(usuarioBD) : null;
    }

    // Actualiza un usuario y devuelve su DTO o null si no existe.
    async actualizar(id, usuario) {
        const usuarioBD = await this.repository.actualizar(id, usuario);
        return usuarioBD ? new UsuarioResponseDTO(usuarioBD) : null;
    }

    // Desactiva un usuario y devuelve su DTO o null si no existe.
    async eliminar(id) {
        const usuarioBD = await this.repository.eliminar(id);
        return usuarioBD ? new UsuarioResponseDTO(usuarioBD) : null;
    }
}

export default new UsuariosService();