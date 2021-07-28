const express = require('express');
const router = express.Router();

const authController = require('../../app/controllers/admin/AuthController');

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/:slug', authController.index);
router.get('/', authController.index);

module.exports = router;