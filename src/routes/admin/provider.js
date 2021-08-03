const express = require('express');
const router = express.Router();

const providerController = require('../../app/controllers/admin/ProviderController');
const authmiddleware = require('../../app/middlewares/authMiddlewares');

router.get('/trash', authmiddleware.requireAuth, providerController.trash);
router.get('/create', authmiddleware.requireAuth, providerController.create);
router.post('/store', authmiddleware.requireAuth, providerController.store);
router.get('/:id/edit', authmiddleware.requireAuth, providerController.edit);
router.put('/:id', authmiddleware.requireAuth, providerController.update);
router.patch('/:id/restore', authmiddleware.requireAuth, providerController.restore);
router.delete('/:id', authmiddleware.requireAuth, providerController.delete);
router.delete('/:id/force', authmiddleware.requireAuth, providerController.forceDelete);
router.get('/:slug', authmiddleware.requireAuth, providerController.index);
router.get('/', authmiddleware.requireAuth, providerController.index);

module.exports = router;