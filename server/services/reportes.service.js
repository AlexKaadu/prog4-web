// "31-05-2026 10:15" -> "2026-05-31" (para poder ordenar y comparar)
function aIso(creado) {
  const f = String(creado).slice(0, 10); // "31-05-2026"
  return `${f.slice(6, 10)}-${f.slice(3, 5)}-${f.slice(0, 2)}`;
}

// Dice si una incidencia entra en el período elegido en el dashboard
function dentroDelPeriodo(creado, periodo) {
  const [anio, mes, dia] = aIso(creado).split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  const hoy = new Date();

  if (periodo === '7dias' || periodo === '30dias') {
    const limite = new Date(hoy);
    limite.setDate(limite.getDate() - (periodo === '7dias' ? 7 : 30));
    return fecha >= limite;
  }

  if (periodo === 'mes') {
    return fecha.getMonth() === hoy.getMonth()
      && fecha.getFullYear() === hoy.getFullYear();
  }

  if (periodo === 'año' || periodo === 'Este año') {
    return fecha.getFullYear() === hoy.getFullYear();
  }

  return true;
}

const PRIORIDADES = { 3: 'Alta', 2: 'Media', 1: 'Baja' };

async function obtenerDatosDashboard(periodo) {
  
  const { incidencias } = await import('../../datos/incidencias-empleado-sistemas.js');

  const lista = incidencias.filter(i => dentroDelPeriodo(i.creado, periodo));

  // Tarjetas: totales por estado (1 Pendiente, 2 En proceso, 3 Resuelta, 4 Cancelada)
  const cuenta = idEstado => lista.filter(i => i.id_estado === idEstado).length;
  const totales = {
    total: lista.length,
    pendiente: cuenta(1),
    enProceso: cuenta(2),
    finalizada: cuenta(3),
    cancelada: cuenta(4),
  };

  // Incidencias por fecha (ordenadas, etiqueta dd-mm)
  const dias = {};
  lista.forEach(i => {
    const d = aIso(i.creado);
    dias[d] = (dias[d] || 0) + 1;
  });
  const porFecha = Object.keys(dias).sort().map(d => ({
    fecha: `${d.slice(8, 10)}-${d.slice(5, 7)}`,
    total: dias[d],
  }));

  // Por prioridad (Alta, Media, Baja)
  const porPrioridad = [3, 2, 1].map(p => ({
    nombre: PRIORIDADES[p],
    total: lista.filter(i => i.prioridad === p).length,
  }));

  // Por categoría (de mayor a menor, máximo 6 para que entren en la hoja)
  const cats = {};
  lista.forEach(i => {
    cats[i.categoria] = (cats[i.categoria] || 0) + 1;
  });
  const categorias = Object.entries(cats)
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return { totales, porFecha, porPrioridad, categorias };
}

module.exports = { obtenerDatosDashboard };