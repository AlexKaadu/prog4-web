import { incidencias } from '../../../datos/incidencias-empleado-sistemas.js';

const badgesEstado = {

    1: { clase: 'badge-estado badge-pendiente', texto: 'PENDIENTE' },
    2: { clase: 'badge-estado badge-en-proceso', texto: 'EN PROCESO' },
    3: { clase: 'badge-estado badge-resuelto', texto: 'RESUELTA' },
    4: { clase: 'badge-estado badge-cancelado', texto: 'CANCELADA' }
    
};

const badgesPrioridad = {
    1: { clase: 'badge-prioridad badge-baja', texto: 'BAJA' },
    2: { clase: 'badge-prioridad badge-media', texto: 'MEDIA' },
    3: { clase: 'badge-prioridad badge-alta', texto: 'ALTA' }
};

function crearBadge(configuracion){
    const badge = document.createElement('span');
    badge.className = configuracion.clase;
    badge.textContent = configuracion.texto;
    return badge;
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarTabla(incidencias);
});

function renderizarTabla(incidencias){
    const tbody = document.getElementById('tabla-incidencias');
    tbody.replaceChildren();
    
    for (let inc of incidencias){
        const row = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = inc.id_incidencia;
        row.appendChild(tdId);

        const tdCreado = document.createElement('td');
        tdCreado.textContent = inc.creado;
        row.appendChild(tdCreado);

        const tdArticulo = document.createElement('td');
        tdArticulo.textContent = inc.articulo_descripcion;
        tdArticulo.className = 'text-truncate';
        tdArticulo.style.maxWidth = '50px';
        row.appendChild(tdArticulo);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.textContent = inc.descripcion_pedido;
        tdDescripcion.className = 'text-truncate';
        tdDescripcion.style.maxWidth = '50px';
        row.appendChild(tdDescripcion);

        const tdPrioridad = document.createElement('td');
        tdPrioridad.replaceChildren(crearBadge(badgesPrioridad[inc.prioridad]));
        row.appendChild(tdPrioridad);

        const tdEstado = document.createElement('td');
        tdEstado.replaceChildren(crearBadge(badgesEstado[inc.id_estado]));
        row.appendChild(tdEstado);

        const tdAcciones = document.createElement('td');
        const botonFinalizar = document.createElement('button');
        botonFinalizar.textContent = 'Finalizar';

        if(inc.id_estado > 2){        
            botonFinalizar.className = 'btn btn-sm btn-success disabled';            
        } else {
            botonFinalizar.className = 'btn btn-sm btn-success';
        }
        tdAcciones.appendChild(botonFinalizar);            
        row.appendChild(tdAcciones);

        tbody.appendChild(row);
    }
}

const formulario = document.getElementById('form-filtro');

function filtrarDatos(event){
    event.preventDefault();
    const filtro = document.getElementById('articuloFiltro').value;

    const resultadosFiltrados = incidencias.filter(inc => {
        const descripcionNormalizada = inc.articulo_descripcion.toLowerCase();
        const busquedaNormalizada = filtro.toLowerCase().trim();
        return descripcionNormalizada.includes(busquedaNormalizada);
    });
    renderizarTabla(resultadosFiltrados);
}

formulario.addEventListener('submit', filtrarDatos);