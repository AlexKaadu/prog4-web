import IncidenciasRepository from "../data-access/incidencias.repository.js";

class IncidenciasService {
    constructor (repository = new IncidenciasRepository()) {
        this.repository = repository;
    }

    listarAsignadas (idUsuario, limite, offset) {
        return this.repository.listarAsignadas(idUsuario, limite, offset);
    }

    finalizarAsignada (incidencia) {
        return this.repository.finalizarAsignada(incidencia);
    }

    listarTodas (limite, offset) {
        return this.repository.listarTodas(limite, offset);
    }

    asignarA (incidencia) {
        return this.repository.asignarA(incidencia);
    }

    cancelarPendiente (incidencia) {
        return this.repository.cancelarPendiente(incidencia);
    }

    crear (incidencia) {
        return this.repository.crear(incidencia);
    }

    listarCreadasPor(idUsuario, limite, offset) {
        return this.repository.listarCreadasPor(idUsuario, limite, offset);
    }

    cancelarPropiaPendiente(incidencia) {
        return this.repository.cancelarPropiaPendiente(incidencia);
    }
}

export default new IncidenciasService();