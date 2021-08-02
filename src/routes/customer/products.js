const express = require('express')
const router = express.Router();

const productsController = require('../../app/controllers/customer/ProductsController')
const authMiddleware = require('../../app/middlewares/authMiddlewares')

router.post('/binh-luan/:id', productsController.postComment)
router.post('/danh-gia', authMiddleware.requireAuthCustomer, productsController.rating)
router.get('/thuong-hieu', productsController.showProductByBrand)
router.post('/thuong-hieu', productsController.sortByBrand)
router.get('/loai', productsController.showProductByType)
router.post('/loai', productsController.sortByType)
router.get('/gia', productsController.showProductByPrice)
router.post('/gia', productsController.sortByPrice)
router.get('/:id', productsController.detail)
router.get('/', productsController.show)
router.post('/', productsController.sort)


module.exports = router;