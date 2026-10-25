export default class AreaResponseDTO {
    constructor(area){
        this.id_area = area.id_area;
        this.descripcion = area.descripcion;

        if (area.activo !== undefined) {
            this.activo = area.activo;
        }
    }

}