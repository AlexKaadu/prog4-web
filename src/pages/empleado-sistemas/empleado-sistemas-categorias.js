import { Modal } from 'bootstrap';

const tbody = document.getElementById('categorias-body');
const paginacion = document.getElementById('paginacion-categorias');
const limite = 10;
let paginaActual = 1;

const modalEditar = new Modal(document.getElementById('modal-editar-categoria'));
const idCategoriaEditar = document.getElementById('id-categoria-editar');
const descripcionEditar = document.getElementById('descripcion-editar');
const formEditar = document.getElementById('form-editar-categoria');


const modalConfirmarEliminar = new Modal(
    document.getElementById('modal-confirmar-eliminar')
);
const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');

let categoriaAEliminar = null;


async function cargarCategorias(pagina = 1) {

    try {
        const response = await fetch(
            `http://localhost:3000/api/v1/categorias?pagina=${pagina}&limite=${limite}`
        );

        if(!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const resultado = await response.json();
        const categorias = resultado.datos;
        paginaActual = resultado.pagina;
        tbody.replaceChildren();

        categorias.forEach(categoria => {
            const fila = document.createElement('tr');

            const id = document.createElement('th');
            id.scope = 'row';
            id.textContent = categoria.id_categoria;

            const descripcion = document.createElement('td');
            descripcion.textContent = categoria.descripcion;

            const acciones = document.createElement('td');

            const botonEditar = document.createElement('button');
            botonEditar.type = 'button';
            botonEditar.className = 'btn btn-sm btn-outline-primary me-2';
            botonEditar.title = 'Editar categoría';
            botonEditar.setAttribute('aria-label', 'Editar categoría');
            
            const iconoEditar = document.createElement('i');
            iconoEditar.className = 'bi bi-pencil';
            iconoEditar.setAttribute('aria-hidden', 'true');
            botonEditar.append(iconoEditar);


            const botonEliminar = document.createElement('button');
            botonEliminar.type = 'button';
            botonEliminar.className = 'btn btn-sm btn-outline-danger me-2';
            botonEliminar.title = 'Desactivar categoría';
            botonEliminar.setAttribute('aria-label', 'Desactivar categoría')

            const iconoEliminar = document.createElement('i');
            iconoEliminar.className = 'bi bi-trash';
            iconoEliminar.setAttribute('aria-hidden', 'true');
            botonEliminar.append(iconoEliminar);

           

            botonEditar.addEventListener('click', () => {
                idCategoriaEditar.value = categoria.id_categoria;
                descripcionEditar.value = categoria.descripcion;
                modalEditar.show();
            });

            botonEliminar.addEventListener('click', () => {
            categoriaAEliminar = categoria;
            mensajeConfirmacion.textContent = `¿Desactivar la categoría "${categoria.descripcion}"?`;
            modalConfirmarEliminar.show();
            });


            acciones.append(botonEditar, botonEliminar);
            fila.append(id, descripcion, acciones);
            tbody.append(fila);

        });

        renderizarPaginacion(resultado.totalPaginas);


    } catch (error) {
        console.error ('Error al cargar categorias: ', error);

        const fila = document.createElement('tr');
        const mensaje = document.createElement('td');

        mensaje.colSpan = 3;
        mensaje.textContent = 'No se pudieron cargar las categorias.';

        fila.append(mensaje);
        tbody.replaceChildren(fila);
    }
}

cargarCategorias();


function renderizarPaginacion(totalPaginas){
    paginacion.replaceChildren();

    for(let numero = 1; numero <= totalPaginas; numero++){
        const item = document.createElement('li');
        item.className = `page-item ${numero === paginaActual ? 'active': ''}`;

        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'page-link';
        boton.textContent = numero;


        boton.addEventListener('click', () => cargarCategorias(numero));

        item.append(boton);
        paginacion.append(item);
    }
}





const btnNueva = document.getElementById('btn-nueva');
const formNueva = document.getElementById('form-nueva-categoria');
const btnCancelarNueva = document.getElementById('btn-cancelar-nueva');

btnNueva.addEventListener('click', () => {
    formNueva.classList.remove('d-none');

});

btnCancelarNueva.addEventListener('click', () => {
    formNueva.reset();
    formNueva.classList.add('d-none');
});


formNueva.addEventListener('submit', async (event) => {
    event.preventDefault();

    const descripcion = document.getElementById('descripcion-nueva').value.trim();

    try{
        const response = await fetch('http://localhost:3000/api/v1/categorias',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({descripcion})
        });

        const resultado = await response.json();

        if(!response.ok){
            const mensaje = resultado.error
                || resultado.errores?.[0]?.msg
                || `Error HTTP ${response.status}`;
            throw new Error(mensaje);
        }

        await cargarCategorias();
        formNueva.reset();
        formNueva.classList.add('d-none');
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        alert(error.mensaje);
    }
});


formEditar.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = idCategoriaEditar.value;
    const descripcion = descripcionEditar.value.trim();

    if (!id) {
        alert('No se pudo identificar la categoría a editar.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/v1/categorias/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
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

        formEditar.reset();
        modalEditar.hide();
        await cargarCategorias(paginaActual);
    } catch (error) {
        console.error('Error al editar la categoría:', error);
        alert(error.message);
    }
});


btnConfirmarEliminar.addEventListener('click', async () => {
    if (!categoriaAEliminar) return;

    try {
        const response = await fetch(
            `http://localhost:3000/api/v1/categorias/${categoriaAEliminar.id_categoria}`,
            {
                method: 'DELETE'
            }
        );

        const resultado = await response.json().catch(() => ({}));

        if (!response.ok) {
            const mensaje = resultado.error
                || resultado.errores?.[0]?.msg
                || `Error HTTP ${response.status}`;
            throw new Error(mensaje);
        }

        modalConfirmarEliminar.hide();
        await cargarCategorias(paginaActual);
    } catch (error) {
        console.error('Error al desactivar la categoría:', error);
        alert(error.message);
    }
});










