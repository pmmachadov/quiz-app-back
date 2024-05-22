const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/students', userController.getAllStudents);

module.exports = router;
