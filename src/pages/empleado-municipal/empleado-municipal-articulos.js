// Consulta artículos y permite filtrarlos y paginarlos en la vista municipal.
const API_URL = 'http://localhost:3000/api/v1';
const token = sessionStorage.getItem('token');
const buscador = document.getElementById('filtro-articulo');
const filtroCategoria = document.getElementById('filtro-categoria');
const cuerpoTabla = document.getElementById('tabla-articulos-datos');
const mensaje = document.getElementById('mensaje-articulos');
const paginacion = document.getElementById('paginacion-articulos')

let articulos = [];
const limiteVista = 10;
let paginaActual = 1;

// Solicita una página de artículos a la API y valida la respuesta.
async function cargarPagina(pagina) {
    const respuesta = await fetch(
        `${API_URL}/articulos?pagina=${pagina}&limite=100`,
        {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || datos.mensaje || 'No se pudieron cargar los artículos.');
    }

    return datos;
}

// Reúne las páginas disponibles y prepara filtros, tabla y paginación.
async function cargarArticulos() {
    const primeraPagina = await cargarPagina(1);
    const lista = [...primeraPagina.datos];

    for (let pagina = 2; pagina <= primeraPagina.totalPaginas; pagina++) {
        const respuesta = await cargarPagina(pagina);
        lista.push(...respuesta.datos);
    }

    articulos = lista;
    cargarCategorias();
    mostrarArticulos();
}

// Llena el filtro con las categorías presentes en los artículos cargados.
function cargarCategorias() {
    const categorias = [...new Set(articulos.map(articulo => articulo.categoria))]
        .sort((a, b) => a.localeCompare(b, 'es'));

    filtroCategoria.replaceChildren();

    const opcionTodas = document.createElement('option');
    opcionTodas.value = '';
    opcionTodas.textContent = 'Todas las categorías';
    filtroCategoria.appendChild(opcionTodas);

    categorias.forEach(categoria => {
        const opcion = document.createElement('option');
        opcion.value = categoria;
        opcion.textContent = categoria;
        filtroCategoria.appendChild(opcion);
    });
}

// Filtra los artículos y dibuja solo los registros de la página actual.
function mostrarArticulos() {
    const textoBuscado = buscador.value.trim().toLocaleLowerCase('es');
    const categoriaSeleccionada = filtroCategoria.value;
    const articulosFiltrados = articulos.filter(articulo => {
        const coincideNombre = articulo.descripcion
            .toLocaleLowerCase('es')
            .includes(textoBuscado);
        const coincideCategoria = !categoriaSeleccionada
            || articulo.categoria === categoriaSeleccionada;

        return coincideNombre && coincideCategoria;
    });


    const totalPaginas = Math.ceil(articulosFiltrados.length / limiteVista);
    const inicio = (paginaActual - 1) * limiteVista;
    const articulosDeLaPagina = articulosFiltrados.slice(
        inicio,
        inicio + limiteVista
    );

    renderizarPaginacion(totalPaginas);
    cuerpoTabla.replaceChildren();

    if (articulosDeLaPagina.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 4;
        celda.className = 'text-center text-muted';
        celda.textContent = articulos.length === 0
            ? 'No hay artículos disponibles.'
            : 'No hay artículos que coincidan con los filtros.';
        fila.appendChild(celda);
        cuerpoTabla.appendChild(fila);
        return;
    }

    articulosDeLaPagina.forEach(articulo => {
        const fila = document.createElement('tr');

        const id = document.createElement('td');
        id.dataset.label = 'Identificador';
        id.textContent = articulo.id_articulo;
        fila.appendChild(id);

        const descripcion = document.createElement('td');
        descripcion.dataset.label = 'Artículo';
        descripcion.textContent = articulo.descripcion;
        fila.appendChild(descripcion);

        const categoria = document.createElement('td');
        categoria.dataset.label = 'Categoría';
        categoria.textContent = articulo.categoria;
        fila.appendChild(categoria);

        const area = document.createElement('td');
        area.dataset.label = 'Área';
        area.textContent = articulo.area;
        fila.appendChild(area);
        
        cuerpoTabla.appendChild(fila);
    });
}

// Crea botones para navegar por las páginas del resultado filtrado.
function renderizarPaginacion(totalPaginas) {
    paginacion.replaceChildren();

    for(let numero = 1; numero <= totalPaginas; numero++) {
        const item = document.createElement('li');
        item.className = `page-item ${numero === paginaActual ? 'active' : ''}`;

        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'page-link';
        boton.textContent = numero;

        // Cambia la página visible y vuelve a dibujar la lista.
        boton.addEventListener('click', () => {
            paginaActual = numero;
            mostrarArticulos();
        });

        item.appendChild(boton);
        paginacion.appendChild(item);

    }
}






















buscador.addEventListener('input', mostrarArticulos);
filtroCategoria.addEventListener('change', mostrarArticulos);

if (!token) {
    window.location.href = '/index.html';
} else {
    cargarArticulos().catch(error => {
        console.error('Error al cargar los artículos:', error);
        mensaje.textContent = error.message;
        mensaje.className = 'alert alert-danger';
    });
}
