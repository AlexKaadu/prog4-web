import CategoriasRepository from '../data-access/categorias.repository.js';

class CategoriasService {
    constructor(repository = new CategoriasRepository()) {
        this.repository = repository;
    }

    listar(limite, offset) {
        return this.repository.listar(limite, offset);
    }

    obtenerPorId(id) {
        return this.repository.obtenerPorId(id);
    }

    actualizar(id, descripcion) {
        return this.repository.actualizar(id, descripcion);
    }

    crear(descripcion) {
        return this.repository.crear(descripcion);
    }

    eliminar(id) {
        return this.repository.eliminar(id);
    }
}

export default new CategoriasService();