import IncidenciasRepository from "../data-access/incidencias.repository.js";

class IncidenciasService {
    constructor(repository = new IncidenciasRepository()) {
        this.repository = repository;
    }

    listarAsignadas(idUsuario, limite, offset) {
        return this.repository.listarAsignadas(idUsuario, limite, offset);
    }

    finalizarAsignada(idIncidencia, idUsuario, descripcionResolucion) {
        return this.repository.finalizarAsignada(
            idIncidencia,
            idUsuario,
            descripcionResolucion
        );
    }

    comenzarAsignada(idIncidencia, idUsuario) {
        return this.repository.comenzarAsignada(idIncidencia, idUsuario);
    }

    listarTodas(limite, offset) {
        return this.repository.listarTodas(limite, offset);
    }
}

export default new IncidenciasService();