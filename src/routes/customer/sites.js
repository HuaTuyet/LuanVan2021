const express = require('express')
const router = express.Router();

const sitesController = require('../../app/controllers/customer/SitesController')
const cartController = require('../../app/controllers/customer/CartController')
const orderController = require('../../app/controllers/customer/OrderController')
const authController = require('../../app/controllers/customer/AuthController');

router.post('/gio-hang/add', cartController.addCart)
router.get('/gio-hang/delete/:id', cartController.deleteCart)
router.get('/gio-hang/update/:id', cartController.updateCart)
router.post('/gio-hang/khuyen-mai', cartController.discount)
router.get('/gio-hang', cartController.viewCart)

router.post('/dat-hang', orderController.createOrder)
router.get('/don-mua', orderController.getMyOrder)
router.get('/don-mua/thong-tin-don-hang/:id', orderController.getMyOrderDetail)
router.post('/don-mua/huy-don/:id', orderController.destroyOrder)

router.get('/tim-kiem', sitesController.search)

router.get('/tai-khoan/dang-ky', authController.viewRegister);
router.post('/tai-khoan/store', authController.store);
router.post('/tai-khoan/login', authController.login);
router.get('/tai-khoan/logout', authController.logout);
router.get('/tai-khoan/me', authController.viewAccount);
router.get('/tai-khoan/me/cap-nhat', authController.viewUpdateAccount);
router.post('/tai-khoan/me/cap-nhat', authController.updateAccount);
router.get('/tai-khoan/:slug', authController.viewLogin);
router.get('/tai-khoan', authController.viewLogin);

router.get('/', sitesController.index)

module.exports = router;