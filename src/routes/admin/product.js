const express = require('express');
const router = express.Router();

const productController = require('../../app/controllers/admin/ProductController');
const authmiddleware = require('../../app/middlewares/authMiddlewares');

router.get('/trash', authmiddleware.requireAuth, productController.trash);
router.get('/:id/detail', authmiddleware.requireAuth, productController.detail);
router.get('/create', authmiddleware.requireAuth, productController.create);
router.post('/store', authmiddleware.requireAuth, productController.store);
router.get('/:id/edit', authmiddleware.requireAuth, productController.edit);
router.put('/:id', authmiddleware.requireAuth, productController.update);
router.patch('/:id/restore', authmiddleware.requireAuth, productController.restore);
router.delete('/:id', authmiddleware.requireAuth, productController.delete);
router.delete('/:id/force', authmiddleware.requireAuth, productController.forceDelete);
router.get('/:slug', authmiddleware.requireAuth, productController.index);
router.get('/', authmiddleware.requireAuth, productController.index);

module.exports = router;