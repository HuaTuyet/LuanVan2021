const express = require('express');
const router = express.Router();

const couponController = require('../../app/controllers/admin/CouponController');
const authmiddleware = require('../../app/middlewares/authMiddlewares');

router.get('/trash', authmiddleware.requireAuth, couponController.trash);
router.get('/create', authmiddleware.requireAuth, couponController.create);
router.post('/store', authmiddleware.requireAuth, couponController.store);
router.get('/:id/edit', authmiddleware.requireAuth, couponController.edit);
router.put('/:id', authmiddleware.requireAuth, couponController.update);
router.patch('/:id/restore', authmiddleware.requireAuth, couponController.restore);
router.delete('/:id', authmiddleware.requireAuth, couponController.delete);
router.delete('/:id/force', authmiddleware.requireAuth, couponController.forceDelete);
router.get('/:slug', authmiddleware.requireAuth, couponController.index);
router.get('/', authmiddleware.requireAuth, couponController.index);

module.exports = router;