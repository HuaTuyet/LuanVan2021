const express = require('express');
const router = express.Router();

const ReportSalesController = require('../../app/controllers/admin/ReportSalesController');
const authmiddleware = require('../../app/middlewares/authMiddlewares');

router.post('/calculate', authmiddleware.requireAuth, ReportSalesController.calculate);
router.get('/:slug', authmiddleware.requireAuth, ReportSalesController.index);
router.get('/', authmiddleware.requireAuth, ReportSalesController.index);

module.exports = router;