const express = require('express')
const router = express.Router();

const sitesController = require('../../app/controllers/customer/SitesController')
const cartController = require('../../app/controllers/customer/CartController')
const orderController = require('../../app/controllers/customer/OrderController')
const authController = require('../../app/controllers/customer/AuthController');
const authMiddleware = require('../../app/middlewares/authMiddlewares')


router.post('/gio-hang/add', cartController.addCart)
router.get('/gio-hang/delete/:id', cartController.deleteCart)
router.get('/gio-hang/update/:id', cartController.updateCart)
router.post('/gio-hang/khuyen-mai', cartController.discount)
router.get('/gio-hang', cartController.viewCart)

router.get('/thanh-toan', authMiddleware.requireAuthCustomer, orderController.viewPay)
router.post('/dat-hang', authMiddleware.requireAuthCustomer, orderController.createOrder)
router.get('/don-mua', authMiddleware.requireAuthCustomer, orderController.getMyOrder)
router.get('/don-mua/thong-tin-don-hang/:id', authMiddleware.requireAuthCustomer, orderController.getMyOrderDetail)
router.post('/don-mua/huy-don/:id', authMiddleware.requireAuthCustomer, orderController.destroyOrder)

router.get('/tim-kiem', sitesController.search)

router.get('/tai-khoan/dang-ky', authController.viewRegister);
router.post('/tai-khoan/store', authController.store);
router.post('/tai-khoan/login', authController.login);
router.get('/tai-khoan/logout', authController.logout);

router.get('/tai-khoan/me', authMiddleware.requireAuthCustomer, authController.viewAccount);
router.get('/tai-khoan/me/cap-nhat', authMiddleware.requireAuthCustomer, authController.viewUpdateAccount);
router.post('/tai-khoan/me/cap-nhat', authMiddleware.requireAuthCustomer, authController.updateAccount);
router.get('/tai-khoan/me/doi-mat-khau', authMiddleware.requireAuthCustomer, authController.viewChangePw);
router.post('/tai-khoan/me/doi-mat-khau', authMiddleware.requireAuthCustomer, authController.changePw);

router.get('/tai-khoan/:slug', authController.viewLogin);
router.get('/tai-khoan', authController.viewLogin);

router.get('/', sitesController.index)

module.exports = router;