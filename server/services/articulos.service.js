import ArticulosRepository from '../data-access/articulos.repository.js';

class ArticulosService {
    constructor(repository = new ArticulosRepository()) {
        this.repository = repository;
    }

    listar(limite, offset) {
        return this.repository.listar(limite, offset);
    }

    obtenerPorId(id) {
        return this.repository.obtenerPorId(id);
    }

    async actualizar(id, idArea, idCategoria, descripcion) {
        await this.validarRelacionesActivas(idArea, idCategoria);
        return this.repository.actualizar(id, idArea, idCategoria, descripcion);
    }

    async crear(idArea, idCategoria, descripcion) {
        await this.validarRelacionesActivas(idArea, idCategoria);
        return this.repository.crear(idArea, idCategoria, descripcion);
    }

    eliminar(id) {
        return this.repository.eliminar(id);
    }

    async validarRelacionesActivas(idArea, idCategoria) {
        const relaciones = await this.repository.obtenerEstadoRelaciones(idArea, idCategoria);

        if (!relaciones.area_activa) {
            const error = new Error('El área no existe o está inactiva.');
            error.code = 'AREA_INACTIVA';
            throw error;
        }

        if (!relaciones.categoria_activa) {
            const error = new Error('La categoría no existe o está inactiva.');
            error.code = 'CATEGORIA_INACTIVA';
            throw error;
        }
    }
}

export default new ArticulosService();







