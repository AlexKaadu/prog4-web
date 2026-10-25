export default class ArticuloResponseDTO {
    constructor(articulo) {
        this.id_articulo = articulo.id_articulo;
        this.id_area = articulo.id_area;
        this.id_categoria = articulo.id_categoria;
        this.descripcion = articulo.descripcion;

        if (articulo.area !== undefined){
            this.area = articulo.area;
        }

        if (articulo.categoria !== undefined){
            this.categoria = articulo.categoria;
        }

        if (articulo.activo !== undefined){
            this.activo = articulo.activo;
        }
    }
}