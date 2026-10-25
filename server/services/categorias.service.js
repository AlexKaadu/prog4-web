
import CategoriasRepository from '../data-access/categorias.repository.js';
import CategoriaResponseDTO from '../dtos/categoria.response.dto.js';

class CategoriasService {
    constructor(repository = new CategoriasRepository()) {
        this.repository = repository;
    }

    async listar(limite, offset) {
        const resultado = await this.repository.listar(limite, offset);

        return {
            ...resultado,
            datos: resultado.datos.map(categoria => this.mapearCategoria(categoria))
        };
    }

    async obtenerPorId(id) {
        const categoria = await this.repository.obtenerPorId(id);
        return this.mapearCategoria(categoria);
    }

    async actualizar(id, descripcion) {
        const categoria = await this.repository.actualizar(id, descripcion);
        return this.mapearCategoria(categoria);
    }

    async crear(descripcion) {
       const categoria = await this.repository.crear(descripcion);
        return this.mapearCategoria(categoria);
    }

    async eliminar(id) {
        const categoria = await this.repository.eliminar(id);
        return this.mapearCategoria(categoria);
    }

    mapearCategoria(categoria) {
        if (!categoria) {
            return null
        }

        return new CategoriaResponseDTO(categoria);
    }
}

export default new CategoriasService();