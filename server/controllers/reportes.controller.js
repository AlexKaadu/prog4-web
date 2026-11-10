import { obtenerDatosDashboard } from '../services/reportes.service.js';
import { generarDashboard } from '../services/pdf.service.js';

const etiquetasPeriodo = {
  '7dias': 'Últimos 7 días',
  '30dias': 'Últimos 30 días',
  mes: 'Este mes',
  año: 'Este año',
};

const dashboardPdf = async (req, res, next) => {
  try {
    const { periodo = 'año', graficos } = req.body || {};
    const nombresGraficos = ['porFecha', 'porEstado', 'porPrioridad'];

    if (!graficos || nombresGraficos.some(nombre => typeof graficos[nombre] !== 'string'
      || !graficos[nombre].startsWith('data:image/png;base64,'))) {
      return res.status(400).json({ error: 'Faltan las capturas PNG de los gráficos.' });
    }

    const datos = await obtenerDatosDashboard(periodo);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dashboard.pdf');

    generarDashboard(res, {
      ...datos,
      periodo: etiquetasPeriodo[periodo] || periodo,
      graficos,
    });
  } catch (err) {
    next(err);
  }
};

const dashboardDatos = async (req, res, next) => {
  try {
    const periodo = req.query.periodo || '30dias';
    const periodosValidos = ['7dias', '30dias', 'mes', 'año'];

    if (!periodosValidos.includes(periodo)) {
      return res.status(400).json({ error: 'Período no válido.' });
    }

    const datos = await obtenerDatosDashboard(periodo);

    res.set('Cache-Control', 'no-store');
    return res.status(200).json({
      periodo: etiquetasPeriodo[periodo],
      ...datos,
    });
  } catch (err) {
    next(err);
  }
};

export { dashboardPdf, dashboardDatos };