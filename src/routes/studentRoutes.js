const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/registerOrLogin', studentController.registerOrLogin);

module.exports = router;