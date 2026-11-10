import AreasRepository from '../data-access/areas.repository.js';
import AreaResponseDTO from '../dtos/area.response.dto.js';

class AreasService {
    constructor(repository = new AreasRepository()) {
        this.repository = repository;
    }

    // Lista las áreas activas y adapta cada resultado al formato de respuesta.
    async listarActivas() {
        const areas = await this.repository.listarActivas();
        return areas.map(area => this.mapearArea(area));
    }

    // Busca un área por ID y transforma el resultado para la API.
    async obtenerPorId(id) {
        const area = await this.repository.obtenerPorId(id);
        return this.mapearArea(area);
    }

    // Crea un área y transforma el registro creado para la respuesta.
    async crear(descripcion) {
        const area = await this.repository.crear(descripcion);
        return this.mapearArea(area);
    }

    // Actualiza la descripción de un área y adapta el resultado.
    async actualizar(id, descripcion) {
        const area = await this.repository.actualizar(id, descripcion);
        return this.mapearArea(area);
    }

    // Impide desactivar áreas con artículos activos y realiza la baja lógica.
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

    // Convierte un registro de área en DTO o devuelve null si no existe.
    mapearArea(area) {
    if (!area) {
        return null;
    }

    return new AreaResponseDTO(area);
}
}

export default new AreasService();
