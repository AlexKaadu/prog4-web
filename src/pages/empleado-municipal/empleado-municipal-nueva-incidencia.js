
// Carga los artículos disponibles y envía el formulario para crear una incidencia.
const API_URL = 'http://localhost:3000/api/v1';
const selectorArticulo = document.getElementById('articulo');
const token = sessionStorage.getItem('token');

// Solicita los artículos disponibles y los agrega al selector del formulario.
async function cargarArticulos() {
    const respuesta = await fetch(
        `${API_URL}/articulos?pagina=1&limite=100`,
        {
            cache: 'no-store',
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    );

    const datos = await respuesta.json();

    if(!respuesta.ok) {
        throw new Error(datos.error || 'No se pudieron cargar los articulos.');
    }


    selectorArticulo.replaceChildren();

    const opcionInicial = document.createElement('option');
    opcionInicial.value = '';
    opcionInicial.textContent = 'Seleccione un articulo';
    opcionInicial.disabled = true;
    opcionInicial.selected = true;
    selectorArticulo.appendChild(opcionInicial);

    datos.datos.forEach(articulo => {
        const opcion = document.createElement('option');
        opcion.value = articulo.id_articulo;
        opcion.textContent = articulo.descripcion;
        selectorArticulo.appendChild(opcion);
    });
}

if(!token) {
        window.location.href = '/index.html';
} else {
        cargarArticulos().catch(error => {
            console.error('Error al cargar los artículos', error);
        });
}




const formulario = document.getElementById('form-nueva-incidencia');
const selectorPrioridad = document.getElementById('prioridad');
const descripcion = document.getElementById('descripcion');
const mensaje = document.getElementById('mensaje-incidencia');

// Valida y envía el formulario para crear una incidencia.
formulario.addEventListener('submit', async event => {
    event.preventDefault();

    mensaje.classList.add('d-none');

    try{
        const respuesta = await fetch(`${API_URL}/incidencias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                id_articulo: Number(selectorArticulo.value),
                prioridad: Number(selectorPrioridad.value),
                descripcion_pedido: descripcion.value.trim()
            })
        });

        const datos = await respuesta.json();

        if(!respuesta.ok) {
            const erroresValidacion = datos.errores 
            ?.map(error => error.msg)
            .join(', ');

            throw new Error(
                datos.error || datos.mensaje || erroresValidacion ||
                'No se pudo crear la incidencia.'
            );
        }

        mensaje.textContent = `Incidencia #${datos.id_incidencia} creada correctamente.`;
        mensaje.className = 'alert alert-success';
        formulario.reset();

    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.className = 'alert alert-danger';
    }
});