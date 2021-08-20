const express = require('express');
const router = express.Router();

const orderController = require('../../app/controllers/admin/OrderController');
const authmiddleware = require('../../app/middlewares/authMiddlewares');

router.patch('/:id/changestatus', authmiddleware.requireAuth, orderController.changestatus);
router.get('/:id/detail', authmiddleware.requireAuth, orderController.detail);
// router.get('/:id/receipt', authmiddleware.requireAuth, orderController.receipt);
router.get('/:slug', authmiddleware.requireAuth, orderController.index);
router.get('/', authmiddleware.requireAuth, orderController.index);
router.post('/', authmiddleware.requireAuth, orderController.sort);

module.exports = router;