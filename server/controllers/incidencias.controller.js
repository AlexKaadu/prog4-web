import incidenciasService from "../services/incidencias.service.js";
import { obtenerPaginacion, armarRespuesta } from '../utils/paginacion.js';

class IncidenciasController {
    listarAsignadas = async(req, res) => {
        try {
            const idUsuario = req.usuario.id_usuario;
            const { pagina, limite, offset }= obtenerPaginacion(req);

            const { datos, total } = await incidenciasService.listarAsignadas(
                idUsuario,
                limite,
                offset
            );
            
        
            return res.status(200).json(
                armarRespuesta(datos, total, pagina, limite)
            );

        } catch (error) {
            console.error('Error al listar incidencias asignadas', error);
            return res.status(500).json({
                error: 'Error al obtener las incidencias asignadas'
            });
        }
    };


    finalizarAsignada = async (req, res) => {
        try {
            const incidenciaParaFinalizar = {
                idIncidencia: Number(req.params.id),
                idUsuario: req.usuario.id_usuario,
                descripcionResolucion: req.body.descripcion_resolucion
            };

            const incidencia = await incidenciasService.finalizarAsignada(
                incidenciaParaFinalizar
            );

            if (!incidencia) {
                return res.status(409).json({
                    error: 'No se puede finalizar la incidencia: no está asignada a este usuario o su estado no lo permite.'
                });
            }

            return res.status(200).json(incidencia);
        } catch (error) {
            console.error('Error al finalizar la incidencia:', error);
            return res.status(500).json({
                error: 'Error al finalizar la incidencia'
            });
        }
    };


    listarTodas = async(req, res) => {
        try {
            const {pagina, limite, offset } = obtenerPaginacion(req);
            const {datos, total } = await incidenciasService.listarTodas(
                limite,
                offset
            );

            return res.status(200).json(
                armarRespuesta(datos, total, pagina, limite)
            );


        } catch (error) {
            console.error('Error al listar todas las incidencias:', error);
            return res.status(500).json({
                error: 'Error al obtener las incidencias'
            });
        }
    };

    asignarA = async (req, res) => {
        try {
            const incidencia = {
                id_incidencia: Number(req.params.id),
                asignado_a: Number(req.body.asignado_a)
            };

            const incidenciaActualizada = await incidenciasService.asignarA(incidencia);

            if(!incidenciaActualizada) {
                return res.status(409).json({
                    error: 'No se pudo asignar la incidencia: debe estar pendiente y asignar, y el usuario debe ser un técnico activo.'
                });
            }
            return res.status(200).json(incidenciaActualizada);

        } catch (error) {
            console.error('Error al asignar la incidencia:', error);
            return res.status(500).json({
                error: 'Error al asignar la incidencia'
            });
        }
    };


    cancelarPendiente = async (req, res) => {
        try{
            const incidencia = {
                id_incidencia: Number(req.params.id)
            };

            const incidenciaCancelada = 
                await incidenciasService.cancelarPendiente(incidencia);

            if (!incidenciaCancelada) {
                return res.status(409).json({
                    error: 'No se puede cancelar la incidencia: debe estar pendiente.'
                });
            }

            return res.status(200).json(incidenciaCancelada);
        } catch (error) {
            console.error('Error al cancelar la incidencia:', error);
            return res.status(500).json({
                error: 'Error al cancelar la incidencia'
            });
        }
    };

    crear = async (req, res) => {
        try {
            const incidencia = {
                id_articulo: Number(req.body.id_articulo),
                creado_por: req.usuario.id_usuario,
                prioridad: req.body.prioridad,
                descripcion_pedido: req.body.descripcion_pedido
            };

            const incidenciaCreada = await incidenciasService.crear(incidencia);

            if (!incidenciaCreada) {
                return res.status(404).json({
                    error: 'El articulo no existe o no está activo.'
                });
            }
            return res.status(201).json(incidenciaCreada);
        } catch (error) {
            console.error('Error al crear la incidencia.', error);
            return res.status(500).json({
                error: 'Error al crear la incidencia'
            });
        }
    };

    listarPropias = async (req, res) => {
        try {
            const idUsuario = req.usuario.id_usuario;
            const { pagina, limite, offset } = obtenerPaginacion(req);

            const { datos, total } = await incidenciasService.listarCreadasPor(
                idUsuario,
                limite,
                offset
            );

            return res.status(200).json(
                armarRespuesta(datos, total, pagina,limite)
            );
        } catch (error) {
            console.error('Error al listar incidencias propias:', error);
            return res.status(500).json({
                error: 'Error al obtener las incidencias propias'
            });
        }
    };

    cancelarPropiaPendiente = async (req, res) => {
        try {
            const incidencia = {
                id_incidencia: Number(req.params.id),
                creado_por: req.usuario.id_usuario
            };

            const incidenciaCancelada =
                await incidenciasService.cancelarPropiaPendiente(incidencia);

            if (!incidenciaCancelada) {
                return res.status(409).json({
                    error: 'No se puede cancelar: la incidencia no es tuya o no está pendiente.'
                });
            }

            return res.status(200).json(incidenciaCancelada);
        } catch (error) {
            console.error('Error al cancelar la incidencia propia:', error);
            return res.status(500).json({
                error: 'Error al cancelar la incidencia'
            });
        }
    };



}

export default new IncidenciasController();