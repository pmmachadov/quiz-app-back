const express = require('express');
const router = express.Router();
const topicQuestionsController = require('../controllers/topicQuestionsController');

const verifyTeacherRole = (req, res, next) => {
    next();
};

router.get('/', verifyTeacherRole, topicQuestionsController.getTopicQuestions);
router.get('/:id', verifyTeacherRole, topicQuestionsController.getQuestionById);

module.exports = router;
