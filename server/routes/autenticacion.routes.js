import express from 'express';
import ctrl from '../controllers/autenticacion.controller.js';



const router = express.Router();

router.post('/login', ctrl.login);

export default router;
