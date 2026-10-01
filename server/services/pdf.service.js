const PDFDocument = require('pdfkit');

// ---------- Piezas reutilizables ----------

function panel(doc, x, y, w, h, titulo) {
  doc.roundedRect(x, y, w, h, 6).lineWidth(0.5).stroke('#d9d9d9');
  doc.fillColor('#222').font('Helvetica-Bold').fontSize(10)
    .text(titulo, x + 12, y + 10, { lineBreak: false });
  doc.font('Helvetica');
}

function tarjetas(doc, totales, x, y, ancho) {
  const items = [
    ['Total de incidencias', totales.total, '#f5d5b8'],
    ['Pendiente', totales.pendiente, '#f2c4cc'],
    ['En proceso', totales.enProceso, '#c2ddf0'],
    ['Finalizada', totales.finalizada, '#bfe6cb'],
    ['Cancelada', totales.cancelada, '#d3d3d3'],
  ];
  const gap = 10;
  const w = (ancho - gap * 4) / 5;

  items.forEach(([label, valor, color], i) => {
    const cx = x + i * (w + gap);
    doc.roundedRect(cx, y, w, 55, 6).fill(color);
    doc.fillColor('#222').font('Helvetica-Bold').fontSize(20)
      .text(String(valor), cx, y + 8, { width: w, align: 'center', lineBreak: false });
    doc.font('Helvetica').fontSize(9)
      .text(label, cx, y + 35, { width: w, align: 'center', lineBreak: false });
  });
}

function insertarGrafico(doc, captura, x, y, w, h) {
  const imagen = Buffer.from(captura.slice('data:image/png;base64,'.length), 'base64');
  doc.image(imagen, x, y, { fit: [w, h], align: 'center', valign: 'center' });
}

function barrasCategorias(doc, categorias, x, y, w, base) {
  const denominador = base || 1;
  categorias.forEach((c, i) => {
    const cy = y + i * 28;
    doc.fillColor('#222').font('Helvetica').fontSize(9)
      .text(c.nombre, x, cy, { lineBreak: false });
    doc.text(String(c.total), x, cy, { width: w, align: 'right', lineBreak: false });
    doc.roundedRect(x, cy + 13, w, 6, 3).fill('#e9ecef');
    doc.roundedRect(x, cy + 13, Math.max(w * (c.total / denominador), 6), 6, 3).fill('#0d6efd');
  });
}

// ---------- Documento completo ----------

function generarDashboard(res, datos) {
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 30 });
  doc.pipe(res);

  const M = 30;
  const ancho = doc.page.width - M * 2;
  const { totales } = datos;

  // Encabezado
  doc.rect(0, 0, doc.page.width, 60).fill('#1f3a5f');
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(20)
    .text('Dashboard de incidencias', M, 14, { lineBreak: false });
  doc.font('Helvetica').fontSize(10)
    .text('Área de Sistemas - Resumen general del estado de las incidencias', M, 38, { lineBreak: false });
  doc.text(`Período: ${datos.periodo}  |  ${new Date().toLocaleDateString('es-AR')}`,
    M, 38, { width: ancho, align: 'right', lineBreak: false });

  // Tarjetas
  tarjetas(doc, totales, M, 75, ancho);

  // Fila 2: por fecha + por estado
  panel(doc, M, 145, 480, 190, 'Incidencias por fecha');
  insertarGrafico(doc, datos.graficos.porFecha, M + 12, 172, 456, 150);

  const xEstado = M + 490;
  panel(doc, xEstado, 145, ancho - 490, 190, 'Incidencias por estado');
  insertarGrafico(doc, datos.graficos.porEstado, xEstado + 12, 172, ancho - 514, 150);

  // Fila 3: por prioridad + por categoría
  panel(doc, M, 345, 380, 205, 'Incidencias por prioridad');
  insertarGrafico(doc, datos.graficos.porPrioridad, M + 12, 372, 356, 165);

  panel(doc, M + 390, 345, ancho - 390, 205, 'Incidencias por categoría');
  barrasCategorias(doc, datos.categorias, M + 402, 378, ancho - 390 - 24, totales.total);

  doc.end();
}

module.exports = { generarDashboard };