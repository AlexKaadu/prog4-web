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
            const { id } = req.params;
            const { descripcion_resolucion: descripcionResolucion } = req.body;
            const idUsuario = req.usuario.id_usuario;

            const incidencia = await incidenciasService.finalizarAsignada(
                id,
                idUsuario,
                descripcionResolucion
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


    comenzarAsignada =  async(req,res) => {
        try{
            const { id } = req.params;
            const idUsuario = req.usuario.id_usuario;

            const incidencia = await incidenciasService.comenzarAsignada(
                id,
                idUsuario
            );
            
            if (!incidencia) {
                return res.status(409).json({
                    error: 'No se puede comenzar la incidencia: no está asignada a este usuario o su estado no lo permite.'
                });
            }
            return res.status(200).json(incidencia);
        } catch (error) {
            console.error('Error al comenzar la incidencia:', error);
            return res.status(500).json({
                error: 'Error al comenzar la incidencia'
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

}

export default new IncidenciasController();