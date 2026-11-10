
import CategoriasRepository from '../data-access/categorias.repository.js';
import CategoriaResponseDTO from '../dtos/categoria.response.dto.js';

class CategoriasService {
    constructor(repository = new CategoriasRepository()) {
        this.repository = repository;
    }

    // Obtiene una página de categorías y adapta sus registros a DTO.
    async listar(limite, offset) {
        const resultado = await this.repository.listar(limite, offset);

        return {
            ...resultado,
            datos: resultado.datos.map(categoria => this.mapearCategoria(categoria))
        };
    }

    // Busca una categoría por ID y transforma el resultado para la API.
    async obtenerPorId(id) {
        const categoria = await this.repository.obtenerPorId(id);
        return this.mapearCategoria(categoria);
    }

    // Actualiza la categoría y adapta el registro resultante.
    async actualizar(id, descripcion) {
        const categoria = await this.repository.actualizar(id, descripcion);
        return this.mapearCategoria(categoria);
    }

    // Crea una categoría y adapta el registro resultante.
    async crear(descripcion) {
       const categoria = await this.repository.crear(descripcion);
        return this.mapearCategoria(categoria);
    }

    // Realiza la baja lógica de la categoría y adapta el resultado.
    async eliminar(id) {
        const categoria = await this.repository.eliminar(id);
        return this.mapearCategoria(categoria);
    }

    // Convierte un registro de categoría en DTO o devuelve null si no existe.
    mapearCategoria(categoria) {
        if (!categoria) {
            return null
        }

        return new CategoriaResponseDTO(categoria);
    }
}

export default new CategoriasService();