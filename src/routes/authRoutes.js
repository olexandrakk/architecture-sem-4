const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateAuth } = require('../middlewares/validate'); // ДОДАНО ІМПОРТ

router.post('/register', validateAuth, authController.register);
router.post('/login', validateAuth, authController.login);

module.exports = router;