const express = require('express');
const router = express.Router();
const topicQuestionsController = require('../controllers/topicQuestionsController');

router.get('/', topicQuestionsController.getAllQuestions);
router.get('/:id', topicQuestionsController.getQuestionById);

module.exports = router;
