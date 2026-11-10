export const ROLES = {
    ADMIN: 1,
    TECNICO: 2,
    USUARIO: 3
};

const permisosPorRol = {
    [ROLES.ADMIN]: [
        'incidencias:listar',
        'incidencias:asignar',
        'incidencias:cancelar',
        'usuarios:listar-tecnicos',
        'usuarios:listar',
        'usuarios:crear',
        'usuarios:obtener',
        'usuarios:actualizar',
        'usuarios:eliminar',
        'reportes:dashboard',
        'areas:listar',
        'areas:crear',
        'areas:obtener',
        'areas:actualizar',
        'areas:eliminar'
    ],
    [ROLES.TECNICO]: [
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
        'categorias:eliminar',
        'areas:listar'
    ],
    [ROLES.USUARIO]: [
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

        if (!usuario) {
            return res.status(401).json({ mensaje: 'No autenticado' });
        }

        const permisosUsuario = permisosPorRol[Number(usuario.rol)];

        if (!permisosUsuario?.includes(accionRequerida)) {
            return res.status(403).json({
                mensaje: 'Acceso denegado'
            });
        }

        next();
    };
}

export { permisosPorRol };