// Permite al director consultar, filtrar, asignar y cancelar incidencias.
import { Modal } from 'bootstrap';

const API_URL = 'http://localhost:3000/api/v1';
const token = sessionStorage.getItem('token');
const registrosPorPagina = 10;

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

const tabla = document.getElementById('tabla-incidencias-director');
const paginacion = document.getElementById('paginacion-incidencias-director');
const selectorTecnico = document.getElementById('select-tecnico');
const modal = new Modal(document.getElementById('modalIncidencia'));
const mensaje = document.getElementById('mensaje-incidencias');

let incidencias = [];
let paginaActual = 1;
let prioridadSeleccionada = 'todas';
let estadoSeleccionado = 'todas';
let incidenciaSeleccionada = null;

// Muestra un aviso con el estilo indicado en la pantalla.
function mostrarMensaje(texto, tipo = 'danger') {
    mensaje.className = `alert alert-${tipo}`;
    mensaje.textContent = texto;
    mensaje.classList.remove('d-none');
}

// Crea una etiqueta visual para el estado o la prioridad de una incidencia.
function crearBadge(configuracion) {
    const badge = document.createElement('span');
    badge.className = configuracion.clase;
    badge.textContent = configuracion.texto;
    return badge;
}

// Envía una solicitud autenticada a la API y valida su respuesta.
async function solicitar(url, opciones = {}) {
    const respuesta = await fetch(url, {
        ...opciones,
        cache: 'no-store',
        headers: {
            Authorization: `Bearer ${token}`,
            ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
            ...opciones.headers
        }
    });

    const datos = await respuesta.json();
    if (!respuesta.ok) {
        throw new Error(datos.error || datos.mensaje || `Error HTTP ${respuesta.status}`);
    }

    return datos;
}

// Descarga todas las páginas de incidencias y vuelve a dibujar el listado.
async function cargarIncidencias() {
    const limite = 100;
    const primeraPagina = await solicitar(
        `${API_URL}/incidencias?pagina=1&limite=${limite}`
    );
    const resultado = [...primeraPagina.datos];

    for (let pagina = 2; pagina <= primeraPagina.totalPaginas; pagina++) {
        const respuesta = await solicitar(
            `${API_URL}/incidencias?pagina=${pagina}&limite=${limite}`
        );
        resultado.push(...respuesta.datos);
    }

    incidencias = resultado;
    renderizarIncidencias();
}

// Carga los técnicos disponibles en el selector de asignación.
async function cargarTecnicos() {
    try {
        const tecnicos = await solicitar(`${API_URL}/usuarios/tecnicos`);
        selectorTecnico.replaceChildren();

        const opcionInicial = document.createElement('option');
        opcionInicial.value = '';
        opcionInicial.textContent = tecnicos.length
            ? 'Seleccioná un técnico'
            : 'No hay técnicos activos';
        opcionInicial.disabled = true;
        opcionInicial.selected = true;
        selectorTecnico.appendChild(opcionInicial);

        tecnicos.forEach(tecnico => {
            const opcion = document.createElement('option');
            opcion.value = tecnico.id_usuario;
            opcion.textContent = `${tecnico.nombres} ${tecnico.apellidos}`;
            selectorTecnico.appendChild(opcion);
        });
    } catch (error) {
        selectorTecnico.replaceChildren();
        const opcion = document.createElement('option');
        opcion.value = '';
        opcion.textContent = 'No se pudieron cargar los técnicos';
        opcion.disabled = true;
        opcion.selected = true;
        selectorTecnico.appendChild(opcion);
        mostrarMensaje(error.message);
    }
}

// Devuelve incidencias que coinciden con los filtros activos.
function obtenerIncidenciasFiltradas() {
    return incidencias.filter(incidencia => {
        const coincidePrioridad = prioridadSeleccionada === 'todas'
            || incidencia.prioridad === Number(prioridadSeleccionada);
        const coincideEstado = estadoSeleccionado === 'todas'
            || incidencia.id_estado === Number(estadoSeleccionado);
        return coincidePrioridad && coincideEstado;
    });
}

