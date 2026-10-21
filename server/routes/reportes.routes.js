import express from 'express';
import { dashboardPdf } from '../controllers/reportes.controller.js';

const router = express.Router();

router.post('/dashboard', dashboardPdf);

export default router;