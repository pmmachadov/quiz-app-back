const express = require('express');
const router = express.Router();
const qnaController = require('../controllers/qnaController');

router.get('/', qnaController.getAllAnswers);
router.get('/question/:questionId', qnaController.getAnswersByQuestionId);

module.exports = router;
