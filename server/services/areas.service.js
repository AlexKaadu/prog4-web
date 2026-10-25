import AreasRepository from '../data-access/areas.repository.js';
import AreaResponseDTO from '../dtos/area.response.dto.js';

class AreasService {
    constructor(repository = new AreasRepository()) {
        this.repository = repository;
    }

    async listarActivas() {
        const areas = await this.repository.listarActivas();
        return areas.map(area => this.mapearArea(area));
    }

    async obtenerPorId(id) {
        const area = await this.repository.obtenerPorId(id);
        return this.mapearArea(area);
    }

    async crear(descripcion) {
        const area = await this.repository.crear(descripcion);
        return this.mapearArea(area);
    }

    async actualizar(id, descripcion) {
        const area = await this.repository.actualizar(id, descripcion);
        return this.mapearArea(area);
    }

    async eliminar(id) {
        const tieneArticulosActivos = await this.repository.tieneArticulosActivos(id);

        if (tieneArticulosActivos) {
            const error = new Error('No se puede desactivar el área porque tiene artículos activos.');
            error.code = 'AREA_CON_ARTICULOS';
            throw error;
        }

        const area = await this.repository.eliminar(id);
        return this.mapearArea(area);

        
    }

    mapearArea(area) {
    if (!area) {
        return null;
    }

    return new AreaResponseDTO(area);
}
}

export default new AreasService();
