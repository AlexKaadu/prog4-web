import { incidencias } from '../../../datos/incidencias-empleado-sistemas.js';
import  Chart  from 'chart.js/auto';

const total = incidencias.length
const pendientes = incidencias.filter(inc => inc.id_estado === 1).length;
const enProceso = incidencias.filter(inc => inc.id_estado === 2).length;
const resueltas = incidencias.filter(inc => inc.id_estado === 3).length;
const canceladas = incidencias.filter(inc => inc.id_estado === 4).length;

function actualizarTarjetas(incidencias){  // FUNCION PARA ACTUALIZAR LAS TARJEAS DEL DASHBOARD/DIRECTOR
const total = incidencias.length
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

actualizarTarjetas(incidencias);


const graficoEstados = document.getElementById('grafico-estados');

new Chart(graficoEstados, {
    type: 'doughnut',
    data: {
        labels: ['Pendientes', 'En proceso', 'Finalizadas', 'Canceladas'], // GRAFICO DE TORTA
        datasets: [{
            data: [pendientes, enProceso, resueltas, canceladas],
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
        maintainAspectRatio: false
    }
});


const incidenciasPorFecha = {};

incidencias.forEach(inc => {
    const fecha = inc.creado.split(' ')[0];     //SEPARA FECHA DE HORA POR UN ESPACIO ' ' Y TOMA LA FECHA [0]


    if(incidenciasPorFecha[fecha]){             // PREGUNTA SI YA EXISTE LA FECHA SI EXISTE AUMENTE ++ SI NO EXISTE LE AGREGA 1
        incidenciasPorFecha[fecha]++;
    } else {
        incidenciasPorFecha[fecha] = 1;
    }
});

const fechas = Object.keys(incidenciasPorFecha);

fechas.sort((fechaA, fechaB)=> {
    const [diaA, mesA, anioA] = fechaA.split('-');         // METODO PARA ORDENAR LAS FECHAS
    const [diaB, mesB, anioB] = fechaB.split('-');

    return new Date(anioA, mesA - 1, diaA) -
           new Date(anioB, mesB - 1, diaB);
});


const cantidades = fechas.map(fecha => incidenciasPorFecha[fecha]);
const graficoFechas = document.getElementById('grafico-fechas');

new Chart(graficoFechas, {       // GRAFICO DE LINEA
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
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    }
});








