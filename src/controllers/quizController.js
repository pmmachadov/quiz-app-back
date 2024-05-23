const {
    getAllQuestions,
    getQuestionById,
    getQuestionsByStudentId,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require('../models/question');

exports.createQuestion = (req, res) => {
    const newQuestion = createQuestion(req.body);
    res.status(201).json(newQuestion);
};

exports.getAllQuestions = (req, res) => {
    const questions = getAllQuestions();
    res.status(200).json(questions);
};

exports.getQuestionById = (req, res) => {
    const question = getQuestionById(req.params.id);
    if (question) {
        res.status(200).json(question);
    } else {
        res.status(404).json({ error: 'Question not found' });
    }
};

exports.getQuestionsByStudentId = (req, res) => {
    const questions = getQuestionsByStudentId(req.params.student_id);
    res.status(200).json(questions);
};

exports.updateQuestion = (req, res) => {
    const updatedQuestion = updateQuestion(req.params.id, req.body);
    if (updatedQuestion) {
        res.status(200).json(updatedQuestion);
    } else {
        res.status(404).json({ error: 'Question not found' });
    }
};

exports.deleteQuestion = (req, res) => {
    const deletedQuestion = deleteQuestion(req.params.id);
    if (deletedQuestion) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Question not found' });
    }
};
