import { incidencias } from "../../../datos/incidencias-empleado-sistemas";
import * as bootstrap from 'bootstrap';


// Textos visuales usados para mostrar el estado de cada incidencia.
const badgesEstado = {
    1: { clase: 'badge-estado badge-pendiente', texto: 'PENDIENTE' },
    2: { clase: 'badge-estado badge-en-proceso', texto: 'EN PROCESO' },
    3: { clase: 'badge-estado badge-resuelto', texto: 'RESUELTA' },
    4: { clase: 'badge-estado badge-cancelado', texto: 'CANCELADA' }
};

// Textos visuales usados para mostrar la prioridad de cada incidencia.
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
        tdId.dataset.label = 'N.º';
        tdId.textContent = inc.id_incidencia;
        row.appendChild(tdId);

        const tdArticulo = document.createElement('td');
        tdArticulo.dataset.label = 'Articulo';
        tdArticulo.textContent = inc.articulo_descripcion;
        row.appendChild(tdArticulo);

        const tdPrioridad = document.createElement('td');
        tdPrioridad.dataset.label = 'Prioridad';
        tdPrioridad.replaceChildren(crearBadge(badgesPrioridad[inc.prioridad]));
        row.appendChild(tdPrioridad);

        const tdEstado = document.createElement('td');
        tdEstado.dataset.label = 'Estado';
        tdEstado.replaceChildren(crearBadge(badgesEstado[inc.id_estado]));
        row.appendChild(tdEstado);

        const tdTecnicoAsignado = document.createElement('td');
        tdTecnicoAsignado.dataset.label = 'Tecnico asignado';
        tdTecnicoAsignado.textContent = inc.asignado_a ? inc.asignado_a : "Sin asignar";
        row.appendChild(tdTecnicoAsignado);

        const tdCreado = document.createElement('td');
        tdCreado.dataset.label = 'Fecha';
        tdCreado.textContent = inc.creado;
        row.appendChild(tdCreado);

        const tdAcciones = document.createElement('td');
        tdAcciones.dataset.label  = 'Acciones';
        
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'btn btn-sm btn-outline-secondary';
        boton.setAttribute('aria-label', 'Ver detalle');
        const icono = document.createElement('i');
        icono.className= 'bi bi-eye-fill';
        icono.setAttribute('aria-hidden', 'true');
        boton.appendChild(icono);

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