const express = require('express')
const router = express.Router();

const productsController = require('../../app/controllers/customer/ProductsController')
router.post('/binh-luan/:id', productsController.postComment)
router.post('/danh-gia', productsController.rating)
router.get('/thuong-hieu', productsController.showProductByBrand)
router.post('/thuong-hieu', productsController.sortByBrand)
router.get('/loai', productsController.showProductByType)
router.post('/loai', productsController.sortByType)
router.get('/:id', productsController.detail)
router.get('/', productsController.show)
router.post('/', productsController.sort)


module.exports = router;