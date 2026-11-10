// Muestra las incidencias propias y permite filtrarlas, paginarlas y cancelar las pendientes.
import { Modal } from "bootstrap";

// Referencias a la API, elementos de la página y sesión del usuario.
const API_URL = 'http://localhost:3000/api/v1';
const tabla = document.getElementById('tabla-mis-incidencias');
const mensaje = document.getElementById('mensaje-incidencias');
const paginacion = document.getElementById('paginacion-mis-incidencias');
const registrosPorPagina = 10;
let paginaActual = 1;
const token = sessionStorage.getItem('token');

const modalElemento = document.getElementById('modal-confirmar-cancelacion');
const modalCancelacion = new Modal(modalElemento);
const botonConfirmarCancelacion = document.getElementById('btn-confirmar-cancelacion');

let incidenciaSeleccionada = null;
let incidenciasCargadas = [];
let prioridadSeleccionada = 'todas';
let estadoSeleccionado = 'todas';


// Convierte los valores numéricos de la API en etiquetas y estilos visibles.
const prioridades = {
        1: { clase: 'badge-prioridad badge-baja', texto: 'Baja' },
        2: { clase: 'badge-prioridad badge-media', texto: 'Media'},
        3: { clase: 'badge-prioridad badge-alta', texto: 'Alta'}
};

const estados = {
    1: { clase: 'badge-estado badge-pendiente', texto: 'Pendiente' },
    2: { clase: 'badge-estado badge-en-proceso', texto: 'En proceso' },
    3: { clase: 'badge-estado badge-resuelto', texto: 'Resuelta' },
    4: { clase: 'badge-estado badge-cancelado', texto: 'Cancelada' }
};

