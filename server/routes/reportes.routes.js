const router = require('express').Router();
const ctrl = require('../controllers/reportes.controller');

router.post('/dashboard', ctrl.dashboardPdf);

module.exports = router;