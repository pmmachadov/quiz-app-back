const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.register);
router.get('/confirm/:token', userController.confirmEmail);
router.post('/login', userController.login);

module.exports = router;
