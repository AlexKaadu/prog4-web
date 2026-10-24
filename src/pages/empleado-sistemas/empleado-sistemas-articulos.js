import { Modal } from 'bootstrap';

const cuerpoArticulos = document.getElementById("cuerpo-articulos");

// Referencias al modal de edición
const modalEditar = new Modal(document.getElementById("editarArticulo"));
const formEditar = document.getElementById("form-editar-articulo");
const descripcionEditar = document.getElementById("descripcion-editar");
const areaEditar = document.getElementById("area-editar-selector");
const categoriaEditar = document.getElementById("categoria-editar-selector");
let articuloAEditar = null;

// Referencias al modal de confirmación
const modalEliminar = new Modal(document.getElementById("eliminarArticulo"));
const btnConfirmarEliminar = document.getElementById("btn-confirmar-eliminar");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
let articuloAEliminar = null;


async function cargarArticulos() {

    try {

        // 1. Pedimos los datos API
        const respuesta = await fetch(
            "http://localhost:3000/api/v1/articulos"
        );
        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        // 2. Convertimos la respuesta JSON en un arreglo JavaScript
        const articulos = await respuesta.json();

        cuerpoArticulos.replaceChildren();

        // 3. Dibujamos una fila por cada artículo
        articulos.datos.forEach(dato => {
            const fila = document.createElement("tr");

            const celdaId = document.createElement("th");
            celdaId.scope = "row";
            celdaId.textContent = dato.id_articulo;

            const celdaDescripcion = document.createElement("td");
            celdaDescripcion.textContent = dato.descripcion;

            const celdaArea = document.createElement("td");
            celdaArea.textContent = dato.area;

            const celdaCategoria = document.createElement("td");
            celdaCategoria.textContent = dato.categoria;

            // Botones editar-eliminar
            const celdaAcciones = document.createElement("td");

            const botonEditar = document.createElement("button");
            botonEditar.type = "button";
            botonEditar.className = "btn btn-warning btn-sm";
            botonEditar.title = "Editar";
            botonEditar.dataset.bsToggle = "modal";
            botonEditar.dataset.bsTarget = "#editarArticulo";
            botonEditar.textContent = "Editar";

            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.className = "btn btn-danger btn-sm";
            botonEliminar.title = "Eliminar";
            botonEliminar.dataset.bsToggle = "modal";
            botonEliminar.dataset.bsTarget = "#eliminarArticulo";
            botonEliminar.textContent = "Eliminar";

            const contenedorAcciones = document.createElement("div");
            contenedorAcciones.className = "d-flex gap-2";

            contenedorAcciones.appendChild(botonEditar);
            contenedorAcciones.appendChild(botonEliminar);

            celdaAcciones.appendChild(contenedorAcciones);

            fila.appendChild(celdaId);
            fila.appendChild(celdaDescripcion);
            fila.appendChild(celdaArea);
            fila.appendChild(celdaCategoria);
            fila.appendChild(celdaAcciones);

            cuerpoArticulos.appendChild(fila);

            // Solo recordar
            botonEditar.addEventListener("click", () => {
                articuloAEditar = dato;
                descripcionEditar.value = dato.descripcion;
                areaEditar.value = dato.id_area;
                categoriaEditar.value = dato.id_categoria;
            });

            botonEliminar.addEventListener("click", () => {
                articuloAEliminar = dato;
                mensajeConfirmacion.textContent = `¿Estás seguro de eliminar el artículo "${dato.descripcion}"?`;
            });


        });

    } catch (error) {
        console.error("Error al cargar los artículos ", error);
    }

}

async function cargarAreas(idSelector) {
    const respuesta = await fetch(
        "http://localhost:3000/api/v1/areas"
    );

    const areas = await respuesta.json();
    const selector = document.getElementById(idSelector);

    selector.replaceChildren();

    areas.forEach(area => {
        const opcion = document.createElement("option");
        opcion.value = area.id_area;
        opcion.textContent = area.descripcion;
        selector.appendChild(opcion);
    });
}

async function cargarCategorias(idSelector) {
    const respuesta = await fetch(
        "http://localhost:3000/api/v1/categorias"
    );

    const categorias = await respuesta.json();
    const selector = document.getElementById(idSelector);

    selector.replaceChildren();

    categorias.datos.forEach(dato => {
        const opcion = document.createElement("option");
        opcion.value = dato.id_categoria;
        opcion.textContent = dato.descripcion;
        selector.appendChild(opcion);
    });
}

cargarArticulos();

cargarAreas("area-nueva-selector");
cargarAreas("area-editar-selector");

cargarCategorias("categoria-nueva-selector");
cargarCategorias("categoria-editar-selector");

// Alta de articulos
const formNueva = document.getElementById('form-nuevo-articulo');

formNueva.addEventListener('submit', async (e) => {
    e.preventDefault();

    const respuesta = await fetch('http://localhost:3000/api/v1/articulos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_area: Number(document.getElementById('area-nueva-selector').value),
            id_categoria: Number(document.getElementById('categoria-nueva-selector').value),
            descripcion: document.getElementById('descripcion-nuevo').value.trim()
        })
    });

    if (respuesta.ok) {
        await cargarArticulos();
        formNueva.reset();

        const modal = Modal.getInstance(
            document.getElementById("nuevoArticulo")
        );

        modal.hide();
    }
});

// Editar
formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const respuesta = await fetch(
            `http://localhost:3000/api/v1/articulos/${articuloAEditar.id_articulo}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    descripcion: descripcionEditar.value,
                    id_area: Number(areaEditar.value),
                    id_categoria: Number(categoriaEditar.value)
                })
            }
        );

        if (respuesta.ok) {
            modalEditar.hide();
            articuloAEditar = null;
            await cargarArticulos();

        }
    } catch (error) {
        console.error("Error al editar el artículo", error);
    }
})


// Borrar
btnConfirmarEliminar.addEventListener("click", async () => {
    try {

        const respuesta = await fetch(
            `http://localhost:3000/api/v1/articulos/${articuloAEliminar.id_articulo}`,
            {
                method: "DELETE"
            }
        );

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        modalEliminar.hide();
        articuloAEliminar = null;
        await cargarArticulos();
    } catch (error) {
        console.error("Error al eliminar el artículo", error);
    }
});