// Dibuja la página actual de incidencias filtradas y sus controles.
function renderizarIncidencias() {
    const filtradas = obtenerIncidenciasFiltradas();
    const totalPaginas = Math.ceil(filtradas.length / registrosPorPagina);
    paginaActual = Math.min(paginaActual, Math.max(totalPaginas, 1));
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const pagina = filtradas.slice(inicio, inicio + registrosPorPagina);

    tabla.replaceChildren();
    if (pagina.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 7;
        celda.className = 'text-center text-muted';
        celda.textContent = 'No hay incidencias para los filtros seleccionados.';
        fila.appendChild(celda);
        tabla.appendChild(fila);
    }

    pagina.forEach(incidencia => {
        const fila = document.createElement('tr');
        const valores = [
            incidencia.id_incidencia,
            incidencia.articulo_descripcion
        ];

        valores.forEach((valor, indice) => {
            const celda = document.createElement('td');
            celda.dataset.label = indice === 0 ? 'N.º' : 'Artículo';
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        const celdaPrioridad = document.createElement('td');
        celdaPrioridad.dataset.label = 'Prioridad';
        celdaPrioridad.appendChild(crearBadge(badgesPrioridad[incidencia.prioridad]));
        fila.appendChild(celdaPrioridad);

        const celdaEstado = document.createElement('td');
        celdaEstado.dataset.label = 'Estado';
        celdaEstado.appendChild(crearBadge(badgesEstado[incidencia.id_estado]));
        fila.appendChild(celdaEstado);

        const celdaTecnico = document.createElement('td');
        celdaTecnico.dataset.label = 'Técnico asignado';
        celdaTecnico.textContent = incidencia.tecnico_asignado || 'Sin asignar';
        fila.appendChild(celdaTecnico);

        const celdaFecha = document.createElement('td');
        celdaFecha.dataset.label = 'Fecha';
        celdaFecha.textContent = incidencia.creado;
        fila.appendChild(celdaFecha);

        const celdaAcciones = document.createElement('td');
        celdaAcciones.dataset.label = 'Acciones';
        const botonDetalle = document.createElement('button');
        botonDetalle.type = 'button';
        botonDetalle.className = 'btn btn-sm btn-outline-secondary';
        botonDetalle.setAttribute('aria-label', 'Ver detalle');
        const icono = document.createElement('i');
        icono.className = 'bi bi-eye-fill';
        icono.setAttribute('aria-hidden', 'true');
        botonDetalle.appendChild(icono);
        // Abre el detalle de la incidencia desde su fila.
        botonDetalle.addEventListener('click', () => abrirDetalle(incidencia));
        celdaAcciones.appendChild(botonDetalle);
        fila.appendChild(celdaAcciones);
        tabla.appendChild(fila);
    });

    renderizarPaginacion(totalPaginas);
}

// Construye botones para navegar entre las páginas del listado.
function renderizarPaginacion(totalPaginas) {
    paginacion.replaceChildren();

    for (let numero = 1; numero <= totalPaginas; numero++) {
        const elemento = document.createElement('li');
        elemento.className = `page-item ${numero === paginaActual ? 'active' : ''}`;
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'page-link';
        boton.textContent = numero;
        // Actualiza la página visible del listado.
        boton.addEventListener('click', () => {
            paginaActual = numero;
            renderizarIncidencias();
        });
        elemento.appendChild(boton);
        paginacion.appendChild(elemento);
    }
}

// Guarda la incidencia seleccionada y prepara el modal de acciones.
function abrirDetalle(incidencia) {
    incidenciaSeleccionada = incidencia;
    document.getElementById('modal-id').textContent = incidencia.id_incidencia;
    document.getElementById('modal-articulo').textContent = incidencia.articulo_descripcion;
    document.getElementById('modal-descripcion').textContent = incidencia.descripcion_pedido;

    const esPendiente = incidencia.id_estado === 1;
    document.getElementById('btn-asignar').disabled = !esPendiente;
    document.getElementById('btn-cancelar').disabled = !esPendiente;
    selectorTecnico.disabled = !esPendiente;
    selectorTecnico.value = '';

    modal.show();
}

// Asigna o cancela la incidencia y actualiza la lista tras la respuesta.
async function actualizarIncidencia(accion, cuerpo) {
    if (!incidenciaSeleccionada) return;

    const botonAsignar = document.getElementById('btn-asignar');
    const botonCancelar = document.getElementById('btn-cancelar');
    botonAsignar.disabled = true;
    botonCancelar.disabled = true;
    mensaje.classList.add('d-none');

    try {
        await solicitar(
            `${API_URL}/incidencias/${incidenciaSeleccionada.id_incidencia}/${accion}`,
            {
                method: 'PATCH',
                ...(cuerpo ? { body: JSON.stringify(cuerpo) } : {})
            }
        );
        modal.hide();
        incidenciaSeleccionada = null;
        await cargarIncidencias();
        mostrarMensaje(
            accion === 'asignar' ? 'Incidencia asignada correctamente.' : 'Incidencia cancelada correctamente.',
            'success'
        );
    } catch (error) {
        mostrarMensaje(error.message);
        botonAsignar.disabled = false;
        botonCancelar.disabled = false;
    }
}

// Valida el técnico elegido y envía la asignación de la incidencia.
document.getElementById('btn-asignar').addEventListener('click', () => {
    const idTecnico = Number(selectorTecnico.value);
    if (!idTecnico) {
        mostrarMensaje('Seleccioná un técnico para asignar la incidencia.', 'warning');
        return;
    }
    actualizarIncidencia('asignar', { asignado_a: idTecnico });
});

// Solicita la cancelación de la incidencia seleccionada.
document.getElementById('btn-cancelar').addEventListener('click', () => {
    actualizarIncidencia('cancelar');
});

// Conecta un menú de filtro con la variable que conserva su selección.
function configurarFiltro(menuId, textoId, actualizarSeleccion) {
    const menu = document.getElementById(menuId);
    const texto = document.getElementById(textoId);

    // Aplica la opción elegida y refresca las incidencias.
    menu.addEventListener('click', event => {
        const opcion = event.target.closest('.dropdown-item[data-valor]');
        if (!opcion) return;

        actualizarSeleccion(opcion.dataset.valor);
        texto.textContent = opcion.dataset.etiqueta;
        menu.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.toggle('active', item === opcion);
        });
        paginaActual = 1;
        renderizarIncidencias();
    });
}

configurarFiltro('menu-filtro-prioridad', 'texto-filtro-prioridad', valor => {
    prioridadSeleccionada = valor;
});

configurarFiltro('menu-filtro-estado', 'texto-filtro-estado', valor => {
    estadoSeleccionado = valor;
});

if (!token) {
    mostrarMensaje('No se encontró la sesión. Iniciá sesión nuevamente.');
} else {
    cargarIncidencias().catch(error => {
        console.error('Error al cargar las incidencias del director:', error);
        mostrarMensaje(error.message || 'No se pudieron cargar las incidencias.');
    });
    cargarTecnicos();
}
