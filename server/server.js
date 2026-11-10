import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import fs from 'fs';
import reportesRoutes from './routes/reportes.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import articulosRoutes from './routes/articulos.routes.js';
import areasRoutes from './routes/areas.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import autenticacionRoutes from './routes/autenticacion.routes.js';
import incidenciasRoutes from './routes/incidencias.routes.js';


const app = express();

const archivoLogs = fs.createWriteStream(
  new URL('../accesos.log', import.meta.url),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: archivoLogs }));


const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de incidencias municipales',
      version: '1.0.0',
      description: 'Documentación de la API del sistema municipal de incidencias.',
    },
    servers: [
      { url: 'http://localhost:3000/api/v1' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./server/routes/*.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));









app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use('/api/v1/reportes', reportesRoutes);
app.use('/api/v1/categorias', categoriasRoutes);
app.use('/api/v1/articulos', articulosRoutes);
app.use('/api/v1/areas', areasRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/autenticacion', autenticacionRoutes);
app.use('/api/v1/incidencias', incidenciasRoutes);


app.listen(3000, () => console.log('API en http://localhost:3000'));