import { incidencias } from "../../../datos/incidencias-empleado-sistemas";
import * as bootstrap from 'bootstrap';


// Textos visuales usados para mostrar el estado de cada incidencia.
const badgesEstado = {
    1: '<span class="badge-estado badge-pendiente">PENDIENTE</span>',
    2: '<span class="badge-estado badge-en-proceso">EN PROCESO</span>',
    3: '<span class="badge-estado badge-resuelto">RESUELTA</span>',
    4: '<span class="badge-estado badge-cancelado">CANCELADA</span>'
};

// Textos visuales usados para mostrar la prioridad de cada incidencia.
const badgesPrioridad = {
    1: '<span class="badge-prioridad badge-baja">BAJA</span>',
    2: '<span class="badge-prioridad badge-media">MEDIA</span>',
    3: '<span class="badge-prioridad badge-alta">ALTA</span>'
};

const registrosPorPagina = 10;
let paginaActual = 1;

// Construye la tabla con las incidencias correspondientes a la página actual.
function renderTablaDirector(incidencias){
    const tbody = document.getElementById('tabla-incidencias-director');
    tbody.replaceChildren();

    const inicio = (paginaActual - 1) * registrosPorPagina;
    const incidenciasDeLaPagina = incidencias.slice(inicio, inicio + registrosPorPagina);

    for(let inc of incidenciasDeLaPagina){
        const row = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = inc.id_incidencia;
        row.appendChild(tdId);

        const tdArticulo = document.createElement('td');
        tdArticulo.textContent = inc.articulo_descripcion;
        tdArticulo.className = 'text-truncate';
        tdArticulo.style.maxWidth = '50px';
        row.appendChild(tdArticulo);

        const tdPrioridad = document.createElement('td');
        tdPrioridad.innerHTML = badgesPrioridad[inc.prioridad];
        row.appendChild(tdPrioridad);

        const tdEstado = document.createElement('td');
        tdEstado.innerHTML = badgesEstado[inc.id_estado];
        row.appendChild(tdEstado);

        const tdTecnicoAsignado = document.createElement('td');
        tdTecnicoAsignado.textContent = inc.asignado_a ? inc.asignado_a : "Sin asignar";
        row.appendChild(tdTecnicoAsignado);

        const tdCreado = document.createElement('td');
        tdCreado.textContent = inc.creado;
        row.appendChild(tdCreado);

        const tdAcciones = document.createElement('td');
        
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'btn btn-sm btn-outline-secondary';
        boton.setAttribute('aria-label', 'Ver detalle');
        boton.innerHTML = '<i class="bi bi-eye-fill"></i>';

        // Abre el detalle de la incidencia y prepara sus acciones.
        boton.addEventListener('click', () => {
            document.getElementById('modal-id').textContent = inc.id_incidencia;
            document.getElementById('modal-articulo').textContent = inc.articulo_descripcion;
            document.getElementById('modal-descripcion').textContent = inc.descripcion_pedido;

            const btnAsignar = document.getElementById('btn-asignar');
            const btnCancelar = document.getElementById('btn-cancelar');

            if (inc.id_estado === 1 && !inc.asignado_a) {
                btnAsignar.disabled = false;
            } else {
                btnAsignar.disabled = true;
            }

            if (inc.id_estado === 1) {
                btnCancelar.disabled = false;
            } else {
                btnCancelar.disabled = true;
            }

            const selectTecnico = document.getElementById('select-tecnico');

            if(inc.id_estado === 1 && !inc.asignado_a){
                selectTecnico.disabled = false;
            } else {
                selectTecnico.disabled = true;
            }


            const modal = new bootstrap.Modal(document.getElementById('modalIncidencia'));
            modal.show();


            btnCancelar.onclick = () => {
                if(inc.id_estado === 1){
                    inc.id_estado = 4;
                    modal.hide();
                    renderTablaDirector(incidencias);
                }
            }

            // Asigna un técnico y pasa la incidencia al estado "En proceso".
            btnAsignar.onclick = () => {
                if(inc.id_estado === 1){
                    inc.asignado_a = selectTecnico.value;
                    inc.id_estado = 2;
                    modal.hide();
                    renderTablaDirector(incidencias);
                }
            }

        });
        tdAcciones.appendChild(boton)
        row.appendChild(tdAcciones);
        tbody.appendChild(row);
        

    }
}

// Genera los botones para cambiar de página.
function renderizarPaginacion(incidencias){
    const contenedor = document.getElementById('paginacion-incidencias-director');
    contenedor.textContent = '';

    const totalPaginas = Math.ceil(incidencias.length / registrosPorPagina);
    
    for (let numeroPagina = 1; numeroPagina <= totalPaginas; numeroPagina++) {
        const elemento = document.createElement('li');
        elemento.className = 'page-item';

        const boton = document.createElement('button');
        boton.className = 'page-link';
        boton.textContent = numeroPagina;

        boton.addEventListener('click', () => {
            paginaActual = numeroPagina;

            renderTablaDirector(incidencias);
            renderizarPaginacion(incidencias);
        });
        elemento.appendChild(boton);
        contenedor.appendChild(elemento);
    }
}

// Carga inicialmente la tabla y la paginación.
renderTablaDirector(incidencias);
renderizarPaginacion(incidencias);


let prioridadSeleccionada = 'todas';
let estadoSeleccionado = 'todas';

function aplicarFiltros() {
    const incidenciasFiltradas = incidencias.filter(inc => {
        const coincidePrioridad = prioridadSeleccionada === 'todas'
            || inc.prioridad === Number(prioridadSeleccionada);
        const coincideEstado = estadoSeleccionado === 'todas'
            || inc.id_estado === Number(estadoSeleccionado);

        return coincidePrioridad && coincideEstado;
    });

    paginaActual = 1;
    renderTablaDirector(incidenciasFiltradas);
    renderizarPaginacion(incidenciasFiltradas);
}

function configurarFiltroDropdown(menuId, textoId, actualizarSeleccion) {
    const menu = document.getElementById(menuId);
    const texto = document.getElementById(textoId);

    menu.addEventListener('click', event => {
        const opcion = event.target.closest('.dropdown-item[data-valor]');
        if (!opcion) return;

        actualizarSeleccion(opcion.dataset.valor);
        texto.textContent = opcion.dataset.etiqueta;
        menu.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.toggle('active', item === opcion);
        });
        aplicarFiltros();
    });
}

configurarFiltroDropdown('menu-filtro-prioridad', 'texto-filtro-prioridad', valor => {
    prioridadSeleccionada = valor;
});

configurarFiltroDropdown('menu-filtro-estado', 'texto-filtro-estado', valor => {
    estadoSeleccionado = valor;
});