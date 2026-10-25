export default class CategoriaResponseDTO {
    constructor(categoria) {
        this.id_categoria = categoria.id_categoria;
        this.descripcion = categoria.descripcion;
        this.activo = categoria.activo;
    }
}