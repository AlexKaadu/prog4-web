import { incidencias } from '../../../datos/incidencias-empleado-sistemas.js';
import Chart from 'chart.js/auto';

// Plantillas HTML para mostrar los estados y prioridades como etiquetas visuales.
const badgesEstado = {
    1: '<span class="badge-estado badge-pendiente">PENDIENTE</span>',
    2: '<span class="badge-estado badge-en-proceso">EN PROCESO</span>',
    3: '<span class="badge-estado badge-resuelto">RESUELTA</span>',
    4: '<span class="badge-estado badge-cancelado">CANCELADA</span>'
};

const badgesPrioridad = {
    1: '<span class="badge-prioridad badge-baja">BAJA</span>',
    2: '<span class="badge-prioridad badge-media">MEDIA</span>',
    3: '<span class="badge-prioridad badge-alta">ALTA</span>'
};

// La tabla muestra cinco incidencias prioritarias por página.
const registrosPorPagina = 5;
let paginaActual = 1;

/** Renderiza en el DOM la página actual de la tabla de incidencias prioritarias. */
function renderizarTablaPrioritarias(lista) {
    const tbody = document.getElementById('tabla-prioritarias');
    tbody.textContent = '';

    const inicio = (paginaActual - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;

    const incidenciasDeLaPagina = lista.slice(inicio, fin);

    incidenciasDeLaPagina.forEach(inc => {
        const row = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent  = inc.id_incidencia;
        row.appendChild(tdId);

        const tdArticulo = document.createElement('td');
        tdArticulo.textContent = inc.articulo_descripcion;
        row.appendChild(tdArticulo);

        const tdPrioridad = document.createElement('td');
        tdPrioridad.innerHTML = badgesPrioridad[inc.prioridad];
        row.appendChild(tdPrioridad);

        const tdEstado = document.createElement('td');
        tdEstado.innerHTML = badgesEstado[inc.id_estado];
        row.appendChild(tdEstado);

        const tdFecha = document.createElement('td');
        tdFecha.textContent = inc.creado;
        row.appendChild(tdFecha);

        tbody.appendChild(row);
    });
};



/** Crea los controles de paginación y enlaza cada botón con la página elegida. */
function renderizarPaginacion(lista) {
    const contenedor = document.getElementById('paginacion-prioritarias');
    contenedor.textContent = '';

    const totalPaginas = Math.ceil(
        lista.length / registrosPorPagina
    );
    
    for (let numeroPagina = 1; numeroPagina <= totalPaginas; numeroPagina++) {
        const elemento = document.createElement('li');
        elemento.className = 'page-item';

        const boton = document.createElement('button');
        boton.className = 'page-link';
        boton.textContent = numeroPagina;

        boton.addEventListener('click', () => {
            paginaActual = numeroPagina;

            renderizarTablaPrioritarias(lista);
            renderizarPaginacion(lista);
        });
        elemento.appendChild(boton);
        contenedor.appendChild(elemento);
    }
}




/** Calcula los totales por estado y actualiza las tarjetas de resumen del dashboard. */
function actualizarTarjetas(incidencias) {
    const total = incidencias.length;
    const pendientes = incidencias.filter(inc => inc.id_estado === 1).length;
    const enProceso = incidencias.filter(inc => inc.id_estado === 2).length;
    const finalizadas = incidencias.filter(inc => inc.id_estado === 3).length;
    const canceladas = incidencias.filter(inc => inc.id_estado === 4).length;

    document.getElementById('total-incidencias').textContent = total;
    document.getElementById('pendientes').textContent = pendientes;
    document.getElementById('en-proceso').textContent = enProceso;
    document.getElementById('finalizadas').textContent = finalizadas;
    document.getElementById('canceladas').textContent = canceladas;
}






// Las instancias se conservan para actualizar sus datos sin recrear los gráficos.
let chartEstados = null;
const graficoEstados = document.getElementById('grafico-estados');

/** Crea o actualiza el gráfico de dona con el número de incidencias por estado. */
function actualizarGraficoEstados(lista) {
    const pendientes = lista.filter(inc => inc.id_estado === 1).length;
    const enProceso = lista.filter(inc => inc.id_estado === 2).length;
    const resueltas = lista.filter(inc => inc.id_estado === 3).length;
    const canceladas = lista.filter(inc => inc.id_estado === 4).length;

    const datos = [pendientes, enProceso, resueltas, canceladas];

    if (!chartEstados) {
        chartEstados = new Chart(graficoEstados, {
            type: 'doughnut',
            data: {
                labels: ['Pendientes', 'En proceso', 'Finalizadas', 'Canceladas'],
                datasets: [{
                    data: datos,
                    backgroundColor: [
                        '#ff0e3e81',
                        '#28a7fc77',
                        '#43cc6c8f',
                        '#5b5c5b81'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 2
            }
        });
    } else {
        chartEstados.data.datasets[0].data = datos;
        chartEstados.update();
    }
}

// Gráfico de incidencias agrupadas por día de creación.
let chartFechas = null;
const graficoFechas = document.getElementById('grafico-fechas');

/** Agrupa las incidencias por fecha, ordena los días y crea o actualiza el gráfico. */
function actualizarGraficoFechas(lista){
    const incidenciasPorFecha = {};

    lista.forEach(inc => {
        const fecha = inc.creado.split(' ')[0];

        if (incidenciasPorFecha[fecha]) {
            incidenciasPorFecha[fecha]++;
        } else {
            incidenciasPorFecha[fecha] = 1;
        }
    });

    const fechas = Object.keys(incidenciasPorFecha);

    fechas.sort((fechaA, fechaB) => parsearFechas(fechaA) - parsearFechas(fechaB));

    const cantidades = fechas.map(fecha => incidenciasPorFecha[fecha]);

    if (!chartFechas) {
        chartFechas = new Chart(graficoFechas, {
            type: 'line',
            data: {
                labels: fechas,
                datasets: [{
                    label: 'Incidencias creadas',
                    data: cantidades,
                    borderColor: '#36a2eb',
                    backgroundColor: '#36a2eb55',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 2,
                scales: {
                    x: { ticks: { maxTicksLimit: 8, maxRotation: 0 } },
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    } else {
        chartFechas.data.labels = fechas;
        chartFechas.data.datasets[0].data = cantidades;
        chartFechas.update();
    }
}


let chartPrioridad = null;
const graficoPrioridad = document.getElementById('grafico-prioridad');

/** Crea o actualiza el gráfico de barras con los totales por nivel de prioridad. */
function actualizarGraficoPrioridad(lista) {
    const datos = [3, 2, 1].map(prioridad =>
        lista.filter(inc => inc.prioridad === prioridad).length
    );

    if (!chartPrioridad) {
        chartPrioridad = new Chart(graficoPrioridad, {
            type: 'bar',
            data: {
                labels: ['Alta', 'Media', 'Baja'],
                datasets: [{
                    label: 'Incidencias',
                    data: datos,
                    backgroundColor: [
                        'rgba(255, 99, 133, 0.52)',
                        'rgba(255, 160, 64, 0.36)',
                        'rgba(81, 175, 69, 0.37)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(15, 207, 15)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 2,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    } else {
        chartPrioridad.data.datasets[0].data = datos;
        chartPrioridad.update();
    }
}




/** Muestra cada categoría, su cantidad y su proporción respecto al total filtrado. */
function actualizarGraficoCategoria(lista){
    const contenedor = document.getElementById('grafico-categorias');
    contenedor.replaceChildren();

    const incidenciasPorCategoria = {}

    lista.forEach(inc => {
        const categoria = inc.categoria;

        if(incidenciasPorCategoria[categoria]){
            incidenciasPorCategoria[categoria]++;
        }else{
            incidenciasPorCategoria[categoria] = 1;
        }
    });


    const total = lista.length;
    const categorias = Object.entries(incidenciasPorCategoria)
        .sort(([, cantidadA], [, cantidadB]) => cantidadB - cantidadA);

    categorias.forEach(([categoria, cantidad]) => {
    const porcentaje = total > 0 ? (cantidad / total) * 100 : 0;

    const divFila = document.createElement('div');
    divFila.className = 'mb-2 d-flex justify-content-between';

    const spanNombre = document.createElement('span');
    spanNombre.textContent = categoria;

     const spanCantidad = document.createElement('span');
    spanCantidad.textContent = cantidad;

    divFila.appendChild(spanNombre);
    divFila.appendChild(spanCantidad);


    const divProgress = document.createElement('div');
    divProgress.className = 'progress mb-3';
    divProgress.style.height = '8px';

    const divBarra = document.createElement('div');
    divBarra.className = 'progress-bar';
    divBarra.style.width = porcentaje + '%';

    divProgress.appendChild(divBarra);

    contenedor.appendChild(divFila);
    contenedor.appendChild(divProgress);



    });
}












// Convierte una fecha con formato día-mes-año (con hora opcional) a un objeto Date.
function parsearFechas(texto){
    const soloFecha = texto.split(' ')[0];
    const [dia, mes, anio] = soloFecha.split('-');
    return new Date(anio, mes - 1, dia);
}



/** Devuelve las incidencias que corresponden al periodo seleccionado en el menú. */
function filtrarPorFecha(incidencias, periodoSeleccionado) {

    const hoy = new Date();

    return incidencias.filter(inc => {
        const fechaInc = parsearFechas(inc.creado);

        
        switch(periodoSeleccionado){
            
            case '7dias': {
                const limite = new Date(hoy);
                limite.setDate(limite.getDate() - 7);
                return fechaInc >= limite;
            }

            case '30dias': {
                const limite = new Date(hoy);
                limite.setDate(limite.getDate() - 30 )
                return fechaInc >= limite;
            }

            case 'mes': {
            
                const mesHoy = hoy.getMonth();
                const anioHoy = hoy.getFullYear();

                const mesInc = fechaInc.getMonth();
                const anioInc = fechaInc.getFullYear();

                return (mesInc === mesHoy) && (anioInc === anioHoy)
            }

            case 'año': {
                const anioHoy = hoy.getFullYear();
                const anioInc = fechaInc.getFullYear();

                return (anioInc === anioHoy);
            }

            default:
                return true;
                

        }
    });

}

// Periodo inicial del dashboard y referencias a los controles del filtro.
let periodoFechaSeleccionado = '30dias';
const menuFiltroFecha = document.getElementById('menu-filtro-fecha');
const textoFiltroFecha = document.getElementById('texto-filtro-fecha');

/** Filtra los datos y sincroniza tarjetas, gráficos y tabla prioritaria. */
function actualizarDashboard() {
    paginaActual = 1;

    const incidenciasFiltradas = filtrarPorFecha(incidencias, periodoFechaSeleccionado);

    actualizarTarjetas(incidenciasFiltradas);
    actualizarGraficoEstados(incidenciasFiltradas);
    actualizarGraficoFechas(incidenciasFiltradas);
    actualizarGraficoCategoria(incidenciasFiltradas);
    actualizarGraficoPrioridad(incidenciasFiltradas);

    const prioritarias = incidenciasFiltradas.filter(inc =>
        inc.prioridad === 3 && (inc.id_estado === 1 || inc.id_estado === 2)
    );

    renderizarTablaPrioritarias(prioritarias);
    renderizarPaginacion(prioritarias)
}

menuFiltroFecha.addEventListener('click', event => {
    const opcion = event.target.closest('.dropdown-item[data-valor]');
    if (!opcion) return;

    periodoFechaSeleccionado = opcion.dataset.valor;
    textoFiltroFecha.textContent = opcion.dataset.etiqueta;
    menuFiltroFecha.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.toggle('active', item === opcion);
    });
    actualizarDashboard();
});

// Solicita al servidor el PDF del dashboard junto con imágenes de los gráficos.
document.getElementById('btn-exportar-pdf').addEventListener('click', async event => {
    const boton = event.currentTarget;
    const textoOriginal = boton.innerHTML;
    boton.disabled = true;
    boton.innerHTML = '<i class="bi bi-hourglass-split"></i> Generando PDF...';

    try {
        [chartFechas, chartEstados, chartPrioridad].forEach(chart => {
            if (chart) chart.update('none');
        });

        const graficos = {
            porFecha: document.getElementById('grafico-fechas').toDataURL('image/png'),
            porEstado: document.getElementById('grafico-estados').toDataURL('image/png'),
            porPrioridad: document.getElementById('grafico-prioridad').toDataURL('image/png'),
        };

        const respuesta = await fetch('http://localhost:3000/api/v1/reportes/dashboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ periodo: periodoFechaSeleccionado, graficos })
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo generar el PDF.');
        }

        const archivo = await respuesta.blob();
        const url = URL.createObjectURL(archivo);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = 'dashboard.pdf';
        enlace.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error(error);
        alert('No se pudo generar el PDF. Comprueba que el servidor esté activo.');
    } finally {
        boton.disabled = false;
        boton.innerHTML = textoOriginal;
    }
});

// Presenta el dashboard con el periodo predeterminado al cargar el módulo.
actualizarDashboard();







    










    









