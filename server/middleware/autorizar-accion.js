const permisosPorRol = {
    1: [

        'incidencias:listar',
        'incidencias:asignar',
        'incidencias:cancelar',

    ],
    2: [
        'incidencias:listar-asignadas',
        'incidencias:finalizar',
        'articulos:listar',
        'articulos:obtener',
        'articulos:crear',
        'articulos:actualizar',
        'articulos:eliminar',
        'categorias:listar',
        'categorias:obtener',
        'categorias:crear',
        'categorias:actualizar',
        'categorias:eliminar'
    ],
    3: [
        'incidencias:crear',
        'incidencias:listar-propias',
        'incidencias:cancelar-propia',
        'articulos:listar',
        'articulos:obtener'
    ]
};

export default function autorizarAccion(accionRequerida) {
    return (req, res, next) => {
        const usuario = req.usuario;
        const permisosUsuario = permisosPorRol[Number(usuario?.rol)] || [];

        if (!usuario || !permisosUsuario.includes(accionRequerida)) {
            return res.status(403).json({
                mensaje: 'Acceso denegado'
            });
        }

        next();
    };
}

export { permisosPorRol };