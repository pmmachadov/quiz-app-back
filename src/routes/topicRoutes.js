const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/topics', questionController.getTopics);
router.get('/topics/:topicId/questions', questionController.getQuestionsByTopic);

module.exports = router;
