const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/studentRegisterOrLogin', studentController.studentRegisterOrLogin);
router.post('/login', studentController.studentRegisterOrLogin);

module.exports = router;
