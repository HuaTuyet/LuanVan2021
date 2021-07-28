const express = require('express');
const router = express.Router();

const siteController = require('../../app/controllers/admin/SiteController');
const authmiddleware = require('../../app/middlewares/authMiddlewares');

router.get('/:slug', authmiddleware.requireAuth, siteController.show);
router.get('/', authmiddleware.requireAuth, siteController.index);

module.exports = router;