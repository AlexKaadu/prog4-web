import AreasRepository from '../data-access/areas.repository.js';

class AreasService {
    constructor(repository = new AreasRepository()) {
        this.repository = repository;
    }

    listarActivas() {
        return this.repository.listarActivas();
    }

    obtenerPorId(id) {
        return this.repository.obtenerPorId(id);
    }

    crear(descripcion) {
        return this.repository.crear(descripcion);
    }

    actualizar(id, descripcion) {
        return this.repository.actualizar(id, descripcion);
    }

    async eliminar(id) {
        const tieneArticulosActivos = await this.repository.tieneArticulosActivos(id);

        if (tieneArticulosActivos) {
            const error = new Error('No se puede desactivar el área porque tiene artículos activos.');
            error.code = 'AREA_CON_ARTICULOS';
            throw error;
        }

        return this.repository.eliminar(id);
    }
}

export default new AreasService();
