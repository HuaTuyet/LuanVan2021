const express = require('express');
const router = express.Router();

const brandController = require('../../app/controllers/admin/BrandController');
const authmiddleware = require('../../app/middlewares/authMiddlewares');

router.get('/trash', authmiddleware.requireAuth, brandController.trash);
router.get('/create', authmiddleware.requireAuth, brandController.create);
router.post('/store', authmiddleware.requireAuth, brandController.store);
router.get('/:id/edit', authmiddleware.requireAuth, brandController.edit);
router.put('/:id', authmiddleware.requireAuth, brandController.update);
router.patch('/:id/restore', authmiddleware.requireAuth, brandController.restore);
router.delete('/:id', authmiddleware.requireAuth, brandController.delete);
router.delete('/:id/force', authmiddleware.requireAuth, brandController.forceDelete);
router.get('/:slug', authmiddleware.requireAuth, brandController.index);
router.get('/', authmiddleware.requireAuth, brandController.index);

module.exports = router;