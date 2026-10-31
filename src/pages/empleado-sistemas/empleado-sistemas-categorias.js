import { Modal } from "bootstrap";

// Elementos que reciben el listado y los controles de paginación.
const cuerpoCategorias = document.getElementById("categorias-cuerpo");
const paginacion = document.getElementById("paginacion-categorias");
const limite = 10;
let paginaActual = 1;

// Referencias y componentes Bootstrap del formulario de edición.
const modalEditar = new Modal(document.getElementById("editarCategoria"));
const formEditar = document.getElementById("form-editar-categoria");
const descripcionEditar = document.getElementById("descripcion-editar");
let categoriaAEditar = null;

// Referencias del diálogo de confirmación para desactivar categorías.
const modalConfirmarEliminar = new Modal(
    document.getElementById("modal-confirmar-eliminar")
);
const btnConfirmarEliminar = document.getElementById("btn-confirmar-eliminar");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
// Categoría seleccionada para desactivación, pendiente de confirmación.
let categoriaAEliminar = null;

const token = sessionStorage.getItem("token");

/**
 * Solicita una página de categorías a la API y actualiza la tabla y la paginación.
 * Ante un error, muestra un mensaje en el cuerpo de la tabla.
 */
async function cargarCategorias(pagina = 1) {

    try {
        const response = await fetch(
            `http://localhost:3000/api/v1/categorias?pagina=${pagina}&limite=${limite}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const resultado = await response.json();
        const categorias = resultado.datos;
        paginaActual = resultado.pagina;
        cuerpoCategorias.replaceChildren();

        // Crea una fila por categoría y conecta sus acciones con los diálogos.
        categorias.forEach(categoria => {
            const fila = document.createElement("tr");

            const id = document.createElement("th");
            id.scope = "row";
            id.dataset.label = "Código";
            id.textContent = categoria.id_categoria;

            const descripcion = document.createElement("td");
            descripcion.dataset.label = "Descripción";
            descripcion.textContent = categoria.descripcion;

            const acciones = document.createElement("td");
            acciones.dataset.label = "Acciones";

            const botonEditar = document.createElement("button");
            botonEditar.type = "button";
            botonEditar.className = "btn btn-sm btn-outline-primary me-2";
            botonEditar.title = "Editar categoría";
            botonEditar.setAttribute("aria-label", "Editar categoría");

            const iconoEditar = document.createElement("i");
            iconoEditar.className = "bi bi-pencil";
            iconoEditar.setAttribute("aria-hidden", "true");
            botonEditar.append(iconoEditar);

            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.className = "btn btn-sm btn-outline-danger me-2";
            botonEliminar.title = "Desactivar categoría";
            botonEliminar.setAttribute("aria-label", "Desactivar categoría")

            const iconoEliminar = document.createElement("i");
            iconoEliminar.className = "bi bi-trash";
            iconoEliminar.setAttribute("aria-hidden", "true");
            botonEliminar.append(iconoEliminar);

            // Rellena el formulario con los datos actuales y abre el modal.
            botonEditar.addEventListener("click", () => {
                categoriaAEditar = categoria;
                descripcionEditar.value = categoria.descripcion;
                modalEditar.show();
            });

            // Guarda la selección y pide confirmación antes de desactivar.
            botonEliminar.addEventListener("click", () => {
                categoriaAEliminar = categoria;
                mensajeConfirmacion.textContent = `¿Estás seguro de eliminar la categoría "${categoria.descripcion}"?`;
                modalConfirmarEliminar.show();
            });

            acciones.append(botonEditar, botonEliminar);
            fila.append(id, descripcion, acciones);
            cuerpoCategorias.append(fila);

        });

        renderizarPaginacion(resultado.totalPaginas);

    } catch (error) {
        console.error("Error al cargar categorias: ", error);

        const fila = document.createElement("tr");
        const mensaje = document.createElement("td");

        mensaje.colSpan = 3;
        mensaje.textContent = "No se pudieron cargar las categorias.";

        fila.append(mensaje);
        cuerpoCategorias.replaceChildren(fila);
    }
}

cargarCategorias();

// Genera un botón por página y resalta la página actual.
function renderizarPaginacion(totalPaginas) {
    paginacion.replaceChildren();

    for (let numero = 1; numero <= totalPaginas; numero++) {
        const item = document.createElement("li");
        item.className = `page-item ${numero === paginaActual ? "active" : ""}`;

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "page-link";
        boton.textContent = numero;

        boton.addEventListener("click", () => cargarCategorias(numero));

        item.append(boton);
        paginacion.append(item);
    }
}

// Alta de categorías.
const formNueva = document.getElementById("form-nueva-categoria");

// Envía la categoría nueva; si se crea correctamente, recarga el listado y oculta el formulario.
formNueva.addEventListener("submit", async (event) => {
    event.preventDefault();

    const descripcion = document.getElementById("descripcion-nueva").value.trim();

    try {
        const response = await fetch("http://localhost:3000/api/v1/categorias", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ descripcion })
        });

        const resultado = await response.json().catch(() => ({}));

        if (!response.ok) {
            const mensaje = resultado.error
                || resultado.errores?.[0]?.msg
                || `Error HTTP ${response.status}`;
            throw new Error(mensaje);
        }

        await cargarCategorias();
        formNueva.reset();

        const modal = Modal.getInstance(
            document.getElementById("nuevaCategoria")
        );

        modal.hide();

    } catch (error) {
        console.error("Error al crear la categoría:", error);
        alert(error.message);
    }
});

// Envía los cambios de la categoría seleccionada y vuelve a cargar la página actual.
formEditar.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const response = await fetch(`http://localhost:3000/api/v1/categorias/${categoriaAEditar.id_categoria}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ descripcion: descripcionEditar.value })
        });

        const resultado = await response.json().catch(() => ({}));

        if (!response.ok) {
            const mensaje = resultado.error
                || resultado.errores?.[0]?.msg
                || `Error HTTP ${response.status}`;
            throw new Error(mensaje);
        }

        categoriaAEditar = null;
        modalEditar.hide();
        await cargarCategorias(paginaActual);
    } catch (error) {
        console.error("Error al editar la categoría:", error);
        alert(error.message);
    }
});

// Desactiva la categoría confirmada y refresca el listado de la página actual.
btnConfirmarEliminar.addEventListener("click", async () => {
    if (!categoriaAEliminar) return;

    try {
        const response = await fetch(
            `http://localhost:3000/api/v1/categorias/${categoriaAEliminar.id_categoria}`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const resultado = await response.json().catch(() => ({}));

        if (!response.ok) {
            const mensaje = resultado.error
                || resultado.errores?.[0]?.msg
                || `Error HTTP ${response.status}`;
            throw new Error(mensaje);
        }

        categoriaAEliminar = null;
        modalConfirmarEliminar.hide();
        await cargarCategorias(paginaActual);
    } catch (error) {
        console.error("Error al desactivar la categoría:", error);
        alert(error.message);
    }
});