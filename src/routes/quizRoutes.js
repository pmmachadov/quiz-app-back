const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/questions', quizController.createQuestion);
router.get('/questions', quizController.getAllQuestions);
router.get('/questions/:id', quizController.getQuestionById);
router.get('/students/:student_id/questions', quizController.getQuestionsByStudentId);
router.put('/questions/:id', quizController.updateQuestion);
router.delete('/questions/:id', quizController.deleteQuestion);

module.exports = router;
