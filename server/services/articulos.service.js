import ArticulosRepository from '../data-access/articulos.repository.js';
import ArticuloResponseDTO from '../dtos/articulo.response.dto.js';

class ArticulosService {
    constructor(repository = new ArticulosRepository()) {
        this.repository = repository;
    }

    async listar(limite, offset) {
        const resultado = await this.repository.listar(limite, offset);

        return {
            ...resultado,
            datos: resultado.datos.map(articulo => this.mapearArticulo(articulo))
        };
    }

    async obtenerPorId(id) {
        const articulo = await this.repository.obtenerPorId(id);
        return this.mapearArticulo(articulo);
    }

    async actualizar(id, idArea, idCategoria, descripcion) {
        await this.validarRelacionesActivas(idArea, idCategoria);
        const articulo = await this.repository.actualizar(
            id,
            idArea,
            idCategoria,
            descripcion
        );

        return this.mapearArticulo(articulo);
    }

    async crear(idArea, idCategoria, descripcion) {
        await this.validarRelacionesActivas(idArea, idCategoria);
        const articulo = await this.repository.crear(
            idArea,
            idCategoria,
            descripcion
        );

        return this.mapearArticulo(articulo);
    }

    async eliminar(id) {
        const articulo = await this.repository.eliminar(id);
        return this.mapearArticulo(articulo);
    }

    mapearArticulo(articulo) {
        if (!articulo) {
            return null;
        }

        return new ArticuloResponseDTO(articulo);
    }

    async validarRelacionesActivas(idArea, idCategoria) {
        const relaciones = await this.repository.obtenerEstadoRelaciones(
            idArea,
            idCategoria
        );

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

