// Muestra las incidencias asignadas al técnico y permite finalizar las que están en proceso.
import { Modal } from "bootstrap";

const badgesPrioridad = {

    1: { clase: 'badge-prioridad badge-baja', texto: 'BAJA' },
    2: { clase: 'badge-prioridad badge-media', texto: 'MEDIA' },
    3: { clase: 'badge-prioridad badge-alta', texto: 'ALTA' }

};

const badgesEstado = {
    1: { clase: "badge-estado badge-pendiente", texto: "PENDIENTE" },
    2: { clase: 'badge-estado badge-en-proceso', texto: 'EN PROCESO' },
    3: { clase: 'badge-estado badge-resuelto', texto: 'RESUELTA' },
    4: { clase: "badge-estado badge-cancelado", texto: "CANCELADA" }
};


// Crea una etiqueta visual para el estado o la prioridad de la incidencia.
function crearBadge(datosBadge) {
    const badge = document.createElement('span');
    badge.className = datosBadge.clase;
    badge.textContent = datosBadge.texto;
    return badge;
}

const token = sessionStorage.getItem("token");

// Referencias a la tabla de incidencias
const cuerpoIncidencias = document.getElementById("cuerpo-incidencias");

// Referencias al modal de finalizaciÃ³n
const modalFinalizar = new Modal(document.getElementById("finalizarIncidencia"));
const formFinalizar = document.getElementById("form-finalizar-incidencia");
const articuloAFinalizar = document.getElementById("articuloAFinalizar");
const descripcionPedido = document.getElementById("descripcionPedido");
const descripcionResolucion = document.getElementById("descripcion-resolucion");
let incidenciaAFinalizar = null;

// Referencias a la paginaciÃ³n
const paginacion = document.getElementById("paginacion-incidencias");
const limite = 10;
let paginaActual = 1;

// Obtiene las incidencias asignadas al técnico y dibuja la página solicitada.
async function cargarIncidencias(pagina = 1) {

    try {

        // 1. Pedimos los datos a la API.
        const respuesta = await fetch(
            `http://localhost:3000/api/v1/incidencias/asignadas?pagina=${pagina}&limite=${limite}`,
            { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } }
        );

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        // 2. Convertimos la respuesta JSON en un objeto JavaScript.
        const incidencias = await respuesta.json();

        paginaActual = incidencias.pagina;

        cuerpoIncidencias.replaceChildren();

        // 3. Dibujamos una fila por cada incidencia.
        incidencias.datos.forEach(incidencia => {
            const fila = document.createElement("tr");

            const celdaId = document.createElement("th");
            celdaId.scope = "row";
            celdaId.dataset.label = "Código";
            celdaId.textContent = incidencia.id_incidencia;

            const celdaArticulo = document.createElement("td");
            celdaArticulo.dataset.label = "Artículo";
            celdaArticulo.textContent = incidencia.articulo_descripcion;

            const celdaDescripcion = document.createElement("td");
            celdaDescripcion.dataset.label = "Descripción";
            celdaDescripcion.textContent = incidencia.descripcion_pedido;

            const celdaCreadoEl = document.createElement("td");
            celdaCreadoEl.dataset.label = "Creado el"
            celdaCreadoEl.textContent = incidencia.creado;

            const celdaPrioridad = document.createElement("td");
            celdaPrioridad.dataset.label = "Prioridad";
            celdaPrioridad.appendChild(
                crearBadge(badgesPrioridad[incidencia.prioridad])
            );

            const celdaEstado = document.createElement("td");
            celdaEstado.dataset.label = "Estado";
            celdaEstado.appendChild(
                crearBadge(badgesEstado[incidencia.id_estado])
            );

            const celdaAcciones = document.createElement("td");
            celdaAcciones.dataset.label = "Acciones";
            const botonFinalizar = document.createElement("button");
            const sePuedeFinalizar = incidencia.id_estado === 2;

            botonFinalizar.type = "button";
            botonFinalizar.className = `btn ${sePuedeFinalizar ? "btn-danger" : "btn-secondary"}`;
            botonFinalizar.textContent = "Finalizar";
            botonFinalizar.disabled = !sePuedeFinalizar;
            botonFinalizar.title = sePuedeFinalizar
                ? "Finalizar incidencia"
                : "Solo se pueden finalizar incidencias en proceso";
            celdaAcciones.appendChild(botonFinalizar);

            if (sePuedeFinalizar) {
                // Abre el formulario de finalización con los datos seleccionados.
                botonFinalizar.addEventListener("click", () => {
                    formFinalizar.reset();
                    incidenciaAFinalizar = incidencia;
                    articuloAFinalizar.textContent = incidencia.articulo_descripcion;
                    descripcionPedido.textContent = incidencia.descripcion_pedido;
                    modalFinalizar.show();
                });
            }

            fila.appendChild(celdaId);
            fila.appendChild(celdaArticulo);
            fila.appendChild(celdaDescripcion);
            fila.appendChild(celdaCreadoEl);
            fila.appendChild(celdaPrioridad);
            fila.appendChild(celdaEstado);
            fila.appendChild(celdaAcciones);

            cuerpoIncidencias.appendChild(fila);

        });

        renderizarPaginacion(incidencias.totalPaginas);

    } catch (error) {
        console.error("Error al cargar las incidencias ", error);

        const fila = document.createElement("tr");
        const mensaje = document.createElement("td");

        mensaje.colSpan = 7;
        mensaje.textContent = "No se pudieron cargar las incidencias.";

        fila.append(mensaje);
        cuerpoIncidencias.replaceChildren(fila);
    }
}

cargarIncidencias();

// Crea los controles para navegar entre páginas de incidencias.
function renderizarPaginacion(totalPaginas) {
    paginacion.replaceChildren();

    for (let numero = 1; numero <= totalPaginas; numero++) {
        const item = document.createElement("li");
        item.className = `page-item ${numero === paginaActual ? "active" : ""}`;

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "page-link";
        boton.textContent = numero;

        // Solicita las incidencias de la página elegida.
        boton.addEventListener("click", () => cargarIncidencias(numero));

        item.appendChild(boton);
        paginacion.appendChild(item);
    }
}

// Finalizar incidencia.
// Envía la descripción de resolución y actualiza el listado tras finalizar.
formFinalizar.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const respuesta = await fetch(
            `http://localhost:3000/api/v1/incidencias/${incidenciaAFinalizar.id_incidencia}/finalizar`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    descripcion_resolucion: descripcionResolucion.value.trim()
                })
            }
        );

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        modalFinalizar.hide();
        await cargarIncidencias(paginaActual);

    } catch (error) {
        console.error("Error al finalizar la incidencia ", error);
        alert("No se pudo finalizar la incidencia.");
    }
});