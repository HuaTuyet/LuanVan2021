const express = require('express');
const router = express.Router();

const GoodsImportSlipController = require('../../app/controllers/admin/GoodsImportSlipController');
const authmiddleware = require('../../app/middlewares/authMiddlewares');

router.get('/create', authmiddleware.requireAuth, GoodsImportSlipController.create);
router.put('/update', authmiddleware.requireAuth, GoodsImportSlipController.update);
router.post('/store', authmiddleware.requireAuth, GoodsImportSlipController.store);
router.get('/add/:id', authmiddleware.requireAuth, GoodsImportSlipController.add);
router.get('/remove/:id', authmiddleware.requireAuth, GoodsImportSlipController.remove);
router.get('/:id/edit', authmiddleware.requireAuth, GoodsImportSlipController.edit);
router.put('/:id', authmiddleware.requireAuth, GoodsImportSlipController.updateSlip);
router.get('/:id/detail', authmiddleware.requireAuth, GoodsImportSlipController.detail);
router.get('/:slug', authmiddleware.requireAuth, GoodsImportSlipController.index);
router.get('/', authmiddleware.requireAuth, GoodsImportSlipController.index);

module.exports = router;