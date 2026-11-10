import IncidenciasRepository from "../data-access/incidencias.repository.js";
import NotificacionesServicio from "./notificaciones.service.js";

class IncidenciasService {
    constructor (
        repository = new IncidenciasRepository(),
        notificaciones = new NotificacionesServicio()
    ) {
        this.repository = repository;
        this.notificaciones = notificaciones;
    }

    // Obtiene los datos del correo y avisa si no se pudo enviar la notificación.
    async notificarCambioEstado(incidencia, idEstado) {
        try {
            const datosCorreo = await this.repository.informacionIncidencia({
                id_incidencia: incidencia.id_incidencia,
                id_estado: idEstado
            });

            if (!datosCorreo) {
                throw new Error('No se encontró la información de la incidencia para notificar.');
            }

            await this.notificaciones.enviarCorreo(datosCorreo);
        } catch (error) {
            const errorNotificacion = new Error(
                'La incidencia se actualizó, pero no se pudo enviar la notificación.',
                { cause: error }
            );
            errorNotificacion.code = 'NOTIFICATION_FAILED';
            throw errorNotificacion;
        }
    }

    // Lista la página de incidencias asignadas a un usuario.
    listarAsignadas (idUsuario, limite, offset) {
        return this.repository.listarAsignadas(idUsuario, limite, offset);
    }

    // Finaliza una incidencia asignada y notifica el cambio de estado.
    async finalizarAsignada (incidencia) {
        const resultado = await this.repository.finalizarAsignada(incidencia);

        if (!resultado) {
            return null;
        }

        await this.notificarCambioEstado(resultado, 3);
        return resultado;
    }

    // Lista una página con todas las incidencias.
    listarTodas (limite, offset) {
        return this.repository.listarTodas(limite, offset);
    }

    // Asigna una incidencia al técnico indicado por los datos recibidos.
    asignarA (incidencia) {
        return this.repository.asignarA(incidencia);
    }

    // Cancela una incidencia pendiente y notifica el cambio de estado.
    async cancelarPendiente (incidencia) {
        const resultado = await this.repository.cancelarPendiente(incidencia);

        if (!resultado) {
            return null;
        }

        await this.notificarCambioEstado(resultado, 4);
        return resultado;
    }

    // Crea una incidencia a partir de los datos validados.
    crear (incidencia) {
        return this.repository.crear(incidencia);
    }

    // Lista una página de incidencias creadas por el usuario.
    listarCreadasPor(idUsuario, limite, offset) {
        return this.repository.listarCreadasPor(idUsuario, limite, offset);
    }

    // Cancela una incidencia propia pendiente y notifica el cambio de estado.
    async cancelarPropiaPendiente(incidencia) {
        const resultado = await this.repository.cancelarPropiaPendiente(incidencia);

        if (!resultado) {
            return null;
        }

        await this.notificarCambioEstado(resultado, 4);
        return resultado;
    }
}

export default new IncidenciasService();