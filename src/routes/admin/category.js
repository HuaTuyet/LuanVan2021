const express = require('express');
const router = express.Router();

const categoryController = require('../../app/controllers/admin/CategoryController');
const authmiddleware = require('../../app/middlewares/authMiddlewares');

router.get('/trash', authmiddleware.requireAuth, categoryController.trash);
router.get('/create', authmiddleware.requireAuth, categoryController.create);
router.post('/store', authmiddleware.requireAuth, categoryController.store);
router.get('/:id/edit', authmiddleware.requireAuth, categoryController.edit);
router.put('/:id', authmiddleware.requireAuth, categoryController.update);
router.patch('/:id/restore', authmiddleware.requireAuth, categoryController.restore);
router.delete('/:id', authmiddleware.requireAuth, categoryController.delete);
router.delete('/:id/force', authmiddleware.requireAuth, categoryController.forceDelete);
router.get('/:slug', authmiddleware.requireAuth, categoryController.index);
router.get('/', authmiddleware.requireAuth, categoryController.index);

module.exports = router;