const reportesService = require('../services/reportes.service');
const pdfService = require('../services/pdf.service');

const etiquetasPeriodo = {
  '7dias': 'Últimos 7 días',
  '30dias': 'Últimos 30 días',
  mes: 'Este mes',
  año: 'Este año',
};

exports.dashboardPdf = async (req, res, next) => {
  try {
    const { periodo = 'año', graficos } = req.body || {};
    const nombresGraficos = ['porFecha', 'porEstado', 'porPrioridad'];

    if (!graficos || nombresGraficos.some(nombre => typeof graficos[nombre] !== 'string'
      || !graficos[nombre].startsWith('data:image/png;base64,'))) {
      return res.status(400).json({ error: 'Faltan las capturas PNG de los gráficos.' });
    }

    const datos = await reportesService.obtenerDatosDashboard(periodo);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dashboard.pdf');

    pdfService.generarDashboard(res, {
      ...datos,
      periodo: etiquetasPeriodo[periodo] || periodo,
      graficos,
    });
  } catch (err) {
    next(err);
  }
};