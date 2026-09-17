import { incidencias } from '../../../datos/incidencias-empleado-sistemas.js';

const badgesEstado = {
    1: '<span class="badge-estado badge-pendiente">PENDIENTE</span>',
    2: '<span class="badge-estado badge-en-proceso">EN PROCESO</span>',
    3: '<span class="badge-estado badge-resuelto">RESUELTA</span>',
    4: '<span class="badge-estado badge-cancelado">CANCELADA</span>'
};

const badgesPrioridad = {
    1: '<span class="badge-prioridad badge-baja">BAJA</span>',
    2: '<span class="badge-prioridad badge-media">MEDIA</span>',
    3: '<span class="badge-prioridad badge-alta">ALTA</span>'
};

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
        tdPrioridad.innerHTML = badgesPrioridad[inc.prioridad];
        row.appendChild(tdPrioridad);

        const tdEstado = document.createElement('td');
        tdEstado.innerHTML = badgesEstado[inc.id_estado];
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