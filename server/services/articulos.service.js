import ArticulosRepository from '../data-access/articulos.repository.js';
import ArticuloResponseDTO from '../dtos/articulo.response.dto.js';

class ArticulosService {
    constructor(repository = new ArticulosRepository()) {
        this.repository = repository;
    }

    // Obtiene una página de artículos y adapta sus registros a DTO.
    async listar(limite, offset) {
        const resultado = await this.repository.listar(limite, offset);

        return {
            ...resultado,
            datos: resultado.datos.map(articulo => this.mapearArticulo(articulo))
        };
    }

    // Busca un artículo por ID y transforma el resultado para la API.
    async obtenerPorId(id) {
        const articulo = await this.repository.obtenerPorId(id);
        return this.mapearArticulo(articulo);
    }

    // Verifica que área y categoría sigan activas antes de actualizar.
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

    // Verifica las relaciones y crea el artículo con los datos recibidos.
    async crear(idArea, idCategoria, descripcion) {
        await this.validarRelacionesActivas(idArea, idCategoria);
        const articulo = await this.repository.crear(
            idArea,
            idCategoria,
            descripcion
        );

        return this.mapearArticulo(articulo);
    }

    // Realiza la baja lógica del artículo y adapta el resultado.
    async eliminar(id) {
        const articulo = await this.repository.eliminar(id);
        return this.mapearArticulo(articulo);
    }

    // Convierte un registro de artículo en DTO o devuelve null si no existe.
    mapearArticulo(articulo) {
        if (!articulo) {
            return null;
        }

        return new ArticuloResponseDTO(articulo);
    }

    // Rechaza relaciones con áreas o categorías inexistentes o inactivas.
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
