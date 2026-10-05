function obtenerPaginacion(req){
    const pagina = Number(req.query.pagina) || 1;
    const limite = Number(req.query.limite) || 10;


    return {
        pagina,
        limite,
        offset: (pagina - 1) * limite
    };
}

function armarRespuesta(datos, total, pagina, limite){
    return {
        datos,
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite)
    };

}

module.exports = {obtenerPaginacion, armarRespuesta};