// Solicita una página de incidencias propias y valida la respuesta del servidor.
async function cargarPagina(pagina) {
    const respuesta = await fetch(
        `${API_URL}/incidencias/propias?pagina=${pagina}&limite=100`,
        {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const datos = await respuesta.json();

    if(!respuesta.ok) {
        throw new Error(datos.error || datos.mensaje || 'No se pudieron cargar las incidencias. ');
    }

    return datos;
}

// Descarga todas las páginas y actualiza la lista visible.
async function cargarIncidencias() {
    const primeraPagina = await cargarPagina(1);
    const incidencias = [...primeraPagina.datos];

    for(let pagina = 2; pagina <= primeraPagina.totalPaginas; pagina++) {
        const respuesta = await cargarPagina(pagina);
        incidencias.push(...respuesta.datos);
    }

    incidenciasCargadas = incidencias;
    mostrarIncidencias(obtenerIncidenciasFiltradas());
}

// Construye una etiqueta visual para prioridad o estado.
function crearBadge(configuracion) {
    const badge = document.createElement('span');
    badge.className = configuracion.clase;
    badge.textContent = configuracion.texto;
    return badge;
}


// Guarda la incidencia seleccionada y abre el modal de confirmación.
function abrirModalCancelacion(incidencia) {
    incidenciaSeleccionada = incidencia;

    const texto = document.getElementById('mensaje-confirmar-cancelacion');
    texto.textContent =
        `¿Estás seguro de cancelar la incidencia ${incidencia.id_incidencia}?`;

    modalCancelacion.show();
}

// Confirma la cancelación en la API y muestra el resultado al usuario.
async function confirmarCancelacion() {
    if(!incidenciaSeleccionada) return;

    botonConfirmarCancelacion.disabled = true;

    try{
        const respuesta = await fetch(
            `${API_URL}/incidencias/${incidenciaSeleccionada.id_incidencia}/cancelar-propia`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const datos = await respuesta.json();

        if(!respuesta.ok && respuesta.status !== 502) {
            throw new Error(
                datos.error || datos.mensaje || 'No se pudo cancelar la incidencia.'
            );
        }

        modalCancelacion.hide();
        await cargarIncidencias();

        if(respuesta.status === 502) {
            mensaje.textContent =
                'La incidencia se canceló, pero falló el envío del correo.';
            mensaje.className = 'alert alert-warning';
        } else {
            mensaje.textContent = 'Incidencia cancelada correctamente.';
            mensaje.className = 'alert alert-success';
        }
    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.className = 'alert alert-danger';
    } finally {
        botonConfirmarCancelacion.disabled = false;
        incidenciaSeleccionada = null;
    }
}

// Ejecuta la cancelación cuando se confirma desde el modal.
botonConfirmarCancelacion.addEventListener('click', confirmarCancelacion);


// Filtra las incidencias según la prioridad y el estado seleccionados.
function obtenerIncidenciasFiltradas() {
    return incidenciasCargadas.filter(incidencia => {
        const coincidePrioridad = prioridadSeleccionada === 'todas'
            || incidencia.prioridad === Number(prioridadSeleccionada);
        const coincideEstado = estadoSeleccionado === 'todas'
            || incidencia.id_estado === Number(estadoSeleccionado);

        return coincidePrioridad && coincideEstado;
    });
}

// Genera controles para cambiar de página en la lista filtrada.
function mostrarPaginacion(totalPaginas) {
    paginacion.replaceChildren();

    for(let numero = 1; numero <= totalPaginas; numero++) {
        const item = document.createElement('li');
        item.className = `page-item ${numero === paginaActual ? 'active': ''}`;

        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'page-link';
        boton.textContent = numero;

        // Cambia la página visible y vuelve a renderizar las incidencias.
        boton.addEventListener('click', () => {
            paginaActual = numero;
            mostrarIncidencias(obtenerIncidenciasFiltradas());

        });

        item.appendChild(boton);
        paginacion.appendChild(item);
    }
}


// Renderiza las incidencias de la página actual, incluyendo sus acciones.
function mostrarIncidencias(incidencias) {
    tabla.replaceChildren();

    const totalPaginas = Math.ceil(incidencias.length / registrosPorPagina);
    paginaActual = Math.min(paginaActual, Math.max(totalPaginas, 1));
    
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const incidenciasDeLaPagina = incidencias.slice(
        inicio,
        inicio + registrosPorPagina
    );

    if(incidencias.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 7;
        celda.textContent = incidenciasCargadas.length === 0
            ? 'Todavía no creaste incidencias.'
            : 'No hay incidencias que coincidan con los filtros seleccionados.';
        fila.appendChild(celda);
        tabla.appendChild(fila);
        mostrarPaginacion(0);
        return;
    }

    incidenciasDeLaPagina.forEach(incidencia => {
        const fila = document.createElement('tr');

        const id = document.createElement('td');
        id.dataset.label = 'Identificador';
        id.textContent = incidencia.id_incidencia;
        fila.appendChild(id);

        const articulo = document.createElement('td');
        articulo.dataset.label = 'Artículo';
        articulo.textContent = incidencia.articulo_descripcion;
        fila.appendChild(articulo);

        const descripcion = document.createElement('td');
        descripcion.dataset.label = 'Descripción';
        descripcion.textContent = incidencia.descripcion_pedido;
        fila.appendChild(descripcion);

        const prioridad = document.createElement('td');
        prioridad.dataset.label = 'Prioridad';
        prioridad.appendChild(crearBadge(prioridades[incidencia.prioridad]));
        fila.appendChild(prioridad);

        const creada = document.createElement('td');
        creada.dataset.label = 'Creada';
        creada.textContent = incidencia.creado;
        fila.appendChild(creada);

        const estado = document.createElement('td');
        estado.dataset.label = 'Estado';
        estado.appendChild(crearBadge(estados[incidencia.id_estado]));
        fila.appendChild(estado);

        const acciones = document.createElement('td');
        acciones.dataset.label = 'Acciones';
        const sePuedeCancelar = incidencia.id_estado === 1;

        const botonCancelar = document.createElement('button');
        botonCancelar.type = 'button';
        botonCancelar.className = sePuedeCancelar
            ? 'btn btn-danger btn-sm'
            : 'btn btn-secondary btn-sm';
        botonCancelar.textContent = 'Cancelar';
        botonCancelar.disabled = !sePuedeCancelar;

        if(sePuedeCancelar){
            // Pide confirmación antes de cancelar una incidencia pendiente.
            botonCancelar.addEventListener('click', () => abrirModalCancelacion(incidencia));

        } else {
            botonCancelar.title = 'Solo se pueden cancelar incidencias pendientes';
        }

        acciones.appendChild(botonCancelar);
        fila.appendChild(acciones);
        
        tabla.appendChild(fila);
    });

    mostrarPaginacion(totalPaginas);
}

// Referencias a los menús de filtro y sus textos visibles.
const menuFiltroPrioridad = document.getElementById('menu-filtro-prioridad');
const textoFiltroPrioridad = document.getElementById('texto-filtro-prioridad');
const menuFiltroEstado = document.getElementById('menu-filtro-estado');
const textoFiltroEstado = document.getElementById('texto-filtro-estado');

// Conecta un menú de filtro con su selección y refresca la lista.
function configurarFiltro(menu, texto, atributo, actualizarSeleccion) {
    menu.addEventListener('click', event => {
        const opcion = event.target.closest(`.dropdown-item[data-${atributo}]`);
        if(!opcion) return;

        actualizarSeleccion(opcion.dataset[atributo]);
        texto.textContent = opcion.dataset.etiqueta;

        menu.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.toggle('active', item === opcion);
        });

        paginaActual = 1;
        mostrarIncidencias(obtenerIncidenciasFiltradas());
    });
}

configurarFiltro(
    menuFiltroPrioridad,
    textoFiltroPrioridad,
    'prioridad',
    valor => { prioridadSeleccionada = valor; }
);

configurarFiltro(
    menuFiltroEstado,
    textoFiltroEstado,
    'estado',
    valor => { estadoSeleccionado = valor; }
);

// Exige una sesión iniciada antes de cargar los datos privados del empleado.
if(!token) {
    window.location.href ='/index.html';
} else {
    cargarIncidencias().catch(error => {
        console.error('Error al cargar tus incidencias:', error);
        mensaje.textContent = error.message;
        mensaje.className = 'alert alert-danger';
    });
}