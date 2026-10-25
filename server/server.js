import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import reportesRoutes from './routes/reportes.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import articulosRoutes from './routes/articulos.routes.js';
import areasRoutes from './routes/areas.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import autenticacionRoutes from './routes/autenticacion.routes.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use('/api/v1/reportes', reportesRoutes);
app.use('/api/v1/categorias', categoriasRoutes);
app.use('/api/v1/articulos', articulosRoutes);
app.use('/api/v1/areas', areasRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/autenticacion', autenticacionRoutes);

app.listen(3000, () => console.log('API en http://localhost:3000'));