export default class UsuarioResponseDTO {
    constructor(usuario){
        this.id_usuario = usuario.id_usuario;
        this.id_area = usuario.id_area;
        this.nombres = usuario.nombres;
        this.apellidos = usuario.apellidos;
        this.rol = usuario.rol;
        this.activo = usuario.activo;
        this.usuario =  usuario.usuario;
    }
}